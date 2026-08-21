<template>
  <div class="trigram-tile card h-100">
    <div class="card-body">
      <p class="eyebrow mb-1">{{ title }}</p>
      <div class="glyph-row">
        <span class="unicode" aria-hidden="true">{{ glyph }}</span>
        <div>
          <h3 class="tri-name">{{ trigram?.name || '—' }}</h3>
          <p v-if="trigram?.symbol" class="chinese mb-0">{{ trigram.symbol }}</p>
        </div>
      </div>
      <p v-if="bodyPart" class="meta mb-2">Body: {{ bodyPart }}</p>
      <p v-if="translation" class="meta mb-3">{{ translation }}</p>
      <button
        v-if="trigram?.binary"
        type="button"
        class="btn btn-outline-primary btn-sm"
        @click="$emit('detail', trigram.binary)"
      >
        Trigram detail
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IchingTrigramTile',
  props: {
    title: { type: String, default: '' },
    trigram: { type: Object, default: null },
  },
  emits: ['detail'],
  computed: {
    glyph() {
      return this.trigram?.trigram || '';
    },
    bodyPart() {
      return this.trigram?.description?.bodyPart || '';
    },
    translation() {
      const text = this.trigram?.description?.translation;
      if (!text) return '';
      return String(text).split(',')[0].trim();
    },
  },
};
</script>

<style scoped>
.trigram-tile {
  margin: 0 0 1rem;
  border: 1px solid #d9e0ee;
  background: #fbfcff;
  text-align: center;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.9rem;
  font-weight: 700;
  color: #4a5d8a;
}
.glyph-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
}
.unicode {
  font-size: 3.25rem;
  line-height: 1;
  color: #24324f;
}
.tri-name {
  font-size: 1.5rem;
  margin: 0;
  color: #24324f;
}
.chinese {
  color: #5b6b8a;
  font-size: 1.2rem;
}
.meta {
  color: #333;
  margin-bottom: 0.35rem;
  font-size: 1.125rem;
}
</style>
