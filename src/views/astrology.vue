<template>
  <div class="astrology-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Astrology of the I Ching</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Astrology of the I Ching</li>
          </ol>
        </nav>
        <p class="mb-0 lead-blurb">
          Natal hexagrams after Sherrill &amp; Chu, <em>The Astrology of I Ching</em> —
          Pre-Heaven (the seed), Later-Heaven (how the life unfolds), and the sexagenary
          year, month, and day. This is not the coin-oracle I Ching, and not BaZi or Western astrology.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <BirthDetailsPanel v-model="showForms" :summary="birthSummary">
        <BirthdayPicker load-label="Load & consult" @load="loadBirthday" />
        <BirthDataForm id="iching" v-model="ichingBirthForm" class="text-start mt-3" />
      </BirthDetailsPanel>

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>

      <div class="d-flex flex-wrap gap-2 mb-4">
        <button type="button" class="btn btn-primary" :disabled="consulting" @click="consult">
          <span v-if="consulting" class="spinner-border spinner-border-sm me-2"></span>
          {{ consulting ? 'Consulting…' : 'Consult' }}
        </button>
        <button v-if="!state.editingBirthday" type="button" class="btn btn-success" @click="saveBirthday">
          Save birthday
        </button>
        <template v-else>
          <button type="button" class="btn btn-success" @click="updateBirthday">Update birthday</button>
          <button type="button" class="btn btn-secondary" @click="cancelEditing">Cancel</button>
        </template>
        <button
          type="button"
          class="btn btn-info"
          :disabled="!state.cycle"
          @click="exportIchingPdf"
        >
          Export PDF
        </button>
      </div>

      <div v-if="!state.cycle" class="empty-state card">
        <div class="card-body">
          <p class="mb-0">
            Enter a birth and consult to see the Pre-Heaven seed, Later-Heaven unfolding,
            heaven and earth trigrams, and the year / month / day cycles.
          </p>
        </div>
      </div>

      <div v-else ref="readingRoot" class="reading">
        <ReadingLead
          v-if="ichingLead"
          :headline="ichingLead.headline"
          :intro="ichingLead.intro"
          :points="ichingLead.points"
        />

        <p class="person-line text-muted mb-4">
          {{ state.name || 'Unnamed' }}
          · {{ genderLabel }}
          · {{ dateTimeFormatSimple(state.birthDate) }}
          · {{ state.hemisphere }} hemisphere
          <span v-if="state.cycle?.cycleName">
            · {{ state.cycle.cycleName }} ({{ state.cycle.startYear }}–{{ state.cycle.endYear }})
          </span>
        </p>

        <h2 class="section-title">Hexagrams of the birth</h2>
        <div class="row g-3 mb-4">
          <div class="col-12 col-lg-4">
            <IchingHexagramCard
              title="Pre-Heaven (seed)"
              :hexagram="state.preHeavenHexagram"
              :controlling-line="state.preHeavenHexagram?.controllingLine"
              show-age-bands
              @detail="openHexDetail"
            />
          </div>
          <div class="col-12 col-lg-4">
            <IchingHexagramCard
              title="Later-Heaven (unfolding)"
              :hexagram="state.laterHeavenHexagram"
              :controlling-line="state.laterHeavenHexagram?.controllingLine"
              show-age-bands
              @detail="openHexDetail"
            />
          </div>
          <div class="col-12 col-lg-4">
            <IchingHexagramCard
              title="Time of birth"
              :hexagram="state.timeOfBirthHexagram?.hexagram"
              @detail="openHexDetail"
            />
          </div>
        </div>

        <h2 class="section-title">Heaven and Earth</h2>
        <div class="row g-3 mb-4">
          <div class="col-12 col-md-6">
            <IchingTrigramTile
              title="Heavenly trigram"
              :trigram="state.heavenlyTrigram?.trigram"
              @detail="openTriDetail"
            />
          </div>
          <div class="col-12 col-md-6">
            <IchingTrigramTile
              title="Earthly trigram"
              :trigram="state.earthlyTrigram?.trigram"
              @detail="openTriDetail"
            />
          </div>
        </div>

        <h2 class="section-title">This year, month, and day</h2>
        <p class="text-muted small text-center">Open a chip for the stem, branch, and linked trigrams.</p>
        <div class="row g-3 mb-4">
          <div class="col-12 col-md-4">
            <IchingCycleChip
              period="Year"
              :period-label="String(formatBirthYear)"
              :cycle="state.sexagenaryCycle"
              @select="openStemSection('year')"
            />
          </div>
          <div class="col-12 col-md-4">
            <IchingCycleChip
              period="Month"
              :period-label="formatBirthMonth"
              :cycle="state.birthStemsandBranches"
              @select="openStemSection('month')"
            />
          </div>
          <div class="col-12 col-md-4">
            <IchingCycleChip
              period="Day"
              :period-label="formatBirthDay"
              :cycle="state.dailyStemsandBranches"
              @select="openStemSection('day')"
            />
          </div>
        </div>

        <h2 class="section-title">Life stages</h2>
        <p class="text-muted small">
          Early and later life have their own year lists. Later life continues after early life ends, so pick each column separately.
          For today or any other day without scrolling these lists, open
          <router-link to="/daily_reading">Daily Reading</router-link>.
        </p>

        <div class="stage-tabs d-lg-none" role="tablist">
          <button
            type="button"
            class="stage-tab"
            :class="{ active: lifeStageTab === 'early' }"
            role="tab"
            :aria-selected="lifeStageTab === 'early' ? 'true' : 'false'"
            @click="lifeStageTab = 'early'"
          >
            Early life
          </button>
          <button
            type="button"
            class="stage-tab"
            :class="{ active: lifeStageTab === 'later' }"
            role="tab"
            :aria-selected="lifeStageTab === 'later' ? 'true' : 'false'"
            @click="lifeStageTab = 'later'"
          >
            Later life
          </button>
        </div>

        <div class="row g-3 mb-4">
          <div
            class="col-12 col-lg-6"
            :class="{ 'd-none d-lg-block': lifeStageTab !== 'early' }"
          >
            <div class="stage-controls">
              <SheetSelect
                id="early-life-year"
                label="Early life (Pre-Heaven)"
                :options="earlyYearOptions"
                v-model="state.selectedPreHeavenYear"
              />
              <SheetSelect
                v-if="earlyDailyOptions.length"
                id="early-daily"
                label="Daily early life"
                :options="earlyDailyOptions"
                v-model="state.selectedPreHeavenDailyCycleDate"
              />
            </div>
            <p v-if="earlyDailyOptions.length" class="text-muted small">
              Daily figures for the selected year (about one every six days).
            </p>
            <IchingHexagramCard
              v-if="state.selectedPreHeavenBirthSubCycle?.hexagram"
              title="Early life (Pre-Heaven cycle)"
              :hexagram="state.selectedPreHeavenBirthSubCycle.hexagram"
              :controlling-line="state.selectedPreHeavenBirthSubCycle.controllingLine"
              :line-index-base="0"
              :note="earlyLifeNote"
              :fill-height="false"
              @detail="openHexDetail"
            />
            <p v-else class="text-muted">No early-life hexagram for this year.</p>
            <IchingHexagramCard
              v-if="state.preHeavenDailyCycleHexagram"
              class="mt-3"
              title="Daily early life"
              :hexagram="state.preHeavenDailyCycleHexagram"
              :fill-height="false"
              @detail="openHexDetail"
            />
          </div>
          <div
            class="col-12 col-lg-6"
            :class="{ 'd-none d-lg-block': lifeStageTab !== 'later' }"
          >
            <div class="stage-controls">
              <SheetSelect
                id="later-life-year"
                label="Later life (Later-Heaven)"
                :options="laterYearOptions"
                v-model="state.selectedLaterHeavenYear"
              />
              <SheetSelect
                v-if="laterDailyOptions.length"
                id="later-daily"
                label="Daily later life"
                :options="laterDailyOptions"
                v-model="state.selectedLaterHeavenDailyCycleDate"
              />
            </div>
            <p v-if="laterDailyOptions.length" class="text-muted small">
              Daily figures for the selected year (about one every six days).
            </p>
            <IchingHexagramCard
              v-if="state.laterHeavenBirthSubCycleHexagram"
              title="Later life (Later-Heaven cycle)"
              :hexagram="state.laterHeavenBirthSubCycleHexagram"
              :controlling-line="state.selectedLaterHeavenBirthSubCycle?.controllingLine"
              :line-index-base="0"
              :note="laterLifeNote"
              :fill-height="false"
              @detail="openHexDetail"
            />
            <p v-else class="text-muted">No later-life hexagram for this year.</p>
            <IchingHexagramCard
              v-if="state.laterHeavenDailyCycleHexagram"
              class="mt-3"
              title="Daily later life"
              :hexagram="state.laterHeavenDailyCycleHexagram"
              :fill-height="false"
              @detail="openHexDetail"
            />
          </div>
        </div>

        <h2 id="stem-branch" class="section-title">Stem and branch</h2>
        <div class="stem-accordion mb-4">
          <div v-for="section in stemSections" :key="section.key" class="stem-block">
            <button
              type="button"
              class="stem-toggle"
              :aria-expanded="openStem === section.key ? 'true' : 'false'"
              @click="toggleStemSection(section.key)"
            >
              <span>{{ section.title }}</span>
              <span class="toggle-hint">{{ openStem === section.key ? 'Hide' : 'Show' }}</span>
            </button>
            <div v-show="openStem === section.key && section.cycle" class="stem-body">
              <div class="row g-3">
                <div class="col-12 col-md-6 stem-col">
                  <h3 class="h6">Celestial stem</h3>
                  <p class="stem-name mb-1">{{ section.cycle.celestialStem?.name }}</p>
                  <p v-if="section.cycle.celestialStem?.symbol" class="stem-symbol mb-2">
                    {{ section.cycle.celestialStem.symbol }}
                  </p>
                  <p class="mb-2 text-muted">
                    {{ section.cycle.celestialStem?.element?.name }}
                    <span v-if="section.cycle.celestialStem?.element?.bodyPart">
                      · {{ section.cycle.celestialStem.element.bodyPart }}
                    </span>
                  </p>
                  <template v-if="section.cycle.celestialStem?.trigram">
                    <p class="stem-glyph mb-1">{{ section.cycle.celestialStem.trigram.trigram }}</p>
                    <p class="mb-2">
                      {{ section.cycle.celestialStem.trigram.name }}
                      <span v-if="section.cycle.celestialStem.trigram.description?.translation">
                        · {{ firstPhrase(section.cycle.celestialStem.trigram.description.translation) }}
                      </span>
                    </p>
                    <button
                      v-if="section.cycle.celestialStem.trigram.binary"
                      type="button"
                      class="btn btn-outline-primary btn-sm"
                      @click="openTriDetail(section.cycle.celestialStem.trigram.binary)"
                    >
                      Stem trigram
                    </button>
                  </template>
                </div>
                <div class="col-12 col-md-6 stem-col">
                  <h3 class="h6">Horary branch</h3>
                  <p class="stem-name mb-1">{{ section.cycle.horaryBranch?.name }}</p>
                  <p class="stem-symbol mb-2">
                    <span v-if="section.cycle.horaryBranch?.symbol">{{ section.cycle.horaryBranch.symbol }}</span>
                    <span v-if="section.cycle.horaryBranch?.animal">
                      {{ section.cycle.horaryBranch.symbol ? ' · ' : '' }}{{ section.cycle.horaryBranch.animal }}
                    </span>
                  </p>
                  <p class="mb-2 text-muted">
                    {{ section.cycle.horaryBranch?.element?.name }}
                    <span v-if="section.cycle.horaryBranch?.element?.bodyPart">
                      · {{ section.cycle.horaryBranch.element.bodyPart }}
                    </span>
                  </p>
                  <div
                    v-for="(tri, i) in branchTrigrams(section.cycle)"
                    :key="section.key + '-br-' + i"
                    class="mb-3"
                  >
                    <p class="stem-glyph mb-1">{{ tri.trigram }}</p>
                    <p class="mb-2">
                      {{ tri.name }}
                      <span v-if="tri.description?.translation"> · {{ firstPhrase(tri.description.translation) }}</span>
                    </p>
                    <button
                      v-if="tri.binary"
                      type="button"
                      class="btn btn-outline-primary btn-sm"
                      @click="openTriDetail(tri.binary)"
                    >
                      Branch trigram
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section class="how-to card">
          <div class="card-body">
            <h2 class="h5">How to read this</h2>
            <p>
              W. K. Chu and W. A. Sherrill’s <em>The Astrology of I Ching</em> (1976) maps a birth onto the Ho Map:
              a Pre-Heaven hexagram as the inner seed, then a Later-Heaven hexagram by changing the controlling line —
              the line that “owns” the chart.
            </p>
            <p>
              Heaven and Earth are the two trigrams stacked in those hexagrams. The sexagenary cycle (ten stems and
              twelve branches, sixty pairs) colours the year, month, and day; the animal is a flavour of that pair,
              not a personality test on its own.
            </p>
            <p class="mb-0">
              Life-stage hexagrams walk the lines of Pre-Heaven (early) and Later-Heaven (later) year by year.
              This page is a natal reading, not a coin-cast oracle and not a forecast of events.
            </p>
          </div>
        </section>
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
import { reactive, computed, onMounted, watch, ref, nextTick } from 'vue';
import _ from 'lodash';
import astro from '@/const/astrology';
import { consultIchingNatal } from '@/utils/ichingNatal';
import { DateTime } from 'luxon';
import { useBirthdayStore } from '@/stores/birthday';
import { useRoute } from 'vue-router';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import BirthDataForm from '@/components/BirthDataForm.vue';
import BirthDetailsPanel from '@/components/BirthDetailsPanel.vue';
import { summarizeBirth } from '@/utils/birthSummary';
import ReadingLead from '@/components/ReadingLead.vue';
import IchingHexagramCard from '@/components/IchingHexagramCard.vue';
import IchingCycleChip from '@/components/IchingCycleChip.vue';
import IchingTrigramTile from '@/components/IchingTrigramTile.vue';
import IchingDetailModal from '@/components/IchingDetailModal.vue';
import SheetSelect from '@/components/SheetSelect.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { downloadIchingPdf } from '@/utils/ichingPdf';

export default {
  name: 'Astrology',
  components: {
    BirthdayPicker,
    BirthDataForm,
    BirthDetailsPanel,
    ReadingLead,
    IchingHexagramCard,
    IchingCycleChip,
    IchingTrigramTile,
    IchingDetailModal,
    SheetSelect,
  },
  setup() {
    usePageTitle('I-Ching Astrology');
    const birthdayStore = useBirthdayStore();
    const birthdayList = computed(() => birthdayStore.getBirthdayList);
    const showForms = ref(true);
    const consulting = ref(false);
    const error = ref('');
    const readingRoot = ref(null);
    const openStem = ref('');
    const lifeStageTab = ref('early');
    const detail = reactive({ show: false, kind: 'hexagram', binary: '' });
    const route = useRoute();

    const state = reactive({
      id: Date.now(),
      hemisphere: 'Northern',
      cycle: null,
      sexagenaryCycle: null,
      monthlyStemsandBranches: null,
      dailyStemsandBranches: null,
      birthStemsandBranches: null,
      name: 'John Doe',
      gender: 'MALE',
      place: '',
      preHeavenHexagram: '',
      preHeavenBirthSubCycles: [],
      selectedPreHeavenBirthSubCycle: null,
      preHeavenDailyCycle: [],
      preHeavenDailyCycleHexagram: '',
      selectedPreHeavenDailyCycleDate: '',
      selectedPreHeavenYear: '',
      selectedLaterHeavenYear: '',
      laterHeavenHexagram: '',
      laterHeavenBirthSubCycleHexagram: '',
      laterHeavenBirthSubCycles: [],
      selectedLaterHeavenBirthSubCycle: null,
      laterHeavenDailyCycle: [],
      laterHeavenDailyCycleHexagram: '',
      selectedLaterHeavenDailyCycleDate: '',
      heavenlyTrigram: '',
      earthlyTrigram: '',
      timeOfBirthHexagram: '',
      latitude: 26.39655582357474,
      longitude: 27.37679999686307,
      timezoneOffset: -new Date().getTimezoneOffset(),
      birthDate: DateTime.fromObject({ year: 1970, month: 1, day: 17, hour: 15, minute: 50 }).toJSDate(),
      minDate: DateTime.fromObject({ year: 1, month: 1, day: 1 }).toJSDate(),
      maxDate: DateTime.fromObject({ year: 275760, month: 9, day: 13 }).toJSDate(),
      editingBirthday: null,
    });

    const form = {
      consultation: null,
    };

    const ichingBirthForm = computed({
      get() {
        const d = DateTime.fromJSDate(state.birthDate);
        return {
          name: state.name,
          date: state.birthDate,
          time: d.isValid ? d.toFormat('HH:mm') : '12:00',
          gender: state.gender,
          latitude: state.latitude,
          longitude: state.longitude,
          place: state.place || '',
          timezoneOffset: typeof state.timezoneOffset === 'number' ? state.timezoneOffset : -new Date().getTimezoneOffset(),
        };
      },
      set(v) {
        if (!v || typeof v !== 'object') return;
        if (v.name !== undefined) state.name = v.name;
        if (v.gender !== undefined) state.gender = v.gender === 'FEMALE' ? 'FEMALE' : 'MALE';
        if (v.latitude !== undefined) state.latitude = v.latitude;
        if (v.longitude !== undefined) state.longitude = v.longitude;
        if (v.place !== undefined) state.place = v.place;
        if (v.timezoneOffset !== undefined) state.timezoneOffset = v.timezoneOffset;
        const daySource = v.date !== undefined ? v.date : state.birthDate;
        const timeSource = v.time !== undefined ? v.time : DateTime.fromJSDate(state.birthDate).toFormat('HH:mm');
        const day = daySource instanceof Date ? DateTime.fromJSDate(daySource) : DateTime.fromISO(String(daySource));
        const [hour, minute] = String(timeSource || '12:00').split(':').map(Number);
        if (day.isValid) {
          state.birthDate = DateTime.fromObject({
            year: day.year,
            month: day.month,
            day: day.day,
            hour,
            minute,
          }).toJSDate();
        }
      },
    });

    const birthSummary = computed(() => summarizeBirth(ichingBirthForm.value));

    const genderLabel = computed(() => {
      if (state.gender === 'FEMALE') return 'Female';
      if (state.gender === 'MALE') return 'Male';
      return state.gender || '';
    });

    const dateTimeFormatSimple = (date) => {
      if (date) {
        return DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd HH:mm');
      }
      return null;
    };

    const formatBirthYear = computed(() => DateTime.fromJSDate(new Date(state.birthDate)).year);
    const formatBirthMonth = computed(() => new Date(state.birthDate).toLocaleString('default', { month: 'long' }));
    const formatBirthDay = computed(() => {
      const date = new Date(state.birthDate);
      return DateTime.fromJSDate(date).toFormat('cccc d') + getOrdinalSuffix(date.getDate());
    });

    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    const firstPhrase = (text) => {
      if (!text) return '';
      return String(text).split(',')[0].trim();
    };

    const earlyYearOptions = computed(() =>
      (state.preHeavenBirthSubCycles || []).map((sub) => ({
        value: sub.year,
        label: `${sub.year} — age ${sub.age}`,
      }))
    );
    const laterYearOptions = computed(() =>
      (state.laterHeavenBirthSubCycles || []).map((sub) => ({
        value: sub.year,
        label: `${sub.year} — age ${sub.age}`,
      }))
    );
    const earlyDailyOptions = computed(() =>
      (state.preHeavenDailyCycle || []).map((sub) => ({
        value: sub.date,
        label: sub.date,
      }))
    );
    const laterDailyOptions = computed(() =>
      (state.laterHeavenDailyCycle || []).map((sub) => ({
        value: sub.date,
        label: sub.date,
      }))
    );

    const earlyLifeNote = computed(() => {
      const sub = state.selectedPreHeavenBirthSubCycle;
      if (!sub) return '';
      return `Age ${sub.age}${sub.year ? ` · ${sub.year}` : ''}. Before transformation of this year’s line.`;
    });

    const laterLifeNote = computed(() => {
      const sub = state.selectedLaterHeavenBirthSubCycle;
      if (!sub) return '';
      return `Age ${sub.age}${sub.year ? ` · ${sub.year}` : ''}. Before transformation of this year’s line.`;
    });

    const stemSections = computed(() => [
      { key: 'year', title: `Yearly stem and branch · ${formatBirthYear.value}`, cycle: state.sexagenaryCycle },
      { key: 'month', title: `Monthly stem and branch · ${formatBirthMonth.value}`, cycle: state.birthStemsandBranches },
      { key: 'day', title: `Daily stem and branch · ${formatBirthDay.value}`, cycle: state.dailyStemsandBranches },
    ]);

    const branchTrigrams = (cycle) => {
      const list = cycle?.horaryBranch?.element?.trigrams;
      return Array.isArray(list) ? list.filter(Boolean) : [];
    };

    const yearForAge = (cycles, age) => {
      const list = cycles || [];
      const match = list.find((s) => s.age === age);
      return match ? match.year : (list[0]?.year || '');
    };

    const pickDaily = (days) => {
      if (!Array.isArray(days) || !days.length) {
        return { list: [], date: '', hexagram: '' };
      }
      const today = DateTime.now().toISODate();
      const match = days.find((d) => d.date === today) || days[0];
      return { list: days, date: match.date, hexagram: match.hexagram };
    };

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

    const openStemSection = (key) => {
      openStem.value = key;
      nextTick(() => {
        document.getElementById('stem-branch')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };

    const toggleStemSection = (key) => {
      openStem.value = openStem.value === key ? '' : key;
    };

    const getHemisphere = (latitude) => (latitude >= 0 ? 'Northern' : 'Southern');

    const validateState = async () => {
      const errors = [];
      if (!state.name || state.name.trim() === '') {
        errors.push('Name is required.');
      }
      if (!DateTime.fromJSDate(state.birthDate).isValid) {
        errors.push('Birth date must be a valid date.');
      }
      if (!['MALE', 'FEMALE'].includes(state.gender)) {
        errors.push('Gender must be either "MALE" or "FEMALE".');
      }
      if (typeof state.latitude !== 'number' || isNaN(state.latitude) || state.latitude < -90 || state.latitude > 90) {
        errors.push('Latitude must be a number (including decimals) between -90 and 90.');
      }
      if (typeof state.longitude !== 'number' || isNaN(state.longitude) || state.longitude < -180 || state.longitude > 180) {
        errors.push('Longitude must be a number (including decimals) between -180 and 180.');
      }
      return errors;
    };

    const saveBirthday = () => {
      try {
        const errors = validateState();
        if (errors.length > 0) {
          throw new Error(errors.join(' '));
        }
        const birthdayData = {
          id: Date.now(),
          name: state.name,
          birthday: DateTime.fromJSDate(state.birthDate).toISO(),
          gender: state.gender,
          coords: { latitude: state.latitude, longitude: state.longitude },
          place: state.place || '',
          timezoneOffset: state.timezoneOffset,
        };
        const result = birthdayStore.addBirthday(birthdayData);
        if (result.duplicate) {
          const confirmMessage = `A birthday with the name "${birthdayData.name}" already exists.\n\n`
            + `Existing: ${result.existingBirthday.name} - ${DateTime.fromISO(result.existingBirthday.birthday).toFormat('yyyy-MM-dd HH:mm')}\n`
            + `New: ${birthdayData.name} - ${DateTime.fromISO(birthdayData.birthday).toFormat('yyyy-MM-dd HH:mm')}\n\n`
            + `Do you want to replace the existing birthday with the new one?`;
          if (confirm(confirmMessage)) {
            const updateResult = birthdayStore.addBirthday(birthdayData, true);
            if (updateResult.success) {
              alert('Birthday updated successfully!');
            }
          }
        } else if (result.success) {
          alert('Birthday saved successfully!');
        }
      } catch (err) {
        console.error('Error saving birthday:', err);
        alert(`Failed to save birthday: ${err.message}`);
      }
    };

    const loadBirthday = async (birthday) => {
      state.name = birthday.name;
      state.birthDate = DateTime.fromISO(birthday.birthday).toJSDate();
      state.gender = birthday.gender;
      state.latitude = birthday.coords.latitude;
      state.longitude = birthday.coords.longitude;
      state.place = birthday.place || '';
      state.timezoneOffset = typeof birthday.timezoneOffset === 'number' ? birthday.timezoneOffset : -new Date().getTimezoneOffset();
      birthdayStore.selectBirthday(birthday.id);
      consulting.value = true;
      error.value = '';
      state.selectedLaterHeavenYear = '';
      state.selectedPreHeavenYear = '';
      state.selectedPreHeavenDailyCycleDate = '';
      state.selectedLaterHeavenDailyCycleDate = '';
      try {
        const natalConsult = await consultIchingNatal(birthday);
        state.hemisphere = natalConsult.hemisphere;
        form.consultation = natalConsult.consultation;
        const result = natalConsult.result;
        state.cycle = result.sexagenaryCycle;
        state.sexagenaryCycle = result.yearly.yearlyCycle.cycle;
        state.dailyStemsandBranches = result.daily.dailyCycle;
        state.monthlyStemsandBranches = result.monthly.monthlyStemBranch;
        state.birthStemsandBranches = result.monthly.monthlyStemBranch;
        state.preHeavenHexagram = result.iching.preHeavenHexagram;
        state.heavenlyTrigram = result.iching.heavenlyTrigram;
        state.earthlyTrigram = result.iching.earthlyTrigram;
        state.timeOfBirthHexagram = result.iching.timeOfBirthSymbol;
        state.laterHeavenHexagram = result.iching.laterHeavenHexagram;
        state.preHeavenBirthSubCycles = natalConsult.preHeavenBirthSubCycles;
        state.laterHeavenBirthSubCycles = natalConsult.laterHeavenBirthSubCycles;
        showForms.value = false;
        const birthDate = DateTime.fromJSDate(new Date(state.birthDate));
        const age = Math.floor(DateTime.now().diff(birthDate, 'years').years);
        state.selectedPreHeavenYear = yearForAge(state.preHeavenBirthSubCycles, age);
        state.selectedLaterHeavenYear = yearForAge(state.laterHeavenBirthSubCycles, age);
        const lastEarlyAge = Math.max(0, ...state.preHeavenBirthSubCycles.map((sub) => Number(sub.age) || 0));
        lifeStageTab.value = age > lastEarlyAge ? 'later' : 'early';
        await nextTick();
        readingRoot.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (err) {
        console.error(err);
        error.value = err.message || 'Could not calculate this birth.';
      } finally {
        consulting.value = false;
      }
    };

    const startEditingBirthday = (birthday) => {
      state.editingBirthday = birthday;
      state.name = birthday.name;
      state.birthDate = birthday.birthday;
      state.gender = birthday.gender;
      state.latitude = birthday.coords.latitude;
      state.longitude = birthday.coords.longitude;
      state.place = birthday.place || '';
    };

    const updateBirthday = () => {
      try {
        const updatedBirthday = {
          id: state.editingBirthday.id,
          name: state.name,
          birthday: DateTime.fromJSDate(state.birthDate).toISO(),
          gender: state.gender,
          coords: { latitude: state.latitude, longitude: state.longitude },
          place: state.place || '',
          timezoneOffset: state.timezoneOffset,
        };
        birthdayStore.updateBirthday(updatedBirthday);
        alert('Birthday updated successfully!');
        cancelEditing();
      } catch (err) {
        console.error('Error updating birthday:', err);
        alert(`Failed to update birthday: ${err.message}`);
      }
    };

    const cancelEditing = () => {
      state.editingBirthday = null;
    };

    const exportIchingPdf = async () => {
      try {
        await downloadIchingPdf({ state, lead: ichingLead.value });
      } catch (err) {
        console.error(err);
        alert(err.message || 'Failed to generate PDF.');
      }
    };

    const consult = async () => {
      consulting.value = true;
      error.value = '';
      try {
        const hemisphere = getHemisphere(state.latitude);
        state.hemisphere = hemisphere;
        state.selectedLaterHeavenYear = '';
        state.selectedPreHeavenYear = '';
        state.selectedPreHeavenDailyCycleDate = '';
        state.selectedLaterHeavenDailyCycleDate = '';
        state.preHeavenBirthSubCycleHexagram = '';
        state.laterHeavenBirthSubCycleHexagram = '';
        state.preHeavenBirthSubCycles = [];
        state.laterHeavenBirthSubCycles = [];
        state.preHeavenDailyCycle = [];
        state.laterHeavenDailyCycle = [];
        state.selectedPreHeavenBirthSubCycle = null;
        state.selectedLaterHeavenBirthSubCycle = null;

        const astrology = hemisphere === 'Northern' ? new astro.IChingAstrology_North() : new astro.IChingAstrology_South();
        form.consultation = new astro.IChingConsultation(astrology);

        const gender = state.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
        const result = await form.consultation.consultOracle(state.birthDate, gender, state.latitude, state.longitude);

        state.cycle = result.sexagenaryCycle;
        state.sexagenaryCycle = result.yearly.yearlyCycle.cycle;
        state.dailyStemsandBranches = result.daily.dailyCycle;
        state.monthlyStemsandBranches = result.monthly.monthlyStemBranch;
        state.birthStemsandBranches = result.monthly.monthlyStemBranch;
        state.preHeavenHexagram = result.iching.preHeavenHexagram;
        state.heavenlyTrigram = result.iching.heavenlyTrigram;
        state.earthlyTrigram = result.iching.earthlyTrigram;
        state.timeOfBirthHexagram = result.iching.timeOfBirthSymbol;
        state.laterHeavenHexagram = result.iching.laterHeavenHexagram;
        state.preHeavenBirthSubCycles = result.iching.preHeavenBirthSubCycles || [];
        state.laterHeavenBirthSubCycles = result.iching.laterHeavenBirthSubCycles || [];
        showForms.value = false;

        const birthDate = DateTime.fromJSDate(new Date(state.birthDate));
        const currentDate = DateTime.now();
        const age = Math.floor(currentDate.diff(birthDate, 'years').years);
        state.selectedPreHeavenYear = yearForAge(state.preHeavenBirthSubCycles, age);
        state.selectedLaterHeavenYear = yearForAge(state.laterHeavenBirthSubCycles, age);
        const lastEarlyAge = Math.max(0, ...state.preHeavenBirthSubCycles.map((sub) => Number(sub.age) || 0));
        lifeStageTab.value = age > lastEarlyAge ? 'later' : 'early';

        await nextTick();
        readingRoot.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (err) {
        console.error(err);
        state.cycle = null;
        error.value = err.message || 'Could not calculate this birth.';
      } finally {
        consulting.value = false;
      }
    };

    watch(() => state.selectedPreHeavenDailyCycleDate, (newDate) => {
      const selectedSubCycle = (state.preHeavenDailyCycle || []).find((subCycle) => subCycle.date === newDate);
      if (selectedSubCycle) {
        state.preHeavenDailyCycleHexagram = selectedSubCycle.hexagram;
      }
    });

    watch(() => state.selectedLaterHeavenDailyCycleDate, (newDate) => {
      const selectedSubCycle = (state.laterHeavenDailyCycle || []).find((subCycle) => subCycle.date === newDate);
      if (selectedSubCycle) {
        state.laterHeavenDailyCycleHexagram = selectedSubCycle.hexagram;
      }
    });

    watch(() => state.selectedPreHeavenYear, async (newYear) => {
      const selectedSubCycle = state.preHeavenBirthSubCycles.find((subCycle) => subCycle.year === newYear);
      if (selectedSubCycle) {
        state.preHeavenBirthSubCycleHexagram = _.cloneDeep(selectedSubCycle.hexagram);
        state.selectedPreHeavenBirthSubCycle = _.cloneDeep(selectedSubCycle);
        if (form.consultation?.calculateDailyCycles) {
          try {
            const days = await form.consultation.calculateDailyCycles(
              selectedSubCycle.hexagram,
              selectedSubCycle.controllingLine,
              state.birthDate,
              state.latitude,
              newYear,
            );
            const picked = pickDaily(days);
            state.preHeavenDailyCycle = picked.list;
            state.selectedPreHeavenDailyCycleDate = picked.date;
            state.preHeavenDailyCycleHexagram = picked.hexagram;
          } catch (err) {
            console.error(err);
            state.preHeavenDailyCycle = [];
            state.selectedPreHeavenDailyCycleDate = '';
            state.preHeavenDailyCycleHexagram = '';
          }
        }
      }
    });

    watch(() => state.selectedLaterHeavenYear, async (newYear) => {
      const selectedSubCycle = state.laterHeavenBirthSubCycles.find((subCycle) => subCycle.year === newYear);
      if (selectedSubCycle) {
        state.selectedLaterHeavenBirthSubCycle = _.cloneDeep(selectedSubCycle);
        state.laterHeavenBirthSubCycleHexagram = _.cloneDeep(selectedSubCycle.hexagram);
        if (form.consultation?.calculateDailyCycles) {
          try {
            const days = await form.consultation.calculateDailyCycles(
              selectedSubCycle.hexagram,
              selectedSubCycle.controllingLine,
              state.birthDate,
              state.latitude,
              newYear,
            );
            const picked = pickDaily(days);
            state.laterHeavenDailyCycle = picked.list;
            state.selectedLaterHeavenDailyCycleDate = picked.date;
            state.laterHeavenDailyCycleHexagram = picked.hexagram;
          } catch (err) {
            console.error(err);
            state.laterHeavenDailyCycle = [];
            state.selectedLaterHeavenDailyCycleDate = '';
            state.laterHeavenDailyCycleHexagram = '';
          }
        }
      }
    });

    const ichingLead = computed(() => {
      if (!state.cycle || !state.preHeavenHexagram) return null;
      const pre = state.preHeavenHexagram;
      const later = state.laterHeavenHexagram;
      const animal = state.sexagenaryCycle?.horaryBranch?.animal;
      const stem = state.sexagenaryCycle?.celestialStem?.name;
      const heaven = state.heavenlyTrigram?.trigram?.name;
      const earth = state.earthlyTrigram?.trigram?.name;
      const timeHex = state.timeOfBirthHexagram?.hexagram?.name;
      const points = [
        {
          label: 'The seed you were born with',
          text: `Your Pre-Heaven hexagram is ${pre.name}${pre.symbol ? ` (${pre.symbol})` : ''}. In everyday language: ${firstPhrase(pre.translation) || 'the inner pattern of the life'}. This is more like temperament than a daily forecast.`,
        },
        {
          label: 'How the life tends to unfold',
          text: later
            ? `Your Later-Heaven hexagram is ${later.name}. ${firstPhrase(later.translation) || 'This describes the weather of a lifetime, not a single event.'}`
            : 'Later-Heaven hexagram is still calculating.',
        },
      ];
      if (animal) {
        points.push({
          label: 'Your year in the 60-year cycle',
          text: `You were born in a ${stem || ''} ${animal} year. Treat the animal as a flavour of the whole life — not a personality test by itself.`,
        });
      }
      if (heaven && earth) {
        points.push({
          label: 'Sky and ground',
          text: `Heavenly trigram ${heaven} and earthly trigram ${earth} are the two halves stacked into those hexagrams: one is the upper weather, one is the lower soil.`,
        });
      }
      if (timeHex) {
        points.push({
          label: 'The hour you arrived',
          text: `The time-of-birth hexagram is ${timeHex}. It colours the “when” of the birth, not the whole story.`,
        });
      }
      if (state.selectedPreHeavenBirthSubCycle?.hexagram?.name) {
        points.push({
          label: 'The chapter you are in',
          text: `Early-life cycle now points at ${state.selectedPreHeavenBirthSubCycle.hexagram.name} (about age ${state.selectedPreHeavenBirthSubCycle.age}). Later-life cycle: ${state.laterHeavenBirthSubCycleHexagram?.name || 'choose an age in Life stages'}.`,
        });
      }
      return {
        headline: `${pre.name} inside, ${later?.name || 'life unfolding'} in the world.`,
        intro: 'I-Ching astrology does not use planets. It reads hexagrams of the birth — a seed pattern, a lifetime weather, and the year/month/day cycles around them.',
        points,
      };
    });

    onMounted(() => {
      const loadId = route.query.load;
      if (loadId) {
        const found = birthdayStore.getBirthdayById(loadId);
        if (found) {
          loadBirthday(found);
        }
      }
    });

    return {
      state,
      ichingBirthForm,
      ichingLead,
      exportIchingPdf,
      birthdayList,
      birthdayStore,
      showForms,
      birthSummary,
      consulting,
      error,
      readingRoot,
      openStem,
      lifeStageTab,
      earlyYearOptions,
      laterYearOptions,
      earlyDailyOptions,
      laterDailyOptions,
      detail,
      earlyLifeNote,
      laterLifeNote,
      stemSections,
      genderLabel,
      dateTimeFormatSimple,
      formatBirthYear,
      formatBirthMonth,
      formatBirthDay,
      firstPhrase,
      branchTrigrams,
      openStemSection,
      toggleStemSection,
      openHexDetail,
      openTriDetail,
      consult,
      saveBirthday,
      loadBirthday,
      startEditingBirthday,
      updateBirthday,
      cancelEditing,
    };
  },
};
</script>

<style scoped>
.astrology-page :deep(.card) {
  overflow: visible;
}
.astrology-page :deep(select.form-select) {
  max-width: 100%;
  min-width: 0;
}
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
.stem-accordion {
  border: 1px solid #e6d5a8;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}
.stem-block + .stem-block {
  border-top: 1px solid #e6d5a8;
}
.stem-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border: 0;
  background: #fff8e8;
  text-align: left;
  padding: 0.85rem 1.1rem;
  font-weight: 600;
}
.stem-toggle:hover {
  background: #fff3d6;
}
.toggle-hint {
  flex-shrink: 0;
  font-size: 0.85rem;
  color: #5b4cdb;
}
.stem-body {
  padding: 1.15rem 1.1rem 1.35rem;
  font-size: 1.25em;
}
.stem-col {
  text-align: center;
}
.stem-name {
  font-size: 1.35rem;
  font-weight: 700;
  color: #3d2e10;
  margin-bottom: 0.15rem;
}
.stem-symbol {
  font-size: 1.85rem;
  line-height: 1.2;
  color: #3d2e10;
}
.stem-glyph {
  font-size: 2.6rem;
  line-height: 1;
  color: #3d2e10;
}
.how-to {
  margin: 0;
  background: #f7f5ef;
  border-color: #ddd4c2;
}
.stage-tabs {
  display: flex;
  gap: 0.4rem;
  margin: 0 0 1rem;
  position: sticky;
  top: 56px;
  z-index: 20;
  background: #e6f0fa;
  padding: 0.4rem 0;
}
.stage-tab {
  flex: 1 1 0;
  min-height: 44px;
  border: 1px solid #c9b06a;
  background: #fff;
  border-radius: 0.5rem;
  font-weight: 600;
}
.stage-tab.active {
  background: #3d2e10;
  color: #fff;
  border-color: #3d2e10;
}
.stage-controls {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.stage-controls + p {
  margin-bottom: 0.75rem;
}
@media (max-width: 767.98px) {
  .stage-controls {
    position: sticky;
    top: 108px;
    z-index: 19;
    background: #e6f0fa;
    padding: 0.35rem 0 0.6rem;
  }
}
@media (max-width: 767.98px) {
  .display-4 {
    font-size: 1.75rem;
  }
  .astrology-page :deep(.card) {
    margin-left: 0;
    margin-right: 0;
  }
  .astrology-page :deep(select.form-select) {
    min-height: 44px;
  }
}
</style>
