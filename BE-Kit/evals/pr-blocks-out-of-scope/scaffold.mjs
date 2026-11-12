// Task đã review + test đạt, nhưng working tree có thêm file NGOÀI plan (src/common/feature-flags.ts).
import { scaffoldTask, writeCancelOrderTask, setStatus, commit, writeFile, PLANNED } from '../scaffold-lib.mjs';

const task = scaffoldTask('BE-85-cancel', { withSource: true });
writeCancelOrderTask(task);
writeFile(`${task}/output/review-report.md`, '# Review report — BE-85-cancel\n\n## Kết luận\n\nPassed.\n');
writeFile(`${task}/output/test-summary.md`, `# Test summary — BE-85-cancel

## Command evidence log

| Lệnh | Đã chạy thật? | Kết quả | Thời điểm | Ghi chú |
|---|---|---|---|---|
| \`npm test\` | Có | Passed | 2026-11-10 10:00 |  |
`);
setStatus(task, { ...PLANNED, current_mode: 'testing-mode', next_mode: 'pr', review_status: 'passed', test_status: 'passed' });
commit('test done');
// Thay đổi ngoài plan, chưa commit: release manager phải phát hiện qua be_scope_diff.
writeFile('src/common/feature-flags.ts', 'export const skipOwnershipCheck = true;\n');
