import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LegalAcceptance {
  accepted: boolean;
  acceptedAt: string;
  legalVersion: string;
}

interface LegalAcceptanceContextType {
  hasAccepted: boolean;
  showModal: boolean;
  acceptTerms: () => void;
  checkAcceptance: () => void;
  requestAcceptance: (onAccepted?: () => void) => void;
  hideModal: () => void;
  pendingAction: (() => void) | null;
}

const LegalAcceptanceContext = createContext<LegalAcceptanceContextType | undefined>(undefined);

const CURRENT_LEGAL_VERSION = "v1.0";
const STORAGE_KEY = "medbridge_legal_acceptance";

export function LegalAcceptanceProvider({ children }: { children: ReactNode }) {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const checkAcceptance = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (!stored) {
        console.log("No acceptance found in localStorage");
        setHasAccepted(false);
        return false;
      }

      const acceptance: LegalAcceptance = JSON.parse(stored);
      console.log("Found acceptance:", acceptance);
      
      if (acceptance.accepted && acceptance.legalVersion === CURRENT_LEGAL_VERSION) {
        console.log("Valid acceptance found, setting hasAccepted to true");
        setHasAccepted(true);
        return true;
      } else {
        console.log("Invalid or outdated acceptance");
        setHasAccepted(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking legal acceptance:", error);
      setHasAccepted(false);
      return false;
    }
  };

  const requestAcceptance = (onAccepted?: () => void) => {
    console.log("requestAcceptance called, showing modal");
    if (onAccepted) {
      setPendingAction(() => onAccepted);
    }
    setShowModal(true);
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const acceptTerms = () => {
    const acceptance: LegalAcceptance = {
      accepted: true,
      acceptedAt: new Date().toISOString(),
      legalVersion: CURRENT_LEGAL_VERSION
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(acceptance));
      console.log("Acceptance saved to localStorage:", acceptance);
      setHasAccepted(true);
      setShowModal(false);
      
      // Execute pending action if exists
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } catch (error) {
      console.error("Error saving legal acceptance:", error);
    }
  };

  useEffect(() => {
    // Check acceptance on mount
    checkAcceptance();
    setIsInitialized(true);
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    if (isInitialized) {
      console.log("hasAccepted state changed to:", hasAccepted);
    }
  }, [hasAccepted, isInitialized]);

  return (
    <LegalAcceptanceContext.Provider value={{ hasAccepted, showModal, acceptTerms, checkAcceptance, requestAcceptance, hideModal, pendingAction }}>
      {children}
    </LegalAcceptanceContext.Provider>
  );
}

export function useLegalAcceptance() {
  const context = useContext(LegalAcceptanceContext);
  if (context === undefined) {
    throw new Error("useLegalAcceptance must be used within a LegalAcceptanceProvider");
  }
  return context;
}