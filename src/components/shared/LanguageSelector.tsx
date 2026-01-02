import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { currentLanguage, languageConfig, setLanguage, availableLanguages } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Globe className="h-4 w-4" />
          {showLabel && (
            <>
              <span className="hidden sm:inline">{languageConfig.flag}</span>
              <span className="hidden md:inline">{languageConfig.label}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-scale-in bg-popover">
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLanguage(language.code)}
            className={currentLanguage === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.label}
            {language.direction === 'rtl' && (
              <span className="ml-auto text-xs text-muted-foreground">RTL</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};