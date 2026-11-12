/**
 * Domain pack BE (backend delivery, Node: NestJS/Express): dữ liệu và hàm mà
 * engine cần để chạy state machine, gate mở/kết thúc mode, MCP và hook cho BE.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createModeCompletion,
  createModeBriefing,
  rulesForManifest,
  allRuleFilesOf,
  resolveTaskDir as resolveTaskDirIn,
  scaffoldTask as scaffoldTaskIn,
  loadProjectConfig as loadProjectConfigIn,
  appendRunLog as appendRunLogIn,
  readRunLog as readRunLogIn,
  runLogFileFor,
} from '@backend-delivery-kit/engine';
import manifest from './manifest.gen.mjs';
import { COMMAND_TO_MODE, parseWorkflowStatus, countOpenBlockingQuestions, countOpenIssues } from './schema.mjs';
import { machine, validateWorkflow, validateWorkflowAtGate, validatePr, scopeDiffForTask, SCOPE_CHECKED_MODES, modeEndIssues } from './gates.mjs';

export * from './schema.mjs';
export { machine, validateWorkflow, validateWorkflowAtGate, validatePr, scopeDiffForTask, SCOPE_CHECKED_MODES, evaluateWorkflowGates, modeEndIssues } from './gates.mjs';
export { manifest };

const m = manifest;

/** Thư mục nguồn của pack (rule, template). Chỉ đúng khi chạy từ repo kit, không phải bản bundle. */
export const PACK_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const COMMANDS = machine.COMMANDS;
export const normalizeCommand = machine.normalizeCommand;
export const evaluateModeEntry = machine.evaluateModeEntry;
export const TASKS_ROOT = m.tasks_root;
export const CONFIG_DIR = m.config_dir;
export const STATUS_FILE = m.status_file;
export const RUNLOG_FILE = runLogFileFor(m.status_file);
export const REQUIRED_TASK_FILES = [...m.task_files.required_docs, ...m.task_files.empty];

/** File rule nạp cho một mode (`dbChange` = task đổi DB). */
export function rulesForMode(command, { dbChange = false } = {}) {
  return rulesForManifest(m, command, { db_change_required: dbChange });
}
export function allRuleFiles() {
  return allRuleFilesOf(m);
}

export const resolveTaskDir = (root, input) => resolveTaskDirIn(root, input, { tasksRoot: m.tasks_root });
export const loadProjectConfig = (root) => loadProjectConfigIn(root, { file: m.project_config_file });
export const appendRunLog = (taskDir, record) => appendRunLogIn(taskDir, { pack: m.id, ...record }, { file: RUNLOG_FILE });
export const readRunLog = (taskDir) => readRunLogIn(taskDir, { file: RUNLOG_FILE });

export function scaffoldTask({ workspaceRoot, name, templatesDir }) {
  return scaffoldTaskIn({
    workspaceRoot,
    name,
    templatesDir,
    tasksRoot: m.tasks_root,
    templateFiles: m.task_files.required_docs,
    emptyFiles: m.task_files.empty,
    nameHint: m.task_name_hint,
  });
}

export const bePack = {
  id: m.id,
  displayName: m.display_name,
  pluginName: m.plugin,
  promptPrefix: m.prompt_prefix,
  envPrefix: m.env_prefix,
  agentPrefix: m.agent_prefix,
  tasksRoot: m.tasks_root,
  statusFile: m.status_file,
  runLogFile: RUNLOG_FILE,
  writablePrefixes: m.writable_prefixes,
  commands: COMMANDS,
  commandToMode: COMMAND_TO_MODE,
  sourceEditCommands: m.source_edit_modes,
  sourceEditAgent: m.source_edit_agent,
  requiredArtifacts: Object.fromEntries(Object.entries(m.modes).map(([cmd, mode]) => [cmd, mode.artifacts])),
  agentFor: Object.fromEntries(Object.entries(m.modes).map(([cmd, mode]) => [cmd, mode.agent])),
  label: (command) => `${m.prompt_prefix} ${command}`,
  sourceFixRoute: m.source_fix_route,
  planUpdateRoute: m.plan_update_route,
  readInputsHint: m.read_inputs_hint,
  parseStatus: parseWorkflowStatus,
  rulesFor: (command, data) => rulesForManifest(m, command, { db_change_required: data.db_change_required === true || String(data.db_change_required).toLowerCase() === 'true' }),
  entryInputs: ({ read }) => ({
    openBlockingQuestions: countOpenBlockingQuestions(read('planning/questions.md')),
    openIssues: countOpenIssues(read('tracking/review-bugs.md')),
  }),
  normalizeCommand,
  evaluateModeEntry,
  resolveTaskDir,
  scopeDiffForTask,
  loadProjectConfig,
  scaffoldTask,
  requiredTaskFiles: REQUIRED_TASK_FILES,
  validateWorkflow,
  validateWorkflowAtGate,
  mcp: {
    serverName: m.mcp.server_name,
    toolPrefix: m.mcp.tool_prefix,
    configDir: m.config_dir,
    skillDir: m.mcp.skill_dir,
    nextPromptHeading: m.mcp.next_prompt_heading,
    firstCommand: m.mcp.first_command,
    afterNewTask: (taskRef) => [`Task nhỏ, rủi ro thấp, không đổi DB và không breaking API có thể dùng: ${m.prompt_prefix} quick ${taskRef}`],
    taskPropDescription: m.mcp.task_prop_description,
    taskNameDescription: m.mcp.task_name_description,
    scopeSelfReported: m.mcp.scope_self_reported,
    scopeUnavailable: m.mcp.scope_unavailable,
    plannedFilesMissing: m.mcp.planned_files_missing,
    statusFields: m.mcp.status_fields,
    statusExtras: (read) => [`blocking_questions_open (đếm từ questions.md): ${countOpenBlockingQuestions(read('planning/questions.md'))}`],
    descriptions: {
      beginMode: m.mcp.descriptions.begin_mode,
      newTask: m.mcp.descriptions.new_task,
      validateTask: m.mcp.descriptions.validate_task,
      validateWorkflow: m.mcp.descriptions.validate_workflow,
      scopeDiff: m.mcp.descriptions.scope_diff,
      nextStep: m.mcp.descriptions.next_step,
      taskStatus: m.mcp.descriptions.task_status,
    },
  },
};

const baseCompletion = createModeCompletion(bePack);
/**
 * Gate kết thúc mode (hook `SubagentStop`/`Stop`, CLI `be-kit mode end`): gate của engine
 * cộng gate chỉ áp dụng lúc kết thúc mode của BE (vd plan phải kết luận).
 */
export function evaluateModeCompletion(p) {
  return baseCompletion({ ...p, extraIssues: [...(p.extraIssues || []), ...modeEndIssues(p.taskDir, p.command)] });
}
bePack.evaluateModeCompletion = evaluateModeCompletion;
/** Nội dung mở mode (CLI `be-kit mode begin`). */
export const modeBriefing = createModeBriefing(bePack);
export { validatePr as validatePrGates };
