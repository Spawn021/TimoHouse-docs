/**
 * Schema frontmatter của tracking/workflow-status.md (BE) và bộ đọc bảng
 * Markdown của artifact (questions, review-bugs, test-summary, plan).
 *
 * Tương thích ngược: chỉ task_id, current_mode, next_mode là bắt buộc; field
 * khác optional, field lạ được giữ (passthrough).
 */
import { z } from 'zod';
import { commandToModeOf, parseFrontMatterLoose, realCell } from '@backend-delivery-kit/engine';
import manifest from './manifest.gen.mjs';

export const COMMAND_TO_MODE = commandToModeOf(manifest);
const STATES = Object.values(COMMAND_TO_MODE);

const lower = (v) => (typeof v === 'string' ? v.trim().toLowerCase() : v);
/** Enum không phân biệt hoa thường; giá trị rỗng coi như không khai. */
const en = (values) => z.preprocess((v) => (v === '' || v === null ? undefined : lower(v)), z.enum(values).optional());
const flag = z.preprocess((v) => (typeof v === 'string' ? lower(v) === 'true' : v), z.boolean().optional());
const count = z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number().int().min(0).optional());
/** true | false | unknown */
const triState = z.preprocess(
  (v) => (typeof v === 'boolean' ? v : v === '' || v === null || v === undefined ? undefined : lower(String(v))),
  z.union([z.boolean(), z.enum(['true', 'false', 'unknown'])]).optional().transform((v) => (v === 'true' ? true : v === 'false' ? false : v))
);

export const GATE_STATUS = ['not_started', 'in_progress', 'passed', 'failed', 'waived', 'not_required'];

export const WorkflowStatusSchema = z
  .object({
    task_id: z.preprocess((v) => (v === undefined || v === null ? v : String(v)), z.string().min(1)),
    current_mode: z.enum(STATES),
    next_mode: z.preprocess((v) => (v === undefined || v === null ? v : String(v)), z.string().min(1)),
    human_override: flag,
    task_type: z.string().optional(),
    risk_level: en(['low', 'medium', 'high', 'unknown']),
    plan_input_ledger_status: en(['not_started', 'in_progress', 'completed']),
    build_ready: flag,
    blocking_questions_open: count,
    input_sync_required: flag,
    api_change_type: en(['none', 'additive', 'breaking', 'unknown']),
    api_compat_status: en(GATE_STATUS),
    db_change_required: triState,
    migration_status: en(GATE_STATUS),
    rollback_plan_status: en(GATE_STATUS),
    review_status: en(['not_started', 'passed', 'failed', 'needs_recheck', 'not_required']),
    test_status: en(['not_started', 'passed', 'failed', 'partial']),
    critical_issues_open: count,
    high_issues_open: count,
    bugfix_required: flag,
    scope_diff_status: en(['not_started', 'passed', 'failed', 'manual_review']),
    pr_status: en(['not_started', 'ready', 'blocked']),
  })
  .passthrough();

/** Parse có kiểm schema. Lỗi viết tiếng Việt, nêu tên field. */
export function parseWorkflowStatus(raw) {
  const loose = parseFrontMatterLoose(raw);
  if (!loose.hasFrontMatter) return { ok: false, errors: ['workflow-status.md thiếu YAML frontmatter.'] };
  if (loose.error) return { ok: false, errors: [`workflow-status.md: frontmatter không parse được: ${loose.error}`] };
  const res = WorkflowStatusSchema.safeParse(loose.data);
  if (!res.success) {
    return {
      ok: false,
      errors: res.error.issues.map((i) => {
        const field = i.path.join('.') || '(gốc)';
        return `workflow-status.md — ${field}: giá trị "${loose.data[field] ?? ''}" không hợp lệ (${i.message}).`;
      }),
    };
  }
  return { ok: true, data: res.data, body: loose.body };
}

// --- Bảng Markdown -----------------------------------------------------------

const norm = (s) => String(s ?? '').trim().toLowerCase();
const splitRow = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());

/**
 * Các bảng Markdown trong `markdown`, mỗi bảng là mảng object theo tên cột
 * (tên cột chuẩn hoá chữ thường). `heading` (regex) giới hạn trong mục đó.
 */
export function parseTables(markdown, { heading } = {}) {
  let text = String(markdown ?? '').replace(/\r\n/g, '\n');
  if (heading) {
    const re = new RegExp(`^#{1,6}\\s+${heading}\\s*$`, 'im');
    const m = re.exec(text);
    if (!m) return [];
    const rest = text.slice(m.index + m[0].length);
    const next = rest.search(/^#{1,6}\s/m);
    text = next >= 0 ? rest.slice(0, next) : rest;
  }
  const tables = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim().startsWith('|') || !/^\s*\|?\s*:?-{2,}/.test(lines[i + 1] || '')) continue;
    const headers = splitRow(lines[i]).map(norm);
    const rows = [];
    let j = i + 2;
    for (; j < lines.length && lines[j].trim().startsWith('|'); j++) {
      const cells = splitRow(lines[j]);
      rows.push(Object.fromEntries(headers.map((h, k) => [h, cells[k] ?? ''])));
    }
    tables.push(rows);
    i = j - 1;
  }
  return tables;
}

const YES = ['có', 'co', 'yes', 'true', 'x'];
const CLOSED_QUESTION = ['answered', 'closed', 'đã trả lời', 'đóng', 'resolved'];

/** Số câu hỏi blocking chưa trả lời trong planning/questions.md. */
export function countOpenBlockingQuestions(markdown) {
  let n = 0;
  for (const table of parseTables(markdown)) {
    for (const row of table) {
      if (!('blocking' in row) || !realCell(row['câu hỏi'])) continue;
      if (!YES.includes(norm(row.blocking))) continue;
      if (CLOSED_QUESTION.includes(norm(row['trạng thái']))) continue;
      n += 1;
    }
  }
  return n;
}

const CLOSED_ISSUE = ['fixed', 'closed', 'wontfix', "won't fix", 'đã sửa', 'đóng'];

/** Bug Critical/High đang mở trong tracking/review-bugs.md. */
export function countOpenIssues(markdown) {
  const out = { critical: 0, high: 0 };
  for (const table of parseTables(markdown)) {
    for (const row of table) {
      if (!('severity' in row) || !realCell(row['mô tả'] ?? row.id)) continue;
      if (CLOSED_ISSUE.includes(norm(row['trạng thái']))) continue;
      const sev = norm(row.severity);
      if (sev === 'critical') out.critical += 1;
      else if (sev === 'high') out.high += 1;
    }
  }
  return out;
}

/** Dòng bằng chứng trong bảng "Command evidence log" của output/test-summary.md. */
export function commandEvidence(markdown) {
  const rows = parseTables(markdown, { heading: 'Command evidence log' }).flat();
  return rows
    .filter((r) => realCell(r['lệnh']) && norm(r['đã chạy thật?']) === 'có' && ['passed', 'failed'].includes(norm(r['kết quả'])))
    .map((r) => ({ command: r['lệnh'], result: norm(r['kết quả']) }));
}

/** Mục "Migration và rollback" của plan có ít nhất một dòng thật (hoặc ghi rõ không áp dụng). */
export function migrationPlanRows(planMarkdown) {
  return parseTables(planMarkdown, { heading: 'Migration và rollback' })
    .flat()
    .filter((r) => realCell(r.migration) && realCell(r['down / rollback']));
}
