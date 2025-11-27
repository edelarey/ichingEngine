<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0"><i class="bi bi-music-note-beamed me-2"></i>Solfeggio Healing Player</h3>
          </div>
          <div class="card-body">
            <p class="text-muted mb-4">
              Experience your I Ching readings as a sequence of healing Solfeggio frequencies.
              Each line corresponds to a specific frequency, creating a unique sonic landscape for your divination journey.
            </p>

            <!-- Controls -->
            <div class="d-flex flex-wrap gap-3 justify-content-center mb-4 align-items-center">
              <button 
                class="btn btn-lg btn-success px-4" 
                @click="playAll" 
                :disabled="isPlaying"
              >
                <i class="bi bi-play-fill me-1"></i> Play All
              </button>
              
              <button 
                class="btn btn-lg btn-danger px-4" 
                @click="stop" 
                :disabled="!isPlaying"
              >
                <i class="bi bi-stop-fill me-1"></i> Stop
              </button>
            </div>

            <!-- Settings -->
            <div class="row g-3 mb-4 justify-content-center">
              <div class="col-md-6">
                <label class="form-label">Playback Speed: {{ playbackSpeed }}x</label>
                <input 
                  type="range" 
                  class="form-range" 
                  min="0.5" 
                  max="2" 
                  step="0.1" 
                  v-model.number="playbackSpeed"
                >
              </div>
              <div class="col-md-6 d-flex align-items-center justify-content-center">
                <div class="form-check form-switch">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="sortOrder" 
                    v-model="sortNewestFirst"
                  >
                  <label class="form-check-label" for="sortOrder">
                    {{ sortNewestFirst ? 'Newest First' : 'Oldest First' }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Status Display -->
            <div class="alert alert-secondary text-center" role="alert">
              <h5 class="alert-heading mb-1">{{ progressMessage || 'Ready to play' }}</h5>
              <div v-if="currentReading" class="mt-2 small text-muted">
                {{ new Date(currentReading.timestamp).toLocaleString() }} - {{ currentReading.question }}
              </div>
            </div>

            <!-- Visualizer -->
            <div class="hexagram-visualizer d-flex flex-column align-items-center my-4 p-3 border rounded bg-light">
              <div v-if="activeHexagram" class="center-content">
                <svg class="hexagram-svg" :width="svgWidth" :height="svgHeight">
                  <!-- Loop through lines from top (index 5) to bottom (index 0) for display -->
                  <!-- But SVG coordinates are top-down. -->
                  <!-- Hexagram string index 0 is BOTTOM line. -->
                  <!-- So index 0 should be at the BOTTOM of the SVG. -->
                  <!-- SVG Height is 240. Line height ~40. -->
                  <!-- Index 0 (Bottom) -> y = 240 - 40 = 200 -->
                  <!-- Index 5 (Top) -> y = 240 - 6*40 = 0 -->
                  
                  <g v-for="(char, index) in activeHexagram" :key="index">
                    <!-- Transform to position line correctly. index 0 is bottom line. -->
                    <g :transform="`translate(0, ${svgHeight - (index + 1) * 40})`">
                      
                      <!-- Yin Line (0) -->
                      <template v-if="char === '0'">
                        <rect 
                          x="10" y="10" width="40" height="10" 
                          :fill="getLineColor(index)" 
                          :class="{ 'active-pulse': currentLineIndex === index }"
                        />
                        <rect 
                          x="60" y="10" width="40" height="10" 
                          :fill="getLineColor(index)" 
                          :class="{ 'active-pulse': currentLineIndex === index }"
                        />
                      </template>
                      
                      <!-- Yang Line (1) -->
                      <template v-else>
                        <rect 
                          x="10" y="10" width="90" height="10" 
                          :fill="getLineColor(index)" 
                          :class="{ 'active-pulse': currentLineIndex === index }"
                        />
                      </template>

                      <!-- Frequency Label (Optional, to the right) -->
                      <text 
                        x="110" y="20" 
                        font-size="12" 
                        :fill="currentLineIndex === index ? '#0d6efd' : '#6c757d'"
                        font-weight="bold"
                      >
                        {{ frequencies[index] }} Hz
                      </text>

                    </g>
                  </g>
                </svg>
              </div>
              <div v-else class="text-muted py-5">
                <i class="bi bi-music-note-list display-4"></i>
                <p class="mt-2">Press Play to start visualization</p>
              </div>
            </div>
            
            <div class="text-center text-muted small mt-3">
              <p>
                <strong>Frequencies:</strong> 396 Hz (Root) • 417 Hz (Sacral) • 528 Hz (Solar Plexus) • 
                639 Hz (Heart) • 285 Hz (Throat/Third Eye) • 174 Hz (Crown)
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useSolfeggioPlayer } from '../composables/useSolfeggioPlayer';

export default {
  name: 'SolfeggioPlayer',
  setup() {
    const {
      isPlaying,
      currentReading,
      currentLineIndex,
      playbackSpeed,
      sortNewestFirst,
      progressMessage,
      activeHexagram,
      playAll,
      stop
    } = useSolfeggioPlayer();

    const frequencies = [396, 417, 528, 639, 285, 174];
    const svgWidth = ref(160); // Increased width for labels
    const svgHeight = ref(240);

    const getLineColor = (index) => {
      if (currentLineIndex.value === index) {
        return '#0d6efd'; // Active Blue
      }
      return 'black'; // Default
    };

    return {
      isPlaying,
      currentReading,
      currentLineIndex,
      playbackSpeed,
      sortNewestFirst,
      progressMessage,
      activeHexagram,
      playAll,
      stop,
      frequencies,
      svgWidth,
      svgHeight,
      getLineColor
    };
  }
};
</script>

<style scoped>
.hexagram-visualizer {
  min-height: 300px;
  transition: all 0.3s ease;
}

.hexagram-svg {
  margin: 0 auto;
  display: block;
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.active-pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}
</style>