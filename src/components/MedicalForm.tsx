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
import { useLanguage } from "@/contexts/LanguageContext";

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
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  if (!phone) return true;
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

const validateDate = (date: string): boolean => {
  if (!date) return true;
  const selectedDate = new Date(date);
  const today = new Date();
  const minDate = new Date("1900-01-01");
  return selectedDate <= today && selectedDate >= minDate;
};

const validateAge = (dateOfBirth: string): boolean => {
  if (!dateOfBirth) return true;
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
  const { t, isLoaded } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<MedicalProfile>(initialProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const STEPS = [
    { id: 1, title: t("form.personal.title"), icon: User },
    { id: 2, title: t("form.history.title").split(" ")[0], icon: Heart },
    { id: 3, title: t("card.allergies"), icon: AlertTriangle },
    { id: 4, title: t("form.history.title"), icon: FileText },
    { id: 5, title: t("form.emergency.title"), icon: Phone },
    { id: 6, title: t("form.insurance.primaryPhysician"), icon: Stethoscope },
  ];

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
    if (fieldName === "firstName") {
      if (!value.trim()) return t("validation.required");
      if (value.trim().length < 2) return t("validation.required");
      if (!validateTextLength(value, 50)) return t("validation.required");
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return t("validation.required");
    }

    if (fieldName === "middleName") {
      if (value && !validateTextLength(value, 50)) return t("validation.required");
      if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return t("validation.required");
    }

    if (fieldName === "lastName") {
      if (!value.trim()) return t("validation.required");
      if (value.trim().length < 2) return t("validation.required");
      if (!validateTextLength(value, 50)) return t("validation.required");
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return t("validation.required");
    }

    if (fieldName === "dateOfBirth") {
      if (value && !validateDate(value)) return t("validation.invalidDate");
      if (value && !validateAge(value)) return t("validation.invalidDate");
    }

    if (fieldName === "nationality" || fieldName === "passportNumber") {
      if (value && !validateTextLength(value, 50)) return t("validation.required");
    }

    if (fieldName === "permanentAddress") {
      if (value && !validateTextLength(value, 200)) return t("validation.required");
    }

    if (fieldName === "medicationDetails" || fieldName === "foodDetails") {
      if (value && !validateTextLength(value, 500)) return t("validation.required");
    }

    if (fieldName === "previousDiagnoses" || fieldName === "currentDiagnoses" || 
        fieldName === "currentMedications" || fieldName === "previousSurgeries") {
      if (value && !validateTextLength(value, 1000)) return t("validation.required");
    }

    if (fieldName === "primaryName") {
      if (!value.trim()) return t("validation.required");
      if (value.trim().length < 2) return t("validation.required");
      if (!validateTextLength(value, 100)) return t("validation.required");
    }

    if (fieldName === "primaryPhone") {
      if (!value.trim()) return t("validation.required");
      if (!validatePhone(value)) return t("validation.invalidPhone");
    }

    if (fieldName === "primaryOfficePhone" || fieldName === "secondaryPhone" || 
        fieldName === "secondaryOfficePhone" || fieldName === "doctorPhone") {
      if (value && !validatePhone(value)) return t("validation.invalidPhone");
    }

    if (fieldName === "primaryEmail" || fieldName === "secondaryEmail" || fieldName === "doctorEmail") {
      if (value && !validateEmail(value)) return t("validation.invalidEmail");
    }

    if (fieldName === "secondaryName" || fieldName === "doctorName" || fieldName === "doctorClinic") {
      if (value && !validateTextLength(value, 200)) return t("validation.required");
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
    }

    if (step === 3) {
      const medicationError = validateField("medicationDetails", profile.allergies.medication.details);
      if (medicationError) newErrors.medicationDetails = medicationError;

      const foodError = validateField("foodDetails", profile.allergies.food.details);
      if (foodError) newErrors.foodDetails = foodError;
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
    router.push("/medcard");
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

  // Prevent hydration mismatch by waiting for client-side load
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-6 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {currentStep <= 6 ? `${t("form.step")} ${currentStep} ${t("form.of")} 6` : t("form.review.title")}
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
                  {t("form.personal.fullName")} *
                </Label>
                <Input
                  id="firstName"
                  value={profile.personalInfo.firstName}
                  onChange={(e) => handleFieldChange(["personalInfo", "firstName"], e.target.value, "firstName")}
                  onBlur={() => handleBlur("firstName")}
                  className={`mt-2 h-12 text-lg ${errors.firstName ? "border-red-500" : ""}`}
                  placeholder={t("form.personal.fullNamePlaceholder")}
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
                  {t("common.optional")}
                </Label>
                <Input
                  id="middleName"
                  value={profile.personalInfo.middleName}
                  onChange={(e) => handleFieldChange(["personalInfo", "middleName"], e.target.value, "middleName")}
                  onBlur={() => handleBlur("middleName")}
                  className={`mt-2 h-12 text-lg ${errors.middleName ? "border-red-500" : ""}`}
                  placeholder={t("form.personal.fullNamePlaceholder")}
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
                  {t("form.personal.fullName")} *
                </Label>
                <Input
                  id="lastName"
                  value={profile.personalInfo.lastName}
                  onChange={(e) => handleFieldChange(["personalInfo", "lastName"], e.target.value, "lastName")}
                  onBlur={() => handleBlur("lastName")}
                  className={`mt-2 h-12 text-lg ${errors.lastName ? "border-red-500" : ""}`}
                  placeholder={t("form.personal.fullNamePlaceholder")}
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
                  {t("form.personal.dateOfBirth")}
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
                  {t("form.personal.fullName")}
                </Label>
                <Input
                  id="nationality"
                  value={profile.personalInfo.nationality}
                  onChange={(e) => handleFieldChange(["personalInfo", "nationality"], e.target.value, "nationality")}
                  onBlur={() => handleBlur("nationality")}
                  className={`mt-2 h-12 text-lg ${errors.nationality ? "border-red-500" : ""}`}
                  placeholder={t("form.personal.fullNamePlaceholder")}
                />
              </div>

              <div>
                <Label htmlFor="maritalStatus" className="text-lg font-medium">
                  {t("form.personal.gender")}
                </Label>
                <Select
                  value={profile.personalInfo.maritalStatus}
                  onValueChange={(value) => updateProfile(["personalInfo", "maritalStatus"], value)}
                >
                  <SelectTrigger className="mt-2 h-12 text-lg">
                    <SelectValue placeholder={t("form.personal.genderPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">{t("common.optional")}</SelectItem>
                    <SelectItem value="Married">{t("common.optional")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="passportNumber" className="text-lg font-medium">
                  {t("form.personal.fullName")}
                </Label>
                <Input
                  id="passportNumber"
                  value={profile.personalInfo.passportNumber}
                  onChange={(e) => handleFieldChange(["personalInfo", "passportNumber"], e.target.value, "passportNumber")}
                  className="mt-2 h-12 text-lg"
                  placeholder="A12345678"
                />
              </div>

              <div>
                <Label htmlFor="permanentAddress" className="text-lg font-medium">
                  {t("form.personal.fullName")}
                </Label>
                <Textarea
                  id="permanentAddress"
                  value={profile.personalInfo.permanentAddress}
                  onChange={(e) => handleFieldChange(["personalInfo", "permanentAddress"], e.target.value, "permanentAddress")}
                  className="mt-2 text-lg min-h-24"
                  placeholder={t("form.personal.fullNamePlaceholder")}
                />
              </div>
            </div>
          )}

          {/* Step 2: Basic Medical Information */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <Label htmlFor="bloodType" className="text-lg font-medium">
                  {t("form.personal.bloodType")}
                </Label>
                <Select
                  value={profile.bloodType}
                  onValueChange={(value) => updateProfile(["bloodType"], value)}
                >
                  <SelectTrigger className="mt-2 h-12 text-lg">
                    <SelectValue placeholder={t("form.personal.bloodTypePlaceholder")} />
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
                      {t("form.additional.advanceDirectives")}
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t("form.review.subtitle")}
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
                    {profile.acceptsTransfusion ? t("common.yes") : t("common.no")}
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
                    {t("card.allergies")}
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-lg font-medium">
                        {t("form.history.allergies")}
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
                          placeholder={t("form.history.allergiesPlaceholder")}
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

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-lg font-medium">
                        {t("form.history.allergies")}
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
                          placeholder={t("form.history.allergiesPlaceholder")}
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
                  {t("form.history.chronicConditions")}
                </Label>
                <Textarea
                  id="previousDiagnoses"
                  value={profile.medicalHistory.previousDiagnoses}
                  onChange={(e) => handleFieldChange(["medicalHistory", "previousDiagnoses"], e.target.value, "previousDiagnoses")}
                  className="mt-2 text-lg min-h-24"
                  placeholder={t("form.history.chronicConditionsPlaceholder")}
                />
              </div>

              <div>
                <Label htmlFor="currentDiagnoses" className="text-lg font-medium">
                  {t("form.history.chronicConditions")}
                </Label>
                <Textarea
                  id="currentDiagnoses"
                  value={profile.medicalHistory.currentDiagnoses}
                  onChange={(e) => handleFieldChange(["medicalHistory", "currentDiagnoses"], e.target.value, "currentDiagnoses")}
                  className="mt-2 text-lg min-h-24"
                  placeholder={t("form.history.chronicConditionsPlaceholder")}
                />
              </div>

              <div>
                <Label htmlFor="currentMedications" className="text-lg font-medium">
                  {t("form.history.currentMedications")}
                </Label>
                <Textarea
                  id="currentMedications"
                  value={profile.medicalHistory.currentMedications}
                  onChange={(e) => handleFieldChange(["medicalHistory", "currentMedications"], e.target.value, "currentMedications")}
                  className="mt-2 text-lg min-h-24"
                  placeholder={t("form.history.currentMedicationsPlaceholder")}
                />
              </div>

              <div>
                <Label htmlFor="previousSurgeries" className="text-lg font-medium">
                  {t("form.history.previousSurgeries")}
                </Label>
                <Textarea
                  id="previousSurgeries"
                  value={profile.medicalHistory.previousSurgeries}
                  onChange={(e) => handleFieldChange(["medicalHistory", "previousSurgeries"], e.target.value, "previousSurgeries")}
                  className="mt-2 text-lg min-h-24"
                  placeholder={t("form.history.previousSurgeriesPlaceholder")}
                />
              </div>

              <div className="space-y-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">
                      {t("common.optional")}
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
                      placeholder={t("form.history.previousSurgeriesPlaceholder")}
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">
                      {t("common.optional")}
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
                      placeholder={t("form.history.previousSurgeriesPlaceholder")}
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">
                      {t("common.optional")}
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
                      placeholder={t("form.history.previousSurgeriesPlaceholder")}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Emergency Contacts */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t("form.emergency.title")} *
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primaryName" className="text-base font-medium">
                      {t("form.emergency.name")} *
                    </Label>
                    <Input
                      id="primaryName"
                      value={profile.emergencyContacts.primary.fullName}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "primary", "fullName"], e.target.value, "primaryName")}
                      onBlur={() => handleBlur("primaryName")}
                      className={`mt-2 h-12 text-lg ${errors.primaryName ? "border-red-500" : ""}`}
                      placeholder={t("form.emergency.namePlaceholder")}
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
                      {t("form.emergency.phone")} *
                    </Label>
                    <Input
                      id="primaryMobile"
                      type="tel"
                      value={profile.emergencyContacts.primary.mobilePhone}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "primary", "mobilePhone"], e.target.value, "primaryPhone")}
                      onBlur={() => handleBlur("primaryPhone")}
                      className={`mt-2 h-12 text-lg ${errors.primaryPhone ? "border-red-500" : ""}`}
                      placeholder={t("form.emergency.phonePlaceholder")}
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
                      {t("form.emergency.phone")}
                    </Label>
                    <Input
                      id="primaryOffice"
                      type="tel"
                      value={profile.emergencyContacts.primary.officePhone}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "primary", "officePhone"], e.target.value, "primaryOfficePhone")}
                      onBlur={() => handleBlur("primaryOfficePhone")}
                      className={`mt-2 h-12 text-lg ${errors.primaryOfficePhone ? "border-red-500" : ""}`}
                      placeholder={t("form.emergency.phonePlaceholder")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="primaryEmail" className="text-base font-medium">
                      {t("form.emergency.email")}
                    </Label>
                    <Input
                      id="primaryEmail"
                      type="email"
                      value={profile.emergencyContacts.primary.email}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "primary", "email"], e.target.value, "primaryEmail")}
                      onBlur={() => handleBlur("primaryEmail")}
                      className={`mt-2 h-12 text-lg ${errors.primaryEmail ? "border-red-500" : ""}`}
                      placeholder={t("form.emergency.emailPlaceholder")}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t("common.optional")}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="secondaryName" className="text-base font-medium">
                      {t("form.emergency.name")}
                    </Label>
                    <Input
                      id="secondaryName"
                      value={profile.emergencyContacts.secondary.fullName}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "secondary", "fullName"], e.target.value, "secondaryName")}
                      className="mt-2 h-12 text-lg"
                      placeholder={t("form.emergency.namePlaceholder")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="secondaryMobile" className="text-base font-medium">
                      {t("form.emergency.phone")}
                    </Label>
                    <Input
                      id="secondaryMobile"
                      type="tel"
                      value={profile.emergencyContacts.secondary.mobilePhone}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "secondary", "mobilePhone"], e.target.value, "secondaryPhone")}
                      className="mt-2 h-12 text-lg"
                      placeholder={t("form.emergency.phonePlaceholder")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="secondaryOffice" className="text-base font-medium">
                      {t("form.emergency.phone")}
                    </Label>
                    <Input
                      id="secondaryOffice"
                      type="tel"
                      value={profile.emergencyContacts.secondary.officePhone}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "secondary", "officePhone"], e.target.value, "secondaryOfficePhone")}
                      className="mt-2 h-12 text-lg"
                      placeholder={t("form.emergency.phonePlaceholder")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="secondaryEmail" className="text-base font-medium">
                      {t("form.emergency.email")}
                    </Label>
                    <Input
                      id="secondaryEmail"
                      type="email"
                      value={profile.emergencyContacts.secondary.email}
                      onChange={(e) => handleFieldChange(["emergencyContacts", "secondary", "email"], e.target.value, "secondaryEmail")}
                      className="mt-2 h-12 text-lg"
                      placeholder={t("form.emergency.emailPlaceholder")}
                    />
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
                  {t("form.insurance.primaryPhysician")}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="doctorName" className="text-base font-medium">
                      {t("form.insurance.primaryPhysician")}
                    </Label>
                    <Input
                      id="doctorName"
                      value={profile.primaryPhysician.fullName}
                      onChange={(e) => handleFieldChange(["primaryPhysician", "fullName"], e.target.value, "doctorName")}
                      className="mt-2 h-12 text-lg"
                      placeholder={t("form.insurance.primaryPhysicianPlaceholder")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctorPhone" className="text-base font-medium">
                      {t("form.emergency.phone")}
                    </Label>
                    <Input
                      id="doctorPhone"
                      type="tel"
                      value={profile.primaryPhysician.phone}
                      onChange={(e) => handleFieldChange(["primaryPhysician", "phone"], e.target.value, "doctorPhone")}
                      className="mt-2 h-12 text-lg"
                      placeholder={t("form.insurance.physicianPhonePlaceholder")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctorEmail" className="text-base font-medium">
                      {t("form.emergency.email")}
                    </Label>
                    <Input
                      id="doctorEmail"
                      type="email"
                      value={profile.primaryPhysician.email}
                      onChange={(e) => handleFieldChange(["primaryPhysician", "email"], e.target.value, "doctorEmail")}
                      className="mt-2 h-12 text-lg"
                      placeholder={t("form.emergency.emailPlaceholder")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctorClinic" className="text-base font-medium">
                      {t("common.optional")}
                    </Label>
                    <Input
                      id="doctorClinic"
                      value={profile.primaryPhysician.clinicHospital}
                      onChange={(e) => handleFieldChange(["primaryPhysician", "clinicHospital"], e.target.value, "doctorClinic")}
                      className="mt-2 h-12 text-lg"
                      placeholder={t("form.personal.fullNamePlaceholder")}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Review */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">{t("form.review.title")}</h2>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">{t("form.review.personalInfo")}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">{t("card.name")}:</span> {profile.personalInfo.firstName} {profile.personalInfo.middleName} {profile.personalInfo.lastName}</p>
                  <p><span className="font-medium">{t("card.dob")}:</span> {profile.personalInfo.dateOfBirth || t("common.unknown")}</p>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">{t("form.review.medicalHistory")}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">{t("card.bloodType")}:</span> {profile.bloodType || t("common.unknown")}</p>
                  <p><span className="font-medium">{t("form.additional.advanceDirectives")}:</span> {profile.acceptsTransfusion ? t("common.yes") : t("common.no")}</p>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">{t("card.allergies")}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">{t("form.history.currentMedications")}:</span> {profile.allergies.medication.hasAllergies ? profile.allergies.medication.details : t("card.none")}</p>
                  <p><span className="font-medium">{t("common.optional")}:</span> {profile.allergies.food.hasAllergies ? profile.allergies.food.details : t("card.none")}</p>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">{t("form.review.emergencyContact")}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">{t("card.name")}:</span> {profile.emergencyContacts.primary.fullName}</p>
                  <p><span className="font-medium">{t("card.phone")}:</span> {profile.emergencyContacts.primary.mobilePhone}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("form.review.subtitle")}
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
              {t("common.back")}
            </Button>
          )}

          {currentStep < 6 && (
            <Button
              onClick={handleNext}
              size="lg"
              className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {t("common.next")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}

          {currentStep === 6 && (
            <Button
              onClick={handleNext}
              size="lg"
              className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {t("form.review.title")}
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
              {t("form.review.submit")}
            </Button>
          )}
        </div>

        {/* Optional ID Upload */}
        {currentStep === 7 && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {t("form.review.uploadIdOptional")}
            </p>
            <Button
              onClick={handleSaveAndUploadId}
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg"
            >
              <IdCard className="w-5 h-5 mr-2" />
              {t("form.review.uploadId")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}