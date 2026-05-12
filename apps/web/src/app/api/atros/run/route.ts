import { NextResponse } from 'next/server';
import { runAtrosPipeline, RIO } from '@/lib/atros-engine';
import { getTrialWarehouse } from '@/app/api/warehouse/route';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rio, date } = body;

    if (!rio) {
      return NextResponse.json({ error: 'RIO object is required' }, { status: 400 });
    }

    const currentCatalog = getTrialWarehouse();
    const targetDate = date ? new Date(date) : new Date();
    
    const outcome = await runAtrosPipeline(rio as RIO, targetDate, currentCatalog);

    return NextResponse.json({ 
      success: true, 
      outcome,
      message: `A-TROS Pipeline completed with status: ${outcome}`
    });
  } catch (error: any) {
    console.error('A-TROS API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
