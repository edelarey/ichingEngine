<template>
  <div class="astrology-page">
    <!-- Page Header (Inline) -->
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">I-Ching Relationship Compatibility Reading</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">I Ching Compatibility</li>
          </ol>
        </nav>
      </div>
    </header>

    <!-- Control Panel: Toggle Sections -->
    <div class="container my-6">
      <div class="card">
        <div class="card-header bg-dark text-white">
          <h5 class="mb-0">Control Your Compatibility Reading</h5>
        </div>
        <div class="card-body">
          <div class="row g-2 justify-content-center">
            <div class="col-auto">
              <button @click="state.showBirthdayHistory = !state.showBirthdayHistory" class="btn btn-sm" :class="state.showBirthdayHistory ? 'btn-success' : 'btn-secondary'">
                {{ state.showBirthdayHistory ? 'Hide' : 'Show' }} Birthday History
              </button>
            </div>
            <div class="col-auto">
              <button @click="state.showBirthdayEntry = !state.showBirthdayEntry" class="btn btn-sm" :class="state.showBirthdayEntry ? 'btn-success' : 'btn-secondary'">
                {{ state.showBirthdayEntry ? 'Hide' : 'Show' }} Birthday Entry
              </button>
            </div>
            <div class="col-auto">
              <button @click="state.showCompatibilityResults = !state.showCompatibilityResults" class="btn btn-sm" :class="state.showCompatibilityResults ? 'btn-success' : 'btn-secondary'">
                {{ state.showCompatibilityResults ? 'Hide' : 'Show' }} Compatibility Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Birthday History Display -->
    <div v-if="state.showBirthdayHistory" class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Birthday History</h5>
            <div class="mb-3">
              <button @click="birthdayStore.exportBirthdays" class="btn btn-success btn-sm me-2">Export Birthdays</button>
              <label for="importFile" class="btn btn-primary btn-sm">
                Import Birthdays
                <input type="file" id="importFile" @change="handleImport" hidden accept=".json">
              </label>
              <button @click="birthdayStore.clearBirthdays" class="btn btn-danger btn-sm ms-2">Clear All</button>
            </div>
            <div v-if="birthdayList.length === 0">
              <p>No birthdays recorded yet.</p>
            </div>
            <div v-else>
              <div v-for="birthday in birthdayList" :key="birthday.id" class="mb-3">
                <p><strong>Date:</strong> {{ dateTimeFormatSimple(birthday.birthday) }}</p>
                <p><strong>Name:</strong> {{ birthday.name || 'Unnamed' }}</p>
                <p><strong>Gender:</strong> {{ birthday.gender }}</p>
                <p><strong>Latitude:</strong> {{ birthday.coords.latitude }}</p>
                <p><strong>Longitude:</strong> {{ birthday.coords.longitude }}</p>
                <div>
                  <button @click="loadBirthday(birthday, 1)" class="btn btn-primary btn-sm me-2">Load Person 1</button>
                  <button @click="loadBirthday(birthday, 2)" class="btn btn-primary btn-sm me-2">Load Person 2</button>
                  <button @click="startEditingBirthday(birthday)" class="btn btn-primary btn-sm me-2">Edit</button>
                  <button @click="birthdayStore.removeBirthday(birthday.id)" class="btn btn-danger btn-sm">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Birthday Entry Interface for Two People -->
    <div v-if="state.showBirthdayEntry" class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="card text-center">
          <h3 class="card-header py-3">Enter Details for Compatibility Reading</h3>
          <div class="card-body">
            <div class="row justify-content-center">
              <!-- Person 1 Details -->
              <div class="col-12 col-md-6 mb-4">
                <h5 class="card-title mb-3">Person 1 Details</h5>
                <!-- Name Input -->
                <div class="mb-3">
                  <h6 :style="{ color: colorClass }" class="card-text mb-2">Name</h6>
                  <input
                    v-model="state.person1.name"
                    :list="`saved-names-person1-${state.id}`"
                    class="form-control input-narrow"
                    placeholder="Type Person 1's name or select from the list"
                  />
                  <datalist :id="`saved-names-person1-${state.id}`">
                    <option v-for="birthday in birthdayList" :key="birthday.id" :value="birthday.name">{{ birthday.name }}</option>
                  </datalist>
                </div>
                <!-- Birth Date Input -->
                <div class="mb-3">
                  <h6 :style="{ color: colorClass }" class="card-text mb-2">Birth Date</h6>
                  <Datepicker
                    placeholder="Birth Date"
                    v-model="state.person1.birthDate"
                    format="yyyy-MM-dd HH:mm"
                    previewFormat="yyyy-MM-dd HH:mm"
                    :enableTimePicker="true"
                    :disabled="false"
                    :min-date="state.minDate"
                    :max-date="state.maxDate"
                    class="w-100 input-narrow"
                  />
                </div>
                <!-- Gender Select -->
                <div class="mb-3">
                  <h6 :style="{ color: colorClass }" class="card-text mb-2">Gender</h6>
                  <select v-model="state.person1.gender" class="form-control input-narrow">
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                </div>
                <!-- Latitude and Longitude -->
                <div class="mb-3">
                  <div class="row justify-content-center">
                    <div class="col-12 col-md-6 mb-3 mb-md-0">
                      <h6 :style="{ color: colorClass }" class="card-text mb-2">Latitude</h6>
                      <input v-model.number="state.person1.latitude" class="form-control input-narrow" placeholder="0.00 Latitude" />
                    </div>
                    <div class="col-12 col-md-6">
                      <h6 :style="{ color: colorClass }" class="card-text mb-2">Longitude</h6>
                      <input v-model.number="state.person1.longitude" class="form-control input-narrow" placeholder="0.00 Longitude" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Person 2 Details -->
              <div class="col-12 col-md-6 mb-4">
                <h5 class="card-title mb-3">Person 2 Details</h5>
                <!-- Name Input -->
                <div class="mb-3">
                  <h6 :style="{ color: colorClass }" class="card-text mb-2">Name</h6>
                  <input
                    v-model="state.person2.name"
                    :list="`saved-names-person2-${state.id}`"
                    class="form-control input-narrow"
                    placeholder="Type Person 2's name or select from the list"
                  />
                  <datalist :id="`saved-names-person2-${state.id}`">
                    <option v-for="birthday in birthdayList" :key="birthday.id" :value="birthday.name">{{ birthday.name }}</option>
                  </datalist>
                </div>
                <!-- Birth Date Input -->
                <div class="mb-3">
                  <h6 :style="{ color: colorClass }" class="card-text mb-2">Birth Date</h6>
                  <Datepicker
                    placeholder="Birth Date"
                    v-model="state.person2.birthDate"
                    format="yyyy-MM-dd HH:mm"
                    previewFormat="yyyy-MM-dd HH:mm"
                    :enableTimePicker="true"
                    :disabled="false"
                    :min-date="state.minDate"
                    :max-date="state.maxDate"
                    class="w-100 input-narrow"
                  />
                </div>
                <!-- Gender Select -->
                <div class="mb-3">
                  <h6 :style="{ color: colorClass }" class="card-text mb-2">Gender</h6>
                  <select v-model="state.person2.gender" class="form-control input-narrow">
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                </div>
                <!-- Latitude and Longitude -->
                <div class="mb-3">
                  <div class="row justify-content-center">
                    <div class="col-12 col-md-6 mb-3 mb-md-0">
                      <h6 :style="{ color: colorClass }" class="card-text mb-2">Latitude</h6>
                      <input v-model.number="state.person2.latitude" class="form-control input-narrow" placeholder="0.00 Latitude" />
                    </div>
                    <div class="col-12 col-md-6">
                      <h6 :style="{ color: colorClass }" class="card-text mb-2">Longitude</h6>
                      <input v-model.number="state.person2.longitude" class="form-control input-narrow" placeholder="0.00 Longitude" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Buttons Section -->
            <div class="row justify-content-center">
              <div class="col-12 col-md-8 col-lg-6 mb-3">
                <button @click="calculateCompatibility" class="btn btn-primary btn-narrow">Calculate Compatibility</button>
              </div>
              <div class="col-12 col-md-8 col-lg-6 mb-3">
                <button @click="saveBirthdays" class="btn btn-primary btn-narrow">Save Both Birthdays</button>
              </div>
              <div v-if="state.editingBirthday" class="col-12 col-md-8 col-lg-6 mb-3">
                <button @click="updateBirthday" class="btn btn-success btn-narrow">Update Birthday</button>
                <button @click="cancelEditing" class="btn btn-secondary btn-narrow">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compatibility Results -->
    <div v-if="state.showCompatibilityResults && state.compatibilityResult" class="row justify-content-center">
      <div class="col-12">
        <div class="card text-center">
          <h3 class="card-header">Compatibility Reading for {{ state.person1.name }} and {{ state.person2.name }}</h3>
          <div class="card-body">
            <!-- Overall Compatibility -->
            <div class="row justify-content-center">
              <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card text-center">
                  <div class="card-body">
                    <h5 class="card-title">Overall Compatibility</h5>
                    <p class="card-text display-4" :style="{ color: getScoreColor(state.compatibilityResult.compatibility.overallCompatibility.score) }">
                      {{ state.compatibilityResult.compatibility.overallCompatibility.score }}
                    </p>
                    <p class="card-text display-6">{{ state.compatibilityResult.compatibility.overallCompatibility.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Compatibility Aspects -->
            <div class="row justify-content-center">
              <!-- Elemental Compatibility -->
              <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card text-center">
                  <div class="card-body">
                    <h5 class="card-title">Elemental Compatibility</h5>
                    <p class="card-text display-4" :style="{ color: getScoreColor(state.compatibilityResult.compatibility.elementalCompatibility.score) }">
                      {{ state.compatibilityResult.compatibility.elementalCompatibility.score }}
                    </p>
                    <p class="card-text display-6">{{ state.compatibilityResult.compatibility.elementalCompatibility.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Trigram/Hexagram Compatibility -->
              <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card text-center">
                  <div class="card-body">
                    <h5 class="card-title">Trigram/Hexagram Compatibility</h5>
                    <p class="card-text display-4" :style="{ color: getScoreColor(state.compatibilityResult.compatibility.trigramHexagramCompatibility.score) }">
                      {{ state.compatibilityResult.compatibility.trigramHexagramCompatibility.score }}
                    </p>
                    <p class="card-text display-6">{{ state.compatibilityResult.compatibility.trigramHexagramCompatibility.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Sexagenary Cycle Compatibility -->
              <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card text-center">
                  <div class="card-body">
                    <h5 class="card-title">Sexagenary Cycle Compatibility</h5>
                    <p class="card-text display-4" :style="{ color: getScoreColor(state.compatibilityResult.compatibility.sexagenaryCompatibility.score) }">
                      {{ state.compatibilityResult.compatibility.sexagenaryCompatibility.score }}
                    </p>
                    <p class="card-text display-6">{{ state.compatibilityResult.compatibility.sexagenaryCompatibility.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Sub-Cycle Compatibility -->
              <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card text-center">
                  <div class="card-body">
                    <h5 class="card-title">Sub-Cycle Compatibility</h5>
                    <p class="card-text display-4" :style="{ color: getScoreColor(state.compatibilityResult.compatibility.subCycleCompatibility.score) }">
                      {{ state.compatibilityResult.compatibility.subCycleCompatibility.score }}
                    </p>
                    <p class="card-text display-6">{{ state.compatibilityResult.compatibility.subCycleCompatibility.description }}</p>
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
import { reactive, computed, watch } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import astro from '@/const/astrology';
import { DateTime } from 'luxon';
import { useBirthdayStore } from '@/stores/birthday';

export default {
  name: 'Compatibility',
  components: { Datepicker },
  setup() {
    const birthdayStore = useBirthdayStore();
    const birthdayList = computed(() => birthdayStore.getBirthdayList);

    const state = reactive({
      id: Date.now(),
      person1: {
        name: 'Person 1',
        birthDate: DateTime.fromObject({ year: 1971, month: 3, day: 3, hour: 10, minute: 30 }).toJSDate(),
        gender: 'MALE',
        latitude: -26.396599069608687,
        longitude: 27.37679999686307,
      },
      person2: {
        name: 'Person 2',
        birthDate: DateTime.fromObject({ year: 1973, month: 6, day: 13, hour: 10, minute: 30 }).toJSDate(),
        gender: 'FEMALE',
        latitude: -26.174204189162413, 
        longitude: 28.047192783369983,
      },
      minDate: DateTime.fromObject({ year: 1, month: 1, day: 1 }).toJSDate(),
      maxDate: DateTime.fromObject({ year: 275760, month: 9, day: 13 }).toJSDate(),
      compatibilityResult: null,
      showBirthdayHistory: false,
      showBirthdayEntry: true,
      showCompatibilityResults: true,
      editingBirthday: null, // Track the birthday being edited
      editingPersonNumber: null, // Track which person (1 or 2) is being edited
    });

    const dateTimeFormatSimple = (date) => {
      if (date) {
        return DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd HH:mm');
      }
      return null;
    };

    const colorClass = computed(() => 'rgb(0,0,0)');

    const getScoreColor = (score) => {
      if (score > 0) return 'green';
      if (score < 0) return 'red';
      return 'black';
    };

    const validatePersonData = (person) => {
      const errors = [];

      if (!person.name || person.name.trim() === '') {
        errors.push('Name is required.');
      }

      if (!DateTime.fromJSDate(person.birthDate).isValid) {
        errors.push('Birth date must be a valid date.');
      }

      if (!['MALE', 'FEMALE'].includes(person.gender)) {
        errors.push('Gender must be either "MALE" or "FEMALE".');
      }

      if (typeof person.latitude !== 'number' || person.latitude < -90 || person.latitude > 90) {
        errors.push('Latitude must be a number between -90 and 90.');
      }

      if (typeof person.longitude !== 'number' || person.longitude < -180 || person.longitude > 180) {
        errors.push('Longitude must be a number between -180 and 180.');
      }

      return errors;
    };

    const saveBirthdays = () => {
      try {
        // Validate Person 1
        const person1Errors = validatePersonData(state.person1);
        if (person1Errors.length > 0) {
          throw new Error(`Person 1: ${person1Errors.join(' ')}`);
        }

        // Validate Person 2
        const person2Errors = validatePersonData(state.person2);
        if (person2Errors.length > 0) {
          throw new Error(`Person 2: ${person2Errors.join(' ')}`);
        }

        // Save Person 1
        birthdayStore.addBirthday({
          id: Date.now(),
          name: state.person1.name,
          birthday: DateTime.fromJSDate(state.person1.birthDate).toISO(),
          gender: state.person1.gender,
          coords: { latitude: state.person1.latitude, longitude: state.person1.longitude },
        });

        // Save Person 2
        birthdayStore.addBirthday({
          id: Date.now() + 1,
          name: state.person2.name,
          birthday: DateTime.fromJSDate(state.person2.birthDate).toISO(),
          gender: state.person2.gender,
          coords: { latitude: state.person2.latitude, longitude: state.person2.longitude },
        });

        alert('Birthdays saved successfully!');
      } catch (error) {
        console.error('Error saving birthdays:', error);
        alert(`Failed to save birthdays: ${error.message}`);
      }
    };

    const loadBirthday = (birthday, personNumber) => {
      const person = personNumber === 1 ? state.person1 : state.person2;
      person.name = birthday.name;
       person.birthDate = DateTime.fromISO(birthday.birthday).toJSDate();
      person.gender = birthday.gender;
      person.latitude = birthday.coords.latitude;
      person.longitude = birthday.coords.longitude;
    };

    const startEditingBirthday = (birthday) => {
      // Determine which person to edit based on the name
      if (state.person1.name === birthday.name) {
        state.editingPersonNumber = 1;
      } else if (state.person2.name === birthday.name) {
        state.editingPersonNumber = 2;
      } else {
        // If the name doesn't match either person, default to Person 1 and load the birthday
        state.editingPersonNumber = 1;
        loadBirthday(birthday, 1);
      }
      state.editingBirthday = birthday;
    };

    const updateBirthday = () => {
      try {
        const person = state.editingPersonNumber === 1 ? state.person1 : state.person2;
        const updatedBirthday = {
          id: state.editingBirthday.id,
          name: person.name,
          birthday: DateTime.fromJSDate(person.birthDate).toISO(),
          gender: person.gender,
          coords: {
            latitude: person.latitude,
            longitude: person.longitude,
          },
        };

        birthdayStore.updateBirthday(updatedBirthday);
        alert('Birthday updated successfully!');
        cancelEditing();
      } catch (error) {
        console.error('Error updating birthday:', error);
        alert(`Failed to update birthday: ${error.message}`);
      }
    };

    const cancelEditing = () => {
      state.editingBirthday = null;
      state.editingPersonNumber = null;
    };

    const calculateCompatibility = async () => {
      try {
        // Validate Person 1 and Person 2 data before calculating
        const person1Errors = validatePersonData(state.person1);
        if (person1Errors.length > 0) {
          throw new Error(`Person 1: ${person1Errors.join(' ')}`);
        }

        const person2Errors = validatePersonData(state.person2);
        if (person2Errors.length > 0) {
          throw new Error(`Person 2: ${person2Errors.join(' ')}`);
        }

        const gender1 = state.person1.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
        const gender2 = state.person2.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;

        const result = await astro.calculateCompatibility(
          state.person1.birthDate,
          gender1,
          state.person1.latitude,
          state.person1.longitude,
          state.person2.birthDate,
          gender2,
          state.person2.latitude,
          state.person2.longitude
        );
        state.compatibilityResult = result;
      } catch (error) {
        console.error('Error calculating compatibility:', error);
        alert(`Failed to calculate compatibility: ${error.message}`);
      }
    };

    const handleImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        birthdayStore.importBirthdays(file);
        event.target.value = '';
      }
    };

    watch(() => state.person1.name, (newName) => {
      const selectedBirthday = birthdayList.value.find(b => b.name === newName);
      if (selectedBirthday) {
        loadBirthday(selectedBirthday, 1);
      }
    });

    watch(() => state.person2.name, (newName) => {
      const selectedBirthday = birthdayList.value.find(b => b.name === newName);
      if (selectedBirthday) {
        loadBirthday(selectedBirthday, 2);
      }
    });

    return {
      state,
      birthdayList,
      birthdayStore,
      dateTimeFormatSimple,
      colorClass,
      getScoreColor,
      saveBirthdays,
      loadBirthday,
      startEditingBirthday,
      updateBirthday,
      cancelEditing,
      calculateCompatibility,
      handleImport,
    };
  },
};
</script>