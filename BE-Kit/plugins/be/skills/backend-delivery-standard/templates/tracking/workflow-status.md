---
task_id: <TASK_ID>
current_mode: planning-mode  # planning-mode | quick-mode | input-sync-mode | implementation-mode | bugfix-mode | review-mode | testing-mode | pr-ready-mode
next_mode: plan
updated_at: ""
human_override: false
vietnamese_diacritics_cache_marker: vi-diacritics-rules-folder-v1.0.0

# Phân loại (ghi bởi BE task hoặc BE plan)
task_type: unknown  # feature | bugfix | refactor | perf | security | migration | integration | setup | chore | unknown
risk_level: unknown  # low | medium | high | unknown (high thì không chạy BE quick)

# Plan và câu hỏi
plan_input_ledger_status: not_started  # not_started | in_progress | completed
build_ready: false
blocking_questions_open: 0
input_sync_required: false

# Quyết định bắt buộc của BE plan
api_change_type: unknown  # none | additive | breaking | unknown
api_compat_status: not_started  # not_started | passed | waived | not_required (breaking thì phải passed/waived trước cook)
db_change_required: unknown  # true | false | unknown
migration_status: not_started  # not_started | in_progress | passed | failed | waived | not_required
rollback_plan_status: not_started  # not_started | passed | waived | not_required

# Review, test, PR
review_status: not_started  # not_started | passed | failed | needs_recheck | not_required
test_status: not_started  # not_started | passed | failed | partial
critical_issues_open: 0
high_issues_open: 0
bugfix_required: false
scope_diff_status: not_started  # not_started | passed | failed | manual_review
pr_status: not_started  # not_started | ready | blocked
---

# Workflow status

## Snapshot

| Mục | Giá trị |
|---|---|
| Bước hiện tại | Chưa plan |
| Blocker | Không |
| Ghi chú |  |

## Input ledger bắt buộc cho BE plan

| Input | Nguồn / path | Đã đọc? | Ghi chú |
|---|---|---|---|
| Yêu cầu / SRS | `task.md` | Chưa |  |
| API spec / contract hiện có |  | Chưa / Không áp dụng |  |
| Project context | `docs/backend-context/project-source-context.md` | Chưa |  |
| API context | `docs/backend-context/api-context.md` | Chưa |  |
| Module mẫu | `docs/backend-context/feature-source-context.md` | Chưa / Không áp dụng |  |
| Schema DB / migration hiện có |  | Chưa / Không áp dụng |  |
| Source cần inspect |  | Chưa |  |

## Prompt bước tiếp theo

```text
BE plan <task-folder>
```
