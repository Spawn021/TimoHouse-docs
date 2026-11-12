# API Contract

- Plan phải có bảng `API contract` cho mọi endpoint/event được thêm hoặc đổi: method, path, auth/quyền, request DTO, response DTO, mã lỗi, ghi chú. Không có thay đổi API thì ghi `Không đổi API` và đặt `api_change_type: none`.
- `api_change_type`: `none` (không đổi), `additive` (thêm endpoint hoặc field optional, client cũ vẫn chạy), `breaking` (xoá/đổi tên field, đổi kiểu, đổi status code, field optional thành bắt buộc, đổi ngữ nghĩa). Không chắc thì coi là `breaking`.
- Breaking change phải có kế hoạch tương thích trong plan (version mới như `/v2`, deprecate có thời hạn, hoặc người có thẩm quyền chấp nhận phá vỡ) và `api_compat_status: passed` hoặc `waived` (kèm người duyệt) trước khi cook.
- Request luôn được validate ở biên (NestJS `ValidationPipe` + DTO `class-validator`/`zod`; Express middleware validate). Không tin dữ liệu từ client, kể cả id trong body.
- Response và lỗi theo đúng format chung của dự án ghi trong `docs/backend-context/`. Không trả stack trace, câu SQL hay lỗi nội bộ ra client.
- Status code đúng ngữ nghĩa: 400 dữ liệu sai, 401 chưa xác thực, 403 không đủ quyền, 404 không tìm thấy, 409 xung đột, 422 nếu dự án dùng cho lỗi nghiệp vụ, 5xx chỉ cho lỗi hệ thống.
- Danh sách có phân trang và giới hạn kích thước trang. Thao tác có thể bị gọi lặp (thanh toán, tạo đơn) phải nêu cách chống trùng (idempotency key, unique constraint).
- Dự án có API doc (Swagger/OpenAPI) thì cập nhật cùng thay đổi.
