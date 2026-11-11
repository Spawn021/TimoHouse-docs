/* Chart SVG thuần: stacked bar, bar + line, donut */
(function (TH) {
  const U = TH.ui, esc = TH.f.esc;
  const C = {};
  C.legend = (series) => `<div class="legend">${series.map(s => s.line ? `<span class="it"><span class="ln"></span>${esc(s.label)}</span>` : `<span class="it"><span class="sw" style="background:${s.color}"></span>${esc(s.label)}</span>`).join('')}</div>`;
  /* groups:[{label,sub,values:[n..]}], series:[{label,color}] */
  C.stackedBar = ({ groups, series, height = 230, max }) => {
    const W = 640, H = height, padL = 36, padB = 44, padT = 10; const cw = (W - padL - 10) / groups.length;
    const mx = max || Math.max(1, ...groups.map(g => g.values.reduce((a, b) => a + b, 0))); const nice = Math.ceil(mx / 20) * 20 || 20;
    const y = (v) => padT + (H - padT - padB) * (1 - v / nice);
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">`;
    for (let i = 0; i <= 5; i++) { const v = nice / 5 * i; s += `<line x1="${padL}" x2="${W - 6}" y1="${y(v)}" y2="${y(v)}" stroke="#EEF2F7"/><text x="${padL - 6}" y="${y(v) + 4}" font-size="10" fill="#94A3B8" text-anchor="end">${Math.round(v)}</text>`; }
    groups.forEach((g, gi) => {
      const bw = Math.min(56, cw * .5); const x = padL + cw * gi + (cw - bw) / 2; let acc = 0;
      g.values.forEach((v, si) => { if (!v) return; const y1 = y(acc + v), y0 = y(acc); s += `<rect x="${x}" y="${y1}" width="${bw}" height="${Math.max(0, y0 - y1)}" fill="${series[si].color}" rx="${si === g.values.length - 1 ? 3 : 0}"/>`; if (y0 - y1 > 12) s += `<text x="${x + bw / 2}" y="${(y0 + y1) / 2 + 4}" font-size="10" font-weight="600" fill="${series[si].dark ? '#1E293B' : '#fff'}" text-anchor="middle">${v}</text>`; acc += v; });
      s += `<text x="${x + bw / 2}" y="${H - padB + 16}" font-size="11" fill="#334155" text-anchor="middle" font-weight="500">${esc(g.label)}</text>`; if (g.sub) s += `<text x="${x + bw / 2}" y="${H - padB + 30}" font-size="10" fill="#94A3B8" text-anchor="middle">${esc(g.sub)}</text>`;
    });
    return s + '</svg>';
  };
  /* bars: [{label, a, b}] a = đã thu, b = còn phải thu; line pct */
  C.barLine = ({ groups, height = 230, colorA = '#1D4ED8', colorB = '#BFDBFE', lineColor = '#2563EB' }) => {
    const W = 640, H = height, padL = 46, padR = 40, padB = 34, padT = 12; const cw = (W - padL - padR) / groups.length;
    const mx = Math.max(1, ...groups.map(g => g.a + g.b)); const nice = Math.ceil(mx / 1e8) * 1e8 || 1e8;
    const y = (v) => padT + (H - padT - padB) * (1 - v / nice); const yp = (p) => padT + (H - padT - padB) * (1 - p / 100);
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">`;
    for (let i = 0; i <= 5; i++) { const v = nice / 5 * i; s += `<line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}" stroke="#EEF2F7"/><text x="${padL - 6}" y="${y(v) + 4}" font-size="10" fill="#94A3B8" text-anchor="end">${TH.f.short(v)}</text><text x="${W - padR + 6}" y="${yp(i * 20) + 4}" font-size="10" fill="#94A3B8">${i * 20}%</text>`; }
    let pts = [];
    groups.forEach((g, gi) => { const bw = Math.min(50, cw * .45); const x = padL + cw * gi + (cw - bw) / 2; s += `<rect x="${x}" y="${y(g.a + g.b)}" width="${bw}" height="${Math.max(0, y(g.a) - y(g.a + g.b))}" fill="${colorB}" rx="3"/><rect x="${x}" y="${y(g.a)}" width="${bw}" height="${Math.max(0, y(0) - y(g.a))}" fill="${colorA}"/>`; if (y(0) - y(g.a) > 14) s += `<text x="${x + bw / 2}" y="${y(0) - 6}" font-size="10" fill="#fff" text-anchor="middle" font-weight="600">${TH.f.short(g.a)}</text>`; s += `<text x="${x + bw / 2}" y="${H - padB + 16}" font-size="11" fill="#334155" text-anchor="middle" font-weight="500">${esc(g.label)}</text>`; const pct = g.a + g.b ? Math.round(g.a / (g.a + g.b) * 100) : 0; pts.push([x + bw / 2, yp(pct), pct]); });
    s += `<polyline points="${pts.map(p => p[0] + ',' + p[1]).join(' ')}" fill="none" stroke="${lineColor}" stroke-width="2"/>`;
    pts.forEach(p => s += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${lineColor}" stroke="#fff" stroke-width="2"/><text x="${p[0]}" y="${p[1] - 9}" font-size="10" fill="#1E293B" text-anchor="middle" font-weight="600">${p[2]}%</text>`);
    return s + '</svg>';
  };
  /* donut: items [{label,value,color}] */
  C.donut = ({ items, size = 170, centerLabel = '', centerSub = '' }) => {
    const total = Math.max(1, items.reduce((a, b) => a + b.value, 0)); const r = 62, cx = 90, cy = 90, sw = 22; let acc = 0;
    const arcs = items.filter(i => i.value > 0).map(it => { const a0 = acc / total * Math.PI * 2 - Math.PI / 2; acc += it.value; const a1 = acc / total * Math.PI * 2 - Math.PI / 2; const large = a1 - a0 > Math.PI ? 1 : 0; const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1 - .001), y1 = cy + r * Math.sin(a1 - .001); return `<path d="M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1}" fill="none" stroke="${it.color}" stroke-width="${sw}"/>`; }).join('');
    return `<svg viewBox="0 0 180 180" style="width:${size}px;height:${size}px;display:block;margin:0 auto">${arcs}<text x="90" y="86" text-anchor="middle" font-size="28" font-weight="700" fill="#0F2A5F">${esc(centerLabel)}</text><text x="90" y="106" text-anchor="middle" font-size="11" fill="#64748B">${esc(centerSub)}</text></svg>`;
  };
  C.spark = (vals, color = '#2563EB', w = 120, h = 32) => { const mx = Math.max(1, ...vals), n = vals.length; const pts = vals.map((v, i) => (i / (n - 1) * (w - 4) + 2) + ',' + (h - 2 - v / mx * (h - 6))); return `<svg viewBox="0 0 ${w} ${h}" style="width:${w}px;height:${h}px"><polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="2"/></svg>`; };
  TH.chart = C;
})(window.TH);
