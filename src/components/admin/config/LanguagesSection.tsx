import { ConfigSection } from './ConfigSection';
import { Languages } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { LanguageConfig } from '@/types/platformConfig';

interface LanguagesSectionProps {
  languages: LanguageConfig[];
  onChange: (languages: LanguageConfig[]) => void;
}

export const LanguagesSection = ({ languages, onChange }: LanguagesSectionProps) => {
  const handleToggle = (code: string, enabled: boolean) => {
    const updated = languages.map(l => 
      l.code === code ? { ...l, enabled } : l
    );
    onChange(updated);
  };

  const handleDefaultChange = (code: string) => {
    const updated = languages.map(l => ({
      ...l,
      isDefault: l.code === code,
      enabled: l.code === code ? true : l.enabled, // La langue par défaut doit être activée
    }));
    onChange(updated);
  };

  const enabledCount = languages.filter(l => l.enabled).length;
  const defaultLang = languages.find(l => l.isDefault);
  const isComplete = enabledCount >= 1 && !!defaultLang;

  return (
    <ConfigSection
      title="Langues de la plateforme"
      description={`${enabledCount} langues activées - Défaut: ${defaultLang?.name || 'Non définie'}`}
      icon={<Languages className="h-5 w-5" />}
      isComplete={isComplete}
    >
      <div className="space-y-4">
        <RadioGroup 
          value={defaultLang?.code} 
          onValueChange={handleDefaultChange}
        >
          {languages.map((lang) => (
            <div 
              key={lang.code} 
              className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={lang.code} id={`default-${lang.code}`} />
                <div>
                  <Label htmlFor={`default-${lang.code}`} className="font-medium cursor-pointer">
                    {lang.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {lang.isDefault ? 'Langue par défaut' : 'Cliquer pour définir par défaut'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {lang.enabled ? 'Activée' : 'Désactivée'}
                </span>
                <Switch
                  checked={lang.enabled}
                  onCheckedChange={(checked) => handleToggle(lang.code, checked)}
                  disabled={lang.isDefault} // Ne peut pas désactiver la langue par défaut
                />
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </ConfigSection>
  );
};
