# Timehouse UI Mockup Specification v1.5

> Ngày cập nhật: 13/09/2026  
> Baseline: UI Spec v1.4. Tài liệu này thay thế phần Kịch bản demo bằng Hướng dẫn thao tác; các yêu cầu nghiệp vụ, báo cáo và schema 8 của v1.4 giữ nguyên.

## 1. Lịch sử thay đổi

| Phiên bản | Nội dung |
|---|---|
| 1.4 | Danh mục 20 + 1 báo cáo, tạo/lưu/tải XLSX và schema 8. |
| 1.5 | Panel Hướng dẫn thao tác thụ động, 16 luồng/56 mốc, dữ liệu mẫu và tự nhận biết hoàn thành. |

## 2. Nguyên tắc hướng dẫn

- Header dùng nhãn **Hướng dẫn thao tác**.
- Mở hướng dẫn, chọn luồng, đi tới route, đổi vai trò, xem/tải/dùng dữ liệu mẫu không tạo record và không submit.
- Dữ liệu nghiệp vụ khởi động rỗng. Record chỉ được tạo qua nút lưu/xác nhận/commit của màn nghiệp vụ.
- Panel theo dõi 16 luồng `S0, F07, F11, F01, F08, F02, F10, F03, F09, F05, F04, F06, F12, F13, F14, F15` và 56 mốc nghiệp vụ có ID ổn định.
- Mỗi mốc có route, vai trò, chỉ dẫn, kết quả mong đợi, tiền đề, dữ liệu mẫu và điều kiện kiểm tra.
- Điều kiện được đánh giá lại sau render, save, action, submit/import commit và chuyển route. Dữ liệu không còn thỏa điều kiện làm mốc quay lại trạng thái cần kiểm tra.
- Ba trạng thái hiển thị là `Chưa sẵn sàng`, `Đang thực hiện`, `Hoàn thành`.

## 3. Panel

Panel chính gồm tiến độ toàn bộ, luồng/mốc hiện tại, màn hình, vai trò, mô tả thao tác, kết quả phải thấy và mốc tiếp theo. Các action chính:

| Action | Hiệu ứng |
|---|---|
| Đi tới màn hình | Chỉ đổi route và highlight vùng liên quan. |
| Chuyển vai trò | Đổi vai trò mô phỏng theo quyền của mốc. |
| Xem / dùng dữ liệu mẫu | Mở metadata file hoặc giá trị form. |
| Tải file mẫu | Sinh và tải CSV/PDF; không đưa vào hệ thống. |
| Dùng file mẫu | Gắn `File` qua `DataTransfer`; không mapping, validate hoặc commit. |
| Điền dữ liệu mẫu | Chỉ điền trường trống; không submit. |
| Điền lại dữ liệu mẫu | Điền lại giá trị mẫu khi người dùng chủ động yêu cầu; không submit. |
| Xem toàn bộ luồng | Mở danh sách 16 luồng, trạng thái và tiền đề. |

Desktop dành vùng bên phải cho panel để không che bảng/action. Mobile dùng bottom sheet cuộn riêng, giữ khoảng trống cho badge Netlify; khi modal mở, sheet giảm chiều cao. Nút có vùng bấm tối thiểu 44 px, focus rõ và tắt animation khi `prefers-reduced-motion`.

## 4. Dữ liệu mẫu

Import phải hiển thị mục đích, tên file, số dòng, cột, quan hệ mã và lỗi cố ý. Bộ mẫu gồm tòa, bảng giá/danh mục, phòng và retry, khách, hợp đồng, dịch vụ hợp đồng, số dư, chỉ số và dòng sửa, bảng kê thu tiền và retry, PDF hợp đồng/chứng từ. Form tạo mới có payload hợp lệ theo mốc, chỉ điền sau khi form đã mở.

Mọi file dùng cùng parser, mapping, validation, preview và commit của giao diện thật. `openSample()` và `useSample()` không được gọi submitter/action dispatcher.

## 5. Tiến độ và API

Tiến độ lưu tại `timehouse-guide-v1` gồm flow, milestone, mốc quan sát và thời gian hoàn thành. Khi nâng cấp từ `timehouse-demo-v7`, hệ thống dùng dữ liệu hiện có và `expect` của flow để nhận diện lại kết quả, không xóa nghiệp vụ.

API hướng dẫn: `currentGuide`, `syncGuide`, `openGuide`, `openSample`, `useSample`, `resetGuideProgress`. API cũ `start`, `goto`, `runStep`, `runScenario`, `runAll`, `runTo`, `resetData`, `autoStep` vẫn thuộc `__timehouseDemo`, chỉ xuất hiện trong **Công cụ nâng cao**.

## 6. Nghiệm thu

- Cấu hình có đúng 16 luồng, 56 ID mốc duy nhất và mọi mốc có route/vai trò/instruction/expected.
- Bốn thao tác hướng dẫn chính không làm thay đổi collection nghiệp vụ.
- Form mẫu không tự lưu; file mẫu đi qua file input và không commit trước xác nhận.
- Sau full run kỹ thuật, hướng dẫn nhận diện lại các flow từ dữ liệu hiện có.
- Schema vẫn là 8; `resetGuideProgress()` không xóa dữ liệu.
- Panel chính không chứa nút `Chạy bước này`, `Chạy tiếp kịch bản` hoặc `Chạy toàn bộ`; các nút tự chạy chỉ nằm trong `<details>` Công cụ nâng cao.
- Browser 1440 px và 375 px không overflow, panel không che modal, bảng, action hoặc badge hosting.
