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
  requestAcceptance: () => void;
  hideModal: () => void;
}

const LegalAcceptanceContext = createContext<LegalAcceptanceContextType | undefined>(undefined);

const CURRENT_LEGAL_VERSION = "v1.0";
const STORAGE_KEY = "medbridge_legal_acceptance";

export function LegalAcceptanceProvider({ children }: { children: ReactNode }) {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const checkAcceptance = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setHasAccepted(false);
        return false;
      }

      const acceptance: LegalAcceptance = JSON.parse(stored);
      
      if (acceptance.accepted && acceptance.legalVersion === CURRENT_LEGAL_VERSION) {
        setHasAccepted(true);
        return true;
      } else {
        setHasAccepted(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking legal acceptance:", error);
      setHasAccepted(false);
      return false;
    }
  };

  const requestAcceptance = () => {
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
      setHasAccepted(true);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving legal acceptance:", error);
    }
  };

  useEffect(() => {
    checkAcceptance();
  }, []);

  return (
    <LegalAcceptanceContext.Provider value={{ hasAccepted, showModal, acceptTerms, checkAcceptance, requestAcceptance, hideModal }}>
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