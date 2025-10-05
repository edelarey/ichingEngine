<template>
  <div class="consult-page">
    <!-- Page Header (macOS Style) -->
    <header class="macos-header py-4 mb-5">
      <div class="container">
        <h1 class="macos-title">Consult</h1>
        <nav aria-label="breadcrumb">
          <ol class="macos-breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">Consult the I Ching</li>
          </ol>
        </nav>
      </div>
    </header>

    <!-- History Toggle Button -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-5 mb-4">
        <button @click="toggleHistory" class="btn btn-info btn-narrow">
          {{ showHistory ? 'Hide History' : 'Show History' }}
        </button>
      </div>
    </div>

    <!-- History Display -->
    <div v-if="showHistory" class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Consultation History</h5>
            <div class="mb-3">
              <button @click="hexagramStore.exportHistory" class="btn btn-success btn-sm me-2">Export History</button>
              <label for="importFile" class="btn btn-primary btn-sm">
                Import History
                <input type="file" id="importFile" @change="handleImport" hidden accept=".json">
              </label>
              <button @click="hexagramStore.clearHistory" class="btn btn-danger btn-sm ms-2">Clear All</button>
            </div>
            <div v-if="hexagramStore.getConsultationHistory.length === 0">
              <p>No consultations recorded yet.</p>
            </div>
            <div v-else>
              <div v-for="consultation in hexagramStore.getConsultationHistory" :key="consultation.id" class="mb-3">
                <p><strong>Date:</strong> {{ DateTime.fromISO(consultation.timestamp).toLocaleString(DateTime.DATETIME_MED) }}</p>
                <p><strong>Question:</strong> {{ consultation.question || 'No question entered' }}</p>
                <p><strong>Method:</strong> {{ consultation.method === 'coin' ? 'Coin Toss' : 'Yarrow Stalk' }}</p>
                <p><strong>Primary Hexagram:</strong> {{ hexagramLibrary.sequence_binary().find(h => h.binary === consultation.primaryHexagram)?.name }}</p>
                <p><strong>Transformed Hexagram:</strong> {{ hexagramLibrary.sequence_binary().find(h => h.binary === consultation.transformedHexagram)?.name }}</p>
                <p><strong>Changing Lines:</strong> {{ consultation.changingLines.length ? consultation.changingLines.join(', ') : 'None' }}</p>
                <div>
                  <router-link :to="`/hexagram_detail?hexagram=${consultation.primaryHexagram}`" class="btn btn-primary btn-sm me-2">View Primary</router-link>
                  <router-link :to="`/hexagram_detail?hexagram=${consultation.transformedHexagram}`" class="btn btn-primary btn-sm me-2">View Transformed</router-link>
                  <button @click="hexagramStore.removeConsultation(consultation.id)" class="btn btn-danger btn-sm">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Consultation Interface -->
    <div v-if="!showHistory">
      <!-- Your Question Card -->
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-5 mb-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">Your Question</h5>
              <textarea v-model="userQuestion" class="form-control text-center input-wide" rows="4" placeholder="Enter your question here..."></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Method Selection -->
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-5 mb-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">Select Divination Method</h5>
              <div class="method-selection-container">
                <div class="method-option" @click.stop.prevent="selectMethod('coin')" :class="{ 'selected': divinationMethod === 'coin' }">
                  <div class="selection-box">
                    <span v-if="divinationMethod === 'coin'" class="selection-mark">✓</span>
                  </div>
                  <label class="method-label">Coin Toss</label>
                </div>
                <div class="method-option" @click.stop.prevent="selectMethod('yarrow')" :class="{ 'selected': divinationMethod === 'yarrow' }">
                  <div class="selection-box">
                    <span v-if="divinationMethod === 'yarrow'" class="selection-mark">✓</span>
                  </div>
                  <label class="method-label">Yarrow Stalk</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generate Line and Reset Buttons -->
      <div class="row justify-content-center align-items-center">
        <div class="col-12 col-md-6 col-lg-5 mb-4">
          <div class="card text-center">
            <div class="card-body">
              <button @click="generateLine" class="btn btn-primary btn-narrow" :disabled="currentLine > 6">
                {{ currentLine > 6 ? 'Reset to Start Over' : `${divinationMethod === 'coin' ? 'Toss Coins' : 'Cast Yarrow'} for Line ${currentLine}` }}
              </button>
              <button @click="reset" class="btn btn-secondary btn-narrow ms-2">Reset</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hexagram Display -->
      <div class="row justify-content-center">
        <!-- Primary Hexagram Card -->
        <div class="col-12 col-md-6 col-lg-5 mb-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">Primary Hexagram</h5>
              <div v-if="primaryHexagram.length > 0" class="center-content">
                <svg class="hexagram-svg" :width="svgWidth" :height="svgHeight">
                  <g v-for="(line, index) in primaryHexagram" :key="index">
                    <g :transform="`translate(0, ${svgHeight - (index + 1) * 40})`">
                      <template v-if="isYin(line)">
                        <rect x="10" y="10" width="40" height="10" fill="black" />
                        <rect x="60" y="10" width="40" height="10" fill="black" />
                        <rect v-if="isChangingLine(line)" x="10" y="10" width="90" height="10" fill="none" stroke="red" stroke-width="2" />
                      </template>
                      <template v-else>
                        <rect x="10" y="10" width="90" height="10" fill="black" />
                        <rect v-if="isChangingLine(line)" x="10" y="10" width="90" height="10" fill="none" stroke="red" stroke-width="2" />
                      </template>
                    </g>
                  </g>
                </svg>
              </div>
              <div v-if="currentLine > 6">
                <p class="card-text display-3">{{ hexagram.name }}</p>
                <p :style="{ color: colorClass }" class="card-text display-1">{{ hexagram.symbol }}</p>
                <p :style="{ color: colorClass }" class="card-text display-6">{{ hexagram.translation }}</p>
                <div v-if="hexagram.summary" class="card-body">
                  <h3 class="card-title">Summary</h3>
                  <p class="card-text display-10" v-html="hexagram.summary"></p>
                </div>
                <div v-if="changingLines.length > 0" class="card-body">
                  <h3 class="card-title">Changing Lines</h3>
                  <div class="card-text display-8" v-html="getChangingLinesText()"></div>
                </div>
                <router-link :to="`/hexagram_detail?hexagram=${hexagram.binary}`" class="btn btn-primary btn-narrow">View Detail</router-link>
              </div>
            </div>
          </div>
        </div>
        <!-- Arrow Card -->
        <div class="col-12 col-md-2 col-lg-1 mb-4 d-flex align-items-center">
          <div class="card text-center w-100">
            <div class="card-body">
              <p class="card-text display-1">→</p>
            </div>
          </div>
        </div>
        <!-- Transformed Hexagram Card -->
        <div class="col-12 col-md-6 col-lg-5 mb-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">Transformed Hexagram</h5>
              <div v-if="transformedHexagram.length > 0" class="center-content">
                <svg class="hexagram-svg" :width="svgWidth" :height="svgHeight">
                  <g v-for="(line, index) in transformedHexagram" :key="index">
                    <g :transform="`translate(0, ${svgHeight - (index + 1) * 40})`">
                      <template v-if="isYin(line)">
                        <rect x="10" y="10" width="40" height="10" fill="black" />
                        <rect x="60" y="10" width="40" height="10" fill="black" />
                        <rect v-if="changedLines.includes(index + 1)" x="10" y="10" width="90" height="10" fill="none" stroke="blue" stroke-width="2" />
                      </template>
                      <template v-else>
                        <rect x="10" y="10" width="90" height="10" fill="black" />
                        <rect v-if="changedLines.includes(index + 1)" x="10" y="10" width="90" height="10" fill="none" stroke="blue" stroke-width="2" />
                      </template>
                    </g>
                  </g>
                </svg>
              </div>
              <div v-if="currentLine > 6">
                <p class="card-text display-3">{{ hexagramTransformed.name }}</p>
                <p :style="{ color: colorClass }" class="card-text display-1">{{ hexagramTransformed.symbol }}</p>
                <p :style="{ color: colorClass }" class="card-text display-6">{{ hexagramTransformed.translation }}</p>
                <div v-if="hexagramTransformed.summary" class="card-body">
                  <h3 class="card-title">Summary</h3>
                  <p class="card-text display-10" v-html="hexagramTransformed.summary"></p>
                </div>
                <router-link :to="`/hexagram_detail?hexagram=${hexagramTransformed.binary}`" class="btn btn-primary btn-narrow">View Detail</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import hexagramLibrary from '@/const/hexagram';
import coin from '@/const/coin';
import { useHexagramStore } from '@/stores/oracle';
import { DateTime } from 'luxon';

export default {
  name: 'Consult',
  setup() {
    const router = useRouter();
    const hexagramStore = useHexagramStore();

    // Reactive state
    const userQuestion = ref('');
    const primaryHexagram = ref([]);
    const transformedHexagram = ref([]);
    const hexagram = ref(null);
    const hexagramTransformed = ref(null);
    const changingLines = ref([]);
    const changedLines = ref([]);
    const currentLine = ref(1);
    const svgWidth = ref(110);
    const svgHeight = ref(240);
    const divinationMethod = ref('coin');
    const showHistory = ref(false);

    // Computed properties
    const colorClass = computed(() => 'rgb(0,0,0)');

    // Methods
    const isYin = (lineValue) => lineValue === 6 || lineValue === 8;
    const isChangingLine = (lineValue) => lineValue === 6 || lineValue === 9;

    const generateYarrowLine = () => {
      const probabilities = [
        { value: 6, weight: 1 }, // Old Yin (1/16)
        { value: 7, weight: 5 }, // Young Yang (5/16)
        { value: 8, weight: 7 }, // Young Yin (7/16)
        { value: 9, weight: 3 }, // Old Yang (3/16)
      ];
      const totalWeight = 16;
      const random = Math.random() * totalWeight;
      let cumulativeWeight = 0;

      for (const option of probabilities) {
        cumulativeWeight += option.weight;
        if (random <= cumulativeWeight) {
          return option.value;
        }
      }
      return 8; // Fallback
    };

    const generateLine = () => {
      console.log('=== generateLine called ===');
      console.log('Current line:', currentLine.value);
      console.log('Divination method:', divinationMethod.value);
      
      if (currentLine.value <= 6) {
        let lineValue;
        try {
          if (divinationMethod.value === 'coin') {
            console.log('Generating coin line...');
            console.log('Coin object:', coin);
            console.log('Coin.generateCoinLine function:', coin.generateCoinLine);
            lineValue = coin.generateCoinLine();
            console.log('Coin line generated:', lineValue);
          } else {
            console.log('Generating yarrow line...');
            lineValue = generateYarrowLine();
            console.log('Yarrow line generated:', lineValue);
          }
          
          console.log('Adding line value to hexagram:', lineValue);
          primaryHexagram.value.push(lineValue);
          const transformedLine = transformLine(lineValue);
          transformedHexagram.value.push(transformedLine);

          if (isChangingLine(lineValue)) {
            changedLines.value.push(currentLine.value);
            console.log('Changing line detected:', currentLine.value);
          }

          currentLine.value++;
          console.log('Moving to next line:', currentLine.value);

          if (currentLine.value === 7) {
            console.log('All lines complete, finalizing hexagrams...');
            finalizeHexagrams();
          }
        } catch (error) {
          console.error('Error in generateLine:', error);
          console.error('Error details:', error.message, error.stack);
        }
      } else {
        console.log('All lines already generated');
      }
    };

    const selectMethod = (method) => {
      console.log('=== selectMethod called ===');
      console.log('Method parameter:', method);
      console.log('Current method before change:', divinationMethod.value);
      
      divinationMethod.value = method;
      
      console.log('Method after change:', divinationMethod.value);
      console.log('=== selectMethod completed ===');
      
      // Ensure we stay on the consult page and don't navigate anywhere
      return false;
    };

    const transformLine = (lineValue) => {
      switch (lineValue) {
        case 6: return 7;
        case 7: return 7;
        case 8: return 8;
        case 9: return 8;
        default:
          console.error('Error in transformLine:', lineValue);
          return lineValue;
      }
    };

    const finalizeHexagrams = () => {
      const primaryBinary = coin.transformCoinHexagramToBinary(primaryHexagram.value);
      const secondaryBinary = coin.transformCoinHexagramToBinary(transformedHexagram.value);
      hexagram.value = hexagramLibrary.sequence_binary().find((item) => item.binary === primaryBinary);
      hexagramTransformed.value = hexagramLibrary.sequence_binary().find((item) => item.binary === secondaryBinary);
      changingLines.value = primaryHexagram.value
        .map((value, index) => (isChangingLine(value) ? index + 1 : null))
        .filter((line) => line !== null);

      hexagramStore.setHexagram(primaryBinary);
      hexagramStore.addConsultation(
        userQuestion.value,
        primaryBinary,
        secondaryBinary,
        changingLines.value,
        divinationMethod.value
      );
    };

    const reset = () => {
      primaryHexagram.value = [];
      transformedHexagram.value = [];
      hexagram.value = null;
      hexagramTransformed.value = null;
      changingLines.value = [];
      changedLines.value = [];
      currentLine.value = 1;
      userQuestion.value = '';
    };

    const getChangingLinesText = () => {
      if (!hexagram.value || !changingLines.value.length) return '';
      const hexagramData = hexagramLibrary.sequence_binary().find((item) => item.binary === hexagram.value.binary);
      if (!hexagramData || !hexagramData.lines) return 'No changing lines information available';

      let result = '';
      changingLines.value.forEach((lineNum) => {
        const pattern = new RegExp(`- \\*\\*Line ${lineNum}:\\*\\*([^]*?)(?=(?:- \\*\\*Line \\d+:\\*\\*)|$)`, 'i');
        const match = hexagramData.lines.match(pattern);
        if (match && match[1]) {
          result += `<p><strong>Line ${lineNum}:</strong> ${match[1].trim()}</p>`;
        }
      });
      return result || 'No changing lines found';
    };

    const toggleHistory = () => {
      showHistory.value = !showHistory.value;
    };

    const handleImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        hexagramStore.importHistory(file).catch((error) => {
          alert('Failed to import history: ' + error.message);
        });
        event.target.value = ''; // Reset file input
      }
    };

    onMounted(() => {
      reset();
    });

    return {
      hexagramLibrary,
      userQuestion,
      primaryHexagram,
      transformedHexagram,
      hexagram,
      hexagramTransformed,
      changingLines,
      changedLines,
      currentLine,
      svgWidth,
      svgHeight,
      divinationMethod,
      showHistory,
      hexagramStore,
      DateTime,
      colorClass,
      isYin,
      isChangingLine,
      generateLine,
      selectMethod,
      reset,
      getChangingLinesText,
      toggleHistory,
      handleImport,
    };
  },
};
</script>

<style scoped>
/* Add any necessary styles here */
.btn-narrow {
  padding: 0.25rem 0.5rem;
}
.input-wide {
  width: 100%;
}
.hexagram-svg {
  margin: 0 auto;
  display: block;
}
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Custom Method Selection Styling */
.method-selection-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  position: relative;
  z-index: 10;
}

.method-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 1rem;
  border-radius: 8px;
  position: relative;
  z-index: 11;
  pointer-events: auto;
  /* Prevent any touch event interference */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.method-option:hover {
  background-color: var(--apple-gray-light);
}

.method-option.selected {
  background-color: var(--apple-blue-light);
}

.selection-box {
  width: 30px;
  height: 30px;
  border: 2px solid var(--apple-gray-medium);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  background: white;
  transition: all 0.3s ease;
  position: relative;
  z-index: 12;
  pointer-events: auto;
}

.method-option.selected .selection-box {
  border-color: var(--apple-blue);
  background-color: var(--apple-blue);
}

.selection-mark {
  color: white;
  font-weight: bold;
  font-size: 18px;
  pointer-events: none;
}

.method-label {
  font-weight: 600;
  color: var(--apple-text-primary);
  margin: 0;
  cursor: pointer;
  pointer-events: none;
  user-select: none;
}

.method-option.selected .method-label {
  color: var(--apple-blue);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .method-selection-container {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    /* Ensure no mobile interference */
    isolation: isolate;
  }
  
  .method-option {
    flex-direction: row;
    width: 200px;
    justify-content: flex-start;
    gap: 1rem;
    /* Enhanced mobile touch handling */
    min-height: 48px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: var(--apple-blue-light);
    /* Prevent any accidental navigation */
    will-change: transform;
    contain: layout style;
  }
  
  .selection-box {
    margin-bottom: 0;
    /* Ensure touch targets are large enough */
    min-width: 30px;
    min-height: 30px;
  }
  
  /* Prevent any router-link interference on mobile */
  .card-body {
    isolation: isolate;
  }
  
  /* Ensure buttons don't interfere with method selection */
  .btn {
    isolation: isolate;
    touch-action: manipulation;
  }
}
</style>