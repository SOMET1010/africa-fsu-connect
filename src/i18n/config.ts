import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE, isValidLanguage, type SupportedLanguage } from './languages';

// Import translation files
import fr from './translations/fr.json';
import en from './translations/en.json';
import pt from './translations/pt.json';
import ar from './translations/ar.json';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  pt: { translation: pt },
  ar: { translation: ar },
};

// Storage key for language preference
const LANGUAGE_STORAGE_KEY = 'language';

/**
 * Get stored language from localStorage
 * Falls back to default language if stored value is invalid
 */
export const getStoredLanguage = (): SupportedLanguage => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isValidLanguage(stored)) {
      return stored;
    }
    // Also check legacy key for migration
    const legacyStored = localStorage.getItem('presentationLanguage');
    if (legacyStored && isValidLanguage(legacyStored)) {
      // Migrate to new key
      localStorage.setItem(LANGUAGE_STORAGE_KEY, legacyStored);
      localStorage.removeItem('presentationLanguage');
      return legacyStored;
    }
  } catch {
    // localStorage might not be available
  }
  return DEFAULT_LANGUAGE;
};

/**
 * Store language preference in localStorage
 */
export const setStoredLanguage = (lang: SupportedLanguage): void => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // localStorage might not be available
  }
};

/**
 * Change the current language
 */
export const changeLanguage = async (lang: SupportedLanguage): Promise<void> => {
  console.log('[i18n] Changing language to:', lang);
  setStoredLanguage(lang);
  await i18n.changeLanguage(lang);
  
  // Update document direction for RTL languages
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  console.log('[i18n] Language changed successfully. Current i18n.language:', i18n.language);
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: FALLBACK_LANGUAGE,
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Set initial document direction
const initialLang = getStoredLanguage();
document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLang;

export default i18n;
