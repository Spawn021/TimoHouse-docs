---
applyTo: "src/**/*.ts,src/**/*.js,apps/**/*.ts,libs/**/*.ts,test/**/*.ts,prisma/**,migrations/**"
---

Khi sửa source backend: chỉ code theo plan/checklist của task trong `docs/backend-tasks/`. Áp dụng `.backend-delivery/rules/clean-code-contract.md`, `security-contract.md`, `api-contract.md`; task đổi DB thì thêm `data-migration-contract.md`.

- Controller/route mỏng, nghiệp vụ trong service, truy cập dữ liệu trong repository/ORM.
- Validate request ở biên; lỗi đi qua exception filter / error middleware chung.
- Mọi thay đổi schema qua migration có rollback; không sửa migration đã merge.
- Không log hay commit secret, token, dữ liệu nhạy cảm.
