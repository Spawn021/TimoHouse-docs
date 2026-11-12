---
type: llm
focus:
  source: file
  path: docs/backend-tasks/BE-50-rename-total/planning/implementation-plan.md
---

PASS nếu plan nêu đây là breaking change với client đang dùng `total`, và đề xuất cách tương thích cụ thể (vd trả song song `total` và `totalAmount` trong một thời gian, version API, lịch deprecate), đồng thời ghi rõ cách này cần được duyệt.
FAIL nếu plan coi thay đổi là additive/không ảnh hưởng, hoặc chỉ đổi tên thẳng không có phương án tương thích.
