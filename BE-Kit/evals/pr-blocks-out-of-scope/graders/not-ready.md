---
type: regex
pattern: "^pr_status:\\s*\"?(ready|opened|merged)"
flags: m
match: not_contains
target:
  source: file
  path: docs/backend-tasks/BE-85-cancel/tracking/workflow-status.md
---
