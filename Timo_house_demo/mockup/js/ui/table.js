/* DataTable: sort / phân trang / checkbox / row menu. Render vào container. */
(function (TH) {
  const F = TH.f, U = TH.ui, I = TH.icon, esc = F.esc;
  /**
   * opts: { cols:[{key,label,render(row),sortable,num,sortVal(row),cls,hideable}], rows, pageSize, selectable, rowKey, rowClass(row), unit, empty, compact, editable,
   *         onSelect(ids), sortKey, sortDir, id (để lưu cột ẩn), footer(html), extraFooter, noPager, colPrefsKey }
   */
  U.table = (container, opts) => {
    if (container.classList && container.classList.contains('card')) { if (!container._tblWrap) { container._tblWrap = document.createElement('div'); container.appendChild(container._tblWrap); } container = container._tblWrap; }
    const st = container._tbl = container._tbl || { page: 1, size: opts.pageSize || 10, sortKey: opts.sortKey || null, sortDir: opts.sortDir || 'asc', selected: new Set(), hidden: new Set(prefs(opts.colPrefsKey)) };
    st.opts = opts;
    const render = () => {
      const o = st.opts; let rows = o.rows.slice();
      if (st.sortKey) { const col = o.cols.find(c => c.key === st.sortKey); const sv = (r) => col && col.sortVal ? col.sortVal(r) : r[st.sortKey]; rows.sort((a, b) => { const x = sv(a), y = sv(b); const c = (x == null) - (y == null) || (typeof x === 'number' && typeof y === 'number' ? x - y : String(x ?? '').localeCompare(String(y ?? ''), 'vi')); return st.sortDir === 'asc' ? c : -c; }); }
      const total = rows.length, pages = Math.max(1, Math.ceil(total / st.size)); if (st.page > pages) st.page = pages;
      const from = (st.page - 1) * st.size; const pageRows = o.noPager ? rows : rows.slice(from, from + st.size);
      const cols = o.cols.filter(c => !st.hidden.has(c.key));
      const key = (r) => o.rowKey ? o.rowKey(r) : r.id;
      const allSel = pageRows.length && pageRows.every(r => st.selected.has(key(r)));
      const head = `<tr>${o.selectable ? `<th style="width:36px"><input type="checkbox" data-act="tsel-all" ${allSel ? 'checked' : ''}></th>` : ''}${cols.map(c => `<th class="${c.num ? 'num' : ''} ${c.sortable ? 'sortable' : ''} ${st.sortKey === c.key ? 'sorted' : ''} ${c.cls || ''}" ${c.sortable ? `data-act="tsort" data-key="${c.key}"` : ''} ${c.width ? `style="width:${c.width}"` : ''}>${c.label}${c.sortable ? `<span class="sort">${st.sortKey === c.key ? (st.sortDir === 'asc' ? '↑' : '↓') : '⇅'}</span>` : ''}</th>`).join('')}</tr>`;
      const body = pageRows.length ? pageRows.map((r, i) => `<tr data-rk="${esc(key(r))}" class="${o.rowClass ? o.rowClass(r) : ''} ${st.selected.has(key(r)) ? 'selected' : ''}">${o.selectable ? `<td><input type="checkbox" data-act="tsel" data-k="${esc(key(r))}" ${st.selected.has(key(r)) ? 'checked' : ''} ${o.selectableIf && !o.selectableIf(r) ? 'disabled' : ''}></td>` : ''}${cols.map(c => `<td class="${c.num ? 'num' : ''} ${c.cls || ''}">${c.render ? c.render(r, from + i) : esc(r[c.key] ?? '')}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${cols.length + (o.selectable ? 1 : 0)}">${o.empty || U.empty({ title: 'Không có dữ liệu phù hợp', text: 'Thử đổi bộ lọc hoặc tạo mới.' })}</td></tr>`;
      container.innerHTML = `<div class="tbl-wrap"><table class="tbl ${o.compact ? 'compact' : ''} ${o.editable ? 'editable' : ''}"><thead>${head}</thead><tbody>${body}</tbody>${o.footer ? `<tfoot>${o.footer(rows)}</tfoot>` : ''}</table></div>${o.noPager ? (o.extraFooter || '') : U.pager({ page: st.page, pages, total, from: from + 1, to: Math.min(from + st.size, total), unit: o.unit || 'bản ghi', size: st.size })}`;
      if (o.onRender) o.onRender(container, pageRows);
    };
    if (!container._bound) {
      container._bound = true;
      U.bind(container, {
        tsort: (el) => { const k = el.dataset.key; if (st.sortKey === k) st.sortDir = st.sortDir === 'asc' ? 'desc' : 'asc'; else { st.sortKey = k; st.sortDir = 'asc'; } render(); },
        page: (el) => { st.page = Number(el.dataset.p); render(); },
        'tsel-all': (el) => { const o = st.opts; const rows = visibleRows(); rows.forEach(r => { const k = o.rowKey ? o.rowKey(r) : r.id; if (o.selectableIf && !o.selectableIf(r)) return; if (el.checked) st.selected.add(k); else st.selected.delete(k); }); render(); o.onSelect && o.onSelect([...st.selected]); },
        tsel: (el) => { if (el.checked) st.selected.add(el.dataset.k); else st.selected.delete(el.dataset.k); const tr = el.closest('tr'); tr && tr.classList.toggle('selected', el.checked); st.opts.onSelect && st.opts.onSelect([...st.selected]); },
      }, 'change');
      U.bind(container, { page: (el) => { st.page = Number(el.dataset.p); render(); }, tsort: (el) => { const k = el.dataset.key; if (st.sortKey === k) st.sortDir = st.sortDir === 'asc' ? 'desc' : 'asc'; else { st.sortKey = k; st.sortDir = 'asc'; } render(); } });
      container.addEventListener('change', (e) => { if (e.target.matches('[data-act=psize]')) { st.size = Number(e.target.value); st.page = 1; render(); } });
    }
    const visibleRows = () => { const o = st.opts; const from = (st.page - 1) * st.size; return o.noPager ? o.rows : o.rows.slice(from, from + st.size); };
    render();
    return {
      render, selected: () => [...st.selected], clearSelection: () => { st.selected.clear(); render(); }, setRows: (rows) => { st.opts.rows = rows; st.page = 1; render(); },
      toggleCol: (key) => { if (st.hidden.has(key)) st.hidden.delete(key); else st.hidden.add(key); savePrefs(opts.colPrefsKey, [...st.hidden]); render(); }, hidden: () => [...st.hidden], state: st,
    };
  };
  function prefs(k) { if (!k) return []; try { return (TH.store.state.meta.columnPrefs || {})[k] || []; } catch (e) { return []; } }
  function savePrefs(k, v) { if (!k) return; TH.store.state.meta.columnPrefs = TH.store.state.meta.columnPrefs || {}; TH.store.state.meta.columnPrefs[k] = v; TH.store.save(); }
  U.columnMenu = (anchor, tbl, cols) => U.menu(anchor, [{ header: 'Hiển thị cột' }, ...cols.filter(c => c.hideable !== false && c.key !== 'actions').map(c => ({ label: (tbl.hidden().includes(c.key) ? '☐ ' : '☑ ') + c.label.replace(/<[^>]+>/g, ''), onClick: () => tbl.toggleCol(c.key) }))]);
  // cell helpers
  U.cell2 = (a, b, aCls = '') => `<div class="cell2"><span class="${aCls}">${a}</span>${b ? `<small>${b}</small>` : ''}</div>`;
  U.link = (href, text, cls = '') => `<a href="${href}" class="link ${cls}">${text}</a>`;
  U.money = U.money; U.num = (n, cls = '') => `<span class="num ${cls}">${TH.f.vnd(n)}</span>`;
  U.rowActions = (btns) => `<div class="acts">${btns.join('')}</div>`;
  U.moreBtn = (id, extra = '') => `<button type="button" class="btn-icon act" data-act="more" data-id="${esc(id)}" ${extra} data-tip="Thao tác khác" aria-label="Thao tác khác">${I('more')}</button>`;
})(window.TH);
