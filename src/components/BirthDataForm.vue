<template>
  <div class="birth-data-form">
    <div class="row">
      <div class="col-12 col-md-6 mb-3">
        <label for="birthDate" class="form-label">Birth Date</label>
        <input
          id="birthDate"
          type="date"
          class="form-control"
          :value="formatDate(birthData.date)"
          @input="updateDate"
        />
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label for="birthTime" class="form-label">Birth Time</label>
        <input
          id="birthTime"
          type="time"
          class="form-control"
          v-model="birthData.time"
        />
      </div>
    </div>
    
    <div class="row">
      <div class="col-12 col-md-6 mb-3">
        <label for="latitude" class="form-label">Latitude</label>
        <input
          id="latitude"
          type="number"
          step="0.000001"
          class="form-control"
          v-model.number="birthData.latitude"
          placeholder="e.g., 40.7128"
        />
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label for="longitude" class="form-label">Longitude</label>
        <input
          id="longitude"
          type="number"
          step="0.000001"
          class="form-control"
          v-model.number="birthData.longitude"
          placeholder="e.g., -74.0060"
        />
      </div>
    </div>
    
    <div class="row">
      <div class="col-12 mb-3">
        <label for="place" class="form-label">Birth Place (Optional)</label>
        <input
          id="place"
          type="text"
          class="form-control"
          v-model="birthData.place"
          placeholder="e.g., New York, NY, USA"
        />
      </div>
    </div>
    
    <div class="row">
      <div class="col-12 text-center">
        <button
          type="button"
          class="btn btn-primary"
          @click="handleCalculate"
          :disabled="loading || !isValidData"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? 'Calculating...' : 'Calculate Chart' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'BirthDataForm',
  props: {
    birthData: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:birthData', 'calculate'],
  setup(props, { emit }) {
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    const updateDate = (event) => {
      const newDate = new Date(event.target.value);
      emit('update:birthData', {
        ...props.birthData,
        date: newDate
      });
    };

    const isValidData = computed(() => {
      return props.birthData.date &&
             typeof props.birthData.latitude === 'number' &&
             typeof props.birthData.longitude === 'number' &&
             props.birthData.latitude >= -90 &&
             props.birthData.latitude <= 90 &&
             props.birthData.longitude >= -180 &&
             props.birthData.longitude <= 180;
    });

    const handleCalculate = () => {
      if (isValidData.value) {
        emit('calculate');
      }
    };

    return {
      formatDate,
      updateDate,
      isValidData,
      handleCalculate
    };
  }
};
</script>

<style scoped>
.birth-data-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.form-label {
  font-weight: 600;
}
</style>