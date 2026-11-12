# Data Migration Contract

Áp dụng khi `db_change_required: true` (đổi schema, index, dữ liệu, seed, hoặc cấu hình ORM ảnh hưởng tới DB).

- Plan phải có mục `Migration và rollback`: migration nào được tạo, thay đổi gì, cách rollback (migration `down` hoặc script ngược), dữ liệu có bị mất không, ước lượng thời gian chạy trên bảng lớn, có khoá bảng không.
- Mọi thay đổi schema đi qua migration của ORM dự án (TypeORM/Prisma/Sequelize/Knex…). Không bật `synchronize`/`db push` cho môi trường thật, không sửa schema bằng tay.
- Không sửa migration đã merge; muốn đổi thì tạo migration mới.
- Thay đổi phá dữ liệu (drop cột/bảng, đổi kiểu, rename) làm theo nhiều bước tương thích ngược: thêm mới → ghi song song/backfill → chuyển đọc → xoá cũ ở release sau. Làm một bước phá huỷ trong cùng release cần người có thẩm quyền chấp nhận và ghi vào plan.
- Thêm cột NOT NULL vào bảng đã có dữ liệu phải có default hoặc backfill trước.
- Test phải chạy migration lên và xuống (up/down) trên DB test, ghi vào `output/test-summary.md`.
- Trước review/test/PR: `migration_status` và `rollback_plan_status` phải `passed` (hoặc `waived` kèm lý do và người duyệt).
