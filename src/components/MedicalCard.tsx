import { useState, useEffect } from "react";
import { AlertCircle, Phone, Edit, Share2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicalProfile } from "@/types/medical";
import { useRouter } from "next/router";

export function MedicalCard() {
  const router = useRouter();
  const [profile, setProfile] = useState<MedicalProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("medicalProfile");
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2 dark:text-white">No Medical Profile Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please create a medical profile to use this emergency card.
          </p>
          <Button size="lg" className="w-full" onClick={handleCreateProfile}>
            Create Medical Profile
          </Button>
        </div>
      </div>
    );
  }

  const hasMedicationAllergies = profile.allergies?.medication?.hasAllergies || false;
  const hasFoodAllergies = profile.allergies?.food?.hasAllergies || false;
  const hasAllergies = hasMedicationAllergies || hasFoodAllergies;
  
  const cardAccentColor = hasAllergies ? "border-red-500" : "border-blue-500";
  const cardBgGradient = hasAllergies 
    ? "bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-900" 
    : "bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900";

  return (
    <div className={`min-h-screen ${cardBgGradient} p-4 pb-24`}>
      <div className={`max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-4 ${cardAccentColor} overflow-hidden`}>
        
        {/* HEADER */}
        <div className={`${hasAllergies ? "bg-red-500" : "bg-blue-500"} text-white p-6`}>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 leading-tight">
            {profile.personalInfo?.firstName || ""} {profile.personalInfo?.middleName || ""} {profile.personalInfo?.lastName || ""}
          </h1>
          <p className="text-lg sm:text-xl font-semibold opacity-90">
            DOB: {profile.personalInfo?.dateOfBirth || "Not specified"}
          </p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* BLOOD TYPE - MOST PROMINENT */}
          <div className="bg-gray-900 dark:bg-gray-950 text-white rounded-xl p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-wider mb-2 opacity-70">Blood Type</p>
            <p className="text-6xl sm:text-7xl font-black tracking-tight">
              {profile.bloodType || "Not specified"}
            </p>
          </div>

          {/* TRANSFUSION STATUS */}
          <div className={`${profile.acceptsTransfusion ? "bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-700" : "bg-red-50 border-red-300 dark:bg-red-950 dark:border-red-700"} border-2 rounded-xl p-6`}>
            <div className="flex items-center justify-center gap-4">
              {profile.acceptsTransfusion ? (
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" strokeWidth={3} />
              ) : (
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" strokeWidth={3} />
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1 dark:text-gray-300">
                  Blood Transfusion
                </p>
                <p className={`text-xl sm:text-2xl font-black ${profile.acceptsTransfusion ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                  {profile.acceptsTransfusion ? "ACCEPTS" : "DOES NOT ACCEPT"}
                </p>
              </div>
            </div>
          </div>

          {/* ALLERGIES - CRITICAL WARNING */}
          <div className="bg-red-100 dark:bg-red-950 border-4 border-red-500 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-700 dark:text-red-400" strokeWidth={3} />
              <h2 className="text-2xl font-black text-red-900 dark:text-red-200 uppercase tracking-tight">
                ALLERGIES
              </h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold text-red-900 dark:text-red-300 mb-1">MEDICATION:</p>
                <p className="text-lg sm:text-xl font-bold text-red-800 dark:text-red-200">
                  {hasMedicationAllergies && profile.allergies?.medication?.details
                    ? profile.allergies.medication.details
                    : "None reported"}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-bold text-red-900 dark:text-red-300 mb-1">FOOD:</p>
                <p className="text-lg sm:text-xl font-bold text-red-800 dark:text-red-200">
                  {hasFoodAllergies && profile.allergies?.food?.details
                    ? profile.allergies.food.details
                    : "None reported"}
                </p>
              </div>
            </div>
          </div>

          {/* CURRENT MEDICATIONS */}
          <div className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-6">
            <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight mb-3">
              Current Medications
            </h2>
            <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
              {profile.medicalHistory?.currentMedications?.trim()
                ? profile.medicalHistory.currentMedications
                : "None reported"}
            </p>
          </div>

          {/* EMERGENCY CONTACT */}
          <div className="bg-amber-50 dark:bg-amber-950 border-2 border-amber-400 dark:border-amber-600 rounded-xl p-6">
            <h2 className="text-lg font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight mb-3">
              Emergency Contact
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">
              {profile.emergencyContacts?.primary?.fullName || "Not specified"}
            </p>
            {profile.emergencyContacts?.primary?.mobilePhone && (
              <a 
                href={`tel:${profile.emergencyContacts.primary.mobilePhone}`}
                className="flex items-center gap-3 text-lg sm:text-xl font-bold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
              >
                <Phone className="w-6 h-6" />
                {profile.emergencyContacts.primary.mobilePhone}
              </a>
            )}
          </div>

        </div>
      </div>

      {/* ACTIONS - FIXED BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="lg"
            className="font-bold text-base"
            onClick={handleEdit}
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit
          </Button>
          <Button 
            size="lg"
            className="font-bold text-base bg-blue-600 hover:bg-blue-700"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}