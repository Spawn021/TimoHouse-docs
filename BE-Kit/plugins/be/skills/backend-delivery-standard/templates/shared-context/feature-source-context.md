---
doc_name: feature-source-context
doc_version: 1.0.0
status: draft
owner:
last_updated:
---

# Feature Source Context (Backend)

File này xác định **module mẫu** và cách code của module mẫu trong source hiện có. Không phải rule contract; rule bắt buộc nằm trong `.backend-delivery/rules/`.

Source chưa có module mẫu chuẩn thì ghi `Chưa có module mẫu chuẩn`, không tự chọn bừa.

## 1. Tình trạng module mẫu

| Mục | Giá trị |
|---|---|
| Có module mẫu chuẩn không? | Có / Không / Chưa xác định |
| Module mẫu |  |
| Path |  |
| Lý do chọn |  |
| Mức độ tin cậy | Cao / Trung bình / Thấp |
| Không nên copy phần nào |  |

## 2. File/pattern mẫu

| Concern | File mẫu | Pattern tham chiếu | Ghi chú |
|---|---|---|---|
| Module |  |  |  |
| Controller |  |  |  |
| Service |  |  |  |
| Repository |  |  |  |
| DTO + validate |  |  |  |
| Entity / schema |  |  |  |
| Migration |  |  |  |
| Xử lý lỗi |  |  |  |
| Unit test |  |  |  |
| E2E test |  |  |  |

## 3. Cách dùng trong task

- Chỉ tham chiếu module mẫu nếu pattern sạch và phù hợp task.
- Module mẫu mâu thuẫn với SRS/API/`.backend-delivery/rules/` thì ưu tiên SRS/API/rule.
