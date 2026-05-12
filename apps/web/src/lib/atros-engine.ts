import { PrismaClient } from '@prisma/client';
import { TRIAL_WAREHOUSE } from './warehouse-catalog';

export const prisma = new PrismaClient();

// ============================================================================
// HELPERS (NOTIFICATIONS & ALERTS)
// ============================================================================

async function logWarehouseAlert(id: string, name: string, reason: string) {
  console.log(`[ALERT] Logging warehouse stockout for ${name}...`);
  try {
    // In a real app, this would be a DB call. In trial, we hit our own API.
    await fetch('http://localhost:3000/api/warehouse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'LOG_ALERT', 
        alert: { id, name, reason, timestamp: new Date().toISOString() } 
      })
    });
  } catch (e) {
    console.error('Failed to log warehouse alert:', e);
  }
}

async function sendWhatsAppNotification(userId: string, message: string) {
  console.log(`\n📱 [WHATSAPP] To: ${userId} | Msg: ${message}\n`);
  // For the demo, we just log this to the server console. 
  // In production, this uses the Twilio / Meta API.
}

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type Category =
  | 'groceries' | 'pharmacy' | 'meals' | 'pet'
  | 'office' | 'baby' | 'wellness' | 'household';

export type Platform = 'swiggy' | 'blinkit' | 'zepto' | 'instamart';
export type RiskLabel = 'HIGH' | 'LOW' | 'CRITICAL';
export type SubTier = 1 | 2 | 3 | 4;
export type UserDecision = 'CONFIRM' | 'SKIP' | 'EDIT' | 'RESCHEDULE' | 'TIMEOUT';
export type OrderOutcome = 'SUCCESS' | 'PARTIAL' | 'SKIPPED' | 'FAILED';
export type NotificationChannel = 'whatsapp' | 'push' | 'sms' | 'email';

export interface RIOItem {
  item_id:          string;
  name:             string;
  qty:              number;
  preferred_brand:  string;
  last_known_price: number;
  category_tags:    string[];
  dietary_tags:     string[];
  blacklisted_brands: string[];
}

export interface BudgetRules {
  total_budget:       number;
  per_item_cap:       number;
  price_flex_pct:     number;
  allow_other_brands: boolean;
  continue_without:   boolean;
  auto_accept_sub:    boolean;
  budget_alert_pct:   number;
}

export interface RIO {
  automation_id:      string;
  user_id:            string;
  category:           Category;
  items:              RIOItem[];
  frequency:          'daily' | 'weekly' | 'custom_cron';
  cron_expression:    string;
  delivery_time:      string;
  timezone:           string;
  platform:           Platform;
  budget_rules:       BudgetRules;
  notification_prefs: NotificationChannel[];
  payment_primary:    string;
  payment_backup:     string;
  address_id:         string;
  active:             boolean;
  confidence_score:   number;
  created_at:         Date;
}

export interface DemandMap {
  sku_id:               string;
  product_name:         string;
  required_qty:         number;
  recurring_users:      number;
  delivery_date:        Date;
  predicted_shortage:   boolean;
  urgency:              RiskLabel;
  action_deadline:      Date;
  warehouse_zone:       string;
}

export interface SubstituteResult {
  tier:           SubTier;
  item:           Partial<RIOItem> & { price: number; item_id: string };
  confidence:     number;
  price_delta:    number;
  delta_pct:      number;
  source:         'brand_match' | 'history' | 'llm' | 'none';
}

export interface InventoryLock {
  lock_id:        string;
  sku_id:         string;
  qty_locked:     number;
  locked_for:     string[];
  lock_type:      'RECURRING_RESERVED';
  locked_at:      Date;
  expires_at:     Date;
  velocity_score: number;
}

export interface OutcomeLog {
  user_id:           string;
  rio_id:            string;
  sku_id:            string;
  original_item:     string;
  substitute_offered?: string;
  substitute_tier?:  SubTier;
  user_choice:       'accept' | 'reject' | 'continue_without' | 'skip' | 'timeout';
  stockout_occurred: boolean;
  risk_score_at_time: number;
  order_outcome:     OrderOutcome;
  timestamp:         Date;
}

// ============================================================================
// PART 4 — WAREHOUSE ENGINE
// ============================================================================

export class WarehouseEngine {
  static async aggregateDemand(skuId: string, deliveryDate: Date, warehouseZone: string): Promise<DemandMap> {
    // In trial mode, we simulate aggregated demand
    return {
      sku_id: skuId,
      product_name: skuId,
      required_qty: 10,
      recurring_users: 5,
      delivery_date: deliveryDate,
      predicted_shortage: true,
      urgency: 'HIGH',
      action_deadline: new Date(),
      warehouse_zone: warehouseZone
    };
  }

  static async notifyAndAwaitProcurement(demand: DemandMap): Promise<boolean> {
    console.log(`[WAREHOUSE] Checking stock for ${demand.sku_id}...`);
    // Random failure for testing: 30% chance of stockout
    const success = Math.random() > 0.3;
    return success;
  }
}

// ============================================================================
// PART 5 — SUBSTITUTION ENGINE (USES TRIAL WAREHOUSE)
// ============================================================================

export class SubstitutionEngine {
  static checkBudgetWindow(candidatePrice: number, currentOrderTotal: number, originalPrice: number, rules: BudgetRules): boolean {
    const min = originalPrice * (1 - rules.price_flex_pct / 100);
    const max = originalPrice * (1 + rules.price_flex_pct / 100);
    return (
      candidatePrice >= min &&
      candidatePrice <= max &&
      candidatePrice <= rules.per_item_cap &&
      (currentOrderTotal + candidatePrice) <= rules.total_budget
    );
  }

  static async findSubstitute(originalItem: RIOItem, currentOrderTotal: number, rules: BudgetRules, userId: string, warehouseCatalog?: any[]): Promise<SubstituteResult | null> {
    const originalPrice = originalItem.last_known_price;
    const catalog = warehouseCatalog || TRIAL_WAREHOUSE;

    // Search in provided catalog
    const candidates = catalog.filter(p => 
      p.category === originalItem.category_tags[0] || 
      p.tags.some(t => originalItem.category_tags.includes(t))
    ).filter(p => p.id !== originalItem.item_id && p.in_stock);

    // Tier 1: Same Brand (different SKU)
    const tier1 = candidates.find(c => c.brand === originalItem.preferred_brand && this.checkBudgetWindow(c.price, currentOrderTotal, originalPrice, rules));
    if (tier1) {
      return { tier: 1, item: { ...tier1, item_id: tier1.id, qty: originalItem.qty }, confidence: 0.95, price_delta: tier1.price - originalPrice, delta_pct: ((tier1.price - originalPrice) / originalPrice) * 100, source: 'brand_match' };
    }

    // Tier 2: Different Brand, Same Category
    const tier2 = candidates.find(c => this.checkBudgetWindow(c.price, currentOrderTotal, originalPrice, rules));
    if (tier2) {
      return { tier: 2, item: { ...tier2, item_id: tier2.id, qty: originalItem.qty }, confidence: 0.80, price_delta: tier2.price - originalPrice, delta_pct: ((tier2.price - originalPrice) / originalPrice) * 100, source: 'history' };
    }

    return null;
  }

  static async triggerUserNotification(rio: RIO, originalItem: RIOItem, substitute: SubstituteResult | null): Promise<UserDecision> {
    const channel = rio.notification_prefs[0];
    const message = substitute 
      ? `OOS Alert: ${originalItem.name} is out. Switch to ${substitute.item.name} for ₹${substitute.item.price}?` 
      : `OOS Alert: ${originalItem.name} is out and no substitute fits your budget.`;
    
    console.log(`[${channel.toUpperCase()}] Notification to ${rio.user_id}: ${message}`);
    // In trial mode, we auto-confirm if auto_accept_sub is true, else mock CONFIRM
    return 'CONFIRM';
  }
}

// ============================================================================
// PART 6 — EXECUTION ENGINE
// ============================================================================

export class ExecutionEngine {
  static async requestConfirmation(rio: RIO): Promise<UserDecision> {
    console.log(`[EXECUTE] T-60 Confirmation for ${rio.user_id}...`);
    return 'CONFIRM';
  }

  static async executeOrder(rio: RIO, finalItems: any[]): Promise<{ success: boolean; order_id?: string }> {
    console.log(`[EXECUTE] Firing ${rio.platform} order for ${rio.user_id}...`);
    const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
    return { success: true, order_id: orderId };
  }
}

// ============================================================================
// CORE PIPELINE
// ============================================================================

export async function runAtrosPipeline(rio: RIO, targetDate: Date, warehouseCatalog?: any[]): Promise<OrderOutcome> {
  const catalog = warehouseCatalog || TRIAL_WAREHOUSE;
  console.log(`\n══════════════════════════════════════════════════════════════════════`);
  console.log(`  A-TROS PIPELINE START | RIO: ${rio.automation_id} | User: ${rio.user_id}`);
  console.log(`══════════════════════════════════════════════════════════════════════\n`);

  let finalCart: any[] = [];
  let budgetConsumed = 0;

  for (const item of rio.items) {
    console.log(`── Processing item: ${item.name} ──`);

    // Check stock in the provided catalog with robust name matching
    const warehouseItem = catalog.find(p => 
      p.id === item.item_id || 
      p.name.toLowerCase() === item.name.toLowerCase()
    );
    
    // IF item is found in warehouse, use its real status. NO random fallbacks.
    const inStock = warehouseItem ? warehouseItem.in_stock : true;

    if (inStock) {
      console.log(`[WAREHOUSE] ✅ ${item.name} is in stock.`);
      finalCart.push({ ...item, price: item.last_known_price });
      budgetConsumed += item.last_known_price * item.qty;
    } else {
      console.log(`[RECOVERY] 🚨 ${item.name} is OUT OF STOCK. Triggering Recovery...`);
      
      // 1. Alert Warehouse
      await logWarehouseAlert(item.item_id || 'UNK', item.name, 'Stockout detected by A-TROS');

      // 2. Run Substitution Logic
      const sub = await SubstitutionEngine.findSubstitute(item, budgetConsumed, rio.budget_rules, rio.user_id, catalog);
      
      if (sub) {
        // 3. Notify User & WAIT for decision
        const msg = `Zautomeal: ${item.name} is out. Switch to ${sub.item.name} (₹${sub.item.price})?`;
        await sendWhatsAppNotification(rio.user_id, msg);

        // For the trial/demo: We check if the RIO has auto_accept_sub turned on
        // If not, we still return CONFIRM for the automated flow, but we'll 
        // make the UI handle the "wait" state in the next step.
        const decision = rio.budget_rules.auto_accept_sub ? 'CONFIRM' : 'CONFIRM'; 
        
        console.log(`[RECOVERY] Applying substitution: ${sub.item.name}`);
        finalCart.push(sub.item);
        budgetConsumed += sub.item.price * sub.item.qty;
      } else {
        await sendWhatsAppNotification(rio.user_id, `Zautomeal Alert: ${item.name} is OOS. No substitute fits your budget.`);
        if (!rio.budget_rules.continue_without) return 'FAILED';
      }
    }
  }

  if (finalCart.length === 0) return 'SKIPPED';

  const confirmation = await ExecutionEngine.requestConfirmation(rio);
  if (confirmation !== 'CONFIRM') return 'SKIPPED';

  const result = await ExecutionEngine.executeOrder(rio, finalCart);
  
  console.log(`\n══════════════════════════════════════════════════════════════════════`);
  console.log(`  A-TROS PIPELINE COMPLETE | Outcome: ${result.success ? 'SUCCESS' : 'FAILED'}`);
  console.log(`  Items: ${finalCart.length} | Total: ₹${budgetConsumed}`);
  console.log(`══════════════════════════════════════════════════════════════════════\n`);

  return result.success ? 'SUCCESS' : 'FAILED';
}
