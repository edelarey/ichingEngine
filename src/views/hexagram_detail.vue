<template>
  <div class="hexagram-detail-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">{{ displayName || 'Hexagram' }}</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item"><router-link to="/hexagrams">Hexagrams</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">{{ displayName || 'Detail' }}</li>
          </ol>
        </nav>
      </div>
    </header>

    <div class="container mb-5">
      <div v-if="!hexagram.binary" class="card empty">
        <div class="card-body">
          <p class="mb-2">No hexagram in the address.</p>
          <router-link to="/hexagrams">Browse the 64 hexagrams</router-link>
        </div>
      </div>

      <template v-else>
        <div class="pager mb-3">
          <router-link
            v-if="prev"
            :to="`/hexagram_detail?hexagram=${prev.binary}`"
            class="btn btn-outline-secondary btn-sm"
          >
            ← {{ shortName(prev.name) }}
          </router-link>
          <span v-else></span>
          <router-link
            v-if="next"
            :to="`/hexagram_detail?hexagram=${next.binary}`"
            class="btn btn-outline-secondary btn-sm"
          >
            {{ shortName(next.name) }} →
          </router-link>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-12 col-lg-5">
            <IchingHexagramCard
              :title="kingWenLabel"
              :hexagram="hexagram"
              :show-summary="false"
              :show-detail-button="false"
            />
          </div>
          <div class="col-12 col-lg-7">
            <p class="translation-lead">{{ hexagram.translation }}</p>
            <p v-if="hexagram.zodiac" class="text-muted">Zodiac flavour: {{ hexagram.zodiac }}</p>
            <p class="text-muted">Binary {{ hexagram.binary }}</p>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <IchingTrigramTile
                  title="Above"
                  :trigram="above"
                  :to="above.binary ? `/trigram_detail?trigram=${above.binary}` : ''"
                />
              </div>
              <div class="col-12 col-md-6">
                <IchingTrigramTile
                  title="Below"
                  :trigram="below"
                  :to="below.binary ? `/trigram_detail?trigram=${below.binary}` : ''"
                />
              </div>
            </div>
          </div>
        </div>

        <section v-if="summary" class="block card mb-3">
          <div class="card-body">
            <h2>Summary</h2>
            <p class="mb-0">{{ summary }}</p>
          </div>
        </section>
        <section v-if="judgement" class="block card mb-3">
          <div class="card-body">
            <h2>The Judgement</h2>
            <p class="mb-0">{{ judgement }}</p>
          </div>
        </section>
        <section v-if="image" class="block card mb-3">
          <div class="card-body">
            <h2>Image</h2>
            <p class="mb-0">{{ image }}</p>
          </div>
        </section>
        <section v-if="explanation" class="block card mb-3">
          <div class="card-body">
            <h2>Explanation</h2>
            <p class="mb-0">{{ explanation }}</p>
          </div>
        </section>
        <section v-if="formattedLines.length" class="block card mb-4">
          <div class="card-body">
            <h2>The Lines</h2>
            <div v-for="(line, i) in formattedLines" :key="i" class="line-block">
              <h3>{{ line.title }}</h3>
              <p class="mb-0">{{ line.text }}</p>
            </div>
          </div>
        </section>

        <div class="pager">
          <router-link
            v-if="prev"
            :to="`/hexagram_detail?hexagram=${prev.binary}`"
            class="btn btn-outline-secondary btn-sm"
          >
            ← {{ shortName(prev.name) }}
          </router-link>
          <router-link to="/hexagrams" class="btn btn-link">All hexagrams</router-link>
          <router-link
            v-if="next"
            :to="`/hexagram_detail?hexagram=${next.binary}`"
            class="btn btn-outline-secondary btn-sm"
          >
            {{ shortName(next.name) }} →
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
import hexagramConst from '@/const/hexagram';
import bagua from '@/const/bagua';
import IchingHexagramCard from '@/components/IchingHexagramCard.vue';
import IchingTrigramTile from '@/components/IchingTrigramTile.vue';

function plain(html) {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function shortName(name) {
  if (!name) return '—';
  return String(name).split(',')[0].trim();
}

export default {
  name: 'HexagramDetail',
  components: { IchingHexagramCard, IchingTrigramTile },
  setup() {
    const route = useRoute();
    const list = hexagramConst.sequence_kingwen() || [];
    const trigrams = bagua.sequence_Gua_OldFamilyOrder() || [];

    const hexagram = computed(() => {
      const binary = route.query.hexagram;
      if (!binary) return {};
      return (hexagramConst.sequence_binary() || []).find((item) => item.binary === binary) || {};
    });

    const index = computed(() => list.findIndex((item) => item.binary === hexagram.value.binary));
    const prev = computed(() => (index.value > 0 ? list[index.value - 1] : null));
    const next = computed(() => (index.value >= 0 && index.value < list.length - 1 ? list[index.value + 1] : null));

    const displayName = computed(() => shortName(hexagram.value.name));
    const kingWenLabel = computed(() => {
      if (!hexagram.value.kingwen) return 'Hexagram';
      return `King Wen ${hexagram.value.kingwen}`;
    });

    const above = computed(() => {
      const binary = hexagram.value.binary;
      if (!binary) return hexagram.value.above || {};
      return trigrams.find((item) => item.binary === binary.substring(0, 3)) || hexagram.value.above || {};
    });
    const below = computed(() => {
      const binary = hexagram.value.binary;
      if (!binary) return hexagram.value.below || {};
      return trigrams.find((item) => item.binary === binary.substring(3, 6)) || hexagram.value.below || {};
    });

    const summary = computed(() => plain(hexagram.value.summary));
    const judgement = computed(() => plain(hexagram.value.judgement));
    const image = computed(() => plain(hexagram.value.image));
    const explanation = computed(() => plain(hexagram.value.explanation));

    const formattedLines = computed(() => {
      const raw = hexagram.value.lines;
      if (!raw || typeof raw !== 'string') return [];
      const lines = [];
      const linePattern = /- \*\*Line (\d+):\*\*([^]*?)(?=(?:- \*\*Line \d+:\*\*)|$)/gi;
      let match = linePattern.exec(raw);
      while (match) {
        lines.push({ title: `Line ${match[1]}`, text: plain(match[2]) });
        match = linePattern.exec(raw);
      }
      return lines;
    });

    useHead({
      title: computed(() => displayName.value && displayName.value !== '—'
        ? `${displayName.value} · Hexagram | iChing Engine`
        : 'Hexagram | iChing Engine'),
    });

    return {
      hexagram,
      above,
      below,
      prev,
      next,
      displayName,
      kingWenLabel,
      summary,
      judgement,
      image,
      explanation,
      formattedLines,
      shortName,
    };
  },
};
</script>

<style scoped>
.pager {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}
.empty,
.block {
  margin: 0;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
}
.translation-lead {
  font-size: 1.25rem;
  color: #3d2e10;
}
.block h2 {
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8a6a22;
  margin-bottom: 0.6rem;
}
.line-block {
  padding: 0.7rem 0;
  border-top: 1px solid #efe4c6;
}
.line-block:first-of-type {
  border-top: 0;
  padding-top: 0;
}
.line-block h3 {
  font-size: 1rem;
  color: #3d2e10;
  margin-bottom: 0.25rem;
}
</style>
