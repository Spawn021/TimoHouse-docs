/* Seed dữ liệu demo – deterministic, khớp số liệu PNG ở mức nhất quán nội bộ */
(function (TH) {
  const F = TH.f;
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Phan', 'Trịnh', 'Đinh', 'Mai', 'Tô', 'Lương', 'Cao'];
  const DEM = ['Văn', 'Thị', 'Minh', 'Quang', 'Thu', 'Ngọc', 'Hữu', 'Đức', 'Thanh', 'Hồng', 'Anh', 'Gia', 'Bảo', 'Khánh', 'Xuân', 'Tuấn', 'Phương', 'Kim', 'Hải', 'Thùy'];
  const TEN = ['An', 'Bình', 'Cường', 'Dũng', 'Giang', 'Hà', 'Hạnh', 'Hiếu', 'Hùng', 'Hương', 'Khoa', 'Lan', 'Linh', 'Long', 'Mai', 'Nam', 'Ngân', 'Nhi', 'Phúc', 'Quân', 'Quỳnh', 'Sơn', 'Tâm', 'Thảo', 'Trang', 'Trung', 'Tú', 'Tuyết', 'Vy', 'Yến', 'Đạt', 'Hoa', 'Loan', 'My', 'Thành', 'Vinh'];
  const JOBS = ['Nhân viên văn phòng', 'Kỹ sư phần mềm', 'Giáo viên', 'Kinh doanh tự do', 'Sinh viên', 'Kế toán', 'Y tá', 'Nhân viên ngân hàng', 'Thiết kế', 'Marketing', 'Bác sĩ', 'Công nhân kỹ thuật'];
  const SEG = ['Văn phòng', 'Sinh viên', 'Gia đình', 'Chuyên gia', 'Lao động'];
  const ROOM_TYPES = ['Căn hộ Studio', 'Căn hộ 1PN', 'Căn hộ 2PN', 'Phòng đơn', 'Phòng đôi'];
  const METHODS = ['Chuyển khoản', 'Tiền mặt', 'Chuyển khoản', 'Chuyển khoản', 'Ví điện tử'];

  const seed = {};
  seed.catalogOnly = (st) => { addUsers(st); addCatalog(st); addZaloConfig(st); if (seed.catalogP2) seed.catalogP2(st); if (seed.catalogP3) seed.catalogP3(st); st.meta.seededAt = F.nowISO(); };
  seed.helpers = { rng, HO, DEM, TEN, JOBS, SEG, ROOM_TYPES, METHODS };

  seed.run = (st) => {
    // Keep the original deterministic sequence while the business timeline moves to 2028.
    const r = rng(0x134da84);
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    const rint = (a, b) => a + Math.floor(r() * (b - a + 1));
    const name = () => pick(HO) + ' ' + pick(DEM) + ' ' + pick(TEN);
    const phone = () => '09' + F.pad(rint(0, 99)) + ' ' + F.pad(rint(0, 999), 3) + ' ' + F.pad(rint(0, 999), 3);
    const mk = (col, obj) => { obj.id = obj.id || F.uid(col.slice(0, 3)); obj.source = 'seed'; obj.createdAt = obj.createdAt || '2026-10-01T08:00'; st[col].push(obj); return obj; };
    const T = F.DEMO_TODAY;

    addUsers(st); addCatalog(st); addZaloConfig(st);
    const U = F.by(st.users, 'username');
    const uid = (u) => U[u] ? U[u][0].id : st.users[0].id;
    const svc = F.by(st.services, 'code'); const S = (c) => svc[c][0];

    /* ---------- Chủ nhà & Tòa ---------- */
    const LL = [
      ['CN001', 'Trần Văn Hải', 'person', 'hai.tran@gmail.com', 3, '2026-01-01', '2027-12-31', 120000000, 'active', '2026-11-15'],
      ['CN002', 'Lê Thị Mai', 'person', 'mai.le@gmail.com', 6, '2025-06-01', '2026-12-31', 95000000, 'expiring', '2026-12-12'],
      ['CN003', 'Lê Văn Thành', 'person', 'thanh.le@gmail.com', 3, '2025-01-01', '2028-01-01', 88000000, 'active', '2026-11-07'],
      ['CN004', 'Công ty CP Đầu tư Bà Triệu', 'company', 'lienhe@batrieu.vn', 4, '2026-01-01', '2028-12-31', 80000000, 'active', '2027-01-11'],
      ['CN005', 'Bùi Thị Hạnh', 'person', 'hanh.bui@gmail.com', 3, '2026-03-01', '2029-02-28', 52000000, 'active', '2026-11-19'],
      ['CN006', 'Vũ Thị Mai', 'person', 'mai.vu@gmail.com', 3, '2026-01-01', '2027-12-31', 70000000, 'active', '2026-12-27'],
      ['CN007', 'Ngô Thị Quỳnh', 'person', 'quynh.ngo@gmail.com', 6, '2025-09-01', '2027-08-31', 60000000, 'paused', '2027-02-25'],
      ['CN008', 'Trần Văn Hưng', 'person', 'hung.tran@gmail.com', 3, '2026-01-01', '2028-12-31', 120000000, 'active', '2027-01-01'],
      ['CN009', 'Phạm Thị Lan', 'person', 'lan.pham@gmail.com', 4, '2025-05-01', '2027-04-30', 45000000, 'paused', '2027-01-15'],
      ['CN010', 'Công ty TNHH Đại Dương', 'company', 'info@daiduong.vn', 6, '2024-01-01', '2026-12-31', 65000000, 'paused', '2026-12-31'],
    ];
    const BD = [
      ['TH-HBT-01', 'Tòa Sunrise', 'Số 120 Trần Duy Hưng, Cầu Giấy, Hà Nội', 'Cầu Giấy', 16, 5, 'A', 'vanhanh', 0, 'active'],
      ['TH-PXL-02', 'Tòa Moonlight', '45 Phan Xích Long, Phú Nhuận, TP.HCM', 'Phú Nhuận', 12, 6, 'B', 'lehoang', 1, 'active'],
      ['TH-Q1-03', 'Tòa Riverside', '88 Nguyễn Huệ, Quận 1, TP.HCM', 'Quận 1', 17, 4, 'C', 'lequanghuy', 2, 'active'],
      ['TH-BTD-04', 'Tòa Central', '12 Điện Biên Phủ, Bình Thạnh, TP.HCM', 'Bình Thạnh', 10, 6, 'D', 'hnkhanh', 3, 'active'],
      ['TH-TĐ-05', 'Tòa Garden', '25 Võ Văn Ngân, Thủ Đức, TP.HCM', 'Thủ Đức', 8, 5, 'E', 'tranminhduc', 4, 'active'],
      ['TH-HĐ-06', 'Tòa Harmony', '15 Lê Văn Lương, Hà Đông, Hà Nội', 'Hà Đông', 6, 6, 'F', 'lehoang', 5, 'active', 36],
      ['TH-TB-07', 'Tòa Lotus', '200 Cộng Hòa, Tân Bình, TP.HCM', 'Tân Bình', 5, 6, 'G', 'lequanghuy', 6, 'maintenance', 30],
      ['TH-GV-08', 'Tòa SkyView', '77 Nguyễn Oanh, Gò Vấp, TP.HCM', 'Gò Vấp', 9, 6, 'H', 'hnkhanh', 7, 'active', 54],
      ['TH-BD-09', 'Tòa Green Park', '10 Lê Lợi, Thủ Dầu Một, Bình Dương', 'Bình Dương', 7, 6, 'K', 'tranminhduc', 8, 'active', 42],
      ['TH-DN-10', 'Tòa Ocean', '5 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng', 'Đà Nẵng', 8, 5, 'M', 'vanhanh', 9, 'inactive', 40],
    ];
    const landlords = LL.map((l, i) => mk('landlords', { code: l[0], name: l[1], type: l[2], taxCode: l[2] === 'company' ? '01012345' + F.pad(i, 2) : '', phone: phone(), email: l[3], address: pick(['Hà Nội', 'TP.HCM', 'Đà Nẵng']), bankAccount: 'VCB 0011 00' + F.pad(rint(100000, 999999), 6), buildingIds: [], status: l[8], managerId: uid('vanhanh'), cycleMonths: l[4] }));
    const buildings = BD.map((b, i) => mk('buildings', { code: b[0], name: b[1], address: b[2], district: b[3], floors: b[4], perFloor: b[5], prefix: b[6], managerId: uid(b[7]), landlordId: landlords[b[8]].id, payCycle: LL[b[8]][4], payDay: 5, status: b[9], stub: !!b[10], roomCount: b[10] || b[4] * b[5], imageIdx: i, amenities: ['Thang máy', 'Camera 24/7', 'Hầm xe', 'Wifi'] }));
    buildings.forEach(b => { const l = st.landlords.find(x => x.id === b.landlordId); l.buildingIds.push(b.id); });
    // Hợp đồng đầu vào + lịch thanh toán
    landlords.forEach((l, i) => {
      const d = LL[i]; const bIds = l.buildingIds;
      const lc = mk('landlordContracts', { code: 'HD-' + l.code + '-001', landlordId: l.id, buildingIds: bIds, start: d[5], end: d[6], rent: d[7], deposit: d[7] * 2, priceHoldMonths: 24, cycleMonths: d[4], signedDate: F.addDays(d[5], -7), status: d[8] === 'paused' ? 'ended' : (F.daysUntil(d[6]) < 90 ? 'expiring' : 'active'), managerId: uid('vanhanh'), type: 'Hợp đồng thuê tòa nhà', note: '' });
      let due = d[5]; let k = 1;
      while (due <= '2027-12-31' && k <= 14) {
        const amt = d[7] * d[4]; const isPast = due < T; const paid = isPast && !(d[9] === due);
        mk('landlordPayments', { landlordContractId: lc.id, landlordId: l.id, buildingId: bIds[0], periodLabel: 'Kỳ ' + k + ' (T' + (Number(due.slice(5, 7))) + ' - T' + (((Number(due.slice(5, 7)) + d[4] - 2) % 12) + 1) + '/' + due.slice(0, 4) + ')', dueDate: due, amount: amt, status: paid ? 'paid' : (isPast || due === d[9] ? 'pending' : 'upcoming'), paidDate: paid ? due : null, evidence: paid ? 'ct_tt_ky' + k + '.pdf' : null });
        if (due === d[9]) { /* kỳ sắp tới theo PNG */ }
        due = F.addMonths(due, d[4]); k++;
      }
      // đảm bảo có kỳ đến hạn đúng ngày PNG
      if (!st.landlordPayments.some(p => p.landlordContractId === lc.id && p.dueDate === d[9])) mk('landlordPayments', { landlordContractId: lc.id, landlordId: l.id, buildingId: bIds[0], periodLabel: 'Kỳ bổ sung', dueDate: d[9], amount: d[7] * d[4], status: 'pending', paidDate: null, evidence: null });
      ['Sổ đỏ quyền sở hữu|so_do_' + l.code.toLowerCase() + '.pdf|2.4 MB|2025-03-12|pdf', 'Giấy chứng nhận PCCC|giay_pccc_' + l.code.toLowerCase() + '.pdf|1.8 MB|2026-01-05|doc', 'Hợp đồng thuê nhà|hd_' + l.code.toLowerCase() + '.pdf|2.1 MB|' + F.addDays(d[5], -7) + '|pdf', 'Biên bản bàn giao|bien_ban_ban_giao.pdf|1.6 MB|' + F.addDays(d[5], -3) + '|img'].forEach(s => { const [n, fn, sz, dt, kd] = s.split('|'); mk('documents', { entityType: 'landlord', entityId: l.id, name: n, fileName: fn, size: sz, date: dt, kind: kd, uploadedBy: uid('admin') }); });
    });

    /* ---------- Phòng ---------- */
    const heroB = buildings.slice(0, 5);
    const rooms = [];
    heroB.forEach(b => {
      for (let f = 1; f <= b.floors; f++) for (let n = 1; n <= b.perFloor; n++) {
        const type = pick(ROOM_TYPES); const area = type.includes('2PN') ? rint(55, 72) : type.includes('1PN') ? rint(40, 50) : type.includes('Studio') ? rint(26, 34) : rint(18, 25);
        const price = Math.round((type.includes('2PN') ? rint(95, 130) : type.includes('1PN') ? rint(70, 95) : type.includes('Studio') ? rint(55, 70) : rint(35, 50)) / 5) * 5 * 100000;
        rooms.push(mk('rooms', { code: b.prefix + '.' + F.pad(f) + '.' + F.pad(n), buildingId: b.id, floor: f, type, area, price, physical: 'good', status: 'ready', managerId: b.managerId, direction: pick(['Hướng Đông', 'Hướng Tây', 'Hướng Nam', 'Hướng Bắc', 'Đông Nam']), furniture: pick(['Đầy đủ', 'Cơ bản', 'Đầy đủ']), defaultServiceIds: [S('INTERNET').id, S('QUANLY').id, S('GUIXE').id] }));
      }
    });
    const R = {}; rooms.forEach(x => R[x.code] = x);
    const B = {}; buildings.forEach(x => B[x.code] = x);
    const roomByCode = (c) => {
      if (R[c]) return R[c];
      // tạo thêm phòng theo mã hero nếu lưới tầng/phòng chưa có
      const [pf, fl, no] = c.split('.'); const b = heroB.find(x => x.prefix === pf); if (!b) return null;
      const rm = mk('rooms', { code: c, buildingId: b.id, floor: Number(fl), type: 'Căn hộ Studio', area: 32, price: 6500000, physical: 'good', status: 'ready', managerId: b.managerId, direction: 'Hướng Đông', furniture: 'Đầy đủ', defaultServiceIds: [S('INTERNET').id, S('QUANLY').id, S('GUIXE').id] });
      rooms.push(rm); R[c] = rm; return rm;
    };

    /* ---------- Khách + hợp đồng ---------- */
    const tenants = []; const contracts = [];
    let tCounter = 123, cCounter = 1;
    function addTenant(o) { const t = mk('tenants', Object.assign({ code: 'KH' + F.pad(tCounter++, 5), phone: phone(), zalo: '', email: '', idNumber: '0' + rint(10000000000, 99999999999), dob: '199' + rint(0, 9) + '-' + F.pad(rint(1, 12)) + '-' + F.pad(rint(1, 28)), job: pick(JOBS), segment: pick(SEG), verified: r() > .3, managerId: uid('vanhanh'), note: '' }, o)); if (!t.email) t.email = F.slug(t.name.split(' ').slice(-1)[0]) + '.' + F.slug(t.name.split(' ')[0]) + '@gmail.com'; if (!t.zalo) t.zalo = t.phone; tenants.push(t); return t; }
    function addContract(o) {
      const room = st.rooms.find(x => x.id === o.roomId);
      const c = mk('contracts', Object.assign({ code: 'HD-2026-' + F.pad(cCounter++, 3), buildingId: room.buildingId, listPrice: room.price, price: room.price, deposit: room.price * 2, cycle: 'monthly', payDay: rint(5, 20), status: 'active', managerId: room.managerId, signedDate: null, note: '', renewedFromId: null, renewedToId: null }, o));
      if (!c.signedDate) c.signedDate = F.addDays(c.start, -3);
      contracts.push(c);
      // dịch vụ HĐ
      [S('INTERNET'), S('QUANLY')].forEach(s => mk('contractServices', { contractId: c.id, serviceId: s.id, name: s.name, unit: s.unit, price: s.price, qty: 1, note: s.code === 'INTERNET' ? 'FPT' : '' }));
      const cars = rint(0, 2); if (cars) mk('contractServices', { contractId: c.id, serviceId: S('GUIXE').id, name: S('GUIXE').name, unit: S('GUIXE').unit, price: S('GUIXE').price, qty: cars, note: 'Tầng hầm B1' });
      const t = st.tenants.find(x => x.id === c.tenantId); if (t) t.managerId = room.managerId; // khách thuê thuộc phạm vi tòa của HĐ (RBAC ops)
      mk('contractMembers', { contractId: c.id, name: t.name, dob: t.dob, idNumber: t.idNumber, relation: 'Người thuê (chính)', phone: t.phone, note: '' });
      if (r() > .6) mk('contractMembers', { contractId: c.id, name: name(), dob: '1994-05-20', idNumber: '0' + rint(10000000000, 99999999999), relation: pick(['Vợ/Chồng', 'Bạn cùng phòng', 'Con', 'Anh/Chị/Em']), phone: phone(), note: '' });
      return c;
    }
    // Hero
    const H = [
      // [tên, phòng, start, end, listPrice, price, deposit, payDay]
      ['Trần Minh Đức', 'A.12.03', '2026-01-01', '2026-12-31', 12000000, 12000000, 22000000, 10],
      ['Nguyễn Thị Hương', 'B.05.01', '2026-01-16', '2027-01-15', 8500000, 8500000, 17000000, 16],
      ['Lê Quang Huy', 'C.08.02', '2026-01-01', '2026-12-31', 7000000, 7000000, 14000000, 18],
      ['Hoàng Nam Khánh', 'D.03.06', '2025-11-01', '2026-10-31', 5000000, 5000000, 5000000, 22],
      ['Trần Văn Nam', 'B.05.02', '2025-12-16', '2026-12-15', 7000000, 7000000, 14000000, 15],
      ['Vũ Thảo Nguyên', 'A.09.01', '2026-03-01', '2027-02-28', 9000000, 9000000, 18000000, 25],
      ['Đặng Quốc Bảo', 'B.12.05', '2026-02-01', '2027-01-31', 11000000, 11000000, 22000000, 28],
      ['Ngô Yến Nhi', 'C.06.10', '2026-04-01', '2027-03-31', 7500000, 7500000, 15000000, 30],
      ['Phan Văn Long', 'D.10.03', '2026-05-01', '2027-04-30', 10000000, 10000000, 20000000, 5],
      ['Bùi Thị Mai', 'A.04.07', '2026-06-01', '2027-05-31', 8000000, 8000000, 16000000, 5],
      ['Nguyễn Thảo Vy', 'A.11.02', '2026-03-01', '2027-02-28', 4800000, 4500000, 9000000, 10],
    ];
    const heroC = {};
    H.forEach(h => {
      const room = roomByCode(h[1]);
      room.status = 'occupied'; room.price = h[5];
      const t = addTenant({ name: h[0], phone: h[0] === 'Trần Minh Đức' ? '0901 234 567' : h[0] === 'Nguyễn Thị Hương' ? '0908 234 567' : h[0] === 'Lê Quang Huy' ? '0909 876 543' : h[0] === 'Nguyễn Thảo Vy' ? '0903 123 456' : phone(), verified: true, job: h[0] === 'Nguyễn Thảo Vy' ? 'Nhân viên văn phòng' : pick(JOBS) });
      if (h[0] === 'Trần Minh Đức') t.email = 'duc.tm@gmail.com'; if (h[0] === 'Lê Quang Huy') t.email = 'huy.le@gmail.com'; if (h[0] === 'Nguyễn Thảo Vy') t.email = 'thaovy.nguyen@gmail.com';
      heroC[h[0]] = addContract({ tenantId: t.id, roomId: room.id, start: h[2], end: h[3], listPrice: h[4], price: h[5], deposit: h[6], payDay: h[7] });
    });
    // Phòng chờ dọn: Phạm Thu Trang A.16.08 (HĐ đã kết thúc 20/10)
    { const room = roomByCode('A.16.08'); room.status = 'cleaning'; room.physical = 'needs_clean'; const t = addTenant({ name: 'Phạm Thu Trang', phone: '0904 567 890' }); heroC['Phạm Thu Trang'] = addContract({ tenantId: t.id, roomId: room.id, start: '2025-10-21', end: '2026-10-20', price: 6500000, listPrice: 6500000, deposit: 13000000, status: 'ended', actualEnd: '2026-10-20', payDay: 21 }); }
    // Giữ chỗ hero: B.05.03 Nguyễn Thị Hương (khách mới)
    // Phân bố còn lại
    const free = rooms.filter(x => x.status === 'ready');
    const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
    shuffle(free);
    let i = 0;
    const occ = free.slice(i, i += 116), held = free.slice(i, i += 36), clean = free.slice(i, i += 7), maint = free.slice(i, i += 8), broken = free.slice(i, i += 2);
    occ.forEach((room, k) => {
      room.status = 'occupied';
      const t = addTenant({ name: name() });
      let start = F.addMonths('2026-10-01', -rint(1, 16)); start = start.slice(0, 8) + F.pad(rint(1, 28));
      let end = F.addDays(F.addMonths(start, 12), -1);
      if (k < 20) { end = F.addDays(T, rint(1, 34)); start = F.addDays(F.addMonths(end, -12), 1); } // sắp hết hạn
      else if (k < 32) { start = '2026-10-' + F.pad(rint(1, 25)); end = F.addDays(F.addMonths(start, 12), -1); } // cọc mới trong kỳ
      else if (F.daysUntil(end) <= 40) { end = F.addMonths(end, 6); }
      addContract({ tenantId: t.id, roomId: room.id, start, end, payDay: rint(5, 25) });
    });
    held.forEach((room, k) => { room.status = 'held'; const t = addTenant({ name: k === 0 ? 'Nguyễn Thị Hương' : name(), phone: k === 0 ? '0903 456 789' : phone() }); t.managerId = room.managerId; mk('holds', { roomId: room.id, tenantId: t.id, until: F.addDays(T, rint(2, 10)), deposit: 2000000, note: 'Đã cọc giữ chỗ', createdBy: room.managerId }); });
    maint.forEach(room => { room.status = 'maintenance'; room.physical = 'maintenance'; });
    broken.forEach(room => { room.status = 'inactive'; room.physical = 'maintenance'; });
    clean.forEach((room) => { room.status = 'cleaning'; room.physical = 'needs_clean'; });

    /* ---------- Chỉ số & hóa đơn ---------- */
    const active = contracts.filter(c => c.status === 'active');
    const invBy = { paid: 0, partial: 0, unpaid: 0, draft: 0, adjusted: 0 };
    let invN = 1;
    function services(c) { return st.contractServices.filter(x => x.contractId === c.id); }
    function meter(roomId, period, type, prev, use) { return mk('meterReadings', { roomId, period, type, prev, curr: prev + use, status: 'used', enteredBy: uid('ketoan') }); }
    function makeInvoice(c, period, opts = {}) {
      const room = st.rooms.find(x => x.id === c.roomId);
      const due = period + '-' + F.pad(c.payDay); const issue = F.addDays(due, -10);
      const inv = mk('invoices', { code: 'HD-' + period.replace('-', '') + '-' + F.pad(opts.seq || invN++, 3), contractId: c.id, roomId: c.roomId, buildingId: c.buildingId, tenantId: c.tenantId, period, issueDate: opts.draft ? null : issue, dueDate: due, docStatus: opts.draft ? 'draft' : (opts.adjusted ? 'adjusted' : 'issued'), total: 0, note: '', createdBy: uid('ketoan'), createdAt: F.addDays(due, -12) + 'T09:00', reminderCount: 0, lastReminderAt: null, accountingNote: '' });
      const lines = [];
      lines.push({ item: 'Tiền phòng', desc: 'Tiền thuê phòng ' + F.periodLabel(period).toLowerCase(), qty: 1, unitPrice: c.price, kind: 'rent' });
      services(c).forEach(s => lines.push({ item: s.name, desc: s.name + ' ' + F.periodLabel(period).toLowerCase(), qty: s.qty, unitPrice: s.price, kind: 'service', serviceId: s.serviceId }));
      const eP = st.meterReadings.filter(m => m.roomId === c.roomId && m.type === 'electric').sort((a, b) => F.cmp(b.period, a.period))[0];
      const wP = st.meterReadings.filter(m => m.roomId === c.roomId && m.type === 'water').sort((a, b) => F.cmp(b.period, a.period))[0];
      if (!opts.noMeter) {
        const e = meter(c.roomId, period, 'electric', eP ? eP.curr : rint(800, 2500), rint(60, 250));
        const w = meter(c.roomId, period, 'water', wP ? wP.curr : rint(50, 300), rint(5, 25));
        lines.push({ item: 'Điện', desc: 'Tiền điện (' + (e.curr - e.prev) + ' kWh x ' + F.vnd(S('DIEN').price) + ')', qty: e.curr - e.prev, unitPrice: S('DIEN').price, kind: 'electric', meterId: e.id });
        lines.push({ item: 'Nước', desc: 'Tiền nước (' + (w.curr - w.prev) + ' m³ x ' + F.vnd(S('NUOC').price) + ')', qty: w.curr - w.prev, unitPrice: S('NUOC').price, kind: 'water', meterId: w.id });
      }
      if (opts.adjusted) lines.push({ item: 'Điều chỉnh', desc: 'Điều chỉnh kỳ trước', qty: 1, unitPrice: -160000, kind: 'adjust' });
      lines.forEach((l, k) => mk('invoiceLines', { invoiceId: inv.id, seq: k + 1, item: l.item, desc: l.desc, qty: l.qty, unitPrice: l.unitPrice, amount: l.qty * l.unitPrice, kind: l.kind, serviceId: l.serviceId || null }));
      inv.total = F.sum(st.invoiceLines.filter(l => l.invoiceId === inv.id), l => l.amount);
      return inv;
    }
    let payN = 1;
    function pay(inv, amount, date, opts = {}) {
      const c = st.contracts.find(x => x.id === inv.contractId);
      const p = mk('payments', { code: 'PAY-' + inv.period.replace('-', '') + '-' + F.pad(payN++, 3), tenantId: inv.tenantId, roomId: inv.roomId, buildingId: inv.buildingId, date: date || inv.dueDate, amount, method: opts.method || pick(METHODS), ref: 'FT' + date.replace(/-/g, '').slice(2) + '-' + F.pad(rint(1, 20)), evidence: 'bien_lai.pdf', note: 'Khách thanh toán tiền nhà ' + F.periodLabel(inv.period).toLowerCase(), status: 'recorded', createdBy: pick([uid('ketoan'), uid('vanhanh'), uid('lequanghuy')]), bank: 'Vietcombank', transferContent: 'THANH TOAN TIEN NHA ' + (st.rooms.find(x => x.id === inv.roomId) || {}).code + ' ' + F.periodLabel(inv.period).toUpperCase(), createdAt: date + 'T09:25' });
      mk('paymentAllocations', { paymentId: p.id, invoiceId: inv.id, amount });
      return p;
    }
    // Kỳ trước (08, 09/2026) cho tất cả HĐ đang hiệu lực – đã thu đủ, không sinh dòng chỉ số quá nhiều: chỉ hero
    Object.values(heroC).forEach(c => { ['2026-07', '2026-08', '2026-09'].forEach(p => { if (c.start <= p + '-01' && c.status === 'active') { const inv = makeInvoice(c, p); pay(inv, inv.total, F.addDays(inv.dueDate, -rint(0, 5))); } }); });
    ['2026-03', '2026-04', '2026-05', '2026-06'].forEach(p => { const c = heroC['Nguyễn Thảo Vy']; const inv = makeInvoice(c, p); pay(inv, inv.total, F.addDays(inv.dueDate, -2)); });
    // Kỳ 10/2026
    invN = 1;
    const heroInv = {};
    const heroPlan = { 'Trần Minh Đức': ['unpaid'], 'Nguyễn Thị Hương': ['partial', 4000000], 'Lê Quang Huy': ['unpaid'], 'Hoàng Nam Khánh': ['unpaid'], 'Trần Văn Nam': ['paid'], 'Vũ Thảo Nguyên': ['paid'], 'Đặng Quốc Bảo': ['unpaid'], 'Ngô Yến Nhi': ['partial', 1500000], 'Phan Văn Long': ['unpaid'], 'Bùi Thị Mai': ['unpaid'], 'Nguyễn Thảo Vy': ['unpaid'] };
    H.forEach(h => { const c = heroC[h[0]]; const inv = makeInvoice(c, '2026-10'); heroInv[h[0]] = inv; const pl = heroPlan[h[0]]; if (pl[0] === 'paid') pay(inv, inv.total, F.addDays(inv.dueDate, -1)); if (pl[0] === 'partial') pay(inv, pl[1], F.addDays(inv.dueDate, -1)); });
    heroInv['Lê Quang Huy'].reminderCount = 2; heroInv['Lê Quang Huy'].lastReminderAt = '2026-10-12T09:15'; heroInv['Lê Quang Huy'].accountingNote = 'Khách thuê đề nghị giữ nguyên mức phí. Kiểm tra chỉ số điện nước hàng tháng.';
    heroInv['Trần Minh Đức'].reminderCount = 1; heroInv['Trần Minh Đức'].lastReminderAt = '2026-10-20T09:00';
    // HĐ đã kết thúc Phạm Thu Trang: hóa đơn 10/2026 chưa thu
    makeInvoice(heroC['Phạm Thu Trang'], '2026-10');
    const rest = active.filter(c => !Object.values(heroC).includes(c));
    rest.forEach((c, k) => {
      const m = k % 20;
      if (m < 10) { const inv = makeInvoice(c, '2026-10'); pay(inv, inv.total, F.addDays(inv.dueDate, -rint(0, 6))); }
      else if (m < 12) { const inv = makeInvoice(c, '2026-10'); pay(inv, Math.round(inv.total * pick([.3, .5, .6]) / 100000) * 100000, F.addDays(inv.dueDate, -1)); }
      else if (m < 15) { makeInvoice(c, '2026-10'); }
      else if (m < 17) { makeInvoice(c, '2026-10', { draft: true, noMeter: k % 2 === 0 }); }
      else if (m < 18) { const inv = makeInvoice(c, '2026-10', { adjusted: true }); pay(inv, inv.total, F.addDays(inv.dueDate, -1)); }
      else { /* chưa lập hóa đơn kỳ này → hiện trong wizard */ }
    });


    /* ---------- Khách đã trả phòng (lịch sử) + hoàn cọc ---------- */
    // HĐ đã kết thúc chỉ gắn vào phòng Sẵn sàng/Chờ dọn (không chồng HĐ hiệu lực); công nợ lấy từ hóa đơn thật
    const RF = [['Chờ duyệt', 14, 'pending'], ['Đã duyệt', 8, 'approved'], ['Đã hoàn', 42, 'refunded'], ['Từ chối', 3, 'rejected'], ['Nháp', 5, 'draft']];
    const refundNames = ['Đỗ Minh Châu', 'Trịnh Gia Hân', 'Lương Hải Đăng', 'Cao Thùy Dương', 'Tô Ngọc Ánh', 'Dương Anh Tuấn', 'Phan Thị Lan', 'Đinh Xuân Phúc', 'Mai Hồng Nhung'];
    let rc = 1;
    const freeForHistory = shuffle(rooms.filter(x => x.status === 'ready').slice());
    const cleanQueue = clean.slice();
    let refundSeq = 500;
    function addRefund(status, c, t, room, moveOut) {
      const dep = c.deposit;
      // công nợ: tạo hóa đơn kỳ trả phòng còn nợ một phần (không gán số cứng)
      let debt = 0;
      const existingInv = st.invoices.filter(i => i.contractId === c.id && i.docStatus !== 'draft');
      if (existingInv.length) debt = F.sum(existingInv, i => Math.max(0, i.total - F.sum(st.paymentAllocations.filter(a => a.invoiceId === i.id), a => a.amount)));
      else if (status !== 'refunded' && r() > .55) { const inv = makeInvoice(c, moveOut.slice(0, 7), { noMeter: true, seq: refundSeq++ }); const target = rint(3, 15) * 100000; if (inv.total > target) pay(inv, inv.total - target, F.addDays(inv.dueDate, -1)); debt = inv.total - F.sum(st.paymentAllocations.filter(a => a.invoiceId === inv.id), a => a.amount); }
      const ded = [{ group: 'Khấu hao', desc: 'Khấu hao cố định theo phòng', amount: 200000 }];
      if (r() > .4) ded.push({ group: 'Dịch vụ', desc: 'Vệ sinh phòng', amount: rint(2, 4) * 100000 });
      if (r() > .6) ded.push({ group: 'Sửa chữa', desc: pick(['Sửa chữa hư hỏng (ổ khóa cửa)', 'Thay bóng đèn, vòi nước', 'Sơn lại tường trầy xước']), amount: rint(2, 8) * 50000 });
      const dedTotal = F.sum(ded, x => x.amount);
      const rf = mk('refunds', { code: 'RC202610-' + F.pad(rc++, 3), contractId: c.id, tenantId: t.id, roomId: room.id, buildingId: room.buildingId, requestDate: F.addDays(moveOut, 1), moveOutDate: moveOut, deposit: dep, debt, offsetDebt: false, deductionsTotal: dedTotal, refundAmount: Math.max(0, dep - dedTotal), status, handlerId: status === 'draft' ? null : pick([uid('ketoan'), uid('lequanghuy'), uid('vanhanh'), uid('hnkhanh')]), approverRole: 'Kế toán trưởng', rejectReason: status === 'rejected' ? 'Thiếu chứng từ sửa chữa, đề nghị bổ sung hóa đơn.' : '', approvedAt: ['approved', 'refunded'].includes(status) ? F.addDays(moveOut, 3) + 'T10:00' : null, approvedBy: ['approved', 'refunded'].includes(status) ? uid('ketoan') : null, paidDate: status === 'refunded' ? F.addDays(moveOut, 5) : null, paidRef: status === 'refunded' ? 'CK' + rint(100000, 999999) : '', paidEvidence: status === 'refunded' ? 'uy_nhiem_chi.pdf' : '', paidMethod: status === 'refunded' ? 'Chuyển khoản' : '', inspection: { wall: 'ok', furniture: r() > .5 ? 'minor' : 'ok', utilities: 'ok', devices: 'ok' }, files: ['Bien_ban_hien_trang.pdf'] });
      ded.forEach(d => mk('refundDeductions', { refundId: rf.id, group: d.group, desc: d.desc, amount: d.amount, evidenceCount: rint(1, 3), status: 'confirmed' }));
      return rf;
    }
    // Hero: Phạm Thu Trang A.16.08 (HĐ đã kết thúc 20/10, hóa đơn 10/2026 còn nợ) → hồ sơ Chờ duyệt
    { const c = heroC['Phạm Thu Trang']; addRefund('pending', c, st.tenants.find(x => x.id === c.tenantId), st.rooms.find(x => x.id === c.roomId), c.actualEnd); }
    RF.forEach(([lbl, n, status]) => {
      for (let k = 0; k < n; k++) {
        if (status === 'pending' && k === 0) continue; // đã dùng cho hero
        const room = (status === 'pending' && cleanQueue.length) ? cleanQueue.shift() : (freeForHistory.shift() || pick(rooms.filter(x => x.status === 'ready')));
        const t = addTenant({ name: rc <= refundNames.length ? refundNames[rc - 1] : name() });
        const moveOut = F.addDays(T, -rint(1, status === 'refunded' ? 120 : 25));
        const c = addContract({ tenantId: t.id, roomId: room.id, start: F.addDays(F.addMonths(moveOut, -12), 1), end: moveOut, status: 'ended', actualEnd: moveOut, payDay: 10 });
        addRefund(status, c, t, room, moveOut);
      }
    });

    /* ---------- Chi phí ---------- */
    const EX = [
      ['2026-10-02', 'Điện nước', 'Tiền điện tháng 10/2026', 'TH-HBT-01', 4500000, 'ops', 'HD001.pdf', 'vanhanh'],
      ['2026-10-04', 'Sửa chữa', 'Sửa máy lạnh phòng A.12.03', 'TH-HBT-01', 2800000, 'ops', 'BC002.jpg', 'lequanghuy'],
      ['2026-10-05', 'Marketing', 'Quảng cáo Facebook tháng 10', null, 3200000, 'common', 'INV003.pdf', 'admin'],
      ['2026-10-08', 'Mua sắm TS', 'Mua tủ lạnh cho phòng B.05.01', 'TH-PXL-02', 12500000, 'asset', 'HD004.pdf', 'lequanghuy'],
      ['2026-10-10', 'Thuê nhà', 'Chi phí thuê văn phòng tháng 10', null, 15000000, 'common', 'HD005.pdf', 'ketoan'],
      ['2026-10-12', 'Điện nước', 'Tiền nước tháng 10/2026', 'TH-Q1-03', 3600000, 'ops', 'HD006.pdf', 'lequanghuy'],
      ['2026-10-14', 'Sửa chữa', 'Thay bóng đèn khu hành lang', 'TH-BTD-04', 1200000, 'ops', 'BC007.jpg', 'hnkhanh'],
      ['2026-10-15', 'Mua sắm TS', 'Mua máy giặt công nghiệp', null, 28000000, 'asset', 'HD008.pdf', 'admin'],
      ['2026-10-18', 'Marketing', 'Thiết kế banner, tờ rơi', null, 2000000, 'common', 'INV009.pdf', 'admin'],
      ['2026-10-20', 'Sửa chữa', 'Sửa cửa phòng C.10.01', 'TH-Q1-03', 1600000, 'ops', 'BC010.jpg', 'lequanghuy'],
    ];
    const EXG = ['Điện nước', 'Sửa chữa', 'Marketing', 'Mua sắm TS', 'Thuê nhà', 'Lương', 'Khác'];
    for (let k = 0; k < 28; k++) {
      const e = EX[k] || [F.addDays('2026-10-01', rint(0, 27)), pick(EXG), pick(['Bảo trì thang máy', 'Vệ sinh định kỳ', 'Mua vật tư sửa chữa', 'Phí internet tòa', 'Rác & môi trường', 'Lương NV vệ sinh']), pick(BD.slice(0, 5))[0], rint(5, 80) * 100000, pick(['ops', 'ops', 'common']), 'CT' + F.pad(k + 1, 3) + '.pdf', pick(['vanhanh', 'ketoan', 'admin'])];
      const ex = mk('expenses', { code: 'CP' + F.pad(k + 1, 4), date: e[0], group: e[1], desc: e[2], buildingId: e[3] ? B[e[3]].id : null, amount: e[4], recordType: e[5], method: e[5] === 'asset' && k % 3 === 0 ? 'depreciation' : 'cash', evidence: e[6], note: '', createdBy: uid(e[7]), status: e[5] === 'common' && k % 2 ? 'pending_alloc' : 'recorded' });
      if (!ex.buildingId && ex.status !== 'pending_alloc') [[0, 40], [1, 30], [2, 20], [3, 10]].forEach(([bi, pct]) => mk('expenseAllocations', { expenseId: ex.id, buildingId: buildings[bi].id, pct, amount: Math.round(ex.amount * pct / 100) }));
    }

    /* ---------- Zalo: đợt gửi ---------- */
    const tpl = F.by(st.zaloTemplates, 'eventKey');
    const ZB = [
      ['Nhắc tiền phòng T10', 'reminder', 'Khách thuê', 320, 302, 12, '2026-10-22T09:00', 'admin', 'sending'],
      ['Nhắc lịch xem phòng', 'p2_viewing', 'Khách quan tâm', 86, 86, 0, '2026-10-20T14:30', 'ttmai', 'done'],
      ['HĐ sắp hết hạn T10', 'contract_expiry', 'Khách thuê', 124, 118, 6, '2026-10-18T09:00', 'lequanghuy', 'partial'],
      ['Thông báo bảo trì thang máy', 'broadcast', 'Cư dân tòa nhà', 280, 270, 10, '2026-10-16T10:00', 'pttrang', 'partial'],
      ['Nhắc tiền phòng T9 (lần 2)', 'reminder', 'Khách thuê', 315, 290, 25, '2026-10-12T09:00', 'admin', 'failed'],
      ['Chúc mừng sinh nhật', 'p2_care', 'Khách thuê', 42, 41, 1, '2026-10-10T08:00', 'vtmai', 'done'],
      ['Nhắc lịch xem phòng', 'p2_viewing', 'Khách quan tâm', 67, 62, 5, '2026-10-08T14:00', 'dqbao', 'partial'],
      ['Nhắc HĐ sắp hết hạn', 'contract_expiry', 'Khách thuê', 58, 0, 58, '2026-10-05T09:00', 'nvan', 'failed'],
      ['Thông báo điều chỉnh giá điện', 'broadcast', 'Cư dân tòa nhà', 410, 395, 15, '2026-10-02T10:00', 'admin', 'partial'],
      ['Nhắc tiền phòng T9', 'reminder', 'Khách thuê', 298, 298, 0, '2026-09-22T09:00', 'admin', 'done'],
    ];
    const ERRS = ['ZLM-1001', 'ZLM-2003', 'ZLM-1001', 'ZLM-3005'];
    for (let k = 28; k >= 1; k--) {
      const z = ZB[28 - k] || [pick(['Nhắc tiền phòng', 'Nhắc công nợ', 'Thông báo chung']), pick(['reminder', 'debt', 'broadcast']), 'Khách thuê', rint(40, 300), 0, 0, F.addDays('2026-09-01', rint(0, 40)) + 'T09:00', 'admin', 'done'];
      if (!ZB[28 - k]) { z[4] = z[3] - rint(0, 8); z[5] = z[3] - z[4]; z[8] = z[5] ? 'partial' : 'done'; }
      const tk = tpl[z[1]] ? tpl[z[1]][0] : tpl['reminder'][0];
      mk('zaloBatches', { code: 'ZL-202610-' + F.pad(k, 3), name: z[0], eventKey: z[1], audience: z[2], plannedCount: z[3], sentCount: z[4], failedCount: z[5], sentAt: z[6], createdAt: z[6], createdBy: uid(z[7]), status: z[8], templateId: tk.id, source: 'seed', sourceKey: z[1] === 'reminder' ? 'due_soon' : z[1] === 'debt' ? 'overdue' : z[1], scopeLabel: pick(['Tất cả tòa nhà', 'Tòa Sunrise', 'Tòa Moonlight', 'Khu Thủ Đức']), period: '2026-10', sendMode: 'now', rules: 'Gửi cho hóa đơn còn nợ > 0 · Chỉ gửi 1 tin / khách / kỳ · Bỏ qua nếu khách đã nhận tin trong 3 ngày qua', errors: z[5] ? pick(['Lỗi không tìm thấy số điện thoại', 'Khách hàng chặn tin nhắn', 'Lỗi kết nối Zalo OA', 'Số điện thoại không hợp lệ', 'Vượt giới hạn gửi trong ngày']) : '' });
    }
    // Tin nhắn của đợt 028 (đang gửi) từ hóa đơn 10/2026 đã phát hành
    const b28 = st.zaloBatches.find(b => b.code === 'ZL-202610-028');
    const issued = st.invoices.filter(x => x.period === '2026-10' && x.docStatus !== 'draft');
    const dist = ['delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'accepted', 'accepted', 'accepted', 'sending', 'sending', 'queued', 'queued', 'failed', 'unknown', 'delivered', 'accepted', 'delivered', 'skipped', 'delivered'];
    let cnt = { queued: 0, sending: 0, accepted: 0, delivered: 0, failed: 0, unknown: 0, skipped: 0 };
    issued.forEach((inv, k) => {
      const stt = dist[k % dist.length]; cnt[stt]++;
      const t = st.tenants.find(x => x.id === inv.tenantId); const room = st.rooms.find(x => x.id === inv.roomId);
      mk('zaloMessages', { batchId: b28.id, tenantId: inv.tenantId, roomId: inv.roomId, buildingId: inv.buildingId, invoiceId: inv.id, channel: 'Zalo', templateCode: 'TM_NHAC_TIEN_001', status: stt, errorCode: stt === 'failed' ? ERRS[k % ERRS.length] : '', sentAt: stt === 'queued' ? null : '2026-10-22T09:' + F.pad(k % 60), phone: t.phone, content: TH.zalo ? '' : '', amountAtSend: inv.total, retryOfId: null, attempt: 1 });
    });
    b28.plannedCount = issued.length; b28.sentCount = cnt.delivered + cnt.accepted; b28.failedCount = cnt.failed; b28.startedAt = '2026-10-22T09:05';
    // Vài tin cho đợt 026 (HĐ sắp hết hạn)
    const b26 = st.zaloBatches.find(b => b.code === 'ZL-202610-026');
    const expiringC = active.filter(c => F.daysUntil(c.end) <= 35).slice(0, 20);
    expiringC.forEach((c, k) => { const t = st.tenants.find(x => x.id === c.tenantId); mk('zaloMessages', { batchId: b26.id, tenantId: c.tenantId, roomId: c.roomId, buildingId: c.buildingId, invoiceId: null, contractId: c.id, channel: 'Zalo', templateCode: 'TM_HD_HET_HAN_001', status: k % 7 === 3 ? 'failed' : 'delivered', errorCode: k % 7 === 3 ? 'ZLM-1001' : '', sentAt: '2026-10-18T09:' + F.pad(k), phone: t.phone, attempt: 1 }); });
    b26.plannedCount = expiringC.length; b26.failedCount = expiringC.filter((c, k) => k % 7 === 3).length; b26.sentCount = expiringC.length - b26.failedCount;
    // Tin nhắc cho Lê Quang Huy (2 lần) & Trần Minh Đức
    const b24 = st.zaloBatches.find(b => b.code === 'ZL-202610-024');
    [['Lê Quang Huy', b24, '2026-10-12T09:15', 'delivered'], ['Lê Quang Huy', b28, '2026-10-22T09:10', 'delivered'], ['Trần Minh Đức', b28, '2026-10-22T09:11', 'delivered']].forEach(([nm, b, at, s]) => { const inv = heroInv[nm]; const t = st.tenants.find(x => x.id === inv.tenantId); if (!st.zaloMessages.some(m => m.batchId === b.id && m.invoiceId === inv.id)) mk('zaloMessages', { batchId: b.id, tenantId: inv.tenantId, roomId: inv.roomId, buildingId: inv.buildingId, invoiceId: inv.id, channel: 'Zalo', templateCode: 'TM_NHAC_TIEN_001', status: s, errorCode: '', sentAt: at, phone: t.phone, attempt: 1 }); });

    /* ---------- Tài sản phòng, import job, price history ---------- */
    Object.values(heroC).forEach(c => { ['Giường ngủ', 'Máy lạnh', 'Tủ quần áo', 'Bình nóng lạnh'].forEach(n => mk('roomAssets', { roomId: c.roomId, name: n, qty: 1, condition: 'Tốt' })); });
    rooms.slice(0, 60).forEach(rm => { if (!st.roomAssets.some(a => a.roomId === rm.id)) ['Giường ngủ', 'Máy lạnh', 'Tủ quần áo'].forEach(n => mk('roomAssets', { roomId: rm.id, name: n, qty: 1, condition: pick(['Tốt', 'Tốt', 'Cần bảo dưỡng']) })); });
    mk('importJobs', { type: 'tenant', fileName: 'khach_thue_thang10.csv', rows: 94, valid: 86, warn: 6, error: 2, status: 'done', createdBy: uid('admin'), createdAt: '2026-10-15T10:00', checksum: 'seed1' });
    st.meta.seededAt = F.nowISO();
    st.meta.counters = { tenant: tCounter, contract: cCounter };
    if (seed.phase2) seed.phase2(st); // Phase 2: luôn seed, ẩn khi P2 tắt
    if (seed.phase3) seed.phase3(st); // Phase 3: luôn seed, ẩn khi P3 tắt
    return st;
  };

  function addUsers(st) {
    if (st.users.length) return;
    const mk = (o) => { o.id = F.uid('usr'); o.source = 'seed'; o.createdAt = '2026-01-01T08:00'; st.users.push(o); return o; };
    const U = [
      ['admin', 'Nguyễn Văn Minh', 'minhnv@timohouse.vn', '0901 234 567', 'admin', 'Toàn hệ thống', 'active', '2026-10-22T14:30'],
      ['ketoan', 'Trần Thị Lan', 'lantt@timohouse.vn', '0902 345 678', 'accountant', 'Tài chính', 'active', '2026-10-22T09:15'],
      ['vanhanh', 'Nguyễn Thị Hương', 'huongnt@timohouse.vn', '0903 456 789', 'ops', 'Tòa Sunrise', 'active', '2026-10-21T16:45'],
      ['lequanghuy', 'Lê Quang Huy', 'huylq@timohouse.vn', '0904 567 890', 'ops', 'Tòa Moonlight, Tòa Riverside', 'active', '2026-10-22T08:20'],
      ['hnkhanh', 'Hoàng Nam Khánh', 'khanhhn@timohouse.vn', '0905 678 901', 'ops', 'Tòa Central', 'active', '2026-10-20T11:10'],
      ['tranminhduc', 'Trần Minh Đức', 'ductm@timohouse.vn', '0906 789 012', 'ops', 'Tòa Garden', 'active', '2026-10-22T07:55'],
      ['lehoang', 'Lê Hoàng', 'hoangl@timohouse.vn', '0907 890 123', 'ops', 'Tòa Moonlight', 'active', '2026-10-19T17:30'],
      ['ptlan', 'Phạm Thị Lan', 'lanpt@timohouse.vn', '0908 901 234', 'accountant', 'Tài chính', 'active', '2026-10-22T10:05'],
      ['vtmai', 'Vũ Thị Mai', 'maivt@timohouse.vn', '0909 012 345', 'sale', 'Khu vực TP.HCM', 'expired', '2026-08-30T09:00'],
      ['nvan', 'Ngô Văn An', 'annv@timohouse.vn', '0910 123 456', 'kythuat', 'Tòa Riverside', 'locked', '2026-09-12T13:20'],
      ['ttmai', 'Trần Thị Mai', 'maitt@timohouse.vn', '0911 234 567', 'sale', 'Khu vực Hà Nội', 'active', '2026-10-21T15:00'],
      ['pttrang', 'Phạm Thu Trang', 'trangpt@timohouse.vn', '0912 345 678', 'ops', 'Tòa Sunrise', 'active', '2026-10-22T12:00'],
      ['dqbao', 'Đặng Quốc Bảo', 'baodq@timohouse.vn', '0913 456 789', 'sale', 'Khu vực TP.HCM', 'active', '2026-10-18T09:40'],
      ['ntlinh', 'Ngô Thị Linh', 'linhnt@timohouse.vn', '0914 567 890', 'ops', 'Tòa Central', 'locked', '2026-07-01T09:00'],
      ['lvthanh', 'Lê Văn Thành', 'thanhlv@timohouse.vn', '0915 678 901', 'kythuat', 'Tòa Sunrise', 'active', '2026-10-22T06:50'],
      ['btha', 'Bùi Thị Hà', 'habt@timohouse.vn', '0916 789 012', 'accountant', 'Tài chính', 'active', '2026-10-21T09:00'],
      ['dvnam', 'Đỗ Văn Nam', 'namdv@timohouse.vn', '0917 890 123', 'ops', 'Tòa Riverside', 'active', '2026-10-22T08:00'],
      ['hthoa', 'Hồ Thị Hoa', 'hoaht@timohouse.vn', '0918 901 234', 'sale', 'Khu vực TP.HCM', 'expired', '2026-06-30T09:00'],
      ['pvquan', 'Phan Văn Quân', 'quanpv@timohouse.vn', '0919 012 345', 'kythuat', 'Tòa Moonlight', 'active', '2026-10-20T14:00'],
      ['dtmy', 'Dương Thị My', 'mydt@timohouse.vn', '0920 123 456', 'ops', 'Tòa Garden', 'active', '2026-10-22T09:30'],
      ['lgphuc', 'Lý Gia Phúc', 'phuclg@timohouse.vn', '0921 234 567', 'sale', 'Khu vực Hà Nội', 'active', '2026-10-19T10:00'],
      ['tkngan', 'Tô Kim Ngân', 'ngantk@timohouse.vn', '0922 345 678', 'accountant', 'Tài chính', 'expired', '2026-05-31T09:00'],
      ['cxson', 'Cao Xuân Sơn', 'soncx@timohouse.vn', '0923 456 789', 'kythuat', 'Tòa Central', 'active', '2026-10-21T08:15'],
      ['mtloan', 'Mai Thị Loan', 'loanmt@timohouse.vn', '0924 567 890', 'ops', 'Tòa Sunrise', 'locked', '2026-09-01T09:00'],
    ];
    U.forEach(u => mk({ username: u[0], name: u[1], email: u[2], phone: u[3], role: u[4], scope: u[5], status: u[6], lastLogin: u[7], effectiveDate: '2026-01-01', note: '' }));
  }
  function addCatalog(st) {
    if (st.services.length) return;
    const mk = (col, o) => { o.id = F.uid(col.slice(0, 3)); o.source = 'seed'; o.createdAt = '2026-01-01T08:00'; st[col].push(o); return o; };
    [
      ['DIEN', 'Điện', 'Dịch vụ tiện ích', 'kWh', 'meter', 3500, 'zap', 'Tính theo chỉ số công tơ điện.'],
      ['NUOC', 'Nước', 'Dịch vụ tiện ích', 'm³', 'meter', 20000, 'droplet', 'Tính theo chỉ số đồng hồ nước.'],
      ['INTERNET', 'Internet', 'Dịch vụ tiện ích', 'Tháng', 'fixed', 200000, 'wifi', 'Dịch vụ internet tốc độ cao, đã bao gồm thiết bị modem.'],
      ['THANGMAY', 'Thang máy', 'Dịch vụ chung', 'Tháng', 'per_room', 50000, 'move-up', 'Phí vận hành thang máy theo phòng.'],
      ['QUANLY', 'Phí quản lý', 'Dịch vụ chung', 'Tháng', 'per_room', 150000, 'settings', 'Phí quản lý, vệ sinh khu vực chung.'],
      ['SACXE', 'Sạc xe điện', 'Dịch vụ tiện ích', 'Tháng', 'fixed', 100000, 'battery-charging', 'Phí sạc xe điện theo tháng.'],
      ['GUIXE', 'Gửi xe', 'Dịch vụ tiện ích', 'Xe/tháng', 'per_vehicle', 100000, 'car', 'Phí gửi xe máy theo số lượng xe khai báo.'],
    ].forEach((s, i) => {
      const o = mk('services', { code: s[0], name: s[1], group: s[2], unit: s[3], method: s[4], price: s[5], icon: s[6], scope: s[0] === 'GUIXE' ? 'buildings' : 'all', buildingIds: [], effectiveFrom: '2026-01-01', effectiveTo: '', status: 'active', note: s[7] });
      mk('priceHistory', { serviceId: o.id, date: '2026-01-01', price: s[5], scope: 'Tất cả tòa nhà', userId: null, userName: 'Nguyễn Văn Minh' });
      if (s[0] === 'INTERNET') { mk('priceHistory', { serviceId: o.id, date: '2025-06-01', price: 180000, scope: 'Tất cả tòa nhà', userName: 'Trần Thị Lan' }); mk('priceHistory', { serviceId: o.id, date: '2025-01-01', price: 150000, scope: 'Tất cả tòa nhà', userName: 'Nguyễn Văn Minh' }); }
    });
    [['Giá vốn / tiền thuê nhà', 'Thuê nhà'], ['Mua sắm thiết bị', 'Mua sắm TS'], ['Giá gốc điện/nước/mạng/rác', 'Điện nước'], ['Chi phí vận hành & lương', 'Lương'], ['Marketing / bán hàng', 'Marketing'], ['Sửa chữa / thay thế / bảo trì', 'Sửa chữa'], ['Chi phí khác', 'Khác']].forEach((g, i) => mk('expenseGroups', { code: 'NC' + F.pad(i + 1), name: g[1], fullName: g[0], status: 'active' }));
    ['Chuyển khoản', 'Tiền mặt', 'Ví điện tử', 'Quẹt thẻ POS'].forEach((m, i) => mk('payMethods', { code: 'PT' + F.pad(i + 1), name: m, status: i < 3 ? 'active' : 'inactive' }));
  }
  function addZaloConfig(st) {
    if (st.zaloTemplates.length) return;
    const mk = (col, o) => { o.id = F.uid(col.slice(0, 3)); o.source = 'seed'; o.createdAt = '2026-01-01T08:00'; st[col].push(o); return o; };
    const T = [
      ['TM_NHAC_TIEN_001', 'Mẫu nhắc tiền phòng (mặc định)', 'reminder', '🏠 Xin chào anh/chị {ten_khach},\nĐây là thông báo nhắc thanh toán tiền phòng của TimoHouse.\n🏢 Tòa nhà: {toa_nha}\n🏠 Phòng: {so_phong}\n📅 Kỳ thanh toán: {ky}\n💲 Số tiền: {so_tien} VNĐ\n🕐 Hạn thanh toán: {ngay_den_han} ({con_lai})\nAnh/chị vui lòng thanh toán đúng hạn để tránh phát sinh phí chậm trả. Cảm ơn anh/chị đã đồng hành cùng TimoHouse!'],
      ['TM_CONG_NO_001', 'Nhắc nhở công nợ (mặc định)', 'debt', '🏠 Xin chào anh/chị {ten_khach},\nTimoHouse xin nhắc về khoản công nợ thuê phòng của anh/chị như sau:\n🏢 Tòa nhà: {toa_nha}\n🏠 Phòng: {so_phong}\n💲 Số tiền còn nợ: {so_tien} VNĐ\n🕐 Ngày quá hạn: {ngay_den_han} ({qua_han})\nAnh/chị vui lòng thanh toán sớm để tránh phát sinh phí chậm trả. Nếu anh/chị đã thanh toán, vui lòng bỏ qua thông báo này. Cảm ơn anh/chị đã đồng hành cùng TimoHouse!'],
      ['TM_HD_HET_HAN_001', 'Thông báo hợp đồng sắp hết hạn', 'contract_expiry', '📄 Xin chào anh/chị {ten_khach},\nHợp đồng thuê phòng {so_phong} – {toa_nha} của anh/chị sẽ hết hạn vào ngày {ngay_het_han} ({con_lai}).\nAnh/chị vui lòng liên hệ quản lý tòa để trao đổi về việc gia hạn hoặc kế hoạch trả phòng. Cảm ơn anh/chị!'],
      ['TM_HOAN_COC_001', 'Thông báo đã hoàn cọc', 'refund_done', '✅ Xin chào anh/chị {ten_khach},\nTimoHouse đã hoàn trả tiền cọc phòng {so_phong} – {toa_nha}.\n💲 Số tiền hoàn: {so_tien} VNĐ\n📅 Ngày hoàn: {ngay_hoan}\nCảm ơn anh/chị đã tin tưởng TimoHouse trong thời gian vừa qua!'],
      ['TM_CHUNG_001', 'Thông báo chung', 'broadcast', '📢 Kính gửi cư dân {toa_nha},\n{noi_dung}\nTrân trọng,\nBan quản lý TimoHouse.'],
      ['TM_TRA_CHU_NHA_001', 'Nhắc kỳ trả chủ nhà', 'landlord_due', '📅 Tòa {toa_nha} đến kỳ thanh toán chủ nhà ngày {ngay_den_han}, số tiền {so_tien} VNĐ.'],
    ];
    const tp = {}; T.forEach(t => tp[t[2]] = mk('zaloTemplates', { code: t[0], name: t[1], eventKey: t[2], body: t[3] }));
    [
      ['reminder', 'Nhắc tiền', 'Nhắc khách thuê thanh toán tiền phòng', true, 'Tất cả khách thuê có hóa đơn chưa thanh toán', 3, 'before'],
      ['contract_expiry', 'HĐ sắp hết hạn', 'Thông báo hợp đồng sắp đến hạn', true, 'Hợp đồng còn hiệu lực dưới 35 ngày', 35, 'before'],
      ['refund_done', 'Đã hoàn cọc', 'Thông báo đã hoàn trả tiền cọc cho khách', true, 'Hồ sơ hoàn cọc ở trạng thái Đã hoàn', 0, 'after'],
      ['landlord_due', 'Đến kỳ trả chủ nhà', 'Nhắc thanh toán cho chủ nhà / cổ đông', false, 'Kỳ thanh toán chủ nhà sắp đến hạn', 5, 'before'],
      ['broadcast', 'Thông báo chung', 'Gửi thông báo đến toàn bộ tòa nhà / khu vực', false, 'Toàn bộ cư dân trong phạm vi', 0, 'after'],
    ].forEach(e => mk('zaloEvents', { key: e[0], name: e[1], desc: e[2], enabled: e[3], condition: e[4], buildingId: '', offsetDays: e[5], offsetDir: e[6], templateId: tp[e[0]].id, channel: 'Zalo (OA TimoHouse)', fallback: 'Không sử dụng', recipient: 'Khách thuê (người đại diện hợp đồng)', note: '', p2: e[0] === 'landlord_due' }));
  }
  TH.seed = seed;
})(window.TH);
