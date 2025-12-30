import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, Camera, Image as ImageIcon, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

interface IdentificationProps {
  onBack?: () => void;
}

export function Identification({ onBack }: IdentificationProps) {
  const router = useRouter();
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  useEffect(() => {
    // Load existing photo from localStorage
    const stored = localStorage.getItem("medicalProfile");
    if (stored) {
      try {
        const profile = JSON.parse(stored);
        if (profile.personalInfo?.idPhoto) {
          setIdPhoto(profile.personalInfo.idPhoto);
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

          // Max dimensions
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

          // Compress to JPEG with 0.8 quality
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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("El archivo es demasiado grande. El tamaño máximo es 3MB");
      return;
    }

    try {
      const compressedImage = await compressImage(file);
      setIdPhoto(compressedImage);
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Error al procesar la imagen. Por favor intenta de nuevo");
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
    setError("");
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    try {
      const stored = localStorage.getItem("medicalProfile");
      const profile = stored ? JSON.parse(stored) : { personalInfo: {} };

      if (!profile.personalInfo) {
        profile.personalInfo = {};
      }

      profile.personalInfo.idPhoto = idPhoto;
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
      setError("Error al guardar la foto. Por favor intenta de nuevo");
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Documento de Identificación
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sube una foto de tu pasaporte o identificación oficial
          </p>
        </div>

        {/* Info Note */}
        <Alert className="mb-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            <p className="mb-2">
              <strong>Esta imagen se almacena de forma segura</strong> y se usa únicamente con fines de identificación.
            </p>
            <p className="text-sm">
              Tu información médica siempre permanece en tu dispositivo.
            </p>
          </AlertDescription>
        </Alert>

        {/* Success Message */}
        {success && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-900 dark:text-green-100">
              Foto guardada exitosamente. Redirigiendo...
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-900 dark:text-red-100">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        {!idPhoto ? (
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
                  Toca para subir foto de ID
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  o arrastra y suelta aquí
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  <span>Usar cámara</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Elegir de galería</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tamaño máximo: 3MB • Formatos: JPG, PNG
              </p>
            </div>
          </Card>
        ) : (
          <Card className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Vista Previa
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <X className="w-5 h-5 mr-2" />
                  Eliminar
                </Button>
              </div>

              <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={idPhoto}
                  alt="ID Preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-5 h-5 mr-2" />
                Reemplazar Foto
              </Button>

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

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>

          <Button
            size="lg"
            onClick={handleSave}
            disabled={!idPhoto || success}
            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Guardar
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <strong>Nota:</strong> Esta foto es opcional y no es parte de tu tarjeta médica de emergencia.
            Se utiliza únicamente para propósitos administrativos e identificación.
          </p>
        </div>
      </div>
    </div>
  );
}