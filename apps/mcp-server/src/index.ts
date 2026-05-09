import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerScheduleTools } from './tools/schedule.tool.js';
import { registerOrderTools } from './tools/order.tool.js';
import { registerMenuTools } from './tools/menu.tool.js';
import { registerNotifyTools } from './tools/notify.tool.js';
import { registerBudgetTools } from './tools/budget.tool.js';

const server = new McpServer({
  name:    'zautomeal-mcp',
  version: '1.0.0',
});

// Register all tool groups
registerScheduleTools(server);
registerOrderTools(server);
registerMenuTools(server);
registerNotifyTools(server);
registerBudgetTools(server);

// Start via stdio transport (works locally + with Claude Desktop / Gemini)
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('[MCP] Zautomeal MCP Server running on stdio');
