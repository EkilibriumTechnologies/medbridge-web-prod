#!/usr/bin/env node

/**
 * Detects whether to use Capacitor build or regular Next.js build
 * Returns 0 (success) for Capacitor build, 1 (failure) for regular build
 */

const fs = require('fs');
const path = require('path');

// Check if we should use Capacitor build
const shouldUseCapacitorBuild = 
  process.env.CAPACITOR_BUILD === 'true' ||
  process.env.CI === 'true' ||
  fs.existsSync(path.join(__dirname, '../ios')) ||
  fs.existsSync(path.join(__dirname, '../android'));

if (shouldUseCapacitorBuild) {
  console.log('Detected Capacitor build environment');
  process.exit(0);
} else {
  console.log('Using regular Next.js build');
  process.exit(1);
}
