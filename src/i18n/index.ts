import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationsInEng from '../locales/en/common.json';
import translationsInKannad from '../locales/kn/common.json';
import translationsInHindi from '../locales/hn/common.json';

// the translations
const resources = {
  en: {
    translation: translationsInEng
  },
  kn: {
    translation: translationsInKannad
  },
  hi: {
    translation: translationsInHindi
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources, // resources are important to load translations for the languages.
    lng: localStorage.getItem("lang"), // It acts as default language. When the site loads, content is shown in this language.  
    debug: true,
    fallbackLng: "en", // use de if selected language is not available
    interpolation: {
      escapeValue: false
    },
    ns: "translation", // namespaces help to divide huge translations into multiple small files.
    defaultNS: "translation"
  });

export default i18n;