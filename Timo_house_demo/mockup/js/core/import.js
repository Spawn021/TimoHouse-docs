/* Parser/mapping dùng chung cho import CSV Phase 2 (bảng kê, số dư đầu kỳ, lead) – wizard P1 trong settings.js giữ nguyên. */
(function (TH) {
  const F = TH.f, St = TH.store, Q = TH.q;
  const I = {};
  /* fields: [[key, label, required]], aliases: {key:[...]} → { header, map:{key:idx}, data } */
  I.parse = (rows, fields, aliases = {}) => { const hdr = rows[0].map(h => F.norm(h)); const map = {}; fields.forEach(([k, l]) => { const idx = hdr.findIndex(h => (aliases[k] || []).some(a => h.includes(F.norm(a))) || h === F.norm(l)); if (idx >= 0) map[k] = idx; }); return { header: rows[0], map, data: rows.slice(1) }; };
  I.rowsToObjects = (parsed) => parsed.data.map((row, i) => { const d = {}; Object.entries(parsed.map).forEach(([k, idx]) => d[k] = (row[idx] || '').trim()); return { i: i + 1, data: d }; });
  I.missingRequired = (parsed, fields) => fields.filter(f => f[2] && !(f[0] in parsed.map)).map(f => f[1]);
  I.readFile = (file) => new Promise((res, rej) => { if (/\.xlsx?$/i.test(file.name)) return rej(new Error('Bản demo offline chỉ đọc CSV – hãy "Lưu dưới dạng CSV" rồi tải lại, hoặc dùng file mẫu.')); const rd = new FileReader(); rd.onload = () => { const rows = F.parseCSV(rd.result); if (rows.length < 2) return rej(new Error('File rỗng')); res({ rows, checksum: F.hash(rd.result) }); }; rd.onerror = () => rej(new Error('Không đọc được file')); rd.readAsText(file, 'utf-8'); });
  I.fromRows = (rows, name) => ({ rows: rows.map(r => r.map(String)), checksum: F.hash(JSON.stringify(rows) + name), fileName: name });

  /* ---- Bảng kê thu tiền ---- */
  I.STATEMENT = { fields: [['date', 'Ngày giao dịch', true], ['amount', 'Số tiền', true], ['refCode', 'Mã ngoài', true], ['invoiceCode', 'Mã hóa đơn', false], ['contractCode', 'Mã hợp đồng', false], ['roomCode', 'Phòng', false], ['tenantName', 'Khách thuê', false], ['method', 'Phương thức', false], ['content', 'Nội dung', false]], aliases: { date: ['ngày', 'ngay', 'date'], amount: ['số tiền', 'so tien', 'amount'], refCode: ['mã ngoài', 'ma ngoai', 'mã gd', 'ref'], invoiceCode: ['hóa đơn', 'hoa don', 'invoice'], contractCode: ['hợp đồng', 'hop dong', 'contract'], roomCode: ['phòng', 'phong', 'room'], tenantName: ['khách', 'khach', 'tenant'], method: ['phương thức', 'phuong thuc', 'method'], content: ['nội dung', 'noi dung', 'content'] },
    rules: [['Ghép theo Mã hóa đơn', 'Ưu tiên khớp chính xác theo mã hóa đơn trong hệ thống.'], ['Ghép theo Mã hợp đồng', 'Nếu không có mã hóa đơn, thử khớp theo mã HĐ (hóa đơn còn nợ cũ nhất).'], ['Ghép theo Khách thuê + Số tiền', 'Khớp tên khách và số tiền tương ứng (±5%) – cần kiểm tra.'], ['Ghép theo Phòng/Tòa + Thời gian', 'Khớp phòng và hóa đơn đến hạn quanh ngày giao dịch (±3 ngày) – cần kiểm tra.']] };
  /* File mẫu bảng kê: 20 dòng sinh từ dữ liệu hiện có (khớp mã HĐ, khớp khách+số tiền, không ghép, trùng, hóa đơn nháp) */
  I.statementSample = () => {
    const unpaid = St.where('invoices', i => i.docStatus !== 'draft' && i.docStatus !== 'cancelled' && Q.invRemaining(i) > 0).sort((a, b) => F.cmp(a.code, b.code));
    const drafts = St.where('invoices', i => i.docStatus === 'draft' && Q.invLines(i.id).length).slice(0, 2);
    const paid = St.where('payments', p => p.status === 'recorded' && p.ref).slice(0, 2);
    const row = (i, inv, o = {}) => { const t = Q.tenant(inv.tenantId), r = Q.room(inv.roomId); return [o.date || F.addDays('2026-10-01', i), o.amount != null ? o.amount : Q.invRemaining(inv), o.ref || ('FT2610' + F.pad(i + 1, 2) + '-' + F.pad(i + 3, 2)), o.inv !== undefined ? o.inv : inv.code, o.ctr !== undefined ? o.ctr : Q.contract(inv.contractId).code, o.room !== undefined ? o.room : r.code, o.tenant !== undefined ? o.tenant : t.name, o.method || 'Chuyển khoản', 'THANH TOAN TIEN NHA ' + r.code]; };
    const rows = []; let k = 0;
    unpaid.slice(0, 10).forEach(inv => rows.push(row(k++, inv)));                                             // 10 khớp mã hóa đơn
    unpaid.slice(10, 12).forEach(inv => rows.push(row(k++, inv, { inv: '' })));                                // 2 khớp mã HĐ
    unpaid.slice(12, 14).forEach(inv => rows.push(row(k++, inv, { inv: '', ctr: '', amount: Math.round(Q.invRemaining(inv) * 1.02 / 1000) * 1000 })));   // 2 khớp khách + số tiền ±5%
    unpaid.slice(14, 15).forEach(inv => rows.push(row(k++, inv, { inv: '', ctr: '', tenant: '', amount: 0 + Q.invRemaining(inv), date: inv.dueDate })));   // 1 khớp phòng + ngày
    paid.forEach(p => { const a = Q.payAllocs(p.id)[0]; const inv = a ? St.get('invoices', a.invoiceId) : unpaid[0]; rows.push(row(k++, inv, { ref: p.ref, amount: p.amount, date: p.date })); });   // 2 trùng mã ngoài
    drafts.forEach(inv => rows.push(row(k++, inv, { amount: inv.total || 5000000 })));                          // 2 hóa đơn nháp → cần kiểm tra
    rows.push([F.addDays('2026-10-01', k), 3500000, 'VTB2610' + F.pad(k, 2), '', '', 'A12.04', '', 'Chuyển khoản', 'CK KHONG RO']); k++;                    // không ghép
    rows.push([F.addDays('2026-10-01', k), 7000000, 'TCB2610' + F.pad(k, 2), '', '', '', 'Nguyễn Văn Không Có', 'Chuyển khoản', 'THANH TOAN']); k++;   // không ghép
    while (rows.length < 20 && unpaid[15 + rows.length - 18]) rows.push(row(k++, unpaid[15 + rows.length - 18]));
    return [['Ngày giao dịch', 'Số tiền', 'Mã ngoài', 'Mã hóa đơn', 'Mã hợp đồng', 'Phòng', 'Khách thuê', 'Phương thức', 'Nội dung'], ...rows];
  };

  /* ---- Số dư đầu kỳ ---- */
  I.OPENING = { fields: [['tenantName', 'Khách hàng', false], ['contractCode', 'Mã hợp đồng', true], ['roomCode', 'Phòng', false], ['receivable', 'Phải thu', true], ['paid', 'Đã thu', true], ['deposit', 'Cọc giữ', false], ['sourceType', 'Nguồn dữ liệu', false]], aliases: { tenantName: ['khách', 'khach'], contractCode: ['hợp đồng', 'hop dong', 'mã hđ'], roomCode: ['phòng', 'phong'], receivable: ['phải thu', 'phai thu'], paid: ['đã thu', 'da thu'], deposit: ['cọc', 'coc'], sourceType: ['nguồn', 'nguon'] } };
  I.openingSample = (n = 12) => {
    const cs = St.where('contracts', c => c.status === 'active').sort((a, b) => F.cmp(a.code, b.code)).slice(0, n);
    const rows = cs.map((c, i) => { const t = Q.tenant(c.tenantId), r = Q.room(c.roomId); const rec = c.price; const paid = i % 3 === 2 ? Math.round(c.price * 0.6 / 100000) * 100000 : c.price; const dep = i === 2 || i === 6 ? c.deposit - 200000 : c.deposit; return [t.name, c.code, r.code, rec, paid, dep, i % 4 === 3 ? 'Hệ thống cũ' : 'File Excel']; });
    rows.push(['Khách Hệ Thống Cũ', 'HD-2025-042', 'C.08.02', 7000000, 4000000, 6800000, 'Hệ thống cũ']);
    return [['Khách hàng', 'Mã hợp đồng', 'Phòng', 'Phải thu', 'Đã thu', 'Cọc giữ', 'Nguồn dữ liệu'], ...rows];
  };
  I.openingSampleLarge = () => { const s = I.openingSample(120); return s; };

  /* ---- Lead ---- */
  I.LEAD = { fields: [['name', 'Họ tên', true], ['phone', 'Số điện thoại', true], ['email', 'Email', false], ['source', 'Nguồn', false], ['building', 'Tòa quan tâm', false], ['budget', 'Ngân sách', false], ['note', 'Ghi chú', false]], aliases: { name: ['họ tên', 'ho ten', 'tên', 'name'], phone: ['sđt', 'sdt', 'điện thoại', 'phone'], email: ['email'], source: ['nguồn', 'nguon', 'source'], building: ['tòa', 'toa', 'building'], budget: ['ngân sách', 'ngan sach', 'budget'], note: ['ghi chú', 'note'] } };
  I.leadSample = () => [['Họ tên', 'SĐT', 'Email', 'Nguồn', 'Tòa quan tâm', 'Ngân sách', 'Ghi chú'], ['Nguyễn Văn Import', '0931 111 222', 'import1@gmail.com', 'Facebook', 'Tòa Sunrise', '8000000', 'Cần 1PN'], ['Trần Thị Import', '0931 333 444', '', 'Zalo', 'Tòa Moonlight', '6000000', ''], ['Lê Import Trùng', '0901 234 567', '', 'Website', 'Tòa Central', '7000000', 'Trùng SĐT lead Trần Minh Đức'], ['Thiếu SĐT', '', '', 'Tờ rơi', '', '5000000', 'Lỗi thiếu SĐT'], ['Phạm Import Năm', '0931 555 666', 'p5@gmail.com', 'Google Ads', 'Tòa Garden', '9000000', '']];
  TH.imp = I;
})(window.TH);
