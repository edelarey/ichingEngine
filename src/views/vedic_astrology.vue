<template>
  <div class="vedic-astrology-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Jyotish (Vedic Astrology)</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Vedic Astrology</li>
          </ol>
        </nav>
        <p class="mb-0">
          Sidereal natal chart (Janma Kuṇḍalī) using Lahiri ayanāṁśa, whole-sign houses, nine grahas,
          and Vimśottarī daśā.
          <router-link to="/vedic_help">Read the Jyotish guide</router-link>
        </p>
      </div>
    </header>

    <div class="container my-4">
      <ul class="nav nav-tabs" id="vedicAstrologyTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="vedic-about-tab" data-bs-toggle="tab" data-bs-target="#vedic-about" type="button" role="tab">
            About Jyotish
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="vedic-chart-tab" data-bs-toggle="tab" data-bs-target="#vedic-chart" type="button" role="tab">
            Vedic Chart
          </button>
        </li>
      </ul>

      <div class="tab-content" id="vedicAstrologyTabContent">
        <div class="tab-pane fade show active" id="vedic-about" role="tabpanel">
          <div class="card mt-4">
            <div class="card-body">
              <h3>Jyotiṣa — the science of light</h3>
              <p>
                Jyotish (Vedic astrology) maps the sky at birth against the <strong>fixed stars</strong>
                (sidereal / nirayana zodiac), not the seasons used in Western tropical astrology.
                The gap between those zodiacs is the <strong>ayanāṁśa</strong> — about 24° today.
                This engine uses <strong>Lahiri (Chitrapaksha)</strong>, the Government of India standard.
              </p>
              <div class="row">
                <div class="col-md-6">
                  <h5>Nine grahas (planets)</h5>
                  <p>
                    Sūrya (Sun), Chandra (Moon), Maṅgala (Mars), Budha (Mercury), Guru (Jupiter),
                    Śukra (Venus), Śani (Saturn), plus the lunar nodes Rāhu and Ketu.
                    Uranus, Neptune, and Pluto are not used in classical Jyotish.
                  </p>
                  <h5>Lagna (Ascendant)</h5>
                  <p>
                    The rāśi (sign) rising on the eastern horizon is the 1st house. It changes about every two hours,
                    so birth <em>time and timezone</em> matter. All twelve bhāvas (houses) are counted from this sign.
                  </p>
                </div>
                <div class="col-md-6">
                  <h5>Whole-sign houses</h5>
                  <p>
                    The entire Lagna sign is house 1, the next sign house 2, and so on.
                    There are no intercepted signs or floating cusps.
                  </p>
                  <h5>Nakshatras and daśā</h5>
                  <p>
                    Twenty-seven nakshatras (lunar mansions) of 13°20′ divide the sky.
                    The Moon’s nakshatra at birth starts the 120-year Vimśottarī daśā clock of planetary periods.
                  </p>
                </div>
              </div>
              <p class="mb-0">
                Sanskrit terms are always shown with English: e.g. Sūrya (Sun), Meṣa (Aries), Lagna (Ascendant).
                <router-link to="/vedic_help">Open the full guide</router-link> for chart formats, dignity, and how to read a kuṇḍalī.
              </p>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="vedic-chart" role="tabpanel">
          <div class="row justify-content-center mt-4">
            <div class="col-12">
              <div class="card">
                <h3 class="card-header">Janma Kuṇḍalī (Vedic Natal Chart)</h3>
                <div class="card-body">
                  <div class="mb-4">
                    <BirthdayPicker load-label="Load for chart" @load="loadBirthdayData" />
                    <h5 class="mb-3">Birth Information</h5>
                    <BirthDataForm id="vedic" v-model="localBirthData" />
                    <p v-if="timezoneWarning" class="text-warning small mt-2">{{ timezoneWarning }}</p>
                    <div class="row">
                      <div class="col-12 text-center">
                        <button type="button" class="btn btn-primary me-2" @click="calculateChart" :disabled="loading || !isValidData">
                          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                          {{ loading ? 'Calculating...' : 'Calculate Chart' }}
                        </button>
                        <button type="button" class="btn btn-success me-2" @click="saveBirthday" :disabled="!isValidData">Save Birthday</button>
                        <button type="button" class="btn btn-secondary me-2" @click="clearForm">Clear Form</button>
                        <button type="button" class="btn btn-info" @click="exportToPDF" :disabled="!chart">📄 Export PDF</button>
                      </div>
                    </div>
                  </div>

                  <div v-if="error" class="alert alert-danger">{{ error }}</div>

                  <VedicChartDisplay
                    v-if="chart"
                    :chart="chart"
                    :format="chartFormat"
                    @update:format="chartFormat = $event"
                  />
                  <VedicSummary v-if="chart" :chart="chart" />
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
import { useVedicStore } from '@/stores/vedic';
import VedicChartDisplay from '@/components/VedicChartDisplay.vue';
import VedicSummary from '@/components/VedicSummary.vue';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import BirthDataForm from '@/components/BirthDataForm.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { calculateVedicChart, formatOffset } from '@/utils/vedicCalculations';
import { TIMEZONE_PRESETS } from '@/const/vedic';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  name: 'VedicAstrology',
  components: { VedicChartDisplay, VedicSummary, BirthdayPicker, BirthDataForm },
  setup() {
    usePageTitle('Vedic Astrology');
    const birthdayStore = useBirthdayStore();
    const vedicStore = useVedicStore();
    const route = useRoute();
    const loading = ref(false);
    const chart = ref(null);
    const error = ref(null);
    const chartFormat = ref('north');
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
        localBirthData.longitude <= 180 &&
        typeof localBirthData.timezoneOffset === 'number';
    });

    const dateTimeFormatSimple = (date) => {
      if (date) return DateTime.fromISO(date).toFormat('yyyy-MM-dd HH:mm');
      return null;
    };

    const formatDateForInput = (date) => {
      if (!date) return '';
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    };

    const updateDate = (event) => {
      localBirthData.date = new Date(`${event.target.value}T12:00:00`);
    };

    const switchToChartTab = () => {
      const chartTab = document.getElementById('vedic-chart-tab');
      const chartPane = document.getElementById('vedic-chart');
      if (!chartTab || !chartPane) return;
      document.querySelectorAll('#vedicAstrologyTabs .nav-link').forEach((el) => {
        el.classList.remove('active');
        el.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('#vedicAstrologyTabContent .tab-pane').forEach((el) => {
        el.classList.remove('show', 'active');
      });
      chartTab.classList.add('active');
      chartTab.setAttribute('aria-selected', 'true');
      chartPane.classList.add('show', 'active');
    };

    const offsetFromBirthday = (birthday) => {
      if (typeof birthday.timezoneOffset === 'number') return birthday.timezoneOffset;
      const dt = DateTime.fromISO(birthday.birthday);
      if (dt.isValid && typeof dt.offset === 'number') return dt.offset;
      return -new Date().getTimezoneOffset();
    };

    const loadBirthdayData = (birthday) => {
      localBirthData.name = birthday.name;
      localBirthData.date = new Date(birthday.birthday);
      localBirthData.latitude = birthday.coords.latitude;
      localBirthData.longitude = birthday.coords.longitude;
      localBirthData.gender = birthday.gender;
      localBirthData.place = birthday.place || '';
      const birthDateTime = DateTime.fromISO(birthday.birthday);
      localBirthData.time = birthDateTime.toFormat('HH:mm');
      localBirthData.timezoneOffset = offsetFromBirthday(birthday);
      timezoneWarning.value = typeof birthday.timezoneOffset === 'number'
        ? ''
        : 'This saved birthday has no explicit timezone. Confirm the offset of the birth place before trusting Lagna (Ascendant).';
      birthdayStore.selectBirthday(birthday.id);
      switchToChartTab();
      calculateChart();
    };

    const calculateChart = async () => {
      loading.value = true;
      error.value = null;
      try {
        const result = calculateVedicChart({
          name: localBirthData.name,
          date: localBirthData.date,
          time: localBirthData.time,
          latitude: localBirthData.latitude,
          longitude: localBirthData.longitude,
          place: localBirthData.place,
          gender: localBirthData.gender,
          timezoneOffset: localBirthData.timezoneOffset,
        });
        chart.value = result;
        vedicStore.updateBirthData({ ...localBirthData });
        vedicStore.setChart(result);
      } catch (err) {
        console.error('Error calculating Vedic chart:', err);
        error.value = 'Could not calculate the Vedic chart. Check date, time, coordinates, and timezone.';
        chart.value = null;
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
            hour: parseInt(localBirthData.time.split(':')[0], 10),
            minute: parseInt(localBirthData.time.split(':')[1], 10),
          }).toISO(),
          gender: localBirthData.gender,
          coords: {
            latitude: localBirthData.latitude,
            longitude: localBirthData.longitude,
          },
          place: localBirthData.place,
          timezoneOffset: localBirthData.timezoneOffset,
        };
        const result = birthdayStore.addBirthday(birthdayData);
        if (result.duplicate) {
          const confirmMessage = `A birthday with the name "${birthdayData.name}" already exists. Replace it?`;
          if (confirm(confirmMessage)) {
            const updateResult = birthdayStore.addBirthday(birthdayData, true);
            if (updateResult.success) alert('Birthday updated successfully!');
          }
        } else if (result.success) {
          alert('Birthday saved successfully!');
        }
      } catch (err) {
        console.error('Error saving birthday:', err);
        alert(`Failed to save birthday: ${err.message}`);
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
      chart.value = null;
      error.value = null;
      timezoneWarning.value = '';
    };

    const handleImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        birthdayStore.importBirthdays(file);
        event.target.value = '';
      }
    };

    const exportToPDF = async () => {
      if (!chart.value) {
        alert('Please calculate a chart first before exporting to PDF.');
        return;
      }
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let y = 18;

        pdf.setFontSize(16);
        pdf.text('Janma Kundali (Vedic Astrology Chart)', pageWidth / 2, y, { align: 'center' });
        y += 10;
        pdf.setFontSize(10);
        const info = [
          `Name: ${localBirthData.name}`,
          `Date: ${formatDateForInput(localBirthData.date)}  Time: ${localBirthData.time}  ${formatOffset(localBirthData.timezoneOffset)}`,
          `Place: ${localBirthData.place || 'Custom coordinates'}  Lat ${localBirthData.latitude}  Lng ${localBirthData.longitude}`,
          `Ayanamsa: ${chart.value.ayanamsaLabel} ${chart.value.ayanamsaFormatted}`,
          `Lagna (Ascendant): ${chart.value.lagna.rashiLabel} ${chart.value.lagna.formatted}`,
        ];
        info.forEach((line) => {
          pdf.text(line, 16, y);
          y += 6;
        });
        y += 4;

        const svgWrap = document.querySelector('.kundli-wrap');
        if (svgWrap) {
          const canvas = await html2canvas(svgWrap, { backgroundColor: '#ffffff', scale: 2, logging: false });
          const img = canvas.toDataURL('image/png');
          const w = 110;
          const h = (canvas.height / canvas.width) * w;
          pdf.addImage(img, 'PNG', (pageWidth - w) / 2, y, w, h);
          y += h + 8;
        }

        const addLines = (title, body) => {
          if (y > pageHeight - 30) {
            pdf.addPage();
            y = 18;
          }
          pdf.setFont(undefined, 'bold');
          pdf.setFontSize(12);
          pdf.text(title, 16, y);
          y += 6;
          pdf.setFont(undefined, 'normal');
          pdf.setFontSize(9);
          const wrapped = pdf.splitTextToSize(body, pageWidth - 32);
          wrapped.forEach((line) => {
            if (y > pageHeight - 16) {
              pdf.addPage();
              y = 18;
            }
            pdf.text(line, 16, y);
            y += 4.2;
          });
          y += 4;
        };

        if (chart.value.interpretations.executive) {
          const exec = chart.value.interpretations.executive;
          addLines('In plain English', `${exec.headline} ${exec.intro}`);
          exec.points.forEach((p) => addLines(p.label, p.text));
        }
        addLines('Lagna (Ascendant)', chart.value.interpretations.lagna);
        addLines('Chandra (Moon)', chart.value.interpretations.moon);
        addLines('Surya (Sun)', chart.value.interpretations.sun);
        addLines('Vimshottari Dasha', chart.value.interpretations.dasha);

        pdf.addPage();
        y = 18;
        pdf.setFont(undefined, 'bold');
        pdf.setFontSize(12);
        pdf.text('Grahas (Planets)', 16, y);
        y += 8;
        pdf.setFontSize(8);
        pdf.setFont(undefined, 'bold');
        ['Graha', 'Rashi', 'Deg', 'House', 'Nakshatra', 'Dignity'].forEach((h, i) => {
          pdf.text(h, 16 + i * 32, y);
        });
        y += 5;
        pdf.setFont(undefined, 'normal');
        chart.value.grahas.forEach((g) => {
          if (y > pageHeight - 16) {
            pdf.addPage();
            y = 18;
          }
          const row = [
            `${g.nameSa} (${g.nameEn})`,
            g.rashi.nameEn,
            g.degreeLabel,
            String(g.house),
            `${g.nakshatra.nameEn} ${g.pada}`,
            g.dignity.key,
          ];
          row.forEach((cell, i) => pdf.text(String(cell).slice(0, 18), 16 + i * 32, y));
          y += 5;
        });

        y += 6;
        addLines('Disclaimer', chart.value.interpretations.disclaimer);
        pdf.setFontSize(8);
        pdf.text(`Generated ${new Date().toLocaleDateString()} by iChing Engine`, 16, pageHeight - 10);
        pdf.save(`${localBirthData.name || 'Vedic'}_Kundali.pdf`);
      } catch (err) {
        console.error('Error generating PDF:', err);
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
      chart,
      error,
      chartFormat,
      timezonePresets,
      timezoneWarning,
      isValidData,
      dateTimeFormatSimple,
      formatDateForInput,
      formatOffset,
      updateDate,
      loadBirthdayData,
      calculateChart,
      saveBirthday,
      clearForm,
      handleImport,
      exportToPDF,
    };
  },
};
</script>

<style scoped>
.vedic-astrology-page {
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
.card-title {
  color: #495057;
  border-bottom: 2px solid #c9a227;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
</style>
