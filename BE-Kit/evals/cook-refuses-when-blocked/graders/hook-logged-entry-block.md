---
type: regex
pattern: "\"event\":\"entry_blocked\""
match: contains
target:
  source: file
  path: docs/backend-tasks/BE-20-cancel/tracking/run-log.jsonl
---
