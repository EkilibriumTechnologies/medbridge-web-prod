# Firebase Storage Implementation - ID Photo Upload Only

## Overview

This implementation provides **Firebase Storage integration strictly for uploading user ID photos**. All medical data remains local on the device.

## ✅ Constraints Compliance

- ✅ **NO medical information in cloud** - Only ID photos are uploaded
- ✅ **NO Firestore, Realtime Database, or any database** - Storage only
- ✅ **NO Firebase Authentication** - Removed all auth code
- ✅ **NO Firebase Analytics** - Not imported or used
- ✅ **Firebase ONLY for ID photos** - Isolated implementation
- ✅ **All medical data stays local** - Profile, PDFs, QR codes remain on device
- ✅ **NO hardcoded keys** - All config from environment variables

## Implementation Details

### 1. Firebase Initialization (`src/lib/firebase.ts`)

- **Minimal imports**: Only `initializeApp` and `getStorage`
- **No Auth**: Removed all authentication code
- **No Analytics**: Not imported
- **Environment variables**: Supports both `VITE_` and `NEXT_PUBLIC_` prefixes
- **Exports**: Only `getFirebaseStorage()` function
- **Error handling**: Graceful degradation if config missing

### 2. Device ID Utility (`src/lib/deviceId.ts`)

- **UUID generation**: Uses `crypto.randomUUID()` (modern browsers)
- **Fallback**: Timestamp-based ID for older browsers
- **Persistence**: Stored in `localStorage` as `medbridge_device_id`
- **Privacy**: Not tied to any personal or medical information
- **Reuse**: Same deviceId on every session

### 3. Upload Utility (`src/lib/firebaseStorage.ts`)

- **File validation**: 
  - Must be `image/*` type
  - Max size: 5MB (as specified)
- **Upload path**: `id-photos/{deviceId}/{timestamp}-{originalFileName}`
- **Direct File upload**: Uses `uploadBytes` with File object
- **Error handling**: 
  - User-friendly error messages
  - Specific Firebase error codes handled
  - Network errors handled gracefully
- **Returns**: Public download URL on success, throws error on failure

### 4. UI Integration (`src/components/Identification.tsx`)

- **Manual upload**: User must click "Upload ID Photo" button (no auto-upload)
- **File selection**: Shows preview immediately
- **Loading state**: Shows spinner during upload
- **Error display**: User-friendly error messages in Alert component
- **Success feedback**: Green alert when upload succeeds
- **Replace photo**: Allows selecting different photo
- **Local fallback**: Works offline with local base64 storage

### 5. Error Handling

- **Network errors**: Caught and displayed to user
- **Permission errors**: Specific message for Firebase Storage rules
- **Validation errors**: File type and size checked before upload
- **Never crashes**: All errors caught and handled gracefully
- **User informed**: All errors shown in UI, no silent failures

### 6. Environment Variables

Supported variable names:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_APP_ID`

Also supports `NEXT_PUBLIC_` prefix for Next.js compatibility.

## File Structure

```
src/lib/
  ├── firebase.ts          # Minimal Firebase initialization (Storage only)
  ├── deviceId.ts          # UUID generation and persistence
  └── firebaseStorage.ts   # Upload utility with validation

src/components/
  └── Identification.tsx   # UI with manual upload button
```

## Usage Flow

1. **User selects image file**
   - File validated (type and size)
   - Preview shown immediately (local base64)
   - File stored for upload

2. **User clicks "Upload ID Photo"**
   - Upload starts (if Firebase available)
   - Loading spinner shown
   - File uploaded to `id-photos/{deviceId}/{timestamp}-{filename}`

3. **On success**
   - Download URL stored in `localStorage` as `idPhotoUrl`
   - Success message shown
   - Photo displayed from Firebase URL

4. **On error**
   - Error message displayed
   - Local preview remains available
   - User can retry or use local storage

## Storage Path Format

```
id-photos/
  └── {deviceId}/          # UUID from localStorage
      └── {timestamp}-{originalFileName}
```

Example:
```
id-photos/550e8400-e29b-41d4-a716-446655440000/1704067200000-passport.jpg
```

## Privacy & Security

- ✅ Device ID is UUID only, not tied to personal data
- ✅ Only ID photos uploaded, no medical information
- ✅ All medical data remains in `localStorage`
- ✅ No authentication required (if Storage rules allow)
- ✅ File names sanitized before upload
- ✅ File size and type validated client-side

## Firebase Storage Rules Recommendation

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /id-photos/{deviceId}/{fileName} {
      // Allow read/write for ID photos only
      allow read: if true;  // Public read (or add auth if needed)
      allow write: if request.resource.size < 5 * 1024 * 1024  // 5MB limit
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Deny all other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Testing Checklist

- [ ] Set environment variables
- [ ] Select image file - preview shows
- [ ] Click "Upload ID Photo" - upload succeeds
- [ ] Verify photo in Firebase Console
- [ ] Test with file > 5MB - error shown
- [ ] Test with non-image file - error shown
- [ ] Test offline - local preview works
- [ ] Test error handling - errors displayed
- [ ] Verify no medical data in Firebase

## Notes

- The implementation is isolated and doesn't affect other parts of the app
- Medical profile data structure remains unchanged
- Backward compatible with existing `idPhoto` (base64) storage
- Firebase URL stored separately as `idPhotoUrl`
- App works fully offline (local storage fallback)

