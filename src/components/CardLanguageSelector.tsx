import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function CardLanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "es" as const, label: "ES" },
    { code: "en" as const, label: "EN" },
    { code: "pt" as const, label: "PT" },
  ];

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-1">
      <Languages className="w-4 h-4 text-gray-500 dark:text-gray-400 ml-1" />
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          size="sm"
          variant={language === lang.code ? "default" : "ghost"}
          className={`
            font-bold min-w-[48px] h-8 transition-all
            ${language === lang.code 
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }
          `}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}