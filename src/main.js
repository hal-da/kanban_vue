import {createApp} from 'vue'
import {createPinia} from 'pinia'
import PrimeVue from "primevue/config";
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/md-dark-indigo/theme.css'
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';


import App from './App.vue'
import router from './router'
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(PrimeVue, {ripple: true});
app.use(ToastService);
app.use(ConfirmationService);
app.use(router)


app.mount('#app')
