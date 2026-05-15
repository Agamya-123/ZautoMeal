import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// ============================================================================
// A-TROS v3.0 - WORKFLOW ENGINE (STRICT SYNC WITH SPEC)
// ============================================================================

export type OS_STATE_V3 = 
  | 'CREATED'
  | 'WAREHOUSE_NOTIFIED'
  | 'INVENTORY_RESERVED'
  | 'SUBSTITUTE_FOUND'
  | 'PARTIAL_ORDER_OPTION'
  | 'INVENTORY_LOCKED'
  | 'CONFIRMATION_PENDING'
  | 'REMINDER_SENT'
  | 'T30_CONFIRMATION_PENDING'
  | 'CANCELLED'
  | 'AUTO_EXECUTION'
  | 'AUTO_CANCELLED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_RETRY_SUCCESS'
  | 'PAYMENT_APPROVAL_REQUIRED'
  | 'EXECUTED'
  | 'COMPLETED'
  | 'IDLE';

export let ATROS_V3_STATE: any = {
  isRunning: false,
  current_os: 'IDLE',
  logs: [] as string[],
  // Test Controls
  injectedInventory: null,    
  injectedProcurement: null,  
  injectedSubFound: null,     
  injectedPayment: null,      
  // User Responses
  injectedUserAction: null,   
  injectedUserDecision: null, 
  injectedT60Response: null,  
  // Config
  no_response_preference: 'AUTO_EXECUTE'
};

export function updateV3State(newState: any) {
  ATROS_V3_STATE = { ...ATROS_V3_STATE, ...newState };
}

// ============================================================================
// CORE PIPELINE V3
// ============================================================================

export async function runAtrosPipelineV3(rio: any): Promise<string> {
  if (ATROS_V3_STATE.isRunning) return 'ALREADY_RUNNING';
  
  ATROS_V3_STATE.isRunning = true;
  ATROS_V3_STATE.no_response_preference = rio.schedule?.automationPreference || 'AUTO_EXECUTE';
  ATROS_V3_STATE.logs = [`[SYSTEM] A-TROS v3.0 INITIALIZED | FLOW_ID: ${rio.automation_id}`];
  
  const setOS = (state: OS_STATE_V3) => {
    ATROS_V3_STATE.current_os = state;
    ATROS_V3_STATE.logs.push(`[STATUS] OS_STATE: ${state}`);
  };

  const paymentMethod = rio.schedule?.paymentMethod || 'Online Payment';
  let userHasAlreadyConfirmedOnce = false;

  try {
    // --- MODULE 1: USER AUTOMATION ---
    setOS('CREATED');
    await wait(800);

    // --- MODULE 2: DEMAND & WAREHOUSE (T-3 Days) ---
    ATROS_V3_STATE.logs.push(`[INFO] T-3D: INITIALIZING INVENTORY VERIFICATION`);
    const invAvailable = await pollV3('injectedInventory') === 'available';

    if (invAvailable) {
      ATROS_V3_STATE.logs.push(`[INFO] INVENTORY_VERIFIED: STATUS_AVAILABLE`);
    } else {
      setOS('WAREHOUSE_NOTIFIED');
      ATROS_V3_STATE.logs.push(`[WARN] INVENTORY_EXCEPTION: OUT_OF_STOCK`);
      ATROS_V3_STATE.logs.push(`[INFO] COMMENCING WAREHOUSE PROCUREMENT PROTOCOL`);
      
      const canArrive = await pollV3('injectedProcurement') === 'yes';
      
      if (canArrive) {
        setOS('INVENTORY_RESERVED');
        ATROS_V3_STATE.logs.push(`[INFO] PROCUREMENT_SUCCESS: INVENTORY_RESERVED`);
      } else {
        ATROS_V3_STATE.logs.push(`[WARN] PROCUREMENT_FAILURE: TRIGGERING SUBSTITUTION_ENGINE`);
        const subFound = await pollV3('injectedSubFound');
        
        if (subFound) setOS('SUBSTITUTE_FOUND');
        else setOS('PARTIAL_ORDER_OPTION');

        ATROS_V3_STATE.logs.push(`[SYSTEM] NOTIFICATION_DISPATCHED: AWAITING_USER_DECISION`);
        
        const decision = await pollV3('injectedUserDecision', 15, ATROS_V3_STATE.no_response_preference === 'AUTO_EXECUTE' ? 'SUB' : 'CANCEL'); 
        userHasAlreadyConfirmedOnce = true; 

        if (decision === 'CANCEL') {
          setOS('CANCELLED');
          ATROS_V3_STATE.logs.push(`[FATAL] WORKFLOW_TERMINATED: AUTO_ACTION_CANCEL`);
          ATROS_V3_STATE.isRunning = false;
          return 'CANCELLED';
        } else if (decision === 'WITHOUT') {
          ATROS_V3_STATE.logs.push(`[INFO] USER_DECISION: PARTIAL_EXECUTION_MODE`);
        } else if (decision === 'SUB') {
          ATROS_V3_STATE.logs.push(`[INFO] AUTO_ACTION: ACCEPTING_SUBSTITUTE_PROTOCOL`);
        }
      }
    }

    // --- MODULE: INVENTORY LOCK (T-3 Hours) ---
    setOS('INVENTORY_LOCKED');
    ATROS_V3_STATE.logs.push(`[INFO] T-3H: INVENTORY_LOCK_PROCESSED`);
    await wait(800);

    // --- MODULE: T-60 CONFIRMATION (RECURSIVE) ---
    if (userHasAlreadyConfirmedOnce) {
      ATROS_V3_STATE.logs.push(`[INFO] T-60_BYPASS: CONSENT_ACQUIRED_PREVIOUSLY`);
      await wait(800);
    } else {
      setOS('CONFIRMATION_PENDING');
      ATROS_V3_STATE.logs.push(`[SYSTEM] T-60M: FINAL_CONFIRMATION_REQUEST_DISPATCHED`);
      
      let response = await pollV3('injectedT60Response', 10, 'TIMEOUT');

      // --- PHASE 2: T-30 RECURSIVE CHECK ---
      if (response === 'TIMEOUT' || response === 'NONE') {
        ATROS_V3_STATE.logs.push(`[WARN] T-60_INACTIVE: NO_USER_RESPONSE_DETECTED`);
        setOS('T30_CONFIRMATION_PENDING'); 
        ATROS_V3_STATE.logs.push(`[INFO] T-30M: ESCALATED_CONFIRMATION_REQUEST_SENT`);
        
        response = await pollV3('injectedT60Response', 10, 'TIMEOUT');
      }

      // --- PHASE 3: FINAL RESOLUTION ---
      if (response === 'CANCEL') {
        setOS('CANCELLED');
        ATROS_V3_STATE.logs.push(`[FATAL] WORKFLOW_TERMINATED: USER_MANUAL_ABORT`);
        ATROS_V3_STATE.isRunning = false;
        return 'CANCELLED';
      } 
      
      if (response === 'TIMEOUT' || response === 'NONE') {
        ATROS_V3_STATE.logs.push(`[CRITICAL] T-30_INACTIVE: COMMENCING_PREFERENCE_OVERRIDE`);
        await wait(1000);
        
        if (ATROS_V3_STATE.no_response_preference === 'AUTO_EXECUTE') {
          setOS('AUTO_EXECUTION');
          ATROS_V3_STATE.logs.push(`[SUCCESS] AUTO_ACTION: COMMENCING_AUTONOMOUS_EXECUTION`);
        } else {
          setOS('AUTO_CANCELLED');
          ATROS_V3_STATE.logs.push(`[FATAL] AUTO_ACTION: TERMINATING_INACTIVE_LIFECYCLE`);
          ATROS_V3_STATE.isRunning = false;
          return 'AUTO_CANCELLED';
        }
      } else {
        ATROS_V3_STATE.logs.push(`[SUCCESS] USER_DECISION: ORDER_VERIFIED_FOR_EXECUTION`);
      }
    }

    // --- MODULE: PAYMENT ---
    ATROS_V3_STATE.logs.push(`[INFO] COMMENCING_PAYMENT_PROTOCOL: ${paymentMethod.toUpperCase()}`);
    
    if (paymentMethod === 'Cash on Delivery' || paymentMethod === 'Cash') {
      ATROS_V3_STATE.logs.push(`[INFO] CASH_PROTOCOL: COLLECTION_SCHEDULED_AT_DELIVERY`);
      setOS('PAYMENT_SUCCESS');
      await wait(800);
    } else {
      setOS('PAYMENT_PENDING');
      ATROS_V3_STATE.logs.push(`[INFO] INITIATING_PAYMENT_HANDSHAKE: AWAITING_GATEWAY`);
      
      const payResult = await pollV3('injectedPayment', 20, ATROS_V3_STATE.no_response_preference === 'AUTO_EXECUTE' ? 'primary_ok' : 'failed');

      if (payResult === 'primary_ok') {
        setOS('PAYMENT_SUCCESS');
        ATROS_V3_STATE.logs.push(`[SUCCESS] PAYMENT_RESOLVED`);
      } else {
        setOS('CANCELLED');
        ATROS_V3_STATE.logs.push(`[FATAL] PAYMENT_FAILURE: WORKFLOW_TERMINATED`);
        ATROS_V3_STATE.isRunning = false;
        return 'FAILED';
      }
    }

    // --- MODULE: EXECUTION (T-0) ---
    setOS('EXECUTED');
    ATROS_V3_STATE.logs.push(`[SUCCESS] T-0: PROVIDER_API_EXECUTION_COMPLETED`);
    await wait(1000);

    setOS('COMPLETED');
    ATROS_V3_STATE.logs.push(`[SYSTEM] WORKFLOW_COMPLETE: DATA_PERSISTED`);
    
    ATROS_V3_STATE.isRunning = false;
    return 'SUCCESS';

  } catch (error) {
    console.error('[A-TROS V3] Error:', error);
    ATROS_V3_STATE.isRunning = false;
    return 'ERROR';
  }
}

async function wait(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function pollV3(field: string, timeoutSeconds?: number, defaultVal?: any): Promise<any> {
  const start = Date.now();
  const timeoutMs = timeoutSeconds ? timeoutSeconds * 1000 : Infinity;

  while (true) {
    if (ATROS_V3_STATE[field] !== null) {
      const val = ATROS_V3_STATE[field];
      ATROS_V3_STATE[field] = null;
      return val;
    }
    
    if (Date.now() - start > timeoutMs) {
      return defaultVal;
    }
    
    await wait(400);
  }
}
