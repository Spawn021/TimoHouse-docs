# Plan: Mockup tương tác TimoHouse – Phase 2 Sales, Automation & Operations

> Đầu vào: bộ PNG `Phase_2_Sales_Automation_Operations/` (18 màn), `Timehouse-SRS-v1.2.docx`, `Timehouse-UI-Mockup-Spec-v1.5.md`, `00_SCOPE_3_PHASE.md` §3, mockup Phase 1 đang chạy trong `mockup/`.
> Ngày lập: 14/09/2026 · Trạng thái: **Đã thực hiện 15/09/2026** (M0–M9) – xem `mockup/README.md` mục *Phase 2*
> Đầu ra: cùng thư mục `mockup/` (mở `index.html` hoặc Netlify), bổ sung toàn bộ màn Phase 2 gắn nhãn **P2**, có **công tắc bật/tắt phase** trong Công cụ nâng cao; tắt P2 thì mockup hành xử y hệt bản Phase 1 hiện tại.

---

## 1. Context

- Mockup Phase 1 (`mockup/`, vanilla JS, `window.TH`, hash-router, localStorage `timehouse-demo-p1-v2`) đã chạy trọn 16 điều kiện Go-live. Các mục Phase 2/3 hiện chỉ là tag `P2/P3` mờ trong sidebar → trang `#/coming-soon/:key`, nút `p2:true` bị disabled.
- Khách có 18 PNG Phase 2 (CRM 7, Tài chính 3, OCR 1, Zalo 1, Bảo trì 2, Báo cáo 2, Data Job 2) cần dựng thành màn tương tác trong cùng mockup, để demo cả 2 phase từ một bản.
- Yêu cầu bổ sung của người dùng: (1) mọi thứ thuộc Phase 2 phải **có mô tả (P2)** để phân biệt; (2) có **nút chọn phase ở phần demo** để bật/tắt từng phase.
- Quyết định đã chốt với người dùng (14/09/2026):
  1. **Phase toggle = công tắc độc lập từng phase** (P1 luôn bật; P2 bật/tắt; P3 có công tắc nhưng disabled vì chưa có mockup), đặt trong **Công cụ nâng cao** (admin).
  2. **Mặc định lần đầu mở: chỉ Phase 1.** Trạng thái phase lưu riêng `localStorage['timehouse-phase-v1']`, không nằm trong state nghiệp vụ → Đặt lại/Xóa trắng/Nhập state không đổi phase; đổi phase không xóa dữ liệu.
  3. **Report Hub:** đủ 32 card như PNG; ~10 báo cáo chạy thật trên dữ liệu store; còn lại mở trang chuẩn "Công thức chờ chốt (OI-xx)".
  4. **Bật P2 mở thêm 2 vai trò `sale` (Sale) và `kythuat` (Kỹ thuật)** – hiện đang bị chặn đăng nhập ở `auth.js:167/177`, `actions.js:340`.

Ghi chú tên file PNG bị đảo: `10_Cau_hinh_Du_lieu/04_Danh_sach_Data_Job.png` thực ra là **chi tiết job**, `05_Chi_tiet_Data_Job.png` là **danh sách**. Plan dùng nội dung ảnh, không dùng tên file.

---

## 2. Cơ chế Phase (nền tảng, làm trước mọi màn)

### 2.1 Module mới `js/core/phase.js` (nạp ngay sau `store.js`, trước `auth.js`)
```
TH.phase = {
  KEY: 'timehouse-phase-v1',            // { "2": false, "3": false }
  on(n)        → n===1 || !!state[n]
  set(n, bool) → lưu localStorage, emit store 'phase' → layout.refreshTop() + router.refresh() + guide.render()
  info(n)      → { label:'Phase 2', name:'Sales, Automation & Operations', short:'P2' }
  tag(n, cls)  → '<span class="tag-p on">P2</span>' (HTML badge dùng chung)
  available(n) → n!==3  // P3 chưa có mockup → công tắc disabled
}
```
- `app.js`: subscriber `store.on` xử lý thêm `what === 'phase'` giống `'change'`.
- Console API: `__timehouseDemo.setPhase(n, on)`, `__timehouseDemo.phases()`.

### 2.2 Router (`router.js:34`)
- Route meta mới `phase: 2`. Trong `R.render`, trước `canRoute`: nếu `meta.phase && !TH.phase.on(meta.phase)` → gọi `TH.pages.comingSoon(root, meta.scopeKey || menuKey)` (tách renderer hiện tại của `misc.js` thành hàm dùng chung) thay vì handler. URL giữ nguyên, breadcrumb "Phase 2 / <tên>".
- `canRoute` không đổi; quyền P2 thêm vào `PERMS`.

### 2.3 Sidebar & shell (`layout.js`)
- `L.MENU`: mục P2 đổi từ `{ p:'P2' }` sang `{ phase:2, href:'#/...', permission:'...' }`. `sidebarItem`:
  - phase tắt → như hiện tại (class `p2` mờ, `href = #/coming-soon/key`, `.ptag` trắng).
  - phase bật → link thật, không mờ, vẫn có badge `.ptag.on` (viền xanh nhạt) để nhận biết P2.
  - Mục P2 **không có PNG** (`channels`, `marketing`, `system`) giữ `scopeOnly:true` → luôn ra coming-soon, trang ghi rõ "Thuộc Phase 2 – chưa có mockup UI trong bộ PNG". `tasks` → alias `#/maintenance/schedules`; `cashbook` → alias `#/reports/cashflow`; `deposits` → trang sổ cọc đơn giản (§4.3).
- Sidebar footer: `Phiên bản 1.0.0 · Mockup Phase 1` → `Phiên bản 2.0.0 · Phạm vi: P1` / `P1 + P2` (động).
- **Công cụ nâng cao** thêm khối đầu tiên:
  ```
  Phạm vi demo
  [✓] Phase 1 – Core Rental (luôn bật, disabled)
  [ ] Phase 2 – Sales, Automation & Operations      ← data-on="phase-2"
  [ ] Phase 3 – Enterprise & Investment (chưa có mockup) ← disabled, tooltip
  ```
  Đổi công tắc → `TH.phase.set` → toast "Đã bật Phase 2 – 18 màn CRM/Bảo trì/Báo cáo/Data Job đã mở" hoặc "Đã tắt Phase 2 – trở về kịch bản Go-live Phase 1". Nếu đang đứng ở route P2 khi tắt → trang tự chuyển thành coming-soon (không mất URL). Nếu đang đăng nhập vai trò `sale/kythuat` khi tắt P2 → tự chuyển về admin + toast.
- Thêm nút `▶ Chạy kịch bản Phase 2 (kỹ thuật)` (chỉ hiện khi P2 bật).
- User menu: khi P2 bật, danh sách Chuyển vai trò có thêm `Sale` và `Kỹ thuật`.

### 2.4 Component kit (`components.js`) – tổng quát hóa cờ `p2`
- `U.btn/actBtn/tabs/menu`: `p2:true` ⇒ alias `phase:2`. Nếu `TH.phase.on(phase)` → **enabled**, giữ badge `<span class="tag-p on">P2</span>`; nếu tắt → disabled + tooltip như cũ. Không phải sửa từng trang cũ, chỉ cần `act` của các nút đó được wire khi bật (bảng §2.6).
- `U.pageHead({ phase:2 })` → chip `P2` cạnh tiêu đề, tooltip "Phase 2 – Sales, Automation & Operations · FR-…" ; mọi trang P2 truyền tham số này.
- `U.p2Toast` chỉ dùng khi phase tắt.
- CSS: `.tag-p.on`, `.ptag.on`, `.sb-item.p2.on` (không mờ), `.phase-switch` trong `base.css/components.css`.

### 2.5 Auth (`auth.js`)
- `sale`, `kythuat` (đổi key `tech` → `kythuat` cho khớp tài khoản demo; giữ alias `tech` khi migrate seed) được login/switch khi `TH.phase.on(2)`; tắt P2 vẫn chặn như cũ.
- `PERMS` bổ sung (roles: admin A, accountant K, ops O, sale S, kythuat T):
  `crm.view [A,K,O,S]`, `crm.manage [A,S]`, `viewings.manage [A,O,S]`, `holds.manage [A,O,S]`, `deals.view [A,K,S]`, `deals.manage [A,S]`, `commission.view [A,K,S]`, `commission.pay [A,K]`, `ocr.use [A,O]`, `statement.import [A,K]`, `openingBalance.manage [A,K]`, `dataJobs.view [A,K,O]`, `dataJobs.manage [A,K]`, `maintenance.view [A,K,O,T]`, `maintenance.manage [A,O,T]`, `maintenance.assign [A,O]`, `maintenance.schedule [A,O,T]`, `reports.hub [A,K]`, `period.close [A,K]`, `zalo.log [A]`, `refunds.requestEdit [A,K]`, `expenses.depreciation [A,K]`.
  Sale: `rooms.view/tenants.view/contracts.view` read-only; Kỹ thuật: `rooms.view/buildings.view`. `COLLECTION_TYPE` thêm collection P2 có `buildingId/roomId` để ops vẫn bị giới hạn theo tòa.
- Tài khoản demo mới trong seed: `sale` (Nguyễn Thị Hương – Sale), `kythuat` (Trần Minh Đức – Kỹ thuật) – ghi vào login page chips khi P2 bật.

### 2.6 Wire lại các điểm `p2` đã có trong trang Phase 1 (khi P2 bật)

| File:dòng | Nút/tab hiện tại | Hành vi khi P2 bật |
|---|---|---|
| `rooms.js:17,71,80–92` | `Tạo sự cố`, tab `Sự cố` | Mở drawer Tạo sự cố (prefill phòng); tab liệt kê `incidents` của phòng |
| `buildings.js:51` | tab `Hiệu suất` | Bảng hiệu suất tòa theo BR-09 (tạm tính) + link báo cáo lấp đầy |
| `buildings.js:22`, `tenants.js:13` | `Lưu bộ lọc` | Lưu bộ lọc vào `meta.savedFilters[route]`, dropdown chọn lại (mini) |
| `contracts.js:47` | radio "Tải hợp đồng để hỗ trợ điền" | → `#/contracts/ocr` (§4.2) |
| `invoices.js:22` | `Bộ lọc nâng cao` | Drawer lọc theo tòa/khách/khoảng tiền/đã nhắc |
| `expenses.js:18`, `forms.js:213` | radio `Khấu hao` | Nhập số tháng khấu hao → sinh `depreciationLines` theo kỳ (§4.6) |
| `landlords.js:60` | `Nhắc Zalo/Email` | Tạo đợt Zalo sự kiện `landlord_due` (rule seed đã có `p2:true`) |
| `zalo.js:20,25,29,56,103` | fallback SMS, Tùy chỉnh cột, Xem hội thoại, `zalo-advanced` | Fallback SMS chọn được (mô phỏng), Tùy chỉnh cột bật, Xem hội thoại → modal timeline tin đã gửi (đọc `zaloMessages`); rule `landlord_due` lưu được |
| `settings.js:33` | tab `Nguồn khách` | CRUD danh mục nguồn lead (`leadSources`) |
| `settings.js:87,108,122` | tile import `Bảng kê thu tiền` | → `#/finance/statement-import` (§4.3) |
| `reports.js:7` | `Report Hub` | → `#/reports/hub` |
| `seed.js:275–280`, `zalo.js:125` | đợt gửi loại `p2_*` | Hết badge, mở chi tiết bình thường |
| `settings.js:17`, `actions.js:340` | vai trò Sale/Kỹ thuật | Tạo được tài khoản 2 vai trò này |

---

## 3. Dữ liệu

### 3.1 Store (`store.js`)
- `SCHEMA = 3`; `migrate` chấp nhận `[1,2,3]`, backfill collection mới = `[]` (cơ chế có sẵn `store.js:11`). **Giữ nguyên KEY** để không mất dữ liệu người dùng đang có.
- Collection mới: `leads, leadActivities, leadSources, viewings, deals, commissions, ocrExtractions, statementRows, openingBalances, incidents, incidentUpdates, maintenanceSchedules, vendors, periods, reportPrefs, depreciationLines`. Dùng lại: `holds` (giữ chỗ – thêm trường `leadId, fee, feeMethod, receiverId, cancelPolicy, autoExpire, requireDeposit, lockFromSales, expiresAt`), `importJobs` (Data Job – thêm `type, fileName, fileSize, mapping[], rules[], rows[], attempts[], progress, status`), `zaloMessages` (thêm `providerCode, providerMsg, attempts[]`), `refunds` (thêm `status:'needs_edit'`, `inspection{}`, `photos[]`, `notes[]`, `history[]`).
- `meta` thêm `savedFilters`, `counters` cho mã mới.

### 3.2 Mã & trạng thái (thêm vào `selectors.js` `Q.L`)

| Đối tượng | Mã | Trạng thái |
|---|---|---|
| Lead | `LD-2024-081` | `new → contacted → viewing → considering → held → won` \| `lost`; nhiệt độ `hot/warm/cold` |
| Lịch xem | `LX-202410-012` | `scheduled → done(kết quả: interested/considering/declined)` \| `cancelled` \| `no_show` |
| Giữ chỗ | `GC-202410-006` | `active → converted` \| `expired` (auto theo `today`) \| `cancelled`; phòng `held` như P1 |
| Giao dịch | `GD00123` | HĐ: `pending_contract → active → ended`; cọc: `unpaid/partial/paid` (suy từ payments của HĐ); hoa hồng: `provisional → eligible → paid` (BR-13/AC-SAL-03-1: đủ điều kiện khi cọc thu đủ **và** HĐ kích hoạt; hoàn/hủy → đánh giá lại, không tạo khoản mới) |
| OCR | `OCR-2024-001` | `uploaded → extracting → review → created` |
| Sự cố | `SC-202410-001` | `new → assigned → in_progress → done` \| `cancelled`; ưu tiên `urgent/high/medium/low`; quá hạn = `dueDate < today` & chưa done |
| Lịch bảo dưỡng | `BD-202410-001` | `scheduled → due_soon(≤7 ngày, BR-16) → in_progress → done` \| `overdue` \| `cancelled` |
| Kỳ | `2024-10` | `open → reconciling → locked` (FR-FIN-08) |
| Data Job | `IMP-202410-004` | `running → done` \| `partial` \| `failed` \| `needs_check`; dòng: `ok/failed/check/skipped` |
| Bảng kê (dòng) | – | `matched/check/unmatched/duplicate` |
| Số dư đầu kỳ (dòng) | – | `valid/diff/check` |

### 3.3 Seed Phase 2 (`seed.js` → hàm `seed.phase2(st)` gọi cuối `seed.run`; luôn seed, ẩn khi P2 tắt)
- Khớp số PNG: 48 lead trên Kanban (8/12/10/8/6/4), KPI Tổng quan KD (124 lead mới, 38 lịch xem, 12 giữ chỗ, 18 chốt, 14.5%), bảng 8 nhân viên sale (Trần Minh Đức 28 lead / 240tr…), 32 giao dịch (`GD00123..`), doanh số 428.000.000, hoa hồng 54.600.000, 21 đủ điều kiện.
- 18 sự cố (`SC-202410-001..018`) với ưu tiên/chi phí như PNG, 50 lịch bảo dưỡng tháng 10 (đủ ô lịch: Thang máy A/B/C, Máy bơm, PCCC, Máy lọc nước, Máy giặt chung), 5 nhà cung cấp (Thang Máy Việt, HVAC Pro, CleanTech, PCCC An Toàn, AquaCare), tổng chi phí sửa chữa tháng 22.450.000 theo nhóm.
- 38 Data Job (`IMP-202410-001..010` hero như PNG + phần sinh), job `IMP-202410-004` có 1.248 dòng, 2 lần thử (856→1.020 thành công).
- Đợt Zalo hero `ZL-2024-104` "Nhắc tiền phòng tháng 10": 124 tin, 118 ok / 4 lỗi (300, 403, 408×2) / 2 chờ retry, timeline 08:30→09:25.
- Hoàn cọc hero `HC-001` (Trần Minh Đức, A.12.03, cọc 12.000.000, khấu trừ 2.500.000, chờ duyệt) – map vào `refunds` hiện có (giữ mã `RC…` của P1, hiển thị `HC-001` là alias không cần; **chuẩn hóa dùng mã P1 `RC202410-xxx`**, ghi README).
- Kỳ: `2024-09 locked`, `2024-10 open` với checklist 4/6.
- 32 báo cáo danh mục (catalog cứng trong `reports.js`), `reportPrefs` ghim 8, xem gần đây 12.
- Số dư đầu kỳ: mốc 01/11/2024, 124 dòng (98 hợp lệ/18 chênh lệch/8 cần kiểm tra) – sinh từ HĐ hiệu lực hiện có + file mẫu.
- File mẫu mới trong `assets/samples/`: `mau-bang-ke-thu-tien.csv` (20 dòng: khớp mã HĐ, khớp khách+số tiền, không ghép, trùng), `mau-so-du-dau-ky.csv` (12 dòng, 2 chênh lệch), `mau-hop-dong-ocr.txt` (nội dung HĐ mẫu để "trích xuất"). Sinh trong JS như pattern hiện tại (`settings.js:82`), file tĩnh chỉ để tham khảo.

---

## 4. Danh mục màn hình & action Phase 2

Ký hiệu: **[A]** ghi state · **[V]** hiển thị/điều hướng · **[P3]** tag P3 → coming-soon. Mọi route dưới đây có meta `phase:2`, `pageHead({phase:2})`. File trang mới: `js/pages/crm.js`, `ocr.js`, `finance2.js` (bảng kê + số dư), `maintenance.js`, `reportHub.js`, `jobs.js`; sửa `refunds.js`, `zalo.js`, `contracts.js`, `settings.js`, `reports.js`, `rooms.js`, `buildings.js`, `expenses.js`, `forms.js`.

### 4.1 Kinh doanh / CRM (`crm.js`, nhóm sidebar KINH DOANH)

| Route | PNG | Nội dung phải khớp | Action |
|---|---|---|---|
| `#/crm` | 04/01 | Filter Thời gian/Nguồn/Sale/Tòa + Làm mới; 5 KPI (Tổng lead mới, Lịch xem, Giữ chỗ, Chốt thuê, Tỷ lệ chuyển đổi + delta); card Lead theo giai đoạn (funnel bar ngang 5 tầng); Doanh số theo nhân viên (bar); bảng Nhân viên kinh doanh 8 cột + Xuất Excel; panel phải: Lead cần xử lý hôm nay (5), Lịch xem sắp tới (5), Top sale tháng (5) | **[A]** filter → KPI/chart tính từ selectors `Q.crmStats` · **[A]** Xuất báo cáo/Xuất Excel → CSV · **[V]** click lead/lịch → detail |
| `#/crm/leads` | 04/02 | Header Nhập lead / + Thêm lead / ⋮; filter 5 + Làm mới; **Kanban 6 cột** (Mới/Đã liên hệ/Hẹn xem/Cân nhắc/Giữ chỗ/Chốt thuê, count) – card: tên, SĐT, nguồn (icon), tòa quan tâm, ngân sách, ngày, sale avatar, chip nhiệt độ, nút theo cột (`Gọi`/`Đặt lịch`/`Nhắc nhở`/`Giữ chỗ`/`Xem HĐ`) + ⋮; cuối cột `+ Thêm lead`; panel Bộ lọc nhanh (7 dòng count), Thông tin pipeline (%), Lead cần xử lý hôm nay; toggle Kanban/Bảng | **[A]** `+ Thêm lead` drawer (Họ tên*, SĐT* – cảnh báo trùng SĐT FR-SAL-01, Email, Nguồn*, Kênh, Loại phòng, Số người, Ngân sách từ–đến, Tòa quan tâm multi, Ngày dự kiến vào, Sale phụ trách, Ghi chú) · **[A]** kéo-thả card giữa cột (HTML5 DnD) hoặc ⋮ → Đổi giai đoạn (chặn nhảy sang Giữ chỗ/Chốt thuê nếu chưa có hold/deal – phải đi qua wizard) · **[A]** `Gọi` → modal ghi hoạt động (kết quả, ghi chú) → `leadActivities` · **[A]** `Đặt lịch` → `#/crm/viewings/new?lead=` · **[A]** `Giữ chỗ` → `#/crm/holds/new?lead=` · **[A]** `Xem HĐ` → contract detail · **[A]** `Nhập lead` → import wizard type=lead (CSV) · **[A]** ⋮: Xem / Sửa / Đổi sale / Đánh dấu mất (lý do) · **[A]** Bộ lọc nhanh → filter |
| `#/crm/leads/:id` | 04/03 | Header ← tên + chip trạng thái (dropdown đổi) + meta Mã/SĐT/Nguồn/Phụ trách + Tạo/Cập nhật; 4 nút (Gọi khách, Đặt lịch xem, Giữ chỗ, **Chốt thuê**) + ⋮; 4 KPI (Nhu cầu, Ngân sách, Tòa/Phòng quan tâm, Lần tương tác gần nhất); tabs Tổng quan · Lịch sử chăm sóc · Lịch xem phòng · Đề xuất phòng · Tài liệu; card Thông tin lead 3 nhóm (Liên hệ / Nhu cầu / Khu vực / Ngân sách) + Ghi chú; Timeline chăm sóc (icon theo loại); Đề xuất phòng phù hợp (phòng Sẵn sàng khớp loại/tòa/ngân sách, nút Xem phòng / Giữ chỗ); panel Lịch hẹn sắp tới + Ghi chú nội bộ (+ Thêm ghi chú) | **[A]** đổi trạng thái chip · **[A]** `Chỉnh sửa` drawer · **[A]** `Thêm ghi chú` → `leadActivities` type note · **[A]** `Chốt thuê` → `#/crm/deals/new?lead=` (chỉ khi có hold hoặc lead ≥ considering) · **[V]** các tab lọc từ `viewings/holds/documents` · **[A]** tab Tài liệu upload giả |
| `#/crm/viewings` | *(không PNG – bổ sung)* | List theo pattern: status tabs (Sắp tới/Đã xem/Hủy/Không đến), filter, 4 KPI, bảng (Ngày giờ, Lead, Phòng, Tòa, Sale, Nhắc hẹn, Trạng thái, ⋮) | **[A]** `+ Đặt lịch` · **[A]** ⋮: Ghi kết quả (modal: Đã xem – quan tâm/cân nhắc/từ chối + ghi chú → lead đổi giai đoạn tương ứng) / Đổi lịch / Hủy · **[A]** `Gửi nhắc lịch` → Zalo batch sự kiện `viewing_reminder` (rule seed đã có loại này với `p2_`) |
| `#/crm/viewings/new` | 04/04 | Stepper 4 (Chọn lead → Chọn phòng → Lịch hẹn → Xác nhận); card Lead đã chọn (Thay đổi) + Phòng đã chọn (ảnh, mã, tòa, loại, m², giá, chip Trống); form Thông tin lịch hẹn (Ngày*, Giờ*, NV phụ trách*, Phương thức nhắc*, Địa điểm gặp*, Ghi chú 0/500); bảng Lịch xem gần nhất của khách; panel Tóm tắt lịch xem (3 khối + Chỉnh sửa); Quay lại / Lưu nháp / Xác nhận lịch xem | **[A]** bước 1 search lead · bước 2 chọn phòng Sẵn sàng/Giữ chỗ (grid card) · bước 3 form, validate ngày ≥ hôm nay, trùng giờ cùng sale → cảnh báo · **[A]** `Xác nhận` → `viewings` scheduled, lead → `viewing`, activity tự ghi · `Lưu nháp` giữ trong `meta.drafts` |
| `#/crm/holds` | *(không PNG – bổ sung)* | List giữ chỗ: KPI (Đang giữ, Hết hạn hôm nay, Đã chuyển đổi, Đã hủy), bảng (Mã, Lead, Phòng, Từ–Đến, Còn N ngày, Phí, Thu bởi, Trạng thái, ⋮) | **[A]** ⋮: Gia hạn / Hủy (theo điều kiện: mất phí/hoàn phí) / Chốt thuê · auto-expire: khi render, hold quá `expiresAt` → `expired`, phòng → Sẵn sàng (`X.expireHolds()` gọi ở route + đổi ngày demo) |
| `#/crm/holds/new` | 04/05 | Stepper 4 (Chọn lead → Chọn phòng → Thông tin giữ chỗ → Review); card Thông tin lead (chip Khách hàng mới) + Thông tin phòng (ảnh, Tầng, Hướng, Nội thất); form: Ngày bắt đầu*, Ngày hết hạn* (tối đa 14 ngày), Số ngày (auto), Phí giữ chỗ* (helper "1–3 triệu, trừ vào cọc"), Hình thức TT*, Người nhận tiền*, Điều kiện hủy* (Mất phí/Hoàn phí/Hoàn một phần), Ghi chú; Điều kiện giữ chỗ: toggle Tự động hết hạn, checkbox Yêu cầu xác nhận cọc, checkbox Khóa phòng khỏi danh sách sale; panel Thời gian hết hạn (đếm ngược `N ngày hh:mm:ss` theo ngày demo) + cảnh báo; Tóm tắt giữ chỗ + Trạng thái dự kiến | **[A]** `Xác nhận giữ chỗ` → `holds` active (mở rộng `X.holdRoom` P1: phòng → Giữ chỗ), lead → `held`, phí ghi nhận `payments` loại `hold_fee` (không phân bổ hóa đơn) · `Lưu nháp` · countdown chạy timer, `prefers-reduced-motion` thì tĩnh |
| `#/crm/deals/new` | 04/06 | Stepper 5 (Lead → Khách thuê → Phòng → Điều khoản thuê → Xác nhận); 3 card đầu (Lead chip Đang chuyển đổi, Khách thuê chip Đã xác nhận + mã KH, Phòng chip Trống); form Điều khoản (Ngày vào ở*, Thời hạn*, Giá thuê*, Tiền cọc* helper "Tương đương N tháng", Chu kỳ TT*, Dịch vụ áp dụng checkbox từ danh mục + Thêm dịch vụ khác, Số người ở*, Ghi chú); bảng Giấy tờ cần bổ sung (3 dòng, chip Chưa có/Đã có, Tải lên/Xem); panel Tóm tắt chốt thuê 4 khối + Người phụ trách + note xanh "Sau khi xác nhận có thể tạo hợp đồng" | **[A]** bước 2: tìm khách thuê đã có theo SĐT hoặc **tạo khách mới từ lead** (`X.convertLead` → `tenants`) · bước 3: phòng = phòng đang giữ chỗ của lead hoặc chọn Sẵn sàng (re-check khả dụng lúc chốt – FR-SAL-02) · **[A]** `Xác nhận chốt thuê` → `deals` pending_contract (saleId = phụ trách), lead → `won`, hold → `converted`, `commissions` provisional (tỷ lệ theo user.commissionRate mặc định 10% tháng đầu – OI-14 ghi tooltip) → chuyển `#/contracts/new?deal=<id>` prefill toàn bộ (khách, phòng, giá, cọc, dịch vụ) · Kích hoạt HĐ (P1 `activateContract`) → deal `active`; hủy HĐ → deal `ended`, hoa hồng về `provisional` |
| `#/crm/deals` | 04/07 | Header Xuất dữ liệu / + Tạo giao dịch; filter 5; 4 KPI (Tổng GD, Doanh số, Hoa hồng dự kiến, Đủ điều kiện chi trả); bảng 12 cột (Mã GD, Lead/Khách, Phòng/Tòa, Sale, Giá thuê, Cọc, Ngày chốt, TT HĐ, TT cọc, Hoa hồng, Điều kiện chi trả, Xem/⋮) + Lọc nâng cao + Tùy chỉnh cột; panel Quy tắc tính hoa hồng (5 bước text) + Top sale tháng (doanh số/hoa hồng) | **[A]** `+ Tạo giao dịch` → `/crm/deals/new` · **[A]** ⋮: Xem / Ghi nhận chi hoa hồng (chỉ `eligible`, Admin/Kế toán, ngày + tham chiếu, idempotent → `paid`, sinh `expenses` nhóm Hoa hồng) / Mở HĐ / Mở khách · **[A]** Xuất CSV · Điều kiện chi trả tính lại realtime từ payments/contract (`Q.commissionStatus`) |
| `#/crm/deals/:id` | *(bổ sung – drawer/trang nhỏ)* | Tóm tắt lead → khách → phòng → HĐ, timeline chốt/cọc/kích hoạt/hoa hồng | **[V]** + `Ghi nhận chi hoa hồng` |

### 4.2 OCR hợp đồng (`ocr.js`)

| Route | PNG | Nội dung | Action |
|---|---|---|---|
| `#/contracts/ocr` | 02/05 | Stepper 4 (Tải file → Trích xuất → **Review** → Hoàn tất); trái: tên file + size + Tải file khác, thanh công cụ trang (1/6, zoom ±, tay, tải), **trang HĐ giả** render HTML với highlight vàng (cần kiểm tra)/xanh (đã nhận); phải: 2 tile (24 trường đã nhận / 5 trường cần kiểm tra); form nhóm Khách thuê / Phòng / Thời hạn / Giá thuê & cọc / Dịch vụ, trường nghi ngờ có chip `Cần kiểm tra` (ví dụ Tiền cọc `22,000,2005`); nút Chạy lại trích xuất / Lưu nháp / **Tạo hợp đồng** | **[A]** bước 1 dropzone PDF/JPG/PNG (≤20MB – FR-DOC-01) hoặc `Dùng file mẫu` · **[A]** bước 2 mô phỏng progress 2s → `ocrExtractions` với `fields[{key,value,confidence}]` (confidence <0.8 → Cần kiểm tra; file mẫu cố tình sai 5 trường: tên khách viết hoa lệch, mã phòng `A12.03` ≠ `A.12.03`, cọc thừa số, ngày kết thúc, SĐT) · **[A]** bước 3 sửa trực tiếp; chip mất khi người dùng sửa/xác nhận; trường ảnh hưởng tiền **bắt buộc xác nhận** trước khi tiếp (BR-03); select Tòa/Phòng chỉ phòng Sẵn sàng/Giữ chỗ · **[A]** `Tạo hợp đồng` → `#/contracts/new?ocr=<id>` prefill (source `ocr`), form P1 hiện banner "Dữ liệu từ trích xuất – đã review N/N trường" · `Chạy lại trích xuất` reset chip · Nhập tay vẫn là nhánh dự phòng (link) |

### 4.3 Tài chính nâng cao (`finance2.js` + sửa `refunds.js`)

| Route | PNG | Nội dung | Action |
|---|---|---|---|
| `#/finance/statement-import` | 03/06 | Stepper 4 (Tải file → Mapping cột → **Review & ghép** → Xác nhận); 5 KPI (Tổng GD, Đã ghép, Cần kiểm tra, Trùng bỏ qua, Chưa phân bổ); bảng preview (Ngày GD, Số tiền, Mã ngoài, Mã hóa đơn, Mã HĐ, Phòng/Tòa, Khách, Phương thức, **Kết quả ghép** chip, Tiền phân bổ, Tiền chưa phân bổ) + tìm/lọc/tùy chỉnh cột + phân trang; panel Quy tắc ghép (4 quy tắc: mã hóa đơn → mã HĐ → khách + số tiền ±5% → phòng/tòa + ngày ±3) + Kết quả dự kiến (3 tile tiền); footer Tải dòng lỗi / Lưu nháp / **Duyệt ghi nhận** | **[A]** bước 1 CSV thật hoặc file mẫu (dùng lại parser/mapping của `settings.js` import wizard – tách thành `TH.imp.parse/autoMap/validate` dùng chung) · **[A]** bước 3 `X.matchStatement(rows)` chạy 4 quy tắc theo thứ tự, dòng trùng `refCode` đã có trong `payments` → `duplicate`; click dòng `Cần kiểm tra/Không ghép` → modal chọn tay hóa đơn/khách hoặc "Bỏ qua" · **[A]** `Duyệt ghi nhận` (Admin/Kế toán) → mỗi dòng matched → `recordPayment` P1 (phân bổ vào hóa đơn ghép, phần dư = chưa phân bổ ghi `unallocated`), tạo `importJobs` type `statement` với `rows[]` kết quả, idempotent theo checksum file → chuyển `#/settings/jobs/:id` · `Tải dòng lỗi` CSV các dòng không ghép · `Lưu nháp` giữ trong `meta.drafts` |
| `#/finance/opening-balance` | 03/11 | Stepper 4 (Chọn mốc & phạm vi → Tải file số dư → **Đối chiếu** → Xác nhận); filter Mốc chuyển đổi*/Tòa/Loại dữ liệu; 4 KPI (Phải thu đầu kỳ, Đã thu trước đó, Còn nợ chuyển vào, Cọc đang giữ); bảng đối chiếu (Khách/HĐ, Phòng/Tòa, Phải thu, Đã thu, Còn nợ đỏ, Cọc giữ, Nguồn dữ liệu chip File Excel/Hệ thống cũ, Trạng thái đối chiếu chip) + Nhập lại file; panel Tóm tắt đối chiếu (3 tile + Tổng giá trị theo trạng thái) + Lưu ý; footer Tải lỗi / Quay lại / **Xác nhận chuyển số dư** | **[A]** đối chiếu file vs HĐ hiện có: khớp → `valid`; lệch còn nợ/cọc → `diff` (hiện cả 2 số, chọn nguồn đúng); không tìm thấy HĐ → `check` · **[A]** `Xác nhận` (Admin/Kế toán, chỉ dòng valid/đã chọn) → `openingBalances` + **1 hóa đơn `kind:'opening'`/HĐ** (kỳ = mốc, dòng "Số dư đầu kỳ chuyển từ hệ thống cũ", đã phát hành) + 1 khoản thu `kind:'opening'` cho phần "Đã thu trước đó" phân bổ vào hóa đơn đó → công nợ/nhắc nợ P1 hoạt động tự nhiên, **không** sinh khoản thu mới ngoài số dư; cọc → cập nhật `contract.deposit` nếu chọn nguồn file; idempotent theo mốc + HĐ · Data Job type `opening` ghi kết quả |
| `#/refunds/:id` (nâng cấp) | 03/09 | Header `RC…` + chip + tên khách • phòng; nút `Yêu cầu chỉnh sửa` / `Từ chối` / `Duyệt` (theo trạng thái & quyền); **stepper trạng thái** Nháp → Chờ duyệt → Đã duyệt → Đã hoàn với ngày/người (dùng `U.wizard` sub = ngày); 4 KPI (Cọc giữ, Khấu trừ, Đề nghị hoàn, Công nợ liên quan); 1. Thông tin trả phòng; 2. Hiện trạng phòng (5 dòng chip + `Có hư hỏng` + lưới ảnh 5+N); 3. Bảng khấu trừ (Hạng mục, SL, Đơn giá, Thành tiền, Ghi chú, sửa/xóa) + Thêm hạng mục; 4. Tổng hợp tính toán (Cọc − Khấu trừ = Đề nghị hoàn, số bằng chữ); 5. Lịch sử duyệt timeline; Ghi chú nội bộ | **[A]** `Yêu cầu chỉnh sửa` (Admin/Kế toán, lý do) → `needs_edit`, quay lại Nháp-sửa, gửi duyệt lại (SRS §6 Chờ duyệt → Cần chỉnh sửa → Chờ duyệt); `Từ chối` giữ như P1 · **[A]** sửa bảng khấu trừ inline khi Nháp/Cần chỉnh sửa (số đã duyệt bị đổi → phải duyệt lại – FR-FIN-07) · **[A]** Thêm ghi chú nội bộ · **[A]** Hiện trạng: tick 5 hạng mục + upload ảnh giả · P2 tắt → trang giữ layout P1 hiện tại |
| `#/finance/deposits` | *(không PNG – sidebar "Quản lý cọc")* | Sổ cọc: KPI (Cọc đang giữ, Phí giữ chỗ, Đã hoàn tháng này, Chờ hoàn); bảng cọc theo HĐ/hold (Khách, Phòng, Loại cọc/giữ chỗ, Số tiền, Ngày, Trạng thái, Hoàn cọc liên kết) | **[V]** + Xuất CSV (đọc từ `contracts.deposit`, `holds.fee`, `refunds`) |

### 4.4 Thông báo Zalo nâng cao (sửa `zalo.js`)

| Route | PNG | Nội dung | Action |
|---|---|---|---|
| `#/zalo/batches/:id` (nâng cấp) | 05/05 | Header Quay lại / Tải log (.xlsx) / **Retry bản ghi lỗi**; khối meta 8 ô (Mã đợt copy, Tên, Thời gian gửi + chip Đã hoàn thành, Người tạo, Template + Xem mẫu, Đối tượng nhận, Nội dung tin + Xem đầy đủ, Ghi chú); 4 KPI (Tổng người nhận, Đã gửi thành công %, Thất bại %, Đang chờ retry %); bảng người nhận (Phòng, Khách, SĐT, Nội dung rút gọn, **Trạng thái gửi** chip Thành công/Lỗi số Zalo/Từ chối mẫu/Đang chờ retry, **Nhà cung cấp phản hồi** `200 - OK`/`300 - Số không tồn tại`/`403 - Template rejected`/`408 - Timeout`, Thời gian, Retry icon, Xem) + tìm/lọc; panel Tiến trình gửi (timeline 4 mốc), Log phản hồi từ Zalo (5 dòng + Xem tất cả), Thống kê lỗi donut 4 loại | **[A]** map mã lỗi P1 `ZLM-1001/2003` → provider `300/403`, thêm `408 Timeout` (~1.6%) → trạng thái `retry_wait`; `Retry bản ghi lỗi` = `retryBatch` P1 mở rộng: 300 → không retry (lỗi vĩnh viễn, gợi ý fallback SMS nếu bật), 403/408 → retry, ghi `attempts[]`, không gửi lại tin đã giao (FR-ZAL-04) · **[A]** `Tải log` → CSV (tên `.xlsx` không dùng SheetJS offline – ghi chú) · **[A]** Xem tin → modal `U.phone` + provider log · **[V]** Xem mẫu / Xem đầy đủ · P2 tắt → layout P1 |
| `#/zalo/config` (bổ sung khi P2 bật) | – (§3.7 scope) | Card **Chính sách retry** (số lần tối đa, khoảng cách phút, nhóm lỗi được retry, fallback SMS bật/tắt) + tab **Quản lý mẫu** (danh sách template, trạng thái duyệt mẫu, biến) ; tile `Đến kỳ trả chủ nhà` lưu được; sự kiện mới `viewing_reminder`, `maintenance_due` | **[A]** lưu `meta.zaloPolicy`; fallback SMS: tin lỗi vĩnh viễn sau retry → tạo `zaloMessages` kênh `sms` (mô phỏng, tối đa 1/sự kiện – AC-ZAL-04-1) |

### 4.5 Bảo trì & bảo dưỡng (`maintenance.js`, sidebar VẬN HÀNH → "Bảo trì - Sửa chữa")

| Route | PNG | Nội dung | Action |
|---|---|---|---|
| `#/maintenance` | 06/01 | Header + Tạo sự cố / Tạo lịch bảo dưỡng; tabs `Sự cố (18)` · `Lịch bảo dưỡng (9)` · `Kiểm kê hàng tháng` **[P3]**; filter 5 + Làm mới; 4 KPI (Sự cố mở, Đang xử lý, Quá hạn, Lịch bảo dưỡng tháng này); bảng sự cố (Mã, Phòng/Tòa, Hạng mục, Ưu tiên chip 4 màu, Người phụ trách, Hạn xử lý đỏ khi quá, Trạng thái, Chi phí liên quan, Xem/⋮) + chọn nhiều; panel Lịch bảo dưỡng sắp tới (5, ngày lớn) + Tổng chi phí sửa chữa tháng (donut theo hạng mục) | **[A]** `Tạo sự cố` drawer (Tòa*, Phòng, Hạng mục* (Điện/Nước/Điều hòa/Thang máy/Cửa khóa/Nội thất/PCCC/Chiếu sáng/Khác), Ưu tiên*, Mô tả*, Hạn xử lý, Người phụ trách (user role kythuat/ops), Ảnh) → `incidents` `new` (FR-MNT-03: gắn tòa/phòng, ops chỉ tòa mình) · **[A]** ⋮: Xem / Phân công (→ `assigned`) / Bắt đầu xử lý / Hoàn tất (modal: chi phí, NCC, ghi chú, ảnh → `done`, chi phí > 0 → tạo `expenses` nhóm "Bảo trì" gắn tòa/phòng, liên kết `incidentId`) / Hủy · **[A]** bulk Phân công · tab Kiểm kê → coming-soon `assets` (P3) |
| `#/maintenance/incidents/:id` | *(bổ sung – pattern detail)* | Header mã + chip ưu tiên + trạng thái; KPI (Ưu tiên, Hạn, Phụ trách, Chi phí); card thông tin; timeline `incidentUpdates`; ảnh; chi phí liên kết | **[A]** Thêm cập nhật (ghi chú/ảnh) · các action như ⋮ |
| `#/maintenance/schedules` | 06/02 | Header + Tạo lịch bảo dưỡng; filter Tháng/Tòa/Loại thiết bị/Trạng thái/Phụ trách; 4 KPI (Sắp đến hạn 7 ngày, Đang thực hiện, Hoàn thành, Quá hạn); **Lịch tháng** (grid 7 cột, ô ngày chứa pill màu theo trạng thái, hôm nay highlight, nút ‹ › Hôm nay, toggle Tháng/Tuần/Ngày/Danh sách – Tuần/Ngày = lọc bảng); bảng lịch (Mã, Hạng mục, Tòa, Chu kỳ, Ngày dự kiến, NCC, Phụ trách, Trạng thái, Xem/⋮) + Xuất/Tùy chỉnh cột; panel Công việc sắp tới (7 ngày) + Thống kê loại thiết bị (donut 50 lịch) | **[A]** `Tạo lịch` drawer (Hạng mục/thiết bị*, Tòa*, Chu kỳ* hàng tháng/3/6 tháng/năm, Ngày dự kiến*, NCC (danh mục `vendors`), Phụ trách, Checklist dòng, Ghi chú) → `maintenanceSchedules`; nhắc trước 7 ngày (BR-16) → xuất hiện ở KPI "Sắp đến hạn", chuông topbar (`Q.todo` thêm `maintenanceDue`) · **[A]** click ô lịch/pill → popover chi tiết + nút Bắt đầu/Hoàn thành · **[A]** ⋮: Bắt đầu / Hoàn thành (tick checklist, ảnh, chi phí → expense; chu kỳ lặp → tự sinh lịch kế tiếp) / Đổi lịch (cập nhật nhắc) / Hủy (không sinh nhắc mới – AC-MNT-01-2) · Xuất CSV |
| `#/settings/catalog` tab **Nhà cung cấp** | – | CRUD `vendors` (Tên, Lĩnh vực, Liên hệ, Trạng thái) khi P2 bật | **[A]** |

### 4.6 Báo cáo nâng cao & quản lý kỳ (`reportHub.js`; sửa `reports.js`, `expenses.js`)

| Route | PNG | Nội dung | Action |
|---|---|---|---|
| `#/reports/hub` | 08/01 | Search + Tìm kiếm; chips danh mục (Tất cả 32 / Tài chính 8 / Vận hành 6 / Kinh doanh 6 / Công nợ 5 / Đầu tư 4 **P3**); 3 KPI (Yêu thích, Dùng gần đây, Tổng số); "Báo cáo theo danh mục": mỗi danh mục 4 card (icon màu, tên, mô tả, 2 tag, Xem báo cáo / Ghim) + Xem tất cả; panel Dùng gần đây (5, Xem/⋮), Yêu thích (8, ★), Mẹo sử dụng | **[A]** Ghim/bỏ ghim → `reportPrefs.favorites`; mở báo cáo → `recent[]` · **[V]** card → `#/reports/r/:key` hoặc `#/reports/cashflow`; card P3 (Đầu tư) → coming-soon `roi` · Catalog 32 báo cáo định nghĩa cứng `REPORTS[]` (key, tên, mô tả, danh mục, tag, icon, `impl: 'live'|'todo'`, OI liên quan) |
| `#/reports/cashflow` | 08/02 | Filter Kỳ/Tòa/Khu vực/Loại chi phí; 4 KPI (Tổng thu, Tổng chi, Dòng tiền thuần, Tỷ lệ thu đúng hạn N/M hóa đơn); **Biểu đồ dòng tiền theo ngày** (2 cột Thu/Chi + đường Dòng tiền thuần, tooltip ngày); Cơ cấu chi phí theo hạng mục (donut + legend %); bảng Chi tiết theo tòa (Thu, Chi, Thuần, Tỷ lệ thu, Trạng thái Tốt/Khá/Cần cải thiện) + Xuất Excel + tổng; **panel Quản lý kỳ**: kỳ hiện tại + chip Đang mở + "Còn N ngày", stepper 3 (Đang mở → Đối chiếu → Đã khóa), Danh sách công việc kỳ 4/6 (Tổng hợp doanh thu, Tổng hợp chi phí, Đối chiếu công nợ, Kiểm tra số dư ngân hàng, Rà soát chi phí bất thường, Trình duyệt khóa kỳ), nút **Khóa kỳ** + Xem lịch sử kỳ + Lưu ý | **[A]** tính từ `payments` (thu thật, tách cọc mới/phí giữ chỗ theo nhóm – FR-REP-02, BR-20) và `expenses` (chi; khấu hao **không** vào dòng tiền, có vào kết quả vận hành – BR-08) · **[A]** checklist: 3 mục đầu auto (mọi hóa đơn kỳ đã phát hành/không nháp; chi phí kỳ có chứng từ; công nợ đã đối chiếu = không còn dòng `check` ở bảng kê), 2 mục tick tay, mục 6 = bấm Khóa · **[A]** `Khóa kỳ` (Admin/Kế toán, checklist đủ) → `periods[period].status='locked'` + snapshot số liệu; sau khóa, `actions` P1 tạo/điều chỉnh hóa đơn, thu tiền, chi phí trong kỳ đó bị chặn qua hook `assertPeriodOpen(period)` (FR-FIN-08; P2 tắt hoặc không có kỳ khóa → không ảnh hưởng) · `Xem lịch sử kỳ` modal timeline · Xuất CSV · Báo cáo tạm tính có nhãn + ngày dữ liệu; kỳ đã khóa dùng snapshot (AC-REP-01-2) |
| `#/reports/r/:key` | – | Trang báo cáo chuẩn: tiêu đề + mô tả + filter Kỳ/Tòa + KPI + chart + bảng + Xuất CSV. **10 báo cáo `live`**: `occupancy` (Tỷ lệ lấp đầy – BR-09 ngày có khách/ngày kỳ, nhãn tạm tính, tòa không đủ điều kiện = N/A), `expense-by-building`, `operating-result` (Lợi nhuận vận hành – BR-10, loại trừ cọc/hoàn cọc/mua thiết bị, khấu hao theo tháng), `debt-by-building`, `refunds`, `room-status`, `maintenance`, `sales-performance`, `leads-funnel` (Khách hàng tiềm năng), `customer-segment` (FR-REP-05: theo `tenant.segment` khai báo, "Chưa xác định" nếu trống). 22 báo cáo còn lại `todo` → cùng trang với `U.empty` "Công thức chờ chốt – OI-xx" + mô tả + FR | **[A]** filter/Xuất · **[V]** |
| `#/reports` (P1) | – | Giữ nguyên; header thêm nút `Trung tâm báo cáo (P2)` (đã có `p2:true`) | |
| `#/expenses` (bổ sung) | – | Radio `Khấu hao` khi P2 bật: thêm `Số tháng khấu hao` → `depreciationLines` (đường thẳng, tooltip "3–5 năm là giả định – OI-11") ; chi tiết chi phí hiện lịch khấu hao | **[A]** |

### 4.7 Data Jobs (`jobs.js`, sidebar CẤU HÌNH → "Nhập dữ liệu & tác vụ")

| Route | PNG | Nội dung | Action |
|---|---|---|---|
| `#/settings/jobs` | 10/05 (danh sách) | Header + Tạo tác vụ import / Tải template; 4 KPI (Tổng, Đang chạy, Hoàn tất, Có lỗi); filter Tìm/Loại dữ liệu/Trạng thái/Người tạo/Thời gian; bảng (Mã tác vụ, Loại dữ liệu, Tệp nguồn, Người tạo, **Tiến độ** progress bar %, Thành công, Lỗi đỏ, Trạng thái chip, Cập nhật, Xem/⋮); panel Hướng dẫn nhập dữ liệu 6 bước + Lưu ý | **[A]** `Tạo tác vụ` → chọn loại → import wizard tương ứng (P1 wizard / bảng kê / số dư / lead) · `Tải template` menu theo loại · **[A]** ⋮: Xem / Thử lại phần lỗi / Tải dòng lỗi / Hủy (đang chạy) · Job `running` mô phỏng tiến độ bằng timer (pattern `resumeBatch` Zalo) – job mới >50 dòng chạy ~3s |
| `#/settings/jobs/:id` | 10/04 (chi tiết) | ← Quay lại; `Job IMP-…` + chip trạng thái dropdown; meta (loại, tòa, kỳ, người tạo, thời điểm); nút Tải dòng lỗi / Kiểm tra lại / **Thử lại phần đủ điều kiện**; 4 KPI (Tổng dòng, Thành công, Lỗi/Bỏ qua, Tiến độ %); card Thông tin đầu vào (file, size, loại, ngày, người, nguồn, ghi chú, Tải file); card Thiết lập mapping & xử lý (mẫu mapping, sheet, dòng bắt đầu, xử lý trùng, cập nhật nếu tồn tại; cột mapping + quy tắc validate ✓); bảng Kết quả từng dòng (Dữ liệu nguồn, Kết quả chip, Lý do lỗi, Liên kết bản ghi "Xem phòng", ⋯) + lọc; panel **Lịch sử lần thử** timeline (#2, #1 với số liệu + nhận xét) | **[A]** `Kiểm tra lại` → re-validate các dòng lỗi với dữ liệu hiện tại (ví dụ phòng ZZ.99 vừa được tạo) → cập nhật `check/ok` · **[A]** `Thử lại phần đủ điều kiện` → commit các dòng vừa hợp lệ (dùng lại commit của loại import tương ứng), thêm `attempts[]` mới, không tạo trùng (idempotent theo hash dòng) · `Tải dòng lỗi` CSV · ⋯ dòng: Xem bản ghi / Bỏ qua / Sửa dữ liệu nguồn inline rồi thử lại |
| Import wizard P1 (`settings.js`) | – | Sau `Xác nhận import` → `importJobs` ghi đủ `rows[]`, `mapping`, `attempts`; toast có link "Xem tác vụ" khi P2 bật | **[A]** |

### 4.8 Trang coming-soon (`misc.js`)
- Tách `TH.pages.comingSoon(root, key, opts)`; nội dung thêm dòng trạng thái: "Phase 2 đang **tắt** – bật trong Công cụ nâng cao" (nút bật nhanh nếu là admin) hoặc "Chưa có mockup UI cho mục này" (`scopeOnly`).

---

## 5. Component mới (`components.js`, `chart.js`, `components.css`)

| Component | Dùng ở | Mô tả |
|---|---|---|
| `U.kanban({cols[{key,label,count,color}], cards[{col,html,id}], onMove})` | CRM Lead | 6 cột cuộn ngang; HTML5 drag-drop (fallback nút ⋮ Đổi giai đoạn); mobile: cột xếp dọc |
| `U.calendar({month, events[{date,label,color,id}], onPick, onNav})` | Lịch bảo dưỡng | Grid 7×6, pill tối đa 2 + "+N", hôm nay highlight, keyboard ← → |
| `U.docPreview({pages[], highlights[]})` | OCR | "Trang PDF" giả bằng HTML, highlight `mark.ok/.check`, zoom bằng CSS scale |
| `U.matchChip(status)` / `U.progress(pct, tone)` | Bảng kê, Data Job | Chip kết quả ghép, progress bar inline trong cell |
| `U.countdown(untilISO)` | Giữ chỗ | Đếm ngược từ `F.today()`; tĩnh khi reduced-motion |
| `U.stepperStatus(steps[{label,date,by}], cur)` | Hoàn cọc, Quản lý kỳ | Bọc `U.wizard` với sub = ngày/người, nét đứt cho bước chưa tới |
| `TH.chart.barLine2({groups[{label,a,b,line}]})` | Dòng tiền theo ngày | 2 cột + đường, tooltip hover |
| `TH.chart.funnel(items)` | Lead theo giai đoạn | Bar ngang giảm dần + % |
| Icon mới (`icons.js`) | – | `kanban, flame, thermometer, phone-call, map-pin, timer, scan, git-merge, hard-hat, tool, calendar-days, lock, unlock, star, pin, play, refresh-cw, layers` |

Import parser/mapping/validate hiện nằm inline `settings.js:88–129` → tách thành `js/core/import.js` (`TH.imp`) để bảng kê, số dư, lead và Data Job retry dùng chung (không đổi hành vi import P1).

---

## 6. Panel Hướng dẫn thao tác – luồng Phase 2

- Flow/milestone có trường `phase:2` → `G.all()` và `G.render()` lọc theo `TH.phase.on`; tắt P2 → panel y hệt hiện tại (36 mốc). Bật → thêm 5 luồng F11–F15 (+ F08.5), tổng ~56 mốc khớp spec v1.5 §2 ("16 luồng/56 mốc"). Footer động: "16 điều kiện Go-live P1 · 10 luồng" / "+ 5 luồng Phase 2". Dòng luồng trong danh sách có badge `P2`.
- Tiền đề: F11–F15 độc lập với nhau nhưng cần S0; F11.5+ cần phòng Sẵn sàng; F13.3 cần hóa đơn đã phát hành (seed đủ). Sample data cho mọi mốc form (lead, lịch xem, giữ chỗ, sự cố, lịch bảo dưỡng) + 3 file mẫu mới.
- Progress lưu chung `store.state.guide`; key localStorage giữ `timehouse-guide-p1-v1` (không cần migrate).

| Flow (P2) | Mốc (route · vai trò) | Điều kiện hoàn thành |
|---|---|---|
| **F11 CRM: Lead → Chốt thuê** | F11.1 Thêm lead (`/crm/leads` · Sale) · F11.2 Ghi hoạt động gọi + Đặt lịch xem (`/crm/viewings/new`) · F11.3 Ghi kết quả xem → lead Cân nhắc · F11.4 Giữ chỗ phòng (`/crm/holds/new`) → phòng Giữ chỗ · F11.5 Chốt thuê → khách thuê + giao dịch → tạo & kích hoạt HĐ (`/crm/deals/new` → `/contracts/new`) · F11.6 Thu cọc → hoa hồng Đủ điều kiện → Kế toán ghi chi (`/crm/deals`) | lead `user` qua đủ trạng thái; viewing done; hold converted; deal active; commission paid |
| **F12 OCR hợp đồng** | F12.1 Dùng file mẫu, chạy trích xuất (`/contracts/ocr` · Vận hành) · F12.2 Sửa 5 trường "Cần kiểm tra" · F12.3 Tạo hợp đồng từ trích xuất | `ocrExtractions` `user` status created; contract có `source:'ocr'` |
| **F13 Import & đối soát** | F13.1 Import bảng kê file mẫu → mapping (`/finance/statement-import` · Kế toán) · F13.2 Review ghép, xử lý tay 1 dòng Cần kiểm tra, Duyệt ghi nhận · F13.3 Mở Data Job, Kiểm tra lại → Thử lại phần đủ điều kiện (`/settings/jobs/:id`) · F13.4 Chuyển số dư đầu kỳ file mẫu (`/finance/opening-balance`) | payments `user` từ statement; importJob có attempts ≥2; openingBalances `user` |
| **F14 Bảo trì** | F14.1 Tạo sự cố từ chi tiết phòng (`/rooms/:id` · Vận hành) · F14.2 Chuyển vai trò Kỹ thuật → Bắt đầu xử lý (`/maintenance`) · F14.3 Hoàn tất kèm chi phí → thấy ở Chi phí · F14.4 Tạo lịch bảo dưỡng trong 7 ngày → thấy trên lịch & chuông (`/maintenance/schedules`) | incident `user` done + expense liên kết; schedule `user` due_soon |
| **F15 Báo cáo, kỳ & Zalo nâng cao** | F15.1 Mở Trung tâm báo cáo, ghim 1 báo cáo (`/reports/hub` · Admin) · F15.2 Xem Báo cáo dòng tiền, hoàn tất checklist → Khóa kỳ 10/2024 (`/reports/cashflow` · Kế toán) · F15.3 Chi tiết lần gửi `ZL-2024-104` → Retry bản ghi lỗi (`/zalo/batches/:id` · Admin) | reportPrefs có favorite; periods `2024-10` locked; message 408 có attempts ≥2 |
| **F08.5** (gắn vào F08 P1, `phase:2`) | Kế toán `Yêu cầu chỉnh sửa` → Vận hành sửa khấu trừ → gửi duyệt lại → Duyệt | refund có history `needs_edit` rồi `approved` |

`runAllP2()` (Công cụ nâng cao) chạy kỹ thuật F11→F15 bằng actions.

---

## 7. Thứ tự thực hiện (milestone)

| # | Milestone | Kết quả kiểm chứng |
|---|---|---|
| M0 | **Cơ chế phase**: `phase.js`, router guard `meta.phase`, `layout` (menu `phase`, badge on/off, footer, công tắc trong Công cụ nâng cao, role menu), `components` (p2→phase, `pageHead.phase`, CSS badge), `auth` (sale/kythuat, PERMS), `store` SCHEMA 3 + collections, `misc.comingSoon`, `app.js` phase event, README | Tắt P2: mọi màn/nút y hệt hiện tại (chụp so sánh 27 route). Bật P2: mục sidebar sáng + badge, route P2 chưa có trang hiện coming-soon "đang xây"; đăng nhập `sale/kythuat` được |
| M1 | Seed P2 + selectors/status maps + actions CRM (lead/activity/viewing/hold mở rộng/deal/commission + guard) + `import.js` tách parser | Console: `runAllP2()` phần F11 chạy xong; reset về seed ra đúng số PNG |
| M2 | Component mới: kanban, calendar, docPreview, countdown, stepperStatus, barLine2, funnel, icons | Trang kit ẩn `#/__kit` hiển thị đủ |
| M3 | **CRM 7 màn** (`crm.js`) + wire `settings` Nguồn khách, `contracts/new?deal=` | Chạy F11 tay; đối chiếu 7 PNG nhóm 04 |
| M4 | **OCR** (`ocr.js`) + `contracts/new?ocr=`; **Bảo trì** (`maintenance.js`, 2 PNG + detail + drawers, vendors, bell) + wire `rooms.js` | Chạy F12, F14; đối chiếu 3 PNG |
| M5 | **Tài chính**: bảng kê, số dư đầu kỳ, nâng cấp `refunds/:id` (needs_edit, hiện trạng, ghi chú), sổ cọc; **Data Jobs** (2 màn + retry + timer) + wizard P1 ghi rows | Chạy F13, F08.5; đối chiếu 5 PNG (03/06, 03/09, 03/11, 10/04, 10/05) |
| M6 | **Zalo**: chi tiết lần gửi nâng cấp (provider code, retry, log, donut), chính sách retry/fallback SMS, sự kiện mới, `landlord_due` | Chạy F15.3; đối chiếu PNG 05/05 |
| M7 | **Báo cáo**: hub 32 card, dòng tiền & quản lý kỳ + `assertPeriodOpen`, 10 báo cáo live + placeholder, khấu hao chi phí, tab Hiệu suất tòa, bộ lọc nâng cao/lưu bộ lọc | Chạy F15.1–2; đối chiếu 2 PNG nhóm 08; khóa kỳ chặn ghi nhận thu trong kỳ khóa |
| M8 | Guide F11–F15 + F08.5 + sample + `runAllP2`; responsive 1440/375 cho kanban/calendar/wizard; a11y; README kịch bản P2 | Nghiệm thu §8 |
| M9 | Copy plan → `Timehouse-Mockup-Plan-Phase2-v1.0.md` cạnh plan P1; `index.html` title "(Mockup Phase 1–2)"; đóng gói | Mở file:// và Netlify chạy |

---

## 8. Verification / Nghiệm thu

1. **Hồi quy Phase 1 khi P2 tắt** (mặc định): xóa localStorage → mở `index.html` → chỉ thấy P1; chạy `runAll()` P1 vẫn ra 16 điều kiện; sidebar/nút P2 mờ & disabled y như trước; chụp 27 route so với bản trước (Playwright MCP 1440×1000) không lệch.
2. **Công tắc phase**: bật P2 trong Công cụ nâng cao → sidebar sáng + badge P2, footer "P1 + P2", user menu có Sale/Kỹ thuật; tắt lại khi đang ở `#/crm/leads` → trang thành coming-soon, URL giữ; đang là `sale` → về admin có toast; `Đặt lại dữ liệu demo`/`Xóa trắng`/`Nhập state JSON` **không** đổi trạng thái phase; reload giữ phase.
3. **Nhận diện P2**: mọi route `phase:2` có chip P2 ở tiêu đề; badge sidebar; luồng F11–F15 có badge trong panel; README liệt kê 18 màn + route.
4. **Chạy tay 5 luồng P2** theo panel với 5 vai trò: lead đi hết Kanban → phòng Giữ chỗ → HĐ Hiệu lực → hoa hồng Đã chi (một lần, idempotent); OCR tạo HĐ đúng 5 trường đã sửa; bảng kê tạo payments đúng số dòng matched, dòng trùng không tạo; Data Job retry không tạo trùng; sự cố hoàn tất sinh chi phí; lịch bảo dưỡng xuất hiện trên lịch + chuông; khóa kỳ chặn `recordPayment`/`issueInvoice`/`saveExpense` kỳ 10/2024 (console gọi trực tiếp bị từ chối); Zalo retry chỉ tin 403/408, tin 300 không retry.
5. **Bất biến** (console `__timehouseDemo.state()`): phòng chỉ 1 hold active; hold hết hạn → phòng Sẵn sàng; deal ↔ contract 1-1; commission ≤ 1 khoản chi; hóa đơn `opening` không trùng HĐ; không phòng Sẵn sàng khi HĐ hiệu lực (giữ P1).
6. **Guide không tạo record**: thao tác panel P2 (Đi tới/Chuyển vai trò/Xem/Điền/Dùng file mẫu) → chỉ `guide` đổi.
7. **Responsive & a11y**: 1440 và 375 không overflow ngang ở Kanban (cột xếp dọc), Lịch tháng (cuộn ngang trong `overflow-x:auto`), wizard 5 bước; countdown/timer tắt animation với reduced-motion; console sạch mọi route ở cả 2 trạng thái phase.
8. **Netlify/file://** chạy giống nhau; không phụ thuộc CDN mới (chỉ CSV, không SheetJS/PDF.js).

---

## 9. Ghi chú, giả định & rủi ro

- **Quy ước chuẩn hóa** (ghi README): mã hoàn cọc dùng `RC…` của P1 (PNG P2 ghi `HC-001`); mã đợt Zalo `ZL-202410-xxx` (PNG `ZL-2024-104` → seed thêm 1 đợt hero với mã `ZL-202410-104`); mã lead `LD-2024-081`; chi tiết Data Job PNG tên file bị đảo.
- **OI còn mở dùng mặc định + tooltip ⓘ**: hoa hồng 10% tháng đầu, chi một lần (OI-14/BR-13); giữ chỗ tối đa 14 ngày, phí trừ vào cọc (OI-09); khấu hao đường thẳng số tháng nhập tay (OI-11); hiệu suất = ngày có khách/ngày kỳ, tòa bảo trì N/A (OI-12); lợi nhuận vận hành loại cọc/hoàn cọc/mua thiết bị (OI-10/13); fallback SMS mô phỏng (OI-21); trường `Kiểm kê` là P3.
- **Số dư đầu kỳ** tạo hóa đơn `kind:'opening'` để tái dùng toàn bộ công nợ/nhắc nợ P1 – là quyết định kỹ thuật của mockup, ghi rõ để BA xác nhận.
- `.xlsx` (Tải log, Tải template) xuất CSV (offline, không SheetJS) – nhãn nút giữ như PNG kèm tooltip.
- Rủi ro: code hiện tại dòng rất dài (mỗi hàm 1 dòng) → sửa `zalo.js`/`refunds.js`/`settings.js` cần cẩn thận tránh phá hành vi P1; bù lại bằng chụp hồi quy 27 route ở M0 và sau mỗi milestone.
- Không dùng thư viện ngoài (kanban/calendar tự viết) để chạy file:// và giữ style pixel với PNG.
