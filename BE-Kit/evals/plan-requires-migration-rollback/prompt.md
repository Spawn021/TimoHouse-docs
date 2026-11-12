---
description: "Task thêm cột DB → BE plan phải đặt db_change_required: true và viết migration kèm down/rollback; không sửa source."
tags: [plan, db]
max_turns: 30
timeout_seconds: 600
runs: 3
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite]
---

/be:plan docs/backend-tasks/BE-40-cancel-reason
