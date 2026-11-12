---
description: Quét source backend và điền docs/backend-context/ (stack, lệnh, cấu trúc thư mục, quy ước API, đề xuất module mẫu). Chạy một lần sau khi cài kit hoặc khi stack đổi.
argument-hint: "[ghi chú/phạm vi, ví dụ: module mẫu là src/modules/orders]"
---

Điền context backend cho repo này: $ARGUMENTS

Lệnh chạy inline, không phải mode: không tạo task, không chạy `mode begin`/`mode end`. Chỉ ghi `docs/backend-context/project-source-context.md`, `docs/backend-context/api-context.md`, `docs/backend-context/feature-source-context.md`. Không sửa `docs/backend-context/README.md`, source hay file nào khác, không cài package, không chạy lệnh làm thay đổi repo (lệnh chỉ đọc như `git ls-files` thì được). Ghi chú của người dùng trong argument ưu tiên hơn suy luận từ source.

## 1. Đọc hiện trạng

1. Đọc 3 file context; thiếu thì tạo từ `.backend-delivery/templates/shared-context/`.
2. So từng ô với template cùng tên: ô **giống template** (rỗng, danh sách lựa chọn như `TypeORM / Prisma / …`, hay giá trị mặc định) là chưa điền, được ghi đè; ô **khác template** là team đã điền, **giữ nguyên**. Thấy giá trị team điền đã sai thì ghi vào "Cần xác nhận", không sửa.

## 2. Quét source (đọc có chọn lọc)

- `package.json` (dependencies, scripts), lockfile để biết package manager.
- Cấu hình: `tsconfig*.json`, `nest-cli.json`, ORM (`ormconfig*`, `data-source.ts`, `prisma/schema.prisma`, `.sequelizerc`, `knexfile.*`), lint/format, test (`jest.config.*`, `test/jest-e2e.json`, `vitest.config.*`), `.env.example`, `docker-compose*`.
- Cây `src/` tối đa 3 cấp: module, controller/route, service, repository, DTO, entity/schema, migration, guard/middleware, filter/error handler, config.
- Mỗi concern mở 1–2 file đại diện (đánh giá ứng viên module mẫu được mở tới khoảng 5 file mỗi ứng viên): `main.ts`/`app.ts`, một module đầy đủ, global pipe/filter/interceptor, error handler, cấu hình auth, một migration, Swagger setup.

## 3. Điền

- Mỗi giá trị kèm path làm bằng chứng, vd `TypeORM 0.3 (package.json, src/data-source.ts)`.
- Không đọc được thì ghi ngắn `Cần xác nhận: <điều cần hỏi>` trong ô, chi tiết ở bảng "Cần xác nhận" cuối file. Repo không dùng thì `Không dùng`. Không bịa.
- Commands lấy từ `scripts`; Install ghi lệnh cài của package manager; lệnh migration lấy từ script hoặc CLI của ORM, ghi `(suy ra, chưa có script)` nếu tự suy.
- `api-context.md`: base path, versioning, format response/lỗi thật (trích từ interceptor/filter/error handler), phân trang, auth header, Swagger.
- `feature-source-context.md`: **không tự chọn module mẫu**; đề xuất tối đa 2 ứng viên, ghi `Có module mẫu chuẩn không?` = `Chưa xác định — đề xuất, chờ team duyệt`, kèm `Không nên copy phần nào`. Người dùng đã chỉ định thì ghi `Có`.
- Frontmatter: `last_updated` dạng `YYYY-MM-DD` (lấy từ `date` hoặc `git log -1 --format=%cs` nếu không biết ngày), `status: draft`.
- Cuối mỗi file có bảng `## Cần xác nhận` (`| # | Ô / chủ đề | Điều cần xác nhận | Gợi ý từ source |`) hoặc `Không có`. Phát hiện quan trọng ngoài phạm vi (secret bị commit, `synchronize: true` ở production, migration bị sửa sau khi merge) cũng ghi vào bảng này của `project-source-context.md`; không mở nội dung file nghi chứa secret.

## 4. Kết thúc

Trả lời ngắn: đã điền gì ở mỗi file; danh sách "Cần xác nhận" gộp, quan trọng nhất trước; ứng viên module mẫu và cách duyệt; nhắc đọc lại, đổi `status` sang `active` khi đã duyệt, rồi commit `docs/backend-context/`.
