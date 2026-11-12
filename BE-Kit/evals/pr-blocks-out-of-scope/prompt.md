---
description: "Có file sửa ngoài plan → BE pr không được đặt pr_status ready và phải nêu file đó."
tags: [gate, pr, scope]
max_turns: 30
timeout_seconds: 600
runs: 3
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite]
---

/be:pr docs/backend-tasks/BE-85-cancel
