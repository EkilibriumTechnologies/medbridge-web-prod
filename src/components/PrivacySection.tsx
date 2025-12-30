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
    <section className="px-6 py-20 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Lock className="w-8 h-8 text-green-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Your data stays private.
          </h2>
        </div>
        
        <div className="grid gap-4 mt-12">
          {privacyFeatures.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-5 bg-slate-800/50 dark:bg-slate-900/50 rounded-xl border border-slate-700 dark:border-slate-800"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-lg text-slate-200">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}