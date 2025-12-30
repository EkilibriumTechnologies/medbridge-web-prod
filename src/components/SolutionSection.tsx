import { Shield, WifiOff, FileText, Languages } from "lucide-react";

export function SolutionSection() {
  const features = [
    {
      icon: Shield,
      text: "Stores medical data safely on your phone"
    },
    {
      icon: WifiOff,
      text: "Works 100% offline"
    },
    {
      icon: FileText,
      text: "Displays critical information clearly for doctors"
    },
    {
      icon: Languages,
      text: "Translates medical information to English, Spanish, and Portuguese"
    }
  ];

  return (
    <section className="px-5 py-12 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-950">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-center mb-8 text-slate-900 dark:text-slate-50">
          MedBridge solves this.
        </h2>
        
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-lg border border-blue-100 dark:border-blue-900/30"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 pt-2 leading-relaxed">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}