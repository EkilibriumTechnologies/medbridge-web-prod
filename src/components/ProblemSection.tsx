import { AlertCircle, WifiOff, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ProblemSection() {
  const { t } = useLanguage();
  
  const problems = [
    {
      icon: AlertCircle,
      text: "Emergencias médicas en países extranjeros donde no hablas el idioma"
    },
    {
      icon: WifiOff,
      text: "Sin acceso a internet cuando más lo necesitas"
    },
    {
      icon: Clock,
      text: "Pérdida de tiempo crítico tratando de comunicar tu historial médico"
    }
  ];

  return (
    <section className="px-5 py-12 bg-red-50 dark:bg-red-950/20 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <div className="max-w-md mx-auto relative z-10">
        <h2 className="text-xl font-bold text-center mb-8 text-slate-900 dark:text-slate-50 leading-snug">
          ¿Te ha pasado esto?
        </h2>
        
        <div className="space-y-3">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <problem.icon className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 pt-2 leading-relaxed">
                {problem.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}