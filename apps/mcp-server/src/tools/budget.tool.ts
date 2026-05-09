import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerBudgetTools(server: McpServer) {

  server.tool(
    'get_budget_status',
    'Returns the user\'s food spending vs their set budget for the given period.',
    {
      userId: z.string().describe('The user ID'),
      period: z.enum(['daily', 'weekly', 'monthly']).describe('The time period to check'),
    },
    async ({ userId, period }) => {
      // TODO: Aggregate order amounts from DB
      const mockStatus = {
        userId,
        period,
        spent:  847,
        budget: 2000,
        remaining: 1153,
        percentage: 42,
        warning: false,
      };
      return {
        content: [{ type: 'text', text: JSON.stringify(mockStatus) }],
      };
    }
  );
}
