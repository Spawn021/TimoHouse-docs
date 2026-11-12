# Clean Code Contract (Node: NestJS/Express)

- Tách lớp: controller/route chỉ nhận request, validate, gọi service, trả response; service chứa nghiệp vụ; repository/ORM chứa truy cập dữ liệu. Không gọi DB trực tiếp trong controller.
- NestJS: mỗi tính năng một module; inject qua constructor; DTO có decorator validate; dùng exception filter/`HttpException` thay vì tự `res.status()`; guard cho auth, interceptor cho log/transform.
- Express: router → controller → service; lỗi đi qua error-handling middleware chung (`next(err)`), không `try/catch` rồi tự trả 500 rải rác; async handler phải bắt lỗi.
- Theo đúng cấu trúc thư mục, alias và cách đặt tên trong `docs/backend-context/project-source-context.md`.
- Thao tác ghi nhiều bảng phải nằm trong transaction. Tránh N+1 query; chỉ select cột cần.
- Không để `console.log` debug; dùng logger của dự án với mức log phù hợp.
- Cấu hình đọc qua module config của dự án, không đọc `process.env` rải rác.
- Không bắt lỗi rồi nuốt im lặng; không trả `null` thay cho lỗi khi caller cần phân biệt.
- Viết test cho nghiệp vụ mới: unit test cho service, e2e/integration test cho endpoint (supertest, Nest testing module) khi dự án có setup.
