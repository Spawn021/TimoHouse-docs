---
doc_name: project-source-context
doc_version: 1.0.0
status: draft
owner:
last_updated:
---

# Project Source Context (Backend)

File này mô tả backend đang dùng gì. Agent đọc file này để biết stack, lệnh chạy và quy ước source cấp dự án.

## 1. Stack

| Mục | Giá trị |
|---|---|
| Runtime | Node.js |
| Framework | NestJS / Express / Khác |
| Language | TypeScript / JavaScript |
| Package manager | npm / yarn / pnpm / bun |
| Database | PostgreSQL / MySQL / MongoDB / Khác |
| ORM / query builder | TypeORM / Prisma / Sequelize / Mongoose / Knex / Khác |
| Migration tool |  |
| Validation | class-validator / zod / joi / Khác |
| Auth | JWT / session / OAuth / Khác |
| Cache / queue | Redis / BullMQ / RabbitMQ / Kafka / Không dùng |
| Logging | Nest Logger / pino / winston / Khác |
| Config | @nestjs/config / dotenv / Khác |
| API doc | Swagger (OpenAPI) / Không có |
| Test | Jest / Vitest / Mocha + supertest / Khác |

## 2. Commands

| Mục đích | Command |
|---|---|
| Install |  |
| Dev |  |
| Typecheck |  |
| Lint |  |
| Unit test |  |
| E2E test |  |
| Build |  |
| Tạo migration |  |
| Chạy migration |  |
| Rollback migration |  |

## 3. Folder convention

| Concern | Path |
|---|---|
| Module / feature |  |
| Controller / route |  |
| Service |  |
| Repository / data access |  |
| DTO |  |
| Entity / model / schema |  |
| Migration |  |
| Guard / middleware auth |  |
| Exception filter / error handler |  |
| Config |  |
| Shared / common |  |
| Test |  |

## 4. Source inspection notes

- Source hiện tại chỉ là reference, không phải luôn là chuẩn tuyệt đối.
- Không copy pattern xấu từ source cũ.
- Source mâu thuẫn với SRS/API/rule thì ghi blocker hoặc hỏi người phụ trách.
