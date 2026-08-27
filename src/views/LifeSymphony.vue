<template>
  <div class="container mt-5 life-symphony">
    <h1 class="mb-4 text-center">Life Symphony</h1>
    <p class="text-center text-muted mb-4">
      Turn an I Ching natal cycle into a year-by-year sequence of Solfeggio tones.
      To hear the same years as line-rhythm or scale,
      <router-link to="/hexagram_studio">open Hexagram Studio</router-link>.
    </p>

    <BirthDetailsPanel v-model="showForms" :summary="birthSummary" class="mx-auto" style="max-width: 800px;">
      <BirthdayPicker load-label="Load birth data" @load="loadBirthday" />
      <BirthDataForm
        id="symphony"
        :show-name="false"
        :model-value="form"
        @update:model-value="assignForm"
      />
    </BirthDetailsPanel>
    <p v-if="error" class="text-danger small mt-2 mb-0 text-center">{{ error }}</p>
    <div class="d-flex flex-wrap gap-2 mt-3 justify-content-center">
      <button type="button" class="btn btn-primary" :disabled="loading" @click="generateSymphony">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        {{ loading ? 'Composing…' : 'Generate Symphony' }}
      </button>
    </div>

    <div v-if="symphonyData" class="symphony-player mt-4">
      <div class="controls-sticky card shadow-sm mb-4 sticky-top">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <button type="button" class="btn btn-outline-secondary" @click="reset">New chart</button>
            <div class="d-flex align-items-center gap-2">
              <button
                type="button"
                class="btn btn-lg"
                :class="isPlaying ? 'btn-warning' : 'btn-success'"
                @click="togglePlay"
              >
                {{ isPlaying ? 'Pause' : (canResume ? 'Resume' : 'Play Symphony') }}
              </button>
              <button type="button" class="btn btn-outline-danger" @click="stop">Stop</button>
            </div>
            <div class="d-flex align-items-center gap-3 flex-wrap">
              <div class="d-flex align-items-center gap-2">
                <label class="form-label mb-0 small" for="symphony-volume">Volume</label>
                <input
                  id="symphony-volume"
                  type="range"
                  class="form-range"
                  min="0"
                  max="1"
                  step="0.05"
                  v-model.number="volume"
                  style="width: 90px;"
                >
              </div>
              <div class="d-flex align-items-center gap-2">
                <label class="form-label mb-0 small" for="symphony-speed">Speed</label>
                <input
                  id="symphony-speed"
                  type="range"
                  class="form-range"
                  min="0.5"
                  max="4"
                  step="0.1"
                  v-model.number="playbackSpeed"
                  style="width: 90px;"
                >
                <span class="small text-muted">{{ playbackSpeed }}x</span>
              </div>
            </div>
          </div>

          <div class="year-scrubber">
            <div class="d-flex align-items-center gap-2">
              <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="currentYearIndex <= 0" @click="stepYear(-1)">Prev</button>
              <input
                type="range"
                class="form-range flex-grow-1"
                min="0"
                :max="Math.max(0, symphonyData.timeline.length - 1)"
                :value="currentYearIndex"
                @input="onScrub($event.target.value)"
              >
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                :disabled="currentYearIndex >= symphonyData.timeline.length - 1"
                @click="stepYear(1)"
              >
                Next
              </button>
            </div>
            <div class="small text-muted text-center mt-1" v-if="currentYearData">
              Age {{ currentYearData.age }} · {{ currentYearData.year }} · step {{ currentYearIndex + 1 }} / {{ symphonyData.timeline.length }}
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-5" v-if="currentYearData">
        <div class="col-12 text-center mb-4">
          <h2 class="display-4 mb-0">Age {{ currentYearData.age }}</h2>
          <p class="text-muted mb-0">
            {{ currentYearData.year }} · {{ currentYearData.source }} cycle
            <span v-if="currentFrequency"> · {{ Math.round(currentFrequency) }} Hz</span>
          </p>
        </div>

        <div class="col-md-6 mb-4">
          <HexagramToneVisualizer
            :lines="currentYearData.audio"
            :current-line-index="currentLineIndex"
            :current-frequency="currentFrequency"
            :is-playing="isPlaying"
            :get-waveform="getWaveform"
            palette="chakra"
          />
        </div>

        <div class="col-md-6 mb-4">
          <div v-if="currentHexagramDetails" class="card h-100 border-0 bg-light">
            <div class="card-body text-center">
              <h2 class="h3 mb-2">{{ currentHexagramDetails.name }}</h2>
              <div class="display-1 mb-2">{{ currentHexagramDetails.hexagram || currentHexagramDetails.symbol }}</div>
              <h4 class="text-muted mb-4">{{ currentHexagramDetails.translation }}</h4>
              <div v-if="currentHexagramDetails.summary" class="text-start">
                <h5 class="border-bottom pb-2">Summary</h5>
                <p class="card-text">{{ currentHexagramDetails.summary }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { DateTime } from 'luxon';
import BirthDataForm from '@/components/BirthDataForm.vue';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import BirthDetailsPanel from '@/components/BirthDetailsPanel.vue';
import { summarizeBirth } from '@/utils/birthSummary';
import HexagramToneVisualizer from '@/components/HexagramToneVisualizer.vue';
import { generateLifeSymphony } from '@/utils/lifeSymphonyEngine';
import { useLifeAudio } from '@/composables/useLifeAudio';
import { usePageTitle } from '@/composables/usePageTitle';
import { useSymphonyStore } from '@/stores/symphony';
import hexagramLibrary from '@/const/hexagram';

function emptyForm() {
  return {
    name: '',
    date: new Date(),
    time: '12:00',
    gender: 'MALE',
    latitude: 0,
    longitude: 0,
    place: '',
    timezoneOffset: -new Date().getTimezoneOffset(),
    timezoneName: '',
  };
}

export default {
  name: 'LifeSymphony',
  components: { BirthDataForm, BirthdayPicker, HexagramToneVisualizer, BirthDetailsPanel },
  setup() {
    usePageTitle('Life Symphony');
    const symphonyStore = useSymphonyStore();
    const loading = ref(false);
    const error = ref('');
    const showForms = ref(true);
    const form = reactive(emptyForm());
    const birthSummary = computed(() => summarizeBirth(form));
    const symphonyData = ref(null);

    const {
      isPlaying,
      currentYearIndex,
      currentLineIndex,
      currentFrequency,
      playbackSpeed,
      volume,
      canResume,
      loadTimeline,
      play,
      pause,
      stop: stopAudio,
      setYear,
      getWaveform,
    } = useLifeAudio();

    const assignForm = (next) => {
      Object.assign(form, next);
    };

    const persist = () => {
      if (!symphonyData.value) return;
      symphonyStore.save({
        form,
        metadata: symphonyData.value.metadata,
        timeline: symphonyData.value.timeline,
        yearIndex: currentYearIndex.value,
      });
    };

    const currentYearData = computed(() => {
      if (!symphonyData.value) return null;
      return symphonyData.value.timeline[currentYearIndex.value]
        || symphonyData.value.timeline[0]
        || null;
    });

    const currentHexagramDetails = computed(() => {
      const year = currentYearData.value;
      if (!year) return null;
      if (year.hexagram && year.hexagram.name) return year.hexagram;
      return hexagramLibrary.sequence_binary().find((h) => h.binary === year.hexagramBinary) || null;
    });

    const loadBirthday = (birthday) => {
      const dt = DateTime.fromISO(birthday.birthday);
      assignForm({
        name: birthday.name || '',
        date: dt.isValid ? dt.toJSDate() : new Date(),
        time: dt.isValid ? dt.toFormat('HH:mm') : '12:00',
        gender: birthday.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
        latitude: birthday.coords.latitude,
        longitude: birthday.coords.longitude,
        place: birthday.place || '',
        timezoneOffset: typeof birthday.timezoneOffset === 'number'
          ? birthday.timezoneOffset
          : (dt.isValid ? dt.offset : -new Date().getTimezoneOffset()),
        timezoneName: birthday.timezoneName || '',
      });
      error.value = '';
    };

    const applySnapshot = (snapshot) => {
      if (!snapshot?.timeline?.length) return false;
      const rawDate = snapshot.form?.date;
      let savedDate = new Date();
      if (rawDate instanceof Date && !Number.isNaN(rawDate.getTime())) {
        savedDate = rawDate;
      } else if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
        savedDate = new Date(`${rawDate.slice(0, 10)}T12:00:00`);
      } else if (rawDate) {
        const parsed = new Date(rawDate);
        if (!Number.isNaN(parsed.getTime())) savedDate = parsed;
      }
      assignForm({
        ...emptyForm(),
        ...(snapshot.form || {}),
        date: savedDate,
      });
      symphonyData.value = {
        metadata: snapshot.metadata,
        timeline: snapshot.timeline,
      };
      loadTimeline(snapshot.timeline, snapshot.yearIndex || 0);
      showForms.value = false;
      return true;
    };

    const generateSymphony = async () => {
      error.value = '';
      if (!form.date) {
        error.value = 'Birth date is required.';
        return;
      }
      loading.value = true;
      try {
        const day = form.date instanceof Date
          ? DateTime.fromJSDate(form.date)
          : DateTime.fromISO(String(form.date));
        if (!day.isValid) throw new Error('Birth date is not valid.');
        const data = await generateLifeSymphony(
          day.toFormat('yyyy-MM-dd'),
          form.time || '12:00',
          Number(form.latitude),
          Number(form.longitude),
          form.gender === 'FEMALE' ? 'female' : 'male'
        );
        if (!data?.timeline?.length) throw new Error('No yearly cycle was produced for this birth data.');
        symphonyData.value = data;
        loadTimeline(data.timeline, 0);
        persist();
        showForms.value = false;
      } catch (err) {
        console.error(err);
        error.value = err.message || 'Could not generate the symphony. Check the birth data.';
      } finally {
        loading.value = false;
      }
    };

    const togglePlay = async () => {
      if (isPlaying.value) pause();
      else await play();
    };

    const stop = () => {
      stopAudio();
      persist();
    };

    const reset = () => {
      stopAudio();
      symphonyStore.clear();
      symphonyData.value = null;
      showForms.value = true;
    };

    const onScrub = (value) => {
      setYear(Number(value));
      persist();
    };

    const stepYear = (delta) => {
      setYear(currentYearIndex.value + delta);
      persist();
    };

    watch(currentYearIndex, () => persist());

    onMounted(() => {
      if (symphonyStore.snapshot) applySnapshot(symphonyStore.snapshot);
    });

    onUnmounted(() => {
      persist();
      stopAudio();
    });

    return {
      loading,
      error,
      form,
      assignForm,
      showForms,
      birthSummary,
      symphonyData,
      loadBirthday,
      generateSymphony,
      isPlaying,
      currentYearIndex,
      currentLineIndex,
      currentFrequency,
      playbackSpeed,
      volume,
      canResume,
      togglePlay,
      stop,
      reset,
      onScrub,
      stepYear,
      currentYearData,
      currentHexagramDetails,
      getWaveform,
    };
  },
};
</script>

<style scoped>
.life-symphony {
  padding-bottom: 100px;
}
.controls-sticky {
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
}
.year-scrubber {
  max-width: 720px;
  margin: 0 auto;
}
</style>
