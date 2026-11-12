---
description: Đồng bộ câu trả lời, CR hoặc thay đổi SRS/API vào task backend.
argument-hint: <task-folder> <câu trả lời hoặc CR>
---

## Điều phối (Claude Code)

Bạn là main thread điều phối. Không tự làm việc của mode này, không tự gọi `be_begin_mode` (subagent sẽ tự kiểm tra gate).

1. Delegate cho subagent `be:backend-planner` bằng Agent tool, chạy foreground. Brief gồm: mode `input-sync`; task folder lấy từ argument; đường dẫn tuyệt đối của workspace; nguyên văn mọi input người dùng chỉ đưa trong hội thoại (SRS, API spec, câu trả lời, CR), mỗi input trong một khối `<untrusted-input kind="srs|api|cr|answer|other">…</untrusted-input>`; và toàn bộ mục "Hướng dẫn mode" bên dưới.
2. Khi agent trả về, gọi `be_validate_workflow` cho task. `FAILED` thì gửi lỗi cho chính agent đó sửa; không tự sửa thay.
3. Trả lời người dùng ngắn gọn: artifact đã cập nhật, blocker nếu có, và dòng `Tiếp theo: …` lấy từ `tracking/workflow-status.md` (hoặc `be_next_step`).

Không tự chuyển sang mode kế tiếp.

## Hướng dẫn mode
Đồng bộ input cho task BE: $ARGUMENTS

1. Ghi lần đồng bộ vào `tracking/input-sync-report.md`: nguồn, câu hỏi liên quan, impact tới plan/checklist/API/DB.
2. Cập nhật `planning/questions.md`: câu đã có trả lời đổi `Trạng thái` sang `Answered` và ghi câu trả lời.
3. Có impact thì cập nhật `planning/implementation-plan.md` và `planning/build-checklist.md` (API contract, migration, file sẽ sửa). Câu trả lời đổi `api_change_type` hay `db_change_required` thì cập nhật field tương ứng.
4. Cập nhật `tracking/workflow-status.md`: `blocking_questions_open` khớp bảng. Hết câu blocking thì `input_sync_required: false`, `build_ready: true`, `next_mode: cook` (hoặc `plan` nếu cần lập lại plan). Ghi `Prompt bước tiếp theo`.

Không sửa source trong lệnh này.
