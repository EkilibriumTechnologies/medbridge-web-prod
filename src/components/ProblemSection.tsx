import { AlertCircle, WifiOff, Clock } from "lucide-react";

export function ProblemSection() {
  const problems = [
    {
      icon: AlertCircle,
      text: "Doctors may not speak your language"
    },
    {
      icon: WifiOff,
      text: "Medical data is not available offline"
    },
    {
      icon: Clock,
      text: "Time is critical"
    }
  ];

  return (
    <section className="px-5 py-12 bg-red-50 dark:bg-red-950/20">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-center mb-8 text-slate-900 dark:text-slate-50 leading-snug">
          When an emergency happens, language becomes a barrier.
        </h2>
        
        <div className="space-y-3">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-lg"
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