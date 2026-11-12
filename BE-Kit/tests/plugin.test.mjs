/**
 * Plugin Claude Code `be` ở dạng người dùng nhận: hook và MCP server bản bundle
 * trong plugins/be, gọi đúng cách Claude Code gọi (stdin JSON / JSON-RPC stdio).
 * Chạy `npm run build` trước nếu vừa sửa packages/pack-be hoặc packages/engine.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scaffoldTask, PACK_ROOT } from '../packages/pack-be/src/index.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN = path.join(ROOT, 'plugins', 'be');
const HOOK = path.join(PLUGIN, 'hooks', 'be-hook.mjs');
const SERVER = path.join(PLUGIN, 'mcp', 'be-kit-mcp.mjs');
const TASK = 'docs/backend-tasks/BE-1';

let workspace;
let dataDir;

function setStatus(fields) {
  const file = path.join(workspace, TASK, 'tracking', 'workflow-status.md');
  let text = fs.readFileSync(file, 'utf8');
  for (const [k, v] of Object.entries(fields)) text = text.replace(new RegExp(`^${k}:.*$`, 'm'), `${k}: ${v}`);
  fs.writeFileSync(file, text);
  const future = new Date(Date.now() + 5000);
  fs.utimesSync(file, future, future);
}

function runHook(payload, level = 'enforce') {
  const env = { ...process.env, CLAUDE_PLUGIN_DATA: dataDir, BE_KIT_HOOKS: level };
  const r = spawnSync(process.execPath, [HOOK, payload.hook_event_name], {
    input: JSON.stringify({ session_id: 's1', cwd: workspace, ...payload }),
    encoding: 'utf8',
    env,
  });
  expect(r.status).toBe(0); // hook không bao giờ được làm hỏng phiên
  return r.stdout ? JSON.parse(r.stdout) : null;
}
const edit = (file, extra = {}) =>
  runHook({ hook_event_name: 'PreToolUse', tool_name: 'Edit', tool_input: { file_path: path.join(workspace, file), new_string: 'x' }, ...extra });
const denied = (out) => JSON.stringify(out || {}).includes('"deny"');

function callTool(name, args) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, CLAUDE_PLUGIN_ROOT: PLUGIN };
    const child = spawn(process.execPath, [SERVER], { env, cwd: workspace });
    let buf = '';
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('MCP server không trả lời'));
    }, 30000);
    const send = (msg) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n');
    child.stdout.on('data', (chunk) => {
      buf += chunk;
      let nl;
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        const msg = JSON.parse(line);
        if (msg.id === 1) {
          send({ method: 'notifications/initialized' });
          send(name === 'tools/list' ? { id: 2, method: 'tools/list', params: {} } : { id: 2, method: 'tools/call', params: { name, arguments: args } });
        } else if (msg.id === 2) {
          clearTimeout(timer);
          child.once('exit', () => resolve(msg.result));
          child.kill();
        }
      }
    });
    child.on('error', reject);
    send({ id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'be-kit-test', version: '0' } } });
  });
}
const text = (result) => result.content.map((c) => c.text).join('\n');

beforeEach(() => {
  workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'be-kit-ws-'));
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'be-kit-data-'));
  expect(scaffoldTask({ workspaceRoot: workspace, name: 'BE-1', templatesDir: path.join(PACK_ROOT, 'templates') }).ok).toBe(true);
});
afterEach(() => {
  fs.rmSync(workspace, { recursive: true, force: true });
  fs.rmSync(dataDir, { recursive: true, force: true });
});

describe('plugin be: cấu trúc', () => {
  it('lệnh mode giao cho đúng subagent; quick chạy inline có gate MCP; agent có giao thức', () => {
    const read = (rel) => fs.readFileSync(path.join(PLUGIN, rel), 'utf8');
    expect(read('commands/cook.md')).toMatch(/subagent `be:backend-developer`/);
    expect(read('commands/plan.md')).toMatch(/subagent `be:backend-planner`/);
    expect(read('commands/quick.md')).toMatch(/Gọi `be_begin_mode`/);
    expect(read('commands/context.md')).not.toMatch(/Điều phối/);
    for (const a of ['planner', 'developer', 'reviewer', 'tester', 'release-manager']) {
      const agent = read(`agents/backend-${a}.md`);
      expect(agent).toMatch(new RegExp(`^---\\nname: backend-${a}\\n`));
      expect(agent).toMatch(/Giao thức bắt buộc của mọi agent BE/);
    }
    expect(fs.existsSync(path.join(PLUGIN, 'skills/backend-delivery-standard/rules/api-contract.md'))).toBe(true);
    const market = JSON.parse(fs.readFileSync(path.join(ROOT, '.claude-plugin', 'marketplace.json'), 'utf8'));
    expect(market.plugins[0]).toMatchObject({ name: 'be', source: './plugins/be' });
  });
});

describe('hook', () => {
  it('chặn agent không phải developer sửa source; cho ghi artifact trong docs/backend-tasks', () => {
    expect(denied(edit('src/orders/orders.service.ts', { agent_type: 'be:backend-reviewer' }))).toBe(true);
    expect(edit(`${TASK}/output/review-report.md`, { agent_type: 'be:backend-reviewer' })).toBeNull();
  });

  it('nhận /be:cook và chặn sửa source khi plan chưa build_ready; cho phép khi đã sẵn sàng', () => {
    runHook({ hook_event_name: 'UserPromptSubmit', prompt: `/be:cook ${TASK}` });
    expect(denied(edit('src/orders/orders.service.ts', { agent_type: 'be:backend-developer' }))).toBe(true);
    setStatus({ build_ready: 'true', api_change_type: 'additive', db_change_required: 'false', plan_input_ledger_status: 'completed' });
    runHook({ hook_event_name: 'UserPromptSubmit', prompt: `/be:cook ${TASK}` });
    expect(denied(edit('src/orders/orders.service.ts', { agent_type: 'be:backend-developer' }))).toBe(false);
  });

  it('mức off im lặng', () => {
    expect(runHook({ hook_event_name: 'PreToolUse', tool_name: 'Edit', agent_type: 'be:backend-reviewer', tool_input: { file_path: path.join(workspace, 'src/a.ts'), new_string: 'x' } }, 'off')).toBeNull();
  });
});

describe('MCP server', () => {
  it('đăng ký tool be_*', async () => {
    const list = await callTool('tools/list');
    const names = list.tools.map((t) => t.name);
    expect(names).toEqual(expect.arrayContaining(['be_begin_mode', 'be_new_task', 'be_validate_workflow', 'be_scope_diff', 'be_next_step', 'be_task_status', 'be_list_tasks']));
  });

  it('be_begin_mode chặn cook khi chưa build_ready, in rule của BE và template từ plugin', async () => {
    const cook = text(await callTool('be_begin_mode', { workspace_root: workspace, task_folder: TASK, mode: 'cook' }));
    expect(cook).toMatch(/BỊ CHẶN/);
    const plan = text(await callTool('be_begin_mode', { workspace_root: workspace, task_folder: TASK, mode: 'plan' }));
    expect(plan).toMatch(/ĐƯỢC CHẠY BE plan/);
    expect(plan).toMatch(/API Contract/);
  });

  it('be_validate_workflow báo gate của BE', async () => {
    setStatus({ build_ready: 'true' });
    const out = text(await callTool('be_validate_workflow', { workspace_root: workspace, task_folder: TASK }));
    expect(out).toMatch(/FAILED/);
    expect(out).toMatch(/api_change_type/);
  });
});
