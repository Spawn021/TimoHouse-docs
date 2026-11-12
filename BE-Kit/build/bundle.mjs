#!/usr/bin/env node
/**
 * Sinh mọi output của BE-Kit từ nguồn `packages/pack-be/` và `bin/be-kit.mjs`:
 *
 *   bin/be-kit.mjs                         -> standalone/be-kit.mjs (bundle, `init` copy vào repo dự án)
 *   packages/pack-be/{commands,agents,...} -> plugins/be/ (plugin Claude Code: lệnh /be:*, subagent,
 *                                             skill kèm rule/template, hook và MCP server đã bundle)
 *   packages/pack-be/plugin/plugin.json    -> .claude-plugin/marketplace.json (marketplace `backend-delivery`)
 *
 * Version chỉ đổi ở package.json gốc; script đồng bộ sang package và manifest.
 *
 *   node build/bundle.mjs          # ghi
 *   node build/bundle.mjs --check  # không ghi, exit 1 nếu lệch (CI)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACK = path.join(ROOT, 'packages', 'pack-be');
const CHECK_ONLY = process.argv.includes('--check');
const VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
const { default: manifest } = await import(pathToFileURL(path.join(PACK, 'src', 'manifest.gen.mjs')).href);

const PLUGIN_NAME = manifest.plugin;
const PLUGIN_ROOT = `plugins/${PLUGIN_NAME}`;
const SKILL_DIR = `${PLUGIN_ROOT}/${manifest.mcp.skill_dir}`;
const TOOL = (name) => `${manifest.mcp.tool_prefix}_${name}`;
const AGENT_FOR = Object.fromEntries(Object.entries(manifest.modes).map(([cmd, m]) => [cmd, m.agent]));
const MODE_COMMANDS = Object.keys(manifest.modes);

const lf = (t) => String(t).replace(/\r\n/g, '\n');
const readSrc = (...rel) => lf(fs.readFileSync(path.join(PACK, ...rel), 'utf8'));
const posix = (p) => p.split(path.sep).join('/');
/** path tương đối repo (POSIX) -> nội dung. */
const outputs = new Map();
/** Thư mục do script quản lý trọn vẹn: file thừa trong đó bị xoá (hoặc báo khi --check). */
const managedDirs = new Set();
let drift = false;
const emit = (rel, content) => outputs.set(rel, lf(content));

function listFiles(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? listFiles(full, base) : [posix(path.relative(base, full))];
  });
}
const setVersion = (text) => text.replace(/("version":\s*")[^"]*(")/, `$1${VERSION}$2`);

// --- 1. Version ---------------------------------------------------------------

for (const rel of ['packages/engine/package.json', 'packages/pack-be/package.json']) {
  emit(rel, setVersion(lf(fs.readFileSync(path.join(ROOT, rel), 'utf8'))));
}

// --- 2. Plugin Claude Code ----------------------------------------------------

managedDirs.add(PLUGIN_ROOT);
emit(`${PLUGIN_ROOT}/.claude-plugin/plugin.json`, setVersion(readSrc('plugin', 'plugin.json')));
emit(`${PLUGIN_ROOT}/.mcp.json`, readSrc('plugin', 'mcp.json'));
emit(`${PLUGIN_ROOT}/hooks/hooks.json`, readSrc('plugin', 'hooks.json'));

// Skill kèm rule và template: MCP `be_begin_mode` đọc rule/template ở đây khi repo chưa `be-kit init`.
emit(`${SKILL_DIR}/SKILL.md`, readSrc('SKILL.md'));
for (const dir of ['rules', 'templates']) {
  for (const rel of listFiles(path.join(PACK, dir))) emit(`${SKILL_DIR}/${dir}/${rel}`, readSrc(dir, rel));
}

const FRONTMATTER_RE = /^---\n[\s\S]*?\n---\n/;

/** Lệnh giao cho subagent: main thread chỉ điều phối. */
function delegationBlock(command, agent) {
  return [
    '## Điều phối (Claude Code)',
    '',
    `Bạn là main thread điều phối. Không tự làm việc của mode này, không tự gọi \`${TOOL('begin_mode')}\` (subagent sẽ tự kiểm tra gate).`,
    '',
    `1. Delegate cho subagent \`${PLUGIN_NAME}:${agent}\` bằng Agent tool, chạy foreground. Brief gồm: mode \`${command}\`; task folder lấy từ argument; đường dẫn tuyệt đối của workspace; nguyên văn mọi input người dùng chỉ đưa trong hội thoại (SRS, API spec, câu trả lời, CR), mỗi input trong một khối \`<untrusted-input kind="srs|api|cr|answer|other">…</untrusted-input>\`; và toàn bộ mục "Hướng dẫn mode" bên dưới.`,
    `2. Khi agent trả về, gọi \`${TOOL('validate_workflow')}\` cho task. \`FAILED\` thì gửi lỗi cho chính agent đó sửa; không tự sửa thay.`,
    `3. Trả lời người dùng ngắn gọn: artifact đã cập nhật, blocker nếu có, và dòng \`Tiếp theo: …\` lấy từ \`${manifest.status_file}\` (hoặc \`${TOOL('next_step')}\`).`,
    '',
    'Không tự chuyển sang mode kế tiếp.',
    '',
    '## Hướng dẫn mode',
    '',
  ].join('\n');
}

/** Mode chạy inline ở main thread (vd quick): tự mở và đóng gate qua MCP. */
function inlineGateBlock(command) {
  return [
    '## Gate (Claude Code)',
    '',
    `1. Gọi \`${TOOL('begin_mode')}\` (\`workspace_root\`, \`task_folder\`, \`mode: ${command}\`). \`BỊ CHẶN\` thì chỉ cập nhật \`${manifest.status_file}\` theo prompt được trả về rồi dừng.`,
    `2. Trước khi kết thúc gọi \`${TOOL('scope_diff')}\` và \`${TOOL('validate_workflow')}\`, sửa tới khi \`PASSED\`.`,
    '',
    '## Hướng dẫn',
    '',
  ].join('\n');
}

for (const file of listFiles(path.join(PACK, 'commands'))) {
  const raw = readSrc('commands', file);
  const command = file.replace(/\.md$/, '');
  const fm = raw.match(FRONTMATTER_RE);
  const agent = AGENT_FOR[command];
  let block = '';
  if (MODE_COMMANDS.includes(command)) block = agent ? delegationBlock(command, agent) : inlineGateBlock(command);
  // commands/ trong plugin chỉ nhận file .md phẳng; namespace = tên plugin + tên file => `/be:plan`.
  emit(`${PLUGIN_ROOT}/commands/${file}`, fm && block ? fm[0] + '\n' + block + raw.slice(fm[0].length).replace(/^\n+/, '') : raw);
}

const protocol = readSrc('agents', '_protocol.md');
for (const file of listFiles(path.join(PACK, 'agents'))) {
  if (file.startsWith('_')) continue;
  emit(`${PLUGIN_ROOT}/agents/${file}`, `${readSrc('agents', file).trimEnd()}\n\n${protocol}`);
}

// --- 3. Marketplace -------------------------------------------------------------

const plugin = JSON.parse(readSrc('plugin', 'plugin.json'));
emit(
  '.claude-plugin/marketplace.json',
  JSON.stringify(
    {
      $schema: 'https://json.schemastore.org/claude-code-marketplace.json',
      name: 'backend-delivery',
      description: 'Bộ chuẩn backend delivery tiếng Việt cho Node (NestJS/Express): plan/cook/review/test/pr gate, API contract, migration có rollback, câu hỏi blocking và test evidence.',
      owner: { name: plugin.author.name },
      plugins: [
        {
          name: PLUGIN_NAME,
          source: `./${PLUGIN_ROOT}`,
          description: plugin.description,
          version: VERSION,
          author: plugin.author,
          license: plugin.license,
          category: 'development',
          keywords: plugin.keywords,
        },
      ],
    },
    null,
    2
  ) + '\n'
);

// --- 4. Bundle (esbuild) --------------------------------------------------------

// gray-matter là CJS và gọi `require('fs')`; output ESM không có `require` nên tạo bằng node:module.
const REQUIRE_BANNER = "import { createRequire as __bekCreateRequire } from 'node:module';\nconst require = __bekCreateRequire(import.meta.url);";

async function bundle(entry, to, { shebang = false } = {}) {
  const result = await esbuild.build({
    entryPoints: [path.join(ROOT, entry)],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    write: false,
    logLevel: 'silent',
    define: { __BE_KIT_VERSION__: JSON.stringify(VERSION) },
    banner: { js: (shebang ? '#!/usr/bin/env node\n' : '') + REQUIRE_BANNER },
  });
  // esbuild giữ shebang của file nguồn ở dòng đầu; bỏ bản trùng.
  emit(to, result.outputFiles[0].text.replace(/^(#![^\n]*\n)(#![^\n]*\n)/, '$1'));
}

managedDirs.add('standalone');
await bundle('bin/be-kit.mjs', 'standalone/be-kit.mjs', { shebang: true });
await bundle('packages/pack-be/plugin/be-hook.mjs', `${PLUGIN_ROOT}/hooks/be-hook.mjs`);
await bundle('packages/pack-be/plugin/be-mcp.mjs', `${PLUGIN_ROOT}/mcp/be-kit-mcp.mjs`);

// --- 5. Ghi hoặc kiểm tra -------------------------------------------------------

for (const dir of managedDirs) {
  for (const rel of listFiles(path.join(ROOT, dir))) {
    const full = `${dir}/${rel}`;
    if (outputs.has(full)) continue;
    if (CHECK_ONLY) {
      drift = true;
      console.error(`[bundle] THỪA: ${full} (không có trong nguồn, có thể bị sửa tay)`);
    } else {
      fs.rmSync(path.join(ROOT, full), { force: true });
      console.log(`[bundle] xoá file thừa ${full}`);
    }
  }
}

let written = 0;
for (const [rel, content] of outputs) {
  const file = path.join(ROOT, rel);
  const current = fs.existsSync(file) ? lf(fs.readFileSync(file, 'utf8')) : null;
  if (current === content) continue;
  if (CHECK_ONLY) {
    drift = true;
    console.error(`[bundle] ${current === null ? 'THIẾU' : 'LỆCH'}: ${rel}`);
    continue;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  written += 1;
}

if (CHECK_ONLY && drift) {
  console.error('\n[bundle] Output lệch với nguồn. Chạy `npm run build` rồi commit lại; đã sửa tay ở output thì đưa thay đổi vào packages/pack-be trước.');
  process.exit(1);
}
console.log(
  CHECK_ONLY
    ? `[bundle] Không có lệch. ${outputs.size} file đã đồng bộ (version ${VERSION}).`
    : `[bundle] ${outputs.size} file, ${written} file được ghi lại (version ${VERSION}). Không sửa tay output: plugins/, standalone/, .claude-plugin/.`
);
