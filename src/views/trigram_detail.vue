<template>
  <div class="trigram-detail-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">{{ trigram.name || 'Trigram' }}</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item"><router-link to="/trigrams">Trigrams</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">{{ trigram.name || 'Detail' }}</li>
          </ol>
        </nav>
      </div>
    </header>

    <div class="container mb-5">
      <div v-if="!trigram.binary" class="card empty">
        <div class="card-body">
          <p class="mb-2">No trigram in the address.</p>
          <router-link to="/trigrams">Browse the eight trigrams</router-link>
        </div>
      </div>

      <template v-else>
        <div class="pager mb-3">
          <router-link
            v-if="prev"
            :to="`/trigram_detail?trigram=${prev.binary}`"
            class="btn btn-outline-secondary btn-sm"
          >
            ← {{ prev.name }}
          </router-link>
          <span v-else></span>
          <router-link
            v-if="next"
            :to="`/trigram_detail?trigram=${next.binary}`"
            class="btn btn-outline-secondary btn-sm"
          >
            {{ next.name }} →
          </router-link>
        </div>

        <div class="hero card mb-4">
          <div class="card-body text-center">
            <p class="glyph" aria-hidden="true">{{ trigram.trigram }}</p>
            <h2 class="name">{{ trigram.name }}</h2>
            <p v-if="trigram.symbol" class="chinese">{{ trigram.symbol }}</p>
            <p class="translation">{{ translation }}</p>
            <p class="binary">Binary {{ trigram.binary }}</p>
          </div>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-6 col-md-4">
            <div class="fact">
              <p class="label">Nature</p>
              <p class="value">{{ nature || '—' }}</p>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="fact">
              <p class="label">Animal</p>
              <p class="value">{{ animal || '—' }}</p>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="fact">
              <p class="label">Body</p>
              <p class="value">{{ bodyPart || '—' }}</p>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="fact">
              <p class="label">Attribute</p>
              <p class="value">{{ attribute || '—' }}</p>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="fact">
              <p class="label">State</p>
              <p class="value">{{ state || '—' }}</p>
            </div>
          </div>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-12 col-md-6">
            <div class="heaven card h-100">
              <div class="card-body">
                <p class="eyebrow">Earlier Heaven</p>
                <h3>{{ earlierHeavenName || '—' }}</h3>
                <p>Polarity: {{ earlierHeavenPolarity?.name || '—' }}</p>
                <p>Direction: {{ earlierHeavenDirection || '—' }}</p>
                <p>Number: {{ earlierHeavenNumber || '—' }}</p>
                <p>Season: {{ earlierHeavenSeason || '—' }}</p>
                <p class="mb-0">Relationship: {{ earlierHeavenRelationship || '—' }}</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="heaven later card h-100">
              <div class="card-body">
                <p class="eyebrow">Later Heaven</p>
                <h3>{{ laterHeavenName || '—' }}</h3>
                <p>Polarity: {{ laterHeavenPolarity?.name || '—' }}</p>
                <p>Direction: {{ laterHeavenDirection || '—' }}</p>
                <p>Number: {{ laterHeavenNumber || '—' }}</p>
                <p>Season: {{ laterHeavenSeason || '—' }}</p>
                <p class="mb-0">Relationship: {{ laterHeavenRelationship || '—' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="pager">
          <router-link
            v-if="prev"
            :to="`/trigram_detail?trigram=${prev.binary}`"
            class="btn btn-outline-secondary btn-sm"
          >
            ← {{ prev.name }}
          </router-link>
          <router-link to="/trigrams" class="btn btn-link">All trigrams</router-link>
          <router-link
            v-if="next"
            :to="`/trigram_detail?trigram=${next.binary}`"
            class="btn btn-outline-secondary btn-sm"
          >
            {{ next.name }} →
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
import bagua from '@/const/bagua';

export default {
  name: 'TrigramDetail',
  setup() {
    const route = useRoute();
    const list = bagua.sequence_Gua_OldFamilyOrder() || [];

    const trigram = computed(() => {
      const binary = route.query.trigram;
      if (!binary) return {};
      return list.find((item) => item.binary === binary) || {};
    });

    const index = computed(() => list.findIndex((item) => item.binary === trigram.value.binary));
    const prev = computed(() => (index.value > 0 ? list[index.value - 1] : null));
    const next = computed(() => (index.value >= 0 && index.value < list.length - 1 ? list[index.value + 1] : null));

    const desc = computed(() => trigram.value.description || {});
    const translation = computed(() => desc.value.translation || '');
    const nature = computed(() => desc.value.nature || '');
    const animal = computed(() => desc.value.animal || '');
    const bodyPart = computed(() => desc.value.bodyPart || '');
    const attribute = computed(() => desc.value.attribute || '');
    const state = computed(() => desc.value.state || '');

    const earlier = computed(() => trigram.value.earlierHeaven || {});
    const later = computed(() => trigram.value.laterHeaven || {});

    useHead({
      title: computed(() => trigram.value.name
        ? `${trigram.value.name} · Trigram | iChing Engine`
        : 'Trigram | iChing Engine'),
    });

    return {
      trigram,
      prev,
      next,
      translation,
      nature,
      animal,
      bodyPart,
      attribute,
      state,
      earlierHeavenName: computed(() => earlier.value.name || ''),
      earlierHeavenPolarity: computed(() => earlier.value.polarity || {}),
      earlierHeavenDirection: computed(() => earlier.value.direction || ''),
      earlierHeavenNumber: computed(() => earlier.value.number || ''),
      earlierHeavenSeason: computed(() => earlier.value.season || ''),
      earlierHeavenRelationship: computed(() => earlier.value.relationship || ''),
      laterHeavenName: computed(() => later.value.name || ''),
      laterHeavenPolarity: computed(() => later.value.polarity || {}),
      laterHeavenDirection: computed(() => later.value.direction || ''),
      laterHeavenNumber: computed(() => later.value.number || ''),
      laterHeavenSeason: computed(() => later.value.season || ''),
      laterHeavenRelationship: computed(() => later.value.relationship || ''),
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
.hero,
.heaven {
  margin: 0;
}
.hero {
  border: 1px solid #d9e0ee;
  background: #fbfcff;
}
.glyph {
  font-size: 4.5rem;
  line-height: 1;
  margin: 0.2rem 0;
  color: #24324f;
}
.name {
  font-size: 1.8rem;
  color: #24324f;
  margin-bottom: 0.2rem;
}
.chinese {
  font-size: 1.35rem;
  color: #5b6b8a;
}
.translation {
  font-size: 1.15rem;
  color: #333;
}
.binary {
  color: #5b6b8a;
  font-size: 0.9rem;
}
.fact {
  background: #fbfcff;
  border: 1px solid #d9e0ee;
  border-radius: 0.5rem;
  padding: 0.85rem 1rem;
  text-align: center;
  height: 100%;
}
.fact .label {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #4a5d8a;
  margin-bottom: 0.25rem;
}
.fact .value {
  margin: 0;
  color: #24324f;
}
.heaven {
  border: 1px solid #d9e0ee;
  background: #fbfcff;
}
.heaven.later {
  background: #fffdf7;
  border-color: #e6d5a8;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #4a5d8a;
}
.heaven h3 {
  font-size: 1.2rem;
  color: #24324f;
}
</style>
