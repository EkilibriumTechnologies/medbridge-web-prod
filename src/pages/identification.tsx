import SEO from "@/components/SEO";
import { Identification } from "@/components/Identification";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function IdentificationPage() {
  const { t } = useLanguage();
  
  return (
    <>
      <SEO
        title={`${t("id.title")} - MedBridge`}
        description={t("id.uploadDocument")}
      />
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>
      <Identification />
    </>
  );
}