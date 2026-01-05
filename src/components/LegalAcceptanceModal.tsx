import React, { useState } from "react";
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
import { ArrowLeft, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLegalAcceptance } from "@/contexts/LegalAcceptanceContext";

type LegalView = "summary" | "terms" | "privacy";

interface LegalAcceptanceModalProps {
  open: boolean;
  onAccept: () => void;
}

export function LegalAcceptanceModal({ open, onAccept }: LegalAcceptanceModalProps) {
  const [checked, setChecked] = useState(false);
  const [view, setView] = useState<LegalView>("summary");
  const { t } = useLanguage();
  const { hideModal } = useLegalAcceptance();

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setChecked(false);
      setView("summary");
    }
  }, [open]);

  const handleAccept = () => {
    if (checked) {
      onAccept();
      // Navigation is handled by the context's pendingAction
    }
  };

  const renderSummaryView = () => (
    <>
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
          <Button
            variant="ghost"
            onClick={() => setView("terms")}
            className="flex items-center gap-2 text-sm text-primary hover:underline w-fit justify-start p-0 h-auto"
          >
            {t("legal.modal.readTerms")}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setView("privacy")}
            className="flex items-center gap-2 text-sm text-primary hover:underline w-fit justify-start p-0 h-auto"
          >
            {t("legal.modal.readPrivacy")}
          </Button>
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
    </>
  );

  const renderTermsView = () => (
    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{t("legal.terms.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("legal.terms.lastUpdated")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("legal.terms.version")}
        </p>
      </div>

      <section className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
          <div key={num}>
            <h3 className="text-lg font-semibold mb-2">
              {t(`legal.terms.section${num}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(`legal.terms.section${num}.content`)}
            </p>
          </div>
        ))}
      </section>

      <div className="pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => setView("summary")}
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("legal.modal.back")}
        </Button>
      </div>
    </div>
  );

  const renderPrivacyView = () => (
    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{t("legal.privacy.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("legal.privacy.lastUpdated")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("legal.privacy.version")}
        </p>
      </div>

      <section className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
          <div key={num}>
            <h3 className="text-lg font-semibold mb-2">
              {t(`legal.privacy.section${num}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(`legal.privacy.section${num}.content`)}
            </p>
          </div>
        ))}
      </section>

      <div className="pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => setView("summary")}
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("legal.modal.back")}
        </Button>
      </div>
    </div>
  );

  const getTitle = () => {
    if (view === "terms") return t("legal.terms.title");
    if (view === "privacy") return t("legal.privacy.title");
    return t("legal.modal.title");
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // If trying to close from terms/privacy view, go back to summary
      if (view !== "summary") {
        setView("summary");
      } else {
        // If in summary view, allow closing
        hideModal();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 [&>button]:hidden">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{getTitle()}</DialogTitle>
            {view !== "summary" ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView("summary")}
                className="h-8 w-8"
                aria-label={t("legal.modal.back")}
              >
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={hideModal}
                className="h-8 w-8"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DialogDescription className="sr-only">
            {t("legal.modal.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-6 pb-6">
          {view === "summary" && renderSummaryView()}
          {view === "terms" && renderTermsView()}
          {view === "privacy" && renderPrivacyView()}
        </div>
      </DialogContent>
    </Dialog>
  );
}