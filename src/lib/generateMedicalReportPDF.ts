import jsPDF from "jspdf";
import { MedicalProfile } from "@/types/medical";

interface TranslationFunction {
  (key: string): string;
}

type Language = "es" | "en" | "pt";

export function generateMedicalReportPDF(
  profile: MedicalProfile,
  t: TranslationFunction,
  language: Language
): Blob {
  const doc = new jsPDF();
  
  let yPos = 20;
  const lineHeight = 7;
  const sectionSpacing = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * lineHeight;
  };

  // Header - MedBridge branding
  doc.setFillColor(41, 128, 185); // Blue header
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("MedBridge", margin, 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(t("pdf.reportTitle"), margin, 30);
  
  // Date and language in top right
  doc.setFontSize(9);
  const currentDate = new Date().toLocaleDateString(language === "es" ? "es-ES" : language === "pt" ? "pt-BR" : "en-US");
  doc.text(`${t("pdf.generatedOn")}: ${currentDate}`, pageWidth - margin, 20, { align: "right" });
  doc.text(`${t("pdf.language")}: ${language.toUpperCase()}`, pageWidth - margin, 26, { align: "right" });

  yPos = 50;
  doc.setTextColor(0, 0, 0);

  // QR Code placeholder (top right corner)
  const qrSize = 35;
  const qrX = pageWidth - margin - qrSize;
  const qrY = yPos;
  
  // Generate QR code data (emergency info only - no sensitive data)
  const qrData = `MEDBRIDGE EMERGENCY\nName: ${profile.firstName} ${profile.lastName}\nBlood: ${profile.bloodType || "N/A"}\nAllergies: ${profile.allergies ? "YES - See document" : "None"}\nContact: ${profile.emergencyContactPhone || "N/A"}`;
  
  // Draw QR placeholder box
  doc.setDrawColor(200);
  doc.setFillColor(245, 245, 245);
  doc.rect(qrX, qrY, qrSize, qrSize, "FD");
  doc.setFontSize(6);
  doc.text("Emergency QR", qrX + qrSize/2, qrY + qrSize/2, { align: "center" });
  doc.text("Scan for basic info", qrX + qrSize/2, qrY + qrSize/2 + 4, { align: "center" });

  // SECTION: PATIENT INFORMATION
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos, contentWidth - qrSize - 5, 12, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(t("pdf.sectionPatient"), margin + 3, yPos + 8);
  yPos += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // Full Name
  doc.setFont("helvetica", "bold");
  doc.text(`${t("pdf.fullName")}:`, margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${profile.firstName} ${profile.lastName}`, margin + 50, yPos);
  yPos += lineHeight;

  // Date of Birth
  doc.setFont("helvetica", "bold");
  doc.text(`${t("pdf.dateOfBirth")}:`, margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(profile.dateOfBirth || t("pdf.noneReported"), margin + 50, yPos);
  yPos += lineHeight;

  // Nationality (using country field)
  if (profile.country) {
    doc.setFont("helvetica", "bold");
    doc.text(`${t("pdf.nationality")}:`, margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(profile.country, margin + 50, yPos);
    yPos += lineHeight;
  }

  yPos += sectionSpacing;

  // SECTION: MEDICAL BASICS
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos, contentWidth, 12, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(t("pdf.sectionMedicalBasics"), margin + 3, yPos + 8);
  yPos += 18;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${t("pdf.bloodType")}:`, margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(profile.bloodType || t("pdf.noneReported"), margin + 50, yPos);
  yPos += sectionSpacing + lineHeight;

  // SECTION: ALLERGIES (WARNING STYLE)
  doc.setFillColor(255, 235, 235);
  doc.rect(margin, yPos, contentWidth, 12, "F");
  doc.setTextColor(200, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`⚠ ${t("pdf.sectionAllergies")}`, margin + 3, yPos + 8);
  yPos += 18;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${t("pdf.medicationAllergies")}:`, margin, yPos);
  doc.setFont("helvetica", "normal");
  
  const allergiesText = profile.allergies || t("pdf.noneReported");
  const allergiesHeight = addText(allergiesText, margin + 5, yPos + lineHeight, contentWidth - 10);
  yPos += allergiesHeight + sectionSpacing;

  // SECTION: MEDICAL HISTORY
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos, contentWidth, 12, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(t("pdf.sectionMedicalHistory"), margin + 3, yPos + 8);
  yPos += 18;

  doc.setFontSize(10);

  // Current Medical Conditions
  if (profile.medicalConditions) {
    doc.setFont("helvetica", "bold");
    doc.text(`${t("pdf.currentDiagnoses")}:`, margin, yPos);
    doc.setFont("helvetica", "normal");
    const conditionsHeight = addText(profile.medicalConditions, margin + 5, yPos + lineHeight, contentWidth - 10);
    yPos += conditionsHeight + 5;
  }

  // Chronic Illnesses
  if (profile.chronicIllnesses) {
    doc.setFont("helvetica", "bold");
    doc.text(`${t("pdf.previousDiagnoses")}:`, margin, yPos);
    doc.setFont("helvetica", "normal");
    const chronicHeight = addText(profile.chronicIllnesses, margin + 5, yPos + lineHeight, contentWidth - 10);
    yPos += chronicHeight + 5;
  }

  // Current Medications
  if (profile.currentMedications) {
    doc.setFont("helvetica", "bold");
    doc.text(`${t("pdf.currentMedications")}:`, margin, yPos);
    doc.setFont("helvetica", "normal");
    const medsHeight = addText(profile.currentMedications, margin + 5, yPos + lineHeight, contentWidth - 10);
    yPos += medsHeight + 5;
  }

  // Surgical History
  if (profile.pastSurgeries) {
    doc.setFont("helvetica", "bold");
    doc.text(`${t("pdf.surgicalHistory")}:`, margin, yPos);
    doc.setFont("helvetica", "normal");
    const surgeryHeight = addText(profile.pastSurgeries, margin + 5, yPos + lineHeight, contentWidth - 10);
    yPos += surgeryHeight + 5;
  }

  yPos += sectionSpacing;

  // SECTION: EMERGENCY CONTACT
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos, contentWidth, 12, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(t("pdf.sectionEmergencyContact"), margin + 3, yPos + 8);
  yPos += 18;

  doc.setFontSize(10);

  if (profile.emergencyContactName) {
    doc.setFont("helvetica", "bold");
    doc.text(`${t("pdf.contactName")}:`, margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(profile.emergencyContactName, margin + 50, yPos);
    yPos += lineHeight;
  }

  if (profile.emergencyContactPhone) {
    doc.setFont("helvetica", "bold");
    doc.text(`${t("pdf.mobilePhone")}:`, margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(profile.emergencyContactPhone, margin + 50, yPos);
    yPos += lineHeight;
  }

  yPos += sectionSpacing;

  // SECTION: PRIMARY PHYSICIAN
  if (profile.primaryPhysicianName || profile.primaryPhysicianPhone) {
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, contentWidth, 12, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(t("pdf.sectionPrimaryPhysician"), margin + 3, yPos + 8);
    yPos += 18;

    doc.setFontSize(10);

    if (profile.primaryPhysicianName) {
      doc.setFont("helvetica", "bold");
      doc.text(`${t("pdf.physicianName")}:`, margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(profile.primaryPhysicianName, margin + 50, yPos);
      yPos += lineHeight;
    }

    if (profile.primaryPhysicianPhone) {
      doc.setFont("helvetica", "bold");
      doc.text(`${t("pdf.physicianPhone")}:`, margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(profile.primaryPhysicianPhone, margin + 50, yPos);
      yPos += lineHeight;
    }

    if (profile.primaryPhysicianClinic) {
      doc.setFont("helvetica", "bold");
      doc.text(`${t("pdf.clinicHospital")}:`, margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(profile.primaryPhysicianClinic, margin + 50, yPos);
      yPos += lineHeight;
    }
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(t("pdf.footerLine1"), pageWidth / 2, footerY, { align: "center" });
  doc.text(t("pdf.footerLine2"), pageWidth / 2, footerY + 5, { align: "center" });

  // Return as Blob for sharing
  return doc.output("blob");
}

export function generateMedicalReportFileName(profile: MedicalProfile): string {
  const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "-");
  const fullName = `${profile.firstName}_${profile.lastName}`.replace(/\s+/g, "_");
  return `MedBridge_Medical_Report_${fullName}_${currentDate}.pdf`;
}