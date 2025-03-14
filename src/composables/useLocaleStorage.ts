import type { IPhrase } from "../models/IPhrase";
import { useToast } from "./useToast";

export const useLocaleStorage = (onChangeCallback?: () => void) => {
  const toast = useToast();
  
  const checkIfPhraseExists = (phrase: IPhrase) => getPhrases().find((p) => p.text === phrase.text || p.shortcut === phrase.shortcut) ?? null;

  const getPhrases      = () => JSON.parse(window.localStorage.getItem("phrases") || "[]") as IPhrase[];
  const getChatShortcut = () => window.localStorage.getItem("chatShortcut") || "";
  const getLanguage     = () => window.localStorage.getItem("language") || "en";

  const saveChatShortcut = (shortcut: string) => window.localStorage.setItem("chatShortcut", shortcut);
  const saveLanguage     = (language: string) => window.localStorage.setItem("language", language);

  const savePhrases = (newPhrase: IPhrase) => {
    const currentPhrases = getPhrases();
    window.localStorage.setItem(
      "phrases",
      JSON.stringify([...currentPhrases, newPhrase])
    );
    if (onChangeCallback) onChangeCallback();
  };

  const removePhrase = (phrase: IPhrase) => {
    const currentPhrases = getPhrases();
    window.localStorage.setItem(
      "phrases",
      JSON.stringify(currentPhrases.filter((p) => p.shortcut !== phrase.shortcut))
    );
    if (onChangeCallback) onChangeCallback();
  };

  const updatePhrase = (updatedPhrase: IPhrase) => {
    const currentPhrases = getPhrases();
    const index = currentPhrases.findIndex((p) => p.shortcut === updatedPhrase.shortcut);
    if (index !== -1) {
      currentPhrases[index] = { ...updatedPhrase };
      window.localStorage.setItem("phrases", JSON.stringify(currentPhrases));
      if (onChangeCallback) onChangeCallback();
    }
  };

  return {
    getPhrases,
    savePhrases,
    removePhrase,
    updatePhrase,
    checkIfPhraseExists,
    saveChatShortcut,
    getChatShortcut,
    getLanguage,
    saveLanguage
  };
};
