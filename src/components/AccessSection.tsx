import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/router";
import { useLegalAcceptance } from "@/contexts/LegalAcceptanceContext";

export function AccessSection() {
  const { t } = useLanguage();
  const router = useRouter();
  const { hasAccepted, requestAcceptance } = useLegalAcceptance();

  const handleCreateForm = () => {
    const navigateToForm = () => {
      router.push("/form");
    };

    if (hasAccepted) {
      // Already accepted, navigate directly
      navigateToForm();
    } else {
      // Not accepted, show modal with deferred navigation
      requestAcceptance(navigateToForm);
    }
  };

  return (
    <section className="px-5 py-12 bg-gradient-to-b from-white to-blue-50 dark:from-slate-950 dark:to-blue-950/20 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center space-y-4 mb-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t("access.title")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            {t("access.subtitle")}
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleCreateForm}
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white touch-manipulation shadow-lg"
          >
            {t("access.cta")}
          </Button>
          
          <Button
            onClick={() => router.push("/medcard")}
            variant="outline"
            className="w-full h-12 text-base font-semibold border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950/20 touch-manipulation"
          >
            {t("access.viewCard")}
          </Button>
        </div>
      </div>
    </section>
  );
}