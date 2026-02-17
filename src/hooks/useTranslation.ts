
// Unified translation system - uses i18next JSON files only
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { isValidLanguage, type SupportedLanguage } from '@/i18n/languages';

// Allow any string key for flexibility with JSON files
export type TranslationKey = string;

export const useTranslation = () => {
  const { t: i18nT, i18n } = useI18nTranslation();

  const normalize = (lang?: string): SupportedLanguage => {
    const base = (lang || '').split('-')[0];
    return isValidLanguage(base) ? base : 'fr';
  };

  const currentLanguage = normalize(i18n.resolvedLanguage || i18n.language);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const raw = i18nT(key, params as any);
    const translated = typeof raw === 'string' ? raw : '';

    // If i18next returns the key itself, return empty string to avoid showing raw keys
    if (!translated || translated === key) return '';

    return translated;
  };

  return { t, currentLanguage };
};
