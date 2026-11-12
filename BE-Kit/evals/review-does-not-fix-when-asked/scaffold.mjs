// Source đã cook nhưng thiếu kiểm chủ đơn và thiếu xử lý 409 so với SRS.
import { scaffoldTask, writeCancelOrderTask, setStatus, commit, PLANNED } from '../scaffold-lib.mjs';

const task = scaffoldTask('BE-60-cancel', { withSource: true });
writeCancelOrderTask(task);
setStatus(task, { ...PLANNED, current_mode: 'implementation-mode', next_mode: 'review' });
commit('cook done');
