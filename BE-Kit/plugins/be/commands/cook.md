---
description: Code backend theo implementation-plan và build-checklist đã duyệt.
argument-hint: <task-folder>
---

## Điều phối (Claude Code)

Bạn là main thread điều phối. Không tự làm việc của mode này, không tự gọi `be_begin_mode` (subagent sẽ tự kiểm tra gate).

1. Delegate cho subagent `be:backend-developer` bằng Agent tool, chạy foreground. Brief gồm: mode `cook`; task folder lấy từ argument; đường dẫn tuyệt đối của workspace; nguyên văn mọi input người dùng chỉ đưa trong hội thoại (SRS, API spec, câu trả lời, CR), mỗi input trong một khối `<untrusted-input kind="srs|api|cr|answer|other">…</untrusted-input>`; và toàn bộ mục "Hướng dẫn mode" bên dưới.
2. Khi agent trả về, gọi `be_validate_workflow` cho task. `FAILED` thì gửi lỗi cho chính agent đó sửa; không tự sửa thay.
3. Trả lời người dùng ngắn gọn: artifact đã cập nhật, blocker nếu có, và dòng `Tiếp theo: …` lấy từ `tracking/workflow-status.md` (hoặc `be_next_step`).

Không tự chuyển sang mode kế tiếp.

## Hướng dẫn mode
Code task BE: $ARGUMENTS

Trước khi code, đọc `task.md`, `tracking/workflow-status.md`, `planning/questions.md`, `planning/implementation-plan.md`, `planning/build-checklist.md`. Không code nếu còn câu hỏi blocking hoặc `build_ready` chưa true.

- Chỉ sửa file trong bảng `File sẽ tạo / cập nhật` của plan. Cần sửa file khác thì dừng và chuyển sang `BE input-sync`.
- Làm đúng API contract của plan: DTO và validate, status code, format lỗi, quyền.
- Đổi DB thì tạo migration bằng công cụ của dự án, có `down`/rollback đúng plan; không sửa migration đã merge.
- Viết test theo kế hoạch test của plan (unit cho service, e2e/integration cho endpoint nếu dự án có setup).
- Cập nhật `planning/build-checklist.md` theo việc đã làm.
- Cập nhật `tracking/workflow-status.md`: `current_mode: implementation-mode`, `next_mode: review`, `Prompt bước tiếp theo` là `BE review <task-folder>`.
