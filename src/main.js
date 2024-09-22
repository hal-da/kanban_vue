import {createApp} from 'vue'
import {createPinia} from 'pinia'
import PrimeVue from "primevue/config";
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/md-dark-indigo/theme.css'
import ToastService from 'primevue/toastservice';


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {ripple: true});
app.use(ToastService);

app.mount('#app')
