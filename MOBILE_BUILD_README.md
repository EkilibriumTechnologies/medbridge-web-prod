# MedBridge Mobile - Build Configuration

## Overview

This repository is **MOBILE-ONLY** and is designed for iOS and Android builds via Capacitor and Ionic Appflow.

**Web/B2B functionality lives in a separate repository.**

## Build Configuration

### MOBILE_BUILD Flag

The `MOBILE_BUILD` flag is defined in `src/config/build.ts` and is set to `true` for this repository.

When `MOBILE_BUILD = true`:
- ✅ In-app purchases are required for premium features (PDF export, sharing)
- ✅ Google Play Billing (Android) / StoreKit (iOS) are used
- ✅ Local-only data handling (no public sharing, no accounts required)
- ✅ App Store / Google Play compliant monetization
- ❌ Provider payments disabled
- ❌ External checkout logic disabled
- ❌ Unrestricted sharing disabled
- ❌ Features that bypass in-app purchases disabled

### Capacitor Configuration

**File**: `capacitor.config.ts`

- **App ID**: `com.ekilibrium.medbridgeform` (matches Appflow configuration)
- **App Name**: `MedBridge Form` (display name in app stores)
- **Web Dir**: `out` (Next.js export output)

## Premium Features (Require In-App Purchase)

### PDF Export
- **Requirement**: Active one-time purchase
- **Product ID**: `pdf_export_annual` (INAPP, non-consumable)
- **Behavior**: Blocked if purchase not active, shows upgrade modal

### Share Medical Profile
- **Requirement**: Active one-time purchase
- **Product ID**: `pdf_export_annual` (same as PDF export)
- **Behavior**: Disabled if purchase not active, shows upgrade modal

### License Cycle
- **Duration**: 1 year from first use (PDF or Share) after purchase
- **Anchoring**: Cycle starts at one of three moments:
  1. Upon completing purchase
  2. Upon generating first PDF after purchase
  3. Upon sharing medical card after purchase
- **Storage**: Local only (localStorage)
- **No backend**: All cycle tracking is local

## Billing Implementation

### Android
- **Platform**: Google Play Billing Library v7.1.1
- **Product Type**: INAPP (one-time purchase, non-consumable)
- **Plugin**: `android/app/src/main/java/com/ekilibrium/medbridge/GooglePlayBillingPlugin.java`
- **Status**: ✅ Implemented and tested

### iOS
- **Platform**: StoreKit (one-time purchase, non-consumable)
- **Product Type**: Non-consumable
- **Plugin**: TODO - Needs to be implemented
- **Status**: ⚠️ Not yet implemented (placeholder for future)

## Store Compliance

### Required Features
- ✅ Restore purchases supported
- ✅ Clear UI indicating premium required
- ✅ Purchase gates on premium features
- ✅ One-time purchase model (no subscriptions)
- ✅ Local-only data handling

### Not Included
- ❌ Provider payments
- ❌ External checkout
- ❌ Public sharing features
- ❌ Social features
- ❌ Account requirements

## Appflow Build Configuration

### Android
- **Build Type**: AAB (Android App Bundle)
- **Package Name**: `com.ekilibrium.medbridgeform`
- **Signing**: Configured via Appflow
- **Billing**: Google Play Billing integrated

### iOS
- **Build Type**: IPA (iOS App Store)
- **Bundle ID**: `com.ekilibrium.medbridgeform` (matches Appflow)
- **Signing**: Configured via Appflow
- **Billing**: StoreKit integration needed (TODO)

## Feature Flags

Feature flags are defined in `src/lib/features.ts`:

- `MOBILE_BUILD`: Master flag (always true in this repo)
- `PREMIUM_ENABLED`: Enabled only in mobile builds when `MOBILE_BUILD && isNative()`
- `PDF_EXPORT_ENABLED`: Requires `PREMIUM_ENABLED`
- `SHARE_ENABLED`: Requires `PREMIUM_ENABLED`

## Where MOBILE_BUILD is Enforced

1. **`src/config/build.ts`**: Build configuration and flags
2. **`src/lib/billing.ts`**: All billing functions check `MOBILE_BUILD` first
3. **`src/lib/features.ts`**: Feature flags use `MOBILE_BUILD` to determine availability
4. **`src/components/MedicalCard.tsx`**: Premium feature gates
5. **`src/components/UpgradeModal.tsx`**: Purchase/renewal UI

## Development

### Building for Mobile

```bash
# Build Next.js output
npm run build:capacitor

# Sync to Capacitor
npm run cap:sync

# Open in native IDE
npm run cap:open:android  # Android Studio
npm run cap:open:ios      # Xcode (macOS required)
```

### Testing

- Use test accounts configured in Google Play Console / App Store Connect
- Test purchase flow, restore purchases, and license cycle creation
- Verify premium gates work correctly

## Important Notes

- **This is a mobile-only repository** - Web/B2B version is separate
- **All premium features require in-app purchase** - No workarounds or bypasses
- **Data stays local** - No public sharing, no cloud backup, no accounts
- **Store compliant** - Follows Google Play and App Store guidelines
- **One-time purchase only** - No subscriptions in this version

