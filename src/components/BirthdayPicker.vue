<template>
  <div class="birthday-picker">
    <div class="d-flex flex-wrap align-items-end gap-2">
      <div class="flex-grow-1">
        <label class="form-label mb-1" :for="selectId">Saved birthday</label>
        <select :id="selectId" class="form-select" v-model="selectedId">
          <option :value="null">Choose a saved person…</option>
          <option v-for="b in birthdayList" :key="b.id" :value="b.id">
            {{ optionLabel(b) }}
          </option>
        </select>
      </div>
      <button type="button" class="btn btn-primary" :disabled="!selectedId" @click="load">
        {{ loadLabel }}
      </button>
      <router-link to="/birthdays" class="btn btn-outline-secondary">Manage birthdays</router-link>
    </div>
    <p v-if="birthdayList.length === 0" class="small text-muted mt-2 mb-0">
      No saved birthdays yet.
      <router-link to="/birthdays">Add one</router-link>
      to use it in I-Ching, Vedic, and Western astrology.
    </p>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { DateTime } from 'luxon';
import { useBirthdayStore } from '@/stores/birthday';

export default {
  name: 'BirthdayPicker',
  props: {
    loadLabel: { type: String, default: 'Load' },
  },
  emits: ['load'],
  setup(props, { emit }) {
    const birthdayStore = useBirthdayStore();
    const birthdayList = computed(() => birthdayStore.getBirthdayList);
    const selectedId = ref(birthdayStore.selectedId);
    const selectId = `birthday-picker-${Math.random().toString(36).slice(2, 8)}`;

    watch(() => birthdayStore.selectedId, (id) => {
      selectedId.value = id;
    });

    const optionLabel = (b) => {
      const when = b.birthday ? DateTime.fromISO(b.birthday).toFormat('yyyy-MM-dd HH:mm') : '';
      const place = b.place ? ` · ${b.place}` : '';
      return `${b.name || 'Unnamed'} — ${when}${place}`;
    };

    const load = () => {
      const found = birthdayStore.getBirthdayById(selectedId.value);
      if (!found) return;
      birthdayStore.selectBirthday(found.id);
      emit('load', found);
    };

    return { birthdayList, selectedId, selectId, optionLabel, load };
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
}
.form-label { font-weight: 600; }
</style>
