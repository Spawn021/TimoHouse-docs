/**
 * CLI của pack BE ở dạng người dùng nhận: bản bundle standalone/be-kit.mjs, chạy
 * trong repo tạm không có node_modules. Chạy `npm run build` trước nếu vừa sửa
 * bin/be-kit.mjs hoặc packages/pack-be.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KIT_CLI = path.join(ROOT, 'standalone', 'be-kit.mjs');
const TASK = 'docs/backend-tasks/BE-1-create-order';

let target;

function run(cli, args, cwd = target) {
  const env = { ...process.env };
  delete env.CI;
  const r = spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8', env });
  return { status: r.status, out: (r.stdout || '') + (r.stderr || '') };
}
const kit = (...a) => run(KIT_CLI, a, ROOT);
const project = (...a) => run(path.join(target, 'bin', 'be-kit.mjs'), a);
const read = (rel) => fs.readFileSync(path.join(target, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(target, rel));
const git = (...a) => spawnSync('git', a, { cwd: target, encoding: 'utf8' });

function setStatus(fields) {
  const file = path.join(target, TASK, 'tracking/workflow-status.md');
  let text = fs.readFileSync(file, 'utf8');
  for (const [k, v] of Object.entries(fields)) text = text.replace(new RegExp(`^${k}:.*$`, 'm'), `${k}: ${v}`);
  fs.writeFileSync(file, text);
}

beforeEach(() => {
  target = fs.mkdtempSync(path.join(os.tmpdir(), 'be-kit-cli-'));
});
afterEach(() => fs.rmSync(target, { recursive: true, force: true }));

describe('be-kit init', () => {
  it('cài rule, template, context, CLI và adapter Antigravity; doctor --strict đạt', () => {
    expect(kit('init', '--target', target).status).toBe(0);
    for (const rel of [
      'bin/be-kit.mjs',
      '.backend-delivery/rules/api-contract.md',
      '.backend-delivery/rules/data-migration-contract.md',
      '.backend-delivery/templates/tracking/workflow-status.md',
      '.backend-delivery/standard.yaml',
      'docs/backend-context/project-source-context.md',
      'docs/backend-context/api-context.md',
      '.agents/rules/backend-delivery-standard.md',
      '.agents/skills/backend-delivery-standard/SKILL.md',
      '.agents/skills/be-context/SKILL.md',
      '.agents/skills/be-cook/SKILL.md',
    ]) expect(exists(rel), rel).toBe(true);
    expect(read('.gitattributes')).toMatch(/docs\/backend-tasks\/\*\*\/tracking\/run-log\.jsonl merge=union/);
    expect(project('doctor', '--strict').status).toBe(0);
  });

  it('skill be-<mode> có name trùng thư mục, bước mode begin/end; skill không phải mode thì không', () => {
    kit('init', '--target', target);
    const commands = fs.readdirSync(path.join(ROOT, 'packages', 'pack-be', 'commands')).map((f) => f.replace(/\.md$/, ''));
    for (const c of commands) {
      const s = read(`.agents/skills/be-${c}/SKILL.md`);
      expect(s.startsWith(`---\nname: be-${c}\ndescription: "BE ${c}: `)).toBe(true);
    }
    expect(read('.agents/skills/be-cook/SKILL.md')).toMatch(/mode begin <task-folder> cook --actor antigravity/);
    expect(read('.agents/skills/be-context/SKILL.md')).not.toMatch(/mode begin <task-folder>/);
    for (const f of fs.readdirSync(path.join(target, '.agents', 'rules'))) {
      expect(read(`.agents/rules/${f}`)).toMatch(/^---\ntrigger: (always_on|glob)\n/);
    }
  });

  it('init lại giữ context của team và skill riêng, cùng tồn tại với skill của FE-Kit', () => {
    kit('init', '--target', target);
    fs.appendFileSync(path.join(target, 'docs/backend-context/project-source-context.md'), '\nTEAM EDIT\n');
    fs.mkdirSync(path.join(target, '.agents/skills/be-team'), { recursive: true });
    fs.writeFileSync(path.join(target, '.agents/skills/be-team/SKILL.md'), '---\nname: be-team\ndescription: team\n---\n');
    fs.mkdirSync(path.join(target, '.agents/skills/fe-cook'), { recursive: true });
    fs.writeFileSync(path.join(target, '.agents/skills/fe-cook/SKILL.md'), 'fe\n');
    kit('init', '--target', target);
    expect(read('docs/backend-context/project-source-context.md')).toMatch(/TEAM EDIT/);
    expect(exists('.agents/skills/be-team/SKILL.md')).toBe(true);
    expect(read('.agents/skills/fe-cook/SKILL.md')).toBe('fe\n');
  });

  it('--agents all: Claude, Codex, Cursor, Copilot + CI; doctor --strict đạt', () => {
    expect(kit('init', '--target', target, '--agents', 'all').status).toBe(0);
    expect(project('doctor', '--strict').status).toBe(0);
    expect(JSON.parse(read('.claude/settings.json')).enabledPlugins['be@backend-delivery']).toBe(true);
    expect(read('CLAUDE.md')).toMatch(/be-kit:start/);
    expect(read('AGENTS.md')).toMatch(/--actor codex/);
    expect(read('.codex/prompts/be-cook.md')).toMatch(/mode begin <task-folder> cook --actor codex/);
    expect(read('.cursor/rules/backend-delivery-standard.mdc')).toMatch(/^---\ndescription: .*\nalwaysApply: true\n---/);
    expect(read('.cursor/rules/backend-delivery-standard.mdc')).toMatch(/--actor cursor/);
    expect(read('.github/copilot-instructions.md')).toMatch(/--actor copilot/);
    expect(read('.github/workflows/backend-delivery-standard.yml')).toMatch(/be-kit.mjs validate-pr/);
  });

  it('khối be-kit không đè nội dung của team hay khối của FE-Kit; init lại chỉ thay khối', () => {
    fs.writeFileSync(path.join(target, 'AGENTS.md'), '# Team\n\nGhi chú.\n\n<!-- fe-kit:start -->\nFE\n<!-- fe-kit:end -->\n');
    kit('init', '--target', target, '--agents', 'codex');
    kit('init', '--target', target, '--agents', 'codex');
    const agents = read('AGENTS.md');
    expect(agents.startsWith('# Team')).toBe(true);
    expect(agents).toMatch(/<!-- fe-kit:start -->\nFE\n<!-- fe-kit:end -->/);
    expect(agents.match(/be-kit:start/g)).toHaveLength(1);
  });

  it('doctor báo thiếu khi xoá file của agent đã cài', () => {
    kit('init', '--target', target, '--agents', 'cursor,github');
    fs.rmSync(path.join(target, '.github/workflows/backend-delivery-standard.yml'));
    const r = project('doctor', '--strict');
    expect(r.status).toBe(1);
    expect(r.out).toMatch(/MISSING \.github\/workflows\/backend-delivery-standard\.yml/);
  });

  it('agent không hợp lệ thì báo lỗi rõ; init từ bản copy trong dự án bị từ chối', () => {
    expect(kit('init', '--target', target, '--agents', 'vim').out).toMatch(/không hợp lệ/);
    kit('init', '--target', target);
    const r = project('init');
    expect(r.status).toBe(1);
    expect(r.out).toMatch(/phải chạy từ repo kit/);
  });
});

describe('be-kit trong repo dự án', () => {
  beforeEach(() => {
    git('init', '-q', '-b', 'main');
    git('config', 'user.email', 't@t');
    git('config', 'user.name', 't');
    kit('init', '--target', target);
    git('add', '-A');
    git('commit', '-q', '-m', 'init');
    expect(project('new-task', 'BE-1-create-order').status).toBe(0);
  });

  it('cook bị chặn khi plan chưa sẵn sàng (exit 1), plan được chạy và in rule', () => {
    const cook = project('mode', 'begin', TASK, 'cook', '--actor', 'antigravity');
    expect(cook.status).toBe(1);
    expect(cook.out).toMatch(/BỊ CHẶN/);
    expect(cook.out).toMatch(/BE plan docs\/backend-tasks\/BE-1-create-order/);
    const plan = project('mode', 'begin', TASK, 'plan', '--actor', 'antigravity');
    expect(plan.status).toBe(0);
    expect(plan.out).toMatch(/API Contract/);
    expect(plan.out).not.toMatch(/Data Migration Contract/);
  });

  it('mode end plan: fail khi chưa kết luận, pass khi đã quyết định API/DB và build_ready', () => {
    project('mode', 'begin', TASK, 'plan');
    const bad = project('mode', 'end', TASK, 'plan');
    expect(bad.status).toBe(1);
    expect(bad.out).toMatch(/PLAN_NOT_CONCLUDED/);
    setStatus({ build_ready: 'true', api_change_type: 'additive', db_change_required: 'false', plan_input_ledger_status: 'completed', next_mode: 'cook' });
    expect(project('mode', 'end', TASK, 'plan').status).toBe(0);
    expect(project('mode', 'begin', TASK, 'cook').status).toBe(0);
  });

  it('task đổi DB: rule migration được nạp; quick bị chặn', () => {
    setStatus({ db_change_required: 'true' });
    expect(project('mode', 'begin', TASK, 'plan').out).toMatch(/Data Migration Contract/);
    const quick = project('mode', 'begin', TASK, 'quick');
    expect(quick.status).toBe(1);
    expect(quick.out).toMatch(/không chạy quick/);
  });

  it('validate-pr báo đủ lỗi; status đọc trạng thái; run-log ghi actor', () => {
    setStatus({ build_ready: 'true', api_change_type: 'none', db_change_required: 'false', plan_input_ledger_status: 'completed' });
    const pr = project('validate-pr', TASK, '--no-scope');
    expect(pr.status).toBe(1);
    expect(pr.out).toMatch(/PR_REVIEW_NOT_PASSED/);
    expect(pr.out).toMatch(/TEST_EVIDENCE_MISSING/);
    expect(project('status', TASK).out).toMatch(/api_change_type: none/);
    project('mode', 'begin', TASK, 'plan', '--actor', 'antigravity');
    const log = read(`${TASK}/tracking/run-log.jsonl`).trim().split('\n').map((l) => JSON.parse(l));
    expect(log.some((r) => r.event === 'mode_start' && r.actor === 'antigravity' && r.pack === 'be')).toBe(true);
    expect(project('report').status).toBe(0);
  });
});
