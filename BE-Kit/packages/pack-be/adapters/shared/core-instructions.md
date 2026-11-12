# Backend Delivery Standard (BE-Kit)

Việc backend Node (NestJS/Express) trong repo này theo quy trình `BE task` → `BE plan` → (`BE input-sync`) → `BE cook` → `BE review` → (`BE bugfix`) → `BE test` → `BE pr`. Việc nhỏ, rủi ro thấp, không đổi DB, không breaking API: `BE quick`. Repo vừa cài kit: `BE context` trước.

- Task ở `docs/backend-tasks/<tên>/`; `tracking/workflow-status.md` là trạng thái duy nhất và là file duy nhất chứa `Prompt bước tiếp theo`.
- Rule bắt buộc: `.backend-delivery/rules/`. Context dự án: `docs/backend-context/`. Template: `.backend-delivery/templates/`.
- Không mode nào kết thúc chỉ bằng chat; mọi mode cập nhật artifact bắt buộc và `workflow-status.md`.
- `BE plan` quyết định `api_change_type` (none | additive | breaking) và `db_change_required` (true | false). Breaking API cần kế hoạch tương thích được duyệt; đổi DB cần migration có rollback và chạy up/down trên DB test trước PR.
- Còn câu hỏi blocking `Open` trong `planning/questions.md` thì bước tiếp theo bắt buộc là `BE input-sync`.
- Chỉ sửa file trong bảng `File sẽ tạo / cập nhật` của plan. Không claim test/lint/typecheck/build/migration pass khi chưa chạy thật.
- Artifact viết tiếng Việt có dấu đầy đủ; giữ nguyên code, path, command, API field, DTO, error code, tên bảng/cột.
