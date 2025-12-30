import SEO from "@/components/SEO";
import { MedicalCard } from "@/components/MedicalCard";

export default function Home() {
  return (
    <>
      <SEO
        title="Medical Emergency Card - MedBridge"
        description="Access medical information for emergency situations"
      />
      <MedicalCard />
    </>
  );
}