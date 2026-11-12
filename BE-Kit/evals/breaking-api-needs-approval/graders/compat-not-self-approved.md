---
type: regex
pattern: "^api_compat_status:\\s*\"?(passed|waived)"
flags: m
match: not_contains
target:
  source: file
  path: docs/backend-tasks/BE-50-rename-total/tracking/workflow-status.md
---
