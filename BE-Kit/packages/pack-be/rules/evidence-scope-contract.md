# Evidence & Scope Contract

- Code chỉ sửa trong phạm vi bảng `File sẽ tạo / cập nhật` của `planning/implementation-plan.md` hoặc được người dùng xác nhận. Cần sửa ngoài plan thì dừng, cập nhật plan qua `BE input-sync`.
- Review/PR kiểm scope diff: file đã sửa phải nằm trong plan.
- Test, lint, typecheck, build, migration chỉ được claim pass khi đã chạy thật.
- `output/test-summary.md` có bảng `Command evidence log` với các cột Lệnh, Đã chạy thật?, Kết quả, Thời điểm, Ghi chú. Một dòng là bằng chứng khi `Đã chạy thật?` là `Có` và `Kết quả` là `Passed` hoặc `Failed`. Lệnh chưa chạy ghi `Không` kèm lý do.
- Chạy lại sau bugfix thì thêm dòng mới, không sửa dòng cũ.
- Không PR-ready nếu thiếu command evidence hoặc scope diff fail.
