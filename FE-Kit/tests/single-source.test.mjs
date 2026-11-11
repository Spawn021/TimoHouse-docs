/**
 * Danh sách file của task và danh sách rule chỉ có một bản trong
 * `packages/validators/src/modes.mjs`. `kit.yaml`, `standard.yaml` và
 * `core/rules/` vẫn viết tay, nên test này giữ chúng khớp nhau.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
  REQUIRED_TASK_FILES,
  CONDITIONAL_TASK_FILES,
  REQUIRED_TASK_DOCS,
  TASK_TEMPLATE_FILES,
  COMMANDS,
  rulesForMode,
  allRuleFiles,
} from '../packages/validators/src/index.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readYaml(rel) {
  return matter(`---\n${fs.readFileSync(path.join(ROOT, rel), 'utf8')}\n---\n`).data;
}

describe('danh sách file của task', () => {
  it('kit.yaml khớp REQUIRED_TASK_FILES và CONDITIONAL_TASK_FILES', () => {
    const kit = readYaml('kit.yaml');
    expect(kit.required_task_files).toEqual(REQUIRED_TASK_FILES);
    expect(kit.conditional_task_files).toEqual(CONDITIONAL_TASK_FILES);
  });

  it('standard.yaml khớp REQUIRED_TASK_FILES và CONDITIONAL_TASK_FILES', () => {
    const std = readYaml('standard.yaml');
    expect(std.standard_task_structure.required).toEqual(REQUIRED_TASK_FILES);
    expect(std.standard_task_structure.conditional).toEqual(CONDITIONAL_TASK_FILES);
  });

  it('template của task mới đúng bằng các artifact Markdown bắt buộc, và có trong core/templates', () => {
    expect(TASK_TEMPLATE_FILES).toEqual(REQUIRED_TASK_DOCS);
    for (const rel of REQUIRED_TASK_DOCS) {
      expect(fs.existsSync(path.join(ROOT, 'core', 'templates', rel)), rel).toBe(true);
    }
  });
});

describe('danh sách rule', () => {
  it('allRuleFiles là hợp của rulesForMode trên mọi mode', () => {
    const union = new Set(COMMANDS.flatMap((c) => rulesForMode(c, { figmaRequired: true })));
    expect(new Set(allRuleFiles())).toEqual(union);
  });

  it('mục "Rule loading theo mode" của core/SKILL.md khớp rulesForMode trên mọi mode', () => {
    const skill = fs.readFileSync(path.join(ROOT, 'core', 'SKILL.md'), 'utf8').replace(/\r\n/g, '\n');
    const sec = skill.split('## Rule loading theo mode')[1].split('\n## ')[0];
    const ticks = (s) => [...s.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    const always = new Set();
    const byMode = new Map(); // mode -> { plain: Set, figma: Set }
    const add = (mode, rule, figmaOnly) => {
      if (!byMode.has(mode)) byMode.set(mode, { plain: new Set(), figma: new Set() });
      byMode.get(mode)[figmaOnly ? 'figma' : 'plain'].add(rule);
    };
    for (const line of sec.split('\n').filter((l) => l.startsWith('- '))) {
      const [head, tail] = line.slice(2).split(/:\s(?=`rules\/)/);
      const rules = ticks(tail).map((r) => r.replace(/^rules\//, ''));
      if (head.startsWith('Luôn')) {
        rules.forEach((r) => always.add(r));
        continue;
      }
      const [plainPart, condPart = ''] = head.split('; và ');
      for (const mode of ticks(plainPart).filter((m) => COMMANDS.includes(m))) rules.forEach((r) => add(mode, r, false));
      for (const mode of ticks(condPart).filter((m) => COMMANDS.includes(m))) rules.forEach((r) => add(mode, r, true));
    }
    for (const mode of COMMANDS) {
      const entry = byMode.get(mode) || { plain: new Set(), figma: new Set() };
      const without = new Set([...always, ...entry.plain]);
      const withFigma = new Set([...without, ...entry.figma]);
      expect(new Set(rulesForMode(mode, { figmaRequired: false })), `${mode} không Figma`).toEqual(without);
      expect(new Set(rulesForMode(mode, { figmaRequired: true })), `${mode} có Figma`).toEqual(withFigma);
    }
  });

  it('core/rules/README.md nhắc đủ mọi file rule', () => {
    const readme = fs.readFileSync(path.join(ROOT, 'core', 'rules', 'README.md'), 'utf8');
    for (const rule of allRuleFiles()) expect(readme, rule).toContain('`' + rule + '`');
  });

  it('allRuleFiles đúng bằng các file rule trong core/rules (trừ README)', () => {
    const onDisk = fs.readdirSync(path.join(ROOT, 'core', 'rules')).filter((f) => f.endsWith('.md') && f !== 'README.md');
    expect([...allRuleFiles()].sort()).toEqual(onDisk.sort());
  });
});
