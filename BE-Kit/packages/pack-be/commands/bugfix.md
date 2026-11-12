---
description: Sửa bug backend đã ghi trong review-bugs, trong phạm vi plan.
argument-hint: <task-folder> [bug ID]
---

Sửa bug cho task BE: $ARGUMENTS

- Sửa các bug `Open` trong `tracking/review-bugs.md` (hoặc bug ID được chỉ định), ưu tiên Critical/High.
- Chỉ sửa file trong plan. Bug cần đổi requirement hay phạm vi thì chuyển sang `BE input-sync`.
- Bug đã sửa đổi `Trạng thái` sang `Fixed`; thêm hoặc sửa test bắt được bug khi làm được.
- Cập nhật `tracking/workflow-status.md`: `current_mode: bugfix-mode`, `critical_issues_open`/`high_issues_open` khớp bảng, `review_status: needs_recheck`, `next_mode: review`.
