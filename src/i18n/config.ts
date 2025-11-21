import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frPresentation from './locales/fr/presentation.json';
import enPresentation from './locales/en/presentation.json';

const resources = {
  fr: {
    presentation: frPresentation,
  },
  en: {
    presentation: enPresentation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('presentationLanguage') || 'fr',
    fallbackLng: 'fr',
    ns: ['presentation'],
    defaultNS: 'presentation',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
