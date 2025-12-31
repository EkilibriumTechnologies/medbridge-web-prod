import { Lock, Server, Smartphone, UserCheck } from "lucide-react";

export function PrivacySection() {
  const privacyPoints = [
    {
      icon: Server,
      text: "Sin almacenamiento en la nube"
    },
    {
      icon: Lock,
      text: "Sin servidores"
    },
    {
      icon: Smartphone,
      text: "Datos guardados localmente en tu dispositivo"
    },
    {
      icon: UserCheck,
      text: "Tú controlas cuándo se comparte"
    }
  ];

  return (
    <section className="px-5 py-12 bg-slate-800 dark:bg-slate-950 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/80" />
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center backdrop-blur-sm border border-green-500/30">
            <Lock className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white">
            Tus datos permanecen privados.
          </h2>
        </div>
        
        <div className="space-y-3">
          {privacyPoints.map((point, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <point.icon className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-white/90 pt-2 leading-relaxed">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}