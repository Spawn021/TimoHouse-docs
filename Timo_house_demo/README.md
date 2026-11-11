# TimoHouse UI Mockup – Tách theo 3 Phase

Tổng số mockup: **49**.

- Phase 1 – Core Rental / Go-live: **27 màn**
- Phase 2 – Sales, Automation & Operations: **18 màn**
- Phase 3 – Enterprise & Investment: **4 màn**

## Nguyên tắc

Phase 1 đủ để công ty vận hành quy trình cho thuê thực tế và có thông báo hóa đơn/công nợ qua Zalo. Phase 2 bổ sung CRM, automation, bảo trì và báo cáo nâng cao. Phase 3 dành cho tài sản, nhân sự và đầu tư/cổ đông.

Xem `00_SCOPE_3_PHASE.md` để biết scope chi tiết. `INDEX.tsv` liệt kê vị trí của từng mockup.

## Mockup tương tác & Deploy lên Netlify

Mockup click-through nằm trong `mockup/` (static SPA vanilla JS, không bundler) – dựng đủ 3 phase, bật/tắt Phase 2 và Phase 3 bằng công tắc trong *Công cụ nâng cao*. Xem `mockup/README.md` để biết tài khoản demo và kịch bản; kế hoạch từng phase: `Timehouse-Mockup-Plan-Phase1-v1.0.md`, `-Phase2-`, `-Phase3-`.

### Chạy local
```bash
npm run dev        # phục vụ mockup/ tại http://localhost:8765 (Node >= 20, không cần npm install)
npm run check      # kiểm tra cú pháp toàn bộ JS
npm run build      # mockup/ -> dist/ (gắn ?v=<git sha> chống cache, sinh _redirects/_headers/build.json)
npm run dev:dist   # xem thử đúng bản sẽ publish
npm run zip        # build + nén dist/ thành timohouse-mockup.zip (khi cần upload tay)
```
Hoặc chỉ cần double-click `mockup/index.html`.

### Deploy Netlify – cách 1: kết nối Git (khuyên dùng)
1. Push nhánh `main` lên GitHub (`https://github.com/Truong2/Timo_house_demo`).
2. Netlify → **Add new site → Import an existing project → GitHub** → chọn repo.
3. Netlify tự đọc `netlify.toml` (build `npm run build`, publish `dist`, Node 20) – **không cần điền** Build command / Publish directory. Bấm **Deploy**.
4. Mỗi lần push `main` = một deploy mới; push nhánh khác = Deploy Preview có URL riêng để review.

### Deploy Netlify – cách 2: Netlify Drop (không cần Git)
`npm run build` rồi kéo thả **thư mục `dist/`** (không phải thư mục gốc repo, không phải `mockup/`) vào https://app.netlify.com/drop.

### Deploy Netlify – cách 3: CLI
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### Lưu ý
- Dữ liệu demo nằm trong localStorage của trình duyệt người xem. Sau khi deploy bản có seed mới, người xem bấm **Công cụ nâng cao → Đặt lại dữ liệu demo** để nhận dữ liệu mới.
- `dist/` được gắn `?v=<git sha>` cho JS/CSS nên không phải Ctrl+F5 sau mỗi deploy.
- `dist/`, `node_modules/`, `.playwright-mcp/` không được commit (xem `.gitignore`).
