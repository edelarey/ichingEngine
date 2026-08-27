<template>
  <div class="hex-studio">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Hexagram Studio</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item"><router-link to="/solfeggio">Music</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">Hexagram Studio</li>
          </ol>
        </nav>
        <p class="mb-0 lead-blurb">
          Hear a hexagram as sound. Yang and yin become long/short notes or six pitches on a chromatic
          scale (after Uakti and Roche). Solfeggio is the map already used on Life Symphony.
          Fibonacci uses the same pitches with durations 1, 1, 2, 3, 5, 8.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <div class="voice-bar card mb-4">
        <div class="card-body">
          <p class="form-label mb-2">Voice</p>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <button
              v-for="v in voices"
              :key="v.id"
              type="button"
              class="btn"
              :class="studio.voice.value === v.id ? 'btn-primary' : 'btn-outline-secondary'"
              @click="studio.setVoice(v.id)"
            >
              {{ v.label }}
            </button>
          </div>
          <p class="mb-0 small text-muted">{{ currentVoiceBlurb }}</p>
        </div>
      </div>

      <ul class="nav nav-pills mb-3">
        <li class="nav-item">
          <button
            type="button"
            class="nav-link"
            :class="{ active: studio.source.value === 'cast' }"
            @click="setSource('cast')"
          >
            Cast readings ({{ studio.castItems.value.length }})
          </button>
        </li>
        <li class="nav-item">
          <button
            type="button"
            class="nav-link"
            :class="{ active: studio.source.value === 'life' }"
            @click="setSource('life')"
          >
            Life Symphony ({{ studio.lifeItems.value.length }})
          </button>
        </li>
        <li class="nav-item">
          <button
            type="button"
            class="nav-link"
            :class="{ active: studio.source.value === 'hexagram' }"
            @click="setSource('hexagram')"
          >
            One hexagram
          </button>
        </li>
      </ul>

      <div v-if="studio.source.value === 'cast'" class="source-panel card mb-4">
        <div class="card-body">
          <p class="mb-3 text-muted">
            Plays each saved consultation: primary hexagram, then the transformed hexagram if lines changed.
            <router-link to="/consult">Cast a reading</router-link>
            if the list is empty.
          </p>
          <div class="form-check form-switch mb-3">
            <input id="play-transformed" class="form-check-input" type="checkbox" v-model="studio.playTransformed.value">
            <label class="form-check-label" for="play-transformed">Include transformed hexagram</label>
          </div>
          <div class="form-check form-switch mb-3">
            <input id="cast-sort" class="form-check-input" type="checkbox" v-model="studio.sortNewestFirst.value">
            <label class="form-check-label" for="cast-sort">
              {{ studio.sortNewestFirst.value ? 'Newest first' : 'Oldest first' }}
            </label>
          </div>
          <p v-if="!studio.castItems.value.length" class="mb-0 text-muted">No saved consultations yet.</p>
          <ul v-else class="item-list">
            <li v-for="item in studio.castItems.value" :key="item.id">
              <button type="button" class="item-btn" :class="{ current: isCurrent(item) }" @click="studio.playOne(item)">
                <span class="item-title">{{ item.title }}</span>
                <span class="item-meta">{{ item.binary }}{{ item.transformedBinary && item.transformedBinary !== item.binary ? ` → ${item.transformedBinary}` : '' }} · {{ item.subtitle }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div v-else-if="studio.source.value === 'life'" class="source-panel card mb-4">
        <div class="card-body">
          <p class="mb-3 text-muted">
            Each natal year is one hexagram, played with the same voice as a cast reading.
            Load a saved symphony, or generate one from a birthday.
          </p>
          <BirthdayPicker load-label="Load birthday" @load="loadBirthday" />
          <p v-if="lifeError" class="text-danger mt-2 mb-0">{{ lifeError }}</p>
          <div class="d-flex flex-wrap gap-2 mt-3">
            <button type="button" class="btn btn-primary" :disabled="lifeLoading" @click="generateLife">
              <span v-if="lifeLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ lifeLoading ? 'Composing…' : 'Generate Life Symphony' }}
            </button>
            <router-link to="/life_symphony" class="btn btn-outline-secondary">Open Life Symphony page</router-link>
          </div>
          <p v-if="lifeSummary" class="small text-muted mt-3 mb-0">{{ lifeSummary }}</p>
          <ul v-if="studio.lifeItems.value.length" class="item-list mt-3">
            <li v-for="item in studio.lifeItems.value" :key="item.id">
              <button type="button" class="item-btn" :class="{ current: isCurrent(item) }" @click="studio.playOne(item)">
                <span class="item-title">{{ item.title }}</span>
                <span class="item-meta">{{ item.binary }} · {{ item.subtitle }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div v-else class="source-panel card mb-4">
        <div class="card-body">
          <p class="mb-3 text-muted">Play any of the 64 hexagrams without a consultation or birth chart.</p>
          <SheetSelect
            id="studio-hex"
            label="Hexagram"
            :options="hexOptions"
            :model-value="studio.selectedHexBinary.value"
            @update:model-value="studio.selectedHexBinary.value = $event"
          />
        </div>
      </div>

      <div class="controls card mb-4">
        <div class="card-body">
          <div class="d-flex flex-wrap gap-2 justify-content-center mb-3">
            <button type="button" class="btn btn-success btn-lg" @click="togglePlay">
              {{ studio.isPlaying.value ? 'Pause' : (studio.canResume.value ? 'Resume' : playLabel) }}
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-lg"
              :disabled="!studio.isPlaying.value && !studio.canResume.value"
              @click="studio.stop()"
            >
              Stop
            </button>
          </div>
          <div class="row g-3 justify-content-center">
            <div class="col-md-4">
              <label class="form-label" for="studio-volume">Volume</label>
              <input id="studio-volume" type="range" class="form-range" min="0" max="1" step="0.05" v-model.number="studio.volume.value">
            </div>
            <div class="col-md-4">
              <label class="form-label" for="studio-speed">Speed: {{ studio.playbackSpeed.value }}x</label>
              <input id="studio-speed" type="range" class="form-range" min="0.5" max="3" step="0.1" v-model.number="studio.playbackSpeed.value">
            </div>
          </div>
          <p class="text-center mb-0 mt-3 progress-line">{{ studio.progressMessage.value || 'Ready' }}</p>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <HexagramToneVisualizer
            :binary="studio.activeHexagram.value"
            :lines="studio.activeLines.value"
            :current-line-index="studio.currentLineIndex.value"
            :current-frequency="studio.currentFrequency.value"
            :is-playing="studio.isPlaying.value"
            :get-waveform="studio.getWaveform"
            palette="cyan"
          />
        </div>
        <div class="col-md-6">
          <div v-if="activeDetails" class="hex-info card">
            <div class="card-body text-center">
              <p class="eyebrow mb-1">{{ studio.currentItem.value?.title || 'Hexagram' }}</p>
              <h2 class="h3 mb-2">{{ activeDetails.name }}</h2>
              <div class="display-4 mb-2">{{ activeDetails.hexagram || activeDetails.symbol }}</div>
              <p class="text-muted mb-3">{{ activeDetails.translation }}</p>
              <p v-if="activeDetails.summary" class="text-start small mb-0">{{ shortSummary }}</p>
            </div>
          </div>
          <div v-else class="hex-info card">
            <div class="card-body text-muted text-center">
              Hexagram details appear here during playback.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue';
import { DateTime } from 'luxon';
import { useHexagramStudio } from '@/composables/useHexagramStudio';
import { MUSIC_VOICES } from '@/const/hexagramMusic';
import { usePageTitle } from '@/composables/usePageTitle';
import { generateLifeSymphony } from '@/utils/lifeSymphonyEngine';
import { useSymphonyStore } from '@/stores/symphony';
import HexagramToneVisualizer from '@/components/HexagramToneVisualizer.vue';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import SheetSelect from '@/components/SheetSelect.vue';
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
  name: 'HexagramStudio',
  components: { HexagramToneVisualizer, BirthdayPicker, SheetSelect },
  setup() {
    usePageTitle('Hexagram Studio');
    const studio = useHexagramStudio();
    const symphonyStore = useSymphonyStore();
    const voices = MUSIC_VOICES;
    const lifeLoading = ref(false);
    const lifeError = ref('');
    const form = reactive(emptyForm());

    const currentVoiceBlurb = computed(() => {
      const found = voices.find((v) => v.id === studio.voice.value);
      return found?.blurb || '';
    });

    const hexOptions = computed(() =>
      (hexagramLibrary.sequence_kingwen() || [])
        .filter((h) => h && h.binary)
        .map((h) => ({
          value: h.binary,
          label: `${h.kingwen || ''} · ${h.translation || h.name} (${h.binary})`,
        }))
    );

    const activeDetails = computed(() => {
      const binary = studio.activeHexagram.value;
      if (!binary) return null;
      return hexagramLibrary.sequence_binary().find((h) => h.binary === binary) || null;
    });

    const shortSummary = computed(() => {
      const raw = String(activeDetails.value?.summary || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (raw.length <= 280) return raw;
      return `${raw.slice(0, 277).trim()}…`;
    });

    const playLabel = computed(() => {
      if (studio.source.value === 'life') return `Play life (${studio.lifeItems.value.length})`;
      if (studio.source.value === 'hexagram') return 'Play hexagram';
      return `Play all (${studio.castItems.value.length})`;
    });

    const lifeSummary = computed(() => {
      const snap = symphonyStore.snapshot;
      if (!snap?.timeline?.length) return '';
      const name = snap.form?.name || 'Saved chart';
      return `${name} · ${snap.timeline.length} years · last saved ${snap.savedAt ? new Date(snap.savedAt).toLocaleString() : ''}`;
    });

    const isCurrent = (item) => {
      const cur = studio.currentItem.value;
      return !!(cur && item && String(cur.id) === String(item.id));
    };

    const setSource = (next) => {
      studio.stop();
      studio.source.value = next;
    };

    const togglePlay = async () => {
      if (studio.isPlaying.value) studio.pause();
      else await studio.playAll();
    };

    const loadBirthday = (birthday) => {
      const dt = DateTime.fromISO(birthday.birthday);
      Object.assign(form, {
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
      lifeError.value = '';
    };

    const generateLife = async () => {
      lifeError.value = '';
      if (!form.date) {
        lifeError.value = 'Load a birthday first.';
        return;
      }
      lifeLoading.value = true;
      try {
        const day = form.date instanceof Date
          ? DateTime.fromJSDate(form.date)
          : DateTime.fromISO(String(form.date));
        if (!day.isValid) throw new Error('Birth date is not valid.');
        const data = await generateLifeSymphony(
          day.toFormat('yyyy-MM-dd'),
          form.time || '12:00',
          Number(form.latitude) || 0,
          Number(form.longitude) || 0,
          form.gender === 'FEMALE' ? 'female' : 'male',
        );
        if (!data?.timeline?.length) throw new Error('No yearly cycle was produced for this birth data.');
        symphonyStore.save({
          form,
          metadata: data.metadata,
          timeline: data.timeline,
          yearIndex: 0,
        });
      } catch (err) {
        console.error(err);
        lifeError.value = err.message || 'Could not generate a Life Symphony.';
      } finally {
        lifeLoading.value = false;
      }
    };

    return {
      studio,
      voices,
      currentVoiceBlurb,
      hexOptions,
      activeDetails,
      shortSummary,
      playLabel,
      lifeSummary,
      lifeLoading,
      lifeError,
      isCurrent,
      setSource,
      togglePlay,
      loadBirthday,
      generateLife,
    };
  },
};
</script>

<style scoped>
.lead-blurb {
  max-width: 46rem;
  color: #4a3b16;
}
.voice-bar,
.source-panel,
.controls,
.hex-info {
  border: 1px solid #e6d5a8;
  background: #fffdf7;
}
.progress-line {
  color: #3d2e10;
  font-weight: 600;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #8a6a22;
}
.item-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 22rem;
  overflow-y: auto;
}
.item-btn {
  width: 100%;
  text-align: left;
  border: 1px solid #e6d5a8;
  background: #fff;
  border-radius: 6px;
  padding: 0.55rem 0.75rem;
  margin-bottom: 0.4rem;
}
.item-btn:hover,
.item-btn.current {
  border-color: #8a6a22;
  background: #fff6dc;
}
.item-title {
  display: block;
  font-weight: 600;
  color: #3d2e10;
}
.item-meta {
  display: block;
  font-size: 0.8rem;
  color: #6b5a32;
}
@media (max-width: 576px) {
  .display-4 {
    font-size: 2rem;
  }
}
</style>
