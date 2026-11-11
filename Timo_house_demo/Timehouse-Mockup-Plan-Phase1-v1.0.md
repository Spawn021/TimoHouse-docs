# Plan: Mockup tương tác TimoHouse – Phase 1 Core Rental / Go-live

> Đầu vào: bộ PNG `Phase_1_Core_Rental_GoLive/` (27 màn), `Timehouse-SRS-v1.2.docx`, `Timehouse-UI-Mockup-Spec-v1.5.md`, `00_SCOPE_3_PHASE.md`.
> Ngày lập: 14/09/2026 · Trạng thái: Draft chờ duyệt
> Đầu ra: thư mục `mockup/` chạy được bằng cách mở `index.html` (hoặc deploy Netlify), đủ action để demo trọn 16 điều kiện Go-live Phase 1.

---

## 1. Context

- Khách đã có 27 mockup tĩnh (PNG) cho Phase 1 nhưng chưa có bản click-through. Cần một mockup **tương tác** để mang đi demo: mọi nút trong PNG phải bấm được, dữ liệu thay đổi thật (tạo HĐ → phòng đổi trạng thái → hóa đơn → thu tiền → Zalo → hoàn cọc → phòng sẵn sàng).
- UI Spec v1.5 mô tả một mockup đã tồn tại ở bản v1.4 (panel Hướng dẫn thao tác, `__timehouseDemo`, localStorage, schema 8...) nhưng **codebase đó không có trong workspace**. Plan này dựng mới, giữ lại các nguyên tắc của spec v1.5 (hướng dẫn thụ động, record chỉ tạo qua nút lưu, không auto-submit) và cắt scope xuống Phase 1.
- Quyết định đã chốt với người dùng:
  1. **Tech**: Static SPA vanilla HTML/CSS/JS, không build step, hash-router, state lưu localStorage.
  2. **Sidebar**: giữ menu đầy đủ như PNG; mục Phase 2/3 gắn tag `P2`/`P3` và mở trang placeholder.
  3. **Dữ liệu**: mở lên có sẵn seed giống PNG (5 tòa, 320 phòng, khách/HĐ/hóa đơn/công nợ...), có nút *Đặt lại dữ liệu demo* và *Xóa trắng* trong Công cụ nâng cao.
  4. **Panel Hướng dẫn thao tác**: chỉ luồng Phase 1, bám 16 điều kiện Go-live §2.8 của `00_SCOPE_3_PHASE.md`.

---

## 2. Kiến trúc mockup

### 2.1 Cấu trúc thư mục (tạo mới `mockup/` trong workspace)

```
mockup/
├─ index.html                 # shell: sidebar + topbar + <main> + guide panel + modal root
├─ css/
│  ├─ tokens.css              # design tokens lấy từ PNG (màu, radius, shadow, font)
│  ├─ base.css                # reset, typography, layout grid, responsive 1440/375
│  ├─ components.css          # kpi, table, chip, button, drawer, modal, wizard, tabs, toast, dropzone
│  └─ pages.css               # override theo màn (dashboard chart, zalo phone preview, login hero)
├─ js/
│  ├─ core/
│  │  ├─ store.js             # state + persist localStorage `timehouse-demo-p1-v1`, schema version, migrate
│  │  ├─ seed.js              # generator dữ liệu demo deterministic + "hero records" khớp PNG
│  │  ├─ actions.js           # toàn bộ nghiệp vụ ghi (state machine, idempotency, audit)
│  │  ├─ selectors.js         # tính toán đọc: KPI, công nợ, trạng thái thu, quá hạn, tuổi nợ
│  │  ├─ router.js            # hash router `#/route/:id?query`, guard đăng nhập, breadcrumb
│  │  ├─ auth.js              # phiên đăng nhập, vai trò demo (Admin/Kế toán/Vận hành), can(action)
│  │  ├─ format.js            # VND, ngày dd/mm/yyyy, số bằng chữ, mã sinh tự động
│  │  └─ guide.js             # panel Hướng dẫn thao tác: flows, milestones, evaluate()
│  ├─ ui/                     # component thuần DOM, mỗi file 1 factory trả về element
│  │  ├─ layout.js            # sidebar (menu Phase 1 + P2/P3 tags), topbar, role switcher, Ctrl+K
│  │  ├─ table.js             # DataTable: cột, sort, filter, phân trang, checkbox, row menu ⋮
│  │  ├─ kpi.js  chip.js  drawer.js  modal.js  wizard.js  tabs.js  toast.js  dropzone.js
│  │  ├─ chart.js             # SVG thuần: stacked bar, bar+line, donut (không dùng lib để chạy offline)
│  │  └─ empty.js  timeline.js  filterbar.js  statusTabs.js
│  ├─ pages/                  # 1 file / route, export render(ctx) → element
│  │  ├─ login.js  dashboard.js
│  │  ├─ buildings.js  buildingDetail.js  rooms.js  roomDetail.js  landlords.js  landlordDetail.js
│  │  ├─ tenants.js  tenantDetail.js  contracts.js  contractNew.js  contractDetail.js
│  │  ├─ invoices.js  invoiceBatch.js  invoiceDetail.js
│  │  ├─ receivables.js  paymentDetail.js  refunds.js  refundNew.js  refundDetail.js  expenses.js
│  │  ├─ zaloConfig.js  zaloBatchNew.js  zaloBatchDetail.js  zaloHistory.js
│  │  ├─ reports.js  users.js  catalog.js  importWizard.js  comingSoon.js
│  └─ app.js                  # bootstrap: load store → seed nếu rỗng → mount layout → router.start()
├─ assets/
│  ├─ logo.svg  avatar.jpg  room-thumb.jpg  building-thumb.jpg  login-hero.jpg
│  └─ samples/                # CSV/XLSX mẫu import (khách, phòng, chỉ số điện nước), PDF giả
└─ README.md                  # cách mở, cách reset, kịch bản demo 16 bước
```

- Dùng **classic `<script>` theo thứ tự** (namespace `window.TH`), không ES module, để mở file:// bằng double-click vẫn chạy (ES module bị chặn CORS trên file://). Deploy Netlify chỉ cần kéo thả thư mục.
- Font: Inter qua Google Fonts + fallback `system-ui`; toàn bộ icon dùng inline SVG (bộ Lucide, copy path vào `icons.js`) để offline vẫn hiển thị.

### 2.2 Design tokens (đọc từ PNG)

| Token | Giá trị | Ghi chú |
|---|---|---|
| `--sidebar-bg` | gradient `#0F2A5F → #1E40AF` | active pill `#2B6FE0`, text trắng, group header uppercase `rgba(255,255,255,.55)` |
| `--primary` | `#2563EB` (hover `#1D4ED8`) | button primary, link, active tab |
| `--bg` | `#F3F6FB` | nền trang |
| `--card` / `--border` | `#FFFFFF` / `#E5EAF2` | radius 12px, shadow `0 1px 2px rgba(15,23,42,.06)` |
| `--text` / `--muted` | `#0F2A5F` (heading), `#334155`, `#64748B` | |
| Chip | green `#DCFCE7/#15803D`, amber `#FEF3C7/#B45309`, red `#FEE2E2/#B91C1C`, blue `#DBEAFE/#1D4ED8`, gray `#F1F5F9/#475569`, purple `#EDE9FE/#6D28D9` | pill radius 999 |
| KPI tint | blue `#EFF6FF`, green `#F0FDF4`, amber `#FFFBEB`, red `#FEF2F2`, purple `#F5F3FF` | icon square 40px cùng tông đậm |
| Table | header `#F8FAFC`, row 48px, số căn phải, số âm/nợ đỏ | page size 10/20/50/100 |
| Layout | sidebar 218px, topbar 58px, content padding 24px, right panel 320–420px | breakpoint 1440 desktop / 375 mobile (sidebar → drawer, panel → bottom sheet) |

### 2.3 Data model (collection trong store)

`users, buildings, landlords, landlordContracts, landlordPayments, rooms, roomAssets, tenants, contracts, contractMembers, contractServices, services (danh mục), priceHistory, meterReadings, invoices, invoiceLines, payments, paymentAllocations, refunds, refundDeductions, expenses, expenseAllocations, zaloEvents (rule), zaloTemplates, zaloBatches, zaloMessages, importJobs, documents, auditLog, guideProgress`

Quy tắc chung (theo SRS §6, §7.3, BR-21/22):
- Mọi record có `id`, `code` (mã hiển thị: `TH-HBT-01`, `A.12.03`, `KH00123`, `HD-2024-001`, `HD-202410-001`, `PAY-202410-018`, `RC202410-001`, `CP0001`, `ZL-202410-028`), `createdAt`, `createdBy`, `source: 'seed' | 'user'`.
- **Trạng thái suy diễn, không lưu cứng** khi có thể: trạng thái thu hóa đơn = f(tổng, đã phân bổ); quá hạn = hạn < hôm nay & còn nợ > 0; cờ "cần xử lý công nợ" = phát hành + 5 ngày (BR-07); HĐ sắp hết hạn = còn ≤ 35 ngày (BR-04).
- Hóa đơn phát hành **snapshot** giá/dịch vụ/số xe theo kỳ (FR-FIN-09, BR-21); sửa danh mục không hồi tố.
- `actions.js` nhận `idempotencyKey`; gọi lại cùng key không tạo trùng (NFR-03).
- "Hôm nay" của demo cố định = **28/10/2024** (khớp số liệu PNG), có thể đổi trong Công cụ nâng cao.

### 2.4 State machine phải chạy đúng (SRS §6)

| Đối tượng | Chuyển trạng thái | Action kích hoạt |
|---|---|---|
| Phòng | Sẵn sàng → Giữ chỗ → Sẵn sàng | `holdRoom` / `releaseHold` (Giữ chỗ là action hiển thị trong PNG, mức tối giản) |
| Phòng | Sẵn sàng/Giữ chỗ → **Đang thuê** | `activateContract` |
| Phòng | Đang thuê → **Chờ dọn** | `terminateContract` (ghi ngày kết thúc thực tế) |
| Phòng | Chờ dọn → **Sẵn sàng** | `confirmCleaned` (BR-02; không tự chuyển khi hoàn cọc) |
| Phòng | ↔ Bảo trì / Ngừng sử dụng | `setRoomMaintenance`, `deactivateRoom` |
| Hợp đồng | Dự thảo → Hiệu lực → (cờ Sắp hết hạn) → Đã kết thúc / Hủy | `saveContractDraft`, `activateContract`, `terminateContract`, `cancelContract`; `renewContract` tạo HĐ mới liên kết HĐ cũ (FR-CUS-04) |
| Hóa đơn (chứng từ) | Nháp → Đã phát hành → Đã điều chỉnh | `createInvoiceDrafts`, `issueInvoice(s)`, `adjustInvoice` |
| Hóa đơn (thu) | Chưa thu → Thu một phần → Thu đủ; nhãn Quá hạn độc lập | suy từ `paymentAllocations` |
| Khoản thu | Đã ghi nhận → Đã hoàn tác (giữ dấu vết) | `recordPayment`, `reversePayment` (BR-22) |
| Hoàn cọc | Nháp → Chờ duyệt → Đã duyệt → Đã hoàn; Chờ duyệt → Từ chối → (sửa) → Chờ duyệt | `saveRefundDraft`, `submitRefund`, `approveRefund` (chỉ Admin/Kế toán – FR-FIN-07), `rejectRefund`, `recordRefundPaid` (cần bằng chứng) |
| Zalo batch/tin | Chờ xử lý → Đang gửi → Đã tiếp nhận → Đã giao / Thất bại / Chưa rõ / Bỏ qua | `createZaloBatch` (re-check công nợ → skip khách đã trả đủ, cập nhật số còn nợ), `sendZaloBatch` (mô phỏng tiến độ bằng timer, ~5% lỗi với mã `ZLM-1001/2003`), `retryZaloBatch` (chỉ tin Thất bại/Chưa rõ, không gửi lại người đã nhận) |

---

## 3. Shell chung

### 3.1 Sidebar (giữ nhóm như PNG, bổ sung mục Phase 1 xuất hiện ở các biến thể PNG)

```
Tổng quan
VẬN HÀNH   Tòa nhà · Phòng · Khách thuê · Hợp đồng · Chủ nhà & đối tác
           Bảo trì - Sửa chữa [P2] · Lịch công việc [P2]
TÀI CHÍNH  Hóa đơn · Thu tiền & công nợ · Hoàn cọc · Chi phí
           Thu chi [P2] · Quản lý cọc [P2] · Ngân hàng [P3]
THÔNG BÁO  Cấu hình Zalo · Tạo đợt gửi · Lịch sử gửi
KINH DOANH Khách hàng [P2] · Kênh cho thuê [P2] · Lịch xem phòng [P2] · Marketing [P2]
NHÂN SỰ    Nhân viên [P3] · Chấm công [P3] · Lương thưởng [P3]
ĐẦU TƯ     Dự án [P3] · Tài sản [P3] · Hiệu quả đầu tư [P3]
BÁO CÁO    Báo cáo Phase 1 (Phòng / Công nợ / Thu tiền) · Báo cáo chi tiết [P2]
CẤU HÌNH   Tài khoản & phân quyền · Danh mục dùng chung · Import dữ liệu · Thông báo & nhắc việc · Thiết lập hệ thống [P2]
```
- Mục `[P2]/[P3]`: mờ 60%, tag nhỏ, click → `#/coming-soon/:key` (trang placeholder nêu tên chức năng, phase, FR liên quan). Không có record nào được tạo.
- Footer: `Phiên bản 1.0.0 · TimoHouse © 2026` + nút nhỏ **Công cụ nâng cao** (mở `<details>`).

### 3.2 Topbar
Breadcrumb (từ router) · Search `Tìm kiếm phòng, khách thuê, hợp đồng...` + `Ctrl K` (command palette tìm mã phòng/khách/HĐ/hóa đơn, Enter → route) · Bell (badge = số việc cần xử lý: HĐ sắp hết hạn + hóa đơn quá hạn + Zalo lỗi + hoàn cọc chờ duyệt) · `Kỳ báo cáo` select (đổi kỳ dashboard/hóa đơn) · Avatar + tên + vai trò ▾ → menu: **Chuyển vai trò (demo)**: Quản trị viên / Kế toán / Vận hành · Đăng xuất · Nút **Hướng dẫn thao tác** (mở panel phải).

Vai trò ảnh hưởng: Vận hành không thấy nút Duyệt/Từ chối hoàn cọc và Phát hành hóa đơn; Kế toán không vào Tài khoản & phân quyền. Nút bị chặn hiển thị disabled + tooltip "Cần vai trò Admin/Kế toán (FR-FIN-07)".

### 3.3 Công cụ nâng cao (`<details>` trong sidebar footer – theo spec v1.5 §6)
`Đặt lại dữ liệu demo` · `Xóa trắng dữ liệu nghiệp vụ` · `Đổi ngày hệ thống demo` · `Xuất state JSON` / `Nhập state JSON` · `Chạy toàn bộ kịch bản Go-live` (auto, chỉ ở đây) · `Reset tiến độ hướng dẫn` (không xóa dữ liệu). API `window.__timehouseDemo = { currentGuide, syncGuide, openGuide, openSample, useSample, resetGuideProgress, resetData, runAll, state }`.

---

## 4. Danh mục màn hình & action (27 PNG + màn bổ sung)

Ký hiệu: **[A]** action chạy thật (ghi state) · **[V]** chỉ hiển thị/điều hướng · **[P2]** hiện trong PNG nhưng ngoài scope → disabled + tooltip "Phase 2". Cột "PNG" trỏ file gốc để đối chiếu pixel.

### 4.1 Tổng quan & Authentication

| Route | PNG | Nội dung phải khớp | Action |
|---|---|---|---|
| `#/login` | 00/02 | Hero trái (4 feature, tagline), card phải: Email/tên đăng nhập, Mật khẩu (eye toggle), Ghi nhớ, link Liên hệ QTV, alert lỗi đỏ, box Bảo mật, chọn ngôn ngữ | **[A]** Đăng nhập (tài khoản demo `admin/ketoan/vanhanh`, mật khẩu bất kỳ ≥1 ký tự; sai tên → alert đúng text PNG) · **[A]** Đăng xuất từ topbar |
| `#/dashboard` | 00/01 | Filter Kỳ/Khu vực/Tòa/Quản lý + Làm mới; 4 KPI phòng (Phòng ở được ngay, Có thể trống cuối tháng, Đang giữ chỗ, Tiến độ thu + progress); card Tổng quan tài chính 4 tile (Tiền nhà phải thu, Đã thu, Cọc mới, Tiền phá HĐ); chart Trạng thái phòng theo tòa (stacked), Tiến độ thu theo tòa (bar+line, select Theo giá trị); bảng Top khoản quá hạn | **[A]** filter đổi → KPI/chart/bảng tính lại từ selectors · **[A]** `Nhắc thu` trên dòng → mở drawer tạo đợt gửi Zalo 1 người (prefill) · **[V]** click phòng → room detail · **[V]** Xem tất cả → `#/receivables?overdue=1` · **[A]** `Xuất báo cáo` → tải CSV tổng quan · **[V]** `Làm mới` toast |

### 4.2 Vận hành: Tòa nhà / Phòng / Chủ nhà

| Route | PNG | Nội dung phải khớp | Action |
|---|---|---|---|
| `#/buildings` | 01/01 | Filter (Tìm, Khu vực, Người phụ trách, Trạng thái, toggle Bảng/Thẻ); 4 KPI; bảng 10 cột (Mã tòa, Tên/Địa chỉ, Khu vực, Số phòng, Phòng sẵn sàng (%), Chu kỳ trả chủ nhà chip ngày, Quản lý, Trạng thái, ⋮); toolbar Lưu bộ lọc/Tùy chỉnh cột | **[A]** `+ Thêm tòa` → drawer form (Mã, Tên, Địa chỉ, Khu vực, Số tầng, Chủ nhà, Người phụ trách, Chu kỳ trả 3/4/6 tháng, Ngày trả) → tạo record · **[A]** `Import tòa` → `#/settings/import?type=building` · **[A]** Row ⋮: Xem / Sửa / Ngừng sử dụng (chặn nếu còn HĐ hiệu lực – FR-BLD-02) · **[A]** toggle Thẻ đổi layout card · **[A]** Tùy chỉnh cột (ẩn/hiện cột, lưu localStorage) · **[P2]** Lưu bộ lọc |
| `#/buildings/:id` | 01/02 | Header ảnh + tên + mã + chip; strip Địa chỉ/Khu vực/Số tầng/Số phòng/Phụ trách; tabs Tổng quan · Chủ nhà & HĐ đầu vào · **Phòng** · Dịch vụ · Tài sản [P2] · Chi phí · Hiệu suất [P2] · Tài liệu · Lịch sử; tab Phòng: 3 nút + 4 mini KPI + bảng phòng; panel phải: Chu kỳ trả chủ nhà, Chủ nhà, Lịch thanh toán gần nhất | **[A]** `+ Thêm phòng` drawer (Mã, Tầng, Loại, Diện tích, Giá tham chiếu, Dịch vụ mặc định, Trạng thái) – chặn trùng mã trong tòa (FR-BLD-03) · **[A]** `Tạo nhiều phòng` modal (tầng từ–đến, số phòng/tầng, tiền tố) · **[A]** `Import phòng` · **[A]** Hành động ▾: Sửa tòa / Ngừng sử dụng / Ghi nhận trả chủ nhà · **[A]** tab Chi phí: list + Thêm chi phí · **[V]** tab Dịch vụ: bảng giá áp dụng cho tòa · **[A]** tab Tài liệu: upload giả (dropzone → record documents) · **[V]** Lịch sử = auditLog lọc theo tòa · **[A]** panel `Xem lịch sử thanh toán` → landlord detail tab Lịch thanh toán |
| `#/rooms` | 01/03 | Status tab pills (Tất cả/Sẵn sàng/Giữ chỗ/Đang thuê/Chờ dọn/Bảo trì với count); 6 filter; 5 KPI; bảng 11 cột với row tint theo trạng thái; action theo trạng thái: Sẵn sàng → `Giữ chỗ` + `Tạo hợp đồng`; Đang thuê → `Xem hợp đồng` + `Tạo hóa đơn`; Chờ dọn → `Xác nhận dọn xong`; Bảo trì → `-` | **[A]** `Giữ chỗ` modal (khách, đến ngày, ghi chú) → Giữ chỗ · **[A]** `Tạo hợp đồng` → `#/contracts/new?room=` · **[A]** `Tạo hóa đơn` → `#/invoices/batch?room=` (1 phòng) · **[A]** `Xác nhận dọn xong` → confirm → Sẵn sàng (Go-live #15/16) · **[A]** ⋮: Xem / Sửa / Chuyển Bảo trì / Ngừng sử dụng / Hủy giữ chỗ · **[A]** `Xuất danh sách` CSV · **[A]** `+ Tạo hợp đồng` header → chọn phòng sẵn sàng |
| `#/rooms/:id` | 01/04 | Header mã + chip + "Tòa • Tầng • Loại"; 3 nút; 4 KPI (Giá thuê, Tiền cọc, Công nợ hiện tại, HĐ còn lại); tabs Tổng quan · Lịch sử thuê · Dịch vụ · Tài sản · Sự cố [P2] · Tài liệu · Lịch sử; 6 card: Thông tin phòng, Dịch vụ đang áp dụng, Khách thuê hiện tại, Tài sản trong phòng, Hóa đơn gần đây, Sự cố gần nhất | **[A]** `Chỉnh sửa` phòng drawer · **[A]** `Quản lý dịch vụ` drawer (bật/tắt dịch vụ, đơn giá riêng, hiệu lực) · **[A]** `Quản lý tài sản` (thêm/sửa dòng tài sản – mức cơ bản) · **[A]** `Tạo hóa đơn` · **[V]** `Xem hợp đồng`, `Xem khách thuê`, Hóa đơn `Xem` · **[A]** Hành động ▾: Kết thúc hợp đồng / Chuyển bảo trì / Xác nhận dọn xong (theo trạng thái) · **[P2]** `Tạo sự cố` |
| `#/landlords` | 01/05 | 5 filter; 4 KPI; bảng 10 cột (Mã, Chủ nhà, Liên hệ, Số tòa, HĐ hiệu lực, Lịch trả gần nhất, Chu kỳ trả chip, Trạng thái, Xem/⋮); panel phải Kỳ thanh toán sắp tới (5 dòng + Còn N ngày) + Lưu ý | **[A]** `+ Thêm chủ nhà` drawer (Tên, Loại cá nhân/công ty, MST, SĐT, Email, Địa chỉ, Tài khoản nhận tiền, Tòa liên kết) · **[A]** ⋮: Xem / Sửa / Tạm ngừng · **[A]** `Xuất danh sách` · **[V]** panel click → landlord detail |
| `#/landlords/:id` | 01/06 | Header ← tên + chip + mã + SĐT + N tòa; 3 nút; 4 KPI; tabs Tổng quan · Tòa nhà · **HĐ đầu vào** · Lịch thanh toán · Tài liệu · Lịch sử; card Thông tin HĐ đầu vào (2 cột đủ trường PNG, chips tòa liên kết); bảng Lịch thanh toán (Kỳ, Hạn, Số tiền, Trạng thái, Bằng chứng, ⋮); panel Hồ sơ & tài liệu (4 file) + timeline Lịch sử & mốc | **[A]** `Sửa thông tin` · **[A]** `Tạo lịch thanh toán` modal (chu kỳ 3/4/6 tháng → sinh các kỳ – FR-BLD-05) · **[A]** `+ Thêm kỳ thanh toán` · **[A]** dòng kỳ ⋮: `Ghi nhận đã trả` (ngày, số tiền, bằng chứng) → Đã thanh toán · **[A]** `Tải hồ sơ` (tải PDF giả) · **[A]** tab Tài liệu upload · **[A]** thêm/sửa HĐ đầu vào (Giá, Cọc, Thời gian giữ giá, Thời hạn – chặn kết thúc < bắt đầu) |

### 4.3 Khách thuê & Hợp đồng

| Route | PNG | Nội dung phải khớp | Action |
|---|---|---|---|
| `#/tenants` | 02/01 | 6 filter; 4 KPI (Tổng, Đang thuê, HĐ sắp hết hạn, Chờ hoàn cọc); bảng 11 cột; Lưu bộ lọc/Tùy chỉnh cột | **[A]** `+ Thêm khách thuê` drawer (Họ tên, SĐT, Zalo, Email, CCCD, Ngày sinh, Nghề nghiệp, Phân khúc nhập tay – BR-18, Phương tiện, Ghi chú) → KH mới (Go-live #1) · **[A]** `Import khách` → import wizard type=tenant · **[A]** ⋮: Xem / Sửa / Tạo hợp đồng · **[V]** Xem |
| `#/tenants/:id` | 02/02 | Header ← avatar + tên + chip + mã + SĐT + nghề + Zalo ✓ Đã xác minh; 3 nút; tabs Thông tin · Lịch sử thuê · Hợp đồng · **Tài chính** · Hoàn cọc · Tài liệu · Lịch sử; tab Tài chính: 4 KPI + bảng hóa đơn + Xuất Excel; panel Thông tin liên quan 4 card (Phòng đang thuê, HĐ hiện tại, Tiền cọc đang giữ, Người quản lý) | **[A]** `Tạo hợp đồng` (prefill khách) · **[A]** `Sửa thông tin` · **[V]** `Xem lịch sử thuê` → tab · **[A]** `Xuất Excel` (CSV) · **[V]** Xem phòng/Xem hợp đồng/Xem chi tiết cọc · **[A]** tab Tài liệu upload · **[V]** tab Hoàn cọc = refunds của khách; tab Lịch sử thuê = các lần thuê (FR-CUS-01 giữ lịch sử) |
| `#/contracts` | 02/03 | Status pills (Tất cả/Dự thảo/Hiệu lực/Sắp hết hạn/Đã kết thúc/Hủy); 5 filter; 4 KPI; bảng 12 cột (Còn lại N ngày đỏ khi ≤35); row action `Xem` `Gia hạn` ⋮ | **[A]** `+ Tạo hợp đồng` · **[A]** `Gia hạn` modal (ngày kết thúc mới, giá mới) → HĐ mới liên kết, HĐ cũ Đã kết thúc ngày liền trước (FR-CUS-04) · **[A]** ⋮: Xem / Sửa nháp / Kích hoạt (nếu Dự thảo) / **Kết thúc hợp đồng** / Hủy / Tải PDF · **[A]** `Xuất danh sách` |
| `#/contracts/new` | 02/04 | Stepper 5 bước (Nguồn dữ liệu, Khách & phòng, Giá thuê & cọc, Dịch vụ & thành viên ở, Review & lưu); form dài đúng section PNG; radio "Tải hợp đồng để hỗ trợ điền" **[P2]** (chọn được nhưng hiện banner "Trích xuất OCR – Phase 2, vui lòng nhập tay") / "Nhập tay"; bảng Dịch vụ đi kèm (+Thêm dịch vụ, 🗑), bảng Thành viên ở (+Thêm thành viên); panel Tóm tắt (Khách, Phòng, Thời hạn, Tài chính ước tính, Kiểm tra & cảnh báo checklist realtime) | **[A]** chọn Khách (search) / Tòa → Phòng (chỉ phòng Sẵn sàng/Giữ chỗ) · **[A]** Giá niêm yết vs thực tế → chip % lệch; Cọc → helper "Tương đương N tháng" · **[A]** Dịch vụ mặc định nạp từ danh mục theo tòa, cho sửa đơn giá/số lượng (xe không giới hạn – BR-05) · **[A]** `Lưu nháp` → Dự thảo · **[A]** `Lưu hợp đồng →` → bước Review (đọc lại toàn bộ) → `Xác nhận & kích hoạt` → HĐ Hiệu lực, phòng Đang thuê, cọc ghi nhận (Go-live #2,3,4) · Validation: bắt buộc (*), ngày kết thúc > bắt đầu, phòng không trùng HĐ hiệu lực (FR-CUS-02) · `Hủy` → confirm nếu form đã sửa |
| `#/contracts/:id` | *(không có PNG – bổ sung)* | Layout theo pattern detail (header + KPI + tabs Tổng quan · Dịch vụ & xe · Thành viên · Hóa đơn · Tài liệu · Lịch sử) | **[A]** Kích hoạt / Gia hạn / **Kết thúc hợp đồng** (modal: ngày kết thúc thực tế, lý do, checkbox "Chuyển phòng sang Chờ dọn", cảnh báo công nợ còn lại → tạo hồ sơ hoàn cọc Nháp) (Go-live #12,14) · Hủy (chỉ Dự thảo) · Tải PDF · Upload file HĐ |

### 4.4 Tài chính

| Route | PNG | Nội dung phải khớp | Action |
|---|---|---|---|
| `#/invoices` | 03/01 | 3 nút header; status tabs 8 (Tất cả/Nháp/Đã phát hành/Chưa thu/Thu một phần/Thu đủ/Quá hạn/Đã điều chỉnh) với count; 6 filter + Bộ lọc nâng cao; 4 KPI; bảng 12 cột (Trạng thái chứng từ + Trạng thái thu tách riêng) | **[A]** `+ Tạo hóa đơn theo kỳ` → wizard · **[A]** `Phát hành bản nháp hợp lệ` → modal liệt kê nháp đủ điều kiện (không thiếu chỉ số) → phát hành hàng loạt, idempotent · **[A]** ⋮: Xem / Phát hành / Ghi nhận thu / Gửi nhắc Zalo / Tải PDF / Điều chỉnh / Hủy nháp · **[A]** checkbox nhiều dòng → bulk Phát hành / Gửi nhắc · **[A]** `Xuất danh sách` · **[P2]** Bộ lọc nâng cao |
| `#/invoices/batch` | 03/02 | Stepper 4 (Chọn kỳ & phạm vi → **Điện nước & dịch vụ** → Preflight & preview → Tạo nháp); scope bar (Kỳ, chips Tòa, chips Dịch vụ, ☑ Phát hành sau); bảng phòng với input chỉ số cũ/mới, SL tính tự động, Tiền phòng, DV cố định, cột Cảnh báo (Thiếu chỉ số / HĐ sắp hết hạn / Chỉ số mới < cũ); panel Tóm tắt kỳ (Tổng phòng, Hợp lệ, Cần kiểm tra, Dự thu tạm tính); bottom bar Import chỉ số + Lưu tạm + Tiếp tục preflight | **[A]** bước 1 chọn kỳ/tòa/dịch vụ → nạp phòng có HĐ hiệu lực · **[A]** bước 2 nhập chỉ số inline (chỉ số mới < cũ → cảnh báo đỏ, không tính âm – FR-FIN-02), `Nhập hàng loạt ▾` (copy kỳ trước / +N%), `Import chỉ số` (CSV mẫu qua import wizard type=meter), `Lưu tạm` (meterReadings nháp) (Go-live #5) · **[A]** bước 3 preflight: bảng preview dòng phí từng phòng, tổng; dòng thiếu dữ liệu bị loại (không lấy 0 – FR-FIN-01) · **[A]** bước 4 `Tạo nháp` → N hóa đơn Nháp (chặn trùng HĐ/kỳ) → nếu bỏ tick "Phát hành sau" → phát hành ngay (Go-live #6) · Kết quả: thẻ tổng kết + link về danh sách |
| `#/invoices/:id` | 03/03 | Header ← mã + 2 chip (chứng từ, thu) + dòng "Khách • Phòng - Tòa • Kỳ"; 4 nút; 4 KPI; tabs Tổng quan · **Chi tiết tính tiền** · Lịch sử thu · Nhắc tiền · Tài liệu · Lịch sử; bảng Chi tiết các khoản thu (6 dòng mẫu gồm Điều chỉnh âm) + block tổng; card Lịch sử thanh toán (empty state với nút); panel phải: Khách, Hợp đồng, Ghi chú kế toán, Trạng thái nhắc tiền | **[A]** `Ghi nhận thu tiền` → drawer thu (prefill hóa đơn) · **[A]** `Gửi nhắc tiền` → tạo đợt gửi 1 người → cập nhật card Trạng thái nhắc tiền · **[A]** `Tải PDF` → sinh PDF giả (window.print CSS hoặc blob text) · **[A]** ⋮: Phát hành (nếu Nháp) / Điều chỉnh (tạo dòng điều chỉnh, chứng từ Đã điều chỉnh, giữ bản gốc – FR-FIN-08) / Hủy nháp · **[A]** Ghi chú kế toán chỉnh sửa inline · **[V]** tab Nhắc tiền = zaloMessages của hóa đơn (FR-ZAL-05) |
| `#/receivables` | 03/04 | Title "Thu tiền & công nợ"; 4 KPI (Phải thu, Đã thu, Còn phải thu, Quá hạn); 5 filter + search + Tìm kiếm/Làm mới; bảng công nợ 10 cột (sort Hạn thanh toán, Số ngày quá hạn đỏ, chip Đã nhắc/Chưa nhắc); **drawer Ghi nhận thu tiền** (Khách thuê card, Ngày thu, Số tiền VND, Phương thức, Mã tham chiếu, File bằng chứng dropzone, Ghi chú, bảng Phân bổ vào hóa đơn + Tự động phân bổ, box Khoản thu/Đã phân bổ/Chưa phân bổ, nút Hủy/Review/Xác nhận ghi nhận) | **[A]** nút `Ghi nhận thu tiền` header + dòng → mở drawer · **[A]** `Tự động phân bổ` FIFO theo hạn · **[A]** sửa số phân bổ từng dòng → box tổng realtime; chặn phân bổ > khoản thu, số âm · **[A]** `Review` → chế độ đọc lại · **[A]** `Xác nhận ghi nhận` → payment + allocations, hóa đơn đổi trạng thái thu, toast, chuyển `#/payments/:id` (Go-live #9,10) · **[A]** chọn nhiều dòng → `Gửi nhắc Zalo` (Go-live #11) · **[A]** `Xuất` CSV · Lọc `Đã/Chưa nhắc` dựa zaloMessages |
| `#/payments/:id` | 03/05 | Header 3 nút; summary card 8 ô; 4 KPI; bảng Phân bổ công nợ + Tổng phân bổ; card Thông tin giao dịch; panel Chứng từ & bằng chứng (preview + file khác), timeline Lịch sử xử lý, Lưu ý | **[A]** `Điều chỉnh` → drawer sửa phân bổ (tạo bản điều chỉnh, giữ lịch sử) · **[A]** `Hoàn tác ghi nhận` → confirm lý do → payment Đã hoàn tác, hóa đơn tính lại, timeline thêm dòng (BR-22) · **[A]** `Tải chứng từ` · **[V]** Xem trước (modal ảnh/pdf giả) |
| `#/refunds` | 03/07 | 2 nút; 5 filter; 4 KPI (Chờ duyệt/Đã duyệt/Đã hoàn/Từ chối + trend); bảng 11 cột; panel Quy trình hoàn cọc 4 bước + Ý nghĩa trạng thái + Lưu ý | **[A]** `+ Tạo yêu cầu` → wizard · **[A]** ⋮ theo trạng thái: Xem / Sửa (Nháp, Từ chối) / Gửi duyệt / **Duyệt** / **Từ chối** (Admin/Kế toán) / **Ghi nhận đã hoàn** (Đã duyệt) / Tải hồ sơ · **[A]** `Xuất danh sách` |
| `#/refunds/new` | 03/08 | Stepper 4 (Chọn hợp đồng → Kiểm tra hiện trạng → **Khấu trừ & tính toán** → Review & gửi duyệt); card Thông tin hợp đồng; 4 KPI (Cọc ban đầu, Công nợ còn lại, Khấu trừ dự kiến, Số tiền hoàn); bảng Chi tiết khấu trừ (Nhóm, Mô tả, Số tiền input, Bằng chứng Xem(n)/Thêm, Trạng thái, 🗑) + Thêm dòng; card Biên bản kiểm tra hiện trạng (4 hạng mục checkbox + ảnh); panel Tóm tắt (= Số tiền hoàn + bằng chữ), Người duyệt select, Tài liệu đính kèm + dropzone; nút Lưu nháp / Gửi duyệt hoàn cọc | **[A]** bước 1 chọn HĐ Đã kết thúc/đang trả phòng (search) · **[A]** bước 2 tick hiện trạng + upload ảnh giả · **[A]** bước 3: dòng mặc định `Công nợ còn lại` (auto từ công nợ, có checkbox "Bù trừ công nợ" mặc định **tắt** – OI-07), `Khấu hao cố định 200.000đ/phòng` (BR-12), Vệ sinh, Sửa chữa, Khác; số tiền hoàn realtime; cảnh báo khi khấu trừ > cọc (không cho số âm – FR-FIN-06) · **[A]** `Lưu nháp` · **[A]** `Gửi duyệt hoàn cọc` → Chờ duyệt (Go-live #13 phần 1) |
| `#/refunds/:id` | *(bổ sung; tham khảo 09_Duyet_hoan_coc.png Phase 2 ở mức 1 cấp)* | Header mã + chip; tóm tắt cọc/khấu trừ/hoàn; bảng khấu trừ; tài liệu; timeline trạng thái | **[A]** `Duyệt` / `Từ chối` (nhập lý do → quay lại Cần chỉnh sửa) – chỉ Admin/Kế toán, role khác disabled · **[A]** `Ghi nhận đã hoàn` (ngày, phương thức, tham chiếu, bằng chứng bắt buộc) → Đã hoàn; **không** đổi trạng thái phòng (BR-02) · **[A]** `Gửi Zalo Đã hoàn cọc` (event hoàn cọc) |
| `#/expenses` | 03/10 | 6 filter 2 hàng; 4 KPI; bảng 11 cột (chip Nhóm chi màu theo nhóm, Chứng từ file icon); **drawer Thêm chi phí** (Ngày chi, Nhóm chi, radio Tòa/Chi phí chung, Số tiền, radio Tiền mặt/Khấu hao, Chứng từ dropzone, Ghi chú, bảng Phân bổ theo tòa % / số tiền + Thêm tòa + Tổng 100%) | **[A]** `+ Thêm chi phí` → tạo expense (+ expenseAllocations nếu Chi phí chung; tổng % phải = 100 – FR-FIN-05) · **[A]** ⋮: Xem / Sửa / Xóa (chỉ record `source:user`) · **[A]** `Xuất file` · **[P2]** radio `Khấu hao` chọn được nhưng ghi chú "Phân bổ khấu hao theo kỳ – Phase 2" và không sinh lịch khấu hao |

### 4.5 Thông báo Zalo

| Route | PNG | Nội dung phải khớp | Action |
|---|---|---|---|
| `#/zalo/config` | 05/01 | 3 nút header; 5 tile sự kiện (Nhắc tiền / HĐ sắp hết hạn / Đã hoàn cọc / Đến kỳ trả chủ nhà / Thông báo chung) với chip kích hoạt; card Cấu hình sự kiện (Sự kiện, Điều kiện áp dụng, Tòa/Phòng, Thời điểm gửi N ngày trước/sau, Mẫu template + Xem mẫu, Kênh chính, Kênh fallback, Người nhận, Ghi chú 0/500) + toggle; bảng Các đợt gửi gần đây; panel Xem trước nội dung Zalo (phone bubble render biến) + Hướng dẫn | **[A]** chọn tile → load rule; toggle bật/tắt (rule tắt không sinh đợt – FR-ZAL-01) · **[A]** `Lưu cấu hình` → zaloEvents · **[A]** `Gửi thử` → modal chọn 1 khách → tạo batch test 1 tin · **[V]** `Xem đợt gửi` → history · **[A]** `Xem mẫu`/`Thay đổi mẫu` → modal template với biến `{ten_khach}, {toa_nha}, {so_phong}, {so_tien}, {ngay_den_han}`, preview realtime · **[P2]** Kênh fallback (chỉ "Không sử dụng"; option SMS disabled tooltip "OI-21 chưa chốt") · **[P2]** tile Đến kỳ trả chủ nhà (chọn được, badge P2, không lưu) |
| `#/zalo/batches/new` | 05/02 | Stepper 4 (Chọn nguồn dữ liệu → Chọn mẫu → **Preview người nhận** → Xác nhận & gửi); card Nguồn dữ liệu đã chọn + Thay đổi; 4 KPI (Tổng/Đủ điều kiện/Bỏ qua/Có lỗi dữ liệu); bảng người nhận (checkbox, Phòng, Khách, SĐT/Zalo, Số tiền nợ, Trạng thái, Ghi chú) + ☑ chỉ hiển thị đủ điều kiện + Tùy chỉnh cột; panel Xem trước mẫu + Tóm tắt đợt gửi + Thời gian gửi; nút Lưu nháp / Xác nhận gửi | **[A]** bước 1 nguồn: Hóa đơn vừa phát hành (kỳ) / Công nợ quá hạn / Nhắc trước hạn N ngày / HĐ sắp hết hạn / Đã hoàn cọc / Chọn tay · **[A]** bước 2 chọn template · **[A]** bước 3 **re-check công nợ** lúc tạo: khách đã trả đủ → Bỏ qua; trả một phần → số còn nợ mới; thiếu SĐT → Có lỗi dữ liệu; đã nhận tin trong 3 ngày → Bỏ qua (FR-ZAL-02) · **[A]** bỏ tick từng người · **[A]** `Thời gian gửi` Gửi ngay / Hẹn giờ · **[A]** `Lưu nháp` · **[A]** `Xác nhận gửi` → batch Đang gửi → chuyển detail, tiến độ chạy bằng timer (Go-live #7, #11) |
| `#/zalo/batches/:id` | 05/03 | Header + chip Đang gửi; meta Mã/Tạo lúc/Bởi; 3 nút; card Thông tin đợt gửi 7 ô; card Tiến độ gửi tin (progress + 7 tile trạng thái); card Cấu hình đợt gửi (Phạm vi, Quy tắc, Template, Người tạo, Thời gian); bảng tin nhắn (Người nhận, Phòng/Tòa, Hóa đơn, Kênh, Template, Trạng thái giao, Mã lỗi, Còn nợ hiện tại, Xem/⋮) + filter | **[A]** tiến độ live: Chờ xử lý → Đang gửi → Đã tiếp nhận → Đã giao (~90%) / Thất bại (~5%, mã ZLM-1001 SĐT không hợp lệ, ZLM-2003 khách chặn) / Chưa rõ kết quả (~3%) · **[A]** `Thử lại các tin đủ điều kiện` → chỉ Thất bại/Chưa rõ, tạo lần thử mới liên kết tin gốc, không gửi lại Đã giao (FR-ZAL-04) · **[A]** dòng ⋮: Xem nội dung đã gửi / Thử lại tin này / Mở hóa đơn · **[A]** `Xuất kết quả` CSV · **[V]** `Xem lịch sử`, `Xem nội dung template` · Cột "Còn nợ hiện tại" đọc realtime từ selectors (gửi thành công ≠ đã thanh toán – FR-ZAL-05) |
| `#/zalo/history` | 05/04 | 2 nút; 7 filter 2 hàng; 4 KPI; bảng đợt gửi 12 cột (Thành công xanh / Thất bại đỏ, chip Thành công/Một phần/Thất bại/Đang xử lý); panel Thống kê nhanh (donut + legend) + Lỗi gửi gần đây | **[A]** `+ Tạo đợt gửi` · **[V]** Xem chi tiết · **[A]** ⋮: Thử lại / Nhân bản đợt gửi / Xuất · **[A]** `Xuất lịch sử` · Loại `Nhắc lịch xem phòng`, `Chăm sóc khách hàng` chỉ xuất hiện ở seed với badge P2, không tạo mới được |

### 4.6 Cấu hình & Dữ liệu

| Route | PNG | Nội dung phải khớp | Action |
|---|---|---|---|
| `#/settings/users` | 10/01 | 5 filter 2 hàng; 4 KPI; bảng 9 cột (chip vai trò màu: Quản trị viên xanh, Kế toán vàng, Vận hành xanh nhạt, Sale tím, Kỹ thuật cam); **drawer Tạo tài khoản** (Họ tên, Email, SĐT, Vai trò, Khu vực, Tòa/Phòng phụ trách multi, Ngày hiệu lực, Trạng thái, Ghi chú) | **[A]** `Tạo tài khoản` → user (vai trò Phase 1: Quản trị viên/Kế toán/Vận hành; Sale/Kỹ thuật hiện với tag P2) · **[A]** ⋮: Xem / Sửa / Khóa / Mở khóa / Đặt lại mật khẩu (toast) / Phân công tòa · **[A]** `Xuất dữ liệu` · Chỉ Admin vào được route này (FR-IAM-02) |
| `#/settings/catalog` | 10/02 | 2 nút; 4 tab lớn (Dịch vụ & Bảng giá · Nhóm chi phí · Phương thức thanh toán · Nguồn khách [P2]); bảng dịch vụ (icon, Tên, Đơn vị, Cách tính, Giá mặc định, Phạm vi, Hiệu lực, Trạng thái); panel Thông tin dịch vụ (form đầy đủ + toggle) + Lịch sử áp dụng | **[A]** chọn dòng → panel edit; `Lưu` → priceHistory thêm dòng (không hồi tố hóa đơn đã phát hành – BR-21) · **[A]** `+ Thêm dịch vụ` · **[A]** `Áp dụng bảng giá` → modal chọn tòa + ngày hiệu lực → cập nhật dịch vụ mặc định của phòng chưa có HĐ · **[A]** `Xóa` (chặn nếu đang dùng trong HĐ hiệu lực → gợi ý Ngừng hoạt động) · **[A]** tab Nhóm chi phí / Phương thức thanh toán: CRUD đơn giản (dùng cho Chi phí, Thu tiền) · Danh mục seed: Điện, Nước, Mạng/Internet, Thang máy, Dịch vụ chung/Phí quản lý, Sạc xe điện, Gửi xe (FR-FIN-10) |
| `#/settings/import` | 10/03 | Nút Tải file mẫu; 5 tile đối tượng (Khách thuê · Phòng · Hợp đồng · Chỉ số điện nước · Bảng kê thu tiền [P2]); stepper 4 (Tải file → Mapping cột → **Kiểm tra dữ liệu** → Preview & xác nhận); 4 KPI; bảng Mapping & kiểm tra (Cột file, Ví dụ, Trường hệ thống select, Bắt buộc, Trạng thái) + Chỉnh sửa mapping; Preview 5 dòng; panel Quy tắc kiểm tra + Kết quả dự kiến; nút Lưu nháp / Tiếp tục review | **[A]** bước 1 dropzone nhận CSV thật (parse bằng JS, hỗ trợ `.csv`; `.xlsx` đọc qua SheetJS từ cdnjs khi online, offline hiện hướng dẫn dùng CSV) hoặc `Dùng file mẫu` · **[A]** bước 2 auto-map theo tên cột, chỉnh select · **[A]** bước 3 validate theo 4 quy tắc PNG (trùng SĐT cùng tòa, phòng tồn tại, ngày ≤ hôm nay, CCCD 12 số) → Hợp lệ/Cần kiểm tra/Lỗi; sửa inline dòng lỗi · **[A]** bước 4 `Xác nhận import` → tạo record (dòng lỗi bỏ qua), importJob lưu kết quả, idempotent theo checksum file · `Tải file mẫu` → CSV theo loại · Bảng kê thu tiền: tile P2 disabled |
| `#/reports` | *(không có PNG – Phase 1 §2.6 yêu cầu 3 báo cáo)* | Trang tối giản theo pattern list: 3 tab **Báo cáo phòng** (theo tòa: tổng/đang thuê/sẵn sàng/chờ dọn/bảo trì) · **Báo cáo công nợ** (theo tòa/kỳ: phải thu/đã thu/còn nợ/quá hạn) · **Báo cáo thu tiền** (theo ngày/phương thức/người thu); filter Kỳ/Tòa; bảng + tổng | **[A]** `Xuất CSV` từng tab · Không có công thức TBD (lợi nhuận, hiệu suất...) – để lại cho Phase 2 |
| `#/coming-soon/:key` | – | Card giữa trang: icon, tên chức năng, "Thuộc Phase 2/3", 2–3 bullet mô tả từ `00_SCOPE_3_PHASE.md`, FR liên quan, nút Quay lại | **[V]** |

### 4.7 Màn/Form bổ sung không có PNG (thiết kế theo pattern drawer `Tạo tài khoản` để đồng nhất)
Drawer: Thêm/Sửa tòa · Thêm/Sửa phòng · Tạo nhiều phòng · Thêm/Sửa khách thuê · Thêm/Sửa chủ nhà · HĐ đầu vào · Giữ chỗ · Gia hạn HĐ · Kết thúc HĐ · Điều chỉnh hóa đơn · Điều chỉnh/Hoàn tác khoản thu · Duyệt/Từ chối/Ghi nhận hoàn cọc · Template Zalo · Gửi thử Zalo · Nhân bản đợt gửi · Sửa tài khoản.
Trang: Chi tiết hợp đồng · Chi tiết hoàn cọc · Báo cáo Phase 1 · Coming soon.

---

## 5. Seed data (khớp số liệu PNG, deterministic)

- Ngày demo cố định **28/10/2024**; kỳ hiện tại **Tháng 10/2024**.
- 5 tòa hero: Tòa Sunrise `TH-HBT-01` 80 phòng (Cầu Giấy), Moonlight `TH-PXL-02` 72, Riverside `TH-Q1-03` 68, Central `TH-BTD-04` 60, Garden `TH-TĐ-05` 40 → **320 phòng**; thêm 5 tòa phụ (Harmony, Lotus – Bảo trì, SkyView, Green Park, Ocean – Tạm ngừng) chỉ để bảng Tòa nhà đủ 10 dòng/28 tòa (các tòa phụ 0 phòng chi tiết, đánh dấu `stub:true`).
- Mã phòng chuẩn hóa **`A.12.03`** (tòa-chữ · tầng · số); PNG lẫn `A12.03` – dùng 1 format duy nhất.
- Hero records dùng xuyên demo (tên đúng PNG): Trần Minh Đức `KH00123` A.12.03 Sunrise (HĐ `HD-2024-001`, hóa đơn `HD-202410-001` 12.000.000, quá hạn 18 ngày); Nguyễn Thị Hương B.05.01 Moonlight (thu một phần, HĐ đã trả phòng → hoàn cọc `RC202410-002`); Lê Quang Huy C.08.02 Riverside (`HD-202410-003` 7.000.000 quá hạn, 2 lần nhắc); Phạm Thu Trang A.16.08 (phòng Chờ dọn); Hoàng Nam Khánh D.03.06 Central (HĐ sắp hết hạn 12 ngày); Nguyễn Thảo Vy (chi tiết khách/phòng); Vũ Thảo Nguyên, Đặng Quốc Bảo, Ngô Yến Nhi, Phan Văn Long, Bùi Thị Mai (bảng công nợ).
- Phân bố trạng thái phòng để KPI ra đúng ~142 Sẵn sàng / 46 Đang thuê... theo `03_Danh_sach_phong.png` (chấp nhận lệch nhỏ vì số liệu PNG vốn không nhất quán giữa các màn; ưu tiên **nhất quán nội bộ**).
- Hóa đơn kỳ 10/2024: 124 hóa đơn (12 Nháp, 86 Đã phát hành, 10 Quá hạn, 14 Thu một phần, 62 Thu đủ, 4 Đã điều chỉnh); 42 khoản công nợ; 67 yêu cầu hoàn cọc; 28 chi phí; 28 đợt Zalo (`ZL-202410-001..028`), đợt `ZL-202410-028` = 320 tin Đang gửi để demo tiến độ.
- Tài khoản: 24 user; 3 tài khoản đăng nhập demo `admin` (Nguyễn Văn Minh), `ketoan` (Trần Thị Lan), `vanhanh` (Nguyễn Thị Hương).
- Sinh phần còn lại bằng generator seed cố định (mulberry32) từ danh sách tên Việt, để reload luôn ra cùng dữ liệu.
- Mọi record seed có `source:'seed'`; guide chỉ tính mốc trên record `source:'user'`.

---

## 6. Panel Hướng dẫn thao tác (spec v1.5, cắt scope Phase 1)

- Panel phải 360px desktop / bottom sheet mobile; nút ≥44px; `prefers-reduced-motion` tắt animation; không che modal/bảng (content co lại khi panel mở).
- Nội dung: tiến độ tổng (x/34 mốc), luồng hiện tại, mốc hiện tại (Màn hình · Vai trò · Thao tác · Kết quả phải thấy · Mốc tiếp theo), 3 trạng thái `Chưa sẵn sàng / Đang thực hiện / Hoàn thành`.
- Action panel (không tạo record, không submit): `Đi tới màn hình` (route + highlight vùng `data-guide="..."`), `Chuyển vai trò`, `Xem dữ liệu mẫu`, `Điền dữ liệu mẫu` (chỉ trường trống, form phải đang mở), `Điền lại dữ liệu mẫu`, `Tải file mẫu`, `Dùng file mẫu` (gắn File vào input qua DataTransfer), `Xem toàn bộ luồng`.
- `evaluate()` chạy sau render/save/action/route; điều kiện là hàm thuần trên store; dữ liệu bị hoàn tác → mốc quay lại "Đang thực hiện". Tiến độ lưu `timehouse-guide-p1-v1`.
- Không có nút chạy tự động trong panel chính (chỉ trong Công cụ nâng cao).

**Luồng & mốc (ID ổn định) ↔ 16 điều kiện Go-live §2.8:**

| Flow | Mốc (route · vai trò) | Điều kiện hoàn thành | Go-live |
|---|---|---|---|
| **S0 Khởi động** | S0.1 Đăng nhập (`/login` · Admin) · S0.2 Mở Tổng quan · S0.3 Kiểm tra Danh mục dịch vụ (`/settings/catalog`) · S0.4 Kiểm tra tòa & phòng sẵn sàng (`/rooms?status=ready`) | session tồn tại; route đã ghé; ≥1 dịch vụ Đang hoạt động; ≥1 phòng Sẵn sàng | – |
| **F01 Tạo khách** | F01.1 Mở drawer Thêm khách thuê · F01.2 Lưu khách (`/tenants` · Vận hành) | tenants có record `source:user` | 1 |
| **F02 Hợp đồng** | F02.1 Chọn phòng sẵn sàng → Tạo hợp đồng (`/rooms`) · F02.2 Điền khách & phòng · F02.3 Giá/cọc/dịch vụ · F02.4 Xác nhận & kích hoạt (`/contracts/new`) | contract `user` Hiệu lực; phòng đó Đang thuê; contractServices ≥1 | 2, 3, 4 |
| **F03 Điện nước & hóa đơn** | F03.1 Mở Tạo hóa đơn theo kỳ (Kế toán) · F03.2 Nhập chỉ số phòng của HĐ vừa tạo · F03.3 Preflight không còn "Thiếu chỉ số" · F03.4 Tạo nháp · F03.5 Phát hành | meterReadings `user` cho phòng; invoice `user` Nháp → Đã phát hành, có dòng Điện/Nước | 5, 6 |
| **F04 Gửi hóa đơn Zalo** | F04.1 Tạo đợt gửi nguồn "Hóa đơn vừa phát hành" · F04.2 Xác nhận gửi · F04.3 Xem chi tiết đợt, tiến độ đạt 100% | zaloBatch `user` có tin cho hóa đơn F03; batch kết thúc | 7 |
| **F05 Công nợ & thu tiền** | F05.1 Xem công nợ, tìm hóa đơn F03 (`/receivables`) · F05.2 Ghi nhận thu **một phần** (< tổng) · F05.3 Xem Chi tiết khoản thu · F05.4 Kiểm tra hóa đơn còn nợ = tổng − đã thu | payment `user` phân bổ vào hóa đơn F03; trạng thái thu = Thu một phần | 8, 9, 10 |
| **F06 Nhắc công nợ** | F06.1 Tạo đợt gửi nguồn "Công nợ quá hạn/Nhắc trước hạn" gồm khách F01 · F06.2 Xác nhận gửi · F06.3 Thử lại tin lỗi (nếu có) | batch `user` loại nhắc nợ có tin cho khách F01 với số còn nợ đúng; retry không tạo trùng cho tin Đã giao | 11 |
| **F07 Kết thúc HĐ** | F07.1 Mở HĐ F02 → Kết thúc hợp đồng · F07.2 Xác nhận với "Chuyển phòng Chờ dọn" | contract Đã kết thúc; room Chờ dọn; refund Nháp tự sinh | 12, 14 |
| **F08 Hoàn cọc** | F08.1 Lập phương án (khấu trừ ≥1 dòng, có bằng chứng) · F08.2 Gửi duyệt · F08.3 Chuyển vai trò Kế toán → Duyệt · F08.4 Ghi nhận đã hoàn (kèm bằng chứng) | refund Chờ duyệt → Đã duyệt → Đã hoàn; phòng **vẫn** Chờ dọn | 13 |
| **F09 Dọn phòng** | F09.1 `/rooms` lọc Chờ dọn → Xác nhận dọn xong · F09.2 Kiểm tra phòng xuất hiện ở Sẵn sàng | room Sẵn sàng; auditLog có `confirmCleaned` | 15, 16 |
| **F10 Bổ trợ (tùy chọn)** | F10.1 Thêm chi phí · F10.2 Import khách bằng file mẫu · F10.3 Tạo tài khoản Vận hành + phân công tòa · F10.4 Xuất báo cáo công nợ | record `user` tương ứng | – |

Tổng ~36 mốc. Dữ liệu mẫu cho mỗi mốc form (payload hợp lệ) và 3 file CSV mẫu (khách 10 dòng có 1 dòng lỗi cố ý, phòng, chỉ số điện nước có 1 dòng chỉ số mới < cũ) đặt trong `assets/samples/`, metadata (mục đích, số dòng, cột, lỗi cố ý) hiển thị khi `Xem dữ liệu mẫu`.

---

## 7. Thứ tự thực hiện (milestone)

| # | Milestone | Kết quả kiểm chứng |
|---|---|---|
| M0 | Skeleton: `index.html`, tokens, base, layout shell (sidebar đầy đủ + tag P2/P3, topbar, role switcher, Ctrl+K), router, coming-soon, login | Đăng nhập → dashboard rỗng, mọi menu điều hướng đúng, 1440 & 375 không overflow |
| M1 | Store + seed + selectors + actions (toàn bộ state machine §2.4) + audit + idempotency | Unit check bằng console script: chạy `runAll()` ra đúng 16 điều kiện; reload giữ state; Reset về seed |
| M2 | Component kit: KPI, DataTable (sort/filter/paginate/checkbox/⋮), Chip, Drawer, Modal, Wizard, Tabs, Toast, Dropzone, Chart SVG, Timeline, EmptyState | Trang demo component nội bộ `#/__kit` (ẩn) khớp style PNG |
| M3 | Vận hành: Dashboard, Tòa nhà (list/detail), Phòng (list/detail), Chủ nhà (list/detail) + drawer form | Đối chiếu side-by-side 8 PNG nhóm 00/01 |
| M4 | Khách thuê (list/detail), Hợp đồng (list/new/detail), Gia hạn, Kết thúc HĐ | Chạy F01, F02, F07 thủ công |
| M5 | Tài chính: Hóa đơn (list/batch/detail), Thu tiền & công nợ + drawer, Chi tiết khoản thu, Hoàn cọc (list/new/detail), Chi phí | Chạy F03, F05, F08, F09; đối chiếu 8 PNG nhóm 03 |
| M6 | Zalo: Cấu hình, Tạo đợt gửi, Chi tiết đợt (tiến độ live + retry), Lịch sử (donut) | Chạy F04, F06; đối chiếu 4 PNG nhóm 05 |
| M7 | Cấu hình: Tài khoản, Danh mục dùng chung, Import wizard (CSV parser + validate), Báo cáo Phase 1 | Chạy F10; import file mẫu ra đúng 86/6/2 kiểu KPI |
| M8 | Guide panel (flows/milestones/evaluate/sample data), Công cụ nâng cao, README kịch bản demo, polish responsive, a11y focus, reduced-motion | Nghiệm thu §8 |
| M9 | Copy plan → `Timehouse-Mockup-Plan-Phase1-v1.0.md`; đóng gói `mockup/` (zip) + hướng dẫn deploy Netlify | Mở file:// và trên Netlify đều chạy |

---

## 8. Verification / Nghiệm thu

1. **Mở `mockup/index.html` bằng double-click** (file://) → đăng nhập `admin` → dashboard hiển thị KPI khớp số PNG (142 / 28 / 36 / 78%; 1.600.000.000 / 1.248.000.000 / 320.000.000 / 45.000.000).
2. **Chạy tay 16 điều kiện Go-live** theo panel Hướng dẫn (S0 → F09) với 3 vai trò; mọi mốc chuyển `Hoàn thành`; phòng đi hết vòng Sẵn sàng → Đang thuê → Chờ dọn → Sẵn sàng; hóa đơn Nháp → Đã phát hành → Thu một phần; hoàn cọc Chờ duyệt → Đã duyệt → Đã hoàn.
3. **Kiểm tra bất biến nghiệp vụ** (console `__timehouseDemo.state`): không hóa đơn trùng HĐ/kỳ; tổng phân bổ ≤ khoản thu; không phòng Sẵn sàng khi HĐ còn hiệu lực; hoàn cọc Đã hoàn không đổi trạng thái phòng; retry Zalo không tạo tin mới cho tin Đã giao; Vận hành không duyệt được hoàn cọc (nút disabled + gọi action trực tiếp bị từ chối).
4. **Guide không tạo record**: bấm lần lượt Đi tới màn hình / Chuyển vai trò / Xem dữ liệu mẫu / Điền dữ liệu mẫu / Dùng file mẫu → so `JSON.stringify(state)` trước/sau (chỉ `guideProgress` đổi).
5. **Persist & reset**: reload giữ dữ liệu; `Đặt lại dữ liệu demo` về seed; `Reset tiến độ hướng dẫn` không xóa nghiệp vụ; `Xóa trắng` → dashboard empty state đúng.
6. **Đối chiếu hình**: dùng Playwright MCP chụp 27 route ở 1440×1000 đặt cạnh PNG gốc (checklist từng màn: nhãn, cột, nút, chip màu); mobile 375 không overflow ngang, panel guide thành bottom sheet, không che modal.
7. **Console sạch**: không lỗi JS trên toàn bộ route; hoạt động offline (không phụ thuộc CDN trừ SheetJS/Google Fonts có fallback).
8. **Netlify**: kéo thả `mockup/` → URL chạy giống local.

---

## 9. Ghi chú & rủi ro

- PNG không nhất quán (vị trí menu Zalo, format mã phòng, mã đợt gửi `NTF-001` vs `ZL-…`, sidebar TÀI CHÍNH khác nhau giữa màn). Plan chọn **một chuẩn** (§3.1, §5) và ghi vào README để khách biết đây là quyết định chuẩn hóa, không phải lỗi.
- Nhiều OI trong SRS còn mở (OI-04/05/06/07/08/21). Mockup dùng mặc định rõ ràng và ghi tooltip ⓘ tại chỗ: thu một phần **cho phép**; công nợ neo theo **ngày phát hành + 5 ngày** (cờ) nhưng nhãn Quá hạn theo **hạn thanh toán**; hoàn cọc **không** tự bù nợ; khấu hao cố định 200.000đ/phòng; fallback SMS **không** dùng.
- Không dùng lib chart/UI để đảm bảo chạy offline & dễ chỉnh pixel; đổi lại phải tự viết DataTable và 3 loại chart SVG (đã tính trong M2).
- File `.xlsx` cần SheetJS (CDN) → offline chỉ nhận CSV; file mẫu cung cấp cả CSV.
