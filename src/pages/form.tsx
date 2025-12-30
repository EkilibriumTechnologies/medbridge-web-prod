import SEO from "@/components/SEO";
import { MedicalForm } from "@/components/MedicalForm";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FormPage() {
  const { t } = useLanguage();
  
  return (
    <>
      <SEO
        title={`${t("form.title")} - MedBridge`}
        description={t("form.subtitle")}
      />
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>
      <MedicalForm />
    </>
  );
}