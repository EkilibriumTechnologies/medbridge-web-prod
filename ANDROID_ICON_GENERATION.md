# Android Icon Generation Guide

This guide explains how to generate all required Android app icon assets from your logo image.

## Prerequisites

1. **Source Logo Image**: Place your final approved logo as `logo-source.png` in the project root
   - Format: PNG (with transparency if needed)
   - Recommended size: 1024x1024 or larger
   - The logo should be centered with proper padding
   - Background: Transparent or white (as per your design)

## Quick Start

1. **Place your logo**:
   ```bash
   # Copy your logo to the project root and rename it
   cp /path/to/your/logo.png logo-source.png
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Generate all icons**:
   ```bash
   npm run generate:icons
   ```

That's it! The script will generate all required icon sizes automatically.

## Generated Files

The script generates the following icon assets:

### 1. Launcher Icons (Regular)
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

### 2. Launcher Icons (Round)
- `android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png` (48x48)
- `android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png` (72x72)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png` (192x192)

### 3. Adaptive Icon Foregrounds (Android 8+)
- `android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png` (432x432 safe zone)
- `android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png` (432x432 safe zone)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png` (432x432 safe zone)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png` (432x432 safe zone)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png` (432x432 safe zone)

### 4. Google Play Store Icon
- `android/playstore-icon.png` (512x512, white background, no transparency)

## Icon Specifications

### Launcher Icons
- **Format**: PNG
- **Transparency**: Supported
- **Padding**: 10% on all sides for proper centering
- **Content**: Logo centered with safe margins

### Adaptive Icons (Android 8.0+)
- **Foreground**: 432x432 pixels
- **Safe Zone**: Logo should be within 66% center area (285x285)
- **Background**: Defined in `ic_launcher_background.xml` (currently uses color resource)
- **Transparency**: Supported in foreground

### Google Play Store Icon
- **Size**: 512x512 pixels
- **Format**: PNG
- **Background**: White (no transparency)
- **Content**: Logo centered with proper padding

## Android Configuration

The Android configuration is already set up:

- **AndroidManifest.xml**: References `@mipmap/ic_launcher` and `@mipmap/ic_launcher_round`
- **Adaptive Icons**: Configured in `mipmap-anydpi-v26/ic_launcher.xml`
- **Background Color**: Defined in `values/ic_launcher_background.xml`

## Verification Checklist

After generating icons, verify:

- [ ] All icon files were generated successfully
- [ ] Icons render correctly at small sizes (48x48)
- [ ] No clipping or distortion visible
- [ ] Logo is properly centered in all sizes
- [ ] Adaptive icons work correctly (test on Android 8+)
- [ ] Play Store icon has white background (no transparency)
- [ ] Icons look good on actual device

## Testing

1. **Build and install the app**:
   ```bash
   npm run build:capacitor
   npm run cap:sync
   cd android
   ./gradlew.bat assembleDebug
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

2. **Check on device**:
   - Verify launcher icon appears correctly
   - Check round icon variant
   - Test adaptive icon behavior (long-press on Android 8+)

3. **Google Play Console**:
   - Upload `android/playstore-icon.png` as your app icon
   - Verify it meets Play Store requirements

## Troubleshooting

### Icons look pixelated
- Ensure source image is at least 1024x1024
- Use high-quality source image

### Logo is cut off
- Ensure logo has proper padding in source image
- Logo should be centered with margins

### Script fails
- Ensure `sharp` is installed: `npm install sharp --save-dev`
- Check that `logo-source.png` exists in project root
- Verify source image is valid PNG format

### Adaptive icon issues
- Ensure logo fits within 66% safe zone
- Check background color in `values/ic_launcher_background.xml`

## Manual Override

If you need to customize specific icons:

1. Edit the script `scripts/generate-android-icons.js`
2. Adjust padding values (default: 10%)
3. Modify background colors for Play Store icon
4. Re-run the script

## Notes

- The script preserves original colors, gradients, and design
- No modifications are made to the logo design
- All icons are generated from the same source for consistency
- Adaptive icons use safe zone to prevent clipping on different devices

