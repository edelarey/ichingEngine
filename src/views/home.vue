<template>
  <div class="home-page">
    <div class="container pt-3 mb-4">
      <div class="hero card mb-0">
        <div class="card-body py-3">
          <div class="row align-items-center g-3">
            <div class="col-12 col-md-3 text-center">
              <img class="hero-gif" alt="I Ching animation" :src="gifUrl" />
            </div>
            <div class="col-12 col-md-9">
              <h1 class="app-name">
                iChing Engine
                <span class="cn" lang="zh-Hant">易經引擎</span>
              </h1>
              <p class="app-aka" lang="zh-Hant">易經 · <span lang="en">Yìjīng</span> · Book of Changes</p>
              <p class="hero-copy mb-2">
                Cast a hexagram, read a birth, hear the lines. Oracle, natal charts, one birthday list.
              </p>
              <div class="d-flex flex-wrap gap-2">
                <router-link to="/consult" class="btn btn-primary btn-sm">Consult</router-link>
                <router-link to="/astrology" class="btn btn-outline-primary btn-sm">I-Ching astrology</router-link>
                <router-link to="/daily_reading" class="btn btn-outline-primary btn-sm">Daily reading</router-link>
                <router-link to="/birthdays" class="btn btn-outline-secondary btn-sm">Birthdays</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="live-band card mb-4">
        <div class="card-body">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <p class="eyebrow mb-1">Live casts</p>
              <h2 class="h5 mb-0">Hexagrams assembling themselves</h2>
            </div>
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="paused = !paused">
              {{ paused ? 'Play' : 'Pause' }}
            </button>
          </div>
          <p class="text-muted small">
            Three independent coin casts, line by line from the bottom. Red is a changing line.
            When a figure settles, you can open it.
          </p>
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <div class="caster-wrap">
                <LiveHexagramCaster :paused="paused" :interval="720" :hold="3000" :start-delay="0" />
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="caster-wrap">
                <LiveHexagramCaster :paused="paused" :interval="880" :hold="3400" :start-delay="420" />
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="caster-wrap">
                <LiveHexagramCaster :paused="paused" :interval="640" :hold="2800" :start-delay="860" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="marquee-wrap mb-4" aria-hidden="true">
        <div class="marquee-track" :class="{ paused }">
          <span v-for="(h, i) in ribbon" :key="'a-' + i" class="glyph">{{ h.hexagram }}</span>
          <span v-for="(h, i) in ribbon" :key="'b-' + i" class="glyph">{{ h.hexagram }}</span>
        </div>
      </div>

      <div class="row g-3">
        <div v-for="item in doors" :key="item.to" class="col-12 col-sm-6 col-lg-3">
          <router-link :to="item.to" class="door card h-100 text-decoration-none">
            <div class="card-body">
              <h3>{{ item.title }}</h3>
              <p class="mb-0">{{ item.text }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { usePageTitle } from '@/composables/usePageTitle';
import hexagramLibrary from '@/const/hexagram';
import LiveHexagramCaster from '@/components/LiveHexagramCaster.vue';

export default {
  name: 'Home',
  components: { LiveHexagramCaster },
  setup() {
    usePageTitle('Home');
    const gifUrl = ref(require('@/assets/iching.gif'));
    const paused = ref(
      typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    const ribbon = computed(() => {
      const list = hexagramLibrary.sequence_kingwen() || [];
      return list.filter((h) => h && h.hexagram);
    });
    const doors = [
      { to: '/consult', title: 'Consult', text: 'Six lines, changing lines, a saved history you can reopen.' },
      { to: '/astrology', title: 'I-Ching astrology', text: 'Pre-Heaven and Later-Heaven from a birth, not the coin oracle.' },
      { to: '/daily_reading', title: 'Daily reading', text: 'Independent early-life and later-life daily hexagrams for a saved birthday.' },
      { to: '/vedic_astrology', title: 'Jyotish', text: 'Sidereal kundli, Lahiri, daśā.' },
      { to: '/western_astrology', title: 'Western', text: 'Tropical natal, true Rising, transits.' },
      { to: '/relationship', title: 'Relationship', text: 'Two people, three systems.' },
      { to: '/hexagrams', title: '64 hexagrams', text: 'Catalog, sequences, trigrams.' },
      { to: '/life_symphony', title: 'Music', text: 'Life Symphony and Solfeggio.' },
      { to: '/about', title: 'About', text: 'What this engine is, and is not.' },
    ];
    return { gifUrl, paused, ribbon, doors };
  },
};
</script>

<style scoped>
.hero,
.live-band {
  margin: 0;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
}
.hero-gif {
  width: 96px;
  height: auto;
  max-width: 100%;
}
.app-name {
  font-size: 1.45rem;
  font-weight: 700;
  color: #3d2e10;
  margin: 0 0 0.15rem;
  line-height: 1.2;
}
.app-name .cn {
  display: inline-block;
  margin-left: 0.55rem;
  font-size: 1.55rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  font-family: "Noto Serif CJK SC", "Noto Serif CJK TC", "Source Han Serif SC", "Songti SC", "SimSun", "PMingLiU", serif;
}
.app-aka {
  font-size: 0.9rem;
  color: #8a6a22;
  margin-bottom: 0.45rem;
  font-family: "Noto Serif CJK SC", "Noto Serif CJK TC", "Source Han Serif SC", "Songti SC", "SimSun", serif;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #8a6a22;
}
.hero-copy {
  color: #4a3b16;
  max-width: 36rem;
  margin-bottom: 0;
  font-size: 0.95rem;
}
.caster-wrap {
  border: 1px solid #efe4c6;
  border-radius: 0.5rem;
  background: #fff;
}
.marquee-wrap {
  overflow: hidden;
  border: 1px solid #e6d5a8;
  background: #3d2e10;
  border-radius: 0.5rem;
  padding: 0.55rem 0;
}
.marquee-track {
  display: flex;
  gap: 1.1rem;
  width: max-content;
  animation: drift 90s linear infinite;
}
.marquee-track.paused {
  animation-play-state: paused;
}
.marquee-track .glyph {
  font-size: 1.8rem;
  line-height: 1;
  color: #f3e3b0;
  opacity: 0.85;
}
@keyframes drift {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.door {
  margin: 0;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
  color: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.door:hover {
  border-color: #c9b06a;
  box-shadow: 0 4px 14px rgba(107, 79, 29, 0.1);
}
.door h3 {
  font-size: 1.1rem;
  color: #3d2e10;
  margin-bottom: 0.4rem;
}
.door p {
  color: #5b4a22;
  font-size: 0.9rem;
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>
