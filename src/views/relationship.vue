<template>
  <div class="relationship-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Relationship compatibility</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Relationship</li>
          </ol>
        </nav>
        <p class="mb-0">
          One pair, three systems: I-Ching hexagrams, Vedic Moon and Lagna, Western synastry.
          Load saved people or enter births, then calculate.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <div class="card mb-3">
        <button
          type="button"
          class="forms-toggle"
          :aria-expanded="showForms ? 'true' : 'false'"
          @click="showForms = !showForms"
        >
          <span>
            <strong>Birth details</strong>
            <span class="text-muted ms-2">{{ peopleSummary }}</span>
          </span>
          <span class="toggle-hint">{{ showForms ? 'Hide' : 'Show' }}</span>
        </button>
        <div v-show="showForms" class="card-body pt-0">
          <div class="row g-4">
            <div class="col-12 col-lg-6">
              <h5 class="card-title">Person 1</h5>
              <BirthdayPicker independent load-label="Load as person 1" @load="(b) => loadPerson(1, b)" />
              <BirthDataForm id="rel1" :model-value="person1" @update:model-value="(p) => assignPerson(person1, p)" />
            </div>
            <div class="col-12 col-lg-6">
              <h5 class="card-title">Person 2</h5>
              <BirthdayPicker independent load-label="Load as person 2" @load="(b) => loadPerson(2, b)" />
              <BirthDataForm id="rel2" :model-value="person2" @update:model-value="(p) => assignPerson(person2, p)" />
            </div>
          </div>
        </div>
      </div>

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>
      <div class="d-flex flex-wrap gap-2 mt-3">
        <button type="button" class="btn btn-primary" :disabled="loading" @click="calculate">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? 'Calculating…' : 'Calculate compatibility' }}
        </button>
        <button type="button" class="btn btn-outline-secondary" @click="saveBoth">Save both to Birthdays</button>
        <button type="button" class="btn btn-info" :disabled="!result || exporting" @click="exportPdf">
          {{ exporting ? 'Building PDF…' : 'Export PDF' }}
        </button>
      </div>

      <div v-if="result" class="mt-5">
        <h2 class="h3 mb-3">{{ person1.name || 'Person 1' }} and {{ person2.name || 'Person 2' }}</h2>
        <ReadingLead
          v-if="combinedLead"
          :headline="combinedLead.headline"
          :intro="combinedLead.intro"
          :points="combinedLead.points"
        />

        <div class="row">
          <div class="col-12 col-lg-4 mb-4">
            <div class="card h-100">
              <div class="card-header">I-Ching</div>
              <div class="card-body">
                <p class="display-6 mb-1" :style="{ color: scoreColor(ichingCompat?.score) }">{{ ichingCompat?.label }}</p>
                <p class="small text-muted">{{ ichingCompat?.headline || ichingCompat?.summary || 'Score from elements, trigrams, sexagenary, and life stages.' }}</p>
                <ul class="small mb-3" v-if="iching">
                  <li>Elements: {{ iching.compatibility.elementalCompatibility.description }}</li>
                  <li>Trigrams: {{ iching.compatibility.trigramHexagramCompatibility.description }}</li>
                  <li>Sexagenary: {{ iching.compatibility.sexagenaryCompatibility.description }}</li>
                  <li>Sub-cycles: {{ iching.compatibility.subCycleCompatibility.description }}</li>
                </ul>
                <p class="small mb-2" v-if="iching">
                  {{ person1.name }} seed: {{ iching.person1.iching.preHeavenHexagram.name }}
                  · {{ person2.name }} seed: {{ iching.person2.iching.preHeavenHexagram.name }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4 mb-4">
            <div class="card h-100">
              <div class="card-header">Vedic (Jyotish)</div>
              <div class="card-body">
                <p class="display-6 mb-1" :style="{ color: scoreColor(vedicCompat?.score) }">{{ vedicCompat?.label }}</p>
                <p class="small text-muted">{{ vedicCompat?.intro }}</p>
                <ul class="small mb-0">
                  <li v-for="(pt, i) in (vedicCompat?.points || [])" :key="'v' + i">
                    <strong>{{ pt.label }}.</strong> {{ pt.text }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4 mb-4">
            <div class="card h-100">
              <div class="card-header">Western synastry</div>
              <div class="card-body">
                <p class="display-6 mb-1" :style="{ color: scoreColor(westernCompat?.score) }">{{ westernCompat?.label }}</p>
                <p class="small text-muted">{{ westernCompat?.intro }}</p>
                <ul class="small mb-0">
                  <li v-for="(pt, i) in (westernCompat?.points || []).slice(0, 6)" :key="'w' + i">
                    <strong>{{ pt.label }}.</strong> {{ pt.text }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-4" v-if="iching">
          <div class="card-header">I-Ching natal sketches</div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>{{ person1.name }}</h6>
                <p class="small mb-1">Stem/branch: {{ stemBranch(iching.person1) }}</p>
                <p class="small mb-1">Pre-heaven: {{ iching.person1.iching.preHeavenHexagram.name }}</p>
                <p class="small mb-0">Later-heaven: {{ iching.person1.iching.laterHeavenHexagram.name }}</p>
              </div>
              <div class="col-md-6">
                <h6>{{ person2.name }}</h6>
                <p class="small mb-1">Stem/branch: {{ stemBranch(iching.person2) }}</p>
                <p class="small mb-1">Pre-heaven: {{ iching.person2.iching.preHeavenHexagram.name }}</p>
                <p class="small mb-0">Later-heaven: {{ iching.person2.iching.laterHeavenHexagram.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <p class="small text-muted">
          Educational overlay, not a verdict on whether you should be together. Vedic notes are natal-inspired, not a paid matching chart.
          Open full charts:
          <router-link to="/astrology">I-Ching</router-link>,
          <router-link to="/vedic_astrology">Vedic</router-link>,
          <router-link to="/western_astrology">Western</router-link>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue';
import { DateTime } from 'luxon';
import { useRoute } from 'vue-router';
import BirthDataForm from '@/components/BirthDataForm.vue';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import ReadingLead from '@/components/ReadingLead.vue';
import { useBirthdayStore } from '@/stores/birthday';
import { usePageTitle } from '@/composables/usePageTitle';
import astro from '@/const/astrology';
import { calculateVedicChart } from '@/utils/vedicCalculations';
import { calculateWesternChart } from '@/utils/astrologyCalculations';
import {
  calculateVedicCompatibility,
  calculateWesternCompatibility,
  buildCombinedLead,
  ichingSummary,
} from '@/utils/relationshipCompatibility';
import { downloadCompatibilityPdf } from '@/utils/compatibilityPdf';

function emptyPerson(gender) {
  return {
    name: '',
    date: '',
    time: '12:00',
    gender,
    latitude: 0,
    longitude: 0,
    place: '',
    timezoneOffset: -new Date().getTimezoneOffset(),
    timezoneName: '',
  };
}

function formFromBirthday(b) {
  const dt = DateTime.fromISO(b.birthday);
  return {
    name: b.name,
    date: dt.isValid ? dt.toJSDate() : '',
    time: dt.isValid ? dt.toFormat('HH:mm') : '12:00',
    gender: b.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
    latitude: b.coords.latitude,
    longitude: b.coords.longitude,
    place: b.place || '',
    timezoneOffset: typeof b.timezoneOffset === 'number' ? b.timezoneOffset : (dt.isValid ? dt.offset : -new Date().getTimezoneOffset()),
    timezoneName: b.timezoneName || '',
  };
}

function validatePerson(person, label) {
  if (!person.name || !String(person.name).trim()) return `${label}: name is required.`;
  if (!person.date) return `${label}: birth date is required.`;
  return '';
}

function toRecord(person) {
  const day = person.date instanceof Date
    ? DateTime.fromJSDate(person.date).toFormat('yyyy-MM-dd')
    : String(person.date).slice(0, 10);
  const dt = DateTime.fromISO(`${day}T${person.time || '12:00'}`);
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: person.name.trim(),
    birthday: dt.toISO(),
    gender: person.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
    coords: {
      latitude: Number(person.latitude),
      longitude: Number(person.longitude),
    },
    place: person.place || '',
    timezoneOffset: Number(person.timezoneOffset),
    timezoneName: person.timezoneName || '',
  };
}

function stemBranch(person) {
  const cycle = person?.yearly?.yearlyCycle?.cycle;
  if (!cycle) return '—';
  return `${cycle.celestialStem.name} (${cycle.celestialStem.element.name}) / ${cycle.horaryBranch.name} (${cycle.horaryBranch.animal})`;
}

function formatPersonWhen(person) {
  if (!person?.date) return 'no date';
  const day = person.date instanceof Date
    ? DateTime.fromJSDate(person.date)
    : DateTime.fromISO(String(person.date));
  const date = day.isValid ? day.toFormat('yyyy-MM-dd') : '—';
  return `${person.name || 'Unnamed'} · ${date} ${person.time || ''}`.trim();
}

export default {
  name: 'Relationship',
  components: { BirthDataForm, BirthdayPicker, ReadingLead },
  setup() {
    usePageTitle('Relationship compatibility');
    const route = useRoute();
    const birthdayStore = useBirthdayStore();
    const person1 = reactive(emptyPerson('MALE'));
    const person2 = reactive(emptyPerson('FEMALE'));
    const loading = ref(false);
    const error = ref('');
    const result = ref(null);
    const iching = ref(null);
    const vedicCompat = ref(null);
    const westernCompat = ref(null);
    const ichingCompat = ref(null);
    const combinedLead = ref(null);
    const showForms = ref(true);
    const exporting = ref(false);

    const peopleSummary = computed(() => {
      if (!person1.name && !person2.name && !person1.date && !person2.date) {
        return 'Load or enter two births, then hide this panel when you are done.';
      }
      return `${formatPersonWhen(person1)}  ·  ${formatPersonWhen(person2)}`;
    });

    const assignPerson = (target, next) => {
      Object.assign(target, next);
    };

    const loadPerson = (which, birthday) => {
      assignPerson(which === 1 ? person1 : person2, formFromBirthday(birthday));
      error.value = '';
    };

    const scoreColor = (score) => {
      if (typeof score !== 'number') return '#333';
      if (score > 1) return '#0a7a32';
      if (score < -1) return '#b42318';
      return '#333';
    };

    const calculate = async () => {
      error.value = '';
      const e1 = validatePerson(person1, 'Person 1');
      const e2 = validatePerson(person2, 'Person 2');
      if (e1 || e2) {
        error.value = e1 || e2;
        return;
      }
      loading.value = true;
      result.value = null;
      try {
        const gender1 = person1.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
        const gender2 = person2.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
        const day1 = person1.date instanceof Date ? DateTime.fromJSDate(person1.date) : DateTime.fromISO(String(person1.date));
        const day2 = person2.date instanceof Date ? DateTime.fromJSDate(person2.date) : DateTime.fromISO(String(person2.date));
        if (!day1.isValid) throw new Error('Person 1 birth date is not valid.');
        if (!day2.isValid) throw new Error('Person 2 birth date is not valid.');
        const date1 = day1.toJSDate();
        const date2 = day2.toJSDate();

        try {
          const ichingResult = await astro.calculateCompatibilityByYear(
            date1, gender1, Number(person1.latitude), Number(person1.longitude),
            date2, gender2, Number(person2.latitude), Number(person2.longitude)
          );
          iching.value = ichingResult;
          ichingCompat.value = ichingSummary(ichingResult.compatibility);
        } catch (ichingErr) {
          console.error(ichingErr);
          iching.value = null;
          ichingCompat.value = {
            score: 0,
            label: 'Unavailable',
            headline: 'I-Ching overlay could not be calculated.',
            summary: ichingErr.message || 'I-Ching calculation failed.',
          };
        }

        const n1 = person1.name.trim();
        const n2 = person2.name.trim();
        try {
          const vedic1 = calculateVedicChart({ ...person1, date: date1 });
          const vedic2 = calculateVedicChart({ ...person2, date: date2 });
          vedicCompat.value = calculateVedicCompatibility(vedic1, vedic2, n1, n2);
        } catch (vedicErr) {
          console.error(vedicErr);
          vedicCompat.value = {
            score: 0,
            label: 'Unavailable',
            intro: 'Vedic overlay could not be calculated for this pair.',
            points: [{ label: 'Note', text: vedicErr.message || 'Vedic calculation failed.' }],
          };
        }
        try {
          const west1 = calculateWesternChart({ ...person1, date: date1 });
          const west2 = calculateWesternChart({ ...person2, date: date2 });
          westernCompat.value = calculateWesternCompatibility(west1, west2, n1, n2);
        } catch (westErr) {
          console.error(westErr);
          westernCompat.value = {
            score: 0,
            label: 'Unavailable',
            intro: 'Western synastry could not be calculated for this pair.',
            points: [{ label: 'Note', text: westErr.message || 'Western calculation failed.' }],
          };
        }
        combinedLead.value = buildCombinedLead({
          name1: n1,
          name2: n2,
          iching: ichingCompat.value,
          vedic: vedicCompat.value,
          western: westernCompat.value,
        });
        result.value = true;
        showForms.value = false;
      } catch (err) {
        console.error(err);
        error.value = err.message || 'Could not calculate compatibility.';
      } finally {
        loading.value = false;
      }
    };

    const exportPdf = async () => {
      if (!result.value) return;
      exporting.value = true;
      try {
        await downloadCompatibilityPdf({
          person1,
          person2,
          combinedLead: combinedLead.value,
          iching: iching.value,
          ichingCompat: ichingCompat.value,
          vedicCompat: vedicCompat.value,
          westernCompat: westernCompat.value,
        });
      } catch (err) {
        console.error(err);
        error.value = err.message || 'Could not build the PDF.';
      } finally {
        exporting.value = false;
      }
    };

    const saveBoth = () => {
      try {
        const e1 = validatePerson(person1, 'Person 1');
        const e2 = validatePerson(person2, 'Person 2');
        if (e1 || e2) throw new Error(e1 || e2);
        birthdayStore.addBirthday(toRecord(person1));
        birthdayStore.addBirthday(toRecord(person2));
        error.value = '';
        alert('Both birthdays saved.');
      } catch (err) {
        error.value = err.message;
      }
    };

    onMounted(() => {
      const a = route.query.a || route.query.load;
      const b = route.query.b;
      if (a) {
        const found = birthdayStore.getBirthdayById(a);
        if (found) loadPerson(1, found);
      }
      if (b) {
        const found = birthdayStore.getBirthdayById(b);
        if (found) loadPerson(2, found);
      }
    });

    return {
      person1,
      person2,
      assignPerson,
      loadPerson,
      loading,
      error,
      showForms,
      peopleSummary,
      calculate,
      saveBoth,
      exportPdf,
      exporting,
      result,
      iching,
      ichingCompat,
      vedicCompat,
      westernCompat,
      combinedLead,
      scoreColor,
      stemBranch,
    };
  },
};
</script>

<style scoped>
.card-title {
  border-bottom: 2px solid #6c63ff;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
.relationship-page :deep(.card) {
  margin: 0;
  overflow: visible;
}
.display-6 {
  font-size: 1.5rem;
  font-weight: 700;
}
.forms-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border: 0;
  background: #f4f6fb;
  text-align: left;
  padding: 0.9rem 1.15rem;
  border-radius: 0.375rem 0.375rem 0 0;
  font-size: 0.95rem;
}
.forms-toggle:hover {
  background: #eef1f8;
}
.toggle-hint {
  flex-shrink: 0;
  font-weight: 600;
  color: #5b4cdb;
}
</style>
