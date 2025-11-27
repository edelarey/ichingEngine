<template>
  <div class="container mt-5 life-symphony">
    <h1 class="mb-4 text-center">Life Symphony 🎵</h1>
    <p class="text-center text-muted mb-5">
      Generate a unique musical composition based on your I Ching life cycle.
    </p>

    <!-- Saved Birthdays -->
    <div v-if="!symphonyData && birthdayList.length > 0" class="card shadow-sm mx-auto mb-4" style="max-width: 800px;">
      <div class="card-body">
        <h5 class="card-title mb-3">Load Saved Birthday</h5>
        <div class="d-flex gap-2 flex-wrap">
          <button
            v-for="birthday in birthdayList"
            :key="birthday.id"
            class="btn btn-outline-primary btn-sm"
            @click="loadBirthday(birthday)"
          >
            {{ birthday.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Input Form -->
    <div v-if="!symphonyData" class="card shadow-sm mx-auto" style="max-width: 800px;">
      <div class="card-body">
        <h5 class="card-title mb-4">Enter Birth Details</h5>
        
        <!-- Gender Selection (Not in BirthDataForm by default usually, adding here) -->
        <div class="mb-3">
          <label class="form-label">Gender</label>
          <div class="d-flex gap-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="gender" id="male" value="male" v-model="gender">
              <label class="form-check-label" for="male">Male</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="gender" id="female" value="female" v-model="gender">
              <label class="form-check-label" for="female">Female</label>
            </div>
          </div>
        </div>

        <BirthDataForm 
          :birthData="birthData" 
          :loading="loading"
          @update:birthData="updateBirthData"
          @calculate="generateSymphony"
        />
      </div>
    </div>

    <!-- Player & Visualization -->
    <div v-else class="symphony-player">
      
      <!-- Controls -->
      <div class="controls-sticky card shadow-sm mb-4 sticky-top">
        <div class="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <button class="btn btn-outline-secondary me-2" @click="reset">
              <i class="bi bi-arrow-left"></i> New Chart
            </button>
          </div>

          <div class="d-flex align-items-center gap-2">
            <button 
              class="btn btn-lg" 
              :class="isPlaying ? 'btn-warning' : 'btn-success'"
              @click="togglePlay"
            >
              <i class="bi" :class="isPlaying ? 'bi-pause-fill' : 'bi-play-fill'"></i>
              {{ isPlaying ? 'Pause' : 'Play Symphony' }}
            </button>
            <button class="btn btn-outline-danger" @click="stop" :disabled="!isPlaying && currentYearIndex === 0">
              <i class="bi bi-stop-fill"></i>
            </button>
          </div>

          <div class="d-flex align-items-center gap-2">
            <label class="form-label mb-0 small">Speed:</label>
            <input 
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

      <!-- Current Year Display -->
      <div class="row mb-5" v-if="currentYearData">
        <div class="col-12 text-center mb-4">
          <h2 class="display-4 mb-0">Age {{ currentYearData.age }}</h2>
          <p class="text-muted">
            {{ currentYearData.year }} • {{ currentYearData.source }} Cycle
            <br>
            <small>Step {{ currentYearIndex + 1 }} of {{ symphonyData.timeline.length }}</small>
          </p>
        </div>

        <div class="row g-4 align-items-center">
          <!-- Visualizer Column -->
          <div class="col-md-6">
            <div class="visualizer-container p-3 border rounded bg-dark position-relative">
              <!-- Waveform Canvas -->
              <canvas ref="waveformCanvas" class="waveform-canvas"></canvas>            

              <!-- Hexagram Overlay -->
              <div class="hexagram-overlay">
                <svg class="hexagram-svg" :width="svgWidth" :height="svgHeight" viewBox="0 0 160 240">
                  <g v-for="(line, index) in currentHexagramLines" :key="index">
                    <g :transform="`translate(0, ${index * 40})`">
                      
                      <!-- Yin Line (0) -->
                      <template v-if="!line.isYang">
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
                      </template>
                      
                      <!-- Yang Line (1) -->
                      <template v-else>
                        <rect
                          x="10" y="10" width="90" height="10"
                          :fill="getLineColor(index)"
                          :class="{ 'active-pulse': currentLineIndex === (5 - index) && isPlaying }"
                        />
                      </template>

                     <!-- Frequency Label (Static) -->
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

          <!-- Details Column -->
          <div class="col-md-6">
            <div v-if="currentHexagramDetails" class="card h-100 border-0 bg-light">
              <div class="card-body text-center">
                <h2 class="display-4 mb-2">{{ currentHexagramDetails.name }}</h2>
                <div class="display-1 mb-2" :style="{ color: '#333' }">{{ currentHexagramDetails.symbol }}</div>
                <h4 class="text-muted mb-4">{{ currentHexagramDetails.translation }}</h4>
                
                <div v-if="currentHexagramDetails.summary" class="text-start">
                  <h5 class="border-bottom pb-2">Summary</h5>
                  <p class="card-text" v-html="currentHexagramDetails.summary"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import BirthDataForm from '../components/BirthDataForm.vue';
import { generateLifeSymphony } from '../utils/lifeSymphonyEngine';
import { useLifeAudio } from '../composables/useLifeAudio';
import { useBirthdayStore } from '@/stores/birthday';
import hexagramLibrary from '@/const/hexagram';

export default {
  name: 'LifeSymphony',
  components: {
    BirthDataForm
  },
  setup() {
    const birthdayStore = useBirthdayStore();
    const birthdayList = computed(() => birthdayStore.getBirthdayList);

    // State
    const loading = ref(false);
    const gender = ref('male');
    const birthData = ref({
      date: new Date(),
      time: '12:00',
      latitude: 0,
      longitude: 0,
      place: ''
    });
    const symphonyData = ref(null);
    const waveformCanvas = ref(null);
    let animationFrameId = null;

    // Constants
    const frequencies = [396, 417, 528, 639, 285, 174];
    
    const frequencyColors = {
      174: '#FF0000', // Red (Root)
      285: '#FFA500', // Orange (Sacral)
      396: '#FF0000', // Red (Root)
      417: '#FFA500', // Orange (Sacral)
      528: '#FFFF00', // Yellow (Solar Plexus)
      639: '#00FF00', // Green (Heart)
      741: '#0000FF', // Blue (Throat)
      852: '#4B0082', // Indigo (Third Eye)
      963: '#EE82EE'  // Violet (Crown)
    };

    // Chakra colors: Line 0 (bottom) → Line 5 (top)
    const chakraColors = frequencies.map(f => frequencyColors[f]);
    const svgWidth = 200;
    const svgHeight = 300;

    // Audio Composable
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
      setYear,
      getWaveform
    } = useLifeAudio();

    // Computed
    const currentYearData = computed(() => {
      if (!symphonyData.value) return null;
      return symphonyData.value.timeline[currentYearIndex.value];
    });

    const currentHexagramLines = computed(() => {
      if (!currentYearData.value) return [];
      // Audio data already has the line structure we need
      // But we need to reverse it for display (Top line is index 5 in array, but displayed at top)
      // Actually, standard display is usually Top to Bottom visually.
      // Our audio array is 0=Bottom, 5=Top.
      // So for visual stack, we reverse the array.
      return [...currentYearData.value.audio].reverse();
    });

    const currentHexagramDetails = computed(() => {
      if (!currentYearData.value) return null;
      // Find hexagram details from library using binary string
      // Note: hexagramLibrary might expect binary string in a specific order (usually bottom-to-top)
      // currentYearData.hexagramBinary is bottom-to-top
      return hexagramLibrary.sequence_binary().find(h => h.binary === currentYearData.value.hexagramBinary);
    });

    const getLineColor = (index) => {
      // index is 0 (top) to 5 (bottom) in the visual loop because we reversed the array
      // currentLineIndex is 0 (bottom) to 5 (top) from audio engine
      // So we need to match them: visual index 5 corresponds to audio index 0
      const lineIndexFromBottom = 5 - index;
      const color = chakraColors[lineIndexFromBottom];
      
      // If this line is currently playing, make it brighter
      if (isPlaying.value && currentLineIndex.value === lineIndexFromBottom) {
        return color; // Full brightness chakra color for active line
      }
      
      // Yin lines are more transparent/faded
      const lineData = currentHexagramLines.value[index];
      if (lineData && !lineData.isYang) {
        return hexToRgba(color, 0.5); // 50% opacity for yin
      }
      
      return hexToRgba(color, 0.7); // 70% opacity for yang when not active
    };

    // Helper function to convert hex to rgba
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Methods
    const updateBirthData = (newData) => {
      birthData.value = newData;
    };

    const loadBirthday = (birthday) => {
      const dateObj = new Date(birthday.birthday);
      
      // Format time as HH:mm
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      
      birthData.value = {
        date: dateObj,
        time: `${hours}:${minutes}`,
        latitude: birthday.coords.latitude,
        longitude: birthday.coords.longitude,
        place: birthday.place || ''
      };
      
      // Handle gender case sensitivity if needed (store usually has uppercase MALE/FEMALE)
      gender.value = birthday.gender.toLowerCase();
    };

    const generateSymphony = async () => {
      loading.value = true;
      try {
        const dateStr = birthData.value.date.toISOString().split('T')[0];
        const data = await generateLifeSymphony(
          dateStr,
          birthData.value.time,
          birthData.value.latitude,
          birthData.value.longitude,
          gender.value
        );
        
        symphonyData.value = data;
        loadTimeline(data.timeline);
      } catch (error) {
        console.error(error);
        alert('Error generating symphony. Please check your inputs.');
      } finally {
        loading.value = false;
      }
    };

    const togglePlay = () => {
      if (isPlaying.value) {
        pause();
      } else {
        play();
      }
    };

    const stop = () => {
      stopAudio();
    };

    const reset = () => {
      stop();
      symphonyData.value = null;
    };

    const drawWaveform = () => {
      if (!waveformCanvas.value) {
        // If canvas is missing, try again next frame (in case of v-if timing issues)
        animationFrameId = requestAnimationFrame(drawWaveform);
        return;
      }
      
      const canvas = waveformCanvas.value;
      const ctx = canvas.getContext('2d');
      // Ensure canvas resolution matches display size
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }

      const width = canvas.width;
      const height = canvas.height;
      
      // Clear with fade effect
      ctx.fillStyle = 'rgba(33, 37, 41, 0.2)'; // Dark background with trail
      ctx.fillRect(0, 0, width, height);
      
      if (!isPlaying.value) {
        // Still loop so we can catch when it starts playing
        animationFrameId = requestAnimationFrame(drawWaveform);
        return;
      }

      const values = getWaveform();
      
      if (!values || values.length === 0) {
        animationFrameId = requestAnimationFrame(drawWaveform);
        return;
      }

      // Get the current line's chakra color
      // currentLineIndex is 0-5 (bottom to top)
      // If no line is playing (-1), default to cyan or last color
      const currentColor = currentLineIndex.value >= 0 ? chakraColors[currentLineIndex.value] : '#00ffff';
      
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = currentColor; // Use chakra color for waveform
      ctx.shadowBlur = 10;
      ctx.shadowColor = currentColor;

      const sliceWidth = width / values.length;
      let x = 0;

      for (let i = 0; i < values.length; i++) {
        // Scale value (-1 to 1) to canvas height
        // Add some gain to make it visible
        const v = values[i] * 3.0; // Increased gain to make it more visible
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
      loading,
      gender,
      birthData,
      symphonyData,
      birthdayList,
      loadBirthday,
      updateBirthData,
      generateSymphony,
      // Audio
      isPlaying,
      currentYearIndex,
      playbackSpeed,
      togglePlay,
      stop,
      reset,
      // Display
      currentYearData,
      currentHexagramLines,
      currentHexagramDetails,
      frequencies,
      svgWidth,
      svgHeight,
      getLineColor,
      hexToRgba,
      currentLineIndex,
      currentFrequency,
      waveformCanvas,
      chakraColors
    };
  }
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
  background-color: #212529 !important; /* Force dark background */
}

waveform-canvas {
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
  width: 100%; /* Ensure full width for centering */
  pointer-events: none; /* Let clicks pass through to canvas if needed */
}

.hexagram-svg {
  margin: 0 auto;
  display: block;
  filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));
  /* Ensure SVG itself is centered if container is larger */
  max-width: 100%;
}

.frequency-label {
  position: absolute;
  bottom: 10px;
  right: 15px;
  font-family: monospace;
  font-size: 1.2rem;
  color: #ffffff;
  z-index: 3;
  text-shadow: 0 0 10px currentColor;
  font-weight: bold;
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