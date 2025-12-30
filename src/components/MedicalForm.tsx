import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, ArrowRight, Check, User, Heart, AlertTriangle, FileText, Phone, Stethoscope } from "lucide-react";
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
  primaryDoctor: {
    fullName: "",
    phone: "",
    email: "",
    clinicHospital: "",
  },
};

export function MedicalForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<MedicalProfile>(initialProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem("medicalProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!profile.personalInfo.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!profile.personalInfo.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
    }

    if (step === 3) {
      if (profile.allergies.medication.hasAllergies && !profile.allergies.medication.details.trim()) {
        newErrors.medicationDetails = "Please provide medication allergy details";
      }
      if (profile.allergies.food.hasAllergies && !profile.allergies.food.details.trim()) {
        newErrors.foodDetails = "Please provide food allergy details";
      }
    }

    if (step === 5) {
      if (!profile.emergencyContacts.primary.fullName.trim()) {
        newErrors.primaryName = "Primary contact name is required";
      }
      if (!profile.emergencyContacts.primary.mobilePhone.trim()) {
        newErrors.primaryPhone = "Primary contact mobile phone is required";
      }
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
        setCurrentStep(7); // Review step
        window.scrollTo(0, 0);
      }
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
                  onChange={(e) => updateProfile(["personalInfo", "firstName"], e.target.value)}
                  className="mt-2 h-12 text-lg"
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
                  onChange={(e) => updateProfile(["personalInfo", "middleName"], e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder="Carlos"
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-lg font-medium">
                  Apellido *
                </Label>
                <Input
                  id="lastName"
                  value={profile.personalInfo.lastName}
                  onChange={(e) => updateProfile(["personalInfo", "lastName"], e.target.value)}
                  className="mt-2 h-12 text-lg"
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
                  onChange={(e) => updateProfile(["personalInfo", "dateOfBirth"], e.target.value)}
                  className="mt-2 h-12 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="nationality" className="text-lg font-medium">
                  Nacionalidad
                </Label>
                <Input
                  id="nationality"
                  value={profile.personalInfo.nationality}
                  onChange={(e) => updateProfile(["personalInfo", "nationality"], e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder="Mexicana"
                />
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
                  onChange={(e) => updateProfile(["personalInfo", "passportNumber"], e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder="A12345678"
                />
              </div>

              <div>
                <Label htmlFor="permanentAddress" className="text-lg font-medium">
                  Dirección Permanente
                </Label>
                <Textarea
                  id="permanentAddress"
                  value={profile.personalInfo.permanentAddress}
                  onChange={(e) => updateProfile(["personalInfo", "permanentAddress"], e.target.value)}
                  className="mt-2 text-lg min-h-24"
                  placeholder="Calle, número, colonia, ciudad, estado, código postal"
                />
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
                          onChange={(e) => updateProfile(["allergies", "medication", "details"], e.target.value)}
                          className="mt-2 text-lg min-h-24"
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
                          onChange={(e) => updateProfile(["allergies", "food", "details"], e.target.value)}
                          className="mt-2 text-lg min-h-24"
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
                  onChange={(e) => updateProfile(["medicalHistory", "previousDiagnoses"], e.target.value)}
                  className="mt-2 text-lg min-h-24"
                  placeholder="Enfermedades o condiciones diagnosticadas anteriormente..."
                />
              </div>

              <div>
                <Label htmlFor="currentDiagnoses" className="text-lg font-medium">
                  Diagnósticos Actuales
                </Label>
                <Textarea
                  id="currentDiagnoses"
                  value={profile.medicalHistory.currentDiagnoses}
                  onChange={(e) => updateProfile(["medicalHistory", "currentDiagnoses"], e.target.value)}
                  className="mt-2 text-lg min-h-24"
                  placeholder="Condiciones médicas que padeces actualmente..."
                />
              </div>

              <div>
                <Label htmlFor="currentMedications" className="text-lg font-medium">
                  Medicamentos Actuales
                </Label>
                <Textarea
                  id="currentMedications"
                  value={profile.medicalHistory.currentMedications}
                  onChange={(e) => updateProfile(["medicalHistory", "currentMedications"], e.target.value)}
                  className="mt-2 text-lg min-h-24"
                  placeholder="Lista todos los medicamentos que tomas regularmente..."
                />
              </div>

              <div>
                <Label htmlFor="previousSurgeries" className="text-lg font-medium">
                  Cirugías Previas
                </Label>
                <Textarea
                  id="previousSurgeries"
                  value={profile.medicalHistory.previousSurgeries}
                  onChange={(e) => updateProfile(["medicalHistory", "previousSurgeries"], e.target.value)}
                  className="mt-2 text-lg min-h-24"
                  placeholder="Lista cirugías que has tenido, con fechas si es posible..."
                />
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
                      onChange={(e) => updateProfile(["emergencyContacts", "primary", "fullName"], e.target.value)}
                      className="mt-2 h-12 text-lg"
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
                      onChange={(e) => updateProfile(["emergencyContacts", "primary", "mobilePhone"], e.target.value)}
                      className="mt-2 h-12 text-lg"
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
                      onChange={(e) => updateProfile(["emergencyContacts", "primary", "officePhone"], e.target.value)}
                      className="mt-2 h-12 text-lg"
                      placeholder="+52 55 8765 4321"
                    />
                  </div>

                  <div>
                    <Label htmlFor="primaryEmail" className="text-base font-medium">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="primaryEmail"
                      type="email"
                      value={profile.emergencyContacts.primary.email}
                      onChange={(e) => updateProfile(["emergencyContacts", "primary", "email"], e.target.value)}
                      className="mt-2 h-12 text-lg"
                      placeholder="maria@ejemplo.com"
                    />
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
                      onChange={(e) => updateProfile(["emergencyContacts", "secondary", "fullName"], e.target.value)}
                      className="mt-2 h-12 text-lg"
                      placeholder="Pedro López"
                    />
                  </div>

                  <div>
                    <Label htmlFor="secondaryMobile" className="text-base font-medium">
                      Teléfono Móvil
                    </Label>
                    <Input
                      id="secondaryMobile"
                      type="tel"
                      value={profile.emergencyContacts.secondary.mobilePhone}
                      onChange={(e) => updateProfile(["emergencyContacts", "secondary", "mobilePhone"], e.target.value)}
                      className="mt-2 h-12 text-lg"
                      placeholder="+52 55 9876 5432"
                    />
                  </div>

                  <div>
                    <Label htmlFor="secondaryOffice" className="text-base font-medium">
                      Teléfono de Oficina
                    </Label>
                    <Input
                      id="secondaryOffice"
                      type="tel"
                      value={profile.emergencyContacts.secondary.officePhone}
                      onChange={(e) => updateProfile(["emergencyContacts", "secondary", "officePhone"], e.target.value)}
                      className="mt-2 h-12 text-lg"
                      placeholder="+52 55 2345 6789"
                    />
                  </div>

                  <div>
                    <Label htmlFor="secondaryEmail" className="text-base font-medium">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="secondaryEmail"
                      type="email"
                      value={profile.emergencyContacts.secondary.email}
                      onChange={(e) => updateProfile(["emergencyContacts", "secondary", "email"], e.target.value)}
                      className="mt-2 h-12 text-lg"
                      placeholder="pedro@ejemplo.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Primary Doctor */}
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
                      value={profile.primaryDoctor.fullName}
                      onChange={(e) => updateProfile(["primaryDoctor", "fullName"], e.target.value)}
                      className="mt-2 h-12 text-lg"
                      placeholder="Dr. Roberto Martínez"
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctorPhone" className="text-base font-medium">
                      Teléfono
                    </Label>
                    <Input
                      id="doctorPhone"
                      type="tel"
                      value={profile.primaryDoctor.phone}
                      onChange={(e) => updateProfile(["primaryDoctor", "phone"], e.target.value)}
                      className="mt-2 h-12 text-lg"
                      placeholder="+52 55 3456 7890"
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctorEmail" className="text-base font-medium">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="doctorEmail"
                      type="email"
                      value={profile.primaryDoctor.email}
                      onChange={(e) => updateProfile(["primaryDoctor", "email"], e.target.value)}
                      className="mt-2 h-12 text-lg"
                      placeholder="dr.martinez@clinica.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctorClinic" className="text-base font-medium">
                      Clínica / Hospital
                    </Label>
                    <Input
                      id="doctorClinic"
                      value={profile.primaryDoctor.clinicHospital}
                      onChange={(e) => updateProfile(["primaryDoctor", "clinicHospital"], e.target.value)}
                      className="mt-2 h-12 text-lg"
                      placeholder="Hospital General de México"
                    />
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
      </div>
    </div>
  );
}