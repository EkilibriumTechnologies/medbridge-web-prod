/**
 * Capacitor Plugin Wrapper for Google Play Billing
 * 
 * This is a TypeScript interface for the native Google Play Billing plugin.
 * The actual native implementation will be in the Android plugin code.
 * 
 * IMPORTANT: This file is for TypeScript types only.
 * The actual plugin implementation must be created in the Android native code.
 */

import { registerPlugin } from "@capacitor/core";

export interface PurchaseProductOptions {
  productId: string;
  productType: "consumable" | "nonConsumable" | "subscription";
}

export interface PurchaseResult {
  productId: string;
  purchaseState: "PURCHASED" | "PENDING" | "CANCELLED";
  purchaseToken?: string;
  purchaseTime?: number;
}

export interface Purchase {
  productId: string;
  purchaseState: string;
  purchaseToken?: string;
  purchaseTime?: number;
}

export interface GetPurchasesResult {
  purchases: Purchase[];
}

export interface GooglePlayBillingPlugin {
  /**
   * Initialize the Google Play Billing connection
   */
  initialize(): Promise<void>;

  /**
   * Purchase a product
   */
  purchaseProduct(options: PurchaseProductOptions): Promise<PurchaseResult>;

  /**
   * Get all purchases (for restore)
   */
  getPurchases(): Promise<GetPurchasesResult>;
}

/**
 * Register the plugin
 * This will work if the native plugin is properly installed
 * If not installed, calls will fail gracefully (web safe)
 */
const GooglePlayBilling = registerPlugin<GooglePlayBillingPlugin>("GooglePlayBilling", {
  web: () => import("./google-play-billing.web").then((m) => new m.GooglePlayBillingWeb()),
});

export { GooglePlayBilling };

