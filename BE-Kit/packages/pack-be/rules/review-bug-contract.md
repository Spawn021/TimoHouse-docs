# Review/Bug Contract

- `BE review` luôn tạo/cập nhật `output/review-report.md`; có issue thì ghi vào bảng của `tracking/review-bugs.md`.
- Mỗi bug có ID, Severity (`Critical`/`High`/`Medium`/`Low`), Nhóm, Mô tả, File, Trạng thái (`Open`/`Fixed`/`Closed`/`Wontfix`).
- `Nhóm`: `api-contract`, `business-logic`, `data-migration`, `security`, `error-handling`, `performance`, `clean-code`, `test`, `scope`, `other`.
- Review kiểm tối thiểu: đúng API contract trong plan, validate input, phân quyền, transaction, xử lý lỗi, migration/rollback (khi có), test có ý nghĩa, scope diff.
- Lỗ hổng bảo mật, mất dữ liệu, breaking API chưa được duyệt là `Critical`.
- Critical/High đang mở chặn PR; `critical_issues_open`/`high_issues_open` phải khớp bảng.
- Bug cần đổi requirement thì route sang `BE input-sync`.
