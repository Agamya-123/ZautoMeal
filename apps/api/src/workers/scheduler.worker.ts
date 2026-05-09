import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { swiggyService } from '../services/swiggy.service';
import { notificationService } from '../services/notify.service';

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// ─── Queues ────────────────────────────────────────────────
export const orderQueue       = new Queue('order-queue',       { connection: redisConnection });
export const notificationQueue = new Queue('notification-queue', { connection: redisConnection });

// ─── Schedule a job ───────────────────────────────────────
export async function scheduleJob(schedule: any): Promise<void> {
  // Queue a pre-order notification 1 hour before the scheduled time
  // For cron-based schedules, we use repeating jobs
  await orderQueue.add(
    'auto-order',
    { scheduleId: schedule.id, userId: schedule.userId },
    {
      repeat: { pattern: schedule.cronExpression, tz: schedule.timezone },
      jobId: `order-${schedule.id}`,
    }
  );
  console.log(`[Scheduler] Queued recurring order for schedule: ${schedule.id}`);
}

// ─── Cancel a job ─────────────────────────────────────────
export async function cancelJob(scheduleId: string): Promise<void> {
  await orderQueue.removeRepeatable('auto-order', { jobId: `order-${scheduleId}` });
  console.log(`[Scheduler] Cancelled job for schedule: ${scheduleId}`);
}

// ─── Order Worker ──────────────────────────────────────────
// Processes auto-order jobs: checks availability → sends alert → waits → places order
const orderWorker = new Worker(
  'order-queue',
  async (job: Job) => {
    const { scheduleId, userId } = job.data;
    console.log(`[Worker] Processing order job for schedule ${scheduleId}`);

    // Step 1: Check menu availability
    // const items = await swiggyService.checkMenuAvailability(restaurantId, itemIds);

    // Step 2: Send 1-hour pre-alert to user
    await notificationService.sendPreOrderAlert(userId, 'Your Meal', 'Restaurant');

    // Step 3: Wait 50 minutes (user has 50 min to respond)
    // In production: delayed job or webhook-based response flow
    // For now: auto-confirm after timeout
    console.log(`[Worker] Waiting for user response on schedule ${scheduleId}...`);

    // Step 4: Place order (mock)
    const order = await swiggyService.placeOrder({ scheduleId, userId });

    // Step 5: Notify user of placement
    await notificationService.sendOrderPlaced(userId, order.orderId, order.estimatedDelivery);

    return order;
  },
  { connection: redisConnection }
);

orderWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

orderWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
});

export default orderWorker;
