import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { MedicalCard } from "@/components/MedicalCard";
import { MedicalProfile } from "@/types/medical";

export default function Home() {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Create mock medical profile for demo
    const mockProfile: MedicalProfile = {
      personalInfo: {
        fullName: "John Anderson",
        dateOfBirth: "1985-03-15"
      },
      bloodType: "O+",
      acceptsTransfusion: true,
      allergies: {
        medication: ["Penicillin", "Aspirin"],
        food: ["Peanuts", "Shellfish"]
      },
      currentMedications: ["Lisinopril 10mg daily", "Metformin 500mg twice daily"],
      emergencyContact: {
        name: "Sarah Anderson",
        phone: "+1 (555) 123-4567"
      },
      conditions: ["Type 2 Diabetes", "Hypertension"]
    };

    localStorage.setItem("medicalProfile", JSON.stringify(mockProfile));
    setShowCard(true);
  }, []);

  if (!showCard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Medical Emergency Card - MedBridge"
        description="Quick-access medical information for emergency situations"
      />
      <MedicalCard />
    </>
  );
}