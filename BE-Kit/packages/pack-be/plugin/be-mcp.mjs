/**
 * MCP server của plugin `be`: đưa gate/validator của pack BE thành tool `be_*`
 * (begin_mode, new_task, validate_task, validate_workflow, scope_diff,
 * next_step, task_status…). Tool và handler nằm trong `createMcpTools` của
 * engine. Bundle thành một file (kèm zod, gray-matter, MCP SDK) vì plugin bị
 * copy vào cache, không có node_modules.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createMcpTools } from '@backend-delivery-kit/engine';
import { bePack } from '@backend-delivery-kit/pack-be';

const KIT_VERSION = typeof __BE_KIT_VERSION__ !== 'undefined' ? __BE_KIT_VERSION__ : 'dev';

/** Thư mục gốc của plugin: Claude Code set `CLAUDE_PLUGIN_ROOT`; fallback theo vị trí file bundle (`<plugin>/mcp/`). */
function pluginRoot() {
  if (process.env.CLAUDE_PLUGIN_ROOT) return path.resolve(process.env.CLAUDE_PLUGIN_ROOT);
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
}

const { serverName, tools, callTool } = createMcpTools(bePack, { version: KIT_VERSION, pluginRoot: pluginRoot() });

const server = new Server({ name: serverName, version: KIT_VERSION }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, async (req) => callTool(req.params.name, req.params.arguments));
await server.connect(new StdioServerTransport());
