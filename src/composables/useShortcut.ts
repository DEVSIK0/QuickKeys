import { ref, onMounted, watch } from "vue";
import { SHORTCUTS } from "../constants/shortcuts";
import { useLocaleStorage } from "./useLocaleStorage";

interface IShortcut {
  shortcut: string;
  unavailable: boolean;
}

export const useShortcut = () => {
  const localeStorage      = useLocaleStorage();
  
  const availableShortcuts = ref<IShortcut[]>([]);
  const openChatShortcut   = ref<string>("");

  const updateAvailableShortcuts = () => {
    availableShortcuts.value = SHORTCUTS.map((shortcut) => ({
      shortcut,
      unavailable: shortcut
        ? shortcut === openChatShortcut.value || localeStorage.getPhrases().some((phrase) => phrase.shortcut === shortcut)
        : false,
    }));
  };

  const disableShortcut = (shortcut: string) => {
    availableShortcuts.value = availableShortcuts.value.map((s) => {
      if (s.shortcut.toUpperCase() === shortcut.toUpperCase()) {
        return {
          ...s,
          available: false,
        };
      }
      return s;
    });
  };

  const enableShortcut = (shortcut: string) => {
    availableShortcuts.value = availableShortcuts.value.map((s) => {
      if (s.shortcut.toUpperCase() === shortcut.toUpperCase()) {
        return {
          ...s,
          available: true,
        };
      }
      return s;
    });
  };

  watch(openChatShortcut, (newShortcut, oldShortcut) => {
    disableShortcut(newShortcut);
    if (oldShortcut) {
      enableShortcut(oldShortcut);
    }
    updateAvailableShortcuts()
    localeStorage.saveChatShortcut(newShortcut);

  });

  onMounted(() => {
    availableShortcuts.value = SHORTCUTS.map((shortcut) => ({
      shortcut,
      unavailable: localeStorage
        .getPhrases()
        .some((phrase) => phrase.shortcut === shortcut),
    }));

    openChatShortcut.value = localeStorage.getChatShortcut();

  });

  return {
    availableShortcuts,
    updateAvailableShortcuts,
    openChatShortcut,
    disableShortcut,
    enableShortcut,
  };
};
