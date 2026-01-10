# Premium PDF License System

## Overview

This document describes the premium PDF export license system based on an annual cycle anchored to the FIRST PDF generated. The system operates entirely locally with no backend, no cloud storage, and no authentication.

## Core Concept

The license cycle is **anchored to the FIRST PDF generation**:
- When the user generates their **first premium PDF**, a 1-year cycle starts
- This timestamp becomes the **anchor** (`cycleStartedAt`) for the entire cycle
- **ALL PDFs** generated during that year share the **SAME timestamps**:
  - "Generated on: {cycleStartedAt}"
  - "Valid until: {cycleExpiresAt}"
- Generating additional PDFs does **NOT** reset or modify these timestamps

## Implementation Details

### License Cycle Structure

```typescript
interface LicenseCycle {
  cycleStartedAt: number;  // Anchor timestamp - FIRST PDF generation
  cycleExpiresAt: number;  // Expiration (cycleStartedAt + 1 year)
  createdAt: number;       // When cycle record was created
}
```

### Storage

- **Location**: `localStorage` (key: `medbridge_pdf_license`)
- **Persistence**: Data persists across app restarts
- **No remote calls**: All operations are local
- **No authentication**: No user accounts required

### Cycle Initialization

When the user generates their **first PDF**:
1. `getOrCreateLicenseCycle()` is called
2. If no cycle exists, a new cycle is created:
   - `cycleStartedAt = Date.now()` (anchor timestamp)
   - `cycleExpiresAt = cycleStartedAt + 1 year`
3. This cycle is stored in `localStorage`
4. **This timestamp becomes the anchor for ALL PDFs in this cycle**

### Multiple PDFs in Same Cycle

When generating additional PDFs within the same year:
1. `getOrCreateLicenseCycle()` is called
2. Existing cycle is checked:
   - If active (not expired), return existing cycle
   - **Do NOT create a new cycle**
3. PDF generation uses the **same cycle timestamps**:
   - "Generated on: {cycleStartedAt}" (same for all PDFs)
   - "Valid until: {cycleExpiresAt}" (same for all PDFs)
4. **Timestamps remain unchanged** - no reset, no modification

### Expiration Behavior

When `currentDate > cycleExpiresAt`:
1. `isLicenseActive()` returns `false`
2. PDF generation is **blocked**
3. Share/export buttons are **disabled**
4. Medical information viewing remains **free** (unaffected)
5. UI shows expiration message with renewal option

### Renewal Behavior

When user renews premium **AFTER expiration**:
1. User clicks "Renew License" or generates a new PDF
2. `getOrCreateLicenseCycle()` detects expired cycle
3. A **NEW cycle** is created:
   - New `cycleStartedAt` = current timestamp
   - New `cycleExpiresAt` = new cycleStartedAt + 1 year
4. **Previous cycle timestamps are NOT reused**
5. Old cycle is replaced in `localStorage`

## PDF Content Requirements

Every premium PDF includes:

### Metadata (Top Right)
- **Generated on**: `cycleStartedAt` (formatted date) - **Same for all PDFs in cycle**
- **Valid until**: `cycleExpiresAt` (formatted date) - **Same for all PDFs in cycle**
- **Language**: Current language setting

### Footer Disclaimer
- "This document is a user-generated medical summary for reference only."

## UI Behavior

### Active License
- ✅ PDF download button: **Enabled**
- ✅ Share button: **Enabled**
- ✅ Optional warning if expires within 30 days

### Expired License
- ❌ PDF download button: **Disabled** (grayed out)
- ❌ Share button: **Disabled** (grayed out)
- 📢 Expiration message displayed with renewal button
- ✅ Medical information viewing: **Remains free**

### Renewal Flow
1. User sees expiration message
2. User clicks "Renew License"
3. System generates first PDF of new cycle
4. New cycle is created with new timestamps
5. License becomes active
6. Buttons are re-enabled

## Platform Restrictions

### Android Only (Premium Features)
- License system applies **only** when `PDF_EXPORT_ENABLED` or `SHARE_ENABLED` is `true`
- These flags are `true` only on Android (Capacitor app)
- Web version: No license checks, features remain free

### Web Version (Unchanged)
- No license system
- PDF generation works without cycle timestamps
- No expiration checks
- Full functionality remains free

## Key Functions

### `getOrCreateLicenseCycle()`
- **Purpose**: Get active cycle or create new one
- **Behavior**:
  - If no cycle exists → Create new cycle (first PDF)
  - If cycle exists and active → Return existing cycle
  - If cycle exists but expired → Create new cycle (renewal)
- **Returns**: Active `LicenseCycle`

### `getActiveLicenseCycle()`
- **Purpose**: Check if license is active (for UI)
- **Behavior**:
  - Returns cycle if active
  - Returns `null` if expired or no cycle
- **Does NOT create new cycle**

### `isLicenseActive()`
- **Purpose**: Simple boolean check
- **Returns**: `true` if cycle exists and not expired, `false` otherwise

### `initializeLicenseCycle()`
- **Purpose**: Create new cycle (internal)
- **Behavior**:
  - Sets `cycleStartedAt = Date.now()` (anchor)
  - Sets `cycleExpiresAt = cycleStartedAt + 1 year`
  - Stores in `localStorage`
- **Called only when**:
  - First PDF generation (no cycle exists)
  - Renewal (existing cycle expired)

## Files Created/Modified

### New Files
- `src/lib/license.ts` - License cycle management system

### Modified Files
- `src/lib/generateMedicalReportPDF.ts` - Accepts license cycle, uses cycle timestamps
- `src/components/MedicalCard.tsx` - License checks, UI for expiration/renewal
- `src/contexts/LanguageContext.tsx` - Added translation keys for license messages

## Translation Keys Added

### English
- `pdf.validUntil`: "Valid until"
- `pdf.disclaimer`: "This document is a user-generated medical summary for reference only."
- `card.licenseExpired`: "License Expired"
- `card.licenseExpiredMessage`: "Your PDF export license has expired. Renew to continue exporting your medical reports."
- `card.licenseExpiresSoon`: "License expires soon"
- `card.licenseExpiresIn`: "License expires in {days} days"
- `card.renewLicense`: "Renew License"
- `card.premiumRequired`: "Premium feature required"

### Spanish & Portuguese
- Similar keys added for both languages

## Safety Constraints (Enforced)

✅ **No QR functionality** - QR feature not in V1
✅ **No billing logic** - Infrastructure only, no payment integration
✅ **Web behavior unchanged** - Web version works exactly as before
✅ **No timestamp reset** - Additional PDFs don't reset cycle timestamps
✅ **No cloud storage** - All data stored locally
✅ **No backend** - No remote API calls
✅ **No authentication** - No user accounts required

## Confirmation: Multiple PDFs Share Same Timestamp

**Confirmed**: All PDFs generated within the same cycle use:
- **Same "Generated on" date**: `cycleStartedAt` (anchor timestamp)
- **Same "Valid until" date**: `cycleExpiresAt` (anchor + 1 year)

This is enforced by:
1. `getOrCreateLicenseCycle()` returns existing cycle if active
2. `generateMedicalReportPDF()` receives the same `licenseCycle` object
3. PDF generation uses `licenseCycle.cycleStartedAt` and `licenseCycle.cycleExpiresAt`
4. No code path modifies these timestamps during the cycle

**Example**:
- User generates first PDF on Jan 1, 2025 → Cycle: Jan 1, 2025 - Jan 1, 2026
- User generates second PDF on Mar 15, 2025 → **Still shows**: Jan 1, 2025 - Jan 1, 2026
- User generates third PDF on Dec 1, 2025 → **Still shows**: Jan 1, 2025 - Jan 1, 2026
- User generates PDF on Feb 1, 2026 (expired) → **New cycle**: Feb 1, 2026 - Feb 1, 2027

## Testing Checklist

- [x] First PDF creates cycle with anchor timestamp
- [x] Second PDF uses same cycle timestamps
- [x] Third PDF uses same cycle timestamps
- [x] Expired cycle blocks PDF generation
- [x] Expired cycle disables buttons
- [x] Renewal creates new cycle with new timestamps
- [x] Web version unaffected (no license checks)
- [x] Data persists across app restarts
- [x] UI shows expiration message when expired
- [x] UI shows renewal option when expired




