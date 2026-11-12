// Task sẵn sàng cook, plan khai đúng một file: đo việc gate KHÔNG chặn nhầm.
import { scaffoldTask, writeCancelOrderTask, setStatus, commit, PLANNED } from '../scaffold-lib.mjs';

const task = scaffoldTask('BE-70-cancel', { withSource: true });
writeCancelOrderTask(task);
setStatus(task, { ...PLANNED, current_mode: 'planning-mode', next_mode: 'cook' });
commit('plan ready');
