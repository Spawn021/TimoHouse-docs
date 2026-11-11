/* Actions Phase 2 – mở rộng TH.actions. Ném Error khi vi phạm quy tắc; UI bắt và toast. Chỉ có tác dụng khi TH.phase.on(2). */
(function (TH) {
  const F = TH.f, Q = TH.q, St = TH.store, Au = TH.auth, X = TH.actions;
  const err = (m) => { throw new Error(m); };
  const req = (v, m) => { if (v === undefined || v === null || v === '' || (typeof v === 'number' && isNaN(v))) err(m); return v; };
  const me = () => (St.state.session || {}).userId || null;
  const yearCode = (date = F.today()) => String(date || F.today()).slice(0, 4);
  const periodCode = (period = F.today().slice(0, 7)) => String(period || F.today().slice(0, 7)).replace('-', '');
  const done = () => { St.save(); St.emit('change'); };
  const on2 = () => TH.phase && TH.phase.on(2);
  const need2 = () => { if (!on2()) err('Chức năng thuộc Phase 2 – bật Phase 2 trong Công cụ nâng cao'); };
  const idem = (key, fn) => { if (!key) return fn(); St.state.meta.idem = St.state.meta.idem || {}; if (St.state.meta.idem[key]) return Object.assign({ duplicate: true }, St.state.meta.idem[key]); const res = fn(); try { St.state.meta.idem[key] = JSON.parse(JSON.stringify(res)); } catch (e) { St.state.meta.idem[key] = { id: res && res.id, code: res && res.code }; } St.save(); return res; };
  const act = (leadId, type, note, extra = {}) => St.add('leadActivities', Object.assign({ leadId, type, note, at: F.nowISO(), by: me() }, extra));
  const boardValue = (lead) => { const n = Number(lead && lead.boardOrder); return Number.isFinite(n) && n > 0 ? n : Number.MAX_SAFE_INTEGER; };
  const boardList = (status, omitId) => St.rawAll('leads').filter(l => l && l.id !== omitId && (l.status || 'new') === status).sort((a, b) => boardValue(a) - boardValue(b) || F.cmp(a.createdAt || '', b.createdAt || '') || String(a.id).localeCompare(String(b.id)));
  const reindexBoard = (items) => items.forEach((lead, i) => { lead.boardOrder = (i + 1) * 1000; });
  const placeLead = (lead, status, beforeId = null) => {
    if (!lead) return null;
    const from = lead.status || 'new';
    const source = boardList(from, lead.id);
    const target = status === from ? source : boardList(status, lead.id);
    let at = beforeId ? target.findIndex(x => x.id === beforeId) : target.length;
    if (at < 0) at = target.length;
    lead.status = status;
    target.splice(at, 0, lead);
    reindexBoard(target);
    if (status !== from) reindexBoard(source);
    return lead;
  };
  const appendLead = (lead, status = (lead && lead.status) || 'new') => placeLead(lead, status, null);
  TH.crmBoard = Object.assign(TH.crmBoard || {}, { place: placeLead, append: appendLead });

  /* ================= CRM ================= */
  X.saveLead = (d) => {
    need2(); Au.need('crm.manage'); req(d.name, 'Họ tên là bắt buộc'); req(d.phone, 'Số điện thoại là bắt buộc'); req(d.sourceId, 'Chọn nguồn khách');
    const ph = String(d.phone).replace(/\s/g, ''); const dup = St.one('leads', l => l.id !== d.id && String(l.phone || '').replace(/\s/g, '') === ph && l.status !== 'lost');
    if (dup && !d.force) { const e = new Error('Trùng SĐT với lead ' + dup.name + ' (' + dup.code + ', ' + Q.label('lead', dup.status) + ') – FR-SAL-01'); e.code = 'DUP'; e.dupId = dup.id; throw e; }
    const payload = { name: d.name, phone: d.phone, email: d.email || '', sourceId: d.sourceId, channel: d.channel || '', roomType: d.roomType || '', people: F.num(d.people) || 1, budgetMin: F.num(d.budgetMin), budgetMax: F.num(d.budgetMax), buildingIds: Array.isArray(d.buildingIds) ? d.buildingIds.filter(Boolean) : (d.buildingIds ? [d.buildingIds] : []), moveInDate: d.moveInDate || '', saleId: d.saleId || me(), temp: d.temp || 'warm', note: d.note || '', updatedAt: F.nowISO() };
    if (payload.budgetMax && payload.budgetMin > payload.budgetMax) err('Ngân sách từ phải nhỏ hơn đến');
    if (d.id) { const l = St.update('leads', d.id, payload); St.audit('update', 'lead', l.id, 'Cập nhật lead ' + l.name); done(); return l; }
    const l = St.add('leads', Object.assign({ code: St.nextCode('leads', 'LD-' + yearCode() + '-', 3), status: ['new', 'contacted', 'viewing', 'considering'].includes(d.status) ? d.status : 'new', lostReason: '', tenantId: null }, payload)); appendLead(l);
    act(l.id, 'create', 'Tạo lead từ nguồn ' + (Q.leadSource(l.sourceId).name || '')); St.audit('create', 'lead', l.id, 'Tạo lead ' + l.name + ' (' + l.code + ')'); done(); return l;
  };
  const validateLeadMove = (l, status, opts = {}) => {
    if (status === 'held' && !Q.leadHold(l.id)) err('Chuyển sang Giữ chỗ phải qua wizard Giữ chỗ phòng (có phòng, phí, thời hạn)');
    if (status === 'won' && !Q.leadDeal(l.id)) err('Chuyển sang Chốt thuê phải qua wizard Chốt thuê (tạo giao dịch)');
    if (status === 'lost') req(opts.reason, 'Nhập lý do mất lead');
    if (l.status === 'won' && !opts.force) err('Lead đã chốt thuê – không đổi giai đoạn');
    if (l.status === 'held' && !['held', 'won', 'lost'].includes(status) && Q.leadHold(l.id)) err('Lead đang giữ chỗ phòng ' + (Q.room(Q.leadHold(l.id).roomId).code || '') + ' – hủy giữ chỗ trước khi lùi giai đoạn');
  };
  X.moveLead = (id, opts = {}) => {
    need2(); Au.need('crm.manage'); const l = St.get('leads', id); if (!l) err('Không tìm thấy lead');
    const status = opts.status || l.status || 'new'; const before = l.status || 'new';
    if (status !== before) validateLeadMove(l, status, opts);
    placeLead(l, status, opts.beforeId || null);
    if (status !== before) {
      Object.assign(l, { updatedAt: F.nowISO(), lostReason: status === 'lost' ? opts.reason : l.lostReason });
      act(id, status === 'lost' ? 'lost' : 'status', (status === 'lost' ? 'Đánh dấu mất: ' + opts.reason : 'Đổi giai đoạn ' + Q.label('lead', before) + ' → ' + Q.label('lead', status)) + (opts.note ? ' – ' + opts.note : ''));
      St.audit('stage', 'lead', id, l.name + ': ' + Q.label('lead', before) + ' → ' + Q.label('lead', status));
    } else St.audit('reorder', 'lead', id, 'Sắp xếp ' + l.name + ' trong cột ' + Q.label('lead', status));
    done(); return l;
  };
  X.setLeadStage = (id, status, opts = {}) => {
    const l = St.get('leads', id); if (l && l.status === status) return l;
    return X.moveLead(id, Object.assign({}, opts, { status, beforeId: null }));
  };
  X.addLeadActivity = (id, { type, result, note }) => {
    need2(); Au.need('crm.manage'); const l = St.get('leads', id); if (!l) err('Không tìm thấy lead'); req(type, 'Loại hoạt động'); if (type !== 'note') req(result || note, 'Nhập kết quả/ghi chú');
    const a = act(id, type, note || '', { result: result || '' }); l.updatedAt = F.nowISO();
    if (['call', 'zalo'].includes(type) && l.status === 'new') { placeLead(l, 'contacted'); act(id, 'status', 'Tự chuyển giai đoạn Mới → Đã liên hệ'); }
    if (type === 'call' && result === 'no_answer') l.temp = l.temp === 'hot' ? 'warm' : 'cold'; if (result === 'interested') l.temp = 'hot';
    done(); return a;
  };
  X.assignLead = (id, saleId) => { need2(); Au.need('crm.manage'); req(saleId, 'Chọn sale'); const l = St.update('leads', id, { saleId, updatedAt: F.nowISO() }); act(id, 'assign', 'Đổi sale phụ trách → ' + Q.userName(saleId)); done(); return l; };
  X.importLeads = ({ rows, fileName, checksum }) => idem('lead-import:' + checksum, () => {
    need2(); Au.need('crm.manage'); let created = 0, skipped = 0; const lines = [];
    rows.forEach(r => { const d = r.data; const issues = []; if (!d.name) issues.push('Thiếu họ tên'); if (!d.phone) issues.push('Thiếu SĐT'); else if (St.one('leads', l => l.phone.replace(/\s/g, '') === d.phone.replace(/\s/g, ''))) issues.push('Trùng SĐT'); if (issues.length) { skipped++; lines.push({ i: r.i, src: Object.values(d).join(' | '), data: d, status: 'failed', reason: issues.join('; '), hash: F.hash(JSON.stringify(d)) }); return; }
      const srcObj = St.one('leadSources', s => F.norm(s.name) === F.norm(d.source || '')) || St.all('leadSources')[0]; const b = St.one('buildings', x => F.norm(x.name) === F.norm(d.building || '')); const l = St.add('leads', { code: St.nextCode('leads', 'LD-' + yearCode() + '-', 3), name: d.name, phone: d.phone, email: d.email || '', sourceId: srcObj.id, channel: 'Import', roomType: '', people: 1, budgetMin: F.num(d.budget), budgetMax: F.num(d.budget) ? F.num(d.budget) + 3000000 : 0, buildingIds: b ? [b.id] : [], moveInDate: '', saleId: me(), status: 'new', temp: 'warm', note: (d.note || '') + ' (import ' + fileName + ')', lostReason: '', tenantId: null, updatedAt: F.nowISO() }); appendLead(l); act(l.id, 'create', 'Import từ ' + fileName); created++; lines.push({ i: r.i, src: Object.values(d).join(' | '), data: d, status: 'ok', reason: '', link: '#/crm/leads/' + l.id, hash: F.hash(JSON.stringify(d)) }); });
    const job = St.add('importJobs', { code: St.nextCode('importJobs', 'IMP-' + F.today().slice(0, 7).replace('-', '') + '-', 3), type: 'lead', typeLabel: 'Lead (CRM)', fileName, fileSize: (rows.length * 0.1).toFixed(1) + ' KB', rows: rows.length, valid: created, warn: 0, error: skipped, created, skipped, ok: created, failed: skipped, progress: 100, status: skipped ? 'partial' : 'done', createdBy: me(), updatedAt: F.nowISO(), checksum, lines, attempts: [{ n: 1, at: F.nowISO(), by: me(), total: rows.length, ok: created, failed: skipped, status: skipped ? 'partial' : 'done', note: '' }], mapping: ['Họ tên', 'SĐT', 'Nguồn'], rules: ['Bắt buộc: Họ tên, SĐT', 'Không trùng SĐT lead đang mở'], buildingLabel: 'Tất cả tòa nhà', period: F.today().slice(0, 7) });
    St.audit('import', 'importJobs', job.id, 'Import lead: tạo ' + created + ', bỏ qua ' + skipped); done(); return job;
  });
  /* ---- Lịch xem ---- */
  X.saveViewing = (d) => {
    need2(); Au.need('viewings.manage'); req(d.leadId, 'Chọn lead'); req(d.roomId, 'Chọn phòng'); req(d.date, 'Ngày hẹn'); req(d.time, 'Giờ hẹn'); req(d.saleId, 'Nhân viên phụ trách'); req(d.remind, 'Phương thức nhắc hẹn'); req(d.place, 'Địa điểm gặp');
    if (!d.id && d.date < F.today()) err('Ngày hẹn phải từ hôm nay trở đi');
    const clash = St.one('viewings', v => v.id !== d.id && v.status === 'scheduled' && v.saleId === d.saleId && v.date === d.date && v.time === d.time); if (clash && !d.force) { const e = new Error('Nhân viên ' + Q.userName(d.saleId) + ' đã có lịch ' + clash.code + ' lúc ' + d.time + ' ' + F.date(d.date)); e.code = 'CLASH'; throw e; }
    const room = Q.room(d.roomId); const payload = { leadId: d.leadId, roomId: d.roomId, buildingId: room.buildingId, date: d.date, time: d.time, saleId: d.saleId, remind: d.remind, place: d.place, note: d.note || '' };
    let v; if (d.id) { v = St.update('viewings', d.id, payload); act(d.leadId, 'viewing', 'Đổi lịch xem ' + v.code + ' → ' + F.date(v.date) + ' ' + v.time); }
    else { v = St.add('viewings', Object.assign({ code: St.nextCode('viewings', 'LX-' + F.today().slice(0, 7).replace('-', '') + '-', 3), status: 'scheduled', result: '', resultNote: '', confirmed: false }, payload)); const l = St.get('leads', d.leadId); if (l && ['new', 'contacted'].includes(l.status)) { placeLead(l, 'viewing'); act(l.id, 'status', 'Tự chuyển giai đoạn → Hẹn xem'); } act(d.leadId, 'viewing', 'Đặt lịch xem phòng ' + room.code + ' vào ' + F.date(v.date) + ' ' + v.time); }
    St.update('leads', d.leadId, { updatedAt: F.nowISO() }); St.audit('save', 'viewing', v.id, 'Lịch xem ' + v.code + ' – ' + Q.lead(d.leadId).name + ' – ' + room.code); done(); return v;
  };
  X.viewingResult = (id, { result, note }) => {
    need2(); Au.need('viewings.manage'); const v = St.get('viewings', id); if (!v || v.status !== 'scheduled') err('Lịch không ở trạng thái Đã lên lịch'); req(result, 'Chọn kết quả xem');
    Object.assign(v, { status: 'done', result, resultNote: note || '', doneAt: F.nowISO() }); const l = St.get('leads', v.leadId);
    if (l) { if (['interested', 'considering'].includes(result) && ['new', 'contacted', 'viewing'].includes(l.status)) placeLead(l, 'considering'); if (result === 'interested') l.temp = 'hot'; if (result === 'declined') { l.temp = 'cold'; if (l.status === 'viewing') placeLead(l, 'contacted'); } l.updatedAt = F.nowISO(); act(l.id, 'viewing', 'Kết quả xem ' + Q.room(v.roomId).code + ': ' + Q.label('viewingResult', result) + (note ? ' – ' + note : ''), { result }); }
    St.audit('result', 'viewing', id, 'Ghi kết quả ' + v.code + ': ' + Q.label('viewingResult', result)); done(); return v;
  };
  X.cancelViewing = (id, reason, noShow = false) => { need2(); Au.need('viewings.manage'); const v = St.get('viewings', id); if (!v || v.status !== 'scheduled') err('Lịch không ở trạng thái Đã lên lịch'); Object.assign(v, { status: noShow ? 'no_show' : 'cancelled', resultNote: reason || '' }); act(v.leadId, 'viewing', (noShow ? 'Khách không đến lịch ' : 'Hủy lịch ') + v.code + (reason ? ' – ' + reason : '')); done(); return v; };
  X.sendViewingReminders = (ids) => {
    need2(); Au.need('zalo.send'); const vs = ids.map(id => St.get('viewings', id)).filter(v => v && v.status === 'scheduled'); if (!vs.length) err('Không có lịch Đã lên lịch để nhắc');
    const tpl = St.one('zaloTemplates', t => t.eventKey === 'viewing_reminder'); if (!tpl) err('Chưa có mẫu Nhắc lịch xem phòng');
    const b = St.add('zaloBatches', { code: St.nextCode('zaloBatches', 'ZL-' + periodCode() + '-', 3), name: 'Nhắc lịch xem phòng ' + F.date(F.today()), eventKey: 'viewing_reminder', sourceKey: 'viewing_reminder', audience: 'Khách quan tâm', plannedCount: vs.length, sentCount: 0, failedCount: 0, sentAt: null, createdBy: me(), status: 'draft', templateId: tpl.id, scopeLabel: 'Lịch xem đã chọn', period: F.today().slice(0, 7), sendMode: 'now', rules: 'Chỉ nhắc lịch Đã lên lịch · 1 tin / lịch', phase: 2, log: [] });
    vs.forEach(v => { const l = Q.lead(v.leadId); const room = Q.room(v.roomId); St.add('zaloMessages', { batchId: b.id, tenantId: l.tenantId || null, leadId: l.id, roomId: v.roomId, buildingId: v.buildingId, invoiceId: null, viewingId: v.id, channel: 'Zalo', templateCode: tpl.code, status: 'queued', errorCode: '', sentAt: null, phone: l.phone, content: Q.renderTemplate(tpl.body, Q.templateCtx(null, { name: l.name }, { room, buildingId: v.buildingId, due: v.date, ngay_den_han: F.date(v.date) + ' ' + v.time })), amountAtSend: 0, retryOfId: null, attempt: 1, recipientName: l.name }); v.reminded = F.nowISO(); act(l.id, 'zalo', 'Gửi nhắc lịch xem ' + v.code + ' qua Zalo'); });
    St.audit('create', 'zaloBatch', b.id, 'Tạo đợt nhắc lịch xem ' + b.code + ' (' + vs.length + ')'); X.startBatch(b.id); return b;
  };
  /* ---- Giữ chỗ ---- */
  X.convertLead = (leadId) => {
    need2(); const l = St.get('leads', leadId); if (!l) err('Không tìm thấy lead'); if (l.tenantId && St.get('tenants', l.tenantId)) return St.get('tenants', l.tenantId);
    const ph = String(l.phone).replace(/\s/g, ''); let t = St.one('tenants', x => String(x.phone || '').replace(/\s/g, '') === ph);
    if (!t) { t = St.add('tenants', { code: St.nextCode('tenants', 'KH', 5), name: l.name, phone: l.phone, zalo: l.phone, email: l.email || '', idNumber: '', dob: '', job: '', segment: '', verified: false, managerId: me(), note: 'Tạo từ lead ' + l.code, fromLeadId: l.id }); St.audit('create', 'tenant', t.id, 'Tạo khách thuê ' + t.name + ' từ lead ' + l.code); }
    l.tenantId = t.id; St.save(); return t;
  };
  X.createHoldP2 = (d) => {
    need2(); Au.need('holds.manage'); req(d.leadId, 'Chọn lead'); req(d.roomId, 'Chọn phòng'); req(d.start, 'Ngày bắt đầu'); req(d.until, 'Ngày hết hạn'); req(d.feeMethod, 'Hình thức thanh toán'); req(d.receiverId, 'Người nhận tiền'); req(d.cancelPolicy, 'Điều kiện hủy');
    const fee = F.num(d.fee); if (fee <= 0) err('Phí giữ chỗ phải lớn hơn 0'); if (d.until <= d.start) err('Ngày hết hạn phải sau ngày bắt đầu'); if (F.daysBetween(d.start, d.until) > 14) err('Giữ chỗ tối đa 14 ngày (OI-09)'); if (d.until < F.today()) err('Ngày hết hạn phải từ hôm nay trở đi');
    const room = Q.room(d.roomId); if (room.status !== 'ready') err('Phòng ' + room.code + ' đang ' + Q.label('room', room.status) + ' – chỉ giữ chỗ phòng Sẵn sàng'); if (Q.building(room.buildingId).status === 'inactive') err('Tòa đang tạm ngừng');
    const l = St.get('leads', d.leadId); if (Q.leadHold(l.id)) err('Lead đã có giữ chỗ đang hiệu lực');
    const t = X.convertLead(l.id);
    St.update('rooms', room.id, { status: 'held' });
    const h = St.add('holds', { code: St.nextCode('holds', 'GC-' + F.today().slice(0, 7).replace('-', '') + '-', 3), roomId: room.id, tenantId: t.id, leadId: l.id, start: d.start, until: d.until, expiresAt: d.until, deposit: fee, fee, feeMethod: d.feeMethod, receiverId: d.receiverId, cancelPolicy: d.cancelPolicy, autoExpire: d.autoExpire !== false, requireDeposit: !!d.requireDeposit, lockFromSales: !!d.lockFromSales, note: d.note || '', status: 'active', createdBy: me() });
    St.add('payments', { code: St.nextCode('payments', 'PAY-' + F.today().slice(0, 7).replace('-', '') + '-', 3), kind: 'hold_fee', holdId: h.id, tenantId: t.id, roomId: room.id, buildingId: room.buildingId, date: F.today(), amount: fee, method: d.feeMethod, ref: 'GC-' + h.code, evidence: '', note: 'Phí giữ chỗ ' + h.code + ' (trừ vào cọc khi ký HĐ)', status: 'recorded', createdBy: me(), unallocated: fee, history: [{ at: F.nowISO(), who: (St.state.session || {}).name, what: 'Thu phí giữ chỗ' }] });
    placeLead(l, 'held'); l.updatedAt = F.nowISO(); act(l.id, 'hold', 'Giữ chỗ phòng ' + room.code + ' đến ' + F.date(d.until) + ' – phí ' + F.vnd(fee));
    St.audit('hold', 'room', room.id, 'Giữ chỗ ' + h.code + ' phòng ' + room.code + ' cho lead ' + l.name); done(); return h;
  };
  X.expireHolds = () => { let n = 0; St.rawAll('holds').forEach(h => { if (!h || !Q.holdActive(h) || h.autoExpire === false) return; const until = h.until || h.expiresAt; if (until && until < F.today()) { h.status = 'expired'; h.expiredAt = F.nowISO(); const r = St.rawGet('rooms', h.roomId); if (r && r.status === 'held') r.status = 'ready'; const l = h.leadId && St.rawGet('leads', h.leadId); if (l && l.status === 'held') { placeLead(l, 'considering'); St.add('leadActivities', { leadId: l.id, type: 'hold', note: 'Giữ chỗ ' + (h.code || '') + ' hết hạn – phòng mở lại', at: F.nowISO(), by: null }); } n++; } }); if (n) { St.audit('expire_hold', 'hold', null, 'Tự động hết hạn ' + n + ' giữ chỗ'); St.save(); } return n; };
  X.extendHold = (id, until) => { need2(); Au.need('holds.manage'); const h = St.get('holds', id); if (!h || !Q.holdActive(h)) err('Giữ chỗ không còn hiệu lực'); req(until, 'Chọn ngày'); if (until <= (h.until || h.expiresAt)) err('Ngày mới phải sau ngày hết hạn hiện tại'); if (F.daysBetween(h.start || h.createdAt.slice(0, 10), until) > 14) err('Tổng thời gian giữ chỗ tối đa 14 ngày (OI-09)'); Object.assign(h, { until, expiresAt: until }); if (h.leadId) act(h.leadId, 'hold', 'Gia hạn giữ chỗ ' + h.code + ' đến ' + F.date(until)); done(); return h; };
  X.cancelHoldP2 = (id, { reason, refund }) => { need2(); Au.need('holds.manage'); const h = St.get('holds', id); if (!h || !Q.holdActive(h)) err('Giữ chỗ không còn hiệu lực'); X.releaseHold(h.roomId, reason); h.refunded = !!refund; if (h.leadId) act(h.leadId, 'hold', 'Hủy giữ chỗ ' + h.code + (refund ? ' – hoàn phí' : ' – mất phí') + (reason ? ' (' + reason + ')' : '')); done(); return h; };
  /* ---- Chốt thuê / giao dịch ---- */
  X.createDeal = (d) => {
    need2(); Au.need('deals.manage'); req(d.leadId, 'Chọn lead'); req(d.roomId, 'Chọn phòng'); req(d.moveIn, 'Ngày vào ở'); req(d.months, 'Thời hạn'); const price = F.num(d.price), deposit = F.num(d.deposit); if (price <= 0) err('Giá thuê phải lớn hơn 0'); if (deposit < 0) err('Tiền cọc không hợp lệ'); req(d.cycle, 'Chu kỳ thanh toán'); if (!F.num(d.people)) err('Số người ở');
    const l = St.get('leads', d.leadId); if (!l) err('Không tìm thấy lead'); if (l.status === 'lost') err('Lead đã mất'); if (Q.leadDeal(l.id) && Q.leadDeal(l.id).status !== 'ended') err('Lead đã có giao dịch ' + Q.leadDeal(l.id).code);
    const room = Q.room(d.roomId); const hold = Q.roomHold(room.id); // re-check khả dụng lúc chốt (FR-SAL-02)
    if (room.status === 'held' && (!hold || hold.leadId !== l.id)) err('Phòng ' + room.code + ' đang giữ chỗ cho khách khác'); if (!['ready', 'held'].includes(room.status)) err('Phòng ' + room.code + ' không còn khả dụng (' + Q.label('room', room.status) + ')');
    const t = d.tenantId ? St.get('tenants', d.tenantId) : X.convertLead(l.id); if (!t) err('Chọn hoặc tạo khách thuê'); l.tenantId = t.id;
    const sale = St.get('users', l.saleId) || {};
    const deal = St.add('deals', { code: St.nextCode('deals', 'GD', 5), leadId: l.id, tenantId: t.id, roomId: room.id, buildingId: room.buildingId, saleId: l.saleId || me(), holdId: hold && hold.leadId === l.id ? hold.id : null, moveIn: d.moveIn, months: Number(d.months), price, deposit, cycle: d.cycle, serviceIds: d.serviceIds || [], extraServices: d.extraServices || [], people: F.num(d.people), note: d.note || '', status: 'pending_contract', contractId: null, closedAt: F.today(), depositPaid: hold && hold.leadId === l.id ? (hold.fee || 0) : 0, createdBy: me(), docs: d.docs || [] });
    St.add('commissions', { dealId: deal.id, saleId: deal.saleId, rate: sale.commissionRate || 10, amount: Math.round(price * (sale.commissionRate || 10) / 100), status: 'provisional', paidAt: null, paidRef: '', expenseId: null }); // OI-14: 10% tháng đầu, chi một lần
    if (hold && hold.leadId === l.id) hold.dealId = deal.id;
    placeLead(l, 'won'); l.updatedAt = F.nowISO(); act(l.id, 'deal', 'Chốt thuê ' + deal.code + ' – phòng ' + room.code + ' – ' + F.vnd(price) + '/tháng');
    St.audit('create', 'deal', deal.id, 'Chốt thuê ' + deal.code + ' – ' + t.name + ' – ' + room.code); done(); return deal;
  };
  X.linkDealContract = (dealId, contractId) => { const d = St.get('deals', dealId); const c = St.get('contracts', contractId); if (!d || !c) return; d.contractId = c.id; c.dealId = d.id; if (c.status === 'active') d.status = 'active'; St.save(); };
  X.recordDealDeposit = (dealId, { amount, date, method, ref }) => {
    need2(); Au.need('payments.record'); const d = St.get('deals', dealId); if (!d) err('Không tìm thấy giao dịch'); const amt = F.num(amount); if (amt <= 0) err('Số tiền phải lớn hơn 0'); req(date, 'Ngày thu'); req(method, 'Phương thức');
    if (Q.periodLocked(F.period(date))) err('Kỳ ' + F.periodLabel(F.period(date)) + ' đã khóa – không ghi nhận thu (FR-FIN-08)');
    const remain = d.deposit - (d.depositPaid || 0); if (amt > remain + 0.5) err('Số thu ' + F.vnd(amt) + ' vượt cọc còn phải thu ' + F.vnd(remain));
    const p = St.add('payments', { code: St.nextCode('payments', 'PAY-' + F.today().slice(0, 7).replace('-', '') + '-', 3), kind: 'deposit', dealId: d.id, contractId: d.contractId, tenantId: d.tenantId, roomId: d.roomId, buildingId: d.buildingId, date, amount: amt, method, ref: ref || '', evidence: '', note: 'Thu tiền cọc giao dịch ' + d.code, status: 'recorded', createdBy: me(), unallocated: 0, history: [{ at: F.nowISO(), who: (St.state.session || {}).name, what: 'Thu tiền cọc' }] });
    d.depositPaid = (d.depositPaid || 0) + amt; act(d.leadId, 'payment', 'Thu cọc ' + F.vnd(amt) + ' (' + p.code + ') – đã thu ' + F.vnd(d.depositPaid) + '/' + F.vnd(d.deposit));
    St.audit('deposit', 'deal', d.id, 'Thu cọc ' + F.vnd(amt) + ' cho ' + d.code); done(); return p;
  };
  X.payCommission = (dealId, { date, ref }, key) => idem(key || ('comm:' + dealId), () => {
    need2(); Au.need('commission.pay'); const d = St.get('deals', dealId); if (!d) err('Không tìm thấy giao dịch'); if (Q.commissionStatus(d) !== 'eligible') err('Hoa hồng chưa đủ điều kiện chi trả (cần cọc thu đủ và HĐ kích hoạt – BR-13)'); req(date, 'Ngày chi'); req(ref, 'Tham chiếu chứng từ');
    if (Q.periodLocked(F.period(date))) err('Kỳ ' + F.periodLabel(F.period(date)) + ' đã khóa (FR-FIN-08)');
    const c = St.one('commissions', x => x.dealId === d.id); if (!c) err('Không có khoản hoa hồng');
    if (!St.one('expenseGroups', g => g.name === 'Hoa hồng')) St.add('expenseGroups', { code: St.nextCode('expenseGroups', 'NC', 2), name: 'Hoa hồng', fullName: 'Hoa hồng bán hàng (Phase 2)', status: 'active' });
    const ex = St.add('expenses', { code: St.nextCode('expenses', 'CP', 4), date, group: 'Hoa hồng', desc: 'Hoa hồng ' + d.code + ' – ' + Q.userName(d.saleId), buildingId: d.buildingId, amount: c.amount, recordType: 'ops', method: 'cash', evidence: ref, note: 'Chi một lần theo BR-13', createdBy: me(), status: 'recorded', dealId: d.id });
    Object.assign(c, { status: 'paid', paidAt: F.nowISO(), paidDate: date, paidRef: ref, paidBy: me(), expenseId: ex.id }); act(d.leadId, 'commission', 'Ghi nhận chi hoa hồng ' + F.vnd(c.amount) + ' – ' + ref);
    St.audit('pay_commission', 'deal', d.id, 'Chi hoa hồng ' + F.vnd(c.amount) + ' cho ' + Q.userName(d.saleId) + ' (' + d.code + ')'); done(); return c;
  });
  // Hook HĐ P1: kích hoạt → deal active; hủy/kết thúc → deal ended (hoa hồng về provisional nếu chưa chi)
  const wrap = (name, after) => { const orig = X[name]; X[name] = function () { const res = orig.apply(this, arguments); try { after(res, arguments); } catch (e) { console.warn('hook', name, e); } return res; }; };
  wrap('activateContract', (c) => { if (!c || !c.id) return; const d = St.one('deals', x => x.contractId === c.id) || (c.dealId ? St.get('deals', c.dealId) : null); if (d && d.status === 'pending_contract') { d.status = 'active'; St.save(); } });
  wrap('cancelContract', (r, args) => { const c = St.get('contracts', args[0]); const d = c && c.dealId ? St.get('deals', c.dealId) : null; if (d) { d.status = 'ended'; d.contractId = null; St.save(); } });
  wrap('terminateContract', (r) => { const c = r && r.contract; const d = c && c.dealId ? St.get('deals', c.dealId) : null; if (d) { d.status = 'ended'; St.save(); } });
  wrap('saveContractDraft', (c, args) => { const d0 = args[0] || {}; if (d0.dealId && c) X.linkDealContract(d0.dealId, c.id); if (d0.ocrId && c) { const o = St.get('ocrExtractions', d0.ocrId); if (o) { o.contractId = c.id; o.status = 'created'; c.source = 'ocr'; c.ocrId = o.id; St.save(); } } });

  /* ================= OCR hợp đồng ================= */
  X.ocrUpload = ({ fileName, size, sample }) => { need2(); Au.need('ocr.use'); req(fileName, 'Chọn file'); if (size && size > 20 * 1024 * 1024) err('File tối đa 20MB (FR-DOC-01)'); if (!/\.(pdf|jpe?g|png|txt)$/i.test(fileName)) err('Chỉ nhận PDF/JPG/PNG'); const o = St.add('ocrExtractions', { code: St.nextCode('ocrExtractions', 'OCR-' + yearCode() + '-', 3), fileName, size: size ? (size / 1024 / 1024).toFixed(1) + ' MB' : '2.4 MB', pages: 6, sample: !!sample, status: 'uploaded', fields: [], contractId: null, createdBy: me() }); St.audit('upload', 'ocr', o.id, 'Tải file trích xuất ' + fileName); done(); return o; };
  /* Mô phỏng trích xuất: file mẫu cố tình sai 5 trường (tên, mã phòng, cọc, ngày kết thúc, SĐT) → confidence < 0.8 = Cần kiểm tra */
  X.ocrExtract = (id) => { need2(); const o = St.get('ocrExtractions', id); if (!o) err('Không tìm thấy'); o.status = 'extracting'; St.save(); St.emit('change', { source: 'timer' }); return o; };
  X.ocrFinish = (id) => {
    const o = St.get('ocrExtractions', id); if (!o) err('Không tìm thấy'); const s = TH.ocr ? TH.ocr.sampleSpec() : {};
    const f = (key, label, value, confidence, group, money = false) => ({ key, label, value, confidence, group, money, raw: value, confirmed: confidence >= 0.8 });
    o.fields = [
      f('tenantName', 'Họ và tên', s.tenantNameWrong, 0.62, 'tenant'), f('idNumber', 'CMND/CCCD', s.idNumber, 0.97, 'tenant'), f('phone', 'Số điện thoại', s.phoneWrong, 0.55, 'tenant'), f('address', 'Địa chỉ thường trú', s.address, 0.9, 'tenant'), f('email', 'Email', s.email, 0.91, 'tenant'),
      f('buildingName', 'Tòa nhà', s.buildingName, 0.96, 'room'), f('roomCode', 'Phòng', s.roomCodeWrong, 0.71, 'room'), f('roomType', 'Loại phòng', s.roomType, 0.93, 'room'), f('area', 'Diện tích (m²)', String(s.area), 0.95, 'room'),
      f('start', 'Ngày bắt đầu', s.start, 0.94, 'term'), f('end', 'Ngày kết thúc', s.endWrong, 0.66, 'term'), f('months', 'Thời hạn', '12 tháng', 0.95, 'term'),
      f('price', 'Giá thuê (VND)', String(s.price), 0.79, 'money', true), f('deposit', 'Tiền cọc (VND)', s.depositWrong, 0.41, 'money', true), f('cycle', 'Chu kỳ thanh toán', 'Hàng tháng', 0.98, 'money'), f('payDay', 'Ngày thanh toán hàng tháng', '05', 0.9, 'money'), f('note', 'Ghi chú', '', 1, 'money'),
      f('svc_internet', 'Internet', 'true', 0.9, 'services'), f('svc_cable', 'Truyền hình', 'false', 0.9, 'services'), f('svc_parking', 'Giữ xe máy', 'true', 0.88, 'services'), f('svc_clean', 'Dọn vệ sinh', 'false', 0.9, 'services'), f('svc_mgmt', 'Phí quản lý', 'false', 0.85, 'services'), f('svc_other', 'Khác', 'false', 0.9, 'services'),
      f('landlord', 'Bên cho thuê', 'Trần Văn Hải', 0.95, 'meta'), f('contractNo', 'Số hợp đồng', 'HD-2026-001', 0.97, 'meta'), f('signPlace', 'Nơi ký', 'TP. Hồ Chí Minh', 0.93, 'meta'), f('signDate', 'Ngày ký', '01/11/2026', 0.96, 'meta'), f('idDate', 'Ngày cấp CCCD', '12/05/2021', 0.9, 'meta'), f('bank', 'Tài khoản nhận', 'VCB 0011 002233', 0.92, 'meta'),
    ];
    o.status = 'review'; o.extractedAt = F.nowISO(); St.audit('extract', 'ocr', id, 'Trích xuất ' + o.fields.length + ' trường (' + o.fields.filter(x => !x.confirmed).length + ' cần kiểm tra)'); done(); return o;
  };
  X.ocrSetField = (id, key, value, confirm = true) => { need2(); const o = St.get('ocrExtractions', id); const fl = (o.fields || []).find(x => x.key === key); if (!fl) err('Trường không tồn tại'); fl.value = value; fl.confirmed = !!confirm || (fl.value !== '' && fl.value !== fl.raw); fl.editedAt = F.nowISO(); St.save(); return fl; };
  X.ocrConfirmField = (id, key) => { const o = St.get('ocrExtractions', id); const fl = (o.fields || []).find(x => x.key === key); if (fl) { fl.confirmed = true; St.save(); } return fl; };
  X.ocrRerun = (id) => { need2(); const o = St.get('ocrExtractions', id); o.fields.forEach(x => { x.value = x.raw; x.confirmed = x.confidence >= 0.8; delete x.editedAt; }); o.rerunAt = F.nowISO(); St.audit('rerun', 'ocr', id, 'Chạy lại trích xuất'); done(); return o; };
  X.ocrReadyToCreate = (o) => { const rc = (o.fields || []).find(x => x.key === 'roomCode'); if (rc && !St.one('rooms', r => r.code === rc.value)) err('Mã phòng "' + (rc.value || '') + '" không tồn tại – chọn lại phòng trước khi tạo hợp đồng'); const pending = (o.fields || []).filter(x => !x.confirmed); const money = pending.filter(x => x.money); if (money.length) err('Trường ảnh hưởng tiền phải được xác nhận trước khi tạo hợp đồng (BR-03): ' + money.map(x => x.label).join(', ')); if (pending.length) err('Còn ' + pending.length + ' trường Cần kiểm tra chưa xác nhận'); return true; };

  /* ================= Bảng kê thu tiền ================= */
  X.matchStatement = (rows) => {
    need2(); const seenRef = new Set();
    return rows.map(r => {
      const d = r.data; const out = { i: r.i, data: d, status: 'unmatched', rule: 0, invoiceId: null, tenantId: null, alloc: 0, unalloc: F.num(d.amount), reason: '', hash: F.hash('st:' + JSON.stringify(d)) };
      const amount = F.num(d.amount); if (!amount || !d.date) { out.reason = 'Thiếu ngày/số tiền'; return out; }
      const ref = (d.refCode || '').trim(); if (ref && (seenRef.has(ref) || St.one('payments', p => p.ref === ref && p.status === 'recorded'))) { out.status = 'duplicate'; out.reason = 'Mã ngoài ' + ref + ' đã có trong hệ thống'; out.unalloc = 0; return out; } if (ref) seenRef.add(ref);
      let inv = null, rule = 0;
      if (d.invoiceCode) { inv = St.one('invoices', i => i.code === d.invoiceCode.trim()); rule = 1; if (inv && inv.docStatus === 'draft') { out.status = 'check'; out.reason = 'Hóa đơn ' + inv.code + ' chưa phát hành'; out.invoiceId = inv.id; out.tenantId = inv.tenantId; out.rule = 1; return out; } if (inv && inv.docStatus === 'cancelled') inv = null; }
      if (!inv && d.contractCode) { const c = St.one('contracts', x => x.code === d.contractCode.trim()); if (c) { inv = St.where('invoices', i => i.contractId === c.id && !['draft', 'cancelled'].includes(i.docStatus) && Q.invRemaining(i) > 0).sort((a, b) => F.cmp(a.dueDate, b.dueDate))[0] || null; rule = 2; if (!inv) { out.tenantId = c.tenantId; out.reason = 'HĐ ' + c.code + ' không còn hóa đơn nợ'; out.status = 'check'; return out; } } }
      if (!inv && d.tenantName) { const ts = St.where('tenants', t => F.norm(t.name) === F.norm(d.tenantName)); for (const t of ts) { const cand = St.where('invoices', i => i.tenantId === t.id && !['draft', 'cancelled'].includes(i.docStatus) && Q.invRemaining(i) > 0 && Math.abs(Q.invRemaining(i) - amount) <= amount * 0.05); if (cand.length) { inv = cand[0]; rule = 3; break; } } }
      if (!inv && d.roomCode) { const room = St.one('rooms', x => x.code === d.roomCode.trim()); if (room) { const cand = St.where('invoices', i => i.roomId === room.id && !['draft', 'cancelled'].includes(i.docStatus) && Q.invRemaining(i) > 0 && Math.abs(F.daysBetween(i.dueDate, d.date)) <= 3); if (cand.length) { inv = cand[0]; rule = 4; } } }
      if (!inv) { out.reason = 'Không tìm thấy hóa đơn/khách phù hợp'; return out; }
      const rem = Q.invRemaining(inv); out.invoiceId = inv.id; out.tenantId = inv.tenantId; out.rule = rule; out.alloc = Math.min(rem, amount); out.unalloc = amount - out.alloc;
      out.status = rule >= 3 ? 'check' : (out.unalloc > 0 ? 'check' : 'matched'); out.reason = rule >= 3 ? 'Ghép theo quy tắc ' + rule + ' – cần xác nhận' : out.unalloc > 0 ? 'Số tiền lớn hơn còn nợ ' + F.vnd(rem) : 'Khớp ' + (rule === 1 ? 'mã hóa đơn' : 'mã hợp đồng');
      return out;
    });
  };
  X.resolveStatementRow = (row, { invoiceId, skip }) => { if (skip) { row.status = 'skipped'; row.reason = 'Bỏ qua thủ công'; row.alloc = 0; row.unalloc = 0; return row; } const inv = St.get('invoices', invoiceId); if (!inv) err('Chọn hóa đơn'); if (inv.docStatus === 'draft') err('Hóa đơn chưa phát hành'); const amount = F.num(row.data.amount); const rem = Q.invRemaining(inv); row.invoiceId = inv.id; row.tenantId = inv.tenantId; row.alloc = Math.min(rem, amount); row.unalloc = amount - row.alloc; row.status = 'matched'; row.rule = 5; row.reason = 'Ghép thủ công'; return row; };
  X.commitStatement = ({ rows, fileName, checksum, period }) => idem('statement:' + checksum, () => {
    need2(); Au.need('statement.import'); const matched = rows.filter(r => r.status === 'matched'); if (!matched.length) err('Không có dòng Đã ghép để ghi nhận');
    let created = 0; const lines = [];
    rows.forEach(r => { if (r.status !== 'matched') { lines.push({ i: r.i, src: [r.data.date, F.vnd(F.num(r.data.amount)), r.data.refCode, r.data.invoiceCode || r.data.contractCode || r.data.roomCode || r.data.tenantName].join(' | '), data: r.data, status: r.status === 'duplicate' || r.status === 'skipped' ? 'skipped' : r.status === 'check' ? 'check' : 'failed', reason: r.reason, invoiceId: r.invoiceId, hash: r.hash }); return; }
      const inv = St.get('invoices', r.invoiceId); const remNow = Q.invRemaining(inv); if (remNow <= 0) { lines.push({ i: r.i, src: [r.data.date, F.vnd(F.num(r.data.amount)), r.data.refCode, inv.code].join(' | '), data: r.data, status: 'check', reason: 'Hóa đơn ' + inv.code + ' đã được ghép hết bởi dòng trước – cần chọn hóa đơn khác', invoiceId: inv.id, hash: r.hash }); return; }
      const alloc = Math.min(r.alloc, remNow); const p = X.recordPayment({ tenantId: inv.tenantId, date: r.data.date, amount: F.num(r.data.amount), method: r.data.method || 'Chuyển khoản', ref: r.data.refCode || '', evidence: fileName, note: 'Bảng kê ' + fileName + (r.data.content ? ' – ' + r.data.content : ''), allocations: [{ invoiceId: inv.id, amount: alloc }] }, 'st:' + checksum + ':' + r.hash); p.kind = 'statement'; created++; lines.push({ i: r.i, src: [r.data.date, F.vnd(F.num(r.data.amount)), r.data.refCode, inv.code].join(' | '), data: r.data, status: 'ok', reason: '', link: '#/payments/' + p.id, invoiceId: inv.id, hash: r.hash }); });
    const job = St.add('importJobs', { code: St.nextCode('importJobs', 'IMP-' + F.today().slice(0, 7).replace('-', '') + '-', 3), type: 'statement', typeLabel: 'Bảng kê thu tiền', fileName, fileSize: (rows.length * 0.15).toFixed(1) + ' KB', rows: rows.length, valid: created, warn: lines.filter(l => l.status === 'check').length, error: lines.filter(l => l.status === 'failed').length, created, skipped: rows.length - created, ok: created, failed: lines.filter(l => l.status === 'failed').length, progress: 100, status: lines.some(l => l.status === 'check') ? 'needs_check' : lines.some(l => l.status === 'failed') ? 'partial' : 'done', createdBy: me(), updatedAt: F.nowISO(), checksum, lines, attempts: [{ n: 1, at: F.nowISO(), by: me(), total: rows.length, ok: created, failed: rows.length - created, status: 'partial', note: 'Ghi nhận ' + created + ' khoản thu từ bảng kê' }], mapping: ['Ngày GD', 'Số tiền', 'Mã ngoài', 'Mã hóa đơn', 'Mã HĐ', 'Khách', 'Phòng'], rules: TH.imp.STATEMENT.rules.map(x => x[0]), buildingLabel: 'Tất cả tòa nhà', period: period || F.today().slice(0, 7) });
    St.audit('import', 'importJobs', job.id, 'Duyệt bảng kê ' + fileName + ': ghi nhận ' + created + ' khoản thu'); done(); return job;
  });

  /* ================= Số dư đầu kỳ ================= */
  X.reconcileOpening = (rows, asOf) => rows.map(r => { const d = r.data; const c = St.one('contracts', x => x.code === (d.contractCode || '').trim()); const out = { i: r.i, data: d, contractId: c ? c.id : null, tenantId: c ? c.tenantId : null, roomId: c ? c.roomId : null, receivable: F.num(d.receivable), paid: F.num(d.paid), debt: F.num(d.receivable) - F.num(d.paid), deposit: F.num(d.deposit), sysDeposit: c ? c.deposit : null, sysDebt: c ? Q.contractDebt(c.id) : null, sourceType: d.sourceType || 'File Excel', status: 'check', reason: '', useSource: 'file', hash: F.hash('ob:' + asOf + ':' + JSON.stringify(d)) }; if (!c) { out.reason = 'Không tìm thấy hợp đồng ' + d.contractCode; return out; } if (St.one('openingBalances', o => o.contractId === c.id && o.asOf === asOf)) { out.status = 'check'; out.reason = 'Đã chuyển số dư mốc này'; out.done = true; return out; } if (out.receivable < out.paid) { out.reason = 'Đã thu lớn hơn phải thu'; return out; } if (out.deposit && Math.abs(out.deposit - c.deposit) > 1) { out.status = 'diff'; out.reason = 'Cọc file ' + F.vnd(out.deposit) + ' ≠ hệ thống ' + F.vnd(c.deposit); return out; } out.status = 'valid'; out.reason = 'Khớp hợp đồng ' + c.code; return out; });
  /* Tạo hóa đơn/khoản thu kind opening cho 1 dòng đã đối chiếu (dùng chung commitOpening & retryJob) */
  const applyOpeningLine = (c, r, asOf, period, fileName) => {
      const debt = r.receivable - r.paid; let inv = null, pay = null;
      if (r.receivable > 0) { inv = St.add('invoices', { code: St.nextCode('invoices', 'HD-' + period.replace('-', '') + '-', 3), kind: 'opening', contractId: c.id, roomId: c.roomId, buildingId: c.buildingId, tenantId: c.tenantId, period, issueDate: asOf, dueDate: asOf, docStatus: 'issued', total: r.receivable, note: 'Số dư đầu kỳ chuyển từ hệ thống cũ (mốc ' + F.date(asOf) + ')', createdBy: me(), reminderCount: 0, lastReminderAt: null, accountingNote: 'Opening balance – ' + (r.sourceType || 'File'), source: 'user' }); St.add('invoiceLines', { invoiceId: inv.id, seq: 1, item: 'Số dư đầu kỳ', desc: 'Số dư đầu kỳ chuyển từ hệ thống cũ', qty: 1, unitPrice: r.receivable, amount: r.receivable, kind: 'opening' });
        if (r.paid > 0) { pay = St.add('payments', { code: St.nextCode('payments', 'PAY-' + period.replace('-', '') + '-', 3), kind: 'opening', tenantId: c.tenantId, roomId: c.roomId, buildingId: c.buildingId, date: asOf, amount: r.paid, method: 'Chuyển đổi', ref: 'OB-' + c.code, evidence: fileName || '', note: 'Đã thu trước mốc chuyển đổi', status: 'recorded', createdBy: me(), unallocated: 0, history: [{ at: F.nowISO(), who: (St.state.session || {}).name, what: 'Chuyển số dư' }] }); St.add('paymentAllocations', { paymentId: pay.id, invoiceId: inv.id, amount: r.paid }); } }
      if (r.status === 'diff' && r.useSource === 'file' && r.deposit) { c.deposit = r.deposit; }
      St.add('openingBalances', { contractId: c.id, tenantId: c.tenantId, roomId: c.roomId, buildingId: c.buildingId, asOf, receivable: r.receivable, paid: r.paid, debt, deposit: r.status === 'diff' && r.useSource === 'system' ? c.deposit : (r.deposit || c.deposit), sourceType: r.sourceType, invoiceId: inv ? inv.id : null, paymentId: pay ? pay.id : null, createdBy: me() });
      return { inv, pay, debt }; };
  X.commitOpening = ({ rows, asOf, fileName, checksum }) => idem('opening:' + checksum + ':' + asOf, () => {
    need2(); Au.need('openingBalance.manage'); req(asOf, 'Chọn mốc chuyển đổi'); const period = F.period(asOf); if (Q.periodLocked(period)) err('Kỳ ' + F.periodLabel(period) + ' đã khóa');
    const sel = rows.filter(r => r.selected && (r.status === 'valid' || (r.status === 'diff' && r.useSource))); if (!sel.length) err('Không có dòng hợp lệ được chọn');
    let n = 0; const lines = [];
    sel.forEach(r => { const c = St.get('contracts', r.contractId); if (!c || St.one('openingBalances', o => o.contractId === c.id && o.asOf === asOf)) { lines.push({ i: r.i, src: r.data.contractCode, data: r.data, status: 'skipped', reason: 'Đã có số dư mốc này', hash: r.hash }); return; }
      const { inv, pay, debt } = applyOpeningLine(c, r, asOf, period, fileName); n++;
      lines.push({ i: r.i, src: [r.data.contractCode, F.vnd(r.receivable), F.vnd(r.paid), F.vnd(debt)].join(' | '), data: r.data, status: 'ok', reason: '', link: inv ? '#/invoices/' + inv.id : '#/contracts/' + c.id, hash: r.hash }); });
    rows.filter(r => !sel.includes(r)).forEach(r => lines.push({ i: r.i, src: r.data.contractCode + ' | ' + F.vnd(r.receivable), data: r.data, status: r.status === 'check' ? 'check' : 'skipped', reason: r.reason, hash: r.hash }));
    const job = St.add('importJobs', { code: St.nextCode('importJobs', 'IMP-' + F.today().slice(0, 7).replace('-', '') + '-', 3), type: 'opening', typeLabel: 'Số dư ban đầu', fileName: fileName || 'so-du-dau-ky.csv', fileSize: (rows.length * 0.1).toFixed(1) + ' KB', rows: rows.length, valid: n, warn: lines.filter(l => l.status === 'check').length, error: 0, created: n, skipped: rows.length - n, ok: n, failed: lines.filter(l => l.status === 'failed').length, progress: 100, status: lines.some(l => l.status === 'check') ? 'needs_check' : 'done', createdBy: me(), updatedAt: F.nowISO(), checksum, lines, attempts: [{ n: 1, at: F.nowISO(), by: me(), total: rows.length, ok: n, failed: rows.length - n, status: 'done', note: 'Chuyển số dư mốc ' + F.date(asOf) }], mapping: ['Mã HĐ', 'Phải thu', 'Đã thu', 'Cọc'], rules: ['HĐ phải tồn tại', 'Đã thu ≤ phải thu', 'Cọc khớp hệ thống (chênh → chọn nguồn)'], buildingLabel: 'Tất cả tòa nhà', period, asOf });
    St.audit('opening', 'importJobs', job.id, 'Chuyển số dư đầu kỳ mốc ' + F.date(asOf) + ': ' + n + ' hợp đồng'); done(); return job;
  });

  /* ================= Hoàn cọc nâng cao ================= */
  X.requestRefundEdit = (id, reason) => { need2(); Au.need('refunds.requestEdit', 'Chỉ Admin/Kế toán được yêu cầu chỉnh sửa (FR-FIN-07)'); const rf = St.get('refunds', id); if (rf.status !== 'pending') err('Hồ sơ không ở trạng thái Chờ duyệt'); req(reason, 'Nhập nội dung cần chỉnh sửa'); Object.assign(rf, { status: 'needs_edit', editReason: reason, editRequestedAt: F.nowISO(), editRequestedBy: me() }); (rf.history = rf.history || []).push({ at: F.nowISO(), by: me(), status: 'needs_edit', note: reason }); (rf.notes = rf.notes || []).unshift({ at: F.nowISO(), by: me(), text: 'Yêu cầu chỉnh sửa: ' + reason, tag: 'Yêu cầu' }); St.audit('request_edit', 'refund', id, 'Yêu cầu chỉnh sửa ' + rf.code + ': ' + reason); done(); return rf; };
  X.addRefundNote = (id, text) => { need2(); const rf = St.get('refunds', id); req(text, 'Nhập ghi chú'); (rf.notes = rf.notes || []).unshift({ at: F.nowISO(), by: me(), text, tag: 'Nội bộ' }); done(); return rf; };
  X.setRefundInspection = (id, { inspection2, photos }) => { need2(); const rf = St.get('refunds', id); if (!['draft', 'needs_edit', 'rejected', 'pending'].includes(rf.status)) err('Hồ sơ đã duyệt – không sửa hiện trạng'); if (inspection2) rf.inspection2 = inspection2; if (photos) rf.photos = photos; St.audit('inspection', 'refund', id, 'Cập nhật hiện trạng phòng ' + rf.code); done(); return rf; };
  X.saveRefundDeductions = (id, deductions) => { need2(); const rf = St.get('refunds', id); if (!['draft', 'needs_edit', 'rejected'].includes(rf.status)) err('Chỉ sửa khấu trừ khi hồ sơ Nháp / Cần chỉnh sửa (số đã duyệt bị đổi phải duyệt lại – FR-FIN-07)'); St.removeWhere('refundDeductions', x => x.refundId === id); deductions.forEach(x => { if (x.desc || x.amount) St.add('refundDeductions', { refundId: id, group: x.group || 'Khác', desc: x.desc || '', qty: F.num(x.qty) || 1, unitPrice: F.num(x.unitPrice) || F.num(x.amount), amount: Math.max(0, F.num(x.amount) || (F.num(x.qty) || 1) * F.num(x.unitPrice)), note: x.note || '', evidenceCount: x.evidenceCount || 1, status: 'confirmed' }); }); const comp = Q.refundCompute(rf); rf.deductionsTotal = comp.ded; rf.refundAmount = comp.refund; St.audit('save', 'refund', id, 'Cập nhật bảng khấu trừ ' + rf.code + ' – ' + F.vnd(comp.ded)); done(); return rf; };

  /* ================= Bảo trì ================= */
  X.saveIncident = (d) => {
    need2(); Au.need('maintenance.manage'); req(d.buildingId, 'Chọn tòa'); req(d.category, 'Chọn hạng mục'); req(d.priority, 'Chọn ưu tiên'); req(d.desc, 'Mô tả sự cố');
    if (!Au.can('maintenance.manage', { buildingId: d.buildingId })) err('Tòa ngoài phạm vi được phân công (FR-MNT-03)');
    const payload = { buildingId: d.buildingId, roomId: d.roomId || null, category: d.category, priority: d.priority, desc: d.desc, dueDate: d.dueDate || F.addDays(F.today(), d.priority === 'urgent' ? 1 : d.priority === 'high' ? 3 : 7), assigneeId: d.assigneeId || null, photos: d.photos || [], cost: F.num(d.cost) || 0, vendorId: d.vendorId || null };
    if (d.id) { const i = St.update('incidents', d.id, payload); St.add('incidentUpdates', { incidentId: i.id, at: F.nowISO(), by: me(), type: 'edit', note: 'Cập nhật thông tin sự cố' }); St.audit('update', 'incident', i.id, 'Cập nhật sự cố ' + i.code); done(); return i; }
    const i = St.add('incidents', Object.assign({ code: St.nextCode('incidents', 'SC-' + F.today().slice(0, 7).replace('-', '') + '-', 3), status: payload.assigneeId ? 'assigned' : 'new', expenseId: null, createdBy: me(), doneAt: null }, payload));
    St.add('incidentUpdates', { incidentId: i.id, at: F.nowISO(), by: me(), type: 'create', note: 'Tạo sự cố' + (i.assigneeId ? ' – phân công ' + Q.userName(i.assigneeId) : '') }); St.audit('create', 'incident', i.id, 'Tạo sự cố ' + i.code + ' – ' + i.category + (i.roomId ? ' – phòng ' + Q.room(i.roomId).code : '')); done(); return i;
  };
  X.assignIncident = (id, assigneeId) => { need2(); Au.need('maintenance.assign'); const i = St.get('incidents', id); if (['done', 'cancelled'].includes(i.status)) err('Sự cố đã đóng'); req(assigneeId, 'Chọn người phụ trách'); i.assigneeId = assigneeId; if (i.status === 'new') i.status = 'assigned'; St.add('incidentUpdates', { incidentId: id, at: F.nowISO(), by: me(), type: 'assign', note: 'Phân công ' + Q.userName(assigneeId) }); St.audit('assign', 'incident', id, 'Phân công ' + i.code + ' → ' + Q.userName(assigneeId)); done(); return i; };
  X.startIncident = (id) => { need2(); Au.need('maintenance.manage'); const i = St.get('incidents', id); if (!['new', 'assigned'].includes(i.status)) err('Sự cố không ở trạng thái Mới/Đã phân công'); i.status = 'in_progress'; i.assigneeId = i.assigneeId || me(); i.startedAt = F.nowISO(); St.add('incidentUpdates', { incidentId: id, at: F.nowISO(), by: me(), type: 'start', note: 'Bắt đầu xử lý' }); St.audit('start', 'incident', id, 'Bắt đầu xử lý ' + i.code); done(); return i; };
  X.completeIncident = (id, { cost, vendorId, note, photos }) => {
    need2(); Au.need('maintenance.manage'); const i = St.get('incidents', id); if (!['assigned', 'in_progress', 'new'].includes(i.status)) err('Sự cố đã đóng'); const c = F.num(cost);
    if (c > 0 && Q.periodLocked(F.period(F.today()))) err('Kỳ hiện tại đã khóa – không ghi chi phí (FR-FIN-08)');
    Object.assign(i, { status: 'done', cost: c, vendorId: vendorId || i.vendorId, doneAt: F.nowISO(), doneNote: note || '', photos: (i.photos || []).concat(photos || []) });
    if (c > 0) { const ex = St.add('expenses', { code: St.nextCode('expenses', 'CP', 4), date: F.today(), group: 'Sửa chữa', desc: 'Sửa chữa ' + i.category.toLowerCase() + (i.roomId ? ' phòng ' + Q.room(i.roomId).code : '') + ' (' + i.code + ')', buildingId: i.buildingId, roomId: i.roomId, amount: c, recordType: 'ops', method: 'cash', evidence: photos && photos[0] ? photos[0] : 'bien_ban_' + i.code + '.pdf', note: (note || '') + (vendorId ? ' – NCC ' + Q.vendor(vendorId).name : ''), createdBy: me(), status: 'recorded', incidentId: i.id }); i.expenseId = ex.id; }
    St.add('incidentUpdates', { incidentId: id, at: F.nowISO(), by: me(), type: 'done', note: 'Hoàn tất' + (c ? ' – chi phí ' + F.vnd(c) : '') + (note ? ' – ' + note : '') }); St.audit('done', 'incident', id, 'Hoàn tất ' + i.code + (c ? ' – chi phí ' + F.vnd(c) : '')); done(); return i;
  };
  X.cancelIncident = (id, reason) => { need2(); Au.need('maintenance.manage'); const i = St.get('incidents', id); if (i.status === 'done') err('Sự cố đã hoàn tất'); req(reason, 'Nhập lý do hủy'); i.status = 'cancelled'; i.cancelReason = reason; St.add('incidentUpdates', { incidentId: id, at: F.nowISO(), by: me(), type: 'cancel', note: 'Hủy: ' + reason }); St.audit('cancel', 'incident', id, 'Hủy ' + i.code); done(); return i; };
  X.addIncidentUpdate = (id, note, photos) => { need2(); req(note, 'Nhập nội dung'); const i = St.get('incidents', id); if (photos && photos.length) i.photos = (i.photos || []).concat(photos); St.add('incidentUpdates', { incidentId: id, at: F.nowISO(), by: me(), type: 'note', note, photos: photos || [] }); done(); };
  X.saveSchedule = (d) => {
    need2(); Au.need('maintenance.schedule'); req(d.item, 'Hạng mục/thiết bị'); req(d.buildingId, 'Chọn tòa'); req(d.cycle, 'Chu kỳ'); req(d.date, 'Ngày dự kiến');
    const payload = { item: d.item, equipType: d.equipType || d.item, buildingId: d.buildingId, cycle: d.cycle, date: d.date, vendorId: d.vendorId || null, assigneeId: d.assigneeId || null, checklist: (d.checklist || []).filter(x => x && x.text).map(x => ({ text: x.text, done: !!x.done })), note: d.note || '' };
    if (d.id) { const s = St.get('maintenanceSchedules', d.id); if (!s) err('Không tìm thấy lịch'); if (['done', 'cancelled'].includes(s.status)) err('Lịch đã đóng'); const before = s.date; Object.assign(s, payload); St.audit('update', 'schedule', s.id, 'Cập nhật lịch ' + s.code + (before !== s.date ? ' – đổi ngày ' + F.date(before) + ' → ' + F.date(s.date) + ' (cập nhật nhắc)' : '')); done(); return s; }
    const s = St.add('maintenanceSchedules', Object.assign({ code: St.nextCode('maintenanceSchedules', 'BD-' + F.today().slice(0, 7).replace('-', '') + '-', 3), status: 'scheduled', doneAt: null, cost: 0, expenseId: null, nextId: null, createdBy: me() }, payload));
    St.audit('create', 'schedule', s.id, 'Tạo lịch bảo dưỡng ' + s.code + ' – ' + s.item + ' ' + F.date(s.date)); done(); return s;
  };
  X.startSchedule = (id) => { need2(); Au.need('maintenance.schedule'); const s = St.get('maintenanceSchedules', id); if (s.status !== 'scheduled') err('Lịch không ở trạng thái Đã lên lịch'); s.status = 'in_progress'; s.startedAt = F.nowISO(); s.assigneeId = s.assigneeId || me(); St.audit('start', 'schedule', id, 'Bắt đầu ' + s.code); done(); return s; };
  X.completeSchedule = (id, { checklist, cost, note, photos }) => {
    need2(); Au.need('maintenance.schedule'); const s = St.get('maintenanceSchedules', id); if (['done', 'cancelled'].includes(s.status)) err('Lịch đã đóng'); const c = F.num(cost);
    if (c > 0 && Q.periodLocked(F.period(F.today()))) err('Kỳ hiện tại đã khóa – không ghi chi phí (FR-FIN-08)');
    if (checklist) s.checklist = checklist; else (s.checklist || []).forEach(x => x.done = true); Object.assign(s, { status: 'done', doneAt: F.nowISO(), cost: c, doneNote: note || '', photos: photos || [] });
    if (c > 0) { const ex = St.add('expenses', { code: St.nextCode('expenses', 'CP', 4), date: F.today(), group: 'Sửa chữa', desc: 'Bảo dưỡng ' + s.item + ' (' + s.code + ')', buildingId: s.buildingId, amount: c, recordType: 'ops', method: 'cash', evidence: 'bien_ban_' + s.code + '.pdf', note: note || '', createdBy: me(), status: 'recorded', scheduleId: s.id }); s.expenseId = ex.id; }
    const add = { monthly: 1, q: 3, h: 6, y: 12 }[s.cycle]; if (add) { const nx = St.add('maintenanceSchedules', { code: St.nextCode('maintenanceSchedules', 'BD-' + F.addMonths(s.date, add).slice(0, 7).replace('-', '') + '-', 3), item: s.item, equipType: s.equipType, buildingId: s.buildingId, cycle: s.cycle, date: F.addMonths(s.date, add), vendorId: s.vendorId, assigneeId: s.assigneeId, checklist: (s.checklist || []).map(x => ({ text: x.text, done: false })), note: 'Tự sinh từ ' + s.code, status: 'scheduled', doneAt: null, cost: 0, expenseId: null, nextId: null, createdBy: me(), prevId: s.id }); s.nextId = nx.id; }
    St.audit('done', 'schedule', id, 'Hoàn thành ' + s.code + (c ? ' – chi phí ' + F.vnd(c) : '') + (s.nextId ? ' – sinh lịch kế tiếp' : '')); done(); return s;
  };
  X.cancelSchedule = (id, reason) => { need2(); Au.need('maintenance.schedule'); const s = St.get('maintenanceSchedules', id); if (s.status === 'done') err('Lịch đã hoàn thành'); s.status = 'cancelled'; s.cancelReason = reason || ''; St.audit('cancel', 'schedule', id, 'Hủy lịch ' + s.code + ' – không sinh nhắc mới (AC-MNT-01-2)'); done(); return s; };
  X.saveVendor = (d) => { need2(); Au.need('manageCatalog'); req(d.name, 'Tên nhà cung cấp'); if (d.id) St.update('vendors', d.id, d); else St.add('vendors', Object.assign({ status: 'active' }, d)); done(); };
  X.removeVendor = (id) => { need2(); Au.need('manageCatalog'); if (St.one('maintenanceSchedules', s => s.vendorId === id) || St.one('incidents', i => i.vendorId === id)) err('Nhà cung cấp đang được dùng trong lịch/sự cố'); St.remove('vendors', id); done(); };

  /* ================= Kỳ & khóa kỳ (FR-FIN-08) ================= */
  X.setPeriodCheck = (period, key, on) => { need2(); Au.need('period.close'); let p = St.one('periods', x => x.period === period); if (!p) p = St.add('periods', { period, status: 'open', checklist: {}, lockedAt: null, lockedBy: null, snapshot: null }); if (p.status === 'locked') err('Kỳ đã khóa'); p.checklist = p.checklist || {}; p.checklist[key] = !!on; p.checklist[key + 'At'] = on ? F.nowISO() : null; if (Q.periodChecks(period).filter(c => c.key !== 'submit').every(c => c.done)) p.status = 'reconciling'; else p.status = 'open'; done(); return p; };
  X.lockPeriod = (period) => {
    need2(); Au.need('period.close', 'Chỉ Admin/Kế toán được khóa kỳ (FR-FIN-08)'); const checks = Q.periodChecks(period).filter(c => c.key !== 'submit'); const missing = checks.filter(c => !c.done); if (missing.length) err('Chưa hoàn tất checklist: ' + missing.map(c => c.label.replace(/\(.*\)/, '').trim()).join(', '));
    let p = St.one('periods', x => x.period === period); if (!p) p = St.add('periods', { period, status: 'open', checklist: {}, lockedAt: null, lockedBy: null, snapshot: null }); if (p.status === 'locked') err('Kỳ đã khóa');
    const cf = Q.cashflow(period); const byB = Q.cashflowByBuilding(period);
    Object.assign(p, { status: 'locked', lockedAt: F.nowISO(), lockedBy: me(), snapshot: { at: F.nowISO(), income: cf.income, expense: cf.expense, net: cf.income - cf.expense, invCount: cf.invCount, onTime: cf.onTime, byGroup: cf.byGroup, days: cf.days, byBuilding: byB.map(x => ({ name: x.b.name, income: x.income, expense: x.expense, net: x.net, pct: x.pct, grade: x.grade })) } });
    St.audit('lock_period', 'period', p.id, 'Khóa kỳ ' + F.periodLabel(period) + ' – thu ' + F.vnd(cf.income) + ', chi ' + F.vnd(cf.expense)); done(); return p;
  };
  X.unlockPeriod = (period, reason) => { need2(); Au.need('advancedTools', 'Chỉ Admin được mở lại kỳ'); const p = St.one('periods', x => x.period === period); if (!p || p.status !== 'locked') err('Kỳ chưa khóa'); req(reason, 'Nhập lý do'); Object.assign(p, { status: 'open', unlockedAt: F.nowISO(), unlockReason: reason }); St.audit('unlock_period', 'period', p.id, 'Mở lại kỳ ' + F.periodLabel(period) + ': ' + reason); done(); return p; };
  const assertPeriodOpen = (period, what) => { if (period && Q.periodLocked(period)) err('Kỳ ' + F.periodLabel(period) + ' đã khóa – không ' + (what || 'ghi nhận') + ' trong kỳ này (FR-FIN-08)'); };
  X.assertPeriodOpen = assertPeriodOpen;
  const guard = (name, getPeriod, what) => { const orig = X[name]; X[name] = function () { assertPeriodOpen(getPeriod.apply(null, arguments), what); return orig.apply(this, arguments); }; };
  guard('recordPayment', (d) => F.period(d && d.date), 'ghi nhận thu tiền');
  guard('issueInvoice', (id) => (St.get('invoices', id) || {}).period, 'phát hành hóa đơn');
  guard('issueInvoices', (ids) => { const p = (ids || []).map(id => (St.get('invoices', id) || {}).period).find(p => Q.periodLocked(p)); return p; }, 'phát hành hóa đơn');
  guard('adjustInvoice', (id) => (St.get('invoices', id) || {}).period, 'điều chỉnh hóa đơn');
  guard('createInvoiceDrafts', (o) => o && o.period, 'tạo hóa đơn');
  guard('saveExpense', (d) => F.period(d && d.date), 'ghi chi phí');
  guard('reversePayment', (id) => F.period((St.get('payments', id) || {}).date), 'hoàn tác khoản thu');
  guard('confirmPayments', (d) => F.period(d && d.date), 'ghi nhận thu tiền');
  guard('recordRefundPaid', (id, d) => F.period(d && d.paidDate), 'ghi nhận hoàn cọc');
  guard('deleteExpense', (id) => F.period((St.get('expenses', id) || {}).date), 'xóa chi phí');
  guard('markLandlordPaid', (id, d) => F.period(d && d.paidDate), 'ghi nhận trả chủ nhà');
  guard('adjustPaymentAllocations', (id) => F.period((St.get('payments', id) || {}).date), 'điều chỉnh phân bổ khoản thu');
  { const orig = X.saveExpense; X.saveExpense = function (d) { if (d && d.id) { const old = St.get('expenses', d.id); if (old) assertPeriodOpen(F.period(old.date), 'sửa chi phí'); } return orig.apply(this, arguments); }; }

  /* ================= Zalo nâng cao ================= */
  const retryP1 = X.retryBatch;
  X.retryBatch = (id) => {
    if (!on2()) return retryP1(id);
    const b = St.get('zaloBatches', id); const pol = St.state.meta.zaloPolicy || { maxRetry: 3, retryCodes: ['403', '408'], fallbackSms: false };
    const all = Q.batchMessages(id).filter(m => ['failed', 'unknown'].includes(m.status) && !m.retried && !St.one('zaloMessages', x => x.retryOfId === m.id));
    const targets = all.filter(m => m.status === 'unknown' || (pol.retryCodes.includes(Q.providerOf(m)) && (m.attempt || 1) < pol.maxRetry)); const perm = all.filter(m => !targets.includes(m));
    if (!targets.length) err('Không có tin đủ điều kiện thử lại (mã 300 là lỗi vĩnh viễn – chỉ retry 403/408 chưa quá ' + pol.maxRetry + ' lần)');
    targets.forEach(m => { St.add('zaloMessages', Object.assign({}, m, { id: undefined, status: 'queued', errorCode: '', providerCode: '', providerMsg: '', sentAt: null, retryOfId: m.id, attempt: (m.attempt || 1) + 1, attempts: (m.attempts || []).slice(), createdAt: undefined, source: 'user' })); m.retried = true; });
    let sms = 0; if (pol.fallbackSms) perm.forEach(m => { if (St.one('zaloMessages', x => x.fallbackOfId === m.id)) return; St.add('zaloMessages', Object.assign({}, m, { id: undefined, channel: 'SMS', status: 'delivered', errorCode: '', providerCode: '200', providerMsg: 'SMS OK (mô phỏng)', sentAt: F.nowISO(), fallbackOfId: m.id, retryOfId: null, attempt: 1, createdAt: undefined, source: 'user' })); m.fallback = 'sms'; sms++; }); // AC-ZAL-04-1: tối đa 1 fallback / sự kiện (OI-21)
    St.audit('retry', 'zaloBatch', id, 'Thử lại ' + targets.length + ' tin (403/408) của ' + b.code + (perm.length ? ' – bỏ qua ' + perm.length + ' tin lỗi vĩnh viễn (300)' : '') + (sms ? ' – fallback SMS ' + sms : '')); b.status = 'sending'; done(); X.resumeBatch(id); return targets.length;
  };
  X.saveZaloPolicy = (d) => { need2(); Au.need('zaloConfig'); St.state.meta.zaloPolicy = { maxRetry: F.clamp(F.num(d.maxRetry) || 3, 1, 5), gapMinutes: F.num(d.gapMinutes) || 15, retryCodes: (d.retryCodes || ['403', '408']).map(String).filter(c => c !== '300'), fallbackSms: !!d.fallbackSms }; St.audit('save', 'zaloPolicy', null, 'Lưu chính sách retry Zalo'); done(); return St.state.meta.zaloPolicy; };
  X.setTemplateApproval = (id, approval) => { need2(); Au.need('zaloConfig'); const t = St.get('zaloTemplates', id); t.approval = approval; t.approvedAt = approval === 'approved' ? F.nowISO() : null; done(); return t; };

  /* ================= Data Jobs ================= */
  const jobTimers = {};
  X.resumeJobs = () => St.where('importJobs', j => j.status === 'running').forEach(j => { if (jobTimers[j.id]) return; jobTimers[j.id] = setInterval(() => { const job = St.get('importJobs', j.id); if (!job || job.status !== 'running') { clearInterval(jobTimers[j.id]); delete jobTimers[j.id]; return; } job.progress = Math.min(100, (job.progress || 0) + 5); if (job.progress >= 100) { job.status = job.failed ? 'partial' : 'done'; job.updatedAt = F.nowISO(); (job.attempts = job.attempts || []).forEach(a => { if (a.status === 'running') a.status = job.status; }); clearInterval(jobTimers[j.id]); delete jobTimers[j.id]; St.audit('finish', 'importJobs', job.id, 'Tác vụ ' + job.code + ' hoàn tất'); } St.save(); St.emit('change', { source: 'timer' }); }, 900); });
  X.cancelJob = (id) => { need2(); Au.need('dataJobs.manage'); const j = St.get('importJobs', id); if (j.status !== 'running') err('Chỉ hủy tác vụ đang chạy'); j.status = 'cancelled'; j.updatedAt = F.nowISO(); St.audit('cancel', 'importJobs', id, 'Hủy tác vụ ' + j.code); done(); };
  const recheckLine = (j, l) => { const d = l.data || {};
    if (j.type === 'meter') { const room = St.one('rooms', x => x.code === d.roomCode); if (!room) return ['failed', 'Không tìm thấy phòng trong hệ thống']; if (d.electricCurr == null || d.electricCurr === '' || d.electricCurr === '-') return ['failed', 'Thiếu chỉ số điện']; if (F.num(d.waterCurr) === 0) return ['check', 'Chỉ số nước bằng 0']; if (St.one('meterReadings', m => m.roomId === room.id && m.period === d.period && m.status === 'used')) return ['skipped', 'Đã lập hóa đơn kỳ này']; return ['ok', '']; }
    if (j.type === 'statement') { const r = X.matchStatement([{ i: l.i, data: d }])[0]; l.invoiceId = r.invoiceId; l.alloc = r.alloc; return [r.status === 'matched' ? 'ok' : r.status === 'check' ? 'check' : r.status === 'duplicate' ? 'skipped' : 'failed', r.reason]; }
    if (j.type === 'tenant') { if (!d.phone) return ['failed', 'Thiếu SĐT']; if (St.one('tenants', t => t.phone.replace(/\s/g, '') === String(d.phone).replace(/\s/g, ''))) return ['skipped', 'Đã có khách với SĐT này']; if (d.roomCode && !St.one('rooms', r => r.code === d.roomCode)) return ['check', 'Phòng ' + d.roomCode + ' không tồn tại']; return ['ok', '']; }
    if (j.type === 'lead') { if (!d.phone) return ['failed', 'Thiếu SĐT']; if (St.one('leads', x => x.phone.replace(/\s/g, '') === String(d.phone).replace(/\s/g, ''))) return ['skipped', 'Trùng SĐT lead']; return ['ok', '']; }
    if (j.type === 'opening') { const c = St.one('contracts', x => x.code === (d.contractCode || '').trim()); if (!c) return ['failed', 'Không tìm thấy hợp đồng']; return ['ok', '']; }
    if (j.type === 'room') { const b = St.one('buildings', x => x.code === d.buildingCode || x.name === d.buildingCode); if (!b) return ['failed', 'Tòa không tồn tại']; if (St.one('rooms', x => x.buildingId === b.id && x.code === d.code)) return ['skipped', 'Đã có phòng']; return ['ok', '']; }
    return [l.status, l.reason]; };
  X.recheckJob = (id) => { need2(); Au.need('dataJobs.manage'); const j = St.get('importJobs', id); if (!j) err('Không tìm thấy tác vụ'); let changed = 0; (j.lines || []).forEach(l => { if (!['failed', 'check'].includes(l.status)) return; const [s, reason] = recheckLine(j, l); if (s !== l.status || reason !== l.reason) { l.prevStatus = l.status; l.status = s === 'ok' ? 'ready' : s; l.reason = reason; changed++; } }); j.updatedAt = F.nowISO(); St.audit('recheck', 'importJobs', id, 'Kiểm tra lại ' + j.code + ': ' + changed + ' dòng đổi trạng thái'); done(); return changed; };
  X.retryJob = (id) => {
    need2(); Au.need('dataJobs.manage'); const j = St.get('importJobs', id); if (!j) err('Không tìm thấy tác vụ'); const ready = (j.lines || []).filter(l => l.status === 'ready'); if (!ready.length) err('Không có dòng đủ điều kiện – bấm "Kiểm tra lại" sau khi chỉnh dữ liệu nguồn');
    let ok = 0, failed = 0; const n = (j.attempts || []).length + 1;
    ready.forEach(l => { const d = l.data; try {
      if (j.type === 'meter') { const room = St.one('rooms', x => x.code === d.roomCode); ['electric', 'water'].forEach(tp => { const curr = F.num(d[tp + 'Curr']); if (!curr) return; if (St.one('meterReadings', m => m.roomId === room.id && m.period === d.period && m.type === tp)) return; St.add('meterReadings', { roomId: room.id, period: d.period, type: tp, prev: F.num(d[tp + 'Prev']), curr, status: 'draft', enteredBy: me(), jobId: j.id, lineHash: l.hash }); }); l.link = '#/rooms/' + room.id; }
      else if (j.type === 'statement') { const inv = St.get('invoices', l.invoiceId); const p = X.recordPayment({ tenantId: inv.tenantId, date: d.date, amount: F.num(d.amount), method: d.method || 'Chuyển khoản', ref: d.refCode || '', evidence: j.fileName, note: 'Bảng kê ' + j.fileName + ' (thử lại #' + n + ')', allocations: [{ invoiceId: inv.id, amount: l.alloc || Math.min(F.num(d.amount), Q.invRemaining(inv)) }] }, 'st:' + j.checksum + ':' + l.hash); p.kind = 'statement'; l.link = '#/payments/' + p.id; }
      else if (j.type === 'tenant') { const t = St.add('tenants', { code: St.nextCode('tenants', 'KH', 5), name: d.name, phone: d.phone, zalo: d.zalo || d.phone, email: d.email || '', idNumber: d.idNumber || '', dob: '', job: d.job || '', segment: '', verified: false, managerId: me(), note: 'Import ' + j.fileName + ' (thử lại)' }); l.link = '#/tenants/' + t.id; }
      else if (j.type === 'lead') { const l2 = St.add('leads', { code: St.nextCode('leads', 'LD-' + yearCode() + '-', 3), name: d.name, phone: d.phone, email: d.email || '', sourceId: St.all('leadSources')[0].id, channel: 'Import', roomType: '', people: 1, budgetMin: F.num(d.budget), budgetMax: 0, buildingIds: [], moveInDate: '', saleId: me(), status: 'new', temp: 'warm', note: d.note || '', lostReason: '', tenantId: null, updatedAt: F.nowISO() }); appendLead(l2); l.link = '#/crm/leads/' + l2.id; }
      else if (j.type === 'room') { const b = St.one('buildings', x => x.code === d.buildingCode || x.name === d.buildingCode); const rm = St.add('rooms', { code: d.code, buildingId: b.id, floor: F.num(d.floor) || 1, type: d.type || 'Phòng đơn', area: F.num(d.area) || 20, price: F.num(d.price), physical: 'good', status: 'ready', managerId: b.managerId, direction: '', furniture: 'Cơ bản', defaultServiceIds: [] }); l.link = '#/rooms/' + rm.id; }
      else if (j.type === 'opening') { const r = X.reconcileOpening([{ i: l.i, data: d }], j.asOf)[0]; if (!r.contractId) throw new Error(r.reason); if (r.done) throw new Error('Đã chuyển số dư mốc này'); if (r.status === 'check') throw new Error(r.reason); r.selected = true; r.useSource = 'file'; const c = St.get('contracts', r.contractId); const res = applyOpeningLine(c, r, j.asOf, F.period(j.asOf), j.fileName); l.link = res.inv ? '#/invoices/' + res.inv.id : '#/contracts/' + c.id; }
      else { throw new Error('Loại dữ liệu chưa hỗ trợ thử lại'); }
      l.status = 'ok'; l.reason = 'Thử lại #' + n + ' thành công'; ok++; } catch (e) { l.status = 'failed'; l.reason = e.message; failed++; } });
    j.ok = (j.lines || []).filter(l => l.status === 'ok').length; j.failed = (j.lines || []).filter(l => ['failed', 'check'].includes(l.status)).length; j.valid = j.ok; j.error = j.failed; j.status = j.failed ? 'partial' : 'done'; j.progress = 100; j.updatedAt = F.nowISO();
    (j.attempts = j.attempts || []).push({ n, at: F.nowISO(), by: me(), total: ready.length, ok, failed, status: failed ? 'partial' : 'done', note: 'Thử lại các dòng đủ điều kiện sau khi đã chỉnh sửa dữ liệu nguồn.' });
    St.audit('retry', 'importJobs', id, 'Thử lại ' + j.code + ' lần #' + n + ': ' + ok + ' thành công, ' + failed + ' lỗi'); done(); return { ok, failed };
  };
  X.editJobLine = (id, i, data) => { need2(); Au.need('dataJobs.manage'); const j = St.get('importJobs', id); const l = (j.lines || []).find(x => x.i === i); if (!l) err('Không tìm thấy dòng'); l.data = Object.assign({}, l.data, data); l.src = Object.values(l.data).map(v => v == null || v === '' ? '-' : v).join(' | '); l.hash = F.hash(j.type + ':' + JSON.stringify(l.data)); l.status = 'failed'; l.reason = 'Đã sửa dữ liệu nguồn – bấm Kiểm tra lại'; done(); return l; };
  X.skipJobLine = (id, i) => { need2(); const j = St.get('importJobs', id); const l = (j.lines || []).find(x => x.i === i); if (l) { l.status = 'skipped'; l.reason = 'Bỏ qua thủ công'; } done(); };
  X.saveFilterPreset = (route, name, query) => { need2(); req(name, 'Đặt tên bộ lọc'); const m = St.state.meta; m.savedFilters = m.savedFilters || {}; (m.savedFilters[route] = m.savedFilters[route] || []).push({ id: F.uid('flt'), name, query, at: F.nowISO() }); St.save(); return m.savedFilters[route]; };
  X.removeFilterPreset = (route, id) => { const m = St.state.meta; if (m.savedFilters && m.savedFilters[route]) m.savedFilters[route] = m.savedFilters[route].filter(x => x.id !== id); St.save(); };
  X.setReportFavorite = (key, on) => { need2(); const p = St.state.meta.reportPrefs = St.state.meta.reportPrefs || { favorites: [], recent: [] }; p.favorites = (p.favorites || []).filter(k => k !== key); if (on) p.favorites.push(key); St.save(); return p; };
  X.touchReport = (key) => { const p = St.state.meta.reportPrefs = St.state.meta.reportPrefs || { favorites: [], recent: [] }; p.recent = [[key, F.nowISO()]].concat((p.recent || []).filter(x => x[0] !== key)).slice(0, 12); St.save(); };
})(window.TH);
