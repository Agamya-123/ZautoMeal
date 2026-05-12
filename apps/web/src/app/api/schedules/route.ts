import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // "MEAL" or "GROCERY"

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const schedules = await prisma.schedule.findMany({
    where: { 
      userId: user.id,
      ...(type ? { type } : {})
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ schedules });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  try {
    const data = await req.json();
    
    const schedule = await prisma.schedule.create({
      data: {
        userId: user.id,
        type: data.type,
        name: data.name,
        time: data.time,
        days: data.days,
        restaurant: data.restaurant,
        items: data.items || [],
        totalAmount: data.totalAmount || 0,
        isActive: true
      }
    });

    // Auto-create an order entry so it appears in history immediately
    const itemNames = (data.items || []).map((it: any) => it.name || it).join(', ');
    await prisma.order.create({
      data: {
        userId: user.id,
        scheduleId: schedule.id,
        type: data.type,
        vendorName: data.restaurant || 'Unknown Restaurant',
        amount: data.totalAmount || 0,
        status: 'SCHEDULED',
        date: new Date(),
        // store item names in a note field via swiggyOrderId as a workaround
        swiggyOrderId: itemNames || null,
      }
    });

    return NextResponse.json({ success: true, schedule });
  } catch (err: any) {
    console.error('Error creating schedule:', err);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}
