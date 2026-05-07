<template>
  <div class="harmony-chamber">

    <!-- ═══════════════════════════════════════════════════════
         HEADER
    ═══════════════════════════════════════════════════════ -->
    <header class="chamber-header">
      <div class="header-symbol">☯</div>
      <h1 class="chamber-title">Harmony Chamber</h1>
      <p class="chamber-subtitle">Discover the sacred resonance between two souls through the ancient wisdom of I Ching</p>
    </header>

    <!-- ═══════════════════════════════════════════════════════
         BIRTH DATA INPUT PANELS
    ═══════════════════════════════════════════════════════ -->
    <div class="input-panels">

      <!-- Person A -->
      <div class="person-panel panel-a">
        <h2 class="panel-title panel-title--a">✦ Person A</h2>
        <div class="field-group">
          <label class="field-label">Name</label>
          <input
            v-model="nameA"
            type="text"
            class="field-input"
            placeholder="Person A"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Birth Date</label>
          <input
            v-model="birthDataA.date"
            type="date"
            class="field-input"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Birth Time</label>
          <input
            v-model="birthDataA.time"
            type="time"
            class="field-input"
          />
        </div>
        <div class="field-row">
          <div class="field-group field-group--half">
            <label class="field-label">Latitude</label>
            <input
              v-model.number="birthDataA.latitude"
              type="number"
              min="-90"
              max="90"
              step="any"
              class="field-input"
              placeholder="0.00"
            />
          </div>
          <div class="field-group field-group--half">
            <label class="field-label">Longitude</label>
            <input
              v-model.number="birthDataA.longitude"
              type="number"
              min="-180"
              max="180"
              step="any"
              class="field-input"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <!-- Person B -->
      <div class="person-panel panel-b">
        <h2 class="panel-title panel-title--b">✦ Person B</h2>
        <div class="field-group">
          <label class="field-label">Name</label>
          <input
            v-model="nameB"
            type="text"
            class="field-input"
            placeholder="Person B"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Birth Date</label>
          <input
            v-model="birthDataB.date"
            type="date"
            class="field-input"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Birth Time</label>
          <input
            v-model="birthDataB.time"
            type="time"
            class="field-input"
          />
        </div>
        <div class="field-row">
          <div class="field-group field-group--half">
            <label class="field-label">Latitude</label>
            <input
              v-model.number="birthDataB.latitude"
              type="number"
              min="-90"
              max="90"
              step="any"
              class="field-input"
              placeholder="0.00"
            />
          </div>
          <div class="field-group field-group--half">
            <label class="field-label">Longitude</label>
            <input
              v-model.number="birthDataB.longitude"
              type="number"
              min="-180"
              max="180"
              step="any"
              class="field-input"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         CALCULATE BUTTON
    ═══════════════════════════════════════════════════════ -->
    <div class="calculate-section">
      <button
        class="btn-oracle"
        :disabled="isCalculating"
        @click="calculate"
      >
        <span v-if="isCalculating" class="spinner"></span>
        <span v-else>☯ Consult the Oracle</span>
      </button>
      <div v-if="error" class="error-message">⚠ {{ error }}</div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         TABS + CONTENT  (only shown once results exist)
    ═══════════════════════════════════════════════════════ -->
    <div v-if="results" class="results-section">

      <!-- Tab Bar -->
      <nav class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-pill"
          :class="{ 'tab-pill--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>

      <!-- Tab Content -->
      <transition name="fade">

        <!-- ─── Tab 1: Overview ─── -->
        <div v-if="activeTab === 'overview'" key="overview" class="tab-panel">
          <CompatibilityScore
            v-bind="compatibilityProps"
            @cast-joint-oracle="handleCastOracle"
            @play-life-symphony="switchToSymphony"
          />
          <div v-if="results" class="interpretation">
            <h3 class="interp-title">{{ results.jointHex?.name || 'Joint Hexagram' }} — Oracle Message</h3>
            <p class="judgement">{{ results.jointHex?.judgement }}</p>
            <p class="image">{{ results.jointHex?.image }}</p>
          </div>
        </div>

        <!-- ─── Tab 2: Visual Mandala ─── -->
        <div v-else-if="activeTab === 'mandala'" key="mandala" class="tab-panel">
          <div class="mandala-wrapper">
            <svg viewBox="0 0 600 600" class="mandala-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="mandala-bg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#1a1a2e" />
                  <stop offset="100%" stop-color="#0a0a1a" />
                </radialGradient>
                <filter id="mandala-glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="center-glow">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <!-- Background -->
              <circle cx="300" cy="300" r="300" fill="url(#mandala-bg)" />

              <!-- Outer ring guide circle -->
              <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(255,215,0,0.08)" stroke-width="1" />
              <!-- Middle ring guide -->
              <circle cx="300" cy="300" r="150" fill="none" stroke="rgba(168,216,234,0.08)" stroke-width="1" />
              <!-- Inner ring -->
              <circle cx="300" cy="300" r="80" fill="none" stroke="rgba(200,169,81,0.15)" stroke-width="1" />

              <!-- Outer rotating trigram group -->
              <g>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 300 300"
                  to="360 300 300"
                  dur="120s"
                  repeatCount="indefinite"
                />
                <!-- 8 trigrams at 0°, 45°, 90°, ... 315° (r=240) -->
                <g v-for="(trig, idx) in trigramRing" :key="'trig-' + idx">
                  <!-- Connection line from center to trigram -->
                  <line
                    :x1="300"
                    :y1="300"
                    :x2="300 + 240 * Math.cos((idx * 45 - 90) * Math.PI / 180)"
                    :y2="300 + 240 * Math.sin((idx * 45 - 90) * Math.PI / 180)"
                    :stroke="trig.color"
                    stroke-width="1"
                    stroke-opacity="0.3"
                  />
                  <!-- Trigram symbol -->
                  <text
                    :x="300 + 240 * Math.cos((idx * 45 - 90) * Math.PI / 180)"
                    :y="300 + 240 * Math.sin((idx * 45 - 90) * Math.PI / 180)"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-size="28"
                    :fill="trig.color"
                    filter="url(#mandala-glow)"
                  >{{ trig.symbol }}</text>
                </g>
              </g>

              <!-- Middle ring: Person A hexagram at 270° (top), Person B at 90° (bottom) -->
              <!-- Person A (gold) at 270° -->
              <text
                :x="300 + 150 * Math.cos((-90 - 90) * Math.PI / 180)"
                :y="300 + 150 * Math.sin((-90 - 90) * Math.PI / 180)"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="32"
                fill="#ffd700"
                filter="url(#mandala-glow)"
              >{{ results.hexA?.hexagram || '䷀' }}</text>
              <text
                :x="300 + 150 * Math.cos((-90 - 90) * Math.PI / 180)"
                :y="308 + 150 * Math.sin((-90 - 90) * Math.PI / 180) + 24"
                text-anchor="middle"
                font-size="9"
                fill="#ffd700"
                opacity="0.7"
              >{{ nameA }}</text>

              <!-- Person B (silver-blue) at 90° -->
              <text
                :x="300 + 150 * Math.cos((90 - 90) * Math.PI / 180)"
                :y="300 + 150 * Math.sin((90 - 90) * Math.PI / 180)"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="32"
                fill="#7ec8e3"
                filter="url(#mandala-glow)"
              >{{ results.hexB?.hexagram || '䷁' }}</text>
              <text
                :x="300 + 150 * Math.cos((90 - 90) * Math.PI / 180)"
                :y="308 + 150 * Math.sin((90 - 90) * Math.PI / 180) + 24"
                text-anchor="middle"
                font-size="9"
                fill="#7ec8e3"
                opacity="0.7"
              >{{ nameB }}</text>

              <!-- Center: joint hexagram with pulsing glow -->
              <circle cx="300" cy="300" r="60" fill="rgba(200,169,81,0.08)" filter="url(#center-glow)">
                <animate attributeName="r" values="55;65;55" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
              </circle>
              <text
                x="300"
                y="300"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="36"
                fill="#c8a951"
                filter="url(#center-glow)"
              >{{ results.jointHex?.hexagram || '☯' }}</text>
            </svg>

            <!-- Mantra section -->
            <div class="mantra-section">
              <div class="om-symbol">ॐ</div>
              <p class="mantra-label">
                Hum Mantra Frequency:
                <strong>{{ musicalFrequency }} Hz</strong>
              </p>
              <button class="btn-bell" @click="soundHarmonyBell">
                🔔 Sound the Harmony Bell
              </button>
            </div>
          </div>
        </div>

        <!-- ─── Tab 3: Life Symphony ─── -->
        <div v-else-if="activeTab === 'symphony'" key="symphony" class="tab-panel">
          <div class="symphony-columns">
            <div class="person-frequencies">
              <h4 class="freq-title freq-title--a">{{ nameA }} — Harmonic Signature</h4>
              <div v-for="(freq, i) in SOLFEGGIO" :key="'fa-' + i" class="freq-row">
                <span class="freq-line-label">Line {{ i + 1 }}</span>
                <span class="freq-value">{{ freq }} Hz</span>
              </div>
            </div>
            <div class="person-frequencies">
              <h4 class="freq-title freq-title--b">{{ nameB }} — Harmonic Signature</h4>
              <div v-for="(freq, i) in SOLFEGGIO" :key="'fb-' + i" class="freq-row">
                <span class="freq-line-label">Line {{ i + 1 }}</span>
                <span class="freq-value">{{ freq }} Hz</span>
              </div>
            </div>
          </div>

          <div class="symphony-controls">
            <button class="btn-symphony-gen" @click="generateCoupleSymphony">
              🎵 Generate Couple Symphony
            </button>
          </div>

          <div class="playback-controls">
            <button class="btn-playback" @click="play" :disabled="!symphonyLoaded">▶ Play</button>
            <button class="btn-playback" @click="pause">⏸ Pause</button>
            <button class="btn-playback" @click="stop">⏹ Stop</button>
            <span class="playback-pos">
              Year {{ currentYearIndex + 1 }} of {{ totalYears }}
            </span>
          </div>

          <canvas ref="waveformCanvas" width="600" height="120" class="waveform-canvas"></canvas>

          <div class="download-section">
            <button class="btn-download" @click="downloadSymphony">
              ⬇ Download Symphony Data
            </button>
          </div>
        </div>

        <!-- ─── Tab 4: Analysis ─── -->
        <div v-else-if="activeTab === 'analysis'" key="analysis" class="tab-panel">

          <!-- Primary joint hexagram -->
          <div class="analysis-block">
            <h3 class="analysis-heading">Joint Hexagram</h3>
            <div class="joint-display">
              <HexagramSymbol
                :binary="results.jointHex?.binary || ''"
                :hexagram-symbol="results.jointHex?.hexagram || ''"
                :show-visual="true"
                size="large"
                color="#c8a951"
              />
              <div class="joint-meta">
                <p class="joint-num">King Wen № {{ results.jointHex?.kingwen }}</p>
                <p class="joint-name">{{ results.jointHex?.name }}</p>
                <p class="joint-trans">{{ results.jointHex?.translation }}</p>
                <p class="joint-judgement">{{ results.jointHex?.judgement }}</p>
                <p class="joint-image">{{ results.jointHex?.image }}</p>
              </div>
            </div>
          </div>

          <!-- Changing lines -->
          <div class="analysis-block" v-if="movingLinesData.changingLines && movingLinesData.changingLines.length">
            <h3 class="analysis-heading">Changing Lines</h3>
            <p class="analysis-sub">{{ movingLinesData.label }} — {{ movingLinesData.description }}</p>
            <div
              v-for="lineIdx in movingLinesData.changingLines"
              :key="'cl-' + lineIdx"
              class="changing-line-item"
            >
              <span class="cl-badge">Line {{ lineIdx + 1 }}</span>
              <span class="cl-text">{{ getJointLineText(lineIdx) }}</span>
            </div>
          </div>
          <div class="analysis-block" v-else>
            <h3 class="analysis-heading">Changing Lines</h3>
            <p class="analysis-sub">{{ movingLinesData.label }} — {{ movingLinesData.description }}</p>
          </div>

          <!-- Nuclear hexagram -->
          <div class="analysis-block">
            <h3 class="analysis-heading">Nuclear Hexagram</h3>
            <div class="joint-display">
              <HexagramSymbol
                :binary="results.nuclearHex?.binary || ''"
                :hexagram-symbol="results.nuclearHex?.hexagram || ''"
                :show-visual="true"
                size="normal"
                color="#7ec8e3"
              />
              <div class="joint-meta">
                <p class="joint-name">{{ results.nuclearHex?.name }}</p>
                <p class="joint-judgement">{{ results.nuclearHex?.judgement }}</p>
                <p class="joint-image">{{ results.nuclearHex?.image }}</p>
              </div>
            </div>
          </div>

          <!-- Practical guidance -->
          <div class="analysis-block">
            <h3 class="analysis-heading">Practical Guidance</h3>
            <ul class="ritual-list">
              <li
                v-for="(tip, i) in ritualTips"
                :key="'tip-' + i"
                class="ritual-item"
              >
                <span class="ritual-num">{{ i + 1 }}</span>
                <span>{{ tip }}</span>
              </li>
            </ul>
          </div>
        </div>

      </transition>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CompatibilityScore from '@/components/CompatibilityScore.vue'
import HexagramSymbol from '@/components/HexagramSymbol.vue'
import { useLifeAudio } from '@/composables/useLifeAudio'
import { calculateDatingCompatibility, calculateAstrologyProfile } from '@/utils/datingCompatibility'
import { generateLifeSymphony } from '@/utils/lifeSymphonyEngine'
import hexagramConst from '@/const/hexagram'

const { getHexagramByBinary, innerHexagram } = hexagramConst

export default {
  name: 'HarmonyChamber',

  components: {
    CompatibilityScore,
    HexagramSymbol,
  },

  setup() {
    const route = useRoute()
    const router = useRouter()

    // ─── Solfeggio constant ───────────────────────────────────────────────
    const SOLFEGGIO = [396, 417, 528, 639, 285, 174]

    // ─── State ────────────────────────────────────────────────────────────
    const nameA = ref('Person A')
    const nameB = ref('Person B')
    const birthDataA = ref({ date: '', time: '12:00', latitude: 0, longitude: 0, place: '' })
    const birthDataB = ref({ date: '', time: '12:00', latitude: 0, longitude: 0, place: '' })
    const isCalculating = ref(false)
    const activeTab = ref('overview')
    const results = ref(null)
    const symphonyLoaded = ref(false)
    const error = ref(null)
    const waveformCanvas = ref(null)

    // ─── Tabs definition ──────────────────────────────────────────────────
    const tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'mandala',  label: 'Visual Mandala' },
      { id: 'symphony', label: 'Life Symphony' },
      { id: 'analysis', label: 'Analysis' },
    ]

    // ─── Life Audio composable ───────────────────────────────────────────
    const {
      isPlaying,
      currentYearIndex,
      totalYears,
      loadTimeline,
      play,
      pause,
      stop,
      getWaveform,
    } = useLifeAudio()

    // ─── Trigram ring for mandala ─────────────────────────────────────────
    const ELEMENT_COLORS = {
      Wood:  '#4caf50',
      Fire:  '#f44336',
      Earth: '#8d6e63',
      Metal: '#9e9e9e',
      Water: '#2196f3',
    }
    const trigramRing = [
      { symbol: '☰', color: ELEMENT_COLORS.Metal  },
      { symbol: '☱', color: ELEMENT_COLORS.Metal  },
      { symbol: '☲', color: ELEMENT_COLORS.Fire   },
      { symbol: '☳', color: ELEMENT_COLORS.Wood   },
      { symbol: '☴', color: ELEMENT_COLORS.Wood   },
      { symbol: '☵', color: ELEMENT_COLORS.Water  },
      { symbol: '☶', color: ELEMENT_COLORS.Earth  },
      { symbol: '☷', color: ELEMENT_COLORS.Earth  },
    ]

    // ─── Element harmony table ────────────────────────────────────────────
    const ELEMENT_HARMONY = {
      'Wood-Fire': 85,  'Fire-Wood': 85,
      'Fire-Earth': 80, 'Earth-Fire': 80,
      'Earth-Metal': 80,'Metal-Earth': 80,
      'Metal-Water': 85,'Water-Metal': 85,
      'Water-Wood': 85, 'Wood-Water': 85,
      'Wood-Earth': 45, 'Earth-Wood': 45,
      'Fire-Metal': 45, 'Metal-Fire': 45,
      'Earth-Water': 45,'Water-Earth': 45,
      'Metal-Wood': 45, 'Wood-Metal': 45,
      'Water-Fire': 40, 'Fire-Water': 40,
      'Wood-Wood': 65,  'Fire-Fire': 65,
      'Earth-Earth': 65,'Metal-Metal': 65,
      'Water-Water': 65,
    }

    // ─── Local helper functions ───────────────────────────────────────────

    function deriveElementalPolarity(elemA, elemB) {
      const key = `${elemA}-${elemB}`
      const score = ELEMENT_HARMONY[key] ?? 50
      const description =
        score >= 80 ? 'Generative cycle — each nourishes the other'
        : score >= 60 ? 'Harmonious resonance'
        : score >= 45 ? 'Controlling cycle — creative tension'
        : 'Challenging polarity — growth through contrast'
      return { score, label: `${elemA} & ${elemB}`, description }
    }

    function deriveTrigramHarmony(hexA, hexB) {
      if (!hexA?.binary || !hexB?.binary) return { score: 50, label: 'Trigram Harmony' }
      const lowerA = hexA.binary.slice(0, 3)
      const upperA = hexA.binary.slice(3, 6)
      const lowerB = hexB.binary.slice(0, 3)
      const upperB = hexB.binary.slice(3, 6)
      const crossMatch1 = [...upperA].filter((b, i) => b === lowerB[i]).length
      const crossMatch2 = [...lowerA].filter((b, i) => b === upperB[i]).length
      const score = Math.round(((crossMatch1 + crossMatch2) / 6) * 100)
      return { score, label: 'Trigram Cross-Resonance' }
    }

    function deriveMovingLinesDynamics(binA, binB) {
      if (!binA || !binB) return { score: 50, label: 'Moving Lines', description: 'Insufficient data', changingLines: [] }
      const changingLines = [...binA].map((b, i) => b !== binB[i] ? i : -1).filter(i => i >= 0)
      const stable = 6 - changingLines.length
      const score = Math.round((stable / 6) * 100)
      return {
        score,
        label: `${stable}/6 Lines Stable`,
        description: changingLines.length === 0
          ? 'Perfect resonance — all lines aligned'
          : `${changingLines.length} dynamic line(s) — active transformation`,
        changingLines,
      }
    }

    function deriveNuclearResonance(hexA, hexB) {
      if (!hexA?.binary || !hexB?.binary) return { score: 50, label: 'Nuclear Resonance' }
      const nucA = innerHexagram(hexA.binary)
      const nucB = innerHexagram(hexB.binary)
      const matches = [...nucA].filter((b, i) => b === nucB[i]).length
      const score = Math.round((matches / 6) * 100)
      return { score, label: 'Inner Hexagram Resonance' }
    }

    function deriveMusicalHarmony(hexA, hexB) {
      if (!hexA?.binary || !hexB?.binary) return { score: 50, label: 'Musical Harmony', frequencies: SOLFEGGIO }
      const idxA = parseInt(hexA.binary.slice(0, 3), 2) % 6
      const idxB = parseInt(hexB.binary.slice(0, 3), 2) % 6
      const freqA = SOLFEGGIO[idxA]
      const freqB = SOLFEGGIO[idxB]
      const diff = Math.abs(idxA - idxB)
      const score = Math.round(((6 - diff) / 6) * 100)
      return { score, label: `${freqA}Hz ♥ ${freqB}Hz`, frequencies: [freqA, freqB] }
    }

    function generateRituals(elemA, elemB, hexagram) {
      const movDyn = results.value?.breakdown?.movingLinesDynamics
      const musHarm = results.value?.breakdown?.musicalHarmony
      return [
        `Honour the ${hexagram?.zodiac || 'cosmic'} season together — align your intentions with this energy.`,
        `Practice the ${elemA} + ${elemB} harmony ritual: share a moment of stillness in nature, honouring both elements.`,
        `Meditate on Hexagram ${hexagram?.kingwen} — read the Image verse aloud together each morning.`,
        `Sound the ${musHarm?.frequencies?.[0] || 528}Hz frequency during shared meals.`,
        `Explore changing lines ${movDyn?.changingLines?.join(', ') || 'none'} as areas of active growth.`,
      ]
    }

    function getJointLineText(lineIdx) {
      const linesText = results.value?.jointHex?.lines
      if (!linesText) return `Line ${lineIdx + 1} — transformation in motion`
      // lines field is a multi-line string with "- **Line N:**" format
      const lineMatch = linesText.split('\n').find(l => l.includes(`Line ${lineIdx + 1}:`))
      if (lineMatch) return lineMatch.replace(/^[\s\-*]+Line \d+:\s*/, '')
      return `Line ${lineIdx + 1} — transformation in motion`
    }

    // ─── Main calculate function ──────────────────────────────────────────
    async function calculate() {
      isCalculating.value = true
      error.value = null
      results.value = null

      try {
        // Build profile objects that calculateAstrologyProfile expects
        const profA = {
          birthday: birthDataA.value.date ? `${birthDataA.value.date}T${birthDataA.value.time || '12:00'}` : null,
          birthDate: birthDataA.value.date,
          birthTime: birthDataA.value.time,
          latitude: birthDataA.value.latitude,
          longitude: birthDataA.value.longitude,
          gender: 'MALE',
          coords: {
            latitude: birthDataA.value.latitude,
            longitude: birthDataA.value.longitude,
          },
        }
        const profB = {
          birthday: birthDataB.value.date ? `${birthDataB.value.date}T${birthDataB.value.time || '12:00'}` : null,
          birthDate: birthDataB.value.date,
          birthTime: birthDataB.value.time,
          latitude: birthDataB.value.latitude,
          longitude: birthDataB.value.longitude,
          gender: 'FEMALE',
          coords: {
            latitude: birthDataB.value.latitude,
            longitude: birthDataB.value.longitude,
          },
        }

        const [astroA, astroB] = await Promise.all([
          calculateAstrologyProfile(profA),
          calculateAstrologyProfile(profB),
        ])

        profA.astrologyData = astroA
        profB.astrologyData = astroB

        const compatibility = await calculateDatingCompatibility(profA, profB)

        // Resolve individual hexagrams from natal (pre-heaven) binary
        const binA = astroA?.preHeavenHexagram?.binary || '000000'
        const binB = astroB?.preHeavenHexagram?.binary || '000000'

        const hexA = getHexagramByBinary.call(hexagramConst, binA)
        const hexB = getHexagramByBinary.call(hexagramConst, binB)

        // XOR the two binaries bit by bit
        const jointBinary = [...binA].map((b, i) => b === binB[i] ? '0' : '1').join('')
        const jointHex = getHexagramByBinary.call(hexagramConst, jointBinary)

        // Nuclear hexagram
        const nuclearBinary = innerHexagram(jointBinary)
        const nuclearHex = getHexagramByBinary.call(hexagramConst, nuclearBinary)

        results.value = {
          hexA,
          hexB,
          jointHex,
          nuclearHex,
          compatibility,
          breakdown: compatibility.breakdown,
          profileA: profA,
          profileB: profB,
        }
      } catch (e) {
        error.value = e.message
      }

      isCalculating.value = false
    }

    // ─── Computed: props for CompatibilityScore ───────────────────────────
    const compatibilityProps = computed(() => {
      if (!results.value) return { score: 0 }
      const { hexA, hexB, jointHex, compatibility, profileA, profileB } = results.value
      const elemA = profileA.astrologyData?.element || 'Wood'
      const elemB = profileB.astrologyData?.element || 'Water'
      return {
        score: compatibility.overallScore,
        showDualHexagrams: true,
        showBreakdown: true,
        profileA: {
          binary: hexA?.binary,
          name: nameA.value,
          element: elemA,
          symbol: hexA?.hexagram,
        },
        profileB: {
          binary: hexB?.binary,
          name: nameB.value,
          element: elemB,
          symbol: hexB?.hexagram,
        },
        jointHexagram: jointHex
          ? { binary: jointHex.binary, name: jointHex.name, symbol: jointHex.hexagram }
          : null,
        breakdown: {
          elemental:        { score: (compatibility.breakdown?.elemental?.score || 0),        label: 'Elemental' },
          trigram:          { score: (compatibility.breakdown?.trigramHexagram?.score || 0),   label: 'Trigram/Hexagram' },
          sexagenary:       { score: (compatibility.breakdown?.sexagenary?.score || 0),        label: 'Sexagenary Cycle' },
          interests:        { score: (compatibility.breakdown?.interests?.score || 0),          label: 'Shared Interests' },
          elementalPolarity:  deriveElementalPolarity(elemA, elemB),
          trigramHarmony:     deriveTrigramHarmony(hexA, hexB),
          movingLinesDynamics: deriveMovingLinesDynamics(hexA?.binary, hexB?.binary),
          nuclearResonance:   deriveNuclearResonance(hexA, hexB),
          musicalHarmony:     deriveMusicalHarmony(hexA, hexB),
        },
      }
    })

    // ─── Derived computeds for template ──────────────────────────────────
    const movingLinesData = computed(() => {
      if (!results.value) return { score: 50, label: '', description: '', changingLines: [] }
      return deriveMovingLinesDynamics(results.value.hexA?.binary, results.value.hexB?.binary)
    })

    const musicalFrequency = computed(() => {
      if (!results.value) return 528
      const harm = deriveMusicalHarmony(results.value.hexA, results.value.hexB)
      return harm.frequencies?.[0] || 528
    })

    const ritualTips = computed(() => {
      if (!results.value) return []
      const elemA = results.value.profileA?.astrologyData?.element || 'Wood'
      const elemB = results.value.profileB?.astrologyData?.element || 'Water'
      return generateRituals(elemA, elemB, results.value.jointHex)
    })

    // ─── Tab actions ──────────────────────────────────────────────────────
    function handleCastOracle() {
      // Switch to analysis tab to show the joint oracle reading
      activeTab.value = 'analysis'
    }

    function switchToSymphony() {
      activeTab.value = 'symphony'
    }

    // ─── Sound harmony bell ───────────────────────────────────────────────
    function soundHarmonyBell() {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const freq = musicalFrequency.value
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 3)
    }

    // ─── Generate couple symphony ─────────────────────────────────────────
    async function generateCoupleSymphony() {
      if (!results.value) return
      const { profileA, profileB } = results.value
      try {
        const [symA, symB] = await Promise.all([
          generateLifeSymphony(
            profileA.birthDate,
            profileA.birthTime,
            profileA.latitude,
            profileA.longitude,
            'unknown'
          ),
          generateLifeSymphony(
            profileB.birthDate,
            profileB.birthTime,
            profileB.latitude,
            profileB.longitude,
            'unknown'
          ),
        ])
        const merged = [...symA.timeline, ...symB.timeline].sort(
          (a, b) => (a.age || 0) - (b.age || 0)
        )
        loadTimeline(merged)
        symphonyLoaded.value = true
        play()
      } catch (e) {
        error.value = 'Symphony generation failed: ' + e.message
      }
    }

    // ─── Download symphony data ───────────────────────────────────────────
    function downloadSymphony() {
      if (!results.value) return
      const data = {
        nameA: nameA.value,
        nameB: nameB.value,
        solfeggio: SOLFEGGIO,
        generated: new Date().toISOString(),
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `harmony-symphony-${nameA.value}-${nameB.value}.json`
      a.click()
      URL.revokeObjectURL(url)
    }

    // ─── Waveform animation ───────────────────────────────────────────────
    function animateWaveform() {
      const canvas = waveformCanvas.value
      if (!canvas) {
        requestAnimationFrame(animateWaveform)
        return
      }
      const ctx = canvas.getContext('2d')
      const data = getWaveform()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (data && data.length) {
        ctx.strokeStyle = '#ffd700'
        ctx.lineWidth = 2
        ctx.beginPath()
        const sliceWidth = canvas.width / data.length
        let x = 0
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] + 1) / 2
          const y = v * canvas.height
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
          x += sliceWidth
        }
        ctx.stroke()
      } else {
        // Idle flat line
        ctx.strokeStyle = 'rgba(255,215,0,0.2)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)
        ctx.lineTo(canvas.width, canvas.height / 2)
        ctx.stroke()
      }
      requestAnimationFrame(animateWaveform)
    }

    onMounted(() => {
      requestAnimationFrame(animateWaveform)
    })

    // ─── Return ───────────────────────────────────────────────────────────
    return {
      // constants
      SOLFEGGIO,
      tabs,
      trigramRing,
      // state
      nameA,
      nameB,
      birthDataA,
      birthDataB,
      isCalculating,
      activeTab,
      results,
      symphonyLoaded,
      error,
      waveformCanvas,
      // audio
      isPlaying,
      currentYearIndex,
      totalYears,
      play,
      pause,
      stop,
      // computed
      compatibilityProps,
      movingLinesData,
      musicalFrequency,
      ritualTips,
      // methods
      calculate,
      handleCastOracle,
      switchToSymphony,
      soundHarmonyBell,
      generateCoupleSymphony,
      downloadSymphony,
      getJointLineText,
    }
  },
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
.harmony-chamber {
  min-height: 100vh;
  background: #0a0a1a;
  color: #e8e0d0;
  font-family: 'Georgia', 'Times New Roman', serif;
  padding: 0 0 4rem;
}

/* ═══════════════════════════════════════════════════════════
   HEADER
═══════════════════════════════════════════════════════════ */
.chamber-header {
  text-align: center;
  padding: 3rem 1rem 2rem;
  background: linear-gradient(180deg, #16213e 0%, #0a0a1a 100%);
  border-bottom: 1px solid rgba(200, 169, 81, 0.2);
}

.header-symbol {
  font-size: 3rem;
  color: #ffd700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  margin-bottom: 0.5rem;
  animation: pulse-gold 4s ease-in-out infinite;
}

@keyframes pulse-gold {
  0%, 100% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
  50%       { text-shadow: 0 0 40px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 215, 0, 0.3); }
}

.chamber-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffd700;
  margin: 0 0 0.5rem;
  letter-spacing: 0.08em;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.3);
}

.chamber-subtitle {
  font-size: 1rem;
  color: #c8a951;
  opacity: 0.85;
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.5;
}

/* ═══════════════════════════════════════════════════════════
   INPUT PANELS
═══════════════════════════════════════════════════════════ */
.input-panels {
  display: flex;
  gap: 1.5rem;
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.person-panel {
  flex: 1;
  background: #16213e;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgba(200, 169, 81, 0.15);
}

.panel-a {
  border-left: 3px solid #ffd700;
  box-shadow: -2px 0 12px rgba(255, 215, 0, 0.08);
}

.panel-b {
  border-left: 3px solid #7ec8e3;
  box-shadow: -2px 0 12px rgba(126, 200, 227, 0.08);
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin: 0 0 1.25rem;
}

.panel-title--a { color: #ffd700; }
.panel-title--b { color: #7ec8e3; }

.field-group {
  margin-bottom: 1rem;
}

.field-group--half {
  flex: 1;
}

.field-row {
  display: flex;
  gap: 0.75rem;
}

.field-label {
  display: block;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #c8a951;
  margin-bottom: 0.35rem;
}

.field-input {
  width: 100%;
  background: #0a0a1a;
  border: 1px solid rgba(200, 169, 81, 0.25);
  border-radius: 0.4rem;
  color: #e8e0d0;
  padding: 0.45rem 0.65rem;
  font-family: inherit;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.field-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
}

/* Date/time native picker icon color fix */
.field-input::-webkit-calendar-picker-indicator {
  filter: invert(0.7) sepia(1) saturate(2) hue-rotate(5deg);
  cursor: pointer;
}

/* ═══════════════════════════════════════════════════════════
   CALCULATE BUTTON
═══════════════════════════════════════════════════════════ */
.calculate-section {
  text-align: center;
  margin: 0.5rem auto 2rem;
}

.btn-oracle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 2.5rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #ffd700;
  border-radius: 2rem;
  color: #ffd700;
  font-family: 'Georgia', serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.15), inset 0 0 12px rgba(255, 215, 0, 0.04);
  transition: all 0.25s ease;
}

.btn-oracle:hover:not(:disabled) {
  background: linear-gradient(135deg, #16213e 0%, #1a1a40 100%);
  box-shadow: 0 0 32px rgba(255, 215, 0, 0.4), 0 0 64px rgba(255, 215, 0, 0.15);
  transform: translateY(-2px);
}

.btn-oracle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  color: #f44336;
  font-size: 0.9rem;
}

/* ─── Loading spinner ─── */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ═══════════════════════════════════════════════════════════
   RESULTS / TAB BAR
═══════════════════════════════════════════════════════════ */
.results-section {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}

.tab-bar {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tab-pill {
  padding: 0.45rem 1.25rem;
  background: #16213e;
  border: 1px solid rgba(200, 169, 81, 0.25);
  border-radius: 2rem;
  color: #c8a951;
  font-family: 'Georgia', serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-pill:hover {
  border-color: #ffd700;
  color: #ffd700;
}

.tab-pill--active {
  background: linear-gradient(135deg, #ffd700 0%, #c8a951 100%);
  border-color: #ffd700;
  color: #0a0a1a;
  font-weight: 700;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.3);
}

/* ─── Fade transition ─── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ═══════════════════════════════════════════════════════════
   TAB PANEL BASE
═══════════════════════════════════════════════════════════ */
.tab-panel {
  background: #0d0d1f;
  border: 1px solid rgba(200, 169, 81, 0.12);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

/* ═══════════════════════════════════════════════════════════
   TAB 1: OVERVIEW — INTERPRETATION
═══════════════════════════════════════════════════════════ */
.interpretation {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: #16213e;
  border-radius: 0.75rem;
  border-left: 3px solid #c8a951;
}

.interp-title {
  font-size: 1.1rem;
  color: #ffd700;
  margin: 0 0 0.75rem;
}

.judgement {
  font-size: 0.9rem;
  color: #e8e0d0;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  font-style: italic;
}

.image {
  font-size: 0.85rem;
  color: #c8a951;
  line-height: 1.5;
  margin: 0;
}

/* ═══════════════════════════════════════════════════════════
   TAB 2: VISUAL MANDALA
═══════════════════════════════════════════════════════════ */
.mandala-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.mandala-svg {
  width: 100%;
  max-width: 540px;
  height: auto;
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.1);
}

.mantra-section {
  text-align: center;
}

.om-symbol {
  font-size: 3rem;
  color: #c8a951;
  text-shadow: 0 0 16px rgba(200, 169, 81, 0.5);
  margin-bottom: 0.5rem;
}

.mantra-label {
  font-size: 0.9rem;
  color: #e8e0d0;
  margin-bottom: 1rem;
}

.mantra-label strong {
  color: #ffd700;
}

.btn-bell {
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
  border: 1px solid #c8a951;
  border-radius: 2rem;
  color: #ffd700;
  font-family: 'Georgia', serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-bell:hover {
  border-color: #ffd700;
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.3);
}

/* ═══════════════════════════════════════════════════════════
   TAB 3: LIFE SYMPHONY
═══════════════════════════════════════════════════════════ */
.symphony-columns {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.person-frequencies {
  flex: 1;
  background: #16213e;
  border-radius: 0.5rem;
  padding: 1rem;
}

.freq-title {
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  letter-spacing: 0.04em;
}

.freq-title--a { color: #ffd700; }
.freq-title--b { color: #7ec8e3; }

.freq-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  border-bottom: 1px solid rgba(200, 169, 81, 0.08);
  font-size: 0.8rem;
}

.freq-line-label { color: #c8a951; }
.freq-value { color: #ffd700; font-weight: 600; }

.symphony-controls {
  text-align: center;
  margin-bottom: 1rem;
}

.btn-symphony-gen {
  padding: 0.65rem 1.75rem;
  background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
  border: 1px solid #a8d8ea;
  border-radius: 2rem;
  color: #a8d8ea;
  font-family: 'Georgia', serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-symphony-gen:hover {
  box-shadow: 0 0 16px rgba(168, 216, 234, 0.3);
}

.playback-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn-playback {
  padding: 0.45rem 1rem;
  background: #16213e;
  border: 1px solid rgba(200, 169, 81, 0.3);
  border-radius: 0.4rem;
  color: #e8e0d0;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-playback:hover:not(:disabled) {
  border-color: #ffd700;
  color: #ffd700;
}

.btn-playback:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.playback-pos {
  font-size: 0.8rem;
  color: #c8a951;
}

.waveform-canvas {
  display: block;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 1rem;
  border: 1px solid #ffd700;
  border-radius: 0.4rem;
  background: #0a0a1a;
  box-sizing: border-box;
}

.download-section {
  text-align: center;
}

.btn-download {
  padding: 0.5rem 1.25rem;
  background: #16213e;
  border: 1px solid rgba(200, 169, 81, 0.3);
  border-radius: 2rem;
  color: #c8a951;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-download:hover {
  border-color: #ffd700;
  color: #ffd700;
}

/* ═══════════════════════════════════════════════════════════
   TAB 4: ANALYSIS
═══════════════════════════════════════════════════════════ */
.analysis-block {
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: #16213e;
  border-radius: 0.75rem;
  border: 1px solid rgba(200, 169, 81, 0.12);
}

.analysis-heading {
  font-size: 1rem;
  color: #ffd700;
  margin: 0 0 1rem;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(200, 169, 81, 0.15);
  padding-bottom: 0.5rem;
}

.analysis-sub {
  font-size: 0.85rem;
  color: #c8a951;
  margin: 0 0 0.75rem;
  font-style: italic;
}

.joint-display {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.joint-meta {
  flex: 1;
  min-width: 180px;
}

.joint-num {
  font-size: 0.75rem;
  color: #c8a951;
  margin: 0 0 0.25rem;
}

.joint-name {
  font-size: 1rem;
  font-weight: 700;
  color: #ffd700;
  margin: 0 0 0.25rem;
}

.joint-trans {
  font-size: 0.85rem;
  color: #a8d8ea;
  margin: 0 0 0.5rem;
  font-style: italic;
}

.joint-judgement {
  font-size: 0.85rem;
  color: #e8e0d0;
  line-height: 1.5;
  margin: 0 0 0.5rem;
}

.joint-image {
  font-size: 0.8rem;
  color: #c8a951;
  line-height: 1.5;
  margin: 0;
}

.changing-line-item {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(200, 169, 81, 0.08);
  font-size: 0.85rem;
}

.cl-badge {
  flex-shrink: 0;
  padding: 0.1rem 0.5rem;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 1rem;
  color: #ffd700;
  font-size: 0.72rem;
  font-weight: 700;
}

.cl-text {
  color: #e8e0d0;
  line-height: 1.4;
}

.ritual-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.ritual-item {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #e8e0d0;
  line-height: 1.5;
}

.ritual-num {
  flex-shrink: 0;
  width: 1.4rem;
  height: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(200, 169, 81, 0.15);
  border: 1px solid rgba(200, 169, 81, 0.35);
  border-radius: 50%;
  color: #ffd700;
  font-size: 0.7rem;
  font-weight: 700;
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE: mobile stack
═══════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .input-panels {
    flex-direction: column;
  }

  .chamber-title {
    font-size: 1.75rem;
  }

  .symphony-columns {
    flex-direction: column;
  }

  .joint-display {
    flex-direction: column;
  }

  .tab-bar {
    gap: 0.35rem;
  }

  .tab-pill {
    font-size: 0.78rem;
    padding: 0.4rem 0.9rem;
  }
}
</style>
