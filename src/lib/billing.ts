/**
 * Google Play Billing Integration for Android
 * 
 * Provides billing functionality for premium PDF export feature.
 * Uses Google Play Billing API for one-time purchases.
 * 
 * IMPORTANT:
 * - Android-only (web builds are no-ops)
 * - Product ID: "pdf_export_annual" (one-time purchase, non-consumable)
 * - All purchase state stored locally (no backend)
 * - Integrates with existing license cycle system
 */

import { Capacitor } from "@capacitor/core";
import { isAndroid } from "./platform";

const PREMIUM_PURCHASE_STORAGE_KEY = "medbridge_premium_purchased";
const PRODUCT_ID = "pdf_export_annual";

// TESTING MODE: Set to true to simulate premium purchase for testing
// This will make hasPremiumPurchase() return true without actual purchase
const TESTING_MODE_SIMULATE_PREMIUM = false;

/**
 * Purchase state interface
 */
export interface PurchaseState {
  purchased: boolean;
  productId: string;
  purchaseToken?: string;
  purchaseTime?: number;
}

/**
 * Billing error types
 */
export enum BillingError {
  USER_CANCELLED = "USER_CANCELLED",
  ITEM_UNAVAILABLE = "ITEM_UNAVAILABLE",
  NETWORK_ERROR = "NETWORK_ERROR",
  BILLING_NOT_SUPPORTED = "BILLING_NOT_SUPPORTED",
  PURCHASE_PENDING = "PURCHASE_PENDING",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Billing result interface
 */
export interface BillingResult {
  success: boolean;
  error?: BillingError;
  message?: string;
  purchaseState?: PurchaseState;
}

/**
 * Checks if billing is available on this platform.
 * Returns false for web, true for Android (if properly configured).
 */
export function isBillingAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return isAndroid();
}

/**
 * Gets the current purchase state from localStorage.
 */
function getPurchaseState(): PurchaseState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(PREMIUM_PURCHASE_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as PurchaseState;
  } catch (error) {
    console.error("Error reading purchase state:", error);
    return null;
  }
}

/**
 * Saves the purchase state to localStorage.
 */
function savePurchaseState(state: PurchaseState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(PREMIUM_PURCHASE_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving purchase state:", error);
  }
}

/**
 * Clears any stale purchase state from localStorage.
 * Should be called on app start when testing mode is disabled.
 */
export function clearStalePurchaseState(): void {
  if (typeof window === "undefined") {
    return;
  }
  
  // If testing mode is disabled, clear any purchase state
  // This ensures no stale data from testing mode remains
  if (!TESTING_MODE_SIMULATE_PREMIUM) {
    try {
      localStorage.removeItem(PREMIUM_PURCHASE_STORAGE_KEY);
      console.log("[Billing] Cleared stale purchase state from localStorage");
    } catch (error) {
      console.error("[Billing] Error clearing purchase state:", error);
    }
  }
}

/**
 * Initializes the billing connection.
 * This should be called when the app starts (optional for web).
 * 
 * @returns Promise that resolves when billing is initialized
 */
export async function initBilling(): Promise<BillingResult> {
  // Clear stale purchase state when initializing (if testing mode is disabled)
  clearStalePurchaseState();
  
  if (!isBillingAvailable()) {
    // Web: no-op, return success
    return { success: true };
  }

  try {
    // For Android: initialize Google Play Billing
    // This will be handled by the native plugin
    const { GooglePlayBilling } = await import("@/plugins/google-play-billing");
    await GooglePlayBilling.initialize();
    
    return { success: true };
  } catch (error: any) {
    console.error("Error initializing billing:", error);
    
    // If plugin is not installed yet, fail gracefully
    if (error?.message?.includes("not found") || error?.message?.includes("undefined")) {
      console.warn("[Billing] Native plugin not installed. Billing will not work until plugin is added.");
      return {
        success: false,
        error: BillingError.BILLING_NOT_SUPPORTED,
        message: "Billing plugin is not installed",
      };
    }
    
    // Check for specific error types
    if (error?.code === "BILLING_NOT_SUPPORTED") {
      return {
        success: false,
        error: BillingError.BILLING_NOT_SUPPORTED,
        message: "Billing is not supported on this device",
      };
    }
    
    return {
      success: false,
      error: BillingError.UNKNOWN_ERROR,
      message: error?.message || "Failed to initialize billing",
    };
  }
}

/**
 * Checks if the user has purchased the premium PDF export feature.
 * Checks both localStorage and Google Play purchase state.
 * 
 * @returns true if premium is purchased, false otherwise
 */
export async function hasPremiumPurchase(): Promise<boolean> {
  // TESTING MODE: Simulate premium purchase for testing
  // This bypasses all checks and always returns true for testing
  if (TESTING_MODE_SIMULATE_PREMIUM) {
    console.log("[TESTING MODE] hasPremiumPurchase: Testing mode enabled - returning true");
    // Ensure purchase state is saved for testing (always save to ensure it's there)
    if (typeof window !== "undefined") {
      console.log("[TESTING MODE] Saving test purchase state to localStorage");
      savePurchaseState({
        purchased: true,
        productId: PRODUCT_ID,
        purchaseToken: "TEST_MODE_TOKEN_" + Date.now(),
        purchaseTime: Date.now(),
      });
      console.log("[TESTING MODE] Purchase state saved successfully");
      return true;
    }
    // Even if window is undefined (shouldn't happen in Capacitor), return true for testing
    console.log("[TESTING MODE] Window undefined, but returning true for testing");
    return true;
  }

  if (!isBillingAvailable()) {
    // Web: always return false (web is free)
    // Also clear any old purchase state from localStorage (from testing mode)
    if (typeof window !== "undefined") {
      localStorage.removeItem(PREMIUM_PURCHASE_STORAGE_KEY);
    }
    return false;
  }

  // IMPORTANT: Always verify with Google Play Billing API first
  // Do NOT trust localStorage alone - it may contain stale data from testing mode
  // Clear localStorage first to ensure no stale data
  if (typeof window !== "undefined") {
    console.log("[Billing] Clearing localStorage cache before verification");
    localStorage.removeItem(PREMIUM_PURCHASE_STORAGE_KEY);
  }

  try {
    // Try to verify with Google Play Billing API
    // IMPORTANT: On Android, if native plugin is not installed, Capacitor will use web fallback
    // Web fallback returns empty array, which is correct (no purchases = false)
    const { GooglePlayBilling } = await import("@/plugins/google-play-billing");
    console.log("[Billing] Google Play Billing plugin imported, checking purchases...");
    
    // Check if we're on Android but using web fallback (native plugin not installed)
    // This would mean getPurchases() will return empty array, which is correct
    const platform = Capacitor.getPlatform();
    console.log("[Billing] Current platform:", platform);
    
    let result: { purchases: any[] };
    try {
      result = await GooglePlayBilling.getPurchases();
      console.log("[Billing] getPurchases() completed successfully");
      console.log("[Billing] Result:", JSON.stringify(result));
    } catch (getPurchasesError: any) {
      // If getPurchases fails, cannot verify purchase
      console.error("[Billing] Error calling getPurchases():", getPurchasesError);
      console.log("[Billing] Cannot verify purchase - getPurchases failed. Returning false.");
      if (typeof window !== "undefined") {
        localStorage.removeItem(PREMIUM_PURCHASE_STORAGE_KEY);
      }
      return false;
    }
    
    const purchases = result.purchases || [];
    console.log("[Billing] Purchases found:", purchases.length, "purchases");
    console.log("[Billing] All purchases:", JSON.stringify(purchases));
    
    // Look for our product ID
    const premiumPurchase = purchases.find((p: any) => p.productId === PRODUCT_ID);
    console.log("[Billing] Looking for product:", PRODUCT_ID);
    console.log("[Billing] Premium purchase found:", premiumPurchase ? "YES" : "NO");
    
    if (premiumPurchase) {
      console.log("[Billing] Purchase found:", JSON.stringify(premiumPurchase));
      console.log("[Billing] Purchase state:", premiumPurchase.purchaseState);
      
      // Check purchase state - must be exactly "PURCHASED" (or lowercase "purchased")
      const isPurchased = premiumPurchase.purchaseState === "PURCHASED" || premiumPurchase.purchaseState === "purchased";
      console.log("[Billing] Is purchased state:", isPurchased);
      
      if (isPurchased) {
        console.log("[Billing] Premium purchase found and verified in Google Play");
        // Save to local storage for faster future checks (cache only)
        savePurchaseState({
          purchased: true,
          productId: PRODUCT_ID,
          purchaseToken: premiumPurchase.purchaseToken,
          purchaseTime: premiumPurchase.purchaseTime,
        });
        
        return true;
      } else {
        // Purchase exists but not in PURCHASED state
        console.log("[Billing] Purchase found but state is not PURCHASED:", premiumPurchase.purchaseState);
        console.log("[Billing] Returning false - purchase not in PURCHASED state");
        if (typeof window !== "undefined") {
          localStorage.removeItem(PREMIUM_PURCHASE_STORAGE_KEY);
        }
        return false;
      }
    } else {
      // No purchase found in Google Play - ensure localStorage is cleared
      console.log("[Billing] No purchase found in Google Play for product:", PRODUCT_ID);
      console.log("[Billing] Available purchases:", purchases.map((p: any) => ({ id: p.productId, state: p.purchaseState })));
      console.log("[Billing] Returning false - no purchase found");
      if (typeof window !== "undefined") {
        localStorage.removeItem(PREMIUM_PURCHASE_STORAGE_KEY);
      }
      return false;
    }
  } catch (importError: any) {
    // If plugin import fails, cannot verify purchase
    // Clear localStorage and return false (require plugin installation)
    console.error("[Billing] Error importing Google Play Billing plugin:", importError);
    console.log("[Billing] Cannot verify purchase - plugin import failed. Returning false.");
    if (typeof window !== "undefined") {
      localStorage.removeItem(PREMIUM_PURCHASE_STORAGE_KEY);
    }
    // Return false - cannot verify without plugin
    return false;
  }
}

/**
 * Initiates the purchase flow for premium PDF export.
 * Opens Google Play purchase dialog.
 * 
 * @returns Promise with purchase result
 */
export async function purchasePremiumPdfAnnual(): Promise<BillingResult> {
  if (!isBillingAvailable()) {
    return {
      success: false,
      error: BillingError.BILLING_NOT_SUPPORTED,
      message: "Billing is not available on this platform",
    };
  }

  try {
    const { GooglePlayBilling } = await import("@/plugins/google-play-billing");
    
    // Launch purchase flow
    let result: any;
    try {
      result = await GooglePlayBilling.purchaseProduct({
        productId: PRODUCT_ID,
        productType: "nonConsumable", // One-time purchase
      });
    } catch (pluginError: any) {
      // Handle plugin not installed or errors
      if (pluginError?.message?.includes("not found") || pluginError?.message?.includes("undefined") || pluginError?.code === "PLUGIN_NOT_FOUND") {
        throw {
          code: "BILLING_NOT_SUPPORTED",
          message: "Native billing plugin is not installed",
        };
      }
      
      // Handle specific Google Play error codes
      if (pluginError?.code === "USER_CANCELLED" || pluginError?.message?.includes("cancel")) {
        throw {
          code: "USER_CANCELLED",
          message: "Purchase was cancelled",
        };
      }
      
      if (pluginError?.code === "ITEM_UNAVAILABLE") {
        throw {
          code: "ITEM_UNAVAILABLE",
          message: "Product is not available",
        };
      }
      
      if (pluginError?.code === "NETWORK_ERROR" || pluginError?.message?.includes("network")) {
        throw {
          code: "NETWORK_ERROR",
          message: "Network error occurred",
        };
      }
      
      throw pluginError;
    }

    if (result.purchaseState === "PURCHASED") {
      // Save purchase state locally
      savePurchaseState({
        purchased: true,
        productId: PRODUCT_ID,
        purchaseToken: result.purchaseToken,
        purchaseTime: result.purchaseTime || Date.now(),
      });

      return {
        success: true,
        purchaseState: {
          purchased: true,
          productId: PRODUCT_ID,
          purchaseToken: result.purchaseToken,
          purchaseTime: result.purchaseTime,
        },
      };
    } else if (result.purchaseState === "PENDING") {
      return {
        success: false,
        error: BillingError.PURCHASE_PENDING,
        message: "Purchase is pending approval",
      };
    } else {
      return {
        success: false,
        error: BillingError.UNKNOWN_ERROR,
        message: "Purchase was not completed",
      };
    }
  } catch (error: any) {
    console.error("Error purchasing premium:", error);
    
    // Handle specific error codes from plugin
    if (error?.code === "USER_CANCELLED" || error?.message?.includes("cancel")) {
      return {
        success: false,
        error: BillingError.USER_CANCELLED,
        message: "Purchase was cancelled",
      };
    }
    
    if (error?.code === "ITEM_UNAVAILABLE") {
      return {
        success: false,
        error: BillingError.ITEM_UNAVAILABLE,
        message: "Product is not available",
      };
    }
    
    if (error?.code === "NETWORK_ERROR" || error?.message?.includes("network")) {
      return {
        success: false,
        error: BillingError.NETWORK_ERROR,
        message: "Network error. Please check your connection.",
      };
    }
    
    if (error?.code === "BILLING_NOT_SUPPORTED" || error?.message?.includes("not installed")) {
      return {
        success: false,
        error: BillingError.BILLING_NOT_SUPPORTED,
        message: "Billing is not supported on this platform",
      };
    }

    return {
      success: false,
      error: BillingError.UNKNOWN_ERROR,
      message: error?.message || "Failed to complete purchase",
    };
  }
}

/**
 * Restores previous purchases from Google Play.
 * Useful after app reinstall or device change.
 * 
 * @returns Promise with restore result
 */
export async function restorePurchases(): Promise<BillingResult> {
  if (!isBillingAvailable()) {
    return {
      success: false,
      error: BillingError.BILLING_NOT_SUPPORTED,
      message: "Billing is not available on this platform",
    };
  }

  try {
    const { GooglePlayBilling } = await import("@/plugins/google-play-billing");
    
    // Query Google Play for purchases
    let result: any;
    try {
      result = await GooglePlayBilling.getPurchases();
    } catch (pluginError: any) {
      // Handle plugin not installed
      if (pluginError?.message?.includes("not found") || pluginError?.message?.includes("undefined") || pluginError?.code === "PLUGIN_NOT_FOUND") {
        // Fall back to local storage only
        const localState = getPurchaseState();
        if (localState?.purchased) {
          return {
            success: true,
            purchaseState: localState,
          };
        }
        return {
          success: false,
          error: BillingError.BILLING_NOT_SUPPORTED,
          message: "Billing plugin not available",
        };
      }
      throw pluginError;
    }
    
    const purchases = result.purchases || [];
    
    // Look for our product ID
    const premiumPurchase = purchases.find((p: any) => p.productId === PRODUCT_ID);
    
    if (premiumPurchase && (premiumPurchase.purchaseState === "PURCHASED" || premiumPurchase.purchaseState === "purchased")) {
      // Save to local storage
      savePurchaseState({
        purchased: true,
        productId: PRODUCT_ID,
        purchaseToken: premiumPurchase.purchaseToken,
        purchaseTime: premiumPurchase.purchaseTime,
      });

      return {
        success: true,
        purchaseState: {
          purchased: true,
          productId: PRODUCT_ID,
          purchaseToken: premiumPurchase.purchaseToken,
          purchaseTime: premiumPurchase.purchaseTime,
        },
      };
    }

    return {
      success: false,
      error: BillingError.UNKNOWN_ERROR,
      message: "No previous purchases found",
    };
  } catch (error: any) {
    console.error("Error restoring purchases:", error);
    
    return {
      success: false,
      error: BillingError.UNKNOWN_ERROR,
      message: error?.message || "Failed to restore purchases",
    };
  }
}

/**
 * Clears the local purchase state (for testing only).
 */
export function clearPurchaseState(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(PREMIUM_PURCHASE_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing purchase state:", error);
  }
}

