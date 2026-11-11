# Plan: Mockup tương tác TimoHouse – Phase 3 Enterprise & Investment (+ mở công tắc Phase 3)

> Đầu vào: `Phase_3_Enterprise_Investment/` (4 PNG: 06/03 Kiểm kê tài sản, 07/01 Danh sách NV, 07/02 Chi tiết NV, 09/01 Cổ đông–vốn góp–phân phối), `docs/Timehouse-SRS-v1.2.docx` (FR-BLD-04/07, FR-MNT-02/04, FR-HR-01/02/03, FR-SHR-01..04, UC-08/09, BR-08/15/16, OI-11/15/16/17/18), `docs/Timehouse-UI-Mockup-Spec-v1.5.md`, `00_SCOPE_3_PHASE.md` §4, mockup P1+P2 đang chạy trong `mockup/`.
> Mẫu cấu trúc: `Timehouse-Mockup-Plan-Phase2-v1.0.md` (plan P3 sẽ được copy vào repo cùng format ở milestone cuối).
> Ngày lập: 15/09/2026 · Trạng thái: **Đã thực hiện 15/09/2026** (M0–M8) – xem `mockup/README.md` mục *Phase 3* và §10 bên dưới.

## 1. Context

- Mockup hiện có P1 (mặc định) + P2 (bật bằng công tắc trong **Công cụ nâng cao**). Cơ chế phase đã hoàn chỉnh: `mockup/js/core/phase.js`, router guard `meta.phase` (`router.js:34-36`), sidebar `L.MENU` với `phase:` (`layout.js:5-51`), trang coming-soon (`misc.js`), `store.emit('phase')` → `app.js:9`.
- Phase 3 **đã có chỗ đứng sẵn nhưng bị khóa**: `phase.js:11` `P.available = n => n !== 3`; checkbox P3 disabled + toast "chưa có mockup" (`layout.js:142,158`); 7 mục sidebar P3 chưa có `href` (`layout.js:25,40,41`); mô tả coming-soon đã có trong `L.P2_INFO` (`layout.js:84,95-100`); các điểm móc P3 trong trang P1/P2: `buildings.js:51` tab Tài sản, `maintenance.js:42,50` tab Kiểm kê hàng tháng, `rooms.js:71,84`, `reportHub.js:18,88` 4 báo cáo `impl:'p3'` (`roi`, `shareholder`, `asset-value`, `project-progress`).
- Yêu cầu: dựng mockup Phase 3 và **mở công tắc Phase 3** để người xem tự chọn có hiển thị P3 hay không (cùng chỗ với công tắc P2).
- Quyết định đã chốt với người dùng (15/09/2026):
  1. **Phạm vi**: 4 màn PNG + **tự thiết kế màn cho mọi mục sidebar P3** không có PNG (Chấm công, Lương thưởng, Dự án, Ngân hàng, Tài sản – sổ tài sản) + 2 tab trong màn Cổ đông (Đóng góp theo kỳ, Phân phối lợi nhuận). Màn tự thiết kế dùng pattern chuẩn của mockup (pageHead → filterbar → KPI → bảng → panel phải), có chip "Tự thiết kế – không có PNG" trong `pageHead.sub`.
  2. **Vai trò mới khi bật P3**: `hr` (Nhân sự) và `codong` (Cổ đông – read-only phạm vi tòa mình góp, FR-SHR-03/04). Tắt P3 khi đang là 2 vai trò này → về Admin (như P2).
  3. **Công tắc P3 độc lập** với P2. Link từ P3 sang màn P2 khi P2 tắt → coming-soon như bình thường.
- Quy ước kế thừa: ngày demo 2026 (`F.DEMO_TODAY` 28/10/2026, PNG ghi 2024 → đổi 2026, mã `BB-KK-10/2024` → `BB-KK-2026-10`); mã NV chuẩn hóa `NV001` (PNG chi tiết ghi `NV-2024-012` → dùng `NV002`); không thư viện ngoài; mọi file JS mới phải thêm `<script>` vào `mockup/index.html` đúng thứ tự (core → ui → pages → guide → app).

---

## 2. Cơ chế Phase 3 (M0 – làm trước mọi màn)

| File | Thay đổi |
|---|---|
| `mockup/js/core/phase.js:11` | `P.available = () => true` (giữ hàm để tương thích `misc.js`, `app.js:19`). Bỏ chú thích "P3 chưa có mockup". |
| `mockup/js/ui/layout.js:142` | `'phase-3': el => L.togglePhase(3, el.checked)`. |
| `layout.js:158` | Bỏ nhánh `(chưa có mockup)`; tooltip P3 = tên phase. |
| `layout.js:182-190` `togglePhase` | Tổng quát hóa: `PHASE_ROLES = { 2: ['sale','kythuat'], 3: ['hr','codong'] }`; tắt phase n khi đang là role của n → về Admin; toast bật P3: "Sổ tài sản & kiểm kê / Nhân sự / Chấm công / Lương / Dự án / Cổ đông / Ngân hàng đã mở · thêm vai trò Nhân sự, Cổ đông". |
| `layout.js:25,40,41` `L.MENU` | Gắn href + permission: `bank → #/finance/bank (bank.view)`, `hr → #/hr (hr.view)`, `timesheet → #/hr/timesheet (timesheet.view)`, `payroll → #/hr/payroll (payroll.view)`, `projects → #/investment/projects (projects.view)`, `assets → #/assets (assets.view)`, `roi → #/investment/shareholders (shareholders.view)` (PNG 09/01 active tại "Hiệu quả đầu tư"). |
| `layout.js:116` user menu | Thêm `hr`, `codong` khi `TH.phase.on(3)`. |
| `layout.js:125,140,159` | Nút `adv-runall-p3` (ẩn khi P3 tắt) → `TH.guide.runAllP3()`. Footer `Phiên bản 3.0.0 · Phạm vi: …`. |
| `layout.js:131` chuông | Khi P3 bật: "Tài sản cần xử lý sau kiểm kê (N)", "Đợt góp vốn đến hạn (N)", "NV sắp hết thử việc (N)" (`Q.todo` mở rộng trong `selectors-p3.js`). |
| `mockup/js/core/auth.js` | `roleAllowed`: `P1_ROLES || (PHASE_ROLES[2] && on(2)) || (PHASE_ROLES[3] && on(3))`; thông báo lỗi `auth.js:197,207` theo phase của role. `ROLE_LABEL` + `hr: 'Nhân sự', codong: 'Cổ đông'`; demo map `auth.js:211` + `hr: 'nhansu', codong: 'codong'`. PERMS P3 (A admin, K kế toán, O vận hành, T kỹ thuật, H hr, C cổ đông): `assets.view [A,K,O,T]`, `assets.manage [A,O]`, `inventory.view [A,K,O,T]`, `inventory.manage [A,K]` (tạo đợt/hoàn tất/xuất biên bản – FR-MNT-02 v1.1), `inventory.record [A,K,O]`, `hr.view [A,H]`, `hr.manage [A,H]`, `timesheet.view [A,H]`, `timesheet.manage [A,H]`, `payroll.view [A,H,K]`, `payroll.manage [A,H]`, `payroll.approve [A,K]`, `projects.view [A,K,C]`, `projects.manage [A]`, `shareholders.view [A,K,C]`, `shareholders.manage [A,K]`, `contributions.record [A,K]`, `distributions.manage [A,K]`, `distributions.approve [A]`, `roi.view [A,K,C]`, `bank.view [A,K]`, `bank.manage [A,K]`. `P3_READ = { hr: ['dashboard.view','buildings.view'], codong: ['dashboard.view'] }`. **Scope cổ đông**: user `codong` có `buildingIds` = tòa của các dự án đã góp → tái dùng `TH.auth.scope` hiện có; `COLLECTION_TYPE` thêm `assets/inventories (buildingId)`, `projects (buildingId)`, `capitalCommitments/contributions/distributions (projectId → project.buildingId)`. `enforceUI`: `codong` ẩn mọi nút ghi trên `/investment/*`; `hr` không thấy `/finance`, `/investment`. |
| `mockup/js/core/actions.js:353` | Guard tạo tài khoản: role thuộc phase n cần `on(n)`. |
| `mockup/js/pages/misc.js` | Text "bộ PNG Phase 2 không có màn" → "bộ PNG Phase N"; giữ nhánh `!avail` (không còn dùng). |
| `mockup/js/core/store.js:5-7` | Thêm COLLECTIONS P3 (§3.1); trong `migrate` sau dòng 23: `if (TH.seed.phase3 && !st.meta.p3Seeded && st.buildings.length) TH.seed.phase3(st)`. **Không đổi SCHEMA/KEY** (backfill mảng rỗng + seed idempotent đủ; giữ dữ liệu người dùng). |
| `mockup/js/core/seed.js:14,320` | `catalogOnly` gọi `seed.catalogP3`; cuối `seed.run` gọi `seed.phase3(st)`. |
| `mockup/js/app.js:18-19` | `runAllP3`, `phases()` giữ nguyên (available(3) = true). |
| `mockup/index.html`, `package.json` | Script mới (§7); title "(Mockup Phase 1–3)"; version 3.0.0. |
| `mockup/js/pages/login.js` | Chip tài khoản demo thêm `nhansu`, `codong` khi P3 bật (tìm chỗ render chip sale/kythuat theo `TH.phase.on(2)` rồi làm tương tự). |

Reuse: `U.phaseOf/phaseOn/phaseTag`, `U.pageHead({ phase: 3 })`, `U.btn({ phase: 3 })`, `U.tabs(..., phase)` (`components.js:7-28,102,165`) – **không cần sửa kit** cho cờ phase.

---

## 3. Dữ liệu

### 3.1 Collection mới (`store.js`)
`assets, inventories, inventoryLines, employees, buildingAssignments, timesheets, payrolls, projects, shareholders, capitalCommitments, contributions, distributions, bankAccounts, bankTransactions`.

| Collection | Trường chính | Ghi chú SRS |
|---|---|---|
| `assets` | `code TS-0001, name, category (dienlanh/pccc/thangmay/chieusang/anninh/noithat/dien/mayphat/khac), buildingId, roomId?, area (text: 'A12.03' / 'Sảnh tầng 1'), qty, cost, startDate, depMonths, ownership (company/landlord), condition (good/minor/replace/broken/lost), status (active/disposed), qr, roomAssetId?, history[]` | FR-BLD-04 (nguyên giá, thời điểm dùng, khấu hao dự kiến); `roomAssetId` liên kết `roomAssets` P1 – đổi `condition` thì sync ngược (`Tốt/Cần bảo dưỡng/Hỏng`) |
| `inventories` | `code BB-KK-2026-10, period, buildingIds[], status (in_progress/done), startDate, finishedAt, createdBy, summary{total,checked,needsAction,broken}` | FR-MNT-02: đợt hàng tháng; Admin/Kế toán tạo & hoàn tất; kết quả **không** tự tạo chi phí/giảm tài sản |
| `inventoryLines` | `inventoryId, assetId, prevCondition, condition, checkedBy, checkedAt, photo (bool), note, status (pending/done/needs_action)` | AC-FR-MNT-02-2: lưu người, thời điểm, bằng chứng |
| `employees` | `code NV001, name, dept (kinhdoanh/vanhanh/kythuat/thitruong/tckt/cskh/hanhchinh), title, phone, email, address, workType, managerId (employee), userId?, startDate, probationEnd?, status (working/probation/leave/resigned), area, salaryBase, titleAllowance, documents[], history[]` | FR-HR-01/03 (trạng thái SRS: Đang làm/Thử việc/Nghỉ việc; PNG có "Tạm nghỉ" → giữ `leave`, tooltip "ngoài SRS"); nghỉ việc không xóa tham chiếu |
| `buildingAssignments` | `employeeId, buildingId, role (lead/ops/cleaning/tech), primary, start, end?, status` | FR-BLD-07 – giữ lịch sử |
| `timesheets` | `employeeId, period, days{ 'YYYY-MM-DD': 'P'\|'A'\|'L'\|'H'\|'O' }, workDays, offDays, late, otHours, status (draft/confirmed)` | Ngoài scope SRS §2.2 – chip "mô phỏng" |
| `payrolls` | `period, status (draft/review/approved/paid), lines[{employeeId, base, titleAllowance, buildingAllowance, buildingCount, commission, deductions, total}], approvedBy, paidAt, expenseIds[]` | FR-HR-02/BR-14: lương cứng + phụ cấp chức danh + phụ cấp số nhà (vận hành) + hoa hồng Sale (từ `commissions` đã chi trong kỳ, không tính trùng); công thức TBD OI-15 → tooltip ⓘ |
| `projects` | `code DA-001, name 'Dự án Sunrise', buildingId, capital (vốn điều lệ), status (raising/operating/closed), startDate, expectedRoi, note` | 1 dự án = 1 tòa (PNG) |
| `shareholders` | `code CD-001, name, email, phone, idNumber, userId?, status` | |
| `capitalCommitments` | `shareholderId, projectId, ratio (% nhập tay), committed, effectiveDate` | FR-SHR-02 AC-1: tỷ lệ nhập tay, không tự tính từ tiền; tổng ratio/dự án ≤ 100% |
| `contributions` | `code GV-2026-10-001, shareholderId, projectId, round, amount, dueDate, paidAmount, paidDate?, ref?, status (scheduled/due/overdue/partial/paid), source (auto/manual)` | FR-SHR-01 AC-2 / BR-15: tạo đợt theo lịch trả chủ nhà → sinh nghĩa vụ từng cổ đông theo tỷ lệ |
| `distributions` | `code PP-2026-Q3, label 'Q3/2026', projectId?, profit, status (planned/processing/approved/paid), lines[{shareholderId, ratio, amount, rounding}], approvedBy, paidAt` | FR-SHR-02 AC-2: tổng dòng + làm tròn = tổng duyệt; **không** đồng nghĩa đã chuyển tiền; chặn chia cho 0 |
| `bankAccounts` / `bankTransactions` | tài khoản: `bank, number, name, balance`; giao dịch: `accountId, date, amount, dir (in/out), desc, ref, matchStatus (matched/check/unmatched/ignored), paymentId?, invoiceId?` | Ngoài scope SRS §2.2 – mô phỏng theo scope file §4.5; đối soát tái dùng `X.matchStatement` (P2) |

### 3.2 Mã & trạng thái (`selectors-p3.js` → `Q.L`)
| Đối tượng | Mã | Trạng thái (chip) |
|---|---|---|
| Tài sản | `TS-0001` | tình trạng `good` Bình thường (xanh) / `minor` Hư hỏng nhẹ (vàng) / `replace` Cần thay thế (đỏ) / `broken` Hỏng / `lost` Mất; `disposed` Đã thanh lý |
| Đợt kiểm kê | `BB-KK-2026-10` | `in_progress` Đang kiểm kê → `done` Đã hoàn thành |
| Dòng kiểm kê | – | `pending` Chưa kiểm → `done` Hoàn thành / `needs_action` Cần xử lý (condition ≠ good) |
| Nhân viên | `NV001` | `probation` Thử việc / `working` Đang làm việc / `leave` Tạm nghỉ / `resigned` Nghỉ việc |
| Chấm công | `period` | `draft` → `confirmed`; ký hiệu ngày P/A/L/H/O |
| Bảng lương | `BL-2026-10` | `draft` → `review` → `approved` → `paid` |
| Dự án | `DA-001` | `raising` Gọi vốn / `operating` Đang vận hành / `closed` |
| Cổ đông (theo dự án) | `CD-001` | suy từ contributions: `paid` Đã góp đủ / `missing` Còn thiếu / `none` Chưa góp |
| Đợt góp vốn | `GV-2026-10-001` | `scheduled` Còn N ngày / `due` Đến hạn (hôm nay) / `overdue` Quá hạn / `partial` / `paid` Đã góp |
| Phân phối | `PP-2026-Q3` | `planned` Chờ phân phối → `processing` Đang xử lý → `approved` Đã duyệt → `paid` Đã chi |
| Giao dịch NH | – | `matched` Đã khớp / `check` Cần kiểm tra / `unmatched` Chưa khớp / `ignored` Bỏ qua |

### 3.3 Seed P3 (`mockup/js/core/seed-p3.js`, pattern `seed-p2.js`: `mk`, rng riêng, `meta.p3Seeded`)
- **Tài khoản**: `nhansu` (Ngô Thị Quỳnh – Hành chính, role `hr`), `codong` (Trần Minh Đức – Cổ đông #1, role `codong`, `buildingIds` = tòa của dự án đã góp). `catalogP3`: nhóm chi phí `Lương`, `Mua sắm thiết bị` nếu chưa có trong `expenseGroups` (FR-FIN-12); danh mục phòng ban/chức danh/loại tài sản là hằng trong `selectors-p3.js` (không CRUD).
- **Tài sản 248 / 5 tòa**: 10 hero đúng PNG (TS-0001 Điều hòa Daikin 1.5HP Sunrise A12.03 … TS-0010 Máy phát điện Garden Tầng hầm); phần còn lại **promote từ `roomAssets` P1** (mỗi roomAsset → 1 asset có `roomAssetId`, condition map) + tài sản khu vực chung sinh thêm cho đủ 248. Nguyên giá/khấu hao có giá trị mẫu.
- **Kiểm kê**: `BB-KK-2026-09` `done` (100%); `BB-KK-2026-10` `in_progress` 198/248 checked, 32 needs_action, 18 broken/replace, người kiểm kê = tên trong PNG, ngày 15–20/10/2026; panel "Biên bản gần nhất" hiển thị 10/2026 kèm chip theo trạng thái thật.
- **Nhân sự 28**: 10 hero đúng PNG (NV001 Trần Minh Đức Vận hành/Quản lý khu vực … NV010 Ngô Thị Quỳnh Hành chính); phân bố phòng ban 8/6/5/3/3/2/1; 24 working, 3 leave, 1 probation…; link `userId` khi trùng tên user hiện có (NV002 Hương ↔ `sale`, NV001 Đức ↔ `kythuat`); 5 NV sắp hết thử việc = `today+5/+8/+10/+13/+16`; `buildingAssignments` cho NV002: Sunrise (Chính), Moonlight, Riverside (Phụ) + 6 quản lý khu vực; tài liệu 5 file như PNG; KPI cá nhân **tính thật** từ `leads/deals/contracts` theo `userId` (seed P2 đã có) – số PNG (12/8/320tr/80%) chỉ khớp khi seed đủ, ghi chú.
- **Chấm công 10/2026** cho 28 NV (ngẫu nhiên có kiểm soát, `status draft`), 09/2026 `confirmed`. **Bảng lương** `BL-2026-09` `paid` (đã sinh expenses nhóm Lương theo tòa), `BL-2026-10` `draft`.
- **Dự án**: 5 (DA-001 Sunrise … Garden) = 5 tòa không stub; tổng vốn điều lệ 12 tỷ. **Cổ đông 8** đúng PNG (Trần Minh Đức 25% 3 tỷ … Ngô Văn An 5% 600tr); còn thiếu Phạm Thu Trang 400tr, Vũ Thị Mai 140tr (tổng 540tr); `capitalCommitments` phân theo dự án sao cho tổng theo cổ đông khớp PNG.
- **Đợt góp vốn**: 4 sắp tới đúng PNG (25/10 Sunrise lần 2 Trang 400tr `due` … 12/11 Central), lịch sử đợt 1 `paid`.
- **Phân phối**: `PP-2026-Q2` `paid` 800tr (KPI "Đã phân phối"), `PP-2026-Q3` `processing` 1.248 tỷ (lines = ratio × profit: 312tr/249,6tr/…), `Q4/2026`, `Q1/2027`, `Q2/2027` `planned` dự kiến 1,35/1,42/1,5 tỷ.
- **Ngân hàng**: 3 tài khoản (VCB/TCB/ACB), ~40 giao dịch tháng 10 (in = payments đã có `refCode` → matched; 6 unmatched; 3 check; out = chi phí), file mẫu `assets/samples/mau-sao-ke-ngan-hang.csv` (20 dòng, có trùng/không khớp).

### 3.4 Actions (`mockup/js/core/actions-p3.js`, pattern `actions-p2.js`: `need3()`, `idem()`, `done()`, `assertPeriodOpen`)
- Tài sản: `saveAsset` (tuỳ chọn "Ghi nhận chi phí mua sắm" → `expenses` nhóm Mua sắm thiết bị + `depreciationLines` qua cơ chế P2 – BR-08, không ghi 2 lần), `setAssetCondition` (sync `roomAssets`), `disposeAsset`, `printAssetQr` (modal QR giả).
- Kiểm kê: `startInventory({period, buildingIds})` (1 đợt/kỳ/tòa – idempotent, tạo `inventoryLines` pending cho asset active), `recordInventoryLine(lineId, {condition, note, photo})` (`inventory.record`; cập nhật asset.condition; `needs_action` nếu ≠ good), `finishInventory(id)` (`inventory.manage`; summary; **không** tạo expense/giảm tài sản – AC-2), `exportInventory(id)` CSV "biên bản", `createIncidentFromLine(lineId)` → `X.saveIncident` P2 (nếu P2 bật; tắt → toast coming-soon).
- Nhân sự: `saveEmployee` (mã tự sinh `NV###`, trùng SĐT cảnh báo), `setEmployeeStatus` (resigned giữ tham chiếu – AC-FR-HR-01-1; `userId` → user `status: 'inactive'`), `assignBuilding({employeeId, buildingId, role, primary})` / `endAssignment` (lịch sử), `addEmployeeDoc`, `updateEmployeeProfile`.
- Chấm công: `markAttendance(employeeId, date, code)`, `fillTimesheet(period)` (mặc định P ngày làm), `confirmTimesheet(period)`.
- Lương: `buildPayroll(period)` (tính lines theo BR-14 từ employees + assignments + commissions paid trong kỳ + timesheet workDays), `submitPayroll` → `review`, `approvePayroll` (`payroll.approve`), `payPayroll` (→ `expenses` nhóm Lương theo tòa phân bổ đều số tòa phụ trách; `assertPeriodOpen`; idempotent), `exportPayroll` CSV.
- Đầu tư: `saveProject`, `saveShareholder`, `saveCommitment` (validate tổng ratio ≤ 100%/dự án, ratio nhập tay), `createContributionRound({projectId, round, dueDate, total})` → 1 contribution/cổ đông theo ratio (AC-FR-SHR-01-2), `recordContribution(id, {amount, date, ref})` (partial/paid), `createDistribution({label, projectId?, profit})` (chặn profit ≤ 0 / tổng vốn 0; lines = round(ratio×profit), dòng chênh làm tròn dồn vào cổ đông lớn nhất – AC-FR-SHR-02-2), `approveDistribution`, `payDistribution` (chỉ đánh dấu; không tạo expense; ghi audit).
- Ngân hàng: `importBankStatement(rows)` (dùng `TH.imp.parse` + `matchStatement`), `reconcileBank()` (chạy 4 quy tắc P2 cho dòng `unmatched`), `matchBankTx(txId, paymentId|invoiceId)`, `ignoreBankTx`, `createPaymentQr(invoiceId)` (modal QR mô phỏng, không tạo payment).

### 3.5 Selectors (`mockup/js/core/selectors-p3.js`)
`Q.L.*` §3.2; `Q.assetStats(f)`, `Q.inventoryOf(period, buildingId)`, `Q.inventoryStats(inv)`, `Q.employeeStats()`, `Q.deptDistribution()`, `Q.probationEnding(days)`, `Q.employeeKpi(emp, period)` (lead xử lý/HĐ thành công/doanh thu/tỷ lệ chuyển đổi từ `leads`/`deals`/`contracts` theo `userId`), `Q.employeeActivities(emp)` (từ `auditLog` theo userId), `Q.employeeWeek(emp)` (lịch tuần từ `viewings`/`maintenanceSchedules`/`incidents` gán cho user), `Q.shareholderRows(projectId?)` (ratio, committed, paid, missing, thisPeriodShare, status), `Q.capitalStructure()`, `Q.contributionStatus(c)` (theo `F.today()`), `Q.upcomingContributions(n)`, `Q.upcomingDistributions(n)`, `Q.buildingRoi(buildingId, period)` (vốn = project.capital + Σ asset.cost; doanh thu = payments; chi = expenses + khấu hao; LN; ROI tạm tính – tooltip OI-12/17), `Q.payrollPreview(period)`, `Q.bankStats()`, `Q.todo` mở rộng (`inventoryPending`, `contributionsDue`, `probationEnding`) chỉ khi `TH.phase.on(3)`.

---

## 4. Danh mục màn hình & action Phase 3

Ký hiệu: **[A]** ghi state · **[V]** hiển thị/điều hướng · **[TK]** tự thiết kế (không PNG). Mọi route meta `{ phase: 3, scopeKey, permission, menu }`, `U.pageHead({ phase: 3 })`.

### 4.1 Tài sản & kiểm kê (`mockup/js/pages/assets.js`, menu `assets`)

| Route | PNG | Nội dung phải khớp | Action |
|---|---|---|---|
| `#/assets/inventory` | 06/03 | Breadcrumb Vận hành / Bảo trì - Sửa chữa / Kiểm kê tài sản; header `+ Bắt đầu kiểm kê`, `Xuất biên bản`; filter Tháng kiểm kê (period) / Tòa / Khu vực / Loại tài sản / Trạng thái kiểm kê + Làm mới; 4 KPI (Tổng tài sản 248 "Tại 5 tòa nhà", Đã kiểm kê 198 "80%", Cần xử lý 32 "13%", Hư hỏng 18 "7%"); bảng "Danh sách tài sản (248)" 12 cột: ☐, Mã (link), Tên, Tòa, Khu vực, Tình trạng trước (chip), Tình trạng hiện tại (chip), Người kiểm kê (avatar+tên), Ngày kiểm kê, Ảnh (thumb), Trạng thái (chip), `👁 Xem` + ⋮; phân trang 10/trang; panel phải: **Biên bản kiểm kê gần nhất** (card mã/thời gian/4 số/người lập/ngày lập + `Xem biên bản`), **Hướng dẫn kiểm kê** 4 bước, **Mẹo sử dụng** (QR mobile) | **[A]** `Bắt đầu kiểm kê` modal (Kỳ*, Tòa multi, ghi chú) → `startInventory` (Admin/Kế toán; đã có đợt kỳ đó → mở đợt) · **[A]** ⋮ dòng: `Cập nhật tình trạng` modal (Tình trạng*, Ảnh minh chứng dropzone giả, Ghi chú) → `recordInventoryLine`; `Tạo sự cố` (P2) ; `Xem tài sản` · **[A]** chọn nhiều → `Đánh dấu Bình thường` hàng loạt · **[A]** `Xuất biên bản` CSV · **[A]** `Hoàn tất kiểm kê` (nút xuất hiện trong panel biên bản khi `in_progress`, Admin/Kế toán) → `finishInventory` · **[V]** `Xem biên bản` → `#/assets/inventory/:id` |
| `#/assets/inventory/:id` | – **[TK]** | Biên bản: header mã + chip + `Xuất biên bản`/`Hoàn tất`; KPI 4 số; bảng dòng theo tòa; timeline (tạo/ghi/hoàn tất) | **[A]** như trên |
| `#/assets` | – **[TK]** (sidebar "Tài sản") | Sổ tài sản: header `+ Thêm tài sản`, `In mã QR`, `Xuất danh sách`; filter Tòa/Phòng/Loại/Tình trạng/Nguồn sở hữu; KPI (Tổng tài sản, Nguyên giá, Giá trị còn lại (khấu hao đường thẳng – OI-11 ⓘ), Cần thay thế/hỏng); bảng (Mã, Tên, Loại, Tòa, Phòng/Khu vực, Nguyên giá, Ngày dùng, Khấu hao (tháng), Giá trị còn lại, Tình trạng, ⋮); panel phải: Cơ cấu theo loại (donut), Tài sản theo tòa (bar), Kiểm kê kỳ này (link) | **[A]** drawer Thêm/Sửa (Tên*, Loại*, Tòa*, Phòng/Khu vực, SL, Nguyên giá, Ngày sử dụng, Số tháng khấu hao, Nguồn sở hữu, ☐ Ghi nhận chi phí mua sắm) · ⋮: Xem (modal: thông tin + QR + lịch sử tình trạng + kiểm kê gần nhất) / Sửa / Đổi tình trạng / Thanh lý / In QR · Xuất CSV |
| `buildings.js:51` tab **Tài sản** (P3) | – | `TH.pages.buildingAssetsTab(root, b)`: bảng tài sản của tòa + KPI + nút `Kiểm kê tòa này` → `#/assets/inventory?buildingId=` | **[V]** |
| `maintenance.js:42,50` tab **Kiểm kê hàng tháng** | – | Khi P3 bật → `TH.go('#/assets/inventory')`; tắt → coming-soon như hiện tại | **[V]** |
| `rooms.js:71,84` tab Tài sản phòng | – | Khi P3 bật: mỗi dòng có link mã `TS-…` (asset promote) + note "Kiểm kê/khấu hao xem Sổ tài sản" | **[V]** |

### 4.2 Nhân sự (`mockup/js/pages/hr.js`, nhóm sidebar NHÂN SỰ)

| Route | PNG | Nội dung phải khớp | Action |
|---|---|---|---|
| `#/hr` | 07/01 | Header "Quản lý nhân viên" + `+ Thêm nhân viên`, `Xuất danh sách`; filter Tìm kiếm (mã/tên/SĐT/email) / Phòng ban / Chức danh / Khu vực phụ trách / Trạng thái + Làm mới; 4 KPI (Tổng 28 "Tăng 3 so tháng trước", Đang làm việc 24 "85.7%", Tạm nghỉ 3 "10.7%", Quản lý khu vực 6 "Phụ trách 5 khu vực"); bảng "Danh sách nhân viên (28)": ☐, Mã NV (link), Họ tên, Phòng ban, Chức danh, SĐT, Email (rút gọn), Khu vực phụ trách, Tòa nhà phụ trách (assignment `primary`), Trạng thái chip, Ngày vào làm, `👁 Xem` + ⋮; phân trang 10/trang; panel phải: **Phân bố theo phòng ban** (donut 28 + legend 7 dòng %), **Nhân viên sắp hết hợp đồng thử việc** (# / Họ tên / Ngày hết hạn / Còn lại chip đỏ ≤5, vàng ≤10) + Xem tất cả | **[A]** drawer Thêm/Sửa NV (Họ tên*, Phòng ban*, Chức danh*, SĐT*, Email, Địa chỉ, Hình thức, Quản lý trực tiếp, Ngày vào làm*, Ngày hết thử việc, Khu vực, Trạng thái, Lương cơ bản/phụ cấp – chỉ `hr.manage`) · ⋮: Xem / Sửa / Phân công tòa / Đổi trạng thái (Tạm nghỉ/Nghỉ việc – modal lý do, ngày) / Tạo tài khoản (→ form user P1 prefill, chỉ Admin) · `Xuất danh sách` CSV · "Xem tất cả" thử việc → `#/hr?status=probation` |
| `#/hr/:id` | 07/02 | Header "Chi tiết nhân viên" + `Chỉnh sửa`, `Phân công tòa nhà`, `Cập nhật hồ sơ`; hero: avatar lớn (initials), tên + chip trạng thái, Mã NV, Chức danh, Phòng ban, Ngày vào làm + "Đã làm việc N năm M tháng"; tabs Tổng quan · Phân công · Hồ sơ · Lịch sử; **Tổng quan** trái: card Thông tin liên hệ (Họ tên/Email/SĐT/Địa chỉ + Chỉnh sửa), card Thông tin công việc (Mã/Chức danh/Phòng ban/Hình thức/Quản lý trực tiếp/Ngày vào/Trạng thái + Chỉnh sửa), card Tòa nhà phụ trách (ảnh tòa + tên + địa chỉ + chip Chính/Phụ + `Phân công thêm`), card KPI cá nhân (Tháng hiện tại) 4 tile (Lead đã xử lý, HĐ thành công, Doanh thu mang về, Tỷ lệ chuyển đổi + delta) + Xem chi tiết, card Hoạt động gần đây (timeline 4 dòng từ auditLog); phải: Thống kê nhanh (Tòa phụ trách / Lead đang xử lý / HĐ trong tháng / Tỷ lệ hài lòng 92% – giá trị mẫu ⓘ), Lịch làm việc tuần này (Th2–Th6, giờ, việc, nơi), Tài liệu liên quan (5 dòng icon pdf/docx + ngày + ⋮ + `Thêm tài liệu`) | **[A]** `Chỉnh sửa` → drawer; `Phân công tòa nhà`/`Phân công thêm` → modal (Tòa*, Vai trò* Trưởng nhóm/NV vận hành/NV vệ sinh/NV kỹ thuật, ☐ Tòa chính, Ngày bắt đầu) → `assignBuilding` · `Cập nhật hồ sơ` → modal upload giả → `documents[]` · tab **Phân công**: bảng lịch sử assignment (Tòa, Vai trò, Từ–Đến, Trạng thái, `Kết thúc`) · tab **Hồ sơ**: tài liệu + lương/phụ cấp (chỉ `hr.manage`/Admin – AC-FR-HR-01-2) · tab **Lịch sử**: `history[]` (đổi trạng thái, phân công, chấm công xác nhận) · KPI "Xem chi tiết" → `#/crm?sale=` (P2) |
| `#/hr/timesheet` | – **[TK]** (sidebar "Chấm công") | Header "Chấm công" + chip "Mô phỏng – ngoài scope SRS §2.2" + `Điền mặc định`, `Xác nhận bảng công`, `Xuất`; filter Kỳ / Phòng ban / Tòa; KPI (Ngày công chuẩn, Đi làm hôm nay, Nghỉ phép, Đi muộn/OT); **lưới chấm công** `U.attendanceGrid` (hàng = NV, cột = ngày trong tháng, ô = P/A/L/H/O màu, cuối hàng Công/Nghỉ/OT; cuộn ngang); panel: Chú giải ký hiệu + Trạng thái bảng công (draft/confirmed, người xác nhận) | **[A]** click ô → menu đổi ký hiệu → `markAttendance` (chỉ khi `draft`); `Điền mặc định` → `fillTimesheet`; `Xác nhận` → `confirmTimesheet` (khóa ô, dùng cho lương) · Xuất CSV |
| `#/hr/payroll` | – **[TK]** (sidebar "Lương thưởng") | Header "Lương thưởng" + `Tính bảng lương kỳ`, `Gửi duyệt`/`Duyệt`/`Ghi nhận chi lương`, `Xuất`; filter Kỳ / Phòng ban; `U.stepperStatus` Nháp → Chờ duyệt → Đã duyệt → Đã chi; 4 KPI (Tổng chi lương, Lương cứng, Phụ cấp, Hoa hồng Sale); bảng lines (Mã NV, Họ tên, Phòng ban, Lương cứng, PC chức danh, PC số nhà (N tòa × đơn giá ⓘ), Hoa hồng (link giao dịch P2), Khấu trừ, Thực lĩnh, ⋮ Xem diễn giải); footer tổng; panel: Công thức (BR-14, OI-15 TBD), Chi phí lương theo tòa (bar), Lịch sử kỳ | **[A]** `Tính bảng lương` → `buildPayroll` (từ timesheet confirmed + assignments + commissions paid) ; `Gửi duyệt` (hr) → `review`; `Duyệt` (Admin/Kế toán) → `approved`; `Ghi nhận chi lương` (Kế toán) → `payPayroll` → expenses nhóm Lương (kỳ đã khóa → lỗi FR-FIN-08) · Xuất CSV · Cổ đông/Vận hành/Sale không vào được (403) |

### 4.3 Đầu tư (`mockup/js/pages/investment.js`, nhóm sidebar ĐẦU TƯ)

| Route | PNG | Nội dung phải khớp | Action |
|---|---|---|---|
| `#/investment/shareholders` | 09/01 | Breadcrumb Đầu tư / Cổ đông & vốn góp; header "Cổ đông, vốn góp & phân phối" + `+ Thêm cổ đông`, `Tạo khoản góp vốn`, `Tạo phân phối`; card tabs boxed **Cổ đông (8)** · **Đóng góp theo kỳ** · **Phân phối lợi nhuận**; filter Dự án / Tìm kiếm / Trạng thái + Làm mới; 4 KPI (Tổng cổ đông 8, Tổng vốn góp 12 tỷ "100% vốn điều lệ", Lợi nhuận kỳ này 1.248 tỷ "Tháng 10/2026", Đã phân phối 800tr + progress "64% kế hoạch"); **tab Cổ đông**: bảng ☐, #, Cổ đông (avatar initials + tên + email), Tỷ lệ góp vốn, Số vốn đã góp, Số vốn còn thiếu (đỏ), Phân phối kỳ này, Trạng thái chip, `👁 Xem` + ⋮; dòng **Tổng cộng** (100% / 12 tỷ / 540tr đỏ / 1.248 tỷ); dưới: card **Cơ cấu vốn góp theo cổ đông** (donut "12B VND" + legend 5 + Khác), card **Tình hình góp vốn** (3 progress: Đã góp đủ 6 – 75%, Còn thiếu 2 – 25%, Chưa góp 0); panel phải: **Lịch đóng góp sắp tới** (ngày lớn + tên đợt + cổ đông + số tiền + chip Đến hạn/Còn N ngày) + **Lịch phân phối sắp tới** (Q3 Đang xử lý 1.248 tỷ, Q4/Q1/Q2 Chờ phân phối "Dự kiến …") | **[A]** `Thêm cổ đông` drawer (Tên*, Email, SĐT, CCCD, **bảng cam kết theo dự án**: Dự án / Tỷ lệ % nhập tay / Vốn cam kết / Ngày hiệu lực; validate Σ ratio dự án ≤ 100%) · `Tạo khoản góp vốn` modal (Dự án*, Đợt*, Hạn*, Tổng đợt* → preview nghĩa vụ từng cổ đông theo tỷ lệ) → `createContributionRound` · `Tạo phân phối` modal (Kỳ*, Dự án (tất cả), Lợi nhuận được phân phối* (gợi ý từ `operating-result` P2), Ngày dự kiến) → preview lines + làm tròn → `createDistribution` · ⋮ dòng: Xem (modal cổ đông: cam kết theo dự án + lịch sử góp + phân phối) / Sửa / Ghi nhận góp vốn (modal: đợt còn thiếu, số tiền, ngày, chứng từ) / Lịch sử · **[V]** vai trò `codong` chỉ thấy dòng/dự án của mình, không nút ghi (FR-SHR-03 AC-2) |
| ↳ tab **Đóng góp theo kỳ** | – **[TK]** | Filter Dự án/Đợt/Trạng thái; KPI (Đến hạn, Quá hạn, Đã góp kỳ này, Còn thiếu); bảng (Mã đợt, Dự án, Đợt, Cổ đông, Hạn, Số tiền, Đã góp, Còn thiếu, Trạng thái, ⋮ Ghi nhận/Nhắc Zalo (P2)/Xem chứng từ); lịch sử góp vốn theo tòa gắn **kỳ trả chủ nhà** (BR-11/BR-15: hiện `payCycle` của tòa) | **[A]** `recordContribution` · nhắc Zalo → đợt gửi sự kiện `contribution_due` (chỉ khi P2 bật) |
| ↳ tab **Phân phối lợi nhuận** | – **[TK]** | Bảng kỳ phân phối (Mã, Kỳ, Dự án, Lợi nhuận, Tổng phân phối, Số cổ đông, Trạng thái, ⋮); click → drawer **Bảng phân phối** (dòng/cổ đông: Tỷ lệ hiệu lực, Số tiền, Làm tròn; tổng khớp; nút `Duyệt` (Admin) / `Ghi nhận đã chi` (Kế toán) / `Xuất bảng`); note "Bảng phân phối ≠ đã chuyển tiền (FR-SHR-02)"; công thức TBD OI-17 ⓘ | **[A]** `approveDistribution`, `payDistribution`, Xuất CSV; tái dùng cho báo cáo `shareholder` ở Report Hub |
| `#/investment/projects` | – **[TK]** (sidebar "Dự án") | Header "Dự án đầu tư" + `+ Thêm dự án`; KPI (Dự án đang vận hành, Tổng vốn điều lệ, Vốn thực góp, Còn thiếu); **grid card** dự án (ảnh tòa, tên, tòa, trạng thái, vốn điều lệ, progress vốn thực góp %, số cổ đông, ROI tạm tính) + bảng chuyển đổi; click card → drawer chi tiết (thông tin, cổ đông & tỷ lệ, đợt góp, phân phối, tài sản của tòa, link Hiệu quả) | **[A]** `saveProject` (Tên*, Tòa* (1-1), Vốn điều lệ*, Trạng thái, Ngày bắt đầu, ROI kỳ vọng) · ⋮ Sửa / Đóng dự án |
| `#/investment/roi` | – **[TK]** (từ header 09/01 "Hiệu quả theo tòa →" & Report Hub `roi`) | Header "Hiệu quả đầu tư" + filter Kỳ/Tòa; KPI (Tổng vốn đầu tư, Doanh thu kỳ, Lợi nhuận kỳ, ROI bình quân); bảng theo tòa (Vốn, Doanh thu, Chi phí, Khấu hao, LN, ROI %, Payback tạm tính, Tỷ lệ lấp đầy (P2 selector nếu bật), Trạng thái Tốt/Khá/Cần cải thiện); chart bar LN theo tòa; banner "Công thức tạm tính – chờ chốt OI-10/12/13/17" | **[V]** + Xuất CSV |
| `reportHub.js:18,88` | – | `impl==='p3'` & P3 bật: `roi → #/investment/roi`, `shareholder → #/investment/shareholders?tab=distributions`, `asset-value → #/assets?view=value`, `project-progress → #/investment/projects`; tắt → coming-soon như cũ | **[V]** |

### 4.4 Ngân hàng (`mockup/js/pages/bank.js`, sidebar TÀI CHÍNH → "Ngân hàng")

| Route | PNG | Nội dung | Action |
|---|---|---|---|
| `#/finance/bank` | – **[TK]** | Header "Ngân hàng & đối soát" + chip "Mô phỏng – ngoài scope SRS §2.2 (scope §4.5)" + `Nhập sao kê`, `Đối soát tự động`, `Tạo QR thanh toán`; card 3 tài khoản (ngân hàng, số TK, số dư, giao dịch tháng); filter Tài khoản/Thời gian/Chiều/Trạng thái đối soát; 4 KPI (Tiền vào, Tiền ra, Đã khớp %, Chưa khớp); bảng giao dịch (Ngày, Tài khoản, Nội dung, Mã tham chiếu, Tiền vào, Tiền ra, Kết quả đối soát chip `U.matchChip`, Liên kết (hóa đơn/khoản thu), ⋮); panel: Quy tắc đối soát (4 quy tắc P2), Kết quả đối soát gần nhất, Webhook/QR (mô tả) | **[A]** `Nhập sao kê` → dropzone CSV / `Dùng file mẫu` → `importBankStatement` (parser `TH.imp` P2) · `Đối soát tự động` → `reconcileBank` (matched → tạo `payments` qua `recordPayment` P1 giống `commitStatement`, idempotent theo `ref`) · ⋮ Khớp tay (chọn hóa đơn) / Bỏ qua / Xem · `Tạo QR thanh toán` modal (chọn hóa đơn chưa thu → QR giả VietQR + nội dung chuyển khoản; không tạo payment) |

### 4.5 Coming-soon & điểm P3 còn lại
- `misc.js` giữ nguyên cho key không route; mọi mục sidebar P3 đều có route thật nên `P2_INFO` các key P3 chỉ còn dùng khi phase tắt.
- Dashboard (`dashboard.js`): khi P3 bật thêm 1 hàng 3 tile nhỏ (Tài sản cần xử lý, Đợt góp vốn đến hạn, NV sắp hết thử việc) – tùy chọn, làm ở M7 nếu còn thời gian.

---

## 5. Component / icon mới (`mockup/js/ui/components-p3.js`, `components.css`)

| Component | Dùng ở | Ghi chú |
|---|---|---|
| `U.avatarCell({name, sub})` | Người kiểm kê, Cổ đông, NV | initials tròn + tên + dòng phụ (kiểm tra `crm.js` đã có helper tương tự → tái dùng nếu có) |
| `U.thumb(idx\|kind)` | cột Ảnh tài sản | ô 40×40 màu theo loại + icon (không dùng ảnh ngoài) |
| `U.dateTile(dateISO)` | Lịch đóng góp / phân phối | "25 / Th10" (P2 "Lịch bảo dưỡng sắp tới" đã có ngày lớn – tách thành helper dùng chung) |
| `U.profileHero({name, status, meta[]})` | Chi tiết NV | avatar lớn + tên + chip + 4 meta cách nhau viền |
| `U.progressRows(rows)` | Tình hình góp vốn, Đã phân phối | label + count + bar + % |
| `U.attendanceGrid({employees, days, data, editable})` | Chấm công | bảng cuộn ngang, ô màu theo ký hiệu, click → menu |
| `U.qrBox(text)` | In QR tài sản, QR thanh toán | vẽ giả bằng SVG pattern deterministic từ hash chuỗi |
| `TH.chart.donut` / `bar` (đã có) | Phân bố phòng ban, Cơ cấu vốn, ROI | tái dùng |
| Icon (`icons.js`, thêm nếu thiếu) | – | `package, clipboard-check, id-card, banknote, landmark, qr-code, camera, user-plus, award, pie-chart, briefcase, file-badge` |

---

## 6. Panel Hướng dẫn – luồng Phase 3 (`mockup/js/core/guide-p3.js`, pattern `guide-p2.js`: `ctx3()`, `phase: 3`, `G.FLOWS.push`, bọc `check/route`)

| Flow | Mốc (route · vai trò) | Điều kiện hoàn thành |
|---|---|---|
| **F16 Kiểm kê tài sản** | F16.1 Bắt đầu kiểm kê kỳ 11/2026 (`/assets/inventory` · Kế toán) · F16.2 Cập nhật tình trạng 1 tài sản → Cần xử lý (Vận hành, sample form) · F16.3 Tạo sự cố từ dòng cần xử lý (P2 bật) hoặc bỏ qua · F16.4 Hoàn tất kiểm kê + Xuất biên bản (Kế toán) | inventory `user` done; ≥1 line `needs_action` với `checkedBy`; asset.condition đổi & roomAsset sync |
| **F17 Nhân sự → Lương** | F17.1 Thêm nhân viên (`/hr` · Nhân sự, sample form) · F17.2 Phân công tòa chính (`/hr/:id`) · F17.3 Xác nhận bảng công kỳ hiện tại (`/hr/timesheet`) · F17.4 Tính bảng lương → gửi duyệt → Kế toán duyệt & ghi chi (`/hr/payroll`) | employee `user`; assignment primary; timesheet confirmed; payroll paid + expense nhóm Lương |
| **F18 Cổ đông & vốn góp** | F18.1 Thêm cổ đông với tỷ lệ theo dự án (`/investment/shareholders` · Kế toán, sample form) · F18.2 Tạo đợt góp vốn → nghĩa vụ sinh theo tỷ lệ (tab Đóng góp) · F18.3 Ghi nhận góp vốn 1 cổ đông → Đã góp · F18.4 Tạo phân phối kỳ → Admin duyệt → Kế toán ghi đã chi (tab Phân phối) · F18.5 Chuyển vai trò Cổ đông: chỉ thấy dự án mình, không nút ghi | shareholder `user`; contributions `user` ≥ n cổ đông; ≥1 paid; distribution paid; visited với role codong |
| **F19 Ngân hàng** | F19.1 Nhập sao kê file mẫu → Đối soát tự động (`/finance/bank` · Kế toán, sample file) · F19.2 Khớp tay 1 dòng Chưa khớp | bankTransactions `user` có matched; ≥1 matched thủ công |

`G.runAllP3()` chạy kỹ thuật F16→F19 bằng actions (nút `adv-runall-p3`). Footer panel: "+ 4 luồng Phase 3". Sample: form `asset-condition`, `employee`, `shareholder`, file `mau-sao-ke-ngan-hang.csv`.

---

## 7. Thứ tự thực hiện (milestone)

| # | Milestone | Kết quả kiểm chứng |
|---|---|---|
| M0 | **Mở công tắc P3**: `phase.js`, `layout.js` (bind, togglePhase, menu href, user menu, nút runall-p3, footer), `auth.js` (roles hr/codong, PERMS, P3_READ, scope, enforceUI), `actions.js:353`, `misc.js`, `store.js` collections + migrate, `seed.js` hooks, `login.js` chips, `index.html` script rỗng cho file mới, `package.json` 3.0.0 | Tắt P3: mọi thứ y hệt hiện tại. Bật P3: 7 mục sidebar sáng + badge P3 → route chưa có trang hiện coming-soon (router guard không chặn, handler chưa đăng ký → trang trống? → đăng ký placeholder tạm trong M0); đăng nhập `nhansu`/`codong` được; tắt P3 khi là `hr` → về Admin |
| M1 | `seed-p3.js` + `selectors-p3.js` + `actions-p3.js` + `components-p3.js` + icons + file mẫu sao kê | Console `__timehouseDemo.state()` đủ 248 assets / 28 employees / 8 shareholders / số PNG; `runAllP3` chạy hết bằng actions |
| M2 | **Tài sản**: `/assets`, `/assets/inventory`, `/assets/inventory/:id`, tab tòa/phòng/maintenance | Đối chiếu PNG 06/03; chạy F16 tay |
| M3 | **Nhân sự**: `/hr`, `/hr/:id` (4 tab) | Đối chiếu PNG 07/01, 07/02; F17.1–17.2 |
| M4 | **Chấm công & Lương**: `/hr/timesheet`, `/hr/payroll` (+ expenses nhóm Lương, `assertPeriodOpen`) | F17.3–17.4; kỳ khóa chặn chi lương |
| M5 | **Đầu tư**: `/investment/shareholders` (3 tab), `/investment/projects`, `/investment/roi`, wire Report Hub 4 báo cáo P3, scope `codong` | Đối chiếu PNG 09/01; F18 với 3 vai trò; cổ đông tòa A không thấy tòa B |
| M6 | **Ngân hàng** `/finance/bank` | F19; đối soát không tạo payment trùng |
| M7 | Guide F16–F19 + samples + `runAllP3`; chuông; dashboard tiles (tùy chọn); responsive 1440/375; a11y | Nghiệm thu §8 |
| M8 | `mockup/README.md` mục Phase 3 (bảng 4 PNG → route + màn tự thiết kế + tài khoản mới), copy plan → `Timehouse-Mockup-Plan-Phase3-v1.0.md` (repo root, format plan P2), `npm run check` + `npm run build` | Netlify/file:// chạy |

`index.html` thứ tự script: sau `selectors-p2.js` → `selectors-p3.js`; sau `actions-p2.js` → `actions-p3.js`; sau `seed-p2.js` → `seed-p3.js`; sau `components-p2.js` → `components-p3.js`; sau `jobs.js` → `assets.js, hr.js, investment.js, bank.js`; sau `guide-p2.js` → `guide-p3.js`.

---

## 8. Verification / Nghiệm thu

1. **Hồi quy P1/P2 khi P3 tắt** (mặc định): xóa localStorage → chỉ P1; bật P2 → 18 màn P2 như cũ; `runAll()` và `runAllP2()` vẫn pass; các mục P3 mờ + coming-soon; `npm run check` sạch.
2. **Công tắc P3**: Công cụ nâng cao tick Phase 3 → sidebar Nhân sự/Đầu tư/Ngân hàng sáng + badge P3, footer "P1 + P3" hoặc "P1 + P2 + P3", user menu có Nhân sự/Cổ đông, nút "Chạy kịch bản Phase 3" hiện; bỏ tick khi đang ở `#/hr` → coming-soon giữ URL; đang là `codong` → về Admin + toast; P3 bật khi P2 tắt vẫn vào được mọi route P3, link sang P2 (Tạo sự cố, KPI → CRM) ra coming-soon; Đặt lại/Xóa trắng/Nhập state không đổi phase; reload giữ.
3. **Nhận diện P3**: mọi route `phase:3` có chip P3 ở tiêu đề; màn tự thiết kế có chú "Tự thiết kế – không có PNG"; README liệt kê.
4. **Đối chiếu 4 PNG** bằng Playwright MCP 1440×1000: `#/assets/inventory`, `#/hr`, `#/hr/<NV002>`, `#/investment/shareholders` – bố cục, số KPI, cột bảng, panel phải khớp; số liệu khớp seed (248/198/32/18; 28/24/3/6; 8/12 tỷ/1.248 tỷ/800tr/540tr).
5. **Chạy tay F16–F19** theo panel với vai trò Kế toán/Vận hành/Nhân sự/Admin/Cổ đông: kiểm kê hoàn tất không tạo chi phí (AC-MNT-02-2); NV nghỉ việc vẫn hiện tên trên chứng từ cũ (AC-HR-01-1); vai trò ngoài `hr` không thấy lương (AC-HR-01-2); tỷ lệ nhập tay 30% được giữ (AC-SHR-02-1); tổng phân phối + làm tròn = lợi nhuận duyệt (AC-SHR-02-2); cổ đông không sửa được (gọi `X.saveShareholder` từ console với role codong → lỗi quyền; AC-SHR-04-2); chi lương kỳ đã khóa bị chặn (FR-FIN-08); đối soát ngân hàng idempotent.
6. **Bất biến** (console): 1 asset ↔ ≤1 roomAsset; 1 đợt kiểm kê/kỳ/tòa; Σ ratio/dự án ≤ 100%; distribution.lines Σ = profit; payroll paid ↔ expenses Lương 1-1; bank matched ↔ payment 1-1.
7. **Guide không tạo record**: Đi tới/Chuyển vai trò/Xem/Điền/Dùng file mẫu chỉ đổi `guide`.
8. **Responsive & a11y**: 1440 và 375 không overflow ngang (lưới chấm công và bảng cổ đông trong `overflow-x:auto`, panel phải xếp xuống dưới); console sạch ở cả 3 tổ hợp phase (P1, P1+P2, P1+P3, P1+P2+P3); `npm run build` OK.

---

## 9. Ghi chú, giả định & rủi ro

- Tên người trong 4 PNG trùng nhau chéo module (Trần Minh Đức vừa là Kỹ thuật P2, NV001, cổ đông #1): giữ nguyên theo PNG; `employees.userId`/`shareholders.userId` chỉ link khi có user cùng tên.
- Mốc "Biên bản kiểm kê gần nhất" trong PNG ghi Đã hoàn thành nhưng KPI mới 198/248 → seed 10/2026 `in_progress` để demo F16, 09/2026 `done`.
- OI còn mở dùng mặc định + tooltip ⓘ: khấu hao đường thẳng theo tháng nhập tay (OI-11); công thức lương BR-14 với đơn giá phụ cấp số nhà mẫu 500.000/tòa (OI-15); tỷ lệ phân phối = tỷ lệ vốn nhập tay, làm tròn dồn cổ đông lớn nhất (OI-17); ROI = LN kỳ / vốn (OI-12/17); cổ đông đăng nhập được (OI-16 – demo giả định có portal, read-only).
- Chấm công, Ngân hàng, QR nằm ngoài SRS §2.2 – mockup ghi rõ "mô phỏng theo scope §4" để BA không hiểu là cam kết.
- Rủi ro: `layout.js`/`auth.js` mỗi hàm 1 dòng, sửa role/perm dễ ảnh hưởng P1/P2 → M0 chụp hồi quy trước; `Q.employeeKpi` phụ thuộc dữ liệu P2 – khi P2 tắt vẫn tính (dữ liệu luôn seed) nhưng link "Xem chi tiết" ra coming-soon.

---

## 10. Kết quả thực hiện (15/09/2026)

- Đã dựng đủ M0–M8: công tắc P3 độc lập với P2, 2 vai trò `hr`/`codong` (tài khoản `nhansu`, `codong`), 14 collection P3 seed idempotent (`meta.p3Seeded`, **không** đổi `SCHEMA`/KEY), 4 màn PNG + 7 màn tự thiết kế, guide F16–F19 (15 mốc) + `runAllP3()`, README, `npm run check`/`npm run build` OK.
- Sai khác so với PNG/plan (ghi để BA xác nhận):
  - KPI "Tổng vốn góp" dùng vốn điều lệ 12 tỷ (PNG); tổng thực góp theo seed là 11,46 tỷ (còn thiếu 540tr đúng PNG).
  - KPI "Đang làm việc" = 25 (gồm 5 thử việc) thay vì 24; "Tạm nghỉ" 3 (trạng thái ngoài SRS, giữ theo PNG).
  - Bảng lương `BL-2026-09` seed ở trạng thái *Đã duyệt* (chưa chi) để demo mốc F17.4; "Còn thiếu" = nghĩa vụ đến hạn/≤7 ngày; 2 dòng "Lịch đóng góp sắp tới" là nghĩa vụ định kỳ theo kỳ trả chủ nhà (BR-15).
  - `runAllP3()` mở lại kỳ 10/2026 nếu đang khóa để ghi chi lương (FR-FIN-08) → mốc F15.2 (khóa kỳ) cần chạy lại sau.
  - Dashboard tiles P3 (M7 tùy chọn) chưa làm.
- **Layout màn danh sách (15/09/2026, sau khi nghiệm thu)**: bỏ bố cục 2 cột (`.two-col` bảng trái + card phải) ở 21 màn danh sách/bảng/lưới P2+P3; nội dung cột phải chuyển thành dải *Thông tin liên quan* (`U.relatedStrip`, pattern P1) phía trên bảng, bảng full-width. Ngoại lệ: nút *Hoàn tất kiểm kê* lên header màn Kiểm kê; card *Quản lý kỳ* (Dòng tiền) thành card full-width 3 cột dưới bảng; *Bộ lọc nhanh* Lead thành hàng chip. Màn chi tiết (thông tin + tiến trình) và wizard (form + tóm tắt) giữ 2 cột.
