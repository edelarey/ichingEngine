<template>
  <div class="sheet-select">
    <label v-if="label" class="form-label" :for="buttonId">{{ label }}</label>
    <button
      :id="buttonId"
      type="button"
      class="form-select sheet-select-btn"
      :disabled="disabled"
      :aria-haspopup="true"
      :aria-expanded="open ? 'true' : 'false'"
      @click="show"
    >
      {{ currentLabel }}
    </button>
    <teleport to="body">
      <div v-if="open" class="sheet-root" @keydown.escape="hide">
        <div class="sheet-backdrop" @click="hide"></div>
        <div
          class="sheet-panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <div class="sheet-header">
            <h2 :id="titleId" class="sheet-title">{{ title || label || 'Choose' }}</h2>
            <button type="button" class="btn-close" aria-label="Close" @click="hide"></button>
          </div>
          <div v-if="options.length > 12" class="sheet-filter">
            <input
              ref="filterEl"
              v-model="query"
              type="search"
              class="form-control"
              placeholder="Filter…"
              autocomplete="off"
            >
          </div>
          <ul class="sheet-list" role="listbox">
            <li v-if="!filtered.length" class="sheet-empty">No matches.</li>
            <li v-for="opt in filtered" :key="String(opt.value)">
              <button
                type="button"
                class="sheet-option"
                :class="{ 'is-selected': same(opt.value, modelValue) }"
                role="option"
                :aria-selected="same(opt.value, modelValue) ? 'true' : 'false'"
                @click="choose(opt.value)"
              >
                {{ opt.label }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';

let uid = 0;

export default {
  name: 'SheetSelect',
  props: {
    id: { type: String, default: '' },
    label: { type: String, default: '' },
    modelValue: { default: '' },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'Choose…' },
    title: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const n = uid += 1;
    const buttonId = computed(() => props.id || `sheet-select-${n}`);
    const titleId = `sheet-title-${n}`;
    const open = ref(false);
    const query = ref('');
    const filterEl = ref(null);
    let lockedY = 0;

    const same = (a, b) => String(a) === String(b);

    const currentLabel = computed(() => {
      const match = (props.options || []).find((opt) => same(opt.value, props.modelValue));
      return match ? match.label : props.placeholder;
    });

    const filtered = computed(() => {
      const q = query.value.trim().toLowerCase();
      const list = props.options || [];
      if (!q) return list;
      return list.filter((opt) => String(opt.label).toLowerCase().includes(q));
    });

    const restoreScroll = () => {
      window.scrollTo(0, lockedY);
    };

    const show = async () => {
      if (props.disabled) return;
      lockedY = window.scrollY;
      query.value = '';
      open.value = true;
      await nextTick();
      filterEl.value?.focus({ preventScroll: true });
      restoreScroll();
    };

    const hide = () => {
      open.value = false;
      query.value = '';
      restoreScroll();
    };

    const choose = (value) => {
      emit('update:modelValue', value);
      hide();
    };

    watch(open, (isOpen) => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        restoreScroll();
      } else {
        document.body.style.overflow = '';
        restoreScroll();
      }
    });

    onUnmounted(() => {
      document.body.style.overflow = '';
    });

    return {
      buttonId,
      titleId,
      open,
      query,
      filterEl,
      currentLabel,
      filtered,
      same,
      show,
      hide,
      choose,
    };
  },
};
</script>

<style scoped>
.sheet-select {
  width: 100%;
  min-width: 0;
}
.sheet-select-btn {
  display: block;
  width: 100%;
  min-height: 44px;
  text-align: left;
}
.sheet-select-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.sheet-root {
  position: fixed;
  inset: 0;
  z-index: 1080;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.5rem 0.75rem 1.25rem;
}
.sheet-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}
.sheet-panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 540px;
  max-height: min(70vh, 560px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem 0.6rem;
  border-bottom: 1px solid #eee;
}
.sheet-title {
  font-size: 1.05rem;
  margin: 0;
}
.sheet-filter {
  padding: 0.65rem 1rem 0.35rem;
}
.sheet-list {
  list-style: none;
  margin: 0;
  padding: 0 0 1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1 1 auto;
}
.sheet-option {
  display: block;
  width: 100%;
  text-align: left;
  background: #fff;
  border: 0;
  border-bottom: 1px solid #f1f1f1;
  padding: 0.85rem 1rem;
  min-height: 44px;
}
.sheet-option.is-selected {
  background: #eef3ff;
  font-weight: 600;
}
.sheet-empty {
  padding: 1rem;
  color: #6c757d;
}
@media (min-width: 768px) {
  .sheet-root {
    padding: 1.5rem;
  }
}
</style>
