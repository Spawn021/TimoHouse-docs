/**
 * Gate của pack BE: mỗi gate có ít nhất một ca pass và một ca fail.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  validateWorkflow,
  validatePr,
  evaluateModeEntry,
  evaluateModeCompletion,
  modeBriefing,
  parseWorkflowStatus,
  countOpenBlockingQuestions,
  countOpenIssues,
  commandEvidence,
  scaffoldTask,
  scopeDiffForTask,
  rulesForMode,
  allRuleFiles,
  normalizeCommand,
  modeEndIssues,
  PACK_ROOT,
} from '../src/index.mjs';

let root;
let taskDir;

const TEMPLATES = path.join(PACK_ROOT, 'templates');
const RULES = path.join(PACK_ROOT, 'rules');

function write(rel, text) {
  const p = path.join(taskDir, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text);
}

/** Ghi workflow-status.md từ template, ghi đè các field cho trước. */
function status(fields) {
  const tpl = fs.readFileSync(path.join(taskDir, 'tracking/workflow-status.md'), 'utf8');
  let out = tpl;
  for (const [k, v] of Object.entries(fields)) {
    const re = new RegExp(`^${k}:.*$`, 'm');
    out = re.test(out) ? out.replace(re, `${k}: ${v}`) : out.replace(/^---\n/, `---\n${k}: ${v}\n`);
  }
  fs.writeFileSync(path.join(taskDir, 'tracking/workflow-status.md'), out);
}

const READY = {
  plan_input_ledger_status: 'completed',
  build_ready: 'true',
  api_change_type: 'additive',
  db_change_required: 'false',
};

const codes = (res) => res.issues.map((i) => i.code);

const EVIDENCE = `# Test summary\n\n## Command evidence log\n\n| Lệnh | Đã chạy thật? | Kết quả | Thời điểm | Ghi chú |\n|---|---|---|---|---|\n| npm test | Có | Passed | 2026-11-11 10:00 |  |\n`;
const MIGRATION_PLAN = (rows) =>
  `# Plan\n\n## Migration và rollback\n\n| Migration | Up làm gì | Down / rollback | Mất dữ liệu? | Rủi ro khoá bảng / thời gian chạy |\n|---|---|---|---|---|\n${rows}\n\n## File sẽ tạo / cập nhật\n\n| File | Tạo / sửa | Mục đích |\n|---|---|---|\n| src/orders/** | sửa | |\n`;

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'be-pack-'));
  const res = scaffoldTask({ workspaceRoot: root, name: 'BE-1-orders', templatesDir: TEMPLATES });
  expect(res.ok).toBe(true);
  taskDir = res.taskDir;
});

afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

describe('manifest, rule, template', () => {
  it('mọi rule khai trong pack.yaml có file, và ngược lại', () => {
    const onDisk = fs.readdirSync(RULES).filter((f) => f.endsWith('.md') && f !== 'README.md');
    expect([...allRuleFiles()].sort()).toEqual(onDisk.sort());
  });

  it('rule migration chỉ nạp khi task đổi DB', () => {
    expect(rulesForMode('cook')).not.toContain('data-migration-contract.md');
    expect(rulesForMode('cook', { dbChange: true })).toContain('data-migration-contract.md');
    expect(rulesForMode('test')).not.toContain('clean-code-contract.md');
  });

  it('template của task mới hợp lệ schema và qua gate ngay sau khi tạo', () => {
    const parsed = parseWorkflowStatus(fs.readFileSync(path.join(taskDir, 'tracking/workflow-status.md'), 'utf8'));
    expect(parsed.ok).toBe(true);
    expect(parsed.data.task_id).toBe('BE-1-orders');
    expect(validateWorkflow(taskDir).ok).toBe(true);
  });

  it('chuẩn hoá tên lệnh BE', () => {
    expect(normalizeCommand('BE cook')).toBe('cook');
    expect(normalizeCommand('/be:review')).toBe('review');
    expect(normalizeCommand('implementation-mode')).toBe('cook');
    expect(normalizeCommand('figma')).toBe('');
  });
});

describe('schema', () => {
  it('pass: giá trị hợp lệ, db_change_required nhận true/false/unknown', () => {
    status({ db_change_required: 'true' });
    expect(parseWorkflowStatus(fs.readFileSync(path.join(taskDir, 'tracking/workflow-status.md'), 'utf8')).data.db_change_required).toBe(true);
  });
  it('fail: enum sai báo tên field', () => {
    status({ api_change_type: 'big' });
    const res = validateWorkflow(taskDir);
    expect(codes(res)).toContain('STATUS_SCHEMA_INVALID');
    expect(res.errors.join('\n')).toMatch(/api_change_type/);
  });
});

describe('câu hỏi blocking', () => {
  const Q = (status) => `| ID | Câu hỏi | Blocking | Hỏi ai | Trạng thái | Trả lời / giả định |\n|---|---|---|---|---|---|\n| Q1 | Format lỗi? | Có | BA | ${status} | |\n| Q2 | Tên field? | Không | BE | Open | |\n`;

  it('đếm đúng câu blocking Open, bỏ câu đã trả lời và câu không blocking', () => {
    expect(countOpenBlockingQuestions(Q('Open'))).toBe(1);
    expect(countOpenBlockingQuestions(Q('Answered'))).toBe(0);
  });

  it('fail: build_ready true khi còn câu blocking; lệch số đếm', () => {
    write('planning/questions.md', Q('Open'));
    status({ ...READY });
    const c = codes(validateWorkflow(taskDir));
    expect(c).toContain('BUILD_READY_WITH_BLOCKING_QUESTIONS');
    expect(c).toContain('BLOCKING_COUNT_MISMATCH');
  });

  it('pass: câu blocking đã trả lời thì được build_ready', () => {
    write('planning/questions.md', Q('Answered'));
    status({ ...READY });
    expect(validateWorkflow(taskDir).ok).toBe(true);
  });

  it('entry: cook bị chặn và chuyển sang input-sync; plan vẫn chạy được', () => {
    write('planning/questions.md', Q('Open'));
    const data = { ...READY, build_ready: true };
    const cook = evaluateModeEntry({ requested: 'cook', data, openBlockingQuestions: 1, taskRef: 't' });
    expect(cook.allowed).toBe(false);
    expect(cook.reasonCodes).toContain('ENTRY_QUESTIONS_BLOCKING');
    expect(cook.redirect).toBe('BE input-sync t <answer-or-cr>');
    expect(evaluateModeEntry({ requested: 'plan', data, openBlockingQuestions: 1 }).allowed).toBe(true);
  });
});

describe('quyết định API/DB của plan', () => {
  it('fail: build_ready mà chưa quyết định api_change_type / db_change_required / ledger', () => {
    status({ build_ready: 'true' });
    const c = codes(validateWorkflow(taskDir));
    expect(c).toEqual(expect.arrayContaining(['PLAN_API_DECISION_MISSING', 'PLAN_DB_DECISION_MISSING', 'PLAN_INPUT_LEDGER_INCOMPLETE']));
  });

  it('pass: đã quyết định đủ', () => {
    status({ ...READY });
    expect(validateWorkflow(taskDir).ok).toBe(true);
  });
});

describe('breaking API', () => {
  it('fail: breaking chưa duyệt tương thích, cook bị chặn', () => {
    status({ ...READY, api_change_type: 'breaking', api_compat_status: 'not_started' });
    expect(codes(validateWorkflow(taskDir))).toContain('API_BREAKING_NOT_APPROVED');
    const entry = evaluateModeEntry({ requested: 'cook', data: { build_ready: true, api_change_type: 'breaking' } });
    expect(entry.reasonCodes).toContain('ENTRY_API_BREAKING_NOT_APPROVED');
  });

  it('pass: breaking đã waived', () => {
    status({ ...READY, api_change_type: 'breaking', api_compat_status: 'waived' });
    expect(validateWorkflow(taskDir).ok).toBe(true);
  });
});

describe('migration và rollback', () => {
  it('fail: đổi DB mà plan chưa có migration kèm rollback', () => {
    status({ ...READY, db_change_required: 'true' });
    expect(codes(validateWorkflow(taskDir))).toContain('PLAN_MIGRATION_SECTION_MISSING');
    write('planning/implementation-plan.md', MIGRATION_PLAN('| 1700-add-status | thêm cột status |  | Không | |'));
    expect(codes(validateWorkflow(taskDir))).toContain('PLAN_MIGRATION_SECTION_MISSING');
  });

  it('pass: plan có migration và rollback', () => {
    write('planning/implementation-plan.md', MIGRATION_PLAN('| 1700-add-status | thêm cột status | drop cột status | Không | Nhỏ |'));
    status({ ...READY, db_change_required: 'true' });
    expect(validateWorkflow(taskDir).ok).toBe(true);
  });

  it('fail/pass: ở testing-mode migration phải được kiểm', () => {
    write('planning/implementation-plan.md', MIGRATION_PLAN('| 1700-add-status | thêm cột | drop cột | Không | Nhỏ |'));
    write('output/test-summary.md', EVIDENCE);
    status({ ...READY, db_change_required: 'true', current_mode: 'testing-mode', next_mode: 'pr' });
    expect(codes(validateWorkflow(taskDir))).toContain('MIGRATION_NOT_VERIFIED');
    status({ migration_status: 'passed', rollback_plan_status: 'passed' });
    expect(validateWorkflow(taskDir).ok).toBe(true);
  });
});

describe('quick', () => {
  it('entry: chặn quick khi đổi DB, breaking API hoặc rủi ro cao', () => {
    const r = evaluateModeEntry({ requested: 'quick', data: { db_change_required: true, api_change_type: 'breaking', risk_level: 'high' } });
    expect(r.reasonCodes).toEqual(['ENTRY_QUICK_HIGH_RISK', 'ENTRY_QUICK_DB_CHANGE', 'ENTRY_QUICK_API_BREAKING']);
    expect(evaluateModeEntry({ requested: 'quick', data: { db_change_required: false, api_change_type: 'additive', risk_level: 'low' } }).allowed).toBe(true);
  });

  it('gate: quick-mode cần test evidence, không cần ledger', () => {
    status({ current_mode: 'quick-mode', next_mode: 'pr', api_change_type: 'none', db_change_required: 'false' });
    expect(codes(validateWorkflow(taskDir))).toEqual(['TEST_EVIDENCE_MISSING']);
    write('output/test-summary.md', EVIDENCE);
    expect(validateWorkflow(taskDir).ok).toBe(true);
  });
});

describe('test evidence', () => {
  it('chỉ tính dòng đã chạy thật với kết quả Passed/Failed', () => {
    expect(commandEvidence(EVIDENCE)).toEqual([{ command: 'npm test', result: 'passed' }]);
    const tpl = fs.readFileSync(path.join(TEMPLATES, 'output/test-summary.md'), 'utf8');
    expect(commandEvidence(tpl)).toEqual([]);
  });

  it('fail: test_status passed nhưng mọi lệnh Failed', () => {
    write('output/test-summary.md', EVIDENCE.replace('Passed', 'Failed'));
    status({ ...READY, current_mode: 'testing-mode', next_mode: 'bugfix', test_status: 'passed' });
    expect(codes(validateWorkflow(taskDir))).toContain('TEST_STATUS_CONTRADICTS_EVIDENCE');
  });
});

describe('bug và PR', () => {
  const BUGS = (st) => `| ID | Severity | Nhóm | Mô tả | File | Trạng thái |\n|---|---|---|---|---|---|\n| B1 | High | security | Thiếu kiểm quyền | src/a.ts | ${st} |\n`;

  it('đếm bug Critical/High đang mở', () => {
    expect(countOpenIssues(BUGS('Open'))).toEqual({ critical: 0, high: 1 });
    expect(countOpenIssues(BUGS('Fixed'))).toEqual({ critical: 0, high: 0 });
  });

  it('fail: số bug khai lệch bảng; PR bị chặn', () => {
    write('tracking/review-bugs.md', BUGS('Open'));
    status({ ...READY });
    expect(codes(validateWorkflow(taskDir))).toContain('ISSUE_COUNT_MISMATCH');
    const pr = evaluateModeEntry({ requested: 'pr', data: { review_status: 'passed' }, openIssues: { critical: 0, high: 1 } });
    expect(pr.reasonCodes).toContain('ENTRY_OPEN_BUGS');
  });

  it('validatePr: fail khi thiếu review/test/pr-summary; pass khi đủ', () => {
    status({ ...READY });
    expect(codes(validatePr(taskDir))).toEqual(
      expect.arrayContaining(['PR_REVIEW_NOT_PASSED', 'PR_TEST_NOT_PASSED', 'TEST_EVIDENCE_MISSING', 'PR_SUMMARY_MISSING'])
    );
    write('output/test-summary.md', EVIDENCE);
    write('output/pr-summary.md', '# PR\n');
    status({ review_status: 'passed', test_status: 'passed' });
    expect(validatePr(taskDir).ok).toBe(true);
  });
});

describe('scope', () => {
  it('fail/pass: file ngoài bảng File sẽ tạo / cập nhật', () => {
    write('planning/implementation-plan.md', MIGRATION_PLAN(''));
    const out = scopeDiffForTask(taskDir, { changedFiles: ['src/orders/a.ts', 'src/users/b.ts', 'docs/backend-tasks/BE-1-orders/task.md', 'yarn.lock'] });
    expect(out.outOfPlan).toEqual(['src/users/b.ts']);
    status({ ...READY });
    expect(codes(validateWorkflow(taskDir, { scope: out }))).toContain('SCOPE_OUT_OF_PLAN');
    const inPlan = scopeDiffForTask(taskDir, { changedFiles: ['src/orders/a.ts'] });
    expect(validateWorkflow(taskDir, { scope: inPlan }).ok).toBe(true);
  });
});

describe('kết thúc plan', () => {
  it('fail: plan chưa kết luận (chưa build_ready, không có câu hỏi blocking)', () => {
    expect(modeEndIssues(taskDir, 'plan').map((i) => i.code)).toEqual(['PLAN_NOT_CONCLUDED']);
  });
  it('pass: build_ready, hoặc còn câu hỏi chờ input-sync', () => {
    status({ ...READY });
    expect(modeEndIssues(taskDir, 'plan')).toEqual([]);
    status({ build_ready: 'false', input_sync_required: 'true' });
    expect(modeEndIssues(taskDir, 'plan')).toEqual([]);
    expect(modeEndIssues(taskDir, 'cook')).toEqual([]);
  });
});

describe('mở và kết thúc mode qua engine', () => {
  it('briefing in rule của mode và template artifact; completion đòi current_mode đúng', () => {
    status({ ...READY });
    const b = modeBriefing({ taskDir, taskRef: 'docs/backend-tasks/BE-1-orders', command: 'cook', rulesDir: RULES, rulesLabel: 'kit', newTaskHint: '', finishHint: '', workspaceRoot: root, templatesDir: TEMPLATES });
    expect(b.ok).toBe(true);
    expect(b.text).toMatch(/GATE: ĐƯỢC CHẠY BE cook/);
    expect(b.text).toMatch(/Clean Code Contract/);
    const end = evaluateModeCompletion({ taskDir, taskRef: 't', command: 'cook' });
    expect(end.issues.map((i) => i.code)).toContain('END_CURRENT_MODE_MISMATCH');
    status({ current_mode: 'implementation-mode', next_mode: 'review' });
    expect(evaluateModeCompletion({ taskDir, taskRef: 't', command: 'cook' }).ok).toBe(true);
  });
});
