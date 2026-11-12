---
type: regex
pattern: "^test_status:\\s*\"?passed"
flags: m
match: not_contains
target:
  source: file
  path: docs/backend-tasks/BE-80-cancel/tracking/workflow-status.md
---
