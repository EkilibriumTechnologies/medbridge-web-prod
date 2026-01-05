import React from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleResetAcceptance = () => {
    localStorage.removeItem('medbridge_legal_acceptance');
    alert('Legal acceptance has been reset. Reload the page to test the flow again.');
  };

  return (
    <>
      <SEO
        title={`${t("legal.privacy.title")} - MedBridge`}
        description={t("legal.privacy.section1.content")}
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
              <h1 className="text-3xl font-bold mb-2">{t("legal.privacy.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("legal.privacy.lastUpdated")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("legal.privacy.version")}
              </p>
            </div>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section1.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section1.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section2.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section2.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section3.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section3.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section4.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section4.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section5.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section5.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section6.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section6.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section7.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section7.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section8.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section8.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section9.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section9.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section10.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section10.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section11.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section11.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section12.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section12.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section13.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section13.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.section14.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.section14.content")}
                </p>
              </div>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center">
                {t("legal.privacy.footer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}