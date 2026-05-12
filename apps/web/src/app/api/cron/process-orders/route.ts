import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Secret token to secure the cron endpoint (in production, use an env variable)
const CRON_SECRET = process.env.CRON_SECRET || 'zautomeal-cron-secret-123';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    // Secure the endpoint so only authorized callers can trigger it
    if (token !== CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get current time context
    const now = new Date();
    // Use Asia/Kolkata timezone since the app is targeted at India/Swiggy
    const kolkataTime = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      weekday: 'short'
    }).formatToParts(now);

    let currentHourStr = '';
    let currentMinuteStr = '';
    let currentDayStr = '';

    for (const part of kolkataTime) {
      if (part.type === 'hour') currentHourStr = part.value;
      if (part.type === 'minute') currentMinuteStr = part.value;
      if (part.type === 'weekday') currentDayStr = part.value;
    }

    const currentTimeString = `${currentHourStr}:${currentMinuteStr}`; // e.g. "13:00"
    
    // Convert 24h format from current time to match the UI's stored formats if necessary,
    // though the UI seems to store "13:00" or similar. 
    // Let's assume schedules.time is in HH:mm 24-hour format.
    console.log(`[Cron] Running order processor at ${currentDayStr} ${currentTimeString}`);

    // 2. Fetch all active schedules
    const activeSchedules = await prisma.schedule.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: {
          include: {
            settings: true // Need settings to check if they paused all orders or need notifications
          }
        }
      }
    });

    const processedOrders = [];
    const errors = [];

    // 3. Process each schedule
    for (const schedule of activeSchedules) {
      try {
        // Skip if user has paused all operations globally
        if (schedule.user.settings?.pauseAll) {
          continue;
        }

        let isTimeToOrder = false;

        if (schedule.type === 'MEAL') {
          // Check if today is one of the scheduled days
          const isTodayScheduled = schedule.days.some(day => currentDayStr.toLowerCase().startsWith(day.toLowerCase()));
          
          // Check if current time matches the scheduled time
          // To handle slight cron delays, we check if current time is within a 15-minute window of the schedule
          // (Assuming cron runs every 10-15 minutes)
          const scheduleTime = schedule.time; // e.g. "13:00"
          isTimeToOrder = isTodayScheduled && isTimeWithinWindow(currentTimeString, scheduleTime, 15);
        } else if (schedule.type === 'GROCERY') {
          // Grocery logic: checking date of month or specific day of week
          // We simplify here: check if the schedule.days array matches today
          const isTodayScheduled = schedule.days.some(day => 
            currentDayStr.toLowerCase().startsWith(day.toLowerCase()) || 
            day === '1st of Month' && now.getDate() === 1
          );
          
          const scheduleTime = schedule.time || '11:00'; // Default grocery time
          isTimeToOrder = isTodayScheduled && isTimeWithinWindow(currentTimeString, scheduleTime, 15);
        }

        if (isTimeToOrder) {
          // 4. Prevent duplicate orders
          // Check if an order for this schedule already exists today
          const todayStart = new Date(now);
          todayStart.setHours(0, 0, 0, 0);
          const todayEnd = new Date(now);
          todayEnd.setHours(23, 59, 59, 999);

          const existingOrder = await prisma.order.findFirst({
            where: {
              scheduleId: schedule.id,
              date: {
                gte: todayStart,
                lte: todayEnd,
              }
            }
          });

          if (existingOrder) {
            console.log(`[Cron] Order already placed today for schedule ${schedule.id}. Skipping.`);
            continue;
          }

          // 5. Trigger Swiggy API
          console.log(`[Cron] 🚀 Triggering Swiggy order for ${schedule.user.email} - ${schedule.name}`);
          
          let swiggyOrderId = `SWG-${Math.floor(Math.random() * 1000000)}`;
          let orderStatus = 'SCHEDULED';
          
          try {
            // Real fetch call to Swiggy API
            const swiggyRes = await fetch('https://www.swiggy.com/dapi/order/place', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${schedule.user.settings?.swiggyToken || 'dummy-token'}`
              },
              body: JSON.stringify({
                restaurant: schedule.restaurant,
                items: schedule.items,
                totalAmount: schedule.totalAmount,
                deliveryAddress: schedule.user.settings?.deliveryAddress || 'Default Address',
              })
            });

            if (swiggyRes.ok) {
              const data = await swiggyRes.json();
              swiggyOrderId = data.orderId || swiggyOrderId;
              orderStatus = 'DELIVERED'; // Assuming successful immediate placement for now
            } else {
              console.error(`[Cron] Swiggy API failed with status: ${swiggyRes.status}`);
              orderStatus = 'FAILED';
            }
          } catch (fetchErr) {
            console.error('[Cron] Swiggy API network error:', fetchErr);
            orderStatus = 'FAILED';
          }

          // 6. Record the order in DB
          const newOrder = await prisma.order.create({
            data: {
              userId: schedule.userId,
              scheduleId: schedule.id,
              type: schedule.type,
              vendorName: schedule.restaurant || 'Unknown',
              amount: schedule.totalAmount,
              status: orderStatus,
              date: new Date(),
              swiggyOrderId,
            }
          });

          processedOrders.push(newOrder);

          // 7. Send Notifications
          // if (schedule.user.settings?.notifyWhatsapp) { ... send Whatsapp via Twilio/etc ... }
        }
      } catch (err) {
        console.error(`[Cron] Error processing schedule ${schedule.id}:`, err);
        errors.push({ scheduleId: schedule.id, error: String(err) });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${processedOrders.length} orders.`,
      processedCount: processedOrders.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('[Cron] Fatal error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Helper to check if current time is within X minutes after the scheduled time.
 * E.g., if schedule is 13:00, and window is 15 mins, it returns true for 13:00 to 13:15.
 */
function isTimeWithinWindow(current: string, scheduled: string, windowMinutes: number) {
  // Parse HH:mm
  const parseTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    // Handle PM/AM if the UI passed it that way (e.g. "01:00 PM")
    let hour = h;
    if (t.toLowerCase().includes('pm') && h < 12) hour += 12;
    if (t.toLowerCase().includes('am') && h === 12) hour = 0;
    
    // Extract numbers only for minutes
    const minStr = t.split(':')[1]?.replace(/[^0-9]/g, '');
    const min = Number(minStr || m);
    return hour * 60 + min;
  };

  const currentMins = parseTime(current);
  const scheduledMins = parseTime(scheduled);

  // Is current time exactly at, or up to 'windowMinutes' after the scheduled time?
  return currentMins >= scheduledMins && currentMins <= (scheduledMins + windowMinutes);
}
