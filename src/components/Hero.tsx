import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  onGetAccess: () => void;
  onLearnMore: () => void;
}

export function Hero({ onGetAccess, onLearnMore }: HeroProps) {
  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            MedBridge
          </h1>
          
          <p className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-300">
            Your medical information, always available — even offline.
          </p>
          
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Designed for travelers and emergencies. No internet required.
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center pt-4">
          <Button 
            onClick={onGetAccess}
            size="lg"
            className="w-full max-w-xs h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            Get Access
          </Button>
          
          <button
            onClick={onLearnMore}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors underline underline-offset-4"
          >
            Learn how it works
          </button>
        </div>
      </div>

      <button 
        onClick={onLearnMore}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown className="w-6 h-6 text-slate-400" />
      </button>
    </section>
  );
}