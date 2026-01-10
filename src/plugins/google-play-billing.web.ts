/**
 * Web implementation of In-App Purchase plugin (No-op)
 * 
 * MOBILE-ONLY REPOSITORY: This is a no-op fallback for web previews.
 * 
 * IMPORTANT: This repository is for mobile builds only (iOS/Android via Capacitor/Appflow).
 * Web builds in this repo are for Capacitor preview/testing only, not for production web.
 * 
 * Production web/B2B version lives in a separate repository.
 * 
 * All methods return empty results or reject to indicate billing is not available on web.
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

