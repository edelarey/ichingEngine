<template>
  <div class="compatibility-score" :class="[sizeClass, colorClass]">
    <div v-if="showCircle" class="score-circle" :style="circleStyle">
      <div class="score-inner">
        <span class="score-value">{{ Math.round(score) }}</span>
        <span v-if="showPercent" class="score-percent">%</span>
      </div>
      <svg class="progress-ring" :width="circleSize" :height="circleSize">
        <circle
          class="progress-ring-bg"
          :stroke-width="strokeWidth"
          fill="transparent"
          :r="radius"
          :cx="circleSize / 2"
          :cy="circleSize / 2"
        />
        <circle
          class="progress-ring-fill"
          :stroke-width="strokeWidth"
          fill="transparent"
          :r="radius"
          :cx="circleSize / 2"
          :cy="circleSize / 2"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          :style="{ stroke: scoreColor }"
        />
      </svg>
    </div>
    
    <div v-else class="score-badge" :style="{ backgroundColor: scoreColor }">
      <span class="score-value">{{ Math.round(score) }}</span>
      <span v-if="showPercent" class="score-percent">%</span>
    </div>
    
    <div v-if="showLabel" class="score-label">{{ compatibilityLabel }}</div>
    
    <div v-if="showBreakdown && breakdown" class="score-breakdown">
      <div class="breakdown-item" v-for="(item, key) in breakdown" :key="key">
        <div class="breakdown-label">{{ formatLabel(key) }}</div>
        <div class="breakdown-bar">
          <div 
            class="breakdown-fill" 
            :style="{ width: `${item.score}%`, backgroundColor: getBreakdownColor(item.score) }"
          ></div>
        </div>
        <div class="breakdown-value">{{ Math.round(item.score) }}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'CompatibilityScore',
  props: {
    score: {
      type: Number,
      required: true,
      validator: (value) => value >= 0 && value <= 100
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    showCircle: {
      type: Boolean,
      default: true
    },
    showPercent: {
      type: Boolean,
      default: true
    },
    showLabel: {
      type: Boolean,
      default: false
    },
    showBreakdown: {
      type: Boolean,
      default: false
    },
    breakdown: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    // Circle dimensions based on size
    const circleSizes = {
      small: { size: 48, stroke: 4 },
      medium: { size: 80, stroke: 6 },
      large: { size: 120, stroke: 8 }
    };

    const circleSize = computed(() => circleSizes[props.size].size);
    const strokeWidth = computed(() => circleSizes[props.size].stroke);
    const radius = computed(() => (circleSize.value - strokeWidth.value) / 2);
    const circumference = computed(() => 2 * Math.PI * radius.value);
    const dashOffset = computed(() => {
      const progress = props.score / 100;
      return circumference.value * (1 - progress);
    });

    // Score color based on value
    const scoreColor = computed(() => {
      if (props.score >= 80) return '#28a745'; // Excellent - Green
      if (props.score >= 60) return '#20c997'; // Good - Teal
      if (props.score >= 40) return '#ffc107'; // Moderate - Yellow
      if (props.score >= 20) return '#fd7e14'; // Low - Orange
      return '#dc3545'; // Poor - Red
    });

    // CSS classes
    const sizeClass = computed(() => `size-${props.size}`);
    const colorClass = computed(() => {
      if (props.score >= 80) return 'score-excellent';
      if (props.score >= 60) return 'score-good';
      if (props.score >= 40) return 'score-moderate';
      if (props.score >= 20) return 'score-low';
      return 'score-poor';
    });

    // Compatibility label
    const compatibilityLabel = computed(() => {
      if (props.score >= 80) return 'Excellent Match';
      if (props.score >= 60) return 'Good Match';
      if (props.score >= 40) return 'Moderate Match';
      if (props.score >= 20) return 'Low Match';
      return 'Poor Match';
    });

    const circleStyle = computed(() => ({
      width: `${circleSize.value}px`,
      height: `${circleSize.value}px`
    }));

    const formatLabel = (key) => {
      const labels = {
        elementalCompatibility: 'Elemental',
        trigramHexagramCompatibility: 'Trigram',
        sexagenaryCompatibility: 'Sexagenary',
        interestMatch: 'Interests'
      };
      return labels[key] || key.replace(/([A-Z])/g, ' $1').trim();
    };

    const getBreakdownColor = (score) => {
      if (score >= 80) return '#28a745';
      if (score >= 60) return '#20c997';
      if (score >= 40) return '#ffc107';
      if (score >= 20) return '#fd7e14';
      return '#dc3545';
    };

    return {
      circleSize,
      strokeWidth,
      radius,
      circumference,
      dashOffset,
      scoreColor,
      sizeClass,
      colorClass,
      compatibilityLabel,
      circleStyle,
      formatLabel,
      getBreakdownColor
    };
  }
};
</script>

<style scoped>
.compatibility-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.score-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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
  stroke: #e9ecef;
}

.progress-ring-fill {
  transition: stroke-dashoffset 0.5s ease-in-out, stroke 0.3s ease;
}

/* Size variants */
.size-small .score-value {
  font-size: 0.875rem;
  font-weight: 600;
}

.size-small .score-percent {
  font-size: 0.625rem;
}

.size-medium .score-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.size-medium .score-percent {
  font-size: 0.75rem;
}

.size-large .score-value {
  font-size: 2rem;
  font-weight: 700;
}

.size-large .score-percent {
  font-size: 1rem;
}

/* Badge style (non-circle) */
.score-badge {
  display: flex;
  align-items: baseline;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  color: white;
}

.size-small .score-badge {
  padding: 0.125rem 0.5rem;
}

.size-large .score-badge {
  padding: 0.5rem 1rem;
}

/* Label */
.score-label {
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

.score-excellent .score-label { color: #28a745; }
.score-good .score-label { color: #20c997; }
.score-moderate .score-label { color: #ffc107; }
.score-low .score-label { color: #fd7e14; }
.score-poor .score-label { color: #dc3545; }

/* Breakdown */
.score-breakdown {
  width: 100%;
  margin-top: 0.5rem;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.breakdown-label {
  flex: 0 0 80px;
  font-size: 0.75rem;
  color: #6c757d;
}

.breakdown-bar {
  flex: 1;
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  transition: width 0.5s ease-in-out;
  border-radius: 3px;
}

.breakdown-value {
  flex: 0 0 35px;
  font-size: 0.75rem;
  text-align: right;
  color: #495057;
}
</style>
