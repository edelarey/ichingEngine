<template>
  <div class="astro-chart-display">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Western Natal Chart</h5>
            <p class="card-text small text-muted mb-2">
              Tropical zodiac · {{ houseSystemLabel }} · Ascendant on the left, Midheaven at the top.
            </p>
            <div class="canvas-container">
              <canvas ref="chartCanvas" width="600" height="600" class="center-content"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-12">
        <div class="planet-positions">
          <h5>Planetary Positions</h5>
          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>Planet</th>
                  <th>Sign</th>
                  <th>Degree</th>
                  <th>House</th>
                  <th>Dignity</th>
                  <th>Motion</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="planet in planetPositions" :key="planet.name">
                  <td>
                    <span class="planet-color-dot" :style="{ backgroundColor: getPlanetColor(planet.name) }"></span>
                    <span class="planet-symbol" :style="{ color: getPlanetColor(planet.name) }">{{ planet.symbol }}</span>
                    {{ planet.name }}
                  </td>
                  <td>
                    <span class="zodiac-symbol">{{ getZodiacSymbol(planet.sign) }}</span>
                    {{ planet.sign }}
                  </td>
                  <td>{{ planet.degreeLabel || formatDegree(planet.longitude) }}</td>
                  <td>{{ getHouseName(planet.house) }}</td>
                  <td class="small">{{ planet.dignity ? planet.dignity.key : '—' }}</td>
                  <td>
                    <span v-if="planet.retrograde" class="badge bg-secondary">Rx</span>
                    <span v-else class="text-muted">direct</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';

const ZODIAC = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export default {
  name: 'AstroChartDisplay',
  props: {
    chartData: { type: Object, required: true },
    planetPositions: { type: Array, default: () => [] },
  },
  setup(props) {
    const chartCanvas = ref(null);

    const houseSystemLabel = computed(() => {
      const sys = props.chartData && props.chartData.houses && props.chartData.houses.system;
      if (sys === 'placidus') return 'Placidus houses';
      if (sys === 'equal') {
        return props.chartData.houses.fallback
          ? 'Equal houses (Placidus fallback)'
          : 'Equal houses';
      }
      return 'Equal houses';
    });

    const formatDegree = (longitude) => `${(((longitude % 360) + 360) % 360 % 30).toFixed(2)}°`;

    const getZodiacSymbol = (signName) => {
      const symbols = {
        Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
        Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
      };
      return symbols[signName] || '';
    };

    const getHouseName = (houseNumber) => {
      const houseNames = {
        1: '1st — Self', 2: '2nd — Values', 3: '3rd — Mind', 4: '4th — Home',
        5: '5th — Creation', 6: '6th — Work', 7: '7th — Other', 8: '8th — Depth',
        9: '9th — Meaning', 10: '10th — Calling', 11: '11th — Network', 12: '12th — Unseen',
      };
      return houseNames[houseNumber] || `${houseNumber}th`;
    };

    const getPlanetColor = (planetName) => {
      const colors = {
        Sun: '#FFA500', Moon: '#C0C0C0', Mercury: '#8C7853', Venus: '#FFC649',
        Mars: '#CD5C5C', Jupiter: '#D2691E', Saturn: '#8B4513', Uranus: '#4FD0E3',
        Neptune: '#4169E1', Pluto: '#800080', 'North Node': '#2C3E50', 'South Node': '#7F8C8D',
      };
      return colors[planetName] || '#666';
    };

    const toCanvasAngle = (longitude, ascendant) => {
      return ((ascendant - longitude) * Math.PI) / 180 + Math.PI;
    };

    const drawAstrologyChart = () => {
      if (!chartCanvas.value) return;
      const ctx = chartCanvas.value.getContext('2d');
      const cx = 300;
      const cy = 300;
      const R = 250;
      const asc = (props.chartData && props.chartData.ascendant) || 0;
      const mc = props.chartData && props.chartData.midheaven;
      const cusps = (props.chartData && props.chartData.houses && props.chartData.houses.cusps) || [];
      const aspects = (props.chartData && props.chartData.aspects) || [];

      ctx.clearRect(0, 0, 600, 600);
      ctx.fillStyle = '#fffef8';
      ctx.fillRect(0, 0, 600, 600);

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 2 * Math.PI);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();

      const rSign = R - 28;
      const rHouse = R - 88;
      const rPlanet = R - 58;
      const rAspect = R - 130;

      ctx.beginPath();
      ctx.arc(cx, cy, rHouse, 0, 2 * Math.PI);
      ctx.strokeStyle = '#bbb';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, rAspect, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let i = 0; i < 12; i += 1) {
        const angle = toCanvasAngle(i * 30, asc);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * rSign, cy + Math.sin(angle) * rSign);
        ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
        ctx.strokeStyle = '#888';
        ctx.stroke();
        const mid = toCanvasAngle(i * 30 + 15, asc);
        ctx.fillStyle = '#6c63ff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(getZodiacSymbol(ZODIAC[i]), cx + Math.cos(mid) * (R - 16), cy + Math.sin(mid) * (R - 16));
      }

      cusps.forEach((c) => {
        const angle = toCanvasAngle(c.cusp, asc);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * rAspect, cy + Math.sin(angle) * rAspect);
        ctx.lineTo(cx + Math.cos(angle) * rHouse, cy + Math.sin(angle) * rHouse);
        ctx.strokeStyle = c.number === 1 || c.number === 4 || c.number === 7 || c.number === 10 ? '#333' : '#999';
        ctx.lineWidth = c.number === 1 || c.number === 10 ? 2 : 1;
        ctx.stroke();
        const labelR = (rHouse + rAspect) / 2;
        const next = cusps[c.number % 12];
        const midLon = next ? (c.cusp + ((next.cusp - c.cusp + 360) % 360) / 2) % 360 : c.cusp + 15;
        const mid = toCanvasAngle(midLon, asc);
        ctx.fillStyle = '#444';
        ctx.font = '11px Arial';
        ctx.fillText(String(c.number), cx + Math.cos(mid) * labelR, cy + Math.sin(mid) * labelR);
      });

      if (typeof mc === 'number') {
        const a = toCanvasAngle(mc, asc);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * rAspect, cy + Math.sin(a) * rAspect);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.strokeStyle = '#8b1e3f';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#8b1e3f';
        ctx.font = '10px Arial';
        ctx.fillText('MC', cx + Math.cos(a) * (R + 12), cy + Math.sin(a) * (R + 12));
      }

      const posByKey = {};
      (props.planetPositions || []).forEach((p) => {
        posByKey[p.key || p.name.toLowerCase()] = p;
      });

      const aspectColor = {
        conjunction: '#888',
        sextile: '#3d9a5f',
        square: '#c0392b',
        trine: '#2980b9',
        opposition: '#8e44ad',
      };
      aspects.forEach((asp) => {
        const p1 = posByKey[asp.key1] || props.planetPositions.find((p) => p.name === asp.planet1);
        const p2 = posByKey[asp.key2] || props.planetPositions.find((p) => p.name === asp.planet2);
        if (!p1 || !p2) return;
        if (asp.aspect === 'conjunction') return;
        const a1 = toCanvasAngle(p1.longitude, asc);
        const a2 = toCanvasAngle(p2.longitude, asc);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a1) * rAspect, cy + Math.sin(a1) * rAspect);
        ctx.lineTo(cx + Math.cos(a2) * rAspect, cy + Math.sin(a2) * rAspect);
        ctx.strokeStyle = aspectColor[asp.aspect] || '#999';
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = asp.aspect === 'square' || asp.aspect === 'opposition' ? 1.4 : 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      (props.planetPositions || []).forEach((planet, index) => {
        const angle = toCanvasAngle(planet.longitude, asc);
        const stagger = rPlanet - (index % 3) * 10;
        const x = cx + Math.cos(angle) * stagger;
        const y = cy + Math.sin(angle) * stagger;
        ctx.fillStyle = getPlanetColor(planet.name);
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.font = 'bold 13px Arial';
        ctx.fillText(planet.symbol, x, y - 12);
        if (planet.retrograde) {
          ctx.font = '9px Arial';
          ctx.fillText('Rx', x, y + 16);
        }
      });

      ctx.fillStyle = '#111';
      ctx.font = '11px Arial';
      ctx.fillText('ASC', 36, cy);
    };

    onMounted(drawAstrologyChart);
    watch(() => [props.planetPositions, props.chartData], drawAstrologyChart, { deep: true });

    return {
      chartCanvas,
      houseSystemLabel,
      formatDegree,
      getZodiacSymbol,
      getHouseName,
      getPlanetColor,
    };
  },
};
</script>

<style scoped>
.astro-chart-display { margin: 2rem 0; }
.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}
canvas {
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  height: auto;
  aspect-ratio: 1;
  background: #fffef8;
}
.center-content { display: block; margin: 0 auto; }
.planet-positions { text-align: left; }
.planet-color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
  border: 1px solid #fff;
  vertical-align: middle;
}
.planet-symbol { font-weight: bold; font-size: 1.2em; margin-right: 0.5rem; }
.zodiac-symbol { font-size: 1.1em; margin-right: 0.5rem; color: #6c63ff; }
@media (max-width: 768px) {
  canvas { width: 100%; max-width: 400px; }
}
</style>
