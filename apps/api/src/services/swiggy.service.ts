/**
 * Swiggy Builder API Service
 *
 * Currently uses MOCK data — replace each method body with
 * real Swiggy API calls once the API key is received.
 *
 * Base URL: process.env.SWIGGY_API_BASE_URL
 * Auth:     Bearer process.env.SWIGGY_API_KEY
 */

interface PlaceOrderOptions {
  scheduleId: string;
  userId: string;
}

interface OrderResult {
  orderId: string;
  status: string;
  estimatedDelivery: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

class SwiggyService {
  private baseUrl = process.env.SWIGGY_API_BASE_URL || 'https://api.swiggy.com/builder/v1';
  private apiKey  = process.env.SWIGGY_API_KEY || '';

  // ── Place Order ─────────────────────────────────────────
  async placeOrder(options: PlaceOrderOptions): Promise<OrderResult> {
    console.log(`[Swiggy] Placing order for schedule ${options.scheduleId}`);

    // TODO: Replace with real API call:
    // const res = await fetch(`${this.baseUrl}/orders`, {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ scheduleId: options.scheduleId, userId: options.userId }),
    // });
    // return res.json();

    // MOCK RESPONSE:
    return {
      orderId: `swiggy_${Date.now()}`,
      status: 'PLACED',
      estimatedDelivery: '30-40 mins',
    };
  }

  // ── Check Menu Availability ─────────────────────────────
  async checkMenuAvailability(restaurantId: string, itemIds: string[]): Promise<MenuItem[]> {
    console.log(`[Swiggy] Checking availability for restaurant ${restaurantId}`);

    // TODO: Replace with real API call
    return itemIds.map(id => ({ id, name: `Item ${id}`, price: 150, available: true }));
  }

  // ── Get Restaurant Menu ─────────────────────────────────
  async getMenu(restaurantId: string): Promise<MenuItem[]> {
    console.log(`[Swiggy] Fetching menu for ${restaurantId}`);

    // TODO: Replace with real API call
    return [
      { id: 'item_001', name: 'Veg Burger',  price: 149, available: true },
      { id: 'item_002', name: 'Masala Fries', price: 99,  available: true },
      { id: 'item_003', name: 'Cold Coffee',  price: 129, available: false },
    ];
  }

  // ── Track Order ─────────────────────────────────────────
  async trackOrder(orderId: string) {
    console.log(`[Swiggy] Tracking order ${orderId}`);

    // TODO: Replace with real API call
    return {
      orderId,
      status: 'IN_TRANSIT',
      eta: '15 mins',
      trackingUrl: `https://swiggy.com/track/${orderId}`,
    };
  }
}

export const swiggyService = new SwiggyService();
