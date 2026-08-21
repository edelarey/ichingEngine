<template>
  <div class="compare-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Compare readings</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active">Compare</li>
          </ol>
        </nav>
        <p class="mb-0">The same birth, three systems: I-Ching hexagrams, Vedic kundli, Western natal chart.</p>
      </div>
    </header>

    <div class="container mb-5">
      <BirthdayPicker load-label="Compare this person" @load="runCompare" />
      <p v-if="error" class="text-danger">{{ error }}</p>
      <p v-if="loading">Calculating…</p>

      <div v-if="person" class="mb-3">
        <h5>{{ person.name }}</h5>
        <p class="text-muted">{{ when }} · {{ person.place || 'custom coordinates' }}</p>
      </div>

      <div v-if="vedic || western || iching" class="row">
        <div class="col-12 col-lg-4 mb-4">
          <div class="card h-100">
            <div class="card-header">I-Ching astrology</div>
            <div class="card-body">
              <ReadingLead v-if="ichingLead" :headline="ichingLead.headline" :intro="ichingLead.intro" :points="ichingLead.points" />
              <router-link v-if="person" class="btn btn-sm btn-primary" :to="`/astrology?load=${person.id}`">Open full reading</router-link>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4 mb-4">
          <div class="card h-100">
            <div class="card-header">Vedic (Jyotish)</div>
            <div class="card-body">
              <ReadingLead
                v-if="vedic && vedic.interpretations.executive"
                :headline="vedic.interpretations.executive.headline"
                :intro="vedic.interpretations.executive.intro"
                :points="vedic.interpretations.executive.points"
              />
              <router-link v-if="person" class="btn btn-sm btn-primary" :to="`/vedic_astrology?load=${person.id}`">Open full reading</router-link>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4 mb-4">
          <div class="card h-100">
            <div class="card-header">Western</div>
            <div class="card-body">
              <ReadingLead
                v-if="western && western.interpretations.executive"
                :headline="western.interpretations.executive.headline"
                :intro="western.interpretations.executive.intro"
                :points="western.interpretations.executive.points"
              />
              <router-link v-if="person" class="btn btn-sm btn-primary" :to="`/western_astrology?load=${person.id}`">Open full reading</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { DateTime } from 'luxon';
import { useRoute } from 'vue-router';
import { useBirthdayStore } from '@/stores/birthday';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import ReadingLead from '@/components/ReadingLead.vue';
import { calculateVedicChart } from '@/utils/vedicCalculations';
import { calculateWesternChart } from '@/utils/astrologyCalculations';
import astro from '@/const/astrology';
import { usePageTitle } from '@/composables/usePageTitle';

function formFromBirthday(b) {
  const dt = DateTime.fromISO(b.birthday);
  return {
    name: b.name,
    date: dt.toJSDate(),
    time: dt.toFormat('HH:mm'),
    gender: b.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
    latitude: b.coords.latitude,
    longitude: b.coords.longitude,
    place: b.place || '',
    timezoneOffset: typeof b.timezoneOffset === 'number' ? b.timezoneOffset : dt.offset,
  };
}

function firstPhrase(text) {
  if (!text) return '';
  return String(text).split(',')[0].trim();
}

export default {
  name: 'CompareReadings',
  components: { BirthdayPicker, ReadingLead },
  setup() {
    usePageTitle('Compare readings');
    const route = useRoute();
    const birthdayStore = useBirthdayStore();
    const person = ref(null);
    const vedic = ref(null);
    const western = ref(null);
    const iching = ref(null);
    const loading = ref(false);
    const error = ref('');

    const when = computed(() => {
      if (!person.value) return '';
      return DateTime.fromISO(person.value.birthday).toFormat('yyyy-MM-dd HH:mm');
    });

    const ichingLead = computed(() => {
      const r = iching.value;
      if (!r || !r.iching) return null;
      const pre = r.iching.preHeavenHexagram;
      const later = r.iching.laterHeavenHexagram;
      if (!pre) return null;
      return {
        headline: `${pre.name} inside, ${later?.name || 'life unfolding'} in the world.`,
        intro: 'I-Ching astrology reads hexagrams of the birth, not planets.',
        points: [
          { label: 'Seed', text: `${pre.name}: ${firstPhrase(pre.translation)}` },
          { label: 'Unfolding', text: later ? `${later.name}: ${firstPhrase(later.translation)}` : '—' },
          { label: 'Year animal', text: r.yearly?.yearlyCycle?.cycle?.horaryBranch?.animal || '—' },
        ],
      };
    });

    const runCompare = async (birthday) => {
      loading.value = true;
      error.value = '';
      person.value = birthday;
      birthdayStore.selectBirthday(birthday.id);
      const form = formFromBirthday(birthday);
      try {
        vedic.value = calculateVedicChart(form);
        western.value = calculateWesternChart(form);
        const hemisphere = form.latitude >= 0 ? 'Northern' : 'Southern';
        const engine = hemisphere === 'Northern' ? new astro.IChingAstrology_North() : new astro.IChingAstrology_South();
        const consultation = new astro.IChingConsultation(engine);
        const gender = form.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
        iching.value = await consultation.consultOracle(form.date, gender, form.latitude, form.longitude);
      } catch (err) {
        console.error(err);
        error.value = err.message || 'Could not calculate one of the readings.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      const id = route.query.load;
      if (id) {
        const found = birthdayStore.getBirthdayById(id);
        if (found) runCompare(found);
      }
    });

    return { person, vedic, western, iching, ichingLead, loading, error, when, runCompare };
  },
};
</script>
