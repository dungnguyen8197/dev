import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import en from "translations/en.json";
import vi from "translations/vi.json";

i18next.use(initReactI18next).init({
  lng: "vi",
  fallbackLng: "en",
  compatibilityJSON: "v3",
  resources: {
    en: {
      translation: en,
    },
    vi: {
      translation: vi,
    },
  },
});

export default i18next;
