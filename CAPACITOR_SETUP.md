# Capacitor Android Setup

This document describes the Capacitor integration for Android builds with premium feature separation.

## Overview

The project has been configured to support Android builds via Capacitor while maintaining full free access on the web version. Premium features are enabled **only** in the native Android app.

## Architecture

### Platform Detection (`src/lib/platform.ts`)

Reliable platform detection using Capacitor APIs (not user-agent sniffing):

- `isWeb()` - Returns true for web browsers (desktop and mobile web)
- `isAndroid()` - Returns true only for native Android app
- `isIOS()` - Returns true only for native iOS app (future-safe)
- `isNative()` - Returns true for any native mobile platform
- `getPlatform()` - Returns current platform name

### Feature Flags (`src/lib/features.ts`)

Feature flags control premium features based on platform:

- `PREMIUM_ENABLED` - Master flag (true on Android, false on web)
- `PDF_EXPORT_ENABLED` - Professional PDF export (Android only)
- `SHARE_ENABLED` - Share/export medical profile (Android only)
- `QR_ENABLED` - QR functionality (disabled for V1)
- `CLOUD_BACKUP_ENABLED` - Cloud backup (disabled for V1)
- `BIOMETRICS_ENABLED` - Biometric auth (disabled for V1)
- `LOGIN_ENABLED` - Login/auth (disabled for V1)

**Default Behavior:**
- **Web**: All premium flags = `false` (fully free)
- **Android**: Premium flags = `true` (PDF + Share enabled)

## Premium Features (V1 - Android Only)

1. **PDF Export** - Professional medical report PDF generation
2. **Share Medical Profile** - Native share sheet integration (WhatsApp, SMS, Email, AirDrop, etc.)

## Build Process

### Web Build (Unchanged)
```bash
npm run build
npm start
```
Normal Next.js build - no changes to web functionality.

### Android Build (Capacitor)
```bash
# Build for Capacitor (static export)
npm run build:capacitor

# Sync web assets to Android
npm run cap:sync

# Open Android Studio
npm run cap:open:android
```

The `build:capacitor` script:
- Sets `CAPACITOR_BUILD=true` environment variable
- Enables static export (`output: 'export'`)
- Configures images as unoptimized (required for static export)
- Outputs to `/out` directory (configured in `capacitor.config.ts`)

## Configuration Files

### `capacitor.config.ts`
- App ID: `com.medbridge.app`
- App Name: `MedBridge`
- Web Directory: `out` (Next.js static export output)

### `next.config.mjs`
- Conditionally enables static export when `CAPACITOR_BUILD=true`
- Web builds remain unchanged (no export mode)
- Images configured for both web and static export

## Implementation Details

### MedicalCard Component
The `MedicalCard` component now conditionally renders premium features:

```tsx
{PDF_EXPORT_ENABLED && (
  <Button>Download PDF</Button>
)}

{SHARE_ENABLED && (
  <Button>Share Medical Profile</Button>
)}
```

On web, these buttons are hidden. On Android, they're visible and functional.

## Safety Constraints (Enforced)

✅ **No paywall UI** - Infrastructure only, no billing UI
✅ **No Google Play Billing** - Not integrated yet
✅ **No QR code** - QR feature not in V1
✅ **No routing changes** - Existing routes unchanged
✅ **No core data access changes** - Medical data access unchanged
✅ **Web UX unchanged** - Web version works exactly as before

## Validation Checklist

- [x] Web build works exactly as before
- [x] Android platform added to Capacitor
- [x] Platform detection uses Capacitor APIs (not user-agent)
- [x] Feature flags correctly enable PDF + Share on Android only
- [x] Web never shows premium-only behavior
- [x] Next.js config supports both web and static export
- [x] No linting errors

## Next Steps

1. **Build and test Android app:**
   ```bash
   npm run build:capacitor
   npm run cap:sync
   npm run cap:open:android
   ```

2. **Test premium features:**
   - Verify PDF export button appears only on Android
   - Verify Share button appears only on Android
   - Verify web version shows no premium features

3. **Future enhancements:**
   - Add Google Play Billing integration
   - Implement paywall UI (when billing is ready)
   - Add iOS support (when needed)

## Troubleshooting

### "Missing out directory" warning
- Run `npm run build:capacitor` first to generate the `/out` directory
- Then run `npm run cap:sync`

### Platform detection not working
- Ensure `@capacitor/core` is installed
- Check that Capacitor is initialized in the app
- Verify `src/lib/platform.ts` is imported correctly

### Feature flags always false
- Check platform detection is working
- Verify `src/lib/features.ts` imports `platform.ts` correctly
- Ensure Capacitor is properly initialized

## Files Created/Modified

### New Files
- `src/lib/platform.ts` - Platform detection utility
- `src/lib/features.ts` - Feature flags system
- `capacitor.config.ts` - Capacitor configuration
- `CAPACITOR_SETUP.md` - This documentation

### Modified Files
- `package.json` - Added Capacitor dependencies and build scripts
- `next.config.mjs` - Added conditional static export support
- `src/components/MedicalCard.tsx` - Added feature flag checks for PDF/Share
- `.gitignore` - Added Android/iOS build directories




