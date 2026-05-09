import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerScheduleTools(server: McpServer) {

  // ── get_schedule ─────────────────────────────────────────
  server.tool(
    'get_schedule',
    'Retrieves the meal schedule for a user on a specific date and meal type.',
    {
      userId: z.string().describe('The user ID'),
      date:   z.string().describe('ISO date string, e.g. 2024-05-10'),
      meal:   z.string().optional().describe('Meal type: breakfast | lunch | dinner | snack'),
    },
    async ({ userId, date, meal }) => {
      // TODO: Query Supabase/Prisma
      const mockSchedule = {
        id: 'sched_mock_001',
        userId,
        date,
        meal: meal || 'lunch',
        restaurantName: 'Burger King',
        items: [{ id: 'item_001', name: 'Whopper', price: 249 }],
        scheduledTime: '13:00',
        active: true,
      };
      return { content: [{ type: 'text', text: JSON.stringify(mockSchedule) }] };
    }
  );

  // ── reschedule ───────────────────────────────────────────
  server.tool(
    'reschedule',
    'Reschedules a meal to a new time. Updates the DB and re-queues the BullMQ job.',
    {
      scheduleId: z.string().describe('The schedule ID to update'),
      newTime:    z.string().describe('New time in HH:MM format, e.g. 15:00'),
      newDate:    z.string().optional().describe('New date if moving to another day'),
    },
    async ({ scheduleId, newTime, newDate }) => {
      // TODO: Update DB + cancel old BullMQ job + queue new job
      console.log(`[MCP] Rescheduling ${scheduleId} to ${newTime} ${newDate || ''}`);
      return {
        content: [{ type: 'text', text: `✅ Rescheduled to ${newDate || 'today'} at ${newTime}` }],
      };
    }
  );

  // ── skip_today ───────────────────────────────────────────
  server.tool(
    'skip_today',
    'Marks a scheduled meal as skipped for a specific date. Does not delete the schedule.',
    {
      scheduleId: z.string().describe('The schedule ID to skip'),
      date:       z.string().describe('The date to skip in ISO format'),
    },
    async ({ scheduleId, date }) => {
      // TODO: Insert skip record in DB
      console.log(`[MCP] Skipping schedule ${scheduleId} for ${date}`);
      return {
        content: [{ type: 'text', text: `⏭️ Schedule skipped for ${date}. See you tomorrow!` }],
      };
    }
  );
}
