import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LegalAcceptanceProvider, useLegalAcceptance } from "@/contexts/LegalAcceptanceContext";
import { LegalAcceptanceModal } from "@/components/LegalAcceptanceModal";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

function AppContent({ Component, pageProps }: AppProps) {
  const { showModal, acceptTerms } = useLegalAcceptance();

  return (
    <>
      <Component {...pageProps} />
      <LegalAcceptanceModal open={showModal} onAccept={acceptTerms} />
      <Toaster />
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <LanguageProvider>
      <LegalAcceptanceProvider>
        <AppContent {...props} />
      </LegalAcceptanceProvider>
    </LanguageProvider>
  );
}