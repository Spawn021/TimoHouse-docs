# Implementation plan — <TASK_ID>

## Tóm tắt giải pháp

<!-- 3–6 dòng: làm gì, ở module nào, vì sao chọn cách này. -->

## API contract

<!-- Mọi endpoint/event thêm hoặc đổi. Không đổi API thì ghi "Không đổi API". -->

| Method | Path | Auth / quyền | Request DTO | Response DTO | Mã lỗi | Thay đổi (mới / additive / breaking) |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

Tương thích ngược (bắt buộc khi có breaking):

## Thay đổi dữ liệu

<!-- Bảng/collection, cột/field, index, ràng buộc. Không đổi DB thì ghi "Không đổi DB". -->

| Đối tượng | Thay đổi | Ghi chú |
|---|---|---|
|  |  |  |

## Migration và rollback

<!-- Bắt buộc khi db_change_required: true. Không đổi DB thì ghi "Không áp dụng". -->

| Migration | Up làm gì | Down / rollback | Mất dữ liệu? | Rủi ro khoá bảng / thời gian chạy |
|---|---|---|---|---|
|  |  |  |  |  |

## Luồng nghiệp vụ và xử lý lỗi

| Bước | Mô tả | Lỗi có thể xảy ra | Cách xử lý / status code |
|---|---|---|---|
| 1 |  |  |  |

## Bảo mật

- Xác thực / phân quyền:
- Kiểm quyền theo đối tượng:
- Dữ liệu nhạy cảm:

## File sẽ tạo / cập nhật

| File | Tạo / sửa | Mục đích |
|---|---|---|
|  |  |  |

## Test

| Loại | Phạm vi | Lệnh |
|---|---|---|
| Unit |  |  |
| E2E / integration |  |  |
| Migration up/down |  |  |
