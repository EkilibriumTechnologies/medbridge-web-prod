import { useRef } from "react";
import SEO from "@/components/SEO";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PrivacySection } from "@/components/PrivacySection";
import { AccessSection } from "@/components/AccessSection";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function Home() {
  const problemRef = useRef<HTMLDivElement>(null);

  const handleLearnMore = () => {
    problemRef.current?.scrollIntoView({ behavior: "smooth" });
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
        <Hero onLearnMore={handleLearnMore} />

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

        {/* Access Section */}
        <AccessSection />
      </main>
    </>
  );
}