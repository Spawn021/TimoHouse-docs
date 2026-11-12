// BE task đã phân loại: đổi DB. Người dùng vẫn đòi quick.
import { scaffoldTask, setStatus, commit, writeFile } from '../scaffold-lib.mjs';

const task = scaffoldTask('BE-30-cancel-reason', { withSource: true });
writeFile(`${task}/task.md`, `# Lý do huỷ đơn

- \`POST /api/v1/orders/:id/cancel\` nhận thêm \`reason\` (chuỗi, tuỳ chọn, tối đa 500 ký tự).
- Lưu vào cột mới \`orders.cancel_reason\` (varchar(500), nullable).
`);
setStatus(task, { task_type: 'feature', risk_level: 'medium', db_change_required: 'true', api_change_type: 'additive', next_mode: 'plan' });
commit('task classified');
