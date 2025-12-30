import SEO from "@/components/SEO";
import { Identification } from "@/components/Identification";

export default function IdentificationPage() {
  return (
    <>
      <SEO
        title="Identificación - MedBridge"
        description="Sube tu documento de identificación para propósitos administrativos"
      />
      <Identification />
    </>
  );
}