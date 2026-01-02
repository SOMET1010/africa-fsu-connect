/**
 * Hook unifié pour la gestion des langues
 * Utilise i18next comme source de vérité principale
 * Se synchronise avec UserPreferencesContext quand disponible
 */
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { LANGUAGES, LANGUAGE_LIST, type SupportedLanguage, isValidLanguage } from '@/i18n/languages';
import { changeLanguage as i18nChangeLanguage } from '@/i18n/config';
import { useContext } from 'react';

// Safe import of context
import { UserPreferencesContext } from '@/contexts/UserPreferencesContext';

export const useLanguage = () => {
  const { t, i18n } = useI18nTranslation();
  
  // Try to use UserPreferencesContext if available (won't throw)
  const userPrefsContext = useContext(UserPreferencesContext);
  
  // Use i18n language as source of truth
  const i18nLang = i18n.language;
  const currentLanguage: SupportedLanguage = isValidLanguage(i18nLang) ? i18nLang : 'fr';
  const languageConfig = LANGUAGES[currentLanguage] || LANGUAGES.fr;
  
  const setLanguage = async (lang: SupportedLanguage) => {
    // Update i18next (source of truth)
    await i18nChangeLanguage(lang);
    
    // Also update UserPreferencesContext if available
    if (userPrefsContext && userPrefsContext.updatePreferences) {
      try {
        await userPrefsContext.updatePreferences({ language: lang });
      } catch {
        // Context update failed, but i18n is already updated
        console.warn('Failed to sync language with user preferences');
      }
    }
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
