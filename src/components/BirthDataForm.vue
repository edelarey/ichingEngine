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
          <SheetSelect
            :id="id + '-hour'"
            title="Hour"
            :options="hourOptions"
            :model-value="hourPart"
            @update:model-value="(hour) => setTime(hour, minutePart)"
          />
          <span class="time-colon" aria-hidden="true">:</span>
          <SheetSelect
            :id="id + '-minute'"
            title="Minute"
            :options="minuteOptions"
            :model-value="minutePart"
            @update:model-value="(minute) => setTime(hourPart, minute)"
          />
        </div>
        <div class="form-text">24-hour clock at the birth place (hours : minutes).</div>
      </div>
    </div>

    <div class="row g-3 mt-0">
      <div class="col-12">
        <SheetSelect
          :id="id + '-tz'"
          label="Timezone"
          :options="timezoneOptions"
          :model-value="modelValue.timezoneOffset"
          @update:model-value="(offset) => set('timezoneOffset', Number(offset))"
        />
        <div class="form-text">Needed for Vedic Lagna and Western Rising. Picking a city sets this.</div>
      </div>
      <div v-if="showGender" class="col-12">
        <SheetSelect
          :id="id + '-gender'"
          label="Gender"
          :options="genderOptions"
          :model-value="modelValue.gender"
          @update:model-value="(gender) => set('gender', gender)"
        />
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
        placeholder="City name"
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
            @pointerdown.prevent="choosePlace(hit)"
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
      <SheetSelect
        :id="id + '-houses'"
        label="House system"
        :options="houseOptions"
        :model-value="modelValue.houseSystem || 'placidus'"
        @update:model-value="(system) => set('houseSystem', system)"
      />
    </div>
  </div>
</template>

<script>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { DateTime } from 'luxon';
import { searchPlaces, offsetForZone, timezonePresetsWithBrowser } from '@/utils/placeSearch';
import SheetSelect from '@/components/SheetSelect.vue';

function normalizeTime(value) {
  if (!value) return '12:00';
  const m = String(value).match(/^(\d{1,2}):(\d{2})/);
  if (!m) return '12:00';
  return `${String(m[1]).padStart(2, '0')}:${m[2]}`;
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const hourOptions = hours.map((h) => ({ value: h, label: h }));
const minuteOptions = minutes.map((m) => ({ value: m, label: m }));
const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];
const houseOptions = [
  { value: 'placidus', label: 'Placidus' },
  { value: 'equal', label: 'Equal (from Ascendant)' },
];

export default {
  name: 'BirthDataForm',
  components: { SheetSelect },
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
    const selectedTimezoneLabel = computed(() => {
      const offset = String(props.modelValue.timezoneOffset);
      const match = presets.value.find((tz) => String(tz.offset) === offset);
      return match ? (match.label || match.shortLabel) : '';
    });
    const timezoneOptions = computed(() =>
      presets.value.map((tz) => ({
        value: tz.offset,
        label: tz.shortLabel || tz.label,
      }))
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
          } else {
            await nextTick();
            placeWrap.value?.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
      selectedTimezoneLabel,
      timezoneOptions,
      hourOptions,
      minuteOptions,
      genderOptions,
      houseOptions,
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
.birth-data-form :deep(.form-select),
.birth-data-form :deep(.form-control) {
  max-width: 100%;
  min-width: 0;
}
.form-label {
  font-weight: 600;
}
.time-fields {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 100%;
}
.time-fields :deep(.sheet-select-btn) {
  min-height: 44px;
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
  -webkit-overflow-scrolling: touch;
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
  padding: 0.75rem 0.85rem;
  min-height: 44px;
  cursor: pointer;
}
.place-hit-btn:hover,
.place-hit-btn:focus {
  background: #eef3ff;
}
@media (max-width: 767.98px) {
  .birth-data-form {
    padding: 0.85rem 0;
    background: transparent;
  }
  .birth-data-form :deep(.form-select),
  .birth-data-form :deep(.form-control) {
    min-height: 44px;
  }
  .place-hits {
    position: static;
    max-height: 50vh;
    z-index: 1;
  }
}
</style>
