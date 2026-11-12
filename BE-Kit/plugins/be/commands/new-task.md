---
description: Tạo task folder backend chuẩn từ template.
argument-hint: BE-<id>-<slug>
---

Tạo task BE: $ARGUMENTS

Tạo task bằng MCP tool `be_new_task` (Claude Code) hoặc `node bin/be-kit.mjs new-task <tên-task>` (tên dạng `BE-<id>-<slug>`, vd `BE-123-create-order`). Lệnh tạo `docs/backend-tasks/<tên-task>/` từ template (ưu tiên `.backend-delivery/templates/` của repo) và không ghi đè file đã có.

Chưa có tên task, chỉ có yêu cầu bằng lời? Dùng `BE task <yêu cầu>`.

Kết thúc bằng bước tiếp theo: `BE plan docs/backend-tasks/<tên-task>`. Không plan, không code trong lệnh này.
