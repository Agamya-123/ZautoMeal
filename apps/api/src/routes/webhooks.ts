import { Router, Request, Response } from 'express';

const router = Router();

// ─── POST /api/webhooks/swiggy ────────────────────────────
// Swiggy will call this when order status changes
router.post('/swiggy', (req: Request, res: Response) => {
  const payload = req.body;
  console.log('[Webhook] Swiggy order update:', payload);

  // TODO: Update order status in DB
  // TODO: Notify user via FCM/WhatsApp

  res.json({ received: true });
});

// ─── POST /api/webhooks/razorpay ─────────────────────────
router.post('/razorpay', (req: Request, res: Response) => {
  const payload = req.body;
  console.log('[Webhook] Razorpay payment event:', payload);

  // TODO: Update subscription status in DB

  res.json({ received: true });
});

export default router;
