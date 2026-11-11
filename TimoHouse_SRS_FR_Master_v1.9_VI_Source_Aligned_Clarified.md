# TIMOHOUSE — SRS / ĐẶC TẢ YÊU CẦU CHỨC NĂNG

**Mã tài liệu:** TH-SRS-FR-MASTER  
**Phiên bản:** v1.9 — Source Re-verification (06/10/2026) / Report-ready Data Foundation / RBAC + Data Scope  
**Nền tảng:** Web quản trị  
**Kênh tích hợp bên ngoài:** Zalo OA được kết nối từ Web để gửi hóa đơn, thông báo và nhắc thanh toán đến khách hàng.  
**Đánh số FR:** FR01 → FR64  
**Cấu trúc FR:** Quy tắc nghiệp vụ → Mô tả màn hình → Các bước người dùng.


**Thay đổi chính v1.1 (05/10/2026):**
- Đưa OCR hợp đồng chủ nhà và hợp đồng khách thuê vào **Giai đoạn 1**.
- Bổ sung nghiệp vụ **Phòng mới / Nhận phòng trong kỳ** theo các sheet `PHÒNG MỚI THÁNG 9`, `PHÒNG MỚI THÁNG 10`.
- Bổ sung tính **tiền phòng tháng đầu theo ngày bắt đầu tính tiền**; fixture nguồn tháng 9 đang dùng mẫu số 30 ngày. *(Thay bởi v1.9: mẫu số = số ngày của tháng.)*
- Tách rõ **Cọc phòng mới**, **Cọc khách bỏ không ở**, **Hoàn cọc**, **Phá HĐ** và **Payment allocation**.
- Bổ sung `DT phá HĐ` và `DT phá HĐ thu được` theo sheet `cập nhật thu tiền`.
- Loại hoàn toàn **đối soát ngân hàng / QR / tự động khớp thanh toán** khỏi scope.
- Giai đoạn 3 được đánh lại FR60 → FR64.


**Thay đổi chính v1.2 (05/10/2026):**
- Rà soát lại `Báo cáo tháng 6` của G1 và `BÁO CÁO TỔNG THÁNG 8`.
- Bổ sung nguồn dữ liệu **line-by-line** cho Báo cáo Tổng và Báo cáo chi tiết tòa.
- FR27 bổ sung tab **Chi phí dịch vụ đầu vào**: điện, nước, mạng, rác, môi trường, bảo trì thang máy.
- FR28 bổ sung snapshot/version của phân bổ chi phí chung và nguyên tắc không phân bổ trực tiếp lúc render report.
- FR35 bổ sung **Payroll Cost Allocation** theo tòa/kỳ và theo nhóm chức danh.
- FR38/FR40 bổ sung `metric_code`, nguồn dữ liệu, công thức, date basis, drill-down và Golden Dataset.
- FR41 bổ sung trạng thái reconciliation: `MATCH / ROUNDING_DIFFERENCE / RULE_DIFFERENCE / SOURCE_DATA_DIFFERENCE / NEED_BUSINESS_CONFIRMATION`.
- Các metric còn thiếu chứng cứ như `HH/CPBH`, `DT DV/GIÁ NHẬP`, định nghĩa phòng trống và một số revenue-recognition rule tiếp tục để **OPEN**, không hard-code suy đoán.

**Thay đổi chính v1.3 (05/10/2026):**
- Chuyển trọng tâm Phase 1 từ “có màn báo cáo” sang **report-ready data foundation**: mọi metric phải có dữ liệu nguồn được tạo từ nghiệp vụ, có ngày hiệu lực/kỳ và drill-down.
- FR07 tách **lịch trả tiền chủ nhà (cash/payment schedule)** khỏi **ghi nhận chi phí thuê theo tháng (rent cost recognition)** để báo cáo không phụ thuộc chu kỳ trả 3/4/6 tháng.
- FR09 bổ sung **Utility Supplier Bill** theo `Tòa + Kỳ + HĐ tiện ích`: sản lượng, số tiền hóa đơn NCC, ngày chứng từ/hạn trả/ngày trả, kỳ hạch toán, file chứng từ và import batch.
- FR10 bổ sung **Room Status History** có `effective_from/effective_to`, lý do và source event để về sau tính tỷ lệ lấp đầy/thời gian trống mà không suy từ trạng thái hiện tại.
- FR11 bổ sung `occupation_category/customer_segment` dạng danh mục để phục vụ báo cáo phân khúc khách hàng; không suy từ text nghề nghiệp tự do.
- FR27/FR46 bổ sung dữ liệu sửa chữa thực tế theo nguồn: **tiền công, vật tư, bên chịu chi phí, khoản khách chịu, khoản trừ cọc, liên kết lượt thuê/HĐ/quyết toán/hoàn cọc**; chỉ phần công ty chịu mới đi vào chi phí công ty.
- FR30/FR31 bổ sung **Lead/Deal Stage History** với timestamp từng bước để tính conversion/time-to-close chính xác trong tương lai.
- FR32 bổ sung `commission_case_type` cho các ca nguồn như bình thường, bỏ cọc, CTV/đối tác, trùng/chia hoa hồng, điều chỉnh; Phase 1 vẫn chỉ lưu/import số đã duyệt, không tự chạy rule engine.
- Bổ sung flow dữ liệu cho báo cáo âm/dương điện nước: `InvoiceLine + PaymentAllocation(service line) + Utility Supplier Bill/Expense`.
- Bổ sung Phụ lục E **Data Capture Contract & Future Report Readiness** để bảo đảm dữ liệu Phase 1 đủ tái lập các báo cáo sau này.



**Thay đổi chính v1.6 (05/10/2026):**
- Hardening FR24/FR25/FR35 theo tài liệu `CÁCH TÍNH LƯƠNG PHÒNG VẬN HÀNH`: tách trường hợp bình thường và trường hợp có **cọc mới / kỳ thanh toán 3 tháng**, không mặc định `M1 = R5` cho mọi tòa.
- Ghi explicit các biến và công thức nguồn: `A`, `B`, `C`, `DT tiền phòng thu được`, `Hiệu suất`; tách rõ `C = doanh thu thu thêm` khỏi kết quả doanh thu sau điều chỉnh.
- Bổ sung `Collection Performance Calculation Snapshot` để lưu input, rule version, adjustment detail và trace tới Payment/Invoice/Deal.
- FR38/FR39 bổ sung **Formula Status**: `SOURCE_CONFIRMED`, `FIXTURE_CONFIRMED`, `NEED_BUSINESS_CONFIRMATION`; không biến fixture thành rule toàn hệ thống khi chưa có tài liệu xác nhận.
- Bổ sung `TOTAL vs BUSINESS Inclusion Matrix` để khóa rõ metric nào hiển thị, metric nào tham gia tổng/cost, và difference reason.
- Bổ sung cảnh báo đặc biệt cho `HH/CPBH`: fixture hiện tại cho thấy con số khớp dòng Marketing, nhưng chưa đủ chứng cứ để kết luận `HH = Hoa hồng`; không double-count Marketing + Commission.
- Bổ sung Production Formula Freeze Gate: các metric OPEN không được gắn nhãn CONFIRMED hoặc dùng làm acceptance chính thức nếu chưa có business sign-off.
- Bổ sung acceptance cho dịch vụ tháng đầu, utility accounting period, head-lease recognition, shared allocation và rounding policy.



**Thay đổi chính v1.7 (05/10/2026):**
- Đóng lại các gap P0 sau khi đối chiếu lại tài liệu nguồn và xác nhận nghiệp vụ.
- FR24/FR25/FR35: chuyển công thức M5/M10/M15, A/B/C, hiệu suất và bảng tham chiếu lương từ trạng thái OPEN sang **SOURCE_CONFIRMED** theo `CÁCH TÍNH LƯƠNG PHÒNG VẬN HÀNH.docx`; chỉ giữ OPEN cho edge không xuất hiện trong nguồn như rounding cuối cùng hoặc case ngoài bảng.
- FR39: khóa quy tắc **BUSINESS_REVENUE = TOTAL_REVENUE - NEW_DEPOSIT** *(v1.9: đổi thành `NEW_DEPOSIT_COLLECTED`)* theo workbook mẫu; `EQUIPMENT_PURCHASE_COST` bị loại khỏi Business COGS theo mẫu nguồn.
- Chốt `HH/CPBH` là nhóm **Hoa hồng + Marketing** theo xác nhận nghiệp vụ; không được double-count Commission nếu Commission đã được map vào nhóm HH/Marketing.
- Chốt khách/phòng mới có **dịch vụ** trong hóa đơn tháng đầu; tổng cần đóng = cọc + tiền phòng tháng đầu + dịch vụ + khoản khác (nếu có).
- Chốt phòng trống theo 3 nhóm nghiệp vụ: `VACANT_READY_NOW`, `VACANT_END_OF_MONTH`, `WAITING_AVAILABLE`.
- Chốt `EARLY_TERMINATION_COUNT` theo **ngày báo phá HĐ (notice_date)**.
- Chốt `DT DV / GIÁ NHẬP` theo workbook: **Doanh thu dịch vụ thực tế / Giá gốc dịch vụ**, trong đó giá gốc dịch vụ gồm điện + nước + mạng + rác + môi trường + bảo trì thang máy + lương vệ sinh.
- Thu hẹp danh sách OPEN còn lại về các policy chưa có bằng chứng nguồn đầy đủ: rounding cuối cùng, shared allocation method theo category, head-lease tháng lẻ/thuế/phụ phí, utility lệch kỳ, split-payer repair và một số rule nâng cao Phase 2/3.



**Thay đổi chính v1.8 (05/10/2026):**
- Đóng các gap đã được xác nhận lại theo dữ liệu nguồn và giải thích nghiệp vụ trực tiếp.
- Chi phí `Thuê & DV VP`, `Phí marketing/Hoa hồng`, `Sửa chữa/thay thế/bảo trì`, `Chi phí khác` được ghi nhận **trực tiếp theo từng tòa**, không tự phân bổ từ một khoản shared tổng. *(Thay một phần bởi v1.9: VP, marketing chung và lương khối gián tiếp phân bổ `ROOM_COUNT` theo G1.)*
- Payroll/chi phí lương theo tòa lấy trực tiếp từ `bảng lương tháng 8.xlsx`: Employee + Building + Số phòng + DT niêm yết/DT phải thu + M1/M2/M3 + hiệu suất + mức lương/phòng + tổng lương tòa. Không dùng một allocation ratio suy đoán cho các dòng đã có tòa nguồn. *(Thay một phần bởi v1.9: lương khối chung phân bổ `ROOM_COUNT` theo G1.)*
- HĐ chủ nhà: thanh toán theo chu kỳ hợp đồng; khi hết thời gian giữ giá, hệ thống **không tự tăng giá**. Nếu hai bên tiếp tục thuê với giá mới thì tạo `OwnerContractPriceVersion`; nếu không tiếp tục thì kết thúc/không gia hạn.
- Âm/dương điện nước: tính theo từng tòa và kỳ dịch vụ. Thu là doanh thu điện/nước/dịch vụ của tòa; Chi là chi phí thực tế công ty đóng cho điện/nước/NCC tương ứng của chính tòa.
- Không áp dụng business-rounding làm thay đổi số nguồn: giữ precision tính toán; chỉ format khi hiển thị/xuất.
- Sửa chữa/bảo trì ghi trực tiếp theo tòa/phòng và từng dòng chi phí công/vật tư/bên chi; không phân bổ chung.
- Đúng hạn = đã thanh toán **đủ** nghĩa vụ trong thời hạn; quá hạn = qua `due_date` mà còn số dư > 0. Thanh toán một phần trước hạn nhưng còn thiếu sau hạn vẫn là quá hạn.
- Sales conversion: một khách/lead có thể có nhiều `ViewEvent`; chỉ tính `Closed/Won` khi chốt phòng và có cọc được xác nhận. Conversion đếm theo lead/khách, không theo số phòng đã xem.
- Khách mới giữa tháng: tiền phòng = `giá phòng tháng / 30 × số ngày tính tiền`; cọc phòng tách riêng. Rule dịch vụ FIXED tháng đầu vẫn giữ `NOTE — cần xác nhận khách hàng`. *(Thay bởi v1.9: `/ số ngày của tháng`; dịch vụ FIXED prorate theo số ngày dịch vụ.)*
- Làm rõ nguồn `LNR/Tài sản`: công thức chi tiết nằm trong `SRC-15 báo cáo.xlsx`, không phải workbook yêu cầu chính SRC-02.
- Forecast/report dự kiến trên Web sinh từ dữ liệu nguồn/historical/planned data đã có trong hệ thống; không nhập tay trực tiếp số tổng báo cáo và không bắt buộc workflow scenario phức tạp cho baseline. *(Thay bởi v1.9: chuyển NEED_BUSINESS_CONFIRMATION, cho nhập giả định có version — xem FR60.)*
- Phân khúc khách hàng: tỷ lệ Sinh viên và Người đi làm tính trên tổng số khách thuê trong phạm vi/kỳ báo cáo.



**Thay đổi chính v1.9 (06/10/2026) — đối chiếu lại công thức/số liệu thực trong SRC-02…SRC-15:**
- **Sửa prorate tháng đầu:** nguồn chia theo **số ngày thực của tháng**, không cố định 30. Bằng chứng: `PHÒNG MỚI THÁNG 7` ô `H6 = (3500000/31)*22`; `PHÒNG MỚI THÁNG 9` ô `H8 = (3500000/30)*25`. Thay toàn bộ rule `/30` của v1.1/v1.8.
- **Đóng NOTE dịch vụ FIXED tháng đầu:** nguồn tính `Tổng DV = SUM(dịch vụ cố định) / số ngày của tháng × số ngày dịch vụ` (ví dụ `PHÒNG MỚI THÁNG 7` ô Tổng DV dòng 501T27 `=(SUM(...)/31)*22`). Ngày tính dịch vụ có thể khác ngày tính tiền phòng; cho phép override có lý do vì nguồn có dòng nhập tay.
- **Sửa phân bổ chi phí chung (đảo lại một phần v1.8):** G1 `BÁO CÁO THÁNG 8` phân bổ lương quản lý tổng, TPVH, phó phòng VH, NV nguồn, NVKD, kế toán, lương sửa chữa, `Thuê & DV VP` và phần `Phí marketing` chung theo `chi phí toàn hệ thống / tổng số phòng toàn hệ thống × số phòng của tòa` (ví dụ `C36 = (13000000/1382)*15`). FR27/FR28/FR35/FR38 cập nhật: chi phí có tòa nguồn ghi trực tiếp; chi phí khối chung phân bổ `ROOM_COUNT`.
- **Hoàn cọc trong Báo cáo Kinh doanh:** workbook tháng 8 cho `BUSINESS_REVENUE = TOTAL_REVENUE − NEW_DEPOSIT` (6.664.406.236 = 7.036.256.236 − 371.850.000) và hoàn cọc vẫn đã bị trừ trong `TOTAL_REVENUE` (G1 `C2 = DT trên HĐ − Hoàn cọc`). Câu chữ SRC-02/SRC-15 "không gồm hoàn cọc" mâu thuẫn số liệu → chuyển về `NEED_BUSINESS_CONFIRMATION`, mặc định chạy theo workbook để Golden Dataset khớp.
- **Lương vận hành:** bổ sung quy tắc chọn mức trong khoảng bậc, HS > 100 không chặn trần, lương trưởng nhóm `10.000 × số phòng`, cấu phần lương cứng/phụ cấp, lương sửa chữa theo bảng kê; ghi rõ điểm mâu thuẫn "÷100" vs ví dụ "÷90" trong SRC-05.
- Bổ sung **HS thực tế / HS tạm tính** theo SRC-15.
- Bổ sung quy tắc nguồn **phá HĐ** (giữ cọc, phải thu chủ yếu tiền điện) và **khấu hao hoàn cọc 200.000/phòng** theo sheet `DS phòng phá hđ`, `HOÀN CỌC`.
- Báo cáo dự kiến: SRC-14 là số giả định nhập tay theo tháng; bỏ khẳng định "không nhập tay", chuyển `NEED_BUSINESS_CONFIRMATION`.
- Bổ sung các trường màn hình còn thiếu so với SRC-02: sổ đỏ, người nhập nguồn, nhân sự vận hành/vệ sinh/kỹ thuật của tòa, hiệu suất/lợi nhuận/thời gian vận hành tòa, trạng thái "chuẩn bị hết HĐ (35 ngày)", lần ký/gia hạn, xe + biển số, cột hóa đơn/công nợ, bảng doanh số 15 cột, số phòng phát sinh, danh sách nhân sự KD, lịch đóng tiền/thống kê tài sản/tiền cọc cổ đông, 4 loại lịch bảo dưỡng, kiểm kê đồ décor.
- Đồng bộ Phụ lục B/C/D và các mục mâu thuẫn nội bộ; ghi nhận lệch phạm vi Phase giữa SRS và `00_SCOPE_3_PHASE.md`.
- **Bổ sung vòng 2 (06/10/2026):**
  - `TOTAL_REVENUE` theo **cơ sở thực thu**: `Tổng đã đóng link − Hoàn cọc` (G1 `C2` các tháng 2, 4, 6, 7, 8); các dòng doanh thu tiền phòng/dịch vụ theo cơ sở hóa đơn và không cộng ra tổng.
  - `RENT_REVENUE`/service revenue loại phòng phá HĐ, cộng phòng mới (G1 `C12 = I2 − I17 + PHÒNG MỚI!H18`).
  - Bảng `Service → Report Metric Mapping`: DV Combo/DV khác chia 50/50 vào vệ sinh và máy giặt; điện chung và điện thu khi hoàn cọc vào doanh thu điện; máy giặt chia ½ điện ½ nước trong âm/dương.
  - Định nghĩa `DT niêm yết` = Σ giá niêm yết mọi phòng của tòa (khớp 5/5 tòa); bổ sung ba mức giá phòng (niêm yết / Giá QL / hiện tại).
  - Âm/dương điện nước: phải thu / thực thu / không thu được, ½ máy giặt, so sánh tháng trước.
  - FR14 cho ghi chỉ số phòng trống/phá HĐ (`UNCOLLECTIBLE_UTILITY`), không chặn.
  - FR17 trạng thái Chưa TT / Thiếu / Đủ / Thừa / Trống; FR18 quy tắc mẫu hóa đơn (ngày chốt, khoảng hạn, nội dung CK, phí phạt chỉ in).
  - Bảng đối chiếu menu 10 mục SRC-02 → FR.
- **Bổ sung vòng 3 (06/10/2026):**
  - Kỳ thanh toán nhiều tháng của khách: `Kỳ TT` 0/1/2/3, `Tổng cần đóng = DV + Giá × Kỳ TT + Cọc + Nợ cũ + Thu khác` (G1 `AV`); doanh thu tiền phòng vẫn ghi nhận theo tháng; `PREPAID_RENT`; nối dữ liệu cho FR24 TH1 (FR12, FR16, FR17, FR21, FR24, FR38).
  - Giai đoạn mở tòa `SETUP`: chi phí khởi tạo (gồm phí môi giới nhà), Bảng thu chi ban đầu và công thức chia lãi/lỗ đầu kỳ theo cổ đông từ G1 `THU CHI BAN ĐẦU`; khử trùng với `ĐẦU TƯ BAN ĐẦU` (FR08, FR27, FR44, FR45).
  - `NEW_DEPOSIT_COLLECTED` để Báo cáo Kinh doanh cùng cơ sở thực thu với Tổng doanh thu (FR38, FR39, FR41).

**Kiểm tra triển khai (06/10/2026 — bằng chứng kỹ thuật, không thay thế phê duyệt nghiệp vụ):**
- Tại commit `6200ea2`, 8 gap giao diện/luồng trong audit 04/10 đều PASS trên mockup local và Netlify: xe → hóa đơn, tách phí xe, lọc chi phí, thống kê cổ đông theo ngày xem, lọc trưởng khu vực trong báo cáo sale, STT nhân sự sale, điều khiển mode lương và mode Báo cáo Kinh doanh. Chi tiết/bằng chứng: [`Gap Closure Review`](../uat/Gap_Closure_Review_2026-10-06.md).
- **Không đóng các điểm C-01…C-29 chỉ vì test kỹ thuật PASS.** Riêng C-02 còn lệch: web mode hiện loại hoàn cọc khỏi Báo cáo Kinh doanh, trong khi mặc định `BUSINESS_V1_WORKBOOK` mô tả ở SRS giữ hoàn cọc đã trừ trong `TOTAL_REVENUE`. Cần người có thẩm quyền xác nhận mode chính thức trước khi cập nhật công thức/đóng C-02.
- Phân phase C-15/C-25 và các policy được liệt kê tại [Business Decision Log](../uat/Business_Decisions_Open_2026-10-06.md) vẫn chờ xác nhận.

## Cơ sở tài liệu nguồn

| Mã nguồn | Tài liệu |
|---|---|
| SRC-01 | Hợp đồng thuê phòng / hợp đồng khách thuê |
| SRC-02 | `nội dung làm web Timehouse 31.8.2026(2).xlsx` |
| SRC-03 | `bảng lương tháng 8.xlsx` |
| SRC-04 | `BÁO CÁO KINH DOANH THÁNG 8.xlsx` |
| SRC-05 | `CÁCH TÍNH LƯƠNG PHÒNG VẬN HÀNH.docx` |
| SRC-06 | `Danh sách mã HĐ điện nước mạng.xlsx` |
| SRC-07 | `G1.31.8.26.xlsx` |
| SRC-08 | `Hoá đơn tiền nhà tháng 9 và dịch vụ tháng 9 năm 2026.xlsx` |
| SRC-09 | `Hoa hồng năm 2025-2026 (1).xlsx` |
| SRC-10 | Hợp đồng thuê nhà với chủ nhà |
| SRC-11 | `sổ sửa chữa tháng 8(AutoRecovered).xlsx` |
| SRC-12 | `âm dương điện nước tháng 6.xlsx` |
| SRC-13 | `âm dương điện nước tháng 7.xlsx` |
| SRC-14 | `BẢNG DỰ KIẾN LỢI NHUẬN CÁC THÁNG.xlsx` |
| SRC-15 | `báo cáo.xlsx` — tài liệu bổ sung mô tả công thức/chỉ tiêu báo cáo |
| P3 | `TimoHouse_Development_Plan_3_Phases_v9_Formula_Hardened.md` — **lưu ý v1.9:** file này không có trong bộ tài liệu hiện tại của repo; phạm vi phase đang có trong repo là `00_SCOPE_3_PHASE.md` (xem Phụ lục D). |

> **Ưu tiên nguồn:** SRC-02 là danh sách yêu cầu màn hình của khách; các file Excel thực tế (SRC-03…SRC-15) là bằng chứng công thức/số liệu. Khi câu chữ SRC-02 mâu thuẫn số liệu Excel, SRS ghi `NEED_BUSINESS_CONFIRMATION` và mặc định tái lập đúng số liệu Excel để nghiệm thu đối chiếu.

## Quy tắc chung

1. Dữ liệu của kỳ đã khóa không được sửa trực tiếp; điều chỉnh phải có quyền, lý do, phiên bản và nhật ký.
2. Bản ghi đã được hóa đơn, phiếu thu, chi phí, bảng lương, báo cáo, cổ đông hoặc tài liệu tham chiếu không được xóa vật lý.
3. Thu/chi phải phân biệt `kỳ nghiệp vụ`, `ngày giao dịch thực tế` và `ngày nhập hệ thống`.
4. Dữ liệu nhạy cảm như CCCD, tài khoản ngân hàng, lương và cổ đông phải kiểm tra quyền ở Danh sách, Chi tiết, Tìm kiếm và Xuất dữ liệu.
5. Hóa đơn đã phát hành giữ snapshot giá và dòng tính; thay đổi hợp đồng không được làm thay đổi hóa đơn lịch sử.
6. Zalo OA chỉ là kênh gửi thông báo; trạng thái gửi tin không làm thay đổi trạng thái thanh toán.
7. Nội dung chưa đủ chứng cứ nguồn được đánh dấu **OPEN** và không tự suy diễn thành quy tắc chính thức.
8. Dữ liệu dùng cho báo cáo phải được tạo/lưu ở **nghiệp vụ nguồn**; không nhập tay trực tiếp số tổng vào báo cáo trừ fixture/import migration có kiểm soát và phải gắn nguồn.
9. Bản ghi phục vụ lịch sử phải tách tối thiểu `business_date/effective_date`, `accounting_period`, `payment_date` (nếu có) và `created_at`; không dùng `created_at` thay ngày nghiệp vụ.
10. Trạng thái có ảnh hưởng tới báo cáo (phòng, Deal, HĐ, Payment, Expense, Payroll, cổ đông) phải có history/effective version; không chỉ lưu giá trị hiện tại.
11. Mỗi dòng/metric báo cáo phải truy được về `source_entity/source_id`, allocation/version và formula version; báo cáo chỉ là output của data lineage.
12. Không triển khai đọc giao dịch ngân hàng, QR Payment, bank reconciliation hoặc tự động khớp thanh toán ở bất kỳ giai đoạn nào.

## Danh sách chức năng

| FR | Giai đoạn | Phân hệ | Chức năng |
| --- | --- | --- | --- |
| FR01 | Giai đoạn 1 | Truy cập | Đăng nhập / Đăng xuất |
| FR02 | Giai đoạn 1 | Quản trị | Người dùng, vai trò và phân quyền |
| FR03 | Giai đoạn 1 | Quản trị | Danh mục, khóa kỳ và nhật ký thay đổi |
| FR04 | Giai đoạn 1 | Tổng quan | Tổng quan |
| FR05 | Giai đoạn 1 | Vận hành | Quản lý chủ nhà |
| FR06 | Giai đoạn 1 | Vận hành/Tài chính | Hợp đồng thuê nhà với chủ nhà |
| FR07 | Giai đoạn 1 | Tài chính | Lịch thanh toán và ghi nhận chi phí thuê chủ nhà |
| FR08 | Giai đoạn 1 | Vận hành | Quản lý tòa nhà |
| FR09 | Giai đoạn 1 | Vận hành/Tài chính | HĐ tiện ích và hóa đơn NCC điện / nước / mạng theo tòa |
| FR10 | Giai đoạn 1 | Vận hành | Quản lý phòng |
| FR11 | Giai đoạn 1 | Vận hành | Quản lý khách hàng và lượt thuê |
| FR12 | Giai đoạn 1 | Vận hành | Quản lý hợp đồng thuê phòng |
| FR13 | Giai đoạn 1 | Hóa đơn | Bảng giá dịch vụ theo phiên bản hợp đồng |
| FR14 | Giai đoạn 1 | Hóa đơn | Nhập chỉ số và số lượng dịch vụ theo tòa / kỳ |
| FR15 | Giai đoạn 1 | Hóa đơn | Khoản phát sinh / nhập tay theo kỳ |
| FR16 | Giai đoạn 1 | Hóa đơn | Tạo hóa đơn hàng loạt theo tòa / kỳ |
| FR17 | Giai đoạn 1 | Hóa đơn | Danh sách và chi tiết hóa đơn |
| FR18 | Giai đoạn 1 | Hóa đơn | Mẫu hóa đơn, PDF và phát hành |
| FR19 | Giai đoạn 1 | Zalo OA | Cấu hình Zalo OA và mẫu tin nhắn |
| FR20 | Giai đoạn 1 | Zalo OA | Gửi hóa đơn / nhắc thanh toán qua Zalo OA |
| FR21 | Giai đoạn 1 | Thu tiền | Phiếu thu |
| FR22 | Giai đoạn 1 | Thu tiền | Cập nhật thu tiền hàng loạt theo tòa |
| FR23 | Giai đoạn 1 | Thu tiền | Công nợ phải thu |
| FR24 | Giai đoạn 1 | Hiệu suất | Các mốc thu tiền M5 / M10 / M15 |
| FR25 | Giai đoạn 1 | Hiệu suất | Hiệu suất thu tiền của quản lý |
| FR26 | Giai đoạn 1 | Tài chính | Hoàn cọc |
| FR27 | Giai đoạn 1 | Tài chính | Quản lý chi phí |
| FR28 | Giai đoạn 1 | Tài chính | Phân bổ chi phí chung |
| FR29 | Giai đoạn 1 | Kinh doanh | Tổng quan kinh doanh / nguồn phòng |
| FR30 | Giai đoạn 1 | Kinh doanh | Quản lý khách tiềm năng và lượt xem phòng |
| FR31 | Giai đoạn 1 | Kinh doanh | Quản lý giao dịch chốt phòng |
| FR32 | Giai đoạn 1 | Kinh doanh/Tài chính | Hoa hồng cơ bản / Import |
| FR33 | Giai đoạn 1 | Nhân sự | Nhân viên và cơ cấu tổ chức |
| FR34 | Giai đoạn 1 | Nhân sự/Vận hành | Phân công tòa / phòng |
| FR35 | Giai đoạn 1 | Tiền lương | Dữ liệu đầu vào lương / diễn giải lương vận hành |
| FR36 | Giai đoạn 1 | Tài liệu | Kho tài liệu |
| FR37 | Giai đoạn 1 | Báo cáo | Chọn loại báo cáo và bộ lọc chung |
| FR38 | Giai đoạn 1 | Báo cáo | Báo cáo Tổng |
| FR39 | Giai đoạn 1 | Báo cáo | Báo cáo Kinh doanh |
| FR40 | Giai đoạn 1 | Báo cáo | Chi tiết báo cáo theo tòa / bộ mẫu G1 |
| FR41 | Giai đoạn 1 | Báo cáo | Đối chiếu Web ↔ Excel và xuất XLSX |
| FR42 | Giai đoạn 1 | Cổ đông | Danh sách cổ đông và tỷ lệ sở hữu |
| FR43 | Giai đoạn 1 | Cổ đông | Bảng phân bổ cổ đông G1 |
| FR44 | Giai đoạn 1 | Cổ đông | Góp vốn và chi trả thực tế cho cổ đông |
| FR45 | Giai đoạn 1 | Tài sản | Danh mục tài sản |
| FR46 | Giai đoạn 1 | Bảo trì | Sổ sửa chữa, lịch và kết quả bảo trì |
| FR47 | Giai đoạn 1 | Tài sản | Kiểm kê tài sản |
| FR48 | Giai đoạn 1 | Quản trị | Import và chuyển đổi dữ liệu |
| FR49 | Giai đoạn 1 | OCR | OCR hợp đồng chủ nhà |
| FR50 | Giai đoạn 1 | OCR | OCR hợp đồng khách thuê |
| FR51 | Giai đoạn 2 | Kinh doanh | Kinh doanh nâng cao |
| FR52 | Giai đoạn 2 | Hoa hồng | Bộ quy tắc hoa hồng |
| FR53 | Giai đoạn 2 | Nhân sự | Cơ cấu / lịch sử nhân sự nâng cao |
| FR54 | Giai đoạn 2 | Tiền lương | Quy trình tính lương đầy đủ |
| FR55 | Giai đoạn 2 | Thu tiền | Tuổi nợ và xử lý nâng cấp công nợ |
| FR56 | Giai đoạn 2 | Zalo OA | Tự động nhắc qua Zalo OA |
| FR57 | Giai đoạn 2 | Tài sản | Vòng đời tài sản nâng cao |
| FR58 | Giai đoạn 2 | Cổ đông | Phân bổ / chia lợi nhuận cổ đông |
| FR59 | Giai đoạn 2 | Bảo trì | Bảo trì nâng cao |
| FR60 | Giai đoạn 3 | Báo cáo | Báo cáo mở rộng, phân tích vận hành và dự báo |
| FR61 | Giai đoạn 3 | Cổ đông | Báo cáo / kịch bản cổ đông nâng cao |
| FR62 | Giai đoạn 3 | Bảo trì | SLA / nhà cung cấp / bảo trì dự báo |
| FR63 | Giai đoạn 3 | Thông báo | Bộ quy tắc thông báo nâng cao |
| FR64 | Giai đoạn 3 | BI/AI | Các chức năng BI / AI |

## Cấu trúc menu chính theo SRC-02 (v1.9)

Menu Web bám đúng 10 mục chính của sheet `menu chính` (SRC-02). Menu quản trị hệ thống (FR01–FR03, FR19, FR48) đặt trong mục **Cài đặt** riêng, chỉ hiện theo quyền. Các phân hệ kỹ thuật trong bảng FR ở trên chỉ dùng để tổ chức đặc tả, không phải menu.

| # | Menu chính (SRC-02) | Mục con | FR |
| --- | --- | --- | --- |
| 1 | Tổng quan | Phòng trống 3 nhóm; Tổng DT (tiền nhà / cọc mới / phá HĐ); Tiến độ thu tiền; lọc khu vực / quản lý / trưởng nhóm | FR04 |
| 2 | Thông tin tòa nhà | Tòa nhà; Chủ nhà; HĐ chủ nhà; Lịch đóng tiền chủ nhà; Phòng; HĐ tiện ích & hóa đơn NCC | FR05–FR10, FR49 |
| 3 | Thông tin KH | Tổng quan khách (mã phòng + tòa, trạng thái); Chi tiết khách; Hợp đồng & bảng giá DV; Nhập chỉ số | FR11–FR14, FR50 |
| 4 | Tài chính chung | Hóa đơn; Công nợ; Thu tiền; Các loại chi phí; Phân bổ chi phí; **Báo cáo kinh doanh của nhà** (thu-chi điện nước DV toàn HT / danh sách nhà / chi tiết từng hạng mục / thu-chi tổng & tòa); Danh sách hoàn cọc / phá HĐ | FR15–FR18, FR20–FR23, FR26–FR28; báo cáo kinh doanh của nhà = báo cáo âm/dương FR60 |
| 5 | Kinh doanh | Tổng quan hàng hóa; Doanh số; Thống kê khách hàng; Hoa hồng; Danh sách nhân sự KD | FR29–FR32 |
| 6 | Nhân sự | Tổng quan; Chi tiết nhân sự; Cơ cấu tổ chức; Phân công; Tính lương (5 phòng ban); Hiệu suất M5/M10/M15 | FR24, FR25, FR33–FR35 |
| 7 | Tài liệu | Kho tài liệu (HĐ khách, HĐ chủ nhà, sổ đỏ, PCCC, chứng từ) | FR36 |
| 8 | Báo cáo | Báo cáo lợi nhuận dòng tiền (Tổng); Báo cáo kinh doanh; Chi tiết tòa; Đối chiếu/Xuất; Báo cáo mở rộng | FR37–FR41, FR60 |
| 9 | Cổ đông | Danh sách & tỷ lệ; Bảng chia cổ phần; Lịch đóng tiền từng người; Thống kê tài sản / tiền cọc | FR42–FR44 |
| 10 | Bảo trì, Bảo dưỡng | Lịch bảo dưỡng (thang máy, máy bơm, máy giặt, lọc nước); Sổ sửa chữa; Tài sản; Kiểm kê (gồm décor) | FR45–FR47 |

> <span style="color:#CC0000">Lệch phase (C-25):</span> SRC-02 đặt "Báo cáo kinh doanh của nhà" trong Tài chính chung (ghi chú "hỏi ngọc"), còn SRS đang để báo cáo âm/dương ở FR60 — Giai đoạn 3. Dữ liệu nguồn của báo cáo này đã được thu từ Giai đoạn 1 (FR09, FR14, FR16, FR21); cần khách chốt giai đoạn hiển thị báo cáo.

---



**Thay đổi chính v1.4 (05/10/2026):**
- FR33 chuyển màn `Cơ cấu tổ chức` sang **Org Chart / Family Tree** giống cây gia phả, không dùng tree-folder dọc làm giao diện chính.
- Hỗ trợ nhiều cấp: Công ty → Khối/Phòng → Bộ phận/Team → Leader → Nhân viên.
- Bổ sung zoom, pan, fit-screen, expand/collapse, tìm kiếm và focus node.
- Bổ sung CRUD đơn vị và nhân sự trực tiếp từ node; di chuyển node, đổi đơn vị cha, đổi leader, thay đổi tương lai theo effective date.
- Không hard-delete nhân sự/đơn vị đã từng phát sinh Assignment, Payroll, Payment hoặc Report; dùng `Inactive/Resigned` và giữ lịch sử.
- Bổ sung chế độ `Xem tại ngày` để dựng lại cây tổ chức lịch sử phục vụ quyền dữ liệu, Assignment, Payroll và Report.



**Thay đổi chính v1.5 (05/10/2026):**
- Chuẩn hóa **RBAC + Data Scope** cho toàn hệ thống, không chỉ ẩn/hiện menu ở Frontend.
- Quyền truy cập được resolve theo: `Role Permission ∩ Organization Scope ∩ Effective Assignment`.
- Bổ sung các loại scope: `ALL`, `ORG_SUBTREE`, `ASSIGNED_BUILDINGS`, `ASSIGNED_ROOMS`, `SELF`, `CUSTOM`.
- Leader chỉ xem nhân sự thuộc nhánh tổ chức của mình và dữ liệu nghiệp vụ thuộc các tòa/phòng nằm trong assignment hiệu lực của nhánh đó.
- Quản lý chỉ xem/thao tác dữ liệu các tòa/phòng được giao; không được xem dữ liệu của quản lý ngang cấp ngoài assignment.
- Backend/API bắt buộc kiểm tra Data Scope; không được chỉ ẩn dữ liệu ở UI.
- Bổ sung quyền theo hành động `VIEW / CREATE / UPDATE / APPROVE / EXPORT / MANAGE` và Permission Matrix mặc định cho các nhóm user chính.
- Data Scope có hiệu lực theo thời gian để report/kỳ cũ resolve đúng tổ chức và assignment tại thời điểm lịch sử.

# FR01 - Đăng nhập / Đăng xuất

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Truy cập  
**Nguồn:** SRC-02; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Tất cả người dùng Web đang hoạt động. |
| Quy tắc chức năng | Người dùng phải đăng nhập bằng tài khoản hợp lệ và đang hoạt động; sau khi xác thực thành công hệ thống tải quyền và phạm vi dữ liệu tương ứng. |
| Tác động | Đăng nhập thành công -> mở Tổng quan; đăng xuất -> hủy phiên làm việc và quay về màn hình đăng nhập. |

## 2. Mô tả màn hình

### Màn hình 01.1: Đăng nhập

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tên đăng nhập / Email | Ô nhập văn bản | Có | Nhập định danh tài khoản. |
| Mật khẩu | Ô nhập mật khẩu | Có | Giá trị được che khi nhập. |
| Đăng nhập | Nút chính | Có | Nhấn -> xác thực; thành công -> mở FR04 Tổng quan. |
| Thông báo lỗi | Thông báo tại chỗ | Tùy điều kiện | Hiển thị lỗi xác thực nhưng không làm lộ thông tin nhạy cảm. |

### Màn hình 01.2: Xác nhận đăng xuất

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Nội dung xác nhận | Văn bản | Có | Xác nhận kết thúc phiên làm việc hiện tại. |
| Đăng xuất | Nút chính | Có | Hủy phiên làm việc -> quay về màn hình Đăng nhập. |
| Hủy | Nút phụ | Không | Đóng popup. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Tài khoản tồn tại và đang hoạt động. |
| Các bước người dùng | Bước 1: Mở Web -> màn hình 01.1.<br>Bước 2: Nhập thông tin hợp lệ -> Đăng nhập -> FR04.<br>Bước 3: Chọn Đăng xuất -> màn hình 01.2 -> Xác nhận. |

---

# FR02 - Người dùng, vai trò, quyền và phạm vi dữ liệu

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Quản trị  
**Nguồn:** SRC-02; P3; FR33; FR34

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Mô hình quyền | Hệ thống dùng **RBAC + Data Scope**. `Role` quyết định user được làm gì; `Data Scope` quyết định user được làm trên dữ liệu nào. |
| Công thức resolve quyền | `Accessible Action/Data = Role Permission ∩ Organization Scope ∩ Effective Assignment`. Nếu một lớp không cho phép thì request bị từ chối. |
| Backend enforcement | Quyền phải được kiểm tra ở API/Backend với mọi `List / Detail / Search / Export / Create / Update / Approve / Delete/Deactivate`. Không được chỉ ẩn menu hoặc filter trên Frontend. |
| Loại permission | Tối thiểu: `VIEW`, `CREATE`, `UPDATE`, `APPROVE`, `EXPORT`, `MANAGE`. Có thể chi tiết hơn theo module như `payment.adjust`, `report.reconcile`. |
| Loại Data Scope | Tối thiểu: `ALL`, `ORG_SUBTREE`, `ASSIGNED_BUILDINGS`, `ASSIGNED_ROOMS`, `SELF`, `CUSTOM`. |
| ALL | Xem/thao tác toàn hệ thống theo permission của role. Dùng cho Admin; Kế toán có thể ALL ở dữ liệu tài chính nhưng không có quyền quản trị role nếu không được cấp. |
| ORG_SUBTREE | User chỉ xem nhân sự/đơn vị trong nhánh tổ chức bắt đầu từ node được cấp. Ví dụ Leader A chỉ thấy team/quản lý thuộc nhánh A, không thấy nhánh Leader B. |
| ASSIGNED_BUILDINGS | User chỉ truy cập dữ liệu nghiệp vụ có `building_id` nằm trong Assignment hiệu lực của mình hoặc của nhánh được phép quản lý. |
| ASSIGNED_ROOMS | User chỉ truy cập dữ liệu các phòng nằm trong Room Assignment hiệu lực, dùng khi cần hạn chế sâu hơn cấp tòa. |
| SELF | Chỉ xem dữ liệu của chính user, ví dụ hiệu suất/lương cá nhân nếu policy cho phép. |
| CUSTOM | Admin cấu hình tập tòa/phòng/đơn vị cụ thể khi role chuẩn không đáp ứng. |
| Leader Scope | Leader được xem `ORG_SUBTREE` của mình và dữ liệu các `ASSIGNED_BUILDINGS/ROOMS` thuộc nhân sự trong nhánh theo rule business. Leader A không được xem quản lý/tòa của Leader B nếu không có scope bổ sung. |
| Manager Scope | Quản lý chỉ xem/thao tác khách, phòng, HĐ, invoice, payment, debt, meter, Zalo... thuộc tòa/phòng đang được giao. Quản lý A1 không được xem dữ liệu A2 nếu không có permission/scope riêng. |
| Kế toán | Có thể được cấp `ALL` cho nghiệp vụ tài chính/report nhưng không mặc định có `org.manage` hoặc `user.manage`. |
| HR | Có thể `org.manage` và `employee.manage`; dữ liệu lương/ngân hàng là permission riêng. |
| Effective date | Organization membership, manager relation và Assignment đều có hiệu lực theo thời gian. Khi xem dữ liệu/report kỳ cũ phải resolve scope đúng tại thời điểm nghiệp vụ/kỳ đó. |
| Không suy từ current state | Không được lấy `current manager/current building assignment` để xác định trách nhiệm của kỳ lịch sử nếu đã có effective history. |
| Không rò rỉ qua export/search | Search, autocomplete, export, dashboard aggregate và API count cũng phải áp dụng cùng Data Scope; không được trả số liệu của scope khác. |
| Tác động | FR01 tải permission/scope sau đăng nhập; FR33 cung cấp Organization Scope; FR34 cung cấp Assignment Scope; mọi FR nghiệp vụ phải gọi cùng cơ chế authorization. |

### Quy tắc ví dụ bắt buộc

```text
TIMEHOUSE
├── Leader A
│   ├── Manager A1 → T1, T2
│   └── Manager A2 → T3, T4
└── Leader B
    ├── Manager B1 → S1, S2
    └── Manager B2 → S3
```

Kết quả:

```text
Leader A
ORG_SUBTREE = Leader A
BUILDING_SCOPE = T1,T2,T3,T4

→ thấy A1, A2
→ thấy T1,T2,T3,T4
→ không thấy B1, B2
→ không thấy S1,S2,S3
```

Manager A1:

```text
ORG_SCOPE = SELF
BUILDING_SCOPE = T1,T2

→ chỉ thao tác nghiệp vụ T1,T2
→ không xem T3,T4 của A2 nếu không được cấp thêm
```

Request ngoài scope, ví dụ Leader A gọi API lấy S1, phải bị từ chối hoặc trả không có dữ liệu theo policy bảo mật; không được dựa vào Frontend để ngăn truy cập.

## 2. Mô tả màn hình

### Màn hình 02.1: Danh sách Người dùng / Vai trò

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập | Không | Tài khoản/nhân viên/role. Chỉ trả kết quả user mà người quản trị có quyền xem. |
| Bộ lọc | Bộ lọc | Không | Role; trạng thái; đơn vị; scope type; tòa/phòng. |
| Bảng dữ liệu | Bảng | Có | User; nhân viên; Role; Organization Scope; Building/Room Scope; trạng thái; lần đăng nhập cuối. |
| Thêm mới | Nút | Theo quyền | Mở 02.2. |
| Thao tác | Menu | Theo quyền | Xem / Sửa / Gán role / Gán scope / Ngừng hoạt động. |

### Màn hình 02.2: Tạo / Chỉnh sửa Người dùng

**Loại màn hình:** Form

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tài khoản | Text | Có | User đăng nhập. |
| Nhân viên liên kết | Employee picker | Có | Link FR33. |
| Vai trò | Multi/Single select theo policy | Có | Role mặc định hoặc role bổ sung nếu hệ thống cho phép. |
| Organization Scope | Select + Tree | Có | ALL / ORG_SUBTREE / SELF / CUSTOM. |
| Building Scope | Select + Multi-select | Có | ALL / ASSIGNED_BUILDINGS / CUSTOM. |
| Room Scope | Select + Multi-select | Không | ASSIGNED_ROOMS / CUSTOM khi cần. |
| Effective from/to | Date | Có/Tùy điều kiện | Ngày hiệu lực của scope nếu có thay đổi theo thời gian. |
| Trạng thái | Select | Có | ACTIVE / INACTIVE. |
| Lưu | Nút | Có | Validate permission/scope và không cấp scope lớn hơn quyền người đang thao tác nếu policy không cho phép. |

### Màn hình 02.3: Danh sách Vai trò

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Role code/name | Text | Có | Ví dụ ADMIN, ACCOUNTANT, OPS_LEADER, OPS_MANAGER, SALES_LEADER, SALES, HR, TECHNICIAN. |
| Permission count | Số | Có | Số permission đang gán. |
| User count | Số | Có | Số user hiệu lực. |
| Trạng thái | Badge | Có | ACTIVE / INACTIVE. |
| Thao tác | Menu | Theo quyền | Xem / Sửa permission / Ngừng role. |

### Màn hình 02.4: Permission Matrix

**Loại màn hình:** Ma trận quyền

| Thành phần | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Module/Action | Hàng | Có | Ví dụ `invoice.view`, `payment.create`, `expense.approve`, `report.export`, `org.manage`. |
| Role | Cột | Có | Các role hệ thống. |
| Permission | Checkbox/Select | Có | VIEW/CREATE/UPDATE/APPROVE/EXPORT/MANAGE. |
| Scope policy | Badge/Select | Có | Default scope được phép dùng cho role. |
| Save version | Nút | Có | Lưu version/audit; thay đổi áp dụng cho request sau đó. |

### Màn hình 02.5: User Effective Access

**Loại màn hình:** Trang chi tiết / Diagnostic

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| User | Chỉ đọc | Có | User đang kiểm tra. |
| Effective permissions | Bảng | Có | Quyền sau khi tổng hợp Role. |
| Organization Scope | Cây | Có | Nhánh tổ chức user nhìn thấy. |
| Building Scope | Danh sách | Có | Tòa được phép truy cập tại ngày chọn. |
| Room Scope | Danh sách | Không | Phòng được phép truy cập. |
| Xem tại ngày | Date picker | Có | Test quyền lịch sử theo effective date. |
| Nguồn scope | Bảng | Có | Role / Org membership / Assignment / Custom grant. |
| Test access | Công cụ | Không | Chọn module + action + entity để xem ALLOW/DENY và lý do. |

### Màn hình 02.6: Xác nhận Ngừng user / role / scope

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | User/role/scope grant. |
| Ngày hiệu lực | Date | Có | Không sửa lịch sử đã phát sinh. |
| Lý do | Textarea | Có | Audit. |
| Xác nhận | Nút | Có | Ngừng quyền trong tương lai/hiện tại theo policy. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Admin/người được ủy quyền có `user.manage/role.manage`. |
| Các bước người dùng | Bước 1: Tạo Role/Permission ở 02.3–02.4.<br>Bước 2: Tạo user ở 02.2 và gán Organization/Building/Room Scope.<br>Bước 3: Hệ thống liên kết FR33/34 để resolve scope hiệu lực.<br>Bước 4: Kiểm tra quyền thực tế ở 02.5 bằng `Xem tại ngày` và Test Access.<br>Bước 5: Mọi API nghiệp vụ áp dụng permission + scope trước truy vấn/thao tác.<br>Bước 6: Ngừng user/role/scope bằng 02.6, giữ audit/history. |

---

# FR03 - Danh mục, khóa kỳ và nhật ký thay đổi

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Quản trị  
**Nguồn:** SRC-02; SRC-04; SRC-08; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; Kế toán đối với thao tác khóa kỳ được cấp quyền. |
| Quy tắc chức năng | Danh mục có ngày hiệu lực khi cần; các kỳ hóa đơn, thu tiền, chi phí, lương, báo cáo và cổ đông có trạng thái Mở/Đã khóa. |
| Tác động | Khi khóa kỳ, chỉnh sửa thông thường bị chặn; điều chỉnh phải theo luồng có quyền, lý do, phiên bản và nhật ký. |

## 2. Mô tả màn hình

### Màn hình 03.1: Danh mục / Kỳ - Danh sách / Nhập liệu

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Phạm vi / Bộ lọc | Bộ lọc | Không | Kỳ, tòa, khu vực, người phụ trách và trạng thái phù hợp nghiệp vụ. |
| Dữ liệu đầu vào | Bảng / Biểu mẫu | Có | Loại danh mục, mã, tên, ngày hiệu lực, trạng thái; loại kỳ, tháng/khoảng thời gian, trạng thái Mở/Đã khóa, nguồn snapshot. |
| Kiểm tra | Nút | Tùy điều kiện | Kiểm tra quyền, dữ liệu bắt buộc, trùng lặp và trạng thái kỳ. |
| Thực hiện | Nút chính | Có | Thực hiện nghiệp vụ -> Danh mục/phiên bản được cập nhật hoặc kỳ được khóa cùng người thao tác, thời gian và lý do.. Khóa/Mở khóa phải hiển thị các phân hệ bị ảnh hưởng. |

### Màn hình 03.2: Danh mục / Kỳ - Chi tiết / Kết quả

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu nguồn | Chỉ đọc | Có | Hiển thị kỳ, đối tượng, nguồn dữ liệu, người thao tác và các bản ghi liên quan. |
| Kết quả | Chỉ đọc / Bảng | Có | Danh mục/phiên bản được cập nhật hoặc kỳ được khóa cùng người thao tác, thời gian và lý do. |
| Truy vết | Liên kết | Không | Nhấn -> mở chứng từ/bản ghi đã tạo ra kết quả. |
| Lịch sử | Dòng thời gian | Không | Hiển thị các lần thay đổi, điều chỉnh hoặc phiên bản. |

### Màn hình 03.3: Xác nhận Danh mục / Kỳ

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tóm tắt | Chỉ đọc | Có | Tóm tắt phạm vi, số bản ghi và tác động. |
| Cảnh báo | Chỉ đọc | Tùy điều kiện | Hiển thị lỗi/cảnh báo phải xử lý trước khi xác nhận. |
| Xác nhận | Nút chính | Có | Xác nhận -> lưu giao dịch/phiên bản/nhật ký. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Người dùng có quyền cấu hình. |
| Các bước người dùng | Bước 1: Mở danh mục/kỳ -> 03.1.<br>Bước 2: Nhập/chọn dữ liệu và kiểm tra.<br>Bước 3: Xác nhận tại 03.3 -> lưu trạng thái và nhật ký. |

---

# FR04 - Tổng quan

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Tổng quan  
**Nguồn:** SRC-02 `Tổng quan`; SRC-04; SRC-08; P3

**Ghi chú phạm vi:** <span style="color:#CC0000">OPEN: SRC-02 mới nêu tên ba nhóm phòng trống (trống ở luôn trong tháng / trống hết tháng / đang chờ), chưa có định nghĩa điều kiện vào/ra từng nhóm. Mã nhóm đã chốt; định nghĩa và quy tắc chuyển trạng thái cần khách xác nhận.</span>

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Người dùng đã đăng nhập trong phạm vi dữ liệu được cấp. |
| Quy tắc chức năng | Tất cả KPI dùng cùng kỳ và cùng phạm vi lọc. Dashboard chỉ đọc, không tạo giao dịch tài chính. |
| Tác động | Nhấn KPI -> mở danh sách/báo cáo nguồn với bộ lọc tương ứng; không cộng trùng do một phòng có nhiều người phụ trách. |

## 2. Mô tả màn hình

### Màn hình 04.1: Tổng quan

**Loại màn hình:** Trang tổng quan

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Tại thời điểm | Tháng / Ngày | Có | Xác định kỳ/snapshot tính chỉ tiêu. |
| Bộ lọc | Bộ lọc | Không | Theo SRC-02 tất cả chỉ tiêu lọc được theo **khu vực, tên quản lý, tên trưởng nhóm**; bổ sung nhóm mã T/S/G và tòa. |
| Phòng trống | Thẻ KPI | Có | Trống ở luôn trong tháng; Trống hết tháng; Phòng đang chờ. Nhấn -> danh sách phòng tương ứng. |
| Doanh thu | Thẻ KPI | Có | Tổng doanh thu (cơ sở **thực thu − hoàn cọc**, cùng định nghĩa `TOTAL_REVENUE` FR38), có 3 mục con theo SRC-02: **doanh thu tiền nhà, doanh thu cọc mới, doanh thu phá hợp đồng**. Mục con không cộng ra tổng; tooltip ghi rõ cơ sở tính. |
| Tiến độ thu | KPI / Tiến độ | Có | Thay biểu đồ doanh thu/công nợ (SRC-02). Phải thu; đã thu; còn nợ; tỷ lệ thu và các mốc thu M5/M10/M15. |
| HĐ sắp hết hạn | Danh sách / KPI | Không | Nhấn -> danh sách khách/HĐ gần hết hạn. |
| Trạng thái dữ liệu | Nhãn | Có | Thực tế/Tạm tính; nguồn; snapshot; thời điểm chốt. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Người dùng đã đăng nhập. |
| Các bước người dùng | Bước 1: Mở Tổng quan 04.1.<br>Bước 2: Chọn kỳ/bộ lọc -> toàn bộ KPI cập nhật cùng phạm vi.<br>Bước 3: Nhấn KPI -> mở màn nghiệp vụ nguồn và giữ bộ lọc. |

---

# FR05 - Quản lý chủ nhà

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Vận hành  
**Nguồn:** SRC-02; SRC-10; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; người dùng Vận hành/Kế toán được cấp quyền. |
| Quy tắc chức năng | Một chủ nhà có thể có nhiều tòa và nhiều hợp đồng. CCCD/pháp lý/tài khoản ngân hàng bị giới hạn theo quyền. |
| Vị trí menu | SRC-02: "Khu nhà" và "Tòa nhà" gộp thành một mục lớn **Tòa nhà**, gồm hai phần: Thông tin chủ nhà và Thông tin tòa nhà. Màn Chủ nhà là tab/màn con của menu Tòa nhà. |
| Thông tin cá nhân | SRC-02 yêu cầu "full thông tin trên HĐ thuê nhà". Theo mẫu HĐ chủ nhà (SRC-10): họ tên, CCCD, ngày cấp, nơi cấp, điện thoại, hộ khẩu thường trú; đồng chủ thể nếu có. |
| Sổ đỏ | Lưu **hình ảnh sổ đỏ** (Giấy chứng nhận QSDĐ/QSHN) gắn chủ nhà/tòa qua FR36; số GCN, cơ quan cấp, ngày cấp nếu có. |
| Tác động | Chủ nhà được tham chiếu bởi tòa, hợp đồng và lịch thanh toán; ngừng hoạt động không xóa lịch sử. |

## 2. Mô tả màn hình

### Màn hình 05.1: Danh sách Chủ nhà

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Chủ nhà theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Trạng thái; tòa; khu vực; tên/SĐT |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Chủ nhà nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Mã chủ nhà; họ tên/pháp nhân; SĐT; địa chỉ; số tòa; trạng thái. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Ngừng hoạt động theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 05.2: Tạo Chủ nhà

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Mã; họ tên/pháp nhân; CCCD/pháp lý + ngày cấp + nơi cấp; SĐT; hộ khẩu thường trú/địa chỉ; tài khoản ngân hàng; đồng chủ thể; ảnh sổ đỏ (upload); ghi chú. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 05.3: Chi tiết Chủ nhà

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Mã chủ nhà; họ tên/pháp nhân; SĐT; địa chỉ; số tòa; trạng thái. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Chủ nhà nếu có quyền. |

### Màn hình 05.4: Chỉnh sửa Chủ nhà

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Mã; họ tên/pháp nhân; CCCD/pháp lý + ngày cấp + nơi cấp; SĐT; hộ khẩu thường trú/địa chỉ; tài khoản ngân hàng; đồng chủ thể; ảnh sổ đỏ (upload); ghi chú. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 05.5: Xác nhận Ngừng hoạt động Chủ nhà

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Chủ nhà đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Ngừng hoạt động -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Người dùng có quyền thao tác Chủ nhà. |
| Các bước người dùng | Bước 1: Mở Danh sách Chủ nhà (05.1).<br>Bước 2: Thêm mới -> 05.2 -> lưu -> 05.3.<br>Bước 3: Chỉnh sửa -> 05.4.<br>Bước 4: Ngừng hoạt động -> 05.5 -> xác nhận. |

---

# FR06 - Hợp đồng thuê nhà với chủ nhà

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Vận hành/Tài chính  
**Nguồn:** SRC-02; SRC-10; SRC-04; SRC-07; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; Vận hành/Kế toán được cấp quyền. |
| Phiên bản hợp đồng | Điều khoản hợp đồng, giá thuê theo giai đoạn, cọc, chu kỳ thanh toán và ngày hiệu lực phải được quản lý theo phiên bản; thay đổi không được ghi đè lịch sử kỳ cũ. |
| Cọc chủ nhà | Cọc chủ nhà là dòng tiền/tài sản phải theo dõi riêng, không mặc định là chi phí P&L. |
| Cash vs Cost | `Lịch trả chủ nhà` và `Chi phí thuê nhà theo tháng` là hai tập dữ liệu khác nhau. Chu kỳ trả 3/4/6 tháng không được làm toàn bộ số tiền trả dồn thành chi phí của riêng tháng thanh toán. |
| Giá thuê hiệu lực | Hệ thống xác định giá thuê từ `OwnerContractPriceVersion` đang hiệu lực. Hết thời gian giữ giá, hệ thống không tự tăng giá: nếu hai bên thống nhất thuê tiếp với giá mới thì tạo version giá mới từ ngày hiệu lực; nếu không tiếp tục thì thực hiện chấm dứt/không gia hạn. |
| Chu kỳ / giữ giá | Payment Schedule bám đúng kỳ hợp đồng đã ký. Giá chỉ thay đổi khi có xác nhận/phụ lục hoặc cập nhật nghiệp vụ có ngày hiệu lực; không auto-escalate theo thời gian. Trường hợp hợp đồng ngoài mẫu có tháng lẻ/thuế/phụ phí đặc biệt được xử lý theo điều khoản riêng của HĐ, không suy một rule chung. |
| Tác động | Hợp đồng là nguồn tạo lịch trả chủ nhà, lịch ghi nhận chi phí thuê, thông tin pháp lý tòa và nguồn `HEAD_LEASE_COST` cho báo cáo. |

## 2. Mô tả màn hình

### Màn hình 06.1: Danh sách Hợp đồng chủ nhà

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm theo mã HĐ, chủ nhà, tòa. |
| Bộ lọc | Bộ lọc | Không | Tòa; chủ nhà; trạng thái; ngày hết hạn; chu kỳ thanh toán. |
| Thêm mới | Nút | Không | Mở 06.2 nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Mã HĐ; chủ nhà; tòa; ngày bắt đầu/kết thúc; giá thuê hiện tại; cọc; chu kỳ; thời gian giữ giá; PCCC (Có/Không); người nhập nguồn; trạng thái; version hiện hành. |
| Thao tác dòng | Menu | Không | Xem / Chỉnh sửa / Chấm dứt / Hủy theo quyền. |

### Màn hình 06.2: Tạo Hợp đồng chủ nhà

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Chủ nhà / Tòa / Mã HĐ | Tra cứu + Văn bản | Có | Định danh hợp đồng nguồn. |
| Ngày ký / bàn giao / bắt đầu / kết thúc | Ngày | Có/Tùy điều kiện | Các ngày nghiệp vụ riêng. |
| Giá theo giai đoạn | Bảng version | Có | `effective_from/effective_to`, giá thuê, thuế/phụ phí nếu nguồn có. |
| Cọc | Tiền tệ | Tùy điều kiện | Theo HĐ; không tự đưa vào chi phí. |
| Chu kỳ / hạn trả | Danh sách + Ngày | Có | Nguồn tạo Payment Schedule. |
| Thời gian giữ giá / giá mới | Biểu mẫu | Tùy điều kiện | Lưu thời gian giữ giá. Khi hết kỳ giữ giá, người dùng chọn tiếp tục với giá mới → tạo version; hoặc kết thúc/không gia hạn. |
| PCCC / pháp lý / file / phụ lục | Biểu mẫu + Upload | Tùy điều kiện | Hồ sơ nguồn. PCCC theo SRC-02 là trường **Có / Không**. |
| Người nhập nguồn | Tra cứu nhân viên | Có | Theo SRC-02: nhân sự đã tìm/nhập nguồn nhà; snapshot tại thời điểm tạo HĐ. |
| Ghi chú | Văn bản | Không | Theo SRC-02. |
| Lưu | Nút chính | Có | Validate -> tạo HĐ/version; chưa tự ghi số báo cáo trực tiếp. |

### Màn hình 06.3: Chi tiết Hợp đồng chủ nhà

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Mã HĐ; chủ nhà; tòa; thời hạn; chu kỳ; trạng thái. |
| Lịch sử giá / Version | Bảng | Có | Giá và hiệu lực từng version. |
| Lịch trả tiền | Liên kết | Không | Mở FR07 Payment Schedule. |
| Chi phí thuê theo tháng | Liên kết | Không | Mở FR07 Cost Recognition. |
| Tài liệu / OCR | Liên kết | Không | FR36/FR49. |
| Lịch sử | Dòng thời gian | Có | Người thao tác, thời điểm, lý do/version. |

### Màn hình 06.4: Chỉnh sửa Hợp đồng chủ nhà

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Điều khoản/giá/ngày/file theo phạm vi quyền. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Có khi thay đổi điều khoản | Tạo version mới; không sửa ngược kỳ đã khóa. |
| Lưu thay đổi | Nút chính | Có | Lưu version và đánh dấu các lịch tương lai cần regenerate/review nếu bị tác động. |

### Màn hình 06.5: Xác nhận Chấm dứt / Hủy Hợp đồng chủ nhà

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Hợp đồng | Chỉ đọc | Có | HĐ đang thao tác. |
| Ngày hiệu lực chấm dứt | Ngày | Tùy điều kiện | Làm căn cứ đóng lịch tương lai. |
| Lý do | Văn bản | Có | Audit bắt buộc. |
| Xác nhận | Nút chính/nguy hiểm | Có | Cập nhật trạng thái, giữ lịch sử và không xóa chứng từ đã tham chiếu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có chủ nhà/tòa và người dùng có quyền. |
| Các bước người dùng | Bước 1: Tạo/Import/OCR HĐ -> 06.2.<br>Bước 2: Xác nhận version giá và điều khoản -> 06.3.<br>Bước 3: FR07 tạo lịch trả + dòng ghi nhận chi phí theo tháng.<br>Bước 4: Khi sửa giá/term -> 06.4 tạo version mới; kỳ đã khóa giữ nguyên snapshot.<br>Bước 5: Chấm dứt -> 06.5, đóng các lịch tương lai theo ngày hiệu lực. |

---

# FR07 - Lịch thanh toán và ghi nhận chi phí thuê chủ nhà

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Tài chính  
**Nguồn:** SRC-02; SRC-10; SRC-04; SRC-07; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin; Vận hành được xem theo quyền. |
| Payment Schedule | Lịch trả tiền được tạo từ chu kỳ hợp đồng và theo dõi nghĩa vụ tiền mặt: kỳ từ-đến, hạn trả, số phải trả, đã trả, còn lại, chứng từ. |
| Cost Recognition | Chi phí thuê phục vụ báo cáo phải có dòng riêng theo `accounting_period + building_id + owner_contract_version`. Không dùng ngày trả tiền để suy thẳng chi phí tháng. |
| Nguồn số | Dòng `HEAD_LEASE_COST_RECOGNITION` phải truy về đúng HĐ/version giá; nếu có điều chỉnh phải tạo adjustment/version chứ không sửa số lịch sử đã khóa. |
| Xác nhận | Cost Recognition theo giá/version hợp đồng hiệu lực của từng tháng trong kỳ. Kế toán Review/Confirm trước khi report snapshot sử dụng; không lấy nguyên số tiền trả 3/4/6 tháng làm chi phí của tháng thanh toán. |
| Giá thay đổi | Khi hết thời gian giữ giá và hai bên chốt giá mới, FR06 tạo Price Version mới; FR07 regenerate/điều chỉnh **lịch tương lai chưa khóa** theo version mới. Nếu hủy/không thuê tiếp thì đóng lịch tương lai từ ngày hiệu lực kết thúc. |
| Tác động | Payment Schedule phục vụ dòng tiền/công nợ chủ nhà; Cost Recognition là nguồn `HEAD_LEASE_COST` cho FR38/39/40. |

## 2. Mô tả màn hình

### Màn hình 07.1: Lịch trả tiền chủ nhà

**Loại màn hình:** Danh sách / Grid + Nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Bộ lọc | Không | Kỳ; tòa; chủ nhà; HĐ; trạng thái. |
| Bảng nghĩa vụ | Bảng | Có | HĐ/tòa; kỳ từ-đến; số tháng; hạn trả; giá áp dụng; phải trả; đã trả; còn lại; trạng thái. |
| Ghi nhận chi thực tế | Nút | Không | Nhập ngày trả, số tiền, chứng từ; không tự thay Cost Recognition. |
| Regenerate tương lai | Nút | Tùy điều kiện | Chỉ với lịch chưa khóa/chưa thanh toán khi HĐ version thay đổi; phải Preview trước Confirm. |

### Màn hình 07.2: Chi tiết nghĩa vụ / khoản trả chủ nhà

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu nghĩa vụ | Chỉ đọc | Có | HĐ/version; kỳ; hạn; số phải trả. |
| Khoản trả thực tế | Bảng | Không | payment_date; amount; chứng từ; người ghi/duyệt. |
| Còn lại / trạng thái | Chỉ đọc | Có | Tính từ nghĩa vụ và các khoản trả hợp lệ. |
| Truy HĐ | Liên kết | Có | Mở FR06/version nguồn. |
| Lịch sử | Dòng thời gian | Có | Tạo/điều chỉnh/đảo. |

### Màn hình 07.3: Ghi nhận / Xác nhận khoản trả chủ nhà

**Loại màn hình:** Popup / Biểu mẫu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Nghĩa vụ | Chỉ đọc | Có | Kỳ và số còn phải trả. |
| Ngày trả / Số tiền | Ngày + Tiền tệ | Có | Dòng tiền thực tế. |
| Chứng từ / Ghi chú | Upload + Văn bản | Tùy điều kiện | Bằng chứng thanh toán. |
| Xác nhận | Nút chính | Có | Lưu khoản trả; không chỉnh dòng chi phí thuê theo tháng. |

### Màn hình 07.4: Ghi nhận chi phí thuê nhà theo tháng

**Loại màn hình:** Danh sách / Grid + Review/Confirm

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ hạch toán | Tháng/Năm | Có | Kỳ lên P&L/report. |
| Tòa / HĐ / Version | Chỉ đọc / Tra cứu | Có | Nguồn nhận diện giá thuê hiệu lực. |
| Giá hiệu lực / Basis | Chỉ đọc | Có | Giá và khoảng hiệu lực dùng tính/đề xuất. |
| Số ghi nhận | Tiền tệ | Có | `HEAD_LEASE_COST`; có thể đề xuất tự động nhưng cần policy/confirmation phù hợp. |
| Phương pháp | Danh sách | Có | `CONTRACT_MONTHLY` / `MANUAL_CONFIRMED` / policy được duyệt; không tự suy diễn ngoài policy. |
| Trạng thái | Danh sách | Có | Draft / Confirmed / Locked / Adjusted. |
| Chứng từ / Lý do | Upload + Văn bản | Tùy điều kiện | Bắt buộc với manual adjustment. |
| Confirm | Nút chính | Có | Sau Confirm mới được Report Engine lấy cho kỳ. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | FR06 có HĐ chủ nhà/version hiệu lực. |
| Các bước người dùng | Bước 1: Sinh/kiểm tra Payment Schedule ở 07.1.<br>Bước 2: Khi trả tiền -> 07.3, cập nhật nghĩa vụ tiền mặt.<br>Bước 3: Theo mỗi kỳ, mở 07.4 -> kiểm tra giá hiệu lực và số `HEAD_LEASE_COST` -> Confirm.<br>Bước 4: FR38/40 chỉ lấy dòng recognition Confirmed/Locked của đúng kỳ; drill về FR06/07. |

---

# FR08 - Quản lý tòa nhà

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Vận hành  
**Nguồn:** SRC-02; SRC-07; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; Vận hành; Kế toán được xem theo quyền. |
| Quy tắc chức năng | Mã tòa là duy nhất; trạng thái và phân công có lịch sử; tòa đã có hợp đồng/giao dịch không được xóa vật lý. |
| Nhóm T/S/G | T, S, G là tiền tố của mã tòa (ví dụ T2, T3, S1, S2, G1, G2); nhóm tòa suy từ mã tòa và có lịch sử hiệu lực nếu đổi mã. |
| Giai đoạn mở tòa (v1.9) | Tòa có trạng thái `SETUP` từ ngày ký HĐ chủ nhà đến hết **tháng vận hành đầu tiên**, sau đó `OPERATING`. Theo G1: chi phí đầu tư trước khai trương (sheet `ĐẦU TƯ BAN ĐẦU`, 1/10–30/11/2025) và thu chi tháng đầu (sheet `THU CHI BAN ĐẦU`, tháng 1/2026) được lập riêng; báo cáo tháng vận hành bắt đầu từ tháng kế tiếp (`BÁO CÁO THÁNG 2`). Lưu `setup_start_date`, `operation_start_date`, `first_report_period`. |
| Thông tin tòa theo SRC-02 | Địa chỉ; đặc điểm tòa (diện tích, số tầng, số phòng, tình trạng: **cũ / trung bình / mới**); tên trưởng nhóm, NV vận hành, NV vệ sinh, NV kỹ thuật; đã đăng ký kinh doanh hay chưa; danh sách tài sản (tài sản của chủ nhà và tài sản đầu tư của công ty); hiệu suất; lợi nhuận; thời gian vận hành; theo dõi lịch đóng tiền cho chủ nhà. |
| Nhân sự phụ trách | Trưởng nhóm/NV vận hành/NV vệ sinh/NV kỹ thuật **không nhập tay trên tòa**; hiển thị từ Assignment hiệu lực FR34 theo loại trách nhiệm (OPS/CLEANING/TECH) và lead của nhánh FR33. |
| Chỉ tiêu tòa | `Hiệu suất tòa` = Hiệu suất FR25 của tòa trong kỳ đã khóa; `Lợi nhuận tòa` = `NET_PROFIT` của tòa từ FR40; `Thời gian vận hành` = từ ngày bắt đầu vận hành tòa đến ngày xem/ngày dừng vận hành. <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION: SRC-02 chỉ nêu tên ba chỉ tiêu, chưa có công thức; đây là định nghĩa đề xuất.</span> |
| Tác động | Tòa là phạm vi chính cho phòng, tiện ích, hóa đơn, chi phí, báo cáo, tài sản, nhân sự và cổ đông. |

## 2. Mô tả màn hình

### Màn hình 08.1: Danh sách Tòa nhà

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Tòa nhà theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | T/S/G; khu vực; chủ nhà; quản lý/leader; trạng thái |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Tòa nhà nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Mã/tên tòa; nhóm mã T/S/G; khu vực; địa chỉ; chủ nhà; số tầng/phòng; tình trạng; trưởng nhóm; NV vận hành; ngày vận hành; trạng thái. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Dừng vận hành theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 08.2: Tạo Tòa nhà

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Mã; tên; nhóm T/S/G; khu vực; địa chỉ; chủ nhà; diện tích; số tầng/phòng; tình trạng; ngày vận hành; ĐKKD; PCCC; ảnh/tài liệu; trạng thái. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 08.3: Chi tiết Tòa nhà

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Mã/tên tòa; nhóm mã T/S/G; khu vực; địa chỉ; chủ nhà; diện tích; số tầng/phòng; tình trạng (cũ/trung bình/mới); ĐKKD (đã/chưa); ngày vận hành; trạng thái. |
| Nhân sự phụ trách | Chỉ đọc | Có | Trưởng nhóm; NV vận hành; NV vệ sinh; NV kỹ thuật — lấy từ FR33/FR34 tại ngày xem. |
| Chỉ tiêu tòa | Thẻ KPI | Có | Hiệu suất; Lợi nhuận; Thời gian vận hành (định nghĩa tại Quy tắc nghiệp vụ). Nhấn -> FR25/FR40. |
| Tab Chủ nhà & HĐ | Tab | Có | Thông tin chủ nhà, HĐ chủ nhà (giá thuê, cọc, thời gian giữ giá, ngày kết thúc, PCCC, người nhập nguồn, ghi chú), ảnh sổ đỏ. |
| Tab Tài sản | Tab | Có | Danh sách tài sản chủ nhà và tài sản đầu tư (FR45). |
| Tab Lịch đóng tiền | Tab | Có | Lịch trả tiền chủ nhà FR07: kỳ, hạn, phải trả, đã trả, còn lại. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Tòa nhà nếu có quyền. |

### Màn hình 08.4: Chỉnh sửa Tòa nhà

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Mã; tên; nhóm T/S/G; khu vực; địa chỉ; chủ nhà; diện tích; số tầng/phòng; tình trạng; ngày vận hành; ĐKKD; PCCC; ảnh/tài liệu; trạng thái. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 08.5: Xác nhận Dừng vận hành Tòa nhà

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Tòa nhà đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Dừng vận hành -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Người dùng có quyền thao tác Tòa nhà. |
| Các bước người dùng | Bước 1: Mở Danh sách Tòa nhà (08.1).<br>Bước 2: Thêm mới -> 08.2 -> lưu -> 08.3.<br>Bước 3: Chỉnh sửa -> 08.4.<br>Bước 4: Dừng vận hành -> 08.5 -> xác nhận. |

---

# FR09 - HĐ tiện ích và hóa đơn NCC điện / nước / mạng theo tòa

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Vận hành/Tài chính  
**Nguồn:** SRC-06; SRC-12; SRC-13; SRC-04; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; Kế toán; Vận hành được cấp quyền. |
| Utility Contract | Mỗi tòa có thể có nhiều HĐ/mã KH điện, nước, mạng theo thời gian. Mapping phải có `effective_from/effective_to`, chủ HĐ, NCC và trạng thái. |
| Supplier Bill | Mỗi hóa đơn/chi phí NCC phải gắn tối thiểu `Tòa + loại dịch vụ + HĐ tiện ích + kỳ dịch vụ/kỳ hạch toán`; lưu số tiền và sản lượng/chỉ số nếu nguồn có. |
| Ngày dữ liệu | Tách `service_period`, `document_date`, `due_date`, `payment_date`, `accounting_period`; không lấy ngày nhập hệ thống thay ngày nghiệp vụ. |
| Version/Điều chỉnh | Hóa đơn NCC đã dùng cho kỳ/report không sửa đè; điều chỉnh phải tạo version/adjustment và có lý do. |
| Không nhầm giá bán | Utility Supplier Bill/chi phí đầu vào không thay thế giá bán điện/nước/mạng của khách trong FR13. |
| Lineage | Supplier Bill có thể tạo/liên kết Expense FR27; không tạo trùng hai chi phí cho cùng chứng từ. |
| Tác động | Là dữ liệu nguồn cho giá gốc dịch vụ và về sau cho báo cáo âm/dương: `InvoiceLine + PaymentAllocation(service line) + Supplier Bill/Expense`. |

## 2. Mô tả màn hình

### Màn hình 09.1: Danh sách HĐ tiện ích

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập | Không | Mã HĐ/mã KH, NCC, tòa. |
| Bộ lọc | Bộ lọc | Không | Tòa; T/S/G; Điện/Nước/Mạng; NCC; trạng thái; ngày hiệu lực. |
| Bảng dữ liệu | Bảng | Có | Tòa; loại; NCC; mã HĐ/mã KH; chủ HĐ; hiệu lực; trạng thái; bill gần nhất. |
| Thêm mới | Nút | Không | Mở 09.2. |
| Thao tác | Menu | Không | Xem / Chỉnh sửa / Ngừng hiệu lực / Xem hóa đơn NCC. |

### Màn hình 09.2: Tạo / Chỉnh sửa HĐ tiện ích

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tòa / Loại tiện ích | Tra cứu + Danh sách | Có | Điện/Nước/Mạng. |
| NCC / Mã HĐ / Mã KH / Chủ HĐ | Biểu mẫu | Có/Tùy điều kiện | Theo nguồn utility contract. |
| Effective from/to | Ngày | Có/Tùy điều kiện | Version theo thời gian. |
| Đơn vị/số công tơ/thông tin tham chiếu | Văn bản | Không | Khi nguồn có. |
| Ghi chú / Trạng thái | Văn bản + Danh sách | Không/Có | Quản lý vận hành. |
| Lưu | Nút chính | Có | Validate trùng hiệu lực theo cùng tòa/loại khi policy không cho phép. |

### Màn hình 09.3: Chi tiết HĐ tiện ích

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin HĐ | Chỉ đọc | Có | Tòa; loại; NCC; mã; chủ HĐ; hiệu lực. |
| Hóa đơn NCC theo kỳ | Bảng | Không | Bill ID; kỳ; sản lượng; amount; accounting period; trạng thái thanh toán; Expense link. |
| Tài liệu | Liên kết | Không | HĐ/chứng từ. |
| Lịch sử | Dòng thời gian | Có | Version/mapping changes. |

### Màn hình 09.4: Hóa đơn NCC tiện ích theo Tòa + Kỳ

**Loại màn hình:** Danh sách / Grid + Nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ dịch vụ / Kỳ hạch toán | Tháng/Năm | Có | Có thể khác ngày thanh toán. |
| Tòa / Loại / HĐ tiện ích | Tra cứu | Có | Nguồn mapping. |
| NCC / Số hóa đơn | Văn bản | Tùy điều kiện | Thông tin chứng từ đầu vào. |
| Sản lượng / Đơn vị | Số + Danh sách | Không | kWh/m3/đơn vị khác nếu nguồn có. |
| Số tiền hóa đơn | Tiền tệ | Có | Giá gốc đầu vào. |
| Ngày chứng từ / Hạn trả / Ngày trả | Ngày | Tùy điều kiện | Tách các thời điểm. |
| Chứng từ | Upload | Tùy điều kiện | File hóa đơn/biên nhận. |
| Import batch | Chỉ đọc | Không | Batch nếu nhập Excel. |
| Tạo/Link Expense | Nút/Tra cứu | Có khi lên P&L | Tạo hoặc liên kết đúng một FR27 Expense; chống duplicate. |

### Màn hình 09.5: Chi tiết Hóa đơn NCC tiện ích

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bill source | Chỉ đọc | Có | Tòa, HĐ, kỳ, sản lượng, amount, ngày. |
| Expense / Report usage | Liên kết | Không | FR27 và các metric/report snapshot sử dụng. |
| Payment status | Chỉ đọc | Không | Theo dõi chi NCC nếu được ghi nhận. |
| Lịch sử/Adjustment | Dòng thời gian | Có | Không sửa đè bill đã khóa. |

### Màn hình 09.6: Xác nhận Ngừng HĐ tiện ích

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| HĐ tiện ích | Chỉ đọc | Có | Mapping đang thao tác. |
| Effective to / Lý do | Ngày + Văn bản | Có | Kết thúc hiệu lực. |
| Xác nhận | Nút chính | Có | Đóng mapping tương lai; bill lịch sử giữ nguyên. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có tòa và quyền utility/expense. |
| Các bước người dùng | Bước 1: Khai báo/import HĐ tiện ích 09.2.<br>Bước 2: Mỗi kỳ nhập/import Supplier Bill 09.4.<br>Bước 3: Link/tạo một Expense FR27 cho số chi được ghi nhận.<br>Bước 4: Report giá gốc drill từ FR40 -> FR27 -> 09.5/chứng từ.<br>Bước 5: Dữ liệu `InvoiceLine + PaymentAllocation + Bill` được giữ để về sau sinh báo cáo âm/dương. |

---

# FR10 - Quản lý phòng và lịch sử trạng thái phòng

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Vận hành  
**Nguồn:** SRC-02; SRC-08; SRC-04; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; Vận hành; Kinh doanh được xem theo quyền. |
| Định danh | Phòng giữ một định danh xuyên suốt các lượt thuê; không tạo phòng mới chỉ vì đổi khách. |
| Trạng thái | Trạng thái phòng không được suy từ số tiền hóa đơn. Mọi thay đổi trạng thái có ảnh hưởng báo cáo phải tạo `RoomStatusHistory`. |
| Effective history | `RoomStatusHistory` tối thiểu gồm `room_id`, `status`, `effective_from`, `effective_to`, `reason`, `source_event_type`, `source_event_id`, `changed_by`. Không ghi đè khoảng lịch sử cũ. |
| Vacancy | Chốt 3 nhóm nghiệp vụ: `VACANT_READY_NOW` = trống ở luôn trong tháng; `VACANT_END_OF_MONTH` = trống hết tháng; `WAITING_AVAILABLE` = đang chờ. Mọi thay đổi vẫn phải tạo `RoomStatusHistory` để giữ effective interval. <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION: điều kiện vào/ra từng nhóm (ví dụ "đang chờ" có phải đã cọc nhưng chưa nhận phòng, hay đang dọn/sửa) chưa có trong nguồn.</span> |
| Sau hoàn cọc / phá HĐ | Phòng phát sinh do hoàn cọc/phá HĐ chuyển qua trạng thái chờ dọn/kiểm tra trước khi về sẵn sàng (theo luồng Phase 1 trong `00_SCOPE_3_PHASE.md`: Chờ dọn → Sẵn sàng). |
| Dashboard count | Dashboard phải hiển thị riêng 3 count: `VACANT_READY_NOW_COUNT`, `VACANT_END_OF_MONTH_COUNT`, `WAITING_AVAILABLE_COUNT`; `TOTAL_VACANT_DISPLAY = tổng 3 nhóm` nếu UI cần tổng. |
| Ba mức giá phòng (v1.9) | Hóa đơn nguồn SRC-08 có 3 cột giá: **Giá niêm yết** (giá chuẩn của phòng, master FR10, mẫu số hiệu suất FR25); **Giá QL**; **Giá phòng hiện tại** (giá thực tế khách thuê theo HĐ FR12, dùng tính tiền phòng). `Giá QL` lưu ở FR10 với lịch sử hiệu lực. <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION (C-23): ý nghĩa và mục đích dùng của `Giá QL` — dữ liệu nguồn thường bằng giá hiện tại, có phòng thấp hơn giá niêm yết (ví dụ T3: niêm yết 103.000.000 / Giá QL 97.700.000 cho 22 phòng).</span> |
| Tác động | Trạng thái hiện tại phục vụ Dashboard/Kinh doanh; history phục vụ `VACANT_ROOM_COUNT`, tỷ lệ lấp đầy và thời gian trống về sau; HĐ/lượt thuê hiệu lực phục vụ Billing. |

## 2. Mô tả màn hình

### Màn hình 10.1: Danh sách Phòng

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập | Không | Mã phòng/tòa. |
| Bộ lọc | Bộ lọc | Không | Tòa; T/S/G; tầng; trạng thái; ngày sẵn sàng; quản lý. |
| Bảng dữ liệu | Bảng | Có | Mã phòng; tòa/tầng; giá niêm yết; Giá QL; giá hiện tại; trạng thái hiện tại; effective from; ngày sẵn sàng; khách/HĐ hiện tại. |
| Thêm mới | Nút | Không | Mở 10.2. |
| Thao tác | Menu | Không | Xem / Chỉnh sửa / Đổi trạng thái / Ngừng sử dụng. |

### Màn hình 10.2: Tạo Phòng

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tòa / Mã phòng / Tầng | Tra cứu + Văn bản | Có | Định danh. |
| Diện tích/loại/giá niêm yết/Giá QL | Biểu mẫu | Tùy điều kiện | Master data; giá có ngày hiệu lực. |
| Trạng thái ban đầu / Ngày hiệu lực | Danh sách + Ngày giờ | Có | Tạo history đầu tiên. |
| Ngày sẵn sàng / tình trạng kỹ thuật / ảnh / ghi chú | Biểu mẫu | Tùy điều kiện | Vận hành phòng. |
| Lưu | Nút chính | Có | Tạo Room + RoomStatusHistory ban đầu. |

### Màn hình 10.3: Chi tiết Phòng

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Room master + trạng thái hiện tại. |
| Khách/HĐ hiện tại | Liên kết | Không | FR11/12. |
| Lịch sử trạng thái | Timeline/Bảng | Có | status, from/to, reason, source event, actor. |
| Lịch sử thuê | Bảng | Không | Các stay/contract trước đó. |
| Chỉnh sửa / Đổi trạng thái | Nút | Không | Mở 10.4/10.5. |

### Màn hình 10.4: Chỉnh sửa thông tin Phòng

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Master data | Biểu mẫu | Có/Tùy điều kiện | Không dùng màn này để âm thầm đổi trạng thái lịch sử. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Cho dữ liệu có hiệu lực theo thời gian. |
| Lưu | Nút chính | Có | Lưu version/history phù hợp. |

### Màn hình 10.5: Đổi trạng thái Phòng

**Loại màn hình:** Popup / Biểu mẫu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Trạng thái hiện tại | Chỉ đọc | Có | Trạng thái trước. |
| Trạng thái mới | Danh sách | Có | Theo danh mục được duyệt. |
| Effective from | Ngày giờ | Có | Thời điểm bắt đầu trạng thái mới. |
| Effective to cũ | Tự tính/Chỉ đọc | Có | Đóng interval cũ không chồng lấn. |
| Lý do | Danh sách/Văn bản | Có | Ví dụ nhận phòng, báo trả, chờ nhận, sẵn sàng ở, bảo trì... theo danh mục. |
| Source event | Tra cứu | Tùy điều kiện | Deal/Stay/Contract/Maintenance event nếu có. |
| Xác nhận | Nút chính | Có | Tạo RoomStatusHistory mới. |

### Màn hình 10.6: Xác nhận Ngừng sử dụng Phòng

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Phòng | Chỉ đọc | Có | Room nguồn. |
| Effective from / Lý do | Ngày + Văn bản | Có | Tạo trạng thái ngừng sử dụng có lịch sử. |
| Xác nhận | Nút chính/nguy hiểm | Có | Không xóa vật lý các Stay/HĐ/Invoice lịch sử. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có tòa và quyền phòng. |
| Các bước người dùng | Bước 1: Tạo phòng -> 10.2.<br>Bước 2: Các event nhận phòng/báo trả/chờ nhận/bảo trì gọi hoặc yêu cầu 10.5 để tạo history.<br>Bước 3: 10.3 xem timeline và truy source event.<br>Bước 4: Report dùng interval history theo kỳ, không dùng trạng thái hiện tại để tính ngược quá khứ. |

---

# FR11 - Quản lý khách hàng, lượt thuê và phòng mới trong kỳ

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Vận hành  
**Nguồn:** SRC-02; SRC-01; SRC-08 `PHÒNG MỚI THÁNG 9`, `PHÒNG MỚI THÁNG 10`; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; Vận hành; Kế toán; Kinh doanh theo quyền. |
| Tách đối tượng | Khách hàng, Deal, lượt thuê và hợp đồng là các đối tượng riêng. Một khách có thể có nhiều lượt thuê theo thời gian. |
| Phòng mới | **Phòng mới trong kỳ** là lượt thuê đã xác nhận nhận phòng/bắt đầu ở trong kỳ; chỉ có cọc nhưng chưa nhận phòng thì chưa tính phòng mới. |
| Trạng thái nhận phòng | Luồng tối thiểu: `Đã chốt → Đã nhận cọc → Chờ nhận phòng → Đã nhận phòng/Đang thuê`; nhánh `Không nhận phòng/Bỏ cọc` tách riêng. |
| Ngày nghiệp vụ | `Ngày chốt`, `Ngày nhận phòng thực tế`, `Ngày bắt đầu tính tiền`, `Ngày bắt đầu dịch vụ`, `Ngày kết thúc` là các ngày riêng. |
| Phân khúc KH | Ngoài `nghề nghiệp` text, Phase 1 phải có `occupation_category/customer_segment` dạng danh mục (ví dụ danh mục do business cấu hình). Báo cáo phân khúc về sau dùng mã danh mục, không suy từ text tự do. |
| Lịch sử segment | Nếu segment thay đổi trong một lượt thuê, phải có effective date hoặc snapshot ở Stay để báo cáo lịch sử tái lập được. |
| Định danh hiển thị | Theo SRC-02, khách được định danh bằng **mã phòng + mã tòa** (ví dụ `202T24`); tiêu đề màn chi tiết là mã phòng + mã tòa. |
| Trạng thái tổng quan | Theo SRC-02: `Đang thuê`, `Chuẩn bị hết HĐ`, `Phá HĐ`, `Hoàn cọc`. `Chuẩn bị hết HĐ` = HĐ đang hiệu lực và `ngày kết thúc HĐ − ngày hiện tại ≤ 35 ngày` (mốc **35 ngày** theo SRC-02). Trạng thái tính từ HĐ/Contract Event/FR26, không nhập tay. |
| Lần ký HĐ | Hiển thị `HĐ lần đầu` hoặc `Gia hạn lần thứ n`; n = số lần gia hạn của cùng khách tại cùng phòng (FR12 Contract Event). |
| Phương tiện | Lưu **số lượng xe kèm biển số** (danh sách xe: loại xe, biển số, xe điện có/không). Số xe là nguồn số lượng cho phí gửi xe/sạc xe điện ở FR13/FR14. |
| Mục Tài chính | SRC-02 có mục `MỤC TÀI CHÍNH` nhưng nội dung chưa đầy đủ ("thêm danh sách khách hoà gồm: mã phòng mã tòa,"). Tạm hiển thị cọc, công nợ, hóa đơn, phiếu thu, hoàn cọc của khách. <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION.</span> |
| Tác động | Xác nhận nhận phòng tạo/kích hoạt Stay, event `NEW_ROOM`, liên kết HĐ/bảng giá, cập nhật Room Status History và làm nguồn billing/cọc/báo cáo. |

## 2. Mô tả màn hình

### Màn hình 11.1: Danh sách Khách hàng / Lượt thuê

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập | Không | Khách, SĐT, phòng, mã HĐ, Stay ID. |
| Bộ lọc | Bộ lọc | Không | Tòa/phòng; kỳ; trưởng khu vực; quản lý/NV vận hành; trạng thái; khách mới; công nợ; segment/nghề nghiệp. |
| Bảng dữ liệu | Bảng | Có | Theo mục tổng quan SRC-02: **mã phòng + mã tòa**; tên trưởng khu vực; tên NV vận hành; công nợ; đã liên kết Zalo (Có/Không); trạng thái (Đang thuê / Chuẩn bị hết HĐ / Phá HĐ / Hoàn cọc). Cột bổ sung: khách; segment; ngày nhận; ngày tính tiền; cọc. |
| Thao tác | Menu | Không | Xem / Chỉnh sửa / Xác nhận nhận phòng / Kết thúc-Hủy theo quyền. |

### Màn hình 11.2: Tạo Khách hàng / Lượt thuê

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin khách | Biểu mẫu | Có | Khách; liên hệ; CCCD theo quyền; nghề nghiệp text. |
| Occupation category / Customer segment | Danh sách | Tùy điều kiện | Danh mục cấu hình dùng cho báo cáo; không tự suy từ nghề nghiệp. |
| Người ở cùng / tạm trú | Biểu mẫu | Không | Dữ liệu lưu trú. |
| Phương tiện | Bảng nhập liệu | Không | Số lượng xe; mỗi xe: loại, **biển số**, xe điện (Có/Không). |
| Ghi chú | Văn bản | Không | Nhập tay theo SRC-02. |
| Thông tin lưu trú | Biểu mẫu | Có/Tùy điều kiện | Tòa/phòng; Deal; ngày nhận dự kiến/thực tế; ngày tính tiền; ngày dịch vụ; ngày kết thúc dự kiến. |
| Lưu | Nút chính | Có | Chưa tự tính phòng mới khi chưa xác nhận nhận phòng. |

### Màn hình 11.3: Chi tiết Khách hàng / Lượt thuê

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tiêu đề | Chỉ đọc | Có | Mã phòng + mã tòa. |
| Thông tin lưu trú | Chỉ đọc | Có | Theo SRC-02: ngày bắt đầu và kết thúc HĐ; thời hạn HĐ; lần ký (HĐ lần đầu / gia hạn lần thứ n); nghề nghiệp; số lượng xe kèm biển số. Bổ sung: khách; segment; Deal; ngày nhận/ngày tính tiền; trạng thái; cọc; công nợ. |
| Mục Hợp đồng | Tab | Có | Tải HĐ lên, bảng giá dịch vụ theo HĐ (FR12/FR13/FR50). |
| Ghi chú | Văn bản | Không | Nhập tay. |
| Dữ liệu liên kết | Tab/Liên kết | Không | HĐ; bảng giá; invoice; Payment; công nợ; refund; tài liệu; chuyển phòng. |
| Lịch sử trạng thái | Timeline | Có | Chốt/cọc/chờ nhận/đã nhận/báo trả/kết thúc và actor/time. |
| Lịch sử segment | Timeline | Tùy điều kiện | Mã segment, hiệu lực, lý do. |

### Màn hình 11.4: Chỉnh sửa Khách hàng / Lượt thuê

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Dữ liệu chưa khóa; thay room/date/segment có ảnh hưởng report phải có effective date. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc với dữ liệu đã tham gia nghiệp vụ/report. |
| Lưu | Nút chính | Có | Không ghi đè Invoice/Report snapshot kỳ đã khóa. |

### Màn hình 11.5: Xác nhận nhận phòng

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Deal / Khách / Phòng | Chỉ đọc | Có | Nguồn nhận phòng. |
| Ngày nhận thực tế | Ngày | Có | Date basis `NEW_ROOM`. |
| Ngày bắt đầu tính tiền / dịch vụ | Ngày | Có/Tùy điều kiện | Nguồn hóa đơn tháng đầu. |
| Contract/Service snapshot | Liên kết | Có trước billing | FR12/13. |
| Xác nhận | Nút chính | Có | Tạo/kích hoạt Stay + NEW_ROOM + RoomStatusHistory `Đang ở`. |

### Màn hình 11.6: Xác nhận kết thúc / hủy lượt thuê

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Stay/HĐ | Chỉ đọc | Có | Lượt thuê nguồn. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Có | Liên kết FR12/FR26 nếu có quyết toán. |
| Xác nhận | Nút chính | Có | Đóng Stay, tạo/cập nhật RoomStatusHistory phù hợp; không xóa lịch sử tài chính. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có khách/Deal/phòng và quyền thao tác. |
| Các bước người dùng | Bước 1: Tạo/chuẩn hóa khách + segment -> 11.2.<br>Bước 2: Deal FR31 chuyển sang chờ nhận.<br>Bước 3: 11.5 xác nhận nhận phòng -> Stay + NEW_ROOM + RoomStatusHistory.<br>Bước 4: FR12/13/16 tạo nghĩa vụ/hóa đơn; FR21 thu tiền.<br>Bước 5: Khi kết thúc -> 11.6 + FR26; giữ đầy đủ history cho báo cáo. |

---

# FR12 - Quản lý hợp đồng thuê phòng

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Vận hành  
**Nguồn:** SRC-01; SRC-02; SRC-08; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; nhân sự Vận hành/Hợp đồng được cấp quyền; Kế toán xem theo quyền. |
| Quy tắc chức năng | Hợp đồng và điều khoản giá phải có phiên bản/hiệu lực. Gia hạn/chuyển phòng không được ghi đè hóa đơn lịch sử. `Ngày nhận phòng thực tế` và `Ngày bắt đầu tính tiền` phải lưu riêng. |
| Cọc | Cọc theo hợp đồng là nghĩa vụ riêng với tiền phòng. Khi khách được xác nhận nhận phòng trong kỳ, cọc của lượt thuê mới trở thành nguồn `Cọc phòng mới`; nếu khách không nhận phòng và cọc bị giữ thì chuyển sang nghiệp vụ `Cọc khách bỏ không ở`. |
| Kỳ thanh toán của khách (v1.9) | Mỗi HĐ lưu `payment_cycle_months` (1/2/3/…) và lịch kỳ đóng; mỗi tháng hóa đơn có `Kỳ TT` = số tháng tiền phòng phải đóng trong kỳ đó: `1` = tháng thường; `n > 1` = **đến kỳ đóng n tháng**; `0` = đã trả trước, tháng này không thu tiền phòng. Bằng chứng SRC-08 tháng 9: 101S1 `Kỳ TT 2` ("đến kì tt 2 tháng"), 101S5 `Kỳ TT 3` ("đến kì tt 3th"), 506S2 `Kỳ TT 0` ("đã tt 3 tháng tiền nhà và dv"), 304G8 `Kỳ TT 0` ("đã thu đến 10/10"). |
| OCR | Hợp đồng có thể nhập tay hoặc qua FR50 `OCR hợp đồng khách thuê`; dữ liệu OCR bắt buộc Review → Confirm → Apply trước khi thành dữ liệu hợp đồng chính thức. |
| Lần ký / gia hạn | Mỗi HĐ lưu `renewal_no`: 0 = HĐ lần đầu; n = gia hạn lần thứ n. Gia hạn tạo version/Contract Event mới, không ghi đè HĐ cũ. |
| Cảnh báo hết hạn | HĐ chuyển trạng thái hiển thị `Chuẩn bị hết HĐ` khi còn **≤ 35 ngày** tới ngày kết thúc (SRC-02); dùng cho FR04, FR11 và danh sách nhắc. |
| Bảng giá theo HĐ | SRC-02: "tải hợp đồng lên và tự cập nhật bảng giá dịch vụ theo HĐ vì mỗi HĐ một loại giá dịch vụ" → bảng giá FR13 luôn gắn theo từng HĐ, nguồn từ OCR FR50 sau Review/Confirm. |
| Tác động | Hợp đồng hiệu lực cung cấp giá phòng, cọc, chu kỳ, ngày tính tiền, bảng giá dịch vụ và cảnh báo hết hạn; FR16 dùng đúng phiên bản hiệu lực để tạo hóa đơn. |

## 2. Mô tả màn hình

### Màn hình 12.1: Danh sách Hợp đồng khách thuê

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm / Bộ lọc | Ô nhập + Bộ lọc | Không | Tòa; phòng; khách; trạng thái; ngày nhận; ngày tính tiền; khoảng hết hạn; quản lý. |
| OCR hợp đồng | Nút | Không | Mở FR50 nếu có file HĐ cần trích xuất. |
| Bảng dữ liệu | Bảng | Có | Mã HĐ; khách/lượt thuê; tòa/phòng; ngày ký; ngày nhận; ngày tính tiền; bắt đầu/kết thúc; thời hạn; lần ký (lần đầu / gia hạn lần n); giá phòng; cọc; chu kỳ; trạng thái (gồm `Chuẩn bị hết HĐ` ≤ 35 ngày); phiên bản. |

### Màn hình 12.2: Tạo Hợp đồng khách thuê

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Khách / Lượt thuê / Phòng | Tra cứu | Có | Liên kết FR11. |
| Ngày hợp đồng | Ngày | Có/Tùy điều kiện | Ngày ký; ngày nhận dự kiến/thực tế; ngày bắt đầu tính tiền; ngày bắt đầu dịch vụ; ngày kết thúc. |
| Giá phòng / Cọc / Chu kỳ | Tiền tệ + Danh sách | Có | Giá tháng, tiền cọc, chu kỳ và hạn thanh toán. |
| Dịch vụ | Liên kết | Có/Tùy điều kiện | Tạo/áp dụng bảng giá FR13. |
| File hợp đồng | Tải lên | Không | Lưu bản gốc; có thể chuyển OCR FR50. |
| Lưu | Nút chính | Có | Lưu bản nháp/phiên bản; không tự phát hành hóa đơn. |

### Màn hình 12.3: Chi tiết Hợp đồng khách thuê

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Toàn bộ thời gian, giá phòng, cọc, ngày tính tiền, chu kỳ và trạng thái. |
| Bảng giá dịch vụ | Liên kết | Có | Phiên bản FR13 đang/đã hiệu lực. |
| Lượt thuê / Hóa đơn / Payment | Liên kết | Không | Truy ngược FR11/17/21. |
| Phiên bản / OCR | Dòng thời gian | Không | File gốc, extraction version, người xác nhận và lịch sử thay đổi. |

### Màn hình 12.4: Chỉnh sửa Hợp đồng khách thuê

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Chỉ sửa dữ liệu được phép; thay giá/ngày tính tiền phải tạo phiên bản hoặc lịch sử hiệu lực. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay dữ liệu ảnh hưởng Billing/Report. |
| Lưu thay đổi | Nút chính | Có | Không ghi đè invoice snapshot/kỳ đã khóa. |

### Màn hình 12.5: Xác nhận Hủy / Chấm dứt Hợp đồng khách thuê

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | HĐ/lượt thuê cần thao tác. |
| Loại kết thúc | Danh sách chọn | Có | Hết hạn / Trả đúng hạn / Phá HĐ / Khác. |
| Ngày / Lý do | Ngày + Văn bản | Có | Nguồn tạo Contract Event. |
| Xác nhận | Nút chính/nguy hiểm | Có | Với `Phá HĐ` chuyển FR26 để quyết toán trước khi đóng nghĩa vụ. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có khách/lượt thuê hoặc Deal; có quyền hợp đồng. |
| Các bước người dùng | Bước 1: Tạo tay tại 12.2 hoặc OCR qua FR50.<br>Bước 2: Rà soát giá/cọc/ngày nhận/ngày tính tiền và FR13.<br>Bước 3: Khi khách nhận phòng, FR11 xác nhận `NEW_ROOM`.<br>Bước 4: Khi thay đổi/gia hạn/chấm dứt, tạo phiên bản/sự kiện; không sửa dữ liệu lịch sử. |

---

# FR13 - Bảng giá dịch vụ theo phiên bản hợp đồng

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Hóa đơn  
**Nguồn:** SRC-01; SRC-02; SRC-08; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; nhân sự Hợp đồng/Vận hành được cấp quyền; Kế toán rà soát. |
| Quy tắc chức năng | Giá dịch vụ phải gắn với hợp đồng/lượt thuê và ngày hiệu lực, hỗ trợ FIXED/METER/MANUAL. Thay đổi giá chỉ ảnh hưởng hóa đơn chưa phát hành trong tương lai. |
| Danh mục dịch vụ | Theo SRC-02: **điện, nước, mạng, thang máy, dịch vụ chung, phí sạc xe điện, phí gửi xe**. Theo hóa đơn thực tế SRC-08 bổ sung: vệ sinh, máy giặt, dịch vụ khác. Ví dụ đơn giá nguồn (`PHÒNG MỚI THÁNG 9`): điện 4.000/số (METER); nước 35.000/khối (METER) **hoặc** 120.000/người (FIXED) tùy HĐ; mạng 100.000/phòng; thang máy 50.000–60.000/người; xe điện 150.000/xe; dịch vụ khác 120.000/người. Cùng một dịch vụ có thể METER ở HĐ này và FIXED ở HĐ khác → billing type gắn theo từng HĐ. |
| Phí xe | SRC-02 tách `phí sạc xe điện` và `phí gửi xe`, nhưng hóa đơn SRC-08 chỉ có một cột `XE ĐIỆN` và báo cáo có một dòng `Doanh thu xe điện`. Hệ thống lưu hai mã dịch vụ riêng, map cùng metric `ELECTRIC_VEHICLE_REVENUE`. <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION cách in trên hóa đơn.</span> Số lượng xe lấy từ danh sách xe FR11. |
| Tác động | Bảng giá đã xác nhận là đầu vào tính hóa đơn; từng dòng hóa đơn đã phát hành giữ snapshot riêng. |

## 2. Mô tả màn hình

### Màn hình 13.1: Danh sách Giá dịch vụ theo hợp đồng

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Giá dịch vụ theo hợp đồng theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Hợp đồng/lượt thuê; dịch vụ; ngày hiệu lực; trạng thái |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Giá dịch vụ theo hợp đồng nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Loại dịch vụ; cách tính; đơn vị; đơn giá; số lượng mặc định; hiệu lực từ/đến; nguồn; trạng thái xác nhận. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Ngừng áp dụng theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 13.2: Tạo Giá dịch vụ theo hợp đồng

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Hợp đồng/lượt thuê; dịch vụ; FIXED/METER/MANUAL; đơn vị; đơn giá; số lượng mặc định; ngày hiệu lực; nguồn hợp đồng/trang; trạng thái xác nhận. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 13.3: Chi tiết Giá dịch vụ theo hợp đồng

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Loại dịch vụ; cách tính; đơn vị; đơn giá; số lượng mặc định; hiệu lực từ/đến; nguồn; trạng thái xác nhận. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Giá dịch vụ theo hợp đồng nếu có quyền. |

### Màn hình 13.4: Chỉnh sửa Giá dịch vụ theo hợp đồng

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Hợp đồng/lượt thuê; dịch vụ; FIXED/METER/MANUAL; đơn vị; đơn giá; số lượng mặc định; ngày hiệu lực; nguồn hợp đồng/trang; trạng thái xác nhận. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 13.5: Xác nhận Ngừng áp dụng Giá dịch vụ theo hợp đồng

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Giá dịch vụ theo hợp đồng đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Ngừng áp dụng -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Người dùng có quyền thao tác Giá dịch vụ theo hợp đồng. |
| Các bước người dùng | Bước 1: Mở Danh sách Giá dịch vụ theo hợp đồng (13.1).<br>Bước 2: Thêm mới -> 13.2 -> lưu -> 13.3.<br>Bước 3: Chỉnh sửa -> 13.4.<br>Bước 4: Ngừng áp dụng -> 13.5 -> xác nhận. |

---

# FR14 - Nhập chỉ số và số lượng dịch vụ theo tòa / kỳ

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Hóa đơn  
**Nguồn:** SRC-08; SRC-06; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Quản lý/Vận hành theo tòa được giao; Kế toán/Admin. |
| Quy tắc chức năng | Nhập chỉ số theo Kỳ + Tòa; chỉ số/số lượng là dữ liệu nguồn, đơn giá lấy từ bảng giá hợp đồng chứ không nhập lại tại đây. |
| Phòng trống / không thu được (v1.9) | Theo sheet `ĐIỆN NƯỚC PHÒNG TRỐNG/KHÔNG THU ĐƯỢC` (SRC-08): **vẫn ghi chỉ số điện/nước** cho phòng không có lượt thuê hiệu lực (phòng trống, sau phá HĐ, đang sửa) với lý do `VACANT` / `TERMINATED` / `OTHER` (nguồn ghi "kh phá hd", "PT"). Dòng này **không tạo hóa đơn**; lưu `consumption × đơn giá tham chiếu` (điện 4.000, nước 35.000) là `UNCOLLECTIBLE_UTILITY` theo tòa/kỳ, dùng cho báo cáo âm/dương (cột "không thu được") và đối chiếu phá HĐ. Không chặn nhập chỉ số với phòng không có HĐ; chỉ cảnh báo. |
| Tác động | Dữ liệu hợp lệ tạo dòng phí biến đổi của hóa đơn; dữ liệu đã dùng cho hóa đơn phát hành chỉ được sửa qua điều chỉnh có kiểm soát. |

## 2. Mô tả màn hình

### Màn hình 14.1: Nhập chỉ số và số lượng dịch vụ theo tòa / kỳ - Danh sách / Nhập liệu

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Phạm vi / Bộ lọc | Bộ lọc | Không | Kỳ, tòa, khu vực, người phụ trách và trạng thái phù hợp nghiệp vụ. |
| Dữ liệu đầu vào | Bảng / Biểu mẫu | Có | Kỳ; tòa; phòng/lượt thuê; điện cũ/mới; nước cũ/mới; mức tiêu thụ; số người; số xe; số lượng dịch vụ; ngày ghi; ảnh/chứng cứ; ghi chú. |
| Kiểm tra | Nút | Tùy điều kiện | Kiểm tra quyền, dữ liệu bắt buộc, trùng lặp và trạng thái kỳ. |
| Thực hiện | Nút chính | Có | Thực hiện nghiệp vụ -> Dữ liệu chỉ số/số lượng đã kiểm tra và sẵn sàng cho tạo hóa đơn.. Kiểm tra chỉ số mới >= cũ, trùng kỳ, thiếu giá dịch vụ; phòng không có HĐ → cảnh báo và ghi dạng `UNCOLLECTIBLE_UTILITY` (không chặn). |

### Màn hình 14.2: Nhập chỉ số và số lượng dịch vụ theo tòa / kỳ - Chi tiết / Kết quả

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu nguồn | Chỉ đọc | Có | Hiển thị kỳ, đối tượng, nguồn dữ liệu, người thao tác và các bản ghi liên quan. |
| Kết quả | Chỉ đọc / Bảng | Có | Dữ liệu chỉ số/số lượng đã kiểm tra và sẵn sàng cho tạo hóa đơn. |
| Truy vết | Liên kết | Không | Nhấn -> mở chứng từ/bản ghi đã tạo ra kết quả. |
| Lịch sử | Dòng thời gian | Không | Hiển thị các lần thay đổi, điều chỉnh hoặc phiên bản. |

### Màn hình 14.3: Xác nhận Nhập chỉ số và số lượng dịch vụ theo tòa / kỳ

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tóm tắt | Chỉ đọc | Có | Tóm tắt phạm vi, số bản ghi và tác động. |
| Cảnh báo | Chỉ đọc | Tùy điều kiện | Hiển thị lỗi/cảnh báo phải xử lý trước khi xác nhận. |
| Xác nhận | Nút chính | Có | Xác nhận -> lưu giao dịch/phiên bản/nhật ký. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Kỳ/tòa và lượt thuê hiệu lực tồn tại. |
| Các bước người dùng | Bước 1: Chọn Kỳ + Tòa tại 14.1.<br>Bước 2: Nhập hoặc import chỉ số/số lượng -> Kiểm tra.<br>Bước 3: Xem kết quả -> xác nhận 14.3 -> dữ liệu chuyển FR16. |

---

# FR15 - Khoản phát sinh / nhập tay theo kỳ

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Hóa đơn  
**Nguồn:** SRC-08; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Quản lý/Vận hành theo tòa; Kế toán/Admin. |
| Quy tắc chức năng | Khoản phát sinh phải gắn Kỳ + Tòa + Phòng/Lượt thuê, có loại, số lượng/số tiền và chứng từ; không được trùng dịch vụ cố định. |
| Tác động | Khoản hợp lệ được đưa vào hóa đơn đúng một lần; hủy trước phát hành loại khỏi hóa đơn nháp tương lai. |

## 2. Mô tả màn hình

### Màn hình 15.1: Danh sách Khoản phát sinh

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Khoản phát sinh theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Kỳ; tòa; quản lý; loại khoản; trạng thái |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Khoản phát sinh nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Kỳ; tòa/phòng; lượt thuê; loại khoản; số lượng/đơn giá hoặc số tiền; chứng từ; trạng thái. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Hủy theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 15.2: Tạo Khoản phát sinh

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Kỳ; tòa/phòng; lượt thuê; loại phát sinh; cách tính; số lượng; đơn giá/số tiền; ghi chú; chứng từ; ngày nguồn. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 15.3: Chi tiết Khoản phát sinh

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Kỳ; tòa/phòng; lượt thuê; loại khoản; số lượng/đơn giá hoặc số tiền; chứng từ; trạng thái. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Khoản phát sinh nếu có quyền. |

### Màn hình 15.4: Chỉnh sửa Khoản phát sinh

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Kỳ; tòa/phòng; lượt thuê; loại phát sinh; cách tính; số lượng; đơn giá/số tiền; ghi chú; chứng từ; ngày nguồn. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 15.5: Xác nhận Hủy Khoản phát sinh

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Khoản phát sinh đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Hủy -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có lượt thuê và kỳ mục tiêu. |
| Các bước người dùng | Bước 1: Danh sách 15.1.<br>Bước 2: Tạo 15.2 -> Chi tiết 15.3.<br>Bước 3: Chỉnh sửa trước khi phát hành hóa đơn tại 15.4.<br>Bước 4: Hủy 15.5; nếu đã phát hành thì dùng điều chỉnh hóa đơn. |

---

# FR16 - Tạo hóa đơn hàng loạt theo tòa / kỳ

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Hóa đơn  
**Nguồn:** SRC-02; SRC-08 `HD theo tòa`, `PHÒNG MỚI THÁNG 9`, `PHÒNG MỚI THÁNG 10`; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin; Quản lý có thể chuẩn bị dữ liệu nếu được cấp quyền. |
| Batch | Tạo hóa đơn theo `Kỳ + Tòa` từ hợp đồng/lượt thuê hiệu lực, ContractService, chỉ số, phát sinh và nợ cũ; chặn trùng theo lượt thuê+kỳ+loại. |
| Tiền phòng theo kỳ TT (v1.9) | Dòng tiền phòng trên hóa đơn = `Giá phòng hiện tại × Kỳ TT` và ghi rõ khoảng tháng được trả; `Kỳ TT = 0` → không có dòng tiền phòng, hiển thị "Đã trả trước đến tháng …". `Tổng cần đóng = Tổng DV + Giá phòng × Kỳ TT + Cọc + Nợ cũ + Thu khác` (G1 `HĐ T8.26` ô `AV = AU + I×E + J + M + N`). `SOURCE_CONFIRMED`: 101S1 = 1.624.000 + 4.500.000 × 2 = 10.624.000; 101S5 = 4.714.000 + 5.000.000 × 3 = 19.714.000; 506S2 = 448.000 (chỉ dịch vụ). |
| Dịch vụ theo kỳ TT | Mặc định dịch vụ vẫn thu hàng tháng kể cả khi `Kỳ TT = 0`. Nguồn có ca thu dịch vụ theo kỳ ("2 tháng tiền nhà + dv", "thu dv khách 3 tháng/lần") → cờ `service_prepaid_with_rent` theo HĐ. <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION (C-27).</span> |
| Phòng mới trong kỳ | Với lượt thuê có event `NEW_ROOM` trong kỳ, hóa đơn tháng đầu phải chứa riêng: `Tiền cọc phòng mới`, `Tiền phòng tháng đầu`, các dịch vụ tháng đầu và khoản phát sinh. |
| Prorate tiền phòng | `Tiền phòng tháng đầu = Giá phòng tháng / Số ngày của tháng × Số ngày tính tiền`; số ngày tính từ `billing_start_date` đến cuối tháng, tính cả ngày bắt đầu. Ngày bắt đầu là ngày 1 → đủ giá tháng. `FIXTURE_CONFIRMED`: `PHÒNG MỚI THÁNG 7` ô `H6 = (3500000/31)*22` (vào 10/7); `PHÒNG MỚI THÁNG 9` ô `H8 = (3500000/30)*25` (vào 6/9). **Không dùng mẫu số cố định 30.** |
| Dịch vụ tháng đầu | METER tính theo chỉ số thực tế; MANUAL theo số nhập. FIXED (nước theo người, vệ sinh, mạng, thang máy, xe, máy giặt, dịch vụ khác): `Tổng DV cố định tháng đầu = SUM(thành tiền dịch vụ FIXED cả tháng) / Số ngày của tháng × Số ngày dịch vụ`; số ngày dịch vụ tính từ `service_start_date` (có thể khác ngày tính tiền phòng). `FIXTURE_CONFIRMED`: `PHÒNG MỚI THÁNG 7` dòng 501T27 `Tổng DV = (SUM(...)/31)*22`; `PHÒNG MỚI THÁNG 9` dòng 202T24 `(SUM(...)/30)*25`. Nguồn có dòng ngoại lệ thu đủ tháng hoặc miễn DV ("k tính dv tháng") → cho phép override theo dòng với lý do + người duyệt. |
| Snapshot | Khi tạo invoice, mọi dòng phải snapshot loại dòng, số lượng/chỉ số, đơn giá, thành tiền, nguồn rule và phiên bản hợp đồng; hóa đơn đã phát hành không thay đổi khi master data đổi. |
| Khách mới giữa tháng | `FIRST_MONTH_RENT = MONTHLY_RENT / DAYS_IN_MONTH × BILLABLE_DAYS`; `FIRST_MONTH_FIXED_SERVICE = FULL_MONTH_FIXED_SERVICE / DAYS_IN_MONTH × SERVICE_DAYS`. Cọc phòng là nghĩa vụ riêng, không trộn vào tiền phòng. `Tổng cần đóng = Cọc + Tiền phòng tháng đầu + Dịch vụ tháng đầu + Nợ cũ/Thu khác` (ví dụ 202T24: 3.500.000 + 2.916.666,67 + 483.333,33 = 6.900.000). |
| Tác động | Xác nhận batch sinh hóa đơn nháp cho từng phòng; chưa đồng nghĩa phát hành hoặc đã thu. |

## 2. Mô tả màn hình

### Màn hình 16.1: Tạo hóa đơn theo Tòa + Kỳ

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Tòa | Bộ lọc | Có | Phạm vi batch. |
| Phòng / Lượt thuê | Bảng | Có | Load toàn bộ lượt thuê hiệu lực và các `NEW_ROOM` trong kỳ. |
| Loại dòng tự động | Chỉ đọc | Có | Tiền phòng; cọc phòng mới nếu có; dịch vụ cố định; meter; nợ cũ; khoản phát sinh. |
| Ngày tính tiền / Số ngày | Ngày + Số | Tùy điều kiện | Hiển thị cho phòng mới để kiểm tra prorate tháng đầu. |
| Tiền phòng tháng đầu | Tiền tệ | Tùy điều kiện | Giá tháng / số ngày của tháng × số ngày tính tiền. |
| Dịch vụ tháng đầu | Tiền tệ | Tùy điều kiện | Tổng DV FIXED cả tháng / số ngày của tháng × số ngày dịch vụ + DV METER theo chỉ số; hiển thị nút override có lý do. |
| Kiểm tra | Nút | Có | Validate HĐ, giá, service price, chỉ số, phòng mới, trùng hóa đơn và trạng thái kỳ. |
| Preview | Nút chính | Có | Mở 16.2. |

### Màn hình 16.2: Preview batch hóa đơn

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tổng quan batch | Chỉ đọc | Có | Số phòng; phòng mới; tổng tiền phòng; tổng cọc mới; tổng dịch vụ; tổng nợ cũ; số lỗi/cảnh báo. |
| Chi tiết từng phòng | Bảng | Có | Các invoice line và công thức/snapshot nguồn. |
| Cảnh báo phòng mới | Cảnh báo | Tùy điều kiện | Thiếu ngày tính tiền, thiếu cọc, cọc đã chuyển loại, service rule chưa đủ hoặc số ngày bất thường. |
| Truy nguồn | Liên kết | Không | HĐ, FR13, FR14, FR15, FR11. |

### Màn hình 16.3: Xác nhận tạo batch

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tóm tắt | Chỉ đọc | Có | Tòa; kỳ; số invoice; tổng nghĩa vụ; số phòng mới. |
| Cảnh báo | Chỉ đọc | Tùy điều kiện | Lỗi blocking phải về 0 trước khi xác nhận. |
| Xác nhận | Nút chính | Có | Sinh invoice nháp + immutable line snapshot. |
| Hủy | Nút phụ | Không | Không tạo dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có HĐ/giá dịch vụ hiệu lực; phòng mới đã xác nhận nhận phòng; dữ liệu chỉ số/phát sinh của kỳ đủ theo rule. |
| Các bước người dùng | Bước 1: Chọn Kỳ + Tòa tại 16.1.<br>Bước 2: Hệ thống load phòng cũ + phòng mới và tính thử.<br>Bước 3: Với phòng mới, kiểm tra ngày tính tiền/cọc/tiền phòng prorate/dịch vụ tháng đầu.<br>Bước 4: Preview 16.2 → xử lý lỗi.<br>Bước 5: Xác nhận 16.3 → sinh hóa đơn nháp → FR17/18. |

---

# FR17 - Danh sách và chi tiết hóa đơn

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Hóa đơn  
**Nguồn:** SRC-08; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin; Quản lý xem/thao tác trong tòa được giao. |
| Quy tắc chức năng | Hóa đơn lưu lượt thuê, kỳ, các dòng snapshot, tổng phải thu, đã thu và công nợ; hóa đơn đã phát hành không sửa âm thầm. |
| Trạng thái thanh toán (v1.9) | Theo công thức cột `Tình trạng` SRC-08 và sheet `BÁO CÁO CHECK THU TIỀN`: `Chưa TT` (phải đóng > 0 và đã đóng = 0); `Thiếu` (0 < đã đóng < phải đóng); `Đủ` (đã đóng = phải đóng); `Thừa` (đã đóng > phải đóng — phần thừa giữ dạng chưa phân bổ FR21); `Trống` (phòng không có lượt thuê, không có hóa đơn). Trạng thái tính từ PaymentAllocation, không nhập tay. `Công nợ KH = Đã đóng − Cần đóng` (âm = còn nợ). |
| Màn kiểm tra thu tiền | Tương đương sheet `BÁO CÁO CHECK THU TIỀN`: mã phòng; quản lý; số tiền cần đóng; số tiền đã đóng; công nợ; tình trạng; ngày thanh toán; ghi chú. Lọc theo tòa/quản lý/tình trạng. |
| Tác động | Hóa đơn là nguồn cho gửi Zalo, thu tiền, công nợ, M5/M10/M15, hoàn cọc và báo cáo. |

## 2. Mô tả màn hình

### Màn hình 17.1: Danh sách và chi tiết hóa đơn - Danh sách / Nhập liệu

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Phạm vi / Bộ lọc | Bộ lọc | Không | Theo SRC-02: **quản lý, trưởng khu vực, tòa nhà, loại nhà (T/S/G), trạng thái, hạn**; thêm kỳ. |
| Dữ liệu đầu vào | Bảng / Biểu mẫu | Có | Theo SRC-02: **mã phòng + mã tòa; tên quản lý; cọc; giá niêm yết; giá cho thuê; số tháng thanh toán; tổng phải thu; tổng đã thu; công nợ; ngày thu; hạn; trạng thái**. Bổ sung: kỳ; template. `Giá niêm yết` lấy từ phòng FR10 (giá chuẩn); `Giá cho thuê` lấy từ HĐ FR12 (giá thực tế khách thuê); `Số tháng TT` = kỳ thanh toán của HĐ (cột `Kỳ TT` SRC-08). `Số tháng TT` = `Kỳ TT` của hóa đơn; khi `Kỳ TT = 0` hiển thị nhãn "Đã trả trước đến tháng …". |
| Kiểm tra | Nút | Tùy điều kiện | Kiểm tra quyền, dữ liệu bắt buộc, trùng lặp và trạng thái kỳ. |
| Thực hiện | Nút chính | Có | Thực hiện nghiệp vụ -> Chi tiết hóa đơn gồm metadata nội bộ, các dòng snapshot, tổng tiền, Payment và các thao tác Preview/PDF/Zalo.. Chỉ hóa đơn nháp được sửa trực tiếp; hóa đơn đã phát hành phải đi qua điều chỉnh/hủy có lý do. |

### Màn hình 17.2: Danh sách và chi tiết hóa đơn - Chi tiết / Kết quả

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu nguồn | Chỉ đọc | Có | Hiển thị kỳ, đối tượng, nguồn dữ liệu, người thao tác và các bản ghi liên quan. |
| Kết quả | Chỉ đọc / Bảng | Có | Chi tiết hóa đơn gồm metadata nội bộ, các dòng snapshot, tổng tiền, Payment và các thao tác Preview/PDF/Zalo. |
| Truy vết | Liên kết | Không | Nhấn -> mở chứng từ/bản ghi đã tạo ra kết quả. |
| Lịch sử | Dòng thời gian | Không | Hiển thị các lần thay đổi, điều chỉnh hoặc phiên bản. |

### Màn hình 17.3: Xác nhận Danh sách và chi tiết hóa đơn

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tóm tắt | Chỉ đọc | Có | Tóm tắt phạm vi, số bản ghi và tác động. |
| Cảnh báo | Chỉ đọc | Tùy điều kiện | Hiển thị lỗi/cảnh báo phải xử lý trước khi xác nhận. |
| Xác nhận | Nút chính | Có | Xác nhận -> lưu giao dịch/phiên bản/nhật ký. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có hóa đơn nháp hoặc hóa đơn đã phát hành. |
| Các bước người dùng | Bước 1: Mở danh sách 17.1.<br>Bước 2: Chọn hóa đơn -> 17.2.<br>Bước 3: Sửa nháp hoặc thao tác phát hành/điều chỉnh -> xác nhận 17.3. |

---

# FR18 - Mẫu hóa đơn, PDF và phát hành

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Hóa đơn  
**Nguồn:** SRC-08 `HĐ (VP)`, `HĐ (VP-HẰNG)`, `HĐ (TECH)`, `HĐ G1 (TECH)`; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin; Quản lý được xem/tải theo quyền. |
| Quy tắc chức năng | Bốn mẫu hóa đơn chỉ thay đổi bố cục/thông tin nhận tiền theo cấu hình; không thay đổi tổng hạch toán. Phát hành phải đóng băng PDF/snapshot. |
| Nội dung mẫu nguồn (v1.9) | Theo mẫu `HĐ (VP)` tháng 9/2026: tiêu đề "HÓA ĐƠN THÁNG mm/yyyy"; câu dẫn "tiền thuê phòng Tháng m và tiền dịch vụ Tháng m"; **Mã KH** dạng mã phòng + tòa + hậu tố (ví dụ `501S43A001`; quy tắc sinh hậu tố chưa có trong nguồn → hệ thống sinh mã KH duy nhất theo lượt thuê, định dạng cấu hình được); **Ngày chốt số liệu** (ví dụ 22/08/2026); **khoảng hạn thanh toán** "từ ngày 25 đến ngày 31 tháng 8"; **nội dung chuyển khoản = mã phòng + tòa** (ví dụ `501S43`); lưu ý chuyển khoản sai nội dung sẽ tính là chưa thanh toán; thông tin STK/ngân hàng/chủ TK theo mẫu; câu cảnh báo quá hạn (cắt dịch vụ). Ngày chốt, khoảng hạn và câu chữ cảnh báo là cấu hình theo mẫu/kỳ, không hard-code. |
| Phí phạt chậm | Mẫu nguồn in "chậm phí phạt 200K/ngày", nhưng không file nào có dòng thu tiền phạt. Mặc định: **chỉ in câu chữ trên hóa đơn, không tự cộng tiền phạt vào nghĩa vụ**; nếu thu phạt thì tạo khoản phát sinh FR15 có lý do. <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION (C-24).</span> |
| Tác động | PDF đã phát hành dùng gửi khách qua Zalo OA; thay đổi hợp đồng sau đó không làm đổi PDF cũ. |

## 2. Mô tả màn hình

### Màn hình 18.1: Xem trước hóa đơn

**Loại màn hình:** Trang chi tiết / Preview

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Mẫu hóa đơn | Danh sách chọn | Có | HĐ (VP), HĐ (VP-HẰNG), HĐ (TECH), HĐ G1 (TECH). |
| Thông tin đầu hóa đơn | Xem trước | Có | Tháng/năm; kỳ tiền phòng; kỳ dịch vụ; mã KH; phòng; ngày chốt số liệu. |
| Bảng dòng tiền | Bảng | Có | STT; Nội dung; Chỉ số mới; Chỉ số cũ; Số lượng; Hệ số; Đơn giá; Thành tiền; Ghi chú. |
| Thứ tự dòng nguồn | Quy tắc hiển thị | Có | Tiền phòng; cọc khách mới; điện; nước; vệ sinh; internet; thang máy; gửi xe; máy giặt/sấy; combo/khác; nợ cũ; điện chung. |
| Thông tin chuyển khoản | Xem trước | Có | Khoảng hạn thanh toán (từ ngày – đến ngày); nội dung CK = mã phòng + tòa; ngân hàng; STK; chủ tài khoản; lưu ý chuyển khoản đúng nội dung; câu phí phạt/cảnh báo quá hạn theo mẫu/tòa. |
| Tải PDF | Nút | Không | Tạo/tải PDF xem trước. |
| Phát hành | Nút chính | Tùy điều kiện | Mở popup xác nhận; khi xác nhận thì đóng băng snapshot/PDF. |

### Màn hình 18.2: Xác nhận phát hành hóa đơn

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Hóa đơn / Mẫu / Tổng tiền | Chỉ đọc | Có | Xác nhận đúng hóa đơn và mẫu khách sẽ nhận. |
| Cảnh báo | Chỉ đọc | Tùy điều kiện | Thiếu ngân hàng, dòng chưa đủ nguồn hoặc dữ liệu cần rà soát. |
| Phát hành | Nút chính | Có | Lưu phiên bản phát hành, PDF, người và thời gian phát hành. |
| Hủy | Nút phụ | Không | Quay lại Preview. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Hóa đơn ở trạng thái Nháp và đã qua preflight. |
| Các bước người dùng | Bước 1: Từ FR17 mở Preview 18.1.<br>Bước 2: Chọn mẫu và kiểm tra ngân hàng/STK/dòng tính.<br>Bước 3: Phát hành -> 18.2 -> Xác nhận -> lưu PDF/snapshot. |

---

# FR19 - Cấu hình Zalo OA và mẫu tin nhắn

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Zalo OA  
**Nguồn:** P3; phạm vi Web → Zalo OA đã chốt

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin hoặc người quản trị tích hợp. |
| Quy tắc chức năng | Cấu hình Zalo OA và mẫu tin nhắn được quản lý trên Web; thông tin bí mật bị hạn chế hiển thị và lịch sử gửi giữ phiên bản template. |
| Tác động | Cấu hình/template đang hoạt động cho phép FR20 gửi tin; thay đổi chỉ áp dụng cho lần gửi tương lai. |

## 2. Mô tả màn hình

### Màn hình 19.1: Danh sách Cấu hình / Mẫu Zalo OA

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Cấu hình / Mẫu Zalo OA theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Môi trường; mục đích; trạng thái |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Cấu hình / Mẫu Zalo OA nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Nhãn OA; môi trường; mã/tên template; mục đích; trạng thái; kết quả test gần nhất. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Ngừng hoạt động theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 19.2: Tạo Cấu hình / Mẫu Zalo OA

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Nhãn OA; thông tin xác thực/tham chiếu bí mật; môi trường; mã/tên template; mục đích; mapping tham số; trạng thái. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 19.3: Chi tiết Cấu hình / Mẫu Zalo OA

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Nhãn OA; môi trường; mã/tên template; mục đích; trạng thái; kết quả test gần nhất. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Cấu hình / Mẫu Zalo OA nếu có quyền. |

### Màn hình 19.4: Chỉnh sửa Cấu hình / Mẫu Zalo OA

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Nhãn OA; thông tin xác thực/tham chiếu bí mật; môi trường; mã/tên template; mục đích; mapping tham số; trạng thái. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 19.5: Xác nhận Ngừng hoạt động Cấu hình / Mẫu Zalo OA

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Cấu hình / Mẫu Zalo OA đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Ngừng hoạt động -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Admin có quyền tích hợp. |
| Các bước người dùng | Bước 1: Danh sách cấu hình 19.1.<br>Bước 2: Tạo 19.2 -> Chi tiết 19.3.<br>Bước 3: Chỉnh sửa 19.4.<br>Bước 4: Ngừng hoạt động 19.5. |

---

# FR20 - Gửi hóa đơn / nhắc thanh toán qua Zalo OA

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Zalo OA  
**Nguồn:** P3; FR17/18/19

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin; Quản lý trong phạm vi khách/tòa được giao. |
| Quy tắc chức năng | Mỗi lần gửi phải lưu người nhận, nguồn hóa đơn/công nợ, template, tham số, thời gian, trạng thái và lỗi; retry tạo lần gửi mới. |
| Tác động | Trạng thái gửi chỉ là lịch sử truyền thông, không làm hóa đơn thành đã thanh toán. |

## 2. Mô tả màn hình

### Màn hình 20.1: Gửi Zalo OA - Danh sách / Nhập liệu

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Phạm vi / Bộ lọc | Bộ lọc | Không | Kỳ, tòa, khu vực, người phụ trách và trạng thái phù hợp nghiệp vụ. |
| Dữ liệu đầu vào | Bảng / Biểu mẫu | Có | Danh sách hóa đơn/công nợ được chọn; khách nhận; trạng thái liên kết Zalo; template; tham số động; nội dung xem trước. |
| Kiểm tra | Nút | Tùy điều kiện | Kiểm tra quyền, dữ liệu bắt buộc, trùng lặp và trạng thái kỳ. |
| Thực hiện | Nút chính | Có | Thực hiện nghiệp vụ -> Lịch sử gửi gồm người nhận, hóa đơn/công nợ, template/phiên bản, thời gian, trạng thái, mã nhà cung cấp, lỗi và số lần thử.. Gửi lại khi lỗi phải tạo lần gửi mới và giữ nguyên log cũ. |

### Màn hình 20.2: Gửi Zalo OA - Chi tiết / Kết quả

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu nguồn | Chỉ đọc | Có | Hiển thị kỳ, đối tượng, nguồn dữ liệu, người thao tác và các bản ghi liên quan. |
| Kết quả | Chỉ đọc / Bảng | Có | Lịch sử gửi gồm người nhận, hóa đơn/công nợ, template/phiên bản, thời gian, trạng thái, mã nhà cung cấp, lỗi và số lần thử. |
| Truy vết | Liên kết | Không | Nhấn -> mở chứng từ/bản ghi đã tạo ra kết quả. |
| Lịch sử | Dòng thời gian | Không | Hiển thị các lần thay đổi, điều chỉnh hoặc phiên bản. |

### Màn hình 20.3: Xác nhận Gửi Zalo OA

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tóm tắt | Chỉ đọc | Có | Tóm tắt phạm vi, số bản ghi và tác động. |
| Cảnh báo | Chỉ đọc | Tùy điều kiện | Hiển thị lỗi/cảnh báo phải xử lý trước khi xác nhận. |
| Xác nhận | Nút chính | Có | Xác nhận -> lưu giao dịch/phiên bản/nhật ký. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có hóa đơn/công nợ và cấu hình OA/template đang hoạt động. |
| Các bước người dùng | Bước 1: Từ FR17/FR23 chọn Gửi Zalo -> 20.1.<br>Bước 2: Xem trước -> Xác nhận 20.3 -> tạo send log.<br>Bước 3: Mở lịch sử 20.2; bản ghi lỗi có thể Gửi lại theo quyền. |

---

# FR21 - Phiếu thu và phân bổ khoản thu

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Thu tiền  
**Nguồn:** SRC-08 `cập nhật thu tiền`, `PHÒNG MỚI THÁNG 9`; SRC-03; SRC-05; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Quản lý theo tòa nếu được quyền ghi nhận thu; Kế toán/Admin rà soát/điều chỉnh. |
| Phiếu thu | Mỗi lần nhận tiền là một Payment/Phiếu thu riêng có `payment_date`, `created_at`, người thực nhận, người ghi, phương thức, tham chiếu/chứng từ. Một hóa đơn có thể có nhiều Payment. |
| Phân bổ | Payment phải có các dòng allocation; tổng allocation không vượt Payment. Allocation có thể vào: cọc phòng mới, tiền phòng, từng dòng dịch vụ, nợ cũ/khác, quyết toán phá HĐ hoặc phần chưa phân bổ. |
| Trả nhiều tháng (v1.9) | Khoản thu cho hóa đơn `Kỳ TT = n > 1` phải tách allocation: `RENT` của tháng hiện tại + `PREPAID_RENT` cho n−1 tháng sau (mỗi tháng một dòng có `service_month`). Các tháng sau tiêu dùng `PREPAID_RENT` thay vì tạo công nợ. Phá HĐ giữa kỳ: phần `PREPAID_RENT` chưa dùng xử lý tại FR26 (C-27). |
| Phòng mới | Payment của khách mới không được chỉ lưu một con số tổng. Hệ thống phải biết phần nào thanh toán `CỌC`, `RENT_FIRST_MONTH`, `SERVICE`, `OTHER` để công nợ và báo cáo không nhầm nguồn. |
| M5/M10/M15 | Mốc thu lấy theo `payment_date` thực nhận, không lấy ngày nhập hệ thống. |
| Tác động | Allocation cập nhật đã thu/công nợ của đúng nghĩa vụ; không sửa số tiền invoice line. |

## 2. Mô tả màn hình

### Màn hình 21.1: Danh sách Phiếu thu

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Bộ lọc | Không | Kỳ; tòa; khách/phòng; quản lý/người thu; phương thức; trạng thái; loại allocation. |
| Bảng dữ liệu | Bảng | Có | Mã Payment; người nộp; tòa/phòng/lượt thuê; ngày thực nhận; người thu; số tiền; đã phân bổ; chưa phân bổ; trạng thái. |
| Thao tác | Menu | Không | Xem / Chỉnh sửa hợp lệ / Hủy-Đảo giao dịch. |

### Màn hình 21.2: Tạo Phiếu thu

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Người nộp / Phòng / Lượt thuê | Tra cứu | Có | Xác định đúng chủ thể nghĩa vụ. |
| Ngày thực nhận / Phương thức / Tham chiếu | Biểu mẫu | Có | Dùng cho mốc thu và truy vết. |
| Số tiền nhận | Tiền tệ | Có | Tổng Payment. |
| Nghĩa vụ chưa thu | Bảng | Có | Cọc, tiền phòng, service line, nợ cũ, phá HĐ và nghĩa vụ khác. |
| Số phân bổ | Bảng nhập liệu | Có | Nhập/chọn số tiền cho từng nghĩa vụ; hỗ trợ thu đủ hoặc một phần. |
| Chưa phân bổ / Thừa | Chỉ đọc | Có | Payment − tổng allocation. |
| Lưu | Nút chính | Có | Tạo Payment + PaymentAllocation, cập nhật công nợ. |

### Màn hình 21.3: Chi tiết Phiếu thu

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin Payment | Chỉ đọc | Có | Mã, ngày, người thu, phương thức, số tiền, chứng từ. |
| Allocation | Bảng | Có | Nghĩa vụ nguồn; loại; số phân bổ; invoice/settlement liên kết. |
| Tác động | Chỉ đọc | Có | Công nợ trước/sau; M5/M10/M15; nếu phá HĐ thì cập nhật `DT phá HĐ thu được`. |
| Lịch sử | Dòng thời gian | Không | Điều chỉnh/hủy/đảo giao dịch. |

### Màn hình 21.4: Chỉnh sửa / Điều chỉnh Phiếu thu

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu cho phép | Biểu mẫu | Tùy điều kiện | Chỉ khi kỳ chưa khóa và theo quyền; thay payment_date/allocation phải có lý do. |
| Lý do / Chứng từ | Văn bản + Tải lên | Có | Bắt buộc khi sửa giao dịch tài chính. |
| Lưu | Nút chính | Có | Recalculate allocation/debt và audit. |

### Màn hình 21.5: Xác nhận Hủy / Đảo giao dịch

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Payment | Chỉ đọc | Có | Giao dịch cần hủy/đảo. |
| Lý do | Văn bản | Có | Audit bắt buộc. |
| Xác nhận | Nút chính/nguy hiểm | Có | Đảo tác động allocation/công nợ/mốc thu, không xóa vật lý. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có nghĩa vụ phải thu/hóa đơn/quyết toán và người dùng có quyền ghi nhận thu. |
| Các bước người dùng | Bước 1: Từ hóa đơn/phòng mới/công nợ mở 21.2.<br>Bước 2: Nhập Payment và phân bổ theo từng nghĩa vụ.<br>Bước 3: Lưu → cập nhật công nợ và mốc thu.<br>Bước 4: Chi tiết 21.3 dùng để truy report; điều chỉnh/hủy theo 21.4/21.5 nếu cần. |

---

# FR22 - Cập nhật thu tiền hàng loạt theo tòa

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Thu tiền  
**Nguồn:** SRC-08 `cập nhật thu tiền`; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Quản lý theo tòa được giao; Kế toán/Admin. |
| Quy tắc chức năng | Thu hàng loạt chỉ áp dụng trong phạm vi Kỳ + Tòa. 'Thu đủ' tạo phiếu thu bằng số còn thiếu; thu một phần phải nhập số thực thu từng hóa đơn. |
| Tác động | Mỗi hóa đơn được tạo phiếu thu độc lập với ngày/actor để truy vết công nợ và hiệu suất. |

## 2. Mô tả màn hình

### Màn hình 22.1: Cập nhật thu tiền hàng loạt theo tòa - Danh sách / Nhập liệu

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Phạm vi / Bộ lọc | Bộ lọc | Không | Kỳ, tòa, khu vực, người phụ trách và trạng thái phù hợp nghiệp vụ. |
| Dữ liệu đầu vào | Bảng / Biểu mẫu | Có | Kỳ + Tòa; danh sách hóa đơn; phòng/khách; tổng phải thu; đã thu trước; còn thiếu; số nhập thêm; ngày thu; phương thức/tham chiếu. |
| Kiểm tra | Nút | Tùy điều kiện | Kiểm tra quyền, dữ liệu bắt buộc, trùng lặp và trạng thái kỳ. |
| Thực hiện | Nút chính | Có | Thực hiện nghiệp vụ -> Một Phiếu thu riêng cho từng hóa đơn được chọn và trạng thái Đủ/Thiếu/Thừa được tính lại.. Hỗ trợ hai chế độ: đánh dấu Thu đủ và nhập Số tiền thực thu. |

### Màn hình 22.2: Cập nhật thu tiền hàng loạt theo tòa - Chi tiết / Kết quả

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu nguồn | Chỉ đọc | Có | Hiển thị kỳ, đối tượng, nguồn dữ liệu, người thao tác và các bản ghi liên quan. |
| Kết quả | Chỉ đọc / Bảng | Có | Một Phiếu thu riêng cho từng hóa đơn được chọn và trạng thái Đủ/Thiếu/Thừa được tính lại. |
| Truy vết | Liên kết | Không | Nhấn -> mở chứng từ/bản ghi đã tạo ra kết quả. |
| Lịch sử | Dòng thời gian | Không | Hiển thị các lần thay đổi, điều chỉnh hoặc phiên bản. |

### Màn hình 22.3: Xác nhận Cập nhật thu tiền hàng loạt theo tòa

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tóm tắt | Chỉ đọc | Có | Tóm tắt phạm vi, số bản ghi và tác động. |
| Cảnh báo | Chỉ đọc | Tùy điều kiện | Hiển thị lỗi/cảnh báo phải xử lý trước khi xác nhận. |
| Xác nhận | Nút chính | Có | Xác nhận -> lưu giao dịch/phiên bản/nhật ký. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có hóa đơn đã phát hành trong tòa được phân quyền. |
| Các bước người dùng | Bước 1: Danh sách hóa đơn -> Thu hàng loạt 22.1.<br>Bước 2: Chọn Kỳ/Tòa, hóa đơn, chế độ và ngày thu -> Kiểm tra.<br>Bước 3: Xác nhận 22.3 -> tạo các Phiếu thu. |

---

# FR23 - Công nợ phải thu và theo dõi doanh thu phá HĐ

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Thu tiền  
**Nguồn:** SRC-02; SRC-08 `cập nhật thu tiền`; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin; Quản lý/Leader trong phạm vi được giao. |
| Công nợ | Công nợ = tổng nghĩa vụ phải thu − tổng PaymentAllocation hợp lệ; giữ theo đúng lượt thuê/nghĩa vụ/kỳ, không tự chuyển sang khách mới cùng phòng. |
| Phòng mới | Công nợ tháng đầu phải tách được cọc, tiền phòng prorate, dịch vụ và các khoản khác. |
| Phá HĐ | Sheet nguồn theo dõi riêng `DOANH THU PHÁ HĐ` và `DOANH THU PHÁ HĐ THU ĐƯỢC`; hệ thống phải lưu nghĩa vụ quyết toán phá HĐ riêng và tổng PaymentAllocation vào nghĩa vụ đó. |
| Đúng hạn / quá hạn | `ON_TIME` khi tổng PaymentAllocation hợp lệ của nghĩa vụ đạt **100% số phải trả** trước hoặc tại `due_date`. `OVERDUE` khi qua `due_date` và `outstanding_amount > 0`. Thanh toán một phần trước hạn nhưng còn thiếu sau hạn vẫn là quá hạn. |
| Due date | Không hard-code ngày 30/31 toàn hệ thống; dùng `due_date` snapshot của Invoice/Obligation theo HĐ/thông báo của kỳ. |
| Định danh | Theo SRC-02 mục Công nợ: **bỏ tên khách, dùng mã phòng + mã tòa** trên danh sách; tên khách chỉ xem ở chi tiết theo quyền. Các cột/bộ lọc còn lại giữ như màn hóa đơn. |
| Tác động | Dữ liệu dùng cho `Tổng doanh thu phải thu`, `Thực thu`, `DT phá HĐ`, `DT phá HĐ thu được`, tỷ lệ thu, Zalo nhắc nợ và M5/M10/M15. |

## 2. Mô tả màn hình

### Màn hình 23.1: Danh sách công nợ

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Bộ lọc | Không | Kỳ; tòa; loại nhà T/S/G; quản lý/leader; trưởng khu vực; mã phòng; loại nghĩa vụ; trạng thái; hạn; phá HĐ. |
| Bảng dữ liệu | Bảng | Có | Mã phòng + mã tòa (không hiển thị tên khách); quản lý; phải thu; đã thu; còn nợ/dư; hạn; payment gần nhất; số ngày quá hạn; cọc; rent; service; DT phá HĐ; DT phá HĐ thu được. |
| Tổng hợp theo quản lý | KPI/Bảng | Không | Tổng phải thu; thực thu; phần sau phá HĐ; tỷ lệ; DT phá HĐ; thực thu phá HĐ. |
| Tổng hợp theo tòa | KPI/Bảng | Không | Mapping tương thích sheet `CẬP NHẬT THU TIỀN THEO TOÀ NHÀ`. |

### Màn hình 23.2: Chi tiết công nợ / nghĩa vụ

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Nghĩa vụ nguồn | Bảng | Có | Invoice line / cọc / settlement phá HĐ / khoản khác. |
| PaymentAllocation | Bảng | Có | Các lần thu và số tiền phân bổ. |
| Số dư hiện tại | Chỉ đọc | Có | Phải thu − đã phân bổ. |
| Lịch sử nhắc / Zalo | Dòng thời gian | Không | Các lần nhắc và trạng thái gửi. |

### Màn hình 23.3: Drill-down thu tiền theo tòa / quản lý

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Chỉ tiêu | Bảng | Có | Doanh thu phải thu; thực thu; DT phá HĐ; DT phá HĐ thu được; tỷ lệ thu; tỷ lệ phá HĐ; M5/M10/M15. |
| Truy nguồn | Liên kết | Có | Mở Invoice/Payment/Settlement tạo ra số liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có nghĩa vụ phải thu và/hoặc Payment. |
| Các bước người dùng | Bước 1: Mở 23.1 và lọc kỳ/tòa/quản lý.<br>Bước 2: Mở nghĩa vụ 23.2 để xem invoice/settlement và PaymentAllocation.<br>Bước 3: Mở 23.3 để đối chiếu chỉ tiêu tương đương sheet cập nhật thu tiền.<br>Bước 4: Từ công nợ có thể ghi Payment hoặc gửi nhắc theo quyền. |

---

# FR24 - Các mốc thu tiền M5 / M10 / M15 và điều chỉnh doanh thu tính hiệu suất

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Hiệu suất  
**Nguồn:** SRC-03; SRC-05 `CÁCH TÍNH LƯƠNG PHÒNG VẬN HÀNH`; FR21; FR23; FR31; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Lương/Admin; Quản lý xem phạm vi của mình theo FR02/FR34. |
| Source transaction | `R5/R10/R15` phải được tổng hợp từ Payment/PaymentAllocation theo `payment_date`; không nhập tay một số tổng không có trace. |
| Không copy công thức lỗi Excel | File legacy có thể có `#REF!`, blank hoặc công thức sai; Web phải tính lại từ source transaction theo rule đã duyệt, không cố sao chép lỗi Excel. |
| TH2 — nhà bình thường | Khi **không có cọc mới cần loại khỏi hiệu suất và không có khoản kỳ 3 tháng cần điều chỉnh**, dùng: `Adjusted_DTPT = Raw_DTPT`; `Adjusted_R5 = Raw_R5`; `M1 = Adjusted_R5 × 100%`; `M2 = (R10 − R5) × 90%`; `M3 = (R15 − R10) × 70%`; `A = M1 + M2 + M3`. |
| TH1 — có cọc mới / kỳ 3 tháng | Theo tài liệu nguồn, `DTPT` và `M1` phải loại các khoản không được tính vào hiệu suất kỳ hiện tại như **cọc mới** và phần **tiền nhà thu trước cho kỳ 3 tháng**, đồng thời cộng lại phần điều chỉnh tháng trước khi nguồn yêu cầu. Hệ thống phải lưu chi tiết adjustment, không chỉ lưu số sau điều chỉnh. **Nguồn dữ liệu (v1.9):** `cọc mới` = PaymentAllocation loại `CỌC` của lượt thuê `NEW_ROOM`; `tiền nhà thu trước` = PaymentAllocation `PREPAID_RENT` thu trong kỳ (hóa đơn `Kỳ TT = n` → n−1 tháng); `cộng 1 tháng nếu đã đóng trước` = `PREPAID_RENT` được tiêu dùng vào tháng hiện tại (hóa đơn `Kỳ TT = 0`). Adjustment sinh tự động từ allocation, mỗi dòng có source link. |
| Adjustment detail | Mỗi khoản điều chỉnh có tối thiểu `adjustment_type`, `source_entity/id`, `amount`, `sign`, `reason`, `period`, `rule_version`; không cho gõ một số "điều chỉnh" không truy nguồn khi đã có source transaction. |
| M1 | `M1 = Adjusted_R5 × 100%`. `Adjusted_R5` có thể bằng `Raw_R5` ở TH2 hoặc đã loại/cộng các khoản theo TH1. |
| M2 | `M2 = (Raw_R10 − Raw_R5) × 90%` theo tài liệu nguồn; nếu business xác nhận adjustment cũng phải tác động tới R10 thì tạo formula version mới, không sửa ngầm. |
| M3 | `M3 = (Raw_R15 − Raw_R10) × 70%`. |
| A | `A = M1 + M2 + M3`. |
| Rule version | Công thức/adjustment phải có `performance_rule_version`; snapshot kỳ đã khóa không thay đổi khi policy sau này đổi. |
| Source confirmed | TH1/TH2 được xác nhận theo tài liệu nguồn: nếu tháng đó đến kỳ 3 tháng thì trừ `2 tháng tiền nhà`; nếu tiền nhà đã đóng ở tháng trước thì cộng lại `1 tháng tiền nhà` theo hướng dẫn nguồn. Adjustment vẫn phải lưu source/id/amount/reason để audit. |
| Tác động | Snapshot FR24 là đầu vào FR25/FR35; sai adjustment sẽ làm sai hiệu suất, lương và chi phí báo cáo. |

### Công thức nguồn — không được rút gọn mất TH1

```text
Raw_DTPT  = Tổng doanh thu phải thu từ nghĩa vụ nguồn
Raw_R5    = Tổng thực thu đến mốc 5
Raw_R10   = Tổng thực thu đến mốc 10
Raw_R15   = Tổng thực thu đến mốc 15

Adjusted_DTPT
= Raw_DTPT
- các khoản cọc mới phải loại
- phần tiền nhà thu trước/kỳ 3 tháng phải loại theo policy
+ adjustment kỳ trước được xác nhận (nếu có)

Adjusted_R5
= Raw_R5
- các khoản cọc mới phải loại
- phần tiền nhà thu trước/kỳ 3 tháng phải loại theo policy
+ adjustment kỳ trước được xác nhận (nếu có)

M1 = Adjusted_R5
M2 = (Raw_R10 - Raw_R5) × 90%
M3 = (Raw_R15 - Raw_R10) × 70%
A  = M1 + M2 + M3
```

> Lưu ý: nguồn mô tả TH1 bằng nghiệp vụ; các case chi tiết chưa có đủ fixture phải để `NEED_BUSINESS_CONFIRMATION`, không tự mở rộng công thức.

## 2. Mô tả màn hình

### Màn hình 24.1: Các mốc thu tiền M5 / M10 / M15

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Scope | Bộ lọc | Có | Kỳ, tòa, quản lý/leader trong data scope. |
| Raw DT phải thu | Tiền tệ | Có | Tổng nghĩa vụ nguồn trước điều chỉnh. |
| Raw R5 / R10 / R15 | Tiền tệ | Có | Tổng PaymentAllocation theo payment_date. |
| Adjustment DTPT / R5 | Tiền tệ + drill | Tùy điều kiện | Tổng các adjustment TH1; click xem 24.2. |
| Adjusted DTPT / R5 | Tiền tệ | Có | Kết quả sau adjustment. |
| M1 / M2 / M3 | Tiền tệ | Có | Kết quả công thức có version. |
| A | Tiền tệ | Có | `M1 + M2 + M3`. |
| Formula status | Badge | Có | `SOURCE_CONFIRMED` cho M1/M2/M3/A; chỉ edge ngoài tài liệu nguồn mới dùng `NEED_BUSINESS_CONFIRMATION`. |
| Rule version | Chỉ đọc | Có | Phiên bản công thức. |

### Màn hình 24.2: Chi tiết Adjustment & Source Trace

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Raw source | Bảng | Có | Payment, Invoice/Obligation, Deal/Deposit tạo Raw_DTPT/R5/R10/R15. |
| Adjustment | Bảng | Tùy điều kiện | Cọc mới; kỳ 3 tháng; adjustment kỳ trước; amount/sign/reason. |
| Source link | Liên kết | Có | Drill tới transaction/event nguồn. |
| Formula trace | Cây công thức | Có | Raw → Adjusted → M1/M2/M3 → A. |
| Rule version | Chỉ đọc | Có | Version đã áp dụng. |

### Màn hình 24.3: Rà soát / Khóa Snapshot M5-M10-M15

**Loại màn hình:** Popup / Workflow

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Scope | Chỉ đọc | Có | Snapshot đang khóa. |
| Source coverage | Chỉ đọc | Có | Số Payment/Obligation/Adjustment đã map. |
| OPEN cases | Danh sách | Tùy điều kiện | TH1 chưa đủ definition phải hiển thị. |
| Xác nhận | Nút chính | Theo quyền | Khóa snapshot + rule version. |
| Reopen | Nút đặc biệt | Theo quyền | Chỉ qua audit/reason. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có Payment/PaymentAllocation và nghĩa vụ nguồn trong kỳ; Assignment theo FR34. |
| Các bước người dùng | Bước 1: Chọn kỳ/scope tại 24.1.<br>Bước 2: Hệ thống tạo Raw_DTPT/R5/R10/R15 từ source transaction.<br>Bước 3: Nếu TH1, tạo adjustment line có source tại 24.2.<br>Bước 4: Tính M1/M2/M3/A theo rule version.<br>Bước 5: Rà soát source coverage/OPEN case và khóa 24.3.<br>Bước 6: FR25 chỉ dùng snapshot đã rà soát. |

---

# FR25 - Hiệu suất thu tiền của quản lý

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Hiệu suất  
**Nguồn:** SRC-03; SRC-05 `CÁCH TÍNH LƯƠNG PHÒNG VẬN HÀNH`; FR24; FR21; FR34; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Nhân sự lương/Kế toán/Admin; Quản lý chỉ xem hiệu suất trong phạm vi của mình. |
| Input bắt buộc | Assignment Snapshot; số phòng; DT niêm yết; `Adjusted_DTPT`; A; dịch vụ phải thu; doanh thu thu thêm đủ điều kiện. |
| A | `A = M1 + M2 + M3` từ FR24 snapshot. |
| B | `B = SERVICE_RECEIVABLE / Adjusted_DTPT`. Nếu mẫu số = 0 phải dùng status/handling rule, không tự chia 0. |
| C | `C = EXTRA_REVENUE` — **doanh thu thu thêm**, không phải kết quả cuối. Theo tài liệu nguồn, C gồm tiền phòng của các phòng phát sinh trong tháng nếu đã thu đủ và các khoản khách bỏ cọc đủ điều kiện. Mỗi khoản C phải trace về source transaction/event. |
| Doanh thu tiền phòng thu được | `COLLECTED_RENT_REVENUE = A - (A × B) + C`. |
| Hiệu suất | `PERFORMANCE_RATE = COLLECTED_RENT_REVENUE / LISTED_REVENUE × 100%`. |
| DT niêm yết (v1.9) | `LISTED_REVENUE = Σ Giá niêm yết (FR10) của **tất cả phòng thuộc tòa trong phạm vi quản lý** tại ngày chốt kỳ, kể cả phòng trống/đang chờ`; `Số phòng` = số phòng đó. `FIXTURE_CONFIRMED`: tổng cột `Giá Niêm yết` sheet `NHÀ T` khớp chính xác `DT NIÊM YẾT` và số phòng trên bảng lương tháng 8 cho 5/5 tòa kiểm tra (T3: 22 phòng, 103.000.000; T10: 8 phòng, 32.800.000; T20: 17 phòng, 42.000.000; T22: 9 phòng, 31.500.000; T24: 10 phòng, 36.200.000). Không dùng giá cho thuê thực tế hay `Giá QL` làm mẫu số. Giá niêm yết phải có lịch sử hiệu lực để kỳ cũ tính đúng. |
| Mức lương/phòng | Dùng `PERFORMANCE_RATE` + thâm niên theo bảng tham chiếu trong tài liệu nguồn và `salary_policy_version`. Các khoảng nguồn: 95–100; 90–95; 85–90; 80–85; 75–80; 70–75; dưới 70, tách `thâm niên dưới 1 năm` và `trên 1 năm`. |
| Thu thêm C | Không được nhập một số tổng không nguồn. Các line C phải phân loại tối thiểu `NEW_ROOM_RENT_COLLECTED`, `FORFEITED_DEPOSIT_ELIGIBLE`, `OTHER_APPROVED` và có source link. |
| Phân công | Hiệu suất theo quản lý/tòa dùng Assignment Snapshot FR34 tại kỳ, không lấy manager hiện tại để tính kỳ cũ. |
| Snapshot | Kết quả phải lưu input snapshot + formula version + salary policy version; kỳ lock không recalculation theo master mới. |
| Policy status | Bảng lương/phòng theo hiệu suất và hai nhóm thâm niên: `SOURCE_CONFIRMED`. Quy tắc chọn mức trong khoảng bậc và HS > 100 không chặn trần: `FIXTURE_CONFIRMED` (xem mục "Quy tắc chọn mức trong khoảng bậc"). Còn OPEN: HS < 70%, đúng ngày tròn 1 năm. |
| HS thực tế / tạm tính | Màn 25.1 hiển thị cả `HS thực tế` (snapshot đã khóa) và `HS tạm tính` (tính tới thời điểm xem) theo SRC-15. |
| Tác động | FR25 là đầu vào FR35; mọi số phải drill được về FR24, Invoice, Payment, Deal/Event và Assignment. |

### Công thức chuẩn từ nguồn

```text
A = M1 + M2 + M3

B = Dịch vụ phải thu / DT phải thu đã điều chỉnh

C = Doanh thu thu thêm đủ điều kiện

DT tiền phòng thu được
= A - (A × B) + C

Hiệu suất
= DT tiền phòng thu được / DT niêm yết × 100
```


### Bảng tham chiếu mức lương/phòng từ tài liệu nguồn

| Hiệu suất | Thâm niên dưới 1 năm | Thâm niên trên 1 năm |
| --- | ---: | ---: |
| 95 ≤ HS ≤ 100 | 110.000 – 120.000 | 120.000 – 130.000 |
| 90 ≤ HS < 95 | 100.000 – 109.000 | 110.000 – 119.000 |
| 85 ≤ HS < 90 | 90.000 – 99.000 | 100.000 – 109.000 |
| 80 ≤ HS < 85 | 80.000 – 89.000 | 85.000 – 94.000 |
| 75 ≤ HS < 80 | 70.000 – 79.000 | 75.000 – 84.000 |
| 70 ≤ HS < 75 | 60.000 – 69.000 | 65.000 – 74.000 |
| HS < 70 | Phụ cấp 10% | Phụ cấp 10% |

Ví dụ nguồn: HS = 91%, thâm niên trên 1 năm → `91 × 110.000 / 90 = 111.222`.

### Quy tắc chọn mức trong khoảng bậc (v1.9 — `FIXTURE_CONFIRMED` theo `bảng lương tháng 8.xlsx`)

```text
Với bậc [HS_min, HS_max) có khoảng lương [L_low, L_high] theo nhóm thâm niên:
  Nếu HS_min ≤ HS < HS_min + 2,5  (nửa dưới) → Mức lương/phòng = HS × L_low  / HS_min
  Nếu HS_min + 2,5 ≤ HS < HS_max  (nửa trên) → Mức lương/phòng = HS × L_high / HS_max
  Nếu HS ≥ 100                                → Mức lương/phòng = HS × L_high(bậc 95–100) / 100, KHÔNG chặn trần
Lương tòa = Mức lương/phòng × Số phòng
```

| Bằng chứng (sheet `THÁNG 8`) | HS | Mức lương/phòng | Quy tắc |
| --- | ---: | ---: | --- |
| T10 | 92,14 | 112.610,51 | 92,14 × 110.000 / 90 (nửa dưới, >1 năm) |
| T3 | 94,27 | 118.087,52 | 94,27 × 119.000 / 95 (nửa trên, >1 năm) |
| T5 | 75,74 | 75.744,09 | 75,74 × 75.000 / 75 (nửa dưới, >1 năm) |
| S9 | 100,08 | 130.107,67 | 100,08 × 130.000 / 100 (không chặn trần) |

- Kiểm tra trên 99 dòng tòa: **92 dòng khớp** quy tắc nửa dưới/nửa trên; 5 dòng HS ≥ 100 khớp quy tắc không chặn trần; **1 ngoại lệ** S39 (HS 97,26 lấy 130.000/100 thay vì 120.000/95) → hệ thống cho phép override có lý do + người duyệt, không đổi quy tắc chung.
- **Mâu thuẫn trong SRC-05:** văn bản ghi `Mức lương/phòng = HS × Lương theo HS / 100` nhưng ví dụ lại chia 90 (cận dưới của bậc). Số liệu bảng lương thực tế khớp quy tắc ở trên (chia cận bậc tương ứng), SRS dùng quy tắc này. <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION để chốt văn bản nguồn.</span>
- Chưa có nguồn: HS < 70% "phụ cấp 10%" là 10% của khoản nào; mốc tính "trên 1 năm" (đầu hay cuối kỳ lương) → giữ OPEN, cho nhập tay có duyệt.

### HS thực tế và HS tạm tính (SRC-02 sheet `BÁO CÁO`; SRC-15)

| Chỉ số | Định nghĩa nguồn | Thời điểm |
| --- | --- | --- |
| `PERFORMANCE_ACTUAL` (HS thực tế) | `(Tổng doanh thu tiền nhà thu được trong 3 mốc + khoản bỏ cọc) / Giá niêm yết` — tương đương `COLLECTED_RENT_REVENUE / LISTED_REVENUE` ở trên sau khi khóa snapshot M15. | Sau khi đã thu xong (khóa FR24/FR25). |
| `PERFORMANCE_PROVISIONAL` (HS tạm tính) | `(Doanh thu tiền nhà + DT bỏ cọc tại thời điểm tính) / Giá niêm yết` — dùng Payment tới ngày xem, chưa khóa. | Bất kỳ thời điểm trong kỳ; luôn gắn nhãn "Tạm tính". |

### Điều kiện nguồn của C

```text
C
├── Tiền phòng phát sinh trong tháng đã thu đủ
└── Khoản khách bỏ cọc đủ điều kiện theo policy
```

Không lấy toàn bộ Payment, toàn bộ cọc hoặc toàn bộ doanh thu khác vào C.

## 2. Mô tả màn hình

### Màn hình 25.1: Hiệu suất quản lý theo kỳ

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Tòa / Quản lý | Filter | Có | Trong Data Scope. |
| Số phòng | Số | Có | Assignment Snapshot. |
| DT niêm yết | Tiền tệ + drill | Có | Denominator hiệu suất = Σ giá niêm yết mọi phòng của tòa (kể cả phòng trống); click xem danh sách phòng + giá. |
| Adjusted DTPT | Tiền tệ | Có | Từ FR24. |
| A | Tiền tệ | Có | Tổng sau 3 mốc. |
| Service Receivable | Tiền tệ | Có | Dịch vụ phải thu cùng phạm vi/kỳ. |
| B | Phần trăm | Có | `Service Receivable / Adjusted DTPT`. |
| C | Tiền tệ + drill | Có | Doanh thu thu thêm đủ điều kiện. |
| DT tiền phòng thu được | Tiền tệ | Có | `A - A×B + C`. |
| Hiệu suất | Phần trăm | Có | `DT tiền phòng thu được / DT niêm yết`. Hiển thị nhãn `Thực tế` (snapshot khóa) hoặc `Tạm tính`. |
| Salary band preview | Chỉ đọc | Tùy điều kiện | Policy version, thâm niên, bậc, nửa dưới/nửa trên và mức lương/phòng áp dụng. |
| Formula status | Badge | Có | SOURCE_CONFIRMED / NEED_BUSINESS_CONFIRMATION. |

### Màn hình 25.2: Chi tiết Formula & Source

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| FR24 snapshot | Liên kết | Có | M1/M2/M3/A + adjustment. |
| Service source | Bảng | Có | Invoice/obligation service tạo B. |
| Extra revenue C | Bảng | Có | Loại, amount, source event/payment, eligibility reason. |
| Formula trace | Cây | Có | A/B/C → collected rent → performance. |
| Assignment | Liên kết | Có | Manager/building snapshot tại kỳ. |
| Policy version | Chỉ đọc | Có | Formula + salary band version. |

### Màn hình 25.3: Xác nhận Hiệu suất

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Scope | Chỉ đọc | Có | Kỳ/quản lý/tòa. |
| Source coverage | Chỉ đọc | Có | Tỷ lệ/record đã trace. |
| OPEN policy | Danh sách | Tùy điều kiện | Band/rounding chưa được duyệt. |
| Xác nhận | Nút chính | Có | Lưu/khóa Performance Snapshot. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | FR24 snapshot đã được rà soát; có service receivable, listed revenue và Assignment. |
| Các bước người dùng | Bước 1: Chọn kỳ/quản lý/tòa tại 25.1.<br>Bước 2: Hệ thống tính B từ service/Adjusted_DTPT.<br>Bước 3: Tổng hợp C từ các source line đủ điều kiện.<br>Bước 4: Tính DT tiền phòng thu được và Hiệu suất.<br>Bước 5: 25.2 drill A/B/C/Assignment.<br>Bước 6: 25.3 xác nhận snapshot; FR35 dùng snapshot này. |

---

# FR26 - Quyết toán phá HĐ và hoàn cọc

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Tài chính  
**Nguồn:** SRC-02; SRC-08 `HOÀN CỌC`, `HĐ (HOÀN CỌC)`, `cập nhật thu tiền`; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin; Vận hành chuẩn bị dữ liệu nguồn theo quyền. |
| Hai nghiệp vụ | `Quyết toán phá HĐ` và `Hoàn cọc` liên quan nhưng không đồng nhất. Phá HĐ có thể phát sinh nghĩa vụ phải thu; hoàn cọc là phép tính số tiền cọc phải trả lại sau các khoản khấu trừ. |
| DT phá HĐ | Khi kết thúc sớm, hệ thống tạo Termination Settlement gồm các charge được xác nhận theo HĐ/nguồn. Tổng nghĩa vụ settlement là nguồn `DT phá HĐ`; PaymentAllocation vào settlement là nguồn `DT phá HĐ thu được`. |
| Hoàn cọc | Phiếu hoàn cọc phải tách cọc và từng khoản khấu trừ: tiền phòng, điện, nước, vệ sinh, internet, thang máy, gửi xe, giặt, khấu hao, sửa chữa, vệ sinh sâu, sơn, khác. |
| Tiền thực tế | Xác nhận phép tính và giao dịch chi hoàn thực tế là hai sự kiện khác nhau; số hoàn tính toán không đồng nghĩa đã chi. |
| Phá HĐ theo nguồn | `FIXTURE_CONFIRMED` theo sheet `DS phòng phá hđ` (20 phòng): (1) khách phá HĐ/bỏ trốn **không được hoàn cọc** — không phòng nào trong danh sách xuất hiện ở sheet `HOÀN CỌC`; cọc giữ lại ghi nhận theo FR31/FR38; (2) `Tổng phải thu` phá HĐ là **tiền điện phát sinh** (20/20 khoản là bội số đơn giá điện 4.000; tổng 16.048.000, đã thu 3.662.000). Các khoản khác (nước, dịch vụ, tiền phòng còn thiếu, bồi thường) chỉ tạo khi được xác nhận theo HĐ/từng ca. Danh sách phá HĐ lưu: mã phòng, quản lý, ngày bắt đầu ở, số tháng ở, **lý do phá HĐ**, SĐT, tổng phải thu, tổng đã thu. |
| Khấu hao khi hoàn cọc | Dòng `KHẤU HAO` mặc định **200.000/phòng** (sheet `HOÀN CỌC`: 144 dòng 200.000; 5 dòng không tính; 4 dòng 300.000–600.000) → cấu hình mặc định 200.000, cho sửa có lý do. Sửa chữa/vệ sinh/sơn/khác theo chi phí thực tế có chứng từ (FR46). |
| Danh sách hoàn cọc (SRC-02) | Cột: mã phòng + tòa; số tiền hoàn cọc; tiền cọc; chi phí khấu hao; chi phí sửa chữa; chi phí vệ sinh; chi phí khác. Lọc theo thời gian, tòa, khu vực, NV vận hành, trưởng khu vực. |
| Tác động | Settlement chưa thu còn lại đi vào FR23; Payment đi FR21; giao dịch hoàn thực tế đi báo cáo theo ngày/period rule đã duyệt. |

## 2. Mô tả màn hình

### Màn hình 26.1: Danh sách quyết toán / hoàn cọc

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Bộ lọc | Không | Thời gian/kỳ; tòa; khu vực; NV vận hành; trưởng khu vực; mã phòng; loại kết thúc; trạng thái settlement/refund. |
| Bảng | Bảng | Có | Mã phòng + tòa; tiền cọc; khấu hao; sửa chữa; vệ sinh; khác; tổng khấu trừ; số hoàn tính; số thực chi; trạng thái. Với phá HĐ: lý do; cọc giữ; DT phá HĐ; đã thu phá HĐ; công nợ. |
| Tạo/Rà soát | Nút | Không | Mở 26.2 hoặc 26.5 tùy loại kết thúc. |

### Màn hình 26.2: Chi tiết tính hoàn cọc

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tiền cọc | Tiền tệ | Có | Số cọc đang giữ. |
| Các khoản khấu trừ | Bảng | Có | Tiền phòng; điện; nước; vệ sinh; internet; thang máy; gửi xe; máy giặt; khấu hao; sửa chữa; vệ sinh sâu; sơn; khác; chứng từ. |
| Kết quả tính | Chỉ đọc | Có | Tổng khấu trừ và số hoàn. |
| Xác nhận phép tính | Nút | Có | Đóng băng phiên bản tính; chưa đánh dấu đã chi. |

### Màn hình 26.3: Chỉnh sửa phiếu hoàn nháp

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dòng khấu trừ | Bảng nhập liệu | Có/Tùy điều kiện | Số lượng; đơn giá; thành tiền; lý do; chứng từ. |
| Lưu nháp | Nút | Có | Tính lại kết quả. |

### Màn hình 26.4: Ghi nhận chi hoàn thực tế

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Số tính hoàn | Chỉ đọc | Có | Số tham chiếu từ phiếu đã xác nhận. |
| Số thực chi | Tiền tệ | Có | Số tiền thực tế chi/chuyển. |
| Ngày / Phương thức / Tham chiếu | Biểu mẫu | Có | Dữ liệu giao dịch thực tế. |
| Xác nhận | Nút chính | Có | Tạo giao dịch chi hoàn và cập nhật trạng thái. |

### Màn hình 26.5: Quyết toán phá HĐ

**Loại màn hình:** Trang chi tiết / Biểu mẫu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| HĐ / Lượt thuê / Ngày phá HĐ | Chỉ đọc | Có | Contract Event nguồn. |
| Các khoản phải thu | Bảng nhập liệu | Có | Mặc định theo nguồn: **tiền điện phát sinh tới ngày trả phòng**; cọc chuyển sang "cọc giữ lại", không hoàn. Tùy chọn có lý do: tiền phòng còn thiếu, nước/dịch vụ, khoản do phá HĐ theo HĐ, sửa chữa/khác có chứng từ. Không tự suy diễn mức phạt nếu nguồn/HĐ chưa xác nhận. |
| Lý do phá HĐ | Danh sách + Văn bản | Có | Ví dụ nguồn: về quê, chuyển chỗ làm, bỏ trốn, không đủ tài chính, báo tăng giá không ở... |
| Tổng DT phá HĐ | Tiền tệ | Có | Tổng nghĩa vụ settlement đã xác nhận. |
| Đã thu phá HĐ | Tiền tệ | Có | Tổng PaymentAllocation vào settlement. |
| Còn nợ | Tiền tệ | Có | DT phá HĐ − đã thu phá HĐ. |
| Liên kết hoàn cọc | Liên kết | Không | Phần khấu trừ cọc/hoàn cọc liên quan nhưng giữ lịch sử riêng. |
| Xác nhận | Nút chính | Có | Tạo/khóa settlement; số còn nợ sang FR23. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Lượt thuê đang kết thúc; có Contract Event và số cọc đang giữ nếu có. |
| Các bước người dùng | Bước 1: Nếu phá HĐ → lập 26.5 và xác nhận nghĩa vụ.<br>Bước 2: Ghi tiền khách thanh toán tại FR21; FR23 tự cập nhật `DT phá HĐ thu được` và công nợ.<br>Bước 3: Lập/rá soát hoàn cọc 26.2/26.3.<br>Bước 4: Khi thực chi hoàn → 26.4. |

---

# FR27 - Quản lý chi phí và chi phí dịch vụ đầu vào

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Tài chính  
**Nguồn:** SRC-02; SRC-04 `BÁO CÁO TỔNG THÁNG 8`; SRC-06; SRC-07 `G1`; SRC-09; SRC-11; SRC-12; SRC-13; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin; bộ phận khác nhập theo quyền/phạm vi tòa. |
| Một nguồn chi | Mỗi khoản chi/chứng từ chỉ có một Expense nguồn. Chi phí chung dùng FR28 Allocation; không nhân bản Expense theo tòa. |
| Date basis | Tách `document/business_date`, `accounting_period`, `payment_date`, `created_at`; P&L lấy theo kỳ hạch toán đã xác nhận. |
| Chi phí dịch vụ đầu vào | Tách Điện, Nước, Mạng, Rác, Môi trường, Bảo trì thang máy. Điện/Nước/Mạng ưu tiên liên kết Supplier Bill FR09; không nhập trùng cùng chứng từ ở FR09 và FR27. |
| Mapping báo cáo | Expense Category có `report_metric_code/report_group` được cấu hình; không để người nhập tự gõ metric. |
| Bên chịu chi phí | Với sửa chữa/vệ sinh/bồi thường có thể do `COMPANY`, `CUSTOMER`, `LANDLORD`, `OTHER` chịu. Chỉ phần thực sự thuộc công ty mới được tạo/ghi nhận Expense công ty. |
| Khách chịu / Trừ cọc | Khoản khách chịu hoặc trừ cọc phải liên kết FR46 work item và FR26 settlement/refund khi có; không vừa tính Expense công ty vừa khấu trừ khách nếu không có nghiệp vụ chia sẻ chi phí được xác nhận. |
| Mua thiết bị | Có thể liên kết Asset FR45; asset link không tạo một Expense thứ hai. |
| Hoa hồng | Chỉ hoa hồng đã duyệt/import và map đúng kỳ/tòa mới tạo/được link Expense; không lấy cột tổng team lặp lại làm thêm chi phí. |
| Chi phí trực tiếp vs chung (sửa v1.9) | Theo G1 `BÁO CÁO THÁNG 8`: **trực tiếp theo tòa** (lưu `building_id`): tiền thuê nhà, mua sắm thiết bị, giá gốc điện/nước/mạng/rác/môi trường/bảo trì thang máy, lương vệ sinh, hoa hồng từng phòng (ví dụ `C47 = 2.050.000 P203`), sửa chữa/thay thế/bảo trì theo phòng, chi phí khác có tòa. **Chi phí chung toàn hệ thống** (không có tòa nguồn, phân bổ FR28 theo số phòng): lương quản lý tổng, lương trưởng/phó phòng vận hành (phần cố định), lương nhân viên nguồn, lương NVKD, lương kế toán (phần cố định), lương sửa chữa, `Thuê & DV VP`, phần `Phí marketing` chung. Không nhân bản Expense chung theo tòa. |
| Cây danh mục chi phí (SRC-02) | **Giá vốn:** tiền thuê nhà; mua sắm thiết bị; giá gốc DV (điện, nước, mạng, phí thu rác, phí môi trường, phí bảo trì thang máy). **Chi phí vận hành:** lương quản lý; lương quản lý tổng; lương trưởng phòng VH; lương phó phòng VH; lương nhân viên nguồn; lương NVKD; lương vệ sinh; lương kế toán; lương sửa chữa; lương bảo vệ; thuê và DV VP. **Chi phí bán hàng phát sinh:** phí marketing (gồm hoa hồng); sửa chữa, thay thế, bảo trì; chi phí khác. Lọc theo thời gian, tòa, khu vực, NV vận hành, trưởng khu vực. **Chi phí khởi tạo tòa (v1.9, theo G1 `THU CHI BAN ĐẦU`):** tiền nhà trả trước giai đoạn đầu; cọc chủ nhà (không phải chi phí — theo FR06); **phí môi giới nhà** (G1: 6.200.000 + 8.200.000 = 14.400.000); hoa hồng lấp phòng ban đầu theo từng phòng; vật tư/thiết bị/lắp đặt ban đầu. Gắn `building_id` + cờ `SETUP_PHASE`. |
| Tác động | FR27 là nguồn cho `HEAD_LEASE_COST` (qua FR07/Expense liên kết theo thiết kế triển khai), thiết bị, giá gốc DV, Marketing, Hoa hồng, sửa chữa/bảo trì, VP và các chi phí khác. |

## 2. Mô tả màn hình

### Màn hình 27.1: Danh sách Chi phí

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tab | Tab | Có | Tất cả / Dịch vụ đầu vào / Vận hành / Thiết bị / Khác. |
| Bộ lọc | Bộ lọc | Không | Kỳ; tòa; T/S/G; category; metric; NCC/người nhận; payer/source; chứng từ. |
| Bảng | Bảng | Có | Mã; ngày; kỳ; tòa/quỹ chung; category; metric; source type/id; amount; đã phân bổ; chứng từ; trạng thái. |
| Thêm/Import | Nút | Không | Tạo 27.2 hoặc Import qua FR48. |
| Thao tác | Menu | Không | Xem / Chỉnh sửa / Hủy-Đảo / Allocation. |

### Màn hình 27.2: Tạo / Chỉnh sửa Chi phí

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ hạch toán | Tháng/Năm | Có | Kỳ report. |
| Ngày chứng từ / Ngày thanh toán | Ngày | Có/Tùy điều kiện | Tách P&L và cash date. |
| Tòa / Chi phí chung | Tra cứu | Có | Scope trực tiếp/chung. |
| Nhóm / Category / Report metric | Danh sách + Chỉ đọc | Có | Mapping được quản trị. |
| Source type / Source ID | Danh sách + Tra cứu | Tùy điều kiện | Utility Bill, Maintenance/Repair, Commission, Asset, Owner Rent Recognition, Payroll... |
| Mã HĐ/Bill tiện ích | Tra cứu | Tùy điều kiện | FR09 cho utility input. |
| NCC / Người nhận | Tra cứu/Văn bản | Tùy điều kiện | Nguồn chi. |
| Số tiền công ty chịu | Tiền tệ | Có | Amount của Expense công ty. |
| Bên chịu chi phí nguồn | Chỉ đọc/Danh sách | Tùy điều kiện | Nếu Expense sinh từ FR46; phải nhất quán với work item. |
| Chứng từ | Upload | Tùy điều kiện | Bằng chứng. |
| Ghi chú / Lý do | Văn bản | Không | Đặc thù/adjustment. |
| Lưu | Nút chính | Có | Chống duplicate theo source/chứng từ; không tự phân bổ nếu chi phí chung. |

### Màn hình 27.3: Chi phí dịch vụ đầu vào theo Tòa + Kỳ

**Loại màn hình:** Danh sách / Grid + Nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Tòa | Bộ lọc | Có | Phạm vi input cost. |
| Điện | Tiền tệ | Tùy điều kiện | `ELECTRIC_INPUT_COST`; ưu tiên link Bill FR09. |
| Nước | Tiền tệ | Tùy điều kiện | `WATER_INPUT_COST`. |
| Mạng | Tiền tệ | Tùy điều kiện | `INTERNET_INPUT_COST`. |
| Rác / Môi trường / Bảo trì TM | Tiền tệ | Tùy điều kiện | Metric tương ứng. |
| Bill/NCC/Mã HĐ/Chứng từ | Liên kết + Upload | Tùy điều kiện | Trace source. |
| Tổng giá gốc DV | Chỉ đọc | Có | Tổng input cost, không gồm doanh thu. |
| Reconciliation | Trạng thái | Không | Bill/Expense/report mapping đầy đủ hay còn thiếu. |

### Màn hình 27.4: Chi tiết Chi phí

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nguồn | Chỉ đọc | Có | Kỳ, tòa, category, metric, source, amount, chứng từ. |
| Allocation | Liên kết | Tùy điều kiện | FR28. |
| Source business record | Liên kết | Tùy điều kiện | FR09/FR46/FR32/FR45/FR07... |
| Report usage | Bảng | Không | Snapshot/metric đã sử dụng. |
| Lịch sử | Timeline | Có | Tạo/sửa/đảo. |

### Màn hình 27.5: Xác nhận Hủy / Đảo Chi phí

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Expense | Chỉ đọc | Có | Khoản chi. |
| Lý do | Văn bản | Có | Audit. |
| Xác nhận | Nút chính/nguy hiểm | Có | Đảo tác động theo quy trình; không xóa vật lý. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có kỳ/tòa/category và quyền. Utility/repair/commission có source record tương ứng nếu phát sinh từ module khác. |
| Các bước người dùng | Bước 1: Tạo Expense trực tiếp hoặc từ source FR09/FR46/FR32/FR07.<br>Bước 2: Nếu shared -> FR28 Allocation.<br>Bước 3: Kế toán kiểm tra payer/source để tránh ghi chi phí công ty cho khoản khách/chủ nhà chịu.<br>Bước 4: Report lấy theo metric + accounting period + allocation version.<br>Bước 5: Drill về 27.4 rồi về chứng từ/source nghiệp vụ. |

---

# FR28 - Phân bổ chi phí chung theo tòa / nhóm T-S-G

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Tài chính  
**Nguồn:** SRC-04; SRC-07; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin. |
| Phạm vi áp dụng | Dùng cho chi phí chung toàn hệ thống không có tòa nguồn (danh sách tại FR27: lương quản lý tổng, TPVH/phó phòng phần cố định, NV nguồn, NVKD, kế toán phần cố định, lương sửa chữa, `Thuê & DV VP`, marketing chung). Expense đã có tòa (hoa hồng từng phòng, sửa chữa theo phòng, chi phí khác có tòa...) không đưa qua allocation để tránh phân bổ kép. |
| Phương pháp nguồn (v1.9) | `FIXTURE_CONFIRMED` theo công thức G1 `BÁO CÁO THÁNG 8`: `Phân bổ cho tòa = Chi phí chung của tháng / Tổng số phòng toàn hệ thống của tháng × Số phòng của tòa` (method `ROOM_COUNT`). Ví dụ G1 (15 phòng, hệ thống 1.382 phòng): `C36 = (13.000.000/1382)*15`; `C37 = (20.000.000/1382)*15 + 10.000*15`; `C45 = (Thuê&DV VP/1382)*15`; `C46 = (Marketing/1382)*15`. Mẫu số các tháng: 1.204 → 1.205 → 1.282 → 1.293 → 1.303 → 1.343 → 1.382. |
| Mẫu số tại ngày chốt | `Tổng số phòng toàn hệ thống` lấy snapshot tại ngày chốt kỳ (khớp tổng số phòng trên bảng lương tháng). Lưu ý nguồn: G1 tháng 8 `C43` (lương sửa chữa) dùng 1.343 (số tháng 7) thay vì 1.382 → giữ nguyên số lịch sử khi import, **không tự sửa**; kỳ mới dùng snapshot của chính kỳ. |
| Nguyên tắc | Chi phí gắn trực tiếp một tòa được phân bổ 100% cho tòa đó. Chi phí chung phải tạo `Expense Allocation` trước khi được đưa vào báo cáo theo tòa/T-S-G. |
| Không phân bổ lúc render | Report không được tự chia lại chi phí mỗi lần mở màn hình. Allocation phải là dữ liệu có version/snapshot và truy về Expense nguồn. |
| Phương pháp | Mặc định `ROOM_COUNT` theo nguồn cho mọi category chung đã liệt kê. Hệ thống vẫn hỗ trợ `REVENUE`, `BUILDING_COUNT`, `MANUAL_RATIO` dưới dạng policy version cho trường hợp được duyệt sau này. |
| Kiểm soát tổng | `Tổng allocation + phần làm tròn/chưa phân bổ hợp lệ = Expense nguồn`. Không được làm mất hoặc nhân đôi giá trị. |
| Hiệu lực | Allocation có kỳ, phiên bản, người xác nhận; kỳ đã khóa dùng đúng version đã snapshot. |
| Tác động | Report theo tòa tính chi phí từ `Direct Expense + Expense Allocation`, sau đó mới aggregate T/S/G/Total. |

## 2. Mô tả màn hình

### Màn hình 28.1: Danh sách phân bổ chi phí

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Category / Tòa | Bộ lọc | Không | Tìm các Expense chung cần/đã phân bổ. |
| Expense nguồn | Bảng | Có | Mã chứng từ; category; report metric; số tiền; kỳ; trạng thái. |
| Phương pháp / Version | Bảng | Có | Method, version, thời điểm xác nhận. |
| Tổng phân bổ / Chênh lệch | Tiền tệ | Có | Kiểm tra cân bằng với Expense nguồn. |
| Preview | Nút | Không | Mở 28.2. |

### Màn hình 28.2: Preview / Chỉnh Allocation

**Loại màn hình:** Biểu mẫu + Bảng

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Expense nguồn | Chỉ đọc | Có | Khoản chi và metric nguồn. |
| Method | Danh sách | Có | ROOM_COUNT / REVENUE / BUILDING_COUNT / MANUAL_RATIO / policy được duyệt. |
| Tập tòa | Multi-select | Có | Các tòa tham gia phân bổ. |
| Basis | Bảng | Có | Số phòng, doanh thu, tỷ lệ manual hoặc mẫu số tương ứng. |
| Amount per building | Bảng | Có | Số tiền kết quả từng tòa. |
| Nhóm T/S/G tại kỳ | Chỉ đọc | Có | Loại tòa phải resolve theo lịch sử hiệu lực của kỳ. |
| Chênh lệch làm tròn | Tiền tệ | Có | Hiển thị riêng; không ẩn. |

### Màn hình 28.3: Xác nhận Allocation

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tổng Expense | Tiền tệ | Có | Giá trị nguồn. |
| Tổng phân bổ | Tiền tệ | Có | Tổng allocation. |
| Diff | Tiền tệ | Có | Phải bằng 0 hoặc trong rule làm tròn đã duyệt. |
| Version / Lý do | Văn bản | Có | Lưu lịch sử. |
| Xác nhận | Nút chính | Có | Tạo Allocation Snapshot cho kỳ. |

### Màn hình 28.4: Chi tiết Allocation

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Expense → Building | Bảng | Có | Từng dòng allocation, basis, amount, version. |
| Report usage | Liên kết | Không | Metric/report snapshot sử dụng allocation. |
| Truy nguồn | Liên kết | Có | Mở FR27 Expense gốc. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có Expense chung ở FR27 và kỳ chưa khóa. |
| Các bước người dùng | Bước 1: Chọn Expense tại 28.1.<br>Bước 2: Chọn method/tập tòa và Preview 28.2.<br>Bước 3: Kiểm tra `Expense = Tổng Allocation + Diff hợp lệ`.<br>Bước 4: Xác nhận 28.3.<br>Bước 5: FR38/40 sử dụng đúng Allocation Version của kỳ. |

---

# FR29 - Tổng quan kinh doanh / nguồn phòng

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Kinh doanh  
**Nguồn:** SRC-02 `KINH DOANH`; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kinh doanh/Leader/Admin; Vận hành xem theo quyền. |
| Quy tắc chức năng | Tổng quan kinh doanh phải phân biệt phòng có thể bán, đã chốt, chờ nhận và đã nhận; không cộng trùng một phòng do nhiều sale tương tác. |
| Tổng quan hàng hóa (SRC-02) | Lấy phần tổng quan hàng hóa ban đầu + **số phòng đã chốt, số phòng đã nhận, số phòng phát sinh (từ hoàn cọc và phá HĐ)**. Lọc theo **khu vực, trưởng nhóm kinh doanh, NV kinh doanh**. |
| Danh sách nhân sự KD (SRC-02 mục 5) | STT; tên nhân viên; chức vụ; thâm niên; doanh số của từng người (lọc theo thời gian). `Doanh số Sale = tổng giá phòng cho thuê được trong kỳ theo Sale` (SRC-15). |
| Tác động | Nhấn KPI mở phòng/lead/deal nguồn; màn tổng quan không tự tạo giao dịch tài chính. |

## 2. Mô tả màn hình

### Màn hình 29.1: Tổng quan kinh doanh / nguồn phòng - Danh sách / Nhập liệu

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Phạm vi / Bộ lọc | Bộ lọc | Không | Kỳ, tòa, khu vực, người phụ trách và trạng thái phù hợp nghiệp vụ. |
| Dữ liệu đầu vào | Bảng / Biểu mẫu | Có | Kỳ; khu vực; tòa; trưởng nhóm KD/team; NV KD; trạng thái nguồn phòng và giao dịch. KPI: phòng có thể bán; đã chốt; đã nhận; phát sinh từ hoàn cọc; phát sinh từ phá HĐ. |
| Tab Nhân sự KD | Bảng | Có | STT; tên NV; chức vụ; thâm niên; doanh số theo khoảng thời gian chọn. |
| Kiểm tra | Nút | Tùy điều kiện | Kiểm tra quyền, dữ liệu bắt buộc, trùng lặp và trạng thái kỳ. |
| Thực hiện | Nút chính | Có | Thực hiện nghiệp vụ -> KPI phòng còn kinh doanh, đã chốt, chờ nhận, đã nhận và các chỉ tiêu lead/view/deal hỗ trợ..  |

### Màn hình 29.2: Tổng quan kinh doanh / nguồn phòng - Chi tiết / Kết quả

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu nguồn | Chỉ đọc | Có | Hiển thị kỳ, đối tượng, nguồn dữ liệu, người thao tác và các bản ghi liên quan. |
| Kết quả | Chỉ đọc / Bảng | Có | KPI phòng còn kinh doanh, đã chốt, chờ nhận, đã nhận và các chỉ tiêu lead/view/deal hỗ trợ. |
| Truy vết | Liên kết | Không | Nhấn -> mở chứng từ/bản ghi đã tạo ra kết quả. |
| Lịch sử | Dòng thời gian | Không | Hiển thị các lần thay đổi, điều chỉnh hoặc phiên bản. |

### Màn hình 29.3: Xác nhận Tổng quan kinh doanh / nguồn phòng

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tóm tắt | Chỉ đọc | Có | Tóm tắt phạm vi, số bản ghi và tác động. |
| Cảnh báo | Chỉ đọc | Tùy điều kiện | Hiển thị lỗi/cảnh báo phải xử lý trước khi xác nhận. |
| Xác nhận | Nút chính | Có | Xác nhận -> lưu giao dịch/phiên bản/nhật ký. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Người dùng có quyền Kinh doanh. |
| Các bước người dùng | Bước 1: Mở Tổng quan kinh doanh 29.1.<br>Bước 2: Chọn bộ lọc -> cập nhật KPI.<br>Bước 3: Nhấn KPI -> mở FR10/FR30/FR31 tương ứng. |

---

# FR30 - Quản lý khách tiềm năng, lượt xem phòng và lịch sử stage

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Kinh doanh  
**Nguồn:** SRC-02 `KINH DOANH`; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kinh doanh/Leader/Admin. |
| Lead/View | Một Lead có thể có nhiều lượt xem phòng; trùng SĐT cảnh báo nhưng không tự gộp. |
| Stage history | Mỗi thay đổi trạng thái/stage tạo `LeadStageHistory` gồm `from_stage`, `to_stage`, `happened_at`, `actor`, `reason/source`; không chỉ lưu stage hiện tại. |
| View event | Lượt xem phải có `viewed_at`, tòa/phòng, sale/team/source tại thời điểm đó để sau này tính `khách xem → khách chốt`. |
| Nhiều lượt xem | Một Lead/khách có thể xem nhiều phòng phù hợp; mỗi lượt xem lưu `ViewEvent` riêng. Số phòng đã xem không làm tăng số khách trong denominator conversion. |
| Tác động | Lead/View chuyển thành Deal FR31; history là nguồn báo cáo conversion/time-to-close sau này, không cần dựng lại từ audit text. |

## 2. Mô tả màn hình

### Màn hình 30.1: Danh sách Lead / Lượt xem

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Bộ lọc | Không | Kỳ; nguồn; sale/team; tòa/khu vực; stage/trạng thái. |
| Bảng | Bảng | Có | Lead ID; SĐT; nguồn; sale/team; current stage; first_contact_at; last_stage_at; số lượt xem; Deal nếu có. |
| Thêm mới | Nút | Không | Mở 30.2. |
| Thao tác | Menu | Không | Xem / Chỉnh sửa / Ghi lượt xem / Đổi stage / Chuyển Deal / Lưu trữ. |

### Màn hình 30.2: Tạo Lead / Ghi lượt xem

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Lead / SĐT / Nguồn | Biểu mẫu | Có | Nguồn khách. |
| Sale / Team / Khu vực | Tra cứu | Có/Tùy điều kiện | Snapshot người phụ trách. |
| Stage | Danh sách | Có | Tạo history ban đầu. |
| Tòa / Phòng xem / viewed_at | Tra cứu + Ngày giờ | Tùy điều kiện | Tạo View event. |
| Ghi chú | Văn bản | Không | Thông tin bổ sung. |
| Lưu | Nút chính | Có | Tạo Lead/History/View. |

### Màn hình 30.3: Chi tiết Lead

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin Lead | Chỉ đọc | Có | Contact/source/sale/team/current stage. |
| Lượt xem | Bảng | Không | viewed_at, tòa/phòng, kết quả. |
| Stage History | Timeline | Có | from/to/time/actor/reason. |
| Deal | Liên kết | Không | FR31 nếu đã chốt. |

### Màn hình 30.4: Chỉnh sửa / Đổi stage

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu Lead | Biểu mẫu | Có/Tùy điều kiện | Contact/source/owner hợp lệ. |
| Stage mới / happened_at / lý do | Danh sách + Ngày giờ + Văn bản | Tùy điều kiện | Khi đổi stage phải tạo history. |
| Lưu | Nút chính | Có | Không ghi đè history cũ. |

### Màn hình 30.5: Xác nhận Hủy / Lưu trữ Lead

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Lead | Chỉ đọc | Có | Đối tượng. |
| Lý do / Thời điểm | Văn bản + Ngày giờ | Có | Tạo terminal stage/history. |
| Xác nhận | Nút chính | Có | Lưu trạng thái, không xóa lịch sử. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có nhân sự kinh doanh/danh mục nguồn và quyền. |
| Các bước người dùng | Bước 1: Tạo Lead 30.2.<br>Bước 2: Mỗi lượt xem ghi View event.<br>Bước 3: Mỗi đổi stage tạo History với timestamp thực tế.<br>Bước 4: Chốt -> tạo FR31 Deal liên kết Lead.<br>Bước 5: Report conversion về sau dùng event/history, không suy từ current stage. |

---

# FR31 - Quản lý giao dịch chốt phòng, nhận cọc, nhận phòng và lịch sử Deal

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Kinh doanh  
**Nguồn:** SRC-02; SRC-08 `PHÒNG MỚI THÁNG 9`, `PHÒNG MỚI THÁNG 10`; SRC-09; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kinh doanh/Leader/Admin; Kế toán xem tài chính liên quan. |
| Trạng thái | Luồng tối thiểu: `Đã chốt → Đã nhận cọc → Chờ nhận phòng → Đã nhận phòng`; nhánh `Bỏ cọc/Không nhận phòng` tách riêng. |
| Deal history | Mọi transition tạo `DealStageHistory` với from/to, `happened_at`, actor, reason/source; ngày chốt/nhận cọc/nhận phòng/bỏ cọc không suy từ updated_at. |
| Cọc | Tách `cọc cam kết`, `cọc đã nhận qua Payment`, `cọc của lượt thuê mới`; không lấy toàn Payment làm cọc. |
| Nhận phòng | Phải có ngày nhận thực tế và ngày bắt đầu tính tiền; tạo/kích hoạt FR11, `NEW_ROOM`, RoomStatusHistory và downstream billing. |
| Bỏ cọc | Khoản cọc giữ lại tạo `FORFEITED_DEPOSIT`; không tạo NEW_ROOM. |
| Phá HĐ | `EARLY_TERMINATION_COUNT` dùng `notice_date` (ngày khách báo phá HĐ) làm date basis cho kỳ báo cáo. Vẫn lưu riêng `termination_effective_date`, `settlement_date`, `checkout_date` để phục vụ vận hành/tài chính. |
| Snapshot sales | Deal phải giữ source/sale/team/giá chốt/term tại thời điểm chốt để report lịch sử không bị thay bởi master data hiện tại. |
| Tình trạng thu tiền / phòng chốt | `Tình trạng thu tiền` = Đã đủ khi PaymentAllocation cọc + tiền tháng đầu đạt nghĩa vụ, ngược lại Thiếu. `Tình trạng phòng chốt` = Ở luôn / Cuối tháng / Đang chờ theo ngày nhận dự kiến so với kỳ. |
| Thống kê khách (SRC-02 mục 3) | Màn FR30 hiển thị: STT; tên sale; mã tòa + phòng; nguồn khách (sale nội bộ / đối tác); tình trạng (đã xem / chốt); khu vực; SĐT; ngày bắn khách (`first_contact_at`). |
| Điều kiện chốt | Deal chỉ được tính `CLOSED_WON/CHỐT` cho KPI conversion khi đã chọn phòng và có **cọc phòng được ghi nhận/xác nhận**. Một Lead chỉ tính một khách chốt cho một lần conversion, không tính theo số phòng đã từng xem. |
| NOTE conversion khác tháng | Nếu Lead xem phòng ở tháng A nhưng đặt cọc/chốt ở tháng B, cách attribution tỷ lệ theo cohort tháng xem hay theo tháng chốt cần xác nhận riêng với khách trước khi khóa report conversion lịch sử. |
| Tác động | Deal là nguồn cho phòng mới, sales revenue/commission linkage và conversion; rule hoa hồng tự động để Phase 2. |

## 2. Mô tả màn hình

### Màn hình 31.1: Danh sách Deal

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Bộ lọc | Không | Kỳ; tòa; sale/team; nguồn; trạng thái; nhận/cọc. |
| Bảng (Doanh số — SRC-02 mục 2) | Bảng | Có | 1 STT; 2 ngày phát sinh giao dịch; 3 mã phòng + tòa; 4 quản lý; 5 SĐT; 6 số tiền đặt cọc; 7 giá chốt; 8 ngày tính tiền; 9 thời hạn HĐ; 10 công cụ phát sinh khách (kênh nguồn); 11 tình trạng thu tiền (Đã đủ / Thiếu); 12 tên sale; 13 hoa hồng (link FR32); 14 tình trạng phòng chốt (**Ở luôn / Cuối tháng / Đang chờ**); 15 ghi chú. Cột bổ sung: current stage; team. |
| Thao tác | Menu | Không | Xem / Chỉnh sửa / Ghi cọc / Đổi stage / Xác nhận nhận phòng/bỏ cọc / Hủy. |

### Màn hình 31.2: Tạo Deal

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Lead / Khách / Phòng | Tra cứu | Có | Nguồn Deal. |
| Giá chốt / Cọc cam kết / Thời hạn HĐ | Tiền + Số/Tháng | Có/Tùy điều kiện | Snapshot thương mại. |
| Ngày chốt thực tế | Ngày giờ | Có | Date basis sales. |
| Ngày nhận dự kiến / ngày tính tiền dự kiến | Ngày | Tùy điều kiện | Không thay ngày thực tế. |
| Sale / Team / Nguồn | Tra cứu | Có | Snapshot tại chốt. |
| Lưu | Nút chính | Có | Tạo Deal + initial DealStageHistory. |

### Màn hình 31.3: Chi tiết Deal

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin Deal | Chỉ đọc | Có | Giá/term/cọc/ngày/source/sale/team/current stage. |
| Payment cọc | Liên kết | Không | PaymentAllocation cọc. |
| Stage History | Timeline | Có | Chốt/cọc/chờ nhận/nhận/bỏ/hủy với timestamps. |
| Stay / HĐ / Commission | Liên kết | Không | Downstream records. |

### Màn hình 31.4: Chỉnh sửa Deal

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Chỉ dữ liệu được phép; thay data đã có Payment/HĐ phải có lý do. |
| Lý do | Văn bản | Tùy điều kiện | Audit. |
| Lưu | Nút chính | Có | Giữ snapshot/history. |

### Màn hình 31.5: Xác nhận Hủy Deal

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Deal | Chỉ đọc | Có | Deal nguồn. |
| happened_at / Lý do | Ngày giờ + Văn bản | Có | Tạo terminal DealStageHistory. |
| Xác nhận | Nút chính | Có | Không dùng để xử lý cọc đã nhận; có cọc dùng 31.6. |

### Màn hình 31.6: Xác nhận nhận phòng / Bỏ cọc

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Hành động | Radio | Có | Đã nhận phòng / Bỏ cọc. |
| Ngày nhận thực tế | Ngày | Có khi nhận | Date basis NEW_ROOM. |
| Ngày bắt đầu tính tiền | Ngày | Có khi nhận | Nguồn first-month rent. |
| Cọc cam kết / đã thu | Tiền | Có | Đối chiếu, không sửa Payment. |
| Số cọc giữ lại | Tiền | Có khi bỏ cọc | Nguồn FORFEITED_DEPOSIT. |
| happened_at / Lý do | Ngày giờ + Văn bản | Có | Lưu history đúng thời điểm. |
| Xác nhận | Nút chính | Có | Nhận -> FR11/Room history; bỏ -> forfeited event. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có Lead/phòng và quyền. |
| Các bước người dùng | Bước 1: Tạo Deal + timestamp chốt.<br>Bước 2: Khi nhận cọc, FR21 PaymentAllocation + stage history.<br>Bước 3: 31.6 nhận phòng hoặc bỏ cọc với ngày thực tế.<br>Bước 4: Nhận phòng -> FR11/12/13/16; bỏ cọc -> FORFEITED_DEPOSIT.<br>Bước 5: Conversion/report về sau đọc Lead/Deal History, không đọc updated_at. |

---

# FR32 - Hoa hồng cơ bản / Import và phân loại trường hợp

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Kinh doanh/Tài chính  
**Nguồn:** SRC-09; SRC-02; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin; Kinh doanh/Leader theo quyền. |
| Phase 1 | Lưu/import **mức hoa hồng đã được duyệt**; không tự suy tỷ lệ từ term/source/note. Rule engine ở FR52. |
| Case type | Mỗi record có `commission_case_type` để phân biệt tối thiểu `NORMAL`, `FORFEITED_DEPOSIT`, `REFERRAL_PARTNER`, `DUPLICATE_SHARED`, `ADJUSTMENT`; exact mapping/policy được business cấu hình/xác nhận, không chỉ ghi note tự do. |
| Liên kết | Commission link Deal/room/building/salesperson/team/source partner và kỳ ghi nhận; trường hợp trùng/chia phải có quan hệ/reference để tránh double count. |
| Payment status | Tách `approved_amount`, `paid_amount/status`, `paid_at`; ngày thanh toán không đồng nghĩa kỳ ghi nhận expense nếu policy khác. |
| Tổng nhận | Cột tổng/group trong Excel nguồn chỉ là giá trị hiển thị/đối chiếu; không tự tạo thêm commission expense nếu đã có các dòng chi tiết. |
| Cột theo SRC-02 / SRC-09 | STT; mã phòng + tòa; giá chốt; thời hạn HĐ; mức HH; thành tiền; tổng nhận; team sale (đối tác); tình trạng thanh toán (Đã TT / Chưa TT). File SRC-09 có thêm: tình trạng thu của khách (đủ/chưa đủ), quản lý, chú thích, ngày TT, STK thanh toán, SĐT khách. Quan sát dữ liệu tháng 8.26: mức HH phổ biến `0,5` × giá chốt (HĐ 9–12 tháng); ca bỏ cọc tính trên phần tiền phòng theo ngày → Phase 1 chỉ import số đã duyệt, rule tự động ở FR52. |
| Tác động | Commission đã duyệt/ghi nhận có thể tạo/link Expense FR27; report chi phí dùng record/Expense nguồn có trace. |

## 2. Mô tả màn hình

### Màn hình 32.1: Danh sách Hoa hồng

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Bộ lọc | Không | Kỳ; tòa; sale/team; partner; case type; payment status; batch. |
| Bảng | Bảng | Có | Deal; phòng/tòa; giá chốt; term; approved rate; approved amount; case type; sale/team/partner; paid status/date; Expense link. |
| Thêm/Import | Nút | Không | Manual approved data hoặc FR48 import. |
| Thao tác | Menu | Không | Xem / Chỉnh sửa / Hủy-Đảo theo quyền. |

### Màn hình 32.2: Tạo Hoa hồng

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Deal / Phòng / Tòa | Tra cứu | Có/Tùy điều kiện | Nguồn commission. |
| Sale / Team / Source Partner | Tra cứu | Tùy điều kiện | Chủ thể/nguồn. |
| Giá chốt / Term | Tiền + Số/Tháng | Có/Tùy điều kiện | Snapshot nguồn. |
| Commission case type | Danh sách | Có | Phân loại trường hợp. |
| Approved rate / amount | Số % + Tiền | Có | Số đã được duyệt/import. |
| Shared/Duplicate reference | Tra cứu | Tùy điều kiện | Liên kết record liên quan nếu chia/trùng. |
| Payment status / paid amount / paid_at | Danh sách + Tiền + Ngày | Tùy điều kiện | Theo dõi chi thực tế. |
| Note / Chứng từ | Văn bản + Upload | Không | Bổ sung bằng chứng. |
| Lưu | Nút chính | Có | Chống duplicate theo Deal/party/case/reference phù hợp. |

### Màn hình 32.3: Chi tiết Hoa hồng

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Source, case, rate/amount, party, payment. |
| Record liên quan | Liên kết | Không | Deal, duplicate/shared, Expense, partner. |
| Report usage | Liên kết | Không | Kỳ/metric/report dùng record. |
| Lịch sử | Timeline | Có | Import/edit/approve/pay/hủy. |

### Màn hình 32.4: Chỉnh sửa Hoa hồng

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Chỉ kỳ chưa khóa; amount/case/payment thay đổi phải có lý do. |
| Lý do | Văn bản | Có khi ảnh hưởng tài chính | Audit. |
| Lưu | Nút chính | Có | Version/history; đồng bộ Expense link theo workflow được duyệt. |

### Màn hình 32.5: Xác nhận Hủy / Đảo Hoa hồng

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Commission | Chỉ đọc | Có | Record nguồn. |
| Lý do | Văn bản | Có | Audit. |
| Xác nhận | Nút chính/nguy hiểm | Có | Không xóa vật lý; xử lý Expense liên kết theo trạng thái/kỳ. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có Deal/source data hoặc file HH nguồn; người dùng có quyền. |
| Các bước người dùng | Bước 1: Import/manual approved record.<br>Bước 2: Chuẩn hóa case type, sale/team/partner và reference trùng/chia nếu có.<br>Bước 3: Confirm số approved, tạo/link Expense theo kỳ.<br>Bước 4: Cập nhật payment status riêng.<br>Bước 5: Phase 2 FR52 có thể tự tính rule nhưng không làm mất dữ liệu/history Phase 1. |

---

# FR33 - Cơ cấu tổ chức dạng cây gia phả và quản lý nhân sự

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Nhân sự  
**Nguồn:** SRC-02 `NHÂN SỰ`; SRC-03; P3; UI-18/UI-19

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Nhân sự/Admin được cấu hình tổ chức; Leader xem nhánh được cấp quyền; dữ liệu lương/tài khoản ngân hàng có quyền riêng. |
| Mô hình cây | Cơ cấu tổ chức phải hỗ trợ nhiều cấp dạng **Org Chart / Family Tree**: `Công ty → Khối/Phòng → Bộ phận/Team → Leader → Nhân viên`. Không giới hạn cứng số tầng nhưng phải kiểm tra vòng lặp cha-con. |
| Hai loại node | `ORG_UNIT` là đơn vị tổ chức; `EMPLOYEE` là nhân sự. Employee có thể được render dưới node đơn vị hoặc dưới manager trực tiếp tùy chế độ xem. |
| Tuyến báo cáo | Một nhân viên chỉ có một tuyến quản lý chính tại một thời điểm. Phân công chéo/tòa/phòng là FR34 và không làm thay đổi tuyến quản lý chính. |
| Effective date | Quan hệ `đơn vị cha`, `lead`, `manager`, `membership` và trạng thái nhân sự/đơn vị đều có `effective_from/effective_to`. Không ghi đè lịch sử. |
| Xem tại ngày | Người dùng có thể chọn một ngày/kỳ để dựng lại cây tổ chức đúng tại thời điểm đó. Cơ cấu lịch sử phải dùng cho quyền dữ liệu, team filter, Assignment, Payroll và Report của kỳ cũ. |
| Không hard delete | Nhân sự/đơn vị đã từng có Assignment, Payroll, Payment, Report hoặc dữ liệu nghiệp vụ không được xóa vật lý. Sử dụng `Inactive/Resigned` và giữ lịch sử. |
| Xóa bản nháp | Chỉ cho phép xóa vật lý node/nhân sự ở trạng thái Draft/Planned khi chưa từng được tham chiếu bởi dữ liệu nghiệp vụ. |
| Di chuyển node | Cho phép đổi đơn vị cha / chuyển team / đổi manager với ngày hiệu lực. Phải chặn circular reference và cảnh báo khi node con/nhân sự/assignment sẽ bị ảnh hưởng. |
| Lead | Một đơn vị có tối đa một `lead chính` hiệu lực tại một thời điểm; thay lead phải tạo lịch sử, không ghi đè lead cũ. |
| Ngừng đơn vị | Không cho ngừng đơn vị nếu còn nhân sự hoặc Assignment hiệu lực mà chưa có kế hoạch chuyển/ngừng tương ứng. |
| Data visibility | Org Chart khi render phải áp dụng FR02 Organization Scope. Leader chỉ thấy subtree được cấp; không render nhánh ngoài scope rồi chỉ disable. |
| Cross-leader isolation | Leader A không được xem hồ sơ/quản lý/nhân sự của Leader B nếu không có scope bổ sung. Search trên cây cũng không trả node ngoài scope. |
| Thông tin nhân sự (SRC-02 `NHÂN SỰ`) | Chi tiết gồm: thông tin cá nhân, phòng ban, chức vụ, **thâm niên** (tính từ ngày vào làm tới ngày xem), tình trạng. Với phòng Vận hành hiển thị thêm **số nhà và số phòng đang quản lý** (từ FR34). Màn tổng quan nhân sự làm tương tự màn tổng quan khách hàng (danh sách + bộ lọc + trạng thái). |
| Tính lương theo phòng ban | SRC-02 liệt kê 5 phòng: Kinh doanh, Vận hành, Kỹ thuật, Thị trường, TC-KT. Phase 1 chỉ có công thức nguồn cho **Vận hành** (FR24/25/35) và lương sửa chữa (FR35); các phòng còn lại nhập lương/thành phần lương thủ công. <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION công thức các phòng còn lại.</span> |
| Tác động | Cây tổ chức là nguồn cho phạm vi quyền, filter team/leader, lịch sử trách nhiệm, Payroll Cost Allocation và các báo cáo theo nhân sự/leader. |

## 2. Mô tả màn hình

### Màn hình 33.1: Cơ cấu tổ chức — Org Chart / Family Tree

**Loại màn hình:** Org Chart / Family Tree / Canvas tương tác

**Layout chính:**

```text
                           TIMEHOUSE
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
     VẬN HÀNH            KINH DOANH          TÀI CHÍNH
          │                   │
      ┌───┴───┐           ┌───┴───┐
      │       │           │       │
   TEAM 1   TEAM 2     SALES 1  SALES 2
      │
   ┌──┼──┐
 Lead NV1 NV2
```

| Trường / Thành phần | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Xem tại ngày | Date picker | Có | Mặc định hiện tại; đổi ngày sẽ dựng lại cây theo effective history. |
| Chế độ xem | Toggle | Có | `Cây đơn vị` / `Cây quản lý`. |
| Canvas | Org chart | Có | Hiển thị card-node nối cha/con như cây gia phả. |
| Zoom | +/- / wheel | Không | Phóng to/thu nhỏ. |
| Pan | Drag canvas | Không | Di chuyển toàn bộ cây. |
| Fit screen | Nút | Không | Fit toàn bộ cây vào viewport. |
| Expand / Collapse | Nút tại node | Không | Thu gọn/mở rộng từng nhánh. |
| Tìm kiếm | Ô nhập | Không | Tìm đơn vị/nhân viên; khi chọn kết quả hệ thống tự focus/highlight node. |
| Bộ lọc | Bộ lọc | Không | Loại đơn vị; phòng ban; team; trạng thái; chức danh; leader. |
| Thêm đơn vị gốc | Nút | Theo quyền | Tạo node cấp cao. |

**Card đơn vị tối thiểu:**

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tên đơn vị | Văn bản | Có | Ví dụ `Phòng Vận hành`, `Team VH 01`. |
| Loại đơn vị | Badge | Có | COMPANY / DIVISION / DEPARTMENT / TEAM / OTHER. |
| Lead chính | Avatar + tên | Không | Lead hiệu lực tại ngày đang xem. |
| Số nhân sự | Số | Có | Count nhân sự active trong node/nhánh theo rule UI. |
| Số tòa/phòng phụ trách | Số | Không | Tổng assignment hiện tại hoặc tại ngày đang xem. |
| Trạng thái | Badge | Có | PLANNED / ACTIVE / INACTIVE. |
| Menu node | `•••` | Không | Thêm node con / Thêm nhân sự / Sửa / Di chuyển / Đổi lead / Ngừng / Xem lịch sử. |

**Card nhân viên tối thiểu:**

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Avatar / Họ tên | Avatar + Text | Có | Nhận diện nhân viên. |
| Chức danh | Text | Có | Chức danh hiệu lực. |
| Đơn vị / Leader | Text | Có | Tuyến báo cáo tại ngày đang xem. |
| Tòa/phòng phụ trách | Badge/Số | Không | Lấy từ FR34. |
| Trạng thái | Badge | Có | ACTIVE / ON_LEAVE / RESIGNED / INACTIVE. |
| Menu nhân viên | `•••` | Không | Xem / Sửa / Chuyển đơn vị / Đổi manager / Nghỉ việc / Đi làm lại / Lịch sử. |

### Màn hình 33.2: Tạo / Sửa đơn vị tổ chức

**Loại màn hình:** Drawer / Modal từ Org Chart

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Mã đơn vị | Text | Có | Unique trong phạm vi chính sách. |
| Tên đơn vị | Text | Có | Tên hiển thị trên card. |
| Loại đơn vị | Select | Có | COMPANY / DIVISION / DEPARTMENT / TEAM / OTHER. |
| Đơn vị cha | Tree selector | Tùy điều kiện | Không được chọn chính node hoặc node con của chính nó. |
| Lead chính | Employee picker | Không | Quan hệ có ngày hiệu lực. |
| Effective from / to | Date | Có/Tùy điều kiện | Version quan hệ tổ chức. |
| Mô tả | Textarea | Không | Ghi chú đơn vị. |
| Trạng thái | Select | Có | PLANNED / ACTIVE / INACTIVE. |
| Lưu | Nút chính | Có | Validate circular reference, overlap lead và effective date. |

### Màn hình 33.3: Danh sách nhân sự theo node

**Loại màn hình:** Drawer / Bảng bên phải

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Node đang chọn | Chỉ đọc | Có | Đơn vị/team đang xem. |
| Lead | Chỉ đọc | Không | Lead chính. |
| Nhân sự | Bảng | Có | Mã; họ tên; phòng ban; chức danh; thâm niên; ngày vào nhóm; trạng thái; leader; số nhà/số phòng đang quản lý; tài khoản. |
| Thêm nhân viên | Nút | Theo quyền | Mở 33.4. |
| Thao tác | Menu | Không | Xem / Sửa / Chuyển team / Nghỉ việc / Lịch sử. |

### Màn hình 33.4: Tạo / Chỉnh sửa nhân viên

**Loại màn hình:** Form / Drawer

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Hồ sơ | Form | Có/Tùy điều kiện | Mã, họ tên, ngày sinh, CCCD, SĐT, email, địa chỉ, tài liệu. |
| Việc làm | Form | Có | Ngày vào/thử việc/chính thức/nghỉ; chức danh; level; đơn vị; manager/lead. |
| Ngân hàng | Form | Không | Ngân hàng, STK, chủ TK; mask theo quyền. |
| Cấu phần lương | Form | Theo quyền | Lương cơ bản/phụ cấp/mức cố định theo chức danh. |
| Tài khoản | Link | Không | User/Role; không lưu password trong hồ sơ nhân viên. |
| Effective date | Ngày | Có/Tùy điều kiện | Bắt buộc khi thay đơn vị/manager/chức danh. |
| Lưu | Nút chính | Có | Tạo/sửa version; không ghi đè lịch sử. |

### Màn hình 33.5: Di chuyển node / Chuyển nhân sự

**Loại màn hình:** Popup / Drawer

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Đơn vị hoặc nhân viên đang di chuyển. |
| Từ node | Chỉ đọc | Có | Đơn vị hiện tại. |
| Đến node | Tree selector | Có | Đơn vị đích. |
| Manager/Lead mới | Employee picker | Tùy điều kiện | Cập nhật tuyến báo cáo nếu có. |
| Ngày hiệu lực | Ngày | Có | Có thể là hôm nay hoặc tương lai. |
| Kiểm tra ảnh hưởng | Danh sách | Có | Assignment, quyền, payroll/report, nhân sự con, circular reference. |
| Xác nhận | Nút chính | Có | Tạo history/version; không sửa lịch sử kỳ cũ. |

### Màn hình 33.6: Đổi Lead / Manager

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đơn vị / Nhân viên | Chỉ đọc | Có | Đối tượng áp dụng. |
| Lead/Manager hiện tại | Chỉ đọc | Không | Quan hệ hiện hiệu lực. |
| Lead/Manager mới | Employee picker | Có | Người thay thế. |
| Effective from | Ngày | Có | Ngày bắt đầu. |
| Lý do | Textarea | Có | Audit. |
| Xác nhận | Nút chính | Có | Kết thúc relation cũ và tạo relation mới. |

### Màn hình 33.7: Nghỉ việc / Ngừng hoạt động / Đi làm lại

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Employee hoặc Org Unit. |
| Hành động | Radio | Có | ON_LEAVE / RESIGNED / INACTIVE / REACTIVATE. |
| Ngày hiệu lực | Ngày | Có | Thời điểm áp dụng. |
| Kế hoạch chuyển giao | Liên kết / Check | Tùy điều kiện | Bắt buộc nếu còn Assignment/trách nhiệm hiệu lực. |
| Lý do | Textarea | Có | Audit. |
| Xác nhận | Nút chính/nguy hiểm | Có | Soft deactivate; không hard-delete dữ liệu lịch sử. |

### Màn hình 33.8: Lịch sử cơ cấu tổ chức

**Loại màn hình:** Timeline / Version history

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Filter | Không | Nhân viên; đơn vị; ngày; loại thay đổi. |
| Timeline | Timeline | Có | Thêm/sửa/đổi cha/đổi lead/chuyển team/nghỉ việc/hoạt động lại. |
| Before / After | Diff | Không | Giá trị cũ và mới. |
| Actor / Time | Chỉ đọc | Có | Ai thay đổi, lúc nào. |
| Effective date | Chỉ đọc | Có | Phân biệt thời điểm nhập và thời điểm nghiệp vụ có hiệu lực. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Người dùng có quyền Nhân sự/Admin; đã có các danh mục chức danh/role cần thiết. |
| Các bước người dùng | Bước 1: Mở 33.1 và xem cây Org Chart.<br>Bước 2: Zoom/pan/expand hoặc tìm kiếm để focus node.<br>Bước 3: Từ menu node tạo/sửa đơn vị, thêm nhân sự hoặc đổi lead.<br>Bước 4: Khi chuyển đơn vị/manager dùng 33.5/33.6 và nhập effective date.<br>Bước 5: Nghỉ việc/ngừng đơn vị dùng 33.7; không xóa vật lý record đã có lịch sử.<br>Bước 6: Chọn `Xem tại ngày` để kiểm tra cơ cấu lịch sử.<br>Bước 7: Dùng 33.8 để audit toàn bộ thay đổi. |

---

# FR34 - Phân công tòa / phòng và nguồn Data Scope vận hành

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Nhân sự/Vận hành  
**Nguồn:** SRC-02; P3; FR02; FR33

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Nhân sự/Admin; Leader Vận hành chỉ quản lý Assignment trong nhánh/phạm vi được cấp. |
| Assignment source | Phân công tòa/phòng là nguồn chính của `ASSIGNED_BUILDINGS/ASSIGNED_ROOMS` trong FR02. |
| Loại trách nhiệm | Tối thiểu tách: vận hành, nhắc thu, thu thực tế, kỹ thuật, vệ sinh, sale; một tòa có thể có nhiều loại trách nhiệm nhưng từng loại phải có owner rõ. |
| Effective period | Mọi assignment có `effective_from/effective_to`; không ghi đè lịch sử. |
| Manager scope | Manager được truy cập dữ liệu nghiệp vụ của các tòa/phòng có assignment hiệu lực với loại trách nhiệm phù hợp. |
| Leader scope | Leader được xem assignment của nhân sự thuộc `ORG_SUBTREE` của mình và dữ liệu các tòa/phòng nằm trong scope của nhánh. Không tự động có quyền xem assignment của nhánh Leader khác. |
| Cross-team restriction | Không cho Leader A gán hoặc xem chi tiết Assignment của nhân sự Leader B nếu FR02 không cấp quyền/scope phù hợp. |
| Historical scope | Report/Payroll/Performance kỳ cũ phải resolve Assignment tại kỳ đó, không dùng assignment hiện tại. |
| Conflict | Hệ thống phải cảnh báo hoặc chặn khi một responsibility type không cho phép nhiều owner hiệu lực trùng nhau trên cùng phạm vi. Exact policy theo loại trách nhiệm có thể cấu hình. |
| Transfer | Chuyển tòa/phòng sang người khác phải kết thúc assignment cũ và tạo assignment mới từ ngày hiệu lực; không sửa record lịch sử. |
| API impact | Tất cả query nghiệp vụ theo tòa/phòng phải dùng scope đã resolve từ FR02/FR34 trước khi trả dữ liệu. |
| Tác động | Assignment quyết định quyền dữ liệu vận hành, số tòa/phòng phụ trách, hiệu suất/lương, dashboard và report theo manager/leader. |

## 2. Mô tả màn hình

### Màn hình 34.1: Danh sách Phân công

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Xem tại ngày | Date picker | Có | Hiển thị Assignment hiệu lực tại ngày. |
| Bộ lọc | Filter | Không | Leader/team; nhân viên; tòa; phòng; loại trách nhiệm; trạng thái. |
| Bảng | Grid | Có | Nhân viên; Leader; đơn vị; tòa/phòng; responsibility type; effective from/to; trạng thái. |
| Data scope preview | Badge/Link | Không | Cho biết assignment này đóng góp tòa/phòng nào vào FR02 Effective Access. |
| Thêm mới | Nút | Theo quyền | Mở 34.2. |

### Màn hình 34.2: Tạo / Sửa Assignment

**Loại màn hình:** Form

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Nhân viên | Employee picker | Có | Chỉ chọn nhân sự nằm trong org scope người thao tác. |
| Tòa | Building picker | Có | Chỉ chọn tòa người thao tác có quyền phân công. |
| Phòng | Multi-select | Không | Nếu assignment chi tiết tới phòng. |
| Responsibility type | Select | Có | OPS / COLLECTION / TECH / CLEANING / SALES / loại được cấu hình. |
| Effective from | Date | Có | Ngày bắt đầu. |
| Effective to | Date | Không | Ngày kết thúc nếu biết. |
| Ghi chú/lý do | Textarea | Không | Lý do phân công/điều chuyển. |
| Kiểm tra xung đột | Nút/Auto | Có | Kiểm tra overlap, duplicate, scope và policy owner. |
| Lưu | Nút | Có | Tạo version/assignment mới. |

### Màn hình 34.3: Điều chuyển Tòa / Phòng

**Loại màn hình:** Wizard / Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Từ nhân viên | Chỉ đọc | Có | Owner hiện tại. |
| Đến nhân viên | Picker | Có | Chỉ trong org scope hợp lệ trừ khi Admin. |
| Tòa/phòng | Select | Có | Phạm vi chuyển. |
| Responsibility | Select | Có | Loại trách nhiệm. |
| Ngày hiệu lực | Date | Có | End assignment cũ + start assignment mới. |
| Ảnh hưởng | Bảng | Có | Dashboard, collection, payroll, report, open tasks. |
| Xác nhận | Nút | Có | Commit transfer có audit. |

### Màn hình 34.4: Assignment History

**Loại màn hình:** Timeline / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Nhân viên / Tòa / Phòng | Filter | Không | Tra cứu lịch sử. |
| Timeline | Bảng | Có | Owner, leader/team, responsibility, from/to, actor, reason. |
| Permission impact | Chỉ đọc | Không | Scope đã được cấp tại từng thời điểm. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có nhân viên/Org Chart FR33 và user có quyền quản lý Assignment trong scope. |
| Các bước người dùng | Bước 1: Chọn `Xem tại ngày` ở 34.1.<br>Bước 2: Tạo assignment 34.2; hệ thống validate org scope + building scope.<br>Bước 3: Nếu điều chuyển dùng 34.3 để đóng record cũ/mở record mới theo effective date.<br>Bước 4: FR02 cập nhật Effective Access cho request sau đó.<br>Bước 5: 34.4 dùng audit và resolve lịch sử cho Payroll/Report. |

---

# FR35 - Dữ liệu lương vận hành và phân bổ chi phí lương theo tòa

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Tiền lương  
**Nguồn:** SRC-03; SRC-05; SRC-04; SRC-07; FR24/25/34; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | HR/Nhân sự lương/Kế toán/Admin; nhân viên chỉ xem phần được cấp quyền. |
| Input | Phase 1 dùng **Performance Snapshot FR25** đã xác nhận; không tự tính lại A/B/C bằng logic khác trong Payroll. |
| Mức lương/phòng | `Performance Rate + tenure/category → salary policy band → salary per room`; policy phải có version/effective date. |
| Ví dụ nguồn | Nguồn có ví dụ HS 91%, NVVH trên 1 năm: `91 × 110.000 / 90 = 111.222`. Quy tắc chọn mức trong khoảng bậc (nửa dưới/nửa trên, HS ≥ 100 không chặn trần) xem FR25 — `FIXTURE_CONFIRMED` trên 92/99 dòng bảng lương tháng 8. |
| Cấu phần lương NVVH (SRC-03) | `Thực nhận = Lương cơ bản + Phụ cấp ăn trưa + Phụ cấp xăng xe + Lương trưởng nhóm + Lương hỗ trợ + Σ(Lương tòa)`; `Lương tòa = Mức lương/phòng × Số phòng`. |
| Lương trưởng phòng / trưởng nhóm VH | `Lương trưởng nhóm = 10.000 × tổng số phòng phụ trách` (SRC-03: TPVH 7.740.000 = 774 phòng × 10.000; TNVH 4.080.000 = 408 phòng × 10.000). Số phòng lấy từ Assignment FR34 của nhánh tại ngày chốt, không nhập tay. |
| Lương sửa chữa (SRC-11) | `Lương sửa chữa = Lương cứng + Lương thâm niên + Tiền công theo bảng kê + Hỗ trợ ăn trưa`; tiền công lấy từ tổng `TIỀN CÔNG` các Work Item FR46 của nhân viên trong kỳ (ví dụ A Điệp tháng 8: 7.500.000 + 3.000.000 + 13.300.000 + 700.000 = 24.500.000). Ứng chi theo dõi riêng, không trừ vào chi phí. |
| Lương tòa | Theo tài liệu nguồn: `Lương thực nhận tòa = mức lương/phòng × số phòng` sau khi áp dụng policy/adjustment được duyệt. |
| Payroll Result | Kết quả kỳ phải có snapshot/version; không dùng salary master mới làm thay đổi kỳ đã khóa. |
| Theo bảng lương nguồn | Payroll Phase 1 bám `SRC-03 bảng lương tháng 8.xlsx`: mỗi dòng lương vận hành có `nhân viên + Mã Tòa + Số phòng + DT niêm yết + DT phải thu + M1/M2/M3 + dịch vụ + DT thu thêm + hiệu suất + mức lương/phòng + Tổng`. Dòng `Lương quản lý` (NVVH) của tòa lấy trực tiếp từ các dòng Payroll Result có Mã Tòa. |
| Tổng hợp theo chức danh (sửa v1.9) | Báo cáo lương nhóm chức danh tổng hợp từ Payroll Result. **Trực tiếp theo tòa:** lương quản lý (NVVH theo Mã Tòa), lương vệ sinh, phần `10.000 × số phòng tòa` của TPVH/TNVH, phần theo phòng của kế toán. **Phân bổ theo số phòng (FR28 `ROOM_COUNT`, theo công thức G1):** lương quản lý tổng, phần cố định lương TPVH, lương phó phòng VH, lương nhân viên nguồn, lương NVKD, phần cố định lương kế toán, lương sửa chữa, lương bảo vệ (nếu không gắn tòa). |
| Không double count | Một Payroll Result chỉ được phân bổ một lần vào các building/group report; tổng allocation phải bằng amount được ghi nhận sau rounding hợp lệ. |
| Nhóm dòng báo cáo | Tối thiểu: Lương quản lý; Quản lý tổng; Trưởng phòng vận hành; **Phó phòng vận hành**; Trưởng nhóm vận hành; Nhân viên nguồn; NVKD; Vệ sinh; Kế toán; Sửa chữa; Bảo vệ. |
| Policy status | Salary band: `SOURCE_CONFIRMED`; chọn mức trong bậc và HS ≥ 100: `FIXTURE_CONFIRMED`. Còn OPEN: HS < 70% (phụ cấp 10% của khoản nào), boundary đúng 1 năm, thời hạn áp dụng của các tòa trả lương cố định/phòng. |
| Tòa lương cố định | SRC-03 tháng 8: G12A, G13, G14 trả cố định **100.000/phòng**, không tính theo HS. Hệ thống có cấu hình `FIXED_PER_ROOM` theo tòa + hiệu lực; tòa không cấu hình thì tính theo HS. |
| Tác động | Payroll Result + Payroll Cost Allocation là nguồn `SALARY_COST` của FR38/40. |

## 2. Mô tả màn hình

### Màn hình 35.1: Dữ liệu lương vận hành theo kỳ

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Nhân viên / Tòa | Filter | Có/Không | Lọc payroll. |
| Performance Snapshot | Liên kết | Có | FR25 version đã xác nhận. |
| HS% / Tenure | Chỉ đọc | Có | Input chọn salary band. |
| Salary policy | Chỉ đọc | Có | Version/band áp dụng. |
| Mức lương/phòng | Tiền tệ | Có | Kết quả band/policy. |
| Số phòng | Số | Có | Snapshot phạm vi. |
| Lương tòa / Payroll Result | Tiền tệ | Có | Theo policy version. |
| Adjustment | Bảng | Tùy điều kiện | Khoản điều chỉnh có reason/approver. |
| Trạng thái | Badge | Có | DRAFT / REVIEWED / LOCKED. |

### Màn hình 35.2: Chi tiết Payroll Result

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Formula trace | Cây | Có | FR24 → FR25 → salary band → payroll result. |
| Source trace | Liên kết | Có | Payment/Invoice/Deal/Assignment. |
| Policy version | Chỉ đọc | Có | Performance + salary version. |
| Allocation | Bảng | Có | Tòa, amount, allocation rule version, report period. |
| Report usage | Liên kết | Không | Dòng FR38/40 sử dụng kết quả. |

### Màn hình 35.3: Payroll Cost Mapping theo Tòa / Nhóm báo cáo

**Loại màn hình:** Danh sách / Grid + Preview

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Payroll Result | Tra cứu | Có | Result đã review/lock. |
| Nhóm chức danh báo cáo | Danh sách | Có | MANAGER / GENERAL_MANAGER / OPS_LEAD / SOURCE_STAFF / SALES_STAFF / CLEANING / ACCOUNTING / REPAIR / SECURITY... |
| Building direct | Tra cứu | Tùy điều kiện | Dùng Assignment Snapshot. |
| Mapping source | Danh sách | Tùy điều kiện | `DIRECT` khi Payroll Result có `building_id/Mã Tòa`; `ROOM_COUNT` (FR28, mẫu số = tổng số phòng toàn hệ thống của kỳ) cho các nhóm lương khối chung theo G1. |
| Amount per building | Bảng | Có | Tổng = Payroll Result sau rounding. |
| Version | Chỉ đọc | Có | Allocation version. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | FR25 snapshot đã xác nhận; salary policy tương ứng đã được duyệt cho kỳ. |
| Các bước người dùng | Bước 1: Chọn Performance Snapshot.<br>Bước 2: Resolve salary band/tenure theo version.<br>Bước 3: Tính Payroll Result và review source/formula tại 35.2.<br>Bước 4: Phân bổ 35.3 theo Assignment hoặc allocation rule.<br>Bước 5: Khóa snapshot; FR38/40 chỉ đọc allocation đã khóa. |

---

# FR36 - Kho tài liệu

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Tài liệu  
**Nguồn:** SRC-02; SRC-01; SRC-10; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Người dùng được cấp quyền theo loại tài liệu và đối tượng. |
| Quy tắc chức năng | Tài liệu phải gắn đối tượng nguồn và phiên bản. Thay file tạo phiên bản mới; chứng từ đã dùng không được xóa âm thầm. |
| Tác động | Kho tài liệu cung cấp bằng chứng cho hợp đồng, thu/chi, hoàn cọc, chỉ số, tài sản, bảo trì và OCR. |

## 2. Mô tả màn hình

### Màn hình 36.1: Danh sách Tài liệu

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Tài liệu theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Loại tài liệu; loại đối tượng; tòa/phòng; người tải; trạng thái |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Tài liệu nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Loại hồ sơ; đối tượng liên kết; tòa/phòng; người tải; ngày tải; phiên bản; trạng thái hiệu lực; quyền xem. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Lưu trữ phiên bản theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 36.2: Tạo Tài liệu

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Loại tài liệu; đối tượng/ID liên kết; tòa/phòng; file; hiệu lực từ/đến; ghi chú phiên bản; phạm vi quyền. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 36.3: Chi tiết Tài liệu

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Loại hồ sơ; đối tượng liên kết; tòa/phòng; người tải; ngày tải; phiên bản; trạng thái hiệu lực; quyền xem. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Tài liệu nếu có quyền. |

### Màn hình 36.4: Chỉnh sửa Tài liệu

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Loại tài liệu; đối tượng/ID liên kết; tòa/phòng; file; hiệu lực từ/đến; ghi chú phiên bản; phạm vi quyền. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 36.5: Xác nhận Lưu trữ phiên bản Tài liệu

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Tài liệu đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Lưu trữ phiên bản -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có dữ liệu nền cần thiết và người dùng có quyền với Tài liệu. |
| Các bước người dùng | Bước 1: Mở danh sách 36.1.<br>Bước 2: Tạo 36.2 -> Chi tiết 36.3.<br>Bước 3: Chỉnh sửa 36.4.<br>Bước 4: Lưu trữ phiên bản tại 36.5 khi cần. |

---

# FR37 - Chọn loại báo cáo và bộ lọc chung

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Báo cáo  
**Nguồn:** SRC-04; SRC-07; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin/Kế toán; quản lý được xem trong phạm vi. |
| Quy tắc chức năng | Menu Báo cáo Giai đoạn 1 có đúng hai định nghĩa chính: Báo cáo Tổng và Báo cáo Kinh doanh. Dùng chung bộ lọc nhưng công thức nguồn khác nhau. |
| Tên gọi theo khách | Theo SRC-15: **Báo cáo Tổng = "Báo cáo lợi nhuận dòng tiền"** (lợi nhuận kinh doanh thực thu, gồm cọc mới và mua sắm thiết bị; mẫu = sheet `BÁO CÁO TỔNG`); **Báo cáo Kinh doanh** = sheet `BÁO CÁO KINH DOANH`. UI hiển thị tên theo khách, mã nội bộ giữ `TOTAL/BUSINESS`. |
| Bộ lọc chung | Theo SRC-02/SRC-15: thời gian, tòa, khu vực, NV vận hành, trưởng khu vực, loại nhà T/S/G, cổ đông. |
| Báo cáo hiệu suất | `HS thực tế` / `HS tạm tính` (FR25) là báo cáo con của nhóm "Báo cáo kết quả kinh doanh" theo SRC-02; Phase 1 xem tại FR25. |
| Tác động | Lựa chọn loại báo cáo mở FR38/FR39; drill-down FR40; đối chiếu/xuất FR41. |

## 2. Mô tả màn hình

### Màn hình 37.1: Chọn báo cáo

**Loại màn hình:** Danh sách / Bộ lọc

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Loại báo cáo | Tab / Danh sách chọn | Có | Báo cáo Tổng / Báo cáo Kinh doanh. |
| Kỳ | Tháng/Năm | Có | Hiển thị snapshot/phiên bản/trạng thái khóa. |
| Phạm vi | Bộ lọc | Không | Toàn hệ thống; T/S/G; tòa; khu vực; NV vận hành; trưởng khu vực/leader; cổ đông. |
| Phiên bản dữ liệu | Chỉ đọc | Có | Nguồn, snapshot và thời điểm chốt. |
| Xem | Nút | Có | Mở FR38 hoặc FR39. |
| Xuất | Nút | Không | Chuyển sang FR41 theo loại/kỳ/bộ lọc hiện tại. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có dữ liệu báo cáo trong kỳ. |
| Các bước người dùng | Bước 1: Mở 37.1.<br>Bước 2: Chọn loại, kỳ và phạm vi.<br>Bước 3: Xem -> FR38/FR39; drill-down -> FR40; đối chiếu/xuất -> FR41. |

---

# FR38 - Báo cáo Tổng T/S/G và Report Metric Engine

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Báo cáo  
**Nguồn:** SRC-04 `BÁO CÁO TỔNG THÁNG 8`; SRC-07; SRC-08; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin/Kế toán; quản lý được xem trong phạm vi. |
| Cấu trúc | Báo cáo Tổng giữ bố cục `TỔNG / NHÀ T / NHÀ S / NHÀ G` và thứ tự nhóm chỉ tiêu theo workbook nguồn. |
| Report Engine | Không nhập tay số tổng. Mỗi metric phải có `metric_code`, `source_entity`, `date_basis`, `formula/version`, `report_group`, `business_confirmation_status` và drill-down. |
| Tính theo tòa trước | Metric được tính/allocate theo từng tòa trước, sau đó aggregate về T/S/G/Total. Loại tòa phải resolve theo lịch sử hiệu lực tại kỳ, không lấy `current_type` cho kỳ cũ. |
| Additive metric | Với metric cộng được: `TOTAL = T + S + G`. |
| Ratio metric | Tỷ lệ Total phải tính lại từ tử/mẫu Total; **không average** tỷ lệ T/S/G. |
| Chi phí chung | FR28 Allocation phải hoàn tất trước khi aggregate. |
| Lương | FR35 Payroll Cost Allocation phải hoàn tất trước khi aggregate. |
| Snapshot/Lock | Kỳ lock phải freeze metric-definition version, allocation version, payroll allocation, building type history, share snapshot và metric values. |
| Formula status | Mỗi metric/formula có trạng thái `SOURCE_CONFIRMED`, `FIXTURE_CONFIRMED`, hoặc `NEED_BUSINESS_CONFIRMATION`. `FIXTURE_CONFIRMED` nghĩa là khớp bộ Excel cụ thể, **không tự động trở thành policy toàn hệ thống**. |
| Production freeze | Metric `NEED_BUSINESS_CONFIRMATION` vẫn có thể hiển thị phục vụ đối chiếu nhưng không được coi là formula production đã chốt; snapshot phải ghi rõ status/version. |
| OPEN còn lại | Chỉ còn các policy chưa đủ chứng cứ nguồn: utility lệch kỳ, head-lease tháng lẻ/thuế/phụ phí, thành phần chính thức của `TOTAL_REVENUE`, hoàn cọc trong Business formula, split-payer repair và một số edge nâng cao. Phân bổ chi phí/lương chung đã có phương pháp nguồn `ROOM_COUNT` (FR28). |

### Mapping metric bắt buộc — Báo cáo Tổng

| Metric code | Dòng báo cáo | Nguồn dữ liệu | Quy tắc |
| --- | --- | --- | --- |
| `TOTAL_REVENUE` | Tổng doanh thu | PaymentAllocation (thực thu) + FR26 Refund | **Cơ sở thực thu (v1.9):** `TOTAL_REVENUE = Σ tiền khách đã đóng cho nghĩa vụ của kỳ (cột "Tổng đã đóng link") − Hoàn cọc thực chi của kỳ`. Bằng chứng G1: `C2 = 'HĐ T8.26'!AX2 − C7` (AX = Tổng đã đóng link); cùng công thức ở tháng 2, 4, 6, 7. Tiền đã đóng gồm cả cọc mới, nợ cũ, thu khác được thu trong kỳ. **Không** bằng tổng các dòng doanh thu tiền phòng/dịch vụ (các dòng đó tính theo hóa đơn) — UI phải ghi chú để người xem không cộng tay. `FIXTURE_CONFIRMED`; danh sách included/excluded chính thức vẫn cần khách xác nhận (C-07). |
| `NEW_DEPOSIT` | Cọc phòng mới | FR31/FR11/Contract obligation | Tổng nghĩa vụ cọc của các lượt thuê `NEW_ROOM` trong kỳ (dòng hiển thị theo SRC-04/G1, ví dụ G1 tháng 8: P203 4.100.000; P601 3.900.000). |
| `NEW_DEPOSIT_COLLECTED` | Cọc phòng mới đã thu | PaymentAllocation loại `CỌC` của `NEW_ROOM` | Dùng trong công thức Business (cùng cơ sở thực thu với `TOTAL_REVENUE`). Fixture G1 tháng 6/7/8: 5/5 phòng mới đã đóng đủ (`Đã đóng ≥ Cần đóng`) nên `NEW_DEPOSIT_COLLECTED = NEW_DEPOSIT`. |
| `FORFEITED_DEPOSIT` | Cọc khách bỏ không ở | FR31 settlement/event | Cọc được xác nhận giữ lại khi khách không nhận phòng; không tăng NEW_ROOM. |
| `REFUND_AMOUNT` | Hoàn cọc | FR26 Refund Payment | Tổng **thực chi hoàn cọc** theo `refund_date`/kỳ được duyệt. |
| `EARLY_TERMINATION_COUNT` | Phòng phá HĐ | Contract Event | Count `EARLY_TERMINATION` theo `notice_date` (ngày khách báo phá HĐ). |
| `NEW_ROOM_COUNT` | Phòng mới | FR11 Event | Count `NEW_ROOM` trong kỳ. |
| `VACANT_ROOM_COUNT` | Phòng trống | Room Status History | Dashboard/report vận hành tách 3 nhóm: `VACANT_READY_NOW`, `VACANT_END_OF_MONTH`, `WAITING_AVAILABLE`; tổng hiển thị = tổng 3 nhóm nếu cần. |
| `RENT_REVENUE` | Doanh thu tiền phòng | Invoice Line + PREPAID_RENT (cơ sở ghi nhận tháng) | `Σ tiền phòng **1 tháng** của các lượt thuê trong kỳ − phòng phá HĐ trong kỳ + tiền phòng tháng đầu của phòng mới`; **không phụ thuộc `Kỳ TT`** (tháng đóng 3 tháng vẫn chỉ ghi nhận 1 tháng; tháng `Kỳ TT = 0` vẫn ghi nhận 1 tháng từ `PREPAID_RENT`). Bằng chứng G1: `C12 = 'HĐ T8'!I2 − I17 + 'PHÒNG MỚI THÁNG 8'!H18` — cột `I` là giá 1 tháng, không nhân cột `E` (Kỳ TT); dòng 17 = 601G1 "kh phá hd". Tiền thu trước nhiều tháng vẫn nằm trong `TOTAL_REVENUE` (cơ sở thực thu) của tháng thu. |
| `ELECTRIC_REVENUE` | Doanh thu điện | Invoice Line + Settlement | `Σ dòng ELECTRIC − dòng điện của phòng phá HĐ + Σ dòng ĐIỆN CHUNG + tiền điện thu trong phiếu hoàn cọc/quyết toán`. Bằng chứng G1: `C13 = 'HĐ T8'!T2 − T17 + AT2 (Điện chung) + 'HOÀN CỌC'!S9`. |
| `WATER_REVENUE` | Doanh thu nước | Invoice Line | `Σ dòng WATER (METER hoặc theo người) − phòng phá HĐ + phòng mới`. Bằng chứng G1 `C14`. |
| `CLEANING_REVENUE` | Doanh thu vệ sinh | Invoice Line | `Σ dòng CLEANING + 50% dòng COMBO ("DV Combo / DV khác")`. Bằng chứng G1: `C15 = (AQ2 − AQ17)/2 + PHÒNG MỚI!AP18/2` (AQ = DV khác); đúng ở mọi tháng G1. |
| `INTERNET_REVENUE` | Doanh thu mạng | Invoice Line | Sum service `INTERNET`. |
| `ELECTRIC_VEHICLE_REVENUE` | Xe điện | Invoice Line | Σ dòng xe (cột `XE ĐIỆN`, in trên hóa đơn là "DV Gửi xe"). |
| `ELEVATOR_REVENUE` | Thang máy | Invoice Line | Sum service tương ứng. |
| `WASHING_REVENUE` | Máy giặt | Invoice Line | `Σ dòng WASHING + 50% dòng COMBO`. Bằng chứng G1: `C19` = cùng công thức `C15`. |
| `SERVICE_REVENUE` | Tổng doanh thu dịch vụ | Metric tổng hợp | Sum các service revenue metric ở trên. Mỗi Invoice Line chỉ được quy vào metric **một lần** theo bảng `Service → Report Metric Mapping` (có version); dòng COMBO tách 50/50 không làm tăng tổng. |
| `HEAD_LEASE_COST` | Tiền thuê nhà 1 tháng | FR07 `HEAD_LEASE_COST_RECOGNITION` → FR06 version | Chỉ lấy dòng monthly recognition `Confirmed/Locked`; Payment Schedule 3/4/6 tháng là cash flow, không phải nguồn P&L trực tiếp. <span style="color:#CC0000">OPEN: tháng lẻ/thuế/phụ phí và auto-accrual policy.</span> |
| `EQUIPMENT_PURCHASE_COST` | Mua sắm thêm thiết bị | FR27 + FR45 | Expense category `Mua thêm thiết bị`; tránh double count Asset. |
| `ELECTRIC_INPUT_COST` | Giá gốc Điện | FR09 Supplier Bill → FR27.3 | Expense/input cost của đúng Tòa+Kỳ; drill tới Bill/HĐ tiện ích/chứng từ. |
| `WATER_INPUT_COST` | Giá gốc Nước | FR09 Supplier Bill → FR27.3 | Expense/input cost của đúng Tòa+Kỳ; drill tới Bill/HĐ tiện ích/chứng từ. |
| `INTERNET_INPUT_COST` | Giá gốc Mạng | FR09 Supplier Bill → FR27.3 | Expense/input cost của đúng Tòa+Kỳ; drill tới Bill/HĐ tiện ích/chứng từ. |
| `GARBAGE_COST` | Phí thu rác | FR27.3 | `Phí rác`. |
| `ENVIRONMENT_COST` | Phí môi trường | FR27.3 | `Phí môi trường`. |
| `ELEVATOR_MAINT_COST` | Phí bảo trì thang máy | FR27.3/FR46 | `Bảo trì thang máy`. |
| `COGS` | Giá vốn | Metric tổng hợp | Tổng các metric giá vốn được duyệt; fixture G1 tương ứng nhóm dòng giá vốn nguồn. |
| `SALARY_COST` | Nhóm lương | FR35 | Sum Payroll Cost Allocation theo tòa/kỳ, giữ được group chức danh; dòng trực tiếp theo Mã Tòa + dòng khối chung phân bổ `ROOM_COUNT` (FR28). |
| `OFFICE_COST` | Thuê & DV VP | FR27/28 | Expense chung → Allocation `ROOM_COUNT` (G1 `C45 = (Thuê&DV VP/1382)*15`). |
| `MARKETING_COST` | Phí marketing | FR27/28 + FR32 | Phần chung phân bổ `ROOM_COUNT` (G1 `C46`) + hoa hồng trực tiếp theo phòng (G1 `C47`, `C48`). |
| `COMMISSION_COST` | Hoa hồng | FR32 → FR27 | Hoa hồng đã duyệt/import, liên kết Deal và Expense một lần. |
| `OPERATING_FIXED_COST` | Chi phí cố định | Expense/Payroll source | Theo SRC-15: chính là nhóm `Chi phí vận hành` trong báo cáo nhà (các dòng lương vận hành/chức danh, thuê & DV VP...). |
| `INCIDENTAL_SELLING_COST` | Chi phí phát sinh | Expense source | Theo SRC-15/workbook: nhóm `Chi phí bán hàng phát sinh`, gồm Marketing/Hoa hồng, sửa chữa/thay thế/bảo trì, chi phí khác theo tòa. |
| `REPAIR_COST` | Sửa chữa/thay thế/bảo trì | FR46 Work Item → FR27 | Chỉ phần `COMPANY` chịu; drill được labor/material/payer và chứng từ; phần khách chịu/trừ cọc không double count. |
| `OTHER_COST` | Chi phí khác | FR27 | Category được map vào nhóm CPK. |
| `OPERATING_SELLING_COST` | Tổng CPBH | Metric tổng hợp | Sum các dòng chi phí vận hành/bán hàng được map. |
| `TOTAL_COST` | Tổng chi phí | Metric formula | `COGS + OPERATING_SELLING_COST`. |
| `GROSS_PROFIT` | Lợi nhuận gộp | Metric formula | `TOTAL_REVENUE - COGS`. |
| `NET_PROFIT` | Lợi nhuận ròng | Metric formula | `TOTAL_REVENUE - TOTAL_COST`. |

### Service → Report Metric Mapping (v1.9, theo G1; versioned)

| Dòng hóa đơn (FR18) | Metric báo cáo Tổng/Kinh doanh (G1) | Âm/dương điện nước (SRC-12/13) |
| --- | --- | --- |
| Điện (METER) | `ELECTRIC_REVENUE` | THU điện |
| Điện chung | `ELECTRIC_REVENUE` | THU điện |
| Nước (METER / theo người) | `WATER_REVENUE` | THU nước |
| DV Vệ sinh | `CLEANING_REVENUE` | — |
| DV Internet | `INTERNET_REVENUE` | — |
| DV Thang máy | `ELEVATOR_REVENUE` | Nhóm "thang máy + máy sấy + xe điện" |
| DV Gửi xe / sạc xe điện | `ELECTRIC_VEHICLE_REVENUE` | Nhóm "thang máy + máy sấy + xe điện" |
| Máy giặt / máy sấy | `WASHING_REVENUE` | Máy giặt: ½ vào THU điện, ½ vào THU nước; máy sấy: nhóm thang máy |
| DV Combo / DV khác | 50% `CLEANING_REVENUE` + 50% `WASHING_REVENUE` | Phần máy giặt (50%) chia ½ điện, ½ nước |

> <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION (C-22):</span> các sheet `BC DT THÁNG 8 NHÀ T/S/G` lại gộp "thang máy / dv khác / điện chung" thành một dòng, khác G1. Mặc định theo G1 (Golden Dataset); mapping là cấu hình có version để đổi khi khách chốt.

### Các tỷ lệ quản trị

| Metric | Formula | Trạng thái |
| --- | --- | --- |
| `NET_MARGIN` / LNR-DT | `NET_PROFIT / TOTAL_REVENUE` | CONFIRMED |
| `GROSS_MARGIN` / LNG-DT | `GROSS_PROFIT / TOTAL_REVENUE` | CONFIRMED |
| `NET_PROFIT_OVER_COGS` / LNR-GV | `NET_PROFIT / COGS` | CONFIRMED |
| `NET_PROFIT_OVER_GROSS_PROFIT` / LNR-LNG | `NET_PROFIT / GROSS_PROFIT` | CONFIRMED |
| `TOTAL_COST_OVER_GROSS_PROFIT` / CP-LNG | `TOTAL_COST / GROSS_PROFIT` | CONFIRMED |
| `COGS_OVER_REVENUE` / GV-DT | `COGS / TOTAL_REVENUE` | CONFIRMED |
| `OPERATING_SELLING_COST_OVER_REVENUE` / CPBH-DT | `OPERATING_SELLING_COST / TOTAL_REVENUE` | CONFIRMED |
| `TOTAL_COST_OVER_REVENUE` / TCP-DT | `TOTAL_COST / TOTAL_REVENUE` | CONFIRMED |
| `SALARY_OVER_OPERATING_SELLING_COST` | `SALARY_GROUP / OPERATING_SELLING_COST` | CONFIRMED structure |
| `HH_OVER_OPERATING_SELLING_COST` | `HH_MARKETING_GROUP / OPERATING_SELLING_COST` | BUSINESS_CONFIRMED: `HH_MARKETING_GROUP` gồm Hoa hồng + Marketing theo mapping category; không double-count Commission nếu Commission đã nằm trong group. |
| `OTHER_COST_OVER_OPERATING_SELLING_COST` | `OTHER_COST_GROUP / OPERATING_SELLING_COST` | CONFIRMED structure |
| `SERVICE_REVENUE_OVER_INPUT_COST` | DT DV / GIÁ NHẬP | `SERVICE_REVENUE_ACTUAL / SERVICE_INPUT_COST`; `SERVICE_INPUT_COST = ELECTRIC_INPUT + WATER_INPUT + INTERNET_INPUT + GARBAGE + ENVIRONMENT + ELEVATOR_MAINT + CLEANING_SALARY`. |

| `RENT_REVENUE_OVER_HEAD_LEASE` | `RENT_REVENUE / HEAD_LEASE_COST` | CONFIRMED |

### Formula Status / Freeze Matrix

| Nhóm | Trạng thái hiện tại | Production rule |
| --- | --- | --- |
| `TOTAL_COST = COGS + CPBH` | SOURCE/FIXTURE CONFIRMED | Có thể freeze sau rounding/allocation sign-off. |
| `GROSS_PROFIT = TOTAL_REVENUE - COGS` | SOURCE/FIXTURE CONFIRMED | Có thể freeze khi TOTAL_REVENUE được xác nhận. |
| `NET_PROFIT = TOTAL_REVENUE - TOTAL_COST` | SOURCE/FIXTURE CONFIRMED | Có thể freeze khi TOTAL_REVENUE được xác nhận. |
| T/S/G additive | SOURCE_CONFIRMED về cấu trúc | Tính từng tòa trước rồi sum; ratio tính lại từ tử/mẫu. |
| `TOTAL_REVENUE` composition | FIXTURE_CONFIRMED (cơ sở thực thu − hoàn cọc); danh sách khoản: NEED_BUSINESS_CONFIRMATION | Golden fixture được giữ để UAT; cần khách xác nhận danh sách khoản included/excluded chính thức. |
| `VACANT_ROOM_COUNT` | Cấu trúc 3 nhóm: BUSINESS_CONFIRMED; định nghĩa từng nhóm: NEED_BUSINESS_CONFIRMATION | Tách 3 nhóm trống ở luôn / trống hết tháng / đang chờ; chờ định nghĩa điều kiện từng nhóm. |
| `EARLY_TERMINATION_COUNT` date basis | BUSINESS_CONFIRMED | Dùng `notice_date` — ngày khách báo phá HĐ. |
| `HH/CPBH` | BUSINESS_CONFIRMED | `HH_MARKETING_GROUP / CPBH`, group gồm Hoa hồng + Marketing theo category mapping. |
| `DT DV/GIÁ NHẬP` | SOURCE/BUSINESS_CONFIRMED | Doanh thu dịch vụ thực tế / Giá gốc dịch vụ; giá gốc gồm Điện + Nước + Mạng + Rác + Môi trường + Bảo trì thang máy + Lương vệ sinh. |
| Utility input accounting period | NEED_BUSINESS_CONFIRMATION | Cần chốt service period/document period/payment period. |
| Head Lease tháng lẻ/thuế/phụ phí | NEED_BUSINESS_CONFIRMATION | Dữ liệu đã capture nhưng recognition policy chưa freeze. |
| Expense/Payroll theo tòa | FIXTURE_CONFIRMED (G1) | Expense và Payroll line có `building_id/Mã Tòa` dùng trực tiếp. Chi phí/lương khối chung (quản lý tổng, TPVH/phó phòng phần cố định, NV nguồn, NVKD, kế toán, sửa chữa, VP, marketing chung) phân bổ `ROOM_COUNT` qua FR28. |
| Precision / hiển thị | BUSINESS_CONFIRMED | Giữ nguyên precision của dữ liệu/công thức nguồn trong tính toán và snapshot; không làm tròn nghiệp vụ để thay đổi giá trị. UI/XLSX chỉ format số hiển thị theo template. |

## 2. Mô tả màn hình

### Màn hình 38.1: Báo cáo Tổng

**Loại màn hình:** Bảng báo cáo

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ | Tháng/Năm | Có | Kỳ/snapshot báo cáo. |
| Phạm vi | Bộ lọc | Không | Toàn hệ thống, T/S/G, tòa, khu vực, quản lý, leader. |
| Cột báo cáo | Bảng | Có | `TỔNG`, `NHÀ T`, `NHÀ S`, `NHÀ G`. |
| Nhóm Doanh thu | Bảng | Có | Tổng DT; cọc/hoàn; số phòng; DT phòng; từng DT dịch vụ. |
| Nhóm Giá vốn | Bảng | Có | Thuê nhà, thiết bị, giá gốc dịch vụ, COGS. |
| Nhóm CPBH/Vận hành | Bảng | Có | Lương theo nhóm, VP, Marketing, HH, Repair, Other, CPBH. |
| Nhóm Kết quả | Bảng | Có | Tổng chi phí, LNG, LNR và tỷ lệ. |
| Trạng thái metric | Badge | Có | SOURCE_CONFIRMED / BUSINESS_CONFIRMED / FIXTURE_CONFIRMED / NEED_BUSINESS_CONFIRMATION. |
| Drill-down | Link trên giá trị | Có | Mở FR40 hoặc giao dịch nguồn theo metric/phạm vi. |

### Màn hình 38.2: Metric Detail / Source Mapping

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Metric definition | Chỉ đọc | Có | code, label, formula, date basis, version và `SOURCE_CONFIRMED/FIXTURE_CONFIRMED/NEED_BUSINESS_CONFIRMATION`. |
| Total/T/S/G | Bảng | Có | Giá trị theo từng scope. |
| Building contribution | Bảng | Có | Từng tòa đóng góp bao nhiêu. |
| Source entity | Liên kết | Có | Invoice Line / Expense / Allocation / Payroll / Event / Refund. |
| Formula trace | Cây công thức | Tùy điều kiện | Hiển thị tử/mẫu/metric con. |
| Diff với Excel | So sánh | Không | Link FR41. |

### Màn hình 38.3: Snapshot / Lock Report

**Loại màn hình:** Popup / Workflow

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Status | Danh sách | Có | OPEN → REVIEWING → LOCKED; REOPENED theo quyền đặc biệt. |
| Metric version | Chỉ đọc | Có | Formula version được freeze. |
| Allocation version | Chỉ đọc | Có | Expense + Payroll allocation. |
| Người / Thời điểm lock | Chỉ đọc | Tùy điều kiện | Audit. |
| Cảnh báo OPEN metric | Danh sách | Có | Không cho coi OPEN metric là confirmed một cách im lặng. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Dữ liệu invoice/event/expense/payroll/allocation của kỳ đã đủ theo phạm vi. |
| Các bước người dùng | Bước 1: Chọn kỳ/scope.<br>Bước 2: Report Engine tính metric từng tòa từ source data.<br>Bước 3: Aggregate T/S/G/Total; tính lại ratio từ numerator/denominator.<br>Bước 4: Click bất kỳ metric để xem 38.2/FR40.<br>Bước 5: FR41 đối chiếu Golden Dataset.<br>Bước 6: Sau review có quyền mới khóa snapshot 38.3. |

---

# FR39 - Báo cáo Kinh doanh và TOTAL↔BUSINESS Inclusion Matrix

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Báo cáo  
**Nguồn:** SRC-04 `BÁO CÁO KINH DOANH THÁNG 8`; SRC-07; SRC-08; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin/Kế toán; quản lý xem trong Data Scope. |
| Formula Set riêng | Báo cáo Kinh doanh dùng cùng base source metrics với FR38 nhưng chạy `BUSINESS formula set`; không lấy Báo cáo Tổng rồi ẩn dòng. |
| Inclusion Matrix | Mỗi metric phải có riêng `display_in_total`, `included_in_total_formula`, `display_in_business`, `included_in_business_formula`, `difference_reason_code`, `status`, `formula_version`. |
| Cọc phòng mới | BUSINESS_CONFIRMED: Báo cáo Kinh doanh vẫn hiển thị `NEW_DEPOSIT` nhưng **không cộng vào BUSINESS_REVENUE**. Vì `TOTAL_REVENUE` là cơ sở thực thu (v1.9), phần trừ dùng `NEW_DEPOSIT_COLLECTED`: `BUSINESS_REVENUE = TOTAL_REVENUE − NEW_DEPOSIT_COLLECTED`. Fixture tháng 8 hai số bằng nhau (371.850.000). Nếu cọc chưa thu đủ, Bridge hiển thị chênh `NEW_DEPOSIT − NEW_DEPOSIT_COLLECTED`. |
| Mua thiết bị | BUSINESS_CONFIRMED: `EQUIPMENT_PURCHASE_COST` bị loại khỏi Business COGS; dòng Business = 0 theo rule hiện hành. |
| Hoàn cọc | <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION (sửa v1.9).</span> SRC-02/SRC-15 ghi Báo cáo Kinh doanh "không gồm cọc mới, hoàn cọc, mua sắm TB", nhưng workbook tháng 8 cho `BUSINESS_REVENUE = TOTAL_REVENUE − NEW_DEPOSIT` (6.664.406.236 = 7.036.256.236 − 371.850.000), trong khi `TOTAL_REVENUE` đã trừ hoàn cọc (G1 `C2`). Tức workbook **vẫn trừ hoàn cọc** trong Báo cáo Kinh doanh. Mặc định formula version `BUSINESS_V1_WORKBOOK` = theo workbook (khớp Golden Dataset). Chuẩn bị sẵn version `BUSINESS_V2_EXCLUDE_REFUND` (cộng lại hoàn cọc vào Business Revenue) để bật khi khách xác nhận. |
| Khấu hao thiết bị | SRC-02/SRC-15: Báo cáo Kinh doanh không gồm mua sắm thiết bị; workbook tháng 8 để dòng thiết bị = 0 và chưa có dòng khấu hao. Phase 1 giữ = 0; khấu hao thiết bị là policy riêng (FR45/FR57) khi được xác nhận. |
| Shared source | Rent/service/deposit/refund/expense/payroll dùng cùng source transaction với FR38; không tạo hai bộ dữ liệu nguồn. |
| Bridge | Mọi chênh Total↔Business phải giải thích được bằng metric + inclusion flag + reason + formula version. |
| Không suy từ tên dòng | Không mặc định `Marketing`, `Hoa hồng`, `HH` là một hay khác nhau chỉ dựa tên; phải map theo metric definition/business sign-off. |
| Production freeze | Chỉ lock BUSINESS snapshot khi các metric bắt buộc có status được chấp nhận; OPEN metric phải hiển thị cảnh báo. |

### TOTAL vs BUSINESS Inclusion Matrix

Công thức đã chốt:

```text
BUSINESS_REVENUE = TOTAL_REVENUE - NEW_DEPOSIT_COLLECTED   (fixture tháng 8: = NEW_DEPOSIT)

BUSINESS_EQUIPMENT_PURCHASE_COST = 0

BUSINESS_COGS
= TOTAL_COGS - EQUIPMENT_PURCHASE_COST
```

Các metric khác dùng cùng source với Total trừ khi có một rule Business riêng được versioned.



| Metric / nhóm | Total display | Total included | Business display | Business included | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| `NEW_DEPOSIT` | Có | Theo TOTAL formula version | Có | **Excluded khỏi Business Revenue** | BUSINESS_CONFIRMED |
| `FORFEITED_DEPOSIT` | Có | Theo formula version | Có | Chưa hard-code ngoài fixture | NEED_BUSINESS_CONFIRMATION |
| `REFUND_AMOUNT` | Có | Trừ trong TOTAL_REVENUE (G1 `C2`) | Có | V1 (mặc định, theo workbook): vẫn trừ như Total; V2: cộng lại (loại khỏi Business) | NEED_BUSINESS_CONFIRMATION |
| `RENT_REVENUE` | Có | Có | Có | Có | SOURCE/FIXTURE CONFIRMED |
| Service revenue | Có | Có | Có | Có | SOURCE/FIXTURE CONFIRMED |
| `EQUIPMENT_PURCHASE_COST` | Có | Theo Total COGS version | Có/giữ line theo template | **0 / Excluded khỏi Business COGS** | BUSINESS_CONFIRMED |
| Payroll/VP/Marketing/Repair/Other | Có | Có theo mapping | Có | Có theo mapping | Theo metric status |
| `COMMISSION_COST` | Có nếu template/policy yêu cầu | Theo mapping | Có nếu template/policy yêu cầu | Theo mapping | NEED_BUSINESS_CONFIRMATION nếu chưa xác định quan hệ với `HH/CPBH` |

> Matrix là cấu hình/versioned business rule, không phải cờ tùy chỉnh tự do theo từng lần chạy report.

## 2. Mô tả màn hình

### Màn hình 39.1: Báo cáo Kinh doanh

**Loại màn hình:** Bảng báo cáo

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Scope | Bộ lọc | Có | Toàn hệ thống/T-S-G/tòa. |
| Bảng chỉ tiêu | Bảng | Có | Tương thích workbook để đối chiếu line-by-line. |
| Formula Set | Badge | Có | BUSINESS + version. |
| Formula Status | Badge | Có | SOURCE_CONFIRMED / FIXTURE_CONFIRMED / NEED_BUSINESS_CONFIRMATION. |
| Bridge với Tổng | Bảng | Có | Metric; Total; Business; Difference; inclusion flag; reason. |
| Drill-down | Link | Có | Cùng source chain với FR38/40. |

### Màn hình 39.2: Inclusion / Difference Detail

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Metric | Chỉ đọc | Có | code/label. |
| TOTAL | Chỉ đọc | Có | display/included/formula/value. |
| BUSINESS | Chỉ đọc | Có | display/included/formula/value. |
| Difference reason | Chỉ đọc | Có | NEW_DEPOSIT_EXCLUDED / EQUIPMENT_EXCLUDED / rule được duyệt... |
| Formula status/version | Chỉ đọc | Có | Trạng thái chứng cứ + version. |
| Source trace | Liên kết | Có | Cùng transaction nguồn. |

### Màn hình 39.3: Cấu hình Formula Set đã duyệt

**Loại màn hình:** Version detail / Admin-Kế toán có quyền

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Formula version | Chỉ đọc | Có | Version. |
| Effective period | Kỳ/ngày | Có | Hiệu lực. |
| Inclusion Matrix | Bảng | Có | Metric + flags + reason + status. |
| Approval/sign-off | Chỉ đọc | Có | Người/phê duyệt/tài liệu xác nhận. |
| Lock | Nút | Theo quyền | Khóa version; không sửa đè version đã dùng. |

### Màn hình 39.4: Xuất Báo cáo Kinh doanh

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Snapshot | Chỉ đọc | Có | Bản report đang xuất. |
| Định dạng | Danh sách | Có | XLSX/mẫu nguồn. |
| Formula version | Chỉ đọc | Có | BUSINESS version. |
| Xuất | Nút chính | Có | Xuất cùng metadata formula/status. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Base metrics FR38 đã tính; BUSINESS Inclusion Matrix/version đã được cấu hình cho kỳ. |
| Các bước người dùng | Bước 1: Tính base metric từ source.<br>Bước 2: Apply Inclusion Matrix BUSINESS.<br>Bước 3: Xem Bridge Total↔Business.<br>Bước 4: Metric OPEN phải được gắn warning, không âm thầm coi là confirmed.<br>Bước 5: Drill source/FR40 và reconcile FR41.<br>Bước 6: Lock/export snapshot với formula version. |

---

# FR40 - Báo cáo chi tiết theo tòa / Golden Fixture G1

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Báo cáo  
**Nguồn:** SRC-04 các sheet báo cáo theo tòa; SRC-07 `G1`; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Người dùng chỉ xem tòa trong data scope được cấp. |
| Vai trò | Đây là **drill-down chi tiết theo tòa** của FR38/FR39, không phải loại báo cáo thứ ba. |
| Cấu trúc nguồn | Màn hình phải thể hiện đủ các nhóm dòng của mẫu `Báo cáo tháng 6`: Doanh thu; Cọc/Hoàn; Số phòng; DT phòng; DT dịch vụ; Thuê nhà/Thiết bị; Giá gốc DV; Giá vốn; Chi phí vận hành/bán hàng; Tổng chi phí; LNG; LNR; Tỷ lệ; và bảng cổ đông của tòa khi có. |
| Cùng Metric Engine | FR40 không tính một công thức riêng độc lập; dùng cùng `metric_definition/version` với FR38/39 nhưng filter `building_id`. |
| Drill-down bắt buộc | Mỗi số phải truy được: `Report → Metric → Building → Source Entity → Source Document`. |
| G1 Golden Dataset | G1 tháng 6 là fixture nghiệm thu line-by-line, không chỉ kiểm tra tổng. |
| Cổ đông | Shareholder table dùng Building Share Snapshot + Capital + Locked Report Metrics; tỷ lệ thay đổi sau kỳ không sửa report đã lock. |

### Dòng báo cáo chi tiết một tòa và nguồn

| Nhóm / Dòng | Nguồn Web | Drill-down |
| --- | --- | --- |
| Tổng doanh thu | FR38/39 Metric Engine | Các metric revenue nguồn |
| Cọc phòng mới | FR31/11 | Event NEW_ROOM → obligation cọc |
| Cọc khách bỏ | FR31 | FORFEITED_DEPOSIT/settlement |
| Hoàn cọc | FR26 | Refund Payment/chứng từ |
| Phòng phá HĐ | FR12/26 | Contract → Contract Event |
| Phòng mới | FR11 | Event NEW_ROOM |
| Phòng trống | FR10 | Room Status History |
| Doanh thu tiền phòng | FR16/17 | Invoice → Invoice Line RENT |
| Điện/Nước/Vệ sinh/Mạng/Xe điện/Thang máy/Máy giặt | FR13/14/16/17 | Invoice → service Invoice Line; meter nếu có |
| Tổng DT dịch vụ | Metric Engine | Sum service metric |
| Tiền thuê nhà | FR06/07/27 | Head Lease/Expense |
| Mua thêm thiết bị | FR27/45 | Expense → Asset nếu có |
| Giá gốc Điện/Nước/Mạng/Rác/Môi trường/Bảo trì TM | FR27.3/FR28 | Expense Allocation → Expense → Attachment |
| Giá vốn | Metric Engine | Các COGS metric con |
| Lương theo chức danh | FR35 | Payroll Cost Allocation → Payroll Result → Employee → Assignment → M5/M10/M15 nếu áp dụng |
| Thuê & DV VP | FR27/28 | Expense/Allocation |
| Marketing | FR27 | Expense Marketing |
| Hoa hồng | FR32/27 | Commission approved → Expense |
| Sửa chữa/Bảo trì | FR27/46 | Expense/Maintenance |
| Chi phí khác | FR27 | Expense category mapping |
| Tổng CPBH | Metric Engine | Sum operating/selling cost metric |
| Tổng chi phí | Metric Engine | COGS + CPBH |
| Lợi nhuận gộp | Metric Engine | Total Revenue − COGS |
| Lợi nhuận ròng | Metric Engine | Total Revenue − Total Cost |
| Tỷ lệ | Metric Engine | Tính từ metric tử/mẫu của đúng tòa |
| Cổ đông/Vốn/LN phân bổ | FR42/43/44 | Share snapshot + Capital + Locked Report |

## 2. Mô tả màn hình

### Màn hình 40.1: Báo cáo chi tiết một tòa

**Loại màn hình:** Trang chi tiết / Bảng P&L

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Loại report / Kỳ / Tòa | Chỉ đọc + Bộ lọc | Có | Giữ context từ FR38/39. |
| Nhóm doanh thu/cọc/phòng | Bảng | Có | Các dòng nguồn theo thứ tự báo cáo. |
| Nhóm doanh thu dịch vụ | Bảng | Có | Điện/nước/vệ sinh/mạng/xe/thang máy/máy giặt/tổng DV. |
| Nhóm giá vốn | Bảng | Có | Thuê nhà, thiết bị, giá gốc từng dịch vụ, COGS. |
| Nhóm chi phí | Bảng | Có | Lương chi tiết, VP, Marketing, HH, Repair, Other, CPBH. |
| Kết quả | Bảng | Có | Total Cost, Gross Profit, Net Profit. |
| Tỷ lệ | Bảng | Có | Các tỷ lệ confirmed và badge OPEN cho metric chưa chốt. |
| Source status | Badge | Có | CONFIRMED / NEED_BUSINESS_CONFIRMATION. |
| Drill-down | Link | Có | Click số để mở 40.2. |

### Màn hình 40.2: Drill-down một Metric của tòa

**Loại màn hình:** Danh sách / Cây nguồn

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Metric definition | Chỉ đọc | Có | code/formula/date basis/version. |
| Source records | Bảng | Có | Invoice Line, Expense, Allocation, Payroll, Event, Refund tùy metric. |
| Source document | Liên kết | Có | PDF/ảnh/chứng từ/file liên quan nếu có. |
| Tổng source | Số | Có | Phải reconcile về metric value sau rule làm tròn. |
| Diff | Số/Badge | Có | 0/MATCH hoặc trạng thái giải thích. |

### Màn hình 40.3: Bảng cổ đông của tòa

**Loại màn hình:** Bảng / Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Cổ đông | Tra cứu/Chỉ đọc | Có | FR42. |
| Tỷ lệ % | Phần trăm | Có | Share Snapshot của kỳ. |
| Vốn | Tiền tệ | Có | Capital component theo rule/report. |
| LN Gộp phân bổ | Tiền tệ | Có | `GROSS_PROFIT × share_percentage`. |
| LN Ròng phân bổ | Tiền tệ | Có | `NET_PROFIT × share_percentage`. |
| LNR/GV, CP/LNG | Tỷ lệ | Tùy điều kiện | Theo metric report nếu mẫu nguồn yêu cầu. |
| Tổng nhận | Tiền tệ | Tùy điều kiện | `Capital component + Net Profit Share` khi đúng rule nguồn. |
| Link | Liên kết | Không | FR42/43/44. |

### Màn hình 40.4: Reconciliation nhanh G1 / tòa fixture

**Loại màn hình:** Bảng so sánh

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Metric | Bảng | Có | Từng line report. |
| Excel | Số | Có | Golden value. |
| System | Số | Có | Report snapshot. |
| Diff / Status | Số + Badge | Có | MATCH/ROUNDING/... |
| Mở FR41 | Link | Không | Xem reconciliation đầy đủ. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Đang xem FR38/39 hoặc chọn trực tiếp một tòa/kỳ có report snapshot. |
| Các bước người dùng | Bước 1: Mở 40.1.<br>Bước 2: Kiểm tra từng nhóm dòng.<br>Bước 3: Click một giá trị → 40.2 và truy tới source document.<br>Bước 4: Nếu tòa có cổ đông → 40.3.<br>Bước 5: Với fixture G1 → 40.4/FR41 và kiểm tra line-by-line.<br>Bước 6: Quay lại FR38/39 giữ nguyên kỳ/scope. |

---

# FR41 - Đối chiếu Web ↔ Excel, Golden Dataset và xuất XLSX

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Báo cáo  
**Nguồn:** SRC-03; SRC-04; SRC-07; SRC-08; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin/QA; người có quyền báo cáo được xuất dữ liệu. |
| Golden Dataset | Tối thiểu dùng `G1 tháng 6` cho báo cáo một tòa và `tháng 8` cho báo cáo Tổng T/S/G. Golden Dataset chứng minh fixture; không tự biến thành policy tổng quát nếu formula còn OPEN. |
| So sánh | Mỗi metric phải có `excel_value`, `system_value`, `difference`, `difference_percent`, `status`, `note` và link drill-down. |
| Status | `MATCH`, `ROUNDING_DIFFERENCE`, `RULE_DIFFERENCE`, `SOURCE_DATA_DIFFERENCE`, `NEED_BUSINESS_CONFIRMATION`. Formula riêng có `SOURCE_CONFIRMED/FIXTURE_CONFIRMED/NEED_BUSINESS_CONFIRMATION`. |
| Tolerance | Count phải khớp tuyệt đối. Tiền dùng tolerance theo rule làm tròn đã duyệt. Percentage dùng tolerance cấu hình. Tolerance không được dùng để che thiếu mapping/source. |
| Source error | Nếu Excel nguồn được xác nhận sai, Web dùng rule đã được BA/khách duyệt và ghi rõ reason; không cố tình làm sai để match. |
| Export | XLSX giữ loại report, kỳ, scope, snapshot/version; dữ liệu và cấu trúc chính phải đủ để đối chiếu với mẫu nguồn. |

### Golden Report A — G1 tháng 6

| Metric | Expected |
| --- | ---: |
| TOTAL_REVENUE | 79,912,000 |
| NEW_DEPOSIT | 3,800,000 |
| FORFEITED_DEPOSIT | 1,000,000 |
| NEW_ROOM_COUNT | 2 |
| EARLY_TERMINATION_COUNT | 3 |
| VACANT_ROOM_COUNT | 1 |
| RENT_REVENUE | 47,760,000 |
| SERVICE_REVENUE | 21,063,333.333 |
| HEAD_LEASE_COST | 48,000,000 |
| EQUIPMENT_PURCHASE_COST | 500,000 |
| ELECTRIC_INPUT_COST | 17,258,594 |
| WATER_INPUT_COST | 300,000 |
| INTERNET_INPUT_COST | 0 |
| GARBAGE_COST | 300,000 |
| COGS | 66,358,594 |
| OPERATING_SELLING_COST | 10,476,125.04 |
| TOTAL_COST | 76,834,719.04 |
| GROSS_PROFIT | 13,553,406 |
| NET_PROFIT | 3,077,280.96 |

### Golden Report B — Tháng 8 toàn hệ thống

| Metric | Expected |
| --- | ---: |
| TOTAL_REVENUE | 7,036,256,236 |
| T | 2,527,702,129 |
| S | 3,551,745,507 |
| G | 956,808,600 |
| NEW_DEPOSIT | 371,850,000 |
| FORFEITED_DEPOSIT | 18,400,000 |
| REFUND_AMOUNT | 104,968,774 |
| EARLY_TERMINATION_COUNT | 39 |
| NEW_ROOM_COUNT | 95 |
| VACANT_ROOM_COUNT | 11 |
| RENT_REVENUE | 5,021,511,225.80645 |
| SERVICE_REVENUE | 1,745,169,586.02 |
| HEAD_LEASE_COST | 4,086,483,333.33 |
| EQUIPMENT_PURCHASE_COST | 35,380,000 |
| ELECTRIC_INPUT_COST | 935,197,739 |
| WATER_INPUT_COST | 202,388,331.67 |
| INTERNET_INPUT_COST | 33,982,034.58 |
| GARBAGE_COST | 20,593,333.33 |
| ENVIRONMENT_COST | 1,904,000 |
| ELEVATOR_MAINT_COST | 1,000,000 |
| COGS | 5,316,928,771.92 |
| OPERATING_SELLING_COST | 696,928,495.37 |
| TOTAL_COST | 6,013,857,267.28 |
| GROSS_PROFIT | 1,719,327,464.08 |
| NET_PROFIT | 1,022,398,968.72 |

### Golden Report C — Báo cáo Kinh doanh tháng 8 (v1.9, formula `BUSINESS_V1_WORKBOOK`)

> Cơ sở: `TOTAL_REVENUE` thực thu − `NEW_DEPOSIT_COLLECTED` (= `NEW_DEPOSIT` 371.850.000 trong fixture).

| Metric | Expected |
| --- | ---: |
| BUSINESS_REVENUE | 6,664,406,236 |
| T / S / G | 2,375,102,129 / 3,364,295,507 / 925,008,600 |
| BUSINESS_EQUIPMENT_PURCHASE_COST | 0 |
| BUSINESS_COGS | 5,281,548,771.92 |
| OPERATING_SELLING_COST | 696,928,495.37 |
| BUSINESS_TOTAL_COST | 5,978,477,267.28 |
| BUSINESS_GROSS_PROFIT | 1,382,857,464.08 |
| BUSINESS_NET_PROFIT | 685,928,968.72 |



### Production Formula Freeze Gate

Trước khi đánh dấu report `LOCKED/ACCEPTED`, tối thiểu phải kiểm tra:

1. FR24/25 dùng đúng source formula đã xác nhận và mọi adjustment TH1 đều có source trace.
2. BUSINESS Inclusion Matrix đang dùng đúng version: `BUSINESS_REVENUE = TOTAL_REVENUE - NEW_DEPOSIT_COLLECTED`, Business COGS loại `EQUIPMENT_PURCHASE_COST`.
3. `HH/CPBH`, `DT DV/GIÁ NHẬP`, 3 nhóm phòng trống và `EARLY_TERMINATION_COUNT.notice_date` dùng đúng metric definition đã chốt.
4. Head Lease dùng đúng Contract/Price Version; Utility/Expense/Payroll phải truy đúng building source; calculation giữ nguyên precision nguồn và chỉ format khi hiển thị.
5. Non-MATCH phải có drill/source và reason; không sửa source transaction chỉ để khớp Excel.
6. Excel có lỗi `#REF!`/legacy inconsistency được ghi `SOURCE_DATA_DIFFERENCE`; Web tính từ source transaction theo rule đã duyệt.

## 2. Mô tả màn hình

### Màn hình 41.1: Reconciliation

**Loại màn hình:** Bảng đối chiếu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Report / Kỳ / Scope | Bộ lọc | Có | G1/Building hoặc Total/T/S/G. |
| Metric / Cell nguồn | Bảng | Có | metric_code, label, workbook/sheet/cell khi có mapping. |
| Excel value | Số | Có | Golden value. |
| System value | Số | Có | Snapshot Web. |
| Diff / Diff % | Số | Có | Chênh lệch. |
| Status | Badge | Có | Theo 5 trạng thái chuẩn. |
| Note / Reason | Văn bản | Tùy điều kiện | Bắt buộc với non-MATCH. |
| Drill-down | Link | Có | FR38.2 / FR40.2 / source record. |

### Màn hình 41.2: Export XLSX

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Report type | Danh sách | Có | Tổng / Kinh doanh / Chi tiết tòa. |
| Kỳ / Scope / Snapshot | Chỉ đọc | Có | Metadata export. |
| Template | Danh sách | Có | Mẫu nguồn tương ứng khi có. |
| Xuất | Nút chính | Có | Sinh XLSX. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có report snapshot và Golden Dataset/cell mapping cho phạm vi cần nghiệm thu. |
| Các bước người dùng | Bước 1: Chạy report FR38/39/40.<br>Bước 2: Mở 41.1 và compare từng metric.<br>Bước 3: Non-MATCH phải drill source và chọn reason/status đúng.<br>Bước 4: Count phải khớp tuyệt đối; monetary diff chỉ được chấp nhận theo rounding rule.<br>Bước 5: Xuất 41.2 và kiểm tra layout/data/number format.<br>Bước 6: Chỉ nghiệm thu report khi các metric bắt buộc đạt trạng thái được chấp nhận và OPEN item được business ký xác nhận. |

---

# FR42 - Danh sách cổ đông và tỷ lệ sở hữu

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Cổ đông  
**Nguồn:** SRC-02 `TT CỔ ĐÔNG`; SRC-07; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin/Kế toán/người quản trị cổ đông được cấp quyền. |
| Quy tắc chức năng | Một cổ đông có thể tham gia nhiều tòa và một tòa có nhiều cổ đông. Tỷ lệ sở hữu có ngày hiệu lực; kỳ đã khóa dùng đúng phiên bản tỷ lệ. |
| Nội dung theo SRC-02 `TT CỔ ĐÔNG` | Danh sách cổ đông; tỷ lệ vào cổ phần các nhà; bảng kê chia cổ phần các nhà (FR43); **lịch đóng tiền từng người**; **thống kê tài sản**; **thống kê tiền cọc**. Tất cả lọc được theo nhà và thời gian. |
| Lịch đóng tiền từng người | Sinh từ lịch trả tiền chủ nhà FR07 của tòa × tỷ lệ sở hữu hiệu lực của cổ đông: `Phải góp kỳ = Số phải trả chủ nhà của kỳ × Tỷ lệ %`. Ghi nhận góp thực tế ở FR44. |
| Thống kê tài sản / tiền cọc | Không nhập độc lập: thống kê tài sản đọc FR45 (tài sản đầu tư của tòa) × tỷ lệ; thống kê tiền cọc đọc cọc chủ nhà FR06 × tỷ lệ. |
| Quỹ chung | Dòng `CHUNG` trong bảng G1 (10%) được quản lý như một chủ thể cổ đông loại `POOL`. |
| Tác động | Phiên bản sở hữu là đầu vào bảng phân bổ, góp vốn và chi trả; thay đổi tương lai không sửa kỳ đã chốt. |

## 2. Mô tả màn hình

### Màn hình 42.1: Danh sách Cổ đông / Tỷ lệ sở hữu

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Cổ đông / Tỷ lệ sở hữu theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Tòa; cổ đông; kỳ hiệu lực; trạng thái |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Cổ đông / Tỷ lệ sở hữu nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Cổ đông; tòa; tỷ lệ %; hiệu lực từ/đến; trạng thái góp vốn; trạng thái. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Kết thúc sở hữu theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 42.2: Tạo Cổ đông / Tỷ lệ sở hữu

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Thông tin cổ đông; liên hệ/tài khoản theo quyền; tòa; tỷ lệ %; ngày hiệu lực; kế hoạch góp vốn; ghi chú. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 42.3: Chi tiết Cổ đông / Tỷ lệ sở hữu

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Cổ đông; tòa; tỷ lệ %; hiệu lực từ/đến; trạng thái góp vốn; trạng thái. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Cổ đông / Tỷ lệ sở hữu nếu có quyền. |

### Màn hình 42.4: Chỉnh sửa Cổ đông / Tỷ lệ sở hữu

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Thông tin cổ đông; liên hệ/tài khoản theo quyền; tòa; tỷ lệ %; ngày hiệu lực; kế hoạch góp vốn; ghi chú. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 42.5: Xác nhận Kết thúc sở hữu Cổ đông / Tỷ lệ sở hữu

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Cổ đông / Tỷ lệ sở hữu đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Kết thúc sở hữu -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có dữ liệu nền cần thiết và người dùng có quyền với Cổ đông / Tỷ lệ sở hữu. |
| Các bước người dùng | Bước 1: Mở danh sách 42.1.<br>Bước 2: Tạo 42.2 -> Chi tiết 42.3.<br>Bước 3: Chỉnh sửa 42.4.<br>Bước 4: Kết thúc sở hữu tại 42.5 khi cần. |

---

# FR43 - Bảng phân bổ cổ đông G1

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Cổ đông  
**Nguồn:** SRC-07 `BÁO CÁO THÁNG 8`; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin/người quản trị cổ đông. |
| Quy tắc chức năng | Bảng phân bổ G1 dùng chỉ tiêu báo cáo nguồn và tỷ lệ sở hữu hiệu lực. 'Tổng nhận' tính toán không đồng nghĩa đã chuyển tiền. |
| Công thức nguồn (G1 `BẢNG CHIA CỔ PHẦN`) | `Vốn = Tỷ lệ% × Tiền thuê nhà 1 tháng` (`H = G × C22/100`); `LN gộp = Tỷ lệ% × LNG` (`I = G × C73/100`); `LN ròng = Tỷ lệ% × LNR` (`J = G × C74/100`); `Tổng nhận = Vốn + LN ròng` (`M = H + J`). `SOURCE_CONFIRMED`. Giữ precision, chỉ format khi hiển thị. |
| Tác động | Bảng đã khóa tạo số phải chi dự kiến; tiền góp/chi thực tế theo FR44. |

## 2. Mô tả màn hình

### Màn hình 43.1: Bảng phân bổ cổ đông G1 - Danh sách / Nhập liệu

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Phạm vi / Bộ lọc | Bộ lọc | Không | Kỳ, tòa, khu vực, người phụ trách và trạng thái phù hợp nghiệp vụ. |
| Dữ liệu đầu vào | Bảng / Biểu mẫu | Có | Kỳ/tòa/cổ đông; tỷ lệ sở hữu; các giá trị báo cáo nguồn; số phân bổ; tổng nhận; chênh lệch làm tròn; trạng thái. |
| Kiểm tra | Nút | Tùy điều kiện | Kiểm tra quyền, dữ liệu bắt buộc, trùng lặp và trạng thái kỳ. |
| Thực hiện | Nút chính | Có | Thực hiện nghiệp vụ -> Phiên bản bảng phân bổ đã chốt, liên kết FR40 và phiên bản sở hữu FR42.. Kiểm tra tổng tỷ lệ = 100% tại kỳ chốt nếu nghiệp vụ yêu cầu. |

### Màn hình 43.2: Bảng phân bổ cổ đông G1 - Chi tiết / Kết quả

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu nguồn | Chỉ đọc | Có | Hiển thị kỳ, đối tượng, nguồn dữ liệu, người thao tác và các bản ghi liên quan. |
| Kết quả | Chỉ đọc / Bảng | Có | Phiên bản bảng phân bổ đã chốt, liên kết FR40 và phiên bản sở hữu FR42. |
| Truy vết | Liên kết | Không | Nhấn -> mở chứng từ/bản ghi đã tạo ra kết quả. |
| Lịch sử | Dòng thời gian | Không | Hiển thị các lần thay đổi, điều chỉnh hoặc phiên bản. |

### Màn hình 43.3: Xác nhận Bảng phân bổ cổ đông G1

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tóm tắt | Chỉ đọc | Có | Tóm tắt phạm vi, số bản ghi và tác động. |
| Cảnh báo | Chỉ đọc | Tùy điều kiện | Hiển thị lỗi/cảnh báo phải xử lý trước khi xác nhận. |
| Xác nhận | Nút chính | Có | Xác nhận -> lưu giao dịch/phiên bản/nhật ký. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có tỷ lệ sở hữu và báo cáo G1 của kỳ. |
| Các bước người dùng | Bước 1: Mở 43.1 -> Tính thử.<br>Bước 2: Xem chi tiết 43.2 và truy các giá trị FR40.<br>Bước 3: Xác nhận/Khóa 43.3.<br>Bước 4: Chi tiền thực tế ghi tại FR44. |

---

# FR44 - Góp vốn và chi trả thực tế cho cổ đông

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Cổ đông  
**Nguồn:** SRC-02; SRC-07; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin/người quản trị cổ đông. |
| Quy tắc chức năng | Kế hoạch góp vốn, góp thực tế, phân bổ dự kiến và chi trả thực tế là các bản ghi riêng có ngày/chứng từ. |
| Bảng thu chi ban đầu (v1.9) | Theo G1 `THU CHI BAN ĐẦU` (`SOURCE_CONFIRMED` theo công thức): `Tổng Chi` (ô `E2`), `Tổng Thu` (ô `F2` — tiền thu tháng đầu), `Thu − Chi` (ô `G2 = F2 − E2`; G1: 104.919.000 − 269.906.347,94 = −164.987.347,94). Với mỗi cổ đông: `Phần chia = Tỷ lệ % × (Thu − Chi)` (ô `L4 = 10% × G2`…); `Đã đóng` = vốn góp thực tế (G1 tổng **230.400.000**, ví dụ Hằng 20% = 46.080.000); `Thực nhận = Đã đóng + Phần chia` (ô `L6 = L5 + L4`). |
| Vốn góp | `Đã đóng` của từng cổ đông ghi nhận bằng giao dịch góp vốn FR44 có ngày/chứng từ; tỷ lệ góp lấy theo FR42. Phần lãi/lỗ giai đoạn đầu không ghi vào báo cáo tháng vận hành; chỉ hiển thị ở Bảng thu chi ban đầu và số dư vốn cổ đông. |
| Tác động | Chỉ giao dịch thực tế mới cập nhật trạng thái số dư/chi trả; kết quả phân bổ không tự đánh dấu đã thanh toán. |

## 2. Mô tả màn hình

### Màn hình 44.1: Danh sách Giao dịch cổ đông

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Giao dịch cổ đông theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Tòa; cổ đông; kỳ; loại; trạng thái |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Giao dịch cổ đông nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Cổ đông; tòa; loại (góp/chi/rút); hạn; ngày thực tế; số dự kiến; số thực tế; trạng thái; chứng từ. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Hủy / Đảo giao dịch theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 44.2: Tạo Giao dịch cổ đông

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Cổ đông; tòa; loại giao dịch; bản kê/kế hoạch liên kết; hạn; số dự kiến; ngày/số thực tế; phương thức; chứng từ; ghi chú. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 44.3: Chi tiết Giao dịch cổ đông

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Cổ đông; tòa; loại (góp/chi/rút); hạn; ngày thực tế; số dự kiến; số thực tế; trạng thái; chứng từ. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Giao dịch cổ đông nếu có quyền. |

### Màn hình 44.4: Chỉnh sửa Giao dịch cổ đông

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Cổ đông; tòa; loại giao dịch; bản kê/kế hoạch liên kết; hạn; số dự kiến; ngày/số thực tế; phương thức; chứng từ; ghi chú. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 44.5: Xác nhận Hủy / Đảo giao dịch Giao dịch cổ đông

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Giao dịch cổ đông đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Hủy / Đảo giao dịch -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có dữ liệu nền cần thiết và người dùng có quyền với Giao dịch cổ đông. |
| Các bước người dùng | Bước 1: Mở danh sách 44.1.<br>Bước 2: Tạo 44.2 -> Chi tiết 44.3.<br>Bước 3: Chỉnh sửa 44.4.<br>Bước 4: Hủy / Đảo giao dịch tại 44.5 khi cần. |

---

# FR45 - Danh mục tài sản

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Tài sản  
**Nguồn:** SRC-02; SRC-07; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; Vận hành/Kỹ thuật; Kế toán xem trường tài chính. |
| Quy tắc chức năng | Tài sản phải phân biệt thuộc Chủ nhà hay Công ty. Giao dịch mua là nguồn tài chính riêng; Giai đoạn 1 không tự suy ra chính sách khấu hao. |
| Danh sách tài sản theo tòa (SRC-02) | Mỗi tòa có hai danh sách: **tài sản của chủ nhà** (theo biên bản kiểm kê kèm HĐ chủ nhà SRC-10) và **danh sách đầu tư** của công ty (khởi tạo từ G1 `ĐẦU TƯ BAN ĐẦU`/`THU CHI BAN ĐẦU` khi import). Hiển thị ở tab Tài sản của FR08. Ví dụ G1 `ĐẦU TƯ BAN ĐẦU` tổng 38.862.000 (máy bơm, điều hòa, tủ lạnh, rèm, tủ bếp, máy giặt, giường tủ…). Một số khoản xuất hiện ở cả `ĐẦU TƯ BAN ĐẦU` và `THU CHI BAN ĐẦU` (máy bơm 1.175.000; điều hòa và vật tư 5.355.000) → khi import phải khử trùng, mỗi chứng từ chỉ một Asset/Expense. |
| Tác động | Tài sản liên kết tòa/phòng, bảo trì và kiểm kê mà không tạo trùng chi phí. |

## 2. Mô tả màn hình

### Màn hình 45.1: Danh sách Tài sản

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Tài sản theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Tòa; phòng; loại; sở hữu; tình trạng; trạng thái |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Tài sản nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Mã tài sản; loại; sở hữu chủ nhà/công ty; tòa/phòng/vị trí; số lượng; tình trạng; ngày nhận; giá trị; bảo hành; trạng thái. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Ngừng sử dụng theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 45.2: Tạo Tài sản

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Mã; loại; quyền sở hữu; tòa/phòng/vị trí; số lượng; tình trạng; ngày nhận/bàn giao; giá trị/chứng từ; ảnh/file; bảo hành; ghi chú. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 45.3: Chi tiết Tài sản

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Mã tài sản; loại; sở hữu chủ nhà/công ty; tòa/phòng/vị trí; số lượng; tình trạng; ngày nhận; giá trị; bảo hành; trạng thái. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Tài sản nếu có quyền. |

### Màn hình 45.4: Chỉnh sửa Tài sản

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Mã; loại; quyền sở hữu; tòa/phòng/vị trí; số lượng; tình trạng; ngày nhận/bàn giao; giá trị/chứng từ; ảnh/file; bảo hành; ghi chú. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 45.5: Xác nhận Ngừng sử dụng Tài sản

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Tài sản đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Ngừng sử dụng -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có dữ liệu nền cần thiết và người dùng có quyền với Tài sản. |
| Các bước người dùng | Bước 1: Mở danh sách 45.1.<br>Bước 2: Tạo 45.2 -> Chi tiết 45.3.<br>Bước 3: Chỉnh sửa 45.4.<br>Bước 4: Ngừng sử dụng tại 45.5 khi cần. |

---

# FR46 - Sổ sửa chữa, lịch và kết quả bảo trì

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Bảo trì  
**Nguồn:** SRC-02 `BẢO TRÌ BẢO DƯỠNG`; SRC-11; SRC-04; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Vận hành/Kỹ thuật/Admin; Kế toán xem/xác nhận chi phí liên kết. |
| Work item | Phase 1 phải lưu được cả **sửa chữa phát sinh** và **bảo trì theo lịch**; mỗi work item có ngày, tòa, phòng/tài sản nếu có, nội dung, người/NCC, kết quả và chứng từ. |
| Tách chi phí | Phải tách tối thiểu `labor_cost` và `material_cost` khi có; không chỉ lưu một total nếu nguồn tách hai phần. |
| Bên chịu chi phí | Mỗi cost line/work item có `payer_type/responsible_party`: `COMPANY`, `CUSTOMER`, `LANDLORD`, `OTHER` hoặc danh mục được duyệt. Nguồn thực tế có các ca công ty chi, khách chi, trừ hoàn cọc. |
| Khách chịu / Trừ cọc | Lưu `customer_charge_amount`, `deduct_from_deposit` và liên kết Stay/HĐ/Termination Settlement/Refund nếu áp dụng; không tự xem là chi phí công ty. |
| Expense link | Chỉ phần công ty chịu mới tạo/link một FR27 Expense; không nhập lại chi phí ở FR27 nếu đã sinh từ Work Item. |
| Room/Asset link | Work item có thể gắn room, asset, khu vực chung; room có thể null với công việc toàn tòa. |
| Maintenance | Lịch định kỳ có planned date/next date/status; Phase 1 chưa có SLA/vendor KPI/predictive. |
| Loại lịch bảo dưỡng (SRC-02) | Danh mục tối thiểu: **bảo dưỡng thang máy; bảo dưỡng máy bơm; bảo dưỡng máy giặt / vệ sinh máy giặt; bảo dưỡng máy lọc nước**. Mỗi lịch gắn tòa (và tài sản nếu có), chu kỳ, ngày kế tiếp, người phụ trách. |
| Sổ sửa chữa (SRC-11) | Mỗi dòng nguồn: ngày; tòa; mã phòng; nội dung sửa chữa; **tiền công**; **mua vật tư**; điểm lấy sơn/vật tư; ghi chú (ví dụ "phòng phá HĐ", "khách hết HĐ", "quản lý bank về HT"). Tiền công tổng hợp theo nhân viên sửa chữa là đầu vào lương sửa chữa FR35. |
| Nhiều bên chịu chi phí | Nếu thực tế một công việc có nhiều bên chịu, biểu diễn thành nhiều `WorkItemCostLine` cùng Work Item, mỗi line có payer + amount riêng; tổng line = tổng chi phí. Đây là cách biểu diễn dữ liệu, không dùng tỷ lệ phân bổ ngầm. |
| Tác động | Là nguồn báo cáo sửa chữa/vệ sinh về sau và nguồn chi phí báo cáo hiện tại khi `COMPANY` chịu; drill report phải về work item/chứng từ. |

## 2. Mô tả màn hình

### Màn hình 46.1: Sổ sửa chữa / Bảo trì

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Bộ lọc | Không | Kỳ; tòa; phòng; asset; loại việc; payer; người/NCC; trạng thái. |
| Bảng | Bảng | Có | Ngày; tòa; phòng/asset; nội dung; labor; material; total; payer; customer/deposit flag; Expense link; trạng thái. |
| Thêm sửa chữa | Nút | Không | Mở 46.2. |
| Tạo lịch bảo trì | Nút | Không | Mở 46.4. |
| Thao tác | Menu | Không | Xem / Chỉnh sửa / Hoàn thành / Hủy. |

### Màn hình 46.2: Ghi nhận sửa chữa / công việc phát sinh

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Ngày thực hiện | Ngày | Có | Business date. |
| Tòa / Phòng / Asset | Tra cứu | Có/Tùy điều kiện | Room optional nếu việc chung tòa. |
| Loại việc / Nội dung | Danh sách + Văn bản | Có | Sơn, dọn vệ sinh, điện/nước, thiết bị... theo danh mục. |
| Tiền công / Vật tư | Tiền tệ | Tùy điều kiện | Tách hai thành phần theo nguồn. |
| Payer / Responsible party | Danh sách | Có khi có chi phí | Company/Customer/Landlord/Other. |
| Khách phải trả / Trừ cọc | Tiền + Checkbox | Tùy điều kiện | Khi khách chịu hoặc khấu trừ settlement/refund. |
| Stay/HĐ/Settlement/Refund | Tra cứu | Tùy điều kiện | Bắt buộc khi trừ/thu khách nếu xác định được nguồn. |
| Người/NCC / Chứng từ / Ghi chú | Biểu mẫu + Upload | Tùy điều kiện | Trace source. |
| Tạo/Link Expense | Nút/Tra cứu | Khi Company chịu | Tạo một Expense FR27 cho phần công ty chịu. |
| Lưu | Nút chính | Có | Lưu work item trước; chống tạo Expense trùng. |

### Màn hình 46.3: Chi tiết Work Item

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Work info | Chỉ đọc | Có | Ngày, tòa/phòng/asset, nội dung, kết quả. |
| Cost breakdown | Bảng | Có/Tùy điều kiện | Labor/material/payer/customer/deposit. |
| Link tài chính | Liên kết | Không | Expense FR27; FR26 refund/settlement; Payment nếu khách thanh toán riêng. |
| Evidence | File/Ảnh | Không | Chứng từ/trước-sau. |
| Lịch sử | Timeline | Có | Tạo/sửa/hoàn thành/đảo. |

### Màn hình 46.4: Tạo / Cập nhật lịch bảo trì

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tài sản/Tòa | Tra cứu | Có | Đối tượng bảo trì. |
| Loại / Chu kỳ / Ngày kế tiếp | Danh sách + Ngày | Có/Tùy điều kiện | Theo kế hoạch. |
| Người/NCC | Tra cứu | Tùy điều kiện | Người thực hiện. |
| Planned/Actual date | Ngày | Tùy điều kiện | Khi hoàn thành tạo/cập nhật work item. |
| Kết quả / Chứng từ | Văn bản + Upload | Tùy điều kiện | Evidence. |
| Lưu | Nút chính | Có | Lưu kế hoạch/history. |

### Màn hình 46.5: Chỉnh sửa Work Item / Kết quả

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Kỳ chưa khóa và theo quyền. |
| Lý do | Văn bản | Có khi sửa cost/payer/link | Audit. |
| Lưu | Nút chính | Có | Reconcile Expense/Refund link nếu bị ảnh hưởng; không xóa history. |

### Màn hình 46.6: Xác nhận Hủy Work Item / Lịch

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Work/schedule. |
| Lý do | Văn bản | Có | Audit. |
| Xác nhận | Nút chính/nguy hiểm | Có | Hủy logic; Expense đã ghi nhận xử lý bằng reversal phù hợp, không xóa vật lý. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có tòa/phòng/asset phù hợp và quyền. |
| Các bước người dùng | Bước 1: Phát sinh sửa chữa -> 46.2 nhập ngày/tòa/phòng/nội dung/labor/material/payer.<br>Bước 2: Nếu khách chịu/trừ cọc -> link Stay/FR26; nếu công ty chịu -> tạo/link một FR27 Expense.<br>Bước 3: Hoàn thành và lưu chứng từ ở 46.3.<br>Bước 4: Bảo trì định kỳ dùng 46.4; Phase 2 mở rộng recurring/vendor/SLA.<br>Bước 5: Report sửa chữa/chi phí drill về 46.3 và chứng từ. |

---

# FR47 - Kiểm kê tài sản

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Tài sản  
**Nguồn:** SRC-02; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Vận hành/Kỹ thuật/Admin. |
| Quy tắc chức năng | Kiểm kê ghi số sổ sách so với thực tế tại một thời điểm. Chênh lệch không tự tạo chi phí/bút toán. |
| Phạm vi kiểm kê (SRC-02) | Bao gồm cả **đồ décor** (nhóm tài sản `DECOR`) ngoài thiết bị/nội thất. |
| Tác động | Chênh lệch tạo đề xuất xử lý; chỉ điều chỉnh tài sản khi có quyền và chứng cứ. |

## 2. Mô tả màn hình

### Màn hình 47.1: Danh sách Kiểm kê

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Kiểm kê theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Kỳ; tòa; phòng; loại tài sản; chênh lệch/trạng thái |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Kiểm kê nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Ngày/kỳ; tòa/phòng; tài sản; số sổ; số thực; tình trạng; chênh lệch; người kiểm; trạng thái. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Hủy bản nháp theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 47.2: Tạo Kiểm kê

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Ngày/kỳ; tòa/phòng; tài sản; số sổ; số thực; tình trạng; người kiểm; ảnh/chứng cứ; ghi chú. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 47.3: Chi tiết Kiểm kê

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Ngày/kỳ; tòa/phòng; tài sản; số sổ; số thực; tình trạng; chênh lệch; người kiểm; trạng thái. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Kiểm kê nếu có quyền. |

### Màn hình 47.4: Chỉnh sửa Kiểm kê

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Ngày/kỳ; tòa/phòng; tài sản; số sổ; số thực; tình trạng; người kiểm; ảnh/chứng cứ; ghi chú. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 47.5: Xác nhận Hủy bản nháp Kiểm kê

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Kiểm kê đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Hủy bản nháp -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có dữ liệu nền cần thiết và người dùng có quyền với Kiểm kê. |
| Các bước người dùng | Bước 1: Mở danh sách 47.1.<br>Bước 2: Tạo 47.2 -> Chi tiết 47.3.<br>Bước 3: Chỉnh sửa 47.4.<br>Bước 4: Hủy bản nháp tại 47.5 khi cần. |

---

# FR48 - Import và chuyển đổi dữ liệu

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** Quản trị  
**Nguồn:** SRC-02; SRC-03; SRC-06; SRC-08; SRC-09; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; người phụ trách module theo quyền import. |
| Quy tắc chức năng | Import theo Upload -> Mapping -> Validate -> Preview -> Commit, có idempotency theo khóa nguồn; dòng lỗi không vào production. |
| Tác động | Dòng commit trở thành bản ghi nguồn bình thường với lineage batch; import lại không làm nhân đôi doanh thu/chi phí/thu tiền. |

## 2. Mô tả màn hình

### Màn hình 48.1: Danh sách batch Import

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Loại import | Bộ lọc / Cột | Có | Chủ nhà/tòa/phòng; khách/HĐ; chỉ số; thu tiền; chi phí; utility mapping; hoa hồng; số dư đầu kỳ; tài sản/nhân sự nếu được duyệt. |
| Danh sách batch | Bảng | Có | Batch ID; file; loại; kỳ/nguồn; người tải; thời gian; số dòng hợp lệ/lỗi; trạng thái commit. |
| Import mới | Nút | Không | Mở 48.2. |

### Màn hình 48.2: Tải file và ánh xạ cột

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Loại import | Danh sách chọn | Có | Xác định template và bộ validation. |
| Tải template | Nút | Không | Tải CSV/XLSX mẫu hiện hành. |
| File | Tải lên | Có | Tải file nguồn. |
| Ánh xạ cột | Bảng ánh xạ | Có | Map cột nguồn -> trường hệ thống. |
| Xem trước | Nút | Có | Parse -> 48.3. |

### Màn hình 48.3: Xem trước và kiểm tra lỗi

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dòng dữ liệu | Bảng | Có | Dòng nguồn; khóa; giá trị; Hợp lệ/Lỗi; lý do. |
| Tóm tắt | Chỉ đọc | Có | Số hợp lệ; lỗi; trùng; idempotent. |
| Xuất lỗi | Nút | Không | Tải file dòng lỗi. |
| Commit | Nút chính | Tùy điều kiện | Mở 48.4 khi đáp ứng policy. |

### Màn hình 48.4: Xác nhận Commit

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tóm tắt batch | Chỉ đọc | Có | Loại; kỳ/nguồn; số dòng. |
| Kiểm tra idempotency | Chỉ đọc | Có | Khóa đã có sẽ update/skip theo rule, không nhân đôi âm thầm. |
| Xác nhận | Nút chính | Có | Commit -> tạo bản ghi nguồn và lineage batch. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Người dùng có quyền Import và có file/template hợp lệ. |
| Các bước người dùng | Bước 1: Mở 48.1 -> Import mới.<br>Bước 2: Tải file/ánh xạ 48.2 -> 48.3.<br>Bước 3: Sửa hoặc xuất dòng lỗi.<br>Bước 4: Commit -> 48.4 -> xác nhận. |

---

# FR49 - OCR hợp đồng chủ nhà

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** OCR  
**Nguồn:** SRC-10; P3 — OCR đưa vào Go-live

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Nhân sự hợp đồng/Vận hành được cấp quyền; Admin. |
| Quy tắc chức năng | OCR hợp đồng chủ nhà là chức năng Phase 1; chỉ được áp dụng sau Review -> Confirm; file gốc và các phiên trích xuất phải được giữ. |
| Tác động | Kết quả đã xác nhận có thể tạo/cập nhật bản nháp hợp đồng, giai đoạn giá, cọc, lịch trả và bàn giao tài sản. |

## 2. Mô tả màn hình

### Màn hình 49.1: Tải hợp đồng để OCR

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| File | Tải lên | Có | PDF/ảnh hợp đồng; luôn lưu bản gốc. |
| Đối tượng liên kết | Tra cứu | Tùy điều kiện | Chủ nhà/tòa hoặc khách/lượt thuê/deal nếu đã có. |
| Chạy OCR | Nút chính | Có | Tạo phiên trích xuất mới. |

### Màn hình 49.2: Rà soát kết quả OCR

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tài liệu gốc | Xem trước tài liệu | Có | Hiển thị cạnh trường trích xuất. |
| Dữ liệu trích xuất | Biểu mẫu rà soát | Có | Chủ nhà; CCCD/liên hệ; tòa; ngày bắt đầu/kết thúc; giá thuê; cọc; chu kỳ thanh toán; thời gian giữ giá; tăng giá; pháp lý; tài sản bàn giao; điều khoản đặc biệt. |
| Nguồn / Độ tin cậy | Chỉ đọc | Có | Trang/vùng nguồn và confidence nếu engine cung cấp. |
| Xác nhận nhóm | Thao tác | Có | Người dùng sửa/xác nhận từng nhóm bắt buộc. |
| Áp dụng | Nút chính | Tùy điều kiện | Chỉ bật khi nhóm bắt buộc đã xác nhận -> FR06 hợp đồng chủ nhà và dữ liệu lịch thanh toán liên quan. |

### Màn hình 49.3: Xác nhận áp dụng OCR

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thay đổi | So sánh khác biệt | Có | Giá trị đã rà soát so với dữ liệu nháp/hiện tại. |
| Đối tượng đích | Chỉ đọc | Có | FR06 hợp đồng chủ nhà và dữ liệu lịch thanh toán liên quan |
| Xác nhận | Nút chính | Có | Áp dụng vào bản nháp/phiên bản; không sửa hóa đơn đã phát hành. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có file hợp đồng cần trích xuất. |
| Các bước người dùng | Bước 1: Tải file tại 49.1 -> Chạy OCR.<br>Bước 2: Rà soát/sửa dữ liệu tại 49.2.<br>Bước 3: Áp dụng -> 49.3 -> Xác nhận -> cập nhật FR06 hợp đồng chủ nhà và dữ liệu lịch thanh toán liên quan. |


---

---

# FR50 - OCR hợp đồng khách thuê

**Giai đoạn:** Giai đoạn 1  
**Phân hệ:** OCR  
**Nguồn:** SRC-01; SRC-08; P3 — OCR đưa vào Go-live

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Nhân sự hợp đồng/Vận hành được cấp quyền; Admin. |
| Quy tắc chức năng | OCR hợp đồng khách là chức năng Phase 1; trích xuất thông tin thuê và bảng giá nhưng bắt buộc Review -> Confirm -> Apply; không sửa hóa đơn đã phát hành. |
| Tác động | Kết quả đã xác nhận cập nhật hợp đồng nháp và phiên bản ContractService cho hóa đơn tương lai. |

## 2. Mô tả màn hình

### Màn hình 50.1: Tải hợp đồng để OCR

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| File | Tải lên | Có | PDF/ảnh hợp đồng; luôn lưu bản gốc. |
| Đối tượng liên kết | Tra cứu | Tùy điều kiện | Chủ nhà/tòa hoặc khách/lượt thuê/deal nếu đã có. |
| Chạy OCR | Nút chính | Có | Tạo phiên trích xuất mới. |

### Màn hình 50.2: Rà soát kết quả OCR

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tài liệu gốc | Xem trước tài liệu | Có | Hiển thị cạnh trường trích xuất. |
| Dữ liệu trích xuất | Biểu mẫu rà soát | Có | Khách; tòa/phòng; ngày ký/bàn giao/tính tiền/kết thúc; giá phòng; cọc; chu kỳ; số người; cùng bảng giá điện, nước, internet, thang máy, dịch vụ, gửi xe, sạc xe, dịch vụ khác. |
| Nguồn / Độ tin cậy | Chỉ đọc | Có | Trang/vùng nguồn và confidence nếu engine cung cấp. |
| Xác nhận nhóm | Thao tác | Có | Người dùng sửa/xác nhận từng nhóm bắt buộc. |
| Áp dụng | Nút chính | Tùy điều kiện | Chỉ bật khi nhóm bắt buộc đã xác nhận -> FR12 hợp đồng khách và FR13 bảng giá dịch vụ. |

### Màn hình 50.3: Xác nhận áp dụng OCR

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thay đổi | So sánh khác biệt | Có | Giá trị đã rà soát so với dữ liệu nháp/hiện tại. |
| Đối tượng đích | Chỉ đọc | Có | FR12 hợp đồng khách và FR13 bảng giá dịch vụ |
| Xác nhận | Nút chính | Có | Áp dụng vào bản nháp/phiên bản; không sửa hóa đơn đã phát hành. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có file hợp đồng cần trích xuất. |
| Các bước người dùng | Bước 1: Tải file tại 50.1 -> Chạy OCR.<br>Bước 2: Rà soát/sửa dữ liệu tại 50.2.<br>Bước 3: Áp dụng -> 50.3 -> Xác nhận -> cập nhật FR12 hợp đồng khách và FR13 bảng giá dịch vụ. |


---

---

# FR51 - Kinh doanh nâng cao

**Giai đoạn:** Giai đoạn 2  
**Phân hệ:** Kinh doanh  
**Nguồn:** SRC-02; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kinh doanh/Leader/Admin. |
| Quy tắc chức năng | Pipeline và conversion nâng cao phải tổng hợp từ Lead/Deal nguồn của Giai đoạn 1; KPI conversion cần định nghĩa tử/mẫu và cửa sổ thời gian được duyệt. |
| Tác động | Màn nâng cao hỗ trợ phân tích team/nguồn mà không tạo trùng bản ghi nguồn. |

## 2. Mô tả màn hình

### Màn hình 51.1: Pipeline kinh doanh nâng cao

**Loại màn hình:** Danh sách / Kanban

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Bộ lọc | Không | Kỳ; nguồn; sale/team; tòa/khu vực; giai đoạn. |
| Pipeline | Kanban / Bảng | Có | Lead -> Đã xem -> Đã chốt -> Chờ nhận -> Đã nhận từ FR30/FR31. |
| Conversion | KPI | Tùy điều kiện | <span style="color:#CC0000">OPEN: cửa sổ thời gian và tử/mẫu conversion cần duyệt.</span> |
| Thao tác | Liên kết | Không | Mở hoặc phân công lại Lead/Deal theo quyền. |

### Màn hình 51.2: Phân tích kinh doanh

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Chỉ tiêu nguồn/team | Bảng / Biểu đồ | Có | Lead; lượt xem; deal; nhận phòng; giá trị theo nguồn/team. |
| Truy nguồn | Liên kết | Có | Nhấn chỉ tiêu -> bản ghi FR30/FR31. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có dữ liệu Lead/Deal Giai đoạn 1. |
| Các bước người dùng | Bước 1: Mở 51.1.<br>Bước 2: Chọn bộ lọc/giai đoạn.<br>Bước 3: Chọn chỉ tiêu -> 51.2 -> truy về FR30/FR31. |

---

# FR52 - Bộ quy tắc hoa hồng

**Giai đoạn:** Giai đoạn 2  
**Phân hệ:** Hoa hồng  
**Nguồn:** SRC-09; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin/Kế toán; quản lý Kinh doanh được rà soát. |
| Quy tắc chức năng | Chính sách hoa hồng có phiên bản/ngày hiệu lực và chỉ dùng các tiêu chí đã duyệt; rule phải pass fixture nguồn trước khi kích hoạt. |
| Tác động | Rule kích hoạt tạo đề xuất hoa hồng gắn Deal; phải được rà soát trước khi tạo chi/thanhtoán. |

## 2. Mô tả màn hình

### Màn hình 52.1: Danh sách Quy tắc hoa hồng

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Quy tắc hoa hồng theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Kỳ hiệu lực; trạng thái; nguồn/team |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Quy tắc hoa hồng nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Mã/tên rule; ngày hiệu lực; tiêu chí; cách tính tỷ lệ/số tiền; ưu tiên; trạng thái; phiên bản. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Ngừng hoạt động theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 52.2: Tạo Quy tắc hoa hồng

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Mã/tên; hiệu lực; tiêu chí thời hạn HĐ/nguồn/team; tỷ lệ/số cố định; điều kiện loại trừ; ưu tiên; trạng thái; fixture test. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 52.3: Chi tiết Quy tắc hoa hồng

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Mã/tên rule; ngày hiệu lực; tiêu chí; cách tính tỷ lệ/số tiền; ưu tiên; trạng thái; phiên bản. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Quy tắc hoa hồng nếu có quyền. |

### Màn hình 52.4: Chỉnh sửa Quy tắc hoa hồng

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Mã/tên; hiệu lực; tiêu chí thời hạn HĐ/nguồn/team; tỷ lệ/số cố định; điều kiện loại trừ; ưu tiên; trạng thái; fixture test. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 52.5: Xác nhận Ngừng hoạt động Quy tắc hoa hồng

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Quy tắc hoa hồng đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Ngừng hoạt động -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có chính sách hoa hồng được duyệt. |
| Các bước người dùng | Bước 1: Danh sách 52.1.<br>Bước 2: Tạo 52.2 -> Chi tiết/Test 52.3.<br>Bước 3: Chỉnh sửa 52.4 -> phiên bản mới.<br>Bước 4: Ngừng hoạt động 52.5. |

---

# FR53 - Cơ cấu / lịch sử nhân sự nâng cao

**Giai đoạn:** Giai đoạn 2  
**Phân hệ:** Nhân sự  
**Nguồn:** SRC-02; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Nhân sự/Admin; Leader xem nhánh được cấp. |
| Quy tắc chức năng | Nhân sự nâng cao vẫn giữ lịch sử đơn vị/chức danh/leader theo hiệu lực và tách phân công chéo khỏi tuyến báo cáo chính. |
| Tác động | Lịch sử được duyệt làm chính xác quyền, bộ lọc và trách nhiệm lương theo kỳ. |

## 2. Mô tả màn hình

### Màn hình 53.1: Cây cơ cấu tổ chức

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Cây tổ chức | Cây phân cấp | Có | Đơn vị -> chức danh -> nhân viên -> leader trực tiếp; hỗ trợ thu gọn/mở rộng. |
| Tại thời điểm | Ngày | Không | Xem cơ cấu có hiệu lực tại ngày được chọn. |
| Chi tiết node | Panel | Không | Leader; số thành viên; tòa/phòng phụ trách. |
| Thao tác | Nút | Tùy điều kiện | Tạo/chuyển/kết thúc đơn vị, chức danh hoặc thành viên theo quyền. |

### Màn hình 53.2: Chuyển đơn vị / Đổi leader

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Nhân viên | Chỉ đọc | Có | Nhân viên cần chuyển. |
| Đơn vị / Chức danh / Leader mới | Tra cứu | Có | Kiểm tra vòng lặp, tự quản lý và chồng tuyến chính. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Có | Đóng quan hệ cũ và mở quan hệ mới. |
| Xác nhận | Nút chính | Có | Lưu lịch sử cơ cấu theo phiên bản. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có nhân viên/cơ cấu tổ chức. |
| Các bước người dùng | Bước 1: Mở cây 53.1.<br>Bước 2: Chọn nhân viên -> 53.2.<br>Bước 3: Nhập quan hệ mới/ngày hiệu lực -> Xác nhận; lịch sử cũ được giữ. |

---

# FR54 - Quy trình tính lương đầy đủ

**Giai đoạn:** Giai đoạn 2  
**Phân hệ:** Tiền lương  
**Nguồn:** SRC-03; SRC-05; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Nhân sự lương/HR/Kế toán/Admin theo phân tách nhiệm vụ. |
| Quy tắc chức năng | Bảng lương có phiên bản theo kỳ và chính sách; workflow: Generate -> Review -> Điều chỉnh -> Khóa -> Duyệt -> Đã trả. |
| Tác động | Bảng lương duyệt tạo chi phí/phải trả đúng một lần; trạng thái trả tiền và chứng từ tách khỏi công thức. |

## 2. Mô tả màn hình

### Màn hình 54.1: Danh sách kỳ chạy lương

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Phiên bản | Bảng / Bộ lọc | Có | Kỳ; phiên bản chạy; phiên bản chính sách; trạng thái; người tạo/rà soát/duyệt; tổng tiền. |
| Tạo bảng lương | Nút | Tùy điều kiện | Sinh từ snapshot FR35 và dữ liệu lương nhân sự. |
| Mở chi tiết | Liên kết | Có | Mở 54.2. |

### Màn hình 54.2: Chi tiết bảng lương

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dòng nhân viên | Bảng | Có | Lương cơ bản; phụ cấp; hiệu suất; lương/phòng; điều chỉnh; tổng; thực nhận theo chính sách. |
| Công thức / Nguồn | Mở rộng | Có | Truy về FR35 và phiên bản chính sách. |
| Điều chỉnh tay | Nút | Tùy điều kiện | Mở 54.3. |
| Thao tác workflow | Nút | Tùy điều kiện | Rà soát / Khóa / Duyệt / Đã trả theo vai trò và trạng thái. |

### Màn hình 54.3: Điều chỉnh bảng lương

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Nhân viên / Thành phần | Tra cứu | Có | Dòng cần điều chỉnh. |
| Số tiền | Tiền tệ | Có | Điều chỉnh tăng/giảm. |
| Lý do / Chứng từ | Văn bản + Tải lên | Có | Bắt buộc để audit. |
| Lưu | Nút | Có | Tạo dòng điều chỉnh; không xóa giá trị công thức nguồn. |

### Màn hình 54.4: Xác nhận trạng thái bảng lương

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thao tác | Chỉ đọc | Có | Khóa / Duyệt / Đã trả. |
| Tóm tắt | Chỉ đọc | Có | Số nhân viên; tổng; phiên bản. |
| Xác nhận | Nút chính | Có | Chuyển trạng thái và ghi người/thời gian. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | FR35 đã được rà soát và chính sách lương đã được duyệt. |
| Các bước người dùng | Bước 1: Tạo kỳ chạy 54.1 -> mở 54.2.<br>Bước 2: Rà soát và điều chỉnh tại 54.3 nếu cần.<br>Bước 3: Chọn trạng thái -> 54.4 -> xác nhận.<br>Bước 4: Chỉ đánh dấu Đã trả sau giao dịch lương thực tế. |

---

# FR55 - Tuổi nợ và xử lý nâng cấp công nợ

**Giai đoạn:** Giai đoạn 2  
**Phân hệ:** Thu tiền  
**Nguồn:** SRC-02; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin; Quản lý/Leader trong phạm vi. |
| Quy tắc chức năng | Tuổi nợ tính theo mốc hạn thanh toán được duyệt và ngày as-of; escalation là workflow/lịch sử, không làm đổi số nợ gốc. |
| Tác động | Aging/escalation phục vụ ưu tiên thu nợ và tự động nhắc Zalo; nợ nguồn vẫn ở FR23. |

## 2. Mô tả màn hình

### Màn hình 55.1: Danh sách tuổi nợ

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Ngày tính | Ngày | Có | Ngày as-of dùng tính số ngày quá hạn. |
| Nhóm tuổi nợ | Tab / Bộ lọc | Có | 0–30; 31–60; 61–90; 91–180; 181+ hoặc cấu hình được duyệt. |
| Bảng công nợ | Bảng | Có | Nghĩa vụ; hạn; số ngày quá hạn; số tiền; quản lý/team; mức escalation; cam kết trả nếu có. |
| Nâng cấp xử lý | Nút | Tùy điều kiện | Mở 55.2. |
| Quy tắc | Cảnh báo | Tùy điều kiện | <span style="color:#CC0000">OPEN: mốc neo tính quá hạn/escalation cần chốt nếu nguồn còn mơ hồ.</span> |

### Màn hình 55.2: Nâng cấp xử lý công nợ

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Công nợ | Chỉ đọc | Có | Khách/tòa/phòng và số nợ mục tiêu. |
| Mức / Người phụ trách | Danh sách chọn / Tra cứu | Có | Mức escalation và người/team nhận xử lý. |
| Hạn / Ghi chú | Ngày + Văn bản | Không | Mốc theo dõi tiếp theo. |
| Xác nhận | Nút | Có | Tạo lịch sử xử lý; không thay đổi số nợ. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có công nợ FR23. |
| Các bước người dùng | Bước 1: Mở 55.1.<br>Bước 2: Chọn khoản nợ -> 55.2.<br>Bước 3: Xác nhận -> tạo lịch sử/đầu việc xử lý. |

---

# FR56 - Tự động nhắc qua Zalo OA

**Giai đoạn:** Giai đoạn 2  
**Phân hệ:** Zalo OA  
**Nguồn:** P3; FR19/20/23/55

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin cấu hình; Kế toán/Vận hành theo dõi. |
| Quy tắc chức năng | Rule nhắc tự động đánh giá điều kiện hóa đơn/công nợ và gửi qua OA/template hợp lệ; retry tạo lần gửi mới và tuân cooldown/tần suất. |
| Tác động | Tự động hóa chỉ tạo send log, không tạo Payment hoặc đổi trạng thái hóa đơn/công nợ. |

## 2. Mô tả màn hình

### Màn hình 56.1: Danh sách Quy tắc nhắc Zalo

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Quy tắc nhắc Zalo theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Trạng thái; template; loại trigger; phạm vi |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Quy tắc nhắc Zalo nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Tên rule; điều kiện/mốc thời gian; phạm vi; template; tần suất/retry; trạng thái; lần chạy gần nhất/tiếp theo. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Ngừng hoạt động theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 56.2: Tạo Quy tắc nhắc Zalo

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Tên; sự kiện/điều kiện; số ngày trước/sau hạn; ngưỡng nợ; phạm vi nhận; template; lịch; retry/cooldown; ngày hiệu lực; trạng thái. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 56.3: Chi tiết Quy tắc nhắc Zalo

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Tên rule; điều kiện/mốc thời gian; phạm vi; template; tần suất/retry; trạng thái; lần chạy gần nhất/tiếp theo. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Quy tắc nhắc Zalo nếu có quyền. |

### Màn hình 56.4: Chỉnh sửa Quy tắc nhắc Zalo

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Tên; sự kiện/điều kiện; số ngày trước/sau hạn; ngưỡng nợ; phạm vi nhận; template; lịch; retry/cooldown; ngày hiệu lực; trạng thái. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 56.5: Xác nhận Ngừng hoạt động Quy tắc nhắc Zalo

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Quy tắc nhắc Zalo đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Ngừng hoạt động -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có OA/template và dữ liệu hóa đơn/công nợ. |
| Các bước người dùng | Bước 1: Danh sách 56.1.<br>Bước 2: Tạo 56.2 -> Chi tiết 56.3.<br>Bước 3: Chỉnh sửa/phiên bản 56.4.<br>Bước 4: Ngừng hoạt động 56.5; lịch sử gửi giữ nguyên. |

---

# FR57 - Vòng đời tài sản nâng cao

**Giai đoạn:** Giai đoạn 2  
**Phân hệ:** Tài sản  
**Nguồn:** P3; FR45/46/47

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin/Tài sản/Kỹ thuật; Kế toán xem dữ liệu tài chính. |
| Quy tắc chức năng | Mở rộng vòng đời với chuyển vị trí, bảo hành và khấu hao được duyệt; chính sách khấu hao phải có phiên bản. |
| Tác động | Sự kiện vòng đời cập nhật lịch sử và có thể lên báo cáo/bảo trì, không sửa chứng từ mua ban đầu. |

## 2. Mô tả màn hình

### Màn hình 57.1: Chi tiết vòng đời tài sản

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Vòng đời | Dòng thời gian | Có | Nhận; chuyển vị trí; bảo hành; bảo trì; khấu hao; thanh lý/ngừng sử dụng. |
| Thuộc tính tài chính | Chỉ đọc / Biểu mẫu | Tùy điều kiện | Giá gốc; chính sách khấu hao/phiên bản; khấu hao lũy kế/giá trị còn lại nếu đã duyệt. |
| Chuyển vị trí | Nút | Không | Mở 57.2. |

### Màn hình 57.2: Chuyển vị trí tài sản

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Từ | Chỉ đọc | Có | Vị trí hiện tại. |
| Đến | Tra cứu | Có | Tòa/phòng/vị trí mới. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Có | Tạo sự kiện lịch sử vị trí. |
| Xác nhận | Nút | Có | Chuyển tài sản và giữ lịch sử. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có tài sản FR45. |
| Các bước người dùng | Bước 1: Mở vòng đời 57.1.<br>Bước 2: Chọn Chuyển vị trí -> 57.2.<br>Bước 3: Xác nhận -> cập nhật timeline/vị trí. |

---

# FR58 - Phân bổ / chia lợi nhuận cổ đông

**Giai đoạn:** Giai đoạn 2  
**Phân hệ:** Cổ đông  
**Nguồn:** P3; FR42-44

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kế toán/Admin/người quản trị cổ đông. |
| Quy tắc chức năng | Phân phối lợi nhuận dùng báo cáo và tỷ lệ sở hữu đã khóa cùng chính sách rõ; tính toán, duyệt và chi thực tế là các trạng thái riêng. |
| Tác động | Bản phân phối đã duyệt tạo số phải trả dự kiến; chi tiền thực tế ghi riêng và đối chiếu. |

## 2. Mô tả màn hình

### Màn hình 58.1: Phân phối lợi nhuận cổ đông - Danh sách / Nhập liệu

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Phạm vi / Bộ lọc | Bộ lọc | Không | Kỳ, tòa, khu vực, người phụ trách và trạng thái phù hợp nghiệp vụ. |
| Dữ liệu đầu vào | Bảng / Biểu mẫu | Có | Kỳ/tòa; phiên bản báo cáo đã khóa; phiên bản tỷ lệ sở hữu; cơ sở lợi nhuận chia; từng cổ đông; số tính; điều chỉnh; số duyệt. |
| Kiểm tra | Nút | Tùy điều kiện | Kiểm tra quyền, dữ liệu bắt buộc, trùng lặp và trạng thái kỳ. |
| Thực hiện | Nút chính | Có | Thực hiện nghiệp vụ -> Phiên bản phân phối đã duyệt và số phải trả dự kiến cho từng cổ đông.. Chi trả thực tế là giao dịch riêng, không tự đánh dấu Paid sau khi duyệt. |

### Màn hình 58.2: Phân phối lợi nhuận cổ đông - Chi tiết / Kết quả

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Dữ liệu nguồn | Chỉ đọc | Có | Hiển thị kỳ, đối tượng, nguồn dữ liệu, người thao tác và các bản ghi liên quan. |
| Kết quả | Chỉ đọc / Bảng | Có | Phiên bản phân phối đã duyệt và số phải trả dự kiến cho từng cổ đông. |
| Truy vết | Liên kết | Không | Nhấn -> mở chứng từ/bản ghi đã tạo ra kết quả. |
| Lịch sử | Dòng thời gian | Không | Hiển thị các lần thay đổi, điều chỉnh hoặc phiên bản. |

### Màn hình 58.3: Xác nhận Phân phối lợi nhuận cổ đông

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tóm tắt | Chỉ đọc | Có | Tóm tắt phạm vi, số bản ghi và tác động. |
| Cảnh báo | Chỉ đọc | Tùy điều kiện | Hiển thị lỗi/cảnh báo phải xử lý trước khi xác nhận. |
| Xác nhận | Nút chính | Có | Xác nhận -> lưu giao dịch/phiên bản/nhật ký. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có báo cáo và tỷ lệ sở hữu đã khóa. |
| Các bước người dùng | Bước 1: Mở 58.1 -> tạo run.<br>Bước 2: Rà soát tính toán 58.2.<br>Bước 3: Duyệt/Xác nhận 58.3.<br>Bước 4: Ghi chi thực tế theo workflow cổ đông. |

---

# FR59 - Bảo trì nâng cao

**Giai đoạn:** Giai đoạn 2  
**Phân hệ:** Bảo trì  
**Nguồn:** P3; FR46

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kỹ thuật/Vận hành/Admin. |
| Quy tắc chức năng | Bảo trì nâng cao thêm lịch lặp, vendor và theo dõi công việc/chứng từ; chưa áp SLA/dự báo của Giai đoạn 3. |
| Tác động | Kế hoạch lặp sinh việc dự kiến; hoàn thành/chi phí vẫn ghi bằng bản ghi nguồn rõ ràng. |

## 2. Mô tả màn hình

### Màn hình 59.1: Danh sách kế hoạch bảo trì lặp

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kế hoạch | Bảng | Có | Tài sản/loại; chu kỳ; hạn tiếp theo; vendor/người phụ trách; trạng thái; số task đã sinh. |
| Tạo / Chỉnh sửa | Nút | Không | Mở 59.2. |

### Màn hình 59.2: Thiết lập kế hoạch bảo trì lặp

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tài sản / Phạm vi | Tra cứu | Có | Tài sản, tòa hoặc nhóm loại. |
| Chu kỳ | Điều khiển lịch | Có | Khoảng thời gian/lịch đã được duyệt. |
| Người phụ trách / Vendor | Tra cứu | Không | Giá trị mặc định cho task. |
| Bắt đầu / Kết thúc | Ngày | Có/Không | Hiệu lực kế hoạch. |
| Lưu | Nút | Có | Lưu kế hoạch -> sinh task tương lai theo lịch. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có tài sản và danh mục bảo trì. |
| Các bước người dùng | Bước 1: Mở 59.1.<br>Bước 2: Tạo/Chỉnh sửa tại 59.2.<br>Bước 3: Lưu -> task phát sinh xuất hiện ở FR46. |

---

# FR60 - Báo cáo mở rộng, phân tích vận hành và dự kiến từ dữ liệu hệ thống

**Giai đoạn:** Giai đoạn 3  
**Phân hệ:** Báo cáo  
**Nguồn:** SRC-02 `BÁO CÁO`; SRC-11; SRC-12; SRC-13; SRC-14; SRC-15; FR23/30/31/35/38/39/40; P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Quản lý/Kế toán/Admin và phòng ban theo quyền/phạm vi dữ liệu FR02/FR34. |
| Data-first | Báo cáo mở rộng được sinh từ dữ liệu nghiệp vụ/historical facts đã có trong hệ thống; không nhập tay trực tiếp số tổng báo cáo khi source record đã tồn tại. |
| Bộ lọc chung | Tối thiểu theo nguồn: thời gian, tòa, khu vực, NV vận hành, trưởng khu vực/leader, loại nhà T/S/G, cổ đông; Sales thêm tên Sale và Team Sale khi phù hợp. |
| Âm/dương điện nước | Theo `building + period + service`, bám cấu trúc SRC-12/SRC-13 (sheet `THÁNG m.yyyy điện` / `nước`). Với mỗi tòa và từng nhóm (máy giặt; thang máy + máy sấy + xe điện; điện; nước) lưu **phải thu**, **thực thu**, **không thu được = phải thu − thực thu**. Sau đó: `THU điện = Điện thực thu + ½ Máy giặt thực thu`; `THU nước = Nước thực thu + ½ Máy giặt thực thu` (`FIXTURE_CONFIRMED`: tòa T2 tháng 6 nước 1.690.000 + 410.000/2 = 1.895.000); `CHI` = hóa đơn NCC điện/nước của chính tòa (FR09); `THU − CHI` theo từng dịch vụ. Hiển thị thêm so sánh `CHI tháng này − CHI tháng trước` và tỷ lệ %. Phần tiêu thụ phòng trống/phá HĐ (`UNCOLLECTIBLE_UTILITY` FR14) hiển thị riêng. Drill tới InvoiceLine/PaymentAllocation/Supplier Bill/Expense. |
| Occupancy/Vacancy | Nguồn FR10 RoomStatusHistory; hiển thị/tổng hợp 3 nhóm đã chốt: `VACANT_READY_NOW`, `VACANT_END_OF_MONTH`, `WAITING_AVAILABLE`, đồng thời có thể tính tỷ lệ lấp đầy và thời gian trống từ interval. |
| Repair/Cleaning | Nguồn FR46 Work Item theo tòa/phòng, labor/material/payer + FR27 Expense/FR26 settlement; không phân bổ sửa chữa chung. |
| Payment timeliness | Đơn vị cơ sở là nghĩa vụ/hóa đơn đến hạn của khách. `ON_TIME` nếu đã thanh toán đủ 100% trước hoặc tại `due_date`; `OVERDUE` nếu qua `due_date` còn outstanding > 0. Partial payment trước hạn nhưng chưa đủ sau hạn vẫn OVERDUE. Báo cáo hiển thị số/tỷ lệ khách đúng hạn và quá hạn trong scope/kỳ. |
| Customer segmentation | Tính theo **distinct khách thuê** trong phạm vi/kỳ. `STUDENT_RATE = số khách segment STUDENT / tổng khách thuê`; `WORKER_RATE = số khách segment WORKER / tổng khách thuê`. Hai nhóm là taxonomy tối thiểu theo nguồn. |
| Sales views | Một Lead/khách có thể xem nhiều phòng; mọi lượt xem lưu ViewEvent nhưng denominator conversion đếm distinct Lead/khách, không đếm số phòng xem. |
| Sales close | Một Lead/khách chỉ được tính `CHỐT` khi Deal có phòng được chọn và có **cọc phòng đã ghi nhận/xác nhận**. Doanh số Sale = tổng giá phòng cho thuê được trong tháng theo từng Sale. |
| Conversion | `CONVERSION_RATE = DISTINCT_CLOSED_CUSTOMERS / DISTINCT_VIEW_CUSTOMERS × 100` trong phạm vi/filter report. **NOTE:** case xem tháng A nhưng đặt cọc/chốt tháng B cần xác nhận cách attribution cohort/date trước khi khóa report lịch sử cross-month. |
| Lợi nhuận / Giá vốn | Theo SRC-15: `NET_PROFIT / COGS`. Nguồn gọi chỉ tiêu này là `lợi nhuận / vốn` nhưng diễn giải là `lợi nhuận ròng / giá vốn`; SRS dùng metric code rõ nghĩa để tránh hiểu nhầm với vốn cổ đông. |
| Lợi nhuận / Tài sản | Nguồn công thức chi tiết nằm ở **SRC-15 `báo cáo.xlsx`**, không phải SRC-02: `NET_PROFIT / ASSET_VALUE`; tài sản nguồn gồm tiền mua sắm thiết bị + tài sản trong nhà. Nếu sau này áp dụng khấu hao/NBV thì phải tạo policy/version mới; không tự suy từ nguồn hiện tại. |
| Biên lợi nhuận tiền nhà | Theo SRC-15: `RENT_REVENUE_COLLECTED / HEAD_LEASE_PAYMENT_OR_COST` theo definition report được duyệt và cùng scope/kỳ. Drill về thu tiền phòng và nghĩa vụ/chi chủ nhà. |
| Chi phí giá vốn | Là các mục trong phần `Giá vốn` của báo cáo nhà nguồn; tổng hợp theo từng tòa và toàn hệ thống. |
| Chi phí cố định | Theo SRC-15: chính là nhóm `Chi phí vận hành` của báo cáo nhà, chi tiết từng loại và theo tòa/toàn hệ thống. |
| Chi phí phát sinh | Theo SRC-15/workbook: nhóm `Chi phí bán hàng phát sinh`, gồm Marketing/Hoa hồng, sửa chữa/thay thế/bảo trì, chi phí khác... ghi theo tòa nguồn. |
| Dự kiến / Forecast baseline | <span style="color:#CC0000">NEED_BUSINESS_CONFIRMATION (sửa v1.9).</span> SRC-14 `BẢNG DỰ KIẾN LỢI NHUẬN CÁC THÁNG` là **số giả định nhập tay theo tháng** (ví dụ tháng 4/2025: Tổng doanh thu 4.170.000.000; Mua sắm thiết bị 20.000.000; Phí marketing 80.000.000) với cấu trúc dòng giống báo cáo nhà; SRC-02 ghi "hỏi ngọc", SRC-15 ghi "gửi file". Thiết kế đề xuất: (1) hệ thống gợi ý baseline từ dữ liệu nguồn (HĐ, giá thuê, lịch chủ nhà, lương, chi phí kỳ trước); (2) người có quyền **được nhập/điều chỉnh giả định từng dòng** có version, người nhập, lý do; (3) Dự kiến dòng tiền gồm cọc mới/hoàn cọc/thiết bị, Dự kiến KD không gồm (theo SRC-15). Actual và Forecast luôn gắn nhãn riêng. |
| Precision | Giữ nguyên precision của dữ liệu/công thức nguồn; format UI/XLSX không được thay đổi giá trị business. |
| Snapshot | Mọi report actual/dự kiến phải lưu formula/report version và drill source; Actual và Forecast/Dự kiến phải được gắn nhãn riêng. |

## 2. Mô tả màn hình

### Màn hình 60.1: Danh mục báo cáo mở rộng

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Nhóm báo cáo | Danh sách | Có | Vận hành / Tài chính / Kinh doanh / Dự kiến. |
| Báo cáo | Bảng | Có | Âm dương điện nước; lấp đầy/thời gian trống; sửa chữa/vệ sinh; đúng hạn/quá hạn; phân khúc KH; conversion/doanh số; LNR/GV; LNR/tài sản; biên LN tiền nhà; chi phí giá vốn/cố định/phát sinh; bảng dự kiến... |
| Data readiness | Nhãn | Có | READY / NOTE_REQUIRED / MISSING_SOURCE. |
| Formula/Report version | Chỉ đọc | Tùy điều kiện | Version công thức/report. |
| Mở | Liên kết | Không | Mở báo cáo khi đủ quyền và definition. |

### Màn hình 60.2: Báo cáo thực tế

**Loại màn hình:** Trang báo cáo

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Bộ lọc | Bộ lọc | Có | Thời gian; tòa; khu vực; manager/leader; T/S/G; cổ đông; Sale/Team Sale khi phù hợp. |
| Metric | Bảng/Chart | Có | Actual metrics từ source facts. |
| Source coverage | Chỉ đọc | Có | Số record đủ/thiếu source và reconciliation status. |
| Drill-down | Liên kết | Có | Đi về Supplier Bill, RoomStatusHistory, Work Item, Invoice/Payment, Lead/View/Deal, Payroll... |
| Export | Nút | Không | XLSX theo definition được duyệt. |

### Màn hình 60.3: Báo cáo Dự kiến

**Loại màn hình:** Trang báo cáo

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ dự kiến | Bộ lọc | Có | Tháng/kỳ cần xem. |
| Dữ liệu cơ sở | Chỉ đọc | Có | Dữ liệu hiện có từ HĐ, tòa/phòng, doanh thu, chi phí, payroll, service và kế hoạch đã lưu. |
| Formula/Rule Version | Chỉ đọc | Có | Công thức tạo dự kiến. |
| Output | Bảng/Chart | Có | Tổng doanh thu dự kiến; chi phí dự kiến theo nhóm; tổng chi phí; lợi nhuận; LNR/DT; LNR/GV và các dòng theo template nguồn. |
| Scenario nâng cao | Tùy chọn | Không | Chỉ triển khai khi business yêu cầu; không phải điều kiện để có baseline forecast. |
| Save Snapshot | Nút | Tùy điều kiện | Lưu snapshot dự kiến/version, không ghi đè Actual. |

### Màn hình 60.4: Báo cáo Khách hàng / Sales Conversion

**Loại màn hình:** Trang báo cáo

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Bộ lọc | Có | Thời gian; tòa; khu vực; NV vận hành; Sale; Team Sale; T/S/G; cổ đông. |
| Khách xem | KPI | Có | Distinct Lead/khách có ít nhất một ViewEvent trong scope/kỳ. |
| Khách chốt | KPI | Có | Distinct Lead/khách có Deal chốt + cọc được xác nhận. |
| Conversion | KPI | Có | Khách chốt / Khách xem. |
| Lượt xem phòng | KPI phụ | Không | Tổng ViewEvent; không dùng làm denominator conversion. |
| Doanh số Sale | Bảng | Có | Tổng giá phòng cho thuê được trong tháng theo từng Sale. |
| NOTE | Cảnh báo | Tùy điều kiện | Chỉ hiện nếu report cross-month chưa khóa attribution rule. |

### Màn hình 60.5: Báo cáo Đúng hạn / Quá hạn

**Loại màn hình:** Trang báo cáo

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Scope | Bộ lọc | Có | Kỳ; tòa; khu vực; quản lý/leader. |
| Đúng hạn | KPI | Có | Số khách/nghĩa vụ đã trả đủ trước hoặc tại due_date. |
| Quá hạn | KPI | Có | Số khách/nghĩa vụ qua due_date còn balance > 0. |
| Tỷ lệ | KPI | Có | Tỷ lệ đúng hạn/quá hạn trên tổng nghĩa vụ đến hạn trong scope. |
| Drill | Bảng | Có | Khách; phòng; invoice; due_date; paid amount; outstanding; payment dates. |

### Màn hình 60.6: Báo cáo Phân khúc khách hàng

**Loại màn hình:** Trang báo cáo

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Kỳ / Scope | Bộ lọc | Có | Kỳ; tòa; khu vực; manager/leader; T/S/G. |
| Tổng khách thuê | KPI | Có | Distinct khách thuê thuộc scope/kỳ. |
| Sinh viên | KPI | Có | Số và % `STUDENT`. |
| Người đi làm | KPI | Có | Số và % `WORKER`. |
| Drill | Bảng | Có | Khách; segment; Stay/Contract; tòa/phòng; effective period. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Phase 1 đã capture historical facts và mapping nguồn đầy đủ; user có quyền Data Scope tương ứng. |
| Các bước người dùng | Bước 1: Chọn loại report tại 60.1.<br>Bước 2: Chọn kỳ/scope/filter.<br>Bước 3: Hệ thống tính từ source facts theo formula/report version, không nhập số tổng thủ công.<br>Bước 4: Drill-down kiểm tra nguồn khi cần.<br>Bước 5: Với dự kiến, hệ thống dùng dữ liệu/planned data hiện có để tạo snapshot riêng.<br>Bước 6: Export XLSX; giữ nguyên precision và metadata version. |

---

# FR61 - Báo cáo / kịch bản cổ đông nâng cao

**Giai đoạn:** Giai đoạn 3  
**Phân hệ:** Cổ đông  
**Nguồn:** P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Người quản trị tài chính/cổ đông được cấp quyền. |
| Quy tắc chức năng | Kịch bản what-if không được ghi sổ và không sửa phiên bản sở hữu/phân phối đã khóa. |
| Tác động | Kịch bản được chấp nhận có thể dùng làm đầu vào tạo phiên bản phân phối mới; tiền thực tế vẫn theo workflow chính thức. |

## 2. Mô tả màn hình

### Màn hình 61.1: Báo cáo cổ đông

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Cổ đông / Kỳ | Bộ lọc | Có | Đối tượng và kỳ báo cáo. |
| Số dư | Bảng | Có | Góp vốn đầu kỳ; phân bổ; chi trả; điều chỉnh; số dư cuối kỳ. |
| Truy nguồn | Liên kết | Có | Tỷ lệ sở hữu, phân phối và giao dịch thực tế. |

### Màn hình 61.2: Xây dựng kịch bản cổ đông

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Phiên bản cơ sở | Tra cứu | Có | Báo cáo/tỷ lệ/phân phối đã khóa. |
| Giả định What-if | Bảng nhập liệu | Có | Tỷ lệ/lợi nhuận/giữ lại/chi trả theo phạm vi được duyệt. |
| Xem trước | Nút | Có | Tính kịch bản không ghi sổ. |
| Lưu kịch bản | Nút | Không | Lưu riêng; không thay production. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có dữ liệu cổ đông nguồn. |
| Các bước người dùng | Bước 1: Mở báo cáo 61.1.<br>Bước 2: Tạo kịch bản 61.2 -> Xem trước/Lưu.<br>Bước 3: Nếu được duyệt thì tạo phiên bản phân phối chính thức qua FR58. |


---

---

# FR62 - SLA / nhà cung cấp / bảo trì dự báo

**Giai đoạn:** Giai đoạn 3  
**Phân hệ:** Bảo trì  
**Nguồn:** P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Kỹ thuật/Vận hành/Admin. |
| Quy tắc chức năng | SLA, KPI nhà cung cấp và dự báo thay thế cần ngưỡng/chính sách/model được duyệt; kết quả dự báo chỉ mang tính tư vấn. |
| Tác động | Cảnh báo/KPI hỗ trợ ưu tiên công việc; task và chi phí thực tế vẫn theo FR46/FR27. |

## 2. Mô tả màn hình

### Màn hình 62.1: Dashboard SLA / Vendor / Dự báo bảo trì

**Loại màn hình:** Trang tổng quan

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Bộ lọc | Bộ lọc | Không | Kỳ; tòa; vendor; loại tài sản. |
| KPI SLA | KPI / Bảng | Tùy điều kiện | Thời gian phản hồi/hoàn thành/quá hạn theo định nghĩa SLA được duyệt. |
| KPI Vendor | Bảng | Tùy điều kiện | Số việc; đúng hạn; chi phí; chất lượng kết quả khi có dữ liệu. |
| Cảnh báo dự báo | Danh sách | Tùy điều kiện | Gợi ý thay thế/bảo trì kèm rule/model version. |
| Điểm mở | Cảnh báo | Tùy điều kiện | <span style="color:#CC0000">OPEN: ngưỡng SLA, cách chấm vendor và mô hình dự báo chưa có trong nguồn hiện tại.</span> |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có lịch sử bảo trì và policy/model được duyệt. |
| Các bước người dùng | Bước 1: Mở 62.1.<br>Bước 2: Chọn bộ lọc và xem KPI/cảnh báo.<br>Bước 3: Mở/tạo task bảo trì thực tế ở FR46; dự báo không tự sinh chi phí. |


---

---

# FR63 - Bộ quy tắc thông báo nâng cao

**Giai đoạn:** Giai đoạn 3  
**Phân hệ:** Thông báo  
**Nguồn:** P3; FR20/56

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Admin; chủ nghiệp vụ được cấp quyền duyệt rule. |
| Quy tắc chức năng | Rule điều kiện-hành động có phiên bản/quyền; chạy rule tạo job/log thông báo và không trực tiếp sửa dữ liệu tài chính nguồn. |
| Tác động | Rule có thể gọi Zalo OA hoặc kênh được duyệt trong tương lai với lịch sử thực thi đầy đủ. |

## 2. Mô tả màn hình

### Màn hình 63.1: Danh sách Quy tắc thông báo

**Loại màn hình:** Danh sách / Grid

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Tìm kiếm | Ô nhập văn bản | Không | Tìm Quy tắc thông báo theo mã, tên hoặc thông tin được cấp quyền. |
| Bộ lọc | Bộ lọc | Không | Trạng thái; kênh; module/sự kiện; kỳ hiệu lực |
| Thêm mới | Nút | Không | Nhấn -> mở màn hình Tạo Quy tắc thông báo nếu có quyền. |
| Bảng dữ liệu | Bảng | Có | Mã/tên; điều kiện; phạm vi; hành động/kênh/template; lịch; ưu tiên; trạng thái; phiên bản. |
| Thao tác dòng | Menu thao tác | Không | Xem / Chỉnh sửa / Ngừng hoạt động theo trạng thái và quyền. |
| Phân trang / Sắp xếp | Điều khiển | Không | Áp dụng sau bộ lọc; giữ nguyên điều kiện khi quay lại từ Chi tiết. |

### Màn hình 63.2: Tạo Quy tắc thông báo

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin nhập | Biểu mẫu | Có/Tùy điều kiện | Mã/tên; nguồn sự kiện; cây điều kiện; phạm vi nhận; hành động/kênh; template; lịch/cooldown; ưu tiên; hiệu lực; trạng thái; fixture test. |
| Lưu | Nút chính | Có | Kiểm tra dữ liệu -> lưu bản ghi; nếu lỗi thì giữ nguyên dữ liệu đã nhập và hiển thị lỗi tại trường. |
| Hủy | Nút phụ | Không | Quay lại danh sách, không lưu thay đổi. |

### Màn hình 63.3: Chi tiết Quy tắc thông báo

**Loại màn hình:** Trang chi tiết

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chính | Chỉ đọc | Có | Mã/tên; điều kiện; phạm vi; hành động/kênh/template; lịch; ưu tiên; trạng thái; phiên bản. |
| Dữ liệu liên kết | Tab / Liên kết | Không | Hiển thị các bản ghi liên quan; nhấn -> mở đúng bản ghi nguồn. |
| Lịch sử | Dòng thời gian | Không | Người thao tác, thời gian, trạng thái và thay đổi quan trọng. |
| Chỉnh sửa | Nút | Không | Nhấn -> mở màn hình Chỉnh sửa Quy tắc thông báo nếu có quyền. |

### Màn hình 63.4: Chỉnh sửa Quy tắc thông báo

**Loại màn hình:** Biểu mẫu nhập liệu

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Thông tin chỉnh sửa | Biểu mẫu | Có/Tùy điều kiện | Mã/tên; nguồn sự kiện; cây điều kiện; phạm vi nhận; hành động/kênh; template; lịch/cooldown; ưu tiên; hiệu lực; trạng thái; fixture test. |
| Ngày hiệu lực / Lý do | Ngày + Văn bản | Tùy điều kiện | Bắt buộc khi thay đổi dữ liệu có hiệu lực theo thời gian hoặc dữ liệu tài chính/chính sách. |
| Lưu thay đổi | Nút chính | Có | Kiểm tra dữ liệu -> lưu phiên bản/lịch sử; không ghi đè dữ liệu kỳ đã khóa. |

### Màn hình 63.5: Xác nhận Ngừng hoạt động Quy tắc thông báo

**Loại màn hình:** Popup

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Đối tượng | Chỉ đọc | Có | Hiển thị Quy tắc thông báo đang được thao tác. |
| Lý do | Ô nhập nhiều dòng | Tùy điều kiện | Bắt buộc với hủy, ngừng hoạt động hoặc đảo giao dịch. |
| Xác nhận | Nút chính/nguy hiểm | Có | Ngừng hoạt động -> cập nhật trạng thái và ghi lịch sử; không xóa vật lý chứng từ đã được tham chiếu. |
| Hủy | Nút phụ | Không | Đóng popup, không thay đổi dữ liệu. |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Có nguồn dữ liệu và kênh thông báo được cấu hình. |
| Các bước người dùng | Bước 1: Danh sách 63.1.<br>Bước 2: Tạo/Test 63.2 -> Chi tiết 63.3.<br>Bước 3: Chỉnh sửa -> phiên bản 63.4.<br>Bước 4: Ngừng hoạt động 63.5; log chạy cũ giữ nguyên. |


---

---

# FR64 - Các chức năng BI / AI

**Giai đoạn:** Giai đoạn 3  
**Phân hệ:** BI/AI  
**Nguồn:** P3

## 1. Quy tắc nghiệp vụ

| Quy tắc nghiệp vụ | Mô tả |
| --- | --- |
| Phân quyền | Người dùng theo quyền dữ liệu; Admin quản lý tính năng/model. |
| Quy tắc chức năng | Kết quả AI/BI phải nêu nguồn/model/phiên bản và phân biệt Actual/Forecast/AI-generated; AI chỉ tư vấn nếu chưa có workflow được duyệt. |
| Tác động | AI có thể gợi ý bất thường/dự báo/tìm tài liệu nhưng không tự tạo hóa đơn, Payment, bảng lương hoặc chi trả cổ đông. |

## 2. Mô tả màn hình

### Màn hình 64.1: Không gian BI / AI

**Loại màn hình:** Trang tổng quan

| Trường | Định dạng | Bắt buộc? | Mô tả |
| --- | --- | --- | --- |
| Chức năng | Tab / Thẻ | Có | Dự báo phòng trống; dự báo công nợ; cashflow; bất thường điện/nước; tìm tài liệu; trợ lý nội bộ; phân tích hiệu suất khi được duyệt. |
| Phạm vi / Kỳ | Bộ lọc | Tùy điều kiện | Tòa/team/kỳ trong phạm vi quyền. |
| Kết quả | Bảng / Biểu đồ / Văn bản | Có | Gắn nhãn rõ Thực tế / Dự báo / AI tạo. |
| Bằng chứng / Nguồn | Liên kết | Có | Hiển thị dữ liệu/tài liệu hỗ trợ kết quả khi có. |
| Độ tin cậy / Phiên bản mô hình | Chỉ đọc | Tùy điều kiện | Model/rule version và bất định liên quan. |
| Thao tác | Nút | Tùy điều kiện | Chỉ mở nguồn hoặc tạo đề xuất; giao dịch tài chính phải qua FR nghiệp vụ tương ứng. |
| Điểm mở | Cảnh báo | Tùy điều kiện | <span style="color:#CC0000">OPEN: provider, ngưỡng accuracy, chính sách dữ liệu và acceptance criteria cần duyệt riêng.</span> |

## 3. Các bước người dùng

| Hạng mục | Mô tả |
| --- | --- |
| Điều kiện tiên quyết | Chức năng BI/AI và dữ liệu nguồn đã được cấu hình/cho phép. |
| Các bước người dùng | Bước 1: Mở 64.1.<br>Bước 2: Chọn chức năng/phạm vi -> sinh kết quả.<br>Bước 3: Rà soát nguồn/độ tin cậy -> mở bản ghi nguồn hoặc tạo đề xuất. |


---

---

# Phụ lục A - Các luồng liên thông FR trọng yếu

| Luồng | Chuỗi FR | Trọng tâm nghiệm thu |
|---|---|---|
| Hóa đơn hàng tháng | FR12 → FR13 → FR14/FR15 → FR16 → FR17 → FR18 | Đúng hợp đồng/giá hiệu lực; không trùng hóa đơn; PDF bám mẫu nguồn |
| Phòng mới / nhận phòng | FR31 → FR21 (cọc nếu đã thu) → FR11 → FR12/13 → FR16 → FR21/23 → FR38/39 | Phân biệt cọc, tiền phòng prorate, dịch vụ tháng đầu; bỏ cọc không được tính phòng mới |
| Gửi hóa đơn Zalo | FR18 → FR20 qua FR19 | Đúng hóa đơn đã phát hành, tham số, lịch sử gửi; không tự đổi trạng thái thanh toán |
| Thu tiền | FR17 → FR21/FR22 → FR23 → FR24 → FR25 → FR35 | Ngày thực nhận điều khiển nợ và M5/M10/M15; truy vết tới lương |
| Checkout / Hoàn cọc | FR11/FR12 → FR14 → FR17 → FR26 | Đủ dòng khấu trừ nguồn; phép tính tách khỏi giao dịch hoàn tiền thực tế |
| Chi phí / Báo cáo | FR27 → FR28 → FR38/FR39/FR40 → FR41 | Một chi phí nguồn; phân bổ minh bạch; tách Báo cáo Tổng và Kinh doanh |
| Chủ nhà / Tòa | FR05 → FR06 → FR07 → FR08/FR09 | Phiên bản HĐ; tách lịch trả tiền và chi phí thuê theo tháng; HĐ tiện ích + Supplier Bill |
| Kinh doanh → Lượt thuê | FR30 → FR31 → FR11 → FR12/FR13 | Lead/Deal/Lượt thuê tách ID; không trùng cọc/hoa hồng |
| Lương | FR34 + FR21 → FR24 → FR25 → FR35 → FR54 | Phân công lịch sử + ngày Payment + phiên bản chính sách |
| Cổ đông | FR42 + FR40 → FR43 → FR44 → FR58 | Số phân bổ tách khỏi chi trả thực tế |
| Tài sản / Bảo trì | FR45 → FR46/FR47 → FR27/FR26 → FR40 | Labor/material/payer; phần công ty chịu mới vào Expense; khách chịu/trừ cọc trace settlement |
| Utility profitability data | FR09 + FR16/17 + FR21 → FR27 → FR60 | Bill NCC/input cost + phải thu service + thực thu service line; đủ dữ liệu cho âm/dương mà không dựng lại từ Excel |
| Vacancy / Occupancy data | FR10 + FR11/FR31 → FR60 | RoomStatusHistory effective-dated; đủ tính room-days, occupancy/vacancy duration về sau |
| Sales conversion data | FR30 → FR31 → FR11 → FR60 | Lead/View/Deal stage timestamps; đủ tính viewed→closed và time-to-close |
| OCR | FR49/FR50 → FR06/FR12/FR13 | Rà soát → Xác nhận → Áp dụng; không ghi thẳng vào lịch sử tài chính đã phát hành |

# Phụ lục B - Bộ dữ liệu mẫu nghiệm thu

## Báo cáo tháng 8/2026
- Tổng doanh thu: **7.036.256.236**.
- Nhà T: **2.527.702.129**.
- Nhà S: **3.551.745.507**.
- Nhà G: **956.808.600**.
- Cọc phòng mới: **371.850.000**.
- Cọc khách bỏ: **18.400.000**.
- Hoàn cọc: **104.968.774**.
- Phòng phá HĐ: **39**.
- Phòng mới: **95**.
- Phòng trống: **11**.
- Doanh thu tiền phòng: **5.021.511.225,806452**.
- Doanh thu điện: **1.097.824.306,451613**.
- Doanh thu nước: **233.501.129,032258**.
- Vệ sinh: **117.643.376,344086**.
- Mạng: **104.264.193,548387**.
- Xe điện: **10.516.129,032258**.
- Thang máy: **55.920.301,075269**.
- Máy giặt: **125.500.150,537634**.
- Báo cáo Kinh doanh phải giữ đúng cầu nối khác biệt với Báo cáo Tổng về **cọc mới** và **mua sắm thiết bị** theo workbook nguồn: Tổng DT KD = **6.664.406.236**; Giá vốn KD = **5.281.548.771,92**; LNR KD = **685.928.968,72**. Hoàn cọc giữ như Báo cáo Tổng (formula `BUSINESS_V1_WORKBOOK`).

## Doanh thu — G1 tháng 8 (cơ sở tính)
- `TOTAL_REVENUE` G1 = Tổng đã đóng link 87.126.000 − Hoàn cọc 2.940.000 = **84.186.000** (khớp cột G1 sheet `BC DT THÁNG 8 NHÀ G`).
- `RENT_REVENUE` G1 = tiền phòng hóa đơn − phòng phá HĐ 601G1 + phòng mới = **57.348.387,10**.
- Vệ sinh = Máy giặt = 50% DV Combo (G1 tháng 6: 1.352.000 mỗi dòng).

## DT niêm yết — bảng lương tháng 8
- T3 = Σ giá niêm yết 22 phòng = 103.000.000; T10 = 32.800.000 (8 phòng); T20 = 42.000.000 (17 phòng); T22 = 31.500.000 (9 phòng); T24 = 36.200.000 (10 phòng).

## Phân bổ chi phí chung — G1 tháng 8
- 15 phòng / 1.382 phòng hệ thống: `Lương quản lý tổng = 13.000.000/1382×15`; `Lương TPVH = 20.000.000/1382×15 + 10.000×15`; `Lương phó phòng VH = 4.000.000/1382×15`; `Lương NV nguồn = 3.000.000/1382×15`; `Lương sửa chữa = 25.000.000/1343×15` (giữ nguyên mẫu số lịch sử).
- Tổng các khoản allocation của toàn hệ thống phải bằng chi phí chung nguồn (sai số chỉ do precision).

## Lương vận hành — quy tắc chọn mức
- T10 HS 92,14 → 112.610,51; T3 HS 94,27 → 118.087,52; S9 HS 100,08 → 130.107,67; G13/G12A/G14 cố định 100.000/phòng; TPVH 774 phòng → 7.740.000.


## Fixture Phòng mới tháng 9 / tháng 10
- Sheet `PHÒNG MỚI THÁNG 9` là fixture bắt buộc cho luồng khách vào giữa tháng: phải truy được `ngày nhận phòng`, `ngày bắt đầu tính tiền`, `cọc`, `tiền phòng tháng đầu`, **dịch vụ**, `tổng cần đóng`, `đã đóng`, `công nợ`. Phòng mới có dịch vụ trong tháng đầu; không được chỉ tạo cọc + tiền phòng.
- Ví dụ giá phòng **3.500.000**, bắt đầu tính từ **06/09** (tháng 30 ngày): tiền phòng tháng đầu = `3.500.000 / 30 × 25 = 2.916.666,67`; dịch vụ tháng đầu = `580.000 / 30 × 25 = 483.333,33`; tổng cần đóng = cọc 3.500.000 + 2.916.666,67 + 483.333,33 = **6.900.000**.
- Ví dụ tháng 31 ngày (`PHÒNG MỚI THÁNG 7`, 501T27, vào **10/07**): tiền phòng = `3.500.000 / 31 × 22 = 2.483.870,97`; dịch vụ = `SUM(DV cố định) / 31 × 22 = 482.580,65`. Test bắt buộc để chặn lỗi mẫu số cố định 30.
- Sheet `PHÒNG MỚI THÁNG 10` dùng để test trường hợp ngày 01: tiền phòng tháng đầu bằng đủ giá tháng.
- `Cọc phòng mới` phải lấy từ nghĩa vụ cọc của lượt thuê `NEW_ROOM`; `Cọc khách bỏ không ở` lấy từ `FORFEITED_DEPOSIT` và không tăng `Tổng số phòng mới`.
- Payment phải allocation được tối thiểu: `CỌC`, `TIỀN PHÒNG`, `DỊCH VỤ`, `KHÁC/PHÁ HĐ`.

## Hóa đơn
Nghiệm thu tối thiểu:
- Trường vận hành theo tòa/phòng/quản lý/kỳ.
- Dịch vụ cố định từ hợp đồng + dịch vụ theo chỉ số + khoản phát sinh + nợ cũ.
- Bốn mẫu: `HĐ (VP)`, `HĐ (VP-HẰNG)`, `HĐ (TECH)`, `HĐ G1 (TECH)`.
- Hoàn cọc đủ các dòng: cọc, tiền phòng, điện, nước, vệ sinh, internet, thang máy, gửi xe, máy giặt, khấu hao (mặc định 200.000/phòng), sửa chữa, dọn vệ sinh, sơn, khác, tổng hoàn.
- Phá HĐ: 20 phòng sheet `DS phòng phá hđ` — không hoàn cọc; tổng phải thu (tiền điện) 16.048.000, đã thu 3.662.000.
- Logic cập nhật thu tiền theo tòa/quản lý.

## Lương vận hành
Nghiệm thu phải truy được:
- DT NIÊM YẾT.
- DT PHẢI THU.
- DT MỐC 1 / MỐC 2 / MỐC 3.
- TỔNG DT SAU 3 MỐC.
- DỊCH VỤ và TỈ LỆ DV/DT.
- DT THU THÊM.
- TỔNG DT THU ĐƯỢC.
- HIỆU SUẤT.
- MỨC LƯƠNG/PHÒNG.
- TỔNG / THỰC NHẬN.

# Phụ lục C - Các điểm cần xác nhận / còn mở

> Cập nhật v1.9 (06/10/2026). Mỗi mục ghi rõ phương án mặc định hệ thống đang dùng cho tới khi khách xác nhận.

| # | Điểm cần xác nhận | Căn cứ / mâu thuẫn trong nguồn | Mặc định hệ thống |
| --- | --- | --- | --- |
| C-01 | Định nghĩa 3 nhóm phòng trống (trống ở luôn / trống hết tháng / đang chờ) và quy tắc chuyển trạng thái. | SRC-02 chỉ nêu tên nhóm. | Cho chọn nhóm khi đổi trạng thái phòng (FR10.5), lưu history. |
| C-02 | Hoàn cọc trong Báo cáo Kinh doanh. | SRC-02/SRC-15 ghi "không gồm hoàn cọc"; workbook tháng 8 vẫn trừ hoàn cọc. | `BUSINESS_V1_WORKBOOK` (theo workbook); sẵn `BUSINESS_V2_EXCLUDE_REFUND`. |
| C-03 | Lương: HS < 70% "phụ cấp 10%" là 10% của khoản nào; mốc tính "trên 1 năm"; văn bản SRC-05 ghi "÷100" nhưng ví dụ "÷90". | SRC-05 vs SRC-03. | Quy tắc chọn mức theo SRC-03 (FR25); HS < 70% nhập tay có duyệt. |
| C-04 | Ngoại lệ lương S39 (HS 97,26 → 130.000/100) là nhập nhầm hay ngoại lệ. | SRC-03 tháng 8. | Override theo dòng có lý do. |
| C-05 | Thời hạn áp dụng lương cố định 100.000/phòng cho G12A/G13/G14 và danh sách tòa áp dụng. | SRC-03 tháng 8. | Cấu hình `FIXED_PER_ROOM` theo tòa + hiệu lực. |
| C-06 | Công thức lương phòng Kinh doanh, Kỹ thuật, Thị trường, TC-KT. | SRC-02 chỉ liệt kê tên phòng. | Nhập lương/thành phần lương thủ công. |
| C-07 | Thành phần chính thức của `TOTAL_REVENUE` (included/excluded). | G1: cơ sở thực thu − hoàn cọc (xem C-26). | Theo workbook/G1. |
| C-08 | Công thức Hiệu suất / Lợi nhuận / Thời gian vận hành của từng tòa. | SRC-02 chỉ nêu tên chỉ tiêu. | Định nghĩa đề xuất tại FR08. |
| C-09 | Mục "Tài chính" trong chi tiết khách hàng. | SRC-02 ghi dở ("thêm danh sách khách hoà gồm: mã phòng mã tòa,"). | Hiển thị cọc, công nợ, hóa đơn, phiếu thu, hoàn cọc. |
| C-10 | Phí sạc xe điện và phí gửi xe: hai dòng riêng hay chung trên hóa đơn. | SRC-02 tách hai loại; SRC-08 chỉ có cột `XE ĐIỆN`. | Hai mã dịch vụ, cùng metric `ELECTRIC_VEHICLE_REVENUE`. |
| C-11 | Báo cáo dự kiến dòng tiền / kinh doanh: nhập giả định tay hay sinh từ dữ liệu. | SRC-14 là số nhập tay; SRC-02 "hỏi ngọc". | Baseline gợi ý + cho nhập giả định có version (FR60). |
| C-12 | Mẫu số phân bổ lương sửa chữa tháng 8 dùng 1.343 (tháng 7) thay vì 1.382. | G1 `C43`. | Giữ nguyên số lịch sử khi import; kỳ mới dùng snapshot của kỳ. |
| C-13 | Ngoại lệ dịch vụ tháng đầu (dòng thu đủ tháng / miễn DV). | SRC-08 có dòng nhập tay. | Prorate theo ngày là mặc định; override có lý do. |
| C-14 | Phá HĐ có thu thêm nước/dịch vụ/tiền phòng còn thiếu ngoài tiền điện không. | SRC-08 `DS phòng phá hđ` chỉ có tiền điện. | Mặc định chỉ tiền điện; khoản khác thêm tay có lý do. |
| C-15 | Phạm vi Phase: SRS đặt FR01–FR50 ở Giai đoạn 1, `00_SCOPE_3_PHASE.md` đặt OCR/hoa hồng/bảo trì ở Phase 2 và cổ đông/tài sản/nhân sự-lương ở Phase 3. | Xem Phụ lục D. | Giữ phân giai đoạn của SRS cho tới khi chốt. |
| C-16 | Sales conversion cross-month: xem tháng A, cọc/chốt tháng B. | Chưa có nguồn. | Theo tháng chốt; chưa khóa report lịch sử. |
| C-17 | Loại tin Zalo (OA/ZNS), template ID, retry/cooldown, điều kiện nhận. | Chưa có trong SRC-02…SRC-15. | Cấu hình FR19. |
| C-18 | Danh mục `occupation_category/customer_segment` và `commission_case_type` chính thức. | Nguồn mới có Sinh viên / Người đi làm. | Danh mục do admin cấu hình. |
| C-19 | Utility lệch kỳ; head-lease tháng lẻ/thuế/phụ phí; split-payer repair. | Chưa đủ chứng cứ. | Lưu dữ liệu, chưa freeze policy. |
| C-20 | Forecast/ROI/BI/AI; SLA/vendor/predictive maintenance. | Phase 2/3. | Không làm ở Giai đoạn 1. |
| C-21 | Chính sách xóa dữ liệu production. | — | **Không xóa vật lý** bản ghi đã được tham chiếu. |
| C-22 | Mapping dịch vụ → dòng báo cáo: G1 chia DV Combo/DV khác 50/50 vào vệ sinh + máy giặt và cộng điện chung vào điện; sheet `BC DT THÁNG 8 NHÀ T/S/G` lại gộp "thang máy / dv khác / điện chung". | G1 vs SRC-04. | Theo G1 (bảng mapping FR38, có version). |
| C-23 | Ý nghĩa và mục đích dùng của cột `Giá QL`. | SRC-08 có 3 mức giá. | Lưu ở FR10, chưa dùng trong công thức. |
| C-24 | Phí phạt chậm 200K/ngày in trên hóa đơn có thu thật không. | SRC-08 mẫu `HĐ (VP)`; không có dòng thu phạt. | Chỉ in; thu phạt thì tạo khoản FR15. |
| C-25 | Giai đoạn hiển thị "Báo cáo kinh doanh của nhà" (âm/dương). | SRC-02 đặt trong Tài chính chung; SRS để FR60 Giai đoạn 3. | Dữ liệu thu từ Giai đoạn 1; báo cáo Giai đoạn 3 cho tới khi chốt. |
| C-26 | Danh sách khoản included/excluded của `TOTAL_REVENUE` cơ sở thực thu (ví dụ nợ cũ, thu khác, cọc khách cũ). | G1 `C2`. | Toàn bộ tiền đã đóng của kỳ − hoàn cọc. |
| C-27 | Kỳ thanh toán nhiều tháng: dịch vụ có thu theo kỳ cùng tiền phòng không; xử lý `PREPAID_RENT` chưa dùng khi khách phá HĐ/trả phòng giữa kỳ. | SRC-08: phần lớn `Kỳ TT 0` vẫn thu dịch vụ; một số ghi "tiền nhà + dv". | Dịch vụ thu hàng tháng; prepaid chưa dùng chuyển sang quyết toán FR26 để khách xác nhận. |
| C-28 | Giai đoạn mở tòa: thời điểm chuyển `SETUP` → `OPERATING`; số vốn phải góp mỗi tòa tính theo công thức nào (G1 chỉ có số `Đã đóng` nhập tay). | G1 `THU CHI BAN ĐẦU`. | Hết tháng vận hành đầu tiên; vốn góp nhập tay theo tỷ lệ. |
| C-29 | Cọc mới trong Báo cáo Kinh doanh trừ theo số đã thu hay số theo HĐ khi khách chưa đóng đủ cọc. | Fixture G1 chưa có ca thiếu cọc. | Trừ theo số đã thu (`NEW_DEPOSIT_COLLECTED`). |

## Các NOTE / Gap sau vòng đối chiếu v1.9

### Đã đóng / sửa trong v1.9 (có bằng chứng nguồn)

- Prorate tiền phòng tháng đầu theo **số ngày của tháng** (thay rule `/30` của v1.8).
- Dịch vụ FIXED tháng đầu prorate `/ số ngày của tháng × số ngày dịch vụ` (đóng NOTE dịch vụ tháng đầu của v1.8).
- Phân bổ chi phí/lương khối chung theo `ROOM_COUNT` trên tổng số phòng hệ thống (thay khẳng định "ghi trực tiếp theo tòa, không phân bổ" của v1.8 đối với VP, marketing chung và lương khối gián tiếp). Chi phí có tòa nguồn vẫn ghi trực tiếp.
- Quy tắc chọn mức lương trong khoảng bậc, HS ≥ 100 không chặn trần, lương trưởng nhóm `10.000 × số phòng`, lương sửa chữa, tòa lương cố định.
- HS thực tế / HS tạm tính.
- Phá HĐ không hoàn cọc, phải thu tiền điện; khấu hao hoàn cọc mặc định 200.000/phòng.
- `EARLY_TERMINATION_COUNT` theo `notice_date` (đồng bộ FR38).
- Công thức bảng chia cổ đông G1 (`Vốn`, `LN gộp`, `LN ròng`, `Tổng nhận`).

### Giữ nguyên từ v1.8

- HĐ chủ nhà thanh toán theo kỳ; hết thời gian giữ giá không tự tăng giá. Thuê tiếp giá mới → tạo Price Version; không thuê tiếp → kết thúc/không gia hạn.
- Âm/dương utility tính theo từng tòa: Thu từ doanh thu/thực thu service; Chi từ chi phí công ty đóng NCC của tòa.
- Giữ nguyên precision tính toán; format hiển thị không thay đổi business value.
- Sửa chữa ghi trực tiếp theo tòa/phòng và cost line; lương nhân viên sửa chữa là khoản chung phân bổ theo số phòng.
- Đúng hạn = trả đủ trong hạn; quá hạn = qua due_date còn thiếu.
- Conversion đếm distinct khách/Lead; khách có thể xem nhiều phòng; chỉ chốt khi có phòng + cọc xác nhận.
- Phân khúc khách hàng: Sinh viên / Tổng khách thuê và Người đi làm / Tổng khách thuê.
- `LNR/Tài sản` ghi rõ nguồn formula là SRC-15 `báo cáo.xlsx`.

### Chuyển sang cần xác nhận trong v1.9

- Hoàn cọc trong Báo cáo Kinh doanh (C-02).
- Báo cáo dự kiến (C-11).
- Định nghĩa 3 nhóm phòng trống (C-01).

## Phụ lục C.1 - Permission Matrix mặc định Phase 1

Ký hiệu: `R` = View, `C` = Create, `U` = Update, `A` = Approve/Adjust, `E` = Export, `M` = Manage.  
Ma trận dưới đây là **default role template**; FR02 cho phép cấu hình chi tiết nhưng không được vượt policy an toàn.

| Module | Admin | Kế toán | Leader VH | Quản lý VH | Leader KD | Sales | HR | Kỹ thuật |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| User/Role/Permission | RCUAME | R | R | - | R | - | R | - |
| Org Chart | RCUAME | R | R theo subtree | R self | R theo subtree | R self | RCUAME | R |
| Assignment | RCUAME | R | RCU theo subtree | R self | R | R self | RCU | R |
| Chủ nhà/HĐ chủ nhà | RCUAME | RCUA | R | R | - | - | R | - |
| Tòa/Phòng | RCUAME | R | R theo scope | R theo scope | R theo scope | R theo scope | R | R theo scope |
| Khách/HĐ khách | RCUAME | R | R theo scope | RCU theo scope | R theo scope | RCU theo scope | R | - |
| Meter/Service Input | RCUAME | RCUA | R theo scope | RCU theo scope | - | - | - | RCU theo scope |
| Invoice | RCUAME | RCUA | R theo scope | RCU theo scope | - | - | - | - |
| Payment/Debt | RCUAME | RCUA | R theo scope | RCU theo scope | - | - | - | - |
| Expense | RCUAME | RCUA | R theo scope | C theo scope nếu cấp | - | - | R | C theo scope |
| Lead/Deal | RCUAME | R tài chính | R | R | RCUA theo subtree | RCU self/team | - | - |
| Commission | RCUAME | RCUA | - | - | RA theo subtree | R self | - | - |
| Payroll | RCUAME | RCUA | R subtree | R self | - | - | RCUA | - |
| Report | RCUAME | RCUAE | R scope | R scope | R scope nếu cấp | R scope nếu cấp | R nếu cấp | R nếu cấp |
| Reconciliation | RCUAME | RCUAE | - | - | - | - | - | - |
| Shareholder | RCUAME | RCUA | - | - | - | - | - | - |
| Asset/Maintenance | RCUAME | R tài chính | R scope | R scope | - | - | R | RCUA scope |

### Scope mặc định theo role

| Role | Organization Scope | Data Scope |
| --- | --- | --- |
| Admin | ALL | ALL |
| Kế toán | ALL hoặc theo policy | ALL financial/report; không mặc định manage org/user |
| Leader Vận hành | ORG_SUBTREE của chính Leader | Building/Room scope của subtree |
| Quản lý Vận hành | SELF | ASSIGNED_BUILDINGS/ROOMS |
| Leader Kinh doanh | ORG_SUBTREE KD | Lead/Deal/team scope; building scope theo quyền |
| Sales | SELF/TEAM theo policy | Lead/Deal được giao; room/building được cấp |
| HR | ALL org hoặc phạm vi HR | Employee/org; payroll theo permission riêng |
| Kỹ thuật | SELF/TEAM theo policy | Assigned buildings/rooms/assets/work items |

**Acceptance bảo mật:** Leader A không nhìn thấy nhân sự/quản lý/tòa của Leader B nếu không có explicit grant; Manager A1 không nhìn thấy tòa của A2 nếu không có explicit grant; API trực tiếp ngoài scope phải DENY.


# Phụ lục D - Ranh giới các giai đoạn

## Giai đoạn 1 — Go-live / vận hành thực tế
FR01–FR50: Go-live + **report-ready data foundation**: HĐ chủ nhà và monthly rent recognition, HĐ tiện ích + Supplier Bill, Room Status History, khách/segment, Lead/Deal stage history, OCR, Contract Service Snapshot, Billing, PaymentAllocation tới service line, công nợ/M5-M10-M15, refund/settlement, Expense/Allocation, repair labor-material-payer, commission case data, payroll allocation, 2 báo cáo chuẩn nguồn + drill-down, cổ đông, tài sản/bảo trì và import.

## Giai đoạn 2 — Tự động hóa và vận hành phòng ban
FR51–FR59: Kinh doanh/hoa hồng/nhân sự/lương nâng cao, tuổi nợ, Zalo tự động, vòng đời tài sản, phân phối cổ đông và bảo trì nâng cao; có thể tối ưu OCR nhưng OCR cơ bản đã vận hành từ Giai đoạn 1.

## Giai đoạn 3 — Phân tích thông minh / tự động hóa tài chính / mở rộng
FR60–FR64: Báo cáo nâng cao/dự báo, kịch bản cổ đông, SLA/predictive maintenance, rule engine thông báo và BI/AI. **Không bao gồm đối soát ngân hàng, QR Payment hoặc tự động khớp thanh toán.**

## Lệch phạm vi với `00_SCOPE_3_PHASE.md` (v1.9 — cần chốt, xem C-15)

| Chức năng | SRS này | `00_SCOPE_3_PHASE.md` |
| --- | --- | --- |
| OCR hợp đồng (FR49/FR50) | Giai đoạn 1 | Phase 2 |
| Hoa hồng (FR32) | Giai đoạn 1 (import số đã duyệt) | Phase 2 |
| Lead/Deal/CRM (FR29–FR31) | Giai đoạn 1 | Phase 2 |
| Bảo trì, sổ sửa chữa (FR46) | Giai đoạn 1 | Phase 2 |
| Import nâng cao (FR48) | Giai đoạn 1 | Phase 2 |
| Cổ đông (FR42–FR44) | Giai đoạn 1 | Phase 3 |
| Tài sản, kiểm kê (FR45, FR47) | Giai đoạn 1 | Phase 3 |
| Nhân sự / lương (FR33–FR35) | Giai đoạn 1 | Phase 3 |
| Báo cáo P&L Tổng / Kinh doanh (FR37–FR41) | Giai đoạn 1 | Phase 1 chỉ có báo cáo phòng / công nợ / thu tiền; báo cáo quản trị ở Phase 2 |
| Zalo nhắc trước hạn / quá hạn | Giai đoạn 2 (FR56, tự động) | Phase 1 (nhắc trước hạn, nhắc quá hạn, retry) |

Hai tài liệu phải thống nhất một bảng phân phase trước khi ước lượng/ký phạm vi. SRS v1.9 chưa đổi giai đoạn của FR nào.

# Phụ lục E - Data Capture Contract & Future Report Readiness

## E.1 Nguyên tắc bắt buộc

Mỗi nhóm dữ liệu reportable phải trả lời được:

1. **Ai/FR nào tạo record nguồn?**
2. **Business date/effective date nào xác định kỳ?**
3. **Building/Room/Stay/Contract nào sở hữu dữ liệu?**
4. **Có phải dữ liệu trực tiếp theo tòa hay Shared thật sự?** Ưu tiên building source trực tiếp nếu tài liệu nguồn đã có tòa.
5. **Chỉ khi shared thật sự và không có building source** mới cần allocation version.
6. **Metric/formula version nào dùng record?**
7. **Từ report click được về source/chứng từ nào?**

Không đạt đủ lineage thì metric chưa được xem là production-ready.

## E.2 Ma trận dữ liệu Phase 1 → báo cáo

| Nhóm báo cáo | Data source Phase 1 bắt buộc | Trạng thái Phase 1 |
| --- | --- | --- |
| Báo cáo Tổng | InvoiceLine; Contract Event; Refund/Settlement; Expense; Allocation; Payroll Allocation; FR07 rent recognition | Bắt buộc chạy report |
| Báo cáo Kinh doanh | Cùng base metrics với Tổng + BUSINESS formula set/version | Bắt buộc chạy report |
| Chi tiết tòa | Building snapshot + toàn bộ source/allocations ở trên | Bắt buộc drill-down |
| Âm/dương điện nước | InvoiceLine theo service + PaymentAllocation tới service line + FR09 Supplier Bill/FR27 input cost | Phase 1 bắt buộc capture; UI/report có thể triển khai sau |
| Lấp đầy/thời gian trống | FR10 RoomStatusHistory + Stay/Deal event | Phase 1 bắt buộc capture; report có thể sau |
| Sửa chữa/vệ sinh | FR46 Work Item: labor/material/payer + FR27/FR26 linkage | Phase 1 bắt buộc capture; report có thể sau |
| Đúng hạn/quá hạn | Invoice/Obligation due_date + PaymentAllocation/payment_date/outstanding | Data + formula đã chốt: trả đủ trong hạn = ON_TIME; qua hạn còn thiếu = OVERDUE; report UI ở FR60 |
| Sales conversion | Lead/ViewEvent + Deal + Deposit confirmation | Data Phase 1 bắt buộc; distinct Lead/khách, chốt khi có cọc; còn NOTE attribution cross-month |
| Customer segmentation | Customer/Stay segment code + effective snapshot | STUDENT/WORKER trên tổng khách thuê; data Phase 1 bắt buộc, report FR60 |
| Commission | FR32 case/source/party/approved/paid + Expense link | Core data Phase 1; rule engine Phase 2 |
| Kỳ thanh toán / trả trước | HĐ `payment_cycle_months`; Invoice `Kỳ TT`; PaymentAllocation `RENT`/`PREPAID_RENT` theo `service_month` | Bắt buộc capture Phase 1 (dùng cho FR24 TH1 và doanh thu theo tháng) |
| Giai đoạn mở tòa | Building `SETUP` dates; Expense cờ `SETUP_PHASE`; giao dịch góp vốn cổ đông | Bắt buộc capture Phase 1; Bảng thu chi ban đầu FR44 |
| Cọc mới đã thu | PaymentAllocation `CỌC` của `NEW_ROOM` (`NEW_DEPOSIT_COLLECTED`) | Bắt buộc cho Báo cáo Kinh doanh |
| Lợi nhuận/vốn | Report Snapshot + COGS | Theo SRC-15, chỉ tiêu nguồn được diễn giải là `LNR / Giá vốn`; không dùng vốn cổ đông cho metric này |
| Lợi nhuận/tài sản | Asset registry + equipment purchase + Report Snapshot | Formula nguồn nằm ở SRC-15: `LNR / tài sản`; asset valuation nâng cao/khấu hao chỉ version thêm nếu business yêu cầu |
| Forecast lợi nhuận/cashflow | Actual/history + planned/known system data + giả định nhập tay có version (SRC-14) | Baseline gợi ý từ data + giả định nhập tay có version/người duyệt (FR60, C-11) |

## E.3 Các record lịch sử không được chỉ giữ current value

Tối thiểu các đối tượng sau phải effective-dated/versioned:

```text
OwnerContractPriceVersion
HeadLeaseCostRecognition
UtilityContractVersion
UtilitySupplierBill / Adjustment
RoomStatusHistory
Customer/Stay Segment Snapshot
ContractServiceVersion
LeadStageHistory
DealStageHistory
Invoice/InvoiceLine Snapshot
Payment/PaymentAllocation
Expense / ExpenseAllocationVersion
PayrollResult / PayrollCostAllocation
Commission / Case / Payment status
RepairMaintenanceWorkItem
ShareOwnershipVersion
ReportMetricDefinition / ReportSnapshot
```

## E.4 Acceptance data-first trước go-live

- Chọn ngẫu nhiên một dòng doanh thu điện của một tòa: drill `Report → InvoiceLine → PaymentAllocation` khi kiểm thực thu.
- Chọn một dòng giá gốc điện: drill `Report → Expense → Utility Supplier Bill → HĐ tiện ích/chứng từ`.
- Chọn một dòng chi phí sửa chữa: drill `Report → Expense → Work Item → labor/material/payer → chứng từ`; nếu khách chịu thì không xuất hiện như chi phí công ty trừ khi có phần company-share.
- Chọn `Phòng trống` của kỳ: truy được các RoomStatusHistory interval tạo count, không dựa current status.
- Chọn `Tiền thuê nhà`: truy `Report → HEAD_LEASE_COST_RECOGNITION → Owner Contract Price Version`; không truy trực tiếp từ một khoản trả 3/4/6 tháng rồi dồn vào tháng thanh toán.
- Chọn conversion sales về sau: Lead/View/Deal có timestamp đầy đủ từ ngày go-live, không phải bổ sung hồi tố.

