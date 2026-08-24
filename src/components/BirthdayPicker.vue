<template>
  <div class="birthday-picker">
    <div class="picker-row">
      <div class="picker-select">
        <SheetSelect
          :id="selectId"
          label="Saved birthday"
          placeholder="Choose a saved person…"
          :options="pickerOptions"
          v-model="selectedId"
        />
      </div>
      <div class="picker-actions">
        <button
          v-if="!autoLoad"
          type="button"
          class="btn btn-primary"
          :disabled="!selectedId"
          @click="load"
        >
          {{ loadLabel }}
        </button>
        <router-link to="/birthdays" class="btn btn-outline-secondary">Manage birthdays</router-link>
      </div>
    </div>
    <p v-if="birthdayList.length === 0" class="small text-muted mt-2 mb-0">
      No saved birthdays yet.
      <router-link to="/birthdays">Add one</router-link>
      to use it in I-Ching, Vedic, and Western astrology.
    </p>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import { DateTime } from 'luxon';
import { useBirthdayStore } from '@/stores/birthday';
import SheetSelect from '@/components/SheetSelect.vue';

export default {
  name: 'BirthdayPicker',
  components: { SheetSelect },
  props: {
    loadLabel: { type: String, default: 'Load' },
    independent: { type: Boolean, default: false },
    autoLoad: { type: Boolean, default: false },
    defaultFirst: { type: Boolean, default: false },
  },
  emits: ['load'],
  setup(props, { emit }) {
    const birthdayStore = useBirthdayStore();
    const birthdayList = computed(() => birthdayStore.getBirthdayList);
    const selectId = `birthday-picker-${Math.random().toString(36).slice(2, 8)}`;

    const resolveInitialId = () => {
      if (props.independent) return null;
      const list = birthdayStore.getBirthdayList;
      const saved = birthdayStore.selectedId;
      if (saved != null && list.some((b) => b.id === Number(saved))) return Number(saved);
      if (props.defaultFirst && list.length) return list[0].id;
      return saved;
    };

    const selectedId = ref(resolveInitialId());

    watch(() => birthdayStore.selectedId, (id) => {
      if (!props.independent) selectedId.value = id;
    });

    const cityOf = (place) => {
      const text = String(place || '').trim();
      if (!text) return '';
      return text.split(',')[0].trim();
    };

    const optionLabel = (b) => {
      const name = b.name || 'Unnamed';
      const when = b.birthday ? DateTime.fromISO(b.birthday).toFormat('yyyy-MM-dd HH:mm') : '';
      const city = cityOf(b.place);
      return [name, when, city].filter(Boolean).join(' · ');
    };

    const pickerOptions = computed(() => {
      const people = (birthdayList.value || []).map((b) => ({
        value: b.id,
        label: optionLabel(b),
      }));
      if (props.defaultFirst) return people;
      return [{ value: null, label: 'Choose a saved person…' }, ...people];
    });

    const load = () => {
      const found = birthdayStore.getBirthdayById(selectedId.value);
      if (!found) return;
      if (!props.independent) birthdayStore.selectBirthday(found.id);
      emit('load', found);
    };

    onMounted(() => {
      if (props.autoLoad && selectedId.value != null) load();
    });

    watch(selectedId, (id, prev) => {
      if (!props.autoLoad) return;
      if (id == null) return;
      if (prev != null && Number(id) === Number(prev)) return;
      load();
    });

    return { birthdayList, selectedId, selectId, pickerOptions, load };
  },
};
</script>

<style scoped>
.birthday-picker {
  background: #f4f6fb;
  border: 1px solid #e3e8f0;
  border-radius: 0.5rem;
  padding: 0.85rem 1rem;
  margin-bottom: 1.25rem;
  overflow: visible;
}
.form-label { font-weight: 600; }
.picker-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.5rem;
}
.picker-select {
  flex: 1 1 12rem;
  min-width: 0;
}
.picker-select :deep(.sheet-select-btn) {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.picker-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
@media (max-width: 767.98px) {
  .picker-row {
    flex-direction: column;
    align-items: stretch;
  }
  .picker-select :deep(.sheet-select-btn),
  .picker-actions .btn {
    width: 100%;
    min-height: 44px;
  }
  .picker-actions {
    flex-direction: column;
  }
}
</style>
