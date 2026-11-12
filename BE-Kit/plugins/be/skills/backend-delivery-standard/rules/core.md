# Core Rules

Cache marker: `vi-diacritics-rules-folder-v1.0.0`

- Không mode nào được kết thúc chỉ bằng chat response.
- Mọi mode phải tạo/cập nhật artifact bắt buộc theo `mode-output-contract.md` và cập nhật `tracking/workflow-status.md`.
- `tracking/workflow-status.md` là file duy nhất chứa `Prompt bước tiếp theo`.
- Mọi artifact Markdown viết bằng tiếng Việt có dấu đầy đủ.
- SRS/API spec là source of truth cho nghiệp vụ, DTO, validation, quyền và mã lỗi khi đã rõ. Không tự thêm field, endpoint, status hay error code mà SRS/API chưa có.
- Source hiện có chỉ là reference; không copy pattern xấu. `docs/backend-context/feature-source-context.md` chỉ dùng khi team đã duyệt module mẫu.
- `BE plan` phải ghi đầy đủ Input ledger trong `tracking/workflow-status.md`, và quyết định rõ hai câu: task có đổi API không (`api_change_type`), có đổi schema/dữ liệu DB không (`db_change_required`).
- Artifact task phải token-lean: ghi quyết định riêng của task, không chép lại rule.
