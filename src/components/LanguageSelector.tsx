import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === "es" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("es")}
        className={language === "es" ? "" : "text-white border-white/30 hover:bg-white/10 hover:text-white"}
      >
        ES
      </Button>
      <Button
        variant={language === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("en")}
        className={language === "en" ? "" : "text-white border-white/30 hover:bg-white/10 hover:text-white"}
      >
        EN
      </Button>
    </div>
  );
}