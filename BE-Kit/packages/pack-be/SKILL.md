---
name: backend-delivery-standard
description: dùng cho mọi yêu cầu backend Node (NestJS/Express) — yêu cầu mới bằng ngôn ngữ tự nhiên thì bắt đầu bằng BE task; task đã có thì dùng BE plan, BE quick, BE input-sync, BE cook, BE review, BE bugfix, BE test, BE pr. Bắt buộc tiếng Việt có dấu, quyết định API contract và thay đổi DB trong plan, migration có rollback, test evidence chạy thật, chặn cook khi còn câu hỏi blocking.
---

# Backend Delivery Standard

Cache marker: `vi-diacritics-rules-folder-v1.0.0`

## Luôn áp dụng

- Mọi câu trả lời và artifact `.md` viết bằng tiếng Việt có dấu đầy đủ.
- Không mode nào kết thúc chỉ bằng chat: mọi mode tạo/cập nhật artifact bắt buộc và `tracking/workflow-status.md` (file duy nhất chứa `Prompt bước tiếp theo`).
- Rule nằm ở `.backend-delivery/rules/` (nếu repo đã `be-kit init`; không thì `rules/` cạnh file skill này), template ở `.backend-delivery/templates/`, context dự án ở `docs/backend-context/`. Task nằm ở `docs/backend-tasks/<tên-task>/`.
- Còn câu hỏi blocking `Open` trong `planning/questions.md` thì chỉ được chạy `BE input-sync` hoặc `BE plan`.

## Luồng

```
BE task → BE plan → (BE input-sync khi còn câu hỏi) → BE cook → BE review → (BE bugfix) → BE test → BE pr
```

Việc nhỏ, rủi ro thấp, không đổi DB, không breaking API: `BE quick` đi một lượt tới PR. Repo vừa cài kit: chạy `BE context` trước để điền `docs/backend-context/`.

## Bắt đầu và kết thúc một mode

Claude Code (plugin `be`) dùng MCP tool; công cụ khác (Antigravity, Codex, Cursor, Copilot) dùng CLI `bin/be-kit.mjs` do `be-kit init` cài.

| Việc | Claude Code | Công cụ khác |
|---|---|---|
| Mở mode | `be_begin_mode` | `node bin/be-kit.mjs mode begin <task-folder> <mode> --actor <công-cụ>` |
| Kết thúc mode | `be_validate_workflow` | `node bin/be-kit.mjs mode end <task-folder> <mode> --actor <công-cụ>` |
| Tạo task | `be_new_task` | `node bin/be-kit.mjs new-task <tên>` |
| Scope so với plan | `be_scope_diff` | `node bin/be-kit.mjs validate-pr <task-folder> --base <nhánh>` |
| Bước tiếp theo, trạng thái | `be_next_step`, `be_task_status` | `node bin/be-kit.mjs next|status <task-folder>` |

1. **Bắt đầu:** mở mode như bảng trên. Kết quả in verdict của gate, artifact bắt buộc (kèm template khi chưa có) và nguyên văn rule của mode. Exit 1 là bị chặn: không làm việc của mode, không sửa source; chỉ cập nhật `workflow-status.md` theo prompt được in ra rồi dừng.
2. **Kết thúc:** cập nhật `workflow-status.md`, rồi kiểm gate kết thúc như bảng trên và sửa tới khi qua.
3. **Trước PR:** kiểm scope so với plan và mọi gate PR.

Chưa chạy, hoặc lệnh báo lỗi, thì không ghi gate là passed.

## Gate chính (kiểm bằng code)

| Gate | Khi nào chặn |
|---|---|
| Câu hỏi blocking | Còn câu blocking `Open` mà vào cook/quick/review/test/pr, hoặc `build_ready: true` |
| Quyết định của plan | `build_ready: true` mà chưa có `api_change_type`, `db_change_required`, Input ledger chưa completed |
| Breaking API | `api_change_type: breaking` mà `api_compat_status` chưa passed/waived |
| Migration | Đổi DB mà plan chưa có migration kèm rollback; tới test/PR mà migration up/down chưa kiểm |
| Quick | Quick mà đổi DB, breaking API hoặc `risk_level: high` |
| Test evidence | Test/quick/PR mà `output/test-summary.md` không có lệnh chạy thật |
| PR | Review chưa passed, test chưa passed, còn bug Critical/High, file sửa ngoài plan |

## Rule theo mode

- Luôn: `core.md`, `mode-output-contract.md`, `question-resolution-contract.md`, `vietnamese-output.md`, `efficiency-budget-contract.md`, `untrusted-input-contract.md`
- `api-contract.md`: plan, input-sync, cook, quick, bugfix, review, pr
- `security-contract.md`: plan, cook, quick, bugfix, review
- `clean-code-contract.md`: cook, quick, bugfix, review
- `evidence-scope-contract.md`: cook, quick, review, test, pr
- `review-bug-contract.md`: review, bugfix, pr
- `data-migration-contract.md`: mọi mode trừ khi `db_change_required` không phải `true`

Rule priority: SRS/API spec → `.backend-delivery/rules/*` → `docs/backend-context/api-context.md` → `docs/backend-context/project-source-context.md` → module mẫu đã duyệt → source hiện có → giả định của agent.
