<template>
  <div class="western-astrology-page">
    <!-- Page Header -->
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Western Astrology</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Western Astrology</li>
          </ol>
        </nav>
      </div>
    </header>

    <!-- Tabbed Interface -->
    <div class="container my-6">
      <ul class="nav nav-tabs" id="westernAstrologyTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link active" 
            id="birthday-history-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#birthday-history" 
            type="button" 
            role="tab" 
            aria-controls="birthday-history" 
            aria-selected="true"
          >
            Birthday History
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            id="western-chart-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#western-chart" 
            type="button" 
            role="tab" 
            aria-controls="western-chart" 
            aria-selected="false"
          >
            Western Astrology Chart
          </button>
        </li>
      </ul>

      <div class="tab-content" id="westernAstrologyTabContent">
        <!-- Birthday History Tab -->
        <div class="tab-pane fade show active" id="birthday-history" role="tabpanel" aria-labelledby="birthday-history-tab">
          <div class="row justify-content-center mt-4">
            <div class="col-12 col-md-8 col-lg-6">
              <div class="card text-center">
                <div class="card-body">
                  <h5 class="card-title">Birthday History</h5>
                  <div class="mb-3">
                    <button @click="birthdayStore.exportBirthdays" class="btn btn-success btn-sm me-2">Export Birthdays</button>
                    <label for="importFile" class="btn btn-primary btn-sm">
                      Import Birthdays
                      <input type="file" id="importFile" @change="handleImport" hidden accept=".json">
                    </label>
                    <button @click="birthdayStore.clearBirthdays" class="btn btn-danger btn-sm ms-2">Clear All</button>
                  </div>
                  <div v-if="birthdayList.length === 0">
                    <p>No birthdays recorded yet.</p>
                  </div>
                  <div v-else>
                    <div v-for="birthday in birthdayList" :key="birthday.id" class="mb-3 p-3 border rounded">
                      <p><strong>Date:</strong> {{ dateTimeFormatSimple(birthday.birthday) }}</p>
                      <p><strong>Name:</strong> {{ birthday.name || 'Unnamed' }}</p>
                      <p><strong>Gender:</strong> {{ birthday.gender }}</p>
                      <p><strong>Latitude:</strong> {{ birthday.coords.latitude }}</p>
                      <p><strong>Longitude:</strong> {{ birthday.coords.longitude }}</p>
                      <p v-if="birthday.place"><strong>Place:</strong> {{ birthday.place }}</p>
                      <div>
                        <button @click="loadBirthdayData(birthday)" class="btn btn-primary btn-sm me-2">Load for Chart</button>
                        <button @click="startEditingBirthday(birthday)" class="btn btn-secondary btn-sm me-2">Edit</button>
                        <button @click="birthdayStore.removeBirthday(birthday.id)" class="btn btn-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Western Astrology Chart Tab -->
        <div class="tab-pane fade" id="western-chart" role="tabpanel" aria-labelledby="western-chart-tab">
          <div class="row justify-content-center mt-4">
            <div class="col-12">
              <div class="card">
                <h3 class="card-header">Western Astrology Chart</h3>
                <div class="card-body">
                  <!-- Birth Data Form with Save Functionality -->
                  <div class="birth-data-form mb-4">
                    <h5 class="mb-3">Birth Information</h5>
                    <div class="row">
                      <div class="col-12 col-md-6 mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input
                          id="name"
                          type="text"
                          class="form-control"
                          v-model="localBirthData.name"
                          placeholder="Enter name"
                        />
                      </div>
                      <div class="col-12 col-md-6 mb-3">
                        <label for="birthDate" class="form-label">Birth Date</label>
                        <input
                          id="birthDate"
                          type="date"
                          class="form-control"
                          :value="formatDateForInput(localBirthData.date)"
                          @input="updateDate"
                        />
                      </div>
                    </div>
                    
                    <div class="row">
                      <div class="col-12 col-md-6 mb-3">
                        <label for="birthTime" class="form-label">Birth Time</label>
                        <input
                          id="birthTime"
                          type="time"
                          class="form-control"
                          v-model="localBirthData.time"
                        />
                      </div>
                      <div class="col-12 col-md-6 mb-3">
                        <label for="gender" class="form-label">Gender</label>
                        <select id="gender" class="form-control" v-model="localBirthData.gender">
                          <option value="MALE">MALE</option>
                          <option value="FEMALE">FEMALE</option>
                        </select>
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
                          v-model.number="localBirthData.latitude"
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
                          v-model.number="localBirthData.longitude"
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
                          v-model="localBirthData.place"
                          placeholder="e.g., New York, NY, USA"
                        />
                      </div>
                    </div>
                    
                    <div class="row">
                      <div class="col-12 text-center">
                        <button
                          type="button"
                          class="btn btn-primary me-2"
                          @click="calculateChart"
                          :disabled="loading || !isValidData"
                        >
                          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                          {{ loading ? 'Calculating...' : 'Calculate Chart' }}
                        </button>
                        <button
                          type="button"
                          class="btn btn-success me-2"
                          @click="saveBirthday"
                          :disabled="!isValidData"
                        >
                          Save Birthday
                        </button>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          @click="clearForm"
                        >
                          Clear Form
                        </button>
                      </div>
                    </div>
                  </div>

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
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { DateTime } from 'luxon';
import { useBirthdayStore } from '@/stores/birthday';
import { useAstrologyStore } from '@/stores/astrology';
import AstroChartDisplay from '@/components/AstroChartDisplay.vue';
import AstroSummary from '@/components/AstroSummary.vue';
import { calculatePlanetaryPositions } from '@/utils/astrologyCalculations';

export default {
  name: 'WesternAstrology',
  components: {
    AstroChartDisplay,
    AstroSummary
  },
  setup() {
    const birthdayStore = useBirthdayStore();
    const astrologyStore = useAstrologyStore();
    
    const loading = ref(false);
    const chartData = ref(null);
    const planetPositions = ref(null);
    
    const localBirthData = reactive({
      name: '',
      date: new Date(),
      time: '12:00',
      latitude: 0,
      longitude: 0,
      place: '',
      gender: 'MALE'
    });

    const birthdayList = computed(() => birthdayStore.getBirthdayList);

    const isValidData = computed(() => {
      return localBirthData.name &&
             localBirthData.date &&
             typeof localBirthData.latitude === 'number' &&
             typeof localBirthData.longitude === 'number' &&
             localBirthData.latitude >= -90 &&
             localBirthData.latitude <= 90 &&
             localBirthData.longitude >= -180 &&
             localBirthData.longitude <= 180;
    });

    const dateTimeFormatSimple = (date) => {
      if (date) {
        return DateTime.fromISO(date).toFormat('yyyy-MM-dd HH:mm');
      }
      return null;
    };

    const formatDateForInput = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    const updateDate = (event) => {
      localBirthData.date = new Date(event.target.value);
    };

    const loadBirthdayData = (birthday) => {
      localBirthData.name = birthday.name;
      localBirthData.date = new Date(birthday.birthday);
      localBirthData.latitude = birthday.coords.latitude;
      localBirthData.longitude = birthday.coords.longitude;
      localBirthData.gender = birthday.gender;
      localBirthData.place = birthday.place || '';
      
      // Extract time from birthday if available
      const birthDateTime = DateTime.fromISO(birthday.birthday);
      localBirthData.time = birthDateTime.toFormat('HH:mm');
      
      // Switch to chart tab and calculate
      switchToChartTab();
      calculateChart();
    };

    const switchToChartTab = () => {
      // Switch to the western chart tab
      const chartTab = document.getElementById('western-chart-tab');
      const historyTab = document.getElementById('birthday-history-tab');
      const chartPane = document.getElementById('western-chart');
      const historyPane = document.getElementById('birthday-history');
      
      if (chartTab && historyTab && chartPane && historyPane) {
        historyTab.classList.remove('active');
        historyTab.setAttribute('aria-selected', 'false');
        chartTab.classList.add('active');
        chartTab.setAttribute('aria-selected', 'true');
        
        historyPane.classList.remove('show', 'active');
        chartPane.classList.add('show', 'active');
      }
    };

    const calculateChart = async () => {
      loading.value = true;
      try {
        // Calculate planetary positions
        const positions = await calculatePlanetaryPositions(
          localBirthData.date,
          localBirthData.time,
          localBirthData.latitude,
          localBirthData.longitude
        );
        
        planetPositions.value = positions;
        chartData.value = {
          birthData: { ...localBirthData },
          timestamp: Date.now()
        };
        
        // Update astrology store
        astrologyStore.updateBirthData({
          date: localBirthData.date,
          time: localBirthData.time,
          latitude: localBirthData.latitude,
          longitude: localBirthData.longitude,
          place: localBirthData.place
        });
        astrologyStore.setPlanetPositions(positions);
        astrologyStore.setChartData(chartData.value);
        
      } catch (error) {
        console.error('Error calculating astrology:', error);
        alert('Error calculating astrological data. Please check your inputs.');
      } finally {
        loading.value = false;
      }
    };

    const saveBirthday = () => {
      try {
        if (!isValidData.value) {
          alert('Please fill in all required fields with valid data.');
          return;
        }

        const birthdayData = {
          id: Date.now(),
          name: localBirthData.name,
          birthday: DateTime.fromJSDate(localBirthData.date).set({
            hour: parseInt(localBirthData.time.split(':')[0]),
            minute: parseInt(localBirthData.time.split(':')[1])
          }).toISO(),
          gender: localBirthData.gender,
          coords: {
            latitude: localBirthData.latitude,
            longitude: localBirthData.longitude
          },
          place: localBirthData.place
        };

        const result = birthdayStore.addBirthday(birthdayData);
        
        if (result.duplicate) {
          const confirmMessage = `A birthday with the name "${birthdayData.name}" already exists.\n\n` +
            `Existing: ${result.existingBirthday.name} - ${DateTime.fromISO(result.existingBirthday.birthday).toFormat('yyyy-MM-dd HH:mm')}\n` +
            `New: ${birthdayData.name} - ${DateTime.fromISO(birthdayData.birthday).toFormat('yyyy-MM-dd HH:mm')}\n\n` +
            `Do you want to replace the existing birthday with the new one?`;
          
          if (confirm(confirmMessage)) {
            const updateResult = birthdayStore.addBirthday(birthdayData, true);
            if (updateResult.success) {
              alert('Birthday updated successfully!');
            }
          }
        } else if (result.success) {
          alert('Birthday saved successfully!');
        }
      } catch (error) {
        console.error('Error saving birthday:', error);
        alert(`Failed to save birthday: ${error.message}`);
      }
    };

    const clearForm = () => {
      localBirthData.name = '';
      localBirthData.date = new Date();
      localBirthData.time = '12:00';
      localBirthData.latitude = 0;
      localBirthData.longitude = 0;
      localBirthData.place = '';
      localBirthData.gender = 'MALE';
      chartData.value = null;
      planetPositions.value = null;
    };

    const startEditingBirthday = (birthday) => {
      // For now, just load the data
      loadBirthdayData(birthday);
    };

    const handleImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        birthdayStore.importBirthdays(file);
        event.target.value = '';
      }
    };

    return {
      birthdayStore,
      birthdayList,
      localBirthData,
      loading,
      chartData,
      planetPositions,
      isValidData,
      dateTimeFormatSimple,
      formatDateForInput,
      updateDate,
      loadBirthdayData,
      calculateChart,
      saveBirthday,
      clearForm,
      startEditingBirthday,
      handleImport
    };
  }
};
</script>

<style scoped>
.western-astrology-page {
  min-height: 100vh;
}

.birth-data-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.form-label {
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

.border {
  border-color: #dee2e6 !important;
}
</style>