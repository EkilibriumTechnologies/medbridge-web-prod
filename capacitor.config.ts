import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ekilibrium.medbridge',
  appName: 'MedBridge',
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
