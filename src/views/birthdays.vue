<template>
  <div class="birthdays-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Birthdays</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Birthdays</li>
          </ol>
        </nav>
        <p class="mb-0">
          One list of people, used by
          <router-link to="/astrology">I-Ching Astrology</router-link>,
          <router-link to="/daily_reading">Daily Reading</router-link>,
          <router-link to="/vedic_astrology">Vedic</router-link>, and
          <router-link to="/western_astrology">Western</router-link>.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <div class="row g-4">
        <div class="col-12 col-xl-6">
          <div class="card birthday-form-card">
            <div class="card-body">
              <h5 class="card-title">{{ editingId ? 'Edit birthday' : 'Add birthday' }}</h5>
              <BirthDataForm id="bd" :model-value="form" @update:model-value="assignForm" />
              <p v-if="error" class="text-danger small mt-3 mb-2">{{ error }}</p>
              <div class="d-flex flex-wrap gap-2 mt-3">
                <button type="button" class="btn btn-primary" @click="save">
                  {{ editingId ? 'Update birthday' : 'Save birthday' }}
                </button>
                <button v-if="editingId" type="button" class="btn btn-secondary" @click="resetForm">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-xl-6">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h5 class="card-title mb-0">Saved people ({{ birthdayList.length }})</h5>
                <div>
                  <button type="button" class="btn btn-success btn-sm me-1" @click="birthdayStore.exportBirthdays">Export</button>
                  <label class="btn btn-primary btn-sm me-1 mb-0">
                    Import
                    <input type="file" hidden accept=".json" @change="handleImport" />
                  </label>
                  <button type="button" class="btn btn-danger btn-sm" :disabled="!birthdayList.length" @click="confirmClear">Clear all</button>
                </div>
              </div>

              <div v-if="birthdayList.length === 0" class="text-muted">
                No birthdays saved yet. Add someone with the form.
              </div>
              <div v-else>
                <div v-for="b in birthdayList" :key="b.id" class="person-card mb-3 p-3 border rounded">
                  <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <h6 class="mb-1">{{ b.name || 'Unnamed' }}</h6>
                      <p class="mb-1 small">{{ formatWhen(b) }}</p>
                      <p class="mb-1 small text-muted">
                        {{ b.gender }}
                        · {{ b.coords.latitude }}, {{ b.coords.longitude }}
                        <span v-if="b.place"> · {{ b.place }}</span>
                        <span v-if="b.timezoneOffset != null"> · {{ formatOffset(b.timezoneOffset) }}</span>
                      </p>
                    </div>
                    <div class="d-flex flex-wrap gap-1">
                      <button type="button" class="btn btn-sm btn-outline-secondary" @click="startEdit(b)">Edit</button>
                      <button type="button" class="btn btn-sm btn-outline-danger" @click="remove(b)">Delete</button>
                    </div>
                  </div>
                  <div class="mt-2 d-flex flex-wrap gap-1">
                    <router-link class="btn btn-sm btn-primary" :to="`/astrology?load=${b.id}`">I-Ching</router-link>
                    <router-link class="btn btn-sm btn-primary" :to="`/daily_reading?load=${b.id}`">Daily</router-link>
                    <router-link class="btn btn-sm btn-primary" :to="`/vedic_astrology?load=${b.id}`">Vedic</router-link>
                    <router-link class="btn btn-sm btn-primary" :to="`/western_astrology?load=${b.id}`">Western</router-link>
                    <router-link class="btn btn-sm btn-outline-dark" :to="`/compare?load=${b.id}`">Compare all</router-link>
                  </div>
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
import { computed, reactive, ref } from 'vue';
import { DateTime } from 'luxon';
import { useBirthdayStore } from '@/stores/birthday';
import BirthDataForm from '@/components/BirthDataForm.vue';
import { usePageTitle } from '@/composables/usePageTitle';

function formatOffset(minutes) {
  if (typeof minutes !== 'number' || Number.isNaN(minutes)) return '';
  const sign = minutes >= 0 ? '+' : '-';
  const abs = Math.abs(Math.round(minutes));
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hh}:${mm}`;
}

function emptyForm() {
  return {
    name: '',
    date: '',
    time: '12:00',
    gender: 'MALE',
    latitude: 0,
    longitude: 0,
    place: '',
    timezoneOffset: -new Date().getTimezoneOffset(),
    timezoneName: '',
  };
}

export default {
  name: 'Birthdays',
  components: { BirthDataForm },
  setup() {
    usePageTitle('Birthdays');
    const birthdayStore = useBirthdayStore();
    const birthdayList = computed(() => birthdayStore.getBirthdayList);
    const form = reactive(emptyForm());
    const editingId = ref(null);
    const error = ref('');

    const assignForm = (next) => {
      Object.assign(form, next);
    };

    const resetForm = () => {
      Object.assign(form, emptyForm());
      editingId.value = null;
      error.value = '';
    };

    const toRecord = () => {
      if (!form.name.trim()) throw new Error('Name is required.');
      if (!form.date) throw new Error('Birth date is required.');
      const day = form.date instanceof Date
        ? DateTime.fromJSDate(form.date).toFormat('yyyy-MM-dd')
        : String(form.date || '').slice(0, 10);
      const dt = DateTime.fromISO(`${day}T${form.time || '12:00'}`);
      if (!dt.isValid) throw new Error('Birth date/time is not valid.');
      return {
        id: editingId.value || Date.now(),
        name: form.name.trim(),
        birthday: dt.toISO(),
        gender: form.gender,
        coords: {
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        },
        place: form.place || '',
        timezoneOffset: Number(form.timezoneOffset),
        timezoneName: form.timezoneName || '',
      };
    };

    const save = () => {
      try {
        error.value = '';
        const record = toRecord();
        if (editingId.value) {
          birthdayStore.updateBirthday(record);
          alert('Birthday updated.');
        } else {
          const result = birthdayStore.addBirthday(record);
          if (result.duplicate) {
            if (confirm(`A birthday named "${record.name}" already exists. Replace it?`)) {
              birthdayStore.addBirthday(record, true);
              alert('Birthday replaced.');
            } else {
              return;
            }
          } else if (result.success) {
            alert('Birthday saved.');
          }
        }
        birthdayStore.selectBirthday(record.id);
        resetForm();
      } catch (err) {
        error.value = err.message;
      }
    };

    const startEdit = (b) => {
      const dt = DateTime.fromISO(b.birthday);
      editingId.value = b.id;
      form.name = b.name;
      form.date = dt.toJSDate();
      form.time = dt.toFormat('HH:mm');
      form.gender = b.gender;
      form.latitude = b.coords.latitude;
      form.longitude = b.coords.longitude;
      form.place = b.place || '';
      form.timezoneOffset = typeof b.timezoneOffset === 'number' ? b.timezoneOffset : (dt.isValid ? dt.offset : -new Date().getTimezoneOffset());
      form.timezoneName = b.timezoneName || '';
      error.value = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const remove = (b) => {
      if (!confirm(`Delete ${b.name}?`)) return;
      birthdayStore.removeBirthday(b.id);
      if (editingId.value === b.id) resetForm();
    };

    const confirmClear = () => {
      if (!confirm('Delete every saved birthday?')) return;
      birthdayStore.clearBirthdays();
      resetForm();
    };

    const handleImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        birthdayStore.importBirthdays(file);
        event.target.value = '';
      }
    };

    const formatWhen = (b) => {
      const dt = DateTime.fromISO(b.birthday);
      return dt.isValid ? dt.toFormat('yyyy-MM-dd HH:mm') : '';
    };

    return {
      birthdayStore,
      birthdayList,
      form,
      assignForm,
      editingId,
      error,
      formatOffset,
      formatWhen,
      save,
      startEdit,
      remove,
      resetForm,
      confirmClear,
      handleImport,
    };
  },
};
</script>

<style scoped>
.birthdays-page :deep(.card) {
  margin: 0;
  overflow: visible;
}
.birthday-form-card,
.birthday-form-card :deep(.card-body) {
  overflow: visible;
}
.card-title {
  border-bottom: 2px solid #6c63ff;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
.form-label { font-weight: 600; }
.person-card { background: #fafbff; }
</style>
