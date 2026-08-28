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
        <p class="mb-0 text-muted">
          Natal chart. For the sky on a chosen day against this birth, open
          <router-link to="/western_daily">Western Daily</router-link>.
        </p>
      </div>
    </header>

    <!-- Tabbed Interface -->
    <div class="container my-6">
      <ul class="nav nav-tabs" id="westernAstrologyTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link active" 
            id="western-chart-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#western-chart" 
            type="button" 
            role="tab" 
            aria-controls="western-chart" 
            aria-selected="true"
          >
            Western Astrology Chart
          </button>
        </li>
      </ul>

      <div class="tab-content" id="westernAstrologyTabContent">
        <!-- Western Astrology Chart Tab -->
        <div class="tab-pane fade show active" id="western-chart" role="tabpanel" aria-labelledby="western-chart-tab">
          <div class="row justify-content-center mt-4">
            <div class="col-12">
              <div class="card">
                <h3 class="card-header">Western Astrology Chart</h3>
                <div class="card-body">
                  <!-- Birth Data Form with Save Functionality -->
                  <BirthDetailsPanel v-model="showForms" :summary="birthSummary">
                    <BirthdayPicker load-label="Load for chart" @load="loadBirthdayData" />
                    <BirthDataForm id="western" :model-value="localBirthData" @update:model-value="assignBirthData" show-house-system />
                    <p v-if="timezoneWarning" class="text-warning small mt-2 mb-0">{{ timezoneWarning }}</p>
                    <p class="small text-muted mb-0">
                      Tropical zodiac via astronomia (VSOP87 / Meeus). Rising is the true Ascendant, not a copy of the Sun.
                    </p>
                  </BirthDetailsPanel>
                  <div class="d-flex flex-wrap gap-2 justify-content-center mb-4">
                    <button type="button" class="btn btn-primary" @click="calculateChart" :disabled="loading || !isValidData">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ loading ? 'Calculating...' : 'Calculate Chart' }}
                    </button>
                    <button type="button" class="btn btn-success" @click="saveBirthday" :disabled="!isValidData">Save Birthday</button>
                    <button type="button" class="btn btn-secondary" @click="clearForm">Clear Form</button>
                    <button type="button" class="btn btn-info" @click="exportToPDF" :disabled="!chartData">Export PDF</button>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { DateTime } from 'luxon';
import { useRoute } from 'vue-router';
import { useBirthdayStore } from '@/stores/birthday';
import { useAstrologyStore } from '@/stores/astrology';
import AstroChartDisplay from '@/components/AstroChartDisplay.vue';
import AstroSummary from '@/components/AstroSummary.vue';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import BirthDataForm from '@/components/BirthDataForm.vue';
import BirthDetailsPanel from '@/components/BirthDetailsPanel.vue';
import { summarizeBirth } from '@/utils/birthSummary';
import { usePageTitle } from '@/composables/usePageTitle';
import { calculateWesternChart, formatOffset } from '@/utils/astrologyCalculations';
import { TIMEZONE_PRESETS } from '@/const/vedic';
import { downloadWesternPdf } from '@/utils/westernPdf';

export default {
  name: 'WesternAstrology',
  components: {
    AstroChartDisplay,
    AstroSummary,
    BirthdayPicker,
    BirthDataForm,
    BirthDetailsPanel,
  },
  setup() {
    usePageTitle('Western Astrology');
    const birthdayStore = useBirthdayStore();
    const astrologyStore = useAstrologyStore();
    const route = useRoute();
    
    const loading = ref(false);
    const showForms = ref(true);
    const chartData = ref(null);
    const planetPositions = ref(null);
    const timezoneWarning = ref('');
    const timezonePresets = computed(() => {
      const browser = -new Date().getTimezoneOffset();
      const has = TIMEZONE_PRESETS.some((t) => t.offset === browser);
      const extra = has ? [] : [{ label: `Browser local (${formatOffset(browser)})`, offset: browser }];
      return [...extra, ...TIMEZONE_PRESETS];
    });
    
    const localBirthData = reactive({
      name: '',
      date: new Date(),
      time: '12:00',
      latitude: 0,
      longitude: 0,
      place: '',
      gender: 'MALE',
      timezoneOffset: -new Date().getTimezoneOffset(),
      houseSystem: 'placidus',
    });

    const assignBirthData = (next) => {
      Object.assign(localBirthData, next);
    };
    const birthSummary = computed(() => summarizeBirth(localBirthData));

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
      localBirthData.date = new Date(`${event.target.value}T12:00:00`);
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
      if (typeof birthday.timezoneOffset === 'number') {
        localBirthData.timezoneOffset = birthday.timezoneOffset;
        timezoneWarning.value = '';
      } else if (birthDateTime.isValid) {
        localBirthData.timezoneOffset = birthDateTime.offset;
        timezoneWarning.value = 'This saved birthday has no explicit timezone. Confirm the birth-place offset before trusting the Rising sign.';
      }
      birthdayStore.selectBirthday(birthday.id);
      switchToChartTab();
      calculateChart();
    };

    const switchToChartTab = () => {
      const chartTab = document.getElementById('western-chart-tab');
      if (chartTab && !chartTab.classList.contains('active')) chartTab.click();
    };

    const calculateChart = async () => {
      loading.value = true;
      try {
        const chart = calculateWesternChart({ ...localBirthData });
        planetPositions.value = chart.planetPositions;
        chartData.value = {
          ...chart,
          birthData: { ...localBirthData },
          timestamp: Date.now(),
        };
        
        astrologyStore.updateBirthData({
          date: localBirthData.date,
          time: localBirthData.time,
          latitude: localBirthData.latitude,
          longitude: localBirthData.longitude,
          place: localBirthData.place,
          timezoneOffset: localBirthData.timezoneOffset,
        });
        astrologyStore.setPlanetPositions(chart.planetPositions);
        astrologyStore.setChartData(chartData.value);
        showForms.value = false;
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
          place: localBirthData.place,
          timezoneOffset: localBirthData.timezoneOffset,
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
      localBirthData.timezoneOffset = -new Date().getTimezoneOffset();
      localBirthData.houseSystem = 'placidus';
      chartData.value = null;
      planetPositions.value = null;
      timezoneWarning.value = '';
      showForms.value = true;
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

    const exportToPDF = async () => {
      if (!chartData.value) {
        alert('Please calculate a chart first before exporting to PDF.');
        return;
      }
      try {
        await downloadWesternPdf({ birth: localBirthData, chart: chartData.value });
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert(error.message || 'Failed to generate PDF. Please try again.');
      }
    };

    onMounted(() => {
      const loadId = route.query.load;
      if (loadId) {
        const found = birthdayStore.getBirthdayById(loadId);
        if (found) loadBirthdayData(found);
      }
    });

    return {
      birthdayStore,
      birthdayList,
      localBirthData,
      assignBirthData,
      showForms,
      birthSummary,
      loading,
      chartData,
      planetPositions,
      timezonePresets,
      timezoneWarning,
      isValidData,
      dateTimeFormatSimple,
      formatDateForInput,
      updateDate,
      loadBirthdayData,
      calculateChart,
      saveBirthday,
      clearForm,
      startEditingBirthday,
      handleImport,
      exportToPDF
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