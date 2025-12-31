import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "es" | "en" | "pt";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
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

    // Form
    "form.title": "Tu Ficha Médica",
    "form.subtitle": "Completa tus datos para generar tu tarjeta",
    "form.personal": "Datos Personales",
    "form.medical": "Datos Médicos",
    "form.contacts": "Contactos de Emergencia",
    "form.save": "Guardar Información",
    
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

    // Form
    "form.title": "Your Medical Record",
    "form.subtitle": "Fill in your details to generate your card",
    "form.personal": "Personal Details",
    "form.medical": "Medical Data",
    "form.contacts": "Emergency Contacts",
    "form.save": "Save Information",

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

    // Form
    "form.title": "Sua Ficha Médica",
    "form.subtitle": "Preencha seus dados para gerar seu cartão",
    "form.personal": "Dados Pessoais",
    "form.medical": "Dados Médicos",
    "form.contacts": "Contatos de Emergência",
    "form.save": "Salvar Informações",

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

  useEffect(() => {
    const savedLanguage = localStorage.getItem("medbridge-language") as Language;
    if (savedLanguage && ["es", "en", "pt"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("medbridge-language", lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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