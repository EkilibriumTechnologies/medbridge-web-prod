export interface MedicalProfile {
  // Información Personal
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  idPhoto?: string; // opcional
  
  // Contacto de Emergencia
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  
  // Información Médica
  medicalConditions: string;
  allergies: string;
  currentMedications: string;
  pastSurgeries: string;
  chronicIllnesses: string;
  disabilities: string;
  
  // Seguro Médico
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  insurancePhone: string;
  
  // Doctor Primario
  primaryPhysicianName: string;
  primaryPhysicianPhone: string;
  primaryPhysicianClinic: string;
  
  // Notas Importantes
  specialInstructions: string;
  additionalNotes: string;
  
  // Consentimiento
  consentToTreatment: boolean;
  shareMedicalInfo: boolean;
}