import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import TheContainer from './components/UI/TheContainer.vue';
import BaseButton from './components/UI/BaseButton.vue';
import BaseModal from './components/UI/BaseModal.vue';
import BaseToast from './components/UI/BaseToast.vue';
import BaseAlert from './components/UI/BaseAlert.vue';

const app = createApp(App);

app.use(router);

app.component('the-container',TheContainer);
app.component('base-button',BaseButton);
app.component('base-modal',BaseModal);
app.component('base-toast',BaseToast);
app.component('base-alert',BaseAlert);

app.mount('#app');
