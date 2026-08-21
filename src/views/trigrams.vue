<template>
  <div class="trigrams-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Trigrams</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">Trigrams</li>
          </ol>
        </nav>
        <p class="mb-0 lead-blurb">
          The eight bagua — Heaven, Earth, Thunder, Wind, Water, Fire, Mountain, and Lake —
          stack in pairs to make the 64 hexagrams. This list is the Earlier Heaven (Fu Xi) family order.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <div class="row g-3">
        <div
          v-for="tri in trigrams"
          :key="tri.binary"
          class="col-12 col-sm-6 col-lg-3"
        >
          <router-link
            :to="`/trigram_detail?trigram=${tri.binary}`"
            class="trigram-card card h-100 text-decoration-none"
          >
            <div class="card-body">
              <p class="glyph" aria-hidden="true">{{ tri.trigram }}</p>
              <h2 class="name">{{ tri.name }}</h2>
              <p v-if="tri.symbol" class="chinese mb-1">{{ tri.symbol }}</p>
              <p class="translation mb-2">{{ firstPhrase(tri.description?.translation) }}</p>
              <p class="meta mb-0">
                {{ tri.description?.nature }}
                <span v-if="tri.description?.bodyPart"> · {{ tri.description.bodyPart }}</span>
              </p>
              <p class="binary mb-0">{{ tri.binary }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import bagua from '@/const/bagua';
import { usePageTitle } from '@/composables/usePageTitle';

export default {
  name: 'Trigrams',
  setup() {
    usePageTitle('Trigrams');
    const trigrams = computed(() => bagua.sequence_Gua_OldFamilyOrder() || []);
    const firstPhrase = (text) => {
      if (!text) return '';
      return String(text).split(',')[0].trim();
    };
    return { trigrams, firstPhrase };
  },
};
</script>

<style scoped>
.lead-blurb {
  max-width: 44rem;
  color: #4a3b16;
}
.trigram-card {
  margin: 0;
  border: 1px solid #d9e0ee;
  background: #fbfcff;
  color: inherit;
  text-align: center;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.trigram-card:hover {
  border-color: #8aa0c8;
  box-shadow: 0 4px 14px rgba(36, 50, 79, 0.1);
}
.glyph {
  font-size: 3.25rem;
  line-height: 1;
  margin: 0.2rem 0 0.4rem;
  color: #24324f;
}
.name {
  font-size: 1.35rem;
  margin: 0;
  color: #24324f;
  text-transform: none;
}
.chinese {
  color: #5b6b8a;
  font-size: 1.1rem;
}
.translation {
  color: #333;
}
.meta,
.binary {
  font-size: 0.9rem;
  color: #5b6b8a;
}
</style>
