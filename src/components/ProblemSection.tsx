import { AlertCircle, WifiOff, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ProblemSection() {
  const { t } = useLanguage();
  
  const problemKeys = [
    "landing.problem.problem1",
    "landing.problem.problem2",
    "landing.problem.problem3"
  ];

  return (
    <section className="px-5 py-12 bg-red-50 dark:bg-red-950/20">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-center mb-8 text-slate-900 dark:text-slate-50 leading-snug">
          {t("landing.problem.title")}
        </h2>
        
        <div className="space-y-3">
          {problemKeys.map((key, index) => {
            const icons = [AlertCircle, WifiOff, Clock];
            const Icon = icons[index];
            
            return (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-lg"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 pt-2 leading-relaxed">
                  {t(key)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}