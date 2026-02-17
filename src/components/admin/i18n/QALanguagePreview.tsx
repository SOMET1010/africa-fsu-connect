import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LANGUAGES, type SupportedLanguage } from '@/i18n/languages';
import frTranslations from '@/i18n/translations/fr.json';
import enTranslations from '@/i18n/translations/en.json';
import ptTranslations from '@/i18n/translations/pt.json';
import arTranslations from '@/i18n/translations/ar.json';

const allTranslations: Record<SupportedLanguage, Record<string, string>> = {
  fr: frTranslations as Record<string, string>,
  en: enTranslations as Record<string, string>,
  pt: ptTranslations as Record<string, string>,
  ar: arTranslations as Record<string, string>,
};

// Sample keys grouped by UI area
const SAMPLE_KEYS: Record<string, string[]> = {
  'Navigation': ['nav.network', 'nav.dashboard', 'nav.indicators', 'nav.projects', 'nav.forum', 'nav.resources', 'nav.events'],
  'Boutons & Actions': ['actions.save', 'actions.cancel', 'actions.delete', 'actions.edit', 'actions.search', 'actions.submit', 'actions.close'],
  'Dashboard': ['dashboard.title', 'dashboard.welcome', 'dashboard.activity', 'dashboard.members'],
  'Authentification': ['auth.login', 'auth.register', 'auth.logout', 'auth.email', 'auth.password'],
  'Messages communs': ['common.loading', 'common.error', 'common.success', 'common.noData', 'common.confirm'],
};

interface QALanguagePreviewProps {
  selectedLang: SupportedLanguage;
}

export const QALanguagePreview = ({ selectedLang }: QALanguagePreviewProps) => {
  const langConfig = LANGUAGES[selectedLang];
  const translations = allTranslations[selectedLang];

  const preview = useMemo(() => {
    return Object.entries(SAMPLE_KEYS).map(([section, keys]) => ({
      section,
      items: keys.map(key => ({
        key,
        value: translations[key] || '',
        missing: !translations[key],
      })),
    }));
  }, [translations]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{langConfig.flag}</span>
          <span>Aperçu — {langConfig.label}</span>
          <Badge variant={langConfig.direction === 'rtl' ? 'destructive' : 'secondary'} className="ml-auto">
            {langConfig.direction.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4" dir={langConfig.direction}>
          {preview.map(({ section, items }) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2" dir="ltr">{section}</h4>
              <div className="grid gap-1">
                {items.map(({ key, value, missing }) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between px-3 py-1.5 rounded text-sm ${
                      missing ? 'bg-destructive/10 border border-destructive/30' : 'bg-muted/30'
                    }`}
                  >
                    <code className="text-xs text-muted-foreground font-mono shrink-0" dir="ltr">{key}</code>
                    <span className={`${missing ? 'text-destructive italic' : 'text-foreground'} ${langConfig.direction === 'rtl' ? 'text-right' : 'text-left'} ml-4`}>
                      {missing ? '— manquant —' : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
