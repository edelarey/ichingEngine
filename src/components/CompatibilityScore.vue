<template>
  <div class="compatibility-score" :class="[sizeClass, colorClass]">

    <!-- ══════════════════════════════════════════════════════
         DUAL HEXAGRAM DISPLAY
         Shows Person A and Person B hexagrams side-by-side,
         connected by animated SVG lines representing the
         6 lines of the I Ching and their relational dynamic.
    ══════════════════════════════════════════════════════ -->
    <div v-if="showDualHexagrams && profileA && profileB" class="dual-hexagram-section">

      <!-- Person A Hexagram (golden glow) -->
      <div class="person-hexagram person-a-hex">
        <div class="hexagram-glow glow-gold">
          <hexagram-symbol
            :binary="profileA.binary || ''"
            :hexagram-symbol="profileA.symbol || ''"
            :show-visual="true"
            size="large"
            color="#ffd700"
          />
        </div>
        <div class="person-label">
          <span class="person-name">{{ profileA.name || 'Person A' }}</span>
          <span class="person-element">{{ elementEmoji(profileA.element) }} {{ profileA.element }}</span>
          <span v-if="profileA.trigram" class="person-trigram">{{ profileA.trigram }}</span>
        </div>
      </div>

      <!-- Animated Connection Lines (SVG) -->
      <!--
        Each of the 6 SVG lines corresponds to one hexagram line.
        Line colour is derived from the overall score (colour thresholds).
        A left-to-right flowing glow is applied via CSS keyframe animation.
        Lines pulse at different delays to suggest living energy flow.
      -->
      <div class="connection-lines-wrapper">
        <svg
          class="connection-svg"
          :width="connectionSvgWidth"
          height="160"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <!-- 6 lines, one per hexagram position (bottom=line 1, top=line 6) -->
          <line
            v-for="(line, idx) in connectionLines"
            :key="idx"
            :x1="0"
            :y1="line.y"
            :x2="connectionSvgWidth"
            :y2="line.y"
            :stroke="scoreColor"
            stroke-width="2"
            :stroke-opacity="line.opacity"
            filter="url(#glow-filter)"
            :class="['connection-line', `line-delay-${idx}`]"
          />
          <!-- Yin-Yang centre ornament -->
          <text
            :x="connectionSvgWidth / 2"
            y="82"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="22"
            fill="#ffd700"
            opacity="0.8"
            class="center-symbol"
          >☯</text>
        </svg>
      </div>

      <!-- Person B Hexagram (silver/blue glow) -->
      <div class="person-hexagram person-b-hex">
        <div class="hexagram-glow glow-silver">
          <hexagram-symbol
            :binary="profileB.binary || ''"
            :hexagram-symbol="profileB.symbol || ''"
            :show-visual="true"
            size="large"
            color="#a8d8ea"
          />
        </div>
        <div class="person-label">
          <span class="person-name">{{ profileB.name || 'Person B' }}</span>
          <span class="person-element">{{ elementEmoji(profileB.element) }} {{ profileB.element }}</span>
          <span v-if="profileB.trigram" class="person-trigram">{{ profileB.trigram }}</span>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         SCORE RING
         The circular progress ring.  When showDualHexagrams
         is true it renders smaller and is centred below the
         dual hexagram display.
    ══════════════════════════════════════════════════════ -->
    <div
      v-if="showCircle"
      class="score-circle"
      :class="{ 'score-circle--compact': showDualHexagrams }"
      :style="circleStyle"
    >
      <div class="score-inner">
        <span class="score-value">{{ Math.round(score) }}</span>
        <span v-if="showPercent" class="score-percent">%</span>
      </div>
      <svg class="progress-ring" :width="effectiveCircleSize" :height="effectiveCircleSize">
        <circle
          class="progress-ring-bg"
          :stroke-width="effectiveStrokeWidth"
          fill="transparent"
          :r="effectiveRadius"
          :cx="effectiveCircleSize / 2"
          :cy="effectiveCircleSize / 2"
        />
        <circle
          class="progress-ring-fill"
          :stroke-width="effectiveStrokeWidth"
          fill="transparent"
          :r="effectiveRadius"
          :cx="effectiveCircleSize / 2"
          :cy="effectiveCircleSize / 2"
          :stroke-dasharray="effectiveCircumference"
          :stroke-dashoffset="dashOffset"
          :style="{ stroke: scoreColor }"
        />
      </svg>
    </div>

    <!-- Badge fallback when showCircle is false -->
    <div v-else class="score-badge" :style="{ backgroundColor: scoreColor }">
      <span class="score-value">{{ Math.round(score) }}</span>
      <span v-if="showPercent" class="score-percent">%</span>
    </div>

    <!-- Compatibility label -->
    <div v-if="showLabel" class="score-label">{{ compatibilityLabel }}</div>

    <!-- ══════════════════════════════════════════════════════
         JOINT / NUCLEAR HEXAGRAM
         The combined relationship hexagram, shown centred
         below the score ring.
    ══════════════════════════════════════════════════════ -->
    <div v-if="showDualHexagrams && jointHexagram" class="joint-hexagram-section">
      <div class="joint-label-top">Relationship Hexagram</div>
      <div class="joint-hexagram-glow">
        <hexagram-symbol
          :binary="jointHexagram.binary || ''"
          :hexagram-symbol="jointHexagram.symbol || ''"
          :show-visual="true"
          size="normal"
          color="#c8a951"
        />
      </div>
      <div v-if="jointHexagram.name" class="joint-hexagram-name">{{ jointHexagram.name }}</div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         ACTION BUTTONS
         Emits events so the parent view can trigger oracle
         casting or life-symphony playback.
    ══════════════════════════════════════════════════════ -->
    <div v-if="showDualHexagrams" class="action-buttons">
      <button class="btn-mystical" @click="$emit('cast-joint-oracle')">
        ☯ Cast Joint Oracle
      </button>
      <button class="btn-mystical btn-symphony" @click="$emit('play-life-symphony')">
        ♪ Play Couple Life Symphony
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════════
         BREAKDOWN SECTION
         Renders all breakdown categories including the new
         I Ching-specific dimensions added for the dating app.
    ══════════════════════════════════════════════════════ -->
    <div v-if="showBreakdown && breakdown" class="score-breakdown">

      <!-- Standard breakdown items (elementalCompatibility, etc.) -->
      <template v-for="(item, key) in breakdown" :key="key">
        <!-- Musical Harmony gets special treatment to show frequencies -->
        <div v-if="key === 'musicalHarmony'" class="breakdown-item breakdown-item--musical">
          <div class="breakdown-label">{{ formatLabel(key) }}</div>
          <div class="breakdown-bar">
            <div
              class="breakdown-fill"
              :style="{ width: `${item.score}%`, backgroundColor: getBreakdownColor(item.score) }"
            ></div>
          </div>
          <div class="breakdown-value">{{ Math.round(item.score) }}%</div>
          <div
            v-if="item.frequencies && item.frequencies.length"
            class="breakdown-frequencies"
          >
            <span
              v-for="(freq, fi) in item.frequencies"
              :key="fi"
              class="freq-badge"
            >{{ freq }} Hz ♥</span>
          </div>
          <div v-if="item.label" class="breakdown-sub-label">{{ item.label }}</div>
          <div v-if="item.description" class="breakdown-description">{{ item.description }}</div>
        </div>

        <!-- All other breakdown rows -->
        <div v-else class="breakdown-item">
          <div class="breakdown-label">{{ formatLabel(key) }}</div>
          <div class="breakdown-bar">
            <div
              class="breakdown-fill"
              :style="{ width: `${item.score}%`, backgroundColor: getBreakdownColor(item.score) }"
            ></div>
          </div>
          <div class="breakdown-value">{{ Math.round(item.score) }}%</div>
          <div v-if="item.label" class="breakdown-sub-label">{{ item.label }}</div>
          <div v-if="item.description" class="breakdown-description">{{ item.description }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import HexagramSymbol from '@/components/HexagramSymbol.vue';

/**
 * CompatibilityScore
 *
 * Displays an I Ching–powered compatibility score between two people.
 *
 * Core I Ching logic embedded here:
 *  - Each of the 6 connection lines in the SVG corresponds to one of the
 *    six lines of a hexagram (bottom = first line, top = sixth line).
 *  - The joint/nuclear hexagram (innerHexagram) represents the hidden
 *    relational dynamics — lines 2-4 of person A combined with lines 3-5,
 *    revealing the "inner truth" of the relationship.
 *  - Elemental polarity (e.g. Water↔Fire) reflects the Five-Element
 *    cycle: generating (相生) or overcoming (相克) relationships.
 *  - Musical Harmony maps each trigram to its solfeggio frequency,
 *    revealing vibrational resonance between the two charts.
 */
export default {
  name: 'CompatibilityScore',

  components: { HexagramSymbol },

  props: {
    /** Overall compatibility score 0–100 */
    score: {
      type: Number,
      required: true,
      validator: (value) => value >= 0 && value <= 100
    },
    /** Visual size variant */
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    /** Show the circular progress ring */
    showCircle: {
      type: Boolean,
      default: true
    },
    /** Show percentage symbol next to score */
    showPercent: {
      type: Boolean,
      default: true
    },
    /** Show the textual compatibility label */
    showLabel: {
      type: Boolean,
      default: false
    },
    /** Show the breakdown section */
    showBreakdown: {
      type: Boolean,
      default: false
    },
    /**
     * Breakdown object.  Each key maps to:
     *   { score: Number, label?: String, description?: String, frequencies?: Array }
     *
     * Supported keys (new additions in bold):
     *   elementalCompatibility, trigramHexagramCompatibility,
     *   sexagenaryCompatibility, interestMatch,
     *   **elementalPolarity**, **trigramHarmony**,
     *   **movingLinesDynamics**, **nuclearResonance**, **musicalHarmony**
     */
    breakdown: {
      type: Object,
      default: null
    },
    /**
     * Profile data for Person A.
     * { binary: String, name: String, element: String, trigram: String, symbol?: String }
     */
    profileA: {
      type: Object,
      default: null
    },
    /**
     * Profile data for Person B.
     * { binary: String, name: String, element: String, trigram: String, symbol?: String }
     */
    profileB: {
      type: Object,
      default: null
    },
    /**
     * The combined / joint (nuclear) hexagram for the couple.
     * { binary: String, name: String, symbol: String }
     *
     * In I Ching, the nuclear hexagram is formed from the inner lines
     * (lines 2–4 as lower trigram, lines 3–5 as upper trigram) of the
     * primary hexagram, revealing hidden relational potential.
     */
    jointHexagram: {
      type: Object,
      default: null
    },
    /** Enable the dual-hexagram display mode */
    showDualHexagrams: {
      type: Boolean,
      default: false
    }
  },

  emits: ['cast-joint-oracle', 'play-life-symphony'],

  setup(props) {
    // ─── Circle dimension tables ───────────────────────────────────────────
    const circleSizes = {
      small:  { size: 48,  stroke: 4 },
      medium: { size: 80,  stroke: 6 },
      large:  { size: 120, stroke: 8 }
    };

    /**
     * When showDualHexagrams is true the ring is rendered at a more compact
     * size so it does not compete visually with the hexagram display.
     */
    const compactSizes = {
      small:  { size: 40,  stroke: 3 },
      medium: { size: 60,  stroke: 5 },
      large:  { size: 80,  stroke: 6 }
    };

    const effectiveCircleSize = computed(() => {
      const table = props.showDualHexagrams ? compactSizes : circleSizes;
      return table[props.size].size;
    });

    const effectiveStrokeWidth = computed(() => {
      const table = props.showDualHexagrams ? compactSizes : circleSizes;
      return table[props.size].stroke;
    });

    const effectiveRadius = computed(
      () => (effectiveCircleSize.value - effectiveStrokeWidth.value) / 2
    );

    const effectiveCircumference = computed(
      () => 2 * Math.PI * effectiveRadius.value
    );

    const dashOffset = computed(() => {
      const progress = props.score / 100;
      return effectiveCircumference.value * (1 - progress);
    });

    const circleStyle = computed(() => ({
      width:  `${effectiveCircleSize.value}px`,
      height: `${effectiveCircleSize.value}px`
    }));

    // ─── Colour thresholds ─────────────────────────────────────────────────
    /**
     * Returns a hex colour string based on the score value.
     * Thresholds align with traditional I Ching 5-quality grading:
     *   ≥80 excellent (green), ≥60 good (teal), ≥40 moderate (gold),
     *   ≥20 low (orange), <20 poor (red).
     */
    const scoreColor = computed(() => {
      if (props.score >= 80) return '#4caf50';
      if (props.score >= 60) return '#009688';
      if (props.score >= 40) return '#ffc107';
      if (props.score >= 20) return '#ff9800';
      return '#f44336';
    });

    const getBreakdownColor = (s) => {
      if (s >= 80) return '#4caf50';
      if (s >= 60) return '#009688';
      if (s >= 40) return '#ffc107';
      if (s >= 20) return '#ff9800';
      return '#f44336';
    };

    // ─── CSS class helpers ─────────────────────────────────────────────────
    const sizeClass = computed(() => `size-${props.size}`);

    const colorClass = computed(() => {
      if (props.score >= 80) return 'score-excellent';
      if (props.score >= 60) return 'score-good';
      if (props.score >= 40) return 'score-moderate';
      if (props.score >= 20) return 'score-low';
      return 'score-poor';
    });

    // ─── Compatibility label ───────────────────────────────────────────────
    const compatibilityLabel = computed(() => {
      if (props.score >= 80) return 'Excellent Match';
      if (props.score >= 60) return 'Good Match';
      if (props.score >= 40) return 'Moderate Match';
      if (props.score >= 20) return 'Low Match';
      return 'Poor Match';
    });

    // ─── Element emoji mapping ─────────────────────────────────────────────
    /**
     * Maps Five-Element names to expressive emoji for quick visual parsing.
     * Wood grows upward (树), Fire radiates (火), Earth centres (地),
     * Metal refines (金), Water flows (水).
     */
    const elementEmoji = (element) => {
      const map = {
        Wood:  '🌳',
        Fire:  '🔥',
        Earth: '🌍',
        Metal: '⚙️',
        Water: '💧'
      };
      return map[element] || '✨';
    };

    // ─── SVG connection lines ──────────────────────────────────────────────
    /**
     * Generates 6 horizontal line descriptors for the connection SVG.
     * Each line sits at a vertical position corresponding to one of the
     * six hexagram lines (line 1 at bottom = highest y, line 6 at top).
     * Opacity varies subtly to give a sense of harmonic weighting —
     * lines 2 and 5 (the central lines of each trigram, most significant
     * in I Ching interpretation) are rendered at full opacity.
     */
    const connectionLines = computed(() => {
      // y positions spread evenly across the 160px SVG height
      const yPositions = [130, 110, 90, 70, 50, 30]; // line 1 → line 6
      const opacities  = [0.55, 0.85, 0.65, 0.65, 0.85, 0.55];
      return yPositions.map((y, i) => ({ y, opacity: opacities[i] }));
    });

    /** Width of the connecting SVG — narrows at small size */
    const connectionSvgWidth = computed(() => {
      return props.size === 'small' ? 60 : props.size === 'large' ? 120 : 90;
    });

    // ─── Breakdown label formatter ─────────────────────────────────────────
    const formatLabel = (key) => {
      const labels = {
        elementalCompatibility:  'Elemental',
        trigramHexagramCompatibility: 'Trigram',
        sexagenaryCompatibility: 'Sexagenary',
        interestMatch:           'Interests',
        elementalPolarity:       'Elemental Polarity',
        trigramHarmony:          'Trigram Harmony',
        movingLinesDynamics:     'Moving Lines',
        nuclearResonance:        'Nuclear Resonance',
        musicalHarmony:          'Musical Harmony'
      };
      return labels[key] || key.replace(/([A-Z])/g, ' $1').trim();
    };

    return {
      effectiveCircleSize,
      effectiveStrokeWidth,
      effectiveRadius,
      effectiveCircumference,
      dashOffset,
      circleStyle,
      scoreColor,
      sizeClass,
      colorClass,
      compatibilityLabel,
      elementEmoji,
      connectionLines,
      connectionSvgWidth,
      formatLabel,
      getBreakdownColor
    };
  }
};
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════ */
.compatibility-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background: #0a0a1a;
  color: #e8e0d0;
  font-family: 'Georgia', 'Times New Roman', serif;
  border-radius: 1rem;
  padding: 1.25rem;
}

/* ═══════════════════════════════════════════════════════════════
   DUAL HEXAGRAM SECTION
═══════════════════════════════════════════════════════════════ */
.dual-hexagram-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
}

/* ── Person hexagram card ── */
.person-hexagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 0 0 auto;
}

/* Golden glow – Person A */
.glow-gold {
  border-radius: 0.75rem;
  padding: 0.5rem;
  background: radial-gradient(circle at center, rgba(255, 215, 0, 0.12) 0%, transparent 70%);
  box-shadow:
    0 0 12px 2px rgba(255, 215, 0, 0.35),
    0 0 30px 6px rgba(255, 215, 0, 0.12),
    inset 0 0 8px rgba(255, 215, 0, 0.08);
  transition: box-shadow 0.4s ease;
}

.glow-gold:hover {
  box-shadow:
    0 0 20px 4px rgba(255, 215, 0, 0.55),
    0 0 50px 10px rgba(255, 215, 0, 0.2),
    inset 0 0 12px rgba(255, 215, 0, 0.15);
}

/* Silver/blue glow – Person B */
.glow-silver {
  border-radius: 0.75rem;
  padding: 0.5rem;
  background: radial-gradient(circle at center, rgba(168, 216, 234, 0.12) 0%, transparent 70%);
  box-shadow:
    0 0 12px 2px rgba(168, 216, 234, 0.35),
    0 0 30px 6px rgba(168, 216, 234, 0.12),
    inset 0 0 8px rgba(168, 216, 234, 0.08);
  transition: box-shadow 0.4s ease;
}

.glow-silver:hover {
  box-shadow:
    0 0 20px 4px rgba(168, 216, 234, 0.55),
    0 0 50px 10px rgba(168, 216, 234, 0.2),
    inset 0 0 12px rgba(168, 216, 234, 0.15);
}

/* ── Person label ── */
.person-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.person-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.5);
  letter-spacing: 0.04em;
}

.person-b-hex .person-name {
  color: #a8d8ea;
  text-shadow: 0 0 6px rgba(168, 216, 234, 0.5);
}

.person-element {
  font-size: 0.7rem;
  color: #c8a951;
}

.person-trigram {
  font-size: 1rem;
  color: #e8e0d0;
  opacity: 0.7;
}

/* ── Connection SVG wrapper ── */
.connection-lines-wrapper {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.connection-svg {
  overflow: visible;
}

/* Flowing glow animation on each connection line */
@keyframes flow-glow {
  0%   { stroke-opacity: 0.2; filter: drop-shadow(0 0 2px currentColor); }
  50%  { stroke-opacity: 1;   filter: drop-shadow(0 0 6px currentColor); }
  100% { stroke-opacity: 0.2; filter: drop-shadow(0 0 2px currentColor); }
}

.connection-line {
  animation: flow-glow 2.8s ease-in-out infinite;
}

.line-delay-0 { animation-delay: 0s; }
.line-delay-1 { animation-delay: 0.4s; }
.line-delay-2 { animation-delay: 0.8s; }
.line-delay-3 { animation-delay: 1.2s; }
.line-delay-4 { animation-delay: 1.6s; }
.line-delay-5 { animation-delay: 2.0s; }

/* Pulsing Yin-Yang centre symbol */
@keyframes pulse-symbol {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.15); }
}

.center-symbol {
  animation: pulse-symbol 3s ease-in-out infinite;
  transform-origin: 50% 50%;
}

/* ═══════════════════════════════════════════════════════════════
   SCORE RING
═══════════════════════════════════════════════════════════════ */
.score-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Soft dark halo behind the ring */
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.18));
}

/* Compact variant used when dual hexagrams are shown */
.score-circle--compact {
  margin-top: 0.25rem;
}

.score-inner {
  position: absolute;
  display: flex;
  align-items: baseline;
  justify-content: center;
  z-index: 1;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-bg {
  stroke: #1a1a2e;
}

.progress-ring-fill {
  transition: stroke-dashoffset 0.6s ease-in-out, stroke 0.3s ease;
}

/* Score value text */
.score-value {
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
  font-weight: 700;
}

.score-percent {
  color: #c8a951;
  margin-left: 1px;
}

/* ── Size variants ── */
.size-small .score-value  { font-size: 0.875rem; }
.size-small .score-percent { font-size: 0.625rem; }

.size-medium .score-value  { font-size: 1.25rem; }
.size-medium .score-percent { font-size: 0.75rem; }

.size-large .score-value  { font-size: 2rem; }
.size-large .score-percent { font-size: 1rem; }

/* ── Badge (non-circle) fallback ── */
.score-badge {
  display: flex;
  align-items: baseline;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  color: #0a0a1a;
  font-weight: 700;
}

.size-small .score-badge { padding: 0.125rem 0.5rem; }
.size-large .score-badge { padding: 0.5rem 1rem; }

/* ═══════════════════════════════════════════════════════════════
   LABEL
═══════════════════════════════════════════════════════════════ */
.score-label {
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.score-excellent .score-label { color: #4caf50; text-shadow: 0 0 6px rgba(76, 175, 80, 0.5); }
.score-good      .score-label { color: #009688; text-shadow: 0 0 6px rgba(0, 150, 136, 0.5); }
.score-moderate  .score-label { color: #ffc107; text-shadow: 0 0 6px rgba(255, 193, 7, 0.5); }
.score-low       .score-label { color: #ff9800; text-shadow: 0 0 6px rgba(255, 152, 0, 0.5); }
.score-poor      .score-label { color: #f44336; text-shadow: 0 0 6px rgba(244, 67, 54, 0.5); }

/* ═══════════════════════════════════════════════════════════════
   JOINT HEXAGRAM
═══════════════════════════════════════════════════════════════ */
.joint-hexagram-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
  border: 1px solid rgba(200, 169, 81, 0.3);
  border-radius: 0.75rem;
  box-shadow: 0 0 18px rgba(200, 169, 81, 0.08);
  width: 100%;
  max-width: 200px;
}

.joint-label-top {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #c8a951;
  opacity: 0.8;
}

.joint-hexagram-glow {
  animation: pulse-symbol 4s ease-in-out infinite;
}

.joint-hexagram-name {
  font-size: 0.75rem;
  color: #e8e0d0;
  opacity: 0.85;
  text-align: center;
}

/* ═══════════════════════════════════════════════════════════════
   ACTION BUTTONS
═══════════════════════════════════════════════════════════════ */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 280px;
}

.btn-mystical {
  width: 100%;
  padding: 0.55rem 1rem;
  background: linear-gradient(135deg, #0d0d1f 0%, #1a1a2e 100%);
  border: 1px solid #c8a951;
  border-radius: 0.5rem;
  color: #ffd700;
  font-family: 'Georgia', serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 0 8px rgba(200, 169, 81, 0.15);
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.4);
}

.btn-mystical:hover {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-color: #ffd700;
  box-shadow:
    0 0 16px rgba(255, 215, 0, 0.35),
    0 0 32px rgba(255, 215, 0, 0.12),
    inset 0 0 8px rgba(255, 215, 0, 0.05);
  transform: translateY(-1px);
}

.btn-mystical:active {
  transform: translateY(0);
  box-shadow: 0 0 8px rgba(200, 169, 81, 0.2);
}

.btn-symphony {
  border-color: #a8d8ea;
  color: #a8d8ea;
  text-shadow: 0 0 6px rgba(168, 216, 234, 0.4);
  box-shadow: 0 0 8px rgba(168, 216, 234, 0.12);
}

.btn-symphony:hover {
  border-color: #a8d8ea;
  box-shadow:
    0 0 16px rgba(168, 216, 234, 0.35),
    0 0 32px rgba(168, 216, 234, 0.12),
    inset 0 0 8px rgba(168, 216, 234, 0.05);
}

/* ═══════════════════════════════════════════════════════════════
   BREAKDOWN SECTION
═══════════════════════════════════════════════════════════════ */
.score-breakdown {
  width: 100%;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.breakdown-item {
  display: grid;
  grid-template-columns: 110px 1fr 40px;
  grid-template-rows: auto auto auto;
  align-items: center;
  gap: 0.3rem 0.5rem;
  padding: 0.3rem 0.5rem;
  background: rgba(26, 26, 46, 0.6);
  border-radius: 0.4rem;
  border-left: 2px solid rgba(200, 169, 81, 0.2);
}

.breakdown-label {
  grid-column: 1;
  grid-row: 1;
  font-size: 0.7rem;
  color: #c8a951;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.breakdown-bar {
  grid-column: 2;
  grid-row: 1;
  height: 6px;
  background: #1a1a2e;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(200, 169, 81, 0.15);
}

.breakdown-fill {
  height: 100%;
  transition: width 0.6s ease-in-out;
  border-radius: 3px;
  box-shadow: 0 0 4px currentColor;
}

.breakdown-value {
  grid-column: 3;
  grid-row: 1;
  font-size: 0.7rem;
  text-align: right;
  color: #e8e0d0;
  font-weight: 600;
}

.breakdown-sub-label {
  grid-column: 1 / 4;
  grid-row: 2;
  font-size: 0.65rem;
  color: #a8d8ea;
  font-style: italic;
}

.breakdown-description {
  grid-column: 1 / 4;
  grid-row: 3;
  font-size: 0.62rem;
  color: #8899aa;
  line-height: 1.4;
}

/* Musical harmony row: frequencies displayed inline */
.breakdown-item--musical .breakdown-frequencies {
  grid-column: 1 / 4;
  grid-row: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.1rem;
}

.freq-badge {
  font-size: 0.6rem;
  background: rgba(200, 169, 81, 0.12);
  border: 1px solid rgba(200, 169, 81, 0.4);
  color: #ffd700;
  border-radius: 0.75rem;
  padding: 0.05rem 0.4rem;
  letter-spacing: 0.03em;
  text-shadow: 0 0 4px rgba(255, 215, 0, 0.4);
}

.breakdown-item--musical .breakdown-sub-label { grid-row: 3; }
.breakdown-item--musical .breakdown-description { grid-row: 4; }

/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE ADJUSTMENTS
═══════════════════════════════════════════════════════════════ */
.size-small .dual-hexagram-section {
  gap: 0.25rem;
}

.size-small .person-name    { font-size: 0.65rem; }
.size-small .person-element { font-size: 0.6rem; }
.size-small .btn-mystical   { font-size: 0.7rem; padding: 0.4rem 0.75rem; }
.size-small .breakdown-label { font-size: 0.62rem; }

.size-large .dual-hexagram-section { gap: 1rem; }
.size-large .person-name    { font-size: 0.95rem; }
.size-large .person-element { font-size: 0.8rem; }
.size-large .btn-mystical   { font-size: 0.9rem; padding: 0.65rem 1.25rem; }
.size-large .breakdown-item { padding: 0.5rem 0.75rem; }
.size-large .breakdown-label { font-size: 0.8rem; }
.size-large .breakdown-value { font-size: 0.8rem; }
</style>
