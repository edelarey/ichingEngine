<template>
  <div class="iching-hex-card card h-100">
    <div class="card-body">
      <p v-if="title" class="eyebrow mb-1">{{ title }}</p>
      <div class="glyph-row">
        <span class="unicode" aria-hidden="true">{{ glyph }}</span>
        <div>
          <h3 class="hex-name">{{ hexagram?.name || '—' }}</h3>
          <p v-if="chinese" class="chinese mb-0">{{ chinese }}</p>
        </div>
      </div>
      <p v-if="translation" class="translation">{{ translation }}</p>

      <div v-if="displayLines.length" class="figure-wrap">
        <div class="hex-figure">
          <div v-if="showAgeBands" class="age-header">Age</div>
          <div
            v-for="line in displayLines"
            :key="line.lineNumber"
            class="hex-row"
            :class="{
              controlling: line.isControlling,
              changing: line.isChanging && highlightKind === 'changing',
              transformed: line.isChanging && highlightKind === 'transformed',
            }"
          >
            <div class="line-marks" :class="line.isYin ? 'yin' : 'yang'">
              <span class="seg" />
              <span v-if="line.isYin" class="seg" />
            </div>
            <span v-if="showAgeBands" class="age-label">
              <template v-if="line.yearRange">{{ line.yearRange[0] }}–{{ line.yearRange[1] }}</template>
            </span>
          </div>
        </div>
      </div>

      <p v-if="controllingCaption" class="controlling-caption">
        <strong>Controlling line.</strong>
        {{ controllingCaption }}
      </p>
      <p v-if="note" class="note">{{ note }}</p>
      <p v-if="showSummary && summary" class="summary">{{ summary }}</p>
      <button
        v-if="showDetailButton && hexagram?.binary"
        type="button"
        class="btn btn-outline-primary btn-sm mt-2"
        @click="$emit('detail', hexagram.binary)"
      >
        Hexagram detail
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IchingHexagramCard',
  props: {
    title: { type: String, default: '' },
    hexagram: { type: Object, default: null },
    controllingLine: { type: Object, default: null },
    showAgeBands: { type: Boolean, default: false },
    note: { type: String, default: '' },
    lineIndexBase: { type: Number, default: 1 },
    showSummary: { type: Boolean, default: true },
    showDetailButton: { type: Boolean, default: true },
    highlightLines: { type: Array, default: () => [] },
    highlightKind: { type: String, default: 'changing' },
  },
  emits: ['detail'],
  computed: {
    glyph() {
      return this.hexagram?.hexagram || '';
    },
    chinese() {
      return this.hexagram?.symbol || '';
    },
    translation() {
      const text = this.hexagram?.translation;
      if (!text) return '';
      return String(text).split(',')[0].trim();
    },
    summary() {
      const raw = this.hexagram?.summary;
      if (!raw) return '';
      const text = String(raw).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (text.length <= 220) return text;
      return `${text.slice(0, 217).trim()}…`;
    },
    controllingCaption() {
      const cl = this.controllingLine;
      if (!cl) return '';
      const parts = [];
      if (cl.trigram) parts.push(`${cl.trigram} trigram`);
      if (cl.linePosition) parts.push(`${String(cl.linePosition).toLowerCase()} line`);
      const phrase = parts.join(', ');
      return cl.line?.name ? `${phrase} (${cl.line.name})` : phrase;
    },
    displayLines() {
      const hex = this.hexagram;
      if (!hex) return [];
      const below = Array.isArray(hex.below?.lineArray) ? hex.below.lineArray : [];
      const above = Array.isArray(hex.above?.lineArray) ? hex.above.lineArray : [];
      let stacked = [...below, ...above];
      if (stacked.length === 0 && hex.binary) {
        stacked = String(hex.binary).split('').map((bit) => ({
          name: bit === '1' ? 'yang' : 'yin',
        }));
      }
      const raw = this.controllingLine ? Number(this.controllingLine.hexagramLineIndex) : NaN;
      const controlOneBased = Number.isNaN(raw)
        ? null
        : this.lineIndexBase === 0
          ? raw + 1
          : raw;
      const highlighted = new Set((this.highlightLines || []).map((n) => Number(n)));

      return stacked
        .map((line, i) => {
          const alt = String(line?.alternate || line?.name || '').toUpperCase();
          const isYin = alt.includes('YIN') || line?.name === 'yin' || line?.binaryString === '0';
          return {
            lineNumber: i + 1,
            isYin,
            isChanging: highlighted.has(i + 1) || Boolean(line?.changing) || alt.startsWith('OLD'),
            isControlling: controlOneBased === i + 1,
            yearRange: Array.isArray(line?.yearRange) ? line.yearRange : null,
          };
        })
        .reverse();
    },
  },
};
</script>

<style scoped>
.iching-hex-card {
  margin: 0 0 1rem;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #8a6a22;
}
.glyph-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}
.unicode {
  font-size: 3rem;
  line-height: 1;
  color: #3d2e10;
}
.hex-name {
  font-size: 1.25rem;
  margin: 0;
  color: #3d2e10;
}
.chinese {
  color: #6b5a32;
  font-size: 0.95rem;
}
.translation {
  color: #4a3b16;
  margin-bottom: 0.85rem;
}
.figure-wrap {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0 0.85rem;
}
.hex-figure {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 9.5rem;
}
.age-header {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8a6a22;
  text-align: right;
  padding-right: 0.1rem;
}
.hex-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.line-marks {
  display: flex;
  width: 6.4rem;
  height: 0.42rem;
  gap: 0.7rem;
}
.line-marks .seg {
  flex: 1;
  background: #1a1a1a;
  border-radius: 1px;
}
.line-marks.yang {
  gap: 0;
}
.hex-row.controlling .seg,
.hex-row.changing .seg {
  background: #c62828;
}
.hex-row.transformed .seg {
  background: #1565c0;
}
.age-label {
  font-size: 0.75rem;
  color: #666;
  min-width: 3.4rem;
}
.controlling-caption,
.note,
.summary {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.4rem;
}
.note {
  color: #5b4a22;
}
</style>
