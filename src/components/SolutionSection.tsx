import { Shield, WifiOff, FileText, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function SolutionSection() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Shield,
      textKey: "landing.solution.feature1"
    },
    {
      icon: WifiOff,
      textKey: "landing.solution.feature2"
    },
    {
      icon: FileText,
      textKey: "landing.solution.feature3"
    },
    {
      icon: Languages,
      textKey: "landing.solution.feature4"
    }
  ];

  return (
    <section className="px-5 py-12 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-950 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-8 space-y-2">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden shadow-md"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t("landing.solution.title")}
          </h2>
        </div>
        
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-lg border border-blue-100 dark:border-blue-900/30 shadow-sm"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 pt-2 leading-relaxed">
                {t(feature.textKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}