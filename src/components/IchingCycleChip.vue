<template>
  <button
    type="button"
    class="cycle-chip"
    :disabled="!cycle"
    @click="$emit('select')"
  >
    <img
      v-if="imageSrc"
      :src="imageSrc"
      :alt="animal"
      class="animal"
      width="32"
      height="32"
    />
    <span class="copy">
      <span class="period">{{ period }}{{ periodLabel ? ` · ${periodLabel}` : '' }}</span>
      <span class="pair">{{ stemName }} · {{ branchName }}</span>
      <span v-if="animal" class="animal-name">{{ animal }}{{ elementName ? ` · ${elementName}` : '' }}</span>
    </span>
  </button>
</template>

<script>
export default {
  name: 'IchingCycleChip',
  props: {
    period: { type: String, default: '' },
    periodLabel: { type: String, default: '' },
    cycle: { type: Object, default: null },
  },
  emits: ['select'],
  computed: {
    stemName() {
      return this.cycle?.celestialStem?.name || '—';
    },
    branchName() {
      return this.cycle?.horaryBranch?.name || '—';
    },
    animal() {
      return this.cycle?.horaryBranch?.animal || '';
    },
    elementName() {
      return this.cycle?.celestialStem?.element?.name || this.cycle?.horaryBranch?.element?.name || '';
    },
    imageSrc() {
      if (!this.animal) return '';
      return `/images/${String(this.animal).toLowerCase()}.jpg`;
    },
  },
};
</script>

<style scoped>
.cycle-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: 100%;
  text-align: center;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
  border-radius: 0.5rem;
  padding: 0.95rem 0.85rem;
  min-height: 5.2rem;
}
.cycle-chip:hover:not(:disabled) {
  border-color: #c9b06a;
  background: #fff8e8;
}
.cycle-chip:disabled {
  opacity: 0.65;
}
.animal {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  flex-shrink: 0;
}
.copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}
.period {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #8a6a22;
}
.pair {
  font-weight: 600;
  font-size: 1.25rem;
  color: #3d2e10;
}
.animal-name {
  font-size: 1.0625rem;
  color: #5b4a22;
}
</style>
