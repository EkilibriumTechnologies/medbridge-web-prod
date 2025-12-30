import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroProps {
  onGetAccess: () => void;
  onLearnMore: () => void;
}

export function Hero({ onGetAccess, onLearnMore }: HeroProps) {
  const { t } = useLanguage();
  
  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-between px-5 py-8 text-center">
      <div className="flex-1 flex flex-col justify-center w-full max-w-md mx-auto space-y-6">
        <div className="space-y-3">
          <h1 className="text-[32px] leading-tight font-bold tracking-tight text-slate-900 dark:text-slate-50">
            MedBridge
          </h1>
          
          <p className="text-base font-medium text-slate-700 dark:text-slate-300 leading-snug">
            {t("landing.hero.tagline")}
          </p>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("landing.hero.subtitle")}
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button 
            onClick={onGetAccess}
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white touch-manipulation"
          >
            {t("landing.hero.getAccess")}
          </Button>
          
          <button
            onClick={onLearnMore}
            className="text-sm text-blue-600 dark:text-blue-400 active:text-blue-700 dark:active:text-blue-300 font-medium touch-manipulation py-2"
          >
            {t("landing.hero.learnHow")}
          </button>
        </div>
      </div>

      <button 
        onClick={onLearnMore}
        className="pb-4 touch-manipulation animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-6 h-6 text-slate-400" />
      </button>
    </section>
  );
}