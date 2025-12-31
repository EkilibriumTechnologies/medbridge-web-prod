import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" },
    { code: "pt", label: "PT" },
    { code: "fr", label: "FR" },
  ];

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="outline"
          size="sm"
          onClick={() => setLanguage(lang.code as "es" | "en" | "pt" | "fr")}
          className={`text-white border-white/30 hover:bg-white/20 hover:text-white transition-all ${
            language === lang.code ? "bg-white/20 border-white/60" : "bg-transparent"
          }`}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}