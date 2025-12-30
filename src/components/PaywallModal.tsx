import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const { t } = useLanguage();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-40px)] w-full sm:max-w-md mx-5">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <DialogTitle className="text-center text-xl">
            {t("landing.paywall.title")}
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-sm">
            {t("landing.paywall.description")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 flex items-start gap-3 mt-4">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {t("landing.paywall.info")}
          </p>
        </div>

        <Button 
          onClick={onClose}
          className="w-full mt-4 h-12 touch-manipulation"
        >
          {t("landing.paywall.gotIt")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}