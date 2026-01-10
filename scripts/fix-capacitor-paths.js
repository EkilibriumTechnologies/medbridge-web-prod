#!/usr/bin/env node

/**
 * Post-process Next.js static export to fix absolute paths for Capacitor
 * Converts absolute paths (/_next/static/...) to relative paths
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../out');

function fixPathsInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Add <base href="./"> tag if it doesn't exist (needed for Capacitor to resolve relative paths correctly)
  // Place it right after <head> tag
  if (!content.includes('<base')) {
    // Find the <head> tag and insert <base href="./"> right after it
    content = content.replace(
      /<head[^>]*>/i,
      (match) => `${match}<base href="./">`
    );
    modified = true;
  }

  // For Capacitor with http://localhost/, we need RELATIVE paths (./)
  // NOT absolute paths (/). Capacitor's local server doesn't resolve absolute paths correctly
  // when serving from android_asset/public/. Use relative paths instead.
  
  // Convert all absolute paths to relative paths
  // Pattern: href="/_next/... or src="/_next/... -> href="./_next/... or src="./_next/...
  const patterns = [
    { from: 'href="/_next/', to: 'href="./_next/' },
    { from: 'src="/_next/', to: 'src="./_next/' },
    { from: 'href="/favicon.ico"', to: 'href="./favicon.ico"' },
    { from: 'href="/og-image.png"', to: 'href="./og-image.png"' },
    { from: 'content="/og-image.png"', to: 'content="./og-image.png"' },
    { from: 'content="/favicon.ico"', to: 'content="./favicon.ico"' },
  ];

  patterns.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
      modified = true;
    }
  });

  // Also ensure any remaining relative paths starting with /_next/ are preserved (they're already absolute)
  // This is a safety check - shouldn't need to do anything if patterns above worked

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed paths in: ${path.relative(OUT_DIR, filePath)}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.html')) {
      fixPathsInFile(filePath);
    }
  });
}

console.log('Fixing absolute paths for Capacitor...');
console.log(`Processing directory: ${OUT_DIR}`);

if (!fs.existsSync(OUT_DIR)) {
  console.error(`Error: Directory not found: ${OUT_DIR}`);
  process.exit(1);
}

processDirectory(OUT_DIR);
console.log('✓ Path fixing complete!');

