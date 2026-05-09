import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import scheduleRoutes from './routes/schedules';
import orderRoutes from './routes/orders';
import webhookRoutes from './routes/webhooks';
import notificationRoutes from './routes/notifications';
import billingRoutes from './routes/billing';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 4000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ── Public Routes ───────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);

// ── Protected Routes ────────────────────────────────────────
app.use('/api/schedules', authMiddleware, scheduleRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/billing', authMiddleware, billingRoutes);

// ── Health Check ────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'zautomeal-api' }));

// ── Error Handler ───────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Zautomeal API running at http://localhost:${PORT}`);
});

export default app;
