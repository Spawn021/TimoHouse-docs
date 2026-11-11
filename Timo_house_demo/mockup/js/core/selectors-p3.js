/* Selectors Phase 3: nhãn/trạng thái, KPI tài sản/kiểm kê, nhân sự/KPI cá nhân, chấm công/lương, cổ đông/vốn góp/phân phối, ROI, ngân hàng. Bổ sung vào TH.q (không đổi hành vi P1/P2). */
(function (TH) {
  const F = TH.f, Q = TH.q, St = TH.store;
  const on3 = () => TH.phase && TH.phase.on(3);
  Object.assign(Q.L, {
    assetCond: { good: ['Bình thường', 'green'], minor: ['Hư hỏng nhẹ', 'amber'], replace: ['Cần thay thế', 'red'], broken: ['Hỏng', 'red'], lost: ['Mất', 'gray'] },
    asset: { active: ['Đang sử dụng', 'green'], disposed: ['Đã thanh lý', 'gray'] },
    assetCat: { dienlanh: ['Điện lạnh', '#0F766E'], pccc: ['PCCC', '#EF4444'], thangmay: ['Thang máy', '#2563EB'], chieusang: ['Chiếu sáng', '#F59E0B'], anninh: ['An ninh', '#7C3AED'], noithat: ['Nội thất', '#F97316'], dien: ['Điện – kỹ thuật', '#0EA5E9'], mayphat: ['Máy phát', '#64748B'], khac: ['Khác', '#94A3B8'] },
    ownership: { company: 'Công ty đầu tư', landlord: 'Chủ nhà' },
    inventory: { in_progress: ['Đang kiểm kê', 'blue'], done: ['Đã hoàn thành', 'green'] },
    invLine: { pending: ['Chưa kiểm kê', 'gray'], done: ['Hoàn thành', 'green'], needs_action: ['Cần xử lý', 'orange'] },
    employee: { probation: ['Thử việc', 'blue'], working: ['Đang làm việc', 'green'], leave: ['Tạm nghỉ', 'amber'], resigned: ['Nghỉ việc', 'gray'] },
    dept: { vanhanh: ['Vận hành', '#2563EB'], baotri: ['Bảo trì', '#60A5FA'], kinhdoanh: ['Kinh doanh', '#F97316'], taichinh: ['Tài chính', '#F59E0B'], cskh: ['Chăm sóc KH', '#7C3AED'], hanhchinh: ['Hành chính', '#16A34A'], thitruong: ['Thị trường', '#0F766E'], khac: ['Khác', '#94A3B8'] },
    title: { 'Quản lý khu vực': 'Quản lý khu vực', 'Trưởng nhóm': 'Trưởng nhóm', 'Kỹ thuật viên': 'Kỹ thuật viên', 'Nhân viên kinh doanh': 'Nhân viên kinh doanh', 'Nhân viên': 'Nhân viên' },
    assignRole: { lead: ['Trưởng nhóm / phụ trách', 'blue'], ops: ['NV vận hành', 'teal'], cleaning: ['NV vệ sinh', 'gray'], tech: ['NV kỹ thuật', 'orange'] },
    assignment: { active: ['Đang phụ trách', 'green'], ended: ['Đã kết thúc', 'gray'] },
    timesheet: { draft: ['Nháp', 'gray'], confirmed: ['Đã xác nhận', 'green'] },
    attCode: { P: ['Đi làm', 'green'], H: ['Nửa ngày', 'teal'], L: ['Nghỉ phép', 'amber'], A: ['Vắng', 'red'], O: ['Nghỉ tuần/lễ', 'gray'] },
    payroll: { draft: ['Nháp', 'gray'], review: ['Chờ duyệt', 'amber'], approved: ['Đã duyệt', 'blue'], paid: ['Đã chi', 'green'] },
    project: { raising: ['Gọi vốn', 'amber'], operating: ['Đang vận hành', 'green'], closed: ['Đã đóng', 'gray'] },
    shareholder: { paid: ['Đã góp đủ', 'green'], missing: ['Còn thiếu', 'red'], none: ['Chưa góp', 'gray'] },
    contribution: { scheduled: ['Chưa đến hạn', 'blue'], due: ['Đến hạn', 'red'], overdue: ['Quá hạn', 'red'], partial: ['Góp một phần', 'amber'], paid: ['Đã góp', 'green'] },
    contribKind: { capital: 'Góp vốn cam kết', periodic: 'Đóng góp định kỳ' },
    distribution: { planned: ['Chờ phân phối', 'amber'], processing: ['Đang xử lý', 'blue'], approved: ['Đã duyệt', 'teal'], paid: ['Đã chi', 'green'] },
    bankTx: { matched: ['Đã khớp', 'green'], check: ['Cần kiểm tra', 'amber'], unmatched: ['Chưa khớp', 'red'], ignored: ['Bỏ qua', 'gray'] },
    roiTone: { good: ['Tốt', 'green'], fair: ['Khá', 'amber'], poor: ['Cần cải thiện', 'red'] },
  });
  Q.L.role.hr = Q.L.role.hr || ['Nhân sự', 'teal']; Q.L.role.codong = Q.L.role.codong || ['Cổ đông', 'blue'];
  Q.deptLabel = (k) => (Q.L.dept[k] || [k])[0]; Q.deptColor = (k) => (Q.L.dept[k] || ['', '#94A3B8'])[1];
  Q.assetCatLabel = (k) => (Q.L.assetCat[k] || [k])[0]; Q.assetCatColor = (k) => (Q.L.assetCat[k] || ['', '#94A3B8'])[1];

  /* ---- Tài sản ---- */
  Q.asset = (id) => St.get('assets', id) || {};
  Q.assetLabel = (a) => a.code + ' – ' + a.name;
  Q.assetRemaining = (a, period) => { // giá trị còn lại theo đường thẳng (OI-11 – tạm tính)
    if (!a.cost) return 0; const m = a.depMonths || 36; const start = F.period(a.startDate); const p = period || F.today().slice(0, 7); if (!start || p < start) return a.cost;
    const used = (Number(p.slice(0, 4)) - Number(start.slice(0, 4))) * 12 + Number(p.slice(5, 7)) - Number(start.slice(5, 7)) + 1; return Math.max(0, Math.round(a.cost * (1 - Math.min(m, used) / m)));
  };
  Q.assetStats = (f = {}) => {
    const rows = Q.filterAssets(f); const active = rows.filter(a => a.status === 'active');
    return { total: active.length, cost: F.sum(active, a => a.cost || 0), remaining: F.sum(active, a => Q.assetRemaining(a)), bad: active.filter(a => ['replace', 'broken', 'lost'].includes(a.condition)).length, minor: active.filter(a => a.condition === 'minor').length, buildings: [...new Set(active.map(a => a.buildingId))].length, byCat: Object.keys(Q.L.assetCat).map(k => ({ key: k, label: Q.assetCatLabel(k), color: Q.assetCatColor(k), value: active.filter(a => a.category === k).length })).filter(x => x.value), byBuilding: St.where('buildings', b => !b.stub).map(b => ({ label: b.name.replace('Tòa ', ''), value: active.filter(a => a.buildingId === b.id).length })) };
  };
  Q.filterAssets = (f = {}) => St.where('assets', a => (!f.buildingId || a.buildingId === f.buildingId) && (!f.roomId || a.roomId === f.roomId) && (!f.category || a.category === f.category) && (!f.condition || a.condition === f.condition) && (!f.ownership || a.ownership === f.ownership) && (f.status ? a.status === f.status : true) && (!f.s || F.norm(a.code + ' ' + a.name + ' ' + (a.area || '')).includes(F.norm(f.s))));
  Q.assetInventoryLine = (assetId, inventoryId) => St.one('inventoryLines', l => l.assetId === assetId && (!inventoryId || l.inventoryId === inventoryId));
  Q.assetLastLine = (assetId) => St.where('inventoryLines', l => l.assetId === assetId && l.status !== 'pending').sort((a, b) => F.cmp(b.checkedAt || '', a.checkedAt || ''))[0] || null;
  /* ---- Kiểm kê ---- */
  Q.inventory = (id) => St.get('inventories', id) || {};
  Q.inventoryOf = (period) => St.where('inventories', i => i.period === period).sort((a, b) => F.cmp(b.createdAt, a.createdAt))[0] || null;
  Q.latestInventory = () => St.all('inventories').slice().sort((a, b) => F.cmp(b.period, a.period) || F.cmp(b.createdAt, a.createdAt))[0] || null;
  Q.inventoryLines = (inv, f = {}) => { if (!inv) return []; return St.where('inventoryLines', l => l.inventoryId === inv.id).map(l => ({ line: l, asset: Q.asset(l.assetId) })).filter(x => x.asset.id && (!f.buildingId || x.asset.buildingId === f.buildingId) && (!f.area || (x.asset.roomId ? 'room' : 'common') === f.area) && (!f.category || x.asset.category === f.category) && (!f.status || x.line.status === f.status) && (!f.s || F.norm(x.asset.code + ' ' + x.asset.name + ' ' + (x.line.checkedBy || '')).includes(F.norm(f.s)))); };
  Q.inventoryStats = (inv) => { const ls = inv ? St.where('inventoryLines', l => l.inventoryId === inv.id) : []; const checked = ls.filter(l => l.status !== 'pending'); return { total: ls.length, checked: checked.length, needsAction: ls.filter(l => l.status === 'needs_action').length, broken: ls.filter(l => ['replace', 'broken', 'lost'].includes(l.condition)).length, pending: ls.length - checked.length, buildings: inv ? (inv.buildingIds || []).length : 0 }; };
  Q.inventoryPeriods = () => [...new Set(St.all('inventories').map(i => i.period).concat([F.today().slice(0, 7), F.period(F.addMonths(F.today(), 1))]))].sort().reverse();

  /* ---- Nhân sự ---- */
  Q.employee = (id) => St.get('employees', id) || {};
  Q.employeeName = (id) => (St.get('employees', id) || {}).name || '-';
  Q.employeeByUser = (userId) => St.one('employees', e => e.userId === userId);
  Q.assignmentsOf = (empId, activeOnly = true) => St.where('buildingAssignments', a => a.employeeId === empId && (!activeOnly || a.status === 'active')).sort((a, b) => (b.primary - a.primary) || F.cmp(a.start, b.start));
  Q.primaryBuilding = (empId) => { const a = Q.assignmentsOf(empId).find(x => x.primary) || Q.assignmentsOf(empId)[0]; return a ? Q.building(a.buildingId) : {}; };
  Q.buildingStaff = (buildingId) => St.where('buildingAssignments', a => a.buildingId === buildingId && a.status === 'active').map(a => ({ a, e: Q.employee(a.employeeId) }));
  Q.filterEmployees = (f = {}) => St.where('employees', e => (f.status ? e.status === f.status : e.status !== 'resigned' || f.includeResigned) && (!f.dept || e.dept === f.dept) && (!f.title || e.title === f.title) && (!f.area || e.area === f.area) && (!f.buildingId || Q.assignmentsOf(e.id).some(a => a.buildingId === f.buildingId)) && (!f.s || F.norm(e.code + ' ' + e.name + ' ' + e.phone + ' ' + (e.email || '')).includes(F.norm(f.s)))).sort((a, b) => F.cmp(a.code, b.code));
  Q.employeeStats = () => { const all = St.where('employees', e => e.status !== 'resigned'); const working = all.filter(e => ['working', 'probation'].includes(e.status)); return { total: all.length, working: working.length, leave: all.filter(e => e.status === 'leave').length, probation: all.filter(e => e.status === 'probation').length, managers: all.filter(e => e.title === 'Quản lý khu vực').length, areas: [...new Set(all.filter(e => e.title === 'Quản lý khu vực').map(e => e.area))].length, byDept: Object.keys(Q.L.dept).map(k => ({ key: k, label: Q.deptLabel(k), color: Q.deptColor(k), value: all.filter(e => e.dept === k).length })).filter(x => x.value) }; };
  Q.probationEnding = (days = 30) => St.where('employees', e => e.status !== 'resigned' && e.probationEnd && F.daysUntil(e.probationEnd) <= days && F.daysUntil(e.probationEnd) >= -30).map(e => ({ e, left: F.daysUntil(e.probationEnd) })).sort((a, b) => a.left - b.left);
  Q.seniority = (start) => { if (!start) return ''; const m = Math.max(0, F.monthsDiff(start, F.today())); const y = Math.floor(m / 12), mm = m % 12; return (y ? y + ' năm ' : '') + (mm ? mm + ' tháng' : (y ? '' : 'dưới 1 tháng')); };
  /* KPI cá nhân tính thật từ dữ liệu CRM P2 theo userId (số PNG chỉ là ví dụ) */
  Q.employeeKpi = (e, period) => {
    period = period || St.state.meta.period; const uid = e.userId; if (!uid) return { leads: 0, deals: 0, revenue: 0, rate: 0, openLeads: 0, contracts: 0, hasUser: false };
    const inP = (iso) => !period || F.period(iso) === period;
    const leads = St.where('leads', l => l.saleId === uid); const acted = St.where('leadActivities', a => a.by === uid && inP(a.at)); const leadsP = [...new Set(acted.map(a => a.leadId).concat(leads.filter(l => inP(l.createdAt)).map(l => l.id)))];
    const deals = St.where('deals', d => d.saleId === uid && inP(d.closedAt)); const contracts = St.where('contracts', c => c.managerId === uid && inP(c.createdAt || c.start));
    const incidents = St.where('incidents', i => i.assigneeId === uid && inP(i.doneAt || i.createdAt));
    return { hasUser: true, leads: leadsP.length, openLeads: leads.filter(l => !['won', 'lost'].includes(l.status)).length, deals: deals.length, revenue: F.sum(deals, d => (d.price || 0) * (d.months || 12)), rate: leadsP.length ? Math.round(deals.length / leadsP.length * 100) : 0, contracts: contracts.length + deals.filter(d => d.contractId).length, incidents: incidents.length, incidentsDone: incidents.filter(i => i.status === 'done').length };
  };
  Q.employeeActivities = (e, n = 6) => {
    const uid = e.userId; const out = [];
    (e.history || []).forEach(h => out.push({ at: h.at, title: h.type === 'join' ? 'Vào làm' : h.type === 'status' ? 'Đổi trạng thái' : h.type === 'assign' ? 'Phân công tòa' : 'Cập nhật hồ sơ', sub: h.text, icon: h.type === 'assign' ? 'building' : 'user', color: 'blue' }));
    if (uid) { St.where('auditLog', l => l.userId === uid).slice(0, 12).forEach(l => out.push({ at: l.at, title: ({ create: 'Tạo mới', save: 'Cập nhật', login: 'Đăng nhập', impersonate: 'Chuyển vai trò', import: 'Import dữ liệu' })[l.action] || l.action, sub: l.summary, icon: l.entityType === 'contract' ? 'file-text' : l.entityType === 'tenant' ? 'users' : 'activity', color: l.action === 'create' ? 'green' : 'blue' }));
      St.where('leadActivities', a => a.by === uid).slice(0, 8).forEach(a => out.push({ at: a.at, title: ({ call: 'Gọi khách hàng', note: 'Ghi chú lead', viewing: 'Đặt lịch xem phòng', hold: 'Giữ chỗ', deal: 'Chốt thuê' })[a.type] || 'Hoạt động CRM', sub: (Q.lead(a.leadId).name || '') + (a.note ? ' – ' + a.note : ''), icon: a.type === 'viewing' ? 'home' : a.type === 'deal' ? 'check-circle' : 'phone', color: a.type === 'deal' ? 'green' : 'amber' }));
      St.where('deals', d => d.saleId === uid).slice(0, 5).forEach(d => out.push({ at: d.closedAt || d.createdAt, title: 'Chốt thuê ' + d.code, sub: (Q.tenant(d.tenantId).name || '') + ' – ' + (Q.building(d.buildingId).name || ''), icon: 'file-text', color: 'green' })); }
    return out.filter(x => x.at).sort((a, b) => F.cmp(b.at, a.at)).slice(0, n);
  };
  Q.employeeWeek = (e) => { // lịch tuần: lịch xem phòng (sale), lịch bảo dưỡng/sự cố (kỹ thuật), họp mặc định
    const uid = e.userId; const today = F.today(); const dow = new Date(today + 'T00:00').getDay() || 7; const mon = F.addDays(today, 1 - dow); const days = [1, 2, 3, 4, 5].map(i => F.addDays(mon, i - 1));
    const items = [];
    if (uid) { St.where('viewings', v => v.saleId === uid && v.date >= days[0] && v.date <= days[4]).forEach(v => items.push({ date: v.date, time: (v.time || '09:00') + ' - ' + (v.time ? F.pad(Number(v.time.slice(0, 2)) + 2) + v.time.slice(2) : '11:00'), title: 'Xem phòng khách hàng', place: Q.building(Q.room(v.roomId).buildingId).name || v.place || '', color: 'blue' }));
      St.where('maintenanceSchedules', s => s.assigneeId === uid && s.date >= days[0] && s.date <= days[4]).forEach(s => items.push({ date: s.date, time: '09:00 - 12:00', title: s.item, place: Q.building(s.buildingId).name || '', color: 'amber' }));
      St.where('incidents', i => i.assigneeId === uid && i.dueDate >= days[0] && i.dueDate <= days[4] && i.status !== 'done').forEach(i => items.push({ date: i.dueDate, time: '14:00 - 16:00', title: 'Xử lý sự cố ' + i.code, place: Q.building(i.buildingId).name || '', color: 'red' })); }
    const fixed = [[0, '09:00 - 11:00', e.dept === 'kinhdoanh' ? 'Xem phòng khách hàng' : 'Kiểm tra tòa nhà', Q.primaryBuilding(e.id).name || 'Văn phòng', 'blue'], [1, '13:30 - 15:00', 'Họp phòng ' + Q.deptLabel(e.dept).toLowerCase(), 'Phòng họp tầng 2', 'green'], [2, '09:00 - 12:00', 'Khảo sát tòa ' + ((Q.assignmentsOf(e.id)[1] && Q.building(Q.assignmentsOf(e.id)[1].buildingId).name) || 'Moonlight').replace('Tòa ', ''), (Q.assignmentsOf(e.id)[1] && Q.building(Q.assignmentsOf(e.id)[1].buildingId).name) || 'Tòa Moonlight', 'amber'], [3, '14:00 - 16:00', e.dept === 'kinhdoanh' ? 'Tư vấn khách hàng' : 'Đào tạo nội bộ', e.dept === 'kinhdoanh' ? 'Online qua Zalo' : 'Phòng họp tầng 2', 'purple'], [4, '09:00 - 11:00', 'Báo cáo tuần', 'Phòng họp tầng 2', 'teal']];
    fixed.forEach(([i, time, title, place, color]) => { if (!items.some(x => x.date === days[i])) items.push({ date: days[i], time, title, place, color }); });
    return days.map(dt => ({ date: dt, items: items.filter(x => x.date === dt).sort((a, b) => F.cmp(a.time, b.time)) }));
  };
  /* ---- Chấm công / lương ---- */
  Q.timesheet = (empId, period) => St.one('timesheets', t => t.employeeId === empId && t.period === period);
  Q.workDaysStd = (period) => { const [y, m] = period.split('-').map(Number); const n = new Date(y, m, 0).getDate(); let w = 0; for (let d = 1; d <= n; d++) if (new Date(y, m - 1, d).getDay() !== 0) w++; return w; };
  Q.timesheetStats = (period, f = {}) => { const emps = Q.filterEmployees(f); const sheets = emps.map(e => Q.timesheet(e.id, period)).filter(Boolean); const today = F.today(); const todayIn = F.period(today) === period; return { std: Q.workDaysStd(period), present: todayIn ? sheets.filter(t => ['P', 'H'].includes((t.days || {})[today])).length : Math.round(F.sum(sheets, t => t.workDays) / Math.max(1, sheets.length)), leave: F.sum(sheets, t => t.offDays), late: F.sum(sheets, t => t.late), ot: F.sum(sheets, t => t.otHours), confirmed: sheets.length && sheets.every(t => t.status === 'confirmed'), count: sheets.length }; };
  Q.payroll = (period) => St.one('payrolls', p => p.period === period);
  Q.payrollPeriods = () => [...new Set(St.all('payrolls').map(p => p.period).concat(St.all('timesheets').map(t => t.period)).concat([St.state.meta.period]))].sort().reverse();
  Q.payrollStats = (p) => { const ls = (p && p.lines) || []; return { total: F.sum(ls, l => l.total), base: F.sum(ls, l => l.base), allow: F.sum(ls, l => l.titleAllowance + l.buildingAllowance), commission: F.sum(ls, l => l.commission), deductions: F.sum(ls, l => l.deductions), count: ls.length }; };
  Q.payrollByBuilding = (p) => { const by = {}; ((p && p.lines) || []).forEach(l => { const as = Q.assignmentsOf(l.employeeId); const ids = as.length ? as.map(a => a.buildingId) : ['']; ids.forEach(id => { by[id] = (by[id] || 0) + Math.round(l.total / ids.length); }); }); return Object.entries(by).map(([id, v]) => ({ label: id ? (Q.building(id).name || '').replace('Tòa ', '') : 'Chung', value: v })).sort((a, b) => b.value - a.value); };

  /* ---- Dự án / cổ đông / vốn góp / phân phối ---- */
  Q.project = (id) => St.get('projects', id) || {};
  Q.shareholder = (id) => St.get('shareholders', id) || {};
  Q.myShareholder = () => { const u = TH.auth.user(); return u ? St.one('shareholders', s => s.userId === u.id) : null; };
  Q.commitmentsOf = (shId, projectId) => St.where('capitalCommitments', c => c.shareholderId === shId && (!projectId || c.projectId === projectId));
  Q.contributionStatus = (c) => { if (c.status === 'paid') return 'paid'; if ((c.paidAmount || 0) > 0 && c.paidAmount < c.amount) return 'partial'; if (c.dueDate < F.today()) return 'overdue'; if (c.dueDate === F.today()) return 'due'; return 'scheduled'; };
  Q.contributionDays = (c) => F.daysUntil(c.dueDate);
  Q.totalCapital = (projectId) => projectId ? (Q.project(projectId).capital || 0) : F.sum(St.all('projects'), p => p.capital || 0);
  Q.shareholderRow = (s, projectId, dist) => {
    const cms = Q.commitmentsOf(s.id, projectId); const cs = St.where('contributions', c => c.shareholderId === s.id && c.kind === 'capital' && (!projectId || c.projectId === projectId));
    const committed = F.sum(cms, c => c.committed); const paid = F.sum(cs, c => c.paidAmount || 0); const missing = F.sum(cs.filter(c => ['due', 'overdue', 'partial'].includes(Q.contributionStatus(c)) || (Q.contributionStatus(c) === 'scheduled' && F.daysUntil(c.dueDate) <= 7)), c => c.amount - (c.paidAmount || 0));
    const total = Q.totalCapital(projectId); const ratio = projectId ? F.sum(cms, c => c.ratio) : (total ? Math.round(F.sum(cms, c => c.committed) / total * 10000) / 100 : 0);
    const line = dist ? (dist.lines || []).find(l => l.shareholderId === s.id) : null; const share = line ? line.amount : (dist ? Math.round((dist.profit || 0) * ratio / 100) : 0);
    return { s, ratio, committed, paid, missing, share, status: !cms.length ? 'none' : missing > 0 ? 'missing' : paid >= committed ? 'paid' : (paid > 0 ? 'missing' : 'none'), projects: cms.map(c => Q.project(c.projectId)) };
  };
  Q.currentDistribution = () => St.where('distributions', d => ['processing', 'approved'].includes(d.status)).sort((a, b) => F.cmp(a.date, b.date))[0] || St.where('distributions', d => d.status === 'planned').sort((a, b) => F.cmp(a.date, b.date))[0] || null;
  Q.shareholderRows = (f = {}) => { const dist = Q.currentDistribution(); let rows = St.all('shareholders').filter(s => s.status !== 'inactive').map(s => Q.shareholderRow(s, f.projectId, dist)); if (f.projectId) rows = rows.filter(r => r.committed > 0); if (f.s) rows = rows.filter(r => F.norm(r.s.name + ' ' + (r.s.email || '') + ' ' + (r.s.phone || '')).includes(F.norm(f.s))); if (f.status) rows = rows.filter(r => r.status === f.status); return rows.sort((a, b) => b.ratio - a.ratio || F.cmp(a.s.code, b.s.code)); };
  Q.shareholderStats = (f = {}) => { const rows = Q.shareholderRows({ projectId: f.projectId }); const dist = Q.currentDistribution(); const paidDist = F.sum(St.where('distributions', d => d.status === 'paid'), d => d.profit); const plan = dist ? dist.profit : 0; return { count: rows.length, committed: F.sum(rows, r => r.committed), paid: F.sum(rows, r => r.paid), missing: F.sum(rows, r => r.missing), capital: Q.totalCapital(f.projectId), profit: dist ? dist.profit : 0, profitLabel: dist ? dist.label : '', distributed: paidDist, planPct: plan ? Math.min(100, Math.round(paidDist / plan * 100)) : 0, byStatus: { paid: rows.filter(r => r.status === 'paid').length, missing: rows.filter(r => r.status === 'missing').length, none: rows.filter(r => r.status === 'none').length }, dist }; };
  Q.capitalStructure = (projectId) => { const rows = Q.shareholderRows({ projectId }).sort((a, b) => b.committed - a.committed); const top = rows.slice(0, 5); const rest = rows.slice(5); const colors = ['#2563EB', '#60A5FA', '#F59E0B', '#F97316', '#7C3AED', '#94A3B8']; const items = top.map((r, i) => ({ label: r.s.name, value: r.committed, color: colors[i], text: r.ratio + '%' })); if (rest.length) items.push({ label: 'Khác (' + rest.length + ' cổ đông)', value: F.sum(rest, r => r.committed), color: colors[5], text: Math.round(F.sum(rest, r => r.ratio) * 100) / 100 + '%' }); return items; };
  Q.contributions = (f = {}) => St.where('contributions', c => (!f.projectId || c.projectId === f.projectId) && (!f.shareholderId || c.shareholderId === f.shareholderId) && (!f.kind || c.kind === f.kind) && (!f.status || Q.contributionStatus(c) === f.status) && (!f.s || F.norm(c.code + ' ' + Q.shareholder(c.shareholderId).name + ' ' + Q.project(c.projectId).name).includes(F.norm(f.s)))).map(c => Object.assign({}, c, { st: Q.contributionStatus(c) })).sort((a, b) => F.cmp(a.dueDate, b.dueDate));
  Q.upcomingContributions = (n = 4) => { const seen = new Set(); return Q.contributions().filter(c => c.st !== 'paid').sort((a, b) => F.cmp(a.dueDate, b.dueDate) || b.amount - a.amount).filter(c => { const k = c.projectId + '|' + c.dueDate + '|' + c.kind; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, n); }; // 1 dòng/đợt (đợt định kỳ gom theo dự án)
  Q.upcomingDistributions = (n = 4) => St.where('distributions', d => d.status !== 'paid').sort((a, b) => F.cmp(a.date, b.date)).slice(0, n);
  Q.contributionStats = () => { const cs = Q.contributions(); return { due: cs.filter(c => ['due', 'overdue'].includes(c.st)).length, overdue: cs.filter(c => c.st === 'overdue').length, paidPeriod: F.sum(cs.filter(c => c.st === 'paid' && F.period(c.paidDate || '') === St.state.meta.period), c => c.paidAmount), missing: F.sum(cs.filter(c => c.st !== 'paid'), c => c.amount - (c.paidAmount || 0)) }; };
  Q.distributionLines = (dist) => (dist.lines || []).map(l => Object.assign({}, l, { s: Q.shareholder(l.shareholderId) }));
  Q.projectRow = (p) => { const cms = St.where('capitalCommitments', c => c.projectId === p.id); const cs = St.where('contributions', c => c.projectId === p.id && c.kind === 'capital'); const paid = F.sum(cs, c => c.paidAmount || 0); return { p, b: Q.building(p.buildingId), shareholders: cms.length, ratio: Math.round(F.sum(cms, c => c.ratio) * 100) / 100, committed: F.sum(cms, c => c.committed), paid, pct: p.capital ? Math.min(100, Math.round(paid / p.capital * 100)) : 0, assets: St.where('assets', a => a.buildingId === p.buildingId && a.status === 'active').length, roi: Q.buildingRoi(p.buildingId) }; };
  /* ROI tạm tính theo tòa: vốn = vốn điều lệ dự án + nguyên giá tài sản; doanh thu = thu thật kỳ; chi = chi phí kỳ + khấu hao (OI-10/12/13/17) */
  Q.buildingRoi = (buildingId, period) => {
    period = period || St.state.meta.period; const p = St.one('projects', x => x.buildingId === buildingId); const capital = (p ? p.capital : 0) + F.sum(St.where('assets', a => a.buildingId === buildingId && a.status === 'active'), a => a.cost || 0);
    const cf = Q.cashflow ? Q.cashflow(period, { buildingId }) : { income: 0, expense: 0 }; const income = cf.income != null ? cf.income : (cf.collected || 0); const expense = cf.expense != null ? cf.expense : (cf.spent || 0);
    const dep = F.sum(St.where('assets', a => a.buildingId === buildingId && a.status === 'active' && a.cost && a.depMonths && F.period(a.startDate) <= period && Q.assetRemaining(a, period) > 0), a => Math.round(a.cost / a.depMonths));
    const profit = income - expense - dep; const roi = capital ? Math.round(profit * 12 / capital * 1000) / 10 : 0; const occ = Q.occupancy ? Q.occupancy(period, buildingId) : null;
    return { capital, income, expense, dep, profit, roi, payback: profit > 0 ? Math.round(capital / (profit * 12) * 10) / 10 : null, occupancy: occ && occ.pct != null ? occ.pct : (occ && typeof occ === 'number' ? occ : null), tone: roi >= 25 ? 'good' : roi >= 12 ? 'fair' : 'poor' };
  };
  Q.roiRows = (period) => St.where('buildings', b => !b.stub).map(b => Object.assign({ b }, Q.buildingRoi(b.id, period)));

  /* ---- Ngân hàng ---- */
  Q.bankAccount = (id) => St.get('bankAccounts', id) || {};
  Q.bankTxs = (f = {}) => St.where('bankTransactions', t => (!f.accountId || t.accountId === f.accountId) && (!f.dir || t.dir === f.dir) && (!f.status || t.matchStatus === f.status) && (!f.period || F.period(t.date) === f.period) && (!f.s || F.norm(t.desc + ' ' + t.ref + ' ' + t.code).includes(F.norm(f.s)))).sort((a, b) => F.cmp(b.date, a.date) || F.cmp(b.code, a.code));
  Q.bankStats = (f = {}) => { const ts = Q.bankTxs(f); const inn = ts.filter(t => t.dir === 'in'), out = ts.filter(t => t.dir === 'out'); return { in: F.sum(inn, t => t.amount), out: F.sum(out, t => t.amount), matched: ts.filter(t => t.matchStatus === 'matched').length, unmatched: ts.filter(t => t.matchStatus === 'unmatched').length, check: ts.filter(t => t.matchStatus === 'check').length, count: ts.length, pct: ts.length ? Math.round(ts.filter(t => ['matched', 'ignored'].includes(t.matchStatus)).length / ts.length * 100) : 0 }; };

  /* ---- Việc cần xử lý + tìm kiếm: thêm P3 khi bật ---- */
  const todoP2 = Q.todo;
  Q.todo = () => { const t = todoP2(); if (!on3()) return t; const inv = Q.latestInventory(); t.inventoryPending = inv && inv.status === 'in_progress' ? Q.inventoryStats(inv).needsAction : 0; t.contributionsDue = Q.contributions().filter(c => ['due', 'overdue'].includes(c.st)).length; t.probationEnding = Q.probationEnding(14).length; t.total += t.inventoryPending + t.contributionsDue + t.probationEnding; return t; };
  const searchP2 = Q.search;
  Q.search = (q) => { const out = searchP2(q); if (!on3()) return out; const n = F.norm(q).trim(); if (!n) return out; if (TH.auth.can('hr.view')) St.all('employees').forEach(e => { if (out.length < 12 && (F.norm(e.name).includes(n) || F.norm(e.code).includes(n))) out.push({ type: 'Nhân viên', label: e.name, sub: e.code + ' · ' + Q.deptLabel(e.dept), route: '#/hr/' + e.id }); }); if (TH.auth.can('assets.view')) St.all('assets').forEach(a => { if (out.length < 12 && (F.norm(a.name).includes(n) || F.norm(a.code).includes(n))) out.push({ type: 'Tài sản', label: a.code + ' – ' + a.name, sub: Q.building(a.buildingId).name + ' · ' + a.area, route: '#/assets?s=' + encodeURIComponent(a.code) }); }); return out; };
})(window.TH);
