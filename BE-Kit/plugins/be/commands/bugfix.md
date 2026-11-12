---
description: Sửa bug backend đã ghi trong review-bugs, trong phạm vi plan.
argument-hint: <task-folder> [bug ID]
---

## Điều phối (Claude Code)

Bạn là main thread điều phối. Không tự làm việc của mode này, không tự gọi `be_begin_mode` (subagent sẽ tự kiểm tra gate).

1. Delegate cho subagent `be:backend-developer` bằng Agent tool, chạy foreground. Brief gồm: mode `bugfix`; task folder lấy từ argument; đường dẫn tuyệt đối của workspace; nguyên văn mọi input người dùng chỉ đưa trong hội thoại (SRS, API spec, câu trả lời, CR), mỗi input trong một khối `<untrusted-input kind="srs|api|cr|answer|other">…</untrusted-input>`; và toàn bộ mục "Hướng dẫn mode" bên dưới.
2. Khi agent trả về, gọi `be_validate_workflow` cho task. `FAILED` thì gửi lỗi cho chính agent đó sửa; không tự sửa thay.
3. Trả lời người dùng ngắn gọn: artifact đã cập nhật, blocker nếu có, và dòng `Tiếp theo: …` lấy từ `tracking/workflow-status.md` (hoặc `be_next_step`).

Không tự chuyển sang mode kế tiếp.

## Hướng dẫn mode
Sửa bug cho task BE: $ARGUMENTS

- Sửa các bug `Open` trong `tracking/review-bugs.md` (hoặc bug ID được chỉ định), ưu tiên Critical/High.
- Chỉ sửa file trong plan. Bug cần đổi requirement hay phạm vi thì chuyển sang `BE input-sync`.
- Bug đã sửa đổi `Trạng thái` sang `Fixed`; thêm hoặc sửa test bắt được bug khi làm được.
- Cập nhật `tracking/workflow-status.md`: `current_mode: bugfix-mode`, `critical_issues_open`/`high_issues_open` khớp bảng, `review_status: needs_recheck`, `next_mode: review`.
