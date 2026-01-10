/**
 * Feature flags for premium features.
 * 
 * This module controls which features are enabled based on platform.
 * Premium features are ONLY enabled in native Android app.
 * Web version remains fully free and unchanged.
 * 
 * IMPORTANT: 
 * - Do NOT add paywall UI here
 * - Do NOT add billing logic here
 * - This is infrastructure only for feature gating
 */

import { isAndroid, isWeb } from "./platform";

/**
 * Master flag for premium features.
 * When true, premium features are available.
 * 
 * Current behavior:
 * - Web: false (all features free)
 * - Android: true (premium features enabled)
 */
export const PREMIUM_ENABLED: boolean = isAndroid();

/**
 * Enables professional PDF export feature.
 * 
 * V1 Premium scope:
 * - Professional PDF medical report generation
 * - Enhanced formatting and branding
 * 
 * Default: false (web), true (Android)
 */
export const PDF_EXPORT_ENABLED: boolean = PREMIUM_ENABLED;

/**
 * Enables share/export medical profile feature.
 * 
 * V1 Premium scope:
 * - Share medical profile via native share sheet
 * - Export without handing over the phone
 * - Works with WhatsApp, SMS, Email, AirDrop, etc.
 * 
 * Default: false (web), true (Android)
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




