import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './public/locales/en/common.json';
import arTranslation from './public/locales/ar/common.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
    fallbackLng: 'en',  // Default language
    lng: 'en',  // Initially set language
    interpolation: {
      escapeValue: false,  // React already escapes values
    },
  });

export default i18n;
