import { NextResponse } from 'next/server';
import { TRIAL_WAREHOUSE } from '@/lib/warehouse-catalog';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category'); // "meals", "groceries", "pharmacy"

  let items = TRIAL_WAREHOUSE;
  if (category) {
    items = items.filter(i => i.category === category);
  }

  return NextResponse.json({ items });
}
