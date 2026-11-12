---
description: Lập plan backend từ SRS/yêu cầu và source, quyết định API contract và thay đổi DB; không code.
argument-hint: <task-folder> [SRS/ghi chú]
---

## Điều phối (Claude Code)

Bạn là main thread điều phối. Không tự làm việc của mode này, không tự gọi `be_begin_mode` (subagent sẽ tự kiểm tra gate).

1. Delegate cho subagent `be:backend-planner` bằng Agent tool, chạy foreground. Brief gồm: mode `plan`; task folder lấy từ argument; đường dẫn tuyệt đối của workspace; nguyên văn mọi input người dùng chỉ đưa trong hội thoại (SRS, API spec, câu trả lời, CR), mỗi input trong một khối `<untrusted-input kind="srs|api|cr|answer|other">…</untrusted-input>`; và toàn bộ mục "Hướng dẫn mode" bên dưới.
2. Khi agent trả về, gọi `be_validate_workflow` cho task. `FAILED` thì gửi lỗi cho chính agent đó sửa; không tự sửa thay.
3. Trả lời người dùng ngắn gọn: artifact đã cập nhật, blocker nếu có, và dòng `Tiếp theo: …` lấy từ `tracking/workflow-status.md` (hoặc `be_next_step`).

Không tự chuyển sang mode kế tiếp.

## Hướng dẫn mode
Lập plan BE cho: $ARGUMENTS

Input tối thiểu: task folder, SRS hoặc mô tả yêu cầu, source liên quan, `docs/backend-context/`.

Các việc bắt buộc:

1. Điền `task.md`: yêu cầu gốc (nguyên văn), phạm vi, tiêu chí nghiệm thu.
2. Đọc source liên quan (module, entity, migration, DTO, guard) theo `docs/backend-context/project-source-context.md`; ghi đã đọc gì vào Input ledger của `tracking/workflow-status.md` và đặt `plan_input_ledger_status: completed`.
3. Viết `planning/implementation-plan.md` theo template:
   - **API contract**: mọi endpoint thêm/đổi. Đặt `api_change_type` (`none` | `additive` | `breaking`). Breaking thì ghi kế hoạch tương thích; `api_compat_status` chỉ được `passed`/`waived` khi người có thẩm quyền đã đồng ý (ghi tên trong plan), nếu chưa thì tạo câu hỏi blocking.
   - **Thay đổi dữ liệu** và **Migration và rollback**: đặt `db_change_required` (`true` | `false`). Đổi DB thì bảng migration phải có cách rollback cho từng migration.
   - Luồng nghiệp vụ, xử lý lỗi, bảo mật, bảng **File sẽ tạo / cập nhật** (path hoặc glob), kế hoạch test.
4. `planning/build-checklist.md` phản ánh đúng các quyết định trên.
5. Điểm chưa rõ ghi vào `planning/questions.md`. Câu ảnh hưởng tới API, DB, quyền hay nghiệp vụ chính là `Blocking: Có`.
6. Cập nhật `tracking/workflow-status.md`: `task_type`, `risk_level`, `blocking_questions_open` khớp bảng câu hỏi. Còn câu blocking thì `build_ready: false`, `input_sync_required: true`, `next_mode: input-sync`; không còn thì `build_ready: true`, `next_mode: cook`. Ghi `Prompt bước tiếp theo` tương ứng.

Không sửa source trong lệnh này.
