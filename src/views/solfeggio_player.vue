<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Solfeggio Healing Player</h3>
          </div>
          <div class="card-body">
            <p class="text-muted mb-4">
              Hear I Ching readings as Solfeggio tones. Each hexagram line is a frequency;
              yang is longer and an octave higher, yin is softer and shorter.
            </p>

            <div v-if="readingCount === 0" class="alert alert-info">
              No saved consultations yet.
              <router-link to="/consult">Cast a reading</router-link>
              to play your own hexagrams, or start with the sample below.
            </div>

            <div class="d-flex flex-wrap gap-3 justify-content-center mb-4 align-items-center">
              <button
                type="button"
                class="btn btn-lg btn-success px-4"
                @click="togglePlayAll"
                :disabled="readingCount === 0 && !canResume"
              >
                {{ isPlaying ? 'Pause' : (canResume ? 'Resume' : `Play all (${readingCount})`) }}
              </button>
              <button
                type="button"
                class="btn btn-lg btn-outline-success px-4"
                @click="playSample"
                :disabled="isPlaying"
              >
                Play sample
              </button>
              <button
                type="button"
                class="btn btn-lg btn-danger px-4"
                @click="stop"
                :disabled="!isPlaying && !canResume"
              >
                Stop
              </button>
            </div>

            <div class="row g-3 mb-4 justify-content-center">
              <div class="col-md-4">
                <label class="form-label" for="sol-volume">Volume</label>
                <input
                  id="sol-volume"
                  type="range"
                  class="form-range"
                  min="0"
                  max="1"
                  step="0.05"
                  v-model.number="volume"
                >
              </div>
              <div class="col-md-4">
                <label class="form-label" for="sol-speed">Playback speed: {{ playbackSpeed }}x</label>
                <input
                  id="sol-speed"
                  type="range"
                  class="form-range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  v-model.number="playbackSpeed"
                >
              </div>
              <div class="col-md-4 d-flex align-items-end justify-content-center">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="sortOrder" v-model="sortNewestFirst">
                  <label class="form-check-label" for="sortOrder">
                    {{ sortNewestFirst ? 'Newest first' : 'Oldest first' }}
                  </label>
                </div>
              </div>
            </div>

            <div class="alert alert-secondary text-center" role="alert">
              <h5 class="alert-heading mb-1">{{ progressMessage || 'Ready to play' }}</h5>
              <div v-if="currentReading" class="mt-2 small text-muted">
                {{ new Date(currentReading.timestamp).toLocaleString() }} — {{ currentReading.question }}
              </div>
            </div>

            <div class="row g-4 align-items-center">
              <div class="col-md-6">
                <HexagramToneVisualizer
                  :binary="activeHexagram"
                  :current-line-index="currentLineIndex"
                  :current-frequency="currentFrequency"
                  :is-playing="isPlaying"
                  :get-waveform="getWaveform"
                  palette="cyan"
                />
              </div>
              <div class="col-md-6">
                <div v-if="activeHexagramDetails" class="card h-100 border-0 bg-light">
                  <div class="card-body text-center">
                    <h2 class="h3 mb-2">{{ activeHexagramDetails.name }}</h2>
                    <div class="display-1 mb-2">{{ activeHexagramDetails.hexagram || activeHexagramDetails.symbol }}</div>
                    <h4 class="text-muted mb-4">{{ activeHexagramDetails.translation }}</h4>
                    <div v-if="activeHexagramDetails.summary" class="text-start">
                      <h5 class="border-bottom pb-2">Summary</h5>
                      <p class="card-text">{{ activeHexagramDetails.summary }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-muted py-5">
                  <p>Hexagram details appear here during playback.</p>
                </div>
              </div>
            </div>

            <div class="text-center text-muted small mt-4">
              <p class="mb-0">
                <strong>Frequencies:</strong> 396 Hz (Root) · 417 Hz (Sacral) · 528 Hz (Solar Plexus) ·
                639 Hz (Heart) · 285 Hz · 174 Hz
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useSolfeggioPlayer } from '@/composables/useSolfeggioPlayer';
import { usePageTitle } from '@/composables/usePageTitle';
import HexagramToneVisualizer from '@/components/HexagramToneVisualizer.vue';
import hexagramLibrary from '@/const/hexagram';

export default {
  name: 'SolfeggioPlayer',
  components: { HexagramToneVisualizer },
  setup() {
    usePageTitle('Solfeggio Player');
    const player = useSolfeggioPlayer();

    const activeHexagramDetails = computed(() => {
      if (!player.activeHexagram.value) return null;
      return hexagramLibrary.sequence_binary().find((h) => h.binary === player.activeHexagram.value);
    });

    const togglePlayAll = async () => {
      if (player.isPlaying.value) player.pause();
      else await player.playAll();
    };

    return {
      ...player,
      activeHexagramDetails,
      togglePlayAll,
    };
  },
};
</script>
