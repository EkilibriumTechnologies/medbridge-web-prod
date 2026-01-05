import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";

export default function TermsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isChecked, setIsChecked] = useState(false);

  const handleResetAcceptance = () => {
    localStorage.removeItem('medbridge_legal_acceptance');
    alert('Legal acceptance has been reset. Reload the page to test the flow again.');
  };

  const handleAcceptTerms = () => {
    const STORAGE_KEY = "medbridge_legal_acceptance";
    const CURRENT_LEGAL_VERSION = "v1.0";
    
    const acceptance = {
      accepted: true,
      acceptedAt: new Date().toISOString(),
      legalVersion: CURRENT_LEGAL_VERSION
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(acceptance));
      // Navegar al formulario
      router.push("/form");
    } catch (error) {
      console.error("Error saving legal acceptance:", error);
      alert("Error al guardar la aceptación. Por favor intenta de nuevo.");
    }
  };

  return (
    <>
      <SEO
        title={`${t("legal.terms.title")} - MedBridge`}
        description={t("legal.terms.section1.content")}
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("legal.modal.back")}
            </Button>
            
            {process.env.NODE_ENV === 'development' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleResetAcceptance}
              >
                Reset Acceptance (Dev)
              </Button>
            )}
          </div>

          <div className="bg-card rounded-lg shadow-sm border p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t("legal.terms.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("legal.terms.lastUpdated")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("legal.terms.version")}
              </p>
            </div>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section1.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section1.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section2.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section2.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section3.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section3.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section4.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section4.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section5.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section5.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section6.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section6.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section7.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section7.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section8.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section8.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section9.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section9.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section10.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section10.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section11.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section11.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section12.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section12.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.section13.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.section13.content")}
                </p>
              </div>
            </section>

            <div className="pt-6 border-t space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                <Checkbox 
                  id="accept-terms" 
                  checked={isChecked}
                  onCheckedChange={(checked) => setIsChecked(checked === true)}
                  className="mt-1"
                />
                <label 
                  htmlFor="accept-terms" 
                  className="text-sm leading-relaxed cursor-pointer select-none"
                >
                  {t("legal.modal.checkbox")}
                </label>
              </div>

              <Button 
                onClick={handleAcceptTerms}
                disabled={!isChecked}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                {t("legal.modal.accept")}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                {t("legal.terms.footer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}