import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AccessSectionProps {
  onUnlockAccess: () => void;
  onContinueDemo: () => void;
}

export function AccessSection({ onUnlockAccess, onContinueDemo }: AccessSectionProps) {
  return (
    <section className="px-6 py-20 bg-white dark:bg-slate-950">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
          <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50">
          Access the App
        </h2>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto">
          MedBridge requires a one-time access purchase to use the app.
        </p>

        <div className="flex flex-col gap-4 items-center">
          <Button 
            onClick={onUnlockAccess}
            size="lg"
            className="w-full max-w-xs h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            Unlock Access
          </Button>
          
          <button
            onClick={onContinueDemo}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors underline underline-offset-4"
          >
            Continue to Demo
          </button>
        </div>
      </div>
    </section>
  );
}