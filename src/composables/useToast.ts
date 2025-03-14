import { useToast as usePrimeToast } from "primevue/usetoast";

const TOAST_LIFE = 3000;

export const useToast = () => {
  const toast = usePrimeToast();

  const info    = (message: string) => toast.add({ closable: false, severity: "info",    summary: message,  life: TOAST_LIFE });
  const success = (message: string) => toast.add({ closable: false, severity: "success", summary: message,  life: TOAST_LIFE });
  const warning = (message: string) => toast.add({ closable: false, severity: "warn",    summary: message,  life: TOAST_LIFE });
  const error   = (message: string) => toast.add({ closable: false, severity: "error",   summary: message,  life: TOAST_LIFE });

  return {
    info,
    success,
    warning,
    error,
  };
};
