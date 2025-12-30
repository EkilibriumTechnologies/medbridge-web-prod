import { AlertCircle, Wifi, Clock } from "lucide-react";

export function ProblemSection() {
  const problems = [
    {
      icon: AlertCircle,
      text: "Doctors may not speak your language"
    },
    {
      icon: Wifi,
      text: "Medical data is not available offline"
    },
    {
      icon: Clock,
      text: "Time is critical"
    }
  ];

  return (
    <section className="px-6 py-20 bg-red-50 dark:bg-red-950/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-slate-50">
          When an emergency happens, language becomes a barrier.
        </h2>
        
        <div className="space-y-6">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl shadow-sm"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <problem.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 pt-2">
                {problem.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}