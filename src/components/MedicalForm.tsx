import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, ArrowRight, Check, User, Heart, Phone, FileText, Shield, Stethoscope, ClipboardList } from "lucide-react";
import { MedicalProfile } from "@/types/medical";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";

const initialProfile: MedicalProfile = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  bloodType: "",
  phoneNumber: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  idPhoto: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  emergencyContactEmail: "",
  medicalConditions: "",
  allergies: "",
  currentMedications: "",
  pastSurgeries: "",
  chronicIllnesses: "",
  disabilities: "",
  insuranceProvider: "",
  policyNumber: "",
  groupNumber: "",
  insurancePhone: "",
  primaryPhysicianName: "",
  primaryPhysicianPhone: "",
  primaryPhysicianClinic: "",
  specialInstructions: "",
  additionalNotes: "",
  consentToTreatment: true,
  shareMedicalInfo: true,
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

export function MedicalForm() {
  const router = useRouter();
  const { t, isLoaded } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<MedicalProfile>(initialProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const STEPS = [
    { id: 1, title: t("form.steps.personalInfo"), icon: User },
    { id: 2, title: t("form.steps.emergencyContact"), icon: Phone },
    { id: 3, title: t("form.steps.medicalInfo"), icon: Heart },
    { id: 4, title: t("form.steps.insurance"), icon: Shield },
    { id: 5, title: t("form.steps.primaryPhysician"), icon: Stethoscope },
    { id: 6, title: t("form.steps.notesConsent"), icon: ClipboardList },
    { id: 7, title: t("form.steps.finalReview"), icon: FileText },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("medicalProfile");
    if (saved) {
      try {
        const savedProfile = JSON.parse(saved);
        setProfile({ ...initialProfile, ...savedProfile });
      } catch (error) {
        console.error("Error loading medical profile:", error);
      }
    }
  }, []);

  const validateField = (fieldName: string, value: string): string => {
    if (fieldName === "firstName" || fieldName === "lastName") {
      if (!value.trim()) return t("form.validation.required");
      if (value.trim().length < 2) return t("form.validation.minLength").replace("{min}", "2");
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return t("form.validation.lettersOnly");
    }

    if (fieldName === "email" || fieldName === "emergencyContactEmail") {
      if (fieldName === "email" && !value.trim()) return t("form.validation.required");
      if (value && !validateEmail(value)) return t("form.validation.invalidEmail");
    }

    if (fieldName === "phoneNumber" || fieldName === "emergencyContactPhone" || fieldName === "insurancePhone" || fieldName === "primaryPhysicianPhone") {
      if ((fieldName === "phoneNumber" || fieldName === "emergencyContactPhone") && !value.trim()) return t("form.validation.required");
      if (value && !validatePhone(value)) return t("form.validation.invalidPhone");
    }

    if (fieldName === "dateOfBirth") {
      if (value && !validateDate(value)) return t("form.validation.invalidDate");
    }

    if (fieldName === "emergencyContactName") {
      if (!value.trim()) return t("form.validation.required");
    }

    return "";
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      ["firstName", "lastName", "email", "phoneNumber"].forEach(field => {
        const error = validateField(field, profile[field as keyof MedicalProfile] as string);
        if (error) newErrors[field] = error;
      });
    }

    if (step === 2) {
      ["emergencyContactName", "emergencyContactPhone"].forEach(field => {
        const error = validateField(field, profile[field as keyof MedicalProfile] as string);
        if (error) newErrors[field] = error;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
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

  const updateProfile = (field: keyof MedicalProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true });
  };

  const handleFieldChange = (field: keyof MedicalProfile, value: any) => {
    updateProfile(field, value);
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const CurrentStepIcon = STEPS[currentStep - 1]?.icon || User;

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
              {currentStep <= 7 ? `${t("form.step")} ${currentStep} ${t("form.of")} 7` : t("form.steps.finalReview")}
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round((currentStep / 7) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Title */}
        {currentStep <= 7 && (
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
                  {t("form.fields.firstName")} *
                </Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => handleFieldChange("firstName", e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  className={`mt-2 h-12 text-lg ${errors.firstName ? "border-red-500" : ""}`}
                  placeholder={t("form.placeholders.firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-lg font-medium">
                  {t("form.fields.lastName")} *
                </Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => handleFieldChange("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  className={`mt-2 h-12 text-lg ${errors.lastName ? "border-red-500" : ""}`}
                  placeholder={t("form.placeholders.lastName")}
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
                  {t("form.fields.dateOfBirth")}
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
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
                <Label htmlFor="gender" className="text-lg font-medium">
                  {t("form.fields.gender")}
                </Label>
                <Select
                  value={profile.gender}
                  onValueChange={(value) => updateProfile("gender", value)}
                >
                  <SelectTrigger className="mt-2 h-12 text-lg">
                    <SelectValue placeholder={t("form.placeholders.selectGender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={t("form.genders.male")}>{t("form.genders.male")}</SelectItem>
                    <SelectItem value={t("form.genders.female")}>{t("form.genders.female")}</SelectItem>
                    <SelectItem value={t("form.genders.other")}>{t("form.genders.other")}</SelectItem>
                    <SelectItem value={t("form.genders.preferNotToSay")}>{t("form.genders.preferNotToSay")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bloodType" className="text-lg font-medium">
                  {t("form.fields.bloodType")}
                </Label>
                <Select
                  value={profile.bloodType}
                  onValueChange={(value) => updateProfile("bloodType", value)}
                >
                  <SelectTrigger className="mt-2 h-12 text-lg">
                    <SelectValue placeholder={t("form.placeholders.selectBloodType")} />
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

              <div>
                <Label htmlFor="phoneNumber" className="text-lg font-medium">
                  {t("form.fields.phoneNumber")} *
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
                  onBlur={() => handleBlur("phoneNumber")}
                  className={`mt-2 h-12 text-lg ${errors.phoneNumber ? "border-red-500" : ""}`}
                  placeholder={t("form.placeholders.phone")}
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-lg font-medium">
                  {t("form.fields.email")} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`mt-2 h-12 text-lg ${errors.email ? "border-red-500" : ""}`}
                  placeholder={t("form.placeholders.email")}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address" className="text-lg font-medium">
                  {t("form.fields.address")}
                </Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => updateProfile("address", e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder={t("form.placeholders.address")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-lg font-medium">
                    {t("form.fields.city")}
                  </Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => updateProfile("city", e.target.value)}
                    className="mt-2 h-12 text-lg"
                    placeholder={t("form.placeholders.city")}
                  />
                </div>

                <div>
                  <Label htmlFor="state" className="text-lg font-medium">
                    {t("form.fields.state")}
                  </Label>
                  <Input
                    id="state"
                    value={profile.state}
                    onChange={(e) => updateProfile("state", e.target.value)}
                    className="mt-2 h-12 text-lg"
                    placeholder={t("form.placeholders.state")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode" className="text-lg font-medium">
                    {t("form.fields.zipCode")}
                  </Label>
                  <Input
                    id="zipCode"
                    value={profile.zipCode}
                    onChange={(e) => updateProfile("zipCode", e.target.value)}
                    className="mt-2 h-12 text-lg"
                    placeholder={t("form.placeholders.zipCode")}
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="text-lg font-medium">
                    {t("form.fields.country")}
                  </Label>
                  <Input
                    id="country"
                    value={profile.country}
                    onChange={(e) => updateProfile("country", e.target.value)}
                    className="mt-2 h-12 text-lg"
                    placeholder={t("form.placeholders.country")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Emergency Contact */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 p-6 rounded-lg space-y-6">
                <div>
                  <Label htmlFor="emergencyContactName" className="text-lg font-medium">
                    {t("form.fields.emergencyContactName")} *
                  </Label>
                  <Input
                    id="emergencyContactName"
                    value={profile.emergencyContactName}
                    onChange={(e) => handleFieldChange("emergencyContactName", e.target.value)}
                    onBlur={() => handleBlur("emergencyContactName")}
                    className={`mt-2 h-12 text-lg ${errors.emergencyContactName ? "border-red-500" : ""}`}
                    placeholder={t("form.placeholders.fullName")}
                  />
                  {errors.emergencyContactName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.emergencyContactName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContactRelationship" className="text-lg font-medium">
                    {t("form.fields.emergencyContactRelationship")}
                  </Label>
                  <Select
                    value={profile.emergencyContactRelationship}
                    onValueChange={(value) => updateProfile("emergencyContactRelationship", value)}
                  >
                    <SelectTrigger className="mt-2 h-12 text-lg">
                      <SelectValue placeholder={t("form.placeholders.selectRelationship")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={t("form.relationships.spouse")}>{t("form.relationships.spouse")}</SelectItem>
                      <SelectItem value={t("form.relationships.parent")}>{t("form.relationships.parent")}</SelectItem>
                      <SelectItem value={t("form.relationships.child")}>{t("form.relationships.child")}</SelectItem>
                      <SelectItem value={t("form.relationships.sibling")}>{t("form.relationships.sibling")}</SelectItem>
                      <SelectItem value={t("form.relationships.friend")}>{t("form.relationships.friend")}</SelectItem>
                      <SelectItem value={t("form.relationships.other")}>{t("form.relationships.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="emergencyContactPhone" className="text-lg font-medium">
                    {t("form.fields.emergencyContactPhone")} *
                  </Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    value={profile.emergencyContactPhone}
                    onChange={(e) => handleFieldChange("emergencyContactPhone", e.target.value)}
                    onBlur={() => handleBlur("emergencyContactPhone")}
                    className={`mt-2 h-12 text-lg ${errors.emergencyContactPhone ? "border-red-500" : ""}`}
                    placeholder={t("form.placeholders.phone")}
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.emergencyContactPhone}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContactEmail" className="text-lg font-medium">
                    {t("form.fields.emergencyContactEmail")}
                  </Label>
                  <Input
                    id="emergencyContactEmail"
                    type="email"
                    value={profile.emergencyContactEmail}
                    onChange={(e) => handleFieldChange("emergencyContactEmail", e.target.value)}
                    className="mt-2 h-12 text-lg"
                    placeholder={t("form.placeholders.email")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Medical Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="medicalConditions" className="text-lg font-medium">
                  {t("form.fields.medicalConditions")}
                </Label>
                <Textarea
                  id="medicalConditions"
                  value={profile.medicalConditions}
                  onChange={(e) => updateProfile("medicalConditions", e.target.value)}
                  className="mt-2 text-lg min-h-24"
                  placeholder={t("form.placeholders.medicalConditions")}
                />
              </div>

              <div>
                <Label htmlFor="allergies" className="text-lg font-medium">
                  {t("form.fields.allergies")}
                </Label>
                <Textarea
                  id="allergies"
                  value={profile.allergies}
                  onChange={(e) => updateProfile("allergies", e.target.value)}
                  className="mt-2 text-lg min-h-24"
                  placeholder={t("form.placeholders.allergies")}
                />
              </div>

              <div>
                <Label htmlFor="currentMedications" className="text-lg font-medium">
                  {t("form.fields.currentMedications")}
                </Label>
                <Textarea
                  id="currentMedications"
                  value={profile.currentMedications}
                  onChange={(e) => updateProfile("currentMedications", e.target.value)}
                  className="mt-2 text-lg min-h-24"
                  placeholder={t("form.placeholders.currentMedications")}
                />
              </div>

              <div>
                <Label htmlFor="pastSurgeries" className="text-lg font-medium">
                  {t("form.fields.pastSurgeries")}
                </Label>
                <Textarea
                  id="pastSurgeries"
                  value={profile.pastSurgeries}
                  onChange={(e) => updateProfile("pastSurgeries", e.target.value)}
                  className="mt-2 text-lg min-h-24"
                  placeholder={t("form.placeholders.pastSurgeries")}
                />
              </div>

              <div>
                <Label htmlFor="chronicIllnesses" className="text-lg font-medium">
                  {t("form.fields.chronicIllnesses")}
                </Label>
                <Textarea
                  id="chronicIllnesses"
                  value={profile.chronicIllnesses}
                  onChange={(e) => updateProfile("chronicIllnesses", e.target.value)}
                  className="mt-2 text-lg min-h-24"
                  placeholder={t("form.placeholders.chronicIllnesses")}
                />
              </div>

              <div>
                <Label htmlFor="disabilities" className="text-lg font-medium">
                  {t("form.fields.disabilities")}
                </Label>
                <Textarea
                  id="disabilities"
                  value={profile.disabilities}
                  onChange={(e) => updateProfile("disabilities", e.target.value)}
                  className="mt-2 text-lg min-h-24"
                  placeholder={t("form.placeholders.disabilities")}
                />
              </div>
            </div>
          )}

          {/* Step 4: Medical Insurance */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="insuranceProvider" className="text-lg font-medium">
                  {t("form.fields.insuranceProvider")}
                </Label>
                <Input
                  id="insuranceProvider"
                  value={profile.insuranceProvider}
                  onChange={(e) => updateProfile("insuranceProvider", e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder={t("form.placeholders.insuranceProvider")}
                />
              </div>

              <div>
                <Label htmlFor="policyNumber" className="text-lg font-medium">
                  {t("form.fields.policyNumber")}
                </Label>
                <Input
                  id="policyNumber"
                  value={profile.policyNumber}
                  onChange={(e) => updateProfile("policyNumber", e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder={t("form.placeholders.policyNumber")}
                />
              </div>

              <div>
                <Label htmlFor="groupNumber" className="text-lg font-medium">
                  {t("form.fields.groupNumber")}
                </Label>
                <Input
                  id="groupNumber"
                  value={profile.groupNumber}
                  onChange={(e) => updateProfile("groupNumber", e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder={t("form.placeholders.groupNumber")}
                />
              </div>

              <div>
                <Label htmlFor="insurancePhone" className="text-lg font-medium">
                  {t("form.fields.insurancePhone")}
                </Label>
                <Input
                  id="insurancePhone"
                  type="tel"
                  value={profile.insurancePhone}
                  onChange={(e) => updateProfile("insurancePhone", e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder={t("form.placeholders.phone")}
                />
              </div>
            </div>
          )}

          {/* Step 5: Primary Physician */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="primaryPhysicianName" className="text-lg font-medium">
                  {t("form.fields.primaryPhysicianName")}
                </Label>
                <Input
                  id="primaryPhysicianName"
                  value={profile.primaryPhysicianName}
                  onChange={(e) => updateProfile("primaryPhysicianName", e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder={t("form.placeholders.doctorName")}
                />
              </div>

              <div>
                <Label htmlFor="primaryPhysicianPhone" className="text-lg font-medium">
                  {t("form.fields.primaryPhysicianPhone")}
                </Label>
                <Input
                  id="primaryPhysicianPhone"
                  type="tel"
                  value={profile.primaryPhysicianPhone}
                  onChange={(e) => updateProfile("primaryPhysicianPhone", e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder={t("form.placeholders.phone")}
                />
              </div>

              <div>
                <Label htmlFor="primaryPhysicianClinic" className="text-lg font-medium">
                  {t("form.fields.primaryPhysicianClinic")}
                </Label>
                <Input
                  id="primaryPhysicianClinic"
                  value={profile.primaryPhysicianClinic}
                  onChange={(e) => updateProfile("primaryPhysicianClinic", e.target.value)}
                  className="mt-2 h-12 text-lg"
                  placeholder={t("form.placeholders.clinicName")}
                />
              </div>
            </div>
          )}

          {/* Step 6: Notes and Consent */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="specialInstructions" className="text-lg font-medium">
                  {t("form.fields.specialInstructions")}
                </Label>
                <Textarea
                  id="specialInstructions"
                  value={profile.specialInstructions}
                  onChange={(e) => updateProfile("specialInstructions", e.target.value)}
                  className="mt-2 text-lg min-h-32"
                  placeholder={t("form.placeholders.specialInstructions")}
                />
              </div>

              <div>
                <Label htmlFor="additionalNotes" className="text-lg font-medium">
                  {t("form.fields.additionalNotes")}
                </Label>
                <Textarea
                  id="additionalNotes"
                  value={profile.additionalNotes}
                  onChange={(e) => updateProfile("additionalNotes", e.target.value)}
                  className="mt-2 text-lg min-h-32"
                  placeholder={t("form.placeholders.additionalNotes")}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-6">
                <h3 className="text-xl font-bold mb-4">{t("form.consent.title")}</h3>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label className="text-base font-medium">
                      {t("form.consent.treatment")}
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t("form.consent.treatmentDesc")}
                    </p>
                  </div>
                  <Switch
                    checked={profile.consentToTreatment}
                    onCheckedChange={(checked) => updateProfile("consentToTreatment", checked)}
                    className="scale-125"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label className="text-base font-medium">
                      {t("form.consent.shareInfo")}
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t("form.consent.shareInfoDesc")}
                    </p>
                  </div>
                  <Switch
                    checked={profile.shareMedicalInfo}
                    onCheckedChange={(checked) => updateProfile("shareMedicalInfo", checked)}
                    className="scale-125"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Final Review */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">{t("form.review.title")}</h2>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">{t("form.review.personalInfoSection")}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">{t("form.fields.firstName")}:</span> {profile.firstName} {profile.lastName}</p>
                  <p><span className="font-medium">{t("form.fields.dateOfBirth")}:</span> {profile.dateOfBirth || t("card.notSpecified")}</p>
                  <p><span className="font-medium">{t("form.fields.gender")}:</span> {profile.gender || t("card.notSpecified")}</p>
                  <p><span className="font-medium">{t("form.fields.bloodType")}:</span> {profile.bloodType || t("card.notSpecified")}</p>
                  <p><span className="font-medium">{t("form.fields.phoneNumber")}:</span> {profile.phoneNumber}</p>
                  <p><span className="font-medium">{t("form.fields.email")}:</span> {profile.email}</p>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">{t("form.review.emergencyContactSection")}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">{t("form.fields.emergencyContactName")}:</span> {profile.emergencyContactName}</p>
                  <p><span className="font-medium">{t("form.fields.emergencyContactRelationship")}:</span> {profile.emergencyContactRelationship || t("card.notSpecified")}</p>
                  <p><span className="font-medium">{t("form.fields.emergencyContactPhone")}:</span> {profile.emergencyContactPhone}</p>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">{t("form.review.medicalInfoSection")}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">{t("form.fields.allergies")}:</span> {profile.allergies || t("card.none")}</p>
                  <p><span className="font-medium">{t("form.fields.currentMedications")}:</span> {profile.currentMedications || t("card.none")}</p>
                  <p><span className="font-medium">{t("form.fields.medicalConditions")}:</span> {profile.medicalConditions || t("card.none")}</p>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">{t("form.review.insuranceSection")}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">{t("form.fields.insuranceProvider")}:</span> {profile.insuranceProvider || t("card.notSpecified")}</p>
                  <p><span className="font-medium">{t("form.fields.primaryPhysicianName")}:</span> {profile.primaryPhysicianName || t("card.notSpecified")}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("form.review.note")}
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
              {t("form.buttons.back")}
            </Button>
          )}

          {currentStep < 7 && (
            <Button
              onClick={handleNext}
              size="lg"
              className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {t("form.buttons.next")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}

          {currentStep === 7 && (
            <Button
              onClick={handleSave}
              size="lg"
              className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700"
            >
              <Check className="w-5 h-5 mr-2" />
              {t("form.buttons.save")}
            </Button>
          )}
        </div>

        {/* Optional ID Upload */}
        {currentStep === 7 && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {t("form.buttons.addIdNote")}
            </p>
            <Button
              onClick={handleSaveAndUploadId}
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              {t("form.buttons.addId")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}