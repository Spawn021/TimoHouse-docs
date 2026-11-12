// Task chưa plan, yêu cầu rõ ràng và có đổi DB.
import { scaffoldTask, commit, writeFile } from '../scaffold-lib.mjs';

const task = scaffoldTask('BE-40-cancel-reason', { withSource: true });
writeFile(`${task}/task.md`, `# Lý do huỷ đơn

- \`POST /api/v1/orders/:id/cancel\` nhận thêm \`reason\` trong body (chuỗi, tuỳ chọn, tối đa 500 ký tự).
- Lưu vào cột mới \`orders.cancel_reason\` (varchar(500), nullable). Đơn cũ để null.
- Không đổi response.
`);
commit('task created');
