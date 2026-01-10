import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirebaseStorage } from "./firebase";
import { getDeviceId } from "./deviceId";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit
const MAX_RETRIES = 3; // Maximum number of retry attempts
const RETRY_DELAY_MS = 1000; // Delay between retries in milliseconds

/**
 * Validates that a file is an image and within size limits.
 */
function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 15MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Uploads an ID photo to Firebase Storage with retry logic and progress tracking.
 * 
 * @param file - The image file to upload
 * @param onProgress - Optional callback to track upload progress (0-100)
 * @returns Promise<string> - Download URL from Firebase Storage, or throws error
 * 
 * @throws Error with user-friendly message if upload fails after retries
 */
export async function uploadIdPhoto(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Validate file BEFORE upload
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid file");
  }

  const storage = getFirebaseStorage();
  if (!storage) {
    throw new Error("Firebase Storage is not available. Please check your configuration.");
  }

  // Get device ID for folder structure
  const deviceId = getDeviceId();
  const timestamp = Date.now();
  
  // Extract original filename (sanitize for safety)
  const sanitizedFileName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .substring(0, 100); // Limit length
  
  // Upload path: id-photos/{deviceId}/{timestamp}-{originalFileName}
  const storagePath = `id-photos/${deviceId}/${timestamp}-${sanitizedFileName}`;

  // Retry logic for upload
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Create storage reference
      const storageRef = ref(storage, storagePath);

      // Simulate progress (Firebase Storage doesn't provide native progress tracking)
      // We'll estimate progress based on time
      if (onProgress) {
        onProgress(10); // Start upload
      }

      // Upload file
      const uploadResult = await uploadBytes(storageRef, file, {
        contentType: file.type,
      });

      if (onProgress) {
        onProgress(90); // Upload complete, getting URL
      }

      // Get and return the public download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);

      if (onProgress) {
        onProgress(100); // Complete
      }

      return downloadURL;
    } catch (error: any) {
      lastError = error;
      
      // Handle specific Firebase errors that shouldn't be retried
      if (error?.code === "storage/unauthorized") {
        throw new Error("Permission denied. Please check Firebase Storage rules.");
      } else if (error?.code === "storage/quota-exceeded") {
        throw new Error("Storage quota exceeded. Please contact support.");
      } else if (error?.code === "storage/unauthenticated") {
        throw new Error("Authentication required. Please check Firebase configuration.");
      }
      
      // For network errors, retry with exponential backoff
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Upload attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        if (onProgress) {
          onProgress(0); // Reset progress for retry
        }
        continue;
      }
      
      // All retries exhausted - will throw below
    }
  }
  
  // All retries exhausted
  if (lastError?.message) {
    throw new Error(`Upload failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
  } else {
    throw new Error("Failed to upload photo. Please check your internet connection and try again.");
  }
}

/**
 * Deletes an ID photo from Firebase Storage using its download URL.
 * 
 * @param downloadURL - The Firebase Storage download URL to delete
 * @returns Promise<void> - Resolves when deletion is complete
 * 
 * @throws Error with user-friendly message if deletion fails
 */
export async function deleteIdPhoto(downloadURL: string): Promise<void> {
  const storage = getFirebaseStorage();
  if (!storage) {
    throw new Error("Firebase Storage is not available. Please check your configuration.");
  }

  try {
    // Extract the file path from the download URL
    // Firebase Storage URLs follow this pattern:
    // https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media&token={token}
    const url = new URL(downloadURL);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    
    if (!pathMatch || !pathMatch[1]) {
      throw new Error("Invalid Firebase Storage URL format");
    }
    
    // Decode the path (Firebase encodes spaces and special characters)
    const filePath = decodeURIComponent(pathMatch[1]);
    
    // Create storage reference
    const storageRef = ref(storage, filePath);
    
    // Delete the file
    await deleteObject(storageRef);
    
    console.log("Photo deleted successfully from Firebase Storage");
  } catch (error: any) {
    console.error("Error deleting photo from Firebase Storage:", error);
    
    // Handle specific Firebase errors
    if (error?.code === "storage/object-not-found") {
      // File already deleted or doesn't exist - not a critical error
      console.warn("Photo not found in Firebase Storage (may already be deleted)");
      return; // Don't throw for already-deleted files
    } else if (error?.code === "storage/unauthorized") {
      throw new Error("Permission denied. Cannot delete photo from Firebase Storage.");
    } else if (error?.message) {
      throw new Error(`Failed to delete photo: ${error.message}`);
    } else {
      throw new Error("Failed to delete photo from Firebase Storage. Please try again.");
    }
  }
}

/**
 * Extracts the storage path from a Firebase Storage download URL.
 * Useful for storing the path for later deletion.
 * 
 * @param downloadURL - The Firebase Storage download URL
 * @returns The storage path, or null if URL is invalid
 */
export function extractStoragePath(downloadURL: string): string | null {
  try {
    const url = new URL(downloadURL);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    
    if (!pathMatch || !pathMatch[1]) {
      return null;
    }
    
    return decodeURIComponent(pathMatch[1]);
  } catch {
    return null;
  }
}

/**
 * Checks if Firebase Storage is available and configured.
 */
export function isFirebaseStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const storage = getFirebaseStorage();
  return storage !== null;
}
