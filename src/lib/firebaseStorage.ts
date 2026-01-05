import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage } from "./firebase";
import { getDeviceId } from "./deviceId";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit

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
 * Uploads an ID photo to Firebase Storage.
 * 
 * @param file - The image file to upload
 * @returns Promise<string> - Download URL from Firebase Storage, or throws error
 * 
 * @throws Error with user-friendly message if upload fails
 */
export async function uploadIdPhoto(file: File): Promise<string> {
  // Validate file BEFORE upload
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid file");
  }

  const storage = getFirebaseStorage();
  if (!storage) {
    throw new Error("Firebase Storage is not available. Please check your configuration.");
  }

  try {
    // Get device ID for folder structure
    const deviceId = getDeviceId();
    const timestamp = Date.now();
    
    // Extract original filename (sanitize for safety)
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .substring(0, 100); // Limit length
    
    // Upload path: id-photos/{deviceId}/{timestamp}-{originalFileName}
    const storagePath = `id-photos/${deviceId}/${timestamp}-${sanitizedFileName}`;

    // Create storage reference
    const storageRef = ref(storage, storagePath);

    // Upload file
    const uploadResult = await uploadBytes(storageRef, file, {
      contentType: file.type,
    });

    // Get and return the public download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);

    return downloadURL;
  } catch (error: any) {
    // Handle specific Firebase errors
    if (error?.code === "storage/unauthorized") {
      throw new Error("Permission denied. Please check Firebase Storage rules.");
    } else if (error?.code === "storage/quota-exceeded") {
      throw new Error("Storage quota exceeded. Please contact support.");
    } else if (error?.code === "storage/unauthenticated") {
      throw new Error("Authentication required. Please check Firebase configuration.");
    } else if (error?.message) {
      throw new Error(`Upload failed: ${error.message}`);
    } else {
      throw new Error("Failed to upload photo. Please check your internet connection and try again.");
    }
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
