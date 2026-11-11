# TimoHouse – Phân chia phạm vi triển khai theo 3 Phase

## 1. Mục tiêu chung

TimoHouse được chia thành 3 phase để ưu tiên khả năng vận hành thực tế ngay từ giai đoạn đầu, tránh triển khai quá nhiều chức năng cùng lúc.

- **Phase 1:** Hoàn thành là công ty có thể đưa hệ thống vào vận hành thực tế.
- **Phase 2:** Tối ưu quy trình vận hành, kinh doanh, báo cáo và tự động hóa.
- **Phase 3:** Mở rộng sang quản trị doanh nghiệp, đầu tư và các chức năng nâng cao.

Trọng tâm Phase 1:

```text
Tòa nhà
→ Phòng
→ Khách thuê
→ Hợp đồng
→ Dịch vụ / Điện nước
→ Hóa đơn
→ Công nợ
→ Thu tiền
→ Thông báo Zalo
→ Trả phòng / Hoàn cọc
```

---

# 2. Phase 1 – Core Rental Operation

## 2.1. Mục tiêu

Sau khi hoàn thành Phase 1, công ty có thể sử dụng TimoHouse để vận hành nghiệp vụ cho thuê hàng ngày.

Các nghiệp vụ tối thiểu phải chạy được:

1. Quản lý tòa nhà.
2. Quản lý phòng.
3. Quản lý khách thuê.
4. Tạo và quản lý hợp đồng.
5. Quản lý dịch vụ theo phòng/hợp đồng.
6. Nhập điện nước hàng tháng.
7. Tạo hóa đơn.
8. Theo dõi công nợ.
9. Ghi nhận khách thanh toán.
10. Gửi thông báo hóa đơn/công nợ qua Zalo.
11. Theo dõi trạng thái gửi Zalo.
12. Kết thúc hợp đồng.
13. Hoàn cọc.
14. Chuyển phòng sang trạng thái chờ dọn.
15. Xác nhận dọn xong và đưa phòng về trạng thái sẵn sàng.

## 2.2. Chức năng Phase 1

### A. Đăng nhập & phân quyền cơ bản
- Đăng nhập/đăng xuất.
- Quản lý tài khoản.
- Vai trò cơ bản: Admin, Kế toán, Quản lý/Vận hành.
- Phạm vi theo tòa/khu vực nếu cần.

### B. Dashboard cơ bản
**Phòng**
- Tổng phòng.
- Đang thuê.
- Sẵn sàng.
- Sắp trống.
- Chờ dọn.

**Tài chính**
- Phải thu.
- Đã thu.
- Còn nợ.
- Quá hạn.

**Việc cần xử lý**
- Hợp đồng sắp hết hạn.
- Hóa đơn quá hạn.
- Tin Zalo gửi lỗi.
- Hoàn cọc đang xử lý.

### C. Quản lý tòa nhà
- Danh sách tòa nhà.
- Thêm/sửa/chi tiết.
- Địa chỉ, khu vực, số tầng, số phòng, người phụ trách.
- Chủ nhà và hợp đồng đầu vào ở mức cơ bản.
- Upload tài liệu hợp đồng.
- Chu kỳ thanh toán cơ bản.

### D. Quản lý phòng
- Danh sách, tạo/sửa, chi tiết phòng.
- Import CSV/XLSX + template.
- Giá thuê tham chiếu, tầng, tòa, loại phòng, dịch vụ mặc định.
- Trạng thái: Sẵn sàng, Đang thuê, Chờ dọn, Bảo trì, Ngừng sử dụng.

### E. Khách thuê
- Danh sách, tạo/sửa, chi tiết.
- Import khách CSV/XLSX.
- SĐT, Zalo, giấy tờ, nghề nghiệp, xe, phòng hiện tại, lịch sử thuê, công nợ.

### F. Hợp đồng
- Danh sách, tạo, chi tiết.
- Upload hợp đồng.
- Giá thuê, tiền cọc, thời hạn, chu kỳ thanh toán.
- Thành viên ở cùng.
- Dịch vụ áp dụng.

**Luồng:**
```text
Phòng sẵn sàng
→ Chọn khách
→ Tạo hợp đồng
→ Cấu hình giá/cọc/dịch vụ
→ Xác nhận
→ Phòng chuyển Đang thuê
```

**Chưa làm Phase 1:** E-sign, OCR/AI nâng cao, approval nhiều cấp.

### G. Dịch vụ & bảng giá
- Điện, nước, Internet, phí quản lý, gửi xe, dịch vụ khác.
- Đơn vị tính, giá mặc định, phạm vi áp dụng, ngày hiệu lực.

### H. Điện nước hàng tháng
- Nhập chỉ số.
- Import chỉ số.
- Xem kỳ trước.
- Kiểm tra dữ liệu bất thường.
- Tính tiền theo bảng giá.

### I. Hóa đơn
- Danh sách, chi tiết.
- Tạo theo phòng / tạo hàng loạt theo kỳ.
- Tiền phòng, dịch vụ, điện nước.
- Lưu nháp, phát hành.
- Xuất PDF.

**Trạng thái:** Nháp, Đã phát hành, Chưa thu, Thu một phần, Thu đủ, Quá hạn.

### J. Công nợ
- Theo phòng + tòa.
- Phải thu, đã thu, còn nợ, quá hạn.
- Lọc theo kỳ/tòa/trạng thái.

### K. Ghi nhận thu tiền
- Thu thủ công.
- Ngày thu, số tiền, phương thức, tham chiếu, bằng chứng.
- Phân bổ vào hóa đơn.
- Cho phép thu một phần.

Ví dụ:
```text
Hóa đơn: 5.700.000
Đã thu: 3.000.000
Còn nợ: 2.700.000
```

---

## 2.3. Thông báo hóa đơn và công nợ qua Zalo

Đây là chức năng bắt buộc trong Phase 1.

### Luồng gửi hóa đơn
```text
Tạo hóa đơn
→ Phát hành
→ Chuẩn bị danh sách người nhận
→ Kiểm tra Zalo/SĐT
→ Gửi thông báo
→ Ghi nhận kết quả
```

Nội dung có thể gồm:
- Tên khách.
- Tòa nhà.
- Mã phòng.
- Kỳ hóa đơn.
- Tổng tiền.
- Số còn nợ.
- Hạn thanh toán.

### Nhắc trước hạn
```text
Hạn thanh toán: 05/10
Rule: Nhắc trước 2 ngày
→ 03/10 kiểm tra công nợ
→ Nếu còn nợ → gửi Zalo
```

### Nhắc quá hạn
```text
Invoice quá hạn
AND Outstanding amount > 0
→ Đưa vào danh sách gửi nhắc
```

### Kiểm tra lại trước khi gửi
```text
Chuẩn bị batch
→ Re-check công nợ
```

- Đã thanh toán đủ → Skip.
- Thanh toán một phần → cập nhật số còn nợ rồi gửi số tiền còn lại.

### Retry
- Xem tin thành công.
- Xem tin lỗi.
- Retry các tin đủ điều kiện.
- Không gửi lại người đã nhận thành công.

### Cấu hình cơ bản
- Mẫu nhắc hóa đơn.
- Mẫu nhắc công nợ.
- Thời điểm gửi.
- Số ngày nhắc trước hạn.
- Retry.
- Bật/tắt rule.

---

## 2.4. Trả phòng & hoàn cọc

### Trả phòng
```text
Hợp đồng
→ Ghi nhận kết thúc
→ Kiểm tra công nợ
→ Phòng chuyển Chờ dọn
```

### Hoàn cọc cơ bản
- Tiền cọc.
- Công nợ còn lại.
- Khấu trừ.
- Vệ sinh.
- Sửa chữa.
- Chi phí khác.
- Số tiền thực hoàn.
- Bằng chứng hoàn tiền.

```text
Hoàn cọc + Dọn phòng xong
→ Phòng = Sẵn sàng
```

Workflow duyệt nhiều cấp chuyển Phase 2.

---

## 2.5. Chi phí cơ bản
- Danh sách chi phí.
- Tạo chi phí.
- Nhóm chi, tòa, số tiền, ngày ghi nhận, chứng từ, ghi chú.

Phân bổ chi phí nâng cao chuyển Phase 2.

---

## 2.6. Báo cáo Phase 1
- Báo cáo phòng.
- Báo cáo công nợ.
- Báo cáo thu tiền.

Report Hub và BI nâng cao chuyển Phase 2–3.

---

## 2.7. Sidebar Phase 1 đề xuất

```text
Tổng quan

Vận hành
├── Tòa nhà
├── Phòng
├── Khách thuê
└── Hợp đồng

Tài chính
├── Hóa đơn
├── Công nợ & Thu tiền
├── Hoàn cọc
└── Chi phí

Thông báo
├── Gửi Zalo
└── Lịch sử gửi

Báo cáo
├── Phòng
├── Công nợ
└── Thu tiền

Cấu hình
├── Tài khoản
├── Dịch vụ & Bảng giá
└── Cấu hình Zalo
```

---

## 2.8. Điều kiện Go-live Phase 1

```text
1. Tạo khách
2. Chọn phòng
3. Tạo hợp đồng
4. Thiết lập giá + dịch vụ
5. Nhập điện nước
6. Tạo hóa đơn
7. Gửi hóa đơn qua Zalo
8. Xem công nợ
9. Ghi nhận khách trả tiền
10. Theo dõi số còn nợ
11. Nhắc công nợ qua Zalo
12. Kết thúc hợp đồng
13. Hoàn cọc
14. Chuyển phòng Chờ dọn
15. Xác nhận dọn xong
16. Phòng trở lại Sẵn sàng
```

---

# 3. Phase 2 – Sales & Operational Optimization

## 3.1. Mục tiêu
- Tối ưu Sale.
- Tăng automation.
- Bảo trì vận hành.
- Báo cáo quản trị.
- Giảm nhập liệu thủ công.

## 3.2. CRM / Kinh doanh

### Lead Management
- Lead list.
- Lead Kanban.
- Nguồn khách.
- Sale phụ trách.
- Lịch sử chăm sóc.
- Ghi chú.
- Trạng thái lead.

### Pipeline
```text
Mới
→ Đã liên hệ
→ Hẹn xem
→ Cân nhắc
→ Giữ chỗ
→ Chốt thuê
```

### Lịch xem phòng
- Đặt lịch.
- Chọn phòng.
- Nhân viên phụ trách.
- Nhắc lịch.
- Kết quả xem.

### Giữ chỗ
- Thời gian giữ.
- Phí giữ chỗ.
- Điều kiện hủy.
- Auto-expire.
- Khóa phòng khỏi danh sách sale.

### Chốt thuê
```text
Lead
→ Customer
→ Room
→ Rental terms
→ Contract
```

### Doanh số & hoa hồng
- Deal.
- Sale.
- Giá thuê.
- Cọc.
- Doanh số.
- Hoa hồng.
- Điều kiện chi trả.

## 3.3. Bảo trì & vận hành
- Sự cố.
- Phân công.
- Priority.
- Chi phí liên quan.
- Lịch bảo dưỡng.
- Nhà cung cấp.
- Checklist.
- Evidence.

## 3.4. Import & đối soát nâng cao
- Import bảng kê thu tiền.
- Mapping.
- Auto-match.
- Review.
- Data Jobs.
- Retry dòng lỗi.
- Import số dư đầu kỳ.
- Đối chiếu.

## 3.5. Tài chính nâng cao
- Phân bổ chi phí.
- Chi phí theo tòa.
- Cashflow.
- Operating Result.
- Profit.
- Period Closing.

## 3.6. Báo cáo nâng cao
- Tỷ lệ lấp đầy.
- Thời gian trống.
- Dòng tiền.
- Chi phí theo tòa.
- Lợi nhuận vận hành.
- Công nợ.
- Hiệu suất Sale.
- Khách hàng.
- Marketing.
- Bảo trì.
- Hoàn cọc.

## 3.7. Notification nâng cao
- Rule Builder.
- Nhiều loại event.
- Template management.
- Lịch sử chi tiết.
- Provider response.
- Retry policy.
- Scheduling.
- Fallback channel.

## 3.8. OCR hợp đồng
- Upload PDF/JPG.
- Trích xuất dữ liệu.
- Review field.
- Confidence warning.
- Mapping vào form hợp đồng.

---

# 4. Phase 3 – Enterprise Management

## 4.1. Asset Management
- Danh mục tài sản.
- Tài sản theo phòng/tòa.
- QR code.
- Kiểm kê.
- Tình trạng.
- Hỏng/mất.
- Khấu hao.
- Lịch sử tài sản.

## 4.2. Nhân sự
- Hồ sơ nhân viên.
- Phòng ban.
- Chức danh.
- Phân công.
- KPI.
- Chấm công nếu cần.
- Bảng lương.
- Lịch sử nhân sự.

## 4.3. Cổ đông / Đầu tư
- Danh sách cổ đông.
- Tỷ lệ góp vốn.
- Đợt góp vốn.
- Số đã góp.
- Số còn thiếu.
- Phân phối lợi nhuận.
- Lịch phân phối.
- Hiệu quả đầu tư.

## 4.4. Investor Portal
- Dashboard nhà đầu tư.
- Vốn góp.
- Lợi nhuận.
- Lịch phân phối.
- Tài liệu đầu tư.

## 4.5. Payment & Banking nâng cao
- QR Payment.
- Payment Gateway.
- Bank Integration.
- Bank Reconciliation.
- Auto-match giao dịch.
- Payment webhook.

## 4.6. Audit / BI
- Audit log nâng cao.
- Dashboard BI.
- Custom report builder.
- Data warehouse khi cần.
- Advanced alerts.
- Anomaly detection.

---

# 5. Tổng hợp phạm vi theo Phase

| Nhóm chức năng | Phase 1 | Phase 2 | Phase 3 |
|---|:---:|:---:|:---:|
| Đăng nhập | ✅ | | |
| Tài khoản / Role cơ bản | ✅ | | |
| Dashboard cơ bản | ✅ | | |
| Tòa nhà | ✅ | | |
| Phòng | ✅ | | |
| Chủ nhà / HĐ đầu vào cơ bản | ✅ | Nâng cao | |
| Khách thuê | ✅ | | |
| Import khách/phòng | ✅ | | |
| Hợp đồng | ✅ | | |
| OCR hợp đồng | | ✅ | |
| Dịch vụ / Bảng giá | ✅ | | |
| Điện nước | ✅ | | |
| Hóa đơn | ✅ | | |
| Công nợ | ✅ | | |
| Thu tiền thủ công | ✅ | | |
| Thu một phần | ✅ | | |
| Import bảng kê | | ✅ | |
| Zalo hóa đơn / công nợ | ✅ | | |
| Notification nâng cao | | ✅ | |
| Hoàn cọc cơ bản | ✅ | | |
| Workflow hoàn cọc nâng cao | | ✅ | |
| Chi phí cơ bản | ✅ | | |
| Chi phí phân bổ | | ✅ | |
| CRM Lead | | ✅ | |
| Lịch xem phòng | | ✅ | |
| Giữ chỗ | | ✅ | |
| Chốt thuê | | ✅ | |
| Hoa hồng | | ✅ | |
| Bảo trì | | ✅ | |
| Bảo dưỡng | | ✅ | |
| Report Hub | | ✅ | |
| Cashflow / Profit | | ✅ | |
| Quản lý kỳ | | ✅ | |
| Asset Management | | | ✅ |
| Kiểm kê | | | ✅ |
| HR | | | ✅ |
| KPI / Payroll | | | ✅ |
| Cổ đông | | | ✅ |
| Vốn góp | | | ✅ |
| Phân phối lợi nhuận | | | ✅ |
| Investor Portal | | | ✅ |
| Payment Online | | | ✅ |
| Bank Reconciliation | | | ✅ |
| BI nâng cao | | | ✅ |

---

# 6. Tỷ trọng đề xuất

- **Phase 1:** khoảng 50–55% tổng scope.
- **Phase 2:** khoảng 30–35%.
- **Phase 3:** khoảng 15–20%.

```text
Phase 1
Core Rental + Finance + Zalo

Phase 2
Sales + Automation + Maintenance + Reports

Phase 3
Enterprise + Investment + Advanced Finance
```

---

# 7. Nguyên tắc khóa scope

Khi triển khai Phase 1:

> Không đưa thêm chức năng Phase 2 hoặc Phase 3 nếu không ảnh hưởng trực tiếp đến khả năng vận hành cho thuê.

Mục tiêu Phase 1:
- Gọn.
- Dễ sử dụng.
- Đủ nghiệp vụ.
- Có thể Go-live.
- Có thể mở rộng Phase 2–3 mà không phải làm lại kiến trúc lõi.
