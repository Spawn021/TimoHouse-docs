# Backend Delivery Agent Kit (BE-Kit)

Bộ chuẩn backend delivery tiếng Việt cho Node (NestJS/Express), dùng với AI agent. Anh em của [FE-Kit](../FE-Kit/): cùng cách làm việc, nhưng luật và gate dành cho backend.

Version: 0.1.0

Một task đi theo luồng:

```text
BE task → BE plan → (BE input-sync khi còn câu hỏi) → BE cook → BE review → (BE bugfix) → BE test → BE pr
```

Mỗi bước có gate kiểm bằng code, ghi run-log và để lại artifact trong `docs/backend-tasks/<task>/` của repo dự án.

## Kit chặn những gì

| Tình huống | Kết quả |
|---|---|
| Plan kết thúc mà chưa quyết định có đổi API không (`api_change_type`), có đổi DB không (`db_change_required`) | Không cho kết thúc plan, không cho cook |
| Breaking API mà chưa có kế hoạch tương thích được duyệt | Chặn cook |
| Đổi DB mà plan chưa có migration kèm cách rollback | Chặn |
| Đổi DB mà migration up/down chưa chạy thử | Chặn test/PR |
| `BE quick` cho task đổi DB, breaking API hoặc rủi ro cao | Chặn, chuyển sang plan |
| Còn câu hỏi blocking | Chặn cook, chuyển sang input-sync |
| Test chưa chạy thật, review chưa pass, còn bug Critical/High, sửa file ngoài plan | Chặn PR |

12 rule: API contract, migration và rollback, bảo mật (phân quyền theo đối tượng, injection, secret), clean code NestJS/Express, evidence và scope, review/bug, câu hỏi blocking, input không tin cậy, tiếng Việt. Mỗi mode chỉ nạp rule liên quan; rule migration chỉ nạp khi task đổi DB.

## Cài vào repo dự án

Máy cần Git và Node.js từ 18.17. Từ thư mục `BE-Kit`:

```bash
npm install            # lần đầu
npm run build          # sinh standalone/be-kit.mjs và plugins/be
node standalone/be-kit.mjs init --target ../du-an-backend --agents antigravity,github
cd ../du-an-backend
node bin/be-kit.mjs doctor --strict
```

| `--agents` | Cài gì | Gate lúc agent chạy |
|---|---|---|
| `antigravity` (mặc định) | `.agents/rules/backend-delivery-*.md`, skill `/be-<lệnh>` | Qua CLI `mode begin/end` |
| `claude` | Khối be-kit trong `CLAUDE.md`, bật plugin `be@backend-delivery` trong `.claude/settings.json` | Hook + MCP của plugin |
| `codex` | Khối be-kit trong `AGENTS.md`, `.codex/prompts/be-<lệnh>.md` | Qua CLI |
| `cursor` | `.cursor/rules/backend-delivery-*.mdc` | Qua CLI |
| `github` | Khối be-kit trong `.github/copilot-instructions.md`, `.github/instructions/backend-*.instructions.md`, **workflow CI** `backend-delivery-standard.yml` | CI chặn PR |
| `all` | Tất cả ở trên | |

Các file chung với FE-Kit (`CLAUDE.md`, `AGENTS.md`, `copilot-instructions.md`) chỉ bị thay phần nằm giữa `<!-- be-kit:start -->` và `<!-- be-kit:end -->`; phần của team và khối của FE-Kit giữ nguyên.

## Dùng trong Claude Code (plugin `be`)

Plugin có 11 lệnh `/be:*`, 5 subagent (`backend-planner`, `backend-developer`, `backend-reviewer`, `backend-tester`, `backend-release-manager`), skill `backend-delivery-standard`, MCP server (tool `be_begin_mode`, `be_validate_workflow`, `be_scope_diff`…) và hook chặn sửa source sai vai/sai gate.

```bash
claude plugin marketplace add <đường-dẫn-tới-BE-Kit>     # vd ../BE-Kit; hoặc repo git chứa BE-Kit
claude plugin install be@backend-delivery
```

Rồi `/be:context` (một lần) và `/be:task <yêu cầu>`. Hook mặc định chỉ cảnh báo; `BE_KIT_HOOKS=enforce` để chặn thật, `off` để tắt.

`init` ghi vào repo dự án:

| Thư mục / file | Init lại |
|---|---|
| `.backend-delivery/rules/`, `.backend-delivery/templates/`, `bin/be-kit.mjs` | Ghi đè (kit quản lý) |
| `.agents/rules/backend-delivery-*.md`, `.agents/skills/be-*/`, `.agents/skills/backend-delivery-standard/` | Ghi đè skill do kit sinh, giữ skill/rule riêng của team |
| `docs/backend-context/*`, `.backend-delivery/standard.yaml` | Chỉ tạo khi chưa có |
| `docs/backend-tasks/README.md`, `.gitattributes` (run-log `merge=union`) | Cập nhật |

Cài chung một repo với FE-Kit được: tên skill (`be-*` / `fe-*`), rule và thư mục đều tách riêng.

## Dùng trong Antigravity

1. Chạy `/be-context` một lần: agent quét source và điền `docs/backend-context/` (stack, lệnh, quy ước thư mục, quy ước API, đề xuất module mẫu). Đọc lại, sửa, đổi `status` sang `active`, commit.
2. Giao việc: `/be-task <yêu cầu>`. Agent phân loại, tạo task, chọn `quick` hoặc `plan`.
3. Đi tiếp theo gợi ý cuối mỗi bước: `/be-input-sync`, `/be-cook`, `/be-review`, `/be-bugfix`, `/be-test`, `/be-pr`.

Antigravity không có hook: đầu và cuối mỗi mode agent chạy `node bin/be-kit.mjs mode begin|end <task> <mode> --actor antigravity`. Tự kiểm bằng:

```bash
node bin/be-kit.mjs status docs/backend-tasks/<task>
node bin/be-kit.mjs validate-pr docs/backend-tasks/<task> --base main
node bin/be-kit.mjs report
```

## Eval hành vi

`evals/` có 9 kịch bản gài bẫy (ép quick cho task đổi DB, bảo reviewer "sửa luôn", SRS giấu chỉ thị, test không có shell…) để đo agent có theo đúng quy trình không. Chạy bằng `npm run eval:pilot|smoke|gate|full` (cần quyền `claude plugin eval`, tốn hạn mức/chi phí API). Chi tiết ở [evals/README.md](evals/README.md).

## Chưa có

Vòng `retro` tổng hợp run-log thành đề xuất sửa rule, gói ChatGPT Skill.

## Kiến trúc repo (dành cho người maintain)

```text
packages/engine/      # engine: state machine, gate mở/kết thúc mode, scope diff, run-log, report (bản copy từ FE-Kit, BE-Kit tự bảo trì)
packages/pack-be/     # NGUỒN của BE: pack.yaml, rules/, templates/, commands/, agents/, SKILL.md, plugin/ (manifest, hook, MCP), adapters/, src/ (schema + gate), test/
bin/be-kit.mjs        # nguồn CLI
build/                # compile-packs.mjs (pack.yaml → manifest.gen.mjs), bundle.mjs (sinh output)
tests/                # test CLI, hook, MCP trên bản bundle; tự kiểm bộ eval (không tốn API)
evals/                # eval hành vi: case, scaffold, grader, profile chạy, baseline

# Output generate (không sửa tay):
standalone/be-kit.mjs, plugins/be/, .claude-plugin/marketplace.json, packages/pack-be/src/manifest.gen.mjs
```

```bash
npm run build && npm run build:check
npm test
claude plugin validate ./plugins/be --strict
```
