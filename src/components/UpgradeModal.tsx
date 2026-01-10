/**
 * Premium Upgrade / Renewal Modal for PDF Export
 * 
 * Handles first-time upgrade and renewal states for the PDF export license.
 * Integrated with the existing annual license cycle logic.
 * 
 * IMPORTANT:
 * - No billing implementation (placeholder function)
 * - Applies only to Android (Capacitor) app
 * - Web version remains unchanged
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, CheckCircle2, Info, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLicenseCycle, formatLicenseDate } from "@/lib/license";
import type { LicenseCycle } from "@/lib/license";
import { useState } from "react";
import { 
  purchasePremiumPdfAnnual, 
  restorePurchases, 
  BillingError,
  isBillingAvailable 
} from "@/lib/billing";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgradeConfirmed: () => void;
}

/**
 * Determines if this is a first-time upgrade or renewal.
 * 
 * @returns Object with:
 * - isRenewal: true if cycle exists but expired, false if no cycle exists
 * - expiredCycle: the expired cycle if renewal, null if first-time
 */
function getUpgradeState(): { isRenewal: boolean; expiredCycle: LicenseCycle | null } {
  const cycle = getLicenseCycle();
  
  if (!cycle) {
    // No cycle exists = first-time upgrade
    return { isRenewal: false, expiredCycle: null };
  }

  const now = Date.now();
  if (now >= cycle.cycleExpiresAt) {
    // Cycle exists but expired = renewal
    return { isRenewal: true, expiredCycle: cycle };
  }

  // Cycle exists and is active (should not show modal, but return first-time as default)
  return { isRenewal: false, expiredCycle: null };
}

export function UpgradeModal({ open, onOpenChange, onUpgradeConfirmed }: UpgradeModalProps) {
  const { t, language } = useLanguage();
  const { isRenewal, expiredCycle } = getUpgradeState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get locale for date formatting
  const locale = language === "es" ? "es-ES" : language === "pt" ? "pt-BR" : "en-US";

  const handleUpgrade = async () => {
    // Check if billing is available (Android only)
    if (!isBillingAvailable()) {
      // Fallback for web or if billing not available
      onUpgradeConfirmed();
      onOpenChange(false);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Initiate Google Play purchase flow
      const result = await purchasePremiumPdfAnnual();

      if (result.success && result.purchaseState) {
        // Purchase successful - create/renew license cycle
        onUpgradeConfirmed();
        onOpenChange(false);
      } else {
        // Handle billing errors
        let errorKey = "billing.error.unknown";
        
        switch (result.error) {
          case BillingError.USER_CANCELLED:
            errorKey = "billing.error.userCancelled";
            // Don't show error for user cancellation
            onOpenChange(false);
            return;
          case BillingError.ITEM_UNAVAILABLE:
            errorKey = "billing.error.itemUnavailable";
            break;
          case BillingError.NETWORK_ERROR:
            errorKey = "billing.error.networkError";
            break;
          case BillingError.BILLING_NOT_SUPPORTED:
            errorKey = "billing.error.billingNotSupported";
            break;
          case BillingError.PURCHASE_PENDING:
            errorKey = "billing.error.purchasePending";
            break;
          default:
            errorKey = "billing.error.unknown";
        }
        
        setErrorMessage(t(errorKey) || result.message || "Purchase failed");
      }
    } catch (error: any) {
      console.error("Error during purchase:", error);
      setErrorMessage(t("billing.error.unknown") || "Failed to process purchase");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    if (!isBillingAvailable()) {
      setErrorMessage(t("billing.error.billingNotSupported") || "Restore is not available");
      return;
    }

    setIsRestoring(true);
    setErrorMessage(null);

    try {
      const result = await restorePurchases();

      if (result.success && result.purchaseState) {
        // Purchase restored - create/renew license cycle
        onUpgradeConfirmed();
        onOpenChange(false);
      } else {
        // Handle restore errors
        if (result.error === BillingError.UNKNOWN_ERROR && result.message?.includes("No previous purchases")) {
          setErrorMessage(t("upgrade.restore.failed") || "No previous purchases found");
        } else {
          setErrorMessage(t("upgrade.restore.error") || "Failed to restore purchases");
        }
      }
    } catch (error: any) {
      console.error("Error during restore:", error);
      setErrorMessage(t("upgrade.restore.error") || "Failed to restore purchases");
    } finally {
      setIsRestoring(false);
    }
  };

  const handleCancel = () => {
    setErrorMessage(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-40px)] w-full sm:max-w-md mx-5 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mx-auto mb-4">
            <FileText className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            {isRenewal ? t("upgrade.title.renewal") : t("upgrade.title.firstTime")}
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-base">
            {isRenewal ? t("upgrade.description.renewal") : t("upgrade.description.firstTime")}
          </DialogDescription>
          
          {/* Price display */}
          <div className="text-center mt-4">
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {t("upgrade.price")}
            </p>
          </div>
        </DialogHeader>

        {/* Expiration message for renewal */}
        {isRenewal && expiredCycle && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  {t("upgrade.expiredOn")}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {formatLicenseDate(expiredCycle.cycleExpiresAt, locale)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Benefits list */}
        <div className="space-y-3 mt-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t("upgrade.benefit.unlimited")}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t("upgrade.benefit.unlimitedDesc")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t("upgrade.benefit.yearAccess")}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t("upgrade.benefit.yearAccessDesc")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t("upgrade.benefit.shareExport")}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t("upgrade.benefit.shareExportDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Important info */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 flex items-start gap-3 mt-6">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {t("upgrade.info.cycleAnchor")}
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-4">
            <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 mt-6">
          {/* Restore purchases button (Android only) */}
          {isBillingAvailable() && (
            <Button
              variant="outline"
              onClick={handleRestore}
              disabled={isProcessing || isRestoring}
              className="w-full text-sm border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {isRestoring ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t("upgrade.button.restore")}...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("upgrade.button.restore")}
                </>
              )}
            </Button>
          )}
          
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isProcessing || isRestoring}
              className="flex-1 order-2 sm:order-1"
            >
              {t("upgrade.button.cancel")}
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={isProcessing || isRestoring}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white order-1 sm:order-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isRenewal ? t("upgrade.button.renew") : t("upgrade.button.upgrade")}...
                </>
              ) : (
                isRenewal ? t("upgrade.button.renew") : t("upgrade.button.upgrade")
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

