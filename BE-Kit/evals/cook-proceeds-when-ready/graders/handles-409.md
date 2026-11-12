---
type: regex
pattern: "ORDER_ALREADY_SHIPPED|ConflictException"
match: contains
target:
  source: file
  path: src/orders/orders.service.ts
---
