---
description: Review code backend theo SRS, API contract, migration, bảo mật và scope của plan.
argument-hint: <task-folder>
---

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
