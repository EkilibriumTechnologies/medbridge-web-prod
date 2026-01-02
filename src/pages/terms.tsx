import React from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";

export default function TermsPage() {
  const router = useRouter();

  return (
    <>
      <SEO
        title="Terms & Conditions - MedBridge"
        description="Terms and conditions for using the MedBridge medical information management application"
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="bg-card rounded-lg shadow-sm border p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
              <p className="text-sm text-muted-foreground">
                Last Updated: January 2, 2026
              </p>
              <p className="text-sm text-muted-foreground">
                Version: v1.0
              </p>
            </div>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using MedBridge ("the App"), you accept and agree to be bound by these Terms & Conditions. If you do not agree to these terms, you must not use the App.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">2. Informational and Personal Use Only</h2>
                <p className="text-muted-foreground leading-relaxed">
                  MedBridge is designed for personal informational purposes only. It is intended to help you organize and share your medical information at your own discretion. The App is not a medical device, diagnostic tool, or treatment platform.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">3. No Medical Advice</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  <strong>IMPORTANT DISCLAIMER:</strong> MedBridge does not provide medical advice, diagnosis, or treatment recommendations. The information you store in the App should not be used as a substitute for professional medical care.
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Always consult a qualified healthcare provider for medical concerns</li>
                  <li>Never disregard professional medical advice based on information stored in this App</li>
                  <li>In case of medical emergency, contact emergency services immediately</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">4. User Responsibility</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  You are solely responsible for:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>The accuracy and completeness of information you enter</li>
                  <li>Maintaining the security of your device and data</li>
                  <li>Deciding when and with whom to share your medical information</li>
                  <li>Ensuring shared information is appropriate and authorized</li>
                  <li>Backing up your data if desired</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">5. Data Storage</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your medical information is stored locally on your device. Only identification photos may be uploaded to secure cloud storage for sharing purposes. You maintain full control over your data and can delete it at any time by clearing your browser data or removing the App.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  To the fullest extent permitted by law, MedBridge and its creators shall not be liable for:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Any direct, indirect, incidental, or consequential damages arising from your use of the App</li>
                  <li>Loss of data, medical information, or identification photos</li>
                  <li>Unauthorized access to your information due to device compromise</li>
                  <li>Consequences of sharing information with third parties</li>
                  <li>Technical failures, errors, or interruptions in service</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">7. "As-Is" Provision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The App is provided "as-is" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that the App will be error-free or uninterrupted.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">8. Modifications to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms & Conditions at any time. When we make material changes, we will update the version number and require you to accept the new terms before continuing to use the App.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">9. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms & Conditions shall be governed by and construed in accordance with the laws applicable in your jurisdiction, without regard to its conflict of law provisions.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">10. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about these Terms & Conditions, please contact us through the appropriate channels provided in the App.
                </p>
              </div>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                By using MedBridge, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}