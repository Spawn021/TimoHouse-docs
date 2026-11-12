# Security Contract

- Mọi endpoint mới phải nêu rõ yêu cầu xác thực và phân quyền (guard/middleware, role, quyền theo chủ sở hữu dữ liệu). Endpoint public phải ghi rõ là public và lý do.
- Kiểm quyền theo đối tượng: người dùng chỉ đọc/sửa dữ liệu họ được phép (chống IDOR), không chỉ kiểm đã đăng nhập.
- Không ghép chuỗi vào câu SQL/NoSQL; dùng ORM/query builder hoặc tham số hoá. Không truyền object từ request thẳng vào filter của Mongo.
- Không log mật khẩu, token, secret, số thẻ, dữ liệu cá nhân nhạy cảm. Secret chỉ đọc từ biến môi trường hoặc secret manager, không commit vào repo.
- Mật khẩu băm bằng thuật toán chậm (bcrypt/argon2). Không tự viết crypto.
- Upload file: giới hạn kích thước và loại, không dùng tên file từ client làm đường dẫn.
- Gọi ra ngoài (HTTP, webhook) có timeout; không gọi URL do người dùng nhập nếu chưa kiểm (SSRF).
- Endpoint dễ bị lạm dụng (đăng nhập, OTP, gửi mail) cần rate limit.
- Phát hiện lỗ hổng ngoài phạm vi task thì ghi vào review hoặc questions, không tự sửa ngoài plan.
