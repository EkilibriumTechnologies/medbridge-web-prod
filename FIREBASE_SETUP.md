# Firebase Storage Setup Guide

This guide explains how to set up Firebase Storage for ID photo uploads in the MedBridge web application.

## Prerequisites

- A Firebase project (already exists and is used by Flutter app)
- Firebase Storage enabled in your Firebase project
- Access to Firebase Console

## Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click the `</>` (web) icon to add one
7. Copy the Firebase configuration values

## Step 2: Set Environment Variables

Create a `.env.local` file in the project root (or add to your existing `.env.local`):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**Important**: 
- Replace all placeholder values with your actual Firebase config
- The `NEXT_PUBLIC_` prefix is required for Next.js to expose these to the browser
- Never commit `.env.local` to version control (it should be in `.gitignore`)

## Step 3: Configure Storage Security Rules

1. In Firebase Console, go to **Storage** > **Rules**
2. Copy the rules from `FIREBASE_STORAGE_RULES.md`
3. Paste them into the rules editor
4. Click **Publish**

**Recommended rules** (from `FIREBASE_STORAGE_RULES.md`):
- Allow read/write to `id-photos/{deviceId}/{fileName}`
- Limit file size to 5MB
- Only allow image files
- No authentication required (Storage rules handle access)

## Step 5: Verify Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Identification page in your app
3. Try uploading an ID photo
4. Check the browser console for any errors
5. Verify the photo appears in Firebase Console > Storage > `id-photos/`

## How It Works

### Upload Flow

1. User selects an image file
2. Image is compressed client-side (max 1200x1200px, JPEG quality 0.8)
3. Compressed image is shown immediately (local preview)
4. In the background, image is uploaded to Firebase Storage
5. On success, Firebase download URL is stored in `medicalProfile.personalInfo.idPhotoUrl`
6. Local base64 is kept as fallback in `medicalProfile.personalInfo.idPhoto`

### Storage Structure

```
id-photos/
  └── {deviceId}/
      └── {timestamp}.jpg
```

- `deviceId`: Unique identifier stored in localStorage
- `timestamp`: Unix timestamp when photo was uploaded
- Format: Always `.jpg` (converted during compression)

### Fallback Behavior

- **If Firebase upload succeeds**: URL is stored, local base64 kept as backup
- **If Firebase upload fails**: Only local base64 is stored
- **If offline**: Upload is skipped, local storage only
- **When displaying**: Firebase URL is preferred, falls back to local base64 if URL fails

## Troubleshooting

### "Firebase Storage not available"
- Check that all environment variables are set correctly
- Verify `.env.local` is in the project root
- Restart the dev server after adding env variables

### "Upload failed"
- Check Firebase Storage rules are published
- Verify anonymous authentication is enabled
- Check browser console for specific error messages
- Verify file size is under 3MB

### Photo not displaying
- Check that the URL is accessible (try opening in new tab)
- Verify CORS is configured in Firebase Storage (should work by default)
- Check browser console for image loading errors

### Storage permission errors
- Check that Storage rules allow uploads to `id-photos/` path
- Verify file size and content type restrictions in rules
- Check browser console for specific error messages

## Security Notes

- **No authentication required**: Storage rules handle access control
- **File size limit**: 5MB enforced in both client and Storage rules
- **Content type validation**: Only image files allowed
- **Folder isolation**: Only `id-photos/` folder is accessible
- **Production**: Configure Storage rules appropriately, consider rate limiting for production use

## Local Storage Structure

The photo URL is stored in localStorage under `medicalProfile`:

```json
{
  "personalInfo": {
    "idPhotoUrl": "https://firebasestorage.googleapis.com/...",
    "idPhoto": "data:image/jpeg;base64,..." // Fallback
  }
}
```

- `idPhotoUrl`: Firebase Storage download URL (preferred)
- `idPhoto`: Base64 data URL (fallback for offline/upload failures)

## Next Steps

- Monitor Storage usage in Firebase Console
- Set up Storage lifecycle rules if needed (auto-delete old photos)
- Consider implementing photo deletion when user removes ID photo
- Add error notifications for upload failures (currently silent fallback)

