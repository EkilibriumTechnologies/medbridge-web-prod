import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, ArrowRight, Check, User, Heart, AlertTriangle, FileText, Phone, Stethoscope, IdCard } from "lucide-react";
import { MedicalProfile } from "@/types/medical";
import { useRouter } from "next/router";

const STEPS = [
  { id: 1, title: "Información Personal", icon: User },
  { id: 2, title: "Información Médica Básica", icon: Heart },
  { id: 3, title: "Alergias", icon: AlertTriangle },
  { id: 4, title: "Historial Médico", icon: FileText },
  { id: 5, title: "Contactos de Emergencia", icon: Phone },
  { id: 6, title: "Médico Primario", icon: Stethoscope },
];

const initialProfile: MedicalProfile = {
  personalInfo: {
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    maritalStatus: "",
    passportNumber: "",
    permanentAddress: "",
  },
  bloodType: "",
  acceptsTransfusion: true,
  allergies: {
    medication: { hasAllergies: false, details: "" },
    food: { hasAllergies: false, details: "" },
  },
  medicalHistory: {
    previousDiagnoses: "",
    currentDiagnoses: "",
    currentMedications: "",
    previousSurgeries: "",
    surgeryComplications: { hasComplications: false, details: "" },
    anesthesiaReaction: { hasReaction: false, details: "" },
    transplantHistory: { hasTransplant: false, details: "" },
  },
  emergencyContacts: {
    primary: { fullName: "", mobilePhone: "", officePhone: "", email: "" },
    secondary: { fullName: "", mobilePhone: "", officePhone: "", email: "" },
  },
  primaryPhysician: {
    fullName: "",
    phone: "",
    email: "",
    clinicHospital: "",
  },
};

// Validation helper functions
const validateEmail = (email: string): boolean => {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Will be caught by required field validation
  // Allow formats: +52 55 1234 5678, (555) 123-4567, 555-123-4567, 5551234567
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

const validateDate = (date: string): boolean => {
  if (!date) return true; // Optional field
  const selectedDate = new Date(date);
  const today = new Date();
  const minDate = new Date("1900-01-01");
  return selectedDate <= today && selectedDate >= minDate;
};

const validateAge = (dateOfBirth: string): boolean => {
  if (!dateOfBirth) return true; // Optional field
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 0 && age <= 150;
};

const validateTextLength = (text: string, maxLength: number): boolean => {
  return text.length <= maxLength;
};

export function MedicalForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<MedicalProfile>(initialProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("medicalProfile");
    if (saved) {
      try {
        const savedProfile = JSON.parse(saved);
        setProfile({
          ...initialProfile,
          ...savedProfile,
          personalInfo: { ...initialProfile.personalInfo, ...savedProfile.personalInfo },
          allergies: {
            medication: { ...initialProfile.allergies.medication, ...savedProfile.allergies?.medication },
            food: { ...initialProfile.allergies.food, ...savedProfile.allergies?.food },
          },
          medicalHistory: {
            ...initialProfile.medicalHistory,
            ...savedProfile.medicalHistory,
            surgeryComplications: { ...initialProfile.medicalHistory.surgeryComplications, ...savedProfile.medicalHistory?.surgeryComplications },
            anesthesiaReaction: { ...initialProfile.medicalHistory.anesthesiaReaction, ...savedProfile.medicalHistory?.anesthesiaReaction },
            transplantHistory: { ...initialProfile.medicalHistory.transplantHistory, ...savedProfile.medicalHistory?.transplantHistory },
          },
          emergencyContacts: {
            primary: { ...initialProfile.emergencyContacts.primary, ...savedProfile.emergencyContacts?.primary },
            secondary: { ...initialProfile.emergencyContacts.secondary, ...savedProfile.emergencyContacts?.secondary },
          },
          primaryPhysician: { ...initialProfile.primaryPhysician, ...savedProfile.primaryPhysician },
        });
      } catch (error) {
        console.error("Error loading medical profile:", error);
      }
    }
  }, []);

  const validateField = (fieldName: string, value: string): string => {
    // Step 1: Personal Information
    if (fieldName === "firstName") {
      if (!value.trim()) return "El nombre es requerido";
      if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
      if (!validateTextLength(value, 50)) return "El nombre no puede exceder 50 caracteres";
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "El nombre solo puede contener letras";
    }

    if (fieldName === "middleName") {
      if (value && !validateTextLength(value, 50)) return "El segundo nombre no puede exceder 50 caracteres";
      if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "El segundo nombre solo puede contener letras";
    }

    if (fieldName === "lastName") {
      if (!value.trim()) return "El apellido es requerido";
      if (value.trim().length < 2) return "El apellido debe tener al menos 2 caracteres";
      if (!validateTextLength(value, 50)) return "El apellido no puede exceder 50 caracteres";
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "El apellido solo puede contener letras";
    }

    if (fieldName === "dateOfBirth") {
      if (value && !validateDate(value)) return "Fecha de nacimiento inválida";
      if (value && !validateAge(value)) return "La edad debe estar entre 0 y 150 años";
    }

    if (fieldName === "nationality") {
      if (value && !validateTextLength(value, 50)) return "La nacionalidad no puede exceder 50 caracteres";
    }

    if (fieldName === "passportNumber") {
      if (value && !validateTextLength(value, 20)) return "El número de pasaporte no puede exceder 20 caracteres";
    }

    if (fieldName === "permanentAddress") {
      if (value && !validateTextLength(value, 200)) return "La dirección no puede exceder 200 caracteres";
    }

    // Step 3: Allergies
    if (fieldName === "medicationDetails") {
      if (profile.allergies.medication.hasAllergies && !value.trim()) {
        return "Por favor especifica los medicamentos a los que eres alérgico";
      }
      if (value && !validateTextLength(value, 500)) return "Los detalles no pueden exceder 500 caracteres";
    }

    if (fieldName === "foodDetails") {
      if (profile.allergies.food.hasAllergies && !value.trim()) {
        return "Por favor especifica los alimentos a los que eres alérgico";
      }
      if (value && !validateTextLength(value, 500)) return "Los detalles no pueden exceder 500 caracteres";
    }

    // Step 4: Medical History
    if (fieldName === "previousDiagnoses" || fieldName === "currentDiagnoses" || 
        fieldName === "currentMedications" || fieldName === "previousSurgeries") {
      if (value && !validateTextLength(value, 1000)) return "El texto no puede exceder 1000 caracteres";
    }

    // Step 5: Emergency Contacts
    if (fieldName === "primaryName") {
      if (!value.trim()) return "El nombre del contacto principal es requerido";
      if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
      if (!validateTextLength(value, 100)) return "El nombre no puede exceder 100 caracteres";
    }

    if (fieldName === "primaryPhone") {
      if (!value.trim()) return "El teléfono móvil del contacto principal es requerido";
      if (!validatePhone(value)) return "Formato de teléfono inválido (mínimo 10 dígitos)";
    }

    if (fieldName === "primaryOfficePhone" || fieldName === "secondaryPhone" || fieldName === "secondaryOfficePhone") {
      if (value && !validatePhone(value)) return "Formato de teléfono inválido (mínimo 10 dígitos)";
    }

    if (fieldName === "primaryEmail" || fieldName === "secondaryEmail") {
      if (value && !validateEmail(value)) return "Formato de correo electrónico inválido";
    }

    if (fieldName === "secondaryName") {
      if (value && !validateTextLength(value, 100)) return "El nombre no puede exceder 100 caracteres";
    }

    // Step 6: Primary Physician
    if (fieldName === "doctorName") {
      if (value && !validateTextLength(value, 100)) return "El nombre no puede exceder 100 caracteres";
    }

    if (fieldName === "doctorPhone") {
      if (value && !validatePhone(value)) return "Formato de teléfono inválido (mínimo 10 dígitos)";
    }

    if (fieldName === "doctorEmail") {
      if (value && !validateEmail(value)) return "Formato de correo electrónico inválido";
    }

    if (fieldName === "doctorClinic") {
      if (value && !validateTextLength(value, 200)) return "El nombre no puede exceder 200 caracteres";
    }

    return "";
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      const firstNameError = validateField("firstName", profile.personalInfo.firstName);
      if (firstNameError) newErrors.firstName = firstNameError;

      const middleNameError = validateField("middleName", profile.personalInfo.middleName);
      if (middleNameError) newErrors.middleName = middleNameError;

      const lastNameError = validateField("lastName", profile.personalInfo.lastName);
      if (lastNameError) newErrors.lastName = lastNameError;

      const dobError = validateField("dateOfBirth", profile.personalInfo.dateOfBirth);
      if (dobError) newErrors.dateOfBirth = dobError;

      const nationalityError = validateField("nationality", profile.personalInfo.nationality);
      if (nationalityError) newErrors.nationality = nationalityError;

      const passportError = validateField("passportNumber", profile.personalInfo.passportNumber);
      if (passportError) newErrors.passportNumber = passportError;

      const addressError = validateField("permanentAddress", profile.personalInfo.permanentAddress);
      if (addressError) newErrors.permanentAddress = addressError;
    }

    if (step === 3) {
      const medicationError = validateField("medicationDetails", profile.allergies.medication.details);
      if (medicationError) newErrors.medicationDetails = medicationError;

      const foodError = validateField("foodDetails", profile.allergies.food.details);
      if (foodError) newErrors.foodDetails = foodError;
    }

    if (step === 4) {
      const prevDiagError = validateField("previousDiagnoses", profile.medicalHistory.previousDiagnoses);
      if (prevDiagError) newErrors.previousDiagnoses = prevDiagError;

      const currDiagError = validateField("currentDiagnoses", profile.medicalHistory.currentDiagnoses);
      if (currDiagError) newErrors.currentDiagnoses = currDiagError;

      const medsError = validateField("currentMedications", profile.medicalHistory.currentMedications);
      if (medsError) newErrors.currentMedications = medsError;

      const surgError = validateField("previousSurgeries", profile.medicalHistory.previousSurgeries);
      if (surgError) newErrors.previousSurgeries = surgError;
    }

    if (step === 5) {
      const primaryNameError = validateField("primaryName", profile.emergencyContacts.primary.fullName);
      if (primaryNameError) newErrors.primaryName = primaryNameError;

      const primaryPhoneError = validateField("primaryPhone", profile.emergencyContacts.primary.mobilePhone);
      if (primaryPhoneError) newErrors.primaryPhone = primaryPhoneError;

      const primaryOfficeError = validateField("primaryOfficePhone", profile.emergencyContacts.primary.officePhone);
      if (primaryOfficeError) newErrors.primaryOfficePhone = primaryOfficeError;

      const primaryEmailError = validateField("primaryEmail", profile.emergencyContacts.primary.email);
      if (primaryEmailError) newErrors.primaryEmail = primaryEmailError;

      const secondaryNameError = validateField("secondaryName", profile.emergencyContacts.secondary.fullName);
      if (secondaryNameError) newErrors.secondaryName = secondaryNameError;

      const secondaryPhoneError = validateField("secondaryPhone", profile.emergencyContacts.secondary.mobilePhone);
      if (secondaryPhoneError) newErrors.secondaryPhone = secondaryPhoneError;

      const secondaryOfficeError = validateField("secondaryOfficePhone", profile.emergencyContacts.secondary.officePhone);
      if (secondaryOfficeError) newErrors.secondaryOfficePhone = secondaryOfficeError;

      const secondaryEmailError = validateField("secondaryEmail", profile.emergencyContacts.secondary.email);
      if (secondaryEmailError) newErrors.secondaryEmail = secondaryEmailError;
    }

    if (step === 6) {
      const doctorNameError = validateField("doctorName", profile.primaryPhysician.fullName);
      if (doctorNameError) newErrors.doctorName = doctorNameError;

      const doctorPhoneError = validateField("doctorPhone", profile.primaryPhysician.phone);
      if (doctorPhoneError) newErrors.doctorPhone = doctorPhoneError;

      const doctorEmailError = validateField("doctorEmail", profile.primaryPhysician.email);
      if (doctorEmailError) newErrors.doctorEmail = doctorEmailError;

      const doctorClinicError = validateField("doctorClinic", profile.primaryPhysician.clinicHospital);
      if (doctorClinicError) newErrors.doctorClinic = doctorClinicError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        setCurrentStep(7);
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
      window.scrollTo(0, 0);
    }
  };

  const handleSave = () => {
    localStorage.setItem("medicalProfile", JSON.stringify(profile));
    router.push("/");
  };

  const handleSaveAndUploadId = () => {
    localStorage.setItem("medicalProfile", JSON.stringify(profile));
    router.push("/identification");
  };

  const updateProfile = (path: string[], value: any) => {
    setProfile((prev) => {
      const newProfile = { ...prev };
      let current: any = newProfile;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newProfile;
    });
  };

  const handleBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true });
  };

  const handleFieldChange = (path: string[], value: any, fieldName: string) => {
    updateProfile(path, value);
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors({ ...errors, [fieldName]: error });
    }
  };

  const CurrentStepIcon = STEPS[currentStep - 1]?.icon || User;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {currentStep <= 6 ? `Paso ${currentStep} de 6` : "Revisión"}
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentStep <= 6 ? Math.round((currentStep / 6) * 100) : 100}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentStep <= 6 ? (currentStep / 6) * 100 : 100}%` }}
            />
          </div>
        </div>

        {/* Step Title */}
        {currentStep <= 6 && (
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <CurrentStepIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {STEPS[currentStep - 1].title}
            </h1>
          </div>
        )}

        {/* Form Card */}
        <Card className="p-6 mb-6 shadow-lg">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="firstName" className="text-lg font-medium">
                  Nombre *
                </Label>
                <Input
                  id="firstName"
                  value={profile.personalInfo.firstName}
                  onChange={(e) => handleFieldChange(["personalInfo", "firstName"], e.target.value, "firstName")}
                  onBlur={() => handleBlur("firstName")}
                  className={`mt-2 h-12 text-lg ${errors.firstName ? "border-red-500" : ""}`}
                  placeholder="Juan"
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="middleName" className="text-lg font-medium">
                  Segundo Nombre
                </Label>
                <Input
                  id="middleName"
                  value={profile.personalInfo.middleName}
                  onChange={(e) => handleFieldChange(["personalInfo", "middleName"], e.target.value, "middleName")}
                  onBlur={() => handleBlur("middleName")}
                  className={`mt-2 h-12 text-lg ${errors.middleName ? "border-red-500" : ""}`}
                  placeholder="Carlos"
                />
                {errors.middleName && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.middleName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-lg font-medium">
                  Apellido *
                </Label>
                <Input
                  id="lastName"
                  value={profile.personalInfo.lastName}
                  onChange={(e) => handleFieldChange(["personalInfo", "lastName"], e.target.value, "lastName")}
                  onBlur={() => handleBlur("lastName")}
                  className={`mt-2 h-12 text-lg ${errors.lastName ? "border-red-500" : ""}`}
                  placeholder="Pérez"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="text-lg font-medium">
                  Fecha de Nacimiento
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.personalInfo.dateOfBirth}
                  onChange={(e) => handleFieldChange(["personalInfo", "dateOfBirth"], e.target.value, "dateOfBirth")}
                  onBlur={() => handleBlur("dateOfBirth")}
                  className={`mt-2 h-12 text-lg ${errors.dateOfBirth ? "border-red-500" : ""}`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="nationality" className="text-lg font-medium">
                  Nacionalidad
                </Label>
                <Input
                  id="nationality"
                  value={profile.personalInfo.nationality}
                  onChange={(e) => handleFieldChange(["personalInfo", "nationality"], e.target.value, "nationality")}
                  onBlur={() => handleBlur("nationality")}
                  className={`mt-2 h-12 text-lg ${errors.nationality ? "border-red-500" : ""}`}
                  placeholder="Mexicana"
                />
                {errors.nationality && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.nationality}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="maritalStatus" className="text-lg font-medium">
                  Estado Civil
                </Label>
                <Select
                  value={profile.personalInfo.maritalStatus}
                  onValueChange={(value) => updateProfile(["personalInfo", "maritalStatus"], value)}
                >
                  <SelectTrigger className="mt-2 h-12 text-lg">
                    <SelectValue placeholder="Selecciona tu estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Soltero/a</SelectItem>
                    <SelectItem value="Married">Casado/a</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="passportNumber" className="text-lg font-medium">
                  Número de Pasaporte
                </Label>
                <Input
                  id="passportNumber"
                  value={profile.personalInfo.passportNumber}
                  onChange={(e) => handleFieldChange(["personalInfo", "passportNumber"], e.target.value, "passportNumber")}
                  onBlur={() => handleBlur("passportNumber")}
                  className={`mt-2 h-12 text-lg ${errors.passportNumber ? "border-red-500" : ""}`}
                  placeholder="A12345678"
                />
                {errors.passportNumber && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.passportNumber}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="permanentAddress" className="text-lg font-medium">
                  Dirección Permanente
                </Label>
                <Textarea
                  id="permanentAddress"
                  value={profile.personalInfo.permanentAddress}
                  onChange={(e) => handleFieldChange(["personalInfo", "permanentAddress"], e.target.value, "permanentAddress")}
                  onBlur={() => handleBlur("permanentAddress")}
                  className={`mt-2 text-lg min-h-24 ${errors.permanentAddress ? "border-red-500" : ""}`}
                  placeholder="Calle, número, colonia, ciudad, estado, código postal"
                />
                {errors.permanentAddress && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.permanentAddress}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Basic Medical Information */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <Label htmlFor="bloodType" className="text-lg font-medium">
                  Tipo de Sangre
                </Label>
                <Select
                  value={profile.bloodType}
                  onValueChange={(value) => updateProfile(["bloodType"], value)}
                >
                  <SelectTrigger className="mt-2 h-12 text-lg">
                    <SelectValue placeholder="Selecciona tu tipo de sangre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-lg font-medium">
                      ¿Acepta transfusiones de sangre?
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Información crítica para emergencias
                    </p>
                  </div>
                  <Switch
                    checked={profile.acceptsTransfusion}
                    onCheckedChange={(checked) => updateProfile(["acceptsTransfusion"], checked)}
                    className="scale-125"
                  />
                </div>
                <div className="mt-4 text-center">
                  <span className={`text-2xl font-bold ${profile.acceptsTransfusion ? "text-green-600" : "text-red-600"}`}>
                    {profile.acceptsTransfusion ? "SÍ" : "NO"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Allergies */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-100">
                    Información Crítica de Alergias
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Medication Allergies */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-lg font-medium">
                        ¿Alergia a medicamentos?
                      </Label>
                      <Switch
                        checked={profile.allergies.medication.hasAllergies}
                        onCheckedChange={(checked) => updateProfile(["allergies", "medication", "hasAllergies"], checked)}
                        className="scale-125"
                      />
                    </div>
                    {profile.allergies.medication.hasAllergies && (
                      <div>
                        <Textarea
                          value={profile.allergies.medication.details}
                          onChange={(e) => handleFieldChange(["allergies", "medication", "details"], e.target.value, "medicationDetails")}
                          onBlur={() => handleBlur("medicationDetails")}
                          className={`mt-2 text-lg min-h-24 ${errors.medicationDetails ? "border-red-500" : ""}`}
                          placeholder="Lista todos los medicamentos a los que eres alérgico..."
                        />
                        {errors.medicationDetails && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.medicationDetails}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Food Allergies */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-lg font-medium">
                        ¿Alergia a alimentos?
                      </Label>
                      <Switch
                        checked={profile.allergies.food.hasAllergies}
                        onCheckedChange={(checked) => updateProfile(["allergies", "food", "hasAllergies"], checked)}
                        className="scale-125"
                      />
                    </div>
                    {profile.allergies.food.hasAllergies && (
                      <div>
                        <Textarea
                          value={profile.allergies.food.details}
                          onChange={(e) => handleFieldChange(["allergies", "food", "details"], e.target.value, "foodDetails")}
                          onBlur={() => handleBlur("foodDetails")}
                          className={`mt-2 text-lg min-h-24 ${errors.foodDetails ? "border-red-500" : ""}`}
                          placeholder="Lista todos los alimentos a los que eres alérgico..."
                        />
                        {errors.foodDetails && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.foodDetails}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Medical History */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="previousDiagnoses" className="text-lg font-medium">
                  Diagnósticos Previos
                </Label>
                <Textarea
                  id="previousDiagnoses"
                  value={profile.medicalHistory.previousDiagnoses}
                  onChange={(e) => handleFieldChange(["medicalHistory", "previousDiagnoses"], e.target.value, "previousDiagnoses")}
                  onBlur={() => handleBlur("previousDiagnoses")}
                  className={`mt-2 text-lg min-h-24 ${errors.previousDiagnoses ? "border-red-500" : ""}`}
                  placeholder="Enfermedades o condiciones diagnosticadas anteriormente..."
                />
                {errors.previousDiagnoses && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.previousDiagnoses}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="currentDiagnoses" className="text-lg font-medium">
                  Diagnósticos Actuales
                </Label>
                <Textarea
                  id="currentDiagnoses"
                  value={profile.medicalHistory.currentDiagnoses}
                  onChange={(e) => handleFieldChange(["medicalHistory", "currentDiagnoses"], e.target.value, "currentDiagnoses")}
                  onBlur={() => handleBlur("currentDiagnoses")}
                  className={`mt-2 text-lg min-h-24 ${errors.currentDiagnoses ? "border-red-500" : ""}`}
                  placeholder="Condiciones médicas que padeces actualmente..."
                />
                {errors.currentDiagnoses && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.currentDiagnoses}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="currentMedications" className="text-lg font-medium">
                  Medicamentos Actuales
                </Label>
                <Textarea
                  id="currentMedications"
                  value={profile.medicalHistory.currentMedications}
                  onChange={(e) => handleFieldChange(["medicalHistory", "currentMedications"], e.target.value, "currentMedications")}
                  onBlur={() => handleBlur("currentMedications")}
                  className={`mt-2 text-lg min-h-24 ${errors.currentMedications ? "border-red-500" : ""}`}
                  placeholder="Lista todos los medicamentos que tomas regularmente..."
                />
                {errors.currentMedications && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.currentMedications}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="previousSurgeries" className="text-lg font-medium">
                  Cirugías Previas
                </Label>
                <Textarea
                  id="previousSurgeries"
                  value={profile.medicalHistory.previousSurgeries}
                  onChange={(e) => handleFieldChange(["medicalHistory", "previousSurgeries"], e.target.value, "previousSurgeries")}
                  onBlur={() => handleBlur("previousSurgeries")}
                  className={`mt-2 text-lg min-h-24 ${errors.previousSurgeries ? "border-red-500" : ""}`}
                  placeholder="Lista cirugías que has tenido, con fechas si es posible..."
                />
                {errors.previousSurgeries && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.previousSurgeries}
                  </p>
                )}
              </div>

              {/* Conditional Questions */}
              <div className="space-y-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">
                      ¿Complicaciones en cirugías?
                    </Label>
                    <Switch
                      checked={profile.medicalHistory.surgeryComplications.hasComplications}
                      onCheckedChange={(checked) => updateProfile(["medicalHistory", "surgeryComplications", "hasComplications"], checked)}
                    />
                  </div>
                  {profile.medicalHistory.surgeryComplications.hasComplications && (
                    <Textarea
                      value={profile.medicalHistory.surgeryComplications.details}
                      onChange={(e) => updateProfile(["medicalHistory", "surgeryComplications", "details"], e.target.value)}
                      className="mt-2 text-base"
                      placeholder="Describe las complicaciones..."
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">
                      ¿Reacción a anestesia?
                    </Label>
                    <Switch
                      checked={profile.medicalHistory.anesthesiaReaction.hasReaction}
                      onCheckedChange={(checked) => updateProfile(["medicalHistory", "anesthesiaReaction", "hasReaction"], checked)}
                    />
                  </div>
                  {profile.medicalHistory.anesthesiaReaction.hasReaction && (
                    <Textarea
                      value={profile.medicalHistory.anesthesiaReaction.details}
                      onChange={(e) => updateProfile(["medicalHistory", "anesthesiaReaction", "details"], e.target.value)}
                      className="mt-2 text-base"
                      placeholder="Describe la reacción..."
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">
                      ¿Historial de trasplantes?
                    </Label>
                    <Switch
                      checked={profile.medicalHistory.transplantHistory.hasTransplant}
                      onCheckedChange={(checked) => updateProfile(["medicalHistory", "transplantHistory", "hasTransplant"], checked)}
                    />
                  </div>
                  {profile.medicalHistory.transplantHistory.hasTransplant && (
                    <Textarea
                      value={profile.medicalHistory.transplantHistory.details}
                      onChange={(e) => updateProfile(["medicalHistory", "transplantHistory", "details"], e.target.value)}
                      className="mt-2 text-base"
                      placeholder="Describe el trasplante y fecha..."
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Emergency Contacts */}
          {currentStep === 5 && (
            <div className="space-y-8">
              {/* Primary Contact */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contacto Principal *
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primaryName" className="text-base font-medium">
                      Nombre Completo *
                    </Label>
                    <Input
                      id="primaryName"
                      value={profile.emergencyContacts.primary.fullName}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "primary", "fullName"], e.target.value, "primaryName")}
                      onBlur={() => handleBlur("primaryName")}
                      className={`mt-2 h-12 text-lg ${errors.primaryName ? "border-red-500" : ""}`}
                      placeholder="María García"
                    />
                    {errors.primaryName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.primaryName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="primaryMobile" className="text-base font-medium">
                      Teléfono Móvil *
                    </Label>
                    <Input
                      id="primaryMobile"
                      type="tel"
                      value={profile.emergencyContacts.primary.mobilePhone}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "primary", "mobilePhone"], e.target.value, "primaryPhone")}
                      onBlur={() => handleBlur("primaryPhone")}
                      className={`mt-2 h-12 text-lg ${errors.primaryPhone ? "border-red-500" : ""}`}
                      placeholder="+52 55 1234 5678"
                    />
                    {errors.primaryPhone && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.primaryPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="primaryOffice" className="text-base font-medium">
                      Teléfono de Oficina
                    </Label>
                    <Input
                      id="primaryOffice"
                      type="tel"
                      value={profile.emergencyContacts.primary.officePhone}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "primary", "officePhone"], e.target.value, "primaryOfficePhone")}
                      onBlur={() => handleBlur("primaryOfficePhone")}
                      className={`mt-2 h-12 text-lg ${errors.primaryOfficePhone ? "border-red-500" : ""}`}
                      placeholder="+52 55 8765 4321"
                    />
                    {errors.primaryOfficePhone && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.primaryOfficePhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="primaryEmail" className="text-base font-medium">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="primaryEmail"
                      type="email"
                      value={profile.emergencyContacts.primary.email}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "primary", "email"], e.target.value, "primaryEmail")}
                      onBlur={() => handleBlur("primaryEmail")}
                      className={`mt-2 h-12 text-lg ${errors.primaryEmail ? "border-red-500" : ""}`}
                      placeholder="maria@ejemplo.com"
                    />
                    {errors.primaryEmail && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.primaryEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Secondary Contact */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contacto Secundario (Opcional)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="secondaryName" className="text-base font-medium">
                      Nombre Completo
                    </Label>
                    <Input
                      id="secondaryName"
                      value={profile.emergencyContacts.secondary.fullName}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "secondary", "fullName"], e.target.value, "secondaryName")}
                      onBlur={() => handleBlur("secondaryName")}
                      className={`mt-2 h-12 text-lg ${errors.secondaryName ? "border-red-500" : ""}`}
                      placeholder="Pedro López"
                    />
                    {errors.secondaryName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.secondaryName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="secondaryMobile" className="text-base font-medium">
                      Teléfono Móvil
                    </Label>
                    <Input
                      id="secondaryMobile"
                      type="tel"
                      value={profile.emergencyContacts.secondary.mobilePhone}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "secondary", "mobilePhone"], e.target.value, "secondaryPhone")}
                      onBlur={() => handleBlur("secondaryPhone")}
                      className={`mt-2 h-12 text-lg ${errors.secondaryPhone ? "border-red-500" : ""}`}
                      placeholder="+52 55 9876 5432"
                    />
                    {errors.secondaryPhone && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.secondaryPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="secondaryOffice" className="text-base font-medium">
                      Teléfono de Oficina
                    </Label>
                    <Input
                      id="secondaryOffice"
                      type="tel"
                      value={profile.emergencyContacts.secondary.officePhone}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "secondary", "officePhone"], e.target.value, "secondaryOfficePhone")}
                      onBlur={() => handleBlur("secondaryOfficePhone")}
                      className={`mt-2 h-12 text-lg ${errors.secondaryOfficePhone ? "border-red-500" : ""}`}
                      placeholder="+52 55 2345 6789"
                    />
                    {errors.secondaryOfficePhone && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.secondaryOfficePhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="secondaryEmail" className="text-base font-medium">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="secondaryEmail"
                      type="email"
                      value={profile.emergencyContacts.secondary.email}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "secondary", "email"], e.target.value, "secondaryEmail")}
                      onBlur={() => handleBlur("secondaryEmail")}
                      className={`mt-2 h-12 text-lg ${errors.secondaryEmail ? "border-red-500" : ""}`}
                      placeholder="pedro@ejemplo.com"
                    />
                    {errors.secondaryEmail && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.secondaryEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Primary Physician */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Información del Médico Primario
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="doctorName" className="text-base font-medium">
                      Nombre Completo del Doctor
                    </Label>
                    <Input
                      id="doctorName"
                      value={profile.primaryPhysician.fullName}
                      onChange={(e) => handleFieldChange(["primaryPhysician", "fullName"], e.target.value, "doctorName")}
                      onBlur={() => handleBlur("doctorName")}
                      className={`mt-2 h-12 text-lg ${errors.doctorName ? "border-red-500" : ""}`}
                      placeholder="Dr. Roberto Martínez"
                    />
                    {errors.doctorName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.doctorName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="doctorPhone" className="text-base font-medium">
                      Teléfono
                    </Label>
                    <Input
                      id="doctorPhone"
                      type="tel"
                      value={profile.primaryPhysician.phone}
                      onChange={(e) => handleFieldChange(["primaryPhysician", "phone"], e.target.value, "doctorPhone")}
                      onBlur={() => handleBlur("doctorPhone")}
                      className={`mt-2 h-12 text-lg ${errors.doctorPhone ? "border-red-500" : ""}`}
                      placeholder="+52 55 3456 7890"
                    />
                    {errors.doctorPhone && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.doctorPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="doctorEmail" className="text-base font-medium">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="doctorEmail"
                      type="email"
                      value={profile.primaryPhysician.email}
                      onChange={(e) => handleFieldChange(["primaryPhysician", "email"], e.target.value, "doctorEmail")}
                      onBlur={() => handleBlur("doctorEmail")}
                      className={`mt-2 h-12 text-lg ${errors.doctorEmail ? "border-red-500" : ""}`}
                      placeholder="dr.martinez@clinica.com"
                    />
                    {errors.doctorEmail && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.doctorEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="doctorClinic" className="text-base font-medium">
                      Clínica / Hospital
                    </Label>
                    <Input
                      id="doctorClinic"
                      value={profile.primaryPhysician.clinicHospital}
                      onChange={(e) => handleFieldChange(["primaryPhysician", "clinicHospital"], e.target.value, "doctorClinic")}
                      onBlur={() => handleBlur("doctorClinic")}
                      className={`mt-2 h-12 text-lg ${errors.doctorClinic ? "border-red-500" : ""}`}
                      placeholder="Hospital General de México"
                    />
                    {errors.doctorClinic && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.doctorClinic}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Review */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Revisión de Información</h2>

              {/* Personal Information */}
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">Información Personal</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Nombre:</span> {profile.personalInfo.firstName} {profile.personalInfo.middleName} {profile.personalInfo.lastName}</p>
                  <p><span className="font-medium">Fecha de Nacimiento:</span> {profile.personalInfo.dateOfBirth || "No especificado"}</p>
                  <p><span className="font-medium">Nacionalidad:</span> {profile.personalInfo.nationality || "No especificado"}</p>
                  <p><span className="font-medium">Estado Civil:</span> {profile.personalInfo.maritalStatus || "No especificado"}</p>
                </div>
              </div>

              {/* Medical Information */}
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">Información Médica</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Tipo de Sangre:</span> {profile.bloodType || "No especificado"}</p>
                  <p><span className="font-medium">Acepta Transfusiones:</span> {profile.acceptsTransfusion ? "Sí" : "No"}</p>
                </div>
              </div>

              {/* Allergies */}
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">Alergias</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Medicamentos:</span> {profile.allergies.medication.hasAllergies ? profile.allergies.medication.details : "Ninguna"}</p>
                  <p><span className="font-medium">Alimentos:</span> {profile.allergies.food.hasAllergies ? profile.allergies.food.details : "Ninguna"}</p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">Contacto de Emergencia</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Nombre:</span> {profile.emergencyContacts.primary.fullName}</p>
                  <p><span className="font-medium">Teléfono:</span> {profile.emergencyContacts.primary.mobilePhone}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Revisa cuidadosamente toda la información antes de guardar.
                  Esta información será utilizada en emergencias médicas.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mb-8">
          {currentStep > 1 && currentStep <= 7 && (
            <Button
              onClick={handleBack}
              variant="outline"
              size="lg"
              className="flex-1 h-14 text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Atrás
            </Button>
          )}

          {currentStep < 6 && (
            <Button
              onClick={handleNext}
              size="lg"
              className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Siguiente
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}

          {currentStep === 6 && (
            <Button
              onClick={handleNext}
              size="lg"
              className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Revisar
              <Check className="w-5 h-5 ml-2" />
            </Button>
          )}

          {currentStep === 7 && (
            <Button
              onClick={handleSave}
              size="lg"
              className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700"
            >
              <Check className="w-5 h-5 mr-2" />
              Guardar Perfil Médico
            </Button>
          )}
        </div>

        {/* Optional ID Upload - Only shown in review step */}
        {currentStep === 7 && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Opcional: Agrega una foto de tu identificación
            </p>
            <Button
              onClick={handleSaveAndUploadId}
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg"
            >
              <IdCard className="w-5 h-5 mr-2" />
              Subir Identificación
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}