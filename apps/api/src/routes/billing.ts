import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

const router = Router();

const PLANS = {
  free:    { name: 'Free',    price: 0,   mealsPerDay: 1 },
  starter: { name: 'Starter', price: 99,  mealsPerDay: 3 },
  pro:     { name: 'Pro',     price: 199, mealsPerDay: -1 }, // -1 = unlimited
  premium: { name: 'Premium', price: 399, mealsPerDay: -1 },
};

// ─── GET /api/billing/plans ───────────────────────────────
router.get('/plans', (_req, res) => {
  res.json({ plans: PLANS });
});

// ─── GET /api/billing/subscription ───────────────────────
router.get('/subscription', (req: AuthRequest, res: Response) => {
  // TODO: Fetch from DB via Razorpay subscription ID
  res.json({
    plan: 'free',
    status: 'active',
    currentPeriodEnd: null,
  });
});

// ─── POST /api/billing/subscribe ─────────────────────────
router.post('/subscribe', async (req: AuthRequest, res: Response) => {
  const { planId } = req.body;
  // TODO: Create Razorpay subscription and return checkout link
  res.json({
    message: `Razorpay subscription for plan "${planId}" — integration coming soon`,
    checkoutUrl: null,
  });
});

// ─── POST /api/billing/cancel ─────────────────────────────
router.post('/cancel', async (req: AuthRequest, res: Response) => {
  // TODO: Cancel Razorpay subscription
  res.json({ message: 'Subscription cancelled. Access continues until period end.' });
});

export default router;
