/**
 * Capacitor Configuration for MedBridge Mobile
 * 
 * This configuration is used for iOS and Android builds via Capacitor/Appflow.
 * 
 * IMPORTANT: This is a MOBILE-ONLY repository.
 * - App ID: com.ekilibrium.medbridgeform (must match Appflow configuration)
 * - App Name: MedBridge Form (display name in app stores)
 * - Web builds in this repo are for Capacitor preview only
 * 
 * Web/B2B version lives in a separate repository.
 */
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ekilibrium.medbridgeform',
  appName: 'MedBridge Form',
  webDir: 'out',
  // DO NOT set server.url or server.hostname for production
  // This would force Capacitor to load from a remote server instead of local assets
  // server: {
  //   androidScheme: 'http', // Only for development with live reload
  //   url: 'http://localhost:3000', // Only for development
  // },
  android: {
    // Enable debugging and mixed content for development
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
