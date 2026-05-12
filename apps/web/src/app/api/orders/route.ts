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

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
      ...(type ? { type } : {})
    },
    include: {
      schedule: {
        select: { name: true }
      }
    },
    orderBy: { date: 'desc' }
  });

  return NextResponse.json({ orders });
}
