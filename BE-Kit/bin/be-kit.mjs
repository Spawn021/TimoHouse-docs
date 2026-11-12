#!/usr/bin/env node
/**
 * CLI của pack BE (backend delivery, Node: NestJS/Express).
 *
 * Nguồn này chạy được từ repo kit; `npm run build` bundle ra `standalone/be-kit.mjs`,
 * bản `init` copy vào `bin/be-kit.mjs` của repo dự án. Bản copy trong dự án chạy
 * mọi lệnh trừ `init` (init cần nguồn của pack trong repo kit).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildReport, renderReport, codesOf, relativePosix } from '@backend-delivery-kit/engine';
import {
  manifest,
  COMMANDS,
  normalizeCommand,
  modeBriefing,
  evaluateModeCompletion,
  validateWorkflow,
  validateWorkflowAtGate,
  validatePr,
  scaffoldTask,
  resolveTaskDir,
  appendRunLog,
  readRunLog,
  parseWorkflowStatus,
  countOpenBlockingQuestions,
  allRuleFiles,
  REQUIRED_TASK_FILES,
  RUNLOG_FILE,
  TASKS_ROOT,
  CONFIG_DIR,
} from '@backend-delivery-kit/pack-be';

const BUNDLED_VERSION = typeof __BE_KIT_VERSION__ !== 'undefined' ? __BE_KIT_VERSION__ : '';
const kitRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACK_SRC = path.join(kitRoot, 'packages', 'pack-be');
const args = process.argv.slice(2);
const command = args[0] || 'help';
const P = manifest.prompt_prefix;
const GENERATED_MARK = '<!-- be-kit:generated (sinh từ packages/pack-be/commands, sửa ở kit rồi chạy lại init) -->';
const RUNLOG_GITATTRIBUTES = `${TASKS_ROOT}/**/tracking/run-log.jsonl merge=union`;

// --- tiện ích -----------------------------------------------------------------

function argValue(name, fallback = '') {
  const eq = args.find((a) => a.startsWith(name + '='));
  if (eq) return eq.slice(name.length + 1);
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
}
const targetDir = () => path.resolve(argValue('--target', process.cwd()));
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');

function readKitVersion() {
  if (BUNDLED_VERSION) return BUNDLED_VERSION;
  try {
    return JSON.parse(read(path.join(kitRoot, 'package.json'))).version || 'unknown';
  } catch {
    return 'unknown';
  }
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}
function copyDir(src, dest, { skip = () => false } = {}) {
  if (!fs.existsSync(src)) return;
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (skip(s)) continue;
    if (e.isDirectory()) copyDir(s, d, { skip });
    else copyFile(s, d);
  }
}
function copyIfMissing(src, dest) {
  if (!fs.existsSync(src) || fs.existsSync(dest)) return false;
  copyFile(src, dest);
  return true;
}
function frontmatterField(raw, name) {
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const m = fm && fm[1].match(new RegExp('^' + name + ':\\s*(.*)$', 'm'));
  return m ? m[1].trim().replace(/^"(.*)"$/, '$1') : '';
}

function resolveTask(input, target) {
  if (!input) return '';
  return resolveTaskDir(target, input);
}
function requireTask(target) {
  const taskDir = resolveTask(args[1], target);
  if (!taskDir || !fs.existsSync(taskDir)) {
    console.error(`Không tìm thấy task folder "${args[1] || ''}". Tạo bằng: node bin/be-kit.mjs new-task ${manifest.task_name_hint}`);
    process.exit(1);
  }
  return taskDir;
}
function rulesDirFor(target) {
  const project = path.join(target, CONFIG_DIR, 'rules');
  if (fs.existsSync(project)) return { dir: project, label: `${CONFIG_DIR}/rules của repo` };
  return { dir: path.join(PACK_SRC, 'rules'), label: 'kit' };
}
function templatesDirFor(target) {
  return [path.join(target, CONFIG_DIR, 'templates'), path.join(PACK_SRC, 'templates')].find((d) => fs.existsSync(d));
}

function cliActor() {
  return argValue('--actor', '') || process.env.BE_KIT_ACTOR || 'cli';
}
function logCli(taskDir, record) {
  if (args.includes('--no-log') || String(process.env.CI || '').toLowerCase() === 'true') return;
  try {
    appendRunLog(taskDir, { source: 'cli', actor: cliActor(), kit: readKitVersion(), ...record });
  } catch {
    /* run-log không được làm hỏng lệnh chính */
  }
}

function nextPrompt(taskDir) {
  const text = read(path.join(taskDir, manifest.status_file)).replace(/\r\n/g, '\n');
  const m = text.match(/^##\s+Prompt bước tiếp theo\s*\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/m);
  if (!m) return '';
  return m[1].replace(/```[a-z]*\n?/g, '').trim();
}

// --- init ---------------------------------------------------------------------

const AGENT_LABELS = {
  antigravity: 'Google Antigravity',
  claude: 'Claude Code (plugin be)',
  codex: 'Codex / OpenAI',
  cursor: 'Cursor',
  github: 'GitHub Copilot + CI',
};
const AGENT_ALIASES = { 'google-antigravity': 'antigravity', 'claude-code': 'claude', openai: 'codex', copilot: 'github', gh: 'github' };
const AGENTS = Object.keys(AGENT_LABELS);
const PLUGIN_ID = `${manifest.plugin}@backend-delivery`;
const BLOCK_START = '<!-- be-kit:start (khối do be-kit init quản lý, sửa ngoài khối này) -->';
const BLOCK_END = '<!-- be-kit:end -->';

function parseAgents(raw) {
  const list = String(raw || 'antigravity')
    .split(/[,+\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .flatMap((a) => (a === 'all' ? AGENTS : [AGENT_ALIASES[a] || a]));
  for (const a of list) {
    if (!AGENTS.includes(a)) {
      console.error(`Agent "${a}" không hợp lệ. Giá trị hợp lệ: all, ${AGENTS.join(', ')}.`);
      process.exit(1);
    }
  }
  return AGENTS.filter((a) => list.includes(a));
}

/** Ghi nội dung của kit vào file chung (CLAUDE.md, AGENTS.md…) mà không xoá phần team tự viết. */
function upsertManagedBlock(dest, content) {
  const block = `${BLOCK_START}\n${String(content).replace(/\r\n/g, '\n').trim()}\n${BLOCK_END}\n`;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!fs.existsSync(dest)) return fs.writeFileSync(dest, block);
  const current = read(dest);
  const start = current.indexOf(BLOCK_START);
  const end = current.indexOf(BLOCK_END);
  if (start >= 0 && end > start) fs.writeFileSync(dest, current.slice(0, start) + block.trimEnd() + current.slice(end + BLOCK_END.length));
  else fs.writeFileSync(dest, current.replace(/\s*$/, '\n\n') + block);
}

const adapter = (...rel) => path.join(PACK_SRC, 'adapters', ...rel);

/** Hướng dẫn chung + phần gate qua CLI cho công cụ không có MCP/hook. */
function cliInstructions(label, actor) {
  const gates = read(adapter('shared', 'cli-gates.md')).replaceAll('<TOOL_LABEL>', label).replaceAll('<ACTOR>', actor);
  return `${read(adapter('shared', 'core-instructions.md')).trim()}\n\n${gates.trim()}\n`;
}

/** Danh sách lệnh: { cmd, body, hint, description }. */
function commandSources() {
  const dir = path.join(PACK_SRC, 'commands');
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = read(path.join(dir, f)).replace(/\r\n/g, '\n');
      return {
        cmd: f.replace(/\.md$/, ''),
        body: raw.replace(/^---\n[\s\S]*?\n---\n\n?/, ''),
        hint: frontmatterField(raw, 'argument-hint'),
        description: frontmatterField(raw, 'description'),
      };
    });
}

/** Đầu prompt cho công cụ không có MCP: cách gọi và bước mode begin/end qua CLI. */
function cliCommandHeader({ cmd, hint }, actor, invoke) {
  const lines = [`# BE ${cmd}`, '', `Gọi: \`${invoke}${hint ? ' ' + hint : ''}\`. Phần người dùng gõ sau lệnh là \`$ARGUMENTS\` trong hướng dẫn bên dưới.`];
  if (COMMANDS.includes(cmd)) {
    lines.push(
      '',
      `1. Bắt đầu: \`node bin/be-kit.mjs mode begin <task-folder> ${cmd} --actor ${actor}\`. Exit 1 là bị chặn: chỉ cập nhật \`tracking/workflow-status.md\` theo prompt được in ra rồi dừng.`,
      '2. Làm theo hướng dẫn bên dưới và rule mà `mode begin` in ra.',
      `3. Kết thúc: \`node bin/be-kit.mjs mode end <task-folder> ${cmd} --actor ${actor}\`, xử lý hết lỗi trước khi báo xong.`
    );
  }
  return lines.join('\n');
}

/** Skill `.agents/skills/be-<cmd>/SKILL.md` cho Antigravity (mỗi skill thành lệnh `/be-<cmd>`). */
function writeAntigravity(target) {
  copyDir(adapter('antigravity', '.agents'), path.join(target, '.agents'));
  const skillsDir = path.join(target, '.agents', 'skills');
  fs.mkdirSync(skillsDir, { recursive: true });
  for (const dir of fs.readdirSync(skillsDir).filter((d) => d.startsWith('be-'))) {
    const f = path.join(skillsDir, dir, 'SKILL.md');
    if (fs.existsSync(f) && read(f).includes(GENERATED_MARK)) fs.rmSync(path.join(skillsDir, dir), { recursive: true, force: true });
  }
  for (const c of commandSources()) {
    const content = [
      '---',
      `name: be-${c.cmd}`,
      'description: ' + JSON.stringify(`BE ${c.cmd}: ${c.description || c.cmd}`),
      '---',
      '',
      GENERATED_MARK,
      '',
      cliCommandHeader(c, 'antigravity', `/be-${c.cmd}`),
      '',
      c.body,
    ].join('\n');
    const dest = path.join(skillsDir, `be-${c.cmd}`, 'SKILL.md');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
  }
  copyFile(path.join(PACK_SRC, 'SKILL.md'), path.join(skillsDir, 'backend-delivery-standard', 'SKILL.md'));
}

/** AGENTS.md (khối be-kit) + `.codex/prompts/be-<cmd>.md`. */
function writeCodex(target) {
  upsertManagedBlock(path.join(target, 'AGENTS.md'), cliInstructions('Codex', 'codex'));
  const dir = path.join(target, '.codex', 'prompts');
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir).filter((x) => /^be-.*\.md$/.test(x))) {
    if (read(path.join(dir, f)).includes(GENERATED_MARK)) fs.rmSync(path.join(dir, f));
  }
  for (const c of commandSources()) {
    fs.writeFileSync(path.join(dir, `be-${c.cmd}.md`), [GENERATED_MARK, '', cliCommandHeader(c, 'codex', `BE ${c.cmd}`), '', c.body].join('\n'));
  }
}

function writeCursor(target) {
  copyDir(adapter('cursor', '.cursor'), path.join(target, '.cursor'));
  const always = `---\ndescription: Backend Delivery Standard (BE-Kit)\nalwaysApply: true\n---\n\n${cliInstructions('Cursor', 'cursor')}`;
  fs.writeFileSync(path.join(target, '.cursor', 'rules', 'backend-delivery-standard.mdc'), always);
}

function writeGithub(target) {
  copyDir(adapter('github', '.github'), path.join(target, '.github'));
  upsertManagedBlock(path.join(target, '.github', 'copilot-instructions.md'), cliInstructions('GitHub Copilot', 'copilot'));
}

/** CLAUDE.md (khối be-kit) + bật plugin `be` trong .claude/settings.json; plugin mang lệnh, agent, hook, MCP. */
function writeClaude(target) {
  upsertManagedBlock(path.join(target, 'CLAUDE.md'), read(adapter('claude', 'CLAUDE.md')));
  const file = path.join(target, '.claude', 'settings.json');
  let settings = {};
  if (fs.existsSync(file)) {
    try {
      settings = JSON.parse(read(file));
    } catch {
      console.warn(`Không parse được ${file}; hãy tự thêm enabledPlugins["${PLUGIN_ID}"] = true.`);
      return;
    }
  }
  settings.enabledPlugins = { ...(settings.enabledPlugins || {}), [PLUGIN_ID]: true };
  const repo = argValue('--marketplace-repo', '');
  if (repo) {
    settings.extraKnownMarketplaces = { ...(settings.extraKnownMarketplaces || {}), 'backend-delivery': { source: { source: 'github', repo } } };
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(settings, null, 2) + '\n');
  console.log(`Đã bật plugin ${PLUGIN_ID} trong .claude/settings.json. Máy chưa có marketplace thì chạy: claude plugin marketplace add <đường-dẫn-BE-Kit> rồi claude plugin install ${PLUGIN_ID}.`);
}

function ensureRunLogMergeUnion(target) {
  const file = path.join(target, '.gitattributes');
  const current = read(file);
  if (current.split(/\r?\n/).some((l) => l.trim() === RUNLOG_GITATTRIBUTES)) return;
  const prefix = current ? current.replace(/\s*$/, '\n') : '';
  fs.writeFileSync(file, `${prefix}# be-kit: run-log chỉ nối thêm dòng, gộp nhánh không conflict\n${RUNLOG_GITATTRIBUTES}\n`);
}

function init() {
  const target = targetDir();
  if (!fs.existsSync(path.join(PACK_SRC, 'pack.yaml'))) {
    console.error('`init` phải chạy từ repo kit (cần packages/pack-be). Bản be-kit.mjs trong repo dự án chỉ dùng cho new-task/status/mode/validate-*.');
    process.exit(1);
  }
  const standalone = path.join(kitRoot, 'standalone', 'be-kit.mjs');
  if (!fs.existsSync(standalone)) {
    console.error('Thiếu standalone/be-kit.mjs. Chạy `npm run build` trong repo kit trước khi init.');
    process.exit(1);
  }
  const agents = parseAgents(argValue('--agents', 'antigravity'));

  // File do kit quản lý: ghi đè.
  copyFile(standalone, path.join(target, 'bin', 'be-kit.mjs'));
  fs.rmSync(path.join(target, CONFIG_DIR, 'rules'), { recursive: true, force: true });
  copyDir(path.join(PACK_SRC, 'rules'), path.join(target, CONFIG_DIR, 'rules'));
  copyDir(path.join(PACK_SRC, 'templates'), path.join(target, CONFIG_DIR, 'templates'));
  fs.mkdirSync(path.join(target, TASKS_ROOT), { recursive: true });
  fs.writeFileSync(
    path.join(target, TASKS_ROOT, 'README.md'),
    `# Backend tasks\n\nMỗi task một thư mục \`${manifest.task_name_hint}\`, tạo bằng \`BE task <yêu cầu>\` hoặc \`node bin/be-kit.mjs new-task <tên>\`.\n`
  );

  // File của team: chỉ tạo khi chưa có.
  for (const f of fs.readdirSync(path.join(PACK_SRC, 'templates', 'shared-context'))) {
    copyIfMissing(path.join(PACK_SRC, 'templates', 'shared-context', f), path.join(target, 'docs', 'backend-context', f));
  }
  const configFile = path.join(target, manifest.project_config_file);
  if (!fs.existsSync(configFile)) {
    fs.mkdirSync(path.dirname(configFile), { recursive: true });
    fs.writeFileSync(configFile, `# Cấu hình của team cho BE-Kit.\nrequire_task_for_source: warn  # off | warn | error\nsource_paths:\n  - src/\n  - apps/\n  - libs/\n`);
  }
  ensureRunLogMergeUnion(target);

  const writers = { antigravity: writeAntigravity, claude: writeClaude, codex: writeCodex, cursor: writeCursor, github: writeGithub };
  for (const a of agents) writers[a](target);

  fs.writeFileSync(
    path.join(target, CONFIG_DIR, 'install.json'),
    JSON.stringify({ kit: 'backend-delivery', version: readKitVersion(), agents, installed_at: new Date().toISOString() }, null, 2) + '\n'
  );
  console.log(`BE-Kit đã cài vào ${target}: ${agents.map((a) => AGENT_LABELS[a]).join(', ')}.`);
  console.log('Tiếp theo: cho agent quét source và điền docs/backend-context/*.md bằng BE context (/be-context trong Antigravity, /be:context trong Claude Code), đọc lại rồi commit. Sau đó giao việc bằng BE task <yêu cầu>.');
}

// --- doctor -------------------------------------------------------------------

function doctor() {
  const target = targetDir();
  let agents;
  try {
    agents = JSON.parse(read(path.join(target, CONFIG_DIR, 'install.json'))).agents || [];
  } catch {
    agents = ['antigravity'];
  }
  if (argValue('--agents', '')) agents = parseAgents(argValue('--agents', ''));
  const cmds = ['context', 'task', 'new-task', ...COMMANDS];
  const byAgent = {
    antigravity: [
      '.agents/rules/backend-delivery-standard.md',
      '.agents/rules/backend-delivery-code.md',
      '.agents/skills/backend-delivery-standard/SKILL.md',
      ...cmds.map((c) => `.agents/skills/be-${c}/SKILL.md`),
    ],
    claude: ['CLAUDE.md', '.claude/settings.json'],
    codex: ['AGENTS.md', ...cmds.map((c) => `.codex/prompts/be-${c}.md`)],
    cursor: ['.cursor/rules/backend-delivery-standard.mdc', '.cursor/rules/backend-delivery-code.mdc', '.cursor/rules/backend-delivery-task.mdc'],
    github: [
      '.github/copilot-instructions.md',
      '.github/instructions/backend-code.instructions.md',
      '.github/instructions/backend-task.instructions.md',
      '.github/workflows/backend-delivery-standard.yml',
    ],
  };
  const required = [
    'bin/be-kit.mjs',
    `${CONFIG_DIR}/install.json`,
    manifest.project_config_file,
    ...allRuleFiles().map((r) => `${CONFIG_DIR}/rules/${r}`),
    ...REQUIRED_TASK_FILES.map((f) => `${CONFIG_DIR}/templates/${f}`),
    'docs/backend-context/project-source-context.md',
    'docs/backend-context/api-context.md',
    'docs/backend-context/feature-source-context.md',
    ...agents.flatMap((a) => byAgent[a] || []),
  ];
  let ok = true;
  console.log(`Agent đã cài: ${agents.join(', ') || '(không)'}`);
  for (const rel of required) {
    const present = fs.existsSync(path.join(target, rel));
    console.log(`${present ? 'OK' : 'MISSING'} ${rel}`);
    if (!present) ok = false;
  }
  const blockOwner = { 'CLAUDE.md': 'claude', 'AGENTS.md': 'codex', '.github/copilot-instructions.md': 'github' };
  for (const [rel, owner] of Object.entries(blockOwner)) {
    const file = path.join(target, rel);
    if (agents.includes(owner) && fs.existsSync(file) && !read(file).includes(BLOCK_START)) {
      console.log(`MISSING khối be-kit trong ${rel}`);
      ok = false;
    }
  }
  if (agents.includes('claude')) {
    let enabled = false;
    try {
      enabled = JSON.parse(read(path.join(target, '.claude', 'settings.json'))).enabledPlugins?.[PLUGIN_ID] === true;
    } catch {
      /* settings hỏng: coi như chưa bật */
    }
    console.log(enabled ? `OK plugin ${PLUGIN_ID} bật trong .claude/settings.json` : `LƯU Ý plugin ${PLUGIN_ID} chưa bật ở scope project (có thể đã cài ở scope user).`);
  }
  if (!ok) {
    console.error('Doctor failed. Chạy lại: node standalone/be-kit.mjs init --target <repo> --agents <...> (từ repo kit).');
    process.exit(args.includes('--strict') ? 1 : 0);
  }
  console.log('Doctor passed. BE-Kit đã cài đủ.');
}

// --- task ---------------------------------------------------------------------

function newTask() {
  const name = args[1];
  if (!name || name.startsWith('--')) {
    console.error(`Dùng: node bin/be-kit.mjs new-task ${manifest.task_name_hint}`);
    process.exit(1);
  }
  const target = targetDir();
  const res = scaffoldTask({ workspaceRoot: target, name, templatesDir: templatesDirFor(target) });
  if (!res.ok) {
    console.error(res.error);
    process.exit(1);
  }
  console.log(`Đã tạo ${res.taskRef} (${res.created.length} file mới${res.skipped.length ? `, giữ ${res.skipped.length} file đã có` : ''}).`);
  console.log(`Tiếp theo: ${P} plan ${res.taskRef}`);
  console.log(`Task nhỏ, rủi ro thấp, không đổi DB và không breaking API: ${P} quick ${res.taskRef}`);
}

function status() {
  const target = targetDir();
  const taskDir = requireTask(target);
  const raw = read(path.join(taskDir, manifest.status_file));
  const parsed = parseWorkflowStatus(raw);
  if (!parsed.ok) {
    console.log('workflow-status.md chưa hợp lệ:');
    for (const e of parsed.errors) console.log('- ' + e);
  } else {
    for (const f of manifest.mcp.status_fields) console.log(`${f}: ${parsed.data[f] ?? ''}`);
  }
  console.log(`blocking_questions_open (đếm từ questions.md): ${countOpenBlockingQuestions(read(path.join(taskDir, 'planning/questions.md')))}`);
  const next = nextPrompt(taskDir);
  console.log(next ? `Tiếp theo: ${next}` : 'Tiếp theo: chưa có mục "Prompt bước tiếp theo".');
}

function next() {
  const taskDir = requireTask(targetDir());
  const p = nextPrompt(taskDir);
  if (!p) {
    console.error('Chưa có mục "Prompt bước tiếp theo" trong tracking/workflow-status.md.');
    process.exit(1);
  }
  console.log(p);
}

function printResult(label, res, taskDir, check) {
  logCli(taskDir, { event: 'validate', mode: check, outcome: res.ok ? 'ok' : 'failed', codes: codesOf(res) });
  for (const w of res.warnings || []) console.log(`Cảnh báo: ${w}`);
  if (!res.ok) {
    console.error(`${label}: FAILED`);
    for (const i of res.issues) console.error(`- [${i.code}] ${i.message}`);
    process.exit(1);
  }
  console.log(`${label}: PASSED${res.scopeSource && res.scopeSource !== 'not_checked' ? ` (scope: ${res.scopeSource})` : ''}`);
}

function validateTask() {
  const taskDir = requireTask(targetDir());
  const missing = REQUIRED_TASK_FILES.filter((f) => !fs.existsSync(path.join(taskDir, f)));
  const issues = missing.map((f) => ({ code: 'TASK_FILE_MISSING', message: `Thiếu ${f}` }));
  printResult('validate-task', { ok: !issues.length, issues, warnings: [] }, taskDir, 'validate-task');
}

function validateWorkflowCmd() {
  const target = targetDir();
  const taskDir = requireTask(target);
  const res = args.includes('--no-scope') ? validateWorkflow(taskDir) : validateWorkflowAtGate(taskDir, { repoRoot: target, base: argValue('--base') || undefined });
  printResult('validate-workflow', res, taskDir, 'validate-workflow');
}

function validatePrCmd() {
  const target = targetDir();
  const taskDir = requireTask(target);
  const res = validatePr(taskDir, { repoRoot: target, base: argValue('--base') || undefined, noScope: args.includes('--no-scope') });
  printResult('validate-pr', res, taskDir, 'validate-pr');
}

// --- mode begin/end -------------------------------------------------------------

function lastModeRun(taskDir, cmd) {
  const { records } = readRunLog(taskDir);
  let start = -1;
  records.forEach((r, i) => {
    if (r.event === 'mode_start' && r.mode === cmd) start = i;
  });
  if (start < 0) return { startedAt: undefined, failedEnds: 0 };
  const failedEnds = records.slice(start + 1).filter((r) => r.event === 'mode_end' && r.mode === cmd && r.outcome === 'failed').length;
  return { startedAt: Date.parse(records[start].ts), failedEnds };
}

function mode() {
  const target = targetDir();
  const [, action, taskInput, modeInput] = args;
  const cmd = normalizeCommand(modeInput || '');
  if (!['begin', 'end'].includes(action) || !taskInput || !cmd) {
    console.error(`Dùng: be-kit mode begin|end <task> <mode> [--target repo] [--actor antigravity|codex|cursor] [--base ref] [--no-log]\nMode hợp lệ: ${COMMANDS.join(', ')}.`);
    process.exit(1);
  }
  const taskDir = resolveTask(taskInput, target);
  const taskRef = relativePosix(target, taskDir) || taskInput;
  if (action === 'begin') {
    const rules = rulesDirFor(target);
    const b = modeBriefing({
      taskDir,
      taskRef,
      command: cmd,
      rulesDir: rules.dir,
      rulesLabel: rules.label,
      newTaskHint: `Chạy node bin/be-kit.mjs new-task ${path.basename(taskDir)} để tạo task, rồi chạy lại: node bin/be-kit.mjs mode begin ${taskRef} ${cmd}`,
      finishHint: `Trước khi kết thúc: cập nhật ${manifest.status_file} rồi chạy node bin/be-kit.mjs mode end ${taskRef} ${cmd}.`,
      workspaceRoot: target,
      templatesDir: templatesDirFor(target),
    });
    console.log(b.text);
    if (b.entry) {
      logCli(taskDir, { event: 'mode_start', mode: cmd });
      if (!b.ok) logCli(taskDir, { event: 'entry_blocked', mode: cmd, codes: b.entry.reasonCodes });
    }
    process.exit(b.ok ? 0 : 1);
  }
  const { startedAt, failedEnds } = lastModeRun(taskDir, cmd);
  const res = evaluateModeCompletion({
    taskDir,
    taskRef,
    command: cmd,
    startedAt,
    repoRoot: target,
    base: argValue('--base') || undefined,
  });
  logCli(taskDir, {
    event: 'mode_end',
    mode: cmd,
    outcome: res.ok ? 'pass' : 'failed',
    attempt: failedEnds + 1,
    duration_ms: startedAt ? Math.max(0, Date.now() - startedAt) : undefined,
    codes: codesOf(res),
  });
  if (!res.ok) {
    console.error(`mode end: ${P} ${cmd} cho ${taskRef} chưa đạt gate kết thúc mode:`);
    for (const i of res.issues) console.error(`- [${i.code}] ${i.message}`);
    process.exit(1);
  }
  console.log(`mode end: PASSED (${P} ${cmd}${res.refused ? ', mode bị gate từ chối và đã route đúng' : ''}).`);
  const p = nextPrompt(taskDir);
  if (p) console.log(`Tiếp theo: ${p}`);
}

function report() {
  const target = targetDir();
  const task = args[1] && !args[1].startsWith('--') ? resolveTask(args[1], target) : undefined;
  const result = buildReport({ repoRoot: target, tasksRoot: TASKS_ROOT, runLogFile: RUNLOG_FILE, task, since: argValue('--since') || undefined });
  if (args.includes('--json')) console.log(JSON.stringify(result, null, 2));
  else process.stdout.write(renderReport(result, { title: 'Báo cáo BE-Kit', tasksRoot: TASKS_ROOT, runLogFile: RUNLOG_FILE, currentVersion: readKitVersion() }));
}

function help() {
  console.log(`BE-Kit CLI v${readKitVersion()} — backend delivery (Node: NestJS/Express)

Commands:
  init [--target repo] [--agents all|antigravity,claude,codex,cursor,github]
                                                Cài kit BE vào repo dự án (chạy từ repo kit)
  doctor [--target repo] [--strict]             Kiểm file của kit trong repo dự án
  new-task ${manifest.task_name_hint} [--target repo]     Tạo task folder trong ${TASKS_ROOT}/
  status <task>                                 Trạng thái, gate chính, bước tiếp theo
  next <task>                                   In "Prompt bước tiếp theo"
  mode begin <task> <mode> [--actor <tool>]     Gate lúc vào mode + rule của mode
  mode end <task> <mode> [--actor <tool>] [--base ref]
                                                Gate kết thúc mode
  validate-task <task>                          Đủ file bắt buộc của task
  validate-workflow <task> [--base ref] [--no-scope]
                                                Mọi gate của workflow-status.md
  validate-pr <task> [--base ref] [--no-scope]  Gate trước khi mở PR
  report [<task>] [--since YYYY-MM-DD] [--json] Tổng hợp run-log

Mode: ${COMMANDS.join(', ')}.`);
}

const handlers = {
  init,
  doctor,
  'new-task': newTask,
  status,
  next,
  mode,
  'validate-task': validateTask,
  'validate-workflow': validateWorkflowCmd,
  'validate-pr': validatePrCmd,
  report,
  help,
  '--help': help,
  '-h': help,
};
(handlers[command] || (() => {
  console.error(`Lệnh không hợp lệ: ${command}`);
  help();
  process.exit(1);
}))();
