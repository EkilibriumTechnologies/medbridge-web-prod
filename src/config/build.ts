/**
 * Build Configuration
 * 
 * This file defines build-time flags that determine which features
 * are available in the current build target.
 * 
 * IMPORTANT: This repository is for MOBILE-ONLY builds (iOS + Android via Capacitor/Appflow).
 * Web/B2B functionality lives in a separate repository.
 * 
 * MOBILE_BUILD = true: iOS/Android builds via Capacitor
 *   - Uses Google Play Billing (Android) / StoreKit (iOS)
 *   - PDF export and sharing require one-time in-app purchase
 *   - No provider payments or external checkout
 *   - No social features or public sharing
 *   - Data stays local, no accounts required
 * 
 * This flag should be set to true for all builds in this repository.
 */

/**
 * Build target flag.
 * 
 * When true, the app is built for mobile platforms (iOS/Android) with:
 * - In-app purchase requirements for premium features
 * - Store-compliant monetization (Google Play / App Store)
 * - Local-only data handling
 * 
 * When false, features should gracefully degrade or disable.
 * 
 * For this mobile-only repository, this should always be true.
 * Web/B2B builds should use a separate repository.
 */
export const MOBILE_BUILD: boolean = true;

/**
 * Platform-specific build flags.
 * These are derived from runtime platform detection but controlled by MOBILE_BUILD.
 */
export const IS_MOBILE_BUILD = MOBILE_BUILD;

/**
 * Export build configuration for use across the app.
 */
export const BuildConfig = {
  isMobile: MOBILE_BUILD,
  isWeb: false, // This is a mobile-only repository
  requiresInAppPurchase: MOBILE_BUILD,
  supportsBilling: MOBILE_BUILD,
} as const;

