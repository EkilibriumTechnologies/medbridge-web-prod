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
        description={t("legal.privacy.sections.overview.content")}
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
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.overview.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.sections.overview.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.localStorage.title")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  <strong>{t("legal.privacy.sections.localStorage.highlight")}</strong> {t("legal.privacy.sections.localStorage.intro")}
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{t("legal.privacy.sections.localStorage.point1")}</li>
                  <li>{t("legal.privacy.sections.localStorage.point2")}</li>
                  <li>{t("legal.privacy.sections.localStorage.point3")}</li>
                  <li>{t("legal.privacy.sections.localStorage.point4")}</li>
                  <li>{t("legal.privacy.sections.localStorage.point5")}</li>
                  <li>{t("legal.privacy.sections.localStorage.point6")}</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  {t("legal.privacy.sections.localStorage.footer")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.cloudStorage.title")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  {t("legal.privacy.sections.cloudStorage.intro")}
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{t("legal.privacy.sections.cloudStorage.point1")}</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  {t("legal.privacy.sections.cloudStorage.footer")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.noMedicalCloud.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>{t("legal.privacy.sections.noMedicalCloud.highlight")}</strong> {t("legal.privacy.sections.noMedicalCloud.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.noTracking.title")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  {t("legal.privacy.sections.noTracking.intro")}
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{t("legal.privacy.sections.noTracking.point1")}</li>
                  <li>{t("legal.privacy.sections.noTracking.point2")}</li>
                  <li>{t("legal.privacy.sections.noTracking.point3")}</li>
                  <li>{t("legal.privacy.sections.noTracking.point4")}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.noSelling.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.sections.noSelling.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.userControl.title")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  {t("legal.privacy.sections.userControl.intro")}
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{t("legal.privacy.sections.userControl.point1")}</li>
                  <li>{t("legal.privacy.sections.userControl.point2")}</li>
                  <li>{t("legal.privacy.sections.userControl.point3")}</li>
                  <li>{t("legal.privacy.sections.userControl.point4")}</li>
                  <li>{t("legal.privacy.sections.userControl.point5")}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.sharing.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.sections.sharing.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.security.title")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  {t("legal.privacy.sections.security.intro")}
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{t("legal.privacy.sections.security.point1")}</li>
                  <li>{t("legal.privacy.sections.security.point2")}</li>
                  <li>{t("legal.privacy.sections.security.point3")}</li>
                  <li>{t("legal.privacy.sections.security.point4")}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.legalRecords.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.sections.legalRecords.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.changes.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.sections.changes.content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t("legal.privacy.sections.contact.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("legal.privacy.sections.contact.content")}
                </p>
              </div>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                {t("legal.privacy.footer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}