import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PrivacySection } from "@/components/PrivacySection";
import { AccessSection } from "@/components/AccessSection";
import { PaywallModal } from "@/components/PaywallModal";
import SEO from "@/components/SEO";

export default function Home() {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const learnMoreRef = useRef<HTMLDivElement>(null);

  const handleGetAccess = () => {
    setIsPaywallOpen(true);
  };

  const handleLearnMore = () => {
    learnMoreRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContinueDemo = () => {
    alert("Demo feature coming soon!");
  };

  return (
    <>
      <SEO 
        title="MedBridge - Your medical information, always available"
        description="Store your medical information safely on your phone. Works 100% offline. Designed for travelers and emergencies."
        image="/og-image.png"
      />
      
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <Hero 
          onGetAccess={handleGetAccess}
          onLearnMore={handleLearnMore}
        />
        
        <div ref={learnMoreRef}>
          <ProblemSection />
        </div>
        
        <SolutionSection />
        <FeaturesSection />
        <PrivacySection />
        <AccessSection 
          onUnlockAccess={handleGetAccess}
          onContinueDemo={handleContinueDemo}
        />
        
        <PaywallModal 
          isOpen={isPaywallOpen}
          onClose={() => setIsPaywallOpen(false)}
        />
      </main>
    </>
  );
}