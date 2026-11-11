# TimoHouse – Mockup tương tác Phase 1 + Phase 2 + Phase 3

Mockup click-through dựng từ bộ PNG `Phase_1_Core_Rental_GoLive/` (mặc định), `Phase_2_Sales_Automation_Operations/` và `Phase_3_Enterprise_Investment/` (bật bằng công tắc phase – xem mục *Phase 2* / *Phase 3* bên dưới), SRS v1.2 và UI Spec v1.5. Mọi nút trong PNG đều bấm được; dữ liệu thay đổi thật (localStorage) theo state machine của SRS §6.

## Chạy
- **Cách 1:** mở `index.html` bằng Chrome/Edge (double-click) – chạy trực tiếp từ file://.
- **Cách 2:** ở thư mục gốc repo chạy `npm run dev` rồi mở `http://localhost:8765` (cần Node ≥ 20, không cần cài dependency).
- **Deploy Netlify:** xem mục *Deploy lên Netlify* trong `README.md` ở gốc repo (`npm run build` → thư mục `dist/`; repo đã có `netlify.toml`).
- Tài khoản demo (mật khẩu bất kỳ): `admin` (Quản trị viên), `ketoan` (Kế toán), `vanhanh` (Vận hành); khi bật Phase 2 thêm `sale` (Sale), `kythuat` (Kỹ thuật); khi bật Phase 3 thêm `nhansu` (Nhân sự), `codong` (Cổ đông – read-only). Đổi vai trò nhanh ở menu góc phải.
- Ngày hệ thống demo cố định **28/10/2026**, kỳ **Tháng 10/2026** để khớp số liệu mockup (đổi tại *Công cụ nâng cao*).

## Kịch bản demo 16 điều kiện Go-live
Bật **Hướng dẫn thao tác** (nút trên topbar). Panel dẫn qua 10 luồng / 36 mốc, tự nhận biết hoàn thành từ dữ liệu bạn tạo:

| Luồng | Nội dung | Go-live |
|---|---|---|
| S0 | Đăng nhập, Tổng quan, Danh mục dịch vụ, Phòng sẵn sàng | – |
| F01 | Thêm khách thuê | 1 |
| F02 | Chọn phòng → Tạo hợp đồng → giá/cọc/dịch vụ → Kích hoạt (phòng → Đang thuê) | 2, 3, 4 |
| F03 | Nhập điện nước → Preflight → Tạo nháp → Phát hành hóa đơn | 5, 6 |
| F04 | Gửi hóa đơn qua Zalo (re-check công nợ, tiến độ gửi) | 7 |
| F05 | Xem công nợ → Thu một phần → Chi tiết khoản thu → Theo dõi còn nợ | 8, 9, 10 |
| F06 | Nhắc công nợ qua Zalo, thử lại tin lỗi | 11 |
| F07 | Kết thúc hợp đồng → phòng Chờ dọn, tạo hồ sơ hoàn cọc | 12, 14 |
| F08 | Lập phương án → Gửi duyệt → Kế toán duyệt → Ghi nhận đã hoàn | 13 |
| F09 | Xác nhận dọn xong → phòng Sẵn sàng | 15, 16 |
| F10 | Chi phí, Import khách bằng file mẫu, Tạo tài khoản, Xuất báo cáo | tùy chọn |

Các nút trong panel (Đi tới màn hình, Chuyển vai trò, Xem/Điền dữ liệu mẫu, Tải/Dùng file mẫu) **không tạo record**; record chỉ sinh qua nút Lưu/Xác nhận của màn nghiệp vụ.

## Công cụ nâng cao (cuối sidebar)
Đặt lại dữ liệu demo · Xóa trắng dữ liệu nghiệp vụ · Đổi ngày hệ thống · Xuất/Nhập state JSON · Chạy toàn bộ kịch bản Go-live (kiểm tra kỹ thuật) · Reset tiến độ hướng dẫn. API console: `window.__timehouseDemo`.

## Quy ước & mặc định nghiệp vụ (OI còn mở)
- Mã phòng chuẩn hóa `A.12.03`; mã đợt Zalo `ZL-202610-xxx`.
- Nút thao tác trên dòng bảng ở dạng icon; rê chuột hoặc focus (Tab) vào icon để xem tên thao tác. Nút ⋮ mở menu thao tác đầy đủ.
- **Bố cục màn danh sách** (P1/P2/P3): bảng, kanban, lịch, lưới chấm công luôn **full-width**; các card phụ (biểu đồ, lịch sắp tới, hướng dẫn, quy tắc…) nằm trong dải **Thông tin liên quan** phía trên bảng – bấm thẻ để mở/đóng nội dung. Chỉ màn chi tiết (thông tin + tiến trình) và wizard (form + tóm tắt/xem trước) dùng bố cục 2 cột.
- **Kỳ báo cáo**: chọn kỳ ở topbar hoặc trong bộ lọc trang đều đồng bộ với nhau; "Tất cả kỳ" (từ chuông việc cần xử lý) bỏ lọc kỳ cho trang đó.
- **Kết thúc HĐ**: mặc định phòng → Chờ dọn (BR-02); bỏ tick "Chuyển phòng sang Chờ dọn" thì phòng → Sẵn sàng ngay. Phòng không bao giờ kẹt ở Đang thuê khi không còn HĐ hiệu lực.
- **Zalo**: rule 3 ngày (không gửi lại khách vừa nhận tin) áp dụng cả ở nút Gửi nhắc nhanh – có ô "Vẫn gửi" để ghi đè khi demo; công nợ được re-check lại đúng lúc bấm Xác nhận gửi; rule đang tắt trong Cấu hình Zalo sẽ chặn tạo đợt gửi cùng sự kiện (FR-ZAL-01). Các đợt gửi lịch sử (seed) chỉ có số liệu tổng, không có chi tiết tin.
- **Chỉ số điện nước**: chỉ số đã dùng cho hóa đơn của HĐ trước không tái dùng cho HĐ mới cùng kỳ – wizard báo "Thiếu chỉ số (chỉ số cũ của HĐ trước)" và lấy chỉ số cũ = số đã chốt.
- **Xác nhận thu tiền** (nút $ trên dòng / chọn nhiều dòng ở Hóa đơn, Thu tiền & công nợ, chi tiết hóa đơn/khách): thu **đủ** số còn lại của các hóa đơn đã chọn, bắt buộc đính kèm minh chứng (có "Dùng minh chứng mẫu" cho demo), tự tách 1 khoản thu / khách. **Thu tiền thủ công** (đầu trang Thu tiền & công nợ, menu ⋮ → "Thu một phần / phân bổ thủ công"): chọn khách, thu một phần, phân bổ tay.
- Thu một phần: **cho phép**. Cờ "cần xử lý công nợ" = phát hành + 5 ngày (BR-07); nhãn Quá hạn theo hạn thanh toán.
- **Import hóa đơn**: Hóa đơn → "Import hóa đơn" (hoặc Import dữ liệu → Hóa đơn). 1 dòng = 1 hóa đơn theo số tiền (Tiền phòng trống = giá HĐ, Điện/Nước/Dịch vụ khác nhập thẳng số tiền); gắn vào HĐ hiệu lực của phòng, bỏ qua phòng đã có hóa đơn kỳ đó; tạo ở trạng thái **Nháp**. File mẫu: `assets/samples/mau-import-hoa-don.csv` hoặc nút "Tải file mẫu".
- Hoàn cọc: khấu hao cố định 200.000đ/phòng (BR-12); **không** tự bù trừ công nợ (OI-07); chỉ Admin/Kế toán duyệt (FR-FIN-07); phòng chỉ Sẵn sàng sau xác nhận dọn xong (BR-02).
- Zalo: ZBS Template Message; fallback SMS chưa dùng (OI-21); gửi thành công ≠ đã thanh toán.
- Mục sidebar gắn **P2/P3** là ngoài scope Phase 1, mở trang mô tả scope, không có action.

## Phase 2 – Sales, Automation & Operations (công tắc phase)

Bộ 18 màn PNG `Phase_2_Sales_Automation_Operations/` được dựng vào cùng mockup, gắn nhãn **P2** (chip cạnh tiêu đề trang, badge trên sidebar/nút/tab/menu, badge luồng trong panel hướng dẫn). Kế hoạch chi tiết: `Timehouse-Mockup-Plan-Phase2-v1.0.md`.

### Bật / tắt phase
- **Công cụ nâng cao** (cuối sidebar, Admin) → khối *Phạm vi demo*: Phase 1 luôn bật; **Phase 2** và **Phase 3** bật/tắt độc lập.
- **Mặc định lần đầu mở: chỉ Phase 1.** Trạng thái phase lưu riêng `localStorage['timehouse-phase-v1']`, không nằm trong state nghiệp vụ → *Đặt lại dữ liệu demo / Xóa trắng / Nhập state JSON* **không** đổi phase; đổi phase không xóa dữ liệu.
- Tắt P2: mọi màn/nút hành xử y hệt bản Phase 1 (mục P2 mờ → trang coming-soon, nút P2 disabled). Đang đứng ở route P2 khi tắt → trang tự thành coming-soon (giữ URL); đang là Sale/Kỹ thuật → tự về Admin.
- Bật P2: mở thêm 2 vai trò **`sale`** (Nguyễn Thị Hương – Sale) và **`kythuat`** (Trần Minh Đức – Kỹ thuật) – đăng nhập hoặc *Chuyển vai trò* ở menu góc phải.
- Console: `__timehouseDemo.setPhase(2, true|false)`, `__timehouseDemo.phases()`, `__timehouseDemo.runAllP2()`.

### 18 màn Phase 2 → route
| Nhóm | PNG | Route |
|---|---|---|
| CRM | 04/01 Tổng quan kinh doanh | `#/crm` |
| CRM | 04/02 Lead & pipeline (Kanban kéo-thả / Bảng) | `#/crm/leads` |
| CRM | 04/03 Chi tiết lead | `#/crm/leads/:id` |
| CRM | 04/04 Đặt lịch xem phòng (wizard 4 bước) | `#/crm/viewings/new?lead=` · danh sách `#/crm/viewings` |
| CRM | 04/05 Giữ chỗ phòng (wizard 4 bước, countdown) | `#/crm/holds/new?lead=` · danh sách `#/crm/holds` |
| CRM | 04/06 Chốt thuê (wizard 5 bước) | `#/crm/deals/new?lead=` → `#/contracts/new?deal=` |
| CRM | 04/07 Giao dịch & hoa hồng | `#/crm/deals` · chi tiết `#/crm/deals/:id` |
| Hợp đồng | 02/05 Review trích xuất hợp đồng (OCR) | `#/contracts/ocr` → `#/contracts/new?ocr=` |
| Tài chính | 03/06 Nhập bảng kê thu tiền | `#/finance/statement-import` |
| Tài chính | 03/09 Duyệt hoàn cọc (yêu cầu chỉnh sửa, hiện trạng, ghi chú) | `#/refunds/:id` (layout P2 khi bật) |
| Tài chính | 03/11 Chuyển số dư ban đầu | `#/finance/opening-balance` |
| Tài chính | – Quản lý cọc (sidebar, không có PNG) | `#/finance/deposits` |
| Zalo | 05/05 Chi tiết lần gửi (provider 200/300/403/408, retry, log, donut) | `#/zalo/batches/:id` · chính sách retry/mẫu ở `#/zalo/config` |
| Bảo trì | 06/01 Bảo trì & sự cố | `#/maintenance` · chi tiết `#/maintenance/incidents/:id` |
| Bảo trì | 06/02 Lịch bảo dưỡng (lịch tháng) | `#/maintenance/schedules` |
| Báo cáo | 08/01 Trung tâm báo cáo (32 báo cáo) | `#/reports/hub` · báo cáo chuẩn `#/reports/r/:key` |
| Báo cáo | 08/02 Báo cáo dòng tiền & quản lý kỳ (khóa kỳ) | `#/reports/cashflow` |
| Data Job | 10/05 Danh sách tác vụ (tên file PNG bị đảo) | `#/settings/jobs` |
| Data Job | 10/04 Chi tiết job (Kiểm tra lại / Thử lại phần đủ điều kiện) | `#/settings/jobs/:id` |

Điểm nối P2 trong màn P1 khi bật: Phòng → *Tạo sự cố* + tab *Sự cố*; Tòa nhà → tab *Hiệu suất*, *Lưu bộ lọc*; Khách thuê → *Lưu bộ lọc*; Hóa đơn → *Bộ lọc nâng cao* (tòa, khách, khoảng tiền, đã nhắc Zalo, quá hạn); Chi phí → *Khấu hao* (số tháng); Chủ nhà → *Nhắc thanh toán Zalo*; Danh mục → tab *Nguồn khách*, *Nhà cung cấp*; Import → tile *Bảng kê*, *Lead*; Báo cáo P1 → *Trung tâm báo cáo*; Tạo HĐ → radio *Tải hợp đồng* → OCR.

### Kịch bản demo Phase 2 (panel Hướng dẫn thao tác, +6 luồng / 23 mốc khi bật P2)
F11 CRM: lead → gọi → lịch xem → giữ chỗ → chốt thuê → HĐ → thu cọc → hoa hồng đã chi · F12 OCR hợp đồng (file mẫu 5 trường sai) · F13 Bảng kê thu tiền → Data Job kiểm tra lại/thử lại → số dư đầu kỳ · F14 Sự cố (Vận hành tạo, Kỹ thuật xử lý, chi phí) → lịch bảo dưỡng (nhắc 7 ngày) · F15 Ghim báo cáo → khóa kỳ 10/2026 → Zalo retry 403/408 · F08.5 Hoàn cọc yêu cầu chỉnh sửa → sửa → duyệt lại. Nút *▶ Chạy kịch bản Phase 2 (kỹ thuật)* trong Công cụ nâng cao chạy toàn bộ bằng actions; chạy lại nhiều lần được (tự mở lại kỳ đã khóa, bỏ qua bước đã có dữ liệu).

### Quy ước & giả định Phase 2 (ghi rõ để BA xác nhận)
- Mã hoàn cọc dùng `RC…` của P1 (PNG P2 ghi `HC-001`); đợt Zalo hero `ZL-202610-104` (PNG `ZL-2026-104`); lead `LD-2026-081` là hero (Trần Minh Đức, cột Cân nhắc).
- Hoa hồng: 10% giá thuê tháng đầu, chi một lần, idempotent; đủ điều kiện khi **cọc thu đủ và HĐ kích hoạt** (BR-13/OI-14); hủy/kết thúc HĐ → về tạm tính, không tạo khoản mới.
- Giữ chỗ tối đa 14 ngày, phí trừ vào cọc (OI-09), tự hết hạn theo ngày demo → phòng Sẵn sàng; khách thuê được tạo từ lead ngay khi giữ chỗ. Kanban: kéo thẻ vào *Giữ chỗ*/*Chốt thuê* mở wizard tương ứng; thẻ đang giữ chỗ không kéo lùi được (phải hủy giữ chỗ trước); vai trò chỉ xem không kéo được.
- Số dư đầu kỳ: mỗi HĐ tạo **1 hóa đơn `kind:'opening'`** (kỳ = mốc) + 1 khoản thu `kind:'opening'` cho phần đã thu → tái dùng công nợ/nhắc nợ P1, không sinh khoản thu ngoài số dư.
- Dòng tiền: thu thật từ khoản thu (FR-REP-02), chi loại trừ khấu hao (BR-08), cọc/phí giữ chỗ tách riêng (BR-20). Khấu hao đường thẳng theo số tháng nhập tay (OI-11). Hiệu suất tòa = ngày có khách / ngày kỳ, tòa bảo trì = N/A (BR-09, OI-12).
- Khóa kỳ (FR-FIN-08): checklist 6 mục (3 tự động theo dữ liệu – có thể xác nhận tay sau rà soát, 2 tick tay, 1 = bấm Khóa); sau khóa `recordPayment / issueInvoice / adjustInvoice / createInvoiceDrafts / saveExpense / reversePayment` trong kỳ bị chặn; báo cáo dùng snapshot.
- Zalo: mã lỗi P1 `ZLM-1001/2003` ↔ provider `300/403`, thêm `408 Timeout`; retry chỉ 403/408 và chưa quá số lần trong chính sách; 300 là lỗi vĩnh viễn (fallback SMS mô phỏng nếu bật – OI-21). *Tải log (.xlsx)* / *Tải template* xuất CSV (offline, không SheetJS).
- Trung tâm báo cáo: 32 báo cáo, 10 chạy thật trên dữ liệu (`cashflow, expense-by-building, operating-result, occupancy, refunds, room-status, maintenance, sales-performance, leads-funnel, customer-segment`), 18 báo cáo nhãn **OI** mở trang "Công thức chờ chốt", 4 báo cáo Đầu tư → P3.
- Mục scope không có PNG (Kênh cho thuê, Marketing, Thiết lập hệ thống) → coming-soon "Chưa có mockup UI". Kiểm kê hàng tháng = P3.
- File mẫu mới: `assets/samples/mau-bang-ke-thu-tien.csv` (20 dòng: khớp mã HĐ, khớp khách + số tiền, không ghép, trùng, hóa đơn nháp), `mau-so-du-dau-ky.csv` (13 dòng, 2 chênh lệch, 1 HĐ không tồn tại), `mau-hop-dong-ocr.txt`. Trong app các file mẫu được sinh từ dữ liệu hiện có (nút *Dùng file mẫu*).
- State `schema = 3`: state cũ (v2) được migrate và seed bổ sung dữ liệu P2 trên dữ liệu hiện có (idempotent `meta.p2Seeded`), không mất dữ liệu người dùng.

## Phase 3 – Enterprise & Investment (công tắc phase)

Bộ 4 màn PNG `Phase_3_Enterprise_Investment/` + các màn **tự thiết kế** cho mọi mục sidebar P3 được dựng vào cùng mockup, gắn nhãn **P3** (chip cạnh tiêu đề, badge sidebar, badge luồng). Kế hoạch chi tiết: `Timehouse-Mockup-Plan-Phase3-v1.0.md`.

### Bật / tắt
- **Công cụ nâng cao** → *Phạm vi demo* → tick **Phase 3** (độc lập với P2; bật cả hai để dùng đủ liên kết chéo: kiểm kê → tạo sự cố, KPI nhân viên từ CRM, đối soát ngân hàng dùng quy tắc ghép bảng kê).
- Bật P3 mở thêm 2 vai trò: **`nhansu`** (Ngô Thị Quỳnh – Nhân sự: hồ sơ/chấm công/lương, không có quyền tài chính – FR-HR-01) và **`codong`** (Trần Minh Đức – Cổ đông: read-only, chỉ thấy tòa/dự án đã góp vốn – FR-SHR-03/04). Tắt P3 khi đang là 2 vai trò này → tự về Admin; route P3 → coming-soon (giữ URL).
- Console: `__timehouseDemo.setPhase(3, true|false)`, `__timehouseDemo.runAllP3()`.

### Màn Phase 3 → route
| Nhóm | PNG / Tự thiết kế | Route |
|---|---|---|
| Tài sản | 06/03 Kiểm kê tài sản | `#/assets/inventory` · biên bản `#/assets/inventory/:id` (cũng từ Bảo trì → tab *Kiểm kê hàng tháng*) |
| Tài sản | – Sổ tài sản (tự thiết kế: danh mục, QR, nguyên giá, khấu hao) | `#/assets` · tab *Tài sản* ở chi tiết tòa · link mã TS ở tab Tài sản phòng |
| Nhân sự | 07/01 Quản lý nhân viên | `#/hr` |
| Nhân sự | 07/02 Chi tiết nhân viên (Tổng quan / Phân công / Hồ sơ / Lịch sử) | `#/hr/:id` |
| Nhân sự | – Chấm công (tự thiết kế, mô phỏng – ngoài SRS §2.2) | `#/hr/timesheet` |
| Nhân sự | – Lương thưởng (tự thiết kế, FR-HR-02/BR-14, OI-15) | `#/hr/payroll` |
| Đầu tư | 09/01 Cổ đông, vốn góp & phân phối (tab Cổ đông · Đóng góp theo kỳ · Phân phối lợi nhuận) | `#/investment/shareholders` (sidebar *Hiệu quả đầu tư* như PNG) |
| Đầu tư | – Dự án đầu tư (tự thiết kế) | `#/investment/projects` |
| Đầu tư | – Hiệu quả đầu tư theo tòa (tự thiết kế; Report Hub `roi`) | `#/investment/roi` |
| Tài chính | – Ngân hàng & đối soát (tự thiết kế, mô phỏng – scope §4.5) | `#/finance/bank` |

Report Hub: 4 báo cáo nhóm *Đầu tư* (`roi`, `shareholder`, `asset-value`, `project-progress`) mở trang P3 tương ứng khi P3 bật.

### Kịch bản demo Phase 3 (panel Hướng dẫn, +4 luồng / 15 mốc khi bật P3)
F16 Kiểm kê: bắt đầu đợt kỳ tới → cập nhật tình trạng 1 tài sản (ảnh, ghi chú) → đánh dấu hàng loạt → hoàn tất & xuất biên bản · F17 Nhân sự: thêm NV (thử việc) → phân công tòa chính → xác nhận bảng công → tính lương → gửi duyệt → Kế toán duyệt & ghi chi (chi phí nhóm Lương theo tòa) · F18 Cổ đông: thêm cổ đông với tỷ lệ nhập tay → tạo đợt góp vốn (nghĩa vụ theo tỷ lệ) → ghi nhận góp → lập bảng phân phối → Admin duyệt → ghi đã chi → xem với vai trò Cổ đông · F19 Ngân hàng: nhập sao kê mẫu → đối soát tự động (cần P2) → khớp tay 1 giao dịch. `runAllP3()` chạy kỹ thuật toàn bộ.

### Quy ước & giả định Phase 3 (ghi rõ để BA xác nhận)
- Ngày demo 2026 (PNG ghi 2024): `BB-KK-2026-10`, `BL-2026-10`, `PP-2026-Q3`; mã NV chuẩn `NV001` (PNG chi tiết ghi `NV-2024-012` → `NV002`). Tên người trùng nhau chéo module (Trần Minh Đức vừa là Kỹ thuật P2, NV001, cổ đông #1) giữ nguyên theo PNG; hồ sơ NV/cổ đông chỉ link tài khoản khi trùng tên user hiện có.
- Sổ tài sản 248 = 10 hero PNG + tài sản trong phòng P1 (`roomAssets` được promote, đồng bộ tình trạng hai chiều) + tài sản khu vực chung. Kiểm kê 10/2026 seed **Đang kiểm kê** 198/248 (32 cần xử lý, 18 hư hỏng) để demo F16; 09/2026 đã hoàn thành. Kết quả kiểm kê **không** tạo chi phí/giảm tài sản (AC-FR-MNT-02-2); tài sản cần xử lý → *Tạo sự cố* (P2).
- Nhân sự 28 (24 làm việc + 5 thử việc tính vào "Đang làm việc", 3 tạm nghỉ, 6 QLKV). Trạng thái SRS: Thử việc / Đang làm / Nghỉ việc; *Tạm nghỉ* theo PNG (ngoài SRS). KPI cá nhân tính thật từ CRM P2 theo tài khoản (số PNG chỉ là ví dụ); *Tỷ lệ hài lòng 92%* là số mẫu.
- Lương (BR-14, OI-15 TBD): lương cứng × công/công chuẩn + PC chức danh + PC số nhà 500.000/tòa (vận hành) + hoa hồng Sale đã chi trong kỳ − 10,5% khấu trừ mẫu. `BL-2026-09` seed *Đã duyệt* (kỳ 09 đã khóa – không ghi chi); chi lương tạo chi phí nhóm *Lương* theo tòa, bị chặn khi kỳ khóa (FR-FIN-08).
- Cổ đông: tỷ lệ nhập tay theo dự án (Σ ≤ 100%/dự án, FR-SHR-02 AC-1); "Tỷ lệ góp vốn" = Σ(tỷ lệ × vốn dự án)/tổng vốn = 25/20/15/10/10/8/7/5 như PNG; "Còn thiếu" = nghĩa vụ đến hạn/sắp đến hạn (≤7 ngày) chưa góp (Trang 400tr, Mai 140tr); "Tổng vốn góp" = vốn điều lệ 12 tỷ (thực góp 11,46 tỷ). Nghĩa vụ định kỳ sinh theo kỳ trả chủ nhà của tòa (BR-15). Phân phối: dòng làm tròn dồn vào cổ đông lớn nhất; *Đã chi* chỉ đánh dấu, không tạo chi phí (UC-08, OI-17).
- ROI theo tòa: vốn = vốn điều lệ dự án + nguyên giá tài sản; LN = thu thật − chi phí − khấu hao tháng; ROI năm hóa – tạm tính (OI-10/12/13/17).
- Ngân hàng, chấm công, QR nằm ngoài SRS v1.2 §2.2 – mô phỏng theo scope §4; đối soát tái dùng 4 quy tắc ghép bảng kê P2 (idempotent theo mã giao dịch).
- Không đổi `schema`/`KEY`: state cũ được seed bổ sung P3 (idempotent `meta.p3Seeded`), không mất dữ liệu người dùng.

## Cấu trúc
`index.html` · `css/` (tokens, base, components, pages) · `js/core/` (format, store, phase, seed, seed-p2, seed-p3, selectors, selectors-p2, selectors-p3, auth, actions, import, actions-p2, actions-p3, router, guide, guide-p2, guide-p3) · `js/ui/` (icons, components, table, chart, components-p2, components-p3, layout, forms) · `js/pages/` (1 file / nhóm màn; P2: crm, ocr, finance2, maintenance, reportHub, jobs, zalo2; P3: assets, hr, investment, bank) · `assets/samples/` (CSV mẫu import).
