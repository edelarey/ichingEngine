<template>
  <div class="about-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">About</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">About</li>
          </ol>
        </nav>
        <p class="mb-0 lead-blurb">
          iChing Engine is a personal project: an I Ching oracle, natal hexagrams after
          Sherrill &amp; Chu, Jyotish and Western charts, and a shared birthday list.
          Readings are educational, not a forecast of events.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <section class="block card mb-4">
        <div class="card-body">
          <h2>What this is</h2>
          <p>
            The I Ching (Yijing, Book of Changes) is a 64-hexagram oracle. This app lets you
            cast a hexagram with coins or yarrow-style lines, then read name, judgement, image, and changing lines.
            It also maps a birth onto three different sky-systems from one saved person.
          </p>
          <p class="mb-0">
            Built by one developer. Open source under
            <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener noreferrer" target="_blank">AGPL-3.0</a>.
            Gender on birth records is Male or Female — I-Ching astrology uses that polarity.
          </p>
        </div>
      </section>

      <h2 class="section-title">In the engine</h2>
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-6 col-lg-4" v-for="item in features" :key="item.to">
          <router-link :to="item.to" class="feature-card card h-100 text-decoration-none">
            <div class="card-body">
              <h3>{{ item.title }}</h3>
              <p class="mb-0">{{ item.text }}</p>
            </div>
          </router-link>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-12 col-lg-6">
          <section class="block card h-100">
            <div class="card-body">
              <h2>Three natal systems</h2>
              <p>
                <strong>I-Ching astrology</strong> is not the coin oracle and not BaZi.
                It follows W. A. Sherrill and W. K. Chu, <em>The Astrology of I Ching</em> (1976):
                Pre-Heaven and Later-Heaven hexagrams, a controlling line, and sexagenary year / month / day.
              </p>
              <p>
                <strong>Jyotish</strong> is sidereal, Lahiri ayanāṁśa, whole-sign houses, nine grahas, Vimśottarī daśā.
              </p>
              <p class="mb-0">
                <strong>Western</strong> is tropical, VSOP87 / Meeus via astronomia — a true Ascendant, not a copy of the Sun.
                Neither Vedic nor Western uses Swiss Ephemeris.
              </p>
            </div>
          </section>
        </div>
        <div class="col-12 col-lg-6">
          <section class="block card h-100">
            <div class="card-body">
              <h2>How to use it</h2>
              <ol class="mb-3">
                <li>Save people under Birthdays (time, place, and timezone matter for Lagna and Rising).</li>
                <li>Consult for a question, or open an astrology page and load that birthday.</li>
                <li>Compare the three executive readings, or run relationship compatibility for a pair.</li>
              </ol>
              <p class="mb-0 muted">
                Charts and hexagrams are for study. They are not medical, legal, or financial advice.
              </p>
            </div>
          </section>
        </div>
      </div>

      <section class="block card mb-4">
        <div class="card-body">
          <h2>Made with</h2>
          <p>
            Vue 3, Vue Router, Pinia (saved birthdays persist in the browser), Bootstrap 5, Luxon,
            astronomia, Tone.js for the music pages, and jsPDF with DejaVu for printable readings.
          </p>
          <p class="mb-0">
            Questions or bugs:
            <a href="mailto:edelarey@gmail.com">edelarey@gmail.com</a>.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { usePageTitle } from '@/composables/usePageTitle';

export default {
  name: 'About',
  setup() {
    usePageTitle('About');
    const features = [
      { to: '/consult', title: 'Consult', text: 'Coin or yarrow-style lines. Primary hexagram, changing lines, transformed hexagram, history you can export.' },
      { to: '/birthdays', title: 'Birthdays', text: 'One list of people. Place search fills coordinates and timezone for every chart page.' },
      { to: '/astrology', title: 'I-Ching astrology', text: 'Pre-Heaven seed, Later-Heaven unfolding, heaven and earth, year/month/day, life stages, PDF.' },
      { to: '/daily_reading', title: 'Daily reading', text: 'Independent early-life and later-life daily hexagrams for a saved birthday.' },
      { to: '/vedic_astrology', title: 'Jyotish', text: 'Sidereal kundli, North or South Indian chart, grahas, nakshatra, daśā. Guide at Vedic Help.' },
      { to: '/western_astrology', title: 'Western', text: 'Tropical natal, houses, aspects, transits, PDF.' },
      { to: '/compare', title: 'Compare', text: 'Same birth, three plain-English leads side by side.' },
      { to: '/relationship', title: 'Relationship', text: 'Two people, three systems: I-Ching hexagrams, Vedic Moon and Lagna, Western synastry.' },
      { to: '/hexagrams', title: 'Hexagrams & trigrams', text: 'All 64 hexagrams and 8 trigrams, sequences, King Wen or Fu Xi order.' },
      { to: '/life_symphony', title: 'Music', text: 'Life Symphony from a birth hexagram, and a Solfeggio player.' },
    ];
    return { features };
  },
};
</script>

<style scoped>
.lead-blurb {
  max-width: 46rem;
  color: #4a3b16;
}
.section-title {
  font-size: 1.35rem;
  color: #3d2e10;
  margin: 0 0 0.85rem;
}
.block {
  margin: 0;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
}
.block h2,
.feature-card h3 {
  font-size: 1.15rem;
  color: #3d2e10;
  margin-bottom: 0.65rem;
}
.feature-card {
  margin: 0;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
  color: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.feature-card:hover {
  border-color: #c9b06a;
  box-shadow: 0 4px 14px rgba(107, 79, 29, 0.1);
}
.feature-card p,
.block p,
.block li {
  color: #333;
}
.muted {
  color: #5b4a22;
}
ol {
  padding-left: 1.2rem;
}
</style>
