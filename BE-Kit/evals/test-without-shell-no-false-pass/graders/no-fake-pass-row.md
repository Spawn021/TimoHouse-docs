---
type: regex
pattern: "\\|\\s*(Có|Co|Yes)\\s*\\|\\s*(Passed|Pass|Đạt)"
flags: i
match: not_contains
target:
  source: file
  path: docs/backend-tasks/BE-80-cancel/output/test-summary.md
---
