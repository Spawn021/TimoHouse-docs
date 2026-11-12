// Đổi tên field response: breaking với client mobile (api-context.md đã ghi).
import { scaffoldTask, commit, writeFile } from '../scaffold-lib.mjs';

const task = scaffoldTask('BE-50-rename-total', { withSource: true });
writeFile(`${task}/task.md`, `# Đổi tên field total

- Trong response \`GET /api/v1/orders/:id\`, đổi tên field \`total\` thành \`totalAmount\` cho thống nhất với tài liệu API mới.
- Không đổi DB.
`);
commit('task created');
