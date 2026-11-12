---
type: regex
pattern: "\"event\":\"entry_blocked\""
match: contains
target:
  source: file
  path: docs/backend-tasks/BE-30-cancel-reason/tracking/run-log.jsonl
---
