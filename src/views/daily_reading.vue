<template>
  <div class="daily-reading-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Daily Reading</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item"><router-link to="/astrology">I-Ching Astrology</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">Daily Reading</li>
          </ol>
        </nav>
        <p class="mb-0 lead-blurb">
          The hexagram that covers a given day in a natal year, after Sherrill &amp; Chu.
          Open on today for the last person you used (or the first saved birthday).
          Change the date to look up any day in early or later life.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <BirthdayPicker auto-load default-first load-label="Load" @load="loadPerson" />

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>

      <div v-if="!birthdayList.length" class="empty-state card">
        <div class="card-body">
          <p class="mb-0">
            Save a birthday first, then this page can show today’s daily hexagram.
            <router-link to="/birthdays">Add someone</router-link>.
          </p>
        </div>
      </div>

      <div v-else-if="consulting" class="empty-state card">
        <div class="card-body">
          <p class="mb-0">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Calculating the natal year cycles…
          </p>
        </div>
      </div>

      <div v-else-if="natal.name" class="reading">
        <p class="person-line text-muted mb-3">
          {{ natal.name }}
          · {{ genderLabel }}
          · born {{ birthLabel }}
          <span v-if="natal.place"> · {{ natal.place }}</span>
          · {{ natal.hemisphere }} hemisphere
        </p>

        <div class="date-bar card mb-4">
          <div class="card-body">
            <div class="row g-3 align-items-end">
              <div class="col-12 col-md-5">
                <label class="form-label" for="lookup-date">Day to read</label>
                <input
                  id="lookup-date"
                  type="date"
                  class="form-control"
                  v-model="lookupDate"
                  :min="minDate"
                  :max="maxDate"
                />
              </div>
              <div class="col-12 col-md-7 d-flex flex-wrap gap-2">
                <button type="button" class="btn btn-primary" @click="goToday">Today</button>
                <router-link
                  v-if="natal.id"
                  class="btn btn-outline-secondary"
                  :to="`/astrology?load=${natal.id}`"
                >
                  Full natal reading
                </router-link>
              </div>
            </div>
            <p class="mb-0 mt-3 date-caption">
              {{ lookupCaption }}
            </p>
          </div>
        </div>

        <h2 class="section-title">{{ isToday ? 'Today' : 'This day' }}</h2>
        <p v-if="loadingDaily" class="text-muted">Updating daily hexagrams…</p>
        <div class="row g-3 mb-4">
          <div class="col-12 col-lg-6">
            <IchingHexagramCard
              v-if="early.entry?.hexagram"
              title="Daily early life (Pre-Heaven)"
              :hexagram="early.entry.hexagram"
              :note="earlyNote"
              @detail="openHexDetail"
            />
            <div v-else class="empty-state card h-100">
              <div class="card-body">
                <p class="eyebrow mb-1">Daily early life</p>
                <p class="mb-0 text-muted">
                  {{ early.yearly ? 'This date is not in the early-life daily list for that year.' : 'This date is outside the early-life yearly cycle.' }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <IchingHexagramCard
              v-if="later.entry?.hexagram"
              title="Daily later life (Later-Heaven)"
              :hexagram="later.entry.hexagram"
              :note="laterNote"
              @detail="openHexDetail"
            />
            <div v-else class="empty-state card h-100">
              <div class="card-body">
                <p class="eyebrow mb-1">Daily later life</p>
                <p class="mb-0 text-muted">
                  {{ later.yearly ? 'This date is not in the later-life daily list for that year.' : 'This date is outside the later-life yearly cycle.' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 class="section-title">Browse any year and day</h2>
        <p class="text-muted small">
          Each natal year has about one hexagram per day, changing every six days.
          Pick a year in either life stage, then a date in that year.
          The natal page still has these lists under Life stages; it used to land on the first day of the year rather than today.
        </p>
        <div class="row g-3 mb-4">
          <div class="col-12 col-lg-6">
            <label class="form-label" for="early-year">Early life year</label>
            <select
              id="early-year"
              class="form-select mb-2"
              :value="early.year"
              @change="onEarlyYearChange($event.target.value)"
            >
              <option v-if="!natal.preHeavenBirthSubCycles.length" value="">No early-life years</option>
              <option
                v-for="sub in natal.preHeavenBirthSubCycles"
                :key="'early-' + sub.year"
                :value="sub.year"
              >
                {{ sub.year }} — age {{ sub.age }}
              </option>
            </select>
            <label class="form-label" for="early-day">Day in that year</label>
            <select
              id="early-day"
              class="form-select mb-3"
              :disabled="!early.days.length"
              :value="early.selectedDate"
              @change="onDayPicked($event.target.value)"
            >
              <option v-if="!early.days.length" value="">No daily list for this year</option>
              <option v-for="sub in early.days" :key="'ed-' + sub.date" :value="sub.date">
                {{ sub.date }}
                <template v-if="sub.hexagram?.name"> — {{ sub.hexagram.name }}</template>
              </option>
            </select>
            <p v-if="early.yearly?.hexagram?.name" class="small text-muted mb-0">
              Year hexagram: {{ early.yearly.hexagram.name }}
              <span v-if="early.yearly.hexagram.symbol"> ({{ early.yearly.hexagram.symbol }})</span>
            </p>
          </div>
          <div class="col-12 col-lg-6">
            <label class="form-label" for="later-year">Later life year</label>
            <select
              id="later-year"
              class="form-select mb-2"
              :value="later.year"
              @change="onLaterYearChange($event.target.value)"
            >
              <option v-if="!natal.laterHeavenBirthSubCycles.length" value="">No later-life years</option>
              <option
                v-for="sub in natal.laterHeavenBirthSubCycles"
                :key="'later-' + sub.year"
                :value="sub.year"
              >
                {{ sub.year }} — age {{ sub.age }}
              </option>
            </select>
            <label class="form-label" for="later-day">Day in that year</label>
            <select
              id="later-day"
              class="form-select mb-3"
              :disabled="!later.days.length"
              :value="later.selectedDate"
              @change="onDayPicked($event.target.value)"
            >
              <option v-if="!later.days.length" value="">No daily list for this year</option>
              <option v-for="sub in later.days" :key="'ld-' + sub.date" :value="sub.date">
                {{ sub.date }}
                <template v-if="sub.hexagram?.name"> — {{ sub.hexagram.name }}</template>
              </option>
            </select>
            <p v-if="later.yearly?.hexagram?.name" class="small text-muted mb-0">
              Year hexagram: {{ later.yearly.hexagram.name }}
              <span v-if="later.yearly.hexagram.symbol"> ({{ later.yearly.hexagram.symbol }})</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <IchingDetailModal
      :show="detail.show"
      :kind="detail.kind"
      :binary="detail.binary"
      @close="detail.show = false"
      @open-trigram="openTriDetail"
    />
  </div>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue';
import { DateTime } from 'luxon';
import { useRoute } from 'vue-router';
import astro from '@/const/astrology';
import { useBirthdayStore } from '@/stores/birthday';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import IchingHexagramCard from '@/components/IchingHexagramCard.vue';
import IchingDetailModal from '@/components/IchingDetailModal.vue';
import { usePageTitle } from '@/composables/usePageTitle';

function findYearly(cycles, year) {
  const y = Number(year);
  if (!Number.isFinite(y)) return null;
  return (cycles || []).find((s) => Number(s.year) === y) || null;
}

function cycleYearForDate(birthDt, targetDt) {
  const daysInMonth = DateTime.fromObject({ year: targetDt.year, month: birthDt.month }).daysInMonth;
  const anniversary = DateTime.fromObject({
    year: targetDt.year,
    month: birthDt.month,
    day: Math.min(birthDt.day, daysInMonth),
  });
  if (targetDt < anniversary) return targetDt.year - 1;
  return targetDt.year;
}

function hexagramSpan(days, iso) {
  if (!Array.isArray(days) || !days.length || !iso) return '';
  const idx = days.findIndex((d) => d.date === iso);
  if (idx < 0) return '';
  const binary = days[idx].hexagram?.binary;
  let start = idx;
  let end = idx;
  while (start > 0 && days[start - 1].hexagram?.binary === binary) start -= 1;
  while (end < days.length - 1 && days[end + 1].hexagram?.binary === binary) end += 1;
  if (days[start].date === days[end].date) return days[start].date;
  return `${days[start].date} – ${days[end].date}`;
}

function emptyStage() {
  return {
    year: '',
    days: [],
    selectedDate: '',
    entry: null,
    yearly: null,
  };
}

export default {
  name: 'DailyReading',
  components: {
    BirthdayPicker,
    IchingHexagramCard,
    IchingDetailModal,
  },
  setup() {
    usePageTitle('Daily Reading');
    const route = useRoute();
    const birthdayStore = useBirthdayStore();
    const birthdayList = computed(() => birthdayStore.getBirthdayList);

    const consulting = ref(false);
    const loadingDaily = ref(false);
    const error = ref('');
    const qDate = route.query.date;
    const parsedQueryDate = qDate ? DateTime.fromISO(String(qDate)) : null;
    const lookupDate = ref(
      parsedQueryDate?.isValid ? parsedQueryDate.toISODate() : DateTime.now().toISODate(),
    );
    const loadId = route.query.load;
    if (loadId) {
      const found = birthdayStore.getBirthdayById(loadId);
      if (found) birthdayStore.selectBirthday(found.id);
    }
    const dailyCache = new Map();
    let applying = false;

    const natal = reactive({
      id: null,
      name: '',
      gender: 'MALE',
      place: '',
      hemisphere: 'Northern',
      birthDate: null,
      latitude: 0,
      longitude: 0,
      consultation: null,
      preHeavenBirthSubCycles: [],
      laterHeavenBirthSubCycles: [],
    });

    const early = reactive(emptyStage());
    const later = reactive(emptyStage());
    const detail = reactive({ show: false, kind: 'hexagram', binary: '' });

    const todayIso = () => DateTime.now().toISODate();
    const isToday = computed(() => lookupDate.value === todayIso());

    const genderLabel = computed(() => {
      if (natal.gender === 'FEMALE') return 'Female';
      if (natal.gender === 'MALE') return 'Male';
      return natal.gender || '';
    });

    const birthLabel = computed(() => {
      if (!natal.birthDate) return '';
      return DateTime.fromJSDate(new Date(natal.birthDate)).toFormat('yyyy-MM-dd HH:mm');
    });

    const lookupCaption = computed(() => {
      const target = DateTime.fromISO(lookupDate.value || '');
      if (!target.isValid) return '';
      const parts = [target.toFormat('cccc d LLLL yyyy')];
      if (natal.birthDate) {
        const birth = DateTime.fromJSDate(new Date(natal.birthDate));
        const age = Math.floor(target.diff(birth, 'years').years);
        if (Number.isFinite(age) && age >= 0) parts.push(`age ${age}`);
      }
      if (early.yearly) parts.push(`early-life year ${early.yearly.year}`);
      if (later.yearly) parts.push(`later-life year ${later.yearly.year}`);
      return parts.join(' · ');
    });

    const yearBounds = computed(() => {
      const years = [
        ...(natal.preHeavenBirthSubCycles || []).map((s) => Number(s.year)),
        ...(natal.laterHeavenBirthSubCycles || []).map((s) => Number(s.year)),
      ].filter((y) => Number.isFinite(y));
      if (!years.length) return { min: '', max: '' };
      return {
        min: `${Math.min(...years)}-01-01`,
        max: `${Math.max(...years) + 1}-12-31`,
      };
    });
    const minDate = computed(() => yearBounds.value.min);
    const maxDate = computed(() => yearBounds.value.max);

    const earlyNote = computed(() => {
      if (!early.entry) return '';
      const span = hexagramSpan(early.days, early.selectedDate);
      const yearName = early.yearly?.hexagram?.name;
      const bits = [];
      if (span) bits.push(`Holds ${span} (about six days).`);
      if (yearName) bits.push(`From the ${early.yearly.year} early-life year (${yearName}).`);
      return bits.join(' ');
    });

    const laterNote = computed(() => {
      if (!later.entry) return '';
      const span = hexagramSpan(later.days, later.selectedDate);
      const yearName = later.yearly?.hexagram?.name;
      const bits = [];
      if (span) bits.push(`Holds ${span} (about six days).`);
      if (yearName) bits.push(`From the ${later.yearly.year} later-life year (${yearName}).`);
      return bits.join(' ');
    });

    const openHexDetail = (binary) => {
      detail.kind = 'hexagram';
      detail.binary = binary || '';
      detail.show = true;
    };

    const openTriDetail = (binary) => {
      detail.kind = 'trigram';
      detail.binary = binary || '';
      detail.show = true;
    };

    const resetStage = (stage) => {
      stage.year = '';
      stage.days = [];
      stage.selectedDate = '';
      stage.entry = null;
      stage.yearly = null;
    };

    const daysFor = async (stageKey, year, subcycle) => {
      const key = `${stageKey}:${year}`;
      if (dailyCache.has(key)) return dailyCache.get(key);
      if (!natal.consultation || !subcycle) {
        dailyCache.set(key, []);
        return [];
      }
      const days = await natal.consultation.calculateDailyCycles(
        subcycle.hexagram,
        subcycle.controllingLine,
        natal.birthDate,
        natal.latitude,
        Number(year),
      );
      const list = Array.isArray(days) ? days : [];
      dailyCache.set(key, list);
      return list;
    };

    const fillStage = async (stage, stageKey, cycles, yearsToTry, iso) => {
      for (const y of yearsToTry) {
        const sub = findYearly(cycles, y);
        if (!sub) continue;
        const days = await daysFor(stageKey, y, sub);
        const entry = days.find((d) => d.date === iso);
        if (entry) {
          stage.year = Number(y);
          stage.yearly = sub;
          stage.days = days;
          stage.selectedDate = iso;
          stage.entry = entry;
          return;
        }
      }

      let sub = null;
      for (const y of yearsToTry) {
        sub = findYearly(cycles, y);
        if (sub) break;
      }
      if (!sub && cycles.length) {
        const last = cycles[cycles.length - 1];
        const first = cycles[0];
        sub = Number(yearsToTry[0]) >= Number(last.year) ? last : first;
      }
      stage.year = sub ? Number(sub.year) : '';
      stage.yearly = sub;
      stage.days = sub ? await daysFor(stageKey, sub.year, sub) : [];
      stage.selectedDate = '';
      stage.entry = null;
    };

    const applyLookupDate = async (iso) => {
      if (!natal.consultation || !iso) return;
      const target = DateTime.fromISO(iso);
      if (!target.isValid) return;
      applying = true;
      loadingDaily.value = true;
      try {
        const birth = DateTime.fromJSDate(new Date(natal.birthDate));
        const preferred = cycleYearForDate(birth, target);
        const yearsToTry = [preferred, preferred - 1, preferred + 1];
        await fillStage(early, 'early', natal.preHeavenBirthSubCycles, yearsToTry, iso);
        await fillStage(later, 'later', natal.laterHeavenBirthSubCycles, yearsToTry, iso);
      } catch (err) {
        console.error(err);
        error.value = err.message || 'Could not calculate daily cycles for this date.';
      } finally {
        loadingDaily.value = false;
        applying = false;
      }
    };

    const pickDateInDays = (days) => {
      if (!Array.isArray(days) || !days.length) return '';
      const keep = days.find((d) => d.date === lookupDate.value);
      if (keep) return keep.date;
      const today = days.find((d) => d.date === todayIso());
      if (today) return today.date;
      return days[0].date;
    };

    const onEarlyYearChange = async (yearValue) => {
      if (applying) return;
      const sub = findYearly(natal.preHeavenBirthSubCycles, yearValue);
      if (!sub) return;
      applying = true;
      loadingDaily.value = true;
      try {
        const days = await daysFor('early', sub.year, sub);
        early.year = Number(sub.year);
        early.yearly = sub;
        early.days = days;
        const next = pickDateInDays(days);
        applying = false;
        if (next && next !== lookupDate.value) lookupDate.value = next;
        else await applyLookupDate(lookupDate.value);
      } catch (err) {
        console.error(err);
        applying = false;
      } finally {
        loadingDaily.value = false;
      }
    };

    const onLaterYearChange = async (yearValue) => {
      if (applying) return;
      const sub = findYearly(natal.laterHeavenBirthSubCycles, yearValue);
      if (!sub) return;
      applying = true;
      loadingDaily.value = true;
      try {
        const days = await daysFor('later', sub.year, sub);
        later.year = Number(sub.year);
        later.yearly = sub;
        later.days = days;
        const next = pickDateInDays(days);
        applying = false;
        if (next && next !== lookupDate.value) lookupDate.value = next;
        else await applyLookupDate(lookupDate.value);
      } catch (err) {
        console.error(err);
        applying = false;
      } finally {
        loadingDaily.value = false;
      }
    };

    const onDayPicked = (iso) => {
      if (!iso || applying) return;
      lookupDate.value = iso;
    };

    const goToday = () => {
      lookupDate.value = todayIso();
    };

    const loadPerson = async (birthday) => {
      if (!birthday) return;
      consulting.value = true;
      error.value = '';
      dailyCache.clear();
      resetStage(early);
      resetStage(later);
      try {
        birthdayStore.selectBirthday(birthday.id);
        natal.id = birthday.id;
        natal.name = birthday.name;
        natal.gender = birthday.gender === 'FEMALE' ? 'FEMALE' : 'MALE';
        natal.place = birthday.place || '';
        natal.birthDate = DateTime.fromISO(birthday.birthday).toJSDate();
        natal.latitude = birthday.coords.latitude;
        natal.longitude = birthday.coords.longitude;
        natal.hemisphere = natal.latitude >= 0 ? 'Northern' : 'Southern';

        const AstrologyClass = natal.hemisphere === 'Northern'
          ? astro.IChingAstrology_North
          : astro.IChingAstrology_South;
        natal.consultation = new astro.IChingConsultation(new AstrologyClass());
        const gender = natal.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
        const result = await natal.consultation.consultOracle(
          natal.birthDate,
          gender,
          natal.latitude,
          natal.longitude,
        );
        natal.preHeavenBirthSubCycles = result.iching.preHeavenBirthSubCycles || [];
        natal.laterHeavenBirthSubCycles = result.iching.laterHeavenBirthSubCycles || [];
        await applyLookupDate(lookupDate.value);
      } catch (err) {
        console.error(err);
        natal.consultation = null;
        natal.name = birthday.name || '';
        error.value = err.message || 'Could not calculate this birth.';
      } finally {
        consulting.value = false;
      }
    };

    watch(lookupDate, async (iso) => {
      if (applying || !natal.consultation) return;
      await applyLookupDate(iso);
    });

    return {
      birthdayList,
      consulting,
      loadingDaily,
      error,
      lookupDate,
      natal,
      early,
      later,
      detail,
      isToday,
      genderLabel,
      birthLabel,
      lookupCaption,
      minDate,
      maxDate,
      earlyNote,
      laterNote,
      loadPerson,
      goToday,
      onEarlyYearChange,
      onLaterYearChange,
      onDayPicked,
      openHexDetail,
      openTriDetail,
    };
  },
};
</script>

<style scoped>
.lead-blurb {
  max-width: 46rem;
  color: #4a3b16;
}
.empty-state {
  margin: 0;
  border: 1px dashed #c9b06a;
  background: #fffdf7;
}
.section-title {
  font-size: 1.35rem;
  color: #3d2e10;
  margin: 1.75rem 0 0.75rem;
}
.person-line {
  font-size: 0.95rem;
}
.date-bar {
  margin: 0;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
}
.date-caption {
  color: #4a3b16;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #8a6a22;
}
.form-label {
  font-weight: 600;
}
@media (max-width: 576px) {
  .display-4 {
    font-size: 2rem;
  }
}
</style>
