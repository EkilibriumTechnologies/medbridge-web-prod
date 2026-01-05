import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, Camera, Image as ImageIcon, AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { uploadIdPhoto, isFirebaseStorageAvailable } from "@/lib/firebaseStorage";

interface IdentificationProps {
  onBack?: () => void;
}

export function Identification({ onBack }: IdentificationProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [idPhoto, setIdPhoto] = useState<string | null>(null); // Local preview (base64)
  const [idPhotoUrl, setIdPhotoUrl] = useState<string | null>(null); // Firebase URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // File to upload
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB as specified

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
      setError(`File size exceeds 5MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
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
      setError("No file selected");
      return;
    }

    if (!isFirebaseStorageAvailable()) {
      setError("Firebase Storage is not available. Please check your configuration.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      // Upload file directly to Firebase
      const downloadURL = await uploadIdPhoto(selectedFile);
      
      // Successfully uploaded
      setIdPhotoUrl(downloadURL);
      setSuccess(true);
      
      // Clear selected file after successful upload
      setSelectedFile(null);
    } catch (err: any) {
      // Display user-friendly error message
      const errorMessage = err?.message || "Failed to upload photo. Please try again.";
      setError(errorMessage);
      console.error("Upload error:", err);
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
  };

  const handleRemove = () => {
    setIdPhoto(null);
    setIdPhotoUrl(null);
    setSelectedFile(null);
    setError("");
    setSuccess(false);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
            className={`p-8 md:p-12 border-2 border-dashed transition-all cursor-pointer ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
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

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  <span>{t("id.useCamera")}</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>{t("id.chooseFromGallery")}</span>
                </div>
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
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-sm">Uploading...</span>
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
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Upload ID Photo
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  disabled={isUploading}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {idPhotoUrl ? t("id.replacePhoto") : "Select Different Photo"}
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
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