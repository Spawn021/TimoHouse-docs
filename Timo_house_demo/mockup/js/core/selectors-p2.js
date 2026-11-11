/* Selectors Phase 2: nhãn/trạng thái, KPI CRM, hoa hồng, bảo trì, kỳ, dòng tiền. Bổ sung vào TH.q (không đổi hành vi P1). */
(function (TH) {
  const F = TH.f, Q = TH.q, St = TH.store;
  const on2 = () => TH.phase && TH.phase.on(2);
  Object.assign(Q.L, {
    lead: { new: ['Mới', 'blue'], contacted: ['Đã liên hệ', 'teal'], viewing: ['Hẹn xem', 'amber'], considering: ['Cân nhắc', 'purple'], held: ['Giữ chỗ', 'orange'], won: ['Chốt thuê', 'green'], lost: ['Đã mất', 'gray'] },
    leadTemp: { hot: ['Cao', 'red'], warm: ['Trung bình', 'amber'], cold: ['Thấp', 'blue'] },
    viewing: { scheduled: ['Đã lên lịch', 'blue'], done: ['Đã xem', 'green'], cancelled: ['Hủy lịch', 'red'], no_show: ['Không đến', 'gray'] },
    viewingResult: { interested: ['Quan tâm', 'green'], considering: ['Cân nhắc', 'amber'], declined: ['Từ chối', 'red'] },
    hold: { active: ['Đang giữ', 'amber'], converted: ['Đã chuyển đổi', 'green'], expired: ['Hết hạn', 'gray'], cancelled: ['Đã hủy', 'red'] },
    deal: { pending_contract: ['Chờ ký HĐ', 'amber'], active: ['Đang thuê', 'green'], ended: ['Đã kết thúc', 'gray'] },
    dealDeposit: { unpaid: ['Chưa thu', 'red'], partial: ['Đang thu', 'amber'], paid: ['Đã thu', 'green'] },
    commission: { provisional: ['Chưa đủ', 'amber'], eligible: ['Đủ điều kiện', 'green'], paid: ['Đã chi', 'blue'] },
    ocr: { uploaded: ['Đã tải', 'gray'], extracting: ['Đang trích xuất', 'blue'], review: ['Chờ review', 'amber'], created: ['Đã tạo HĐ', 'green'] },
    incident: { new: ['Mới tạo', 'gray'], assigned: ['Đã phân công', 'blue'], in_progress: ['Đang xử lý', 'blue'], done: ['Hoàn tất', 'green'], cancelled: ['Đã hủy', 'red'], overdue: ['Quá hạn', 'red'] },
    priority: { urgent: ['Khẩn', 'red'], high: ['Cao', 'orange'], medium: ['Trung bình', 'amber'], low: ['Thấp', 'green'] },
    schedule: { scheduled: ['Đã lên lịch', 'gray'], due_soon: ['Sắp đến hạn', 'amber'], in_progress: ['Đang làm', 'blue'], done: ['Hoàn thành', 'green'], overdue: ['Quá hạn', 'red'], cancelled: ['Đã hủy', 'gray'] },
    cycle: { monthly: 'Hàng tháng', q: '3 tháng', h: '6 tháng', y: 'Hàng năm' },
    period: { open: ['Đang mở', 'green'], reconciling: ['Đối chiếu', 'amber'], locked: ['Đã khóa', 'gray'] },
    job: { running: ['Đang chạy', 'blue'], done: ['Hoàn tất', 'green'], partial: ['Hoàn tất một phần', 'amber'], failed: ['Thất bại', 'red'], needs_check: ['Cần kiểm tra', 'amber'], cancelled: ['Đã hủy', 'gray'] },
    jobLine: { ok: ['Thành công', 'green'], failed: ['Thất bại', 'red'], check: ['Cần kiểm tra', 'amber'], skipped: ['Bỏ qua', 'gray'] },
    match: { matched: ['Đã ghép', 'green'], check: ['Cần kiểm tra', 'amber'], unmatched: ['Không ghép', 'red'], duplicate: ['Trùng bỏ qua', 'gray'] },
    opening: { valid: ['Hợp lệ', 'green'], diff: ['Chênh lệch', 'red'], check: ['Cần kiểm tra', 'amber'] },
    provider: { 200: ['Thành công', 'green'], 300: ['Lỗi số Zalo', 'red'], 403: ['Từ chối mẫu', 'red'], 408: ['Đang chờ retry', 'amber'] },
    equip: { 'Thang máy': '#2563EB', 'Máy bơm': '#F59E0B', 'Máy giặt chung': '#60A5FA', 'Máy lọc nước': '#16A34A', 'PCCC': '#EF4444', 'Máy phát điện': '#7C3AED', 'Điều hòa': '#0F766E', 'Khác': '#94A3B8' },
    incCat: { 'Điện': '#2563EB', 'Nước': '#60A5FA', 'Điều hòa': '#F59E0B', 'Nội thất': '#F97316', 'Khác': '#7C3AED' },
  });
  Q.L.refund.needs_edit = ['Cần chỉnh sửa', 'orange'];
  Object.assign(Q.L.eventName, { viewing_reminder: 'Nhắc lịch xem phòng', maintenance_due: 'Bảo dưỡng định kỳ', care: 'Chăm sóc khách hàng' });
  Q.L.jobType = { tenant: 'Khách thuê', room: 'Phòng', contract: 'Hợp đồng', meter: 'Chỉ số điện nước', invoice: 'Hóa đơn', opening: 'Số dư ban đầu', statement: 'Bảng kê thu tiền', lead: 'Lead (CRM)' };

  /* ---- Giữ chỗ: hold có trạng thái (P1 hold không có status = active) ---- */
  Q.holdActive = (h) => !!h && (!h.status || h.status === 'active');
  Q.roomHold = (roomId) => St.one('holds', h => h.roomId === roomId && Q.holdActive(h));
  Q.tenantStatus = (t) => { // như P1 nhưng chỉ tính hold đang active
    const cs = Q.contractsOfTenant(t.id); const act = cs.find(c => c.status === 'active');
    if (act) return Q.contractStatus(act) === 'expiring' ? 'expiring' : 'renting';
    if (St.one('holds', h => h.tenantId === t.id && Q.holdActive(h))) return 'held';
    if (St.one('refunds', r => r.tenantId === t.id && ['draft', 'pending', 'approved', 'needs_edit'].includes(r.status))) return 'awaiting_refund';
    if (cs.some(c => c.status === 'ended')) return 'moved_out';
    return 'new';
  };
  Q.holdDaysLeft = (h) => F.daysUntil(h.until || h.expiresAt);
  Q.holdStatus = (h) => { if (h.status && h.status !== 'active') return h.status; if ((h.until || h.expiresAt) < F.today() && h.autoExpire !== false) return 'expired'; return 'active'; };

  /* ---- Lead / CRM ---- */
  Q.lead = (id) => St.get('leads', id) || {};
  Q.leadSource = (id) => St.get('leadSources', id) || {};
  Q.leadActivities = (leadId) => St.where('leadActivities', a => a.leadId === leadId).sort((a, b) => F.cmp(b.at, a.at));
  Q.leadViewings = (leadId) => St.where('viewings', v => v.leadId === leadId).sort((a, b) => F.cmp(b.date + b.time, a.date + a.time));
  Q.leadHold = (leadId) => St.one('holds', h => h.leadId === leadId && Q.holdActive(h));
  Q.leadDeal = (leadId) => St.one('deals', d => d.leadId === leadId && d.status !== 'ended') || St.one('deals', d => d.leadId === leadId);
  Q.leadLastTouch = (l) => { const a = Q.leadActivities(l.id)[0]; return a ? a.at : l.updatedAt || l.createdAt; };
  Q.leadOnBoard = (l) => l.status !== 'lost' && !(l.status === 'won' && (Q.leadDeal(l.id) || {}).status === 'active');
  Q.boardLeads = (f = {}) => St.where('leads', l => Q.leadOnBoard(l) && Q.leadMatch(l, f)).sort((a, b) => {
    const ao = Number(a.boardOrder), bo = Number(b.boardOrder);
    const av = Number.isFinite(ao) && ao > 0 ? ao : Number.MAX_SAFE_INTEGER;
    const bv = Number.isFinite(bo) && bo > 0 ? bo : Number.MAX_SAFE_INTEGER;
    return av - bv || F.cmp(a.createdAt || '', b.createdAt || '') || String(a.id).localeCompare(String(b.id));
  });
  Q.leadMatch = (l, f = {}) => (!f.s || F.norm(l.name + ' ' + l.phone + ' ' + (l.email || '') + ' ' + l.code).includes(F.norm(f.s))) && (!f.sourceId || l.sourceId === f.sourceId) && (!f.saleId || l.saleId === f.saleId) && (!f.buildingId || (l.buildingIds || []).includes(f.buildingId)) && (!f.status || l.status === f.status) && (!f.temp || l.temp === f.temp) && (!f.period || F.period(l.createdAt) === f.period);
  Q.leadsToday = () => St.where('leads', l => Q.leadOnBoard(l) && (l.temp === 'hot' || l.status === 'new' || F.daysBetween(Q.leadLastTouch(l).slice(0, 10), F.today()) >= 3)).sort((a, b) => (a.temp === 'hot' ? 0 : 1) - (b.temp === 'hot' ? 0 : 1)).slice(0, 5);
  Q.suggestRooms = (l, n = 5) => St.where('rooms', r => ['ready', 'held'].includes(r.status) && (!(l.buildingIds || []).length || l.buildingIds.includes(r.buildingId)) && (!l.budgetMax || r.price <= l.budgetMax * 1.15)).sort((a, b) => (a.status === 'ready' ? 0 : 1) - (b.status === 'ready' ? 0 : 1) || ((a.type === l.roomType ? 0 : 1) - (b.type === l.roomType ? 0 : 1)) || Math.abs(a.price - (l.budgetMax || a.price)) - Math.abs(b.price - (l.budgetMax || b.price))).slice(0, n);
  Q.salesUsers = () => St.where('users', u => u.role === 'sale' && u.status === 'active');
  Q.crmStats = (f = {}) => {
    const period = f.period === undefined ? St.state.meta.period : f.period; const inP = (iso) => !period || F.period(iso) === period;
    const leads = St.where('leads', l => Q.leadMatch(l, { sourceId: f.sourceId, saleId: f.saleId, buildingId: f.buildingId }));
    const newLeads = leads.filter(l => inP(l.createdAt));
    const viewings = St.where('viewings', v => inP(v.date) && (!f.saleId || v.saleId === f.saleId) && (!f.buildingId || v.buildingId === f.buildingId));
    const holds = St.where('holds', h => h.leadId && inP(h.start || h.createdAt) && (!f.buildingId || Q.room(h.roomId).buildingId === f.buildingId));
    const deals = St.where('deals', d => inP(d.closedAt) && (!f.saleId || d.saleId === f.saleId) && (!f.buildingId || d.buildingId === f.buildingId));
    const reached = (s) => { const order = ['new', 'contacted', 'viewing', 'considering', 'held', 'won']; const i = order.indexOf(s); return newLeads.filter(l => order.indexOf(l.status) >= i || (l.status === 'lost' && Q.leadActivities(l.id).some(a => ({ contacted: 'call', viewing: 'viewing', held: 'hold', won: 'deal' })[s] === a.type))).length; };
    const funnel = [['Lead mới', newLeads.length], ['Đã liên hệ', reached('contacted')], ['Lịch xem phòng', viewings.length], ['Giữ chỗ', holds.length], ['Chốt thuê', deals.length]];
    const bySale = Q.salesUsers().map(u => { const ls = leads.filter(l => l.saleId === u.id); const ds = St.where('deals', d => d.saleId === u.id && inP(d.closedAt)); return { user: u, leads: ls.length, viewings: viewings.filter(v => v.saleId === u.id).length, holds: holds.filter(h => Q.lead(h.leadId).saleId === u.id).length, deals: ds.length, revenue: F.sum(ds, d => d.price * (d.months || 12)), commission: F.sum(ds, d => Q.commissionOf(d).amount || 0), rate: ls.length ? Math.round(ds.length / ls.length * 1000) / 10 : 0 }; }).sort((a, b) => b.revenue - a.revenue);
    return { period, newLeads: newLeads.length, viewings: viewings.length, holds: holds.length, deals: deals.length, rate: newLeads.length ? Math.round(deals.length / newLeads.length * 1000) / 10 : 0, funnel, bySale, upcoming: St.where('viewings', v => v.status === 'scheduled' && v.date >= F.today()).sort((a, b) => F.cmp(a.date + a.time, b.date + b.time)).slice(0, 5) };
  };

  /* ---- Giao dịch / hoa hồng ---- */
  Q.deal = (id) => St.get('deals', id) || {};
  Q.commissionOf = (d) => St.one('commissions', c => c.dealId === d.id) || { amount: Math.round((d.price || 0) * 0.1), rate: 10, status: 'provisional' };
  Q.dealDepositStatus = (d) => { const paid = d.depositPaid || 0; if (!d.deposit || paid >= d.deposit) return d.deposit ? 'paid' : 'unpaid'; return paid > 0 ? 'partial' : 'unpaid'; };
  Q.commissionStatus = (d) => { const c = Q.commissionOf(d); if (c.status === 'paid') return 'paid'; const contract = d.contractId ? Q.contract(d.contractId) : null; if (d.status === 'active' && contract && contract.status === 'active' && Q.dealDepositStatus(d) === 'paid') return 'eligible'; return 'provisional'; }; // BR-13 / AC-SAL-03-1
  Q.dealStats = (f = {}) => { const period = f.period === undefined ? St.state.meta.period : f.period; const deals = St.where('deals', d => (!period || F.period(d.closedAt) === period) && (!f.saleId || d.saleId === f.saleId) && (!f.buildingId || d.buildingId === f.buildingId)); return { deals, revenue: F.sum(deals, d => d.price * (d.months || 12)), commission: F.sum(deals, d => Q.commissionOf(d).amount || 0), eligible: deals.filter(d => ['eligible', 'paid'].includes(Q.commissionStatus(d))).length }; };

  /* ---- Bảo trì ---- */
  Q.incidentOverdue = (i) => !!i.dueDate && i.dueDate < F.today() && !['done', 'cancelled'].includes(i.status);
  Q.scheduleStatus = (s) => { if (['done', 'cancelled', 'in_progress'].includes(s.status)) return s.status; if (s.date < F.today()) return 'overdue'; if (F.daysBetween(F.today(), s.date) <= 7) return 'due_soon'; return 'scheduled'; }; // BR-16 nhắc trước 7 ngày
  Q.schedulesDue = () => St.where('maintenanceSchedules', s => Q.scheduleStatus(s) === 'due_soon');
  Q.vendor = (id) => St.get('vendors', id) || {};
  Q.incidentsOfRoom = (roomId) => St.where('incidents', i => i.roomId === roomId).sort((a, b) => F.cmp(b.createdAt, a.createdAt));
  Q.maintenanceCost = (period, bId) => { const inc = St.where('incidents', i => F.period(i.doneAt || i.dueDate || i.createdAt) === period && i.status !== 'cancelled' && (!bId || i.buildingId === bId)); const by = {}; inc.forEach(i => { const k = ['Điện', 'Nước', 'Điều hòa', 'Nội thất'].includes(i.category) ? i.category : 'Khác'; by[k] = (by[k] || 0) + (i.cost || 0); }); return { total: F.sum(inc, i => i.cost || 0), by }; };

  /* ---- Kỳ & dòng tiền ---- */
  Q.periodOf = (p) => St.one('periods', x => x.period === p) || { period: p, status: 'open', checklist: {}, virtual: true };
  Q.periodLocked = (p) => on2() && Q.periodOf(p).status === 'locked';
  Q.periodChecks = (p) => { const per = Q.periodOf(p); const invs = St.where('invoices', i => i.period === p && i.docStatus !== 'cancelled'); const exps = St.where('expenses', e => F.period(e.date) === p); const jobs = St.where('importJobs', j => j.type === 'statement' && (j.period === p)); const c = per.checklist || {};
    return [{ key: 'revenue', label: 'Tổng hợp doanh thu (' + invs.filter(i => i.docStatus !== 'draft').length + '/' + invs.length + ' hóa đơn)', auto: true, autoDone: invs.length > 0 && invs.every(i => i.docStatus !== 'draft'), done: !!c.revenue || (invs.length > 0 && invs.every(i => i.docStatus !== 'draft')), at: c.revenueAt }, { key: 'expenses', label: 'Tổng hợp chi phí (' + exps.filter(e => e.evidence).length + '/' + exps.length + ' giao dịch)', auto: true, autoDone: exps.every(e => !!e.evidence), done: !!c.expenses || exps.every(e => !!e.evidence), at: c.expensesAt }, { key: 'debt', label: 'Đối chiếu công nợ', auto: true, autoDone: !jobs.some(j => (j.lines || []).some(l => l.status === 'check')), done: !!c.debt || !jobs.some(j => (j.lines || []).some(l => l.status === 'check')), at: c.debtAt }, { key: 'bank', label: 'Kiểm tra số dư ngân hàng', auto: false, done: !!c.bank, at: c.bankAt }, { key: 'review', label: 'Rà soát chi phí bất thường', auto: false, done: !!c.review, at: c.reviewAt }, { key: 'submit', label: 'Trình duyệt khóa kỳ', auto: false, done: per.status === 'locked', at: per.lockedAt }]; };
  Q.cashflow = (period, f = {}) => {
    const bOK = (bid) => !f.buildingId || bid === f.buildingId; const dOK = (bid) => !f.district || Q.building(bid).district === f.district;
    const pays = St.where('payments', p => p.status === 'recorded' && F.period(p.date) === period && bOK(p.buildingId) && dOK(p.buildingId)); // thu thật (FR-REP-02)
    const exps = St.where('expenses', e => F.period(e.date) === period && e.method !== 'depreciation' && (f.group ? e.group === f.group : true) && (!f.buildingId && !f.district ? true : (e.buildingId ? bOK(e.buildingId) && dOK(e.buildingId) : St.where('expenseAllocations', a => a.expenseId === e.id).some(a => bOK(a.buildingId) && dOK(a.buildingId))))); // khấu hao không vào dòng tiền (BR-08)
    const expAmt = (e) => (!f.buildingId && !f.district) || e.buildingId ? e.amount : F.sum(St.where('expenseAllocations', a => a.expenseId === e.id && bOK(a.buildingId) && dOK(a.buildingId)), a => a.amount);
    const days = {}; pays.forEach(p => { const d = days[p.date] = days[p.date] || { in: 0, out: 0 }; d.in += p.amount; }); exps.forEach(e => { const d = days[e.date] = days[e.date] || { in: 0, out: 0 }; d.out += expAmt(e); });
    const byGroup = {}; exps.forEach(e => byGroup[e.group] = (byGroup[e.group] || 0) + expAmt(e));
    const invs = Q.invoicesOfPeriod(period).filter(i => i.docStatus !== 'draft' && bOK(i.buildingId) && dOK(i.buildingId)); const onTime = invs.filter(i => { const ps = Q.paymentsOfInvoice(i.id); return Q.invPayStatus(i) === 'paid' && ps.every(x => x.payment.date <= i.dueDate); }).length;
    const deposits = F.sum(pays.filter(p => p.kind === 'deposit' || p.kind === 'hold_fee'), p => p.amount);
    return { pays, exps, income: F.sum(pays, p => p.amount), expense: F.sum(exps, expAmt), days, byGroup, invCount: invs.length, onTime, deposits, expAmt };
  };
  Q.cashflowByBuilding = (period) => St.where('buildings', b => !b.stub).map(b => { const x = Q.cashflow(period, { buildingId: b.id }); const pct = x.invCount ? Math.round(x.onTime / x.invCount * 100) : 0; return { b, income: x.income, expense: x.expense, net: x.income - x.expense, pct, grade: pct >= 80 ? 'Tốt' : pct >= 70 ? 'Khá' : 'Cần cải thiện' }; });
  Q.operatingResult = (period, f = {}) => { const cf = Q.cashflow(period, f); const invs = Q.invoicesOfPeriod(period).filter(i => i.docStatus !== 'draft' && (!f.buildingId || i.buildingId === f.buildingId)); const revenue = F.sum(invs, i => i.total); const opex = F.sum(cf.exps.filter(e => e.recordType !== 'asset'), cf.expAmt); const dep = F.sum(St.where('expenses', e => e.method === 'depreciation' && (!f.buildingId || e.buildingId === f.buildingId)), e => Q.depreciationMonthly(e, period)); return { revenue, opex, dep, result: revenue - opex - dep, invCount: invs.length }; }; // BR-10: loại cọc/hoàn cọc/mua thiết bị, khấu hao theo tháng
  Q.depreciationMonthly = (e, period) => { const m = e.depreciationMonths || 36; const start = F.period(e.date); if (!period || period < start) return 0; const [y0, m0] = start.split('-').map(Number), [y1, m1] = period.split('-').map(Number); const idx = (y1 - y0) * 12 + (m1 - m0); return idx < m ? Math.round(e.amount / m) : 0; };
  Q.depreciationSchedule = (e) => { const m = e.depreciationMonths || 36; const out = []; for (let i = 0; i < m; i++) { const p = F.period(F.addMonths(e.date, i)); out.push({ seq: i + 1, period: p, amount: Math.round(e.amount / m), remaining: e.amount - Math.round(e.amount / m) * (i + 1) }); } return out; }; // đường thẳng (OI-11)
  Q.occupancy = (period, bId) => { const rooms = Q.filterRooms({ buildingId: bId }); const b = Q.building(bId); if (b.status === 'maintenance' || b.status === 'inactive') return { na: true, pct: null, rooms: rooms.length }; const [y, m] = period.split('-').map(Number); const dim = new Date(y, m, 0).getDate(); const first = period + '-01', last = period + '-' + F.pad(dim); let occ = 0; rooms.forEach(rm => St.where('contracts', c => c.roomId === rm.id && c.status !== 'draft' && c.status !== 'cancelled' && c.start <= last && (c.actualEnd || c.end) >= first).forEach(c => { const s = c.start > first ? c.start : first, e = (c.actualEnd || c.end) < last ? (c.actualEnd || c.end) : last; occ += Math.max(0, F.daysBetween(s, e) + 1); })); return { na: false, pct: rooms.length ? Math.round(occ / (rooms.length * dim) * 1000) / 10 : 0, rooms: rooms.length, days: occ, total: rooms.length * dim }; }; // BR-09 ngày có khách / ngày kỳ (tạm tính, OI-12)

  /* ---- Data Job / Zalo ---- */
  Q.job = (id) => St.get('importJobs', id) || {};
  Q.jobProgress = (j) => j.progress != null ? j.progress : 100;
  Q.providerOf = (m) => m.providerCode || ({ 'ZLM-1001': '300', 'ZLM-2003': '403', 'ZLM-4008': '408', 'ZLM-3005': '408' }[m.errorCode] || (m.status === 'delivered' || m.status === 'accepted' ? '200' : m.status === 'failed' ? '300' : ''));
  Q.providerMsg = (code) => ({ 200: 'OK', 300: 'Số không tồn tại', 403: 'Template rejected', 408: 'Timeout' })[code] || '';
  Q.msgRetryWait = (m) => m.status === 'failed' && Q.providerOf(m) === '408' && !m.retried && !St.one('zaloMessages', x => x.retryOfId === m.id);
  Q.batchProviderStats = (bId) => { const s = { 200: 0, 300: 0, 403: 0, 408: 0, other: 0 }; Q.batchMessages(bId).forEach(m => { if (m.retried) return; const c = Q.providerOf(m); if (m.status === 'skipped') return; if (s[c] != null) s[c]++; else if (m.status === 'failed' || m.status === 'unknown') s.other++; }); return s; };

  /* ---- Việc cần xử lý (chuông) ---- */
  const todoP1 = Q.todo;
  Q.todo = () => { const t = todoP1(); if (!on2()) return t; t.maintenanceDue = Q.schedulesDue().length; t.viewingsToday = St.where('viewings', v => v.status === 'scheduled' && v.date === F.today()).length; t.total += t.maintenanceDue + t.viewingsToday; return t; };
  /* ---- Tìm kiếm: thêm lead khi P2 bật ---- */
  const searchP1 = Q.search;
  Q.search = (q) => { const out = searchP1(q); if (!on2()) return out; const n = F.norm(q).trim(); if (!n) return out; St.all('leads').forEach(l => { if (out.length < 12 && (F.norm(l.name).includes(n) || l.phone.replace(/\s/g, '').includes(n.replace(/\s/g, '')) || F.norm(l.code).includes(n))) out.push({ type: 'Lead', label: l.name, sub: l.code + ' · ' + Q.label('lead', l.status), route: '#/crm/leads/' + l.id }); }); return out; };
  Q.deposits = () => { const rows = []; St.where('contracts', c => c.status === 'active').forEach(c => rows.push({ kind: 'deposit', label: 'Cọc hợp đồng', tenantId: c.tenantId, roomId: c.roomId, amount: c.deposit, date: c.start, status: 'holding', ref: c.code, href: '#/contracts/' + c.id })); St.where('holds', h => Q.holdActive(h)).forEach(h => rows.push({ kind: 'hold', label: 'Phí giữ chỗ', tenantId: h.tenantId, roomId: h.roomId, amount: h.fee || h.deposit || 0, date: h.start || h.createdAt, status: 'holding', ref: h.code || '-', href: '#/crm/holds' })); St.all('refunds').forEach(rf => rows.push({ kind: 'refund', label: 'Hoàn cọc', tenantId: rf.tenantId, roomId: rf.roomId, amount: rf.refundAmount, date: rf.paidDate || rf.requestDate, status: rf.status === 'refunded' ? 'refunded' : 'pending_refund', ref: rf.code, href: '#/refunds/' + rf.id })); return rows.sort((a, b) => F.cmp(b.date || '', a.date || '')); };
})(window.TH);
