import React from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TermsPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleResetAcceptance = () => {
    localStorage.removeItem('medbridge_legal_acceptance');
    alert('Legal acceptance has been reset. Reload the page to test the flow again.');
  };

  return (
    <>
      <SEO
        title={`${t("legal.terms.title")} - MedBridge`}
        description={t("legal.terms.sections.acceptance.content")}
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
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.sections.acceptance.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.sections.acceptance.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.sections.informational.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.sections.informational.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.sections.noAdvice.title")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  <strong>{t("legal.terms.sections.noAdvice.disclaimer")}</strong> {t("legal.terms.sections.noAdvice.content")}
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{t("legal.terms.sections.noAdvice.point1")}</li>
                  <li>{t("legal.terms.sections.noAdvice.point2")}</li>
                  <li>{t("legal.terms.sections.noAdvice.point3")}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.sections.responsibility.title")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  {t("legal.terms.sections.responsibility.intro")}
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{t("legal.terms.sections.responsibility.point1")}</li>
                  <li>{t("legal.terms.sections.responsibility.point2")}</li>
                  <li>{t("legal.terms.sections.responsibility.point3")}</li>
                  <li>{t("legal.terms.sections.responsibility.point4")}</li>
                  <li>{t("legal.terms.sections.responsibility.point5")}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.sections.dataStorage.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.sections.dataStorage.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.sections.liability.title")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  {t("legal.terms.sections.liability.intro")}
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{t("legal.terms.sections.liability.point1")}</li>
                  <li>{t("legal.terms.sections.liability.point2")}</li>
                  <li>{t("legal.terms.sections.liability.point3")}</li>
                  <li>{t("legal.terms.sections.liability.point4")}</li>
                  <li>{t("legal.terms.sections.liability.point5")}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.sections.asIs.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.sections.asIs.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.sections.modifications.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.sections.modifications.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.sections.law.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.sections.law.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.terms.sections.contact.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.terms.sections.contact.content")}
                </p>
              </div>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                {t("legal.terms.footer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}