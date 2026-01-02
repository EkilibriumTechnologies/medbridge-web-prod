import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "es" | "en" | "pt";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoaded: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Hero Section
    "hero.title": "Tu Información Médica,",
    "hero.titleHighlight": "Siempre Contigo",
    "hero.subtitle": "Accede a tu historial médico, alergias y contactos de emergencia en cualquier momento. Un código QR que puede salvar tu vida.",
    "hero.cta": "Crea tu Medical ID",
    "hero.viewCard": "Ver tu Medical Card",
    "hero.learnMore": "Conocer Más",

    // Problem Section
    "problem.title": "¿Te ha pasado esto?",
    "problem.item1": "Emergencias médicas en países extranjeros donde no hablas el idioma",
    "problem.item2": "Sin acceso a internet cuando más lo necesitas",
    "problem.item3": "Pérdida de tiempo crítico tratando de comunicar tu historial médico",

    // Solution Section
    "solution.title": "MedBridge es tu solución",
    "solution.item1": "Tarjeta médica digital segura con toda tu información",
    "solution.item2": "Funciona sin internet - acceso offline garantizado",
    "solution.item3": "Genera reportes médicos en PDF instantáneamente",
    "solution.item4": "Traducción automática a múltiples idiomas",

    // Access Section
    "access.title": "Acceso en Emergencias",
    "access.subtitle": "Diseñado para primeros auxilios. Escanea el QR y obtén información vital al instante, incluso sin conexión a internet.",
    "access.cta": "Crea tu Medical ID",
    "access.viewCard": "Ver tu Medical Card",

    // Features Section
    "features.title": "Características Principales",
    "features.subtitle": "Todo lo que necesitas para tu seguridad médica",
    "features.item1": "Perfil médico personal",
    "features.item2": "Tipo de sangre y alergias",
    "features.item3": "Contactos de emergencia",
    "features.item4": "Información del médico",
    "features.item5": "Tarjeta médica lista para emergencias",
    "features.item6": "Comparte reporte médico por email cuando lo necesites",

    // Privacy Section
    "privacy.title": "Tus datos permanecen privados.",
    "privacy.subtitle": "Tú decides quién ve tu información",
    "privacy.point1": "Sin almacenamiento en la nube",
    "privacy.point2": "Sin servidores",
    "privacy.point3": "Datos guardados localmente en tu dispositivo",
    "privacy.point4": "Tú controlas cuándo se comparte",

    // Form Steps
    "form.step": "Paso",
    "form.of": "de",
    
    // Form Sections
    "form.sections.personalInfo": "Información Personal",
    "form.sections.medicalHistory": "Historial Médico",
    "form.sections.emergencyContact": "Contacto de Emergencia",
    "form.sections.insurance": "Seguro Médico",
    "form.sections.additionalInfo": "Información Adicional",
    
    // Form Fields
    "form.fields.firstName": "Nombre",
    "form.fields.lastName": "Apellido",
    "form.fields.dateOfBirth": "Fecha de Nacimiento",
    "form.fields.gender": "Género",
    "form.fields.phoneNumber": "Teléfono",
    "form.fields.email": "Correo Electrónico",
    "form.fields.address": "Dirección",
    "form.fields.city": "Ciudad",
    "form.fields.state": "Estado/Provincia",
    "form.fields.zipCode": "Código Postal",
    "form.fields.country": "País",
    "form.fields.bloodType": "Tipo de Sangre",
    "form.fields.allergies": "Alergias",
    "form.fields.currentMedications": "Medicamentos Actuales",
    "form.fields.medicalConditions": "Condiciones Médicas",
    "form.fields.chronicIllnesses": "Enfermedades Crónicas",
    "form.fields.pastSurgeries": "Cirugías Previas",
    "form.fields.disabilities": "Discapacidades",
    "form.fields.emergencyContactName": "Nombre del Contacto",
    "form.fields.emergencyContactPhone": "Teléfono del Contacto",
    "form.fields.emergencyContactEmail": "Email del Contacto",
    "form.fields.emergencyContactRelationship": "Relación",
    "form.fields.insuranceProvider": "Proveedor de Seguro",
    "form.fields.policyNumber": "Número de Póliza",
    "form.fields.groupNumber": "Número de Grupo",
    "form.fields.insurancePhone": "Teléfono del Seguro",
    "form.fields.primaryPhysicianName": "Nombre del Médico",
    "form.fields.primaryPhysicianPhone": "Teléfono del Médico",
    "form.fields.primaryPhysicianClinic": "Clínica/Hospital",
    "form.fields.specialInstructions": "Instrucciones Especiales",
    "form.fields.additionalNotes": "Notas Adicionales",

    // Form Personal Information
    "form.personal.title": "Información Personal",
    "form.personal.fullName": "Nombre Completo",
    "form.personal.fullNamePlaceholder": "Ingresa tu nombre completo",
    "form.personal.dateOfBirth": "Fecha de Nacimiento",
    "form.personal.nationality": "Nacionalidad",
    "form.personal.nationalityPlaceholder": "Ingresa tu nacionalidad",
    "form.personal.gender": "Estado Civil",
    "form.personal.genderPlaceholder": "Selecciona estado civil",
    "form.personal.passportNumber": "Número de Pasaporte",
    "form.personal.passportNumberPlaceholder": "Ingresa número de pasaporte",
    "form.personal.address": "Dirección Permanente",
    "form.personal.addressPlaceholder": "Ingresa tu dirección",
    "form.personal.bloodType": "Tipo de Sangre",
    "form.personal.bloodTypePlaceholder": "Selecciona tu tipo de sangre",

    // Form Medical History
    "form.history.title": "Historial Médico",
    "form.history.chronicConditions": "Diagnósticos Previos",
    "form.history.chronicConditionsPlaceholder": "Ingresa diagnósticos previos",
    "form.history.currentMedications": "Medicamentos Actuales",
    "form.history.currentMedicationsPlaceholder": "Ingresa medicamentos actuales",
    "form.history.previousSurgeries": "Cirugías Previas",
    "form.history.previousSurgeriesPlaceholder": "Ingresa cirugías previas",
    "form.history.allergies": "Alergias a Medicamentos",
    "form.history.allergiesPlaceholder": "Ingresa alergias a medicamentos",

    // Form Emergency Contacts
    "form.emergency.title": "Contacto de Emergencia Principal",
    "form.emergency.name": "Nombre Completo",
    "form.emergency.namePlaceholder": "Ingresa nombre completo",
    "form.emergency.phone": "Teléfono Móvil",
    "form.emergency.phonePlaceholder": "Ingresa número de teléfono",
    "form.emergency.email": "Correo Electrónico",
    "form.emergency.emailPlaceholder": "Ingresa correo electrónico",

    // Form Insurance & Doctor
    "form.insurance.primaryPhysician": "Médico de Cabecera",
    "form.insurance.primaryPhysicianPlaceholder": "Nombre del médico",
    "form.insurance.physicianPhone": "Teléfono del Médico",
    "form.insurance.physicianPhonePlaceholder": "Teléfono del médico",

    // Form Additional
    "form.additional.advanceDirectives": "¿Acepta Transfusiones de Sangre?",

    // Form Review
    "form.review.title": "Revisar Información",
    "form.review.subtitle": "Revisa tus datos antes de guardar",
    "form.review.personalInfo": "Información Personal",
    "form.review.medicalHistory": "Historial Médico",
    "form.review.emergencyContact": "Contacto de Emergencia",
    "form.review.submit": "Guardar y Continuar",
    "form.review.uploadIdOptional": "Opcional: Sube una foto de tu ID para verificación",
    "form.review.uploadId": "Subir Identificación",

    // Common
    "common.optional": "(Opcional)",
    "common.yes": "Sí",
    "common.no": "No",
    "common.next": "Siguiente",
    "common.back": "Atrás",
    "common.unknown": "No especificado",
    "common.notes": "Notas",

    // Validation
    "validation.required": "Este campo es obligatorio",
    "validation.invalidEmail": "Correo electrónico inválido",
    "validation.invalidPhone": "Número de teléfono inválido",
    "validation.invalidDate": "Fecha inválida",

    // Card
    "card.noProfile": "No hay perfil médico",
    "card.createProfilePrompt": "Crea tu perfil médico para acceder a tu tarjeta de emergencia",
    "card.createProfile": "Crear Perfil Médico",
    "card.name": "Nombre",
    "card.dob": "Fecha de Nacimiento",
    "card.bloodType": "Tipo de Sangre",
    "card.allergies": "Alergias",
    "card.currentMedications": "Medicamentos Actuales",
    "card.medicalConditions": "Condiciones Médicas",
    "card.current": "Actuales",
    "card.chronic": "Crónicas",
    "card.surgicalHistory": "Historial Quirúrgico",
    "card.emergencyContact": "Contacto de Emergencia",
    "card.primaryPhysician": "Médico de Cabecera",
    "card.specialInstructions": "Instrucciones Especiales",
    "card.additionalNotes": "Notas Adicionales",
    "card.phone": "Teléfono",
    "card.none": "Ninguna",
    "card.notSpecified": "No especificado",
    "card.edit": "Editar",
    "card.share": "Compartir",
    "card.viewId": "Ver Identificación",

    // PDF/Card
    "card.title": "Medical ID",
    "card.scan": "Escanear para ver detalles completos",
    "pdf.generated": "Generado por MedBridge",
    "pdf.footerLine1": "En caso de emergencia, escanee el código QR.",
    "pdf.footerLine2": "Los datos médicos se almacenan localmente.",
    "pdf.button": "Generar PDF"
  },
  en: {
    // Hero Section
    "hero.title": "Your Medical Information,",
    "hero.titleHighlight": "Always With You",
    "hero.subtitle": "Access your medical history, allergies, and emergency contacts anytime. A QR code that can save your life.",
    "hero.cta": "Create Your Medical ID",
    "hero.viewCard": "View Your Medical Card",
    "hero.learnMore": "Learn More",

    // Problem Section
    "problem.title": "Has this happened to you?",
    "problem.item1": "Medical emergencies in foreign countries where you don't speak the language",
    "problem.item2": "No internet access when you need it most",
    "problem.item3": "Wasting critical time trying to communicate your medical history",

    // Solution Section
    "solution.title": "MedBridge is your solution",
    "solution.item1": "Secure digital medical card with all your information",
    "solution.item2": "Works without internet - guaranteed offline access",
    "solution.item3": "Generate medical reports in PDF instantly",
    "solution.item4": "Automatic translation to multiple languages",

    // Access Section
    "access.title": "Emergency Access",
    "access.subtitle": "Designed for first responders. Scan the QR and get vital information instantly, even offline.",
    "access.cta": "Create Your Medical ID",
    "access.viewCard": "View Your Medical Card",

    // Features Section
    "features.title": "Key Features",
    "features.subtitle": "Everything you need for your medical safety",
    "features.item1": "Personal medical profile",
    "features.item2": "Blood type and allergies",
    "features.item3": "Emergency contacts",
    "features.item4": "Doctor information",
    "features.item5": "Medical card ready for emergencies",
    "features.item6": "Share medical report by email when needed",

    // Privacy Section
    "privacy.title": "Your data stays private.",
    "privacy.subtitle": "You decide who sees your information",
    "privacy.point1": "No cloud storage",
    "privacy.point2": "No servers",
    "privacy.point3": "Data saved locally on your device",
    "privacy.point4": "You control when it's shared",

    // Form Steps
    "form.step": "Step",
    "form.of": "of",
    
    // Form Sections
    "form.sections.personalInfo": "Personal Information",
    "form.sections.medicalHistory": "Medical History",
    "form.sections.emergencyContact": "Emergency Contact",
    "form.sections.insurance": "Medical Insurance",
    "form.sections.additionalInfo": "Additional Information",
    
    // Form Fields
    "form.fields.firstName": "First Name",
    "form.fields.lastName": "Last Name",
    "form.fields.dateOfBirth": "Date of Birth",
    "form.fields.gender": "Gender",
    "form.fields.phoneNumber": "Phone Number",
    "form.fields.email": "Email",
    "form.fields.address": "Address",
    "form.fields.city": "City",
    "form.fields.state": "State/Province",
    "form.fields.zipCode": "ZIP Code",
    "form.fields.country": "Country",
    "form.fields.bloodType": "Blood Type",
    "form.fields.allergies": "Allergies",
    "form.fields.currentMedications": "Current Medications",
    "form.fields.medicalConditions": "Medical Conditions",
    "form.fields.chronicIllnesses": "Chronic Illnesses",
    "form.fields.pastSurgeries": "Past Surgeries",
    "form.fields.disabilities": "Disabilities",
    "form.fields.emergencyContactName": "Contact Name",
    "form.fields.emergencyContactPhone": "Contact Phone",
    "form.fields.emergencyContactEmail": "Contact Email",
    "form.fields.emergencyContactRelationship": "Relationship",
    "form.fields.insuranceProvider": "Insurance Provider",
    "form.fields.policyNumber": "Policy Number",
    "form.fields.groupNumber": "Group Number",
    "form.fields.insurancePhone": "Insurance Phone",
    "form.fields.primaryPhysicianName": "Physician Name",
    "form.fields.primaryPhysicianPhone": "Physician Phone",
    "form.fields.primaryPhysicianClinic": "Clinic/Hospital",
    "form.fields.specialInstructions": "Special Instructions",
    "form.fields.additionalNotes": "Additional Notes",

    // Form Personal Information
    "form.personal.title": "Personal Information",
    "form.personal.fullName": "Full Name",
    "form.personal.fullNamePlaceholder": "Enter your full name",
    "form.personal.dateOfBirth": "Date of Birth",
    "form.personal.nationality": "Nationality",
    "form.personal.nationalityPlaceholder": "Enter your nationality",
    "form.personal.gender": "Marital Status",
    "form.personal.genderPlaceholder": "Select marital status",
    "form.personal.passportNumber": "Passport Number",
    "form.personal.passportNumberPlaceholder": "Enter passport number",
    "form.personal.address": "Permanent Address",
    "form.personal.addressPlaceholder": "Enter your address",
    "form.personal.bloodType": "Blood Type",
    "form.personal.bloodTypePlaceholder": "Select your blood type",

    // Form Medical History
    "form.history.title": "Medical History",
    "form.history.chronicConditions": "Previous Diagnoses",
    "form.history.chronicConditionsPlaceholder": "Enter previous diagnoses",
    "form.history.currentMedications": "Current Medications",
    "form.history.currentMedicationsPlaceholder": "Enter current medications",
    "form.history.previousSurgeries": "Previous Surgeries",
    "form.history.previousSurgeriesPlaceholder": "Enter previous surgeries",
    "form.history.allergies": "Medication Allergies",
    "form.history.allergiesPlaceholder": "Enter medication allergies",

    // Form Emergency Contacts
    "form.emergency.title": "Primary Emergency Contact",
    "form.emergency.name": "Full Name",
    "form.emergency.namePlaceholder": "Enter full name",
    "form.emergency.phone": "Mobile Phone",
    "form.emergency.phonePlaceholder": "Enter phone number",
    "form.emergency.email": "Email",
    "form.emergency.emailPlaceholder": "Enter email",

    // Form Insurance & Doctor
    "form.insurance.primaryPhysician": "Primary Physician",
    "form.insurance.primaryPhysicianPlaceholder": "Doctor's name",
    "form.insurance.physicianPhone": "Physician Phone",
    "form.insurance.physicianPhonePlaceholder": "Doctor's phone",

    // Form Additional
    "form.additional.advanceDirectives": "Accepts Blood Transfusions?",

    // Form Review
    "form.review.title": "Review Information",
    "form.review.subtitle": "Review your data before saving",
    "form.review.personalInfo": "Personal Information",
    "form.review.medicalHistory": "Medical History",
    "form.review.emergencyContact": "Emergency Contact",
    "form.review.submit": "Save and Continue",
    "form.review.uploadIdOptional": "Optional: Upload a photo of your ID for verification",
    "form.review.uploadId": "Upload Identification",

    // Common
    "common.optional": "(Optional)",
    "common.yes": "Yes",
    "common.no": "No",
    "common.next": "Next",
    "common.back": "Back",
    "common.unknown": "Not specified",
    "common.notes": "Notes",

    // Validation
    "validation.required": "This field is required",
    "validation.invalidEmail": "Invalid email",
    "validation.invalidPhone": "Invalid phone number",
    "validation.invalidDate": "Invalid date",

    // Card
    "card.noProfile": "No Medical Profile",
    "card.createProfilePrompt": "Create your medical profile to access your emergency card",
    "card.createProfile": "Create Medical Profile",
    "card.name": "Name",
    "card.dob": "Date of Birth",
    "card.bloodType": "Blood Type",
    "card.allergies": "Allergies",
    "card.currentMedications": "Current Medications",
    "card.medicalConditions": "Medical Conditions",
    "card.current": "Current",
    "card.chronic": "Chronic",
    "card.surgicalHistory": "Surgical History",
    "card.emergencyContact": "Emergency Contact",
    "card.primaryPhysician": "Primary Physician",
    "card.specialInstructions": "Special Instructions",
    "card.additionalNotes": "Additional Notes",
    "card.phone": "Phone",
    "card.none": "None",
    "card.notSpecified": "Not specified",
    "card.edit": "Edit",
    "card.share": "Share",
    "card.viewId": "View Identification",

    // PDF/Card
    "card.title": "Medical ID",
    "card.scan": "Scan to view full details",
    "pdf.generated": "Generated by MedBridge",
    "pdf.footerLine1": "In case of emergency, scan the QR code.",
    "pdf.footerLine2": "Medical data is stored locally.",
    "pdf.button": "Generate PDF"
  },
  pt: {
    // Hero Section
    "hero.title": "Sua Informação Médica,",
    "hero.titleHighlight": "Sempre Com Você",
    "hero.subtitle": "Acesse seu histórico médico, alergias e contatos de emergência a qualquer momento. Um código QR que pode salvar sua vida.",
    "hero.cta": "Criar Seu Medical ID",
    "hero.viewCard": "Ver Seu Medical Card",
    "hero.learnMore": "Saiba Mais",

    // Problem Section
    "problem.title": "Isso já aconteceu com você?",
    "problem.item1": "Emergências médicas em países estrangeiros onde você não fala o idioma",
    "problem.item2": "Sem acesso à internet quando mais precisa",
    "problem.item3": "Perda de tempo crítico tentando comunicar seu histórico médico",

    // Solution Section
    "solution.title": "MedBridge é sua solução",
    "solution.item1": "Cartão médico digital seguro com todas as suas informações",
    "solution.item2": "Funciona sem internet - acesso offline garantido",
    "solution.item3": "Gera relatórios médicos em PDF instantaneamente",
    "solution.item4": "Tradução automática para vários idiomas",

    // Access Section
    "access.title": "Acesso em Emergências",
    "access.subtitle": "Projetado para socorristas. Escaneie o QR e obtenha informações vitais instantaneamente, mesmo offline.",
    "access.cta": "Criar Seu Medical ID",
    "access.viewCard": "Ver Seu Medical Card",

    // Features Section
    "features.title": "Principais Recursos",
    "features.subtitle": "Tudo o que você precisa para sua segurança médica",
    "features.item1": "Perfil médico pessoal",
    "features.item2": "Tipo sanguíneo e alergias",
    "features.item3": "Contatos de emergência",
    "features.item4": "Informações do médico",
    "features.item5": "Cartão médico pronto para emergências",
    "features.item6": "Compartilhe relatório médico por email quando precisar",

    // Privacy Section
    "privacy.title": "Seus dados permanecem privados.",
    "privacy.subtitle": "Você decide quem vê suas informações",
    "privacy.point1": "Sem armazenamento na nuvem",
    "privacy.point2": "Sem servidores",
    "privacy.point3": "Dados salvos localmente no seu dispositivo",
    "privacy.point4": "Você controla quando compartilhar",

    // Form Steps
    "form.step": "Passo",
    "form.of": "de",
    
    // Form Sections
    "form.sections.personalInfo": "Informação Pessoal",
    "form.sections.medicalHistory": "Histórico Médico",
    "form.sections.emergencyContact": "Contato de Emergência",
    "form.sections.insurance": "Seguro Médico",
    "form.sections.additionalInfo": "Informação Adicional",
    
    // Form Fields
    "form.fields.firstName": "Primeiro Nome",
    "form.fields.lastName": "Sobrenome",
    "form.fields.dateOfBirth": "Data de Nascimento",
    "form.fields.gender": "Gênero",
    "form.fields.phoneNumber": "Telefone",
    "form.fields.email": "Email",
    "form.fields.address": "Endereço",
    "form.fields.city": "Cidade",
    "form.fields.state": "Estado/Província",
    "form.fields.zipCode": "Código Postal",
    "form.fields.country": "País",
    "form.fields.bloodType": "Tipo Sanguíneo",
    "form.fields.allergies": "Alergias",
    "form.fields.currentMedications": "Medicamentos Atuais",
    "form.fields.medicalConditions": "Condições Médicas",
    "form.fields.chronicIllnesses": "Doenças Crônicas",
    "form.fields.pastSurgeries": "Cirurgias Anteriores",
    "form.fields.disabilities": "Deficiências",
    "form.fields.emergencyContactName": "Nome do Contato",
    "form.fields.emergencyContactPhone": "Telefone do Contato",
    "form.fields.emergencyContactEmail": "Email do Contato",
    "form.fields.emergencyContactRelationship": "Relacionamento",
    "form.fields.insuranceProvider": "Provedor de Seguro",
    "form.fields.policyNumber": "Número da Apólice",
    "form.fields.groupNumber": "Número do Grupo",
    "form.fields.insurancePhone": "Telefone do Seguro",
    "form.fields.primaryPhysicianName": "Nome do Médico",
    "form.fields.primaryPhysicianPhone": "Telefone do Médico",
    "form.fields.primaryPhysicianClinic": "Clínica/Hospital",
    "form.fields.specialInstructions": "Instruções Especiais",
    "form.fields.additionalNotes": "Notas Adicionais",

    // Form Personal Information
    "form.personal.title": "Informação Pessoal",
    "form.personal.fullName": "Nome Completo",
    "form.personal.fullNamePlaceholder": "Digite seu nome completo",
    "form.personal.dateOfBirth": "Data de Nascimento",
    "form.personal.nationality": "Nacionalidade",
    "form.personal.nationalityPlaceholder": "Digite sua nacionalidade",
    "form.personal.gender": "Estado Civil",
    "form.personal.genderPlaceholder": "Selecione estado civil",
    "form.personal.passportNumber": "Número do Passaporte",
    "form.personal.passportNumberPlaceholder": "Digite número do passaporte",
    "form.personal.address": "Endereço Permanente",
    "form.personal.addressPlaceholder": "Digite seu endereço",
    "form.personal.bloodType": "Tipo Sanguíneo",
    "form.personal.bloodTypePlaceholder": "Selecione seu tipo sanguíneo",

    // Form Medical History
    "form.history.title": "Histórico Médico",
    "form.history.chronicConditions": "Diagnósticos Anteriores",
    "form.history.chronicConditionsPlaceholder": "Digite diagnósticos anteriores",
    "form.history.currentMedications": "Medicamentos Atuais",
    "form.history.currentMedicationsPlaceholder": "Digite medicamentos atuais",
    "form.history.previousSurgeries": "Cirurgias Anteriores",
    "form.history.previousSurgeriesPlaceholder": "Digite cirurgias anteriores",
    "form.history.allergies": "Alergias a Medicamentos",
    "form.history.allergiesPlaceholder": "Digite alergias a medicamentos",

    // Form Emergency Contacts
    "form.emergency.title": "Contato de Emergência Principal",
    "form.emergency.name": "Nome Completo",
    "form.emergency.namePlaceholder": "Digite nome completo",
    "form.emergency.phone": "Telefone Celular",
    "form.emergency.phonePlaceholder": "Digite número de telefone",
    "form.emergency.email": "Email",
    "form.emergency.emailPlaceholder": "Digite email",

    // Form Insurance & Doctor
    "form.insurance.primaryPhysician": "Médico de Família",
    "form.insurance.primaryPhysicianPlaceholder": "Nome do médico",
    "form.insurance.physicianPhone": "Telefone do Médico",
    "form.insurance.physicianPhonePlaceholder": "Telefone do médico",

    // Form Additional
    "form.additional.advanceDirectives": "Aceita Transfusões de Sangue?",

    // Form Review
    "form.review.title": "Revisar Informação",
    "form.review.subtitle": "Revise seus dados antes de salvar",
    "form.review.personalInfo": "Informação Pessoal",
    "form.review.medicalHistory": "Histórico Médico",
    "form.review.emergencyContact": "Contato de Emergência",
    "form.review.submit": "Salvar e Continuar",
    "form.review.uploadIdOptional": "Opcional: Carregue uma foto do seu ID para verificação",
    "form.review.uploadId": "Carregar Identificação",

    // Common
    "common.optional": "(Opcional)",
    "common.yes": "Sim",
    "common.no": "Não",
    "common.next": "Próximo",
    "common.back": "Voltar",
    "common.unknown": "Não especificado",
    "common.notes": "Notas",

    // Validation
    "validation.required": "Este campo é obrigatório",
    "validation.invalidEmail": "Email inválido",
    "validation.invalidPhone": "Número de telefone inválido",
    "validation.invalidDate": "Data inválida",

    // Card
    "card.noProfile": "Sem Perfil Médico",
    "card.createProfilePrompt": "Crie seu perfil médico para acessar seu cartão de emergência",
    "card.createProfile": "Criar Perfil Médico",
    "card.name": "Nome",
    "card.dob": "Data de Nascimento",
    "card.bloodType": "Tipo Sanguíneo",
    "card.allergies": "Alergias",
    "card.currentMedications": "Medicamentos Atuais",
    "card.medicalConditions": "Condições Médicas",
    "card.current": "Atuais",
    "card.chronic": "Crônicas",
    "card.surgicalHistory": "Histórico Cirúrgico",
    "card.emergencyContact": "Contato de Emergência",
    "card.primaryPhysician": "Médico de Família",
    "card.specialInstructions": "Instruções Especiais",
    "card.additionalNotes": "Notas Adicionais",
    "card.phone": "Telefone",
    "card.none": "Nenhuma",
    "card.notSpecified": "Não especificado",
    "card.edit": "Editar",
    "card.share": "Compartilhar",
    "card.viewId": "Ver Identificação",

    // PDF/Card
    "card.title": "Medical ID",
    "card.scan": "Escaneie para ver detalhes completos",
    "pdf.generated": "Gerado por MedBridge",
    "pdf.footerLine1": "Em caso de emergência, escaneie o código QR.",
    "pdf.footerLine2": "Os dados médicos são armazenados localmente.",
    "pdf.button": "Gerar PDF"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("medbridge-language") as Language;
    if (savedLanguage && ["es", "en", "pt"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("medbridge-language", lang);
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}