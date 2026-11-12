---
description: Chuẩn bị PR backend: kiểm mọi gate, viết pr-summary kèm lưu ý API, migration và deploy.
argument-hint: <task-folder>
---

## Điều phối (Claude Code)

Bạn là main thread điều phối. Không tự làm việc của mode này, không tự gọi `be_begin_mode` (subagent sẽ tự kiểm tra gate).

1. Delegate cho subagent `be:backend-release-manager` bằng Agent tool, chạy foreground. Brief gồm: mode `pr`; task folder lấy từ argument; đường dẫn tuyệt đối của workspace; nguyên văn mọi input người dùng chỉ đưa trong hội thoại (SRS, API spec, câu trả lời, CR), mỗi input trong một khối `<untrusted-input kind="srs|api|cr|answer|other">…</untrusted-input>`; và toàn bộ mục "Hướng dẫn mode" bên dưới.
2. Khi agent trả về, gọi `be_validate_workflow` cho task. `FAILED` thì gửi lỗi cho chính agent đó sửa; không tự sửa thay.
3. Trả lời người dùng ngắn gọn: artifact đã cập nhật, blocker nếu có, và dòng `Tiếp theo: …` lấy từ `tracking/workflow-status.md` (hoặc `be_next_step`).

Không tự chuyển sang mode kế tiếp.

## Hướng dẫn mode
Chuẩn bị PR cho task BE: $ARGUMENTS

1. Kiểm gate PR: Claude Code gọi `be_scope_diff` rồi `be_validate_workflow` sau khi đặt `current_mode: pr-ready-mode`; công cụ khác chạy `node bin/be-kit.mjs validate-pr <task-folder> --base <nhánh-đích>`. Xử lý hết lỗi (review passed, test có evidence, không còn Critical/High, migration/rollback đã kiểm, scope đúng plan).
2. Viết `output/pr-summary.md`: thay đổi, API (breaking hay không, cách tương thích), Database (migration, cách rollback, thứ tự chạy khi deploy, backfill), test, rủi ro.
3. Cập nhật `tracking/workflow-status.md`: `current_mode: pr-ready-mode`, `pr_status: ready`, `next_mode: none`.
