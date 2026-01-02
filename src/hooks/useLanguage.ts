/**
 * Hook unifié pour la gestion des langues
 * Combine UserPreferencesContext et i18next pour une API simple
 */
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { LANGUAGES, LANGUAGE_LIST, type SupportedLanguage } from '@/i18n/languages';
import { changeLanguage as i18nChangeLanguage } from '@/i18n/config';

export const useLanguage = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { t, i18n } = useI18nTranslation();
  
  const currentLanguage = preferences.language as SupportedLanguage;
  const languageConfig = LANGUAGES[currentLanguage] || LANGUAGES.fr;
  
  const setLanguage = async (lang: SupportedLanguage) => {
    // Synchroniser i18next
    await i18nChangeLanguage(lang);
    // Mettre à jour les préférences utilisateur
    await updatePreferences({ language: lang });
  };
  
  return {
    /** Code de langue actuel (fr, en, pt, ar) */
    currentLanguage,
    /** Configuration complète de la langue actuelle */
    languageConfig,
    /** Changer la langue */
    setLanguage,
    /** Fonction de traduction i18next */
    t,
    /** Instance i18n complète */
    i18n,
    /** Est-ce une langue RTL? */
    isRTL: languageConfig.direction === 'rtl',
    /** Liste de toutes les langues disponibles */
    availableLanguages: LANGUAGE_LIST,
  };
};

export type { SupportedLanguage };
