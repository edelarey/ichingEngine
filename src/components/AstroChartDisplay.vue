<template>
  <div class="astro-chart-display">
    <h4 class="text-center mb-4">Astrological Chart</h4>
    
    <!-- Chart Canvas -->
    <div class="chart-container">
      <canvas ref="chartCanvas" width="600" height="600" class="center-content"></canvas>
    </div>
    
    <!-- Planet Positions Table -->
    <div class="planet-positions mt-4">
      <h5>Planetary Positions</h5>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Planet</th>
              <th>Sign</th>
              <th>Degree</th>
              <th>House</th>
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
              <td>{{ formatDegree(planet.longitude) }}</td>
              <td>{{ getHouseName(planet.house) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'AstroChartDisplay',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    planetPositions: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const zodiacSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    const formatDegree = (longitude) => {
      const sign = Math.floor(longitude / 30);
      const degree = longitude % 30;
      return `${degree.toFixed(2)}°`;
    };

    const getZodiacSymbol = (signName) => {
      const symbols = {
        'Aries': '♈',
        'Taurus': '♉',
        'Gemini': '♊',
        'Cancer': '♋',
        'Leo': '♌',
        'Virgo': '♍',
        'Libra': '♎',
        'Scorpio': '♏',
        'Sagittarius': '♐',
        'Capricorn': '♑',
        'Aquarius': '♒',
        'Pisces': '♓'
      };
      return symbols[signName] || '';
    };

    const getHouseName = (houseNumber) => {
      const houseNames = {
        1: '1st - Self',
        2: '2nd - Values',
        3: '3rd - Communication',
        4: '4th - Home',
        5: '5th - Creativity',
        6: '6th - Health',
        7: '7th - Partnership',
        8: '8th - Transformation',
        9: '9th - Philosophy',
        10: '10th - Career',
        11: '11th - Friends',
        12: '12th - Subconscious'
      };
      return houseNames[houseNumber] || `${houseNumber}th`;
    };

    const drawAstrologyChart = () => {
      if (!chartCanvas.value) return;

      const ctx = chartCanvas.value.getContext('2d');
      const centerX = 300;
      const centerY = 300;
      const radius = 250;

      // Clear canvas
      ctx.clearRect(0, 0, 600, 600);

      // Draw outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw zodiac divisions and signs
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x1 = centerX + Math.cos(angle) * (radius - 20);
        const y1 = centerY + Math.sin(angle) * (radius - 20);
        const x2 = centerX + Math.cos(angle) * radius;
        const y2 = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw zodiac sign symbols
        const labelAngle = ((i * 30) + 15 - 90) * Math.PI / 180;
        const labelX = centerX + Math.cos(labelAngle) * (radius - 35);
        const labelY = centerY + Math.sin(labelAngle) * (radius - 35);
        
        ctx.fillStyle = '#6c63ff';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(getZodiacSymbol(zodiacSigns[i]), labelX, labelY);
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(zodiacSigns[i], labelX, labelY + 20);
      }

      // Draw houses (simplified)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 80, 0, 2 * Math.PI);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Only draw planets if we have position data
      if (props.planetPositions && props.planetPositions.length > 0) {
        props.planetPositions.forEach((planet, index) => {
          const angle = (planet.longitude - 90) * Math.PI / 180;
          const planetRadius = radius - 60;
          const x = centerX + Math.cos(angle) * planetRadius;
          const y = centerY + Math.sin(angle) * planetRadius;

          // Draw planet circle with matching color
          ctx.fillStyle = getPlanetColor(planet.name);
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, 2 * Math.PI);
          ctx.fill();

          // Add a white border for visibility
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw planet symbol
          ctx.fillStyle = '#000';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(planet.symbol, x, y - 10);
          
          // Draw planet name
          ctx.font = '10px Arial';
          ctx.fillText(planet.name, x, y + 20);
        });
      }
    };

    const getPlanetColor = (planetName) => {
      const colors = {
        'Sun': '#FFA500',
        'Moon': '#C0C0C0',
        'Mercury': '#8C7853',
        'Venus': '#FFC649',
        'Mars': '#CD5C5C',
        'Jupiter': '#D2691E',
        'Saturn': '#8B4513',
        'Uranus': '#4FD0E3',
        'Neptune': '#4169E1',
        'Pluto': '#800080'
      };
      return colors[planetName] || '#666';
    };

    onMounted(() => {
      drawAstrologyChart();
    });

    watch(() => props.planetPositions, () => {
      drawAstrologyChart();
    }, { deep: true });

    return {
      chartCanvas,
      formatDegree,
      getZodiacSymbol,
      getHouseName,
      getPlanetColor
    };
  }
};
</script>

<style scoped>
.astro-chart-display {
  text-align: center;
  margin: 2rem 0;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  width: 100%;
}

canvas {
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

.center-content {
  display: block;
  margin: 0 auto;
}

.planet-positions {
  text-align: left;
}

.planet-color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
  border: 1px solid #fff;
  vertical-align: middle;
}

.planet-symbol {
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 0.5rem;
}

.zodiac-symbol {
  font-size: 1.1em;
  margin-right: 0.5rem;
  color: #6c63ff;
}

@media (max-width: 768px) {
  canvas {
    width: 100%;
    max-width: 400px;
  }
}
</style>