export interface MedicalProfile {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
  };
  bloodType: string;
  acceptsTransfusion: boolean;
  allergies: {
    medication: string[];
    food: string[];
  };
  currentMedications: string[];
  emergencyContact: {
    name: string;
    phone: string;
  };
  conditions?: string[];
}