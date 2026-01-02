/**
 * Configuration centrale des langues UAT
 * Les 4 langues officielles de l'Union Africaine des Télécommunications
 */

export type SupportedLanguage = 'fr' | 'en' | 'pt' | 'ar';

export interface LanguageConfig {
  code: SupportedLanguage;
  label: string;        // Nom natif
  labelEn: string;      // Nom anglais
  flag: string;         // Emoji drapeau
  direction: 'ltr' | 'rtl';
}

export const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  fr: {
    code: 'fr',
    label: 'Français',
    labelEn: 'French',
    flag: '🇫🇷',
    direction: 'ltr',
  },
  en: {
    code: 'en',
    label: 'English',
    labelEn: 'English',
    flag: '🇬🇧',
    direction: 'ltr',
  },
  pt: {
    code: 'pt',
    label: 'Português',
    labelEn: 'Portuguese',
    flag: '🇵🇹',
    direction: 'ltr',
  },
  ar: {
    code: 'ar',
    label: 'العربية',
    labelEn: 'Arabic',
    flag: '🇸🇦',
    direction: 'rtl',
  },
};

export const LANGUAGE_LIST = Object.values(LANGUAGES);

export const DEFAULT_LANGUAGE: SupportedLanguage = 'fr';
export const FALLBACK_LANGUAGE: SupportedLanguage = 'fr';

export const isValidLanguage = (lang: string): lang is SupportedLanguage => {
  return ['fr', 'en', 'pt', 'ar'].includes(lang);
};

export const getLanguageDirection = (lang: SupportedLanguage): 'ltr' | 'rtl' => {
  return LANGUAGES[lang]?.direction || 'ltr';
};
