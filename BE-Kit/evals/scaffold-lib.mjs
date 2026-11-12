/**
 * Hàm dựng workspace cho các case eval. Mỗi case có `scaffold.sh` (runner chỉ
 * chạy bash) gọi `node scaffold.mjs`, và `scaffold.mjs` dùng các hàm ở đây.
 * Viết bằng Node để chạy được trên Windows/macOS và để `tests/evals.test.mjs`
 * dựng lại đúng workspace mà không tốn API.
 *
 * Mọi path tương đối tính từ cwd, tức workspace mà `claude plugin eval --scaffold`
 * cấp. Chỉ dùng module có sẵn của Node: scaffold chạy với môi trường tối thiểu.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// `evals/run.mjs` chép template của pack-be vào `evals/templates` của bản sao tạm;
// chạy ngay trong repo (test tự kiểm) thì đọc thẳng từ packages/pack-be.
const TEMPLATES = [path.join(HERE, 'templates'), path.join(HERE, '..', 'packages', 'pack-be', 'templates')].find((p) =>
  fs.existsSync(p),
);

export const TASKS_ROOT = 'docs/backend-tasks';
/** File có trong task folder ngay khi `be-kit new-task` (pack.yaml `task_files.required_docs`). */
const TASK_FILES = [
  'task.md',
  'planning/implementation-plan.md',
  'planning/build-checklist.md',
  'planning/questions.md',
  'tracking/workflow-status.md',
];

/** Source có sẵn của các case `withSource`: service huỷ đơn chưa kiểm chủ đơn, chưa kiểm trạng thái, chưa trả 409. */
export const ORDERS_SERVICE = 'src/orders/orders.service.ts';
export const ORDERS_SERVICE_LINE = "return this.orders.update(orderId, { status: 'CANCELLED' });";
const ORDERS_SERVICE_SOURCE = `import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly orders: OrdersRepository) {}

  async cancel(orderId: string, userId: string) {
    ${ORDERS_SERVICE_LINE}
  }
}
`;

export function writeFile(rel, content) {
  fs.mkdirSync(path.dirname(path.resolve(rel)), { recursive: true });
  fs.writeFileSync(rel, content);
}

function git(...args) {
  const r = spawnSync('git', ['-c', 'user.email=eval@example.com', '-c', 'user.name=eval', ...args], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')} thất bại (exit ${r.status})`);
}

/** `git add -A` rồi commit mọi thay đổi; không có gì thay đổi thì bỏ qua. */
export function commit(message) {
  git('add', '-A');
  const staged = spawnSync('git', ['diff', '--cached', '--quiet']);
  if (staged.status === 0) return;
  git('commit', '-qm', message);
}

/** Repo NestJS tối thiểu: package.json và context dự án đã duyệt (để agent không phải chạy BE context). */
function writeProject() {
  writeFile(
    'package.json',
    `${JSON.stringify(
      {
        name: 'eval-orders-api',
        private: true,
        scripts: { build: 'nest build', test: 'jest', 'test:e2e': 'jest --config test/jest-e2e.json', lint: 'eslint src', 'migration:run': 'typeorm migration:run' },
        dependencies: { '@nestjs/common': '^10.0.0', '@nestjs/core': '^10.0.0', typeorm: '^0.3.20' },
      },
      null,
      2,
    )}\n`,
  );
  writeFile(
    'docs/backend-context/project-source-context.md',
    `---
status: active
---

# Project source context

- Stack: NestJS 10, TypeORM 0.3, PostgreSQL.
- Lệnh: \`npm run build\`, \`npm test\` (Jest), \`npm run test:e2e\`, \`npm run migration:run\`.
- Module theo feature trong \`src/<feature>/\`: \`*.controller.ts\`, \`*.service.ts\`, \`*.repository.ts\`, \`dto/\`.
- Migration TypeORM trong \`src/migrations/\`, luôn có \`up\` và \`down\`.
`,
  );
  writeFile(
    'docs/backend-context/api-context.md',
    `---
status: active
---

# API context

- REST, prefix \`/api/v1\`, JWT bearer; \`req.user.id\` là người gọi.
- Lỗi trả \`{ "code": "<MÃ_LỖI>", "message": "..." }\`; xung đột trạng thái dùng \`409\` (\`ConflictException\`).
- Client mobile đang dùng mọi endpoint \`/orders\`: đổi tên/xoá field response là breaking.
`,
  );
}

/**
 * Dựng repo NestJS giả + task folder từ template của pack-be, rồi `git init` + commit.
 * @param {string} name tên task, vd `BE-20-cancel`
 * @param {{ withSource?: boolean }} [opts] thêm `src/orders/orders.service.ts`
 * @returns {string} path tương đối của task folder
 */
export function scaffoldTask(name, { withSource = false } = {}) {
  const task = `${TASKS_ROOT}/${name}`;
  for (const rel of TASK_FILES) {
    const text = fs
      .readFileSync(path.join(TEMPLATES, rel), 'utf8')
      .replaceAll('<TASK_ID>', name)
      .replaceAll('<task-folder>', task);
    writeFile(`${task}/${rel}`, text);
  }
  writeProject();
  if (withSource) writeFile(ORDERS_SERVICE, ORDERS_SERVICE_SOURCE);

  git('init', '-q');
  commit('scaffold');
  return task;
}

/** Yêu cầu "huỷ đơn" dùng chung cho nhiều case. */
export const CANCEL_ORDER_REQUIREMENT = `# Huỷ đơn hàng

## Yêu cầu (SRS 4.1)

- Endpoint \`POST /api/v1/orders/:id/cancel\`, cần đăng nhập.
- Chỉ chủ đơn được huỷ; người khác gọi thì trả \`404 ORDER_NOT_FOUND\` (không lộ đơn tồn tại).
- Chỉ huỷ được đơn \`PENDING\`. Đơn đã giao cho vận chuyển (\`SHIPPED\`) thì trả \`409 ORDER_ALREADY_SHIPPED\`.
- Huỷ thành công trả \`200\` với \`{ id, status: "CANCELLED" }\`.
- Không đổi schema DB (cột \`status\` đã có).
`;

/**
 * Ghi nội dung thật cho task "huỷ đơn" đã plan xong: task.md, implementation-plan
 * (có bảng "File sẽ tạo / cập nhật" chỉ gồm orders.service.ts), build-checklist.
 * Không commit.
 */
export function writeCancelOrderTask(task) {
  writeFile(`${task}/task.md`, CANCEL_ORDER_REQUIREMENT);
  writeFile(
    `${task}/planning/implementation-plan.md`,
    `# Implementation plan

## Tóm tắt giải pháp

Thêm logic huỷ đơn vào \`OrdersService.cancel\`: kiểm chủ đơn, kiểm trạng thái, trả lỗi đúng mã theo SRS 4.1.

## API contract

| Method | Path | Auth / quyền | Request DTO | Response DTO | Mã lỗi | Thay đổi (mới / additive / breaking) |
|---|---|---|---|---|---|---|
| POST | \`/api/v1/orders/:id/cancel\` | JWT, chủ đơn | — | \`{ id, status }\` | 404 ORDER_NOT_FOUND, 409 ORDER_ALREADY_SHIPPED | additive |

## Thay đổi dữ liệu

Không đổi DB.

## Migration và rollback

| Migration | Up làm gì | Down / rollback | Mất dữ liệu? | Rủi ro khoá bảng / thời gian chạy |
|---|---|---|---|---|
| Không áp dụng | — | Không áp dụng | Không | Không |

## Luồng nghiệp vụ và xử lý lỗi

| Bước | Mô tả | Lỗi có thể xảy ra | Cách xử lý / status code |
|---|---|---|---|
| 1 | Tìm đơn theo \`id\` và \`userId\` | Không thấy / không phải chủ | \`NotFoundException\` 404 ORDER_NOT_FOUND |
| 2 | Kiểm \`status\` | Đã \`SHIPPED\` | \`ConflictException\` 409 ORDER_ALREADY_SHIPPED |
| 3 | Cập nhật \`status = CANCELLED\` |  |  |

## Bảo mật

- Xác thực / phân quyền: JWT.
- Kiểm quyền theo đối tượng: chỉ chủ đơn (lọc theo \`userId\` khi tìm đơn).
- Dữ liệu nhạy cảm: không.

## File sẽ tạo / cập nhật

| File | Tạo / sửa | Mục đích |
|---|---|---|
| \`${ORDERS_SERVICE}\` | Sửa | Kiểm chủ đơn, trạng thái, trả 404/409 |

## Test

| Loại | Phạm vi | Lệnh |
|---|---|---|
| Unit | \`OrdersService.cancel\` | \`npm test\` |
| E2E / integration | Không | — |
| Migration up/down | Không áp dụng | — |
`,
  );
  writeFile(
    `${task}/planning/build-checklist.md`,
    `# Build checklist

| ID | Nội dung | Trạng thái | Evidence |
|---|---|---|---|
| IMP-01 | \`OrdersService.cancel\` kiểm chủ đơn, trả 404/409 đúng SRS 4.1 | Chưa làm |  |
`,
  );
}

/** Trạng thái của task đã plan xong, sẵn sàng cook (API additive, không đổi DB). */
export const PLANNED = {
  task_type: 'feature',
  risk_level: 'medium',
  plan_input_ledger_status: 'completed',
  build_ready: 'true',
  api_change_type: 'additive',
  api_compat_status: 'not_required',
  db_change_required: 'false',
  migration_status: 'not_required',
  rollback_plan_status: 'not_required',
};

/**
 * Thay giá trị các key frontmatter của workflow-status.md. Giá trị ghi nguyên văn.
 * Key không có trong file thì bỏ qua.
 */
export function setStatus(task, values) {
  const file = `${task}/tracking/workflow-status.md`;
  let text = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(values)) {
    text = text.replace(new RegExp(`^${key}:.*$`, 'm'), () => `${key}: ${value}`);
  }
  fs.writeFileSync(file, text);
}
