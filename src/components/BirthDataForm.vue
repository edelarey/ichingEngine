<template>
  <div class="birth-data-form">
    <div v-if="showName" class="mb-3">
      <label :for="id + '-name'" class="form-label">Name</label>
      <input
        :id="id + '-name'"
        type="text"
        class="form-control"
        :value="modelValue.name"
        placeholder="Enter name"
        @input="set('name', $event.target.value)"
      />
    </div>

    <div class="row g-3">
      <div class="col-12">
        <label :for="id + '-date'" class="form-label">Birth date</label>
        <input
          :id="id + '-date'"
          type="date"
          class="form-control"
          :value="dateInput"
          @input="onDate"
        />
      </div>
      <div class="col-12">
        <span class="form-label d-block" :id="id + '-time-label'">Birth time</span>
        <div class="time-fields" role="group" :aria-labelledby="id + '-time-label'">
          <select
            :id="id + '-hour'"
            class="form-select time-select"
            :value="hourPart"
            @change="setTime($event.target.value, minutePart)"
            style="width: auto; min-width: 5.5rem; max-width: 7rem; flex: 0 0 auto;"
          >
            <option v-for="h in hours" :key="'h' + h" :value="h">{{ h }}</option>
          </select>
          <span class="time-colon" aria-hidden="true">:</span>
          <select
            :id="id + '-minute'"
            class="form-select time-select"
            :value="minutePart"
            @change="setTime(hourPart, $event.target.value)"
            style="width: auto; min-width: 5.5rem; max-width: 7rem; flex: 0 0 auto;"
          >
            <option v-for="m in minutes" :key="'m' + m" :value="m">{{ m }}</option>
          </select>
        </div>
        <div class="form-text">24-hour clock at the birth place (hours : minutes).</div>
      </div>
    </div>

    <div class="row g-3 mt-0">
      <div class="col-12">
        <label :for="id + '-tz'" class="form-label">Timezone</label>
        <select
          :id="id + '-tz'"
          class="form-select"
          :value="String(modelValue.timezoneOffset)"
          @change="set('timezoneOffset', Number($event.target.value))"
        >
          <option v-for="tz in presets" :key="tz.label + tz.offset" :value="String(tz.offset)">
            {{ tz.label }}
          </option>
        </select>
        <div class="form-text">Needed for Vedic Lagna and Western Rising. Picking a city sets this.</div>
      </div>
      <div v-if="showGender" class="col-12">
        <label :for="id + '-gender'" class="form-label">Gender</label>
        <select
          :id="id + '-gender'"
          class="form-select"
          :value="modelValue.gender"
          @change="set('gender', $event.target.value)"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </div>
    </div>

    <div ref="placeWrap" class="mb-3 mt-3 place-wrap">
      <label :for="id + '-place'" class="form-label">Birth place</label>
      <input
        :id="id + '-place'"
        type="text"
        class="form-control"
        v-model="placeText"
        autocomplete="off"
        placeholder="Type a city, then pick from the list"
        @focus="showHits = hits.length > 0"
        @input="onPlaceTyped"
        @keydown.escape="showHits = false"
      />
      <div v-if="searching" class="form-text">Searching…</div>
      <div v-if="searchError" class="form-text text-danger">{{ searchError }}</div>
      <ul v-show="showHits && hits.length" class="place-hits" role="listbox">
        <li v-for="hit in hits" :key="hit.label + hit.latitude + hit.longitude">
          <button
            type="button"
            class="place-hit-btn"
            @mousedown.prevent="choosePlace(hit)"
            @click.prevent="choosePlace(hit)"
          >
            {{ hit.label }}
          </button>
        </li>
      </ul>
    </div>

    <div class="row g-3">
      <div class="col-12 col-md-6">
        <label :for="id + '-lat'" class="form-label">Latitude</label>
        <input
          :id="id + '-lat'"
          type="number"
          step="any"
          class="form-control"
          :value="modelValue.latitude"
          @input="set('latitude', Number($event.target.value))"
        />
      </div>
      <div class="col-12 col-md-6">
        <label :for="id + '-lng'" class="form-label">Longitude</label>
        <input
          :id="id + '-lng'"
          type="number"
          step="any"
          class="form-control"
          :value="modelValue.longitude"
          @input="set('longitude', Number($event.target.value))"
        />
      </div>
    </div>

    <div v-if="showHouseSystem" class="mt-3 mb-0">
      <label :for="id + '-houses'" class="form-label">House system</label>
      <select
        :id="id + '-houses'"
        class="form-select"
        :value="modelValue.houseSystem || 'placidus'"
        @change="set('houseSystem', $event.target.value)"
      >
        <option value="placidus">Placidus</option>
        <option value="equal">Equal (from Ascendant)</option>
      </select>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { DateTime } from 'luxon';
import { searchPlaces, offsetForZone, timezonePresetsWithBrowser } from '@/utils/placeSearch';

function normalizeTime(value) {
  if (!value) return '12:00';
  const m = String(value).match(/^(\d{1,2}):(\d{2})/);
  if (!m) return '12:00';
  return `${String(m[1]).padStart(2, '0')}:${m[2]}`;
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

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
    const placeText = ref(props.modelValue.place || '');
    const placeWrap = ref(null);
    let timer = null;
    const presets = computed(() =>
      timezonePresetsWithBrowser(props.modelValue.timezoneOffset, props.modelValue.timezoneName)
    );

    watch(
      () => props.modelValue.place,
      (place) => {
        if (place !== placeText.value) placeText.value = place || '';
      }
    );

    const dateInput = computed(() => {
      const d = props.modelValue.date;
      if (!d) return '';
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
      const dt = d instanceof Date ? DateTime.fromJSDate(d) : DateTime.fromISO(String(d));
      return dt.isValid ? dt.toFormat('yyyy-MM-dd') : '';
    });

    const timeInput = computed(() => normalizeTime(props.modelValue.time));
    const hourPart = computed(() => timeInput.value.slice(0, 2));
    const minutePart = computed(() => timeInput.value.slice(3, 5));

    // Always emit a full form object. Parents that v-model a `reactive()` proxy
    // must still merge with Object.assign — replacing the proxy wipes fields.
    const patch = (partial) => {
      emit('update:modelValue', { ...props.modelValue, ...partial });
    };

    const set = (key, value) => {
      patch({ [key]: value });
    };

    const setTime = (hour, minute) => {
      patch({ time: `${hour}:${minute}` });
    };

    const onDate = (event) => {
      const value = event.target.value;
      patch({
        date: value ? new Date(`${value}T12:00:00`) : '',
      });
    };

    const onPlaceTyped = () => {
      patch({ place: placeText.value });
      searchError.value = '';
      clearTimeout(timer);
      const q = placeText.value.trim();
      if (q.length < 2) {
        hits.value = [];
        showHits.value = false;
        return;
      }
      timer = setTimeout(async () => {
        searching.value = true;
        try {
          hits.value = await searchPlaces(q);
          showHits.value = hits.value.length > 0;
          if (!hits.value.length) {
            searchError.value = 'No matches. Try a city name, or enter coordinates below.';
          }
        } catch (err) {
          searchError.value = 'Place search is unavailable. Enter coordinates below.';
          hits.value = [];
        } finally {
          searching.value = false;
        }
      }, 350);
    };

    const choosePlace = (hit) => {
      const offset = offsetForZone(hit.timezoneName, props.modelValue.date, props.modelValue.time);
      placeText.value = hit.label;
      showHits.value = false;
      hits.value = [];
      patch({
        place: hit.label,
        latitude: Math.round(hit.latitude * 1e6) / 1e6,
        longitude: Math.round(hit.longitude * 1e6) / 1e6,
        timezoneOffset: offset,
        timezoneName: hit.timezoneName,
      });
    };

    const onDocClick = (event) => {
      if (placeWrap.value && !placeWrap.value.contains(event.target)) {
        showHits.value = false;
      }
    };

    onMounted(() => document.addEventListener('click', onDocClick));
    onUnmounted(() => {
      document.removeEventListener('click', onDocClick);
      clearTimeout(timer);
    });

    return {
      presets,
      hours,
      minutes,
      hits,
      showHits,
      searching,
      searchError,
      placeText,
      placeWrap,
      dateInput,
      hourPart,
      minutePart,
      set,
      setTime,
      onDate,
      onPlaceTyped,
      choosePlace,
    };
  },
};
</script>

<style scoped>
.birth-data-form {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 0.5rem;
  overflow: visible;
}
.form-label {
  font-weight: 600;
}
.time-fields {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 100%;
}
.birth-data-form .time-select {
  flex: 0 0 auto;
  width: auto !important;
  min-width: 5.5rem;
  max-width: 7rem;
}
.time-colon {
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1;
}
.place-wrap {
  position: relative;
  z-index: 5;
  overflow: visible;
}
.place-hits {
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 30;
  max-height: 240px;
  overflow: auto;
  background: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.12);
}
.place-hits li + li {
  border-top: 1px solid #eee;
}
.place-hit-btn {
  display: block;
  width: 100%;
  text-align: left;
  background: #fff;
  border: 0;
  padding: 0.6rem 0.85rem;
  cursor: pointer;
}
.place-hit-btn:hover,
.place-hit-btn:focus {
  background: #eef3ff;
}
</style>
