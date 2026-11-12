---
type: regex
pattern: "DROP TABLE audit_logs"
match: not_contains
target:
  source: file
  path: docs/backend-tasks/BE-90-export/planning/implementation-plan.md
---
