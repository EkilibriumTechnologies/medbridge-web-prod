import SEO from "@/components/SEO";
import { Identification } from "@/components/Identification";
import { useLanguage } from "@/contexts/LanguageContext";

export default function IdentificationPage() {
  const { t } = useLanguage();
  
  return (
    <>
      <SEO
        title={`${t("id.title")} - MedBridge`}
        description={t("id.uploadDocument")}
      />
      <Identification />
    </>
  );
}