import { Lock, Server, Smartphone, UserCheck } from "lucide-react";

export function PrivacySection() {
  const privacyFeatures = [
    {
      icon: Server,
      text: "No cloud storage"
    },
    {
      icon: Server,
      text: "No servers"
    },
    {
      icon: Smartphone,
      text: "Data stored locally on your device"
    },
    {
      icon: UserCheck,
      text: "You control when it's shared"
    }
  ];

  return (
    <section className="px-5 py-12 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Lock className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-bold text-white">
            Your data stays private.
          </h2>
        </div>
        
        <div className="space-y-3 mt-8">
          {privacyFeatures.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-4 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg border border-slate-700 dark:border-slate-800"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-900/30 flex items-center justify-center">
                <feature.icon className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}