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
}

const LegalAcceptanceContext = createContext<LegalAcceptanceContextType | undefined>(undefined);

const CURRENT_LEGAL_VERSION = "v1.0";
const STORAGE_KEY = "medbridge_legal_acceptance";

export function LegalAcceptanceProvider({ children }: { children: ReactNode }) {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkAcceptance = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setHasAccepted(false);
        setShowModal(true);
        setIsChecking(false);
        return;
      }

      const acceptance: LegalAcceptance = JSON.parse(stored);
      
      if (acceptance.accepted && acceptance.legalVersion === CURRENT_LEGAL_VERSION) {
        setHasAccepted(true);
        setShowModal(false);
      } else {
        setHasAccepted(false);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error checking legal acceptance:", error);
      setHasAccepted(false);
      setShowModal(true);
    } finally {
      setIsChecking(false);
    }
  };

  const acceptTerms = () => {
    const acceptance: LegalAcceptance = {
      accepted: true,
      acceptedAt: new Date().toISOString(),
      legalVersion: CURRENT_LEGAL_VERSION
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(acceptance));
      setHasAccepted(true);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving legal acceptance:", error);
    }
  };

  useEffect(() => {
    checkAcceptance();
  }, []);

  if (isChecking) {
    return null;
  }

  return (
    <LegalAcceptanceContext.Provider value={{ hasAccepted, showModal, acceptTerms, checkAcceptance }}>
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