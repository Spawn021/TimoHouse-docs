---
trigger: glob
description: "Rule khi sửa source code frontend"
globs: "src/**/*.ts, src/**/*.tsx, src/**/*.js, src/**/*.jsx, app/**/*.ts, app/**/*.tsx, app/**/*.js, app/**/*.jsx, components/**/*.ts, components/**/*.tsx, components/**/*.js, components/**/*.jsx"
---

Chỉ code theo plan/checklist. Không tạo global state/store/context ngoài plan, không nhân bản server-state vào global state. Requirement thay đổi thì chạy `FE input-sync`.

Trước khi plan/cook/quick/review, đọc `.frontend-delivery/rules/` như rules folder bắt buộc. `feature-source-context.md` chỉ dùng để tham chiếu feature mẫu/cách code feature mẫu nếu source base có mẫu đáng tin; không copy pattern xấu.

Khi Figma gate passed, không fallback về UI base source nếu chưa có waiver.

## Ngôn ngữ output

Viết bằng tiếng Việt có dấu đầy đủ (theo `.frontend-delivery/rules/vietnamese-output.md`). Giữ nguyên code/path/command/API field/DTO/error code/route/package/SRS section.

Cache marker: `vi-diacritics-rules-folder-v1.0.0`
