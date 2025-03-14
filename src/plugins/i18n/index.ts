import { createI18n } from "vue-i18n";

import es from "./locales/es.json";
import en from "./locales/en.json";

const instance = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    es,
  },
});

export default {
  instance,
};
