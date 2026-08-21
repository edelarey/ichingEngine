<template>
  <div class="birth-data-form">
    <div class="row">
      <div v-if="showName" class="col-12 col-md-6 mb-3">
        <label :for="id + '-name'" class="form-label">Name</label>
        <input :id="id + '-name'" type="text" class="form-control" :value="modelValue.name" @input="set('name', $event.target.value)" placeholder="Enter name" />
      </div>
      <div class="col-12" :class="showName ? 'col-md-6' : 'col-md-6'" >
        <label :for="id + '-date'" class="form-label">Birth date</label>
        <input :id="id + '-date'" type="date" class="form-control" :value="dateInput" @input="onDate" />
      </div>
      <div v-if="!showName" class="col-12 col-md-6 mb-3">
        <label :for="id + '-time'" class="form-label">Birth time (civil time at the place)</label>
        <input :id="id + '-time'" type="time" class="form-control" :value="modelValue.time" @input="set('time', $event.target.value)" />
      </div>
    </div>

    <div class="row">
      <div v-if="showName" class="col-12 col-md-4 mb-3">
        <label :for="id + '-time'" class="form-label">Birth time (civil time at the place)</label>
        <input :id="id + '-time'" type="time" class="form-control" :value="modelValue.time" @input="set('time', $event.target.value)" />
      </div>
      <div class="col-12" :class="showName ? 'col-md-4' : 'col-md-6'" >
        <label :for="id + '-tz'" class="form-label">Timezone of birth place</label>
        <select :id="id + '-tz'" class="form-select" :value="modelValue.timezoneOffset" @change="set('timezoneOffset', Number($event.target.value))">
          <option v-for="tz in presets" :key="tz.label + tz.offset" :value="tz.offset">{{ tz.label }}</option>
        </select>
        <div class="form-text">Used for Vedic Lagna and Western Rising. I-Ching uses the clock time as entered.</div>
      </div>
      <div v-if="showGender" class="col-12" :class="showName ? 'col-md-4' : 'col-md-6'">
        <label :for="id + '-gender'" class="form-label">Gender</label>
        <select :id="id + '-gender'" class="form-select" :value="modelValue.gender" @change="set('gender', $event.target.value)">
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </div>
    </div>

    <div class="mb-3 position-relative">
      <label :for="id + '-place'" class="form-label">Birth place</label>
      <input
        :id="id + '-place'"
        type="text"
        class="form-control"
        :value="modelValue.place"
        autocomplete="off"
        placeholder="Search a city, e.g. New Delhi or Chicago"
        @input="onPlaceInput"
        @focus="showHits = hits.length > 0"
      />
      <div v-if="searching" class="form-text">Searching…</div>
      <div v-if="searchError" class="form-text text-danger">{{ searchError }}</div>
      <ul v-if="showHits && hits.length" class="place-hits list-group">
        <li
          v-for="hit in hits"
          :key="hit.label + hit.latitude"
          class="list-group-item list-group-item-action"
          @mousedown.prevent="choosePlace(hit)"
        >
          {{ hit.label }}
        </li>
      </ul>
    </div>

    <div class="row">
      <div class="col-12 col-md-6 mb-3">
        <label :for="id + '-lat'" class="form-label">Latitude</label>
        <input :id="id + '-lat'" type="number" step="any" class="form-control" :value="modelValue.latitude" @input="set('latitude', Number($event.target.value))" />
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label :for="id + '-lng'" class="form-label">Longitude</label>
        <input :id="id + '-lng'" type="number" step="any" class="form-control" :value="modelValue.longitude" @input="set('longitude', Number($event.target.value))" />
      </div>
    </div>

    <div v-if="showHouseSystem" class="mb-3">
      <label :for="id + '-houses'" class="form-label">House system</label>
      <select :id="id + '-houses'" class="form-select" :value="modelValue.houseSystem || 'placidus'" @change="set('houseSystem', $event.target.value)">
        <option value="placidus">Placidus</option>
        <option value="equal">Equal (from Ascendant)</option>
      </select>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { DateTime } from 'luxon';
import { searchPlaces, offsetForZone, timezonePresetsWithBrowser } from '@/utils/placeSearch';

export default {
  name: 'BirthDataForm',
  props: {
    modelValue: { type: Object, required: true },
    showName: { type: Boolean, default: true },
    showGender: { type: Boolean, default: true },
    showHouseSystem: { type: Boolean, default: false },
    id: { type: String, default: 'birth' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const hits = ref([]);
    const showHits = ref(false);
    const searching = ref(false);
    const searchError = ref('');
    let timer = null;
    const presets = computed(() => timezonePresetsWithBrowser());

    const dateInput = computed(() => {
      const d = props.modelValue.date;
      if (!d) return '';
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
      const dt = d instanceof Date ? DateTime.fromJSDate(d) : DateTime.fromISO(String(d));
      return dt.isValid ? dt.toFormat('yyyy-MM-dd') : '';
    });

    const set = (key, value) => {
      emit('update:modelValue', { ...props.modelValue, [key]: value });
    };

    const onDate = (event) => {
      const value = event.target.value;
      emit('update:modelValue', {
        ...props.modelValue,
        date: value ? new Date(`${value}T12:00:00`) : props.modelValue.date,
      });
    };

    const onPlaceInput = (event) => {
      const q = event.target.value;
      set('place', q);
      searchError.value = '';
      clearTimeout(timer);
      if (q.trim().length < 2) {
        hits.value = [];
        showHits.value = false;
        return;
      }
      timer = setTimeout(async () => {
        searching.value = true;
        try {
          hits.value = await searchPlaces(q);
          showHits.value = hits.value.length > 0;
        } catch (err) {
          searchError.value = 'Could not search places. You can still type coordinates.';
          hits.value = [];
        } finally {
          searching.value = false;
        }
      }, 400);
    };

    const choosePlace = (hit) => {
      const offset = offsetForZone(hit.timezoneName, props.modelValue.date, props.modelValue.time);
      emit('update:modelValue', {
        ...props.modelValue,
        place: hit.label,
        latitude: Math.round(hit.latitude * 1e6) / 1e6,
        longitude: Math.round(hit.longitude * 1e6) / 1e6,
        timezoneOffset: offset,
        timezoneName: hit.timezoneName,
      });
      hits.value = [];
      showHits.value = false;
    };

    return {
      presets, hits, showHits, searching, searchError,
      dateInput, set, onDate, onPlaceInput, choosePlace,
    };
  },
};
</script>

<style scoped>
.birth-data-form {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 0.5rem;
}
.form-label { font-weight: 600; }
.place-hits {
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  max-height: 220px;
  overflow: auto;
}
</style>
