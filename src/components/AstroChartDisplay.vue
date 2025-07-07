<template>
  <div class="astro-chart-display">
    <h4 class="text-center mb-4">Astrological Chart</h4>
    
    <!-- Chart Canvas -->
    <div class="chart-container">
      <canvas ref="chartCanvas" width="600" height="600"></canvas>
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
              <td>{{ planet.name }}</td>
              <td>{{ planet.sign }}</td>
              <td>{{ formatDegree(planet.longitude) }}</td>
              <td>{{ planet.house }}</td>
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

    const drawAstrologyChart = () => {
      if (!chartCanvas.value || !props.planetPositions.length) return;

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

      // Draw zodiac divisions
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

        // Draw zodiac sign labels
        const labelAngle = ((i * 30) + 15 - 90) * Math.PI / 180;
        const labelX = centerX + Math.cos(labelAngle) * (radius - 35);
        const labelY = centerY + Math.sin(labelAngle) * (radius - 35);
        
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(zodiacSigns[i], labelX, labelY);
      }

      // Draw planets
      props.planetPositions.forEach((planet, index) => {
        const angle = (planet.longitude - 90) * Math.PI / 180;
        const planetRadius = radius - 60;
        const x = centerX + Math.cos(angle) * planetRadius;
        const y = centerY + Math.sin(angle) * planetRadius;

        // Draw planet symbol/name
        ctx.fillStyle = getPlanetColor(planet.name);
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Draw planet label
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(planet.symbol || planet.name.substr(0, 2), x, y - 15);
      });

      // Draw houses (simplified)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 80, 0, 2 * Math.PI);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.stroke();
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
      formatDegree
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
  margin: 1rem 0;
}

canvas {
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

.planet-positions {
  text-align: left;
}

@media (max-width: 768px) {
  canvas {
    width: 100%;
    max-width: 400px;
  }
}
</style>