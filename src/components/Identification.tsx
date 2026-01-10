import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Camera, Image as ImageIcon, AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { uploadIdPhoto, isFirebaseStorageAvailable, deleteIdPhoto } from "@/lib/firebaseStorage";
import { useToast } from "@/hooks/use-toast";

interface IdentificationProps {
  onBack?: () => void;
}

export function Identification({ onBack }: IdentificationProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [idPhoto, setIdPhoto] = useState<string | null>(null); // Local preview (base64)
  const [idPhotoUrl, setIdPhotoUrl] = useState<string | null>(null); // Firebase URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // File to upload
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress (0-100)
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit

  useEffect(() => {
    const stored = localStorage.getItem("medicalProfile");
    if (stored) {
      try {
        const profile = JSON.parse(stored);
        // Prefer Firebase URL, fallback to local base64
        // Support both flat structure (upstream) and nested structure (backward compatibility)
        if (profile.idPhotoUrl || profile.personalInfo?.idPhotoUrl) {
          setIdPhotoUrl(profile.idPhotoUrl || profile.personalInfo.idPhotoUrl);
          setIdPhoto(null); // Clear local photo if Firebase URL exists
        } else if (profile.idPhoto || profile.personalInfo?.idPhoto) {
          setIdPhoto(profile.idPhoto || profile.personalInfo.idPhoto);
          setIdPhotoUrl(null);
        }
      } catch (err) {
        console.error("Error loading stored photo:", err);
      }
    }
  }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const maxWidth = 1200;
          const maxHeight = 1200;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileSelect = async (file: File) => {
    setError("");
    setSuccess(false);
    setIsUploading(false);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 15MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    try {
      // Compress image for local preview
      const compressedImage = await compressImage(file);
      
      // Store file for upload and show preview
      setSelectedFile(file);
      setIdPhoto(compressedImage);
      setIdPhotoUrl(null); // Clear previous Firebase URL
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Error processing image. Please try again.");
    }
  };

  /**
   * Handles manual upload to Firebase Storage.
   * User must explicitly click "Upload ID Photo" button.
   */
  const handleUploadToFirebase = async () => {
    if (!selectedFile) {
      const errorMsg = t("id.error.noFile") || "No file selected";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: t("id.error.title") || "Error",
        description: errorMsg,
      });
      return;
    }

    if (!isFirebaseStorageAvailable()) {
      const errorMsg = t("id.error.storageUnavailable") || "Firebase Storage is not available. Please check your configuration.";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: t("id.error.title") || "Error",
        description: errorMsg,
      });
      return;
    }

    setError("");
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload file directly to Firebase with progress tracking
      const downloadURL = await uploadIdPhoto(selectedFile, (progress) => {
        setUploadProgress(progress);
      });
      
      // Successfully uploaded
      setIdPhotoUrl(downloadURL);
      setSuccess(true);
      setUploadProgress(100);
      
      // Show success toast
      toast({
        title: t("id.uploadSuccess") || "Photo uploaded successfully",
        description: t("id.uploadSuccessDesc") || "Your ID photo has been uploaded to Firebase Storage.",
      });
      
      // Clear selected file after successful upload
      setSelectedFile(null);
      
      // Reset progress after a brief delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    } catch (err: any) {
      // Display user-friendly error message
      const errorMessage = err?.message || t("id.error.uploadFailed") || "Failed to upload photo. Please try again.";
      setError(errorMessage);
      setUploadProgress(0);
      console.error("Upload error:", err);
      
      // Show error toast
      toast({
        variant: "destructive",
        title: t("id.error.title") || "Upload failed",
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    cameraInputRef.current?.click();
  };

  const handleGalleryClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    galleryInputRef.current?.click();
  };

  const handleRemove = async () => {
    // If there's a Firebase URL, delete it from Firebase Storage
    if (idPhotoUrl && isFirebaseStorageAvailable()) {
      try {
        await deleteIdPhoto(idPhotoUrl);
        toast({
          title: t("id.deleteSuccess") || "Photo deleted",
          description: t("id.deleteSuccessDesc") || "Photo has been removed from Firebase Storage.",
        });
      } catch (err: any) {
        console.error("Error deleting photo from Firebase:", err);
        // Still allow removal even if Firebase deletion fails
        toast({
          variant: "destructive",
          title: t("id.deleteError") || "Warning",
          description: t("id.deleteErrorDesc") || "Photo removed locally but may still exist in Firebase Storage.",
        });
      }
    }
    
    setIdPhoto(null);
    setIdPhotoUrl(null);
    setSelectedFile(null);
    setError("");
    setSuccess(false);
    setIsUploading(false);
    setUploadProgress(0);
    
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    try {
      const stored = localStorage.getItem("medicalProfile");
      const profile = stored ? JSON.parse(stored) : {};

      // Save Firebase URL if available (preferred), otherwise save local base64
      // Use flat structure (upstream) but maintain backward compatibility
      if (idPhotoUrl) {
        profile.idPhotoUrl = idPhotoUrl;
        // Keep local photo as fallback
        if (idPhoto) {
          profile.idPhoto = idPhoto;
        }
        // Clear nested structure if it exists (migration)
        if (profile.personalInfo) {
          delete profile.personalInfo.idPhotoUrl;
          delete profile.personalInfo.idPhoto;
        }
      } else if (idPhoto) {
        // Only local photo available
        profile.idPhoto = idPhoto;
        // Clear Firebase URL if it was previously set
        delete profile.idPhotoUrl;
        // Clear nested structure if it exists (migration)
        if (profile.personalInfo) {
          delete profile.personalInfo.idPhoto;
          delete profile.personalInfo.idPhotoUrl;
        }
      } else {
        // No photo - clear both
        delete profile.idPhoto;
        delete profile.idPhotoUrl;
        if (profile.personalInfo) {
          delete profile.personalInfo.idPhoto;
          delete profile.personalInfo.idPhotoUrl;
        }
      }

      localStorage.setItem("medicalProfile", JSON.stringify(profile));

      setSuccess(true);
      setTimeout(() => {
        if (onBack) {
          onBack();
        } else {
          router.push("/medcard");
        }
      }, 1500);
    } catch (err) {
      console.error("Error saving photo:", err);
      setError(t("id.saveError"));
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/medcard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back to Home Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="h-9 w-9 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {t("id.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t("id.subtitle")}
          </p>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-900 dark:text-green-100">
              {t("id.saveSuccess")}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-900 dark:text-red-100">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {!idPhoto && !idPhotoUrl ? (
          <Card
            className={`p-8 md:p-12 border-2 border-dashed transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-300 dark:border-gray-700"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInput}
              className="hidden"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />

            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Upload className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t("id.tapToUpload")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("id.dragAndDrop")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleCameraClick}
                  className="w-full sm:w-auto"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {t("id.useCamera")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleGalleryClick}
                  className="w-full sm:w-auto"
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  {t("id.chooseFromGallery")}
                </Button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("id.fileRequirements")}
              </p>
            </div>
          </Card>
        ) : (
          <Card className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("id.preview")}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <X className="w-5 h-5 mr-2" />
                  {t("id.remove")}
                </Button>
              </div>

              <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-3 text-white w-full px-4">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-sm font-medium">{t("id.uploading") || "Uploading..."}</span>
                      {uploadProgress > 0 && (
                        <div className="w-full max-w-xs">
                          <Progress value={uploadProgress} className="h-2" />
                          <span className="text-xs mt-1 block text-center">{uploadProgress}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <img
                  src={idPhotoUrl || idPhoto || ""}
                  alt="ID Preview"
                  className="w-full h-auto max-h-96 object-contain"
                  onError={(e) => {
                    // If Firebase URL fails, try local photo
                    if (idPhotoUrl && idPhoto) {
                      (e.target as HTMLImageElement).src = idPhoto;
                    }
                  }}
                />
              </div>

              {/* Upload progress bar (shown outside overlay when not full-screen) */}
              {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("id.uploadProgress") || "Upload progress"}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="space-y-3">
                {!idPhotoUrl && selectedFile && isFirebaseStorageAvailable() && (
                  <Button
                    size="lg"
                    onClick={handleUploadToFirebase}
                    disabled={isUploading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t("id.uploading") || "Uploading..."}
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        {t("id.uploadButton") || "Upload ID Photo"}
                      </>
                    )}
                  </Button>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCameraClick}
                    className="w-full sm:flex-1"
                    disabled={isUploading}
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {t("id.useCamera")}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleGalleryClick}
                    className="w-full sm:flex-1"
                    disabled={isUploading}
                  >
                    <ImageIcon className="w-5 h-5 mr-2" />
                    {t("id.chooseFromGallery")}
                  </Button>
                </div>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInput}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </Card>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("common.back")}
          </Button>

          <Button
            size="lg"
            onClick={handleSave}
            disabled={(!idPhoto && !idPhotoUrl) || success || isUploading}
            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {t("id.save")}
              </>
            )}
          </Button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <strong>{t("id.note")}:</strong> {t("id.noteDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}