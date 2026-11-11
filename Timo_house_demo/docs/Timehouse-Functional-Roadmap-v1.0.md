# TIMEHOUSE – PHẠM VI CHỨC NĂNG THEO GIAI ĐOẠN

## Thông tin tài liệu

| Nội dung | Thông tin |
|---|---|
| Tên dự án | TimeHouse – Hệ thống quản lý vận hành nhà cho thuê |
| Loại tài liệu | Phạm vi chức năng và lộ trình triển khai |
| Phiên bản | 1.0 |
| Ngày cập nhật | 14/09/2026 |
| Trạng thái | Dự thảo gửi khách hàng xác nhận |
| Đơn vị thực hiện | `[Điền tên đơn vị thực hiện]` |
| Khách hàng | `[Điền tên khách hàng]` |

> **Lưu ý về hiện trạng:** phiên bản phần mềm hiện tại thuộc **Phase 1 – Core Rental / Go-live** và đang ở dạng **mockup tương tác phục vụ trình diễn, rà soát nghiệp vụ và chốt yêu cầu**. Dữ liệu đang lưu trên trình duyệt; các kết nối dịch vụ bên ngoài như Zalo, SMS, ngân hàng và cổng thanh toán chưa phải kết nối production.

## 1. Mục đích tài liệu

Tài liệu này giúp hai bên thống nhất:

- Mục tiêu kinh doanh của từng giai đoạn triển khai.
- Nhóm chức năng và kết quả bàn giao của từng phase.
- Phạm vi đang thực hiện, phạm vi dự kiến và các nội dung chưa bao gồm.
- Tiêu chí xác nhận hoàn thành ở mức nghiệp vụ.
- Nguyên tắc xử lý các yêu cầu phát sinh hoặc thay đổi phạm vi.

Tài liệu mô tả phạm vi chức năng ở mức phục vụ trao đổi và xác nhận với khách hàng. Chi tiết màn hình, quy tắc tính toán, phân quyền, tích hợp, kế hoạch thời gian và chi phí sẽ được chốt trong tài liệu yêu cầu hoặc phụ lục tương ứng trước khi phát triển production.

## 2. Tổng quan lộ trình

| Giai đoạn | Trọng tâm | Giá trị mang lại | Trạng thái |
|---|---|---|---|
| **Phase 1 – Core Rental / Go-live** | Vận hành cho thuê cốt lõi | Số hóa luồng từ phòng, khách thuê, hợp đồng đến hóa đơn, công nợ, thu tiền và trả phòng | **Hiện tại – đã có mockup tương tác** |
| **Phase 2 – Sales, Automation & Operations** | Kinh doanh và tối ưu vận hành | Bổ sung CRM, tự động hóa, bảo trì, đối soát và báo cáo quản trị | Dự kiến / chưa triển khai |
| **Phase 3 – Enterprise & Investment** | Quản trị doanh nghiệp và đầu tư | Mở rộng sang tài sản, nhân sự, cổ đông, đầu tư và tài chính tích hợp | Định hướng / chưa triển khai |

Luồng nghiệp vụ trọng tâm của Phase 1:

```text
Tòa nhà → Phòng → Khách thuê → Hợp đồng
→ Dịch vụ & điện nước → Hóa đơn → Công nợ & thu tiền
→ Thông báo Zalo → Kết thúc hợp đồng → Hoàn cọc → Phòng sẵn sàng
```

## 3. Phase 1 – Core Rental / Go-live

### 3.1. Mục tiêu

Hoàn thiện luồng nghiệp vụ tối thiểu để doanh nghiệp có thể quản lý hoạt động cho thuê hằng ngày trên một hệ thống thống nhất, giảm theo dõi rời rạc bằng bảng tính và tạo nền tảng dữ liệu cho các phase tiếp theo.

### 3.2. Phạm vi chức năng

| Nhóm chức năng | Nội dung chính | Kết quả mong đợi |
|---|---|---|
| Đăng nhập và phân quyền | Đăng nhập/đăng xuất; quản lý tài khoản; vai trò Quản trị viên, Kế toán, Quản lý/Vận hành; giới hạn dữ liệu theo tòa được phân công | Người dùng chỉ xem và thao tác trên chức năng, dữ liệu phù hợp với vai trò |
| Tổng quan vận hành | Thống kê tình trạng phòng; chỉ số phải thu, đã thu, còn nợ, quá hạn; danh sách việc cần xử lý | Người quản lý nắm nhanh tình hình vận hành và tài chính |
| Tòa nhà | Danh sách và chi tiết tòa; thông tin địa chỉ, quy mô, người phụ trách; hồ sơ chủ nhà và hợp đồng đầu vào cơ bản | Quản lý tập trung danh mục tòa và thông tin liên quan |
| Phòng | Danh sách/chi tiết phòng; giá tham chiếu; dịch vụ mặc định; import dữ liệu; trạng thái Sẵn sàng, Đang thuê, Chờ dọn, Bảo trì, Ngừng sử dụng | Theo dõi chính xác tình trạng và khả năng khai thác từng phòng |
| Chủ nhà và đối tác | Hồ sơ chủ nhà; hợp đồng đầu vào; lịch thanh toán cơ bản; ghi nhận thanh toán và chứng từ | Theo dõi nghĩa vụ cơ bản với chủ nhà |
| Khách thuê | Hồ sơ, thông tin liên hệ/Zalo, giấy tờ, phương tiện, lịch sử thuê và công nợ; import danh sách khách | Có hồ sơ khách thuê tập trung và liên kết với phòng/hợp đồng |
| Hợp đồng thuê | Tạo nháp, kích hoạt, gia hạn, kết thúc hoặc hủy; giá thuê, tiền cọc, thời hạn, chu kỳ thanh toán, thành viên ở cùng, dịch vụ áp dụng và tài liệu đính kèm | Quản lý vòng đời hợp đồng và tự động cập nhật trạng thái phòng |
| Dịch vụ và bảng giá | Danh mục điện, nước, Internet, phí quản lý, gửi xe và dịch vụ khác; đơn vị tính, giá, phạm vi và ngày hiệu lực | Chuẩn hóa các khoản tính tiền theo hợp đồng/phòng |
| Điện nước hằng tháng | Nhập hoặc import chỉ số; đối chiếu kỳ trước; cảnh báo dữ liệu bất thường; dùng chỉ số khi lập hóa đơn | Hạn chế sai sót và tránh sử dụng trùng chỉ số |
| Hóa đơn | Tạo đơn lẻ hoặc hàng loạt theo kỳ; lưu nháp, phát hành, hủy nháp, điều chỉnh; chi tiết tiền phòng/dịch vụ/điện nước; xuất bản in/PDF | Hình thành hóa đơn và theo dõi trạng thái thanh toán xuyên suốt |
| Công nợ và thu tiền | Theo dõi phải thu, đã thu, còn nợ và quá hạn; ghi nhận thu đủ hoặc một phần; phân bổ vào hóa đơn; đính kèm minh chứng; hoàn tác/điều chỉnh khoản thu theo quyền | Số dư công nợ được cập nhật theo các khoản thu thực tế |
| Hoàn cọc và trả phòng | Kết thúc hợp đồng; kiểm tra công nợ; lập phương án khấu trừ; gửi duyệt, duyệt/từ chối; ghi nhận đã hoàn; chuyển phòng sang Chờ dọn và xác nhận dọn xong | Khép kín quy trình trả phòng và đưa phòng trở lại trạng thái Sẵn sàng |
| Chi phí cơ bản | Ghi nhận khoản chi theo nhóm, tòa, ngày, số tiền, chứng từ và ghi chú | Có dữ liệu chi phí vận hành ban đầu |
| Thông báo Zalo | Cấu hình sự kiện và mẫu; lập danh sách người nhận; gửi hóa đơn/nhắc công nợ; kiểm tra lại công nợ trước khi gửi; theo dõi kết quả và thử lại tin lỗi | Hỗ trợ quy trình thông báo và nhắc thanh toán có kiểm soát |
| Báo cáo cơ bản | Báo cáo phòng, công nợ và thu tiền; lọc theo kỳ/tòa; xuất dữ liệu | Cung cấp bộ báo cáo tối thiểu cho vận hành hằng ngày |
| Import dữ liệu | Import phòng, khách thuê, chỉ số điện nước và hóa đơn bằng file mẫu; kiểm tra dòng hợp lệ/lỗi trước khi ghi nhận | Hỗ trợ khởi tạo và cập nhật dữ liệu hàng loạt |

### 3.3. Luồng nghiệp vụ nghiệm thu Phase 1

Phase 1 được xem là đạt yêu cầu nghiệp vụ khi có thể trình diễn xuyên suốt các bước sau trên dữ liệu kiểm thử đã thống nhất:

1. Tạo hoặc import khách thuê.
2. Chọn một phòng đang Sẵn sàng và tạo hợp đồng.
3. Thiết lập giá thuê, tiền cọc, kỳ thanh toán và dịch vụ; kích hoạt hợp đồng.
4. Ghi nhận chỉ số điện nước của kỳ.
5. Tạo và phát hành hóa đơn.
6. Chuẩn bị và gửi thông báo hóa đơn qua luồng Zalo.
7. Xem công nợ, ghi nhận thu đủ hoặc thu một phần và kiểm tra số còn nợ.
8. Gửi nhắc công nợ; theo dõi trạng thái gửi và thử lại trường hợp lỗi.
9. Kết thúc hợp đồng và lập hồ sơ hoàn cọc.
10. Duyệt, ghi nhận hoàn cọc; chuyển phòng sang Chờ dọn.
11. Xác nhận dọn xong và đưa phòng về trạng thái Sẵn sàng.
12. Kiểm tra báo cáo phòng, công nợ và thu tiền theo kỳ.

Việc nghiệm thu bản production còn phụ thuộc vào kiểm thử phân quyền, dữ liệu thật, tích hợp thật, bảo mật, hiệu năng, sao lưu và vận hành; các nội dung này sẽ được quy định trong kế hoạch triển khai production.

### 3.4. Chưa bao gồm trong Phase 1

- CRM/Lead, lịch xem phòng, giữ chỗ tự động, quản lý kênh cho thuê và hoa hồng sale.
- OCR/AI trích xuất hợp đồng, chữ ký điện tử và phê duyệt hợp đồng nhiều cấp.
- Import bảng kê ngân hàng, tự động đối soát hoặc tự động khớp giao dịch.
- Bảo trì/sửa chữa, lịch bảo dưỡng và quản lý nhà cung cấp nâng cao.
- Workflow hoàn cọc nhiều cấp hoặc theo ngưỡng số tiền.
- Rule Builder đa kênh, fallback SMS/email và hội thoại hai chiều.
- Báo cáo BI, lợi nhuận, dòng tiền, khóa kỳ và trình tạo báo cáo tùy chỉnh.
- Quản trị tài sản nâng cao, nhân sự, cổ đông, đầu tư và cổng nhà đầu tư.

## 4. Phase 2 – Sales, Automation & Operations

### 4.1. Mục tiêu

Tối ưu hoạt động kinh doanh và vận hành sau khi dữ liệu lõi của Phase 1 đã ổn định; giảm thao tác thủ công, tăng khả năng kiểm soát và cung cấp báo cáo quản trị sâu hơn.

### 4.2. Phạm vi dự kiến

| Nhóm chức năng | Nội dung chính | Kết quả mong đợi |
|---|---|---|
| CRM và Lead | Danh sách/Kanban Lead; nguồn khách; sale phụ trách; lịch sử chăm sóc; pipeline từ Lead mới đến Chốt thuê | Theo dõi tập trung cơ hội thuê và tỷ lệ chuyển đổi |
| Lịch xem và giữ chỗ | Đặt lịch xem phòng; nhắc lịch; kết quả xem; phí và thời hạn giữ chỗ; tự hết hạn và khóa phòng khỏi nguồn sale | Hạn chế xung đột phòng và chuẩn hóa quy trình trước hợp đồng |
| Chốt thuê và hoa hồng | Chuyển Lead thành khách thuê/hợp đồng; ghi nhận giao dịch, doanh số và điều kiện hoa hồng | Liên kết kết quả kinh doanh với dữ liệu vận hành |
| OCR hợp đồng | Tải PDF/JPG; trích xuất trường; cảnh báo độ tin cậy; người dùng rà soát trước khi đưa vào hợp đồng | Giảm thời gian nhập liệu hợp đồng |
| Bảo trì và bảo dưỡng | Tiếp nhận sự cố; ưu tiên; phân công; trạng thái xử lý; lịch bảo dưỡng; nhà cung cấp; checklist và bằng chứng | Theo dõi trách nhiệm, tiến độ và chi phí bảo trì |
| Import và đối soát nâng cao | Nhập bảng kê thu tiền; cấu hình mapping; tự khớp hóa đơn; xử lý ngoại lệ; Data Job và chạy lại dòng lỗi | Giảm nhập liệu và đối soát thủ công |
| Tài chính nâng cao | Phân bổ chi phí; quản lý cọc; sổ thu chi; dòng tiền; kết quả vận hành; quản lý/khóa kỳ | Tăng khả năng kiểm soát tài chính theo tòa và theo kỳ |
| Thông báo nâng cao | Rule Builder; nhiều sự kiện; quản lý phiên bản mẫu; lập lịch; phản hồi nhà cung cấp; retry policy; kênh dự phòng | Tự động hóa thông báo có thể cấu hình và theo dõi |
| Báo cáo quản trị | Tỷ lệ lấp đầy; thời gian trống; chi phí/lợi nhuận theo tòa; hiệu suất sale; khách hàng; marketing; bảo trì; Report Hub | Hỗ trợ đánh giá hiệu quả và ra quyết định quản trị |

### 4.3. Điều kiện đầu vào và nghiệm thu dự kiến

- Dữ liệu danh mục, phòng, khách thuê, hợp đồng và hóa đơn của Phase 1 đã được chuẩn hóa.
- Hai bên chốt pipeline sale, cách tính hoa hồng, quy trình bảo trì, quy tắc đối soát và công thức báo cáo trước khi phát triển.
- Các luồng từ Lead đến hợp đồng, từ sự cố đến hoàn tất và từ bảng kê đến đối soát phải chạy xuyên suốt trên bộ dữ liệu kiểm thử.
- Báo cáo phải đối chiếu được với dữ liệu nguồn và công thức đã được khách hàng xác nhận.

## 5. Phase 3 – Enterprise & Investment

### 5.1. Mục tiêu

Mở rộng TimeHouse từ hệ thống vận hành cho thuê thành nền tảng quản trị doanh nghiệp và đầu tư, trên cơ sở dữ liệu đã hình thành ở Phase 1–2.

### 5.2. Phạm vi định hướng

| Nhóm chức năng | Nội dung chính | Kết quả mong đợi |
|---|---|---|
| Quản lý tài sản | Tài sản theo phòng/tòa; mã QR; kiểm kê; tình trạng; mất/hỏng; khấu hao và lịch sử | Kiểm soát vòng đời tài sản và chênh lệch kiểm kê |
| Nhân sự | Hồ sơ nhân viên; phòng ban/chức danh; phân công; KPI; chấm công và bảng lương khi có nhu cầu | Liên kết nguồn lực nhân sự với hoạt động vận hành |
| Cổ đông và vốn góp | Danh sách cổ đông; tỷ lệ góp vốn; đợt góp vốn; số đã góp/còn thiếu; lịch sử giao dịch | Minh bạch tình trạng vốn góp theo dự án/chủ thể |
| Phân phối lợi nhuận | Cấu hình tỷ lệ; kỳ phân phối; số phải trả/đã trả; hiệu quả đầu tư | Theo dõi nghĩa vụ và kết quả đầu tư |
| Cổng nhà đầu tư | Dashboard vốn góp, lợi nhuận, lịch phân phối và tài liệu | Cung cấp kênh tra cứu riêng cho nhà đầu tư |
| Thanh toán và ngân hàng | QR Payment; cổng thanh toán; kết nối ngân hàng; webhook; đối soát và tự khớp giao dịch | Tự động hóa ghi nhận thanh toán và đối soát |
| Audit và BI | Nhật ký nâng cao; dashboard BI; báo cáo tùy chỉnh; cảnh báo và phát hiện bất thường | Tăng khả năng kiểm soát, truy vết và phân tích |

### 5.3. Điều kiện đầu vào và nghiệm thu dự kiến

- Mô hình pháp lý, cơ cấu cổ đông, nguyên tắc góp vốn và phân phối lợi nhuận phải được khách hàng phê duyệt.
- Công thức khấu hao, KPI, lương thưởng và hiệu quả đầu tư phải được chốt bằng phụ lục nghiệp vụ riêng.
- Mọi tích hợp ngân hàng/cổng thanh toán phụ thuộc API, tài khoản, hợp đồng dịch vụ và môi trường kiểm thử do bên thứ ba cung cấp.
- Báo cáo tài chính/đầu tư phải đối chiếu được với bộ số liệu chuẩn đã được hai bên xác nhận.

## 6. Ma trận phân bổ chức năng

| Nhóm chức năng | Phase 1 | Phase 2 | Phase 3 |
|---|:---:|:---:|:---:|
| Vận hành tòa nhà, phòng, khách thuê | ● |  |  |
| Hợp đồng thuê và dịch vụ | ● | Mở rộng OCR/automation |  |
| Hóa đơn, công nợ, thu tiền | ● | Đối soát và quản lý kỳ | Tích hợp ngân hàng/thanh toán |
| Trả phòng và hoàn cọc | ● | Workflow nâng cao |  |
| Zalo/thông báo | ● | Tự động hóa đa sự kiện/kênh |  |
| Báo cáo | Cơ bản | Quản trị | BI và tùy chỉnh nâng cao |
| CRM, lịch xem, sale, hoa hồng |  | ● |  |
| Bảo trì và bảo dưỡng |  | ● |  |
| Tài sản và kiểm kê | Cơ bản theo phòng | Theo dõi trong bảo trì | ● |
| Nhân sự |  |  | ● |
| Cổ đông và đầu tư |  |  | ● |

Ký hiệu **●** là phase sở hữu phạm vi chính. Các nội dung “mở rộng” kế thừa dữ liệu và chức năng lõi của phase trước.

## 7. Giả định và phụ thuộc

- Khách hàng cung cấp dữ liệu mẫu, biểu mẫu, quy trình hiện hành và người phụ trách xác nhận nghiệp vụ.
- Dữ liệu đưa vào hệ thống phải đúng định dạng, đầy đủ và được khách hàng xác nhận quyền sử dụng.
- Khách hàng cung cấp hoặc phối hợp đăng ký các tài khoản dịch vụ bên thứ ba như Zalo OA/ZBS, SMS, email, ngân hàng hoặc cổng thanh toán.
- Khả năng tích hợp phụ thuộc chính sách, hạn mức, chi phí và API của từng nhà cung cấp tại thời điểm thực hiện.
- Thời gian, chi phí, hạ tầng, chuyển đổi dữ liệu, hỗ trợ vận hành và SLA không được xác định trong tài liệu này; các nội dung đó cần được lập thành kế hoạch hoặc phụ lục riêng.
- Các chức năng liên quan kế toán, thuế, đầu tư và dữ liệu cá nhân cần được khách hàng hoặc đơn vị tư vấn chuyên môn xác nhận trước khi triển khai production.

## 8. Quản lý thay đổi phạm vi

Một yêu cầu được xem là thay đổi phạm vi khi làm phát sinh chức năng, vai trò, luồng phê duyệt, tích hợp, báo cáo hoặc quy tắc tính toán chưa được mô tả trong phase tương ứng.

Quy trình đề xuất:

1. Ghi nhận yêu cầu và mục tiêu nghiệp vụ.
2. Phân tích ảnh hưởng đến phạm vi, dữ liệu, bảo mật, thời gian và chi phí.
3. Hai bên thống nhất đưa yêu cầu vào phase hiện tại, chuyển sang phase sau hoặc lập hạng mục riêng.
4. Chỉ triển khai sau khi thay đổi được xác nhận bằng văn bản hoặc phụ lục.

Nguyên tắc khóa scope Phase 1: không đưa thêm chức năng Phase 2/3 vào Phase 1 nếu chức năng đó không ảnh hưởng trực tiếp đến khả năng vận hành cho thuê cốt lõi.

## 9. Xác nhận của khách hàng

Khách hàng xác nhận đã đọc và thống nhất định hướng phân chia phạm vi theo ba phase nêu trên. Việc xác nhận tài liệu này là cơ sở để tiếp tục chốt yêu cầu chi tiết, kế hoạch, thời gian, chi phí và tiêu chí nghiệm thu production cho từng phase.

| Đại diện khách hàng | Đại diện đơn vị thực hiện |
|---|---|
| Họ tên: `[Điền thông tin]` | Họ tên: `[Điền thông tin]` |
| Chức vụ: `[Điền thông tin]` | Chức vụ: `[Điền thông tin]` |
| Ngày xác nhận: `____/____/______` | Ngày xác nhận: `____/____/______` |
| Chữ ký: | Chữ ký: |

