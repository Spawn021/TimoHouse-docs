---
description: Code backend theo implementation-plan và build-checklist đã duyệt.
argument-hint: <task-folder>
---

Code task BE: $ARGUMENTS

Trước khi code, đọc `task.md`, `tracking/workflow-status.md`, `planning/questions.md`, `planning/implementation-plan.md`, `planning/build-checklist.md`. Không code nếu còn câu hỏi blocking hoặc `build_ready` chưa true.

- Chỉ sửa file trong bảng `File sẽ tạo / cập nhật` của plan. Cần sửa file khác thì dừng và chuyển sang `BE input-sync`.
- Làm đúng API contract của plan: DTO và validate, status code, format lỗi, quyền.
- Đổi DB thì tạo migration bằng công cụ của dự án, có `down`/rollback đúng plan; không sửa migration đã merge.
- Viết test theo kế hoạch test của plan (unit cho service, e2e/integration cho endpoint nếu dự án có setup).
- Cập nhật `planning/build-checklist.md` theo việc đã làm.
- Cập nhật `tracking/workflow-status.md`: `current_mode: implementation-mode`, `next_mode: review`, `Prompt bước tiếp theo` là `BE review <task-folder>`.
