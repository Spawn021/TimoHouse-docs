# Mode Output Contract

| Mode | Artifact bắt buộc | Ghi chú |
|---|---|---|
| `BE plan` | `task.md`, `planning/implementation-plan.md`, `planning/build-checklist.md`, `planning/questions.md`, `tracking/workflow-status.md` | Không code. Điền Input ledger, quyết định `api_change_type` và `db_change_required`. Còn câu hỏi blocking thì next là `BE input-sync`. |
| `BE quick` | `planning/implementation-plan.md` (bảng file), `output/review-report.md` (tự review), `output/test-summary.md`, `tracking/workflow-status.md` | Chỉ task nhỏ, rủi ro thấp, không đổi schema DB, không breaking API. Đạt thì next là `BE pr`. |
| `BE input-sync` | `tracking/input-sync-report.md`, `planning/questions.md`, `tracking/workflow-status.md` | Nhận câu trả lời/CR, cập nhật plan/checklist nếu có impact. |
| `BE cook` | code changes, `planning/build-checklist.md`, `tracking/workflow-status.md` | Không chạy khi còn câu hỏi blocking hoặc `build_ready` chưa true. |
| `BE review` | `output/review-report.md`, `tracking/workflow-status.md` | Có issue thì thêm `tracking/review-bugs.md`. |
| `BE bugfix` | `tracking/review-bugs.md`, `tracking/workflow-status.md` | Cập nhật trạng thái bug và next prompt. |
| `BE test` | `output/test-summary.md`, `tracking/workflow-status.md` | Ghi lệnh đã chạy thật hoặc lý do chưa chạy. |
| `BE pr` | `output/pr-summary.md`, `tracking/workflow-status.md` | Chỉ ready khi review passed, test có evidence, không còn Critical/High, migration/rollback và tương thích API đã xử lý. |
