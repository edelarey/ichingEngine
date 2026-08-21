<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="detail-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="kind === 'trigram' ? 'Trigram detail' : 'Hexagram detail'"
      @click.self="close"
    >
      <div class="detail-panel" ref="panel">
        <div class="detail-toolbar">
          <button type="button" class="btn-close-detail" @click="close">Close</button>
          <router-link v-if="pageLink" :to="pageLink" class="full-page">Open full page</router-link>
        </div>

        <div v-if="kind === 'hexagram' && hexagram" class="detail-body text-center">
          <p class="eyebrow">Hexagram</p>
          <p class="glyph">{{ hexagram.hexagram }}</p>
          <h3 class="title">{{ hexagram.name }}</h3>
          <p v-if="hexagram.symbol" class="chinese">{{ hexagram.symbol }}</p>
          <p v-if="hexagram.translation" class="lead-line">{{ hexagram.translation }}</p>
          <p v-if="hexagram.binary" class="muted">{{ hexagram.binary }}</p>
          <div v-if="plain(hexagram.summary)" class="block">
            <h4>Summary</h4>
            <p>{{ plain(hexagram.summary) }}</p>
          </div>
          <div v-if="above" class="block">
            <h4>Above</h4>
            <p class="glyph-sm">{{ above.trigram }}</p>
            <p><strong>{{ above.name }}</strong></p>
            <p class="muted">{{ above.description?.nature }} · {{ above.description?.translation }}</p>
            <button
              v-if="above.binary"
              type="button"
              class="btn btn-outline-primary btn-sm"
              @click="$emit('open-trigram', above.binary)"
            >
              Trigram detail
            </button>
          </div>
          <div v-if="below" class="block">
            <h4>Below</h4>
            <p class="glyph-sm">{{ below.trigram }}</p>
            <p><strong>{{ below.name }}</strong></p>
            <p class="muted">{{ below.description?.nature }} · {{ below.description?.translation }}</p>
            <button
              v-if="below.binary"
              type="button"
              class="btn btn-outline-primary btn-sm"
              @click="$emit('open-trigram', below.binary)"
            >
              Trigram detail
            </button>
          </div>
          <div v-if="plain(hexagram.judgement)" class="block">
            <h4>The Judgement</h4>
            <p>{{ plain(hexagram.judgement) }}</p>
          </div>
          <div v-if="plain(hexagram.image)" class="block">
            <h4>Image</h4>
            <p>{{ plain(hexagram.image) }}</p>
          </div>
          <div v-if="formattedLines.length" class="block text-start">
            <h4 class="text-center">The Lines</h4>
            <div v-for="(line, i) in formattedLines" :key="i" class="mb-3">
              <h5 class="h6">{{ line.title }}</h5>
              <p>{{ line.text }}</p>
            </div>
          </div>
        </div>

        <div v-else-if="kind === 'trigram' && trigram" class="detail-body text-center">
          <p class="eyebrow">Trigram</p>
          <p class="glyph">{{ trigram.trigram }}</p>
          <h3 class="title">{{ trigram.name }}</h3>
          <p v-if="trigram.symbol" class="chinese">{{ trigram.symbol }}</p>
          <p class="lead-line">{{ trigram.description?.translation }}</p>
          <p class="muted">Binary {{ trigram.binary }}</p>
          <p>Nature: {{ trigram.description?.nature }}</p>
          <p>Animal: {{ trigram.description?.animal }}</p>
          <p>Body: {{ trigram.description?.bodyPart }}</p>
          <p>Attribute: {{ trigram.description?.attribute }}</p>
          <p>State: {{ trigram.description?.state }}</p>
          <div v-if="trigram.earlierHeaven" class="block">
            <h4>Earlier Heaven</h4>
            <p>{{ trigram.earlierHeaven.name }}</p>
            <p class="muted">
              {{ trigram.earlierHeaven.polarity?.name }}
              · {{ trigram.earlierHeaven.direction }}
              · {{ trigram.earlierHeaven.season }}
              · {{ trigram.earlierHeaven.relationship }}
            </p>
          </div>
          <div v-if="trigram.laterHeaven" class="block">
            <h4>Later Heaven</h4>
            <p>{{ trigram.laterHeaven.name }}</p>
            <p class="muted">
              {{ trigram.laterHeaven.polarity?.name }}
              · {{ trigram.laterHeaven.direction }}
              · {{ trigram.laterHeaven.season }}
              · {{ trigram.laterHeaven.relationship }}
            </p>
          </div>
        </div>

        <p v-else class="p-4 mb-0 text-center text-muted">Nothing to show for this symbol.</p>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { computed, watch, onUnmounted } from 'vue';
import hexagramConst from '@/const/hexagram';
import bagua from '@/const/bagua';

export default {
  name: 'IchingDetailModal',
  props: {
    show: { type: Boolean, default: false },
    kind: { type: String, default: 'hexagram' },
    binary: { type: String, default: '' },
  },
  emits: ['close', 'open-trigram'],
  setup(props, { emit }) {
    const hexagram = computed(() => {
      if (props.kind !== 'hexagram' || !props.binary) return null;
      const list = typeof hexagramConst.sequence_binary === 'function'
        ? hexagramConst.sequence_binary()
        : [];
      return list.find((item) => item.binary === props.binary) || null;
    });

    const trigram = computed(() => {
      if (props.kind !== 'trigram' || !props.binary) return null;
      return bagua.sequence_Gua_OldFamilyOrder().find((item) => item.binary === props.binary) || null;
    });

    const above = computed(() => {
      const binary = hexagram.value?.binary;
      if (!binary) return hexagram.value?.above || null;
      return bagua.sequence_Gua_OldFamilyOrder().find((item) => item.binary === binary.substring(0, 3))
        || hexagram.value?.above
        || null;
    });

    const below = computed(() => {
      const binary = hexagram.value?.binary;
      if (!binary) return hexagram.value?.below || null;
      return bagua.sequence_Gua_OldFamilyOrder().find((item) => item.binary === binary.substring(3, 6))
        || hexagram.value?.below
        || null;
    });

    const pageLink = computed(() => {
      if (!props.binary) return '';
      return props.kind === 'trigram'
        ? `/trigram_detail?trigram=${props.binary}`
        : `/hexagram_detail?hexagram=${props.binary}`;
    });

    const plain = (html) => {
      if (!html) return '';
      return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    };

    const formattedLines = computed(() => {
      const raw = hexagram.value?.lines;
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

    const close = () => emit('close');

    const onKey = (e) => {
      if (e.key === 'Escape' && props.show) close();
    };

    watch(() => props.show, (open) => {
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) document.addEventListener('keydown', onKey);
      else document.removeEventListener('keydown', onKey);
    });

    onUnmounted(() => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    });

    return {
      hexagram,
      trigram,
      above,
      below,
      pageLink,
      formattedLines,
      plain,
      close,
    };
  },
};
</script>

<style scoped>
.detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 1080;
  background: rgba(30, 24, 12, 0.45);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
  padding: 1.5rem 1rem 3rem;
}
.detail-panel {
  width: min(40rem, 100%);
  background: #fffdf7;
  border: 1px solid #e6d5a8;
  border-radius: 0.6rem;
  box-shadow: 0 12px 40px rgba(40, 30, 10, 0.25);
  margin-top: 1.5rem;
}
.detail-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e6d5a8;
  background: #fff8e8;
  border-radius: 0.6rem 0.6rem 0 0;
}
.btn-close-detail {
  border: 0;
  background: transparent;
  font-weight: 700;
  color: #5b4cdb;
}
.full-page {
  font-size: 0.9rem;
}
.detail-body {
  padding: 1.25rem 1.35rem 1.6rem;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 700;
  color: #8a6a22;
  margin-bottom: 0.25rem;
}
.glyph {
  font-size: 4rem;
  line-height: 1;
  margin: 0.2rem 0;
  color: #3d2e10;
}
.glyph-sm {
  font-size: 2.4rem;
  line-height: 1;
  margin: 0.2rem 0;
}
.title {
  font-size: 1.6rem;
  color: #3d2e10;
}
.chinese {
  font-size: 1.25rem;
  color: #6b5a32;
}
.lead-line {
  font-size: 1.1rem;
}
.muted {
  color: #666;
}
.block {
  margin-top: 1.15rem;
  padding-top: 0.85rem;
  border-top: 1px solid #efe4c6;
}
.block h4 {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8a6a22;
  margin-bottom: 0.4rem;
}
</style>
