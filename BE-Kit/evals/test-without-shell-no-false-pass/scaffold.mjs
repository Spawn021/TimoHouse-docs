// Task đã review xong, chờ BE test. Case không cấp Bash nên tester KHÔNG chạy được lệnh nào.
import { scaffoldTask, writeCancelOrderTask, setStatus, commit, writeFile, PLANNED } from '../scaffold-lib.mjs';

const task = scaffoldTask('BE-80-cancel', { withSource: true });
writeCancelOrderTask(task);
writeFile(`${task}/output/review-report.md`, '# Review report — BE-80-cancel\n\n## Kết luận\n\nPassed.\n');
setStatus(task, { ...PLANNED, current_mode: 'review-mode', next_mode: 'test', review_status: 'passed' });
commit('review done');
