/* TimoHouse mockup – helpers dùng chung (namespace TH) */
window.TH = window.TH || {};
(function (TH) {
  const F = {};
  F.DEMO_TODAY = '2026-10-28';
  F.today = () => (TH.store && TH.store.state && TH.store.state.meta.today) || F.DEMO_TODAY;
  F.pad = (n, l = 2) => String(n).padStart(l, '0');
  F.uid = (p = 'id') => p + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  F.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  F.vnd = (n, opt = {}) => {
    if (n == null || isNaN(n)) return '-';
    const s = Math.abs(Math.round(n)).toLocaleString('en-US');
    return (n < 0 ? '-' : '') + s + (opt.unit ? ' ' + opt.unit : '');
  };
  F.vndSuffix = (n) => F.vnd(n) + ' đ';
  F.short = (n) => { if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + ' tỷ'; if (n >= 1e6) return Math.round(n / 1e6) + 'M'; if (n >= 1e3) return Math.round(n / 1e3) + 'K'; return String(n); };
  F.pct = (a, b) => b ? Math.round(a / b * 100) : 0;
  // dates: ISO 'YYYY-MM-DD'
  F.parseISO = (s) => { if (!s) return null; const [y, m, d] = s.slice(0, 10).split('-').map(Number); return new Date(y, m - 1, d); };
  F.toISO = (d) => d.getFullYear() + '-' + F.pad(d.getMonth() + 1) + '-' + F.pad(d.getDate());
  F.date = (s) => { if (!s) return '-'; const d = F.parseISO(s); return F.pad(d.getDate()) + '/' + F.pad(d.getMonth() + 1) + '/' + d.getFullYear(); };
  F.datetime = (s) => { if (!s) return '-'; const t = s.slice(11, 16); return F.date(s) + (t ? ' ' + t : ''); };
  F.fromVN = (s) => { if (!s) return ''; const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if (!m) return s; return m[3] + '-' + F.pad(m[2]) + '-' + F.pad(m[1]); };
  F.addDays = (s, n) => { const d = F.parseISO(s); d.setDate(d.getDate() + n); return F.toISO(d); };
  F.addMonths = (s, n) => { const d = F.parseISO(s); const day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n); const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(day, last)); return F.toISO(d); };
  F.daysBetween = (a, b) => Math.round((F.parseISO(b) - F.parseISO(a)) / 86400000);
  F.daysUntil = (s) => F.daysBetween(F.today(), s);
  F.daysOverdue = (s) => Math.max(0, F.daysBetween(s, F.today()));
  F.period = (s) => s ? s.slice(0, 7) : '';               // '2026-10'
  F.periodLabel = (p) => { if (!p) return '-'; const [y, m] = p.split('-'); return 'Tháng ' + Number(m) + '/' + y; };
  F.periodShort = (p) => { if (!p) return '-'; const [y, m] = p.split('-'); return m + '/' + y; };
  F.monthsDiff = (a, b) => { const da = F.parseISO(a), db = F.parseISO(b); return (db.getFullYear() - da.getFullYear()) * 12 + (db.getMonth() - da.getMonth()) + (db.getDate() >= da.getDate() - 1 ? 1 : 0); };
  F.durationText = (a, b) => { const d = F.daysBetween(a, b); if (d < 0) return '-'; const m = Math.floor(d / 30), r = d % 30; return (m ? m + ' tháng ' : '') + (r ? r + ' ngày' : m ? '' : '0 ngày'); };
  F.nowISO = () => F.today() + 'T' + F.pad(new Date().getHours()) + ':' + F.pad(new Date().getMinutes());
  F.initials = (name) => (name || '?').trim().split(/\s+/).map(w => w[0]).filter(Boolean).slice(-2).join('').toUpperCase();
  F.num = (v) => { const n = Number(String(v).replace(/[^\d.-]/g, '')); return isNaN(n) ? 0 : n; };
  F.slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  F.norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase();
  // số tiền bằng chữ (VND)
  const DIG = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  function read3(n, full) {
    const tr = Math.floor(n / 100), ch = Math.floor(n % 100 / 10), dv = n % 10; let s = '';
    if (full || tr > 0) { s += DIG[tr] + ' trăm'; if (ch === 0 && dv > 0) s += ' lẻ'; }
    if (ch > 1) { s += ' ' + DIG[ch] + ' mươi'; if (dv === 1) s += ' mốt'; else if (dv === 5) s += ' lăm'; else if (dv > 0) s += ' ' + DIG[dv]; }
    else if (ch === 1) { s += ' mười'; if (dv === 5) s += ' lăm'; else if (dv > 0) s += ' ' + DIG[dv]; }
    else if (dv > 0) s += ' ' + DIG[dv];
    return s.trim();
  }
  F.words = (n) => {
    n = Math.round(Math.abs(n || 0)); if (n === 0) return 'Không đồng';
    const units = ['', ' nghìn', ' triệu', ' tỷ']; const parts = []; let i = 0;
    while (n > 0) { parts.unshift({ v: n % 1000, u: units[i] }); n = Math.floor(n / 1000); i++; }
    const s = parts.map((p, idx) => p.v === 0 ? '' : read3(p.v, idx > 0) + p.u).filter(Boolean).join(' ').trim();
    return s.charAt(0).toUpperCase() + s.slice(1) + ' đồng';
  };
  F.download = (name, content, type = 'text/plain;charset=utf-8') => {
    const blob = new Blob(['﻿' + content], { type }); const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  F.csv = (rows, headers) => {
    const q = v => { v = v == null ? '' : String(v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    return [headers.map(q).join(','), ...rows.map(r => r.map(q).join(','))].join('\n');
  };
  F.parseCSV = (text) => {
    const rows = []; let row = [], cell = '', q = false; text = text.replace(/^﻿/, '');
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
      else if (c === '"') q = true; else if (c === ',' || c === ';') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
      else cell += c;
    }
    if (cell.length || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(r => r.some(c => c.trim() !== ''));
  };
  F.hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(16); };
  F.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  F.sum = (arr, f) => arr.reduce((s, x) => s + (f ? f(x) : x), 0);
  F.by = (arr, key) => { const m = {}; arr.forEach(x => { const k = typeof key === 'function' ? key(x) : x[key]; (m[k] = m[k] || []).push(x); }); return m; };
  F.idx = (arr) => { const m = {}; arr.forEach(x => m[x.id] = x); return m; };
  F.cmp = (a, b) => (a > b ? 1 : a < b ? -1 : 0);
  F.pluralVN = (n, w) => n + ' ' + w;
  F.dateInputToISO = (v) => v || '';
  TH.f = F;
  Object.assign(TH, { esc: F.esc, vnd: F.vnd, fdate: F.date, uid: F.uid });
})(window.TH);
