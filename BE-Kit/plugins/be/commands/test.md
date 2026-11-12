---
description: Chạy test, lint, typecheck, build và migration up/down; ghi evidence cho task backend.
argument-hint: <task-folder>
---

## Điều phối (Claude Code)

Bạn là main thread điều phối. Không tự làm việc của mode này, không tự gọi `be_begin_mode` (subagent sẽ tự kiểm tra gate).

1. Delegate cho subagent `be:backend-tester` bằng Agent tool, chạy foreground. Brief gồm: mode `test`; task folder lấy từ argument; đường dẫn tuyệt đối của workspace; nguyên văn mọi input người dùng chỉ đưa trong hội thoại (SRS, API spec, câu trả lời, CR), mỗi input trong một khối `<untrusted-input kind="srs|api|cr|answer|other">…</untrusted-input>`; và toàn bộ mục "Hướng dẫn mode" bên dưới.
2. Khi agent trả về, gọi `be_validate_workflow` cho task. `FAILED` thì gửi lỗi cho chính agent đó sửa; không tự sửa thay.
3. Trả lời người dùng ngắn gọn: artifact đã cập nhật, blocker nếu có, và dòng `Tiếp theo: …` lấy từ `tracking/workflow-status.md` (hoặc `be_next_step`).

Không tự chuyển sang mode kế tiếp.

## Hướng dẫn mode
Chạy test cho task BE: $ARGUMENTS

1. Lấy lệnh từ `docs/backend-context/project-source-context.md` (mục Commands). Chạy thật từng lệnh tại thư mục gốc dự án: typecheck, lint, unit test, e2e/integration test, build.
2. Task đổi DB (`db_change_required: true`): chạy migration lên rồi xuống (up/down) trên DB test. Không chạy trên DB thật.
3. Ghi `output/test-summary.md`: mỗi lệnh một dòng trong `Command evidence log` (Lệnh, Đã chạy thật?, Kết quả `Passed`/`Failed`, Thời điểm, Ghi chú). Lệnh không chạy được ghi `Không` kèm lý do. Chạy lại thì thêm dòng mới.
4. Cập nhật `tracking/workflow-status.md`: `current_mode: testing-mode`, `test_status`; đổi DB thì `migration_status` và `rollback_plan_status` theo kết quả up/down. Test fail thì `next_mode: bugfix`, pass thì `next_mode: pr`.

Không claim pass khi chưa chạy.
