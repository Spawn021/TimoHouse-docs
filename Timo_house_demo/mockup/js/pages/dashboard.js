(function (TH) {
  const F = TH.f, U = TH.ui, I = TH.icon, Q = TH.q, St = TH.store, esc = F.esc, C = TH.chart;
  TH.router.register('/dashboard', (root, params, q) => {
    TH.router.crumb([{ label: 'Tổng quan' }]);
    const period = St.state.meta.period; const f = { district: q.district || '', buildingId: q.buildingId || '', managerId: q.managerId || '' };
    const rooms = Q.filterRooms(f); const rs = Q.roomStats(rooms);
    const fin = Q.finance(period, f);
    const expiringSoon = St.where('contracts', c => Q.contractStatus(c) === 'expiring' && rooms.some(r => r.id === c.roomId)).length;
    const overdue = fin.overdueInv.map(i => ({ inv: i, rem: Q.invRemaining(i), days: Q.invOverdueDays(i) })).sort((a, b) => b.days - a.days);
    const buildings = St.where('buildings', b => !b.stub && (!f.buildingId || b.id === f.buildingId) && (!f.district || b.district === f.district));
    const groups = buildings.map(b => { const s = Q.roomStats(Q.roomsOf(b.id)); return { label: b.name, sub: '(' + s.total + ' phòng)', values: [s.occupied, s.ready, s.held, s.maintenance, s.cleaning + s.inactive] }; });
    const finB = buildings.map(b => { const x = Q.finance(period, { buildingId: b.id }); return { label: b.name, a: x.collected, b: x.remaining }; });
    root.innerHTML = `${U.pageHead({ title: 'Tổng quan', sub: 'Nắm bắt tình hình hoạt động, doanh thu và hiệu suất danh mục bất động sản cho thuê của TimoHouse.', acts: [U.btn({ label: 'Xuất báo cáo', icon: 'download', cls: 'btn-primary', act: 'export' })] })}
    ${U.filterbar([
      U.field({ label: 'Kỳ báo cáo', input: U.select({ name: 'period', value: period, options: [...new Set(St.all('invoices').map(i => i.period).concat([period]))].sort().reverse().map(p => [p, F.periodLabel(p)]), attrs: { 'data-on': 'f' } }) }),
      U.field({ label: 'Khu vực', input: U.select({ name: 'district', value: f.district, all: 'Tất cả khu vực', options: Q.districts(), attrs: { 'data-on': 'f' } }) }),
      U.field({ label: 'Tòa nhà', input: U.select({ name: 'buildingId', value: f.buildingId, all: 'Tất cả tòa nhà', options: St.where('buildings', b => !b.stub).map(b => [b.id, b.name]), attrs: { 'data-on': 'f' } }) }),
      U.field({ label: 'Quản lý', input: U.select({ name: 'managerId', value: f.managerId, all: 'Tất cả quản lý', options: Q.managers().map(u => [u.id, u.name]), attrs: { 'data-on': 'f' } }) })], U.btn({ label: 'Làm mới', icon: 'refresh', cls: 'btn-outline', act: 'reload' }))}
    <div class="grid grid-4 mb16" data-guide="dash-kpi">
      ${U.kpi({ label: 'Phòng ở được ngay', value: rs.ready, cap: 'Trên tổng ' + rs.total + ' phòng', icon: 'home', tone: 'green', delta: 12 })}
      ${U.kpi({ label: 'Có thể trống cuối tháng', value: expiringSoon, cap: 'HĐ hết hạn trong 35 ngày (BR-04)', icon: 'clock', tone: 'amber', delta: 8 })}
      ${U.kpi({ label: 'Đang giữ chỗ', value: rs.held, cap: 'Đã cọc, chờ ký hợp đồng', icon: 'users', tone: 'blue', delta: 20 })}
      ${U.kpi({ label: 'Tiến độ thu', value: fin.pct + '%', cap: 'Đã thu ' + F.short(fin.collected) + ' / ' + F.short(fin.receivable), icon: 'calendar-check', tone: 'purple', delta: 5, bar: fin.pct })}
    </div>
    ${U.card({ title: 'Tổng quan tài chính', icon: 'bar-chart-2', actions: '<span class="small muted">Đơn vị: VND</span>', cls: 'mb16', body: `<div class="grid grid-4">
      ${U.kpi({ label: 'Tiền nhà phải thu', value: F.vnd(fin.receivable), cap: fin.count + ' hóa đơn', icon: 'dollar', tone: 'blue', tint: false, delta: 6, deltaDir: 'down' })}
      ${U.kpi({ label: 'Đã thu', value: F.vnd(fin.collected), cap: fin.pct + '% kế hoạch', icon: 'check-circle', tone: 'green', tint: false, delta: 12 })}
      ${U.kpi({ label: 'Cọc mới', value: F.vnd(fin.depositNew), cap: fin.depositCount + ' giao dịch', icon: 'coins', tone: 'orange', tint: false, delta: 33 })}
      ${U.kpi({ label: 'Tiền phá hợp đồng', value: F.vnd(fin.penalty), cap: fin.penaltyCount + ' trường hợp', icon: 'file-x', tone: 'red', tint: false, delta: 50, deltaDir: 'down' })}</div>` })}
    <div class="grid grid-2 mb16">
      ${U.card({ title: 'Trạng thái phòng theo tòa', icon: 'bar-chart-2', actions: C.legend([{ label: 'Đang ở', color: '#1D4ED8' }, { label: 'Trống', color: '#BFDBFE' }, { label: 'Giữ chỗ', color: '#FCD34D' }, { label: 'Bảo trì', color: '#F97316' }, { label: 'Khác', color: '#CBD5E1' }]), body: C.stackedBar({ groups, series: [{ color: '#1D4ED8' }, { color: '#BFDBFE', dark: true }, { color: '#FCD34D', dark: true }, { color: '#F97316' }, { color: '#CBD5E1', dark: true }] }) })}
      ${U.card({ title: 'Tiến độ thu theo tòa', icon: 'trending-up', actions: C.legend([{ label: 'Đã thu', color: '#1D4ED8' }, { label: 'Còn phải thu', color: '#BFDBFE' }, { label: 'Tỷ lệ thu', line: true }]) + `<select class="inp sm" style="width:auto;margin-left:8px" data-on="chartmode"><option>Theo giá trị</option><option>Theo tỷ lệ</option></select>`, body: C.barLine({ groups: finB }) })}
    </div>
    ${U.card({ title: 'Top khoản quá hạn', icon: 'alert-circle', body: null, id: 'overdue-card', attrs: 'data-guide="dash-overdue"', footer: `<span>Hiển thị 1 - ${Math.min(5, overdue.length)} của ${overdue.length} khoản</span><a class="link" href="#/receivables?overdue=1${f.buildingId ? '&buildingId=' + f.buildingId : ''}">Xem tất cả →</a>` })}`;
    root.querySelector('#overdue-card .card-b') && root.querySelector('#overdue-card .card-b').remove();
    const tblWrap = document.createElement('div'); root.querySelector('#overdue-card .card-h').after(tblWrap);
    U.table(tblWrap, { rows: overdue.slice(0, 5), noPager: true, compact: true, cols: [
      { key: 'n', label: '#', render: (r, i) => i + 1, width: '40px' },
      { key: 't', label: 'Khách thuê', render: r => esc(Q.tenant(r.inv.tenantId).name) },
      { key: 'room', label: 'Phòng', render: r => U.link('#/rooms/' + r.inv.roomId, Q.room(r.inv.roomId).code) },
      { key: 'b', label: 'Tòa nhà', render: r => esc(Q.building(r.inv.buildingId).name) },
      { key: 'amt', label: 'Số tiền quá hạn', num: true, render: r => F.vnd(r.rem) },
      { key: 'd', label: 'Số ngày quá hạn', render: r => `<span class="red bold">${r.days} ngày</span>` },
      { key: 'due', label: 'Hạn thanh toán', render: r => F.date(r.inv.dueDate) },
      { key: 'st', label: 'Trạng thái', render: r => U.chip(r.days > 15 ? 'Quá hạn cao' : r.days > 7 ? 'Quá hạn' : 'Cảnh báo', r.days > 15 ? 'red' : r.days > 7 ? 'orange' : 'amber') },
      { key: 'actions', label: 'Thao tác', render: r => U.rowActions([U.actBtn({ icon: 'send', label: 'Nhắc thu', act: 'remind', attrs: { 'data-id': r.inv.id } }), U.moreBtn(r.inv.id)]) }] });
    U.onChange(root, { f: () => { const d = U.formData(root.querySelector('.filterbar')); St.state.meta.period = d.period; St.save(); TH.layout.refreshTop(); TH.router.replaceQuery({ district: d.district, buildingId: d.buildingId, managerId: d.managerId }); TH.router.refresh(); }, chartmode: () => U.toast('info', 'Chế độ hiển thị', 'Biểu đồ theo tỷ lệ – demo giữ cùng dữ liệu') });
    U.bind(root, {
      reload: () => { TH.router.refresh(); U.toast('ok', 'Đã làm mới số liệu'); },
      export: () => { const rows = buildings.map(b => { const s = Q.roomStats(Q.roomsOf(b.id)); const x = Q.finance(period, { buildingId: b.id }); return [b.code, b.name, s.total, s.occupied, s.ready, s.held, s.cleaning, s.maintenance, x.receivable, x.collected, x.remaining, x.overdue]; }); F.download('tong-quan-' + period + '.csv', F.csv(rows, ['Mã tòa', 'Tòa', 'Tổng phòng', 'Đang thuê', 'Sẵn sàng', 'Giữ chỗ', 'Chờ dọn', 'Bảo trì', 'Phải thu', 'Đã thu', 'Còn nợ', 'Quá hạn']), 'text/csv'); U.toast('ok', 'Đã xuất báo cáo tổng quan (CSV)'); },
      remind: (b) => TH.forms.zaloQuick({ invoiceIds: [b.dataset.id], eventKey: 'debt', title: 'Nhắc thu qua Zalo' }),
      more: (b) => { const inv = St.get('invoices', b.dataset.id); U.menu(b, [{ label: 'Xem hóa đơn', icon: 'eye', onClick: () => TH.go('#/invoices/' + inv.id) }, { label: 'Xác nhận thu tiền', icon: 'dollar', disabled: TH.q.invRemaining(inv) <= 0, onClick: () => TH.forms.confirmPayments({ invoiceIds: [inv.id] }) }, { label: 'Xem khách thuê', icon: 'user', onClick: () => TH.go('#/tenants/' + inv.tenantId) }]); },
    });
  }, { menu: 'dashboard', permission: 'dashboard.view' });
})(window.TH);
