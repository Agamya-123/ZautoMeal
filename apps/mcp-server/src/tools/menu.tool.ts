import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerMenuTools(server: McpServer) {

  // ── check_menu ───────────────────────────────────────────
  server.tool(
    'check_menu',
    'Checks if specific items are available at a restaurant right now.',
    {
      restaurantId: z.string().describe('The Swiggy restaurant ID'),
      itemIds:      z.array(z.string()).describe('Array of item IDs to check'),
    },
    async ({ restaurantId, itemIds }) => {
      // TODO: Call swiggyService.checkMenuAvailability()
      const availability = itemIds.map(id => ({ id, available: true, alternativeSuggestion: null }));
      return {
        content: [{ type: 'text', text: JSON.stringify(availability) }],
      };
    }
  );

  // ── suggest_meal ─────────────────────────────────────────
  server.tool(
    'suggest_meal',
    'Suggests a meal for the user based on their past order history and preferences.',
    {
      userId:   z.string().describe('The user ID'),
      mealType: z.string().describe('breakfast | lunch | dinner | snack'),
    },
    async ({ userId, mealType }) => {
      // TODO: Query user order history + run Gemini suggestion
      const suggestion = {
        restaurantName: 'Burger King',
        items:          [{ name: 'Whopper Meal', price: 299 }],
        reason:         'You ordered this 5 times last month!',
      };
      return {
        content: [{ type: 'text', text: JSON.stringify(suggestion) }],
      };
    }
  );
}
