# Changelog

Mọi thay đổi đáng chú ý của BE-Kit được ghi tại đây. Định dạng theo [Keep a Changelog](https://keepachangelog.com/), version theo [SemVer](https://semver.org/lang/vi/).

## [0.1.0] — chưa phát hành

Bản đầu tiên (giai đoạn 1), tách thành kit riêng cạnh FE-Kit; engine copy từ FE-Kit 2.7.0.

### Thêm

- Pack BE cho backend Node (NestJS/Express): 8 mode (plan, quick, input-sync, cook, bugfix, review, test, pr) cùng lệnh `task`, `new-task`, `context`; 12 rule; template task và `docs/backend-context/`.
- Gate bằng code: plan phải quyết định `api_change_type` và `db_change_required` và kết luận (`PLAN_NOT_CONCLUDED`); breaking API cần `api_compat_status` passed/waived trước cook; đổi DB cần plan có migration kèm rollback, và migration up/down đã kiểm trước test/PR; quick bị chặn khi đổi DB, breaking API hoặc rủi ro cao; câu hỏi blocking chặn cook; PR cần review và test passed, test evidence chạy thật, không còn bug Critical/High, không sửa ngoài plan.
- CLI `be-kit`: `init --agents antigravity`, `doctor`, `new-task`, `status`, `next`, `mode begin/end`, `validate-task`, `validate-workflow`, `validate-pr`, `report`; bundle ra `standalone/be-kit.mjs`.
- Adapter Antigravity: rule `.agents/rules/backend-delivery-*.md`, skill `/be-<lệnh>` sinh từ `commands/`, skill chung `backend-delivery-standard`.
- Plugin Claude Code `be` (marketplace `backend-delivery`): 11 lệnh `/be:*` (lệnh của mode giao cho subagent, `quick` chạy inline với gate MCP), 5 subagent `backend-*` kèm giao thức chung, skill kèm rule/template, MCP server (`be_begin_mode`, `be_new_task`, `be_validate_workflow`, `be_scope_diff`, `be_next_step`, `be_task_status`, `be_list_tasks`, `be_validate_task`) và hook (`BE_KIT_HOOKS=off|warn|enforce`), dựng từ `createMcpTools`/`runHook` của engine.
- `be-kit init --agents` nhận thêm `claude` (khối `CLAUDE.md`, bật plugin), `codex` (khối `AGENTS.md`, `.codex/prompts/be-<lệnh>.md`), `cursor` (`.cursor/rules/backend-delivery-*.mdc`), `github` (khối `copilot-instructions.md`, instructions theo path, workflow CI `backend-delivery-standard.yml`) và `all`. Khối quản lý dùng marker `be-kit:start/end`, cùng tồn tại với khối của FE-Kit. `doctor` kiểm theo agent đã cài.
- Gate "plan chưa kết luận" (`PLAN_NOT_CONCLUDED`) nằm trong `evaluateModeCompletion` của pack nên cả hook lẫn CLI đều kiểm.
- Eval hành vi `evals/` (khung từ FE-Kit): 9 case cho backend (cook bị chặn / được chạy, quick đổi DB, migration kèm rollback, breaking API cần duyệt, reviewer không tự sửa, SRS bị chèn chỉ thị, test không có shell, PR có file ngoài plan); profile `pilot`/`smoke`/`gate`/`full` (`npm run eval:*`), baseline và luật bật `enforce`, workflow CI chạy tay `plugin-evals.yml`. `tests/evals.test.mjs` dựng lại workspace từng case và kiểm gate, grader mà không tốn API. Gọi `claude plugin eval` với `--mocks off` (bản Claude Code mới bỏ `--allow-real-servers`, `--trust-plugin`).
