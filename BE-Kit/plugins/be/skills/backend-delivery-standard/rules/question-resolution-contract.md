# Question Resolution Contract

- Câu hỏi ghi trong bảng của `planning/questions.md`; cột `Blocking` là `Có` hoặc `Không`, cột `Trạng thái` là `Open`, `Answered` hoặc `Closed`.
- Còn câu hỏi blocking `Open`: `workflow-status.md` đặt `build_ready: false`, `blocking_questions_open` bằng số câu đó, `input_sync_required: true`, `next_mode: input-sync`, và `Prompt bước tiếp theo` là `BE input-sync <task-folder> <answer-or-cr>`.
- Không route sang `BE cook`, `BE quick`, `BE review`, `BE test` hoặc `BE pr` khi còn câu hỏi blocking `Open`.
- `BE input-sync` nhận câu trả lời/CR, ghi `tracking/input-sync-report.md`, đổi trạng thái câu hỏi, cập nhật plan/checklist nếu có impact, rồi mới được đặt `build_ready: true` và `input_sync_required: false`.
- Câu hỏi không blocking không chặn cook nếu plan đã ghi giả định mặc định và impact thấp.
