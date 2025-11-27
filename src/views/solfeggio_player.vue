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
            <div class="hexagram-visualizer d-flex flex-column-reverse align-items-center my-4 p-3 border rounded bg-light">
              <div 
                v-for="(freq, index) in frequencies" 
                :key="index"
                class="line-indicator mb-1"
                :class="{ 
                  'active': currentLineIndex === index,
                  'yang': isYang(index),
                  'yin': !isYang(index)
                }"
              >
                <span class="freq-label">{{ freq }} Hz</span>
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
import { computed } from 'vue';
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
      playAll,
      stop
    } = useSolfeggioPlayer();

    const frequencies = [396, 417, 528, 639, 285, 174];

    // Helper to determine if the currently playing line is Yang (1) or Yin (0)
    // This is purely for visualization purposes based on the current reading
    const isYang = (index) => {
      if (!currentReading.value) return false;
      
      // We need to know if we are playing the primary or transformed hexagram
      // But the composable doesn't explicitly expose "which hexagram" is playing, just the reading.
      // However, for a simple visualizer, we can just look at the primary hexagram for now,
      // or ideally, the composable could expose the 'currentHexagramString'.
      // Given the constraints, let's try to infer or just default to primary for visualization structure.
      
      // Actually, let's just check the primary hexagram of the current reading.
      // If we are in the second phase (transformed), this might be inaccurate, 
      // but without more state from the composable, it's a reasonable approximation for the UI structure.
      
      // A better approach: The composable logic plays primary then transformed.
      // We can't easily know which one is active without adding state to the composable.
      // For this UI, we will visualize the Primary Hexagram structure.
      
      const hex = currentReading.value.primaryHexagram;
      return hex && hex[index] === '1';
    };

    return {
      isPlaying,
      currentReading,
      currentLineIndex,
      playbackSpeed,
      sortNewestFirst,
      progressMessage,
      playAll,
      stop,
      frequencies,
      isYang
    };
  }
};
</script>

<style scoped>
.hexagram-visualizer {
  min-height: 200px;
}

.line-indicator {
  width: 100%;
  max-width: 300px;
  height: 30px;
  background-color: #e9ecef;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.3;
}

.line-indicator.active {
  opacity: 1;
  box-shadow: 0 0 15px rgba(13, 110, 253, 0.5);
  transform: scale(1.05);
  background-color: #0d6efd; /* Primary Blue */
  color: white;
  font-weight: bold;
}

.line-indicator.yang {
  /* Solid line style hint if needed, but active state dominates */
}

.line-indicator.yin {
  /* Broken line style hint if needed */
  /* For now, we just use opacity/color to indicate "playing" */
}

.freq-label {
  font-size: 0.9rem;
}
</style>