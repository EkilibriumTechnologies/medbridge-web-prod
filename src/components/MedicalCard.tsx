import { useState, useEffect } from "react";
import { AlertCircle, Phone, Edit, Share2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicalProfile } from "@/types/medical";

export function MedicalCard() {
  const [profile, setProfile] = useState<MedicalProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("medicalProfile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">No Medical Profile Found</h2>
          <p className="text-gray-600 mb-6">Please create a medical profile to use this emergency card.</p>
          <Button size="lg" className="w-full">
            Create Medical Profile
          </Button>
        </div>
      </div>
    );
  }

  const hasAllergies = profile.allergies.medication.length > 0 || profile.allergies.food.length > 0;
  const hasConditions = profile.conditions && profile.conditions.length > 0;
  const isHighRisk = hasAllergies || hasConditions;

  const cardAccentColor = isHighRisk ? "border-red-500" : "border-blue-500";
  const cardBgGradient = isHighRisk 
    ? "bg-gradient-to-b from-red-50 to-white" 
    : "bg-gradient-to-b from-blue-50 to-white";

  return (
    <div className={`min-h-screen ${cardBgGradient} p-4 pb-24`}>
      <div className={`max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border-4 ${cardAccentColor} overflow-hidden`}>
        
        {/* HEADER */}
        <div className={`${isHighRisk ? "bg-red-500" : "bg-blue-500"} text-white p-6`}>
          <h1 className="text-4xl font-black mb-2 leading-tight">
            {profile.personalInfo.fullName}
          </h1>
          <p className="text-xl font-semibold opacity-90">
            DOB: {profile.personalInfo.dateOfBirth}
          </p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* BLOOD TYPE - MOST PROMINENT */}
          <div className="bg-gray-900 text-white rounded-xl p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-wider mb-2 opacity-70">Blood Type</p>
            <p className="text-7xl font-black tracking-tight">
              {profile.bloodType}
            </p>
          </div>

          {/* TRANSFUSION STATUS */}
          <div className={`${profile.acceptsTransfusion ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"} border-2 rounded-xl p-6`}>
            <div className="flex items-center justify-center gap-4">
              {profile.acceptsTransfusion ? (
                <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={3} />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" strokeWidth={3} />
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                  Blood Transfusion
                </p>
                <p className={`text-2xl font-black ${profile.acceptsTransfusion ? "text-green-700" : "text-red-700"}`}>
                  {profile.acceptsTransfusion ? "ACCEPTS" : "DOES NOT ACCEPT"}
                </p>
              </div>
            </div>
          </div>

          {/* ALLERGIES - CRITICAL WARNING */}
          <div className="bg-red-100 border-4 border-red-500 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-700" strokeWidth={3} />
              <h2 className="text-2xl font-black text-red-900 uppercase tracking-tight">
                ALLERGIES
              </h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold text-red-900 mb-1">MEDICATION:</p>
                <p className="text-xl font-bold text-red-800">
                  {profile.allergies.medication.length > 0 
                    ? profile.allergies.medication.join(", ") 
                    : "None reported"}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-bold text-red-900 mb-1">FOOD:</p>
                <p className="text-xl font-bold text-red-800">
                  {profile.allergies.food.length > 0 
                    ? profile.allergies.food.join(", ") 
                    : "None reported"}
                </p>
              </div>
            </div>
          </div>

          {/* CURRENT MEDICATIONS */}
          <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3">
              Current Medications
            </h2>
            <p className="text-xl font-semibold text-gray-800">
              {profile.currentMedications.length > 0 
                ? profile.currentMedications.join(", ") 
                : "None reported"}
            </p>
          </div>

          {/* EMERGENCY CONTACT */}
          <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6">
            <h2 className="text-lg font-black text-amber-900 uppercase tracking-tight mb-3">
              Emergency Contact
            </h2>
            <p className="text-2xl font-bold text-amber-900 mb-2">
              {profile.emergencyContact.name}
            </p>
            <a 
              href={`tel:${profile.emergencyContact.phone}`}
              className="flex items-center gap-3 text-xl font-bold text-amber-700 hover:text-amber-900 transition-colors"
            >
              <Phone className="w-6 h-6" />
              {profile.emergencyContact.phone}
            </a>
          </div>

        </div>
      </div>

      {/* ACTIONS - FIXED BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="lg"
            className="font-bold text-base"
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