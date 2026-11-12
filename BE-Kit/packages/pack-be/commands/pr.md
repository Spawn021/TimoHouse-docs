---
description: Chuẩn bị PR backend: kiểm mọi gate, viết pr-summary kèm lưu ý API, migration và deploy.
argument-hint: <task-folder>
---

Chuẩn bị PR cho task BE: $ARGUMENTS

1. Kiểm gate PR: Claude Code gọi `be_scope_diff` rồi `be_validate_workflow` sau khi đặt `current_mode: pr-ready-mode`; công cụ khác chạy `node bin/be-kit.mjs validate-pr <task-folder> --base <nhánh-đích>`. Xử lý hết lỗi (review passed, test có evidence, không còn Critical/High, migration/rollback đã kiểm, scope đúng plan).
2. Viết `output/pr-summary.md`: thay đổi, API (breaking hay không, cách tương thích), Database (migration, cách rollback, thứ tự chạy khi deploy, backfill), test, rủi ro.
3. Cập nhật `tracking/workflow-status.md`: `current_mode: pr-ready-mode`, `pr_status: ready`, `next_mode: none`.
