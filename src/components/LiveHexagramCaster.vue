<template>
  <div class="caster">
    <p class="eyebrow">{{ revealed ? 'Settled' : `Line ${Math.min(lines.length + 1, 6)} of 6` }}</p>
    <div class="figure" aria-hidden="true">
      <div
        v-for="row in rows"
        :key="row.n"
        class="hex-row"
        :class="{ changing: row.changing, empty: row.empty }"
      >
        <div class="line-marks" :class="row.isYin ? 'yin' : 'yang'">
          <span v-if="!row.empty" class="seg" />
          <span v-if="!row.empty && row.isYin" class="seg" />
        </div>
      </div>
    </div>
    <p class="glyph" :class="{ on: revealed }">{{ revealed?.hexagram || '䷀' }}</p>
    <h3 class="name">{{ revealed ? shortName(revealed.name) : 'casting…' }}</h3>
    <p class="translation">{{ revealed ? firstPhrase(revealed.translation) : ' ' }}</p>
    <router-link
      v-if="revealed?.binary"
      :to="`/hexagram_detail?hexagram=${revealed.binary}`"
      class="open"
    >
      Open
    </router-link>
    <span v-else class="open ghost">&nbsp;</span>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import coin from '@/const/coin';
import hexagramLibrary from '@/const/hexagram';

function lookup(binary) {
  return (hexagramLibrary.sequence_binary() || []).find((h) => h.binary === binary) || null;
}

export default {
  name: 'LiveHexagramCaster',
  props: {
    interval: { type: Number, default: 780 },
    hold: { type: Number, default: 3200 },
    startDelay: { type: Number, default: 0 },
    paused: { type: Boolean, default: false },
  },
  setup(props) {
    const lines = ref([]);
    const revealed = ref(null);
    let timer = null;
    let stopped = false;

    const rows = computed(() => {
      const out = [];
      for (let n = 6; n >= 1; n -= 1) {
        const value = lines.value[n - 1];
        if (value === undefined) {
          out.push({ n, empty: true, isYin: false, changing: false });
        } else {
          out.push({
            n,
            empty: false,
            isYin: value === 6 || value === 8,
            changing: value === 6 || value === 9,
          });
        }
      }
      return out;
    });

    const firstPhrase = (text) => {
      if (!text) return '';
      return String(text).split(',')[0].trim();
    };
    const shortName = (name) => firstPhrase(name) || '—';

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const loop = () => {
      if (stopped) return;
      if (props.paused || (typeof document !== 'undefined' && document.hidden)) {
        timer = setTimeout(loop, 400);
        return;
      }
      if (revealed.value) {
        lines.value = [];
        revealed.value = null;
        timer = setTimeout(loop, 280);
        return;
      }
      if (lines.value.length < 6) {
        lines.value = [...lines.value, coin.generateCoinLine()];
      }
      if (lines.value.length >= 6) {
        const binary = coin.transformCoinHexagramToBinary(lines.value);
        revealed.value = lookup(binary) || { name: '—', hexagram: '', translation: '', binary: '' };
        timer = setTimeout(loop, props.hold);
        return;
      }
      timer = setTimeout(loop, props.interval);
    };

    watch(() => props.paused, (paused) => {
      if (!paused && !timer && !stopped) loop();
    });

    onMounted(() => {
      timer = setTimeout(loop, props.startDelay);
    });
    onUnmounted(() => {
      stopped = true;
      clearTimer();
    });

    return { lines, revealed, rows, firstPhrase, shortName };
  },
};
</script>

<style scoped>
.caster {
  text-align: center;
  padding: 1rem 0.75rem 1.1rem;
  min-height: 16.5rem;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.68rem;
  font-weight: 700;
  color: #8a6a22;
  margin-bottom: 0.65rem;
}
.figure {
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
  align-items: center;
  margin-bottom: 0.55rem;
}
.hex-row {
  display: flex;
  justify-content: center;
}
.line-marks {
  display: flex;
  width: 5.2rem;
  height: 0.34rem;
  gap: 0.55rem;
}
.line-marks .seg {
  flex: 1;
  background: #1a1a1a;
  border-radius: 1px;
}
.line-marks.yang {
  gap: 0;
}
.hex-row.changing .seg {
  background: #c62828;
}
.hex-row.empty .line-marks {
  background: #efe4c6;
  border-radius: 1px;
}
.glyph {
  font-size: 2.4rem;
  line-height: 1;
  margin: 0.15rem 0;
  color: #c9b06a;
  opacity: 0.25;
  transition: opacity 0.35s ease, color 0.35s ease;
}
.glyph.on {
  opacity: 1;
  color: #3d2e10;
}
.name {
  font-size: 1.05rem;
  margin: 0;
  color: #3d2e10;
  min-height: 1.4rem;
}
.translation {
  font-size: 0.82rem;
  color: #5b4a22;
  min-height: 1.2rem;
  margin-bottom: 0.35rem;
}
.open {
  font-size: 0.8rem;
  font-weight: 600;
}
.open.ghost {
  visibility: hidden;
}
</style>
