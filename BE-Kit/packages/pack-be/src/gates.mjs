/**
 * Gate của BE: luật chặn lúc vào mode (state machine) và gate workflow/PR.
 * Mỗi gate có reason code ổn định để ghi run-log và để test.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  createStateMachine,
  computeScopeDiff,
  parsePlannedFiles,
  listChangedFiles,
  detectBaseRef,
  onBaseWarning,
  LOCKFILE_IGNORE,
} from '@backend-delivery-kit/engine';
import manifest from './manifest.gen.mjs';
import {
  COMMAND_TO_MODE,
  parseWorkflowStatus,
  countOpenBlockingQuestions,
  countOpenIssues,
  commandEvidence,
  migrationPlanRows,
} from './schema.mjs';

const m = manifest;
const P = m.prompt_prefix;
const OK_GATE = ['passed', 'waived', 'not_required'];
const POST_PLAN_MODES = ['implementation-mode', 'bugfix-mode', 'review-mode', 'testing-mode', 'pr-ready-mode', 'quick-mode'];
/** Mode đối chiếu scope với git khi kết thúc. */
export const SCOPE_CHECKED_MODES = ['review-mode', 'testing-mode', 'pr-ready-mode'];

const lower = (v) => String(v ?? '').trim().toLowerCase();
const isTrue = (v) => v === true || lower(v) === 'true';

// --- Luật chặn lúc vào mode ---------------------------------------------------

function beEntryRules({ command, data, taskRef, alwaysAllowed, openBlockingQuestions = 0, openIssues = { critical: 0, high: 0 } }) {
  const rules = [];
  const blocking = Math.max(Number(data.blocking_questions_open || 0), Number(openBlockingQuestions || 0));
  if ((blocking > 0 || isTrue(data.input_sync_required)) && !alwaysAllowed.includes(command)) {
    rules.push({
      code: blocking > 0 ? 'ENTRY_QUESTIONS_BLOCKING' : 'ENTRY_INPUT_SYNC_REQUIRED',
      reason:
        blocking > 0
          ? `Còn ${blocking} câu hỏi blocking đang mở trong planning/questions.md.`
          : 'workflow-status.md đang yêu cầu input-sync (input_sync_required: true).',
      redirect: `${P} input-sync ${taskRef} <answer-or-cr>`,
    });
  }
  if (command === 'quick') {
    if (lower(data.risk_level) === 'high') {
      rules.push({ code: 'ENTRY_QUICK_HIGH_RISK', reason: 'risk_level=high: task rủi ro cao phải qua plan và review độc lập.', redirect: `${P} plan ${taskRef}` });
    }
    if (isTrue(data.db_change_required)) {
      rules.push({ code: 'ENTRY_QUICK_DB_CHANGE', reason: 'Task đổi schema/dữ liệu DB phải có plan migration và rollback, không chạy quick.', redirect: `${P} plan ${taskRef}` });
    }
    if (lower(data.api_change_type) === 'breaking') {
      rules.push({ code: 'ENTRY_QUICK_API_BREAKING', reason: 'Task có breaking API change phải qua plan tương thích, không chạy quick.', redirect: `${P} plan ${taskRef}` });
    }
  }
  if (command === 'cook') {
    if (!isTrue(data.build_ready)) {
      rules.push({ code: 'ENTRY_NOT_BUILD_READY', reason: 'build_ready chưa true: plan chưa sẵn sàng để cook.', redirect: `${P} plan ${taskRef}` });
    }
    if (lower(data.api_change_type) === 'breaking' && !OK_GATE.includes(lower(data.api_compat_status))) {
      rules.push({
        code: 'ENTRY_API_BREAKING_NOT_APPROVED',
        reason: `Breaking API change nhưng api_compat_status="${lower(data.api_compat_status) || '(trống)'}": cần kế hoạch tương thích được duyệt.`,
        redirect: `${P} plan ${taskRef}`,
      });
    }
  }
  if (command === 'pr') {
    const critical = Math.max(Number(data.critical_issues_open || 0), openIssues.critical);
    const high = Math.max(Number(data.high_issues_open || 0), openIssues.high);
    if (critical > 0 || high > 0 || isTrue(data.bugfix_required)) {
      rules.push({ code: 'ENTRY_OPEN_BUGS', reason: 'Còn bug Critical/High hoặc bugfix_required=true.', redirect: `${P} bugfix ${taskRef}` });
    }
    if (!['passed', 'not_required'].includes(lower(data.review_status))) {
      rules.push({ code: 'ENTRY_REVIEW_NOT_PASSED', reason: `review_status="${lower(data.review_status) || '(trống)'}": cần review passed trước PR.`, redirect: `${P} review ${taskRef}` });
    }
    if (isTrue(data.db_change_required) && !(OK_GATE.includes(lower(data.migration_status)) && OK_GATE.includes(lower(data.rollback_plan_status)))) {
      rules.push({ code: 'ENTRY_MIGRATION_NOT_VERIFIED', reason: 'Task đổi DB nhưng migration/rollback chưa được kiểm (migration_status, rollback_plan_status).', redirect: `${P} test ${taskRef}` });
    }
  }
  return rules;
}

export const machine = createStateMachine({
  commandToMode: COMMAND_TO_MODE,
  allowedNext: Object.fromEntries(Object.entries(m.modes).map(([cmd, mode]) => [cmd, mode.next])),
  aliases: m.aliases,
  terminalNext: m.terminal_next,
  alwaysAllowed: m.always_allowed,
  pluginName: m.plugin,
  promptPrefix: m.prompt_prefix,
  statusFileName: path.posix.basename(m.status_file),
  entryRules: beEntryRules,
});

// --- Gate workflow --------------------------------------------------------------

function taskReader(taskDir) {
  return (rel) => {
    const p = path.join(taskDir, rel);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  };
}

/**
 * Gate trên một snapshot của task.
 * @param {{ data: object, read: (rel: string) => string, exists: (rel: string) => boolean, scope?: object, forPr?: boolean }} p
 */
export function evaluateWorkflowGates({ data, read, exists, scope, forPr = false }) {
  const issues = [];
  const warnings = [];
  const fail = (code, message) => issues.push({ code, message });
  const mode = String(data.current_mode || '');
  const afterPlan = isTrue(data.build_ready) || POST_PLAN_MODES.includes(mode);

  for (const rel of m.task_files.required_docs) {
    if (!exists(rel)) fail('TASK_FILE_MISSING', `Thiếu file bắt buộc của task: ${rel}`);
  }

  const counted = countOpenBlockingQuestions(read('planning/questions.md'));
  const declared = Number(data.blocking_questions_open || 0);
  if (counted !== declared) {
    fail('BLOCKING_COUNT_MISMATCH', `blocking_questions_open=${declared} nhưng planning/questions.md còn ${counted} câu hỏi blocking Open.`);
  }
  const blocking = Math.max(counted, declared);
  if (isTrue(data.build_ready) && blocking > 0) {
    fail('BUILD_READY_WITH_BLOCKING_QUESTIONS', `build_ready: true trong khi còn ${blocking} câu hỏi blocking: phải ${P} input-sync trước.`);
  }

  if (afterPlan) {
    if (mode !== 'quick-mode' && lower(data.plan_input_ledger_status) !== 'completed') {
      fail('PLAN_INPUT_LEDGER_INCOMPLETE', 'plan_input_ledger_status chưa completed: điền Input ledger trước khi cook.');
    }
    if (!['none', 'additive', 'breaking'].includes(lower(data.api_change_type))) {
      fail('PLAN_API_DECISION_MISSING', 'api_change_type chưa quyết định (none | additive | breaking).');
    }
    if (data.db_change_required !== true && data.db_change_required !== false) {
      fail('PLAN_DB_DECISION_MISSING', 'db_change_required chưa quyết định (true | false).');
    }
    if (isTrue(data.db_change_required) && migrationPlanRows(read('planning/implementation-plan.md')).length === 0) {
      fail('PLAN_MIGRATION_SECTION_MISSING', 'db_change_required: true nhưng mục "Migration và rollback" của plan chưa có migration kèm cách rollback.');
    }
    if (lower(data.api_change_type) === 'breaking' && !OK_GATE.includes(lower(data.api_compat_status))) {
      fail('API_BREAKING_NOT_APPROVED', 'Breaking API change nhưng api_compat_status chưa passed/waived.');
    }
  }

  if (mode === 'quick-mode') {
    if (isTrue(data.db_change_required)) fail('QUICK_DB_CHANGE', 'Quick không được đổi DB: chuyển sang BE plan.');
    if (lower(data.api_change_type) === 'breaking') fail('QUICK_API_BREAKING', 'Quick không được có breaking API change: chuyển sang BE plan.');
  }

  const verifyingModes = ['review-mode', 'testing-mode', 'pr-ready-mode'];
  if ((forPr || verifyingModes.includes(mode)) && isTrue(data.db_change_required)) {
    const migrationOk = OK_GATE.includes(lower(data.migration_status)) && OK_GATE.includes(lower(data.rollback_plan_status));
    if (!migrationOk && (forPr || mode === 'pr-ready-mode' || mode === 'testing-mode')) {
      fail('MIGRATION_NOT_VERIFIED', 'Task đổi DB: migration_status và rollback_plan_status phải passed/waived (chạy migration up/down trên DB test).');
    }
  }

  const evidence = commandEvidence(read('output/test-summary.md'));
  if (forPr || ['testing-mode', 'pr-ready-mode', 'quick-mode'].includes(mode)) {
    if (evidence.length === 0) {
      fail('TEST_EVIDENCE_MISSING', 'output/test-summary.md chưa có dòng Command evidence log nào đã chạy thật (Đã chạy thật? = Có, Kết quả = Passed/Failed).');
    }
    if (lower(data.test_status) === 'passed' && evidence.some((e) => e.result === 'failed') && !evidence.some((e) => e.result === 'passed')) {
      fail('TEST_STATUS_CONTRADICTS_EVIDENCE', 'test_status: passed nhưng mọi lệnh trong Command evidence log đều Failed.');
    }
  }

  const bugs = countOpenIssues(read('tracking/review-bugs.md'));
  if (bugs.critical > Number(data.critical_issues_open || 0) || bugs.high > Number(data.high_issues_open || 0)) {
    fail('ISSUE_COUNT_MISMATCH', `tracking/review-bugs.md còn ${bugs.critical} Critical, ${bugs.high} High đang mở; critical_issues_open/high_issues_open phải khớp.`);
  }

  if (forPr || mode === 'pr-ready-mode') {
    if (!['passed', 'not_required'].includes(lower(data.review_status))) fail('PR_REVIEW_NOT_PASSED', 'review_status phải passed trước PR.');
    if (lower(data.test_status) !== 'passed') fail('PR_TEST_NOT_PASSED', 'test_status phải passed trước PR.');
    if (Math.max(bugs.critical, Number(data.critical_issues_open || 0)) > 0 || Math.max(bugs.high, Number(data.high_issues_open || 0)) > 0) {
      fail('PR_OPEN_BUGS', 'Còn bug Critical/High đang mở.');
    }
    if (forPr && !exists('output/pr-summary.md')) fail('PR_SUMMARY_MISSING', 'Thiếu output/pr-summary.md.');
  }

  if (scope && !scope.plannedEmpty && scope.outOfPlan?.length) {
    fail('SCOPE_OUT_OF_PLAN', `File sửa ngoài bảng "File sẽ tạo / cập nhật" của plan: ${scope.outOfPlan.join(', ')}`);
  }

  const next = machine.checkRecordedNextMode({ currentMode: mode, nextMode: data.next_mode });
  warnings.push(...next.warnings);
  return { ok: issues.length === 0, issues, errors: issues.map((i) => i.message), warnings };
}

/**
 * Gate chỉ áp dụng lúc KẾT THÚC một mode (không phải snapshot): truyền vào
 * `evaluateModeCompletion` qua `extraIssues`. Không đặt trong validateWorkflow vì
 * task vừa tạo (chưa plan) vẫn phải hợp lệ khi một mode khác bị gate từ chối.
 */
export function modeEndIssues(taskDir, command) {
  const t = loadTask(taskDir);
  if (!t.ok) return [];
  const { data } = t;
  const read = taskReader(taskDir);
  const issues = [];
  if (command === 'plan' || command === 'input-sync') {
    const blocking = Math.max(countOpenBlockingQuestions(read('planning/questions.md')), Number(data.blocking_questions_open || 0));
    const waiting = blocking > 0 || isTrue(data.input_sync_required);
    if (!isTrue(data.build_ready) && !waiting) {
      issues.push({
        code: 'PLAN_NOT_CONCLUDED',
        message: `${P} ${command} chưa kết luận: hoặc đặt build_ready: true (kèm api_change_type, db_change_required, Input ledger completed), hoặc ghi câu hỏi blocking vào planning/questions.md và đặt input_sync_required: true.`,
      });
    }
  }
  return issues;
}

function loadTask(taskDir) {
  const statusPath = path.join(taskDir, m.status_file);
  if (!fs.existsSync(statusPath)) {
    const issue = { code: 'STATUS_MISSING', message: `Thiếu ${m.status_file}` };
    return { ok: false, issues: [issue], errors: [issue.message] };
  }
  const parsed = parseWorkflowStatus(fs.readFileSync(statusPath, 'utf8'));
  if (!parsed.ok) {
    const issues = parsed.errors.map((message) => ({ code: 'STATUS_SCHEMA_INVALID', message }));
    return { ok: false, issues, errors: parsed.errors };
  }
  return { ok: true, data: parsed.data };
}

const io = (taskDir) => ({ read: taskReader(taskDir), exists: (rel) => fs.existsSync(path.join(taskDir, rel)) });

/** Scope diff của task: file đã đổi (git) so với bảng file trong plan. `null` nếu không tính được. */
export function scopeDiffForTask(taskDir, { repoRoot, base = '', changedFiles } = {}) {
  let files = changedFiles;
  let onBase = false;
  if (!files) {
    const changed = listChangedFiles({ cwd: repoRoot, base });
    if (!changed.ok) return null;
    files = changed.files;
    onBase = changed.onBase;
  }
  const plan = taskReader(taskDir)('planning/implementation-plan.md');
  const plannedFiles = parsePlannedFiles(plan, { heading: m.planned_files_heading });
  return { ...computeScopeDiff({ plannedFiles, changedFiles: files, ignore: [...m.scope_ignore, ...LOCKFILE_IGNORE] }), plannedFiles, onBase };
}

/** Gate workflow trên snapshot hiện tại; `scope` do caller tính (nếu có). */
export function validateWorkflow(taskDir, { scope } = {}) {
  const t = loadTask(taskDir);
  if (!t.ok) return { ok: false, issues: t.issues, errors: t.errors, warnings: [] };
  return evaluateWorkflowGates({ data: t.data, ...io(taskDir), scope });
}

function scopeAt(taskDir, { repoRoot, base }) {
  const usedBase = base || detectBaseRef(repoRoot);
  const diff = scopeDiffForTask(taskDir, { repoRoot, base: usedBase });
  const warnings = [];
  let scope;
  let scopeSource = 'self_reported';
  if (!diff) warnings.push(m.mcp.scope_unavailable);
  else if (diff.plannedEmpty) warnings.push(m.mcp.planned_files_missing);
  else {
    scope = diff;
    scopeSource = 'git';
  }
  if (diff?.onBase) warnings.push(onBaseWarning(usedBase));
  return { scope, scopeSource, base: usedBase, warnings };
}

/** Gate ở điểm chuyển mode: mode review/test/pr tự đối chiếu scope với git. */
export function validateWorkflowAtGate(taskDir, { repoRoot, base } = {}) {
  const t = loadTask(taskDir);
  if (!t.ok) return { ok: false, issues: t.issues, errors: t.errors, warnings: [], scopeSource: 'not_checked', base: '' };
  let s = { scope: undefined, scopeSource: 'not_checked', base: '', warnings: [] };
  if (repoRoot && SCOPE_CHECKED_MODES.includes(String(t.data.current_mode || ''))) s = scopeAt(taskDir, { repoRoot, base });
  const res = evaluateWorkflowGates({ data: t.data, ...io(taskDir), scope: s.scope });
  return { ...res, warnings: [...res.warnings, ...s.warnings], scopeSource: s.scopeSource, base: s.base };
}

/** Gate trước khi mở PR: mọi gate PR, bất kể current_mode, cộng scope diff với git. */
export function validatePr(taskDir, { repoRoot, base, noScope = false } = {}) {
  const t = loadTask(taskDir);
  if (!t.ok) return { ok: false, issues: t.issues, errors: t.errors, warnings: [], scopeSource: 'not_checked', base: '' };
  const s = repoRoot && !noScope ? scopeAt(taskDir, { repoRoot, base }) : { scope: undefined, scopeSource: 'not_checked', base: '', warnings: [] };
  const res = evaluateWorkflowGates({ data: t.data, ...io(taskDir), scope: s.scope, forPr: true });
  return { ...res, warnings: [...res.warnings, ...s.warnings], scopeSource: s.scopeSource, base: s.base };
}
