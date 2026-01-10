/**
 * iOS Icon Generator Script
 * 
 * This script generates all required iOS app icon assets from the existing Android icon.
 * Uses the highest resolution Android icon as the single source of truth.
 * 
 * Usage:
 *   node scripts/generate-ios-icons.js
 * 
 * Requirements:
 *   - npm install sharp --save-dev
 *   - Existing Android icon in android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
 *   - Or playstore-icon.png in android folder
 * 
 * Generates all iOS icon sizes for App Store submission:
 *   - 20x20 (@1x, @2x, @3x)
 *   - 29x29 (@1x, @2x, @3x)
 *   - 40x40 (@1x, @2x, @3x)
 *   - 60x60 (@2x, @3x)
 *   - 76x76 (@1x, @2x)
 *   - 83.5x83.5 (@2x)
 *   - 1024x1024 (App Store icon)
 */

const fs = require('fs');
const path = require('path');

// Try to use sharp if available
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
const ANDROID_ICON_SOURCES = [
  path.join(__dirname, '../android/playstore-icon.png'),
  path.join(__dirname, '../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'),
  path.join(__dirname, '../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png'),
  path.join(__dirname, '../android/app/src/main/res/mipmap-xhdpi/ic_launcher.png'),
];

const IOS_ICONSET_DIR = path.join(__dirname, '../ios/App/App/Assets.xcassets/AppIcon.appiconset');

// iOS icon sizes (in points) with scale factors
const IOS_ICON_SIZES = [
  // 20pt icons
  { size: 20, scale: 1, filename: 'icon-20.png' }, // @1x
  { size: 20, scale: 2, filename: 'icon-20@2x.png' }, // @2x
  { size: 20, scale: 3, filename: 'icon-20@3x.png' }, // @3x
  
  // 29pt icons
  { size: 29, scale: 1, filename: 'icon-29.png' }, // @1x
  { size: 29, scale: 2, filename: 'icon-29@2x.png' }, // @2x
  { size: 29, scale: 3, filename: 'icon-29@3x.png' }, // @3x
  
  // 40pt icons
  { size: 40, scale: 1, filename: 'icon-40.png' }, // @1x
  { size: 40, scale: 2, filename: 'icon-40@2x.png' }, // @2x
  { size: 40, scale: 3, filename: 'icon-40@3x.png' }, // @3x
  
  // 60pt icons (no @1x for iPhone)
  { size: 60, scale: 2, filename: 'icon-60@2x.png' }, // @2x
  { size: 60, scale: 3, filename: 'icon-60@3x.png' }, // @3x
  
  // 76pt icons (iPad)
  { size: 76, scale: 1, filename: 'icon-76.png' }, // @1x
  { size: 76, scale: 2, filename: 'icon-76@2x.png' }, // @2x
  
  // 83.5pt icons (iPad Pro)
  { size: 83.5, scale: 2, filename: 'icon-83.5@2x.png' }, // @2x
  
  // 1024pt App Store icon (no scale factor)
  { size: 1024, scale: 1, filename: 'icon-1024.png' },
];

/**
 * Find the best source Android icon
 */
function findSourceIcon() {
  for (const sourcePath of ANDROID_ICON_SOURCES) {
    if (fs.existsSync(sourcePath)) {
      return sourcePath;
    }
  }
  return null;
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Generate iOS icon with solid white background (no transparency)
 */
async function generateIOSIcon(inputPath, outputPath, size) {
  try {
    await sharp(inputPath)
      .resize(Math.round(size), Math.round(size), {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background for iOS
      })
      .png()
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`✗ Error generating ${outputPath}:`, error.message);
    return false;
  }
}

/**
 * Generate Contents.json for AppIcon.appiconset
 */
function generateContentsJSON(outputDir) {
  const contents = {
    images: [
      // 20pt icons
      { size: '20x20', idiom: 'iphone', scale: '1x', filename: 'icon-20.png' },
      { size: '20x20', idiom: 'iphone', scale: '2x', filename: 'icon-20@2x.png' },
      { size: '20x20', idiom: 'iphone', scale: '3x', filename: 'icon-20@3x.png' },
      { size: '20x20', idiom: 'ipad', scale: '1x', filename: 'icon-20.png' },
      { size: '20x20', idiom: 'ipad', scale: '2x', filename: 'icon-20@2x.png' },
      
      // 29pt icons
      { size: '29x29', idiom: 'iphone', scale: '1x', filename: 'icon-29.png' },
      { size: '29x29', idiom: 'iphone', scale: '2x', filename: 'icon-29@2x.png' },
      { size: '29x29', idiom: 'iphone', scale: '3x', filename: 'icon-29@3x.png' },
      { size: '29x29', idiom: 'ipad', scale: '1x', filename: 'icon-29.png' },
      { size: '29x29', idiom: 'ipad', scale: '2x', filename: 'icon-29@2x.png' },
      
      // 40pt icons
      { size: '40x40', idiom: 'iphone', scale: '2x', filename: 'icon-40@2x.png' },
      { size: '40x40', idiom: 'iphone', scale: '3x', filename: 'icon-40@3x.png' },
      { size: '40x40', idiom: 'ipad', scale: '1x', filename: 'icon-40.png' },
      { size: '40x40', idiom: 'ipad', scale: '2x', filename: 'icon-40@2x.png' },
      
      // 60pt icons (iPhone)
      { size: '60x60', idiom: 'iphone', scale: '2x', filename: 'icon-60@2x.png' },
      { size: '60x60', idiom: 'iphone', scale: '3x', filename: 'icon-60@3x.png' },
      
      // 76pt icons (iPad)
      { size: '76x76', idiom: 'ipad', scale: '1x', filename: 'icon-76.png' },
      { size: '76x76', idiom: 'ipad', scale: '2x', filename: 'icon-76@2x.png' },
      
      // 83.5pt icons (iPad Pro)
      { size: '83.5x83.5', idiom: 'ipad', scale: '2x', filename: 'icon-83.5@2x.png' },
      
      // 1024pt App Store icon
      { size: '1024x1024', idiom: 'ios-marketing', scale: '1x', filename: 'icon-1024.png' },
    ],
    info: {
      author: 'xcode',
      version: 1
    }
  };
  
  const contentsPath = path.join(outputDir, 'Contents.json');
  fs.writeFileSync(contentsPath, JSON.stringify(contents, null, 2));
  console.log('✓ Generated: Contents.json');
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 iOS Icon Generator\n');
  
  // Find source icon
  const sourceIcon = findSourceIcon();
  if (!sourceIcon) {
    console.error('❌ Error: No Android icon source found!');
    console.log('\n📝 Searched for:');
    ANDROID_ICON_SOURCES.forEach(src => {
      console.log(`   - ${src}`);
    });
    console.log('\n   Please ensure at least one Android icon exists.\n');
    process.exit(1);
  }
  
  console.log(`📸 Source image: ${sourceIcon}`);
  console.log(`📁 Output directory: ${IOS_ICONSET_DIR}\n`);
  
  // Ensure output directory exists
  ensureDir(IOS_ICONSET_DIR);
  
  let successCount = 0;
  let totalCount = 0;
  
  // Generate all iOS icons
  console.log('📱 Generating iOS app icons...\n');
  for (const icon of IOS_ICON_SIZES) {
    const pixelSize = icon.size * icon.scale;
    const outputPath = path.join(IOS_ICONSET_DIR, icon.filename);
    
    totalCount++;
    if (await generateIOSIcon(sourceIcon, outputPath, pixelSize)) {
      successCount++;
      console.log(`✓ Generated: ${icon.filename} (${Math.round(pixelSize)}x${Math.round(pixelSize)}px)`);
    }
  }
  
  // Generate Contents.json
  console.log('\n📄 Generating Contents.json...');
  generateContentsJSON(IOS_ICONSET_DIR);
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully generated ${successCount}/${totalCount} icons`);
  console.log('='.repeat(50));
  
  if (successCount === totalCount) {
    console.log('\n✨ All iOS icons generated successfully!');
    console.log('\n📋 Icon sizes generated:');
    console.log('   - 20x20 (@1x, @2x, @3x)');
    console.log('   - 29x29 (@1x, @2x, @3x)');
    console.log('   - 40x40 (@1x, @2x, @3x)');
    console.log('   - 60x60 (@2x, @3x)');
    console.log('   - 76x76 (@1x, @2x)');
    console.log('   - 83.5x83.5 (@2x)');
    console.log('   - 1024x1024 (App Store)');
    console.log('\n🎯 Next steps:');
    console.log('   1. Verify icons in Xcode or Appflow');
    console.log('   2. Ensure all icons are properly displayed');
    console.log('   3. Test on iOS devices if possible');
    console.log('   4. Icons are ready for App Store submission\n');
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

