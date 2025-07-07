<template>
  <div class="astro-summary">
    <h4 class="text-center mb-4">Astrological Summary</h4>
    
    <div class="row">
      <!-- Sun Sign -->
      <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Sun Sign</h5>
            <div class="zodiac-symbol">{{ sunSign.symbol }}</div>
            <h6>{{ sunSign.name }}</h6>
            <p class="card-text">{{ sunSign.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Moon Sign -->
      <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Moon Sign</h5>
            <div class="zodiac-symbol">{{ moonSign.symbol }}</div>
            <h6>{{ moonSign.name }}</h6>
            <p class="card-text">{{ moonSign.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Rising Sign -->
      <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Rising Sign</h5>
            <div class="zodiac-symbol">{{ risingSign.symbol }}</div>
            <h6>{{ risingSign.name }}</h6>
            <p class="card-text">{{ risingSign.description }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Elements and Modalities -->
    <div class="row mt-4">
      <div class="col-12 col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Elemental Balance</h5>
            <div class="element-chart">
              <div v-for="element in elementBalance" :key="element.name" class="element-bar">
                <span class="element-name">{{ element.name }}</span>
                <div class="progress">
                  <div 
                    class="progress-bar" 
                    :style="{ width: element.percentage + '%', backgroundColor: element.color }"
                  ></div>
                </div>
                <span class="element-count">{{ element.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-12 col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Modality Balance</h5>
            <div class="modality-chart">
              <div v-for="modality in modalityBalance" :key="modality.name" class="modality-bar">
                <span class="modality-name">{{ modality.name }}</span>
                <div class="progress">
                  <div 
                    class="progress-bar" 
                    :style="{ width: modality.percentage + '%', backgroundColor: modality.color }"
                  ></div>
                </div>
                <span class="modality-count">{{ modality.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Birth Chart Details -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Birth Chart Details</h5>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Birth Date:</strong> {{ formatDate(chartData.birthData.date) }}</p>
                <p><strong>Birth Time:</strong> {{ chartData.birthData.time }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Location:</strong> {{ chartData.birthData.place || 'Custom coordinates' }}</p>
                <p><strong>Coordinates:</strong> {{ formatCoordinates(chartData.birthData.latitude, chartData.birthData.longitude) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'AstroSummary',
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
    const zodiacSigns = [
      { name: 'Aries', symbol: '♈', element: 'Fire', modality: 'Cardinal', description: 'Dynamic, pioneering, and energetic' },
      { name: 'Taurus', symbol: '♉', element: 'Earth', modality: 'Fixed', description: 'Stable, practical, and determined' },
      { name: 'Gemini', symbol: '♊', element: 'Air', modality: 'Mutable', description: 'Adaptable, communicative, and curious' },
      { name: 'Cancer', symbol: '♋', element: 'Water', modality: 'Cardinal', description: 'Nurturing, intuitive, and protective' },
      { name: 'Leo', symbol: '♌', element: 'Fire', modality: 'Fixed', description: 'Confident, creative, and generous' },
      { name: 'Virgo', symbol: '♍', element: 'Earth', modality: 'Mutable', description: 'Analytical, helpful, and perfectionist' },
      { name: 'Libra', symbol: '♎', element: 'Air', modality: 'Cardinal', description: 'Harmonious, diplomatic, and balanced' },
      { name: 'Scorpio', symbol: '♏', element: 'Water', modality: 'Fixed', description: 'Intense, transformative, and mysterious' },
      { name: 'Sagittarius', symbol: '♐', element: 'Fire', modality: 'Mutable', description: 'Adventurous, philosophical, and optimistic' },
      { name: 'Capricorn', symbol: '♑', element: 'Earth', modality: 'Cardinal', description: 'Ambitious, disciplined, and practical' },
      { name: 'Aquarius', symbol: '♒', element: 'Air', modality: 'Fixed', description: 'Independent, innovative, and humanitarian' },
      { name: 'Pisces', symbol: '♓', element: 'Water', modality: 'Mutable', description: 'Compassionate, intuitive, and artistic' }
    ];

    const getSignFromLongitude = (longitude) => {
      const signIndex = Math.floor(longitude / 30);
      return zodiacSigns[signIndex] || zodiacSigns[0];
    };

    const sunSign = computed(() => {
      const sun = props.planetPositions.find(p => p.name === 'Sun');
      return sun ? getSignFromLongitude(sun.longitude) : zodiacSigns[0];
    });

    const moonSign = computed(() => {
      const moon = props.planetPositions.find(p => p.name === 'Moon');
      return moon ? getSignFromLongitude(moon.longitude) : zodiacSigns[0];
    });

    const risingSign = computed(() => {
      // For simplicity, using Sun sign. In a real implementation, this would be calculated from the Ascendant
      return sunSign.value;
    });

    const elementBalance = computed(() => {
      const elements = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
      
      props.planetPositions.forEach(planet => {
        const sign = getSignFromLongitude(planet.longitude);
        elements[sign.element]++;
      });

      const total = Object.values(elements).reduce((sum, count) => sum + count, 0);
      const colors = { Fire: '#FF4500', Earth: '#8B4513', Air: '#87CEEB', Water: '#4682B4' };

      return Object.entries(elements).map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        color: colors[name]
      }));
    });

    const modalityBalance = computed(() => {
      const modalities = { Cardinal: 0, Fixed: 0, Mutable: 0 };
      
      props.planetPositions.forEach(planet => {
        const sign = getSignFromLongitude(planet.longitude);
        modalities[sign.modality]++;
      });

      const total = Object.values(modalities).reduce((sum, count) => sum + count, 0);
      const colors = { Cardinal: '#FF6B6B', Fixed: '#4ECDC4', Mutable: '#45B7D1' };

      return Object.entries(modalities).map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        color: colors[name]
      }));
    });

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatCoordinates = (lat, lng) => {
      const latDir = lat >= 0 ? 'N' : 'S';
      const lngDir = lng >= 0 ? 'E' : 'W';
      return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
    };

    return {
      sunSign,
      moonSign,
      risingSign,
      elementBalance,
      modalityBalance,
      formatDate,
      formatCoordinates
    };
  }
};
</script>

<style scoped>
.astro-summary {
  margin: 2rem 0;
}

.zodiac-symbol {
  font-size: 3rem;
  margin: 1rem 0;
  color: #6c63ff;
}

.element-bar, .modality-bar {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.element-name, .modality-name {
  min-width: 80px;
  font-weight: 600;
}

.progress {
  flex: 1;
  margin: 0 0.5rem;
  height: 20px;
}

.element-count, .modality-count {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
}

.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
}

.card-title {
  color: #495057;
  border-bottom: 2px solid #6c63ff;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
</style>