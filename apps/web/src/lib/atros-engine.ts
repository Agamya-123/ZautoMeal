import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// ============================================================================
// A-TROS v2.0 - FULL STATE MACHINE (21 STATUSES)
// ============================================================================
export type OS_STATE = 
  | 'CREATED'                   // RIO saved, job scheduled
  | 'WAREHOUSE_NOTIFIED'        // Item flagged unavailable, alert sent
  | 'INVENTORY_RESERVED'        // Procurement confirmed by warehouse
  | 'SUBSTITUTE_SEARCH'         // Procurement failed, looking for alt
  | 'INVENTORY_LOCKED'          // T-3hr reservation placed with provider
  | 'SUBSTITUTE_FOUND'          // Valid alternative found in budget
  | 'PARTIAL_ORDER_OPTION'      // No alt found, showing skip-item option
  | 'USER_ACTION_PENDING'       // Notification sent, waiting for user
  | 'SUBSTITUTE_ACCEPTED'       // User said yes to the alternative
  | 'PARTIAL_EXECUTION'         // User said continue without the item
  | 'CONFIRMATION_PENDING'      // T-60 notification sent
  | 'REMINDER_SENT'             // T-10 reminder sent (no response yet)
  | 'AUTO_EXECUTION'            // No response, auto-placing order
  | 'PAYMENT_SUCCESS'           // Primary payment worked
  | 'PAYMENT_WITH_BACKUP'       // Backup payment used
  | 'PAYMENT_APPROVAL_REQUIRED' // Both payments failed, need user action
  | 'EXECUTED'                  // Order placed with provider
  | 'COMPLETED'                 // Done, next occurrence queued
  | 'SKIPPED'                   // User skipped today
  | 'ATROS_PAUSED'              // Automation paused
  | 'EXIT_RIO';                 // Automation deleted

// ============================================================================
// GLOBAL TEST STATE (A-TROS v2.0)
// ============================================================================
export let ATROS_TEST_STATE: any = {
  mode: true,
  isRunning: false,
  current_os: 'IDLE',
  logs: [] as string[],
  // Test Controls
  injectedInventory: null,
  injectedProcurement: null,
  injectedSubFound: null,
  injectedUserResponse: null,
  injectedPayment: null,
  brand_preferences: {} as Record<string, number>
};

export function updateTestState(newState: any) {
  ATROS_TEST_STATE = { ...ATROS_TEST_STATE, ...newState };
}

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
export interface RIOItem {
  item_id: string;
  name: string;
  qty: number;
  preferred_brand: string;
  last_known_price: number;
}

export interface BudgetRules {
  total_budget: number;
  per_item_cap: number;
  price_flex_pct: number;
  allow_other_brands: boolean;
  continue_without: boolean;
}

export interface RIO {
  automation_id: string;
  user_id: string;
  category: string;
  items: RIOItem[];
  budget_rules: BudgetRules;
}

// ============================================================================
// CORE PIPELINE (PURE LOGIC ENGINE)
// ============================================================================

export async function runAtrosPipeline(rio: RIO): Promise<string> {
  if (ATROS_TEST_STATE.isRunning) {
    console.warn('[A-TROS] Pipeline already running. Ignoring request.');
    return 'ALREADY_RUNNING';
  }

  ATROS_TEST_STATE.isRunning = true;
  ATROS_TEST_STATE.logs = [`🚀 A-TROS EXECUTION START | ID: ${rio.automation_id}`];
  
  const setOS = (state: OS_STATE) => {
    ATROS_TEST_STATE.current_os = state;
    ATROS_TEST_STATE.logs.push(`[STATE] → ${state}`);
  };

  try {
    // NODE 1 — CREATED
    setOS('CREATED');
    await wait(800);

    // NODE 2 — T-3 DAYS: INVENTORY CHECK
    ATROS_TEST_STATE.logs.push(`🔍 Calling Provider API: check_inventory(${rio.items[0].name})...`);
    const isAvailable = await pollTestControl('injectedInventory') === 'available';

    if (isAvailable) {
      ATROS_TEST_STATE.logs.push(`✅ Item in stock. Proceeding to Lock window.`);
    } else {
      // NODE 2b — WAREHOUSE NOTIFIED
      setOS('WAREHOUSE_NOTIFIED');
      ATROS_TEST_STATE.logs.push(`⚠️ Item OUT OF STOCK. Alerting warehouse partner...`);
      
      // NODE 3 — PROCUREMENT WINDOW (Wait for warehouse)
      ATROS_TEST_STATE.logs.push(`⏳ Waiting for procurement confirmation (Window: 48hr simulated)...`);
      const procResult = await pollTestControl('injectedProcurement');

      if (procResult === 'confirmed') {
        setOS('INVENTORY_RESERVED');
        ATROS_TEST_STATE.logs.push(`✅ Warehouse confirmed stock arriving. Inventory Reserved.`);
      } else {
        // NODE 4 — SUBSTITUTION ENGINE
        setOS('SUBSTITUTE_SEARCH');
        ATROS_TEST_STATE.logs.push(`❌ Procurement FAILED. Searching for alternatives...`);
        
        const subFound = await pollTestControl('injectedSubFound');

        if (subFound) {
          setOS('SUBSTITUTE_FOUND');
          ATROS_TEST_STATE.logs.push(`💬 Valid substitute found within budget (±${rio.budget_rules.price_flex_pct}%).`);
          setOS('USER_ACTION_PENDING');
          
          const decision = await awaitUserDecision();
          if (decision === 'SKIP') { 
            setOS('SKIPPED'); 
            ATROS_TEST_STATE.isRunning = false;
            return 'SKIPPED'; 
          }
          if (decision === 'CONFIRM') {
            setOS('SUBSTITUTE_ACCEPTED');
            const brand = "Alternative Brand";
            ATROS_TEST_STATE.brand_preferences[brand] = (ATROS_TEST_STATE.brand_preferences[brand] || 0) + 1;
            ATROS_TEST_STATE.logs.push(`📈 Brand preference updated for ${brand}.`);
          }
        } else {
          setOS('PARTIAL_ORDER_OPTION');
          ATROS_TEST_STATE.logs.push(`⚠️ No substitutes fit budget rules.`);
          setOS('USER_ACTION_PENDING');
          
          const decision = await awaitUserDecision();
          if (decision === 'SKIP') { 
            setOS('SKIPPED'); 
            ATROS_TEST_STATE.isRunning = false;
            return 'SKIPPED'; 
          }
          setOS('PARTIAL_EXECUTION');
        }
      }
    }

    // NODE 5 — T-3 HOURS: INVENTORY LOCK
    setOS('INVENTORY_LOCKED');
    ATROS_TEST_STATE.logs.push(`🔒 Units reserved with Provider API. Stock locked.`);
    await wait(800);

    // NODE 6 — T-60 CONFIRMATION
    setOS('CONFIRMATION_PENDING');
    ATROS_TEST_STATE.logs.push(`📱 T-60 Notification sent via WhatsApp...`);
    
    const finalConfirm = await awaitUserDecision();
    if (finalConfirm === 'SKIP') { 
      setOS('SKIPPED'); 
      ATROS_TEST_STATE.isRunning = false;
      return 'SKIPPED'; 
    }
    if (finalConfirm === 'TIMEOUT') {
      setOS('REMINDER_SENT');
      ATROS_TEST_STATE.logs.push(`🔔 T-10 Reminder sent.`);
      await wait(1500);
      setOS('AUTO_EXECUTION');
      ATROS_TEST_STATE.logs.push(`🤖 No response. Auto-executing based on schedule.`);
    }

    // NODE 7 — EXECUTION + PAYMENT
    const payResult = await pollTestControl('injectedPayment') || 'success';
    if (payResult === 'success') {
      setOS('PAYMENT_SUCCESS');
    } else if (payResult === 'fail_primary') {
      setOS('PAYMENT_WITH_BACKUP');
      ATROS_TEST_STATE.logs.push(`⚠️ Primary Payment FAILED. Backup payment SUCCEEDED.`);
    } else {
      setOS('PAYMENT_APPROVAL_REQUIRED');
      ATROS_TEST_STATE.logs.push(`❌ BOTH PAYMENTS FAILED. Manual intervention required.`);
      ATROS_TEST_STATE.isRunning = false;
      return 'FAILED';
    }

    setOS('EXECUTED');
    ATROS_TEST_STATE.logs.push(`🚀 Order placed via Provider API.`);
    await wait(1000);

    // NODE 8 — COMPLETED
    setOS('COMPLETED');
    ATROS_TEST_STATE.logs.push(`✨ Execution finished. Next occurrence queued.`);
    
    ATROS_TEST_STATE.isRunning = false;
    return 'SUCCESS';

  } catch (error) {
    console.error('[A-TROS] Pipeline Crash:', error);
    ATROS_TEST_STATE.isRunning = false;
    return 'FAILED';
  }
}

// ============================================================================
// HELPERS
// ============================================================================

async function wait(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function pollTestControl(field: string): Promise<any> {
  while (true) {
    if (ATROS_TEST_STATE[field] !== null) {
      const val = ATROS_TEST_STATE[field];
      ATROS_TEST_STATE[field] = null; // Clear it
      return val;
    }
    await wait(400); // Check every 400ms
  }
}

async function awaitUserDecision(): Promise<string> {
  while (true) {
    if (ATROS_TEST_STATE.injectedUserResponse) {
      const res = ATROS_TEST_STATE.injectedUserResponse;
      ATROS_TEST_STATE.injectedUserResponse = null;
      return res;
    }
    await wait(400);
  }
}
