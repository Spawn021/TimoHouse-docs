---
trigger: always_on
description: "Frontend Delivery Standard: workflow chung, gate qua CLI fe-kit cho Antigravity"
---

# Frontend Delivery Standard (Antigravity)

Rule chung bắt buộc nằm trong `.frontend-delivery/rules/`. Đọc tối thiểu `core.md`, `mode-output-contract.md`, `plan-input-ledger-contract.md`, `efficiency-budget-contract.md`, `srs-api-contract.md`, `clean-code-contract.md`, `evidence-scope-contract.md`, `vietnamese-output.md`; chỉ đọc thêm file cần cho mode đang chạy.

Dùng một cấu trúc task chuẩn: `task.md`, `planning/implementation-plan.md`, `planning/build-checklist.md`, `planning/questions.md`, `tracking/workflow-status.md`, và `output/figma-reference-screenshots/.gitkeep`.

- Không mode nào được kết thúc chỉ bằng chat response; mọi mode phải cập nhật `tracking/workflow-status.md`. Chỉ file này được chứa mục `Prompt bước tiếp theo`.
- `FE plan` phải cập nhật Input ledger trong `tracking/workflow-status.md` với đầy đủ input để các mode sau biết cần đọc gì.
- Khi SRS đã rõ, SRS là source of truth cho API/business behavior. Có CR, file trả lời câu hỏi, clarification hoặc update SRS/Figma/source thì chạy `FE input-sync` trước khi tiếp tục.
- Nếu còn câu hỏi blocking/open trong `planning/questions.md`, prompt tiếp theo phải là `FE input-sync`; không được sang `FE cook` cho tới khi input-sync cập nhật câu trả lời, plan/checklist và đóng gate.
- `FE quick <task>` chỉ cho task nhỏ, rủi ro thấp, localized, requirement rõ, không còn câu hỏi, không cần Figma gate, không có ambiguity API/DTO mới và không cần quyết định store/hook architecture mới. Không đạt thì dùng `FE plan` hoặc `FE input-sync`.
- `docs/frontend-context/feature-source-context.md` chỉ dùng cho feature mẫu/cách code feature mẫu nếu có.
- Không claim test/lint/typecheck/build pass nếu chưa chạy thật. Không sửa file ngoài plan nếu chưa update plan/input-sync.

## Lệnh

Mỗi mode là một skill trong `.agents/skills/fe-<mode>/`, gọi bằng `/fe-<mode>`: `/fe-context` (điền `docs/frontend-context/` từ source, chạy một lần sau khi cài kit), `/fe-task`, `/fe-new-task`, `/fe-plan`, `/fe-input-sync`, `/fe-figma`, `/fe-cook`, `/fe-review`, `/fe-bugfix`, `/fe-test`, `/fe-figma-review`, `/fe-pr`, `/fe-quick`, `/fe-retro`. Người dùng cũng có thể gõ `FE <mode> <task-folder>` trong chat; xử lý như skill tương ứng.

## Mức kiểm tra

Antigravity không có MCP hay hook của kit: không có gì tự chặn sai gate lúc agent chạy. Gate chỉ được kiểm khi chạy CLI của kit (`bin/fe-kit.mjs`, do `fe-kit init` copy vào repo):

- Khi bắt đầu mỗi mode: `node bin/fe-kit.mjs mode begin <task-folder> <mode> --actor antigravity`. Lệnh in verdict của gate, artifact bắt buộc và nguyên văn rule của mode. Exit 1 là mode bị chặn: chỉ cập nhật `workflow-status.md` theo prompt được in ra rồi dừng, không sửa source.
- Trước khi kết thúc mỗi mode: `node bin/fe-kit.mjs mode end <task-folder> <mode> --actor antigravity`. Cùng gate kết thúc mode với hook của Claude Code: `workflow-status.md` đã cập nhật, `current_mode` đúng, đủ artifact, qua validator; task ở review/test/pr thì đối chiếu file đã sửa (git) với plan.
- Hai lệnh trên và `validate-*` ghi sự kiện vào `tracking/run-log.jsonl` của task; commit file này cùng task. `node bin/fe-kit.mjs report` tổng hợp lại.
- Trước khi mở PR: `node bin/fe-kit.mjs validate-pr <task-folder> --base <nhánh-đích>`.
- Chưa chạy, hoặc lệnh báo lỗi, thì không ghi gate là passed trong `workflow-status.md`; ghi lại lệnh đã chạy và kết quả.

Skill nhắc tới MCP tool `fe_*` hoặc skill `frontend-delivery-standard` của Claude Code thì dùng lệnh CLI tương ứng:

| Trong skill | Lệnh thay thế |
|---|---|
| `fe_begin_mode` | `node bin/fe-kit.mjs mode begin <task-folder> <mode> --actor antigravity` |
| `fe_validate_workflow`, `fe_scope_diff` | `node bin/fe-kit.mjs mode end <task-folder> <mode> --actor antigravity` (hoặc `validate-workflow <task-folder>`) |
| `fe_new_task` | `node bin/fe-kit.mjs new-task <slug>` |
| `fe_list_tasks` | liệt kê thư mục `docs/frontend-tasks/` |
| `fe_task_status` | `node bin/fe-kit.mjs status <task-folder>` |
| `fe_next_step` | `node bin/fe-kit.mjs next <task-folder>` |
| `fe_validate_task` | `node bin/fe-kit.mjs validate-task <task-folder>` |
| `fe_validate_retro` | `node bin/fe-kit.mjs retro check <thư-mục-retro>` |
| skill `frontend-delivery-standard` | skill trong `.agents/skills/frontend-delivery-standard/SKILL.md` (rule của skill nằm ở `.frontend-delivery/rules/`) |

## UI/Figma strict mode v1.0.0

Khi Figma gate passed, Figma là visual source of truth; source UI/core component chỉ là implementation base. Không tự động làm theo UI base source nếu lệch Figma. Trước PR cho UI task, dùng `FE figma-review <task-folder>` hoặc review evidence tương đương.

- SRS task phải có Ma trận trace SRS → FE logic → UI → Test trước build.
- UI/Figma task phải có UI Node Implementation Matrix và Figma → Source component binding cụ thể.
- PR cho UI/Figma task cần UI match review/evidence; Critical/High mismatch block PR.

## Ngôn ngữ output

Viết bằng tiếng Việt có dấu đầy đủ (theo `.frontend-delivery/rules/vietnamese-output.md`). Giữ nguyên code/path/command/API field/DTO/error code/route/package/SRS section.

Cache marker: `vi-diacritics-rules-folder-v1.0.0`
