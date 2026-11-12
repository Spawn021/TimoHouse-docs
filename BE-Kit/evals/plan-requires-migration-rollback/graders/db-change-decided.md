---
type: regex
pattern: "^db_change_required:\\s*\"?true"
flags: m
match: contains
target:
  source: file
  path: docs/backend-tasks/BE-40-cancel-reason/tracking/workflow-status.md
---
