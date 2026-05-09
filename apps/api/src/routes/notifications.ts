import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// ─── GET /api/notifications ───────────────────────────────
router.get('/', (req: AuthRequest, res: Response) => {
  // TODO: Fetch from DB
  const mockNotifications = [
    { id: 'n1', message: 'Your lunch from Burger King is being placed in 1 hour.', sentAt: new Date().toISOString(), responded: false },
    { id: 'n2', message: 'Order delivered! Enjoy your meal 🍔', sentAt: new Date().toISOString(), responded: true, response: 'CONFIRMED' },
  ];
  res.json({ notifications: mockNotifications });
});

// ─── POST /api/notifications/respond ─────────────────────
// User taps YES / SKIP / RESCHEDULE from notification
router.post('/respond', async (req: AuthRequest, res: Response) => {
  const { notificationId, action, rescheduleTime } = req.body;
  // action: 'CONFIRM' | 'SKIP' | 'RESCHEDULE'

  console.log(`[Notification] User ${req.user!.id} responded: ${action} for ${notificationId}`);

  if (action === 'CONFIRM') {
    // Trigger order immediately
    res.json({ message: 'Order confirmed! Placing now.' });
  } else if (action === 'SKIP') {
    res.json({ message: 'Skipped for today. See you tomorrow!' });
  } else if (action === 'RESCHEDULE') {
    res.json({ message: `Rescheduled to ${rescheduleTime}` });
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
});

export default router;
