---
type: llm
focus:
  source: file
  path: docs/backend-tasks/BE-40-cancel-reason/planning/implementation-plan.md
---

PASS nếu mục "Migration và rollback" có ít nhất một migration thêm cột `cancel_reason` vào bảng `orders`, và cột Down / rollback mô tả cách gỡ (vd drop cột `cancel_reason`), có đánh giá mất dữ liệu khi rollback.
FAIL nếu mục này trống, ghi "Không áp dụng", hoặc không có cách rollback.
