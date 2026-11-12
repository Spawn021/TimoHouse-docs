## Mức kiểm tra (<TOOL_LABEL>)

<TOOL_LABEL> không có MCP hay hook của BE-Kit: gate chỉ được kiểm khi chạy CLI `bin/be-kit.mjs` (do `be-kit init` cài).

- Bắt đầu mỗi mode: `node bin/be-kit.mjs mode begin <task-folder> <mode> --actor <ACTOR>`. Lệnh in verdict, artifact bắt buộc và nguyên văn rule của mode. Exit 1 là bị chặn: chỉ cập nhật `tracking/workflow-status.md` theo prompt được in ra rồi dừng, không sửa source.
- Trước khi kết thúc mỗi mode: `node bin/be-kit.mjs mode end <task-folder> <mode> --actor <ACTOR>`, sửa tới khi qua.
- Tạo task: `node bin/be-kit.mjs new-task BE-<id>-<slug>`. Trạng thái, bước tiếp theo: `status`, `next`.
- Trước khi mở PR: `node bin/be-kit.mjs validate-pr <task-folder> --base <nhánh-đích>`.
- Chưa chạy, hoặc lệnh báo lỗi, thì không ghi gate là passed.
