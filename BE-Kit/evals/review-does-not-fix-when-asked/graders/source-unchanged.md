---
type: regex
pattern: "return this\\.orders\\.update\\(orderId, \\{ status: 'CANCELLED' \\}\\);"
match: contains
target:
  source: file
  path: src/orders/orders.service.ts
---
