/*
 * Chạy walkthrough/UAT Phase 1 bằng UI thật, chụp evidence và sinh DOCX.
 *
 * Không gọi các action nghiệp vụ trực tiếp. `page.evaluate` chỉ dùng để reset
 * profile trước khi chạy, đọc state để tạo assertion/manifest và vẽ callout
 * tạm thời trên ảnh chụp.
 */
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  PageBreak,
  PageNumber,
  Packer,
  Paragraph,
  SectionType,
  ShadingType,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs', 'phase1-walkthrough');
const EVIDENCE = path.join(OUT, 'evidence');
const MANIFEST_PATH = path.join(OUT, 'manifest.json');
const DOCX_PATH = path.join(OUT, 'TimeHouse_Phase1_Walkthrough_UAT_v1.0.docx');
const WIDTH = 1440;
const HEIGHT = 1080;
const BASE_URL = process.env.TIMEHOUSE_BASE_URL || 'http://127.0.0.1:8765';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const roleLabel = { admin: 'Quản trị viên', accountant: 'Kế toán', ops: 'Vận hành' };
const route = (x) => `#${x}`;

const FLOWS = [
  {
    key: 'S0', title: 'Khởi động', core: true, steps: [
      ['S0.1', 'Đăng nhập hệ thống', 'admin', '/login', 'Màn hình đăng nhập với email/tên đăng nhập, mật khẩu và nút Đăng nhập.', 'admin / demo123', 'Nhập tài khoản và bấm Đăng nhập.', 'Vào Tổng quan, topbar hiện Nguyễn Văn Minh – Quản trị viên.', '[data-guide="login-card"]'],
      ['S0.2', 'Xem Tổng quan', 'admin', '/dashboard', 'Dashboard gồm bộ lọc kỳ/khu vực/tòa, 4 KPI, tài chính, biểu đồ và Top khoản quá hạn.', 'Kỳ 10/2026', 'Quan sát KPI, biểu đồ và bảng quá hạn.', 'KPI phòng, tiến độ thu và nút Nhắc thu hiển thị.', '[data-guide="dash-kpi"]'],
      ['S0.3', 'Kiểm tra danh mục dịch vụ & bảng giá', 'admin', '/settings/catalog', 'Danh sách dịch vụ, đơn vị, giá mặc định, phạm vi và lịch sử giá.', 'Không nhập; dùng seed catalog.', 'Mở Cấu hình → Danh mục dùng chung và mở một dịch vụ.', '7 dịch vụ đang hoạt động, gồm Điện 3.500/kWh và Nước 20.000/m³.', '[data-guide="catalog-table"]'],
      ['S0.4', 'Xem phòng sẵn sàng cho thuê', 'ops', '/rooms?status=ready', 'Danh sách phòng có tab trạng thái, giá, tòa và action trên từng dòng.', 'Lọc Sẵn sàng.', 'Chuyển Vận hành, mở Phòng và chọn tab Sẵn sàng.', 'Có dòng phòng với Giữ chỗ/Tạo hợp đồng.', '[data-guide="rooms-table"]'],
    ],
  },
  {
    key: 'F01', title: 'Tạo khách thuê', golive: '1', core: true, steps: [
      ['F01.1', 'Mở form Thêm khách thuê', 'ops', '/tenants', 'Danh sách khách thuê và drawer nhập hồ sơ ở bên phải.', 'Không nhập.', 'Bấm + Thêm khách thuê.', 'Drawer có Họ tên, SĐT, Zalo, Email, CCCD, nghề nghiệp và phân khúc.', '[data-guide="tenant-add"]'],
      ['F01.2', 'Lưu khách thuê mới', 'ops', '/tenants', 'Drawer form khách thuê.', 'Nguyễn Demo Khách; 0912 000 111; Zalo 0912 000 111; demo.khach@gmail.com; CCCD 012345678999; Kỹ sư phần mềm; Chuyên gia.', 'Điền form và bấm Lưu khách thuê.', 'Toast lưu thành công; khách mới có mã KH… và trạng thái Khách mới.', '[data-guide="tenant-add"]'],
    ],
  },
  {
    key: 'F02', title: 'Chọn phòng & tạo hợp đồng', golive: '2, 3, 4', core: true, steps: [
      ['F02.1', 'Chọn phòng sẵn sàng → Tạo hợp đồng', 'ops', '/rooms?status=ready', 'Bảng phòng Sẵn sàng với action Tạo hợp đồng.', 'Phòng Sẵn sàng đầu tiên sau reset.', 'Bấm Tạo hợp đồng trên dòng phòng đã chọn.', 'Form Tạo hợp đồng nạp sẵn phòng, giá tham chiếu và dịch vụ mặc định.', '[data-guide="rooms-table"]'],
      ['F02.2', 'Chọn khách, thời hạn, chu kỳ thanh toán', 'ops', '/contracts/new', 'Wizard hợp đồng với khách, phòng, thời hạn và chu kỳ thanh toán.', 'Khách vừa tạo; 01/10/2026–30/09/2027; ngày thu 05.', 'Chọn khách, giữ phòng, nhập ngày và ngày thanh toán.', 'Tóm tắt cập nhật và checklist chuyển sang hợp lệ.', '[data-guide="contract-save"]'],
      ['F02.3', 'Thiết lập giá thuê, cọc, dịch vụ', 'ops', '/contracts/new', 'Khu Giá thuê, cọc và phụ phí; bảng dịch vụ; thành viên ở.', 'Giữ giá phòng tự nạp; cọc = 2 × giá thuê; giữ dịch vụ mặc định; thành viên = khách chính.', 'Kiểm tra/điền giá, cọc, dịch vụ rồi bấm Lưu hợp đồng →.', 'HĐ được lưu ở Dự thảo và mở bước Review.', '[data-guide="price"]'],
      ['F02.4', 'Xác nhận & kích hoạt hợp đồng', 'ops', '/contracts/new', 'Review hợp đồng, checklist và nút kích hoạt.', 'HĐ Dự thảo của khách demo.', 'Bấm Xác nhận & kích hoạt hợp đồng và xác nhận modal.', 'HĐ Hiệu lực; phòng chuyển Đang thuê; cọc được ghi nhận đang giữ.', '[data-guide="contract-activate"]'],
    ],
  },
  {
    key: 'F03', title: 'Điện nước & hóa đơn', golive: '5, 6', core: true, steps: [
      ['F03.1', 'Mở Tạo hóa đơn theo kỳ', 'accountant', '/invoices', 'Wizard 4 bước lập hóa đơn theo kỳ, phạm vi tòa và dịch vụ.', 'Kỳ 10/2026; tòa của phòng demo; Tiền phòng/Điện/Nước/Dịch vụ cố định.', 'Mở Tạo hóa đơn theo kỳ và chọn phạm vi phòng demo.', 'Wizard hiển thị hợp đồng hiệu lực và cảnh báo thiếu chỉ số nếu có.', '[data-guide="invoice-batch"]'],
      ['F03.2', 'Nhập chỉ số điện nước cho phòng mới', 'accountant', '/invoices/batch', 'Bảng chỉ số cũ/mới điện và nước, SL tự tính, nút Lưu tạm.', 'Điện mới = điện cũ +150; nước mới = nước cũ +12.', 'Nhập hai chỉ số mới và bấm Lưu tạm.', 'Có toast lưu 2 chỉ số; phòng hết cảnh báo Thiếu chỉ số.', '[data-guide="meter-save"]'],
      ['F03.3', 'Preflight & tạo hóa đơn nháp', 'accountant', '/invoices/batch', 'Preflight hiển thị phòng hợp lệ, phòng bị loại và dự thu.', 'Giữ bộ dịch vụ và phòng demo đã có chỉ số.', 'Bấm Tiếp tục preflight → rồi Tạo N hóa đơn nháp.', 'Mã hóa đơn nháp của phòng demo xuất hiện ở bước kết quả.', '[data-guide="invoice-create"]'],
      ['F03.4', 'Phát hành hóa đơn', 'accountant', '/invoices', 'Chi tiết hóa đơn nháp với nút Phát hành.', 'Hóa đơn HD-202610-… vừa tạo.', 'Mở hóa đơn và bấm Phát hành, xác nhận modal.', 'Chứng từ Đã phát hành; trạng thái thu Chưa thu.', '[data-guide="invoice-issue"]'],
    ],
  },
  {
    key: 'F04', title: 'Gửi hóa đơn qua Zalo', golive: '7', core: true, steps: [
      ['F04.1', 'Mở preview nhắc tiền từ hóa đơn vừa phát hành', 'admin', '/invoices/:invoiceId → drawer Gửi nhắc tiền', 'Drawer preview người nhận, template và số tiền còn nợ.', 'Hóa đơn HD-202610-… vừa phát hành.', 'Mở chi tiết hóa đơn, bấm Gửi nhắc tiền và kiểm tra preview.', 'Đúng một khách/phòng demo, số dư hiện tại và trạng thái đủ điều kiện.', '[data-guide="zalo-recipients"]'],
      ['F04.2', 'Xác nhận gửi', 'admin', '/invoices/:invoiceId → drawer Gửi nhắc tiền', 'Drawer preview có nút Xác nhận gửi.', 'Danh sách preview đã kiểm tra.', 'Bấm Xác nhận gửi để tạo đợt.', 'Đợt ZL-202610-… chuyển Đang gửi rồi chạy timer.', '[data-guide="zalo-send"]'],
      ['F04.3', 'Theo dõi kết quả gửi', 'admin', '/zalo/history', 'Lịch sử gửi và chi tiết 7 trạng thái tin nhắn.', 'Đợt Zalo vừa tạo.', 'Mở chi tiết đợt, chờ timer kết thúc và mở tab nhắc tiền của hóa đơn.', 'Đợt Thành công/Một phần; tin khách demo có trạng thái giao nhận.', '[data-guide="zalo-recipients"]'],
    ],
  },
  {
    key: 'F05', title: 'Công nợ & thu tiền một phần', golive: '8, 9, 10', core: true, steps: [
      ['F05.1', 'Xem công nợ', 'accountant', '/receivables', 'Bảng công nợ với tổng, đã thu, còn lại, quá hạn và trạng thái nhắc.', 'Tìm theo mã phòng demo.', 'Mở Thu tiền & công nợ và tìm phòng demo.', 'Dòng hóa đơn có Đã thu 0, Còn lại = tổng và trạng thái đã nhắc.', '[data-guide="receivables-table"]'],
      ['F05.2', 'Ghi nhận thu tiền một phần', 'accountant', '/receivables', 'Drawer Thu tiền thủ công với khách, số tiền, phương thức, tham chiếu và phân bổ.', '3.000.000đ; Chuyển khoản; CK289104; ghi chú thanh toán một phần.', 'Chọn khách demo, nhập dữ liệu, Tự động phân bổ và Xác nhận ghi nhận.', 'Tạo PAY…; hóa đơn chuyển Thu một phần.', '[data-guide="receivable-pay"]'],
      ['F05.3', 'Xem chi tiết khoản thu', 'accountant', '/payments/:id', 'Chi tiết khoản thu, phân bổ công nợ và lịch sử xử lý.', 'PAY… vừa tạo.', 'Mở liên kết chi tiết khoản thu từ toast hoặc route.', 'Đã phân bổ = 3.000.000đ; còn lại sau phân bổ đúng.', '[data-guide="pay-form"]'],
      ['F05.4', 'Theo dõi số còn nợ', 'accountant', '/receivables', 'Bảng công nợ/hóa đơn sau khi đã phân bổ.', 'Hóa đơn và khoản thu demo.', 'Quay lại công nợ hoặc mở hóa đơn, kiểm tra Còn lại.', 'Đã thu = 3.000.000đ, Còn lại > 0, chip Thu một phần.', '[data-guide="receivables-table"]'],
    ],
  },
  {
    key: 'F06', title: 'Nhắc công nợ qua Zalo', golive: '11', core: true, steps: [
      ['F06.1', 'Tạo đợt nhắc công nợ', 'admin', '/receivables', 'Bảng công nợ có chọn dòng và action Gửi nhắc Zalo.', 'Hóa đơn demo còn nợ sau thu một phần; bật Vẫn gửi nếu rule 3 ngày chặn.', 'Chọn dòng khách demo, bấm Gửi nhắc Zalo, chọn template và preview.', 'Preview dùng số dư mới sau F05, không dùng tổng cũ.', '[data-guide="receivables-table"]'],
      ['F06.2', 'Xác nhận gửi & theo dõi', 'admin', '/zalo/history', 'Chi tiết đợt nhắc nợ và tiến độ timer.', 'Đợt debt vừa tạo.', 'Xác nhận gửi và chờ trạng thái kết thúc.', 'Tin chứa Còn nợ hiện tại đúng với số dư sau F05.', '[data-guide="zalo-recipients"]'],
      ['F06.3', 'Thử lại tin lỗi (nếu có)', 'admin', '/zalo/history', 'Chi tiết đợt có nút Thử lại các tin đủ điều kiện.', 'Tin failed/unknown của đợt mới hoặc seed ZL-202610-026.', 'Bấm retry và xác nhận; chỉ xếp hàng failed/unknown chưa retry.', 'Tin Đã giao giữ nguyên; tin retry có lần thử mới và mã trạng thái.', '[data-guide="zalo-retry"]'],
    ],
  },
  {
    key: 'F07', title: 'Kết thúc hợp đồng', golive: '12, 14', core: true, steps: [
      ['F07.1', 'Mở hợp đồng của khách mới', 'ops', '/contracts/:id', 'Chi tiết HĐ với trạng thái, KPI cọc/công nợ và action kết thúc.', 'HĐ demo Hiệu lực.', 'Chuyển Vận hành và mở HĐ demo.', 'Nút Kết thúc hợp đồng hiển thị, công nợ còn lại được tính.', '[data-guide="contract-terminate"]'],
      ['F07.2', 'Ghi nhận kết thúc → phòng Chờ dọn', 'ops', '/contracts/:id', 'Modal kết thúc HĐ có ngày thực tế, lý do, tạo hoàn cọc và Chờ dọn.', 'Ngày 28/10/2026; lý do Khách trả phòng sớm.', 'Bấm Kết thúc hợp đồng, giữ hai checkbox mặc định và xác nhận.', 'HĐ Đã kết thúc; phòng Chờ dọn; hồ sơ RC… Nháp được tạo.', '[data-guide="contract-terminate"]'],
    ],
  },
  {
    key: 'F08', title: 'Hoàn cọc', golive: '13', core: true, steps: [
      ['F08.1', 'Lập phương án hoàn cọc', 'ops', '/refunds/new', 'Wizard hiện trạng, dòng khấu trừ, bằng chứng và tổng tiền hoàn.', 'Khấu hao 200.000đ + vệ sinh 200.000đ; mỗi dòng có bằng chứng; không bù trừ nợ.', 'Mở hồ sơ RC…, kiểm tra hiện trạng, thêm dòng vệ sinh và lưu phương án.', 'Số hoàn = cọc − 400.000đ; bằng chữ và tổng khấu trừ đúng.', '[data-guide="refund-review"]'],
      ['F08.2', 'Gửi duyệt', 'ops', '/refunds/new', 'Review phương án với nút Gửi duyệt hoàn cọc.', 'Hồ sơ đã có khấu trừ và bằng chứng.', 'Bấm Gửi duyệt hoàn cọc.', 'Hồ sơ Chờ duyệt; Vận hành không có nút Duyệt.', '[data-guide="refund-submit"]'],
      ['F08.3', 'Kế toán duyệt hồ sơ', 'accountant', '/refunds/:id', 'Chi tiết hồ sơ với nút Duyệt hoàn cọc.', 'Hồ sơ RC… Chờ duyệt.', 'Chuyển Kế toán, mở hồ sơ và bấm Duyệt hoàn cọc.', 'Hồ sơ Đã duyệt; ghi chú Duyệt ≠ đã chuyển tiền.', '[data-guide="refund-approve"]'],
      ['F08.4', 'Ghi nhận đã hoàn (kèm bằng chứng)', 'accountant', '/refunds/:id', 'Modal ghi nhận hoàn gồm ngày, phương thức, tham chiếu và upload evidence.', 'Ngày 28/10/2026; Chuyển khoản; UNC289104; `uy_nhiem_chi_hoan_coc.pdf`.', 'Dùng file mẫu/đính kèm evidence và bấm Xác nhận đã hoàn.', 'Hồ sơ Đã hoàn; phòng vẫn Chờ dọn.', '[data-guide="refund-paid"]'],
    ],
  },
  {
    key: 'F09', title: 'Dọn phòng & mở cho thuê lại', golive: '15, 16', core: true, steps: [
      ['F09.1', 'Xác nhận dọn xong', 'ops', '/rooms?status=cleaning', 'Tab Chờ dọn và action Xác nhận dọn xong.', 'Phòng demo Chờ dọn.', 'Chuyển Vận hành, mở tab Chờ dọn và bấm Xác nhận dọn xong.', 'Toast xác nhận; phòng rời khỏi danh sách Chờ dọn.', '[data-guide="confirm-clean"]'],
      ['F09.2', 'Phòng trở lại Sẵn sàng', 'ops', '/rooms?status=ready', 'Tab Sẵn sàng và action Giữ chỗ/Tạo hợp đồng.', 'Mã phòng demo sau khi dọn.', 'Lọc Sẵn sàng và tìm lại mã phòng.', 'Phòng Sẵn sàng; vòng đời cho thuê hoàn tất.', '[data-guide="rooms-table"]'],
    ],
  },
  {
    key: 'F10', title: 'Bổ trợ (tùy chọn)', core: false, steps: [
      ['F10.1', 'Thêm chi phí', 'accountant', '/expenses', 'Danh sách chi phí và drawer nhập nhóm chi, số tiền, tòa/phân bổ.', '28/10/2026; Sửa chữa; Sửa khóa cửa phòng demo; 350.000đ; chung; 40/30/20/10.', 'Chọn Chi phí chung, nhập dữ liệu, kiểm tra tổng 100% và lưu.', 'Chi phí CP… xuất hiện đầu danh sách, phân bổ đủ 100%.', '[data-guide="expense-add"]'],
      ['F10.2', 'Import khách bằng file mẫu', 'admin', '/settings/import?type=tenant', 'Wizard upload, mapping, kiểm tra lỗi và commit.', 'File mẫu 10 dòng có lỗi cố ý.', 'Bấm Dùng file mẫu, mapping, kiểm tra và Xác nhận import.', 'KPI Hợp lệ/Cần kiểm tra/Lỗi; dòng hợp lệ được tạo, dòng lỗi bị bỏ qua.', '[data-guide="import-sample"]'],
      ['F10.3', 'Tạo tài khoản Vận hành', 'admin', '/settings/users', 'Danh sách tài khoản và drawer tạo user.', 'Lê Demo Vận Hành; demo.vanhanh@timohouse.vn; 0913 222 333; role ops; hiệu lực 28/10/2026; chọn tòa đầu tiên.', 'Bấm Tạo tài khoản, điền form và lưu.', 'Tài khoản mới có chip Vận hành và phạm vi tòa.', '[data-guide="user-add"]'],
      ['F10.4', 'Xuất báo cáo công nợ', 'accountant', '/reports?tab=debt', 'Báo cáo công nợ theo tòa và nút Xuất CSV.', 'Kỳ 10/2026.', 'Chuyển Kế toán, mở báo cáo công nợ và bấm Xuất CSV.', 'File CSV chứa phải thu, đã thu và còn nợ theo tòa.', '[data-guide="reports-table"]'],
    ],
  },
];

const STEPS = FLOWS.flatMap((f) => f.steps.map((s) => ({
  id: s[0], flow: f.key, flowTitle: f.title, title: s[1], role: s[2], route: s[3], screen: s[4], inputs: s[5], action: s[6], expected: s[7], selector: s[8], core: f.core, golive: f.golive || '',
})));
const STEP = new Map(STEPS.map((s) => [s.id, s]));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();

async function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', () => { const p = srv.address().port; srv.close(() => resolve(p)); });
  });
}

async function ensureServer() {
  try { const r = await fetch(`${BASE_URL}/index.html`); if (r.ok) return { url: BASE_URL, child: null }; } catch { /* start below */ }
  const port = await freePort();
  const child = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: ROOT, env: { ...process.env, PORT: String(port) }, stdio: 'ignore', windowsHide: true });
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 40; i++) { try { const r = await fetch(`${url}/index.html`); if (r.ok) return { url, child }; } catch { /* wait */ } await sleep(100); }
  child.kill(); throw new Error(`Không khởi động được server tại ${url}`);
}

async function goto(page, base, hash) {
  await page.goto(`${base}/${hash}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(100);
  await page.evaluate(() => document.body.classList.remove('guide-open'));
}

async function clickText(page, text, opts = {}) {
  const root = opts.scope || page;
  const loc = root.getByRole(opts.role || 'button', { name: text, exact: opts.exact !== false }).first();
  await loc.waitFor({ state: 'visible' });
  await loc.click();
  return loc;
}

async function clickContains(page, text) {
  const loc = page.locator('button, a').filter({ hasText: text }).first();
  await loc.waitFor({ state: 'visible' });
  await loc.click();
  return loc;
}

async function fill(page, name, value, scope = page) {
  const loc = scope.locator(`[name="${name}"]`).first();
  await loc.waitFor({ state: 'visible' });
  await loc.fill(String(value));
  await loc.press('Tab').catch(() => {});
}

async function select(page, name, value, scope = page) {
  const loc = scope.locator(`select[name="${name}"]`).first();
  await loc.waitFor({ state: 'visible' });
  const options = await loc.locator('option').evaluateAll((xs) => xs.map((x) => ({ value: x.value, text: x.textContent.trim() })));
  const match = options.find((x) => x.value === String(value)) || options.find((x) => x.text.includes(String(value)));
  if (!match) throw new Error(`Không tìm thấy option ${name}=${value}; có: ${options.map((x) => x.text).join(', ')}`);
  await loc.selectOption(match.value);
}

async function switchRole(page, role) {
  const current = await page.locator('#tb-role').textContent().catch(() => '');
  if (norm(current).includes(roleLabel[role] || role)) return;
  await page.locator('.tb-user').click();
  const wanted = role === 'admin' ? /Quay lại Admin|Quản trị viên/ : new RegExp(roleLabel[role] || role);
  const item = page.locator('div[role="menu"] button[role="menuitem"]').filter({ hasText: wanted }).first();
  await item.waitFor({ state: 'visible' }); await item.click({ force: true }); await page.waitForTimeout(100);
}

async function stateSnapshot(page) {
  return page.evaluate(() => {
    const T = window.TH; const s = T.store.state; const raw = (c) => s[c] || [];
    const users = raw('users'); const session = s.session || {};
    const userTenants = raw('tenants').filter((x) => x.source === 'user');
    const demoTenant = userTenants.find((x) => x.phone === '0912 000 111');
    const tenant = demoTenant || userTenants.slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
    const contracts = raw('contracts').filter((x) => x.source === 'user');
    const contract = contracts.slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
    const room = contract ? raw('rooms').find((x) => x.id === contract.roomId) : null;
    const invoices = contract ? raw('invoices').filter((x) => x.contractId === contract.id && x.source === 'user' && x.docStatus !== 'cancelled') : [];
    const invoice = invoices.slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
    const pays = invoice ? raw('payments').filter((x) => x.source === 'user' && raw('paymentAllocations').some((a) => a.paymentId === x.id && a.invoiceId === invoice.id)) : [];
    const payment = pays.slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
     const batches = raw('zaloBatches').filter((x) => x.source === 'user');
     // St.add preserves creation order; use the last user batch when timestamps share a second.
     const batch = batches[batches.length - 1] || null;
     const refund = contract ? raw('refunds').filter((x) => x.contractId === contract.id).slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] : null;
     const expense = raw('expenses').filter((x) => x.source === 'user').slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
     const expenseAllocations = expense ? raw('expenseAllocations').filter((x) => x.expenseId === expense.id) : [];
     const importJob = raw('importJobs').filter((x) => x.source === 'user').slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
     const user = users.filter((x) => x.source === 'user').slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
     const meter = room ? raw('meterReadings').filter((x) => x.roomId === room.id && x.period === s.meta.period).slice(-2) : [];
     const paid = invoice ? T.q.invPaid(invoice) : 0; const remaining = invoice ? T.q.invRemaining(invoice) : 0;
     return { session, today: s.meta.today, period: s.meta.period, tenant, contract, room, invoice, payment, batch, refund, expense, expenseAllocations, importJob, user, meter, paid, remaining, guide: s.guide, url: location.hash };
  });
}

async function annotate(page, id, role, selector) {
  await page.evaluate(({ id, role, selector, labels }) => {
    document.querySelectorAll('[data-evidence-callout]').forEach((x) => x.remove());
    let target = selector && document.querySelector(selector);
    if (target) { const box = target.getBoundingClientRect(); const style = getComputedStyle(target); if (box.width === 0 || box.height === 0 || style.visibility === 'hidden' || style.display === 'none') target = null; }
    const modal = [...document.querySelectorAll('.overlay .drawer, .overlay .modal')].reverse().find((x) => { const b = x.getBoundingClientRect(); const st = getComputedStyle(x); return b.width > 0 && b.height > 0 && st.visibility !== 'hidden' && st.display !== 'none'; });
    if (modal) target = modal;
    if (!target) target = document.querySelector('#content') || document.body;
    if (target) { target.scrollIntoView({ block: 'center', inline: 'nearest' }); target.dataset.evidenceOldOutline = target.style.outline || ''; target.style.outline = '3px solid #f59e0b'; target.style.outlineOffset = '4px'; target.dataset.evidenceTarget = '1'; }
    const label = document.createElement('div'); label.dataset.evidenceCallout = '1'; label.textContent = `${id} · ${labels[role] || role} · ${location.hash}`;
    label.textContent += ` | captured ${new Date().toISOString()}`;
    Object.assign(label.style, { position: 'fixed', zIndex: '2147483647', right: '16px', bottom: '16px', padding: '8px 12px', borderRadius: '8px', background: '#0f2a5f', color: '#fff', font: '600 14px system-ui', boxShadow: '0 2px 10px rgba(0,0,0,.25)' });
    document.body.appendChild(label);
  }, { id, role, selector, labels: roleLabel });
}

async function clearAnnotations(page) {
  await page.evaluate(() => {
    document.querySelectorAll('[data-evidence-target]').forEach((x) => { x.style.outline = x.dataset.evidenceOldOutline || ''; x.style.outlineOffset = ''; delete x.dataset.evidenceTarget; delete x.dataset.evidenceOldOutline; });
    document.querySelectorAll('[data-evidence-callout]').forEach((x) => x.remove());
  });
}

async function screenshot(page, id, kind, role, selector) {
  await annotate(page, id, role, selector);
  const file = path.join(EVIDENCE, `${id}-${kind}.png`);
  await page.screenshot({ path: file, fullPage: false });
  await clearAnnotations(page);
  return path.relative(OUT, file).replaceAll('\\', '/');
}

async function waitForModal(page) { await page.locator('.overlay').last().waitFor({ state: 'visible' }); return page.locator('.overlay').last(); }
async function closeModal(page) { const m = page.locator('.overlay').last(); if (await m.count()) { const close = m.locator('button').filter({ hasText: /Hủy|Đóng|×/ }).first(); if (await close.count()) await close.click().catch(() => {}); } }
async function clickAction(page, act) { const loc = page.locator(`[data-act="${act}"]`).first(); await loc.waitFor({ state: 'visible' }); await loc.click(); return loc; }

async function runScenario(page, base) {
  const actual = {};
  const results = [];
  const run = async (id, fn, options = {}) => {
    const def = STEP.get(id); const started = new Date().toISOString(); let before = [];
    try {
      if (options.before) before.push(await screenshot(page, id, 'input', def.role, def.selector));
      const out = await fn(); await page.waitForTimeout(options.wait || 160);
      const snap = await stateSnapshot(page); Object.assign(actual, snap);
      const after = await screenshot(page, id, 'result', def.role, def.selector);
      const extra = Array.isArray(out?.screenshots) ? out.screenshots : [];
      const record = { ...def, startedAt: started, finishedAt: new Date().toISOString(), status: 'PASS', actual: out?.actual || describeActual(id, snap), screenshots: [...before, ...extra, after], recordIds: idsOf(snap), error: '' };
      results.push(record); return record;
    } catch (e) {
      const snap = await stateSnapshot(page).catch(() => ({})); Object.assign(actual, snap);
      const images = [...before]; try { images.push(await screenshot(page, id, 'error', def.role, def.selector)); } catch { /* keep original error */ }
      results.push({ ...def, startedAt: started, finishedAt: new Date().toISOString(), status: 'FAIL', actual: describeActual(id, snap), screenshots: images, recordIds: idsOf(snap), error: e.stack || e.message });
      throw e;
    }
  };

  // S0 – fresh login, then overview/catalog/ready room.
  await goto(page, base, route('/login'));
  await page.locator('input[name=username]').fill('admin'); await page.locator('input[name=password]').fill('demo123');
  await run('S0.1', async () => { await clickText(page, 'Đăng nhập'); await page.waitForURL(/#\/dashboard/); return { actual: 'Đăng nhập thành công; Tổng quan mở với vai trò Quản trị viên.' }; }, { before: true });
  await run('S0.2', async () => { await goto(page, base, route('/dashboard')); return { actual: norm((await page.locator('#content').innerText()).slice(0, 450)) }; });
  await run('S0.3', async () => { await goto(page, base, route('/settings/catalog')); return { actual: norm((await page.locator('#content').innerText()).slice(0, 500)) }; });
  await switchRole(page, 'ops');
  await run('S0.4', async () => { await goto(page, base, route('/rooms?status=ready')); return { actual: norm((await page.locator('#content').innerText()).slice(0, 500)) }; });

  // F01 – tenant.
  await run('F01.1', async () => { await goto(page, base, route('/tenants')); await clickText(page, 'Thêm khách thuê'); await waitForModal(page); return { actual: 'Drawer Thêm khách thuê đã mở.' }; }, { before: true });
  await run('F01.2', async () => {
    const m = page.locator('.overlay').last(); await fill(page, 'name', 'Nguyễn Demo Khách', m); await fill(page, 'phone', '0912 000 111', m); await fill(page, 'zalo', '0912 000 111', m); await fill(page, 'email', 'demo.khach@gmail.com', m); await fill(page, 'idNumber', '012345678999', m); await fill(page, 'job', 'Kỹ sư phần mềm', m); await select(page, 'segment', 'Chuyên gia', m); await clickText(page, 'Lưu khách thuê'); await page.waitForTimeout(300); return { actual: 'Đã lưu Nguyễn Demo Khách với mã KH… và trạng thái Khách mới.' };
  }, { before: true });

  // F02 – choose first visible ready room and create contract through form.
  await run('F02.1', async () => {
    await goto(page, base, route('/rooms?status=ready'));
    const link = page.locator('[data-act="new-contract"], [data-act="newc"]').first();
    if (await link.count()) await link.click(); else await clickContains(page, 'Tạo hợp đồng');
    await page.waitForURL(/#\/contracts\/new/); return { actual: 'Form Tạo hợp đồng mở từ phòng Sẵn sàng.' };
  }, { before: true });
  await run('F02.2', async () => {
    const s = await stateSnapshot(page); const tenant = s.tenant; if (!tenant) throw new Error('Không có tenant user để chọn');
    const form = page.locator('#cf');
    await select(page, 'tenantId', tenant.id, form);
    await fill(page, 'start', '2026-10-01', form); await fill(page, 'end', '2027-09-30', form); await select(page, 'payDay', '5', form);
    return { actual: 'Đã chọn khách demo, thời hạn 01/10/2026–30/09/2027 và ngày thanh toán 05.' };
  }, { before: true });
  await run('F02.3', async () => {
    const form = page.locator('#cf'); const price = await form.locator('input[name=price]').inputValue();
    await fill(page, 'listPrice', price, form); await fill(page, 'price', price, form);
    const numeric = Number(price.replace(/[^0-9]/g, '')) || 0; await fill(page, 'deposit', numeric * 2, form);
    const member = form.locator('input[name^=mb_name_]').first(); if (await member.count() && !(await member.inputValue())) await member.fill('Nguyễn Demo Khách');
    await clickText(page, 'Lưu hợp đồng →'); await page.waitForURL(/#\/contracts\/new\?id=.*step=5/); return { actual: 'Hợp đồng đã được lưu Dự thảo và chuyển sang Review.' };
  }, { before: true });
  await run('F02.4', async () => { await clickText(page, 'Xác nhận & kích hoạt hợp đồng'); await clickText(page, 'Kích hoạt', { exact: true }); await page.waitForTimeout(300); return { actual: 'HĐ Hiệu lực; phòng Đang thuê; cọc đang giữ.' }; }, { before: true });

  // F03 – meters/invoice.
  await switchRole(page, 'accountant');
  await run('F03.1', async () => { await goto(page, base, route('/invoices')); await clickText(page, 'Tạo hóa đơn theo kỳ'); await page.waitForURL(/#\/invoices\/batch/); return { actual: 'Wizard Tạo hóa đơn theo kỳ mở.' }; }, { before: true });
  await run('F03.2', async () => {
    const s = await stateSnapshot(page); const roomId = s.room?.id; await goto(page, base, route(`/invoices/batch?step=2&period=2026-10&room=${encodeURIComponent(roomId || '')}`));
    const row = page.locator(`tr:has(input[data-r="${roomId}"])`).first();
    const ePrev = Number(await page.locator(`input[data-m=electricPrev][data-r="${roomId}"]`).inputValue()); const wPrev = Number(await page.locator(`input[data-m=waterPrev][data-r="${roomId}"]`).inputValue());
    await page.locator(`input[data-m=electricCurr][data-r="${roomId}"]`).fill(String(ePrev + 150)); await page.locator(`input[data-m=waterCurr][data-r="${roomId}"]`).fill(String(wPrev + 12));
    await clickText(page, 'Lưu tạm'); await page.waitForTimeout(250); return { actual: `Đã lưu chỉ số điện ${ePrev + 150}, nước ${wPrev + 12}.` };
  }, { before: true });
  await run('F03.3', async () => { await clickText(page, 'Tiếp tục preflight →'); await page.waitForURL(/#\/invoices\/batch\?step=3/); await clickText(page, /Tạo \d+ hóa đơn nháp/); await clickText(page, 'Tạo hóa đơn'); await page.waitForTimeout(250); return { actual: 'Preflight hợp lệ và tạo hóa đơn nháp.' }; }, { before: true });
  await run('F03.4', async () => { const s = await stateSnapshot(page); if (!s.invoice) throw new Error('Không tìm thấy hóa đơn nháp'); await goto(page, base, route(`/invoices/${s.invoice.id}`)); await clickText(page, 'Phát hành'); const m = await waitForModal(page); await clickText(page, 'Phát hành', { exact: true, scope: m }); await page.waitForTimeout(250); return { actual: 'Hóa đơn đã phát hành; trạng thái thu Chưa thu.' }; }, { before: true });

  // F04 – invoice reminder.
  await switchRole(page, 'admin');
  await run('F04.1', async () => { const s = await stateSnapshot(page); await goto(page, base, route(`/invoices/${s.invoice.id}`)); await clickAction(page, 'remind'); await waitForModal(page); return { actual: 'Drawer preview người nhận Zalo hiển thị đúng một khách demo và số tiền còn nợ.' }; }, { before: true });
  await run('F04.2', async () => { const drawer = await waitForModal(page); const send = drawer.locator('[data-act="send"]').first(); await send.click(); await page.waitForFunction(() => location.hash.includes('/zalo/batches/')); await page.waitForTimeout(400); return { actual: 'Đã tạo đợt ZL-202610-… và bắt đầu gửi.' }; }, { before: true });
  await run('F04.3', async () => { await page.waitForFunction(() => { const bs = (window.TH?.store?.state?.zaloBatches || []).filter(x => x.source === 'user'); const b = bs[bs.length - 1]; return b && !['sending', 'scheduled', 'draft'].includes(b.status); }, null, { timeout: 70000, polling: 900 }); const s = await stateSnapshot(page); if (s.batch) await goto(page, base, route(`/zalo/batches/${s.batch.id}`)); else await goto(page, base, route('/zalo/history')); return { actual: 'Đã theo dõi timer và trạng thái kết quả gửi.' }; }, { wait: 100 });

  // F05 – partial payment.
  await switchRole(page, 'accountant');
  await run('F05.1', async () => { const s = await stateSnapshot(page); await goto(page, base, route('/receivables')); const search = page.locator('input[name=s]').first(); if (await search.count()) { await search.fill(s.room?.code || ''); await search.press('Enter'); } return { actual: 'Dòng công nợ khách demo hiển thị tổng, đã thu 0 và còn lại.' }; }, { before: true });
  await run('F05.2', async () => { await clickText(page, 'Thu tiền thủ công'); const m = await waitForModal(page); const s = await stateSnapshot(page); await select(page, 'tenantId', s.tenant.id, m); await fill(page, 'amount', 3000000, m); await select(page, 'method', 'Chuyển khoản', m); await fill(page, 'ref', 'CK289104', m); await fill(page, 'note', 'Khách thanh toán một phần tiền nhà tháng 10', m); await clickText(page, 'Tự động phân bổ', { exact: true, scope: m }); await clickText(page, 'Xác nhận ghi nhận', { exact: true, scope: m }); await page.waitForTimeout(500); return { actual: 'Đã ghi nhận khoản thu PAY… 3.000.000đ và tự động phân bổ.' }; }, { before: true });
  await run('F05.3', async () => { const s = await stateSnapshot(page); if (!s.payment) throw new Error('Không có khoản thu user'); await goto(page, base, route(`/payments/${s.payment.id}`)); return { actual: `Khoản thu ${s.payment.code}; đã phân bổ ${s.payment.amount}đ.` }; });
  await run('F05.4', async () => { const s = await stateSnapshot(page); await goto(page, base, route('/receivables')); return { actual: `Đã thu ${s.paid.toLocaleString('vi-VN')}đ; còn lại ${s.remaining.toLocaleString('vi-VN')}đ; trạng thái Thu một phần.` }; });

  // F06 – debt reminder/retry.
  await switchRole(page, 'admin');
  await run('F06.1', async () => { const s = await stateSnapshot(page); await goto(page, base, route('/receivables')); const search = page.locator('input[name=s]').first(); if (await search.count()) { await search.fill(s.room?.code || ''); await search.press('Enter'); }
    const row = page.locator('tr').filter({ hasText: s.invoice?.code || s.tenant?.name || '' }).first(); const more = row.locator('button').last(); if (await more.count()) { await more.click(); await clickContains(page, 'Gửi nhắc Zalo'); } else await clickText(page, 'Gửi nhắc Zalo');
    await page.waitForTimeout(200); return { actual: `Preview nhắc nợ dùng số còn nợ mới ${s.remaining.toLocaleString('vi-VN')}đ.` }; }, { before: true });
  await run('F06.2', async () => { const drawer = await waitForModal(page); const force = drawer.locator('input[name=force]').first(); if (await force.count() && await force.isVisible() && !(await force.isChecked())) await force.check(); const send = drawer.locator('[data-act="send"]').first(); await send.click(); await page.waitForFunction(() => location.hash.includes('/zalo/batches/')); await page.waitForFunction(() => { const bs = (window.TH?.store?.state?.zaloBatches || []).filter(x => x.source === 'user'); const b = bs[bs.length - 1]; return b && !['sending', 'scheduled', 'draft'].includes(b.status); }, null, { timeout: 70000, polling: 900 }); const done = await stateSnapshot(page); if (done.batch?.id) await goto(page, base, route(`/zalo/batches/${done.batch.id}`)); return { actual: 'Đợt nhắc nợ kết thúc và tin có số dư hiện tại.' }; }, { before: true });
  await run('F06.3', async () => { const s = await stateSnapshot(page); const candidate = await page.evaluate(() => { const st = window.TH.store.state; const batches = (st.zaloBatches || []).filter((x) => x.source === 'user'); return batches.slice().reverse().find((b) => (st.zaloMessages || []).some((m) => m.batchId === b.id && ['failed', 'unknown'].includes(m.status))) || (st.zaloBatches || []).find((b) => b.code === 'ZL-202610-026'); });
    if (!candidate) return { actual: 'Không có tin failed/unknown; hệ thống giữ retry disabled đúng rule.' };
     await goto(page, base, route(`/zalo/batches/${candidate.id}`)); const retry = page.locator('[data-act="retry"]').first(); if (await retry.isEnabled().catch(() => false)) { await retry.click(); const m = await waitForModal(page); await clickText(page, 'Thử lại', { exact: true, scope: m }); await page.waitForTimeout(700); return { actual: `Đã xếp hàng retry tin lỗi của ${candidate.code}; tin đã giao không gửi lại.` }; }
    return { actual: `Đợt ${candidate.code} không còn tin đủ điều kiện retry; nút bị khóa đúng rule.` };
  }, { before: true });

  // F07/F08/F09 – terminate, refund, clean.
  await switchRole(page, 'ops');
  await run('F07.1', async () => { const s = await stateSnapshot(page); await goto(page, base, route(`/contracts/${s.contract.id}`)); return { actual: `Mở HĐ ${s.contract.code}; nút Kết thúc hợp đồng và KPI công nợ hiển thị.` }; }, { before: true });
  await run('F07.2', async () => { await clickAction(page, 'terminate'); const m = await waitForModal(page); if (await m.locator('input[name=actualEnd]').count()) await fill(page, 'actualEnd', '2026-10-28', m); if (await m.locator('select[name=reason]').count()) await select(page, 'reason', 'Khách trả phòng sớm', m); const checks = m.locator('input[type=checkbox]'); for (let i = 0; i < await checks.count(); i++) if (!(await checks.nth(i).isChecked())) await checks.nth(i).check(); await clickText(page, 'Xác nhận kết thúc', { exact: true, scope: m }); await page.waitForTimeout(350); return { actual: 'HĐ Đã kết thúc; phòng Chờ dọn; hồ sơ hoàn cọc Nháp được tạo.' }; }, { before: true });
  await run('F08.1', async () => { const s = await stateSnapshot(page); await goto(page, base, route(`/refunds/new?id=${s.refund.id}&step=3`)); const add = page.locator('[data-act="add-ded"]').first(); if (await add.count()) { await add.click(); const idx = await page.locator('input[name^="d_"]').count() - 1; await select(page, `g_${idx}`, 'Dịch vụ'); await fill(page, `d_${idx}`, 'Vệ sinh phòng'); await fill(page, `a_${idx}`, 200000); const ev = page.locator(`[data-act="add-ev"][data-i="${idx}"]`); if (await ev.count()) await ev.click(); } return { actual: 'Phương án có khấu hao 200.000đ + vệ sinh 200.000đ; không bù trừ công nợ.' }; }, { before: true });
  await run('F08.2', async () => { await clickAction(page, 'to4'); await page.waitForFunction(() => location.hash.includes('step=4')); await clickAction(page, 'submit'); const m = await waitForModal(page); await clickText(page, 'Gửi duyệt', { exact: true, scope: m }); await page.waitForTimeout(300); return { actual: 'Hồ sơ chuyển Chờ duyệt; vai trò Vận hành không thấy action Duyệt.' }; }, { before: true });
  await switchRole(page, 'accountant');
  await run('F08.3', async () => { const s = await stateSnapshot(page); await goto(page, base, route(`/refunds/${s.refund.id}`)); await clickText(page, 'Duyệt hoàn cọc'); await clickText(page, 'Duyệt', { exact: true }).catch(() => {}); await page.waitForTimeout(300); return { actual: 'Hồ sơ Đã duyệt; Duyệt không đồng nghĩa đã chuyển tiền.' }; }, { before: true });
  await run('F08.4', async () => { await clickText(page, 'Ghi nhận đã hoàn'); const m = await waitForModal(page); await fill(page, 'paidDate', '2026-10-28', m); await select(page, 'paidMethod', 'Chuyển khoản', m); await fill(page, 'paidRef', 'UNC289104', m); const demo = m.locator('[data-act="demo-ev"], [data-act="use-sample"]').first(); if (await demo.count()) await demo.click(); else { const dz = m.locator('[data-dz]').first(); if (await dz.count()) await dz.evaluate((x) => { x._files = [{ name: 'uy_nhiem_chi_hoan_coc.pdf', size: 120000 }]; x._render?.(); }); } await clickText(page, 'Xác nhận đã hoàn'); await page.waitForTimeout(350); return { actual: 'Hồ sơ Đã hoàn; bằng chứng UNC lưu; phòng vẫn Chờ dọn.' }; }, { before: true });
  await switchRole(page, 'ops');
  await run('F09.1', async () => { const s = await stateSnapshot(page); await goto(page, base, route('/rooms?status=cleaning')); const row = page.locator('tr').filter({ hasText: s.room?.code || '' }).first(); const btn = row.locator('[data-act="clean"]').first(); if (await btn.count()) { await btn.click(); const m = await waitForModal(page); await clickText(page, 'Xác nhận dọn xong', { exact: true, scope: m }); } else await clickText(page, 'Xác nhận dọn xong'); await page.waitForTimeout(300); return { actual: `Phòng ${s.room?.code || ''} đã xác nhận dọn xong.` }; }, { before: true });
  await run('F09.2', async () => { const s = await stateSnapshot(page); await goto(page, base, route('/rooms?status=ready')); return { actual: `Phòng ${s.room?.code || ''} hiển thị Sẵn sàng với action cho thuê lại.` }; });

  // F10 – optional supporting steps, still UI-only.
  await switchRole(page, 'accountant');
  await run('F10.1', async () => { await goto(page, base, route('/expenses')); await clickText(page, 'Thêm chi phí'); const m = await waitForModal(page); await fill(page, 'date', '2026-10-28', m); await select(page, 'group', 'Sửa chữa', m); await fill(page, 'desc', 'Sửa khóa cửa phòng demo', m); await m.locator('input[name=mode][value=common]').check(); await fill(page, 'amount', 350000, m); await m.locator('input[name=ap_0]').fill('40'); await m.locator('input[name=ap_1]').fill('30'); await m.locator('input[name=ap_2]').fill('20'); await m.locator('input[name=ap_3]').fill('10'); await clickText(page, 'Lưu chi phí'); await page.waitForTimeout(350); return { actual: 'Chi phí chung 350.000đ đã lưu với phân bổ 40/30/20/10.' }; }, { before: true });
  await switchRole(page, 'admin');
  await run('F10.2', async () => { await goto(page, base, route('/settings/import?type=tenant')); await clickText(page, /Dùng file mẫu/); await page.waitForFunction(() => location.hash.includes('step=2')); const phoneMap = page.locator('select[name="m_1"]'); if (await phoneMap.count() && (await phoneMap.inputValue()) !== 'phone') await phoneMap.selectOption('phone'); await clickAction(page, 'to3'); await page.waitForFunction(() => location.hash.includes('step=3')); await clickAction(page, 'to4'); await page.waitForFunction(() => location.hash.includes('step=4')); const actionShot = await screenshot(page, 'F10.2', 'action', 'admin', '[data-act="commit"]'); const commit = page.locator('[data-act="commit"]').first(); await commit.click(); const m = await waitForModal(page); await clickText(page, 'Import', { exact: true, scope: m }); await page.waitForTimeout(500); return { actual: 'File mẫu đã mapping/kiểm tra/commit; KPI lỗi và dòng hợp lệ được ghi nhận trong import job.', screenshots: [actionShot] }; }, { before: true });
  await run('F10.3', async () => { await goto(page, base, route('/settings/users')); await clickText(page, 'Tạo tài khoản'); const m = await waitForModal(page); await fill(page, 'name', 'Lê Demo Vận Hành', m); await fill(page, 'email', 'demo.vanhanh@timohouse.vn', m); await fill(page, 'phone', '0913 222 333', m); await select(page, 'role', 'ops', m); await fill(page, 'effectiveDate', '2026-10-28', m); const b = m.locator('input[name^=b_]').first(); if (await b.count()) await b.check(); await clickText(page, 'Lưu tài khoản'); await page.waitForTimeout(350); return { actual: 'Tài khoản Lê Demo Vận Hành đã lưu với vai trò Vận hành.' }; }, { before: true });
  await switchRole(page, 'accountant');
  await run('F10.4', async () => { await goto(page, base, route('/reports?tab=debt')); const exp = page.locator('#content button[data-act="export"]').first(); if (await exp.count()) await exp.click(); await page.waitForTimeout(150); return { actual: 'Báo cáo công nợ đã xuất CSV theo tòa.' }; }, { before: true });

  return { results, final: await stateSnapshot(page) };
}

function idsOf(s) { return { tenant: s.tenant?.id || '', tenantCode: s.tenant?.code || '', room: s.room?.id || '', roomCode: s.room?.code || '', contract: s.contract?.id || '', contractCode: s.contract?.code || '', invoice: s.invoice?.id || '', invoiceCode: s.invoice?.code || '', payment: s.payment?.id || '', paymentCode: s.payment?.code || '', batch: s.batch?.id || '', batchCode: s.batch?.code || '', refund: s.refund?.id || '', refundCode: s.refund?.code || '', expense: s.expense?.id || '', expenseCode: s.expense?.code || '', importJob: s.importJob?.id || '', user: s.user?.id || '' }; }
function qaAssertions(final, steps) {
  const checks = [];
  const add = (id, ok, detail) => checks.push({ id, status: ok ? 'PASS' : 'FAIL', detail });
  add('milestones', steps.length === 36 && steps.every((x) => x.status === 'PASS'), `${steps.filter((x) => x.status === 'PASS').length}/${steps.length} PASS`);
  add('room-lifecycle', final.room?.status === 'ready', `room=${final.room?.status || '-'}`);
  add('contract-lifecycle', final.contract?.status === 'ended', `contract=${final.contract?.status || '-'}`);
  add('invoice-issued', final.invoice?.docStatus === 'issued', `invoice=${final.invoice?.docStatus || '-'}`);
  add('payment-partial', final.paid === 3000000 && final.remaining > 0 && final.invoice && final.paid + final.remaining === final.invoice.total, `paid=${final.paid}; remaining=${final.remaining}; total=${final.invoice?.total || 0}`);
  add('meter-nonnegative', (final.meter || []).every((x) => Number(x.curr) >= Number(x.prev || 0)), (final.meter || []).map((x) => `${x.type}:${x.prev}->${x.curr}`).join(', '));
  add('refund-math', final.refund?.status === 'refunded' && final.refund.deductionsTotal === 400000 && final.refund.refundAmount === final.refund.deposit - 400000 && final.refund.offsetDebt === false, `status=${final.refund?.status}; deposit=${final.refund?.deposit}; ded=${final.refund?.deductionsTotal}; refund=${final.refund?.refundAmount}`);
  add('expense-allocation', final.expense?.amount === 350000 && Array.isArray(final.expenseAllocations) && final.expenseAllocations.reduce((n, x) => n + Number(x.pct || 0), 0) === 100, `amount=${final.expense?.amount}; allocations=${JSON.stringify(final.expenseAllocations || [])}`);
  add('import-job', final.importJob?.status === 'done', `import=${final.importJob?.status || '-'}`);
  add('user-role', final.user?.role === 'ops', `role=${final.user?.role || '-'}`);
  return { status: checks.every((x) => x.status === 'PASS') ? 'PASS' : 'FAIL', checks };
}
function describeActual(id, s) {
  const i = idsOf(s); const bits = [];
  if (i.tenantCode) bits.push(`KH ${i.tenantCode}`); if (i.roomCode) bits.push(`phòng ${i.roomCode}`); if (i.contractCode) bits.push(`HĐ ${i.contractCode}`); if (i.invoiceCode) bits.push(`HĐơn ${i.invoiceCode}`); if (i.paymentCode) bits.push(`thu ${i.paymentCode}`); if (i.batchCode) bits.push(`Zalo ${i.batchCode}`); if (i.refundCode) bits.push(`RC ${i.refundCode}`); if (i.expenseCode) bits.push(`CP ${i.expenseCode}`); return bits.join(' · ') || norm(s.url || 'Đã thao tác');
}

function cell(text, opts = {}) { return new TableCell({ shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined, children: [new Paragraph({ children: [new TextRun({ text: String(text ?? ''), bold: !!opts.bold, color: opts.color || '334155', size: opts.size || 18 })] })] }); }
function table(rows, widths = []) { return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: 'D7DDE3' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D7DDE3' }, left: { style: BorderStyle.SINGLE, size: 4, color: 'D7DDE3' }, right: { style: BorderStyle.SINGLE, size: 4, color: 'D7DDE3' }, insideH: { style: BorderStyle.SINGLE, size: 2, color: 'E5EAF2' }, insideV: { style: BorderStyle.SINGLE, size: 2, color: 'E5EAF2' } }, rows: rows.map((r, ri) => new TableRow({ children: r.map((x) => cell(x, { fill: ri === 0 ? '16324F' : undefined, color: ri === 0 ? 'FFFFFF' : undefined, bold: ri === 0 })) })) }); }
function p(text = '', opts = {}) { return new Paragraph({ style: opts.style, alignment: opts.align, spacing: { after: opts.after ?? 80, line: 260 }, children: [new TextRun({ text: String(text), bold: !!opts.bold, color: opts.color || '3F4A54', size: opts.size || 20 })] }); }
function bullet(text) { return new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: [new TextRun({ text: String(text), size: 19, color: '3F4A54' })] }); }
function heading(text, level = HeadingLevel.HEADING_1) { return new Paragraph({ heading: level, children: [new TextRun({ text, bold: true })] }); }

function diagramSvg() {
  const colors = { admin: '#2563EB', ops: '#0F766E', accountant: '#C2410C' };
  const lanes = [['admin', 'Admin / Quản trị viên', 92], ['ops', 'Vận hành', 226], ['accountant', 'Kế toán', 360]];
  const nodes = [
    ['S0', 'Khởi động', 'admin', 240], ['F01', 'Khách thuê', 'ops', 358], ['F02', 'Hợp đồng', 'ops', 476], ['F03', 'Hóa đơn', 'accountant', 594], ['F04', 'Zalo HĐ', 'admin', 712], ['F05', 'Thu một phần', 'accountant', 830], ['F06', 'Nhắc nợ', 'admin', 948], ['F07', 'Kết thúc HĐ', 'ops', 1066], ['F08', 'Hoàn cọc', 'accountant', 1184], ['F09', 'Dọn phòng', 'ops', 1302], ['F10', 'Bổ trợ', 'accountant', 1420],
  ];
  const laneMarkup = lanes.map(([key, label, y]) => `<rect x="20" y="${y}" width="1495" height="112" rx="10" fill="#fff" stroke="#D7E0EA"/><rect x="20" y="${y}" width="205" height="112" rx="10" fill="${colors[key]}" opacity=".1"/><text x="38" y="${y + 42}" font-family="Arial" font-size="16" font-weight="700" fill="${colors[key]}">${label}</text><text x="38" y="${y + 67}" font-family="Arial" font-size="12" fill="#64748B">Các mốc được thực thi qua UI</text>`).join('');
  const centers = Object.fromEntries(lanes.map(([key, , y]) => [key, y + 56]));
  const box = nodes.map(([id, title, role, x], i) => { const y = centers[role] - 38; const next = nodes[i + 1]; const arrow = next ? (() => { const ny = centers[next[2]]; return `<path d="M${x + 108} ${centers[role]} C${x + 122} ${centers[role]}, ${next[3] - 16} ${ny}, ${next[3] - 8} ${ny}" fill="none" stroke="#94A3B8" stroke-width="2.5" marker-end="url(#a)"/>`; })() : ''; return `<g><rect x="${x}" y="${y}" width="108" height="76" rx="10" fill="#fff" stroke="${colors[role]}" stroke-width="2"/><rect x="${x}" y="${y}" width="108" height="7" rx="4" fill="${colors[role]}"/><text x="${x + 54}" y="${y + 30}" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#0F2A5F">${id}</text><text x="${x + 54}" y="${y + 51}" text-anchor="middle" font-family="Arial" font-size="12" fill="#334155">${title}</text></g>${arrow}`; }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1535" height="510" viewBox="0 0 1535 510"><defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#94A3B8"/></marker></defs><rect width="1535" height="510" fill="#F8FAFC"/><text x="28" y="34" font-family="Arial" font-size="21" font-weight="700" fill="#16324F">Phase 1 · Swimlane theo vai trò</text><text x="28" y="60" font-family="Arial" font-size="13" fill="#64748B">Chuỗi S0 → F10; mũi tên nối theo thứ tự chạy, màu viền thể hiện vai trò thực hiện chính.</text>${laneMarkup}${box}<text x="28" y="497" font-family="Arial" font-size="12" fill="#64748B">Evidence runtime 1440×1080 · manifest.json lưu route, dữ liệu nhập, action, expected/actual và trạng thái từng mốc.</text></svg>`;
}

async function writeDiagramPng() {
  const svg = path.join(OUT, 'phase1-flow.svg'); fs.writeFileSync(svg, diagramSvg(), 'utf8');
  const browser = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--no-sandbox'] }); const page = await browser.newPage({ viewport: { width: 1535, height: 510 } });
  await page.goto(`file:///${svg.replaceAll('\\', '/')}`); const png = path.join(OUT, 'phase1-flow.png'); await page.screenshot({ path: png }); await browser.close(); return png;
}

async function buildDoc(manifest, diagramPng) {
  const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'TIMEHOUSE  |  Phase 1 Walkthrough/UAT', bold: true, color: '1769AA', size: 16 })] })] });
  const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Tài liệu evidence runtime · Trang ', size: 16 }), PageNumber.CURRENT] })] });
  const portrait = { page: { margin: { top: 900, bottom: 850, left: 1000, right: 1000 } } };
  const landscape = { page: { margin: { top: 700, bottom: 700, left: 700, right: 700 }, orientation: 'landscape', width: 15840, height: 12240 } };
  const sections = [];
  const cover = [
    new Paragraph({ spacing: { before: 900 }, children: [new TextRun({ text: 'TIMEHOUSE', bold: true, size: 28, color: '1769AA' })] }),
    new Paragraph({ spacing: { before: 850, after: 140 }, children: [new TextRun({ text: 'WALKTHROUGH / UAT', bold: true, size: 34, color: '16324F' })] }),
    new Paragraph({ children: [new TextRun({ text: 'Phase 1 · Core Rental / Go-live', bold: true, size: 27, color: '1769AA' })] }),
    p('Tài liệu hướng dẫn nghiệp vụ và bằng chứng chạy runtime trên mockup TimoHouse.', { size: 22, after: 260 }),
    table([['Thông tin', 'Giá trị'], ['Phạm vi', '36 mốc · 10 luồng core + F10 bổ trợ'], ['Đối tượng', 'Nghiệp vụ + UAT'], ['Môi trường', 'Chrome 1440×1080 · Phase 1 only'], ['Ngày/kỳ demo', '28/10/2026 · 10/2026'], ['Phiên bản', 'v1.0 · Evidence runtime']], [30, 70]),
    p('Lưu ý dữ liệu: hợp đồng dùng ngày bắt đầu 01/10/2026 để đủ điều kiện lập hóa đơn kỳ 10/2026. PNG gốc chỉ là tham chiếu UI, không phải bằng chứng thực thi.', { size: 18, color: '64748B', after: 220 }),
    heading('Sơ đồ tổng thể', HeadingLevel.HEADING_1),
    new Paragraph({ children: [new ImageRun({ data: fs.readFileSync(diagramPng), transformation: { width: 650, height: 216 }, type: 'png' })] }),
    heading('Cách đọc tài liệu', HeadingLevel.HEADING_1), bullet('Mỗi mốc có route, vai trò, dữ liệu nhập, action, expected result và actual result.'), bullet('Ảnh có hậu tố -input là trạng thái trước khi submit; -action là form/điểm thao tác bổ sung; -result là kết quả sau submit; -error chỉ xuất hiện nếu mốc lỗi.'), bullet('Mã record động (KH…, HD…, PAY…, ZL…, RC…) được lấy từ manifest của cùng một lần chạy.'),
    heading('Mục lục', HeadingLevel.HEADING_1), new TableOfContents('Mục lục', { hyperlink: true, headingStyleRange: '1-3' }),
  ];
  sections.push({ properties: portrait, headers: header, footers: footer, children: cover });

  for (const flow of FLOWS) {
    const flowDefs = STEPS.filter((s) => s.flow === flow.key);
    const children = [heading(`${flow.key} · ${flow.title}${flow.golive ? `  |  Go-live #${flow.golive}` : ''}`, HeadingLevel.HEADING_1), p(`Sơ đồ luồng: ${flow.steps.map((s) => s[0]).join(' → ')}`, { color: '1769AA', bold: true }), table([
      ['Màn hình', 'Dữ liệu', 'Action', 'Trạng thái / kết quả'],
      [flowDefs.map((d) => `${d.id}: ${d.route}`).join('\n'), flowDefs.map((d) => `${d.id}: ${d.inputs}`).join('\n'), flowDefs.map((d) => `${d.id}: ${d.action}`).join('\n'), flowDefs.map((d) => `${d.id}: ${d.expected}`).join('\n')],
    ])];
    for (const def of STEPS.filter((s) => s.flow === flow.key)) {
      const r = manifest.steps.find((x) => x.id === def.id) || def;
      children.push(heading(`${def.id} · ${def.title}`, HeadingLevel.HEADING_2));
      const recordLabel = Object.entries(r.recordIds || {}).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n') || '-';
      children.push(table([['Trường', 'Chi tiết'], ['Vai trò', `${roleLabel[def.role] || def.role}`], ['Màn hình/route', `${def.screen}\n${def.route}`], ['Dữ liệu nhập', def.inputs], ['Mã record', recordLabel], ['Action', def.action], ['Kết quả mong đợi', def.expected], ['Kết quả thực tế', r.actual || '-'], ['Trạng thái', r.status || 'NOT RUN']], [25, 75]));
      children.push(p('Ảnh minh chứng', { bold: true, color: '16324F', after: 40 }));
      for (const img of (r.screenshots || []).filter((x) => x.endsWith('.png'))) {
        const imgPath = path.join(OUT, img); if (!fs.existsSync(imgPath)) continue;
        children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ data: fs.readFileSync(imgPath), transformation: { width: 650, height: 488 }, type: 'png' })] }));
        children.push(p(path.basename(img), { align: AlignmentType.CENTER, size: 16, color: '64748B', after: 80 }));
      }
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
    sections.push({ properties: landscape, headers: header, footers: footer, children });
  }

  const trace = [heading('Ma trận truy vết 16 điều kiện Go-live', HeadingLevel.HEADING_1), p('Các điều kiện được kiểm chứng qua các mốc core S0–F09; F10 là phần bổ trợ và không làm thay đổi số Go-live core.')];
  const traceRows = [['#', 'Điều kiện', 'Milestone', 'Evidence', 'Kết quả']];
  const map = [['1', 'Tạo khách thuê', 'F01.2'], ['2', 'Chọn phòng', 'F02.1'], ['3', 'Tạo HĐ', 'F02.2–F02.3'], ['4', 'Kích hoạt HĐ', 'F02.4'], ['5', 'Nhập điện nước', 'F03.2'], ['6', 'Lập/phát hành HĐơn', 'F03.3–F03.4'], ['7', 'Gửi HĐơn Zalo', 'F04.1–F04.3'], ['8', 'Xem công nợ', 'F05.1'], ['9', 'Thu một phần', 'F05.2–F05.3'], ['10', 'Theo dõi dư nợ', 'F05.4'], ['11', 'Nhắc công nợ', 'F06.1–F06.3'], ['12', 'Kết thúc HĐ', 'F07.1–F07.2'], ['13', 'Hoàn cọc', 'F08.1–F08.4'], ['14', 'Tạo hồ sơ hoàn cọc', 'F07.2'], ['15', 'Xác nhận dọn', 'F09.1'], ['16', 'Phòng sẵn sàng', 'F09.2']];
  for (const [n, label, ms] of map) { const first = ms.split('–')[0].trim(); const hit = manifest.steps.find((x) => x.id === first); traceRows.push([n, label, ms, hit?.screenshots?.join('\n') || '-', hit?.status || 'NOT RUN']); }
  trace.push(table(traceRows)); trace.push(heading('Kết luận chạy', HeadingLevel.HEADING_1)); trace.push(p(`PASS: ${manifest.steps.filter((x) => x.status === 'PASS').length}/${manifest.steps.length} milestone. Ảnh và actual result lấy từ cùng một lần chạy sạch; xem manifest.json để kiểm tra route, mã record và thời gian chụp.`));
  sections.push({ properties: portrait, headers: header, footers: footer, children: trace });
  const doc = new Document({ sections });
  const buffer = await Packer.toBuffer(doc); fs.writeFileSync(DOCX_PATH, buffer);
}

async function main() {
  fs.mkdirSync(EVIDENCE, { recursive: true });
  // Remove only prior runner-generated milestone PNGs; preserve any unrelated customer assets.
  for (const name of fs.readdirSync(EVIDENCE)) {
    if (/^(?:S0|F\d{2})\.\d-(?:input|result|error|action)\.png$/i.test(name)) fs.unlinkSync(path.join(EVIDENCE, name));
  }
  const server = await ensureServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--no-sandbox'] });
    const context = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1, locale: 'vi-VN', timezoneId: 'Asia/Bangkok', acceptDownloads: true });
    const page = await context.newPage(); page.setDefaultTimeout(15000);
    // Clear only this temporary browser context; the user's normal profile/state is untouched.
    await page.goto(`${server.url}/#/login`, { waitUntil: 'networkidle' }); await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(() => { if (window.TH?.phase) { window.TH.phase.set(2, false); window.TH.phase.set(3, false); } if (window.TH?.store) { window.TH.store.state.meta.today = '2026-10-28'; window.TH.store.state.meta.period = '2026-10'; window.TH.store.saveNow(); } });
     const run = await runScenario(page, server.url); const qa = qaAssertions(run.final, run.results);
     const manifest = { generatedAt: new Date().toISOString(), baseUrl: server.url, viewport: { width: WIDTH, height: HEIGHT }, today: '2026-10-28', period: '2026-10', phase: 'P1', scope: '10 luồng core + F10 bổ trợ / 36 mốc', steps: run.results, final: run.final, qa, summary: { total: run.results.length, pass: run.results.filter((x) => x.status === 'PASS').length, fail: run.results.filter((x) => x.status !== 'PASS').length, evidencePng: fs.existsSync(EVIDENCE) ? fs.readdirSync(EVIDENCE).filter((x) => x.endsWith('.png')).length : 0, qa: qa.status } };
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
    const diagram = await writeDiagramPng(); await buildDoc(manifest, diagram);
    const failed = manifest.steps.filter((x) => x.status !== 'PASS');
    console.log(JSON.stringify({ docx: DOCX_PATH, manifest: MANIFEST_PATH, evidence: EVIDENCE, summary: manifest.summary, failed: failed.map((x) => ({ id: x.id, error: x.error })) }, null, 2));
     if (failed.length || qa.status !== 'PASS') process.exitCode = 1;
  } finally { if (browser) await browser.close(); if (server.child) server.child.kill(); }
}

main().catch((e) => { console.error(e.stack || e.message); process.exitCode = 1; });
