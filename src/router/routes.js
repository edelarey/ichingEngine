import store from '@/state/store';
import main from '../views/layouts/main';
export default [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home.vue'),
        meta: {
            offline: true,
            layout: main,
            },
        
    },
    {
        path: '/consult',
        name: 'consult',
        component: () => import('../views/pages/consult.vue'),
        meta: {
            offline: true,
            layout: main,
            },
    },
    {
        path: '/astrology',
        name: 'astrology',
        component: () => import('../views/pages/astrology.vue'),
        meta: {
            offline: true,
            layout: main,
            },
    },
    {
        path: '/hexagram_sequence',
        name: 'Sequences',
        component: () => import('../views/pages/hexagram_sequence.vue'),
        meta: {
            offline: true,
            layout: main,
            },
    },
    {
        path: '/hexagrams',
        name: 'hexagrams',
        component: () => import('../views/pages/hexagrams.vue'),
        meta: {
            offline: true,
            layout: main,
            },
    },
    {
        path: '/hexagram_detail',
        name: 'hexagram_detail',
        component: () => import('../views/pages/hexagram_detail.vue'),
        meta: {
            offline: true,
            layout: main,
            },
    },
    {
        path: '/trigrams',
        name: 'trigrams',
        component: () => import('../views/pages/trigrams.vue'),
        meta: {
            offline: true,
            layout: main,
            },
    },
    {
        path: '/trigram_detail',
        name: 'trigram_detail',
        component: () => import('../views/pages/trigram_detail.vue'),
        meta: {
            offline: true,
            layout: main,
            },
    },
    ]
    