---
trigger: always_on
description: "Backend Delivery Standard: quy trình chung cho task backend Node, gate qua CLI be-kit cho Antigravity"
---

# Backend Delivery Standard (Antigravity)

Áp dụng cho việc backend trong repo này (thư mục task `docs/backend-tasks/`, lệnh `BE <mode>` hoặc `/be-<mode>`).

Rule bắt buộc nằm trong `.backend-delivery/rules/`; context dự án ở `docs/backend-context/`; skill chung `.agents/skills/backend-delivery-standard/SKILL.md`.

- Không mode nào kết thúc chỉ bằng chat; mọi mode cập nhật `tracking/workflow-status.md`.
- `BE plan` phải quyết định `api_change_type` và `db_change_required`, điền Input ledger.
- Còn câu hỏi blocking `Open` thì bước tiếp theo bắt buộc là `BE input-sync`, không được `BE cook`.
- Không claim test/lint/typecheck/build/migration pass khi chưa chạy thật. Không sửa file ngoài plan.

## Lệnh

Mỗi lệnh là một skill trong `.agents/skills/be-<mode>/`, gọi bằng `/be-<mode>`: `/be-context` (điền `docs/backend-context/` từ source, chạy một lần sau khi cài kit), `/be-task`, `/be-new-task`, `/be-plan`, `/be-input-sync`, `/be-quick`, `/be-cook`, `/be-review`, `/be-bugfix`, `/be-test`, `/be-pr`. Người dùng gõ `BE <mode> <task-folder>` trong chat thì xử lý như skill tương ứng.

## Mức kiểm tra

Antigravity không có hook hay MCP của kit: gate chỉ được kiểm khi chạy CLI `bin/be-kit.mjs`.

- Bắt đầu mỗi mode: `node bin/be-kit.mjs mode begin <task-folder> <mode> --actor antigravity`. Exit 1 là bị chặn: chỉ cập nhật `workflow-status.md` theo prompt được in ra rồi dừng, không sửa source.
- Trước khi kết thúc mỗi mode: `node bin/be-kit.mjs mode end <task-folder> <mode> --actor antigravity`, sửa tới khi qua.
- Trước khi mở PR: `node bin/be-kit.mjs validate-pr <task-folder> --base <nhánh-đích>`.
- Lệnh khác: `node bin/be-kit.mjs status <task-folder>`, `next <task-folder>`, `validate-workflow <task-folder>`, `report`.

## Ngôn ngữ output

Viết bằng tiếng Việt có dấu đầy đủ. Giữ nguyên code/path/command/API field/DTO/error code/route/package/tên bảng và cột DB.

Cache marker: `vi-diacritics-rules-folder-v1.0.0`
