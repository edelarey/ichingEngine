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
                  <div class="mb-4">
                    <BirthdayPicker load-label="Load for chart" @load="loadBirthdayData" />
                    <h5 class="mb-3">Birth Information</h5>
                    <BirthDataForm id="western" v-model="localBirthData" show-house-system />
                    <p v-if="timezoneWarning" class="text-warning small mt-2">{{ timezoneWarning }}</p>
                    <p class="small text-muted">
                      Tropical zodiac via astronomia (VSOP87 / Meeus). Rising is the true Ascendant, not a copy of the Sun.
                    </p>
                    
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
                          class="btn btn-secondary me-2"
                          @click="clearForm"
                        >
                          Clear Form
                        </button>
                        <button
                          type="button"
                          class="btn btn-info"
                          @click="exportToPDF"
                          :disabled="!chartData"
                          title="Export chart and data to PDF"
                        >
                          📄 Export PDF
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
import { ref, reactive, computed, onMounted } from 'vue';
import { DateTime } from 'luxon';
import { useRoute } from 'vue-router';
import { useBirthdayStore } from '@/stores/birthday';
import { useAstrologyStore } from '@/stores/astrology';
import AstroChartDisplay from '@/components/AstroChartDisplay.vue';
import AstroSummary from '@/components/AstroSummary.vue';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import BirthDataForm from '@/components/BirthDataForm.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { calculateWesternChart, formatOffset } from '@/utils/astrologyCalculations';
import { TIMEZONE_PRESETS } from '@/const/vedic';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  name: 'WesternAstrology',
  components: {
    AstroChartDisplay,
    AstroSummary,
    BirthdayPicker,
    BirthDataForm,
  },
  setup() {
    usePageTitle('Western Astrology');
    const birthdayStore = useBirthdayStore();
    const astrologyStore = useAstrologyStore();
    const route = useRoute();
    
    const loading = ref(false);
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
        // Make sure we're on the chart tab
        const chartTab = document.querySelector('#western-chart-tab');
        if (chartTab && !chartTab.classList.contains('active')) {
          chartTab.click();
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Create a comprehensive PDF with all the information
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;

        // Title
        pdf.setFontSize(18);
        pdf.setFont(undefined, 'bold');
        pdf.text('Western Natal Chart (Tropical)', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Birth Data Section
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Birth Information', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        pdf.setFont(undefined, 'normal');
        const birthInfo = [
          `Name: ${localBirthData.name}`,
          `Date: ${localBirthData.date.toLocaleDateString()}`,
          `Time: ${localBirthData.time}`,
          `Place: ${localBirthData.place || 'Not specified'}`,
          `Latitude: ${localBirthData.latitude}°`,
          `Longitude: ${localBirthData.longitude}°`,
          `Gender: ${localBirthData.gender}`,
          `Timezone: ${formatOffset(localBirthData.timezoneOffset)}`,
          `House system: ${chartData.value.houses ? chartData.value.houses.system : 'placidus'}`,
          chartData.value.risingSign ? `Rising: ${chartData.value.risingSign.name}` : '',
        ].filter(Boolean);

        birthInfo.forEach(info => {
          pdf.text(info, 20, yPosition);
          yPosition += 6;
        });

        yPosition += 10;

        // Chart Section - Capture the chart canvas
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Astrological Chart', 20, yPosition);
        yPosition += 10;

        const chartElement = document.querySelector('canvas');
        if (chartElement) {
          try {
            const chartCanvas = await html2canvas(chartElement, {
              backgroundColor: 'white',
              scale: 2,
              logging: false
            });
            
            const chartImgData = chartCanvas.toDataURL('image/png');
            const chartWidth = 120;
            const chartHeight = 120;
            const chartX = (pageWidth - chartWidth) / 2;
            
            pdf.addImage(chartImgData, 'PNG', chartX, yPosition, chartWidth, chartHeight);
            yPosition += chartHeight + 15;
          } catch (chartError) {
            console.warn('Could not capture chart:', chartError);
            pdf.setFontSize(10);
            pdf.text('Chart could not be captured', 20, yPosition);
            yPosition += 10;
          }
        }

        // Check if we need a new page
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = 20;
        }

        // Planetary Positions Section
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Planetary Positions', 20, yPosition);
        yPosition += 10;

        if (planetPositions.value && planetPositions.value.length > 0) {
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          
          // Table headers
          const headers = ['Planet', 'Sign', 'Degree', 'House'];
          const startX = 20;
          const columnWidths = [45, 35, 35, 45];
          
          // Draw table header
          pdf.setFont(undefined, 'bold');
          headers.forEach((header, index) => {
            const x = startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
            pdf.text(header, x, yPosition);
          });
          yPosition += 8;

          // House names mapping
          const houseNames = {
            1: '1st - Self',
            2: '2nd - Values',
            3: '3rd - Communication',
            4: '4th - Home',
            5: '5th - Creativity',
            6: '6th - Health',
            7: '7th - Partnerships',
            8: '8th - Transformation',
            9: '9th - Philosophy',
            10: '10th - Career',
            11: '11th - Friends',
            12: '12th - Spirituality'
          };

          // Draw table rows
          pdf.setFont(undefined, 'normal');
          planetPositions.value.forEach(planet => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            
            // Clean planet name and use simple text symbols
            const planetName = planet.name || 'Unknown';
            const planetSign = planet.sign || 'Unknown';
            const planetDegree = planet.longitude ? `${Math.round(planet.longitude * 100) / 100}°` : '0°';
            const planetHouse = planet.house ? houseNames[planet.house] || `${planet.house}th House` : 'Unknown';
            
            const row = [
              planetName,
              planetSign,
              planetDegree,
              planetHouse
            ];
            
            row.forEach((cell, index) => {
              const x = startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
              const cellText = cell.toString();
              
              // Handle house column with potential line wrapping
              if (index === 3 && cellText.includes(' - ')) {
                const parts = cellText.split(' - ');
                pdf.text(parts[0], x, yPosition);
                if (parts[1] && parts[1] !== 'undefined') {
                  pdf.setFontSize(8);
                  pdf.text(parts[1], x, yPosition + 3);
                  pdf.setFontSize(10);
                }
              } else {
                pdf.text(cellText, x, yPosition);
              }
            });
            yPosition += 8;
          });
        }

        // Add a new page for summary if needed
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        } else {
          yPosition += 15;
        }

        // Try to capture the summary section
        const summaryElement = document.querySelector('.astro-summary');
        if (summaryElement) {
          try {
            const summaryCanvas = await html2canvas(summaryElement, {
              backgroundColor: 'white',
              scale: 1.5,
              logging: false,
              width: summaryElement.scrollWidth,
              height: summaryElement.scrollHeight
            });
            
            const summaryImgData = summaryCanvas.toDataURL('image/png');
            const summaryWidth = pageWidth - 40;
            const summaryHeight = (summaryCanvas.height / summaryCanvas.width) * summaryWidth;
            
            // Check if we need multiple pages for summary
            if (summaryHeight > (pageHeight - yPosition - 20)) {
              pdf.addPage();
              yPosition = 20;
            }
            
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('Astrological Summary', 20, yPosition);
            yPosition += 10;
            
            pdf.addImage(summaryImgData, 'PNG', 20, yPosition, summaryWidth, Math.min(summaryHeight, pageHeight - yPosition - 20));
          } catch (summaryError) {
            console.warn('Could not capture summary:', summaryError);
            // Fallback to text summary
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('Astrological Summary', 20, yPosition);
            yPosition += 10;
            
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'normal');
            
            const summaryText = [
              'This Western astrology chart shows the positions of celestial bodies at the time',
              'and place of birth. Each planet\'s position in a zodiac sign and house provides',
              'insights into different aspects of personality, life themes, and potential.',
              '',
              'Key Elements:',
              '• Houses represent different life areas (1st=Self, 2nd=Values, 3rd=Communication, etc.)',
              '• Signs indicate how planetary energies are expressed',
              '• Planetary positions show where energies are focused',
              '',
              'This chart serves as a foundation for astrological interpretation and should',
              'be read by a qualified astrologer for detailed insights.'
            ];

            summaryText.forEach(line => {
              if (yPosition > pageHeight - 15) {
                pdf.addPage();
                yPosition = 20;
              }
              pdf.text(line, 20, yPosition);
              yPosition += 5;
            });
          }
        }

        // Add footer
        const currentDate = new Date().toLocaleDateString();
        pdf.setFontSize(8);
        pdf.text(`Generated on ${currentDate} by iChing Engine`, 20, pageHeight - 10);

        // Save the PDF
        const fileName = `${localBirthData.name || 'Astrology'}_Chart_${currentDate.replace(/\//g, '-')}.pdf`;
        pdf.save(fileName);

      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
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