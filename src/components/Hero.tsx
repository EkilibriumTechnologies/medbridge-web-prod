import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/router";

interface HeroProps {
  onLearnMore: () => void;
}

export function Hero({ onLearnMore }: HeroProps) {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-between relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-md mx-auto px-5 py-8 text-center">
        <div className="space-y-3 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h1 className="text-[32px] leading-tight font-bold tracking-tight text-white">
            MedBridge
          </h1>
          
          <p className="text-base font-medium text-white/95 leading-snug">
            {t("hero.titleHighlight")}
          </p>
          
          <p className="text-sm text-white/80 leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-6">
          <Button 
            onClick={() => router.push("/form")}
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white touch-manipulation shadow-lg"
          >
            {t("hero.cta")}
          </Button>
          
          <Button
            onClick={() => router.push("/medcard")}
            variant="outline"
            className="w-full h-12 text-base font-semibold bg-white/10 hover:bg-white/20 text-white border-white/30 touch-manipulation"
          >
            {t("hero.viewCard")}
          </Button>
          
          <button
            onClick={onLearnMore}
            className="text-sm text-white/90 active:text-white font-medium touch-manipulation py-2"
          >
            {t("hero.learnMore")}
          </button>
        </div>
      </div>

      <button 
        onClick={onLearnMore}
        className="relative z-10 pb-4 touch-manipulation animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-6 h-6 text-white/70" />
      </button>
    </section>
  );
}