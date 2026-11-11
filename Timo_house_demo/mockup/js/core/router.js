/* Hash router: #/path/:id?query */
(function (TH) {
  const R = { routes: [], current: null };
  R.register = (pattern, handler, meta = {}) => { const keys = []; const re = new RegExp('^' + pattern.replace(/\/:(\w+)/g, (m, k) => { keys.push(k); return '/([^/]+)'; }) + '$'); R.routes.push({ pattern, re, keys, handler, meta }); };
  R.parse = () => { let h = location.hash || '#/dashboard'; h = h.replace(/^#/, ''); const [path, qs] = h.split('?'); const query = {}; (qs || '').split('&').filter(Boolean).forEach(p => { const [k, v] = p.split('='); query[decodeURIComponent(k)] = decodeURIComponent(v || ''); }); return { path: path || '/dashboard', query }; };
  R.match = (path) => { for (const r of R.routes) { const m = path.match(r.re); if (m) { const params = {}; r.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i + 1])); return { route: r, params }; } } return null; };
  R.go = (hash) => { if (!hash.startsWith('#')) hash = '#' + hash; if (location.hash === hash) R.render(); else location.hash = hash; };
  R.replaceQuery = (q) => { const { path } = R.parse(); const qs = Object.entries(q).filter(([k, v]) => v !== '' && v != null).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&'); history.replaceState(null, '', '#' + path + (qs ? '?' + qs : '')); };
  R.render = () => {
    const { path, query } = R.parse();
    const app = document.getElementById('app');
    if (TH.store.state.session && TH.auth && !TH.auth.validateSession()) R._sessionEnded = true;
    if (!TH.store.state.session) { if (path !== '/login') { R._after = path + (Object.keys(query).length ? '?' + new URLSearchParams(query) : ''); } TH.pages.login.render(app); document.body.classList.remove('guide-open'); R.current = { path: '/login' }; return; }
    if (path === '/login') { R.go(R._after && R._after !== '/login' ? R._after : '/dashboard'); R._after = null; return; }
    const m = R.match(path);
    if (!m) { R.go('/dashboard'); return; }
    TH.layout.ensure(app);
    // Route handlers bind delegated events directly to #content. Reusing the
    // same node across renders keeps the old handlers alive, so one click can
    // invoke every handler registered by previous renders and open duplicate
    // drawers/modals. Replace the page root to give each render a clean event
    // lifecycle while preserving its id, classes and layout attributes.
    // Render lồng nhau (blur ô lọc đang focus → 'change' → applyFilter → refresh) sẽ làm replaceWith văng lỗi:
    // đánh dấu và render lại 1 lần sau khi render hiện tại xong.
    if (R._rendering) { R._again = true; return; }
    R._rendering = true;
    const previousRoot = document.getElementById('content');
    const root = previousRoot.cloneNode(false);
    if (previousRoot.contains(document.activeElement)) document.activeElement.blur();
    previousRoot.replaceWith(root);
    R.current = { path, query, params: m.params, route: m.route };
    TH.layout.setActive(m.route.meta.menu || path);
    document.body.classList.remove('sb-open');
    if (m.route.meta.phase && TH.phase && !TH.phase.on(m.route.meta.phase)) {
      // Route thuộc phase đang tắt → trang coming-soon dùng chung, giữ nguyên URL
      TH.pages.comingSoon(root, m.route.meta.scopeKey || m.route.meta.menu || 'p2', { phase: m.route.meta.phase, path });
    } else if (!TH.auth.canRoute(m.route.meta, m.params)) {
      TH.router.crumb([{ label: 'Không có quyền truy cập' }]);
      root.innerHTML = `<div class="card"><div class="card-b">${TH.ui.empty({ icon: 'lock', title: '403 – Không có quyền truy cập', text: TH.auth.role() === 'ops' && !(TH.auth.allowedBuildingIds() || new Set()).size ? 'Tài khoản chưa được phân công tòa. Vui lòng liên hệ Quản trị viên.' : 'Tài khoản của bạn không có quyền truy cập chức năng hoặc dữ liệu này.', action: `<a class="btn btn-primary btn-sm" href="#/dashboard">Về Tổng quan</a>` })}</div></div>`;
    } else try { if (TH.phase && TH.phase.on(2) && TH.actions.expireHolds) TH.actions.expireHolds(); m.route.handler(root, m.params, query); TH.auth.enforceUI(root, path); if (TH.ui.enhanceSideCards) TH.ui.enhanceSideCards(root); } catch (e) { console.error(e); root.innerHTML = `<div class="card"><div class="card-b"><div class="note-box danger">${TH.icon('alert-triangle')}<div><b>Lỗi hiển thị trang</b>${TH.esc(e.message)}</div></div></div></div>`; }
    if (TH.auth.role() === 'ops' && TH.auth.allowedBuildingIds() && !TH.auth.allowedBuildingIds().size && TH.auth.canRoute(m.route.meta, m.params)) root.insertAdjacentHTML('afterbegin', `<div class="note-box warn mb16">${TH.icon('alert-triangle')}<div><b>Chưa được phân công tòa</b>Liên hệ Quản trị viên để được gán phạm vi. Dữ liệu nghiệp vụ đang được ẩn.</div></div>`);
    if (window.scrollY > 0 && R._lastPath !== path) window.scrollTo(0, 0); R._lastPath = path;
    TH.store.emit('route');
    R._rendering = false; if (R._again) { R._again = false; R.render(); }
  };
  // Áp bộ lọc trang: kỳ chọn trong filterbar đồng bộ lên topbar (meta.period); 'all' = tất cả kỳ; không ghi period vào URL
  R.applyFilter = (f, d = {}) => { const n = Object.assign({}, f, d); if (d.period !== undefined && d.period && d.period !== f.period) { TH.store.state.meta.period = d.period; TH.store.save(); TH.layout && TH.layout.refreshTop(); } if (n.period === '') n.period = 'all'; else delete n.period; R.replaceQuery(n); R.refresh(); };
  R.periodOf = (q) => q.period === 'all' ? '' : (q.period || TH.store.state.meta.period);
  R.refresh = () => { R._keepScroll = window.scrollY; R.render(); window.scrollTo(0, R._keepScroll || 0); };
  R.start = () => { window.addEventListener('hashchange', R.render); R.render(); };
  R.crumb = (items) => TH.layout.setBreadcrumb(items);
  TH.router = R; TH.pages = TH.pages || {};
  TH.go = R.go;
})(window.TH);
