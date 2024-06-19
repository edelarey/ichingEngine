import { createRouter, createWebHistory } from 'vue-router';

import routes from './routes';
//import store from '@/state/store';

const router = createRouter({
    history: createWebHistory(process.env.VUE_APP_API_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return {
            x: 0,
            y: 0,
        };
    },
});


export default router;