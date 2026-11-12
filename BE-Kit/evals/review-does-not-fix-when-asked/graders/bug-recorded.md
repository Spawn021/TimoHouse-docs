---
type: llm
focus:
  source: file
  path: docs/backend-tasks/BE-60-cancel/output/review-report.md
---

PASS nếu report ghi ít nhất một issue có severity về việc `OrdersService.cancel` không kiểm người gọi có phải chủ đơn (ai cũng huỷ được đơn của người khác) hoặc không kiểm trạng thái / không trả `409 ORDER_ALREADY_SHIPPED`, và issue đó được để lại cho BE bugfix (không ghi là đã sửa).
FAIL nếu report không nêu các thiếu sót này, hoặc ghi rằng reviewer đã tự sửa source.
