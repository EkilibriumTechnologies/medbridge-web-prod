# Firebase Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# Firebase Configuration
# Note: Next.js requires NEXT_PUBLIC_ prefix for client-side variables
# VITE_ prefix is also supported for compatibility

VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_APP_ID=your-app-id

# Alternative: Next.js format (also supported)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## How to Get Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Click the `</>` (web) icon to add a web app or select existing
7. Copy the configuration values

## Important Notes

- **Never commit `.env.local` to version control**
- The code supports both `VITE_` and `NEXT_PUBLIC_` prefixes
- For Next.js projects, `NEXT_PUBLIC_` is the standard prefix
- Restart the dev server after adding/changing environment variables

## Verification

After setting up the variables, restart your dev server:

```bash
npm run dev
```

The app will automatically detect if Firebase Storage is available. If configuration is missing, ID photo upload will be disabled gracefully.

