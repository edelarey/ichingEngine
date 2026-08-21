<template>
  <div class="vedic-chart-display">
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
      <div>
        <h5 class="mb-1">Janma Kuṇḍalī (Natal Chart)</h5>
        <p class="text-muted small mb-0">
          {{ chart.ayanamsaLabel }} ayanāṁśa {{ chart.ayanamsaFormatted }}
          · {{ chart.nodeNote }}
        </p>
      </div>
      <div class="btn-group" role="group" aria-label="Chart format">
        <button
          type="button"
          class="btn btn-sm"
          :class="format === 'north' ? 'btn-dark' : 'btn-outline-dark'"
          @click="$emit('update:format', 'north')"
        >
          North Indian (Bhṛgu chakra)
        </button>
        <button
          type="button"
          class="btn btn-sm"
          :class="format === 'south' ? 'btn-dark' : 'btn-outline-dark'"
          @click="$emit('update:format', 'south')"
        >
          South Indian (Guru chakra)
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-lg-6 mb-4">
        <div class="kundli-wrap" ref="kundliWrap">
          <svg
            v-if="format === 'north'"
            class="vedic-kundli-svg"
            viewBox="0 0 400 400"
            role="img"
            :aria-label="'North Indian diamond chart, Lagna in ' + chart.lagna.rashiLabel"
          >
            <polygon
              v-for="cell in northCells"
              :key="'n-' + cell.house"
              :points="cell.points"
              :fill="cell.house === 1 ? '#f6e7c1' : '#fffdf8'"
              stroke="#2c2c2c"
              stroke-width="1.2"
            />
            <g v-for="cell in northCells" :key="'nl-' + cell.house">
              <text :x="cell.cx" :y="cell.cy - 18" text-anchor="middle" class="rashi-num">
                {{ cell.rashiId }}
              </text>
              <text :x="cell.cx" :y="cell.cy - 4" text-anchor="middle" class="house-tag">
                {{ cell.house === 1 ? 'Lg' : 'H' + cell.house }}
              </text>
              <text
                v-for="(g, i) in cell.grahas"
                :key="g.key"
                :x="cell.cx"
                :y="cell.cy + 12 + i * 12"
                text-anchor="middle"
                class="graha-abbr"
                :fill="g.color"
              >
                {{ g.abbr }}{{ g.retrograde ? 'R' : '' }}
              </text>
            </g>
          </svg>

          <svg
            v-else
            class="vedic-kundli-svg"
            viewBox="0 0 400 400"
            role="img"
            :aria-label="'South Indian square chart, Lagna in ' + chart.lagna.rashiLabel"
          >
            <rect x="0" y="0" width="400" height="400" fill="#fffdf8" stroke="#2c2c2c" stroke-width="1.5" />
            <g v-for="cell in southCells" :key="'s-' + cell.rashiId">
              <rect
                :x="cell.x"
                :y="cell.y"
                :width="cell.w"
                :height="cell.h"
                :fill="cell.house === 1 ? '#f6e7c1' : '#fffdf8'"
                stroke="#2c2c2c"
                stroke-width="1.2"
              />
              <line
                v-if="cell.house === 1"
                :x1="cell.x"
                :y1="cell.y"
                :x2="cell.x + cell.w"
                :y2="cell.y + cell.h"
                stroke="#8b5a2b"
                stroke-width="1.5"
              />
              <text :x="cell.x + cell.w / 2" :y="cell.y + 16" text-anchor="middle" class="rashi-num">
                {{ cell.rashiId }} {{ cell.abbr }}
              </text>
              <text :x="cell.x + cell.w / 2" :y="cell.y + 30" text-anchor="middle" class="house-tag">
                {{ cell.house === 1 ? 'Lg H1' : 'H' + cell.house }}
              </text>
              <text
                v-for="(g, i) in cell.grahas"
                :key="g.key"
                :x="cell.x + cell.w / 2"
                :y="cell.y + 46 + i * 12"
                text-anchor="middle"
                class="graha-abbr"
                :fill="g.color"
              >
                {{ g.abbr }}{{ g.retrograde ? 'R' : '' }}
              </text>
            </g>
            <rect x="100" y="100" width="200" height="200" fill="#faf6ee" stroke="#2c2c2c" stroke-width="1" />
            <text x="200" y="190" text-anchor="middle" class="center-title">Rāśi Chakra</text>
            <text x="200" y="210" text-anchor="middle" class="center-sub">{{ chart.lagna.rashiLabel }}</text>
            <text x="200" y="228" text-anchor="middle" class="center-sub">Lagna (Ascendant)</text>
          </svg>
        </div>
        <p class="small text-muted mt-2 mb-0">
          Graha abbreviations: Su Sūrya (Sun), Mo Chandra (Moon), Ma Maṅgala (Mars), Me Budha (Mercury),
          Ju Guru (Jupiter), Ve Śukra (Venus), Sa Śani (Saturn), Ra Rāhu, Ke Ketu. R = Vakra (Retrograde).
          Numbers 1–12 are rāśis (signs): 1 Meṣa (Aries) … 12 Mīna (Pisces).
        </p>
      </div>

      <div class="col-12 col-lg-6 mb-4">
        <div class="table-responsive">
          <table class="table table-sm table-striped graha-table">
            <thead>
              <tr>
                <th>Graha (Planet)</th>
                <th>Rāśi (Sign)</th>
                <th>Degree</th>
                <th>Bhāva (House)</th>
                <th>Nakshatra (Pada)</th>
                <th>Dignity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="g in chart.grahas" :key="g.key">
                <td>
                  <span class="swatch" :style="{ backgroundColor: g.color }"></span>
                  {{ g.glyph }} {{ g.label }}
                  <span v-if="g.retrograde" class="badge bg-secondary">Vakra (R)</span>
                </td>
                <td>{{ g.rashiLabel }}</td>
                <td>{{ g.degreeLabel }}</td>
                <td>{{ g.house }} — {{ g.houseMeta.nameSa }} ({{ g.houseMeta.nameEn }})</td>
                <td>{{ g.nakshatraLabel }} {{ g.pada }}</td>
                <td>{{ g.dignity.label }}</td>
              </tr>
              <tr>
                <td>
                  <span class="swatch" style="background:#f6e7c1"></span>
                  Lg Lagna (Ascendant)
                </td>
                <td>{{ chart.lagna.rashiLabel }}</td>
                <td>{{ chart.lagna.formatted }}</td>
                <td>1 — Lagna / Tanu (Self / Body)</td>
                <td>{{ lagnaNakshatra }}</td>
                <td>Chart lord: {{ chart.lagna.lordLabel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { nakshatraFromLongitude, nakshatraLabel } from '@/const/vedic';

const NORTH_LAYOUT = [
  { house: 1, points: '200,0 300,100 200,200 100,100', cx: 200, cy: 92 },
  { house: 2, points: '200,0 400,0 300,100', cx: 305, cy: 42 },
  { house: 3, points: '400,0 400,200 300,100', cx: 358, cy: 108 },
  { house: 4, points: '400,200 300,300 200,200 300,100', cx: 308, cy: 200 },
  { house: 5, points: '400,200 400,400 300,300', cx: 358, cy: 292 },
  { house: 6, points: '200,400 400,400 300,300', cx: 305, cy: 358 },
  { house: 7, points: '200,400 100,300 200,200 300,300', cx: 200, cy: 308 },
  { house: 8, points: '0,400 200,400 100,300', cx: 95, cy: 358 },
  { house: 9, points: '0,200 0,400 100,300', cx: 42, cy: 292 },
  { house: 10, points: '0,200 100,100 200,200 100,300', cx: 92, cy: 200 },
  { house: 11, points: '0,0 0,200 100,100', cx: 42, cy: 108 },
  { house: 12, points: '0,0 200,0 100,100', cx: 95, cy: 42 },
];

const SOUTH_SIGNS = [
  { rashiId: 12, row: 0, col: 0, abbr: 'Pi' },
  { rashiId: 1, row: 0, col: 1, abbr: 'Ar' },
  { rashiId: 2, row: 0, col: 2, abbr: 'Ta' },
  { rashiId: 3, row: 0, col: 3, abbr: 'Ge' },
  { rashiId: 4, row: 1, col: 3, abbr: 'Cn' },
  { rashiId: 5, row: 2, col: 3, abbr: 'Le' },
  { rashiId: 6, row: 3, col: 3, abbr: 'Vi' },
  { rashiId: 7, row: 3, col: 2, abbr: 'Li' },
  { rashiId: 8, row: 3, col: 1, abbr: 'Sc' },
  { rashiId: 9, row: 3, col: 0, abbr: 'Sg' },
  { rashiId: 10, row: 2, col: 0, abbr: 'Cp' },
  { rashiId: 11, row: 1, col: 0, abbr: 'Aq' },
];

export default {
  name: 'VedicChartDisplay',
  props: {
    chart: { type: Object, required: true },
    format: { type: String, default: 'north' },
  },
  emits: ['update:format'],
  setup(props) {
    const grahasByHouse = computed(() => {
      const map = {};
      for (let i = 1; i <= 12; i += 1) map[i] = [];
      (props.chart.grahas || []).forEach((g) => {
        map[g.house].push(g);
      });
      return map;
    });

    const northCells = computed(() =>
      NORTH_LAYOUT.map((cell) => ({
        ...cell,
        rashiId: props.chart.houses[cell.house - 1].rashiId,
        grahas: grahasByHouse.value[cell.house],
      }))
    );

    const southCells = computed(() => {
      const lagnaId = props.chart.lagna.rashi.id;
      const size = 100;
      return SOUTH_SIGNS.map((cell) => {
        const house = ((cell.rashiId - lagnaId + 12) % 12) + 1;
        return {
          ...cell,
          house,
          x: cell.col * size,
          y: cell.row * size,
          w: size,
          h: size,
          grahas: grahasByHouse.value[house],
        };
      });
    });

    const lagnaNakshatra = computed(() => {
      const n = nakshatraFromLongitude(props.chart.lagna.longitude);
      return `${nakshatraLabel(n.nakshatra)} ${n.pada}`;
    });

    return { northCells, southCells, lagnaNakshatra };
  },
};
</script>

<style scoped>
.kundli-wrap {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.75rem;
}
.vedic-kundli-svg {
  width: 100%;
  max-width: 420px;
  height: auto;
  display: block;
  margin: 0 auto;
  background: #fffdf8;
}
.rashi-num {
  font-size: 11px;
  font-weight: 700;
  fill: #6b4f1d;
}
.house-tag {
  font-size: 9px;
  fill: #555;
}
.graha-abbr {
  font-size: 11px;
  font-weight: 700;
}
.center-title {
  font-size: 13px;
  font-weight: 700;
  fill: #6b4f1d;
}
.center-sub {
  font-size: 10px;
  fill: #555;
}
.swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.35rem;
  border: 1px solid #fff;
  vertical-align: middle;
}
.graha-table {
  font-size: 0.85rem;
}
@media (max-width: 768px) {
  .vedic-kundli-svg {
    max-width: 100%;
  }
}
</style>
