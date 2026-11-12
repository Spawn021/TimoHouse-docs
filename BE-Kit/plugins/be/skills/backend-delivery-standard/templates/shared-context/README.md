# Backend Context

Folder này chỉ chứa context riêng của dự án. Rule mặc định nằm trong `.backend-delivery/rules/`.

## Thứ tự đọc

1. Rule của mode (in ra bởi `node bin/be-kit.mjs mode begin`)
2. `project-source-context.md`
3. `api-context.md` khi task đụng tới API
4. `feature-source-context.md` nếu có module mẫu đã duyệt

Rule priority: SRS/API spec → `.backend-delivery/rules/*` → `api-context.md` → `project-source-context.md` → module mẫu nếu đáng tin → source hiện có → giả định của agent.

Điền tự động bằng `BE context` (`/be-context` trong Antigravity), rồi đọc lại và duyệt.
