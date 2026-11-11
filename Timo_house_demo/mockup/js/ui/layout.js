/* Shell: sidebar + topbar + content + công cụ nâng cao */
(function (TH) {
  const F = TH.f, U = TH.ui, I = TH.icon, esc = F.esc, Q = TH.q;
  const L = {};
  L.MENU = [
    { items: [{ key: 'dashboard', label: 'Tổng quan', icon: 'home', href: '#/dashboard', permission: 'dashboard.view' }] },
    { key: 'operations', group: 'Vận hành', icon: 'building', items: [
      { key: 'buildings', label: 'Tòa nhà', icon: 'building', href: '#/buildings', permission: 'buildings.view' },
      { key: 'rooms', label: 'Phòng', icon: 'door', href: '#/rooms', permission: 'rooms.view' },
      { key: 'tenants', label: 'Khách thuê', icon: 'users', href: '#/tenants', permission: 'tenants.view' },
      { key: 'contracts', label: 'Hợp đồng', icon: 'file-text', href: '#/contracts', permission: 'contracts.view' },
      { key: 'landlords', label: 'Chủ nhà & đối tác', icon: 'user-check', href: '#/landlords', permission: 'landlords.view' },
      { key: 'maintenance', label: 'Bảo trì - Sửa chữa', icon: 'wrench', phase: 2, href: '#/maintenance', permission: 'maintenance.view' },
      { key: 'tasks', label: 'Lịch công việc', icon: 'calendar', phase: 2, href: '#/maintenance/schedules', permission: 'maintenance.view' },
    ] },
    { key: 'finance', group: 'Tài chính', icon: 'wallet', items: [
      { key: 'invoices', label: 'Hóa đơn', icon: 'receipt', href: '#/invoices', permission: 'invoices.view' },
      { key: 'receivables', label: 'Thu tiền & công nợ', icon: 'wallet', href: '#/receivables', permission: 'payments.view' },
      { key: 'refunds', label: 'Hoàn cọc', icon: 'hand-coins', href: '#/refunds', permission: 'refunds.view' },
      { key: 'expenses', label: 'Chi phí', icon: 'credit-card', href: '#/expenses', permission: 'expenses.view' },
      { key: 'cashbook', label: 'Thu chi', icon: 'arrow-left-right', phase: 2, href: '#/reports/cashflow', permission: 'reports.hub' },
      { key: 'deposits', label: 'Quản lý cọc', icon: 'piggy', phase: 2, href: '#/finance/deposits', permission: 'deposits.view' },
      { key: 'statement', label: 'Nhập bảng kê thu tiền', icon: 'database', phase: 2, href: '#/finance/statement-import', permission: 'statement.import', hideWhenOff: true },
      { key: 'opening', label: 'Chuyển số dư ban đầu', icon: 'file-spreadsheet', phase: 2, href: '#/finance/opening-balance', permission: 'openingBalance.manage', hideWhenOff: true },
      { key: 'bank', label: 'Ngân hàng', icon: 'landmark', phase: 3, href: '#/finance/bank', permission: 'bank.view' },
    ] },
    { key: 'notifications', group: 'Thông báo', icon: 'bell', items: [
      { key: 'zalo-config', label: 'Cấu hình Zalo', icon: 'sliders', href: '#/zalo/config', permission: 'zalo.config' },
      { key: 'zalo-new', label: 'Tạo đợt gửi', icon: 'send', href: '#/zalo/batches/new', permission: 'zalo.send' },
      { key: 'zalo-history', label: 'Lịch sử gửi', icon: 'history', href: '#/zalo/history', permission: 'zalo.view' },
    ] },
    { key: 'business', group: 'Kinh doanh', icon: 'briefcase', items: [
      { key: 'crm-overview', label: 'Tổng quan KD', icon: 'bar-chart-2', phase: 2, href: '#/crm', permission: 'crm.view', hideWhenOff: true },
      { key: 'crm', label: 'Khách hàng / Lead', icon: 'user', phase: 2, href: '#/crm/leads', permission: 'crm.view', offLabel: 'Khách hàng' },
      { key: 'viewings', label: 'Lịch xem phòng', icon: 'calendar-check', phase: 2, href: '#/crm/viewings', permission: 'crm.view' },
      { key: 'holds', label: 'Giữ chỗ', icon: 'clock', phase: 2, href: '#/crm/holds', permission: 'crm.view', hideWhenOff: true },
      { key: 'deals', label: 'Giao dịch & hoa hồng', icon: 'hand-coins', phase: 2, href: '#/crm/deals', permission: 'deals.view', hideWhenOff: true },
      { key: 'channels', label: 'Kênh cho thuê', icon: 'share', phase: 2, scopeOnly: true }, { key: 'marketing', label: 'Marketing', icon: 'megaphone', phase: 2, scopeOnly: true },
    ] },
    { key: 'hr', group: 'Nhân sự', icon: 'users', items: [{ key: 'hr', label: 'Nhân viên', icon: 'users', phase: 3, href: '#/hr', permission: 'hr.view' }, { key: 'timesheet', label: 'Chấm công', icon: 'clock', phase: 3, href: '#/hr/timesheet', permission: 'timesheet.view' }, { key: 'payroll', label: 'Lương thưởng', icon: 'banknote', phase: 3, href: '#/hr/payroll', permission: 'payroll.view' }] },
    { key: 'investment', group: 'Đầu tư', icon: 'trending-up', items: [{ key: 'projects', label: 'Dự án', icon: 'folder', phase: 3, href: '#/investment/projects', permission: 'projects.view' }, { key: 'assets', label: 'Tài sản', icon: 'package', phase: 3, href: '#/assets', permission: 'assets.view' }, { key: 'roi', label: 'Hiệu quả đầu tư', icon: 'trending-up', phase: 3, href: '#/investment/shareholders', permission: 'shareholders.view' }] },
    { key: 'reports', group: 'Báo cáo', icon: 'bar-chart', items: [{ key: 'reports', label: 'Báo cáo Phase 1', icon: 'bar-chart', href: '#/reports', permission: 'reports.view' }, { key: 'reports-detail', label: 'Trung tâm báo cáo', icon: 'list', phase: 2, href: '#/reports/hub', permission: 'reports.hub', offPermission: 'reports.view', offLabel: 'Báo cáo chi tiết' }] },
    { key: 'settings', group: 'Cấu hình', icon: 'settings', items: [
      { key: 'users', label: 'Tài khoản & phân quyền', icon: 'shield', href: '#/settings/users', permission: 'users.manage' },
      { key: 'catalog', label: 'Danh mục dùng chung', icon: 'sliders', href: '#/settings/catalog', permission: 'catalog.view' },
      { key: 'import', label: 'Import dữ liệu', icon: 'upload', href: '#/settings/import', permission: 'import.view' },
      { key: 'zalo-settings', label: 'Thông báo & nhắc việc', icon: 'bell', href: '#/zalo/config', permission: 'zalo.config' },
      { key: 'jobs', label: 'Nhập dữ liệu & tác vụ', icon: 'database', phase: 2, href: '#/settings/jobs', permission: 'dataJobs.view', hideWhenOff: true },
      { key: 'system', label: 'Thiết lập hệ thống', icon: 'settings', phase: 2, scopeOnly: true, permission: 'advancedTools', offPermission: 'advancedTools' },
    ] },
  ];
  const SIDEBAR_GROUP_KEY = 'timohouse.sidebar.openGroup';
  const validSidebarGroup = (key) => !!key && L.MENU.some(group => group.key === key && group.group);
  const readSidebarGroup = () => { try { const key = sessionStorage.getItem(SIDEBAR_GROUP_KEY); return validSidebarGroup(key) ? key : ''; } catch (e) { return ''; } };
  const saveSidebarGroup = (key) => { try { sessionStorage.setItem(SIDEBAR_GROUP_KEY, key || ''); } catch (e) { } };
  // Mục có phase: phase tắt → hiện như bản P1 (mờ, coming-soon, không lọc quyền trừ offPermission); phase bật → link thật, lọc quyền, giữ badge
  const phaseOn = (it) => !it.phase || (TH.phase && TH.phase.on(it.phase));
  const visibleItems = group => group.items.filter(it => { if (it.phase && !phaseOn(it)) return !it.hideWhenOff && (!it.offPermission || TH.auth.can(it.offPermission)); return !it.permission || TH.auth.can(it.permission); });
  const sidebarItem = (it) => { const on = it.phase && phaseOn(it); const live = on && !it.scopeOnly && it.href; return `<a class="sb-item ${it.phase ? 'p' + it.phase + (on ? ' on' : '') : ''}" data-key="${it.key}" href="${live ? it.href : (it.href && !it.phase ? it.href : '#/coming-soon/' + it.key)}">${I(it.icon)}<span>${esc(!on && it.offLabel ? it.offLabel : it.label)}</span>${it.phase ? `<span class="ptag ${on ? 'on' : ''}">P${it.phase}</span>` : ''}</a>`; };
  const sidebarGroup = (group) => {
    const items = visibleItems(group); if (!items.length) return '';
    if (!group.group) return `<div class="sb-standalone">${items.map(sidebarItem).join('')}</div>`;
    const open = group.key === L._openGroup; const contentId = 'sb-group-' + group.key;
    return `<section class="sb-section ${open ? 'open' : ''}" data-sb-group="${group.key}"><button type="button" class="sb-group" data-act="sb-group" data-group="${group.key}" aria-expanded="${open}" aria-controls="${contentId}"><span class="sb-group-icon">${I(group.icon)}</span><span>${esc(group.group)}</span><span class="sb-group-chevron">${I('chevron-down')}</span></button><div class="sb-children" id="${contentId}" aria-hidden="${!open}" ${open ? '' : 'inert'}><div class="sb-children-inner">${items.map(sidebarItem).join('')}</div></div></section>`;
  };
  const renderSidebar = () => { const nav = document.querySelector('.sb-nav'); if (nav) nav.innerHTML = L.MENU.map(sidebarGroup).join(''); };
  L._openGroup = readSidebarGroup();
  L._activeMenuKey = null;
  L.setOpenGroup = (key, persist = true) => {
    const next = validSidebarGroup(key) ? key : '';
    L._openGroup = next;
    document.querySelectorAll('.sb-section').forEach(section => {
      const open = section.dataset.sbGroup === next; const button = section.querySelector('.sb-group'); const children = section.querySelector('.sb-children');
      section.classList.toggle('open', open); button && button.setAttribute('aria-expanded', String(open));
      if (children) { children.setAttribute('aria-hidden', String(!open)); children.toggleAttribute('inert', !open); }
    });
    if (persist) saveSidebarGroup(next);
  };
  L.P2_INFO = {
    maintenance: ['Bảo trì - Sửa chữa', 2, 'Ghi nhận sự cố theo tòa/phòng, phân công, mức ưu tiên, chi phí liên quan; lịch bảo dưỡng nhắc trước 7 ngày; checklist và evidence.', 'FR-MNT-01/03'],
    tasks: ['Lịch công việc', 2, 'Lịch việc cho NV vận hành/kỹ thuật, nhắc việc theo tòa.', 'FR-MNT-01'],
    cashbook: ['Thu chi', 2, 'Sổ thu chi tổng hợp, cashflow, operating result, khóa kỳ.', 'FR-FIN-08, FR-REP-02'],
    deposits: ['Quản lý cọc', 2, 'Sổ cọc khách thuê tách với cọc trả chủ nhà, đối chiếu số dư cọc.', 'FR-FIN-06/07'],
    bank: ['Ngân hàng', 3, 'Kết nối ngân hàng, đối soát tự động, QR payment, webhook thanh toán.', 'Phase 3 – Payment & Banking'],
    crm: ['Khách hàng (CRM Lead)', 2, 'Lead list/Kanban, nguồn khách, sale phụ trách, lịch sử chăm sóc, pipeline Mới → Chốt thuê.', 'FR-SAL-01'],
    channels: ['Kênh cho thuê', 2, 'Quản lý kênh đăng tin, đối tác môi giới, hiệu quả kênh.', 'FR-SAL-01/05', true],
    viewings: ['Lịch xem phòng', 2, 'Đặt lịch xem phòng, nhân viên phụ trách, nhắc lịch, kết quả xem.', 'FR-SAL-02'],
    marketing: ['Marketing', 2, 'Chiến dịch, chi phí marketing, đo hiệu quả theo nguồn.', 'FR-SAL-05', true],
    'crm-overview': ['Tổng quan kinh doanh', 2, 'KPI lead, lịch xem, giữ chỗ, chốt thuê và doanh số theo nhân viên.', 'FR-SAL-01/04'],
    holds: ['Giữ chỗ phòng', 2, 'Giữ chỗ có thời hạn tối đa 14 ngày, phí giữ chỗ trừ vào cọc, tự hết hạn.', 'FR-SAL-02 (OI-09)'],
    deals: ['Giao dịch & hoa hồng', 2, 'Chốt thuê từ lead, theo dõi doanh số và hoa hồng theo nhân viên (BR-13).', 'FR-SAL-03/04'],
    jobs: ['Nhập dữ liệu & tác vụ (Data Jobs)', 2, 'Theo dõi tác vụ import, tiến độ, kết quả từng dòng, thử lại phần lỗi.', 'Phase 2 §3.4'],
    opening: ['Chuyển số dư ban đầu', 2, 'Đối chiếu công nợ/cọc từ hệ thống cũ, xác nhận chuyển số dư.', 'FR-FIN-09'],
    p2: ['Màn hình Phase 2', 2, 'Route này thuộc Phase 2 – bật phase để xem.', ''],
    p3: ['Màn hình Phase 3', 3, 'Route này thuộc Phase 3 – bật phase để xem.', ''],
    inventory: ['Kiểm kê tài sản', 3, 'Đợt kiểm kê hàng tháng theo tòa, ghi kết quả/bằng chứng, biên bản kiểm kê (Admin/Kế toán phụ trách).', 'FR-MNT-02'],
    shareholders: ['Cổ đông, vốn góp & phân phối', 3, 'Danh sách cổ đông, tỷ lệ vốn nhập tay theo dự án, đợt góp vốn, bảng phân phối lợi nhuận.', 'FR-SHR-01/02/03'],
    hr: ['Nhân viên', 3, 'Hồ sơ nhân viên, phòng ban, chức danh, phân công, KPI.', 'FR-HR-01/03'],
    timesheet: ['Chấm công', 3, 'Chấm công nếu cần, liên kết bảng lương.', 'FR-HR-02'],
    payroll: ['Lương thưởng', 3, 'Lương cứng + phụ cấp + hoa hồng; công thức TBD (OI-15).', 'FR-HR-02'],
    projects: ['Dự án', 3, 'Danh mục dự án đầu tư, cổ đông, vốn góp.', 'FR-SHR-01/02'],
    assets: ['Tài sản', 3, 'Danh mục tài sản theo phòng/tòa, QR, kiểm kê hàng tháng, khấu hao.', 'FR-BLD-04, FR-MNT-02'],
    roi: ['Hiệu quả đầu tư', 3, 'Hiệu suất, lợi nhuận theo tòa, phân phối cổ đông – công thức TBD (OI-10/12/13/17).', 'FR-REP-01/02, FR-SHR-02'],
    'reports-detail': ['Báo cáo chi tiết / Report Hub', 2, 'Danh mục 20 báo cáo, tạo/lưu/tải XLSX, phiên bản và công bố.', 'FR-REP-07–11'],
    system: ['Thiết lập hệ thống', 2, 'Thông số hệ thống, múi giờ, làm tròn, chính sách lưu trữ (OI-24).', 'NFR', true],
    ocr: ['Trích xuất hợp đồng (OCR)', 2, 'Upload PDF/JPG, trích xuất trường, review confidence, mapping vào form hợp đồng.', 'FR-CUS-02 (BR-03)'],
    statement: ['Import bảng kê thu tiền', 2, 'Mapping, auto-match hóa đơn, review, Data Jobs, retry dòng lỗi.', 'Phase 2 §3.4'],
    'refund-workflow': ['Duyệt hoàn cọc nhiều cấp', 2, 'Workflow duyệt nhiều cấp theo ngưỡng số tiền.', 'FR-FIN-07 (OI-07)'],
    'zalo-advanced': ['Notification nâng cao', 2, 'Rule Builder, template management, provider response, fallback SMS, hội thoại 2 chiều.', 'FR-ZAL-04/05/06'],
  };
  const switchDemoRole = role => {
    try { TH.auth.switchRole(role); L.refreshTop(); TH.router.refresh(); U.toast('ok', role === 'admin' ? 'Đã quay lại Admin' : 'Đã chuyển vai trò', TH.auth.ROLE_LABEL[role] + ' – ' + TH.store.state.session.name); }
    catch (e) { U.toast('err', 'Không thể chuyển vai trò', e.message); }
  };
  const openUserMenu = el => {
    const s = TH.store.state.session, items = [];
    if (s.role === 'admin' || s.impersonator) {
      items.push({ header: s.impersonator ? 'Admin đang xem theo vai trò' : 'Chuyển vai trò (Admin demo)' });
      ['admin', 'accountant', 'ops', ...(TH.phase && TH.phase.on(2) ? ['sale', 'kythuat'] : []), ...(TH.phase && TH.phase.on(3) ? ['hr', 'codong'] : [])].forEach(role => items.push({ label: role === 'admin' && s.impersonator ? 'Quay lại Admin' : (s.role === role ? '● ' : '○ ') + TH.auth.ROLE_LABEL[role], icon: role === 'admin' && s.impersonator ? 'corner-up-left' : 'user', onClick: () => switchDemoRole(role) }));
      items.push('-');
    }
    if (TH.auth.can('users.manage')) items.push({ label: 'Quản lý tài khoản', icon: 'user-check', onClick: () => TH.go('#/settings/users') });
    items.push({ label: 'Đăng xuất', icon: 'log-out', danger: true, onClick: () => { TH.auth.logout(); TH.go('#/login'); } });
    U.menu(el, items);
  };
  L.ensure = (app) => {
    if (app.querySelector('.app')) { L.refreshTop(); return; }
    app.innerHTML = `<div class="app"><div class="sb-backdrop" data-act="sb-close"></div><aside class="sidebar"><div class="sb-logo"><div class="mark">${I('home')}</div><div><div class="name">Timo<span>House</span></div><div class="tag">Quản lý nhà cho thuê</div></div></div><nav class="sb-nav" data-guide="sidebar">${L.MENU.map(sidebarGroup).join('')}</nav><div class="sb-foot"><div id="sb-version">Phiên bản 3.0.0 · Phạm vi: P1</div><div>TimoHouse © 2026</div><details><summary>${I('settings')} Công cụ nâng cao</summary><div class="adv"><div class="phase-switch" id="phase-switch"></div><button data-act="adv-reset">↺ Đặt lại dữ liệu demo</button><button data-act="adv-clear">✕ Xóa trắng dữ liệu nghiệp vụ</button><button data-act="adv-today">📅 Đổi ngày hệ thống demo</button><button data-act="adv-export">⇩ Xuất state JSON</button><button data-act="adv-import">⇧ Nhập state JSON</button><button data-act="adv-runall">▶ Chạy toàn bộ kịch bản Go-live</button><button data-act="adv-runall-p2" id="adv-runall-p2" hidden>▶ Chạy kịch bản Phase 2 (kỹ thuật)</button><button data-act="adv-runall-p3" id="adv-runall-p3" hidden>▶ Chạy kịch bản Phase 3 (kỹ thuật)</button><button data-act="adv-guide-reset">⟲ Reset tiến độ hướng dẫn</button></div></details></div></aside><div class="main"><header class="topbar"><button class="tb-menu-btn" data-act="sb-toggle" aria-label="Menu">${I('menu')}</button><div class="crumbs" id="crumbs"></div><div class="tb-search" data-act="palette">${I('search')}<input placeholder="Tìm kiếm phòng, khách thuê, hợp đồng..." readonly><span class="kbd">Ctrl</span><span class="kbd">K</span></div><button class="tb-guide" data-act="guide" data-guide="guide-btn">${I('book-open')}<span>Hướng dẫn thao tác</span></button><button class="tb-bell" data-act="bell" aria-label="Thông báo">${I('bell')}<span class="badge" id="bell-badge">0</span></button><div class="tb-period"><span>Kỳ báo cáo</span><select id="period-sel" data-on="period"></select></div><div class="tb-user" data-act="user-menu"><div class="avatar" id="tb-avatar"></div><div><div class="nm" id="tb-name"></div><div class="rl" id="tb-role"></div></div>${I('chevron-down')}</div></header><main class="content" id="content"></main></div></div>`;
    if (!app.dataset.bound) { app.dataset.bound = '1';
    U.bind(app, {
      'sb-toggle': () => document.body.classList.toggle('sb-open'), 'sb-close': () => document.body.classList.remove('sb-open'),
      'sb-group': (el) => L.setOpenGroup(el.dataset.group === L._openGroup ? '' : el.dataset.group),
      palette: () => L.palette(), guide: () => TH.guide && TH.guide.toggle(),
      bell: (el) => { const t = Q.todo(); U.menu(el, [{ header: 'Việc cần xử lý' }, ...(TH.auth.can('contracts.view') ? [{ label: `Hợp đồng sắp hết hạn (${t.expiring})`, icon: 'file-text', onClick: () => TH.go('#/contracts?status=expiring') }] : []), ...(TH.auth.can('payments.view') ? [{ label: `Hóa đơn quá hạn (${t.overdue})`, icon: 'receipt', onClick: () => TH.go('#/receivables?overdue=1&period=all') }] : []), ...(TH.auth.can('zalo.view') ? [{ label: `Tin Zalo gửi lỗi (${t.zaloFailed} tin · ${t.zaloFailedBatches} đợt)`, icon: 'send', onClick: () => TH.go('#/zalo/history?hasFailed=1') }] : []), ...(TH.auth.can('refunds.view') ? [{ label: `Hoàn cọc đang xử lý (${t.refunds})`, icon: 'hand-coins', onClick: () => TH.go('#/refunds?status=processing') }] : []), ...(TH.auth.can('invoices.prepare') ? [{ label: `Hóa đơn nháp chờ phát hành (${t.drafts})`, icon: 'file-plus', onClick: () => TH.go('#/invoices?doc=draft&period=all') }] : []), ...(TH.phase && TH.phase.on(2) && TH.auth.can('maintenance.view') ? [{ label: `Lịch bảo dưỡng sắp đến hạn 7 ngày (${t.maintenanceDue || 0})`, icon: 'wrench', onClick: () => TH.go('#/maintenance/schedules?status=due_soon') }] : []), ...(TH.phase && TH.phase.on(2) && TH.auth.can('crm.view') ? [{ label: `Lịch xem phòng hôm nay (${t.viewingsToday || 0})`, icon: 'calendar-check', onClick: () => TH.go('#/crm/viewings?status=scheduled') }] : []), ...(TH.phase && TH.phase.on(3) && TH.auth.can('inventory.view') ? [{ label: `Tài sản cần xử lý sau kiểm kê (${t.inventoryPending || 0})`, icon: 'package', onClick: () => TH.go('#/assets/inventory?status=needs_action') }] : []), ...(TH.phase && TH.phase.on(3) && TH.auth.can('shareholders.view') ? [{ label: `Đợt góp vốn đến hạn (${t.contributionsDue || 0})`, icon: 'hand-coins', onClick: () => TH.go('#/investment/shareholders?tab=contributions&status=due') }] : []), ...(TH.phase && TH.phase.on(3) && TH.auth.can('hr.view') ? [{ label: `Nhân viên sắp hết thử việc (${t.probationEnding || 0})`, icon: 'user-plus', onClick: () => TH.go('#/hr?status=probation') }] : [])]); },
      'user-menu': openUserMenu,
      'adv-reset': async () => { if (await U.confirm({ title: 'Đặt lại dữ liệu demo?', text: 'Toàn bộ dữ liệu nghiệp vụ sẽ quay về bộ seed ban đầu. Tiến độ hướng dẫn được giữ.', ok: 'Đặt lại', danger: true })) { const g = TH.store.state.guide; TH.store.reset(true); TH.store.state.guide = g; TH.store.saveNow(); TH.auth.login('admin', 'demo'); TH.go('#/dashboard'); TH.router.refresh(); U.toast('ok', 'Đã đặt lại dữ liệu demo'); } },
      'adv-clear': async () => { if (await U.confirm({ title: 'Xóa trắng dữ liệu nghiệp vụ?', text: 'Chỉ giữ tài khoản, danh mục dịch vụ và cấu hình Zalo. Dùng để demo từ trạng thái rỗng theo spec v1.5.', ok: 'Xóa trắng', danger: true })) { TH.store.clearBusiness(); TH.go('#/dashboard'); TH.router.refresh(); U.toast('ok', 'Đã xóa trắng dữ liệu nghiệp vụ'); } },
      'adv-today': () => { const m = U.modal({ title: 'Đổi ngày hệ thống demo', size: 'sm', body: U.field({ label: 'Ngày "hôm nay" của demo', input: U.date({ name: 'today', value: F.today() }), help: 'Mặc định 28/10/2026 để khớp số liệu mockup. Ảnh hưởng tính quá hạn, sắp hết hạn, còn lại N ngày.' }), footer: U.btn({ label: 'Hủy', act: 'close2' }) + U.btn({ label: 'Áp dụng', act: 'ok', cls: 'btn-primary' }) }); U.bind(m.el, { ok: () => { TH.actions.setToday(m.data().today); m.close(); TH.router.refresh(); }, close2: () => m.close() }); },
      'adv-export': () => { F.download('timehouse-demo-state.json', TH.store.exportJSON(), 'application/json'); U.toast('ok', 'Đã xuất state JSON'); },
      'adv-import': () => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json'; inp.onchange = () => { const f = inp.files[0]; const rd = new FileReader(); rd.onload = () => { try { TH.store.importJSON(rd.result); TH.router.refresh(); U.toast('ok', 'Đã nhập state'); } catch (e) { U.toast('err', 'Không nhập được', e.message); } }; rd.readAsText(f); }; inp.click(); },
      'adv-runall': async () => { if (await U.confirm({ title: 'Chạy toàn bộ kịch bản Go-live?', text: 'Hệ thống tự thực hiện 16 bước (tạo khách → HĐ → điện nước → hóa đơn → Zalo → thu tiền → nhắc nợ → kết thúc HĐ → hoàn cọc → dọn phòng) trên dữ liệu hiện có. Chỉ dùng để kiểm tra kỹ thuật.', ok: 'Chạy' })) { try { const r = await TH.guide.runAll(); U.toast('ok', 'Đã chạy xong kịch bản', r); TH.router.refresh(); } catch (e) { U.toast('err', 'Kịch bản dừng', e.message); TH.router.refresh(); } } },
      'adv-guide-reset': () => { TH.guide.resetProgress(); U.toast('ok', 'Đã reset tiến độ hướng dẫn', 'Dữ liệu nghiệp vụ được giữ nguyên'); },
      'adv-runall-p3': async () => { if (await U.confirm({ title: 'Chạy kịch bản Phase 3?', text: 'Hệ thống tự thực hiện các luồng F16–F19 (kiểm kê tài sản; nhân sự → phân công → chấm công → lương; cổ đông → góp vốn → phân phối; sao kê ngân hàng → đối soát) trên dữ liệu hiện có. Chỉ dùng để kiểm tra kỹ thuật.', ok: 'Chạy' })) { try { const r = await TH.guide.runAllP3(); U.toast('ok', 'Đã chạy xong kịch bản Phase 3', r, 6000); TH.router.refresh(); } catch (e) { U.toast('err', 'Kịch bản dừng', e.message); TH.router.refresh(); } } },
      'adv-runall-p2': async () => { if (await U.confirm({ title: 'Chạy kịch bản Phase 2?', text: 'Hệ thống tự thực hiện các luồng F11–F15 (lead → giữ chỗ → chốt thuê → HĐ → hoa hồng; OCR; bảng kê & Data Job; sự cố & bảo dưỡng; báo cáo/khóa kỳ/Zalo retry) trên dữ liệu hiện có. Chỉ dùng để kiểm tra kỹ thuật.', ok: 'Chạy' })) { try { const r = await TH.guide.runAllP2(); U.toast('ok', 'Đã chạy xong kịch bản Phase 2', r, 6000); TH.router.refresh(); } catch (e) { U.toast('err', 'Kịch bản dừng', e.message); TH.router.refresh(); } } },
    });
    U.onChange(app, { 'phase-2': (el) => L.togglePhase(2, el.checked), 'phase-3': (el) => L.togglePhase(3, el.checked) });
    app.querySelector('#period-sel').addEventListener('change', (e) => { TH.store.state.meta.period = e.target.value; TH.store.save(); TH.router.refresh(); });
    document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); L.palette(); } });
    }
    else app.querySelector('#period-sel').addEventListener('change', (e) => { TH.store.state.meta.period = e.target.value; TH.store.save(); TH.router.refresh(); });
    L.refreshTop();
  };
  L.refreshTop = () => {
    const s = TH.store.state.session; if (!s) return; const u = TH.auth.user() || {};
    renderSidebar();
    const av = document.getElementById('tb-avatar'); if (av) { av.textContent = F.initials(u.name); }
    const nm = document.getElementById('tb-name'); if (nm) nm.textContent = u.name || ''; const rl = document.getElementById('tb-role'); if (rl) rl.textContent = (TH.auth.ROLE_LABEL[u.role] || '') + (s.impersonator ? ' · Đang giả lập' : '');
    const badge = document.getElementById('bell-badge'); if (badge) { const t = Q.todo(); badge.textContent = t.total > 99 ? '99+' : t.total; badge.hidden = !t.total; }
    const ps = document.getElementById('period-sel'); if (ps) { const periods = [...new Set(TH.store.all('invoices').map(i => i.period).concat(['2026-10', '2026-11', '2026-09']))].sort().reverse(); ps.innerHTML = periods.map(p => `<option value="${p}" ${p === TH.store.state.meta.period ? 'selected' : ''}>${F.periodLabel(p)}</option>`).join(''); }
    const advanced = document.querySelector('.sb-foot details'); if (advanced) advanced.hidden = !TH.auth.can('advancedTools');
    const ver = document.getElementById('sb-version'); if (ver && TH.phase) ver.textContent = 'Phiên bản 3.0.0 · Phạm vi: ' + TH.phase.label();
    const sw = document.getElementById('phase-switch'); if (sw && TH.phase) sw.innerHTML = `<div class="ps-title">Phạm vi demo</div>${[1, 2, 3].map(n => { const inf = TH.phase.info(n); const on = TH.phase.on(n); const dis = n === 1 || !TH.phase.available(n); return `<label class="ps-row ${dis ? 'dis' : ''}" title="${n === 1 ? 'Phase 1 luôn bật' : !TH.phase.available(n) ? 'Chưa có mockup UI' : esc(inf.name)}"><input type="checkbox" data-on="phase-${n}" ${on ? 'checked' : ''} ${dis ? 'disabled' : ''}><span><b>${inf.label}</b> – ${esc(inf.name)}${n === 1 ? ' <i>(luôn bật)</i>' : !TH.phase.available(n) ? ' <i>(chưa có mockup)</i>' : ''}</span></label>`; }).join('')}`;
    const rp2 = document.getElementById('adv-runall-p2'); if (rp2) rp2.hidden = !(TH.phase && TH.phase.on(2));
    const rp3 = document.getElementById('adv-runall-p3'); if (rp3) rp3.hidden = !(TH.phase && TH.phase.on(3));
    if (L._activeMenuKey) L.setActive(L._activeMenuKey);
  };
  L.setActive = (key) => {
    let active = null;
    document.querySelectorAll('.sb-item').forEach(item => { const on = item.dataset.key === key; item.classList.toggle('active', on); if (on) active = item; });
    const owner = active && active.closest('.sb-section');
    if (owner && L._activeMenuKey !== key) L.setOpenGroup(owner.dataset.sbGroup);
    L._activeMenuKey = key;
  };
  L.setBreadcrumb = (items) => { const c = document.getElementById('crumbs'); if (!c) return; c.innerHTML = `<a href="#/dashboard" title="Tổng quan">${I('home')}</a>` + items.map((it, i) => `<span class="sep">/</span>${i === items.length - 1 ? `<span class="cur">${esc(it.label)}</span>` : `<a class="hide-m" href="${it.href || '#'}">${esc(it.label)}</a>`}`).join(''); document.title = (items.length ? items[items.length - 1].label + ' – ' : '') + 'TimoHouse'; };
  L.palette = () => {
    if (document.querySelector('.cmdk')) return;
    const box = U.el(`<div class="cmdk"><div class="box"><input placeholder="Tìm phòng, khách thuê, hợp đồng, hóa đơn, tòa nhà… (Esc để đóng)"><div class="res"></div></div></div>`);
    document.body.appendChild(box); const inp = box.querySelector('input'), res = box.querySelector('.res'); inp.focus();
    const go = (r) => { box.remove(); TH.go(r); };
    const render = () => { const items = Q.search(inp.value); res.innerHTML = items.length ? items.map((it, i) => `<button type="button" data-i="${i}" class="${i === 0 ? 'on' : ''}">${I({ 'Phòng': 'door', 'Khách thuê': 'user', 'Hợp đồng': 'file-text', 'Hóa đơn': 'receipt', 'Tòa nhà': 'building' }[it.type])}<span><b>${esc(it.label)}</b> <span class="muted small">${esc(it.sub || '')}</span></span><span class="k">${it.type}</span></button>`).join('') : `<div class="empty small">${inp.value ? 'Không tìm thấy kết quả' : 'Gõ mã phòng (A.12.03), tên khách, mã HĐ/hóa đơn…'}</div>`; res._items = items; };
    inp.addEventListener('input', render); render();
    inp.addEventListener('keydown', (e) => { if (e.key === 'Escape') box.remove(); if (e.key === 'Enter' && res._items[0]) go(res._items[0].route); });
    res.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(res._items[Number(b.dataset.i)].route); });
    box.addEventListener('click', (e) => { if (e.target === box) box.remove(); });
  };
  /* Công tắc phase: bật/tắt → toast; tắt phase n khi đang là vai trò của phase đó → về Admin; route tự thành coming-soon (router guard, giữ URL) */
  const PHASE_TOAST = { 2: '18 màn CRM / OCR / Tài chính / Bảo trì / Báo cáo / Data Job đã mở · thêm vai trò Sale, Kỹ thuật', 3: 'Sổ tài sản & kiểm kê / Nhân sự / Chấm công / Lương / Dự án / Cổ đông / Ngân hàng đã mở · thêm vai trò Nhân sự, Cổ đông' };
  const PHASE_OFF = { 2: 'Trở về kịch bản Go-live Phase 1 – dữ liệu P2 vẫn được giữ', 3: 'Các màn Phase 3 về coming-soon – dữ liệu P3 vẫn được giữ' };
  L.togglePhase = (n, on) => {
    try {
      if (!!TH.phase.state[n] === !!on) return;
      if (!on && (TH.phase.ROLES[n] || []).includes(TH.auth.role())) { const s = TH.store.state.session; if (s && s.impersonator) TH.auth.endImpersonation(); else { const admin = TH.store.rawAll('users').find(u => u.username === 'admin' && u.status === 'active'); if (admin) { TH.store.state.session = { userId: admin.id, name: admin.name, role: 'admin', at: F.nowISO() }; TH.store.saveNow(); } else TH.auth.logout(); } U.toast('info', 'Đã chuyển về Admin', 'Vai trò ' + (TH.phase.ROLES[n] || []).map(r => TH.auth.ROLE_LABEL[r]).join(' / ') + ' chỉ khả dụng khi Phase ' + n + ' bật'); }
      TH.phase.set(n, on);
      if (on) U.toast('ok', 'Đã bật ' + TH.phase.info(n).label, PHASE_TOAST[n] || TH.phase.info(n).name, 5000);
      else U.toast('ok', 'Đã tắt ' + TH.phase.info(n).label, PHASE_OFF[n] || '');
    } catch (e) { U.toast('err', 'Không đổi được phạm vi demo', e.message); L.refreshTop(); }
  };
  TH.layout = L;
})(window.TH);
