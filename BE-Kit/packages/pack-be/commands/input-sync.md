---
description: Đồng bộ câu trả lời, CR hoặc thay đổi SRS/API vào task backend.
argument-hint: <task-folder> <câu trả lời hoặc CR>
---

Đồng bộ input cho task BE: $ARGUMENTS

1. Ghi lần đồng bộ vào `tracking/input-sync-report.md`: nguồn, câu hỏi liên quan, impact tới plan/checklist/API/DB.
2. Cập nhật `planning/questions.md`: câu đã có trả lời đổi `Trạng thái` sang `Answered` và ghi câu trả lời.
3. Có impact thì cập nhật `planning/implementation-plan.md` và `planning/build-checklist.md` (API contract, migration, file sẽ sửa). Câu trả lời đổi `api_change_type` hay `db_change_required` thì cập nhật field tương ứng.
4. Cập nhật `tracking/workflow-status.md`: `blocking_questions_open` khớp bảng. Hết câu blocking thì `input_sync_required: false`, `build_ready: true`, `next_mode: cook` (hoặc `plan` nếu cần lập lại plan). Ghi `Prompt bước tiếp theo`.

Không sửa source trong lệnh này.
