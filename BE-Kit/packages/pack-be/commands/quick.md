---
description: Làm nhanh task backend nhỏ, rõ scope, rủi ro thấp (không đổi DB, không breaking API) trong một lượt, đi thẳng tới PR.
argument-hint: <task-folder> <việc cần làm>
---

Làm nhanh task BE: $ARGUMENTS

Chỉ dùng khi tất cả đều đúng: requirement rõ, không có câu hỏi, sửa ít file trong một module, **không đổi schema/dữ liệu DB**, **không breaking API**, không đụng auth/thanh toán/bảo mật. Một điều kiện sai thì dừng và chuyển sang `BE plan`.

1. Ghi bảng `File sẽ tạo / cập nhật` ngắn trong `planning/implementation-plan.md`; đặt `api_change_type` (`none`/`additive`) và `db_change_required: false` trong `tracking/workflow-status.md`.
2. Code, chỉ trong các file đó.
3. Tự review theo rule và ghi `output/review-report.md`.
4. Chạy thật typecheck/lint/test của dự án, ghi `output/test-summary.md` (Command evidence log).
5. Cập nhật `tracking/workflow-status.md`: `current_mode: quick-mode`, `review_status: passed`, `test_status`, `next_mode: pr`.
