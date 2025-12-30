import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AccessSectionProps {
  onUnlockAccess: () => void;
  onContinueDemo: () => void;
}

export function AccessSection({ onUnlockAccess, onContinueDemo }: AccessSectionProps) {
  const { t } = useLanguage();
  
  return (
    <section className="px-5 py-12 bg-white dark:bg-slate-950">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-5">
          <Sparkles className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-50">
          {t("landing.access.title")}
        </h2>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          {t("landing.access.subtitle")}
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={onUnlockAccess}
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white touch-manipulation"
          >
            {t("landing.access.unlock")}
          </Button>
          
          <button
            onClick={onContinueDemo}
            className="text-sm text-blue-600 dark:text-blue-400 active:text-blue-700 dark:active:text-blue-300 font-medium touch-manipulation py-2"
          >
            {t("landing.access.continueDemo")}
          </button>
        </div>
      </div>
    </section>
  );
}