---
description: Nhận yêu cầu backend bằng ngôn ngữ tự nhiên, phân loại, tạo task folder và chuyển sang BE quick hoặc BE plan. Điểm vào mặc định.
argument-hint: <yêu cầu backend, kèm link SRS/API spec nếu có>
---

Nhận và route yêu cầu backend: $ARGUMENTS

1. Yêu cầu thuộc task đang mở trong `docs/backend-tasks/` (Claude Code: `be_list_tasks`) thì đi tiếp theo `Prompt bước tiếp theo` của task đó, không tạo task mới.
2. Phân loại `task_type` (feature, bugfix, refactor, perf, security, migration, integration, setup, chore) và đếm tín hiệu phức tạp/rủi ro:
   - đổi schema/dữ liệu DB;
   - đổi API mà client đang dùng (có thể breaking);
   - đụng auth, phân quyền, thanh toán, dữ liệu nhạy cảm;
   - nhiều module hoặc ≥ 3 file;
   - tích hợp hệ thống ngoài (queue, webhook, service khác);
   - requirement còn mơ hồ;
   - khó rollback.
3. In bảng phân loại cho người dùng (loại task, tín hiệu đã bật kèm lý do một dòng, `risk_level`, route đã chọn, cách override bằng `BE quick <task>` / `BE plan <task>`).
4. Tạo task bằng `be_new_task` (Claude Code) hoặc `node bin/be-kit.mjs new-task BE-<id>-<slug>`; ghi yêu cầu gốc vào `task.md`, `task_type` và `risk_level` vào `tracking/workflow-status.md`.
5. Route: 0 tín hiệu thì chạy tiếp `BE quick`; từ 1 tín hiệu thì chạy `BE plan`. Có tín hiệu DB hoặc auth/thanh toán thì `risk_level` ít nhất `medium`.
