<template>
  <div class="birth-details-panel card mb-3">
    <button
      type="button"
      class="forms-toggle"
      :aria-expanded="modelValue ? 'true' : 'false'"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <span>
        <strong>{{ title }}</strong>
        <span v-if="summary" class="text-muted ms-2">{{ summary }}</span>
      </span>
      <span class="toggle-hint">{{ modelValue ? 'Hide' : 'Show' }}</span>
    </button>
    <div v-show="modelValue" class="card-body pt-0">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BirthDetailsPanel',
  props: {
    title: { type: String, default: 'Birth details' },
    summary: { type: String, default: '' },
    modelValue: { type: Boolean, default: true },
  },
  emits: ['update:modelValue'],
};
</script>

<style scoped>
.birth-details-panel.card {
  overflow: visible;
}
.forms-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border: 0;
  background: #f4f6fb;
  text-align: left;
  padding: 0.9rem 1.15rem;
  border-radius: 0.375rem 0.375rem 0 0;
  font-size: 0.95rem;
}
.forms-toggle:hover {
  background: #eef1f8;
}
.toggle-hint {
  flex-shrink: 0;
  font-weight: 600;
  color: #5b4cdb;
}
@media (max-width: 767.98px) {
  .birth-details-panel.card {
    margin-left: 0;
    margin-right: 0;
  }
  .birth-details-panel :deep(.card-body) {
    padding-left: 0.85rem;
    padding-right: 0.85rem;
    overflow: visible;
  }
}
</style>
