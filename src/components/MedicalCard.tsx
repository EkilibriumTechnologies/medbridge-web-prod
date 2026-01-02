import { useState, useEffect } from "react";
import { AlertCircle, Phone, Edit, Share2, Activity, IdCard, ArrowLeft, FileText, User, Heart, Shield, Stethoscope, Mail, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicalProfile } from "@/types/medical";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { CardLanguageSelector } from "@/components/CardLanguageSelector";
import { generateMedicalReportPDF } from "@/lib/generateMedicalReportPDF";

export function MedicalCard() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<MedicalProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("medicalProfile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // Handle backward compatibility for allergies
        if (parsed.allergies && typeof parsed.allergies === "object") {
          // Convert old format {medication: "...", food: "..."} to new string format
          const allergyParts = [];
          if (parsed.allergies.medication) allergyParts.push(`Medicamentos: ${parsed.allergies.medication}`);
          if (parsed.allergies.food) allergyParts.push(`Alimentos: ${parsed.allergies.food}`);
          parsed.allergies = allergyParts.join("\n") || "";
        }
        
        setProfile(parsed);
      } catch (error) {
        console.error("Failed to parse medical profile:", error);
      }
    }
  }, []);

  const handleEdit = () => {
    router.push("/form");
  };

  const handleCreateProfile = () => {
    router.push("/form");
  };

  const handleGeneratePDF = () => {
    if (profile) {
      generateMedicalReportPDF(profile, t, language);
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
    <div className={`min-h-screen ${cardBgGradient} p-4 pb-24`}>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 p-4 shadow-lg z-50">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="lg"
              className="font-bold text-base"
              onClick={handleEdit}
            >
              <Edit className="w-5 h-5 mr-2" />
              {t("card.edit")}
            </Button>
            <Button 
              size="lg"
              className="font-bold text-base bg-blue-600 hover:bg-blue-700"
            >
              <Share2 className="w-5 h-5 mr-2" />
              {t("card.share")}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              size="lg"
              className="font-semibold text-base"
              onClick={() => router.push("/identification")}
            >
              <IdCard className="w-5 h-5 mr-2" />
              {t("card.viewId")}
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="font-semibold text-base"
              onClick={handleGeneratePDF}
            >
              <FileText className="w-5 h-5 mr-2" />
              {t("pdf.button")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}