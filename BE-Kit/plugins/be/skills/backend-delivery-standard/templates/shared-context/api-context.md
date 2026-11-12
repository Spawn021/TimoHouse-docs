---
doc_name: api-context
doc_version: 1.0.0
status: draft
owner:
last_updated:
---

# API Context

Quy ước API chung của dự án. Agent đọc file này khi task thêm hoặc đổi endpoint.

## 1. Quy ước chung

| Mục | Giá trị |
|---|---|
| Base path / prefix |  |
| Versioning | URI (`/v1`) / header / không version |
| Đặt tên path | kebab-case / camelCase, số nhiều / số ít |
| Xác thực | Header `Authorization: Bearer` / cookie / Khác |
| Định dạng ngày giờ | ISO 8601 UTC / Khác |
| Phân trang | `page`+`limit` / cursor / offset, giới hạn tối đa |

## 2. Format response

```json
// Thành công
```

```json
// Lỗi
```

## 3. Mã lỗi

| HTTP status | Error code nghiệp vụ | Khi nào |
|---|---|---|
| 400 |  |  |
| 401 |  |  |
| 403 |  |  |
| 404 |  |  |
| 409 |  |  |

## 4. Tài liệu API

| Mục | Giá trị |
|---|---|
| Swagger / OpenAPI |  |
| Client tiêu thụ API (FE, mobile, service khác) |  |
