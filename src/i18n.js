import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    // PERFORMANCE FIX: browser "en-US" deta hai to i18next "en-US" AUR "en"
    // dono ke liye backend ko alag request bhejta tha. Ab sirf "en".
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `${API_URL}/localization/strings/{{lng}}`,
    },
    // PERFORMANCE FIX: default mein har component jo useTranslation() use
    // karta hai (jaise ProductCard) tab tak render nahi hota jab tak Laravel se
    // translations na aa jayein. Ab page foran dikhega, text baad mein update hoga.
    react: {
      useSuspense: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
