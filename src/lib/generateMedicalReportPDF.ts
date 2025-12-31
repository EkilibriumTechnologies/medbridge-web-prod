import jsPDF from "jspdf";
import { MedicalProfile } from "@/types/medical";

interface TranslationFunction {
  (key: string): string;
}

export function generateMedicalReportPDF(
  profile: MedicalProfile,
  t: TranslationFunction,
  language: string
): void {
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;
  
  const languageNames: Record<string, string> = {
    es: "Español",
    en: "English",
    pt: "Português"
  };

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10): number => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.5);
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, y: number): number => {
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, y - 5, pageWidth - (2 * margin), 10, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 2, y + 2);
    doc.setFont("helvetica", "normal");
    return y + 12;
  };

  // Helper function to add field
  const addField = (label: string, value: string, y: number): number => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(label + ":", margin + 2, y);
    doc.setFont("helvetica", "normal");
    return addText(value || t("pdf.noneReported"), margin + 2, y + 5, pageWidth - (2 * margin) - 4, 10);
  };

  // === HEADER ===
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("MedBridge", margin, 15);
  
  doc.setFontSize(14);
  doc.text(t("pdf.reportTitle"), margin, 25);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString(language === "es" ? "es-ES" : language === "en" ? "en-US" : "pt-BR");
  doc.text(`${t("pdf.generatedOn")}: ${currentDate}`, margin, 33);
  doc.text(`${t("pdf.language")}: ${languageNames[language] || "Español"}`, pageWidth - margin - 30, 33);
  
  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // === SECTION 1: PATIENT INFORMATION ===
  yPosition = addSectionHeader(t("pdf.sectionPatient"), yPosition);
  
  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  yPosition = addField(t("pdf.fullName"), fullName, yPosition);
  yPosition = addField(t("pdf.dateOfBirth"), profile.dateOfBirth || "", yPosition + 2);
  yPosition = addField(t("pdf.nationality"), profile.country || "", yPosition + 2);
  
  yPosition += 8;

  // === SECTION 2: MEDICAL BASICS ===
  yPosition = addSectionHeader(t("pdf.sectionMedicalBasics"), yPosition);
  
  yPosition = addField(t("pdf.bloodType"), profile.bloodType || t("card.notSpecified"), yPosition);
  
  yPosition += 8;

  // === SECTION 3: ALLERGIES (WARNING STYLE) ===
  doc.setFillColor(255, 220, 220);
  doc.rect(margin, yPosition - 5, pageWidth - (2 * margin), 10, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 0, 0);
  doc.text("⚠ " + t("pdf.sectionAllergies"), margin + 2, yPosition + 2);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  yPosition += 12;
  
  const allergies = profile.allergies && profile.allergies.trim().length > 0
    ? profile.allergies
    : t("pdf.noneReported");
  yPosition = addField(t("pdf.medicationAllergies"), allergies, yPosition);
  
  yPosition += 8;

  // Check if we need a new page
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = margin;
  }

  // === SECTION 4: MEDICAL HISTORY ===
  yPosition = addSectionHeader(t("pdf.sectionMedicalHistory"), yPosition);
  
  yPosition = addField(
    t("pdf.currentDiagnoses"),
    profile.medicalConditions || t("pdf.noneReported"),
    yPosition
  );
  yPosition = addField(
    t("pdf.previousDiagnoses"),
    profile.chronicIllnesses || t("pdf.noneReported"),
    yPosition + 2
  );
  yPosition = addField(
    t("pdf.currentMedications"),
    profile.currentMedications || t("pdf.noneReported"),
    yPosition + 2
  );
  yPosition = addField(
    t("pdf.surgicalHistory"),
    profile.pastSurgeries || t("pdf.noneReported"),
    yPosition + 2
  );
  
  yPosition += 8;

  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  // === SECTION 5: EMERGENCY CONTACT ===
  yPosition = addSectionHeader(t("pdf.sectionEmergencyContact"), yPosition);
  
  yPosition = addField(
    t("pdf.contactName"),
    profile.emergencyContactName || t("card.notSpecified"),
    yPosition
  );
  yPosition = addField(
    t("pdf.mobilePhone"),
    profile.emergencyContactPhone || t("card.notSpecified"),
    yPosition + 2
  );
  
  if (profile.emergencyContactRelationship) {
    yPosition = addField(
        t("common.relationship"), // Assuming this key exists or defaulting to label
        profile.emergencyContactRelationship,
        yPosition + 2
    );
  }
  
  yPosition += 8;

  // === SECTION 6: PRIMARY PHYSICIAN ===
  if (profile.primaryPhysicianName || profile.primaryPhysicianPhone) {
    yPosition = addSectionHeader(t("pdf.sectionPrimaryPhysician"), yPosition);
    
    yPosition = addField(
      t("pdf.physicianName"),
      profile.primaryPhysicianName || t("card.notSpecified"),
      yPosition
    );
    yPosition = addField(
      t("pdf.physicianPhone"),
      profile.primaryPhysicianPhone || t("card.notSpecified"),
      yPosition + 2
    );
    if (profile.primaryPhysicianClinic) {
      yPosition = addField(
        t("pdf.clinicHospital"),
        profile.primaryPhysicianClinic,
        yPosition + 2
      );
    }
  }

  // === FOOTER ===
  const footerY = pageHeight - 20;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(t("pdf.footerLine1"), pageWidth / 2, footerY, { align: "center" });
  doc.text(t("pdf.footerLine2"), pageWidth / 2, footerY + 4, { align: "center" });

  // Save the PDF
  const fileName = `MedBridge_Medical_Report_${fullName.replace(/\s+/g, "_")}_${currentDate.replace(/\//g, "-")}.pdf`;
  doc.save(fileName);
}