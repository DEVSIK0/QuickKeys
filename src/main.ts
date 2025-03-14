import "./styles/main.css";

import App      from "./App.vue";
import i18n     from "./plugins/i18n";
import Primevue from "./plugins/primevue";

import { createApp } from "vue";

const app = createApp(App);
app.use(i18n.instance);

app.use(Primevue.PrimeVue, Primevue.config);
app.use(Primevue.ToastService);

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";

app.component("PrimeDataTable", DataTable);
app.component("PrimeColumn", Column);
app.component("PrimeDialog", Dialog);

app.mount("#app");
