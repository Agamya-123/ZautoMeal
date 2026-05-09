import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerNotifyTools(server: McpServer) {

  server.tool(
    'send_notification',
    'Sends a notification to the user via their preferred channel (WhatsApp, FCM push, SMS, or email).',
    {
      userId:  z.string().describe('The user ID'),
      message: z.string().describe('The notification message to send'),
      channel: z.enum(['whatsapp', 'fcm', 'sms', 'email']).optional().describe('Preferred channel, defaults to fcm'),
      actions: z.array(z.string()).optional().describe('Action buttons, e.g. ["CONFIRM", "SKIP", "RESCHEDULE"]'),
    },
    async ({ userId, message, channel = 'fcm', actions }) => {
      // TODO: Call notificationService.send()
      console.log(`[MCP] Sending ${channel} notification to user ${userId}: ${message}`);
      if (actions) console.log(`[MCP] Actions: ${actions.join(', ')}`);
      return {
        content: [{ type: 'text', text: `📬 Notification sent via ${channel}` }],
      };
    }
  );
}
