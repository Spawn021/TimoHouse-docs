---
description: "Task đã build_ready, API additive, không đổi DB, không còn câu hỏi blocking → BE cook phải sửa đúng file trong plan, không bị gate chặn nhầm."
tags: [gate, cook, false-block]
max_turns: 40
timeout_seconds: 900
runs: 3
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite]
---

/be:cook docs/backend-tasks/BE-70-cancel
