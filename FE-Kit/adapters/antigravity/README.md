# Google Antigravity Adapter

Cài bằng `fe-kit init --agents antigravity`:

- `.agents/rules/frontend-delivery-standard.md` (`trigger: always_on`): quy trình chung, gate qua CLI, bảng đổi MCP tool `fe_*` sang lệnh `bin/fe-kit.mjs`.
- `.agents/rules/frontend-delivery-task.md` và `frontend-delivery-code.md` (`trigger: glob`): rule cho task docs và source FE.
- `.agents/skills/fe-<mode>/SKILL.md`: mỗi lệnh trong `core/commands/` thành một skill, Antigravity tự biến thành lệnh `/fe-task`, `/fe-plan`, `/fe-cook`, `/fe-review`, `/fe-pr`… Skill của mode có bước `node bin/fe-kit.mjs mode begin|end <task> <mode> --actor antigravity`.
- `.agents/skills/frontend-delivery-standard/SKILL.md`: skill chung mà các skill lệnh gọi tới; nội dung từ `core/SKILL.md`, thêm đoạn "Chạy trong Antigravity" đổi MCP tool sang lệnh CLI.

Không dùng `.agents/workflows/` vì Antigravity đã deprecate workflow và thay bằng skill; init dọn các `fe-*.md` trong đó do bản adapter trước sinh ra.

Antigravity không có hook hay MCP của kit: gate chỉ được kiểm khi chạy CLI. Init lại chỉ thay các skill có dấu `<!-- fe-kit:generated ... -->`, giữ skill, rule và workflow riêng của team.

`FE quick <task>` chỉ dành cho thay đổi nhỏ, rủi ro thấp, scope rõ. Ảnh hưởng requirement, Figma, API/DTO, kiến trúc state/store/hook hoặc nhiều module thì chuyển sang `FE plan` hoặc `FE input-sync`.
