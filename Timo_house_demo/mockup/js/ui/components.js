/* UI kit: HTML string helpers + widget tương tác (drawer/modal/menu/toast) */
(function (TH) {
  const F = TH.f, esc = F.esc, I = TH.icon;
  const U = {};
  U.el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  U.attrs = (o = {}) => Object.entries(o).filter(([k, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => v === true ? k : `${k}="${esc(v)}"`).join(' ');
  /* Cờ phase dùng chung: p2:true ≡ phase:2. Phase tắt → disabled + tooltip (như bản P1); phase bật → enabled, giữ badge để nhận biết. */
  U.phaseOf = (o) => o.phase || (o.p2 ? 2 : 0);
  U.phaseOn = (n) => !n || (TH.phase && TH.phase.on(n));
  U.phaseTag = (n) => n ? (TH.phase ? TH.phase.tag(n) : '<span class="tag-p">P' + n + '</span>') : '';
  U.btn = ({ label = '', icon = '', cls = 'btn-ghost', act = '', size = '', disabled = false, title = '', attrs = {}, p2 = false, phase = 0, id = '' }) => {
    const ph = phase || (p2 ? 2 : 0);
    if (ph && !U.phaseOn(ph)) { disabled = true; title = title || 'Chức năng thuộc Phase ' + ph + ' – ngoài scope bản demo Phase 1'; }
    return `<button type="button" class="btn ${cls} ${size}" ${act ? `data-act="${esc(act)}"` : ''} ${disabled ? 'disabled' : ''} ${title ? `title="${esc(title)}"` : ''} ${id ? `id="${id}"` : ''} ${U.attrs(attrs)}>${icon ? I(icon) : ''}${label ? `<span>${esc(label)}</span>` : ''}${U.phaseTag(ph)}</button>`;
  };
  U.iconBtn = (icon, act, title = '', attrs = {}, cls = '') => `<button type="button" class="btn-icon ${cls}" data-act="${esc(act)}" ${title ? `data-tip="${esc(title)}" aria-label="${esc(title)}"` : ''} ${U.attrs(attrs)}>${I(icon)}</button>`;
  /* Nút thao tác trên dòng: icon-only, tên thao tác hiện qua tooltip (data-tip). tone: ''|primary|success|danger */
  U.actBtn = ({ icon = 'info', label = '', act = '', attrs = {}, tone = '', disabled = false, p2 = false, phase = 0, id = '' }) => {
    const ph = phase || (p2 ? 2 : 0);
    if (ph && !U.phaseOn(ph)) { disabled = true; label = (label ? label + ' – ' : '') + 'Chức năng thuộc Phase ' + ph; }
    return `<button type="button" class="btn-icon act ${tone}" ${act ? `data-act="${esc(act)}"` : ''} ${disabled ? 'disabled' : ''} ${id ? `id="${id}"` : ''} data-tip="${esc(label)}" aria-label="${esc(label)}" ${U.attrs(attrs)}>${I(icon)}</button>`;
  };
  U.chip = (text, color = 'gray', dot = false, extra = '') => `<span class="chip ${color} ${extra}">${dot ? '<span class="dot"></span>' : ''}${esc(text)}</span>`;
  U.delta = (v, dir) => { if (v == null) return ''; dir = dir || (v >= 0 ? 'up' : 'down'); return `<span class="delta ${dir}">${dir === 'up' ? '↑' : '↓'} ${esc(String(Math.abs(v)).replace('.', ','))}%</span>`; };
  U.kpi = ({ label, value, cap = '', icon = 'info', tone = 'blue', tint = true, delta = null, deltaDir = null, bar = null, mini = false, cls = '', valueCls = '' }) => `<div class="kpi ${tint ? 't-' + tone : ''} ${mini ? 'mini' : ''} ${cls}"><div class="ic ${tone}">${I(icon)}</div><div class="grow"><div class="lb">${esc(label)}</div><div class="vl ${valueCls}">${value}${delta != null ? U.delta(delta, deltaDir) : ''}</div>${cap ? `<div class="cap">${cap}</div>` : ''}${bar != null ? `<div class="bar"><i style="width:${bar}%"></i></div>` : ''}</div></div>`;
  U.stat = (label, value, cap = '', cls = '') => `<div class="stat-tile ${cls}"><div class="lb">${esc(label)}</div><div class="vl">${value}</div>${cap ? `<div class="cap">${cap}</div>` : ''}</div>`;
  U.avatar = (name, cls = '', img = '') => `<div class="avatar ${cls}">${img ? `<img src="${img}" alt="">` : esc(F.initials(name))}</div>`;
  U.pageHead = ({ title, sub = '', acts = [], back = '', chips = '', phase = 0 }) => `<div class="page-head"><div class="row start gap12">${back ? `<a class="back-btn" href="${back}" title="Quay lại">${I('arrow-left')}</a>` : ''}<div><h1>${title}${chips}${phase ? ` <span class="chip-phase" title="${esc(TH.phase.info(phase).label + ' – ' + TH.phase.info(phase).name)}">${esc(TH.phase.info(phase).short)}</span>` : ''}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}</div></div><div class="acts">${acts.join('')}</div></div>`;
  const cardCollapseStorageKey = (key) => {
    const route = (location.hash || '#/dashboard').replace(/^#/, '').split('?')[0] || '/dashboard';
    return `timehouse:side-card:${route}:${key}`;
  };
  const cardCollapsed = (key) => {
    try { const saved = sessionStorage.getItem(cardCollapseStorageKey(key)); if (saved !== null) return saved === '1'; } catch (e) { }
    return !!(window.matchMedia && window.matchMedia('(max-width:1180px)').matches);
  };
  const cardCollapseToggle = (key, collapsed) => `<button type="button" class="btn-icon card-collapse-btn" data-card-collapse data-collapse-key="${esc(key)}" aria-expanded="${collapsed ? 'false' : 'true'}" aria-label="${collapsed ? 'Mở rộng' : 'Thu gọn'}" title="${collapsed ? 'Mở rộng' : 'Thu gọn'}">${I('chevron-down')}</button>`;
  U.card = ({ title = '', icon = '', sub = '', actions = '', body = '', footer = '', cls = '', bodyCls = '', id = '', attrs = '', collapsible = false, collapseKey = '' }) => {
    const canCollapse = !!(collapsible && title);
    const key = collapseKey || id || F.slug(String(title).replace(/<[^>]+>/g, '')) || 'card';
    const collapsed = canCollapse && cardCollapsed(key);
    const toggle = canCollapse ? cardCollapseToggle(key, collapsed) : '';
    return `<div class="card ${canCollapse ? 'collapsible' : ''} ${collapsed ? 'collapsed' : ''} ${cls}" ${id ? `id="${id}"` : ''} ${canCollapse ? `data-collapse-key="${esc(key)}" data-collapse-ready="1"` : ''} ${attrs}>${title ? `<div class="card-h"><div><h3>${icon ? I(icon) : ''}${title}</h3>${sub ? `<div class="sub">${sub}</div>` : ''}</div><div class="row">${actions}${toggle}</div></div>` : ''}${body !== null ? `<div class="card-b ${bodyCls}">${body}</div>` : ''}${footer ? `<div class="card-f">${footer}</div>` : ''}</div>`;
  };
  U.relatedStrip = ({ id = 'related', title = 'Thông tin liên quan', items = [], cls = '' }) => {
    const safeId = F.slug(id) || 'related'; const cols = Math.min(Math.max(items.length, 1), 4);
    return `<section class="related-section ${cls}" data-related-strip aria-labelledby="${safeId}-title"><div id="${safeId}-title" class="small bold muted related-section-title">${esc(title)}</div><div class="related-strip cols-${cols}">${items.map(x => `<button type="button" id="${safeId}-${esc(x.key)}" class="related-tile" data-related-toggle data-related-key="${esc(x.key)}" aria-expanded="false" aria-controls="${safeId}-panel"><span class="related-icon">${I(x.icon || 'info')}</span><span class="related-copy"><span class="related-label">${esc(x.title)}</span><span class="related-value">${x.summary || '-'}</span><span class="related-meta">${x.meta || ''}</span></span><span class="related-chevron" aria-hidden="true">${I('chevron-down')}</span></button>`).join('')}</div><div id="${safeId}-panel" class="related-panel" role="region" hidden></div>${items.map(x => `<template data-related-template="${esc(x.key)}">${U.card({ title: x.title, icon: x.icon || 'info', actions: x.actions || '', body: x.body || '', cls: 'related-detail' })}</template>`).join('')}</section>`;
  };
  U.enhanceSideCards = (root = document) => {
    root.querySelectorAll('.two-col > .side-stack:last-child .card:not([data-collapse-ready])').forEach((card, index) => {
      const header = Array.from(card.children).find(el => el.classList.contains('card-h')); if (!header) return;
      const title = header.querySelector('h3');
      const key = card.dataset.collapseKey || card.id || F.slug(title ? title.textContent : '') || `side-card-${index + 1}`;
      const collapsed = cardCollapsed(key);
      card.classList.add('collapsible'); card.classList.toggle('collapsed', collapsed);
      card.dataset.collapseKey = key; card.dataset.collapseReady = '1';
      const actions = Array.from(header.children).find(el => el.classList.contains('row'));
      if (actions) actions.appendChild(U.el(cardCollapseToggle(key, collapsed)));
    });
  };
  document.addEventListener('click', (e) => {
    const relatedBtn = e.target.closest('[data-related-toggle]');
    if (relatedBtn) {
      const section = relatedBtn.closest('[data-related-strip]'); if (!section) return;
      const panel = section.querySelector('.related-panel'); const wasOpen = relatedBtn.getAttribute('aria-expanded') === 'true';
      section.querySelectorAll('[data-related-toggle]').forEach(btn => { btn.classList.remove('active'); btn.setAttribute('aria-expanded', 'false'); });
      if (wasOpen) { panel.hidden = true; panel.replaceChildren(); panel.removeAttribute('aria-labelledby'); return; }
      const key = relatedBtn.dataset.relatedKey; const tpl = Array.from(section.querySelectorAll('template[data-related-template]')).find(x => x.dataset.relatedTemplate === key); if (!tpl) return;
      relatedBtn.classList.add('active'); relatedBtn.setAttribute('aria-expanded', 'true'); panel.replaceChildren(tpl.content.cloneNode(true)); panel.setAttribute('aria-labelledby', relatedBtn.id); panel.hidden = false; return;
    }
    const btn = e.target.closest('[data-card-collapse]'); if (!btn) return;
    const card = btn.closest('.card.collapsible'); if (!card) return;
    const collapsed = card.classList.toggle('collapsed');
    btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    btn.setAttribute('aria-label', collapsed ? 'Mở rộng' : 'Thu gọn');
    btn.setAttribute('title', collapsed ? 'Mở rộng' : 'Thu gọn');
    try { sessionStorage.setItem(cardCollapseStorageKey(btn.dataset.collapseKey), collapsed ? '1' : '0'); } catch (err) { }
  });
  if (window.MutationObserver) {
    const appRoot = document.getElementById('app');
    if (appRoot) new MutationObserver((records) => {
      const hasNewCard = records.some(r => Array.from(r.addedNodes).some(n => n.nodeType === 1 && (n.matches('.card') || n.querySelector('.card'))));
      if (hasNewCard) U.enhanceSideCards(appRoot);
    }).observe(appRoot, { childList: true, subtree: true });
  }
  U.section = (title, sub = '', actions = '') => `<div class="section-h"><div><h2>${title}</h2>${sub ? `<div class="sub">${sub}</div>` : ''}</div><div class="row">${actions}</div></div>`;
  /* form controls */
  U.field = ({ label = '', req = false, help = '', err = '', input = '', cls = '', name = '' }) => `<div class="field ${cls}" ${name ? `data-field="${name}"` : ''}>${label ? `<label>${esc(label)}${req ? '<span class="req">*</span>' : ''}</label>` : ''}${input}${help ? `<div class="help">${help}</div>` : ''}${err ? `<div class="err">${esc(err)}</div>` : ''}</div>`;
  U.input = ({ name, value = '', type = 'text', placeholder = '', cls = '', attrs = {}, readonly = false, icon = '', suffix = '', prefix = '' }) => {
    if (icon || suffix || prefix) return `<div class="inp-wrap ${cls}">${prefix ? `<span class="pre">${esc(prefix)}</span>` : ''}${icon ? I(icon) : ''}<input type="${type}" name="${name}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${readonly ? 'readonly' : ''} ${U.attrs(attrs)}>${suffix}</div>`;
    return `<input class="inp ${cls}" type="${type}" name="${name}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${readonly ? 'readonly' : ''} ${U.attrs(attrs)}>`;
  };
  U.money = ({ name, value = '', placeholder = '0', attrs = {}, cls = '', readonly = false }) => `<div class="inp-wrap ${cls}"><span class="pre">VND</span><input type="text" inputmode="numeric" data-money name="${name}" value="${value === '' || value == null ? '' : F.vnd(value)}" placeholder="${esc(placeholder)}" ${readonly ? 'readonly' : ''} ${U.attrs(attrs)} class="tr"></div>`;
  U.date = ({ name, value = '', attrs = {}, cls = '' }) => `<input class="inp ${cls}" type="date" name="${name}" value="${esc(value)}" ${U.attrs(attrs)}>`;
  U.select = ({ name, value = '', options = [], placeholder = '', cls = '', attrs = {}, all = '' }) => `<select class="inp ${cls}" name="${name}" ${U.attrs(attrs)}>${all ? `<option value="">${esc(all)}</option>` : ''}${placeholder ? `<option value="" disabled ${value === '' ? 'selected' : ''}>${esc(placeholder)}</option>` : ''}${options.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(v) === String(value) ? 'selected' : ''}>${esc(l)}</option>`; }).join('')}</select>`;
  U.textarea = ({ name, value = '', placeholder = '', rows = 3, attrs = {}, cls = '' }) => `<textarea class="inp ${cls}" name="${name}" rows="${rows}" placeholder="${esc(placeholder)}" ${U.attrs(attrs)}>${esc(value)}</textarea>`;
  U.check = ({ name, label, checked = false, attrs = {} }) => `<label class="chk"><input type="checkbox" name="${name}" ${checked ? 'checked' : ''} ${U.attrs(attrs)}> <span>${label}</span></label>`;
  U.toggle = (on, act = '', attrs = {}) => `<span class="toggle ${on ? 'on' : ''}" role="switch" aria-checked="${on}" ${act ? `data-act="${act}"` : ''} ${U.attrs(attrs)}></span>`;
  U.radioCard = ({ name, value, checked, title, text, icon, iconCls = 'blue' }) => `<label class="radio-card ${checked ? 'on' : ''}"><input type="radio" name="${name}" value="${esc(value)}" ${checked ? 'checked' : ''} hidden><div class="ic ${iconCls}" style="background:var(--${iconCls}-bg);color:var(--${iconCls})">${I(icon)}</div><div><b>${esc(title)}</b><span>${esc(text)}</span></div><span class="dot"></span></label>`;
  U.filterbar = (fields, actions = '') => `<div class="card filters"><div class="filterbar">${fields.join('')}${actions}</div></div>`;
  U.statusTabs = (items, current, act = 'stab') => `<div class="status-tabs">${items.map(it => `<button type="button" class="status-tab ${String(it.key) === String(current) ? 'on' : ''}" data-act="${act}" data-key="${esc(it.key)}">${it.color ? `<span class="dot" style="background:var(--${it.color}-500,var(--${it.color}))"></span>` : ''}${esc(it.label)}${it.count != null ? `<span class="cnt">${it.count}</span>` : ''}</button>`).join('')}</div>`;
  U.tabs = (items, current, cls = '', act = 'tab') => `<div class="tabs ${cls}">${items.map(it => { const ph = U.phaseOf(it), off = ph && !U.phaseOn(ph); return `<button type="button" class="${it.key === current ? 'on' : ''} ${off ? 'disabled-p2' : ''}" data-act="${act}" data-key="${esc(it.key)}" ${off ? `title="Phase ${ph} – ngoài scope demo"` : ''} ${off ? 'data-phase-off="1"' : ''}>${it.icon ? I(it.icon) : ''}${esc(it.label)}${it.count != null ? ` <span class="cnt muted">(${it.count})</span>` : ''}${U.phaseTag(ph)}</button>`; }).join('')}</div>`;
  U.wizard = (steps, cur) => `<div class="card mb16"><div class="wizard">${steps.map((s, i) => `<div class="wz-step ${i < cur ? 'done' : ''} ${i === cur ? 'on' : ''}"><div class="n">${i < cur ? I('check') : i + 1}</div><div class="txt"><b>${esc(s.title)}</b><small>${esc(s.sub || '')}</small></div></div>${i < steps.length - 1 ? `<div class="wz-line ${i < cur ? 'done' : ''}"></div>` : ''}`).join('')}</div></div>`;
  U.empty = ({ icon = 'inbox', title = 'Chưa có dữ liệu', text = '', action = '' }) => `<div class="empty">${I(icon)}<b>${esc(title)}</b>${text ? `<p>${text}</p>` : ''}${action}</div>`;
  U.note = (type, title, text, icon) => `<div class="note-box ${type}">${I(icon || ({ info: 'info', warn: 'alert-triangle', danger: 'alert-circle', ok: 'check-circle' }[type]))}<div>${title ? `<b>${title}</b>` : ''}${text}</div></div>`;
  U.kv = (items, cls = '') => `<div class="kv ${cls}">${items.map(([k, v, small]) => `<div class="it"><span>${esc(k)}</span><b>${v}${small ? `<small>${small}</small>` : ''}</b></div>`).join('')}</div>`;
  U.timeline = (items) => `<div class="timeline">${items.map(it => `<div class="tl-it"><div class="when">${esc(it.when || '')}</div><div class="dot ${it.color || ''} ${it.fill ? 'fill' : ''}"></div><div><b>${esc(it.title)}</b><small>${it.sub || ''}</small></div></div>`).join('')}</div>`;
  U.fileIcon = (name) => /pdf/i.test(name) ? 'pdf' : /png|jpe?g|gif/i.test(name) ? 'img' : /xls|csv/i.test(name) ? 'xls' : 'doc';
  U.fileItem = (f, actions = '') => `<div class="file-it"><div class="fic ${U.fileIcon(f.fileName || f.name)}">${I(U.fileIcon(f.fileName || f.name) === 'img' ? 'image' : 'file-text')}</div><div class="grow"><b>${esc(f.name || f.fileName)}</b><small>${esc(f.fileName && f.fileName !== f.name ? f.fileName + ' · ' : '')}${esc(f.date ? F.date(f.date) + ' · ' : '')}${esc(f.size || '')}</small></div>${actions}</div>`;
  U.dropzone = ({ name = 'files', hint = 'Hỗ trợ JPG, PNG, PDF (tối đa 5MB)', multiple = true, accept = '' }) => `<div class="dropzone" data-dz="${name}">${I('upload-cloud')}<div>Kéo thả file vào đây hoặc <span class="pick">Chọn file</span></div><div class="xs mt4">${esc(hint)}</div><input type="file" name="${name}" ${multiple ? 'multiple' : ''} ${accept ? `accept="${accept}"` : ''} hidden><div class="file-list mt8" data-dz-list></div></div>`;
  U.bindDropzones = (root, onChange) => {
    root.querySelectorAll('[data-dz]').forEach(dz => {
      const inp = dz.querySelector('input[type=file]'); const list = dz.querySelector('[data-dz-list]'); dz._files = dz._files || [];
      const render = () => { list.innerHTML = dz._files.map((f, i) => U.fileItem({ name: f.name, size: (f.size / 1024).toFixed(0) + ' KB' }, U.iconBtn('trash', 'dz-rm', 'Bỏ file', { 'data-i': i }))).join(''); list.querySelectorAll('[data-act=dz-rm]').forEach(b => b.onclick = (e) => { e.stopPropagation(); dz._files.splice(Number(b.dataset.i), 1); render(); onChange && onChange(dz._files); }); };
      dz.addEventListener('click', (e) => { if (e.target.closest('[data-dz-list]')) return; inp.click(); });
      inp.addEventListener('change', () => { dz._files.push(...Array.from(inp.files)); inp.value = ''; render(); onChange && onChange(dz._files); });
      dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('hover'); }); dz.addEventListener('dragleave', () => dz.classList.remove('hover'));
      dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('hover'); dz._files.push(...Array.from(e.dataTransfer.files)); render(); onChange && onChange(dz._files); });
      dz._render = render; render();
    });
  };
  U.dzFiles = (root, name) => { const dz = root.querySelector(`[data-dz="${name}"]`); return dz ? (dz._files || []) : []; };
  U.phone = (content, time = 'Hôm nay, 09:00') => `<div class="phone"><div class="ph-h"><div class="zl">Z</div><div><b>TimoHouse ${I('check-circle', 'blue')}</b><small>Tài khoản OA</small></div></div><div class="time">${esc(time)}</div><div class="bubble">${esc(content)}<div class="ts">09:00</div></div></div>`;
  U.pager = ({ page, pages, total, from, to, unit = 'bản ghi', size = 10 }) => {
    let btns = ''; const add = (p) => btns += `<button type="button" data-act="page" data-p="${p}" class="${p === page ? 'on' : ''}">${p}</button>`;
    const rng = []; for (let p = 1; p <= pages; p++) if (p <= 1 || p > pages - 1 || Math.abs(p - page) <= 1 || (page <= 3 && p <= 5) || (page >= pages - 2 && p >= pages - 4)) rng.push(p);
    let last = 0; rng.forEach(p => { if (p - last > 1) btns += '<span class="dots">…</span>'; add(p); last = p; });
    return `<div class="card-f"><span>Hiển thị ${total ? from : 0} - ${to} của ${total} ${esc(unit)}</span><div class="row gap12 wrap"><div class="pager"><button type="button" data-act="page" data-p="${page - 1}" ${page <= 1 ? 'disabled' : ''}>${I('chevron-left')}</button>${btns}<button type="button" data-act="page" data-p="${page + 1}" ${page >= pages ? 'disabled' : ''}>${I('chevron-right')}</button></div><select class="inp sm" data-act="psize" style="width:auto">${[10, 20, 50, 100].map(n => `<option ${n === size ? 'selected' : ''} value="${n}">${n} / trang</option>`).join('')}</select></div></div>`;
  };
  /* event delegation */
  U.bind = (root, handlers, evt = 'click') => {
    root.addEventListener(evt, (e) => {
      const el = e.target.closest('[data-act]'); if (!el || !root.contains(el)) return; const act = el.dataset.act; const h = handlers[act]; if (!h) return;
      if (el.disabled) return; e.preventDefault();
      try { const r = h(el, e); if (r && r.catch) r.catch(err => U.toast('err', 'Không thực hiện được', err.message)); } catch (err) { console.error(err); U.toast('err', 'Không thực hiện được', err.message); }
    });
  };
  U.onChange = (root, handlers) => root.addEventListener('change', (e) => { const el = e.target.closest('[data-on]'); if (!el) return; const h = handlers[el.dataset.on]; if (h) try { h(el, e); } catch (err) { U.toast('err', 'Lỗi', err.message); } });
  U.onInput = (root, fn) => root.addEventListener('input', (e) => { if (e.target.matches('[data-money]')) { const v = F.num(e.target.value); const pos = e.target.selectionStart; e.target.value = v ? F.vnd(v) : ''; } fn && fn(e); });
  U.formData = (root) => { const o = {}; root.querySelectorAll('input[name],select[name],textarea[name]').forEach(el => { if (el.type === 'checkbox') o[el.name] = el.checked; else if (el.type === 'radio') { if (el.checked) o[el.name] = el.value; } else if (el.hasAttribute('data-money')) o[el.name] = F.num(el.value); else if (el.type === 'number') o[el.name] = el.value === '' ? '' : Number(el.value); else o[el.name] = el.value; }); return o; };
  U.setErrors = (root, errs) => { root.querySelectorAll('.field.invalid').forEach(f => { f.classList.remove('invalid'); const e = f.querySelector('.err'); if (e) e.remove(); }); Object.entries(errs || {}).forEach(([k, msg]) => { const f = root.querySelector(`[data-field="${k}"]`) || (root.querySelector(`[name="${k}"]`) || {}).closest?.('.field'); if (f) { f.classList.add('invalid'); f.insertAdjacentHTML('beforeend', `<div class="err">${esc(msg)}</div>`); } }); };
  /* overlays */
  const OV = () => document.getElementById('overlay-root');
  U.openCount = 0;
  U.drawer = ({ title, sub = '', body = '', footer = '', wide = false, modal = false, size = '', onMount, onClose }) => {
    const ov = U.el(`<div class="overlay ${modal ? 'center' : ''}"><div class="${modal ? 'modal ' + size : 'drawer ' + (wide ? 'wide' : '')}" role="dialog" aria-modal="true"><div class="drawer-h"><div><h2>${title}</h2>${sub ? `<div class="sub">${sub}</div>` : ''}</div><button type="button" class="close-x" data-act="close" aria-label="Đóng">${I('x')}</button></div><div class="drawer-b">${body}</div>${footer ? `<div class="drawer-f">${footer}</div>` : ''}</div></div>`);
    const close = (res) => { if (!ov.parentNode) return; ov.remove(); U.openCount--; if (U.openCount <= 0) { U.openCount = 0; document.body.classList.remove('modal-open'); } onClose && onClose(res); };
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
    ov.querySelector('[data-act=close]').onclick = () => close();
    ov.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    OV().appendChild(ov); U.openCount++; document.body.classList.add('modal-open');
    U.onInput(ov); U.bindDropzones(ov);
    const api = { el: ov, box: ov.firstElementChild, body: ov.querySelector('.drawer-b'), close, data: () => U.formData(ov) };
    onMount && onMount(api);
    setTimeout(() => { const f = ov.querySelector('input:not([hidden]),select,textarea,button.btn-primary'); f && f.focus && f.focus(); }, 30);
    return api;
  };
  U.modal = (o) => U.drawer(Object.assign({ modal: true }, o));
  U.confirm = ({ title = 'Xác nhận', text = '', ok = 'Xác nhận', cancel = 'Hủy', danger = false, body = '' }) => new Promise(res => {
    const m = U.modal({ title, size: 'sm', body: `<p class="small" style="font-size:13.5px">${text}</p>${body}`, footer: U.btn({ label: cancel, act: 'no', cls: 'btn-ghost' }) + U.btn({ label: ok, act: 'yes', cls: danger ? 'btn-danger-solid' : 'btn-primary' }), onClose: () => res(m._r || false) });
    U.bind(m.el, { yes: () => { m._r = m.data(); m._r.__ok = true; m.close(); }, no: () => { m._r = false; m.close(); } });
  });
  U.menu = (anchor, items) => {
    document.querySelectorAll('.menu').forEach(m => m.remove());
    const menu = U.el(`<div class="menu" role="menu">${items.map(it => { if (it === '-') return '<hr>'; if (it.header) return `<div class="mh">${esc(it.header)}</div>`; const ph = U.phaseOf(it), off = ph && !U.phaseOn(ph); return `<button type="button" role="menuitem" class="${it.danger ? 'danger' : ''}" ${it.disabled || off ? 'disabled' : ''} title="${esc(it.title || (off ? 'Phase ' + ph + ' – ngoài scope demo' : ''))}" data-mi="${items.indexOf(it)}">${it.icon ? I(it.icon) : ''}${esc(it.label)}${U.phaseTag(ph)}</button>`; }).join('')}</div>`);
    document.body.appendChild(menu);
    const r = anchor.getBoundingClientRect(); const mw = menu.offsetWidth, mh = menu.offsetHeight;
    let left = r.right - mw, top = r.bottom + 4; if (left < 8) left = 8; if (top + mh > window.innerHeight - 8) top = r.top - mh - 4;
    menu.style.left = left + 'px'; menu.style.top = top + 'px';
    const kill = () => { menu.remove(); document.removeEventListener('click', kill, true); window.removeEventListener('scroll', kill, true); };
    menu.addEventListener('click', (e) => { const b = e.target.closest('button[data-mi]'); if (!b || b.disabled) return; e.stopPropagation(); kill(); const it = items[Number(b.dataset.mi)]; try { const rr = it.onClick && it.onClick(); if (rr && rr.catch) rr.catch(err => U.toast('err', 'Không thực hiện được', err.message)); } catch (err) { U.toast('err', 'Không thực hiện được', err.message); } });
    setTimeout(() => { document.addEventListener('click', kill, true); window.addEventListener('scroll', kill, true); }, 0);
    return menu;
  };
  U.toast = (type, title, sub = '', ms = 3800) => { const t = U.el(`<div class="toast ${type}">${I({ ok: 'check-circle', err: 'x-circle', warn: 'alert-triangle', info: 'info' }[type] || 'info')}<div><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div></div>`); document.getElementById('toast-root').appendChild(t); setTimeout(() => t.remove(), ms); return t; };
  U.p2Toast = (name) => U.toast('info', name || 'Chức năng Phase 2', TH.phase && TH.phase.available(2) ? 'Bật Phase 2 trong Công cụ nâng cao (sidebar, Admin) để dùng' : 'Ngoài scope demo Phase 1 – xem 00_SCOPE_3_PHASE.md');
  U.highlight = (sel) => { const el = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!el) return; el.classList.add('hl-guide'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => el.classList.remove('hl-guide'), 4000); };
  U.fakePdf = (title, lines) => { const txt = ['TIMOHOUSE – ' + title, '='.repeat(48), ...lines, '', 'Tài liệu mô phỏng cho mục đích demo.'].join('\n'); F.download(F.slug(title) + '.txt', txt); U.toast('ok', 'Đã tải ' + title, 'File mô phỏng (.txt) – bản thật sẽ là PDF'); };
  /* Tooltip dùng chung cho [data-tip]: 1 element fixed trong body (không bị .tbl-wrap overflow cắt), delegation trên document */
  (function tooltip() {
    let tip = null, cur = null;
    const el = () => { if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip); } return tip; };
    const hide = () => { if (tip) tip.classList.remove('show'); cur = null; };
    const show = (t) => {
      const text = t.getAttribute('data-tip'); if (!text) return;
      const n = el(); cur = t; n.textContent = text; n.classList.remove('below'); n.classList.add('show');
      const r = t.getBoundingClientRect(), w = n.offsetWidth, h = n.offsetHeight, gap = 7;
      let top = r.top - h - gap; if (top < 6) { top = r.bottom + gap; n.classList.add('below'); }
      const left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
      n.style.top = top + 'px'; n.style.left = left + 'px';
    };
    const target = (e) => e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
    document.addEventListener('mouseover', (e) => { const t = target(e); if (t && t !== cur) show(t); else if (!t && cur) hide(); });
    document.addEventListener('mouseout', (e) => { const t = target(e); if (t && (!e.relatedTarget || !t.contains(e.relatedTarget))) hide(); });
    document.addEventListener('focusin', (e) => { const t = target(e); if (t) show(t); });
    document.addEventListener('focusout', hide);
    document.addEventListener('mousedown', hide);
    document.addEventListener('scroll', () => { if (cur && document.contains(cur)) show(cur); else hide(); }, true);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
    U.hideTip = hide;
  })();
  TH.ui = U; TH.toast = U.toast;
})(window.TH);
