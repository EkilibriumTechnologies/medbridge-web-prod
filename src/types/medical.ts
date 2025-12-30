export interface MedicalProfile {
  // Step 1: Personal Information
  personalInfo: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    maritalStatus: "Single" | "Married" | "";
    passportNumber: string;
    permanentAddress: string;
  };
  
  // Step 2: Basic Medical Information
  bloodType: string;
  acceptsTransfusion: boolean;
  
  // Step 3: Allergies
  allergies: {
    medication: {
      hasAllergies: boolean;
      details: string;
    };
    food: {
      hasAllergies: boolean;
      details: string;
    };
  };
  
  // Step 4: Medical History
  medicalHistory: {
    previousDiagnoses: string;
    currentDiagnoses: string;
    currentMedications: string;
    previousSurgeries: string;
    surgeryComplications: {
      hasComplications: boolean;
      details: string;
    };
    anesthesiaReaction: {
      hasReaction: boolean;
      details: string;
    };
    transplantHistory: {
      hasTransplant: boolean;
      details: string;
    };
  };
  
  // Step 5: Emergency Contacts
  emergencyContacts: {
    primary: {
      fullName: string;
      mobilePhone: string;
      officePhone: string;
      email: string;
    };
    secondary: {
      fullName: string;
      mobilePhone: string;
      officePhone: string;
      email: string;
    };
  };
  
  // Step 6: Primary Physician
  primaryPhysician: {
    fullName: string;
    phone: string;
    email: string;
    clinicHospital: string;
  };
}