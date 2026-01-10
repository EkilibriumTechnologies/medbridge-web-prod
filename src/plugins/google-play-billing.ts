/**
 * Capacitor Plugin Wrapper for In-App Purchases (Google Play Billing / StoreKit)
 * 
 * MOBILE-ONLY REPOSITORY: TypeScript interface for native in-app purchase plugins.
 * - Android: Google Play Billing (one-time INAPP purchase, non-consumable)
 * - iOS: StoreKit (one-time purchase, non-consumable) - TODO: Implement iOS plugin
 * 
 * IMPORTANT:
 * - This file defines TypeScript types only
 * - Android implementation: android/app/src/main/java/com/ekilibrium/medbridge/GooglePlayBillingPlugin.java
 * - iOS implementation: TODO - Create StoreKit plugin
 * - Web fallback: google-play-billing.web.ts (returns empty/no-op)
 * 
 * Product ID: "pdf_export_annual" (one-time purchase, non-consumable)
 */

import { registerPlugin } from "@capacitor/core";

export interface PurchaseProductOptions {
  productId: string;
  // NOTE: Only "nonConsumable" is used in this mobile-only repository
  // This interface includes other types for type safety, but we only use one-time purchases
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

