import { NextResponse } from 'next/server';
import { updateV3State, ATROS_V3_STATE, runAtrosPipelineV3 } from '@/lib/atros-v3/engine';

export async function GET() {
  return NextResponse.json(ATROS_V3_STATE);
}

export async function POST(req: Request) {
  const { action, value, rio } = await req.json();

  if (action === 'RUN_PIPELINE') {
    // Run in background
    runAtrosPipelineV3(rio);
    return NextResponse.json({ success: true });
  }

  if (action === 'SET_PREFERENCE') {
    updateV3State({ no_response_preference: value });
    return NextResponse.json({ success: true, state: ATROS_V3_STATE });
  }

  if (action === 'RESET') {
    updateV3State({
      isRunning: false,
      current_os: 'IDLE',
      logs: [],
      injectedInventory: null,
      injectedProcurement: null,
      injectedSubFound: null,
      injectedUserAction: null,
      injectedUserDecision: null,
      injectedT60Response: null,
      injectedPayment: null
    });
    return NextResponse.json({ success: true });
  }

  // Handle Injectors
  const updates: any = {};
  updates[action] = value;
  updateV3State(updates);

  return NextResponse.json({ success: true, state: ATROS_V3_STATE });
}
