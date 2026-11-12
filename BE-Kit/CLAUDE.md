# BE-Kit — hướng dẫn cho người bảo trì kit

Repo này là **mã nguồn của kit backend**, không phải repo dự án dùng kit.

## Nguồn duy nhất

- Nội dung và gate của BE nằm trong `packages/pack-be/`: `pack.yaml`, `rules/`, `templates/`, `commands/`, `agents/`, `SKILL.md`, `plugin/` (manifest, hook, MCP của plugin Claude Code), `adapters/`, `src/`. CLI ở `bin/be-kit.mjs`.
- Không sửa tay output generate: `standalone/be-kit.mjs`, `plugins/be/`, `.claude-plugin/marketplace.json`, `packages/pack-be/src/manifest.gen.mjs`. Sửa nguồn rồi chạy `npm run build`.
- Version chỉ đổi ở `package.json` gốc; `build/bundle.mjs` đồng bộ sang các package.

## Engine

`packages/engine/` là **bản copy** engine của FE-Kit (2.7.0, commit `b15378a`), đổi scope package sang `@backend-delivery-kit` và biến môi trường sang `BE_KIT_*`. Hai bản engine độc lập: sửa lỗi engine ở bên nào thì cân nhắc mang sang bên kia. Engine không được nhắc khái niệm của domain; dữ liệu của BE đi qua `pack.yaml` hoặc object pack.

## Kiểm tra trước khi xong việc

```bash
npm run build && npm run build:check
npm test        # gate của pack-be + CLI, hook, MCP trên bản bundle
claude plugin validate ./plugins/be --strict
```

Test CLI, hook và MCP chạy trên bản bundle, nên phải `npm run build` trước `npm test`.

Eval hành vi (`evals/`, `npm run eval:*`) gọi Claude thật, tốn hạn mức/chi phí: chỉ chạy khi được yêu cầu. Sửa rule, prompt hay gate thì chạy `npm test` để `tests/evals.test.mjs` kiểm các case còn đúng (không tốn API).

## Quy ước

- Gate riêng của BE nằm trong `packages/pack-be/src/`, không đặt trong CLI, hook hay MCP script. Mỗi gate mới cần ít nhất một test pass và một test fail.
- Schema `workflow-status.md` phải tương thích ngược: không xoá field, không bắt buộc field mới.
- Artifact và tài liệu viết tiếng Việt có dấu đầy đủ; commit message tiếng Anh.
