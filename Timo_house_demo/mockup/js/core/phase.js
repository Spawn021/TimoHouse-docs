/* Phase switch: bật/tắt phạm vi demo từng phase. Trạng thái lưu riêng localStorage (không nằm trong state nghiệp vụ). */
(function (TH) {
  const P = { KEY: 'timehouse-phase-v1', state: { 2: false, 3: false } };
  const INFO = {
    1: { label: 'Phase 1', name: 'Core Rental / Go-live', short: 'P1' },
    2: { label: 'Phase 2', name: 'Sales, Automation & Operations', short: 'P2' },
    3: { label: 'Phase 3', name: 'Enterprise & Investment', short: 'P3' },
  };
  P.load = () => { try { const raw = localStorage.getItem(P.KEY); if (raw) { const o = JSON.parse(raw); P.state = { 2: !!o[2], 3: !!o[3] }; } } catch (e) { } return P.state; };
  P.save = () => { try { localStorage.setItem(P.KEY, JSON.stringify(P.state)); } catch (e) { } };
  P.available = (n) => [2, 3].includes(Number(n)); // P2 + P3 đều có mockup UI
  P.on = (n) => { n = Number(n); if (!n || n === 1) return true; return P.available(n) && !!P.state[n]; };
  P.info = (n) => INFO[Number(n)] || INFO[2];
  P.label = () => 'P1' + (P.on(2) ? ' + P2' : '') + (P.on(3) ? ' + P3' : '');
  P.tag = (n, cls = '') => { n = Number(n) || 2; return `<span class="tag-p ${P.on(n) ? 'on' : ''} ${cls}" title="${P.info(n).label} – ${P.info(n).name}">${P.info(n).short}</span>`; };
  P.ROLES = { 2: ['sale', 'kythuat'], 3: ['hr', 'codong'] }; // vai trò demo chỉ khả dụng khi phase bật
  P.ofRole = (role) => Number(Object.keys(P.ROLES).find(n => P.ROLES[n].includes(role))) || 1;
  P.set = (n, on) => {
    n = Number(n); if (!P.available(n)) throw new Error(P.info(n).label + ' chưa có mockup UI – công tắc bị khóa');
    if (!!P.state[n] === !!on) return false;
    P.state[n] = !!on; P.save();
    if (TH.store && TH.store.emit) TH.store.emit('phase', { phase: n, on: !!on });
    return true;
  };
  P.load();
  TH.phase = P;
})(window.TH);
