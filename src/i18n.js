import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import he from './locales/he.json';
import ru from './locales/ru.json';

const resources = {
  en: { translation: en },
  he: { translation: he },
  ru: { translation: ru },
};

// Simple language persistence helper
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safe from XSS
    },
  });

// Set direction based on language
const updateDir = (lang) => {
    const dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
};

// Initialize direction
updateDir(savedLanguage);

// Listen for changes
i18n.on('languageChanged', (lng) => {
    updateDir(lng);
    localStorage.setItem('i18nextLng', lng);
});

export default i18n;
