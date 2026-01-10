/**
 * Premium PDF License System
 * 
 * MOBILE-ONLY REPOSITORY: Manages annual license cycles for premium features.
 * - License cycles are anchored to FIRST use (PDF generation or Share) after purchase
 * - All PDFs within a cycle share the same generation and expiration timestamps
 * - Cycle duration: 1 year from first use
 * - Requires active purchase (verified via Google Play / App Store)
 * 
 * IMPORTANT:
 * - MOBILE ONLY: This license system is only active in mobile builds
 * - No backend, no cloud storage, no authentication
 * - All data stored locally (localStorage)
 * - Applies to iOS and Android (Capacitor/Appflow builds)
 * - Web/B2B version lives in a separate repository
 */

const LICENSE_STORAGE_KEY = "medbridge_pdf_license";

// TESTING MODE: Set to true to simulate active license for testing
// This will make isLicenseActive() return true and auto-create a valid cycle
const TESTING_MODE_SIMULATE_LICENSE = false;

export interface LicenseCycle {
  cycleStartedAt: number; // Timestamp when first PDF was generated (anchor)
  cycleExpiresAt: number; // Timestamp when cycle expires (cycleStartedAt + 1 year)
  createdAt: number; // When this cycle record was created
}

/**
 * Gets the current license cycle from localStorage.
 * Returns null if no cycle exists.
 */
export function getLicenseCycle(): LicenseCycle | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(LICENSE_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as LicenseCycle;
  } catch (error) {
    console.error("Error reading license cycle:", error);
    return null;
  }
}

/**
 * Checks if the current license cycle is active (not expired).
 * Returns true if cycle exists and current time < cycleExpiresAt.
 */
export function isLicenseActive(): boolean {
  // TESTING MODE: Simulate active license for testing
  // This bypasses all checks and always returns true for testing
  if (TESTING_MODE_SIMULATE_LICENSE) {
    console.log("[TESTING MODE] isLicenseActive: Testing mode enabled - ensuring license cycle exists");
    if (typeof window !== "undefined") {
      const cycle = getLicenseCycle();
      // If no cycle exists, create one for testing
      if (!cycle) {
        console.log("[TESTING MODE] No license cycle found, creating new one for testing");
        const newCycle = initializeLicenseCycle();
        console.log("[TESTING MODE] License cycle created:", newCycle);
        return true;
      }
      // If cycle is expired, create a new one for testing
      const now = Date.now();
      if (now >= cycle.cycleExpiresAt) {
        console.log("[TESTING MODE] License cycle expired, creating new one for testing");
        const newCycle = initializeLicenseCycle();
        console.log("[TESTING MODE] License cycle renewed:", newCycle);
        return true;
      }
      // Cycle exists and is active
      console.log("[TESTING MODE] License cycle exists and is active until:", new Date(cycle.cycleExpiresAt).toLocaleString());
      return true;
    }
    // Even if window is undefined (shouldn't happen in Capacitor), return true for testing
    console.log("[TESTING MODE] Window undefined, but returning true for testing");
    return true;
  }

  const cycle = getLicenseCycle();
  if (!cycle) {
    return false;
  }

  const now = Date.now();
  return now < cycle.cycleExpiresAt;
}

/**
 * Initializes a new license cycle anchored to the FIRST PDF generation.
 * 
 * This function should be called ONLY when generating the first PDF.
 * 
 * @returns The newly created license cycle
 */
export function initializeLicenseCycle(): LicenseCycle {
  const now = Date.now();
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

  const cycle: LicenseCycle = {
    cycleStartedAt: now, // Anchor timestamp - FIRST PDF generation
    cycleExpiresAt: now + oneYearInMs, // Expires 1 year from anchor
    createdAt: now,
  };

  try {
    localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(cycle));
  } catch (error) {
    console.error("Error saving license cycle:", error);
    throw new Error("Failed to save license cycle");
  }

  return cycle;
}

/**
 * Gets or creates a license cycle.
 * If cycle exists and is active, returns existing cycle.
 * If cycle exists but is expired, creates a new cycle (renewal).
 * If no cycle exists, creates a new cycle (first PDF).
 * 
 * This function handles renewal automatically when expired.
 * 
 * IMPORTANT: This function assumes premium purchase is already verified.
 * Always check hasPremiumPurchase() before calling this function.
 * 
 * @returns The active license cycle
 */
export function getOrCreateLicenseCycle(): LicenseCycle {
  const existing = getLicenseCycle();
  
  // If no cycle exists, create new one
  if (!existing) {
    return initializeLicenseCycle();
  }

  // If cycle is expired, create NEW cycle (renewal)
  const now = Date.now();
  if (now >= existing.cycleExpiresAt) {
    return initializeLicenseCycle();
  }

  // Cycle is active, return existing (all PDFs in this cycle use same timestamps)
  return existing;
}

/**
 * Gets the active license cycle for PDF generation.
 * If no active cycle exists, returns null (PDF generation should be blocked).
 * 
 * This function does NOT create a new cycle automatically.
 * Use this to check if PDF generation is allowed.
 * 
 * @returns Active license cycle or null
 */
export function getActiveLicenseCycle(): LicenseCycle | null {
  const cycle = getLicenseCycle();
  if (!cycle) {
    return null;
  }

  const now = Date.now();
  if (now >= cycle.cycleExpiresAt) {
    return null; // Expired
  }

  return cycle;
}

/**
 * Formats a timestamp as a localized date string.
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @param locale - Locale code (e.g., "en-US", "es-ES", "pt-BR")
 * @returns Formatted date string
 */
export function formatLicenseDate(timestamp: number, locale: string = "en-US"): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Gets the number of days remaining in the current cycle.
 * Returns 0 if expired or no cycle exists.
 * 
 * @returns Days remaining (0 if expired or no cycle)
 */
export function getDaysRemaining(): number {
  const cycle = getActiveLicenseCycle();
  if (!cycle) {
    return 0;
  }

  const now = Date.now();
  const msRemaining = cycle.cycleExpiresAt - now;
  const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));

  return Math.max(0, daysRemaining);
}

/**
 * Clears the license cycle (for testing or reset).
 * Use with caution in production.
 */
export function clearLicenseCycle(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(LICENSE_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing license cycle:", error);
  }
}

