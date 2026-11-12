# Backend Delivery (BE-Kit)

Việc backend trong repo này theo quy trình của plugin `be` (`/be:*`): `BE task` → `BE plan` → (`BE input-sync`) → `BE cook` → `BE review` → (`BE bugfix`) → `BE test` → `BE pr`. Repo vừa cài kit thì chạy `/be:context` trước.

- Task ở `docs/backend-tasks/<tên>/`; trạng thái duy nhất là `tracking/workflow-status.md`.
- Rule: `.backend-delivery/rules/` (ghi đè bản trong plugin). Context dự án: `docs/backend-context/`.
- Mỗi mode mở bằng MCP `be_begin_mode` và kết thúc bằng `be_validate_workflow`. Hook của plugin chặn sửa source sai vai/sai gate (mức `BE_KIT_HOOKS=off|warn|enforce`).
- Plan phải quyết định `api_change_type` và `db_change_required`; breaking API cần kế hoạch tương thích được duyệt; đổi DB cần migration có rollback và chạy up/down trước PR.
- Artifact viết tiếng Việt có dấu đầy đủ. Không claim test pass khi chưa chạy thật.
