import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AccessSectionProps {
  onUnlockAccess: () => void;
  onContinueDemo: () => void;
}

export function AccessSection({ onUnlockAccess, onContinueDemo }: AccessSectionProps) {
  return (
    <section className="px-5 py-12 bg-gradient-to-b from-white to-blue-50 dark:from-slate-950 dark:to-blue-950/20 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center space-y-4 mb-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Accede a la Aplicación
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            MedBridge requiere una compra única para acceder a todas las funcionalidades de la aplicación.
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={onUnlockAccess}
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white touch-manipulation shadow-lg"
          >
            Desbloquear Acceso
          </Button>
          
          <button
            onClick={onContinueDemo}
            className="w-full text-sm text-slate-600 dark:text-slate-400 active:text-slate-900 dark:active:text-slate-200 font-medium touch-manipulation py-3"
          >
            Continuar con Demo
          </button>
        </div>
      </div>
    </section>
  );
}