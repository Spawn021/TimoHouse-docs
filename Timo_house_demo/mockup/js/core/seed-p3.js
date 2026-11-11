/* Seed Phase 3 – chạy cuối seed.run và khi migrate state cũ. Chỉ THÊM record P3 (tài sản, kiểm kê, nhân sự, chấm công, lương, dự án, cổ đông, góp vốn, phân phối, ngân hàng),
   không đổi số liệu P1/P2 (không sinh payments/invoices/expenses mới). Deterministic (rng riêng). Idempotent qua meta.p3Seeded.
   Ngày theo quy ước mockup: 2026 (PNG ghi 2024). Mã: TS-0001, BB-KK-2026-10, NV001, BL-2026-10, DA-001, CD-001, GV-2026-10-001, PP-2026-Q3. */
(function (TH) {
  const F = TH.f, seed = TH.seed; const H = seed.helpers;
  const T = F.DEMO_TODAY; // 2026-10-28
  const mk = (st, col, obj) => { obj.id = obj.id || F.uid(col.slice(0, 3)); obj.source = obj.source || 'seed'; obj.createdAt = obj.createdAt || '2026-10-01T08:00'; st[col].push(obj); return obj; };
  const userBy = (st, username) => st.users.find(u => u && u.username === username) || null;
  const bByName = (st, name) => st.buildings.find(b => b && b.name === name) || st.buildings.find(b => b && !b.stub);
  const roomByCode = (st, code) => st.rooms.find(r => r && r.code === code) || null;
  const d = (day) => F.addDays(T, day);

  /* ---------- Tài khoản P3 ---------- */
  function addUsersP3(st) {
    const add = (username, name, email, phone, role, scope, extra = {}) => { if (st.users.some(u => u && u.username === username)) return; st.users.push(Object.assign({ id: F.uid('usr'), source: 'seed', createdAt: '2026-09-01T08:00', username, name, email, phone, role, scope, status: 'active', lastLogin: '2026-10-22T09:00', effectiveDate: '2026-09-01', note: 'Tài khoản demo Phase 3' }, extra)); };
    add('nhansu', 'Ngô Thị Quỳnh', 'nhansu@timohouse.vn', '0910 123 456', 'hr', 'Toàn hệ thống', { note: 'Tài khoản demo Phase 3 – Nhân sự (không có quyền tài chính – FR-HR-01)' });
    add('codong', 'Trần Minh Đức', 'duc.tm@gmail.com', '0901 234 567', 'codong', 'Cổ đông – Sunrise, Moonlight, Riverside', { note: 'Tài khoản demo Phase 3 – Cổ đông (read-only, chỉ tòa đã góp vốn – FR-SHR-03/04)', buildingIds: [] });
  }
  /* ---------- Danh mục P3 (giữ khi Xóa trắng) ---------- */
  seed.catalogP3 = (st) => {
    if (!st.bankAccounts.length) [['VCB', 'Vietcombank', '0011 0045 6789', 'CÔNG TY TNHH TIMOHOUSE', 1845600000], ['TCB', 'Techcombank', '1903 6688 9900', 'CÔNG TY TNHH TIMOHOUSE', 624300000], ['ACB', 'ACB', '2233 4455 66', 'CÔNG TY TNHH TIMOHOUSE', 318900000]].forEach(([code, bank, number, name, balance]) => mk(st, 'bankAccounts', { code, bank, number, name, balance, status: 'active', qrEnabled: code === 'VCB' }));
    if (!st.expenseGroups.some(g => g.name === 'Lương')) mk(st, 'expenseGroups', { code: 'NC' + F.pad(st.expenseGroups.length + 1, 2), name: 'Lương', fullName: 'Chi phí vận hành & lương', status: 'active' });
  };

  /* ---------- Seed nghiệp vụ P3 ---------- */
  seed.phase3 = (st) => {
    if (st.meta.p3Seeded) return st;
    addUsersP3(st); seed.catalogP3(st);
    const r = H.rng(0x5eed3003); const pick = (a) => a[Math.floor(r() * a.length)]; const rint = (a, b) => a + Math.floor(r() * (b - a + 1));
    const name = () => pick(H.HO) + ' ' + pick(H.DEM) + ' ' + pick(H.TEN); const phone = () => '09' + F.pad(rint(10, 99)) + ' ' + F.pad(rint(0, 999), 3) + ' ' + F.pad(rint(0, 999), 3);
    const B = { SR: bByName(st, 'Tòa Sunrise'), ML: bByName(st, 'Tòa Moonlight'), RS: bByName(st, 'Tòa Riverside'), CT: bByName(st, 'Tòa Central'), GD: bByName(st, 'Tòa Garden') };
    const live = st.buildings.filter(b => b && !b.stub);
    const admin = userBy(st, 'admin') || st.users[0], ketoan = userBy(st, 'ketoan') || admin;

    /* ===== 1. Sổ tài sản (248) – 10 hero theo PNG + promote roomAssets P1 + khu vực chung ===== */
    let tsN = 1; const asset = (o) => mk(st, 'assets', Object.assign({ code: 'TS-' + F.pad(tsN++, 4), qty: 1, ownership: 'company', status: 'active', condition: 'good', history: [], createdAt: '2026-01-15T08:00' }, o));
    const cost = { dienlanh: [8500000, 14000000], pccc: [900000, 3500000], thangmay: [850000000, 1200000000], chieusang: [350000, 1200000], anninh: [2500000, 6000000], noithat: [1500000, 6500000], dien: [12000000, 45000000], mayphat: [180000000, 320000000], khac: [500000, 5000000] };
    const dep = { dienlanh: 60, pccc: 36, thangmay: 120, chieusang: 24, anninh: 48, noithat: 36, dien: 60, mayphat: 96, khac: 36 };
    const mkAsset = (o) => { const c = o.cost != null ? o.cost : rint(cost[o.category][0], cost[o.category][1]); return asset(Object.assign({ cost: Math.round(c / 100000) * 100000, depMonths: dep[o.category], startDate: o.startDate || ('202' + rint(3, 5) + '-' + F.pad(rint(1, 12)) + '-' + F.pad(rint(1, 28))), qr: 'QR-' + F.pad(tsN, 4) }, o)); };
    const hero = [
      ['Điều hòa Daikin 1.5HP', 'dienlanh', B.SR, 'A.12.03', 'good', 'good', 'Trần Minh Đức', d(-8), 'done'],
      ['Bình nóng lạnh Ariston', 'dienlanh', B.ML, 'B.05.01', 'good', 'minor', 'Nguyễn Thị Hương', d(-8), 'needs_action'],
      ['Thiết bị PCCC Bình chữa cháy', 'pccc', B.RS, 'C.08.02', 'good', 'good', 'Lê Quang Huy', d(-9), 'done'],
      ['Thang máy (Mitsubishi)', 'thangmay', B.CT, 'Sảnh tầng 1', 'good', 'replace', 'Phạm Thu Trang', d(-9), 'needs_action'],
      ['Đèn chiếu sáng', 'chieusang', B.GD, 'Hành lang', 'good', 'minor', 'Hoàng Nam Khánh', d(-10), 'needs_action'],
      ['Camera an ninh', 'anninh', B.SR, 'Khu vực chung', 'good', 'good', 'Nguyễn Văn An', d(-10), 'done'],
      ['Bàn làm việc', 'noithat', B.ML, 'B.06.04', 'good', 'good', 'Vũ Thị Mai', d(-11), 'done'],
      ['Ghế văn phòng', 'noithat', B.CT, 'D.07.03', 'good', 'minor', 'Đặng Quốc Bảo', d(-11), 'needs_action'],
      ['Tủ điện', 'dien', B.RS, 'Khu kỹ thuật', 'good', 'good', 'Phạm Thị Lan', d(-12), 'done'],
      ['Máy phát điện', 'mayphat', B.GD, 'Tầng hầm', 'good', 'replace', 'Lê Văn Thành', d(-13), 'needs_action'],
    ];
    const heroAssets = hero.map(h => { const room = roomByCode(st, h[3]); return mkAsset({ name: h[0], category: h[1], buildingId: h[2].id, roomId: room ? room.id : null, area: room ? room.code : h[3], condition: h[5] }); });
    // promote roomAssets P1 → sổ tài sản (giữ liên kết roomAssetId, đồng bộ tình trạng)
    const catOf = (n) => /lạnh|điều hòa|nóng/i.test(n) ? 'dienlanh' : /giường|tủ|bàn|ghế|sofa|kệ/i.test(n) ? 'noithat' : 'khac';
    const condOf = (c) => c === 'Hỏng' ? 'broken' : c === 'Cần bảo dưỡng' ? 'minor' : 'good';
    st.roomAssets.forEach(ra => { if (!ra || st.assets.some(a => a.roomAssetId === ra.id)) return; const room = st.rooms.find(x => x && x.id === ra.roomId); if (!room) return; const b = st.buildings.find(x => x && x.id === room.buildingId); if (!b || b.stub) return; if (tsN > 248) return; mkAsset({ name: ra.name, category: catOf(ra.name), buildingId: room.buildingId, roomId: room.id, area: room.code, qty: ra.qty || 1, condition: condOf(ra.condition), roomAssetId: ra.id }); });
    // tài sản khu vực chung cho đủ 248
    const COMMON = [['Camera an ninh', 'anninh', 'Khu vực chung'], ['Đèn chiếu sáng', 'chieusang', 'Hành lang'], ['Bình chữa cháy', 'pccc', 'Hành lang'], ['Máy bơm nước', 'dien', 'Khu kỹ thuật'], ['Máy lọc nước', 'khac', 'Sảnh'], ['Máy giặt chung', 'khac', 'Tầng thượng'], ['Đèn exit', 'pccc', 'Cầu thang'], ['Bàn lễ tân', 'noithat', 'Sảnh tầng 1'], ['Sofa sảnh', 'noithat', 'Sảnh tầng 1'], ['Tủ điện tầng', 'dien', 'Khu kỹ thuật'], ['Điều hòa sảnh', 'dienlanh', 'Sảnh tầng 1'], ['Thang máy', 'thangmay', 'Sảnh tầng 1']];
    let ci = 0; while (tsN <= 248) { const c = COMMON[ci % COMMON.length]; const b = live[ci % live.length]; ci++; mkAsset({ name: c[0], category: c[1], buildingId: b.id, roomId: null, area: c[2], condition: r() < .9 ? 'good' : r() < .6 ? 'minor' : 'replace' }); }
    const assets = st.assets.filter(a => a.status === 'active');

    /* ===== 2. Kiểm kê: BB-KK-2026-09 hoàn thành, BB-KK-2026-10 đang kiểm kê 198/248 (32 cần xử lý, 18 hư hỏng) ===== */
    const CHECKERS = ['Trần Minh Đức', 'Nguyễn Thị Hương', 'Lê Quang Huy', 'Phạm Thu Trang', 'Hoàng Nam Khánh', 'Nguyễn Văn An', 'Vũ Thị Mai', 'Đặng Quốc Bảo', 'Phạm Thị Lan', 'Lê Văn Thành'];
    const inv09 = mk(st, 'inventories', { code: 'BB-KK-2026-09', period: '2026-09', buildingIds: live.map(b => b.id), status: 'done', startDate: '2026-09-01', finishedAt: '2026-09-22T16:30', createdBy: ketoan.id, finishedBy: admin.id, note: 'Kiểm kê định kỳ tháng 9', createdAt: '2026-09-01T08:00' });
    assets.forEach((a, i) => mk(st, 'inventoryLines', { inventoryId: inv09.id, assetId: a.id, prevCondition: 'good', condition: i % 23 === 5 ? 'minor' : 'good', checkedBy: CHECKERS[i % CHECKERS.length], checkedAt: '2026-09-' + F.pad(10 + (i % 12)) + 'T10:00', photo: i % 4 === 0, note: '', status: i % 23 === 5 ? 'needs_action' : 'done', createdAt: '2026-09-01T08:00' }));
    inv09.summary = { total: assets.length, checked: assets.length, needsAction: st.inventoryLines.filter(l => l.inventoryId === inv09.id && l.status === 'needs_action').length, broken: 0 };
    const inv10 = mk(st, 'inventories', { code: 'BB-KK-2026-10', period: '2026-10', buildingIds: live.map(b => b.id), status: 'in_progress', startDate: '2026-10-01', finishedAt: null, createdBy: admin.id, note: 'Kiểm kê định kỳ tháng 10 – đang thực hiện', createdAt: '2026-10-01T08:00' });
    // 10 hero theo PNG; còn lại: 166 done + 14 minor + 8 replace/broken (+hero) → tổng checked 198, needs_action 32, hư hỏng 18
    const rest = assets.filter(a => !heroAssets.includes(a)); const lines10 = [];
    hero.forEach((h, i) => lines10.push({ assetId: heroAssets[i].id, prevCondition: h[4], condition: h[5], checkedBy: h[6], checkedAt: h[7] + 'T' + F.pad(9 + i % 8) + ':' + F.pad(rint(0, 59)), photo: true, status: h[8] }));
    const plan = []; for (let i = 0; i < 157; i++) plan.push('good'); for (let i = 0; i < 11; i++) plan.push('minor'); for (let i = 0; i < 16; i++) plan.push(i % 3 === 0 ? 'broken' : 'replace'); for (let i = 0; i < 4; i++) plan.push('good'); // 188 đã kiểm (+10 hero = 198)
    rest.forEach((a, i) => { if (i < plan.length) { const c = plan[i]; const a2 = st.assets.find(x => x.id === a.id); if (a2.condition !== c) { a2.condition = c; if (a2.roomAssetId) { const ra = st.roomAssets.find(x => x && x.id === a2.roomAssetId); if (ra) ra.condition = c === 'good' ? 'Tốt' : c === 'minor' ? 'Cần bảo dưỡng' : 'Hỏng'; } } lines10.push({ assetId: a.id, prevCondition: 'good', condition: c, checkedBy: CHECKERS[i % CHECKERS.length], checkedAt: d(-13 + (i % 6)) + 'T' + F.pad(8 + i % 9) + ':' + F.pad((i * 7) % 60), photo: c !== 'good' || i % 5 === 0, status: c === 'good' ? 'done' : 'needs_action' }); } else lines10.push({ assetId: a.id, prevCondition: a.condition, condition: null, checkedBy: null, checkedAt: null, photo: false, status: 'pending' }); });
    lines10.forEach(l => mk(st, 'inventoryLines', Object.assign({ inventoryId: inv10.id, note: l.status === 'needs_action' ? (l.condition === 'minor' ? 'Hư hỏng nhẹ, cần bảo dưỡng' : 'Cần thay thế/sửa chữa – đề xuất lập sự cố') : '', createdAt: '2026-10-01T08:00' }, l)));
    const l10 = st.inventoryLines.filter(l => l.inventoryId === inv10.id);
    inv10.summary = { total: l10.length, checked: l10.filter(l => l.status !== 'pending').length, needsAction: l10.filter(l => l.status === 'needs_action').length, broken: l10.filter(l => ['replace', 'broken', 'lost'].includes(l.condition)).length };

    /* ===== 3. Nhân sự (28) – 10 hero theo PNG, link userId khi trùng tên user ===== */
    let nvN = 1; const emp = (o) => mk(st, 'employees', Object.assign({ code: 'NV' + F.pad(nvN++, 3), workType: 'Toàn thời gian', address: pick(['Quận 7, TP. Hồ Chí Minh', 'Quận 1, TP. Hồ Chí Minh', 'Bình Thạnh, TP. Hồ Chí Minh', 'Thủ Đức, TP. Hồ Chí Minh', 'Cầu Giấy, Hà Nội']), status: 'working', documents: [], history: [], createdAt: '2026-01-01T08:00' }, o));
    const SAL = { 'Quản lý khu vực': [18000000, 3000000], 'Trưởng nhóm': [15000000, 2000000], 'Kỹ thuật viên': [10000000, 500000], 'Nhân viên kinh doanh': [8000000, 500000], 'Nhân viên': [9000000, 500000] };
    const withSal = (o) => { const s = SAL[o.title] || SAL['Nhân viên']; return Object.assign({ salaryBase: s[0], titleAllowance: s[1] }, o); };
    const HERO_E = [
      ['Trần Minh Đức', 'vanhanh', 'Quản lý khu vực', '0901 234 567', 'minhduc@timohouse.vn', 'Khu Thủ Đức', 'SR', 'working', '2023-01-10', 'tranminhduc'],
      ['Nguyễn Thị Hương', 'kinhdoanh', 'Nhân viên kinh doanh', '0906 789 012', 'huongnt@timohouse.vn', 'Khu Q.1', 'SR', 'working', '2023-03-15', 'sale'],
      ['Lê Quang Huy', 'baotri', 'Kỹ thuật viên', '0903 456 789', 'quanghuy@timohouse.vn', 'Khu Bình Thạnh', 'RS', 'working', '2023-06-20', 'lequanghuy'],
      ['Phạm Thu Trang', 'taichinh', 'Nhân viên', '0904 567 890', 'trangpt@timohouse.vn', 'Tất cả khu vực', '', 'working', '2023-09-12', 'ketoan'],
      ['Hoàng Nam Khánh', 'baotri', 'Kỹ thuật viên', '0905 678 901', 'khanhhn@timohouse.vn', 'Khu Thủ Đức', 'CT', 'leave', '2023-12-01', 'hnkhanh'],
      ['Vũ Thị Mai', 'vanhanh', 'Nhân viên', '0906 789 013', 'maivt@timohouse.vn', 'Khu Gò Vấp', 'GD', 'working', '2024-01-10', ''],
      ['Đặng Quốc Bảo', 'kinhdoanh', 'Trưởng nhóm', '0907 890 123', 'baodq@timohouse.vn', 'Khu Q.7', 'SR', 'working', '2024-02-18', ''],
      ['Phạm Thị Lan', 'cskh', 'Nhân viên', '0908 901 234', 'lanpt@timohouse.vn', 'Tất cả khu vực', '', 'working', '2024-04-01', ''],
      ['Lê Văn Thành', 'baotri', 'Kỹ thuật viên', '0909 012 345', 'thanhlv@timohouse.vn', 'Khu Tân Bình', 'ML', 'leave', '2024-06-15', ''],
      ['Ngô Thị Quỳnh', 'hanhchinh', 'Nhân viên', '0910 123 456', 'quynhnt@timohouse.vn', 'Tất cả khu vực', '', 'working', '2024-08-20', 'nhansu'],
    ];
    const userByName = (n) => st.users.find(u => u && u.name === n && u.role !== 'codong') || null;
    const emps = HERO_E.map(h => { const u = (h[9] ? userBy(st, h[9]) : null) || userByName(h[0]); return emp(withSal({ name: h[0], dept: h[1], title: h[2], phone: h[3], email: h[4], area: h[5], primaryB: h[6], status: h[7], startDate: h[8], userId: u ? u.id : null })); });
    // nhân viên cho các user còn lại (mọi tài khoản đều có hồ sơ)
    const DEPT_OF_ROLE = { admin: ['hanhchinh', 'Quản lý khu vực'], accountant: ['taichinh', 'Nhân viên'], ops: ['vanhanh', 'Quản lý khu vực'], sale: ['kinhdoanh', 'Nhân viên kinh doanh'], kythuat: ['baotri', 'Kỹ thuật viên'], hr: ['hanhchinh', 'Nhân viên'] };
    ['admin', 'vanhanh', 'lehoang', 'lthuong', 'nvhung', 'pqminh'].map(un => userBy(st, un)).forEach(u => { if (!u || emps.some(e => e.userId === u.id || e.name === u.name)) return; const [dept, title] = DEPT_OF_ROLE[u.role] || ['khac', 'Nhân viên']; emps.push(emp(withSal({ name: u.name, dept, title, phone: u.phone || phone(), email: u.email, area: pick(['Khu Q.1', 'Khu Q.7', 'Khu Thủ Đức', 'Tất cả khu vực']), primaryB: '', status: 'working', startDate: '2022-' + F.pad(rint(1, 12)) + '-' + F.pad(rint(1, 28)), userId: u.id }))); });
    // 5 NV sắp hết thử việc (PNG) + bổ sung cho đủ 28
    [['Nguyễn Văn An', 5, 'vanhanh'], ['Trần Thị Mai', 8, 'kinhdoanh'], ['Phạm Quốc Dũng', 10, 'cskh'], ['Lê Minh Tâm', 13, 'vanhanh'], ['Hoàng Thị Ngọc', 16, 'kinhdoanh']].forEach(([n, days, dept], i) => { const u = userByName(n); emps.push(emp(withSal({ name: n, dept, title: dept === 'kinhdoanh' ? 'Nhân viên kinh doanh' : 'Nhân viên', phone: u ? u.phone : phone(), email: u ? u.email : F.slug(n.split(' ').slice(-1)[0]) + F.slug(n.split(' ')[0]).slice(0, 2) + '@timohouse.vn', area: pick(['Khu Q.7', 'Khu Thủ Đức', 'Khu Gò Vấp']), primaryB: pick(['SR', 'ML', 'GD']), status: 'probation', startDate: F.addDays(d(days), -60), probationEnd: d(days), userId: u ? u.id : null }))); });
    const FILL = [['vanhanh', 'Quản lý khu vực'], ['baotri', 'Kỹ thuật viên'], ['vanhanh', 'Nhân viên'], ['baotri', 'Kỹ thuật viên'], ['taichinh', 'Nhân viên'], ['vanhanh', 'Quản lý khu vực'], ['khac', 'Nhân viên'], ['vanhanh', 'Nhân viên'], ['cskh', 'Nhân viên'], ['hanhchinh', 'Nhân viên'], ['vanhanh', 'Nhân viên']];
    let fi = 0; while (emps.length < 28) { const [dept, title] = FILL[fi++ % FILL.length]; const n = name(); emps.push(emp(withSal({ name: n, dept, title, phone: phone(), email: F.slug(n.split(' ').slice(-1)[0]) + F.slug(n.split(' ')[0]).slice(0, 2) + fi + '@timohouse.vn', area: pick(['Khu Q.1', 'Khu Q.7', 'Khu Bình Thạnh', 'Khu Thủ Đức', 'Khu Gò Vấp']), primaryB: pick(['SR', 'ML', 'RS', 'CT', 'GD']), status: emps.filter(e => e.status === 'leave').length < 3 && fi === 3 ? 'leave' : 'working', startDate: '202' + rint(2, 5) + '-' + F.pad(rint(1, 12)) + '-' + F.pad(rint(1, 28)) }))); }
    // đúng 6 quản lý khu vực (PNG): thừa → hạ xuống Trưởng nhóm, thiếu → nâng NV vận hành
    { let m = emps.filter(e => e.title === 'Quản lý khu vực'); while (m.length > 6) { const e = m.pop(); if (e.name === 'Trần Minh Đức') { m.unshift(e); continue; } e.title = 'Trưởng nhóm'; Object.assign(e, { salaryBase: SAL['Trưởng nhóm'][0], titleAllowance: SAL['Trưởng nhóm'][1] }); } const cand = emps.filter(e => e.dept === 'vanhanh' && e.title === 'Nhân viên'); while (m.length < 6 && cand.length) { const e = cand.pop(); e.title = 'Quản lý khu vực'; Object.assign(e, { salaryBase: SAL['Quản lý khu vực'][0], titleAllowance: SAL['Quản lý khu vực'][1] }); m.push(e); } }
    // quản lý trực tiếp: NV kinh doanh → Đặng Quốc Bảo (trưởng nhóm); còn lại → Trần Minh Đức (QLKV)
    const byName = (n) => emps.find(e => e.name === n); const duc = byName('Trần Minh Đức'), bao = byName('Đặng Quốc Bảo');
    emps.forEach(e => { if (e === duc) return; e.managerId = e.dept === 'kinhdoanh' && e !== bao ? bao.id : duc.id; });
    byName('Nguyễn Thị Hương').managerId = duc.id;
    // tài liệu hero NV002
    byName('Nguyễn Thị Hương').documents = [['Hợp đồng lao động', 'HDLĐ_NT Huong_2023.pdf', '2023-03-15'], ['Sơ yếu lý lịch', 'SYLL_NT Huong.docx', '2023-03-15'], ['Bản sao CCCD', 'CCCD_NT Huong.pdf', '2023-03-12'], ['Bằng cấp, chứng chỉ', 'Bangcap_NT Huong.docx', '2023-03-10'], ['Đánh giá thử việc', 'Danhgia_thuviec.pdf', '2023-06-15']].map(([name, fileName, date]) => ({ id: F.uid('doc'), name, fileName, date, size: rint(120, 980) + ' KB' }));
    emps.forEach(e => { e.history.push({ at: e.startDate + 'T08:00', type: 'join', text: 'Vào làm – ' + e.title }); if (e.status === 'leave') e.history.push({ at: d(-rint(5, 40)) + 'T09:00', type: 'status', text: 'Tạm nghỉ (nghỉ phép dài hạn)' }); delete e.primaryBTmp; });
    /* phân công tòa (FR-BLD-07) */
    const ROLE_OF = { vanhanh: 'ops', baotri: 'tech', kinhdoanh: 'lead', cskh: 'ops', hanhchinh: 'ops', taichinh: 'ops', khac: 'cleaning' };
    const assign = (e, b, role, primary, start) => mk(st, 'buildingAssignments', { employeeId: e.id, buildingId: b.id, role, primary: !!primary, start: start || e.startDate, end: null, status: 'active', createdAt: (start || e.startDate) + 'T08:00' });
    emps.forEach(e => { const key = e.primaryB; delete e.primaryB; if (!key || !B[key]) return; assign(e, B[key], e.title === 'Quản lý khu vực' ? 'lead' : ROLE_OF[e.dept] || 'ops', true); });
    const huong = byName('Nguyễn Thị Hương'); assign(huong, B.ML, 'lead', false, '2024-01-05'); assign(huong, B.RS, 'lead', false, '2025-03-01');
    mk(st, 'buildingAssignments', { employeeId: huong.id, buildingId: B.CT.id, role: 'lead', primary: false, start: '2023-06-01', end: '2023-12-31', status: 'ended', createdAt: '2023-06-01T08:00' });
    // quản lý khu vực phụ trách thêm tòa
    emps.filter(e => e.title === 'Quản lý khu vực' && e !== duc).forEach((e, i) => assign(e, live[(i + 1) % live.length], 'lead', false));
    // user codong: phạm vi tòa = dự án đã góp (set sau khi có commitments)

    /* ===== 4. Chấm công 09/2026 (xác nhận) + 10/2026 (nháp, đến hôm nay) ===== */
    const sheet = (e, period, upto, status) => { const days = {}; const [y, m] = period.split('-').map(Number); const nDays = new Date(y, m, 0).getDate(); let work = 0, off = 0, late = 0, ot = 0; for (let day = 1; day <= nDays; day++) { const iso = period + '-' + F.pad(day); if (upto && iso > upto) break; const dow = new Date(y, m - 1, day).getDay(); let c = dow === 0 ? 'O' : 'P'; if (c === 'P') { const x = r(); if (e.status === 'leave' && day > 15) c = 'L'; else if (x < .03) c = 'A'; else if (x < .07) c = 'L'; else if (x < .11) c = 'H'; } days[iso] = c; if (c === 'P') work++; else if (c === 'H') { work += .5; } else if (c === 'L' || c === 'A') off++; if (c === 'P' && r() < .08) late++; if (c === 'P' && r() < .1) ot += 2; } return mk(st, 'timesheets', { employeeId: e.id, period, days, workDays: work, offDays: off, late, otHours: ot, status, confirmedBy: status === 'confirmed' ? (userBy(st, 'nhansu') || admin).id : null, confirmedAt: status === 'confirmed' ? period === '2026-09' ? '2026-10-01T09:00' : null : null, createdAt: period + '-01T08:00' }); };
    emps.forEach(e => { sheet(e, '2026-09', null, 'confirmed'); sheet(e, '2026-10', T, 'draft'); });

    /* ===== 5. Bảng lương: BL-2026-09 đã duyệt (kỳ 09 đã khóa – chi lương ghi ngoài hệ thống), BL-2026-10 nháp ===== */
    const payLines = (period) => emps.map(e => { const ts = st.timesheets.find(t => t.employeeId === e.id && t.period === period) || { workDays: 26 }; const nB = st.buildingAssignments.filter(a => a.employeeId === e.id && a.status === 'active').length; const bAllow = e.dept === 'vanhanh' ? nB * 500000 : 0; const comm = e.dept === 'kinhdoanh' && e.userId ? F.sum(st.commissions.filter(c => c.status === 'paid' && F.period(c.paidAt || c.createdAt) === period && st.deals.some(dl => dl.id === c.dealId && dl.saleId === e.userId)), c => c.amount || 0) : 0; const base = Math.round(e.salaryBase * Math.min(1, (ts.workDays || 0) / 26) / 1000) * 1000; const ded = Math.round(base * 0.105 / 1000) * 1000; return { employeeId: e.id, base, titleAllowance: e.titleAllowance, buildingAllowance: bAllow, buildingCount: nB, commission: comm, deductions: ded, total: base + e.titleAllowance + bAllow + comm - ded, workDays: ts.workDays || 0 }; });
    const l9 = payLines('2026-09'); mk(st, 'payrolls', { code: 'BL-2026-09', period: '2026-09', status: 'approved', lines: l9, total: F.sum(l9, l => l.total), createdBy: (userBy(st, 'nhansu') || admin).id, submittedAt: '2026-10-02T10:00', approvedBy: ketoan.id, approvedAt: '2026-10-03T15:00', paidAt: null, expenseIds: [], note: 'Kỳ 09/2026 đã khóa sổ – khoản chi lương đã ghi nhận trước khi bật Phase 3', createdAt: '2026-10-02T09:00' });
    const pl10 = payLines('2026-10'); mk(st, 'payrolls', { code: 'BL-2026-10', period: '2026-10', status: 'draft', lines: pl10, total: F.sum(pl10, l => l.total), createdBy: (userBy(st, 'nhansu') || admin).id, expenseIds: [], note: 'Tạm tính đến ' + F.date(T) + ' – bảng công 10/2026 chưa xác nhận', createdAt: T + 'T08:00' });

    /* ===== 6. Dự án (5 tòa = 5 dự án), cổ đông (8), cam kết vốn theo dự án (tỷ lệ nhập tay – FR-SHR-02) ===== */
    const CAP = { SR: 4000, ML: 3000, RS: 2500, CT: 1500, GD: 1000 }; // triệu
    const proj = {}; let daN = 1; Object.entries(CAP).forEach(([k, cap]) => { const b = B[k]; proj[k] = mk(st, 'projects', { code: 'DA-' + F.pad(daN++, 3), name: 'Dự án ' + b.name.replace('Tòa ', ''), buildingId: b.id, capital: cap * 1e6, status: 'operating', startDate: '2025-' + F.pad(daN + 1) + '-01', expectedRoi: 14 + daN, note: 'Đầu tư thuê & vận hành ' + b.name, createdAt: '2025-01-01T08:00' }); });
    const SH = [['Trần Minh Đức', 'duc.tm@gmail.com', '0901 234 567', 'codong'], ['Nguyễn Thị Hương', 'huong.nt@gmail.com', '0902 345 678', ''], ['Lê Quang Huy', 'huy.lq@gmail.com', '0903 456 789', ''], ['Phạm Thu Trang', 'trang.pt@gmail.com', '0904 567 890', ''], ['Hoàng Nam Khánh', 'khanh.hn@gmail.com', '0905 678 901', ''], ['Đặng Quốc Bảo', 'bao.dq@gmail.com', '0907 890 123', ''], ['Vũ Thị Mai', 'mai.vt@gmail.com', '0906 789 012', ''], ['Ngô Văn An', 'an.nv@gmail.com', '0911 222 333', '']];
    const sh = SH.map((s, i) => { const u = s[3] ? userBy(st, s[3]) : null; return mk(st, 'shareholders', { code: 'CD-' + F.pad(i + 1, 3), name: s[0], email: s[1], phone: s[2], idNumber: '0790' + F.pad(rint(10000000, 99999999), 8), userId: u ? u.id : null, status: 'active', note: '', createdAt: '2025-01-10T08:00' }); });
    // ma trận vốn (triệu): tổng theo cổ đông = PNG (3000/2400/1800/1200/1200/960/840/600), tổng theo dự án = CAP
    const MTX = [['SR', [1500, 1000, 400, 600, 0, 60, 0, 440]], ['ML', [1000, 800, 0, 0, 700, 500, 0, 0]], ['RS', [500, 0, 1000, 0, 0, 0, 840, 160]], ['CT', [0, 600, 0, 600, 0, 300, 0, 0]], ['GD', [0, 0, 400, 0, 500, 100, 0, 0]]];
    MTX.forEach(([k, arr]) => arr.forEach((amt, i) => { if (!amt) return; mk(st, 'capitalCommitments', { shareholderId: sh[i].id, projectId: proj[k].id, ratio: Math.round(amt / CAP[k] * 10000) / 100, committed: amt * 1e6, effectiveDate: '2025-03-01', createdAt: '2025-03-01T08:00' }); }));
    /* đợt góp vốn (kind capital): đợt 1 đã góp; Trang–Sunrise đợt 2 400tr đến hạn hôm nay; Mai–Riverside đợt 2 140tr còn 3 ngày */
    let gvN = 1; const gv = (o) => mk(st, 'contributions', Object.assign({ code: 'GV-' + (o.dueDate || T).slice(0, 7).replace('-', '') + '-' + F.pad(gvN++, 3), kind: 'capital', round: 1, paidAmount: 0, paidDate: null, ref: '', status: 'scheduled', source: 'auto', note: '' }, o));
    st.capitalCommitments.forEach(c => { const s = sh.find(x => x.id === c.shareholderId); const p = st.projects.find(x => x.id === c.projectId); const isTrangSR = s.name === 'Phạm Thu Trang' && p.buildingId === B.SR.id; const isMaiRS = s.name === 'Vũ Thị Mai' && p.buildingId === B.RS.id; const first = isTrangSR ? 200e6 : isMaiRS ? 700e6 : c.committed; gv({ shareholderId: s.id, projectId: p.id, round: 1, amount: first, dueDate: '2025-04-15', paidAmount: first, paidDate: '2025-04-' + F.pad(rint(8, 15)), ref: 'UNC-' + F.pad(rint(1000, 9999), 4), status: 'paid', createdAt: '2025-03-01T08:00' }); if (isTrangSR) gv({ shareholderId: s.id, projectId: p.id, round: 2, amount: 400e6, dueDate: T, status: 'due', createdAt: '2026-10-01T08:00' }); if (isMaiRS) gv({ shareholderId: s.id, projectId: p.id, round: 2, amount: 140e6, dueDate: d(3), status: 'scheduled', createdAt: '2026-10-01T08:00' }); });
    /* nghĩa vụ đóng góp định kỳ theo kỳ trả chủ nhà (BR-15, FR-SHR-01 AC-2): Moonlight 05/11, Central 12/11 – theo tỷ lệ vốn của dự án */
    const periodic = (k, due, label) => { const p = proj[k]; const lc = st.landlordContracts.find(x => x.buildingIds && x.buildingIds.includes(p.buildingId) && x.status !== 'ended'); const total = lc ? lc.rent * (lc.cycleMonths || 3) : Math.round(p.capital * 0.1); st.capitalCommitments.filter(c => c.projectId === p.id).forEach(c => gv({ shareholderId: c.shareholderId, projectId: p.id, kind: 'periodic', round: label, amount: Math.round(total * c.ratio / 100 / 1e5) * 1e5, dueDate: due, status: 'scheduled', note: 'Kỳ trả chủ nhà ' + F.date(due) + ' – ' + (lc ? 'HĐ ' + lc.code : 'tạm tính 10% vốn'), createdAt: '2026-10-15T08:00' })); };
    periodic('ML', d(8), 'Kỳ 11/2026'); periodic('CT', d(15), 'Kỳ 11/2026');
    /* phân phối lợi nhuận: Q2/2026 đã chi 800tr; Q3/2026 đang xử lý 1.248 tỷ (31/10); Q4/2026, Q1/2027, Q2/2027 chờ */
    const ratioAll = sh.map(s => F.sum(st.capitalCommitments.filter(c => c.shareholderId === s.id), c => c.committed) / 12000e6 * 100); // 25/20/15/10/10/8/7/5
    const dist = (label, code, profit, date, status, extra = {}) => { const lines = sh.map((s, i) => ({ shareholderId: s.id, ratio: Math.round(ratioAll[i] * 100) / 100, amount: Math.round(profit * ratioAll[i] / 100), rounding: 0 })); const sum = F.sum(lines, l => l.amount); if (sum !== profit) { const big = lines.reduce((a, b) => a.amount > b.amount ? a : b); big.rounding = profit - sum; big.amount += profit - sum; } return mk(st, 'distributions', Object.assign({ code, label, projectId: '', profit, planned: profit, date, status, lines, approvedBy: null, approvedAt: null, paidAt: null, note: 'Tỷ lệ = tỷ lệ vốn nhập tay (OI-17)', createdAt: date + 'T08:00' }, extra)); };
    dist('Q2/2026', 'PP-2026-Q2', 800e6, '2026-07-31', 'paid', { approvedBy: admin.id, approvedAt: '2026-07-28T10:00', paidAt: '2026-07-31T15:00', paidBy: ketoan.id, createdAt: '2026-07-20T08:00' });
    dist('Q3/2026', 'PP-2026-Q3', 1248e6, d(3), 'processing', { createdAt: d(-6) + 'T08:00' });
    dist('Q4/2026', 'PP-2026-Q4', 1350e6, '2027-01-31', 'planned', { createdAt: d(-6) + 'T08:00' });
    dist('Q1/2027', 'PP-2027-Q1', 1420e6, '2027-04-30', 'planned', { createdAt: d(-6) + 'T08:00' });
    dist('Q2/2027', 'PP-2027-Q2', 1500e6, '2027-07-31', 'planned', { createdAt: d(-6) + 'T08:00' });
    // user codong (Trần Minh Đức) chỉ thấy tòa của dự án đã góp: Sunrise, Moonlight, Riverside
    const cdUser = userBy(st, 'codong'); if (cdUser) cdUser.buildingIds = [...new Set(st.capitalCommitments.filter(c => c.shareholderId === sh[0].id).map(c => st.projects.find(p => p.id === c.projectId).buildingId))];

    /* ===== 7. Ngân hàng: giao dịch tháng 10 khớp payments đã có (đối soát), một số chưa khớp/cần kiểm tra ===== */
    const accs = st.bankAccounts; const vcb = accs[0];
    const pays = st.payments.filter(p => p.status === 'recorded' && F.period(p.date) === '2026-10' && /chuyển|bank|ck/i.test(p.method || '')).slice(0, 24);
    let txN = 1; const tx = (o) => mk(st, 'bankTransactions', Object.assign({ code: 'GD' + F.pad(txN++, 4), accountId: vcb.id, matchStatus: 'unmatched', paymentId: null, invoiceId: null, expenseId: null, createdAt: '2026-10-01T08:00' }, o));
    pays.forEach((p, i) => { const t = st.tenants.find(x => x.id === p.tenantId) || {}; tx({ accountId: accs[i % 3].id, date: p.date, amount: p.amount, dir: 'in', desc: (t.name || 'KH') + ' CK tien phong ' + (p.ref || ''), ref: p.ref || ('FT' + F.pad(26100000 + i * 37, 8)), matchStatus: i % 8 === 7 ? 'check' : 'matched', paymentId: i % 8 === 7 ? null : p.id, invoiceId: null, rule: i % 8 === 7 ? 0 : (i % 2 ? 1 : 2) }); });
    for (let i = 0; i < 6; i++) tx({ accountId: accs[i % 3].id, date: d(-rint(1, 12)), amount: pick([4500000, 6200000, 7800000, 3000000]), dir: 'in', desc: pick(['NGUYEN VAN ' + pick(['B', 'C', 'D']) + ' chuyen tien', 'CK thanh toan phong', 'TT hoa don thang 10', 'VO THI ' + pick(['H', 'K']) + ' ck']), ref: 'FT' + F.pad(26101000 + i * 91, 8), matchStatus: 'unmatched' });
    const exps = st.expenses.filter(e => F.period(e.date) === '2026-10').slice(0, 8);
    exps.forEach((e, i) => tx({ accountId: accs[i % 2].id, date: e.date, amount: e.amount, dir: 'out', desc: 'TT ' + (e.desc || e.group), ref: 'UNC' + F.pad(2610000 + i * 13, 7), matchStatus: 'matched', expenseId: e.id }));
    accs.forEach(a => { a.txCount = st.bankTransactions.filter(t => t.accountId === a.id).length; });

    st.meta.p3Seeded = true; st.meta.p3SeededAt = F.nowISO();
    return st;
  };
})(window.TH);
