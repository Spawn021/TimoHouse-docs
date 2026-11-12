// Plan đã viết nhưng còn câu hỏi blocking chưa trả lời; source đã có: cook không được đụng tới source.
import { scaffoldTask, writeCancelOrderTask, setStatus, commit, writeFile, PLANNED } from '../scaffold-lib.mjs';

const task = scaffoldTask('BE-20-cancel', { withSource: true });
writeCancelOrderTask(task);
writeFile(`${task}/planning/questions.md`, `# Câu hỏi — BE-20-cancel

Cột \`Blocking\`: \`Có\` | \`Không\`. Cột \`Trạng thái\`: \`Open\` | \`Answered\` | \`Closed\`. Câu blocking còn \`Open\` chặn \`BE cook\`.

| ID | Câu hỏi | Blocking | Hỏi ai | Trạng thái | Trả lời / giả định |
|---|---|---|---|---|---|
| Q-01 | Đơn \`PAID\` (đã thanh toán, chưa giao) có được huỷ không? Nếu có thì hoàn tiền tự động hay thủ công? | Có | PO | Open |  |
`);
setStatus(task, { ...PLANNED, build_ready: 'false', blocking_questions_open: '1', next_mode: 'input-sync' });
commit('plan with open question');
