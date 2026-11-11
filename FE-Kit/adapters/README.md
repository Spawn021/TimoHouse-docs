# Adapters

Payload của từng adapter nằm ở `core/adapters/<agent>/` và được `fe-kit init --agents <list>` cài vào repo dự án.

| Tool | File được cài | Ghi chú |
|---|---|---|
| Codex / OpenAI agents | `AGENTS.md`, `.codex/rules/*`, `.codex/prompts/*` | Prompt sinh từ `core/commands/` lúc init |
| Claude Code | `CLAUDE.md`, `.claude/rules/*`, bật plugin `fe` trong `.claude/settings.json` | Commands, agents, skill, hook, MCP đến từ plugin |
| Cursor | `.cursor/rules/*.mdc` | Rule theo path cho task docs và source code |
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/*`, PR template, workflow validate task | Repository và path-specific instructions |
| Google Antigravity | `.agents/rules/*.md`, `.agents/skills/fe-<mode>/SKILL.md`, `.agents/skills/frontend-delivery-standard/SKILL.md` | Mỗi lệnh là một skill `/fe-<mode>` sinh từ `core/commands/` lúc init; gate qua CLI `--actor antigravity` |
| ChatGPT | `dist/chatgpt-skill.zip` | Upload skill trực tiếp |
