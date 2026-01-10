/**
 * Medical Card Component
 * 
 * MOBILE-ONLY REPOSITORY: This component displays the medical profile card with PDF export
 * and sharing functionality. These features require a one-time in-app purchase on mobile.
 * 
 * Premium Features (require purchase):
 * - PDF Export: Generate professional medical report PDF
 * - Share Profile: Share medical profile via native share sheet
 * 
 * Purchase Gates:
 * - If purchase is not active: PDF and Share buttons show upgrade modal
 * - If purchase is active: Features are enabled with license cycle tracking
 * - License cycle: 1 year from first use (PDF or Share) after purchase
 * 
 * Web/B2B version lives in a separate repository.
 */

import { useState, useEffect } from "react";
import { AlertCircle, Phone, Edit, Share2, Activity, ArrowLeft, FileText, User, Heart, Shield, Stethoscope, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicalProfile } from "@/types/medical";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { CardLanguageSelector } from "@/components/CardLanguageSelector";
import { generateMedicalReportPDF, generateMedicalReportFileName } from "@/lib/generateMedicalReportPDF";
import { PDF_EXPORT_ENABLED, SHARE_ENABLED } from "@/lib/features";
// License functions are imported dynamically when needed
import { UpgradeModal } from "@/components/UpgradeModal";
import { hasPremiumPurchase, initBilling, isBillingAvailable, clearStalePurchaseState } from "@/lib/billing";
import { Capacitor } from "@capacitor/core";

export function MedicalCard() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<MedicalProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [hasPremiumAccess, setHasPremiumAccess] = useState<boolean>(false);
  const [isCheckingPremium, setIsCheckingPremium] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("medicalProfile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // Handle backward compatibility for allergies
        if (parsed.allergies) {
          // Si allergies es un objeto con propiedades
          if (typeof parsed.allergies === "object" && !Array.isArray(parsed.allergies)) {
            const allergyParts = [];
            if (parsed.allergies.medication) allergyParts.push(`Medicamentos: ${parsed.allergies.medication}`);
            if (parsed.allergies.food) allergyParts.push(`Alimentos: ${parsed.allergies.food}`);
            parsed.allergies = allergyParts.join("\n") || "";
          }
          // Si allergies es un array de objetos
          else if (Array.isArray(parsed.allergies)) {
            const allergyParts = parsed.allergies.map((allergy: any) => {
              if (typeof allergy === "object" && allergy.type && allergy.details) {
                const typeLabel = allergy.type === "medication" ? "Medicamentos" : 
                                 allergy.type === "food" ? "Alimentos" : allergy.type;
                return `${typeLabel}: ${allergy.details}`;
              }
              return String(allergy);
            });
            parsed.allergies = allergyParts.join("\n") || "";
          }
          // Si allergies no es string, convertir a string
          else if (typeof parsed.allergies !== "string") {
            parsed.allergies = String(parsed.allergies);
          }
        } else {
          parsed.allergies = "";
        }
        
        setProfile(parsed);
      } catch (error) {
        console.error("Failed to parse medical profile:", error);
      }
    }

    // Check license status (Android only - premium features)
    console.log("[MedicalCard] useEffect: PDF_EXPORT_ENABLED =", PDF_EXPORT_ENABLED);
    console.log("[MedicalCard] useEffect: SHARE_ENABLED =", SHARE_ENABLED);
    
    if (PDF_EXPORT_ENABLED || SHARE_ENABLED) {
      console.log("[MedicalCard] useEffect: Premium features enabled, initializing...");
      
      // Clear stale purchase state first (from testing mode or old data)
      clearStalePurchaseState();
      
      // Initialize billing on app start (if available)
      if (isBillingAvailable()) {
        console.log("[MedicalCard] useEffect: Billing available, initializing...");
        initBilling().catch((error) => {
          console.error("[MedicalCard] Failed to initialize billing:", error);
        });
      } else {
        console.log("[MedicalCard] useEffect: Billing NOT available (may be web or testing mode)");
      }
      
      // Check purchase and license status
      const checkPremium = async () => {
        try {
          setIsCheckingPremium(true);
          const hasPurchase = await hasPremiumPurchase();
          console.log("[MedicalCard] useEffect: Checking premium access - hasPurchase =", hasPurchase);
          setHasPremiumAccess(hasPurchase);
          
          // Only check license cycle if purchase exists, but don't create it yet
          if (hasPurchase) {
            const { getLicenseCycle } = await import("@/lib/license");
            const existingCycle = getLicenseCycle();
            if (existingCycle) {
              const now = Date.now();
              const isActive = now < existingCycle.cycleExpiresAt;
              console.log("[MedicalCard] useEffect: License cycle exists, active =", isActive);
              if (!isActive) {
                // Cycle expired - access should be revoked
                setHasPremiumAccess(false);
              }
            } else {
              console.log("[MedicalCard] useEffect: Purchase exists but no cycle yet (will be created on first use)");
            }
          }
        } catch (error) {
          console.error("[MedicalCard] Error checking premium access:", error);
          setHasPremiumAccess(false);
        } finally {
          setIsCheckingPremium(false);
        }
      };
      
      checkPremiumStatus().then(() => {
        checkPremium();
      });
    } else {
      console.log("[MedicalCard] useEffect: Premium features DISABLED (web mode or flags off)");
    }
  }, []);

  const checkPremiumStatus = async () => {
    if (!PDF_EXPORT_ENABLED && !SHARE_ENABLED) {
      return;
    }

    try {
      // Check if user has purchased premium
      console.log("[MedicalCard] checkPremiumStatus: Checking premium purchase...");
      const hasPurchase = await hasPremiumPurchase();
      console.log("[MedicalCard] checkPremiumStatus: hasPurchase =", hasPurchase);
      
      // Only verify purchase status - do NOT create cycle here
      // Cycle will be created on first use (PDF or Share)
      if (hasPurchase) {
        const { getLicenseCycle } = await import("@/lib/license");
        const existingCycle = getLicenseCycle();
        if (existingCycle) {
          const now = Date.now();
          const isActive = now < existingCycle.cycleExpiresAt;
          console.log("[MedicalCard] checkPremiumStatus: Cycle exists, active =", isActive);
        } else {
          console.log("[MedicalCard] checkPremiumStatus: Purchase exists but no cycle yet (will be created on first use)");
        }
      } else {
        console.log("[MedicalCard] checkPremiumStatus: No premium purchase found");
      }
    } catch (error) {
      console.error("[MedicalCard] Error checking premium status:", error);
    }
  };

  const handleCreateProfile = () => {
    router.push("/form");
  };

  const handleShareMedicalProfile = async () => {
    if (!profile) return;
    
    let licenseCycle;
    
    // Check purchase status first
    if (SHARE_ENABLED) {
      console.log("[Share] Checking premium purchase...");
      const hasPurchase = await hasPremiumPurchase();
      console.log("[Share] hasPremiumPurchase:", hasPurchase);
      
      // If no purchase, show upgrade modal and update state
      if (!hasPurchase) {
        console.log("[Share] No purchase found, showing upgrade modal");
        setHasPremiumAccess(false);
        setShowUpgradeModal(true);
        return;
      }
      
      // Update state if purchase exists (might have changed)
      if (!hasPremiumAccess) {
        setHasPremiumAccess(true);
      }
      
      // If has purchase, check/verify license cycle
      console.log("[Share] Purchase verified, checking license cycle...");
      const { getLicenseCycle, getOrCreateLicenseCycle } = await import("@/lib/license");
      licenseCycle = getLicenseCycle();
      
      // If no cycle exists, create one now (first use after purchase)
      // This is one of the three moments: compra, primer PDF, o primer share
      if (!licenseCycle) {
        console.log("[Share] Purchase exists but no cycle - creating cycle for first share");
        licenseCycle = getOrCreateLicenseCycle();
        console.log("[Share] License cycle created:", licenseCycle);
      } else {
        // Check if cycle is expired
        const now = Date.now();
        if (now >= licenseCycle.cycleExpiresAt) {
          // Cycle expired - needs renewal (new purchase)
          console.log("[Share] License expired, showing upgrade modal");
          setShowUpgradeModal(true);
          return;
        }
        console.log("[Share] License cycle active, using existing cycle");
      }
      
      console.log("[Share] Premium check passed, proceeding with share...");
    } else {
      // Web platform: no license cycle needed
      licenseCycle = undefined;
    }

    console.log("[Share] Setting isSharing to true...");
    setIsSharing(true);
    
    try {
      console.log("[Share] License cycle:", licenseCycle);
      
      console.log("[Share] Generating PDF blob...");
      // Generate PDF as Blob with license cycle timestamps
      const pdfBlob = generateMedicalReportPDF(profile, t, language, licenseCycle);
      console.log("[Share] PDF blob generated, size:", pdfBlob.size, "bytes");
      const fileName = generateMedicalReportFileName(profile);
      console.log("[Share] File name:", fileName);

      // Detect native platform using Capacitor
      // Use isNativePlatform if available, otherwise check if platform is not web
      const platform = Capacitor.getPlatform();
      const isNativePlatform = platform !== "web";
      console.log("[Share] Platform:", platform, "isNativePlatform:", isNativePlatform);
      
      if (isNativePlatform) {
        // Native platform (Android/iOS): Use Capacitor Share plugin
        console.log("[Share] Using Capacitor Share plugin for native platform...");
        try {
          const { Share } = await import("@capacitor/share");
          const { Filesystem, Directory } = await import("@capacitor/filesystem");
          
          // Convert blob to base64
          console.log("[Share] Converting PDF blob to base64...");
          const reader = new FileReader();
          const base64Data = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
              const base64 = reader.result as string;
              // Remove data:application/pdf;base64, prefix
              const base64Only = base64.split(",")[1];
              resolve(base64Only);
            };
            reader.onerror = reject;
            reader.readAsDataURL(pdfBlob);
          });
          console.log("[Share] Base64 conversion complete, length:", base64Data.length);
          
          // Save file to device (use Cache directory which is properly configured for FileProvider)
          console.log("[Share] Saving PDF to device filesystem...");
          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
            recursive: true
          });
          console.log("[Share] File saved to:", savedFile.uri);
          
          // Get the proper URI for sharing (getUri provides the correct content:// URI for FileProvider)
          console.log("[Share] Getting file URI for sharing...");
          const fileUri = await Filesystem.getUri({
            path: fileName,
            directory: Directory.Cache
          });
          console.log("[Share] File URI for sharing:", fileUri.uri);
          
          // Share using Capacitor Share plugin with file URI
          console.log("[Share] Opening native share sheet...");
          await Share.share({
            title: t("card.shareTitle"),
            text: t("card.shareText"),
            url: fileUri.uri, // file:// URI for native file sharing
            dialogTitle: t("card.shareProfile")
          });
          console.log("[Share] Native share completed successfully");
          
          // Clean up: Delete the temporary file after sharing (with delay to allow share to complete)
          setTimeout(async () => {
            try {
              await Filesystem.deleteFile({
                path: fileName,
                directory: Directory.Cache
              });
              console.log("[Share] Temporary file deleted");
            } catch (cleanupError) {
              console.warn("[Share] Failed to delete temporary file:", cleanupError);
            }
          }, 2000); // Wait 2 seconds before cleanup
        } catch (shareError) {
          console.error("[Share] Capacitor Share error:", shareError);
          // On native platform, do not fallback to Web Share API or download
          // Only handle user cancellation gracefully
          if (shareError instanceof Error) {
            if (shareError.message.includes("User cancelled") || shareError.message.includes("cancel")) {
              console.log("[Share] User cancelled share");
              return; // User cancelled, just return
            }
          }
          // For other errors on native platform, show error to user
          console.error("[Share] Share failed on native platform:", shareError);
          alert(t("card.shareError") || "Error sharing medical profile. Please try again.");
        }
      } else {
        // Web platform: Use Web Share API or download
        console.log("[Share] Using Web Share API for web platform...");
        const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });
        
        if (navigator.share && navigator.canShare) {
          try {
            if (navigator.canShare({ files: [pdfFile] })) {
              console.log("[Share] Using Web Share API...");
              await navigator.share({
                title: t("card.shareTitle"),
                text: t("card.shareText"),
                files: [pdfFile]
              });
              console.log("[Share] Web Share API completed successfully");
            } else {
              throw new Error("Cannot share files via Web Share API");
            }
          } catch (shareError) {
            console.log("[Share] Web Share API error:", shareError);
            if (shareError instanceof Error && shareError.name === "AbortError") {
              console.log("[Share] User cancelled share");
              return;
            }
            // Fall through to download
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log("[Share] Fallback download completed");
          }
        } else {
          // Download as fallback
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          console.log("[Share] Download completed");
        }
      }
    } catch (error) {
      // User cancelled share or error occurred
      console.error("[Share] Error in share process:", error);
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("[Share] Full error details:", error);
        alert(t("card.shareError") || "Error sharing medical profile. Please try again.");
      } else {
        console.log("[Share] User cancelled or AbortError (this is OK)");
      }
    } finally {
      console.log("[Share] Setting isSharing to false...");
      setIsSharing(false);
    }
  };

  // Prevent hydration mismatch by waiting for client-side mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2 dark:text-white">{t("card.noProfile")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("card.createProfilePrompt")}
          </p>
          <Button size="lg" className="w-full" onClick={handleCreateProfile}>
            {t("card.createProfile")}
          </Button>
        </div>
      </div>
    );
  }

  const hasAllergies = profile.allergies && profile.allergies.trim().length > 0;
  
  const cardAccentColor = hasAllergies ? "border-red-500" : "border-blue-500";
  const cardBgGradient = hasAllergies 
    ? "bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-900" 
    : "bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900";

  return (
    <div className={`min-h-screen ${cardBgGradient} p-4 pb-32`}>
      <div className={`max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-4 ${cardAccentColor} overflow-hidden`}>
        
        {/* Header Section */}
        <div className={`${hasAllergies ? "bg-red-500" : "bg-blue-500"} text-white p-6 relative`}>
          <div className="absolute top-4 left-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-white hover:bg-white/20"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="absolute top-4 right-4">
            <CardLanguageSelector />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black mb-2 leading-tight px-14 text-center">
            {profile.firstName} {profile.lastName}
          </h1>
          <div className="space-y-1 text-center">
            <p className="text-lg sm:text-xl font-semibold opacity-90">
              {t("card.dob")}: {profile.dateOfBirth || t("card.notSpecified")}
            </p>
            {profile.gender && (
              <p className="text-base sm:text-lg font-medium opacity-80">
                {profile.gender}
              </p>
            )}
            {profile.country && (
              <p className="text-base sm:text-lg font-medium opacity-80">
                {profile.city ? `${profile.city}, ` : ""}{profile.country}
              </p>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Blood Type */}
          <div className="bg-gray-900 dark:bg-gray-950 text-white rounded-xl p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-wider mb-2 opacity-70">{t("card.bloodType")}</p>
            <p className="text-6xl sm:text-7xl font-black tracking-tight">
              {profile.bloodType || t("card.notSpecified")}
            </p>
          </div>

          {/* Allergies Section */}
          <div className="bg-red-100 dark:bg-red-950 border-4 border-red-500 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-700 dark:text-red-400" strokeWidth={3} />
              <h2 className="text-2xl font-black text-red-900 dark:text-red-200 uppercase tracking-tight">
                {t("card.allergies")}
              </h2>
            </div>
            
            <p className="text-xl sm:text-2xl font-bold text-red-800 dark:text-red-200 whitespace-pre-line">
              {hasAllergies ? profile.allergies : t("card.none")}
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-slate-700 dark:text-slate-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                {t("form.sections.personalInfo")}
              </h2>
            </div>
            
            <div className="space-y-3">
              {profile.phoneNumber && (
                <div className="flex items-start gap-2">
                  <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">{t("form.fields.phoneNumber")}</p>
                    <a href={`tel:${profile.phoneNumber}`} className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400">
                      {profile.phoneNumber}
                    </a>
                  </div>
                </div>
              )}
              
              {profile.email && (
                <div className="flex items-start gap-2">
                  <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">{t("form.fields.email")}</p>
                    <a href={`mailto:${profile.email}`} className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 break-all">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}
              
              {(profile.address || profile.city || profile.state || profile.zipCode) && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">{t("form.fields.address")}</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {[profile.address, profile.city, profile.state, profile.zipCode].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Medications */}
          <div className="bg-purple-50 dark:bg-purple-950 border-2 border-purple-300 dark:border-purple-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-6 h-6 text-purple-700 dark:text-purple-400" />
              <h2 className="text-lg font-black text-purple-900 dark:text-purple-100 uppercase tracking-tight">
                {t("card.currentMedications")}
              </h2>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-purple-900 dark:text-purple-200 whitespace-pre-line">
              {profile.currentMedications || t("card.none")}
            </p>
          </div>

          {/* Medical Conditions & History */}
          <div className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-300 dark:border-blue-600 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-blue-700 dark:text-blue-400" />
              <h2 className="text-lg font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight">
                {t("card.medicalConditions")}
              </h2>
            </div>
            
            {profile.medicalConditions && (
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">{t("card.current")}:</p>
                <p className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200 whitespace-pre-line">
                  {profile.medicalConditions}
                </p>
              </div>
            )}
            
            {profile.chronicIllnesses && (
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">{t("card.chronic")}:</p>
                <p className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200 whitespace-pre-line">
                  {profile.chronicIllnesses}
                </p>
              </div>
            )}

            {profile.pastSurgeries && (
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">{t("card.surgicalHistory")}:</p>
                <p className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200 whitespace-pre-line">
                  {profile.pastSurgeries}
                </p>
              </div>
            )}
            
            {profile.disabilities && (
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">{t("form.fields.disabilities")}:</p>
                <p className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200 whitespace-pre-line">
                  {profile.disabilities}
                </p>
              </div>
            )}
            
            {!profile.medicalConditions && !profile.chronicIllnesses && !profile.pastSurgeries && !profile.disabilities && (
               <p className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200">
                 {t("card.none")}
               </p>
            )}
          </div>

          {/* Medical Insurance */}
          {(profile.insuranceProvider || profile.policyNumber || profile.groupNumber || profile.insurancePhone) && (
            <div className="bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-300 dark:border-emerald-600 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                <h2 className="text-lg font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-tight">
                  {t("form.sections.insurance")}
                </h2>
              </div>
              
              <div className="space-y-3">
                {profile.insuranceProvider && (
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase">{t("form.fields.insuranceProvider")}</p>
                    <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{profile.insuranceProvider}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  {profile.policyNumber && (
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase">{t("form.fields.policyNumber")}</p>
                      <p className="text-base font-bold text-emerald-900 dark:text-emerald-100">{profile.policyNumber}</p>
                    </div>
                  )}
                  
                  {profile.groupNumber && (
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase">{t("form.fields.groupNumber")}</p>
                      <p className="text-base font-bold text-emerald-900 dark:text-emerald-100">{profile.groupNumber}</p>
                    </div>
                  )}
                </div>
                
                {profile.insurancePhone && (
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase">{t("form.fields.insurancePhone")}</p>
                    <a 
                      href={`tel:${profile.insurancePhone}`}
                      className="flex items-center gap-2 text-lg font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      {profile.insurancePhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          <div className="bg-amber-50 dark:bg-amber-950 border-2 border-amber-400 dark:border-amber-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              <h2 className="text-lg font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">
                {t("card.emergencyContact")}
              </h2>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-100 mb-1">
              {profile.emergencyContactName || t("card.notSpecified")}
            </p>
            {profile.emergencyContactRelationship && (
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-3 uppercase tracking-wide">
                {profile.emergencyContactRelationship}
              </p>
            )}
            
            <div className="space-y-2">
              {profile.emergencyContactPhone && (
                <a 
                  href={`tel:${profile.emergencyContactPhone}`}
                  className="flex items-center gap-3 text-lg sm:text-xl font-bold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {profile.emergencyContactPhone}
                </a>
              )}
              
              {profile.emergencyContactEmail && (
                <a 
                  href={`mailto:${profile.emergencyContactEmail}`}
                  className="flex items-center gap-3 text-base font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors break-all"
                >
                  <Mail className="w-5 h-5" />
                  {profile.emergencyContactEmail}
                </a>
              )}
            </div>
          </div>

          {/* Primary Physician */}
          {(profile.primaryPhysicianName || profile.primaryPhysicianPhone) && (
            <div className="bg-teal-50 dark:bg-teal-950 border-2 border-teal-300 dark:border-teal-600 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Stethoscope className="w-6 h-6 text-teal-700 dark:text-teal-400" />
                <h2 className="text-lg font-black text-teal-900 dark:text-teal-100 uppercase tracking-tight">
                  {t("card.primaryPhysician")}
                </h2>
              </div>
              {profile.primaryPhysicianName && (
                <p className="text-lg sm:text-xl font-bold text-teal-900 dark:text-teal-200 mb-1">
                  {profile.primaryPhysicianName}
                </p>
              )}
              {profile.primaryPhysicianPhone && (
                <a 
                  href={`tel:${profile.primaryPhysicianPhone}`}
                  className="flex items-center gap-2 text-base font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-100 transition-colors mb-1"
                >
                  <Phone className="w-5 h-5" />
                  {profile.primaryPhysicianPhone}
                </a>
              )}
              {profile.primaryPhysicianClinic && (
                <p className="text-base font-medium text-teal-800 dark:text-teal-300">
                  {profile.primaryPhysicianClinic}
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          {(profile.specialInstructions || profile.additionalNotes) && (
            <div className="bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-gray-700 dark:text-gray-400" />
                <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                  {t("common.notes")}
                </h2>
              </div>
              {profile.specialInstructions && (
                 <div className="mb-3">
                   <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{t("card.specialInstructions")}:</p>
                   <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-line">{profile.specialInstructions}</p>
                 </div>
              )}
              {profile.additionalNotes && (
                 <div>
                   <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{t("card.additionalNotes")}:</p>
                   <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-line">{profile.additionalNotes}</p>
                 </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-2xl mx-auto p-3 space-y-2">
          {/* Row 1: Edit and View ID */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/form")}
              className="w-full text-sm py-2.5"
            >
              <Edit className="w-4 h-4 mr-2" />
              {t("card.editInfo")}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/identification")}
              className="w-full text-sm py-2.5"
            >
              <User className="w-4 h-4 mr-2" />
              {t("card.viewId")}
            </Button>
          </div>

          {/* Row 2: Download PDF - Premium Feature (Android only) */}
          {PDF_EXPORT_ENABLED && (
            <>
              <Button
                variant="secondary"
                disabled={isCheckingPremium}
                onClick={async () => {
                  try {
                    // Always check purchase status first (even if hasPremiumAccess is true, verify again)
                    console.log("[PDF Download] Checking premium purchase...");
                    const hasPurchase = await hasPremiumPurchase();
                    console.log("[PDF Download] hasPremiumPurchase:", hasPurchase);
                    
                    // If no purchase, show upgrade modal and update state
                    if (!hasPurchase) {
                      console.log("[PDF Download] No purchase found, showing upgrade modal");
                      setHasPremiumAccess(false);
                      setShowUpgradeModal(true);
                      return;
                    }
                    
                    // Update state if purchase exists (might have changed)
                    if (!hasPremiumAccess) {
                      setHasPremiumAccess(true);
                    }
                    
                    // If has purchase, check/verify license cycle
                    console.log("[PDF Download] Purchase verified, checking license cycle...");
                    const { getLicenseCycle, getOrCreateLicenseCycle } = await import("@/lib/license");
                    let licenseCycle = getLicenseCycle();
                    
                    // If no cycle exists, create one now (first use after purchase)
                    // This is one of the three moments: compra, primer PDF, o primer share
                    if (!licenseCycle) {
                      console.log("[PDF Download] Purchase exists but no cycle - creating cycle for first PDF");
                      licenseCycle = getOrCreateLicenseCycle();
                      console.log("[PDF Download] License cycle created:", licenseCycle);
                    } else {
                      // Check if cycle is expired
                      const now = Date.now();
                      if (now >= licenseCycle.cycleExpiresAt) {
                        // Cycle expired - needs renewal (new purchase)
                        console.log("[PDF Download] License expired, showing upgrade modal");
                        setShowUpgradeModal(true);
                        return;
                      }
                      console.log("[PDF Download] License cycle active, using existing cycle");
                    }

                    console.log("[PDF Download] Premium check passed, generating PDF...");
                    console.log("[PDF Download] Importing PDF generation functions...");
                    const { generateMedicalReportPDF, generateMedicalReportFileName } = await import("@/lib/generateMedicalReportPDF");
                    
                    console.log("[PDF Download] License cycle:", licenseCycle);
                    
                    console.log("[PDF Download] Generating PDF blob...");
                    // Generate PDF with license cycle timestamps
                    const pdfBlob = generateMedicalReportPDF(profile, t, language, licenseCycle);
                    console.log("[PDF Download] PDF blob generated, size:", pdfBlob.size, "bytes");
                    const fileName = generateMedicalReportFileName(profile);
                    console.log("[PDF Download] File name:", fileName);

                    // Check if we're on Android (Capacitor)
                    const isAndroid = Capacitor.getPlatform() === "android";
                    console.log("[PDF Download] Platform:", Capacitor.getPlatform());
                    
                    if (isAndroid) {
                      // Use Capacitor Filesystem to save PDF on Android
                      console.log("[PDF Download] Using Capacitor Filesystem for Android...");
                      const { Filesystem, Directory } = await import("@capacitor/filesystem");
                      
                      // Convert blob to base64
                      console.log("[PDF Download] Converting PDF blob to base64...");
                      const reader = new FileReader();
                      const base64Data = await new Promise<string>((resolve, reject) => {
                        reader.onloadend = () => {
                          const base64 = reader.result as string;
                          const base64Only = base64.split(",")[1];
                          resolve(base64Only);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(pdfBlob);
                      });
                      console.log("[PDF Download] Base64 conversion complete");
                      
                      // Save file to Documents directory (accessible via file manager)
                      console.log("[PDF Download] Saving PDF to Documents folder...");
                      try {
                        const savedFile = await Filesystem.writeFile({
                          path: fileName,
                          data: base64Data,
                          directory: Directory.Documents,
                          recursive: true
                        });
                        console.log("[PDF Download] File saved to:", savedFile.uri);
                        
                        // Show success message with file location
                        alert(`PDF saved successfully!\n\nFile: ${fileName}\n\nLocation: Documents folder\n\nYou can find it in your file manager.`);
                        console.log("[PDF Download] PDF saved successfully");
                      } catch (fsError) {
                        console.error("[PDF Download] Documents directory error:", fsError);
                        // Fallback: Try ExternalStorage (Downloads)
                        console.log("[PDF Download] Trying ExternalStorage as fallback...");
                        try {
                          const savedFile = await Filesystem.writeFile({
                            path: fileName,
                            data: base64Data,
                            directory: Directory.ExternalStorage,
                            recursive: true
                          });
                          console.log("[PDF Download] File saved to ExternalStorage:", savedFile.uri);
                          alert(`PDF saved successfully!\n\nFile: ${fileName}\n\nCheck your Downloads folder.`);
                        } catch (externalError) {
                          console.error("[PDF Download] ExternalStorage error:", externalError);
                          throw externalError;
                        }
                      }
                    } else {
                      // Web platform: Use traditional download
                      console.log("[PDF Download] Using web download method...");
                      const url = URL.createObjectURL(pdfBlob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = fileName;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                      console.log("[PDF Download] Download triggered successfully");
                    }

                    console.log("[PDF Download] PDF generated and saved successfully");
                    // Update license status after successful generation
                    await checkPremiumStatus();
                  } catch (error) {
                    console.error("[PDF Download] Error generating PDF:", error);
                    console.error("[PDF Download] Error stack:", error instanceof Error ? error.stack : "No stack trace");
                    alert("Error generating PDF. Please try again.");
                  }
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm py-2.5"
              >
                <FileText className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </>
          )}

          {/* Row 3: Share Medical Profile - Premium Feature (Android only) */}
          {SHARE_ENABLED && (
            <>
              <Button
                onClick={handleShareMedicalProfile}
                disabled={isSharing || isCheckingPremium}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSharing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {t("card.generating")}
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    {t("card.shareProfile")}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Upgrade/Renewal Modal */}
      {(PDF_EXPORT_ENABLED || SHARE_ENABLED) && (
        <UpgradeModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          onUpgradeConfirmed={async () => {
            // This callback is called after successful purchase/restore
            // Only verify purchase and update status - do NOT create cycle or generate PDF here
            // The cycle will be created when user first uses PDF/Share feature
            try {
              console.log("[UpgradeModal] Purchase/restore confirmed, updating premium status...");
              
              // Update premium status after successful upgrade (checks purchase + license)
              // This will verify purchase exists but won't create cycle yet
              await checkPremiumStatus();
              
              // Update hasPremiumAccess state to enable buttons
              const hasPurchase = await hasPremiumPurchase();
              setHasPremiumAccess(hasPurchase);
              
              console.log("[UpgradeModal] Premium status updated successfully, hasPremiumAccess =", hasPurchase);
              
              // Modal will close automatically via onOpenChange(false) in UpgradeModal
              // User will use PDF/Share button to activate cycle on first use
            } catch (error) {
              console.error("[UpgradeModal] Error updating premium status:", error);
              alert(t("billing.error.unknown") || "Error activating license. Please try again.");
            }
          }}
        />
      )}
    </div>
  );
}