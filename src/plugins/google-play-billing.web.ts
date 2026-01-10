/**
 * Web implementation of Google Play Billing plugin
 * 
 * This is a no-op implementation for web builds.
 * All methods return empty results or reject to indicate billing is not available.
 */

import { PurchaseProductOptions, PurchaseResult, Purchase } from "./google-play-billing";

export class GooglePlayBillingWeb {
  async initialize(): Promise<void> {
    // Web: no-op
    console.log("[Billing] Web build - billing not available");
  }

  async purchaseProduct(options: PurchaseProductOptions): Promise<PurchaseResult> {
    // Web: reject to indicate not available
    throw new Error("Billing is not available on web platform");
  }

  async getPurchases(): Promise<{ purchases: Purchase[] }> {
    // Web: return empty array
    return { purchases: [] };
  }
}

