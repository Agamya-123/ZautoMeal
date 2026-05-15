import { NextResponse } from 'next/server';
import { updateTestState, ATROS_TEST_STATE } from '@/lib/atros-engine';

export async function GET() {
  return NextResponse.json(ATROS_TEST_STATE);
}

export async function POST(req: Request) {
  const { action, value } = await req.json();

  switch (action) {
    case 'SET_INVENTORY':
      updateTestState({ injectedInventory: value });
      break;
    case 'SET_PROCUREMENT':
      updateTestState({ injectedProcurement: value });
      break;
    case 'SET_SUB_FOUND':
      updateTestState({ injectedSubFound: value });
      break;
    case 'SET_USER_RESPONSE':
      updateTestState({ injectedUserResponse: value });
      break;
    case 'SET_PAYMENT':
      updateTestState({ injectedPayment: value });
      break;
    case 'RESET':
      updateTestState({
        current_os: 'IDLE',
        logs: [],
        injectedInventory: null,
        injectedProcurement: null,
        injectedSubFound: null,
        injectedUserResponse: null,
        injectedPayment: null
      });
      break;
  }

  return NextResponse.json({ success: true, state: ATROS_TEST_STATE });
}
