(function (TH) {
  const U = TH.ui, I = TH.icon, esc = TH.f.esc;
  /* Trang coming-soon dùng chung: sidebar mục P2/P3 khi phase tắt, route P2 bị guard, mục chỉ có trong scope (chưa có PNG). */
  TH.pages.comingSoon = (root, key, opts = {}) => {
    const info = TH.layout.P2_INFO[key] || ['Chức năng mở rộng', opts.phase || 2, 'Chức năng này nằm ngoài scope Phase 1 – Core Rental / Go-live.', ''];
    const [name, phase0, desc, fr, scopeOnly] = info; const phase = opts.phase || phase0;
    const P = TH.phase; const on = P && P.on(phase); const avail = P && P.available(phase); const admin = TH.auth.can('advancedTools');
    TH.router.crumb([{ label: 'Phase ' + phase }, { label: name }]);
    let status = '';
    if (scopeOnly || (on && !opts.path)) status = U.note('info', 'Chưa có mockup UI cho mục này', 'Mục thuộc Phase ' + phase + ' theo scope nhưng bộ PNG Phase ' + phase + ' không có màn tương ứng – chỉ mô tả chức năng.');
    else if (!on && avail) status = U.note('warn', 'Phase ' + phase + ' đang tắt', 'Bật trong <b>Công cụ nâng cao</b> (cuối sidebar, chỉ Admin) để mở toàn bộ màn Phase ' + phase + '. ' + (admin ? `<a class="link" data-act="enable">Bật Phase ${phase} ngay →</a>` : 'Chuyển sang vai trò Quản trị viên để bật.'));
    else if (!avail) status = U.note('info', 'Phase ' + phase + ' chưa có mockup', 'Công tắc Phase ' + phase + ' bị khóa – chưa có mockup.');
    root.innerHTML = `<div class="coming card" style="padding:40px 32px"><div class="big">${I(phase === 3 ? 'trending-up' : 'compass')}</div><h1>${esc(name)}</h1><div class="mt8"><span class="chip purple lg">Thuộc Phase ${phase}${phase === 2 ? ' – Sales, Automation & Operations' : ' – Enterprise & Investment'}</span></div><p class="mt16 muted">${esc(desc)}</p>${fr ? `<p class="small muted mt8">Yêu cầu liên quan: <b>${esc(fr)}</b></p>` : ''}<div class="mt16 tl">${status}</div><ul>${on && !scopeOnly ? '' : '<li>Không có action nghiệp vụ nào được kích hoạt khi phase đang tắt.</li>'}<li>Nguyên tắc khóa scope: không đưa thêm chức năng Phase 2/3 nếu không ảnh hưởng trực tiếp đến khả năng vận hành cho thuê.</li><li>Tham chiếu: <code>00_SCOPE_3_PHASE.md</code> §${phase === 2 ? 3 : 4}.</li></ul><div class="row" style="justify-content:center;gap:10px">${U.btn({ label: 'Quay lại', icon: 'arrow-left', cls: 'btn-outline', act: 'back' })}${U.btn({ label: 'Về Tổng quan', icon: 'home', cls: 'btn-primary', act: 'home' })}</div></div>`;
    U.bind(root, { back: () => history.back(), home: () => TH.go('#/dashboard'), enable: () => { try { TH.phase.set(phase, true); U.toast('ok', 'Đã bật ' + TH.phase.info(phase).label, TH.phase.info(phase).name); } catch (e) { U.toast('err', 'Không bật được', e.message); } } });
  };
  TH.router.register('/coming-soon/:key', (root, p) => TH.pages.comingSoon(root, p.key), { menu: '', permission: 'dashboard.view' });
})(window.TH);
