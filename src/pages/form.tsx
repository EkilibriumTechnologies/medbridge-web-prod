import SEO from "@/components/SEO";
import { MedicalForm } from "@/components/MedicalForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FormPage() {
  const { t } = useLanguage();
  
  return (
    <>
      <SEO
        title={`${t("form.title")} - MedBridge`}
        description={t("form.subtitle")}
      />
      <MedicalForm />
    </>
  );
}