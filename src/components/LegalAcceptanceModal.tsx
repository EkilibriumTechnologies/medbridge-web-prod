import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LegalAcceptanceModalProps {
  open: boolean;
  onAccept: () => void;
}

export function LegalAcceptanceModal({ open, onAccept }: LegalAcceptanceModalProps) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  // Reset checkbox when modal closes
  React.useEffect(() => {
    if (!open) {
      setChecked(false);
    }
  }, [open]);

  const handleAccept = () => {
    if (checked) {
      onAccept();
      // Navigation is handled by the context's pendingAction
    }
  };

  const handleLinkClick = (path: string) => {
    router.push(path);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t("legal.modal.title")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("legal.modal.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3 text-sm leading-relaxed">
            <p className="text-foreground">
              {t("legal.modal.summary1")}
            </p>
            <p className="text-foreground">
              {t("legal.modal.summary2")}
            </p>
            <p className="text-foreground font-medium">
              {t("legal.modal.summary3")}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => handleLinkClick("/terms")}
              className="flex items-center gap-2 text-sm text-primary hover:underline w-fit"
            >
              <ExternalLink className="w-4 h-4" />
              {t("legal.modal.readTerms")}
            </button>
            <button
              onClick={() => handleLinkClick("/privacy")}
              className="flex items-center gap-2 text-sm text-primary hover:underline w-fit"
            >
              <ExternalLink className="w-4 h-4" />
              {t("legal.modal.readPrivacy")}
            </button>
          </div>

          <div className="flex items-start space-x-3 pt-4 border-t">
            <Checkbox
              id="accept-terms"
              checked={checked}
              onCheckedChange={(checked) => setChecked(checked === true)}
            />
            <Label
              htmlFor="accept-terms"
              className="text-sm font-medium leading-relaxed cursor-pointer"
            >
              {t("legal.modal.checkbox")}
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAccept}
            disabled={!checked}
            size="lg"
            className="w-full sm:w-auto"
          >
            {t("legal.modal.acceptButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}