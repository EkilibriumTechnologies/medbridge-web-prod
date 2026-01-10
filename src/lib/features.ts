/**
 * Feature flags for premium features.
 * 
 * MOBILE-ONLY REPOSITORY: This is for iOS/Android builds via Capacitor/Appflow.
 * Web/B2B functionality lives in a separate repository.
 * 
 * Premium features require a one-time in-app purchase (Google Play / App Store).
 * When purchase is not active:
 * - PDF export is blocked
 * - Share button is disabled
 * - UI clearly indicates premium is required
 * 
 * IMPORTANT: 
 * - Do NOT add paywall UI here
 * - Do NOT add billing logic here
 * - This is infrastructure only for feature gating
 * - All features are gated behind MOBILE_BUILD flag
 */

import { MOBILE_BUILD } from "@/config/build";
import { isAndroid, isIOS, isNative } from "./platform";

/**
 * Master flag for premium features.
 * 
 * Premium features are ONLY enabled in mobile builds (iOS/Android) when:
 * - MOBILE_BUILD is true (this repository)
 * - Platform is native (Android or iOS)
 * 
 * For this mobile-only repository, this should be true for native platforms.
 */
export const PREMIUM_ENABLED: boolean = MOBILE_BUILD && isNative();

/**
 * Enables professional PDF export feature.
 * 
 * MOBILE ONLY: Requires one-time in-app purchase (Google Play / App Store).
 * - Professional PDF medical report generation
 * - Enhanced formatting and branding
 * - Blocked if purchase is not active
 * 
 * Enabled only in mobile builds (iOS/Android) when PREMIUM_ENABLED is true.
 */
export const PDF_EXPORT_ENABLED: boolean = PREMIUM_ENABLED;

/**
 * Enables share/export medical profile feature.
 * 
 * MOBILE ONLY: Requires one-time in-app purchase (Google Play / App Store).
 * - Share medical profile via native share sheet
 * - Export without handing over the phone
 * - Works with WhatsApp, SMS, Email, AirDrop, etc.
 * - Disabled if purchase is not active
 * 
 * Enabled only in mobile builds (iOS/Android) when PREMIUM_ENABLED is true.
 */
export const SHARE_ENABLED: boolean = PREMIUM_ENABLED;

/**
 * Feature flag for QR code functionality.
 * 
 * NOTE: QR feature is NOT in V1.
 * This flag is set to false for all platforms.
 * 
 * Default: false (all platforms)
 */
export const QR_ENABLED: boolean = false;

/**
 * Feature flag for cloud medical backup.
 * 
 * NOTE: Cloud backup is NOT in V1.
 * This flag is set to false for all platforms.
 * 
 * Default: false (all platforms)
 */
export const CLOUD_BACKUP_ENABLED: boolean = false;

/**
 * Feature flag for biometric authentication.
 * 
 * NOTE: Biometrics is NOT in V1.
 * This flag is set to false for all platforms.
 * 
 * Default: false (all platforms)
 */
export const BIOMETRICS_ENABLED: boolean = false;

/**
 * Feature flag for login/authentication.
 * 
 * NOTE: Login is NOT in V1.
 * This flag is set to false for all platforms.
 * 
 * Default: false (all platforms)
 */
export const LOGIN_ENABLED: boolean = false;

/**
 * Helper function to check if a feature is enabled.
 * Useful for conditional rendering or feature gates.
 * 
 * @param feature - The feature flag to check
 * @returns true if the feature is enabled, false otherwise
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature] ?? false;
}

/**
 * All feature flags in one object for easy access.
 */
export const featureFlags = {
  PREMIUM_ENABLED,
  PDF_EXPORT_ENABLED,
  SHARE_ENABLED,
  QR_ENABLED,
  CLOUD_BACKUP_ENABLED,
  BIOMETRICS_ENABLED,
  LOGIN_ENABLED,
} as const;




