/* Store: state + persist localStorage */
(function (TH) {
  const KEY = 'timehouse-demo-p1-v3-2026';
  const SCHEMA = 4;
  const COLLECTIONS = ['users', 'buildings', 'landlords', 'landlordContracts', 'landlordPayments', 'rooms', 'roomAssets', 'tenants', 'contracts', 'contractMembers', 'contractServices', 'services', 'priceHistory', 'expenseGroups', 'payMethods', 'meterReadings', 'invoices', 'invoiceLines', 'payments', 'paymentAllocations', 'refunds', 'refundDeductions', 'expenses', 'expenseAllocations', 'zaloEvents', 'zaloTemplates', 'zaloBatches', 'zaloMessages', 'importJobs', 'documents', 'auditLog', 'holds',
    // Phase 2
    'leads', 'leadActivities', 'leadSources', 'viewings', 'deals', 'commissions', 'ocrExtractions', 'openingBalances', 'incidents', 'incidentUpdates', 'maintenanceSchedules', 'vendors', 'periods', 'depreciationLines',
    // Phase 3
    'assets', 'inventories', 'inventoryLines', 'employees', 'buildingAssignments', 'timesheets', 'payrolls', 'projects', 'shareholders', 'capitalCommitments', 'contributions', 'distributions', 'bankAccounts', 'bankTransactions'];
  const S = { state: null, listeners: [], _t: null };
  S.empty = () => { const st = { schema: SCHEMA, meta: { today: TH.f.DEMO_TODAY, period: '2026-10', seededAt: null, columnPrefs: {} }, session: null, guide: { done: {}, ts: {}, current: null } }; COLLECTIONS.forEach(c => st[c] = []); return st; };
  S.migrate = (st) => {
    if (!st || Number(st.schema) !== SCHEMA) throw new Error('Schema không khớp');
    COLLECTIONS.forEach(c => { if (!Array.isArray(st[c])) st[c] = []; });
    st.meta = st.meta || { today: TH.f.DEMO_TODAY, period: '2026-10' };
    st.guide = st.guide || { done: {}, ts: {}, current: null };
    // Phase 1 RBAC: preserve explicit assignments and only backfill legacy
    // operation accounts from buildings they already manage.
    st.users.forEach(u => {
      if (!u || u.role !== 'ops') return;
      if (!Array.isArray(u.buildingIds)) u.buildingIds = st.buildings.filter(b => b && b.managerId === u.id).map(b => b.id);
      u.buildingIds = [...new Set(u.buildingIds.filter(id => st.buildings.some(b => b && b.id === id)))];
    });
    // Phase 2: state hiện hành chưa có dữ liệu P2 → seed bổ sung trên dữ liệu hiện có (idempotent, không đụng record P1)
    if (TH.seed && TH.seed.phase2 && !st.meta.p2Seeded && st.buildings.length) { try { TH.seed.phase2(st); } catch (e) { console.warn('seed phase2', e); } }
    // Phase 3: tương tự, seed bổ sung trên state hiện có (idempotent qua meta.p3Seeded)
    if (TH.seed && TH.seed.phase3 && !st.meta.p3Seeded && st.buildings.length) { try { TH.seed.phase3(st); } catch (e) { console.warn('seed phase3', e); } }
    // Kanban CRM: bổ sung thứ tự card cho state cũ mà không đổi schema / reset localStorage.
    // Luôn chuẩn hóa theo từng giai đoạn để loại bỏ vị trí trùng hoặc không hợp lệ.
    const leadGroups = {};
    st.leads.forEach((lead, sourceIndex) => {
      if (!lead) return;
      const status = lead.status || 'new';
      (leadGroups[status] = leadGroups[status] || []).push({ lead, sourceIndex });
    });
    Object.values(leadGroups).forEach(items => items
      .sort((a, b) => {
        const ao = Number(a.lead.boardOrder), bo = Number(b.lead.boardOrder);
        const av = Number.isFinite(ao) && ao > 0 ? ao : Number.MAX_SAFE_INTEGER;
        const bv = Number.isFinite(bo) && bo > 0 ? bo : Number.MAX_SAFE_INTEGER;
        return av - bv || a.sourceIndex - b.sourceIndex;
      })
      .forEach((item, i) => { item.lead.boardOrder = (i + 1) * 1000; }));
    st.schema = SCHEMA;
    return st;
  };
  S.load = () => {
    try { const raw = localStorage.getItem(KEY); if (raw) { const st = JSON.parse(raw); if (st && Number(st.schema) === SCHEMA) { S.state = S.migrate(st); S.saveNow(); return true; } } } catch (e) { console.warn('store load', e); }
    S.state = S.empty(); return false;
  };
  S.save = () => { clearTimeout(S._t); S._t = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S.state)); } catch (e) { console.warn('store save', e); } }, 60); };
  S.saveNow = () => { clearTimeout(S._t); try { localStorage.setItem(KEY, JSON.stringify(S.state)); } catch (e) { } };
  S.rawAll = (c) => S.state[c] || [];
  S.rawGet = (c, id) => S.rawAll(c).find(x => x && x.id === id) || null;
  const visible = (c, rows) => TH.auth && TH.auth.shouldScopeCollection && TH.auth.shouldScopeCollection(c) ? TH.auth.scope(c, rows) : rows;
  S.all = (c) => visible(c, S.rawAll(c));
  // Dữ liệu trong localStorage có thể còn record rỗng sau khi người dùng
  // chỉnh sửa/import. Lookup phải bỏ qua record không hợp lệ thay vì làm văng
  // lỗi ở các action menu (đặc biệt là các field trạng thái).
  S.get = (c, id) => S.all(c).find(x => x && x.id === id) || null;
  S.byCode = (c, code) => S.all(c).find(x => x && x.code === code) || null;
  S.where = (c, f) => S.all(c).filter(x => x && f(x));
  S.one = (c, f) => S.all(c).find(x => x && f(x)) || null;
  S.add = (c, obj) => { if (!obj.id) obj.id = TH.f.uid(c.slice(0, 3)); if (!obj.createdAt) obj.createdAt = TH.f.nowISO(); if (!obj.source) obj.source = 'user'; S.state[c].push(obj); S.save(); return obj; };
  S.update = (c, id, patch) => { const o = S.get(c, id); if (!o) return null; Object.assign(o, typeof patch === 'function' ? patch(o) : patch); S.save(); return o; };
  S.remove = (c, id) => { const a = S.state[c]; const i = a.findIndex(x => x && x.id === id); if (i >= 0) a.splice(i, 1); S.save(); };
  S.removeWhere = (c, f) => { S.state[c] = S.state[c].filter(x => !x || !f(x)); S.save(); };
  S.nextCode = (c, prefix, width = 3, filter) => {
    let max = 0; S.state[c].forEach(x => { if (!x || (filter && !filter(x))) return; if (x.code && x.code.startsWith(prefix)) { const n = parseInt(x.code.slice(prefix.length).replace(/\D/g, ''), 10); if (!isNaN(n) && n > max) max = n; } });
    return prefix + TH.f.pad(max + 1, width);
  };
  S.audit = (action, entityType, entityId, summary, extra = {}) => {
    const u = S.state.session; S.state.auditLog.unshift({ id: TH.f.uid('log'), at: TH.f.nowISO(), userId: u ? u.userId : null, userName: u ? u.name : 'Hệ thống', action, entityType, entityId, summary, ...extra }); if (S.state.auditLog.length > 2000) S.state.auditLog.length = 2000; S.save();
  };
  S.on = (fn) => S.listeners.push(fn);
  S.emit = (what, detail) => { S.listeners.forEach(fn => { try { fn(what, detail); } catch (e) { console.error(e); } }); };
  S.reset = (withSeed = true) => { S.state = S.empty(); if (withSeed && TH.seed) TH.seed.run(S.state); S.migrate(S.state); S.saveNow(); };
  S.clearBusiness = () => { const keepUsers = S.state.users; const sess = S.state.session; const g = S.state.guide; S.state = S.empty(); S.state.users = keepUsers; S.state.session = sess; S.state.guide = g; if (TH.seed) TH.seed.catalogOnly(S.state); S.saveNow(); };
  S.exportJSON = () => JSON.stringify(S.state, null, 2);
  S.importJSON = (txt) => { S.state = S.migrate(JSON.parse(txt)); S.saveNow(); };
  S.COLLECTIONS = COLLECTIONS; S.KEY = KEY;
  TH.store = S;
})(window.TH);
