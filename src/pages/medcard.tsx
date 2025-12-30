import SEO from "@/components/SEO";
import { MedicalCard } from "@/components/MedicalCard";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MedicalCardPage() {
  const { t } = useLanguage();
  
  return (
    <>
      <SEO
        title={`${t("card.title")} - MedBridge`}
        description={t("card.emergencyInfo")}
      />
      <MedicalCard />
    </>
  );
}