import { Check } from "lucide-react";

export function FeaturesSection() {
  const features = [
    "Perfil médico personal",
    "Tipo de sangre y alergias",
    "Contactos de emergencia",
    "Información del médico",
    "Tarjeta médica lista para emergencias",
    "Comparte reporte médico por email cuando lo necesites"
  ];

  return (
    <section className="px-5 py-12 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <div className="max-w-md mx-auto relative z-10">
        <h2 className="text-xl font-bold text-center mb-8 text-slate-900 dark:text-slate-50">
          Qué incluye
        </h2>
        
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 py-2.5"
              >
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