/* Build mockup/ → dist/ cho Netlify.
   - Kiểm tra cú pháp toàn bộ JS (node --check) trước khi build.
   - Copy nguyên trạng mockup/ (không bundler, không đổi thứ tự script).
   - Gắn ?v=<git sha> vào <script src> / <link href> trong index.html để tránh cache cũ.
   - Sinh build.json, _redirects, _headers.
   Dùng: node scripts/build.mjs [--check-only] */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'mockup');
const OUT = path.join(ROOT, 'dist');
const checkOnly = process.argv.includes('--check-only');

const walk = (dir, filter, acc = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, filter, acc); else if (filter(p)) acc.push(p);
  }
  return acc;
};

/* 1. Kiểm tra cú pháp JS */
const jsFiles = walk(path.join(SRC, 'js'), p => p.endsWith('.js'));
let bad = 0;
for (const f of jsFiles) {
  const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  if (r.status !== 0) { bad++; console.error(`✗ ${path.relative(ROOT, f)}\n${r.stderr.trim()}`); }
}
if (bad) { console.error(`\nBuild dừng: ${bad} file JS lỗi cú pháp.`); process.exit(1); }
console.log(`✓ Cú pháp OK: ${jsFiles.length} file JS`);
if (checkOnly) process.exit(0);

/* 2. Stamp phiên bản */
let sha = '';
try { sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { /* không có git */ }
const builtAt = new Date().toISOString();
const stamp = sha || String(Date.now());
const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;

/* 3. Copy mockup/ → dist/ */
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, { recursive: true, filter: p => path.basename(p).toLowerCase() !== 'readme.md' });

/* 4. Cache-busting trong index.html (chỉ đường dẫn tương đối js/ css/ assets/) */
const indexPath = path.join(OUT, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
let stamped = 0;
html = html.replace(/(<(?:script|link)\b[^>]*?\b(?:src|href)=")((?:js|css|assets)\/[^"?#]+)(")/g, (m, pre, url, post) => { stamped++; return `${pre}${url}?v=${stamp}${post}`; });
html = html.replace('</head>', `<meta name="build" content="${stamp} ${builtAt}">\n</head>`);
fs.writeFileSync(indexPath, html);

/* 5. Metadata + cấu hình Netlify */
fs.writeFileSync(path.join(OUT, 'build.json'), JSON.stringify({ version, sha: sha || null, builtAt }, null, 2) + '\n');
fs.writeFileSync(path.join(OUT, '_redirects'), '/*  /index.html  200\n');
fs.writeFileSync(path.join(OUT, '_headers'), [
  '/index.html', '  Cache-Control: no-cache',
  '/build.json', '  Cache-Control: no-cache',
  '/js/*', '  Cache-Control: public, max-age=31536000, immutable',
  '/css/*', '  Cache-Control: public, max-age=31536000, immutable',
  '/assets/*', '  Cache-Control: public, max-age=86400', '',
].join('\n'));

/* 6. Tổng kết */
const files = walk(OUT, () => true);
const bytes = files.reduce((s, f) => s + fs.statSync(f).size, 0);
console.log(`✓ Build xong → dist/  (${files.length} file, ${(bytes / 1024 / 1024).toFixed(2)} MB, stamp ${stamp}, ${stamped} thẻ đã gắn ?v=)`);
