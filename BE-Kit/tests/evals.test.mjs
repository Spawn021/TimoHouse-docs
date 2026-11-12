/**
 * Tự kiểm bộ eval hành vi mà không gọi API: dựng lại workspace của từng case
 * bằng `scaffold.mjs`, rồi kiểm
 *   1. workflow-status.md hợp lệ schema và gate lúc bắt đầu đúng như case muốn
 *      đo (bị chặn hay được chạy);
 *   2. grader tất định cho kết quả đúng khi agent CHƯA làm gì:
 *      - grader kiềm chế (không sửa source, không ghi pass giả...) phải pass,
 *        nếu không thì case fail kể cả khi agent làm đúng;
 *      - grader hành động (tạo report, route plan...) phải fail,
 *        nếu không thì grader pass mà chẳng đo được gì.
 *
 * Ngữ nghĩa grader theo tài liệu `claude plugin eval`: `file_exists` chỉ tính
 * file tạo ra trong lượt chạy; `tool_used` đếm lời gọi tool (mặc định min 1).
 * `regex` trên file không tồn tại coi như nội dung rỗng.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { bePack, COMMANDS, parseWorkflowStatus } from '../packages/pack-be/src/index.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVALS = path.join(ROOT, 'evals');

/** Case nào đo việc gate CHẶN; các case còn lại phải được chạy. */
const ENTRY_BLOCKED = new Set(['cook-refuses-when-blocked', 'quick-refuses-db-change']);

/** Grader kiềm chế viết bằng `contains`: kiểm source còn nguyên. */
const RESTRAINT_BY_NAME = new Set(['source-unchanged']);

/** Agent hợp lệ của plugin `be` (grader `delegates-*` phải trỏ tới một trong số này). */
const AGENTS = fs
  .readdirSync(path.join(ROOT, 'plugins', 'be', 'agents'))
  .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  .map((f) => `be:${f.replace(/\.md$/, '')}`);

const CASES = fs
  .readdirSync(EVALS, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(EVALS, d.name, 'prompt.md')))
  .map((d) => d.name);

function loadCase(name) {
  const dir = path.join(EVALS, name);
  const prompt = matter(fs.readFileSync(path.join(dir, 'prompt.md'), 'utf8'));
  const [, command, task] = prompt.content.trim().match(/^\/be:([\w-]+)\s+(\S+)/) || [];
  const graders = fs
    .readdirSync(path.join(dir, 'graders'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ name: f.replace(/\.md$/, ''), ...matter(fs.readFileSync(path.join(dir, 'graders', f), 'utf8')).data }));
  return { dir, meta: prompt.data, command, task, graders };
}

function isRestraint(g) {
  if (RESTRAINT_BY_NAME.has(g.name)) return true;
  if (g.type === 'file_exists') return g.exists === false;
  if (g.type === 'regex') return g.match === 'not_contains';
  if (g.type === 'tool_used') return g.max === 0;
  return false;
}

/** Kết quả của grader trên workspace chưa bị agent đụng tới; `null` = cần agent mới chấm được. */
function gradeUntouched(g, ws) {
  switch (g.type) {
    case 'file_exists':
      return g.exists === false; // chưa tạo file nào trong lượt chạy
    case 'tool_used':
      return (g.min ?? 1) <= 0; // chưa gọi tool nào
    case 'regex': {
      if (g.target?.source !== 'file') return null; // last_message: cần câu trả lời của agent
      const file = path.join(ws, g.target.path);
      const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
      const found = new RegExp(g.pattern, g.flags || '').test(text);
      return g.match === 'not_contains' ? !found : found;
    }
    default:
      return null; // llm
  }
}

const workspaces = {};

beforeAll(() => {
  for (const name of CASES) {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), `be-kit-eval-${name}-`));
    const r = spawnSync(process.execPath, [path.join(EVALS, name, 'scaffold.mjs')], { cwd: ws, encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`scaffold của ${name} lỗi:\n${r.stderr}`);
    workspaces[name] = ws;
  }
}, 120_000);

afterAll(() => {
  for (const ws of Object.values(workspaces)) fs.rmSync(ws, { recursive: true, force: true });
});

it('có case đo chặn nhầm (luật enforce cần) và mỗi lệnh mode quan trọng có ít nhất một case', () => {
  expect(CASES).toContain('cook-proceeds-when-ready');
  const commands = new Set(CASES.map((n) => loadCase(n).command));
  for (const c of ['plan', 'quick', 'cook', 'review', 'test', 'pr']) expect(commands.has(c), c).toBe(true);
});

describe.each(CASES)('eval case %s', (name) => {
  const c = loadCase(name);

  it('case.yaml có name và chạy scaffold qua shim bash gọi scaffold.mjs; prompt có tag và giới hạn turn', () => {
    const caseYaml = matter(`---\n${fs.readFileSync(path.join(c.dir, 'case.yaml'), 'utf8')}\n---\n`).data;
    expect(caseYaml.name).toBe(name);
    expect(caseYaml.context.scaffold_script).toBe('scaffold.sh');
    expect(fs.readFileSync(path.join(c.dir, 'scaffold.sh'), 'utf8')).toMatch(/exec node .*scaffold\.mjs/);
    expect(c.meta.tags.length).toBeGreaterThan(0);
    expect(c.meta.max_turns).toBeGreaterThan(0);
    expect(COMMANDS).toContain(c.command);
  });

  it('workflow-status.md hợp lệ schema và gate lúc bắt đầu đúng như case muốn đo', () => {
    const taskDir = path.join(workspaces[name], c.task);
    const raw = fs.readFileSync(path.join(taskDir, 'tracking', 'workflow-status.md'), 'utf8');
    const status = parseWorkflowStatus(raw);
    expect(status.ok, (status.errors || []).join('; ')).toBe(true);
    const read = (rel) => (fs.existsSync(path.join(taskDir, rel)) ? fs.readFileSync(path.join(taskDir, rel), 'utf8') : '');
    const data = matter(raw).data;
    const entry = bePack.evaluateModeEntry({ requested: c.command, data, ...bePack.entryInputs({ data, read }), taskRef: c.task });
    expect(entry.allowed, entry.reasons.join('; ')).toBe(!ENTRY_BLOCKED.has(name));
  });

  it('grader kiềm chế pass và grader hành động fail khi agent chưa làm gì', () => {
    const results = c.graders
      .map((g) => ({ name: g.name, restraint: isRestraint(g), passed: gradeUntouched(g, workspaces[name]) }))
      .filter((r) => r.passed !== null);
    for (const r of results) {
      expect(r.passed, `${r.name} (${r.restraint ? 'kiềm chế' : 'hành động'})`).toBe(r.restraint);
    }
  });

  it('cấm sửa source thì cấm đủ Edit, Write và MultiEdit', () => {
    const banned = c.graders.filter((g) => g.type === 'tool_used' && g.max === 0);
    if (!banned.length) return;
    const byTool = new Map(banned.map((g) => [g.tool, g.input_match]));
    for (const tool of ['Edit', 'Write', 'MultiEdit']) {
      expect(byTool.get(tool), `thiếu grader cấm ${tool}`).toBe(banned[0].input_match);
    }
  });

  it('grader giao việc trỏ tới đúng subagent của mode, có trong plugin', () => {
    for (const g of c.graders.filter((g) => g.type === 'tool_used' && g.tool === 'Agent')) {
      const agent = g.input_match.match(/"(be:[\w-]+)"/)?.[1];
      expect(AGENTS).toContain(agent);
      expect(agent).toBe(`be:${bePack.agentFor[c.command]}`);
    }
  });
});
