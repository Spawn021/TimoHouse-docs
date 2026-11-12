# Baseline eval hành vi

File này do `node evals/summarize.mjs` sinh ra, không sửa tay. Mỗi file JSON bên cạnh là kết quả một lượt `plugin-evals.yml` (một mức hook).

Luật bật `enforce` mặc định: mọi case tag `gate` chạy ≥ 3 lần và đạt ≥ 0.8 ở enforce, `cook-proceeds-when-ready` đạt 1, enforce không kém warn quá 0.05 ở case gate, không có run lỗi.

Chỉ profile `gate` và `full` của `node evals/run.mjs` ghi baseline; `pilot` và `smoke` chạy quá ít lần nên chỉ in tóm tắt.

Chưa có baseline nào.
