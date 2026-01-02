/**
 * Gets or creates a unique device ID stored in localStorage.
 * Uses crypto.randomUUID() for proper UUID generation.
 * This ID is used ONLY for organizing Firebase Storage uploads.
 * Do NOT tie this ID to any personal or medical information.
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") {
    // Server-side: return a placeholder (shouldn't be used)
    return "server";
  }

  const STORAGE_KEY = "medbridge_device_id";

  try {
    let deviceId = localStorage.getItem(STORAGE_KEY);

    if (!deviceId) {
      // Generate a new UUID
      // Use crypto.randomUUID() if available (modern browsers)
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        deviceId = crypto.randomUUID();
      } else {
        // Fallback for older browsers
        deviceId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
      }
      localStorage.setItem(STORAGE_KEY, deviceId);
    }

    return deviceId;
  } catch (error) {
    console.error("Error getting device ID:", error);
    // Fallback to a timestamp-based ID if localStorage fails
    return `device-${Date.now()}`;
  }
}
