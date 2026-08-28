<template>
  <div class="daily-reading-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">I-Ching Daily</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item"><router-link to="/astrology">I-Ching Astrology</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">I-Ching Daily</li>
          </ol>
        </nav>
        <p class="mb-0 lead-blurb">
          Two independent daily hexagrams after Sherrill &amp; Chu: early life (Pre-Heaven) and
          later life (Later-Heaven). Each column has its own year and day. Changing one reading
          does not clear the other.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <BirthdayPicker auto-load default-first load-label="Load" @load="loadPerson" />

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>

      <div v-if="!birthdayList.length" class="empty-state card">
        <div class="card-body">
          <p class="mb-0">
            Save a birthday first, then this page can show today’s daily hexagrams.
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
        <div class="person-bar mb-4">
          <p class="person-line text-muted mb-2">
            {{ natal.name }}
            · {{ genderLabel }}
            · born {{ birthLabel }}
            <span v-if="natal.place"> · {{ natal.place }}</span>
            · {{ natal.hemisphere }} hemisphere
          </p>
          <router-link
            v-if="natal.id"
            class="btn btn-outline-secondary btn-sm"
            :to="`/astrology?load=${natal.id}`"
          >
            Full natal reading
          </router-link>
        </div>

        <div class="row g-4">
          <div class="col-12 col-lg-6">
            <section class="stage-column">
              <h2 class="section-title">Daily early life</h2>
              <p class="text-muted small">
                Pre-Heaven{{ earlyRangeLabel ? ` · ${earlyRangeLabel}` : '' }}.
                Pick a year and day in early life only.
              </p>
              <div class="date-bar card mb-3">
                <div class="card-body">
                  <label class="form-label" for="early-lookup-date">Day in early life</label>
                  <div class="d-flex flex-wrap gap-2 align-items-end">
                    <input
                      id="early-lookup-date"
                      type="date"
                      class="form-control date-input"
                      :value="early.selectedDate"
                      :min="earlyMinDate"
                      :max="earlyMaxDate"
                      @change="onEarlyDateInput"
                    />
                    <button type="button" class="btn btn-primary" @click="goEarlyToday">Today</button>
                  </div>
                  <p v-if="earlyCaption" class="mb-0 mt-2 date-caption">{{ earlyCaption }}</p>
                </div>
              </div>
              <SheetSelect
                id="early-year"
                class="mb-2"
                label="Early life year"
                :options="earlyYearOptions"
                :disabled="!earlyYearOptions.length"
                :placeholder="earlyYearOptions.length ? 'Choose a year' : 'No early-life years'"
                :model-value="early.yearIndex"
                @update:model-value="onEarlyYearChange"
              />
              <SheetSelect
                id="early-day"
                class="mb-3"
                label="Day in that year"
                :options="earlyDayOptions"
                :disabled="!earlyDayOptions.length"
                :placeholder="earlyDayOptions.length ? 'Choose a day' : 'No daily list for this year'"
                :model-value="early.selectedDate"
                @update:model-value="onEarlyDayPicked"
              />
              <p v-if="early.yearly?.hexagram?.name" class="small text-muted mb-3">
                Year hexagram: {{ early.yearly.hexagram.name }}
                <span v-if="early.yearly.hexagram.symbol"> ({{ early.yearly.hexagram.symbol }})</span>
              </p>
              <p v-if="early.loading" class="text-muted">Updating early-life hexagram…</p>
              <IchingHexagramCard
                v-if="early.entry?.hexagram"
                title="Daily early life (Pre-Heaven)"
                :hexagram="early.entry.hexagram"
                :note="earlyNote"
                :fill-height="false"
                @detail="openHexDetail"
              />
              <div v-else class="empty-state card">
                <div class="card-body">
                  <p class="eyebrow mb-1">Daily early life</p>
                  <p class="mb-0 text-muted">
                    {{ early.yearly ? 'This date is not in the early-life daily list for that year.' : 'This date is outside the early-life yearly cycle.' }}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div class="col-12 col-lg-6">
            <section class="stage-column">
              <h2 class="section-title">Daily later life</h2>
              <p class="text-muted small">
                Later-Heaven{{ laterRangeLabel ? ` · ${laterRangeLabel}` : '' }}.
                Pick a year and day in later life only.
              </p>
              <div class="date-bar card mb-3">
                <div class="card-body">
                  <label class="form-label" for="later-lookup-date">Day in later life</label>
                  <div class="d-flex flex-wrap gap-2 align-items-end">
                    <input
                      id="later-lookup-date"
                      type="date"
                      class="form-control date-input"
                      :value="later.selectedDate"
                      :min="laterMinDate"
                      :max="laterMaxDate"
                      @change="onLaterDateInput"
                    />
                    <button type="button" class="btn btn-primary" @click="goLaterToday">Today</button>
                  </div>
                  <p v-if="laterCaption" class="mb-0 mt-2 date-caption">{{ laterCaption }}</p>
                </div>
              </div>
              <SheetSelect
                id="later-year"
                class="mb-2"
                label="Later life year"
                :options="laterYearOptions"
                :disabled="!laterYearOptions.length"
                :placeholder="laterYearOptions.length ? 'Choose a year' : 'No later-life years'"
                :model-value="later.yearIndex"
                @update:model-value="onLaterYearChange"
              />
              <SheetSelect
                id="later-day"
                class="mb-3"
                label="Day in that year"
                :options="laterDayOptions"
                :disabled="!laterDayOptions.length"
                :placeholder="laterDayOptions.length ? 'Choose a day' : 'No daily list for this year'"
                :model-value="later.selectedDate"
                @update:model-value="onLaterDayPicked"
              />
              <p v-if="later.yearly?.hexagram?.name" class="small text-muted mb-3">
                Year hexagram: {{ later.yearly.hexagram.name }}
                <span v-if="later.yearly.hexagram.symbol"> ({{ later.yearly.hexagram.symbol }})</span>
              </p>
              <p v-if="later.loading" class="text-muted">Updating later-life hexagram…</p>
              <IchingHexagramCard
                v-if="later.entry?.hexagram"
                title="Daily later life (Later-Heaven)"
                :hexagram="later.entry.hexagram"
                :note="laterNote"
                :fill-height="false"
                @detail="openHexDetail"
              />
              <div v-else class="empty-state card">
                <div class="card-body">
                  <p class="eyebrow mb-1">Daily later life</p>
                  <p class="mb-0 text-muted">
                    {{ later.yearly ? 'This date is not in the later-life daily list for that year.' : 'This date is outside the later-life yearly cycle.' }}
                  </p>
                </div>
              </div>
            </section>
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
import { computed, reactive, ref } from 'vue';
import { DateTime } from 'luxon';
import { useRoute } from 'vue-router';
import { useBirthdayStore } from '@/stores/birthday';
import { consultIchingNatal } from '@/utils/ichingNatal';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import IchingHexagramCard from '@/components/IchingHexagramCard.vue';
import IchingDetailModal from '@/components/IchingDetailModal.vue';
import SheetSelect from '@/components/SheetSelect.vue';
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

function yearBounds(cycles) {
  const years = (cycles || []).map((s) => Number(s.year)).filter((y) => Number.isFinite(y));
  if (!years.length) return { min: '', max: '' };
  return {
    min: `${Math.min(...years)}-01-01`,
    max: `${Math.max(...years) + 1}-12-31`,
  };
}

function emptyStage() {
  return {
    year: '',
    yearIndex: null,
    days: [],
    selectedDate: '',
    entry: null,
    yearly: null,
    loading: false,
  };
}

export default {
  name: 'DailyReading',
  components: {
    BirthdayPicker,
    IchingHexagramCard,
    IchingDetailModal,
    SheetSelect,
  },
  setup() {
    usePageTitle('I-Ching Daily');
    const route = useRoute();
    const birthdayStore = useBirthdayStore();
    const birthdayList = computed(() => birthdayStore.getBirthdayList);

    const consulting = ref(birthdayStore.getBirthdayList.length > 0);
    const error = ref('');
    const qDate = route.query.date;
    const parsedQueryDate = qDate ? DateTime.fromISO(String(qDate)) : null;
    const initialDate = parsedQueryDate?.isValid
      ? parsedQueryDate.toISODate()
      : DateTime.now().toISODate();
    const loadId = route.query.load;
    if (loadId) {
      const found = birthdayStore.getBirthdayById(loadId);
      if (found) birthdayStore.selectBirthday(found.id);
    }
    const dailyCache = new Map();

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

    const genderLabel = computed(() => {
      if (natal.gender === 'FEMALE') return 'Female';
      if (natal.gender === 'MALE') return 'Male';
      return natal.gender || '';
    });

    const birthLabel = computed(() => {
      if (!natal.birthDate) return '';
      return DateTime.fromJSDate(new Date(natal.birthDate)).toFormat('yyyy-MM-dd HH:mm');
    });

    const stageCaption = (stage, lifeLabel) => {
      if (!stage.selectedDate) return '';
      const target = DateTime.fromISO(stage.selectedDate);
      if (!target.isValid) return '';
      const parts = [target.toFormat('cccc d LLLL yyyy')];
      if (natal.birthDate) {
        const birth = DateTime.fromJSDate(new Date(natal.birthDate));
        const age = Math.floor(target.diff(birth, 'years').years);
        if (Number.isFinite(age) && age >= 0) parts.push(`age ${age}`);
      }
      if (stage.yearly) parts.push(`${lifeLabel} year ${stage.yearly.year}`);
      return parts.join(' · ');
    };

    const earlyCaption = computed(() => stageCaption(early, 'early-life'));
    const laterCaption = computed(() => stageCaption(later, 'later-life'));

    const earlyBounds = computed(() => yearBounds(natal.preHeavenBirthSubCycles));
    const laterBounds = computed(() => yearBounds(natal.laterHeavenBirthSubCycles));
    const earlyMinDate = computed(() => earlyBounds.value.min);
    const earlyMaxDate = computed(() => earlyBounds.value.max);
    const laterMinDate = computed(() => laterBounds.value.min);
    const laterMaxDate = computed(() => laterBounds.value.max);

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

    const earlyYearOptions = computed(() =>
      (natal.preHeavenBirthSubCycles || []).map((sub, index) => ({
        value: index,
        label: `${sub.year} — age ${sub.age}`,
      }))
    );
    const laterYearOptions = computed(() =>
      (natal.laterHeavenBirthSubCycles || []).map((sub, index) => ({
        value: index,
        label: `${sub.year} — age ${sub.age}`,
      }))
    );
    const earlyRangeLabel = computed(() => {
      const list = natal.preHeavenBirthSubCycles || [];
      if (!list.length) return '';
      const first = list[0];
      const last = list[list.length - 1];
      return `${list.length} years · ages ${first.age}–${last.age} · ${first.year}–${last.year}`;
    });
    const laterRangeLabel = computed(() => {
      const list = natal.laterHeavenBirthSubCycles || [];
      if (!list.length) return '';
      const first = list[0];
      const last = list[list.length - 1];
      return `${list.length} years · ages ${first.age}–${last.age} · ${first.year}–${last.year}`;
    });
    const earlyDayOptions = computed(() =>
      (early.days || []).map((sub) => ({
        value: sub.date,
        label: sub.hexagram?.name ? `${sub.date} — ${sub.hexagram.name}` : sub.date,
      }))
    );
    const laterDayOptions = computed(() =>
      (later.days || []).map((sub) => ({
        value: sub.date,
        label: sub.hexagram?.name ? `${sub.date} — ${sub.hexagram.name}` : sub.date,
      }))
    );

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
      stage.yearIndex = null;
      stage.days = [];
      stage.selectedDate = '';
      stage.entry = null;
      stage.yearly = null;
      stage.loading = false;
    };

    const indexOfCycle = (cycles, sub) => {
      if (!sub) return null;
      const idx = (cycles || []).findIndex((s) => s === sub
        || (Number(s.year) === Number(sub.year) && Number(s.age) === Number(sub.age)));
      return idx >= 0 ? idx : null;
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

    const selectStageDate = (stage, iso) => {
      stage.selectedDate = iso || '';
      stage.entry = (stage.days || []).find((d) => d.date === iso) || null;
    };

    const pickDateInStageDays = (days, preferredIso) => {
      if (!Array.isArray(days) || !days.length) return '';
      if (preferredIso && days.some((d) => d.date === preferredIso)) return preferredIso;
      return days[0].date;
    };

    const applyCycle = async (stage, stageKey, cycles, sub) => {
      if (!sub) return;
      const days = await daysFor(stageKey, sub.year, sub);
      stage.year = sub.year;
      stage.yearIndex = indexOfCycle(cycles, sub);
      stage.yearly = sub;
      stage.days = days;
      return days;
    };

    const loadStageFirst = async (stage, stageKey, cycles) => {
      const sub = (cycles || [])[0];
      if (!sub) return;
      stage.loading = true;
      try {
        const days = await applyCycle(stage, stageKey, cycles, sub);
        selectStageDate(stage, days?.[0]?.date || '');
      } catch (err) {
        console.error(err);
      } finally {
        stage.loading = false;
      }
    };

    const lookupStageDate = async (stage, stageKey, cycles, iso) => {
      if (!natal.consultation || !iso) return;
      const target = DateTime.fromISO(iso);
      if (!target.isValid) return;
      stage.loading = true;
      try {
        const birth = DateTime.fromJSDate(new Date(natal.birthDate));
        const preferred = cycleYearForDate(birth, target);
        const yearsToTry = [preferred, preferred - 1, preferred + 1];
        for (const y of yearsToTry) {
          const sub = findYearly(cycles, y);
          if (!sub) continue;
          const days = await daysFor(stageKey, sub.year, sub);
          const entry = days.find((d) => d.date === iso);
          if (entry) {
            stage.year = sub.year;
            stage.yearIndex = indexOfCycle(cycles, sub);
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
        stage.year = sub ? sub.year : '';
        stage.yearIndex = indexOfCycle(cycles, sub);
        stage.yearly = sub;
        stage.days = sub ? await daysFor(stageKey, sub.year, sub) : [];
        stage.selectedDate = iso;
        stage.entry = null;
      } catch (err) {
        console.error(err);
        error.value = err.message || 'Could not calculate daily cycles for this date.';
      } finally {
        stage.loading = false;
      }
    };

    const loadStageYear = async (stage, stageKey, cycles, yearIndex) => {
      const sub = (cycles || [])[Number(yearIndex)];
      if (!sub) return;
      stage.loading = true;
      try {
        const days = await applyCycle(stage, stageKey, cycles, sub);
        selectStageDate(stage, pickDateInStageDays(days, stage.selectedDate));
      } catch (err) {
        console.error(err);
      } finally {
        stage.loading = false;
      }
    };

    const onEarlyYearChange = (yearValue) =>
      loadStageYear(early, 'early', natal.preHeavenBirthSubCycles, yearValue);
    const onLaterYearChange = (yearValue) =>
      loadStageYear(later, 'later', natal.laterHeavenBirthSubCycles, yearValue);

    const onEarlyDayPicked = (iso) => {
      if (!iso) return;
      selectStageDate(early, iso);
    };
    const onLaterDayPicked = (iso) => {
      if (!iso) return;
      selectStageDate(later, iso);
    };

    const onEarlyDateInput = (event) => {
      const iso = event.target.value;
      if (iso) lookupStageDate(early, 'early', natal.preHeavenBirthSubCycles, iso);
    };
    const onLaterDateInput = (event) => {
      const iso = event.target.value;
      if (iso) lookupStageDate(later, 'later', natal.laterHeavenBirthSubCycles, iso);
    };

    const goEarlyToday = () =>
      lookupStageDate(early, 'early', natal.preHeavenBirthSubCycles, todayIso());
    const goLaterToday = () =>
      lookupStageDate(later, 'later', natal.laterHeavenBirthSubCycles, todayIso());

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
        natal.place = birthday.place || '';
        const natalConsult = await consultIchingNatal(birthday);
        natal.gender = natalConsult.gender;
        natal.birthDate = natalConsult.birthDate;
        natal.latitude = natalConsult.latitude;
        natal.longitude = natalConsult.longitude;
        natal.hemisphere = natalConsult.hemisphere;
        natal.consultation = natalConsult.consultation;
        natal.preHeavenBirthSubCycles = natalConsult.preHeavenBirthSubCycles;
        natal.laterHeavenBirthSubCycles = natalConsult.laterHeavenBirthSubCycles;
        if (parsedQueryDate?.isValid) {
          await lookupStageDate(early, 'early', natal.preHeavenBirthSubCycles, initialDate);
          if (!early.entry) await loadStageFirst(early, 'early', natal.preHeavenBirthSubCycles);
          await lookupStageDate(later, 'later', natal.laterHeavenBirthSubCycles, initialDate);
          if (!later.entry) await loadStageFirst(later, 'later', natal.laterHeavenBirthSubCycles);
        } else {
          await loadStageFirst(early, 'early', natal.preHeavenBirthSubCycles);
          await lookupStageDate(later, 'later', natal.laterHeavenBirthSubCycles, todayIso());
          if (!later.entry) await loadStageFirst(later, 'later', natal.laterHeavenBirthSubCycles);
        }
      } catch (err) {
        console.error(err);
        natal.consultation = null;
        natal.name = birthday.name || '';
        error.value = err.message || 'Could not calculate this birth.';
      } finally {
        consulting.value = false;
      }
    };

    return {
      birthdayList,
      consulting,
      error,
      natal,
      early,
      later,
      detail,
      genderLabel,
      birthLabel,
      earlyCaption,
      laterCaption,
      earlyMinDate,
      earlyMaxDate,
      laterMinDate,
      laterMaxDate,
      earlyNote,
      laterNote,
      earlyYearOptions,
      laterYearOptions,
      earlyRangeLabel,
      laterRangeLabel,
      earlyDayOptions,
      laterDayOptions,
      loadPerson,
      onEarlyYearChange,
      onLaterYearChange,
      onEarlyDayPicked,
      onLaterDayPicked,
      onEarlyDateInput,
      onLaterDateInput,
      goEarlyToday,
      goLaterToday,
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
  margin: 0 0 0.5rem;
}
.person-line {
  font-size: 0.95rem;
}
.stage-column {
  min-height: 0;
}
.stage-column :deep(.iching-hex-card) {
  height: auto;
  min-height: 0;
}
.date-bar {
  margin: 0;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
}
.date-input {
  max-width: 12.5rem;
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
  .date-input {
    max-width: none;
  }
}
</style>
