import React from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <>
      <SEO
        title="Privacy Policy - MedBridge"
        description="Privacy policy for the MedBridge medical information management application"
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
              <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-sm text-muted-foreground">
                Last Updated: January 2, 2026
              </p>
              <p className="text-sm text-muted-foreground">
                Version: v1.0
              </p>
            </div>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">1. Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  MedBridge ("the App") is committed to protecting your privacy. This Privacy Policy explains how we handle your personal and medical information. Our core principle is simple: your medical data stays on your device and under your control.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">2. Local Data Storage</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  <strong>Your medical information is stored locally on your device.</strong> This includes:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Personal details (name, date of birth, blood type, etc.)</li>
                  <li>Medical conditions and allergies</li>
                  <li>Current medications and dosages</li>
                  <li>Emergency contacts</li>
                  <li>Medical history and notes</li>
                  <li>Language preferences and app settings</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  This data is stored using your browser's local storage mechanisms and never leaves your device unless you explicitly choose to share it.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">3. Cloud Storage (Identification Photos Only)</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  The only data that may be uploaded to secure cloud storage is:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Your identification photo (if you choose to upload one)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  This is stored securely to enable sharing your medical card with healthcare providers. The identification photo is stored separately from your medical data and is only associated with your medical card when you choose to share it.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">4. No Medical Data in the Cloud</h2>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>We do not store any of your medical information in the cloud.</strong> Your medical conditions, medications, allergies, emergency contacts, and health notes remain exclusively on your device. We have no servers collecting, storing, or processing your medical data.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">5. No Analytics or Tracking</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We do not track, analyze, or monitor your medical information. Specifically:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>No analytics tools tracking your medical data</li>
                  <li>No behavioral tracking of what information you enter</li>
                  <li>No usage patterns collected from your medical forms</li>
                  <li>No third-party trackers with access to your health information</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">6. No Selling or Sharing of Data</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, rent, trade, or share your personal or medical information with any third parties for commercial purposes. Your data is yours alone.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">7. User Control</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  You have complete control over your data:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Edit or update your information at any time</li>
                  <li>Delete specific entries or all data</li>
                  <li>Choose when and with whom to share your medical card</li>
                  <li>Remove the App and all associated data from your device</li>
                  <li>Clear your browser data to remove all local information</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">8. Sharing Your Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you choose to share your medical card (via PDF, QR code, or other methods), you are responsible for controlling who receives this information. We recommend only sharing with trusted healthcare providers and being cautious about distributing your medical information.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">9. Device Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Since your data is stored on your device, we strongly recommend:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Using a secure device password or biometric lock</li>
                  <li>Keeping your device's operating system updated</li>
                  <li>Being cautious when using the App on shared or public devices</li>
                  <li>Backing up your device regularly</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">10. Legal Acceptance Records</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We store a minimal record locally on your device indicating that you have accepted our Terms & Conditions and Privacy Policy, including the version number and timestamp. This record contains no medical or personal information.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">11. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If we make material changes to this Privacy Policy, we will update the version number and require you to review and accept the new policy before continuing to use the App.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">12. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions or concerns about this Privacy Policy or how we handle your information, please contact us through the appropriate channels provided in the App.
                </p>
              </div>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                By using MedBridge, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}