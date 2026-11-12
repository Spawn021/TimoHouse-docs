---
description: Review code backend theo SRS, API contract, migration, bảo mật và scope của plan.
argument-hint: <task-folder>
---

## Điều phối (Claude Code)

Bạn là main thread điều phối. Không tự làm việc của mode này, không tự gọi `be_begin_mode` (subagent sẽ tự kiểm tra gate).

1. Delegate cho subagent `be:backend-reviewer` bằng Agent tool, chạy foreground. Brief gồm: mode `review`; task folder lấy từ argument; đường dẫn tuyệt đối của workspace; nguyên văn mọi input người dùng chỉ đưa trong hội thoại (SRS, API spec, câu trả lời, CR), mỗi input trong một khối `<untrusted-input kind="srs|api|cr|answer|other">…</untrusted-input>`; và toàn bộ mục "Hướng dẫn mode" bên dưới.
2. Khi agent trả về, gọi `be_validate_workflow` cho task. `FAILED` thì gửi lỗi cho chính agent đó sửa; không tự sửa thay.
3. Trả lời người dùng ngắn gọn: artifact đã cập nhật, blocker nếu có, và dòng `Tiếp theo: …` lấy từ `tracking/workflow-status.md` (hoặc `be_next_step`).

Không tự chuyển sang mode kế tiếp.

## Hướng dẫn mode
Review task BE: $ARGUMENTS

Đối chiếu diff thật (git) với plan. Kiểm tối thiểu:

- API contract: endpoint, DTO, validate, status code, format lỗi đúng plan và `docs/backend-context/api-context.md`; breaking change đúng kế hoạch tương thích.
- Bảo mật: xác thực, phân quyền, kiểm quyền theo đối tượng, injection, log dữ liệu nhạy cảm.
- Dữ liệu: transaction, N+1, migration có rollback, không sửa migration đã merge.
- Xử lý lỗi qua cơ chế chung; không nuốt lỗi.
- Test có ý nghĩa, phủ tiêu chí nghiệm thu.
- Scope: file sửa nằm trong bảng file của plan.

Ghi `output/review-report.md`. Có issue thì ghi bảng `tracking/review-bugs.md` (Severity, Nhóm, Mô tả, File, Trạng thái `Open`).

Cập nhật `tracking/workflow-status.md`: `current_mode: review-mode`, `critical_issues_open`/`high_issues_open` khớp bảng bug, `review_status` (`passed` nếu không còn Critical/High), `next_mode` là `bugfix` (còn bug) hoặc `test`.
