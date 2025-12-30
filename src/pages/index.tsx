import { useState, useRef } from "react";
import SEO from "@/components/SEO";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PrivacySection } from "@/components/PrivacySection";
import { AccessSection } from "@/components/AccessSection";
import { PaywallModal } from "@/components/PaywallModal";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/router";

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const problemRef = useRef<HTMLDivElement>(null);

  const handleGetAccess = () => {
    setIsPaywallOpen(true);
  };

  const handleLearnMore = () => {
    problemRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUnlockAccess = () => {
    setIsPaywallOpen(true);
  };

  const handleContinueDemo = () => {
    router.push("/medcard");
  };

  return (
    <>
      <SEO
        title="MedBridge - Your Digital Medical Emergency Card"
        description="Secure, instant access to critical medical information when seconds count. Create your digital medical card today."
      />
      
      <main className="min-h-screen bg-white dark:bg-slate-950">
        {/* Fixed Language Selector */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSelector />
        </div>

        {/* Hero Section */}
        <Hero 
          onGetAccess={handleGetAccess}
          onLearnMore={handleLearnMore}
        />

        {/* Problem Section */}
        <div ref={problemRef}>
          <ProblemSection />
        </div>

        {/* Solution Section */}
        <SolutionSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Privacy Section */}
        <PrivacySection />

        {/* Access/Paywall Section */}
        <AccessSection 
          onUnlockAccess={handleUnlockAccess}
          onContinueDemo={handleContinueDemo}
        />

        {/* Paywall Modal */}
        <PaywallModal 
          isOpen={isPaywallOpen}
          onClose={() => setIsPaywallOpen(false)}
        />
      </main>
    </>
  );
}