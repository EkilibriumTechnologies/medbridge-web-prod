import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase configuration from environment variables
// Using VITE_ prefix as specified (Note: Next.js typically uses NEXT_PUBLIC_)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp | null = null;
let storage: FirebaseStorage | null = null;

/**
 * Gets or initializes Firebase Storage instance.
 * Returns null if Firebase is not configured or unavailable.
 * 
 * IMPORTANT: This module ONLY provides Storage. No Auth, Firestore, or Analytics.
 */
export function getFirebaseStorage(): FirebaseStorage | null {
  if (typeof window === "undefined") {
    // Server-side: return null
    return null;
  }

  // Return cached instance if available
  if (storage) {
    return storage;
  }

  // Check if Firebase is already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    // Validate required config
    if (
      !firebaseConfig.apiKey ||
      !firebaseConfig.authDomain ||
      !firebaseConfig.projectId ||
      !firebaseConfig.storageBucket
    ) {
      console.warn("Firebase config is missing. ID photo upload will not be available.");
      return null;
    }

    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      return null;
    }
  }

  // Initialize Storage
  try {
    storage = getStorage(app);
    return storage;
  } catch (error) {
    console.error("Error initializing Firebase Storage:", error);
    return null;
  }
}
