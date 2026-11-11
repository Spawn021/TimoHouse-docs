/* Static server cho demo local (thay python -m http.server).
   node scripts/serve.mjs          → phục vụ mockup/ tại http://localhost:8765
   node scripts/serve.mjs --dist   → phục vụ dist/ (mô phỏng _redirects: đường dẫn lạ → index.html)
   PORT=9000 node scripts/serve.mjs → đổi cổng */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const useDist = process.argv.includes('--dist');
const DIR = path.join(ROOT, useDist ? 'dist' : 'mockup');
const PORT = Number(process.env.PORT) || 8765;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.csv': 'text/csv; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2' };

if (!fs.existsSync(path.join(DIR, 'index.html'))) { console.error(`Không thấy ${path.relative(ROOT, DIR)}/index.html${useDist ? ' – chạy "npm run build" trước.' : ''}`); process.exit(1); }

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.normalize(path.join(DIR, urlPath === '/' ? 'index.html' : urlPath));
  if (!file.startsWith(DIR)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    // Mô phỏng _redirects (/* → /index.html 200) để URL không có # vẫn vào app
    if (!path.extname(urlPath)) file = path.join(DIR, 'index.html');
    else { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404 ' + urlPath); }
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`TimoHouse mockup (${path.relative(ROOT, DIR)}/) → http://localhost:${PORT}  (Ctrl+C để dừng)`));
