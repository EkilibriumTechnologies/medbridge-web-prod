import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";

export function CardLanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "es" as const, label: "Español", short: "ES" },
    { code: "en" as const, label: "English", short: "EN" },
    { code: "pt" as const, label: "Português", short: "PT" },
  ];

  const currentLang = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 font-bold shadow-sm"
        >
          {currentLang?.short}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="cursor-pointer font-medium"
          >
            <div className="flex items-center justify-between w-full">
              <span>{lang.label}</span>
              {language === lang.code && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}