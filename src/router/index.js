import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/home.vue';
import Consult from '../views/consult.vue';
import Astrology from '../views/astrology.vue';
import AstrologyChart from '../views/astrology_chart.vue';
import IChingZodiacChart from '../views/iching_zodiac_chart.vue';
import Relationship from '../views/relationship.vue';
import HexagramDetail from '../views/hexagram_detail.vue';
import HexagramSequence from '../views/hexagram_sequence.vue';
import Hexagrams from '../views/hexagrams.vue';
import Trigram from '../views/trigrams.vue';
import TrigramDetail from '../views/trigram_detail.vue';
import About from '../views/about.vue';
import TibetanMantraChart from '../views/tibetan_mantra_chart.vue'; // Import the new component
import WesternAstrology from '../views/western_astrology.vue';
import SolfeggioPlayer from '../views/solfeggio_player.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/consult',
    name: 'Consult',
    component: Consult,
  },
  {
    path: '/astrology',
    name: 'Astrology',
    component: Astrology,
  },
  {
    path: '/astrology_chart',
    name: 'AstrologyChart',
    component: AstrologyChart,
  },
  {
    path: '/iching_zodiac_chart',
    name: 'ComplexAstrologyChart',
    component: IChingZodiacChart,
  },
  {
    path: '/tibetan_mantra_chart',
    name: 'TibetanMantraChart',
    component: TibetanMantraChart,
  },
  {
    path: '/western_astrology',
    name: 'WesternAstrology',
    component: WesternAstrology,
  },
  {
    path: '/relationship',
    name: 'relationship',
    component: Relationship,
  },
  {
    path: '/hexagram_detail',
    name: 'HexagramDetail',
    component: HexagramDetail,
  },
  {
    path: '/hexagram_sequence',
    name: 'HexagramSequence',
    component: HexagramSequence,
  },
  {
    path: '/hexagrams',
    name: 'Hexagrams',
    component: Hexagrams,
  },
  {
    path: '/trigrams',
    name: 'Trigrams',
    component: Trigram,
  },
  {
    path: '/trigram_detail',
    name: 'TrigramDetail',
    component: TrigramDetail,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/solfeggio',
    name: 'SolfeggioPlayer',
    component: SolfeggioPlayer,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;