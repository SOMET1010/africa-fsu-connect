import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useTranslation } from "@/hooks/useTranslation";

interface LanguageSelectorProps {
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
}

export const LanguageSelector = ({ 
  variant = "ghost", 
  size = "sm", 
  showLabel = false 
}: LanguageSelectorProps) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useTranslation();

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === preferences.language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Globe className="h-4 w-4" />
          {showLabel && (
            <>
              <span className="hidden sm:inline">{currentLanguage?.flag}</span>
              <span className="hidden md:inline">{currentLanguage?.label}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-scale-in">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => updatePreferences({ language: language.code as 'fr' | 'en' })}
            className={preferences.language === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};