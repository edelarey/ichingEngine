<template>
  <div class="container mt-5 life-symphony">
    <h1 class="mb-4 text-center">Life Symphony</h1>
    <p class="text-center text-muted mb-4">
      Turn an I Ching natal cycle into a year-by-year sequence of Solfeggio tones.
    </p>

    <div v-if="!symphonyData" class="card shadow-sm mx-auto" style="max-width: 800px;">
      <div class="card-body">
        <h5 class="card-title mb-3">Birth details</h5>
        <BirthdayPicker load-label="Load birth data" @load="loadBirthday" />
        <BirthDataForm
          id="symphony"
          :show-name="false"
          :model-value="form"
          @update:model-value="assignForm"
        />
        <p v-if="error" class="text-danger small mt-3 mb-0">{{ error }}</p>
        <div class="d-flex flex-wrap gap-2 mt-3">
          <button type="button" class="btn btn-primary" :disabled="loading" @click="generateSymphony">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Composing…' : 'Generate Symphony' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="symphony-player">
      <div class="controls-sticky card shadow-sm mb-4 sticky-top">
        <div class="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
          <button type="button" class="btn btn-outline-secondary" @click="reset">New chart</button>
          <div class="d-flex align-items-center gap-2">
            <button
              type="button"
              class="btn btn-lg"
              :class="isPlaying ? 'btn-warning' : 'btn-success'"
              @click="togglePlay"
            >
              {{ isPlaying ? 'Pause' : 'Play Symphony' }}
            </button>
            <button type="button" class="btn btn-outline-danger" @click="stop">Stop</button>
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
              style="width: 100px;"
            >
            <span class="small text-muted">{{ playbackSpeed }}x</span>
          </div>
        </div>
      </div>

      <div class="row mb-5" v-if="currentYearData">
        <div class="col-12 text-center mb-4">
          <h2 class="display-4 mb-0">Age {{ currentYearData.age }}</h2>
          <p class="text-muted mb-0">
            {{ currentYearData.year }} · {{ currentYearData.source }} cycle
            <br>
            <small>Step {{ currentYearIndex + 1 }} of {{ symphonyData.timeline.length }}</small>
            <span v-if="currentFrequency"> · {{ Math.round(currentFrequency) }} Hz</span>
          </p>
        </div>

        <div class="col-md-6 mb-4">
          <div class="visualizer-container p-3 border rounded bg-dark position-relative">
            <canvas ref="waveformCanvas" class="waveform-canvas"></canvas>
            <div class="hexagram-overlay">
              <svg class="hexagram-svg" :width="svgWidth" :height="svgHeight" viewBox="0 0 160 240">
                <g v-for="(line, index) in currentHexagramLines" :key="'line-' + index">
                  <g :transform="`translate(0, ${index * 40})`">
                    <g v-if="!line.isYang">
                      <rect
                        x="10" y="10" width="40" height="10"
                        :fill="getLineColor(index)"
                        :class="{ 'active-pulse': currentLineIndex === (5 - index) && isPlaying }"
                      />
                      <rect
                        x="60" y="10" width="40" height="10"
                        :fill="getLineColor(index)"
                        :class="{ 'active-pulse': currentLineIndex === (5 - index) && isPlaying }"
                      />
                    </g>
                    <g v-else>
                      <rect
                        x="10" y="10" width="90" height="10"
                        :fill="getLineColor(index)"
                        :class="{ 'active-pulse': currentLineIndex === (5 - index) && isPlaying }"
                      />
                    </g>
                    <text
                      x="110" y="20"
                      font-size="12"
                      :fill="getLineColor(index)"
                      font-weight="bold"
                    >
                      {{ frequencies[5 - index] }} Hz
                    </text>
                  </g>
                </g>
              </svg>
            </div>
          </div>
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
import { computed, nextTick, onUnmounted, reactive, ref } from 'vue';
import { DateTime } from 'luxon';
import BirthDataForm from '@/components/BirthDataForm.vue';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import { generateLifeSymphony } from '@/utils/lifeSymphonyEngine';
import { useLifeAudio } from '@/composables/useLifeAudio';
import { usePageTitle } from '@/composables/usePageTitle';
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

const frequencies = [396, 417, 528, 639, 285, 174];
const frequencyColors = {
  174: '#FF0000',
  285: '#FFA500',
  396: '#FF0000',
  417: '#FFA500',
  528: '#FFFF00',
  639: '#00FF00',
};
const chakraColors = frequencies.map((f) => frequencyColors[f]);

function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(173, 181, 189, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default {
  name: 'LifeSymphony',
  components: { BirthDataForm, BirthdayPicker },
  setup() {
    usePageTitle('Life Symphony');
    const loading = ref(false);
    const error = ref('');
    const form = reactive(emptyForm());
    const symphonyData = ref(null);
    const waveformCanvas = ref(null);
    let animationFrameId = null;
    const svgWidth = 200;
    const svgHeight = 300;

    const {
      isPlaying,
      currentYearIndex,
      currentLineIndex,
      currentFrequency,
      playbackSpeed,
      loadTimeline,
      play,
      pause,
      stop: stopAudio,
      getWaveform,
    } = useLifeAudio();

    const assignForm = (next) => {
      Object.assign(form, next);
    };

    const currentYearData = computed(() => {
      if (!symphonyData.value) return null;
      return symphonyData.value.timeline[currentYearIndex.value]
        || symphonyData.value.timeline[0]
        || null;
    });

    const currentHexagramLines = computed(() => {
      if (!currentYearData.value?.audio) return [];
      return [...currentYearData.value.audio].reverse();
    });

    const currentHexagramDetails = computed(() => {
      const year = currentYearData.value;
      if (!year) return null;
      if (year.hexagram && year.hexagram.name) return year.hexagram;
      return hexagramLibrary.sequence_binary().find((h) => h.binary === year.hexagramBinary) || null;
    });

    const getLineColor = (index) => {
      const lineIndexFromBottom = 5 - index;
      const color = chakraColors[lineIndexFromBottom];
      if (isPlaying.value && currentLineIndex.value === lineIndexFromBottom) return color;
      const lineData = currentHexagramLines.value[index];
      if (lineData && !lineData.isYang) return hexToRgba(color, 0.5);
      return hexToRgba(color, 0.7);
    };

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

    const stopWaveform = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const sizeCanvas = () => {
      const canvas = waveformCanvas.value;
      if (!canvas) return;
      const width = canvas.offsetWidth || 400;
      const height = canvas.offsetHeight || 300;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
    };

    const drawWaveform = () => {
      animationFrameId = requestAnimationFrame(drawWaveform);
      const canvas = waveformCanvas.value;
      if (!canvas) return;
      sizeCanvas();
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { width, height } = canvas;
      ctx.fillStyle = 'rgba(33, 37, 41, 0.2)';
      ctx.fillRect(0, 0, width, height);
      if (!isPlaying.value) return;
      const values = getWaveform();
      if (!values || !values.length) return;
      const currentColor = currentLineIndex.value >= 0 ? chakraColors[currentLineIndex.value] : '#00ffff';
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = currentColor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = currentColor;
      const sliceWidth = width / values.length;
      let x = 0;
      for (let i = 0; i < values.length; i++) {
        const v = values[i] * 3.0;
        const y = height / 2 + (v * height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const startWaveform = () => {
      stopWaveform();
      sizeCanvas();
      drawWaveform();
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
        loadTimeline(data.timeline);
        await nextTick();
        startWaveform();
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
    };

    const reset = () => {
      stop();
      stopWaveform();
      symphonyData.value = null;
    };

    onUnmounted(() => {
      stop();
      stopWaveform();
    });

    return {
      loading,
      error,
      form,
      assignForm,
      symphonyData,
      loadBirthday,
      generateSymphony,
      isPlaying,
      currentYearIndex,
      currentLineIndex,
      currentFrequency,
      playbackSpeed,
      togglePlay,
      stop,
      reset,
      currentYearData,
      currentHexagramLines,
      currentHexagramDetails,
      frequencies,
      svgWidth,
      svgHeight,
      getLineColor,
      waveformCanvas,
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
.visualizer-container {
  min-height: 300px;
  position: relative;
  overflow: hidden;
  background-color: #212529 !important;
}
.waveform-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.hexagram-overlay {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
  pointer-events: none;
}
.hexagram-svg {
  margin: 0 auto;
  display: block;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
  max-width: 100%;
}
.active-pulse {
  animation: pulse 0.5s infinite alternate;
  filter: drop-shadow(0 0 8px #00ffff);
}
@keyframes pulse {
  from { opacity: 0.7; }
  to { opacity: 1; }
}
</style>
