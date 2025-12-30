import { Check } from "lucide-react";

export function FeaturesSection() {
  const features = [
    "Personal medical profile",
    "Blood type & allergies",
    "Emergency contacts",
    "Doctor information",
    "Emergency-ready medical card",
    "Share medical report by email when needed"
  ];

  return (
    <section className="px-5 py-12 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-center mb-8 text-slate-900 dark:text-slate-50">
          What it includes
        </h2>
        
        <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" strokeWidth={3} />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}