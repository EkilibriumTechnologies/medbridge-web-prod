import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Info } from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Secure Payment
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Payment will be handled securely in the mobile app. This is a preview environment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 flex items-start gap-3 mt-4">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 dark:text-slate-300">
            In the production app, this screen would redirect to a secure payment gateway to complete your purchase.
          </p>
        </div>

        <Button 
          onClick={onClose}
          className="w-full mt-4"
          size="lg"
        >
          Got it
        </Button>
      </DialogContent>
    </Dialog>
  );
}