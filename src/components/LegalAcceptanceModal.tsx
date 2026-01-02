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

interface LegalAcceptanceModalProps {
  open: boolean;
  onAccept: () => void;
}

export function LegalAcceptanceModal({ open, onAccept }: LegalAcceptanceModalProps) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const handleAccept = () => {
    if (checked) {
      onAccept();
    }
  };

  const handleLinkClick = (path: string) => {
    router.push(path);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]" hideClose>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Terms & Privacy Notice</DialogTitle>
          <DialogDescription className="sr-only">
            Legal acceptance required to use the application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3 text-sm leading-relaxed">
            <p className="text-foreground">
              This app allows you to store and share medical information for personal use only.
            </p>
            <p className="text-foreground">
              Your medical data is stored locally on your device. Only an identification photo may be uploaded to secure cloud storage.
            </p>
            <p className="text-foreground font-medium">
              This app does not provide medical advice and does not replace professional medical care.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => handleLinkClick("/terms")}
              className="flex items-center gap-2 text-sm text-primary hover:underline w-fit"
            >
              <ExternalLink className="w-4 h-4" />
              Read Terms & Conditions
            </button>
            <button
              onClick={() => handleLinkClick("/privacy")}
              className="flex items-center gap-2 text-sm text-primary hover:underline w-fit"
            >
              <ExternalLink className="w-4 h-4" />
              Read Privacy Policy
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
              I have read and agree to the Terms & Conditions and Privacy Policy
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
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}