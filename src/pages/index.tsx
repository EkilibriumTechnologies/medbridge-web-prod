import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  FileText, 
  Smartphone,
  CheckCircle2,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title="MedBridge - Your Digital Medical Emergency Card"
        description="Secure, instant access to critical medical information when seconds count. Create your digital medical card today."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        {/* Global Language Selector - Fixed Top Right */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSelector />
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300">
              <Heart className="w-4 h-4" />
              <span>MedBridge</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {t("hero.title")}{" "}
              <span className="text-blue-600 dark:text-blue-400">{t("hero.titleHighlight")}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/form">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/medcard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                  {t("nav.viewCard")}
                  <FileText className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {t("problem.title")}
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t("problem.subtitle")}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{t("problem.communication")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{t("problem.history")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{t("problem.access")}</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Solution Section */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("solution.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("solution.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("features.instant")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("solution.instant")}
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Smartphone className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("features.complete")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("solution.complete")}
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("features.secure")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("solution.secure")}
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("features.title")}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("card.bloodType")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("features.instantDesc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("card.allergies")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("features.completeDesc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("card.medications")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("features.secureDesc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("card.contactName")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("access.qr")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("card.conditions")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("access.offline")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("card.physician")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("access.universal")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 p-8 md:p-12">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {t("privacy.title")}
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p className="text-lg leading-relaxed">
                      <strong>{t("privacy.local")}:</strong> {t("privacy.subtitle")}
                    </p>
                    <p className="text-lg leading-relaxed">
                      <strong>{t("privacy.noServers")}:</strong> {t("privacy.yourControl")}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Access Section */}
        <section className="container mx-auto px-4 py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("access.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("access.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("access.qr")}
                </h3>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Smartphone className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("access.offline")}
                </h3>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("access.universal")}
                </h3>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {t("hero.cta")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/form">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold">MedBridge</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2025 MedBridge
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}