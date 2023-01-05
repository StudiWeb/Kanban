import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import BaseModal from "./components/UI/BaseModal.vue";

const app = createApp(App);

app.use(router);

app.component("base-modal", BaseModal);

app.mount("#app");
