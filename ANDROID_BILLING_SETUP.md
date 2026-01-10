# Google Play Billing Setup Guide

This document explains how to set up Google Play Billing for the MedBridge Android app.

## Overview

The app uses Google Play Billing for premium PDF export feature with a one-time purchase model:
- **Product ID**: `pdf_export_annual`
- **Product Type**: Non-consumable (one-time purchase)
- **License Cycle**: 1 year, anchored to first PDF generation

## Prerequisites

1. Google Play Console account
2. App published in Google Play Console (at least in Internal Testing or Closed Testing)
3. Android Studio installed
4. Capacitor Android project set up

## Step 1: Google Play Console Configuration

### A. Create In-App Product

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app: **MedBridge** (com.ekilibrium.medbridge)
3. Navigate to: **Monetize** → **Products** → **In-app products**
4. Click **Create product**
5. Fill in:
   - **Product ID**: `pdf_export_annual` (must match exactly)
   - **Name**: "PDF Export Annual"
   - **Description**: "Unlock unlimited PDF exports for 1 year"
   - **Price**: Set your price
   - **Status**: Active
   - **Product type**: Managed product (non-consumable)

6. **Save** the product

### B. Set Up Testing

1. Go to **Monetize** → **Products** → **In-app products**
2. Click on `pdf_export_annual`
3. Add test accounts:
   - Go to **License testing** section
   - Add Gmail accounts for testing
   - These accounts can test purchases without being charged

## Step 2: Android Project Configuration

### A. Update build.gradle

The file `android/app/build.gradle` should already have the billing dependency. If not, add:

```gradle
dependencies {
    // ... existing dependencies ...
    
    // Google Play Billing Library
    implementation 'com.android.billingclient:billing:7.1.1'
}
```

### B. Update MainActivity.java

The plugin needs to be registered in MainActivity. Open `android/app/src/main/java/com/ekilibrium/medbridge/MainActivity.java` (or `.kt` if using Kotlin) and ensure the plugin is registered:

```java
package com.ekilibrium.medbridge;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register the billing plugin
        this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
            add(GooglePlayBillingPlugin.class);
        }});
    }
}
```

**Note**: If using Kotlin (`MainActivity.kt`), the syntax will be slightly different.

### C. Copy Native Plugin

The native plugin file is already created at:
- `android/app/src/main/java/com/ekilibrium/medbridge/GooglePlayBillingPlugin.java`

Ensure this file exists in your Android project.

### D. Update AndroidManifest.xml (if needed)

The billing library typically doesn't require additional manifest permissions, but ensure your app has:

```xml
<uses-permission android:name="com.android.vending.BILLING" />
```

**Note**: This permission is usually added automatically by the billing library. Check `android/app/src/main/AndroidManifest.xml` to verify.

## Step 3: Sync Capacitor

After adding the plugin and updating configuration:

```bash
npm run cap:sync
```

This will:
- Copy the web build to Android
- Update native dependencies
- Register the plugin with Capacitor

## Step 4: Build and Test

### A. Build Android APK/AAB

```bash
# Build for Capacitor
npm run build:capacitor

# Sync to Android
npm run cap:sync

# Open in Android Studio
npm run cap:open:android
```

In Android Studio:
1. Build → Generate Signed Bundle / APK
2. Create a signed APK or AAB for testing

### B. Test Purchase Flow

1. Install the app on a test device (or emulator with Google Play Services)
2. Use a test account (added in Play Console)
3. Navigate to Medical Card screen
4. Click "Download PDF" or "Share" (should show upgrade modal)
5. Click "Upgrade" or "Renew Access"
6. Complete the purchase flow in Google Play dialog
7. Verify:
   - Purchase completes successfully
   - License cycle is created
   - PDF/Share buttons are enabled
   - PDF generation uses cycle timestamps

### C. Test Restore Purchases

1. Uninstall and reinstall the app (or clear app data)
2. Navigate to Medical Card screen
3. Click "Download PDF" or "Share" (should show upgrade modal)
4. Click "Restore Purchases"
5. Verify:
   - Previous purchase is restored
   - License cycle is restored/created
   - Premium features are enabled

## Step 5: Product ID Configuration

**IMPORTANT**: The product ID `pdf_export_annual` must match exactly:
- In Google Play Console (product ID)
- In code: `src/lib/billing.ts` (PRODUCT_ID constant)
- In Android plugin: `GooglePlayBillingPlugin.java` (PRODUCT_ID constant)

## Troubleshooting

### Plugin Not Found Error

If you see "Plugin not found" errors:
1. Ensure `GooglePlayBillingPlugin.java` exists in the correct package path
2. Run `npm run cap:sync` to register the plugin
3. Rebuild the Android project in Android Studio

### Billing Not Available

If billing shows as "not supported":
1. Ensure app is signed with a release key
2. App must be published in Play Console (at least Internal Testing)
3. Test accounts must be added in Play Console
4. Device must have Google Play Services installed

### Purchase Not Completing

1. Check test account is added in Play Console
2. Verify product ID matches exactly
3. Check app is properly signed
4. Ensure product status is "Active" in Play Console

### Restore Not Working

1. Ensure purchase was completed successfully
2. Check purchase is acknowledged (done automatically by plugin)
3. Verify app is using the same signing key
4. Check Play Console for purchase history

## Files Created/Modified

### TypeScript/React
- `src/lib/billing.ts` - Billing API wrapper
- `src/plugins/google-play-billing.ts` - Plugin TypeScript interface
- `src/plugins/google-play-billing.web.ts` - Web no-op implementation
- `src/components/UpgradeModal.tsx` - Modal with billing integration
- `src/components/MedicalCard.tsx` - Connected to billing system
- `src/contexts/LanguageContext.tsx` - Added billing error translations

### Android Native
- `android/app/src/main/java/com/medbridge/app/GooglePlayBillingPlugin.java` - Native plugin implementation
- `android/app/build.gradle` - Billing library dependency (to be added)
- `android/app/src/main/java/com/medbridge/app/MainActivity.java` - Plugin registration (to be updated)

## Validation Checklist

### Android Build
- [ ] Upgrade modal triggers Google Play purchase flow
- [ ] On successful purchase: premium unlocks and cycle is created/renewed
- [ ] Multiple PDFs in active cycle keep original timestamps
- [ ] When expired: renewal via purchase creates a new cycle
- [ ] Restore purchases works after reinstall
- [ ] Error messages are user-friendly and translated

### Web Build
- [ ] No billing code runs (graceful no-ops)
- [ ] No UI changes / no license checks introduced
- [ ] App works exactly as before

## Next Steps

1. **Complete native setup**: Follow steps in this guide to set up Android native code
2. **Test thoroughly**: Use test accounts to verify purchase and restore flows
3. **Publish to Play Store**: Once tested, publish to Internal/Closed Testing
4. **Monitor**: Use Play Console to monitor purchase metrics and errors

## Notes

- Billing only works on Android (Capacitor) builds
- Web builds remain completely free
- All purchase state is stored locally (no backend)
- License cycles are independent of purchase validation (local only)
- Purchase validation is done via Google Play Billing API




