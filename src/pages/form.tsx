import SEO from "@/components/SEO";
import { MedicalForm } from "@/components/MedicalForm";

export default function FormPage() {
  return (
    <>
      <SEO
        title="Medical Form - MedBridge"
        description="Complete your medical profile for emergency situations"
      />
      <MedicalForm />
    </>
  );
}