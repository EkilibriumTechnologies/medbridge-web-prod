/**
 * Platform detection utility using Capacitor APIs.
 * 
 * This module provides reliable platform detection without user-agent sniffing.
 * Uses Capacitor's built-in platform detection when available.
 * 
 * IMPORTANT: Always use this module instead of user-agent checks for platform detection.
 */

import { Capacitor } from "@capacitor/core";

/**
 * Checks if the app is running on the web platform.
 * Returns true for web browsers (desktop and mobile web).
 */
export function isWeb(): boolean {
  if (typeof window === "undefined") {
    // Server-side: assume web
    return true;
  }
  
  try {
    return Capacitor.getPlatform() === "web";
  } catch {
    // If Capacitor is not available, assume web
    return true;
  }
}

/**
 * Checks if the app is running on Android.
 * Returns true only for native Android app (not Android web browser).
 */
export function isAndroid(): boolean {
  if (typeof window === "undefined") {
    // Server-side: always false
    return false;
  }
  
  try {
    return Capacitor.getPlatform() === "android";
  } catch {
    // If Capacitor is not available, assume web
    return false;
  }
}

/**
 * Checks if the app is running on iOS.
 * Returns true only for native iOS app (not iOS web browser).
 * Future-safe for when iOS support is added.
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") {
    // Server-side: always false
    return false;
  }
  
  try {
    return Capacitor.getPlatform() === "ios";
  } catch {
    // If Capacitor is not available, assume web
    return false;
  }
}

/**
 * Checks if the app is running on a native mobile platform (Android or iOS).
 * Useful for features that should work on any native app.
 */
export function isNative(): boolean {
  return isAndroid() || isIOS();
}

/**
 * Gets the current platform name.
 * Returns: "web" | "android" | "ios" | "unknown"
 */
export function getPlatform(): "web" | "android" | "ios" | "unknown" {
  if (typeof window === "undefined") {
    return "web";
  }
  
  try {
    const platform = Capacitor.getPlatform();
    if (platform === "web" || platform === "android" || platform === "ios") {
      return platform;
    }
    return "unknown";
  } catch {
    return "web";
  }
}




