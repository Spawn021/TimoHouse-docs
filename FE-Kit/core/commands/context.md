---
description: Quét source của repo và điền context dự án trong docs/frontend-context/ (stack, lệnh, quy ước thư mục, design system, đề xuất feature mẫu). Chạy một lần sau khi cài kit, hoặc khi stack thay đổi.
argument-hint: "[ghi chú/phạm vi, ví dụ: chỉ design, feature mẫu là src/features/orders]"
---

Điền context dự án cho repo này: $ARGUMENTS

Lệnh này chạy inline, không delegate, không phải mode: không tạo task folder, không cập nhật `workflow-status.md`, không chạy `mode begin`/`mode end` hay tool `fe_*`. Chỉ được ghi 3 file `docs/frontend-context/project-source-context.md`, `docs/frontend-context/design-context.md`, `docs/frontend-context/feature-source-context.md`. Không sửa `docs/frontend-context/README.md`, source hay file nào khác, không cài package, không chạy lệnh làm thay đổi repo (lệnh chỉ đọc như `git ls-files` thì được).

Argument (nếu có) là ghi chú của người dùng: phạm vi cần điền, feature mẫu họ chỉ định, thông tin không đọc được từ source. Thông tin người dùng đưa có ưu tiên cao hơn suy luận từ source.

## 1. Đọc hiện trạng

1. Đọc 3 file context. Thiếu file thì tạo từ template `.frontend-delivery/templates/shared-context/` (nếu không có thì từ `templates/shared-context/` của skill `frontend-delivery-standard`).
2. So từng ô với template cùng tên trong `.frontend-delivery/templates/shared-context/`: ô **giống template** (rỗng, danh sách lựa chọn như `React Query / SWR / Khác`, hay giá trị mặc định như `TypeScript`) là chưa điền, được ghi đè; ô **khác template** là team đã điền: **giữ nguyên**. Nếu source cho thấy giá trị đó đã sai, không sửa mà ghi vào mục "Cần xác nhận".

## 2. Quét source (đọc có chọn lọc, không đọc toàn bộ source)

Đọc theo thứ tự, dừng khi đủ bằng chứng cho từng ô:

- `package.json` (dependencies, devDependencies, scripts, `packageManager`), lockfile để biết package manager (`package-lock.json` → npm, `yarn.lock` → yarn, `pnpm-lock.yaml` → pnpm, `bun.lockb`/`bun.lock` → bun).
- Cấu hình: `tsconfig*.json` (alias path), `vite.config.*`/`next.config.*`/`craco`/`webpack`, lint/format (`.eslintrc*`, `eslint.config.*`, `.oxlintrc*`, `.prettierrc*`, `biome.json`), test (`vitest.config.*`, `jest.config.*`, `playwright.config.*`), CSS (`tailwind.config.*`, `uno.config.*`, `postcss.config.*`), `.env.example`.
- Cây thư mục `src/` (hoặc `app/`, `apps/*/src`) tối đa 3 cấp để suy ra quy ước: pages/routes, features/modules, components dùng chung, api/services, hooks, store, schemas, utils, i18n, tests.
- Mỗi concern chỉ mở 1–2 file đại diện (riêng việc đánh giá ứng viên feature mẫu được mở tới khoảng 5 file mỗi ứng viên): entry (`main.tsx`, `app/layout.tsx`), router, API client (axios instance/fetch wrapper, interceptor xử lý lỗi), store, một form, file i18n, theme/token, thư mục icon/asset, component Button/Input/Modal/Toast dùng chung, ErrorBoundary.

## 3. Điền

Quy tắc chung cho mọi ô:

- Mỗi giá trị suy ra từ source phải kèm path làm bằng chứng, ví dụ `React Query v5 (package.json, src/api/queryClient.ts)`.
- Không đọc được từ source: trong ô ghi ngắn `Cần xác nhận: <điều cần hỏi>`, chi tiết và gợi ý ghi ở bảng "Cần xác nhận" cuối file. Repo thật sự không dùng: ghi `Không dùng`. Không bịa giá trị.
- Ô cần nội dung dài (ví dụ danh sách "Không nên copy"): ô ghi tóm tắt và trỏ tới danh sách ngay dưới bảng.
- Lệnh trong mục Commands lấy từ `scripts` của `package.json` (ghi đúng cú pháp của package manager, ví dụ `yarn lint`). Ngoại lệ: Install ghi lệnh cài của package manager (`yarn install`, `npm ci`…); không có script typecheck thì ghi lệnh tương đương kèm `(suy ra, chưa có script)`, ví dụ `npx tsc --noEmit`; không có script test thì ghi `Không dùng` nếu repo không cài test runner, `Cần xác nhận` nếu đã cài mà không có script/config.

Từng file:

- **`project-source-context.md`**: bảng stack, commands, folder convention. Mục 4 giữ các gạch đầu dòng của template, thêm khối `Quy ước quan sát được:` ngay dưới: alias import, thứ tự import, format, cách đặt tên file, cách export, xử lý lỗi API, biến môi trường, kèm path ví dụ.
- **`design-context.md`**: mục 1–2 và 4 theo source (UI library, đường dẫn component dùng chung, token/theme, icon, asset; mỗi UI need ghi component thật đang dùng hoặc `Chưa có`). Giữ nguyên mục 3 (Figma rule) và 5 (Visual deviation rule) của template trừ khi người dùng yêu cầu khác.
- **`feature-source-context.md`**: **không tự chọn feature mẫu làm chuẩn.** Đề xuất tối đa 2 ứng viên (feature đầy đủ page + API + state + xử lý lỗi, code gọn, ít anti-pattern), ghi `Có feature mẫu chuẩn không?` = `Chưa xác định — đề xuất, chờ team duyệt`, `Mức độ tin cậy` theo đánh giá, và `Không nên copy phần nào` nếu thấy anti-pattern. Người dùng đã chỉ định feature mẫu trong argument thì dùng feature đó và ghi `Có`. Repo chưa có feature nào thì ghi `Chưa có feature mẫu chuẩn`.

Frontmatter: `last_updated` là ngày hôm nay dạng `YYYY-MM-DD` (không biết ngày thì lấy từ lệnh `date` hoặc `git log -1 --format=%cs`); `status: draft` cho tới khi team duyệt, kể cả khi template ghi sẵn `active`; không đổi `owner` đã có.

Cuối mỗi file thêm (hoặc cập nhật) mục:

```markdown
## Cần xác nhận

| # | Ô / chủ đề | Điều cần xác nhận | Gợi ý từ source |
|---|---|---|---|
```

Không có gì cần xác nhận thì ghi `Không có`. Phát hiện quan trọng ngoài phạm vi context (file secret bị commit, git hook nguy hiểm, cấu hình mâu thuẫn) cũng ghi vào bảng này của `project-source-context.md`; không mở nội dung file nghi chứa secret.

## 4. Kết thúc

Trả lời người dùng ngắn gọn:

1. Đã điền những gì ở mỗi file (vài dòng, không dán lại nội dung file).
2. Danh sách "Cần xác nhận" gộp từ 3 file, quan trọng nhất trước.
3. Ứng viên feature mẫu và cách duyệt: sửa `Có feature mẫu chuẩn không?` thành `Có` trong `feature-source-context.md`, hoặc chạy lại lệnh này kèm `feature mẫu là <path>`.
4. Nhắc: đọc lại, sửa chỗ sai, đổi `status` sang `active` khi đã duyệt, rồi commit `docs/frontend-context/`.

## Ngôn ngữ output

Viết bằng tiếng Việt có dấu đầy đủ. Giữ nguyên code/path/command/API field/DTO/error code/route/package/SRS section.

Cache marker: `vi-diacritics-rules-folder-v1.0.0`
