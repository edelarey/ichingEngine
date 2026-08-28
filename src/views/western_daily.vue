<template>
  <div class="western-daily-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Western Daily</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item"><router-link to="/western_astrology">Western Astrology</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">Western Daily</li>
          </ol>
        </nav>
        <p class="mb-0 lead-blurb">
          Natal chart plus transits for a chosen day. The Moon leads the day; Saturn and Jupiter
          frame the month. This is not a Sun-sign horoscope.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <BirthdayPicker auto-load default-first load-label="Load" @load="loadPerson" />

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>

      <div v-if="!birthdayList.length" class="empty-state card">
        <div class="card-body">
          <p class="mb-0">
            Save a birthday first, then this page can read transits against that natal chart.
            <router-link to="/birthdays">Add someone</router-link>.
          </p>
        </div>
      </div>

      <div v-else-if="loading" class="empty-state card">
        <div class="card-body">
          <p class="mb-0">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Calculating the natal chart and transits…
          </p>
        </div>
      </div>

      <div v-else-if="person.name && daily" class="reading">
        <div class="person-bar mb-4">
          <p class="person-line text-muted mb-2">
            {{ person.name }}
            · born {{ birthLabel }}
            <span v-if="person.place"> · {{ person.place }}</span>
            <span v-if="natalBrief"> · {{ natalBrief }}</span>
          </p>
          <router-link
            v-if="person.id"
            class="btn btn-outline-secondary btn-sm"
            :to="`/western_astrology?load=${person.id}`"
          >
            Full natal chart
          </router-link>
        </div>

        <div class="date-bar card mb-4">
          <div class="card-body">
            <div class="row g-3 align-items-end">
              <div class="col-12 col-sm-auto">
                <label class="form-label" for="western-daily-date">Day</label>
                <input
                  id="western-daily-date"
                  type="date"
                  class="form-control date-input"
                  :value="selectedDate"
                  @change="onDateInput"
                />
              </div>
              <div class="col-12 col-sm-auto">
                <label class="form-label" for="western-daily-time">Time</label>
                <input
                  id="western-daily-time"
                  type="time"
                  class="form-control date-input"
                  :value="selectedTime"
                  @change="onTimeInput"
                />
              </div>
              <div class="col-12 col-sm-auto">
                <button type="button" class="btn btn-primary" @click="goToday">Now</button>
              </div>
            </div>
            <p v-if="caption" class="mb-0 mt-2 date-caption">{{ caption }}</p>
          </div>
        </div>

        <ReadingLead
          :headline="daily.lead.headline"
          :intro="daily.lead.intro"
          :points="daily.lead.points"
        />

        <h2 class="section-title">This month</h2>
        <p class="text-muted small">
          Saturn and Jupiter barely move day to day; they are the month’s frame. The transiting Sun
          names the solar month.
        </p>
        <div class="row g-3 mb-4">
          <div
            v-for="body in monthCards"
            :key="body.key"
            class="col-12 col-md-4"
          >
            <div class="card h-100 month-card" :style="{ borderTopColor: body.color }">
              <div class="card-body">
                <p class="eyebrow mb-1">{{ body.name }} {{ body.symbol }}</p>
                <h3 class="h5">{{ body.degreeLabel }} {{ body.sign }}</h3>
                <p class="mb-1">{{ body.houseName }}</p>
                <p class="mb-0 small text-muted">{{ body.text }}</p>
              </div>
            </div>
          </div>
        </div>

        <h2 class="section-title">Today’s Moon</h2>
        <div class="card mb-4 moon-card">
          <div class="card-body">
            <p class="eyebrow mb-1">Moon {{ daily.moon.symbol }}</p>
            <h3 class="h5">
              {{ daily.moon.degreeLabel }} {{ daily.moon.sign }}
              · {{ daily.moon.houseName }}
            </h3>
            <p class="mb-3">{{ daily.moon.housePlain }}</p>
            <p class="small text-muted mb-2">Nearest lunar contacts (tightest first). In force means inside the 1.5° daily orb.</p>
            <div v-if="daily.moonNearest.length" class="table-responsive">
              <table class="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>Contact</th>
                    <th>Aspect</th>
                    <th>Orb</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(hit, i) in daily.moonNearest" :key="i" :class="{ 'in-force': hit.inForce }">
                    <td>Moon → natal {{ hit.natal }}</td>
                    <td>{{ hit.symbol }} {{ hit.aspect }}</td>
                    <td>{{ hit.orb.toFixed(2) }}°</td>
                    <td class="small">
                      {{ hit.inForce ? 'In force' : 'Wide' }}
                      · {{ hit.applying ? 'applying' : 'separating' }}
                      · {{ hit.natalHouseName }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2 class="section-title">Sky that day</h2>
        <p class="text-muted small">Transiting planets in tropical signs, placed in this natal house system.</p>
        <div class="card mb-4">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>Planet</th>
                    <th>Sign</th>
                    <th>Degree</th>
                    <th>Natal house</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in daily.transiting" :key="p.key">
                    <td>{{ p.symbol }} {{ p.name }}</td>
                    <td>{{ p.sign }}</td>
                    <td>{{ p.degreeLabel }}</td>
                    <td>{{ p.houseName }}</td>
                    <td class="small text-muted">{{ p.retrograde ? 'Rx' : '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2 class="section-title">Transit hits</h2>
        <p class="text-muted small">
          Transit to natal, tighter daily orbs. Tightest first.
        </p>
        <div class="card mb-4">
          <div class="card-body">
            <div v-if="daily.hits.length" class="table-responsive">
              <table class="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>Hit</th>
                    <th>Aspect</th>
                    <th>Orb</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(h, i) in daily.hits" :key="i" :class="{ 'moon-hit': h.transitKey === 'moon' }">
                    <td>t.{{ h.transit }} → n.{{ h.natal }}</td>
                    <td>{{ h.symbol }} {{ h.aspect }}</td>
                    <td>{{ h.orb.toFixed(2) }}°</td>
                    <td class="small">
                      {{ h.applying ? 'applying' : 'separating' }}
                      · natal {{ h.natalHouseName }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="mb-0 text-muted">
              No transit-to-natal aspects inside the tight daily orbs at this moment. The Moon’s house
              and the month strip still stand.
            </p>
          </div>
        </div>

        <p class="small text-muted mb-1">{{ daily.engine }}</p>
        <p class="small text-muted">{{ daily.disclaimer }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue';
import { DateTime } from 'luxon';
import { useRoute } from 'vue-router';
import { useBirthdayStore } from '@/stores/birthday';
import BirthdayPicker from '@/components/BirthdayPicker.vue';
import ReadingLead from '@/components/ReadingLead.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { calculateWesternChart, calculateWesternDaily } from '@/utils/astrologyCalculations';

export default {
  name: 'WesternDaily',
  components: {
    BirthdayPicker,
    ReadingLead,
  },
  setup() {
    usePageTitle('Western Daily');
    const route = useRoute();
    const birthdayStore = useBirthdayStore();
    const birthdayList = computed(() => birthdayStore.getBirthdayList);

    const qDate = route.query.date;
    const parsedQueryDate = qDate ? DateTime.fromISO(String(qDate)) : null;
    const qTime = route.query.time ? String(route.query.time) : '';
    const now = DateTime.now();
    const selectedDate = ref(
      parsedQueryDate?.isValid ? parsedQueryDate.toISODate() : now.toISODate()
    );
    const selectedTime = ref(
      /^\d{2}:\d{2}$/.test(qTime) ? qTime : now.toFormat('HH:mm')
    );

    const loadId = route.query.load;
    if (loadId) {
      const found = birthdayStore.getBirthdayById(loadId);
      if (found) birthdayStore.selectBirthday(found.id);
    }

    const loading = ref(birthdayStore.getBirthdayList.length > 0);
    const error = ref('');
    const natalChart = ref(null);
    const daily = ref(null);
    const person = reactive({
      id: null,
      name: '',
      place: '',
      birthday: '',
    });

    const birthLabel = computed(() => {
      if (!person.birthday) return '';
      const dt = DateTime.fromISO(person.birthday);
      return dt.isValid ? dt.toFormat('yyyy-MM-dd HH:mm') : '';
    });

    const natalBrief = computed(() => {
      const brief = daily.value?.natalBrief;
      if (!brief) return '';
      return [brief.rising, brief.sun, brief.moon].filter(Boolean).join(', ');
    });

    const caption = computed(() => {
      if (!daily.value) return '';
      const parts = [daily.value.localLabel];
      if (person.birthday) {
        const birth = DateTime.fromISO(person.birthday);
        const at = DateTime.fromISO(`${selectedDate.value}T${selectedTime.value}`);
        if (birth.isValid && at.isValid) {
          const age = Math.floor(at.diff(birth, 'years').years);
          if (Number.isFinite(age) && age >= 0) parts.push(`age ${age}`);
        }
      }
      return parts.join(' · ');
    });

    const monthCards = computed(() => {
      const strip = daily.value?.monthStrip;
      if (!strip) return [];
      return [strip.saturn, strip.jupiter, strip.sun].filter(Boolean);
    });

    const whenFromInputs = () => {
      const isoDate = selectedDate.value;
      const hhmm = selectedTime.value || '12:00';
      const [hour, minute] = String(hhmm).split(':').map(Number);
      const dt = DateTime.fromISO(isoDate, { zone: 'local' }).set({
        hour: Number.isFinite(hour) ? hour : 12,
        minute: Number.isFinite(minute) ? minute : 0,
        second: 0,
      });
      if (!dt.isValid) {
        throw new Error('That date and time are not valid.');
      }
      return {
        date: dt.toJSDate(),
        time: `${String(dt.hour).padStart(2, '0')}:${String(dt.minute).padStart(2, '0')}`,
        timezoneOffset: dt.offset,
      };
    };

    const refreshDaily = () => {
      if (!natalChart.value) return;
      daily.value = calculateWesternDaily(natalChart.value, whenFromInputs());
    };

    const birthInputFrom = (birthday) => {
      const birthDateTime = DateTime.fromISO(birthday.birthday);
      return {
        name: birthday.name,
        date: new Date(birthday.birthday),
        time: birthDateTime.isValid ? birthDateTime.toFormat('HH:mm') : '12:00',
        latitude: birthday.coords.latitude,
        longitude: birthday.coords.longitude,
        place: birthday.place || '',
        gender: birthday.gender,
        timezoneOffset: typeof birthday.timezoneOffset === 'number'
          ? birthday.timezoneOffset
          : (birthDateTime.isValid ? birthDateTime.offset : -new Date().getTimezoneOffset()),
        houseSystem: 'placidus',
      };
    };

    const loadPerson = (birthday) => {
      if (!birthday) return;
      loading.value = true;
      error.value = '';
      daily.value = null;
      natalChart.value = null;
      try {
        birthdayStore.selectBirthday(birthday.id);
        person.id = birthday.id;
        person.name = birthday.name;
        person.place = birthday.place || '';
        person.birthday = birthday.birthday;
        natalChart.value = calculateWesternChart(birthInputFrom(birthday));
        refreshDaily();
      } catch (err) {
        console.error(err);
        person.name = birthday.name || '';
        error.value = err.message || 'Could not calculate this birth.';
      } finally {
        loading.value = false;
      }
    };

    const onDateInput = (event) => {
      const iso = event.target.value;
      if (!iso) return;
      selectedDate.value = iso;
      try {
        refreshDaily();
      } catch (err) {
        error.value = err.message || 'Could not read that day.';
      }
    };

    const onTimeInput = (event) => {
      const hhmm = event.target.value;
      if (!hhmm) return;
      selectedTime.value = hhmm;
      try {
        refreshDaily();
      } catch (err) {
        error.value = err.message || 'Could not read that time.';
      }
    };

    const goToday = () => {
      const local = DateTime.now();
      selectedDate.value = local.toISODate();
      selectedTime.value = local.toFormat('HH:mm');
      try {
        refreshDaily();
      } catch (err) {
        error.value = err.message || 'Could not read this moment.';
      }
    };

    return {
      birthdayList,
      loading,
      error,
      person,
      daily,
      selectedDate,
      selectedTime,
      birthLabel,
      natalBrief,
      caption,
      monthCards,
      loadPerson,
      onDateInput,
      onTimeInput,
      goToday,
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
.date-bar,
.moon-card {
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
.month-card {
  border-top: 4px solid #8b4513;
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
.in-force {
  background: #fff4d4;
}
.moon-hit {
  background: #f7f3ea;
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
