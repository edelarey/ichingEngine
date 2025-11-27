<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-10">
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

            <!-- Main Display Area -->
            <div class="row g-4 align-items-center">
              <!-- Visualizer Column -->
              <div class="col-md-6">
                <div class="visualizer-container p-3 border rounded bg-dark position-relative">
                  <!-- Waveform Canvas -->
                  <canvas ref="waveformCanvas" class="waveform-canvas"></canvas>
                  
                  <!-- Frequency Label -->
                  <div v-if="currentFrequency > 0" class="frequency-label">
                    {{ Math.round(currentFrequency) }} Hz
                  </div>

                  <!-- Hexagram Overlay -->
                  <div v-if="activeHexagram" class="hexagram-overlay">
                    <svg class="hexagram-svg" :width="svgWidth" :height="svgHeight">
                      <g v-for="(char, index) in activeHexagram" :key="index">
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

                          <!-- Frequency Label (Static) -->
                          <text 
                            x="110" y="20" 
                            font-size="12" 
                            :fill="currentLineIndex === index ? '#00ffff' : '#6c757d'"
                            font-weight="bold"
                          >
                            {{ frequencies[index] }} Hz
                          </text>

                        </g>
                      </g>
                    </svg>
                  </div>
                  <div v-else class="text-muted py-5 text-center">
                    <i class="bi bi-music-note-list display-4"></i>
                    <p class="mt-2">Press Play to start visualization</p>
                  </div>
                </div>
              </div>

              <!-- Details Column -->
              <div class="col-md-6">
                <div v-if="activeHexagramDetails" class="card h-100 border-0 bg-light">
                  <div class="card-body text-center">
                    <h2 class="display-4 mb-2">{{ activeHexagramDetails.name }}</h2>
                    <div class="display-1 mb-2" :style="{ color: '#333' }">{{ activeHexagramDetails.symbol }}</div>
                    <h4 class="text-muted mb-4">{{ activeHexagramDetails.translation }}</h4>
                    
                    <div v-if="activeHexagramDetails.summary" class="text-start">
                      <h5 class="border-bottom pb-2">Summary</h5>
                      <p class="card-text" v-html="activeHexagramDetails.summary"></p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-muted py-5">
                  <p>Hexagram details will appear here during playback.</p>
                </div>
              </div>
            </div>
            
            <div class="text-center text-muted small mt-4">
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useSolfeggioPlayer } from '../composables/useSolfeggioPlayer';
import hexagramLibrary from '@/const/hexagram';

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
      currentFrequency,
      getWaveform,
      playAll,
      stop
    } = useSolfeggioPlayer();

    const frequencies = [396, 417, 528, 639, 285, 174];
    const svgWidth = ref(160);
    const svgHeight = ref(240);
    const waveformCanvas = ref(null);
    let animationFrameId = null;

    // Computed property to get details for the currently active hexagram
    const activeHexagramDetails = computed(() => {
      if (!activeHexagram.value) return null;
      return hexagramLibrary.sequence_binary().find(h => h.binary === activeHexagram.value);
    });

    const getLineColor = (index) => {
      if (currentLineIndex.value === index) {
        return '#00ffff'; // Cyan for active line
      }
      return '#444'; // Dark gray for inactive
    };

    const drawWaveform = () => {
      if (!waveformCanvas.value) return;
      
      const canvas = waveformCanvas.value;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear with fade effect
      ctx.fillStyle = 'rgba(33, 37, 41, 0.2)'; // Dark background with trail
      ctx.fillRect(0, 0, width, height);
      
      if (!isPlaying.value) {
        animationFrameId = requestAnimationFrame(drawWaveform);
        return;
      }

      const values = getWaveform();
      if (!values) {
        animationFrameId = requestAnimationFrame(drawWaveform);
        return;
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ffff'; // Cyan glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffff';

      const sliceWidth = width / values.length;
      let x = 0;

      for (let i = 0; i < values.length; i++) {
        // Scale value (-1 to 1) to canvas height
        // Add some gain to make it visible
        const v = values[i] * 1.5; 
        const y = (height / 2) + (v * height / 2);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      
      // Reset shadow for next frame performance
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(drawWaveform);
    };

    onMounted(() => {
      // Initialize canvas size
      if (waveformCanvas.value) {
        waveformCanvas.value.width = waveformCanvas.value.offsetWidth;
        waveformCanvas.value.height = waveformCanvas.value.offsetHeight;
      }
      
      // Start loop
      drawWaveform();
      
      // Handle resize
      window.addEventListener('resize', () => {
        if (waveformCanvas.value) {
          waveformCanvas.value.width = waveformCanvas.value.offsetWidth;
          waveformCanvas.value.height = waveformCanvas.value.offsetHeight;
        }
      });
    });

    onUnmounted(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', () => {});
    });

    return {
      isPlaying,
      currentReading,
      currentLineIndex,
      playbackSpeed,
      sortNewestFirst,
      progressMessage,
      activeHexagram,
      currentFrequency,
      playAll,
      stop,
      frequencies,
      svgWidth,
      svgHeight,
      getLineColor,
      waveformCanvas,
      activeHexagramDetails
    };
  }
};
</script>

<style scoped>
.visualizer-container {
  min-height: 300px;
  position: relative;
  overflow: hidden;
  background-color: #212529 !important; /* Force dark background */
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
  height: 100%;
  pointer-events: none; /* Let clicks pass through to canvas if needed */
}

.hexagram-svg {
  margin: 0 auto;
  display: block;
  filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));
}

.frequency-label {
  position: absolute;
  bottom: 10px;
  right: 15px;
  font-family: monospace;
  font-size: 1.2rem;
  color: #00ffff;
  z-index: 3;
  text-shadow: 0 0 5px #00ffff;
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