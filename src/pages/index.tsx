import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  return (
    <>
      <SEO
        title="MedBridge - Your Digital Medical Emergency Card"
        description="Secure, instant access to critical medical information when seconds count. Create your digital medical card today."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300">
              <Heart className="w-4 h-4" />
              <span>Trusted by Emergency Responders</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Your Life-Saving Medical Information,{" "}
              <span className="text-blue-600 dark:text-blue-400">Always Accessible</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              In an emergency, every second counts. MedBridge provides instant access to critical medical information for first responders, doctors, and paramedics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/form">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                  Create Medical Card
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/medcard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                  View My Card
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
                    The Problem
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    During medical emergencies, critical information like blood type, allergies, and medications 
                    can mean the difference between life and death. Yet this information is often unavailable 
                    when emergency responders need it most—locked in phones, scattered across documents, or 
                    simply forgotten in the chaos of an emergency.
                  </p>
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
                The Solution: MedBridge
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A digital medical card designed specifically for emergency situations. 
                Readable in 5 seconds. Accessible on any device. Always up to date.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  5-Second Scan
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Critical information displayed prominently with high contrast and large typography for instant recognition.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Smartphone className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Mobile-First Design
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Optimized for mobile phones—the device you always have with you in an emergency.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Secure & Private
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your data is stored locally on your device. You control who sees it and when.
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
                Everything Emergency Responders Need
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Blood Type & Transfusion Status
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Prominently displayed with color coding for immediate recognition.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Critical Allergies
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Highlighted warning section for medication and food allergies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Current Medications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Complete list of medications for treatment compatibility.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Emergency Contacts
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    One-tap calling to reach your emergency contacts instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Medical History
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Previous diagnoses, surgeries, and ongoing treatments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Primary Physician Info
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Contact details for your doctor for follow-up care.
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
                    Your Privacy Matters
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p className="text-lg leading-relaxed">
                      <strong>Local Storage Only:</strong> Your medical information is stored securely on your device. 
                      No cloud servers, no third-party access, no data mining.
                    </p>
                    <p className="text-lg leading-relaxed">
                      <strong>You Control Access:</strong> You decide when to show your medical card. 
                      It's only visible when you choose to display it.
                    </p>
                    <p className="text-lg leading-relaxed">
                      <strong>Easy Updates:</strong> Keep your information current with simple edits 
                      that take effect immediately.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Ready to Create Your Medical Card?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Join thousands of people who are prepared for medical emergencies. 
              It takes less than 5 minutes to set up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/form">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                  Get Started Now
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
                © 2025 MedBridge. Designed for emergency medical situations.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}