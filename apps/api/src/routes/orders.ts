import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { swiggyService } from '../services/swiggy.service';

const router = Router();

// Mock order store
const mockOrders: object[] = [
  { id: 'ord_001', restaurantName: 'Burger King', items: ['Whopper'], status: 'DELIVERED', amount: 249, placedAt: '2024-05-01T13:00:00Z' },
  { id: 'ord_002', restaurantName: 'Dominos',     items: ['Margherita'], status: 'DELIVERED', amount: 399, placedAt: '2024-05-02T20:00:00Z' },
  { id: 'ord_003', restaurantName: 'Burger King', items: ['Whopper', 'Fries'], status: 'IN_TRANSIT', amount: 349, placedAt: new Date().toISOString() },
];

// ─── GET /api/orders ──────────────────────────────────────
router.get('/', (req: AuthRequest, res: Response) => {
  res.json({ orders: mockOrders });
});

// ─── POST /api/orders/place ───────────────────────────────
// Called by the scheduler worker automatically
router.post('/place', async (req: AuthRequest, res: Response) => {
  const { scheduleId } = req.body;
  const userId = req.user!.id;

  try {
    // This calls the Swiggy service (mock until API key arrives)
    const result = await swiggyService.placeOrder({ scheduleId, userId });
    res.json({ order: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/orders/:id/track ────────────────────────────
router.get('/:id/track', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  // TODO: Fetch live tracking from Swiggy API
  res.json({
    orderId: id,
    status: 'IN_TRANSIT',
    eta: '15 mins',
    trackingUrl: `https://swiggy.com/track/${id}`,
  });
});

export default router;
