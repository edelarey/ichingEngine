import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import VueGoodTablePlugin from 'vue-good-table-next';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createHead } from '@vueuse/head';

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure bundle includes Popper.js

// Import vue-good-table-next CSS
import 'vue-good-table-next/dist/vue-good-table-next.css';


const app = createApp(App);
const head = createHead();
console.log('Vue app created:', head);
// Make Bootstrap available globally
window.bootstrap = bootstrap;

// Use plugins
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(head);
app.use(pinia);
app.use(router);
app.use(VueGoodTablePlugin);

// Mount the app
app.mount('#app');

const savedColor = localStorage.getItem('backgroundColor');
if (savedColor) {
  document.body.style.backgroundColor = savedColor;
} else {
  document.body.style.backgroundColor = '#E6F0FA'; // Default from app.scss
}


document.title = process.env.VUE_APP_TITLE;

// Debug Bootstrap loading
console.log('Bootstrap loaded:', typeof bootstrap !== 'undefined' && typeof bootstrap.Collapse !== 'undefined');