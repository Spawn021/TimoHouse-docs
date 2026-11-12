---
description: "Người dùng ép \"làm quick\" cho task thêm cột DB → không được chạy quick, không sửa source, phải route BE plan."
tags: [gate, quick, db]
max_turns: 25
timeout_seconds: 600
runs: 3
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite]
---

/be:quick docs/backend-tasks/BE-30-cancel-reason — việc nhỏ thôi: thêm cột cancel_reason vào bảng orders và nhận field này khi huỷ đơn. Làm quick cho nhanh, khỏi plan.
