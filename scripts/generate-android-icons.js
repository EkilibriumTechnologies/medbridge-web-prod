/**
 * Android Icon Generator Script
 * 
 * This script generates all required Android app icon assets from a source logo image.
 * 
 * Usage:
 *   1. Place your logo image as 'logo-source.png' in the project root
 *   2. Run: node scripts/generate-android-icons.js
 * 
 * Requirements:
 *   - Source image should be at least 1024x1024 for best quality
 *   - PNG format with transparency (if needed)
 *   - Logo should be centered with proper padding
 */

const fs = require('fs');
const path = require('path');

// Try to use sharp if available, otherwise provide instructions
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Error: sharp package is required.');
  console.log('\n📦 Installing sharp...');
  console.log('   Run: npm install sharp --save-dev');
  console.log('   Then run this script again.\n');
  process.exit(1);
}

// Configuration
const SOURCE_IMAGE = path.join(__dirname, '../logo-source.png');
const ANDROID_RES_DIR = path.join(__dirname, '../android/app/src/main/res');

// Icon sizes for different densities
const ICON_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

// Adaptive icon sizes
const ADAPTIVE_FOREGROUND_SIZE = 432;
const ADAPTIVE_BACKGROUND_SIZE = 432;

// Google Play Store icon
const PLAYSTORE_SIZE = 512;

// Round icon sizes (same as regular icons)
const ROUND_ICON_SIZES = ICON_SIZES;

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Generate icon with proper padding and centering
 */
async function generateIcon(inputPath, outputPath, size, padding = 0.1) {
  const paddingPixels = Math.floor(size * padding);
  const contentSize = size - (paddingPixels * 2);
  
  try {
    await sharp(inputPath)
      .resize(contentSize, contentSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .extend({
        top: paddingPixels,
        bottom: paddingPixels,
        left: paddingPixels,
        right: paddingPixels,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generated: ${path.basename(outputPath)} (${size}x${size})`);
    return true;
  } catch (error) {
    console.error(`✗ Error generating ${outputPath}:`, error.message);
    return false;
  }
}

/**
 * Generate Play Store icon (512x512, no transparency, white background)
 */
async function generatePlayStoreIcon(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generated: ${path.basename(outputPath)} (${PLAYSTORE_SIZE}x${PLAYSTORE_SIZE})`);
    return true;
  } catch (error) {
    console.error(`✗ Error generating Play Store icon:`, error.message);
    return false;
  }
}

/**
 * Generate adaptive icon foreground
 */
async function generateAdaptiveForeground(inputPath, outputPath) {
  // Adaptive icons use safe zone - logo should be in center 66% of the icon
  const safeZone = Math.floor(ADAPTIVE_FOREGROUND_SIZE * 0.66);
  const padding = Math.floor((ADAPTIVE_FOREGROUND_SIZE - safeZone) / 2);
  
  try {
    await sharp(inputPath)
      .resize(safeZone, safeZone, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generated: ${path.basename(outputPath)} (${ADAPTIVE_FOREGROUND_SIZE}x${ADAPTIVE_FOREGROUND_SIZE})`);
    return true;
  } catch (error) {
    console.error(`✗ Error generating adaptive foreground:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Android Icon Generator\n');
  
  // Check if source image exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error('❌ Error: Source logo image not found!');
    console.log(`\n📝 Please place your logo image at: ${SOURCE_IMAGE}`);
    console.log('   The image should be PNG format, preferably 1024x1024 or larger.\n');
    process.exit(1);
  }

  console.log(`📸 Source image: ${SOURCE_IMAGE}`);
  console.log(`📁 Output directory: ${ANDROID_RES_DIR}\n`);

  let successCount = 0;
  let totalCount = 0;

  // Generate regular launcher icons
  console.log('📱 Generating launcher icons...');
  for (const [density, size] of Object.entries(ICON_SIZES)) {
    const dir = path.join(ANDROID_RES_DIR, density);
    ensureDir(dir);
    
    const outputPath = path.join(dir, 'ic_launcher.png');
    totalCount++;
    if (await generateIcon(SOURCE_IMAGE, outputPath, size)) {
      successCount++;
    }
  }

  // Generate round launcher icons
  console.log('\n🔵 Generating round launcher icons...');
  for (const [density, size] of Object.entries(ROUND_ICON_SIZES)) {
    const dir = path.join(ANDROID_RES_DIR, density);
    ensureDir(dir);
    
    const outputPath = path.join(dir, 'ic_launcher_round.png');
    totalCount++;
    if (await generateIcon(SOURCE_IMAGE, outputPath, size)) {
      successCount++;
    }
  }

  // Generate adaptive icon foregrounds
  console.log('\n🔄 Generating adaptive icon foregrounds...');
  for (const density of Object.keys(ICON_SIZES)) {
    const dir = path.join(ANDROID_RES_DIR, density);
    ensureDir(dir);
    
    const outputPath = path.join(dir, 'ic_launcher_foreground.png');
    totalCount++;
    if (await generateAdaptiveForeground(SOURCE_IMAGE, outputPath)) {
      successCount++;
    }
  }

  // Generate Play Store icon
  console.log('\n🏪 Generating Google Play Store icon...');
  const playstoreDir = path.join(__dirname, '../android');
  ensureDir(playstoreDir);
  const playstorePath = path.join(playstoreDir, 'playstore-icon.png');
  totalCount++;
  if (await generatePlayStoreIcon(SOURCE_IMAGE, playstorePath)) {
    successCount++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully generated ${successCount}/${totalCount} icons`);
  console.log('='.repeat(50));
  
  if (successCount === totalCount) {
    console.log('\n✨ All icons generated successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Verify icons look correct in Android Studio');
    console.log('   2. Test on a device to ensure proper rendering');
    console.log('   3. Use playstore-icon.png for Google Play Console\n');
  } else {
    console.log('\n⚠️  Some icons failed to generate. Please check errors above.\n');
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

