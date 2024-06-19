
import App from './App.vue';
import store from '@/state/store';
import router from './router';
import BootstrapVue from 'bootstrap-vue-3';
import { createI18n } from 'vue-i18n';
import VueSlideBar from 'vue-slide-bar';
import VueGoodTablePlugin from 'vue-good-table-next';
import PrimeVue from 'primevue/config';
import Tree from 'primevue/tree';
import Simplebar from './components/SimpleBar';
import 'primevue/resources/themes/luna-amber/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import 'simplebar/dist/simplebar.min.css';
import '@/assets/scss/app.scss';
import './assets/multiselect-default.css';
import 'vue-search-input/dist/styles.css';
import SearchInput from 'vue-search-input';
import { createPinia } from 'pinia' // Import
import { createApp, h } from 'vue';

const app = createApp({
    render: () => h(App),
});

const i18n = createI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    //messages, // set locale messages
});


app.use(createPinia()) // Create the root store
app.use(router);
app.use(store);
app.use(i18n);
app.component('VueSlideBar', VueSlideBar);
app.use(BootstrapVue);
app.component('simplebar', Simplebar);
app.use(VueGoodTablePlugin);
app.use(PrimeVue);
app.use(SearchInput);
//app.component('Datepicker', Datepicker);
app.component('Tree', Tree);

router.isReady().then(() => {   
    app.mount('#app');
});