<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import {
  register,
  unregister,
  unregisterAll,
  type ShortcutEvent,
} from "@tauri-apps/plugin-global-shortcut";

import type { IPhrase } from "./models/IPhrase";
import { useLocaleStorage } from "./composables/useLocaleStorage";
import { useShortcut } from "./composables/useShortcut";
import { invoke } from "@tauri-apps/api/core";
import { useToast } from "./composables/useToast";
import { useI18n } from "vue-i18n";

import Toast from "primevue/toast";
import SwitchOnOff from "./components/base/SwitchOnOff.vue";

const { availableShortcuts, updateAvailableShortcuts, openChatShortcut, enableShortcut } =
  useShortcut();
const localeStorage = useLocaleStorage(() => {
  phrases.value = localeStorage.getPhrases();
  openChatShortcut.value = localeStorage.getChatShortcut();
  updateAvailableShortcuts();
});
const toast = useToast();
const { t, locale } = useI18n();

const globalStatus         = ref<boolean>(false);
const phrases              = ref<IPhrase[]>([]);
const phrase               = ref<string>("");
const shortcut             = ref<string>("");
const selectedPhrases      = ref<IPhrase[]>([]);
const showPhraseFormDialog = ref<boolean>(false);

let version = ref<string | null>(null);

const phraseAlreadyExists = computed(() =>
  localeStorage.getPhrases().some((n) => n.text === phrase.value)
);

let isKeyPressed = false;
let isProcessing = false;

const onShortcut = async (event: ShortcutEvent) => {
  if (!globalStatus.value) return;
  if (!isProcessing && !isKeyPressed && event.state === "Pressed") {
    const key = event.shortcut.replace("Key", "").replace("Digit", "");
    const phrase = phrases.value.find((phrase) => phrase.shortcut === key);
    if (phrase) {
      isProcessing = true;
      isKeyPressed = true;
      await unregisterAll();
      try {
        await invoke("press_key", { key: openChatShortcut.value });
        await invoke("type_text", { text: phrase.text });
        await invoke("press_enter");
      } finally {
        await Promise.all(phrases.value.map((p) => register(p.shortcut, onShortcut)));
        isProcessing = false;
        isKeyPressed = false;
      }
    }
  }
};

const closeFormDialog = () => {
  showPhraseFormDialog.value = false;
  clearForm();
};

const clearForm = () => {
  phrase.value   = "";
  shortcut.value = "";
};

const saveNewPhrase = () => {
  const newPhrase: IPhrase = {
    text: phrase.value,
    shortcut: shortcut.value,
    active: false,
    creationDate: new Date(),
  };

  if (localeStorage.checkIfPhraseExists(newPhrase)) {
    toast.error(t("toast.error.exists"));
    return;
  }

  if (globalStatus.value) {
    register(newPhrase.shortcut, onShortcut);
    newPhrase.active = true;
  }
  localeStorage.savePhrases(newPhrase);
  updateAvailableShortcuts();
  clearForm();
  selectedPhrases.value = [];
  toast.success(t("toast.success.add"));
};

const deleteSelectedPhrases = async () => {
  if (selectedPhrases.value.length === phrases.value.length) {
    globalStatus.value = false;
  }

  selectedPhrases.value.forEach(async (phrase) => {
    localeStorage.removePhrase(phrase);
    enableShortcut(phrase.shortcut);
    await unregister(phrase.shortcut);
  });

  selectedPhrases.value = [];
  toast.success(t("toast.success.delete"));
};

const setLanguage = (lang: string) => {
  locale.value = lang;
  localeStorage.saveLanguage(lang);
};

watch(globalStatus, (value) => {
  if (value) {
    phrases.value.forEach((phrase) => {
      phrase.active = true;
      register(phrase.shortcut, onShortcut);
    });
  } else {
    phrases.value.forEach((phrase) => {
      phrase.active = false;
    });
    unregisterAll();
  }
});

onMounted(() => {
  phrases.value = localeStorage.getPhrases();
  locale.value = localeStorage.getLanguage();
  fetch("https://api.github.com/repos/Robbna/quickkeys/commits")
    .then((response) => response.json())
    .then((data) => {
      version.value = data[0]?.sha.slice(0, 7) || 'null';
    });
});
</script>

<template>
  <Teleport to="#overlay">
    <Toast position="top-right" />
  </Teleport>
  <PrimeDialog
    v-model:visible="showPhraseFormDialog"
    modal
    class="phrase-form-dialog"
    close-on-escape
    :draggable="false"
    :style="{ width: '400px' }"
  >
    <template #header>
      <h1 class="title">{{ $t("dialog.title") }}</h1>
    </template>
    <template #closebutton>
      <button class="close" @click="closeFormDialog">
        <i class="fa-solid fa-x"></i>
      </button>
    </template>
    <template #default>
      <!-- ADD PHRASE FORM -->
      <form
        @submit.prevent="saveNewPhrase"
        class="flex flex-col gap-3 h-full w-full items-center justify-between"
      >
        <section class="flex flex-col gap-9 w-full">
          <label>
            <p>{{ $t("form.phrase.text.label") }}</p>
            <input
              type="text"
              v-model="phrase"
              maxlength="36"
              @input="() => (phrase = phrase.replace(/[^A-Za-z0-9 ]/, ''))"
            />
            <small class="error-already-exists" v-if="phraseAlreadyExists">{{
              $t("form.phrase.text.error.exists")
            }}</small>
          </label>
          <label>
            <p>{{ $t("form.phrase.shortcut.label") }}</p>
            <select v-model="shortcut">
              <option
                v-for="shortcut in availableShortcuts"
                :key="shortcut.shortcut"
                :value="shortcut.shortcut"
                :disabled="shortcut.unavailable"
              >
                {{ shortcut.shortcut }}
              </option>
            </select>
          </label>
        </section>
      </form>
    </template>

    <template #footer>
      <footer class="flex gap-4 pt-4">
        <button
          class="submit"
          :disabled="phrase.length === 0 || shortcut.length === 0 || phraseAlreadyExists"
          @click="saveNewPhrase"
        >
          {{ $t("form.phrase.submit") }}
        </button>
      </footer>
    </template>
  </PrimeDialog>
  <!-- MAIN -->
  <main class="h-screen flex flex-col gap-5 p-9">
    <section class="datatable-container h-full overflow-hidden">
      <PrimeDataTable
        :value="phrases"
        v-model:selection="selectedPhrases"
        dataKey="shortcut"
        scrollable
        scrollHeight="flex"
        removableSort
      >
        <template #empty>
          <div class="text-xl text-center w-full flex items-center justify-center">
            <p class="w-[500px] break-words">{{ $t("datatable.phrases.empty") }}</p>
          </div>
        </template>
        <!-- DATATABLE HEADER -->
        <template #header>
          <header class="flex justify-between items-center py-2">
            <div class="header-buttons flex gap-6">
              <button
                class="add flex items-center gap-2"
                @click="showPhraseFormDialog = true"
                :disabled="openChatShortcut === ''"
              >
                <i class="fa-solid fa-plus"></i>
                <span>{{ $t("datatable.buttons.add") }}</span>
              </button>
              <button
                class="delete flex items-center gap-2"
                :disabled="selectedPhrases.length === 0"
                @click="deleteSelectedPhrases"
              >
                <i class="fa-solid fa-trash"></i>
                <span>{{ $t("datatable.buttons.delete") }}</span>
              </button>
            </div>
            <div>
              <label class="flex items-center gap-4">
                <p>{{ $t("datatable.chat.shortcut.label") }}</p>
                <select class="h-full w-[100px]" v-model="openChatShortcut">
                  <option
                    v-for="shortcut in availableShortcuts"
                    :key="shortcut.shortcut"
                    :value="shortcut.shortcut"
                    :disabled="shortcut.unavailable"
                  >
                    {{ shortcut.shortcut }}
                  </option>
                </select>
              </label>
            </div>
          </header>
        </template>
        <!-- DATATABLE COLUMNS -->
        <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem"></PrimeColumn>
        <PrimeColumn
          field="text"
          sortable
          :header="$t('datatable.columns.text')"
        ></PrimeColumn>
        <PrimeColumn
          field="shortcut"
          sortable
          :header="$t('datatable.columns.shortcut')"
        ></PrimeColumn>
        <!-- <PrimeColumn field="active" sortable header="Status">
          <template #body="slotProps">
            <Switch disabled class="check-status" v-model:checked="slotProps.data.active" />
          </template>
        </PrimeColumn> -->
        <PrimeColumn field="creationDate" sortable :header="$t('datatable.columns.date')">
          <template #body="slotProps">
            <span>{{ new Date(slotProps.data.creationDate).toLocaleString() }}</span>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </section>
    <!-- FOOTER -->
    <footer class="flex center items-center justify-center">
      <SwitchOnOff
        v-model:checked="globalStatus"
        class="mt-3"
        :disabled="openChatShortcut === '' || phrases.length === 0"
        :size="[100, 100]"
        :icon-size="40"
        :border-thickness="10"
      />
      <div class="absolute w-full bottom-0 p-4 flex items-center justify-between gap-2">
        <p class="languages flex items-center gap-2">
          <span class="cursor-pointer" @click="() => setLanguage('en')">EN</span>
          <span class="separator"></span>
          <span class="cursor-pointer" @click="() => setLanguage('es')">ES</span>
        </p>
        <small class="version flex items-center gap-2">
          <span>version: {{ version }} </span>
        </small>
      </div>
    </footer>
  </main>
</template>

<style scoped>
.languages {
  color: gray;

  .separator {
    width: 1px;
    height: 20px;
    background-color: gray;
  }
}

.version {
  font-size: 12px;
  color: lightgray;
}

.phrase-form-dialog {
  .title {
    font-size: 23px;
    font-weight: 600;
  }

  .error-already-exists {
    color: var(--danger);
    filter: brightness(150%);
  }

  button {
    &.submit {
      width: 70px;
      height: 30px;
      color: var(--success);
    }

    &.close {
      width: 25px;
      height: 25px;
    }
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
}
input,
select {
  padding: 10px;
  border: none;
  background: none;
  box-shadow: var(--nm-inset);
  outline: none;
  border-radius: 10px;
}

select {
  appearance: none;
  cursor: pointer;
  box-shadow: var(--nm);

  option:disabled {
    color: lightgray;
  }
}

.header-buttons {
  button {
    padding: 10px 20px;
    &.add {
      color: var(--success);
    }

    &.delete {
      color: var(--danger);
    }
  }
}

.datatable-container {
  box-shadow: var(--nm);
  border-radius: 10px;

  :deep(.p-datatable-table-container) {
    &:deep(*:not(.p-datatable-thead)) {
      background-color: transparent !important;
    }
  }

  :deep(.p-datatable-header) {
    background-color: transparent !important;
  }

  :deep(.p-datatable-thead) {
    background-color: var(--color-1) !important;
  }

  :deep(.p-checkbox-box) {
    box-shadow: var(--nm-inset);
    border: none !important;

    :deep(svg) {
      color: var(--color-2) !important;
    }
  }

  :deep(::-webkit-scrollbar) {
    width: 9px;
  }

  :deep(::-webkit-scrollbar-thumb) {
    box-shadow: var(--nm-inset);
    border-radius: 0 0 100px 0;
  }
}
</style>
