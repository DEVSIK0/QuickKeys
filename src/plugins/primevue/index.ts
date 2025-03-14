import ToastService from "primevue/toastservice";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";

const config = {
  theme: {
    preset: definePreset(Aura, {
      semantic: {
        primary: {
          50: "#f4fffb",
          100: "#ccffee",
          200: "#a6ffe1",
          300: "#82ffd3",
          400: "#65fec5",
          500: "#54feb8",
          600: "#46d89c",
          700: "#39b381",
          800: "#2b8c65",
          900: "#1e6649",
          950: "#11402e",
        },
      },
    }),
    options: {
      darkModeSelector: false,
    },
  },
};

export default {
  PrimeVue,
  config,
  ToastService,
};
