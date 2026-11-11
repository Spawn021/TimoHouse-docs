/* Selectors: tính toán đọc từ store (trạng thái suy diễn, KPI) */
(function (TH) {
  const F = TH.f; const S = () => TH.store.state;
  const Q = {};
  /* ---- nhãn & màu ---- */
  Q.L = {
    room: { ready: ['Sẵn sàng', 'green'], held: ['Giữ chỗ', 'amber'], occupied: ['Đang thuê', 'blue'], cleaning: ['Chờ dọn', 'orange'], maintenance: ['Bảo trì', 'red'], inactive: ['Ngừng sử dụng', 'gray'] },
    physical: { good: ['Tốt', 'green'], needs_clean: ['Cần dọn', 'amber'], maintenance: ['Bảo trì', 'red'] },
    contract: { draft: ['Dự thảo', 'gray'], active: ['Hiệu lực', 'green'], expiring: ['Sắp hết hạn', 'amber'], ended: ['Đã kết thúc', 'gray'], cancelled: ['Hủy', 'red'] },
    invDoc: { draft: ['Nháp', 'gray'], issued: ['Đã phát hành', 'green'], adjusted: ['Đã điều chỉnh', 'purple'], cancelled: ['Đã hủy', 'red'] },
    invPay: { unpaid: ['Chưa thu', 'orange'], partial: ['Thu một phần', 'amber'], paid: ['Thu đủ', 'green'], overdue: ['Quá hạn', 'red'] },
    refund: { draft: ['Nháp', 'gray'], pending: ['Chờ duyệt', 'amber'], approved: ['Đã duyệt', 'blue'], refunded: ['Đã hoàn', 'green'], rejected: ['Từ chối', 'red'] },
    tenant: { renting: ['Đang thuê', 'green'], expiring: ['Sắp hết hạn', 'amber'], moved_out: ['Đã trả phòng', 'red'], awaiting_refund: ['Chờ hoàn cọc', 'amber'], new: ['Khách mới', 'blue'], held: ['Đang giữ chỗ', 'amber'] },
    building: { active: ['Đang hoạt động', 'green'], maintenance: ['Bảo trì, sửa chữa', 'amber'], inactive: ['Tạm ngừng', 'gray'] },
    landlord: { active: ['Đang hợp tác', 'green'], expiring: ['Sắp hết hạn', 'amber'], paused: ['Tạm ngừng', 'red'] },
    lcontract: { active: ['Đang hiệu lực', 'green'], expiring: ['Sắp hết hạn', 'amber'], ended: ['Đã kết thúc', 'gray'] },
    lpay: { paid: ['Đã thanh toán', 'green'], pending: ['Chờ thanh toán', 'amber'], upcoming: ['Chưa đến hạn', 'gray'] },
    user: { active: ['Đang hoạt động', 'green'], locked: ['Tài khoản bị khóa', 'red'], expired: ['Hết hiệu lực', 'amber'] },
    role: { admin: ['Quản trị viên', 'blue'], accountant: ['Kế toán', 'amber'], ops: ['Vận hành', 'teal'], sale: ['Sale', 'purple'], kythuat: ['Kỹ thuật', 'orange'], tech: ['Kỹ thuật', 'orange'], hr: ['Nhân sự', 'teal'], codong: ['Cổ đông', 'blue'] },
    zmsg: { queued: ['Chờ xử lý', 'amber'], sending: ['Đang gửi', 'blue'], accepted: ['Đã tiếp nhận', 'teal'], delivered: ['Đã giao', 'green'], failed: ['Thất bại', 'red'], unknown: ['Chưa rõ kết quả', 'purple'], skipped: ['Bỏ qua', 'gray'] },
    zbatch: { draft: ['Nháp', 'gray'], scheduled: ['Đã hẹn giờ', 'blue'], sending: ['Đang gửi', 'blue'], done: ['Thành công', 'green'], partial: ['Một phần', 'amber'], failed: ['Thất bại', 'red'] },
    payment: { recorded: ['Đã ghi nhận', 'green'], reversed: ['Đã hoàn tác', 'red'], adjusted: ['Đã điều chỉnh', 'purple'] },
    expGroup: { 'Điện nước': 'blue', 'Sửa chữa': 'amber', 'Marketing': 'purple', 'Mua sắm TS': 'green', 'Thuê nhà': 'blue', 'Lương': 'teal', 'Khác': 'gray' },
    recordType: { ops: 'Chi phí vận hành', asset: 'Mua sắm tài sản', common: 'Chi phí chung' },
    eventName: { reminder: 'Nhắc tiền phòng', debt: 'Nhắc công nợ', contract_expiry: 'Nhắc hợp đồng', refund_done: 'Thông báo hoàn cọc', broadcast: 'Thông báo chung', landlord_due: 'Nhắc trả chủ nhà', p2_viewing: 'Nhắc lịch xem phòng', p2_care: 'Chăm sóc khách hàng', due_soon: 'Nhắc tiền phòng', overdue: 'Nhắc công nợ', issued: 'Gửi hóa đơn' },
  };
  Q.label = (map, key) => (Q.L[map][key] || [key, 'gray'])[0];
  Q.chip = (map, key, extra = '') => { const [l, c] = Q.L[map][key] || [key, 'gray']; return `<span class="chip ${c} ${extra}">${l}</span>`; };
  Q.chipDot = (map, key) => { const [l, c] = Q.L[map][key] || [key, 'gray']; return `<span class="chip ${c}"><span class="dot"></span>${l}</span>`; };

  /* ---- lookup ---- */
  Q.building = (id) => TH.store.get('buildings', id) || {};
  Q.room = (id) => TH.store.get('rooms', id) || {};
  Q.tenant = (id) => TH.store.get('tenants', id) || {};
  Q.contract = (id) => TH.store.get('contracts', id) || {};
  Q.user = (id) => TH.store.get('users', id) || {};
  Q.userName = (id) => (TH.store.get('users', id) || {}).name || '-';
  Q.service = (id) => TH.store.get('services', id) || {};
  Q.roomLabel = (roomId) => { const r = Q.room(roomId); return r.code ? r.code + ' · ' + (Q.building(r.buildingId).name || '') : '-'; };

  /* ---- hợp đồng ---- */
  Q.contractStatus = (c) => { if (!c) return 'ended'; if (c.status === 'active' && F.daysUntil(c.end) <= 35) return 'expiring'; return c.status; };
  Q.contractRemaining = (c) => c.status === 'active' ? F.daysUntil(c.end) : null;
  Q.activeContractOfRoom = (roomId) => TH.store.one('contracts', c => c && c.roomId === roomId && c.status === 'active');
  Q.contractsOfRoom = (roomId) => TH.store.where('contracts', c => c.roomId === roomId).sort((a, b) => F.cmp(b.start, a.start));
  Q.contractsOfTenant = (tId) => TH.store.where('contracts', c => c.tenantId === tId).sort((a, b) => F.cmp(b.start, a.start));
  Q.activeContractOfTenant = (tId) => TH.store.one('contracts', c => c.tenantId === tId && c.status === 'active');
  Q.contractServices = (cId) => TH.store.where('contractServices', s => s.contractId === cId);
  Q.contractMembers = (cId) => TH.store.where('contractMembers', s => s.contractId === cId);
  Q.contractDebt = (cId) => F.sum(TH.store.where('invoices', i => i.contractId === cId && i.docStatus !== 'draft' && i.docStatus !== 'cancelled'), i => Q.invRemaining(i));
  Q.contractMonthly = (c) => c.price + F.sum(Q.contractServices(c.id).filter(s => { const sv = Q.service(s.serviceId); return sv.method !== 'meter'; }), s => s.price * s.qty);

  /* ---- khách ---- */
  Q.tenantStatus = (t) => {
    const cs = Q.contractsOfTenant(t.id); const act = cs.find(c => c.status === 'active');
    if (act) return Q.contractStatus(act) === 'expiring' ? 'expiring' : 'renting';
    if (TH.store.one('holds', h => h.tenantId === t.id)) return 'held';
    if (TH.store.one('refunds', r => r.tenantId === t.id && ['draft', 'pending', 'approved'].includes(r.status))) return 'awaiting_refund';
    if (cs.some(c => c.status === 'ended')) return 'moved_out';
    return 'new';
  };
  Q.tenantRoom = (t) => { const c = Q.activeContractOfTenant(t.id); return c ? Q.room(c.roomId) : null; };
  Q.tenantDebt = (tId) => F.sum(TH.store.where('invoices', i => i.tenantId === tId && i.docStatus !== 'draft' && i.docStatus !== 'cancelled'), i => Q.invRemaining(i));
  Q.tenantDeposit = (tId) => { const c = Q.activeContractOfTenant(tId); return c ? c.deposit : 0; };

  /* ---- hóa đơn ---- */
  Q.invLines = (invId) => TH.store.where('invoiceLines', l => l.invoiceId === invId).sort((a, b) => a.seq - b.seq);
  Q.invPaid = (inv) => { const pays = F.idx(TH.store.all('payments')); return F.sum(TH.store.where('paymentAllocations', a => a.invoiceId === inv.id && pays[a.paymentId] && pays[a.paymentId].status === 'recorded'), a => a.amount); };
  Q.invRemaining = (inv) => Math.max(0, (inv.total || 0) - Q.invPaid(inv));
  Q.invPayStatus = (inv) => { const p = Q.invPaid(inv); if (inv.total > 0 && p >= inv.total) return 'paid'; if (p > 0) return 'partial'; return 'unpaid'; };
  Q.invOverdue = (inv) => inv.docStatus !== 'draft' && inv.docStatus !== 'cancelled' && Q.invRemaining(inv) > 0 && inv.dueDate < F.today();
  Q.invOverdueDays = (inv) => Q.invOverdue(inv) ? F.daysOverdue(inv.dueDate) : 0;
  Q.invDebtFlag = (inv) => inv.issueDate && Q.invRemaining(inv) > 0 && F.daysBetween(inv.issueDate, F.today()) >= 5; // BR-07
  Q.invPayChip = (inv) => { if (Q.invOverdue(inv)) return Q.chip('invPay', 'overdue'); return Q.chip('invPay', Q.invPayStatus(inv)); };
  Q.invReminders = (invId) => TH.store.where('zaloMessages', m => m.invoiceId === invId && m.status !== 'skipped');
  Q.invReminded = (invId) => TH.store.where('zaloMessages', m => m.invoiceId === invId && ['delivered', 'accepted'].includes(m.status)).length > 0;
  Q.invoicesOfPeriod = (p) => TH.store.where('invoices', i => (!p || i.period === p) && i.docStatus !== 'cancelled');
  Q.invAlerts = (inv) => { const a = []; const c = Q.contract(inv.contractId); if (Q.contractStatus(c) === 'expiring') a.push('HĐ sắp hết hạn'); return a; };
  /* ---- thu ---- */
  Q.payAllocs = (pId) => TH.store.where('paymentAllocations', a => a.paymentId === pId);
  Q.paymentsOfTenant = (tId) => TH.store.where('payments', p => p.tenantId === tId).sort((a, b) => F.cmp(b.date, a.date));
  Q.paymentsOfInvoice = (invId) => { const allocs = TH.store.where('paymentAllocations', a => a.invoiceId === invId); return allocs.map(a => ({ alloc: a, payment: TH.store.get('payments', a.paymentId) })).filter(x => x.payment); };

  /* ---- phòng/tòa ---- */
  Q.roomsOf = (bId) => TH.store.where('rooms', r => r.buildingId === bId);
  Q.roomStats = (rooms) => { const s = { total: rooms.length, ready: 0, held: 0, occupied: 0, cleaning: 0, maintenance: 0, inactive: 0 }; rooms.forEach(r => s[r.status] = (s[r.status] || 0) + 1); return s; };
  Q.roomTenant = (roomId) => { const c = Q.activeContractOfRoom(roomId); return c ? Q.tenant(c.tenantId) : null; };
  Q.roomDebt = (roomId) => F.sum(TH.store.where('invoices', i => i.roomId === roomId && i.docStatus !== 'draft' && i.docStatus !== 'cancelled'), i => Q.invRemaining(i));
  Q.roomHold = (roomId) => TH.store.one('holds', h => h.roomId === roomId);
  Q.buildingReady = (bId) => Q.roomsOf(bId).filter(r => r.status === 'ready').length;
  Q.buildingNextDue = (bId) => { const b = Q.building(bId); const ps = TH.store.where('landlordPayments', p => p.landlordId === b.landlordId && p.status !== 'paid' && p.dueDate >= F.today()).sort((a, b2) => F.cmp(a.dueDate, b2.dueDate)); return ps[0] || null; };
  Q.landlordContracts = (lId) => TH.store.where('landlordContracts', c => c.landlordId === lId);
  Q.landlordPayments = (lId) => TH.store.where('landlordPayments', p => p.landlordId === lId).sort((a, b) => F.cmp(a.dueDate, b.dueDate));
  Q.upcomingLandlordPayments = (days = 30) => TH.store.where('landlordPayments', p => p.status !== 'paid' && p.dueDate >= F.today() && F.daysUntil(p.dueDate) <= days).sort((a, b) => F.cmp(a.dueDate, b.dueDate));

  /* ---- hoàn cọc ---- */
  Q.refundDeductions = (rId) => TH.store.where('refundDeductions', d => d.refundId === rId);
  Q.refundCompute = (rf) => { const ded = F.sum(Q.refundDeductions(rf.id), d => d.amount); const debt = rf.offsetDebt ? (rf.debt || 0) : 0; return { ded, debt, refund: Math.max(0, (rf.deposit || 0) - ded - debt) }; };

  /* ---- Zalo ---- */
  Q.batchMessages = (bId) => TH.store.where('zaloMessages', m => m.batchId === bId);
  Q.batchCounts = (bId) => { const c = { queued: 0, sending: 0, accepted: 0, delivered: 0, failed: 0, unknown: 0, skipped: 0, total: 0 }; Q.batchMessages(bId).forEach(m => { if (m.retried) return; c[m.status] = (c[m.status] || 0) + 1; c.total++; }); return c; };
  Q.recentMessageTo = (tenantId, days = 3) => TH.store.one('zaloMessages', m => m.tenantId === tenantId && ['delivered', 'accepted'].includes(m.status) && m.sentAt && F.daysBetween(m.sentAt.slice(0, 10), F.today()) < days);
  Q.template = (id) => TH.store.get('zaloTemplates', id) || {};
  Q.renderTemplate = (body, ctx) => body.replace(/\{(\w+)\}/g, (m, k) => ctx[k] != null ? ctx[k] : m);
  Q.templateCtx = (inv, tenant, extra = {}) => {
    const room = inv ? Q.room(inv.roomId) : (extra.room || {}); const b = Q.building(room.buildingId || extra.buildingId);
    const rem = inv ? Q.invRemaining(inv) : extra.amount || 0; const due = inv ? inv.dueDate : extra.due;
    return Object.assign({ ten_khach: tenant ? tenant.name : 'Khách hàng', toa_nha: b.name || '-', so_phong: room.code || '-', ky: inv ? F.periodLabel(inv.period) : '-', so_tien: F.vnd(rem), ngay_den_han: due ? F.date(due) : '-', con_lai: due ? (F.daysUntil(due) >= 0 ? 'còn ' + F.daysUntil(due) + ' ngày' : 'đã quá hạn ' + F.daysOverdue(due) + ' ngày') : '', qua_han: due ? 'đã quá hạn ' + F.daysOverdue(due) + ' ngày' : '', noi_dung: 'Ban quản lý sẽ bảo trì thang máy vào 09:00 – 11:00 ngày mai. Mong cư dân thông cảm.', ngay_het_han: extra.end ? F.date(extra.end) : '-', ngay_hoan: extra.paidDate ? F.date(extra.paidDate) : '-' }, extra);
  };

  /* ---- Dashboard / tổng hợp ---- */
  Q.filterRooms = (f = {}) => TH.store.where('rooms', r => (!f.buildingId || r.buildingId === f.buildingId) && (!f.district || Q.building(r.buildingId).district === f.district) && (!f.managerId || r.managerId === f.managerId));
  Q.finance = (period, f = {}) => {
    const invs = Q.invoicesOfPeriod(period).filter(i => i.docStatus !== 'draft' && (!f.buildingId || i.buildingId === f.buildingId) && (!f.district || Q.building(i.buildingId).district === f.district));
    const receivable = F.sum(invs, i => i.total), collected = F.sum(invs, i => Q.invPaid(i)); const remaining = receivable - collected;
    const overdueInv = invs.filter(i => Q.invOverdue(i)); const overdue = F.sum(overdueInv, i => Q.invRemaining(i));
    const newDeposits = TH.store.where('contracts', c => c.status !== 'cancelled' && c.status !== 'draft' && F.period(c.start) === period && (!f.buildingId || c.buildingId === f.buildingId));
    const broken = TH.store.where('refunds', r => F.period(r.requestDate) === period && r.status !== 'draft' && (!f.buildingId || r.buildingId === f.buildingId));
    return { invs, count: invs.length, receivable, collected, remaining, overdue, overdueCount: overdueInv.length, overdueInv, depositNew: F.sum(newDeposits, c => c.deposit), depositCount: newDeposits.length, penalty: F.sum(broken, r => Math.min(r.deposit, F.sum(Q.refundDeductions(r.id), d => d.amount))), penaltyCount: broken.length, pct: F.pct(collected, receivable) };
  };
  Q.todo = () => {
    const expiring = TH.store.where('contracts', c => Q.contractStatus(c) === 'expiring').length;
    const overdue = TH.store.where('invoices', i => Q.invOverdue(i)).length;
    const zaloFailed = TH.store.where('zaloMessages', m => m.status === 'failed' && !m.retried && !TH.store.one('zaloMessages', x => x.retryOfId === m.id)).length;
    const zaloFailedBatches = [...new Set(TH.store.where('zaloMessages', m => m.status === 'failed' && !m.retried).map(m => m.batchId))].length;
    const refunds = TH.store.where('refunds', r => r.status === 'pending' || r.status === 'approved').length;
    const drafts = TH.store.where('invoices', i => i.docStatus === 'draft').length;
    return { expiring, overdue, zaloFailed, zaloFailedBatches, refunds, drafts, total: expiring + overdue + zaloFailed + refunds + drafts };
  };
  Q.receivables = (f = {}) => TH.store.where('invoices', i => i.docStatus !== 'draft' && i.docStatus !== 'cancelled' && (!f.period || i.period === f.period) && (!f.buildingId || i.buildingId === f.buildingId)).map(i => ({ inv: i, remaining: Q.invRemaining(i), paid: Q.invPaid(i), overdueDays: Q.invOverdueDays(i), reminded: Q.invReminded(i.id) }));
  Q.byBuilding = (fn) => TH.store.where('buildings', b => !b.stub).map(b => ({ b, v: fn(b) }));
  Q.districts = () => [...new Set(TH.store.all('buildings').map(b => b.district))];
  Q.managers = () => TH.store.where('users', u => u.role === 'ops' || u.role === 'admin');
  Q.search = (q) => {
    q = F.norm(q).trim(); if (!q) return [];
    const out = []; const push = (type, label, sub, route) => out.length < 12 && out.push({ type, label, sub, route });
    TH.store.all('rooms').forEach(r => { if (F.norm(r.code).includes(q)) push('Phòng', r.code, Q.building(r.buildingId).name, '#/rooms/' + r.id); });
    TH.store.all('tenants').forEach(t => { if (F.norm(t.name).includes(q) || F.norm(t.code).includes(q) || t.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))) push('Khách thuê', t.name, t.code + ' · ' + t.phone, '#/tenants/' + t.id); });
    TH.store.all('contracts').forEach(c => { if (F.norm(c.code).includes(q)) push('Hợp đồng', c.code, Q.tenant(c.tenantId).name, '#/contracts/' + c.id); });
    TH.store.all('invoices').forEach(i => { if (F.norm(i.code).includes(q)) push('Hóa đơn', i.code, Q.tenant(i.tenantId).name + ' · ' + F.vnd(i.total), '#/invoices/' + i.id); });
    TH.store.where('buildings', b => !b.stub).forEach(b => { if (F.norm(b.name).includes(q) || F.norm(b.code).includes(q)) push('Tòa nhà', b.name, b.code, '#/buildings/' + b.id); });
    return out;
  };
  TH.q = Q;
})(window.TH);
