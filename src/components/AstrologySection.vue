<template>
  <div class="western-astrology-section">
    <div class="row justify-content-center mt-4">
      <div class="col-12">
        <div class="card">
          <h3 class="card-header">Western Astrology</h3>
          <div class="card-body">
            <!-- Birth Data Form -->
            <BirthDataForm 
              v-model:birthData="birthData"
              @calculate="handleCalculate"
              :loading="loading"
            />
            
            <!-- Chart Display -->
            <AstroChartDisplay 
              v-if="chartData"
              :chartData="chartData"
              :planetPositions="planetPositions"
            />
            
            <!-- Summary -->
            <AstroSummary 
              v-if="chartData"
              :chartData="chartData"
              :planetPositions="planetPositions"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import BirthDataForm from './BirthDataForm.vue';
import AstroChartDisplay from './AstroChartDisplay.vue';
import AstroSummary from './AstroSummary.vue';
import { useAstrologyStore } from '@/stores/astrology';
import { calculatePlanetaryPositions } from '@/utils/astrologyCalculations';

export default {
  name: 'AstrologySection',
  components: {
    BirthDataForm,
    AstroChartDisplay,
    AstroSummary
  },
  setup() {
    const astrologyStore = useAstrologyStore();
    const { birthData, chartData, planetPositions, loading } = storeToRefs(astrologyStore);

    const handleCalculate = async () => {
      astrologyStore.setLoading(true);
      astrologyStore.setError(null);
      
      try {
        // Calculate planetary positions
        const positions = await calculatePlanetaryPositions(
          birthData.value.date,
          birthData.value.time,
          birthData.value.latitude,
          birthData.value.longitude
        );
        
        astrologyStore.setPlanetPositions(positions);
        astrologyStore.setChartData({
          birthData: { ...birthData.value },
          timestamp: Date.now()
        });
        
        // Optionally save the chart
        astrologyStore.saveChart();
      } catch (error) {
        console.error('Error calculating astrology:', error);
        astrologyStore.setError('Error calculating astrological data. Please check your inputs.');
        alert('Error calculating astrological data. Please check your inputs.');
      } finally {
        astrologyStore.setLoading(false);
      }
    };

    return {
      birthData,
      chartData,
      planetPositions,
      loading,
      handleCalculate
    };
  }
};
</script>

<style scoped>
.western-astrology-section {
  min-height: 400px;
}
</style>