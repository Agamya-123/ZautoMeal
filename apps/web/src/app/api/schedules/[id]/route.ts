import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  try {
    const resolvedParams = await params;
    const scheduleId = resolvedParams.id;
    
    // Ensure the schedule belongs to the user
    const schedule = await prisma.schedule.findUnique({ where: { id: scheduleId } });
    if (!schedule || schedule.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.schedule.delete({
      where: { id: scheduleId }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting schedule:', err);
    return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
  }
}
