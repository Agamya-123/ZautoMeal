import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerOrderTools(server: McpServer) {

  // ── place_order ──────────────────────────────────────────
  server.tool(
    'place_order',
    'Places a Swiggy order for the given schedule on behalf of the user.',
    {
      scheduleId: z.string().describe('The schedule ID to execute'),
      userId:     z.string().describe('The user placing the order'),
    },
    async ({ scheduleId, userId }) => {
      // TODO: Call swiggyService.placeOrder()
      console.log(`[MCP] Placing order for schedule ${scheduleId}, user ${userId}`);
      const mockOrder = {
        orderId:           `swiggy_${Date.now()}`,
        status:            'PLACED',
        estimatedDelivery: '30-40 mins',
      };
      return {
        content: [{ type: 'text', text: `✅ Order placed! ID: ${mockOrder.orderId}. ETA: ${mockOrder.estimatedDelivery}` }],
      };
    }
  );

  // ── get_order_history ────────────────────────────────────
  server.tool(
    'get_order_history',
    'Retrieves past orders for a user.',
    {
      userId: z.string().describe('The user ID'),
      limit:  z.number().optional().describe('Max number of orders to return, default 10'),
    },
    async ({ userId, limit = 10 }) => {
      // TODO: Query DB
      const mockHistory = [
        { orderId: 'ord_001', restaurant: 'Burger King', amount: 249, date: '2024-05-01', status: 'DELIVERED' },
        { orderId: 'ord_002', restaurant: 'Dominos',     amount: 399, date: '2024-05-02', status: 'DELIVERED' },
      ].slice(0, limit);
      return {
        content: [{ type: 'text', text: JSON.stringify(mockHistory) }],
      };
    }
  );
}
