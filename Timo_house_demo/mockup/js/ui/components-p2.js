/* UI kit Phase 2: kanban, lịch tháng, xem tài liệu OCR, chip/progress, countdown, stepper trạng thái, chart cột+đường / funnel, icon mới */
(function (TH) {
  const F = TH.f, U = TH.ui, esc = F.esc;
  /* ---- icon mới (Lucide subset) ---- */
  Object.assign(TH.icons, {
    kanban: '<path d="M6 5v11M10 5v6M14 5v14M18 5v9"/>', 'grip-vertical': '<circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>', flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>', thermometer: '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
    'phone-call': '<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>', timer: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/>', 'git-merge': '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>', 'hard-hat': '<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2zM10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5M4 15v-3a6 6 0 0 1 6-6M14 6a6 6 0 0 1 6 6v3"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>', 'calendar-days': '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', pin: '<line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>',
    'refresh-cw': '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>', 'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>', 'zoom-in': '<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/>', 'zoom-out': '<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>', trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/>', target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', 'trending-down': '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>', 'arrow-down': '<path d="M12 5v14M19 12l-7 7-7-7"/>', lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>', 'check-square': '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>', 'file-warning': '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M12 9v4M12 17h.01"/>',
  });

  /* ---- Kanban: cột cố định, danh sách cuộn độc lập, sắp xếp trong/giữa cột ---- */
  U.announce = U.announce || ((message) => {
    let live = document.querySelector('[data-app-live]');
    if (!live) { live = document.createElement('div'); live.className = 'sr-only'; live.dataset.appLive = '1'; live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite'); live.setAttribute('aria-atomic', 'true'); document.body.appendChild(live); }
    live.textContent = '';
    setTimeout(() => { live.textContent = message; }, 20);
  });
  U.kanban = ({ cols, cards, addAct = 'add-card', draggable = true, label = 'Bảng Kanban' }) => `<div class="kanban-shell" data-kb-shell><div class="kanban" role="region" aria-label="${esc(label)}">${cols.map(c => {
    const items = cards.filter(x => x.col === c.key);
    return `<section class="kb-col" data-col="${esc(c.key)}" aria-label="${esc(c.label)}"><header class="kb-h ${c.color || ''}"><span class="kb-title"><i></i><b>${esc(c.label)}</b></span><span class="cnt" aria-label="${c.count != null ? c.count : items.length} lead">${c.count != null ? c.count : items.length}</span></header><div class="kb-body" data-kb-drop="${esc(c.key)}" data-col-label="${esc(c.label)}"><div class="kb-list" role="list">${items.map(x => {
      const canDrag = draggable && x.draggable !== false;
      const cardLabel = x.label || x.title || 'lead';
      return `<article class="kb-card ${esc(x.cls || '')} ${x.flash ? 'just-moved' : ''}" role="listitem" data-kb-card="${esc(x.id)}" data-col="${esc(c.key)}" data-label="${esc(cardLabel)}">${canDrag ? `<button type="button" class="kb-drag-handle" draggable="true" data-kb-handle aria-label="Kéo để di chuyển ${esc(cardLabel)}" title="Kéo để di chuyển">${TH.icon('grip-vertical')}</button>` : ''}${x.html}</article>`;
    }).join('')}</div><div class="kb-empty">Thả lead vào đây</div></div>${c.addable === false ? '' : `<footer class="kb-foot"><button type="button" class="kb-add" data-act="${addAct}" data-col="${esc(c.key)}">${TH.icon('plus')} Thêm lead</button></footer>`}</section>`;
  }).join('')}</div></div>`;
  U.bindKanban = (root, options) => {
    const opts = typeof options === 'function' ? { onMove: ({ id, from, to }) => options(id, from, to) } : (options || {});
    const board = root.querySelector('.kanban');
    let dragId = null, fromCol = null, dragCard = null, beforeId = null, preview = null;
    const clearTargets = () => {
      root.querySelectorAll('.kb-body.over,.kb-body.invalid').forEach(x => x.classList.remove('over', 'invalid'));
      root.querySelectorAll('.kb-card.drop-before').forEach(x => x.classList.remove('drop-before'));
      root.querySelectorAll('.kb-list.drop-at-end').forEach(x => x.classList.remove('drop-at-end'));
    };
    const clearDrag = () => {
      if (dragCard) dragCard.classList.remove('dragging');
      if (preview && preview.parentNode) preview.remove();
      clearTargets(); dragId = null; fromCol = null; dragCard = null; beforeId = null; preview = null;
    };
    const allowed = (to) => !opts.canDrop || opts.canDrop({ id: dragId, from: fromCol, to }) !== false;
    const locate = (body, clientY) => {
      const candidates = [...body.querySelectorAll('[data-kb-card]')].filter(x => x !== dragCard);
      const target = candidates.find(card => clientY < card.getBoundingClientRect().top + card.getBoundingClientRect().height / 2);
      beforeId = target ? target.dataset.kbCard : null;
      if (target) target.classList.add('drop-before'); else body.querySelector('.kb-list').classList.add('drop-at-end');
    };
    const autoScroll = (body, e) => {
      const edge = 44, step = 14; const br = body.getBoundingClientRect();
      if (e.clientY < br.top + edge) body.scrollTop -= step; else if (e.clientY > br.bottom - edge) body.scrollTop += step;
      if (!board) return; const kr = board.getBoundingClientRect();
      if (e.clientX < kr.left + edge) board.scrollLeft -= step; else if (e.clientX > kr.right - edge) board.scrollLeft += step;
    };
    root.addEventListener('dragstart', (e) => {
      const handle = e.target.closest('[data-kb-handle]'); const card = handle && handle.closest('[data-kb-card]');
      if (!card) { e.preventDefault(); return; }
      dragId = card.dataset.kbCard; fromCol = card.dataset.col; dragCard = card; card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', dragId); } catch (err) { }
      preview = document.createElement('div'); preview.className = 'kb-drag-preview'; preview.innerHTML = `<b>${esc(card.dataset.label || 'Lead')}</b><span>${esc((card.querySelector('.ph') || {}).textContent || '')}</span>`; document.body.appendChild(preview);
      try { e.dataTransfer.setDragImage(preview, 18, 12); } catch (err) { }
    });
    root.addEventListener('dragend', clearDrag);
    root.addEventListener('dragover', (e) => {
      const body = e.target.closest('[data-kb-drop]'); if (!body || !dragId) return;
      const to = body.dataset.kbDrop; clearTargets();
      if (!allowed(to)) { body.classList.add('invalid'); if (e.dataTransfer) e.dataTransfer.dropEffect = 'none'; return; }
      e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'; body.classList.add('over'); locate(body, e.clientY); autoScroll(body, e);
    });
    root.addEventListener('dragleave', (e) => { const body = e.target.closest('[data-kb-drop]'); if (body && !body.contains(e.relatedTarget)) clearTargets(); });
    root.addEventListener('drop', (e) => {
      const body = e.target.closest('[data-kb-drop]'); if (!body || !dragId) return;
      const to = body.dataset.kbDrop; if (!allowed(to)) return clearDrag();
      e.preventDefault(); const detail = { id: dragId, from: fromCol, to, beforeId }; const label = dragCard ? dragCard.dataset.label : 'Lead';
      TH._kbFlashLead = dragId;
      let moved = true;
      try { if (opts.onMove) moved = opts.onMove(detail) !== false; } catch (err) { moved = false; throw err; } finally { if (!moved) TH._kbFlashLead = null; }
      if (moved) U.announce(`${label} đã được di chuyển đến ${body.dataset.colLabel || to}`);
      clearDrag();
    });
  };

  /* ---- Lịch tháng: month 'YYYY-MM', events [{date,label,color,id,tone}], hôm nay highlight, tối đa 2 pill + "+N" ---- */
  U.calendar = ({ month, events = [], selected = '', pickAct = 'cal-pick', moreAct = 'cal-more', max = 2, weekOf = '' }) => {
    const [y, m] = month.split('-').map(Number); const first = new Date(y, m - 1, 1); const dim = new Date(y, m, 0).getDate(); const startDow = (first.getDay() + 6) % 7; // Thứ 2 = 0
    const prevDim = new Date(y, m - 1, 0).getDate(); const cells = []; const today = F.today();
    for (let i = 0; i < 42; i++) { const d = i - startDow + 1; let iso, other = false; if (d < 1) { iso = F.toISO(new Date(y, m - 2, prevDim + d)); other = true; } else if (d > dim) { iso = F.toISO(new Date(y, m, d - dim)); other = true; } else iso = F.toISO(new Date(y, m - 1, d)); cells.push({ iso, day: Number(iso.slice(8, 10)), other }); }
    const byDate = F.by(events, 'date'); let shown = cells; if (weekOf) { const wi = cells.findIndex(c => c.iso === weekOf); if (wi >= 0) shown = cells.slice(Math.floor(wi / 7) * 7, Math.floor(wi / 7) * 7 + 7); }
    return `<div class="cal"><div class="cal-head">${['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map(d => `<div>${d}</div>`).join('')}</div><div class="cal-grid">${shown.map(c => { const ev = byDate[c.iso] || []; return `<div class="cal-cell ${c.other ? 'other' : ''} ${c.iso === today ? 'today' : ''} ${c.iso === selected ? 'sel' : ''}" data-act="${pickAct}" data-date="${c.iso}" tabindex="0"><div class="d"><span>${c.day}</span></div>${ev.slice(0, max).map(e => `<button type="button" class="cal-pill ${e.tone || ''}" data-act="${moreAct}" data-id="${esc(e.id)}" style="${e.color ? 'background:' + e.color + '22;color:' + e.color + ';border-color:' + e.color + '55' : ''}"><i></i>${esc(e.label)}</button>`).join('')}${ev.length > max ? `<button type="button" class="cal-more" data-act="${pickAct}" data-date="${c.iso}">+${ev.length - max}</button>` : ''}</div>`; }).join('')}</div></div>`;
  };

  /* ---- "Trang PDF" giả cho OCR: pages [html], highlights qua <mark class="ok|check"> trong html ---- */
  U.docPreview = ({ pages, page = 1, zoom = 100, fileName = '', size = '' }) => `<div class="docprev"><div class="dp-tools"><span class="row gap4">${U.iconBtn('zoom-out', 'dp-zoom-out', 'Thu nhỏ')}<input class="inp sm dp-page" value="${page}" data-dp-page style="width:44px;text-align:center"><span class="muted small">/ ${pages.length}</span>${U.iconBtn('zoom-in', 'dp-zoom-in', 'Phóng to')}<span class="muted small dp-zoom">${zoom}%</span></span><span class="row gap4">${U.iconBtn('hand', 'dp-hand', 'Kéo trang')}${U.iconBtn('download', 'dp-dl', 'Tải file')}</span></div><div class="dp-scroll"><div class="dp-page-wrap" style="transform:scale(${zoom / 100})"><div class="dp-page">${pages[page - 1] || ''}</div></div></div></div>`;

  /* ---- Chip kết quả ghép / progress inline / countdown / stepper trạng thái ---- */
  U.matchChip = (status) => TH.q.chip('match', status);
  U.progress = (pct, tone = '') => `<div class="row gap4" style="min-width:110px"><div class="progress grow ${tone}"><i style="width:${Math.max(0, Math.min(100, pct))}%;${tone === 'red' ? 'background:var(--red-500)' : tone === 'green' ? 'background:var(--green-500)' : ''}"></i></div><span class="xs muted" style="width:34px;text-align:right">${Math.round(pct)}%</span></div>`;
  U.countdown = (untilISO, opts = {}) => { const id = 'cd_' + F.uid(); return `<div class="countdown" id="${id}" data-until="${esc(untilISO)}" data-static="${window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0}"><span class="cd-days">-</span><small>ngày</small> <span class="cd-time">--:--:--</span></div>`; };
  U.startCountdowns = (root) => { root.querySelectorAll('.countdown').forEach(el => { const until = el.dataset.until; if (!until) return; const tick = () => { if (!document.contains(el)) { clearInterval(el._t); return; } const end = new Date(until + 'T23:59:59'); const now = new Date(); const base = F.parseISO(F.today()); base.setHours(now.getHours(), now.getMinutes(), now.getSeconds()); let diff = Math.max(0, Math.floor((end - base) / 1000)); const d = Math.floor(diff / 86400); diff -= d * 86400; const h = Math.floor(diff / 3600), mi = Math.floor(diff % 3600 / 60), s = diff % 60; el.querySelector('.cd-days').textContent = d; el.querySelector('.cd-time').textContent = F.pad(h) + ':' + F.pad(mi) + ':' + F.pad(s); }; tick(); if (el.dataset.static !== '1') el._t = setInterval(tick, 1000); }); };
  U.stepperStatus = (steps, cur) => `<div class="card mb16"><div class="wizard">${steps.map((s, i) => `<div class="wz-step ${i < cur ? 'done' : ''} ${i === cur ? 'on' : ''}"><div class="n">${i < cur ? TH.icon('check') : i + 1}</div><div class="txt"><b>${esc(s.label)}</b><small>${esc(s.date ? (s.date + (s.by ? ' · ' + s.by : '')) : (s.sub || 'Chưa thực hiện'))}</small></div></div>${i < steps.length - 1 ? `<div class="wz-line ${i < cur ? 'done' : 'dashed'}"></div>` : ''}`).join('')}</div></div>`;
  U.stat3 = (items) => `<div class="stat3">${items.map(([l, v, tone]) => `<div class="st3 ${tone || ''}"><div class="lb">${esc(l)}</div><div class="vl">${v}</div></div>`).join('')}</div>`;

  /* ---- Chart: 2 cột + đường; funnel ngang ---- */
  const C = TH.chart;
  C.barLine2 = ({ groups, height = 240, colorA = '#2563EB', colorB = '#F97316', lineColor = '#16A34A', unit = 'Triệu VND', labelEvery = 0 }) => {
    const W = 760, H = height, padL = 40, padR = 12, padB = 30, padT = 14; const n = Math.max(1, groups.length); const cw = (W - padL - padR) / n;
    const mx = Math.max(1, ...groups.map(g => Math.max(g.a, g.b, Math.abs(g.line || 0)))); const nice = Math.ceil(mx / 50) * 50 || 50; const y = (v) => padT + (H - padT - padB) * (1 - v / nice);
    let s = `<svg class="chart bl2" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">`;
    for (let i = 0; i <= 4; i++) { const v = nice / 4 * i; s += `<line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}" stroke="#EEF2F7"/><text x="${padL - 6}" y="${y(v) + 4}" font-size="10" fill="#94A3B8" text-anchor="end">${Math.round(v)}</text>`; }
    const pts = []; const step = labelEvery || Math.max(1, Math.ceil(n / 7));
    groups.forEach((g, gi) => { const x0 = padL + cw * gi; const bw = Math.max(3, Math.min(14, cw * .32)); const gap = 2; const xa = x0 + cw / 2 - bw - gap / 2, xb = x0 + cw / 2 + gap / 2; s += `<rect x="${xa}" y="${y(g.a)}" width="${bw}" height="${Math.max(0, y(0) - y(g.a))}" fill="${colorA}" rx="2"><title>${esc(g.label)}: Thu ${g.a}</title></rect><rect x="${xb}" y="${y(g.b)}" width="${bw}" height="${Math.max(0, y(0) - y(g.b))}" fill="${colorB}" rx="2"><title>${esc(g.label)}: Chi ${g.b}</title></rect>`; if (gi % step === 0 || gi === n - 1) s += `<text x="${x0 + cw / 2}" y="${H - padB + 16}" font-size="10" fill="#334155" text-anchor="middle">${esc(g.label)}</text>`; pts.push([x0 + cw / 2, y(Math.max(0, g.line != null ? g.line : g.a - g.b)), g]); });
    s += `<polyline points="${pts.map(p => p[0] + ',' + p[1]).join(' ')}" fill="none" stroke="${lineColor}" stroke-width="2"/>`;
    pts.forEach(p => s += `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${lineColor}" stroke="#fff" stroke-width="1.5"><title>${esc(p[2].label)}: Thu ${p[2].a} · Chi ${p[2].b} · Dòng tiền ${p[2].line != null ? p[2].line : p[2].a - p[2].b} (${esc(unit)})</title></circle>`);
    return s + '</svg>';
  };
  C.funnel = (items, color = '#2563EB') => { const mx = Math.max(1, ...items.map(i => i.value)); return `<div class="funnel">${items.map((it, i) => `<div class="fn-row"><span class="lb">${esc(it.label)}</span><div class="bar"><i style="width:${Math.max(2, Math.round(it.value / mx * 100))}%;background:${it.color || color};opacity:${1 - i * 0.14}"></i></div><span class="vl">${it.value}${it.pct != null ? ' <span class="muted">(' + it.pct + '%)</span>' : ''}</span></div>`).join('')}</div>`; };
  C.vbar = ({ items, height = 220, color = '#2563EB', unit = '' }) => { const W = 520, H = height, padL = 36, padB = 40, padT = 18; const mx = Math.max(1, ...items.map(i => i.value)); const nice = Math.ceil(mx / 50) * 50 || 50; const cw = (W - padL - 8) / Math.max(1, items.length); const y = v => padT + (H - padT - padB) * (1 - v / nice); let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">`; for (let i = 0; i <= 5; i++) { const v = nice / 5 * i; s += `<line x1="${padL}" x2="${W - 6}" y1="${y(v)}" y2="${y(v)}" stroke="#EEF2F7"/><text x="${padL - 6}" y="${y(v) + 4}" font-size="10" fill="#94A3B8" text-anchor="end">${Math.round(v)}</text>`; } items.forEach((it, i) => { const bw = Math.min(44, cw * .55); const x = padL + cw * i + (cw - bw) / 2; s += `<rect x="${x}" y="${y(it.value)}" width="${bw}" height="${Math.max(0, y(0) - y(it.value))}" fill="${it.color || color}" rx="3"><title>${esc(it.label)}: ${it.value}${unit}</title></rect><text x="${x + bw / 2}" y="${y(it.value) - 5}" font-size="10" font-weight="600" fill="#1E293B" text-anchor="middle">${it.value}</text><text x="${x + bw / 2}" y="${H - padB + 14}" font-size="10" fill="#334155" text-anchor="middle">${esc(String(it.label).split(' ').slice(0, 2).join(' '))}</text><text x="${x + bw / 2}" y="${H - padB + 26}" font-size="10" fill="#334155" text-anchor="middle">${esc(String(it.label).split(' ').slice(2).join(' '))}</text>`; }); return s + '</svg>'; };
  C.donutLegend = (items, size = 150, center = '', sub = '') => `<div class="row gap16 wrap" style="align-items:center">${C.donut({ items, size, centerLabel: center, centerSub: sub })}<div class="legend-list">${items.map(i => `<div class="it"><span class="sw" style="background:${i.color}"></span><span class="grow">${esc(i.label)}</span><b>${i.text || i.value}</b></div>`).join('')}</div></div>`;

  /* ---- Kit ẩn: #/__kit ---- */
  TH.router.register('/__kit', (root) => {
    TH.router.crumb([{ label: 'Kit P2' }]);
    root.innerHTML = `${U.pageHead({ title: 'Component kit Phase 2', phase: 2, sub: 'Trang kiểm tra nội bộ (M2)' })}
      ${U.card({ title: 'Kanban', body: U.kanban({ cols: [{ key: 'a', label: 'Cột A', color: 'blue' }, { key: 'b', label: 'Cột B', color: 'amber' }], cards: [{ col: 'a', id: '1', html: '<b>Card 1</b>' }, { col: 'b', id: '2', html: '<b>Card 2</b>' }] }) })}
      <div class="grid grid-2 mt16">${U.card({ title: 'Calendar', body: U.calendar({ month: F.today().slice(0, 7), events: [{ date: F.today(), label: 'Hôm nay', color: '#2563EB', id: 'x' }, { date: F.today(), label: 'Việc 2', color: '#16A34A', id: 'y' }, { date: F.today(), label: 'Việc 3', color: '#F59E0B', id: 'z' }] }) })}${U.card({ title: 'Countdown / Stepper / Progress', body: U.countdown(F.addDays(F.today(), 6)) + U.stepperStatus([{ label: 'Nháp', date: '14/10' }, { label: 'Chờ duyệt', date: '16/10' }, { label: 'Đã duyệt' }, { label: 'Đã hoàn' }], 1) + U.progress(60) + U.progress(100, 'green') + U.progress(25, 'red') })}</div>
      <div class="grid grid-2 mt16">${U.card({ title: 'barLine2', body: C.barLine2({ groups: Array.from({ length: 31 }, (_, i) => ({ label: F.pad(i + 1) + '/10', a: 50 + (i * 37) % 120, b: 20 + (i * 53) % 80 })) }) })}${U.card({ title: 'Funnel', body: C.funnel([{ label: 'Lead mới', value: 124, pct: 100 }, { label: 'Đã liên hệ', value: 86, pct: 69 }, { label: 'Lịch xem', value: 38, pct: 31 }, { label: 'Giữ chỗ', value: 12, pct: 10 }, { label: 'Chốt thuê', value: 18, pct: 14.5, color: '#16A34A' }]) })}</div>
      ${U.card({ title: 'Doc preview', cls: 'mt16', body: U.docPreview({ pages: ['<h3 style="text-align:center">HỢP ĐỒNG MẪU</h3><p>Bên thuê: <mark class="check">Nguyễn Thị Hương</mark> – phòng <mark class="ok">A.01.02</mark></p>'], fileName: 'x.pdf' }) })}
      <div class="row wrap gap12 mt16">${Object.keys(TH.icons).slice(-30).map(k => `<span class="row gap4 small">${TH.icon(k)} ${k}</span>`).join('')}</div>`;
    U.startCountdowns(root); U.bindKanban(root, (id, from, to) => U.toast('ok', 'Kéo ' + id + ' ' + from + ' → ' + to));
  }, { menu: '', permission: 'dashboard.view', phase: 2 });
})(window.TH);
