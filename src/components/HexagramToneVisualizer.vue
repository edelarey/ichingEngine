<template>
  <div class="visualizer-container p-3 border rounded bg-dark position-relative">
    <canvas ref="canvasEl" class="waveform-canvas"></canvas>
    <div v-if="currentFrequency > 0" class="frequency-label">{{ Math.round(currentFrequency) }} Hz</div>
    <div v-if="displayLines.length" class="hexagram-overlay">
      <svg class="hexagram-svg" :width="160" :height="240" viewBox="0 0 160 240">
        <g v-for="(line, visualIndex) in displayLines" :key="'vis-' + visualIndex">
          <g :transform="`translate(0, ${visualIndex * 40})`">
            <g v-if="!line.isYang">
              <rect x="10" y="10" width="40" height="10" :fill="lineColor(visualIndex)" :class="{ 'active-pulse': isActive(visualIndex) }" />
              <rect x="60" y="10" width="40" height="10" :fill="lineColor(visualIndex)" :class="{ 'active-pulse': isActive(visualIndex) }" />
            </g>
            <g v-else>
              <rect x="10" y="10" width="90" height="10" :fill="lineColor(visualIndex)" :class="{ 'active-pulse': isActive(visualIndex) }" />
            </g>
            <text x="110" y="20" font-size="12" :fill="lineColor(visualIndex)" font-weight="bold">
              {{ line.frequency }} Hz
            </text>
          </g>
        </g>
      </svg>
    </div>
    <div v-else class="text-muted py-5 text-center overlay-empty">
      <p class="mb-0">Press play to start the visualisation.</p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { CHAKRA_COLORS, mapBinaryToLines } from '@/const/solfeggio';

function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(173, 181, 189, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default {
  name: 'HexagramToneVisualizer',
  props: {
    binary: { type: String, default: '' },
    lines: { type: Array, default: () => [] },
    currentLineIndex: { type: Number, default: -1 },
    currentFrequency: { type: Number, default: 0 },
    isPlaying: { type: Boolean, default: false },
    getWaveform: { type: Function, default: null },
    palette: { type: String, default: 'chakra' },
  },
  setup(props) {
    const canvasEl = ref(null);
    let frame = null;

    const bottomLines = computed(() => {
      if (props.lines && props.lines.length) return props.lines;
      return mapBinaryToLines(props.binary);
    });

    const displayLines = computed(() => [...bottomLines.value].reverse());

    const bottomIndex = (visualIndex) => bottomLines.value.length - 1 - visualIndex;

    const isActive = (visualIndex) =>
      props.isPlaying && props.currentLineIndex === bottomIndex(visualIndex);

    const lineColor = (visualIndex) => {
      const fromBottom = bottomIndex(visualIndex);
      const chakra = CHAKRA_COLORS[fromBottom] || '#adb5bd';
      if (props.palette === 'cyan') {
        return isActive(visualIndex) ? '#00ffff' : '#adb5bd';
      }
      if (isActive(visualIndex)) return chakra;
      const line = displayLines.value[visualIndex];
      return hexToRgba(chakra, line && !line.isYang ? 0.5 : 0.7);
    };

    const sizeCanvas = () => {
      const canvas = canvasEl.value;
      if (!canvas) return;
      const width = canvas.offsetWidth || 400;
      const height = canvas.offsetHeight || 300;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
    };

    const strokeColor = () => {
      if (props.palette === 'cyan') return '#00ffff';
      if (props.currentLineIndex >= 0) return CHAKRA_COLORS[props.currentLineIndex] || '#00ffff';
      return '#00ffff';
    };

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const canvas = canvasEl.value;
      if (!canvas) return;
      sizeCanvas();
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { width, height } = canvas;
      ctx.fillStyle = 'rgba(33, 37, 41, 0.22)';
      ctx.fillRect(0, 0, width, height);
      if (!props.isPlaying || typeof props.getWaveform !== 'function') return;
      const values = props.getWaveform();
      if (!values || !values.length) return;
      const color = strokeColor();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      const sliceWidth = width / values.length;
      let x = 0;
      for (let i = 0; i < values.length; i++) {
        const y = height / 2 + values[i] * 1.8 * (height / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    onMounted(() => {
      sizeCanvas();
      draw();
      window.addEventListener('resize', sizeCanvas);
    });

    onUnmounted(() => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', sizeCanvas);
    });

    watch(() => props.isPlaying, () => sizeCanvas());

    return {
      canvasEl,
      displayLines,
      isActive,
      lineColor,
    };
  },
};
</script>

<style scoped>
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
.hexagram-overlay,
.overlay-empty {
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
  filter: drop-shadow(0 0 8px currentColor);
}
@keyframes pulse {
  from { opacity: 0.7; }
  to { opacity: 1; }
}
</style>
