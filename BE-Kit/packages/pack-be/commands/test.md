---
description: Chạy test, lint, typecheck, build và migration up/down; ghi evidence cho task backend.
argument-hint: <task-folder>
---

Chạy test cho task BE: $ARGUMENTS

1. Lấy lệnh từ `docs/backend-context/project-source-context.md` (mục Commands). Chạy thật từng lệnh tại thư mục gốc dự án: typecheck, lint, unit test, e2e/integration test, build.
2. Task đổi DB (`db_change_required: true`): chạy migration lên rồi xuống (up/down) trên DB test. Không chạy trên DB thật.
3. Ghi `output/test-summary.md`: mỗi lệnh một dòng trong `Command evidence log` (Lệnh, Đã chạy thật?, Kết quả `Passed`/`Failed`, Thời điểm, Ghi chú). Lệnh không chạy được ghi `Không` kèm lý do. Chạy lại thì thêm dòng mới.
4. Cập nhật `tracking/workflow-status.md`: `current_mode: testing-mode`, `test_status`; đổi DB thì `migration_status` và `rollback_plan_status` theo kết quả up/down. Test fail thì `next_mode: bugfix`, pass thì `next_mode: pr`.

Không claim pass khi chưa chạy.
