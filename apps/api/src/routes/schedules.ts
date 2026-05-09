import { Router, Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { scheduleJob, cancelJob } from '../workers/scheduler.worker';

const router = Router();

// In-memory mock store (replace with Prisma DB calls)
const mockSchedules: Record<string, object[]> = {};

const createScheduleSchema = z.object({
  restaurantId:  z.string(),
  restaurantName: z.string(),
  items:         z.array(z.object({ id: z.string(), name: z.string(), price: z.number() })),
  cronExpression: z.string(),   // e.g. "0 13 * * 1-5" = weekdays at 1PM
  timezone:      z.string().default('Asia/Kolkata'),
  addressId:     z.string(),
  label:         z.string().optional(), // "Work Lunch", "Daily Breakfast"
});

// ─── GET /api/schedules ───────────────────────────────────
router.get('/', (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  res.json({ schedules: mockSchedules[userId] || [] });
});

// ─── POST /api/schedules ──────────────────────────────────
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = createScheduleSchema.parse(req.body);

    const schedule = {
      id: `sched_${Date.now()}`,
      userId,
      ...data,
      active: true,
      createdAt: new Date().toISOString(),
    };

    if (!mockSchedules[userId]) mockSchedules[userId] = [];
    mockSchedules[userId].push(schedule);

    // Queue the recurring job
    await scheduleJob(schedule);

    res.status(201).json({ schedule });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
    throw err;
  }
});

// ─── PATCH /api/schedules/:id ─────────────────────────────
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const schedules = mockSchedules[userId] || [];
  const idx = schedules.findIndex((s: any) => s.id === id);

  if (idx === -1) return res.status(404).json({ error: 'Schedule not found' });

  const updated = { ...(schedules[idx] as object), ...req.body, updatedAt: new Date().toISOString() };
  mockSchedules[userId][idx] = updated;

  res.json({ schedule: updated });
});

// ─── DELETE /api/schedules/:id ────────────────────────────
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  mockSchedules[userId] = (mockSchedules[userId] || []).filter((s: any) => s.id !== id);
  await cancelJob(id);

  res.json({ message: 'Schedule deleted' });
});

// ─── POST /api/schedules/:id/skip ────────────────────────
router.post('/:id/skip', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { date } = req.body; // ISO date string for the day to skip
  // TODO: Store skip record in DB
  res.json({ message: `Schedule ${id} skipped for ${date}` });
});

export default router;
