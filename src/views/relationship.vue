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
                      <input v-model.number="state.person1.latitude" type="number" min="-90" max="90" step="any" class="form-control input-narrow" placeholder="0.00 Latitude" />
                    </div>
                    <div class="col-12 col-md-6">
                      <h6 :style="{ color: colorClass }" class="card-text mb-2">Longitude</h6>
                      <input v-model.number="state.person1.longitude" type="number" min="-180" max="180" step="any" class="form-control input-narrow" placeholder="0.00 Longitude" />
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
                      <input v-model.number="state.person2.latitude" type="number" min="-90" max="90" step="any" class="form-control input-narrow" placeholder="0.00 Latitude" />
                    </div>
                    <div class="col-12 col-md-6">
                      <h6 :style="{ color: colorClass }" class="card-text mb-2">Longitude</h6>
                      <input v-model.number="state.person2.longitude" type="number" min="-180" max="180" step="any" class="form-control input-narrow" placeholder="0.00 Longitude" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Buttons Section -->
            <div class="row justify-content-center">
              <div class="col-12 col-md-8 col-lg-6 mb-3">
                <button @click="calculateCompatibility" class="btn btn-primary btn-narrow" :disabled="state.loading">
                  {{ state.loading ? 'Calculating...' : 'Calculate Compatibility' }}
                </button>
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
          <h3 class="card-header">
            Compatibility Reading for {{ state.person1.name || 'Person 1' }} and {{ state.person2.name || 'Person 2' }}
          </h3>
          <div class="card-body">
            <!-- Tabs for Detailed Reading -->
            <ul class="nav nav-tabs mb-4">
              <li class="nav-item">
                <button class="nav-link" :class="{ active: state.activeTab === 'overview' }" @click="state.activeTab = 'overview'">Overview</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" :class="{ active: state.activeTab === 'person1' }" @click="state.activeTab = 'person1'">{{ state.person1.name || 'Person 1' }} Details</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" :class="{ active: state.activeTab === 'person2' }" @click="state.activeTab = 'person2'">{{ state.person2.name || 'Person 2' }} Details</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" :class="{ active: state.activeTab === 'relationship' }" @click="state.activeTab = 'relationship'">Relationship Analysis</button>
              </li>
            </ul>

            <!-- Tab Content -->
            <div v-if="state.activeTab === 'overview'">
              <!-- Overall Compatibility -->
              <div class="row justify-content-center">
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                  <div class="card text-center">
                    <div class="card-body">
                      <h5 class="card-title">Overall Compatibility</h5>
                      <p class="card-text display-4" :style="{ color: getScoreColor(state.compatibilityResult.compatibility.overallCompatibility.score) }">
                        {{ state.compatibilityResult.compatibility.overallCompatibility.score }}
                      </p>
                      <p class="card-text">{{ state.compatibilityResult.compatibility.overallCompatibility.description }}</p>
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
                      <p class="card-text">{{ state.compatibilityResult.compatibility.elementalCompatibility.description }}</p>
                      <p class="card-text text-muted">
                        {{ state.person1.name || 'Person 1' }}: {{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.celestialStem.element.name }}<br>
                        {{ state.person2.name || 'Person 2' }}: {{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.celestialStem.element.name }}
                      </p>
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
                      <p class="card-text">{{ state.compatibilityResult.compatibility.trigramHexagramCompatibility.description }}</p>
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
                      <p class="card-text">{{ state.compatibilityResult.compatibility.sexagenaryCompatibility.description }}</p>
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
                      <p class="card-text">{{ state.compatibilityResult.compatibility.subCycleCompatibility.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Person 1 Details -->
            <div v-if="state.activeTab === 'person1'">
              <h4>{{ state.person1.name || 'Person 1' }}'s Astrological Profile</h4>
              <div class="row justify-content-center">
                <!-- Yearly Cycle -->
                <div class="col-12 col-md-6 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Yearly Cycle</h5>
                      <p><strong>Celestial Stem:</strong> {{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.celestialStem.name }} ({{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.celestialStem.element.name }})</p>
                      <p><strong>Horary Branch:</strong> {{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.horaryBranch.name }} ({{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.horaryBranch.animal }}, {{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.horaryBranch.element.name }})</p>
                      <p class="text-muted">The stem and branch define your core astrological identity, influencing your personality and life path.</p>
                    </div>
                  </div>
                </div>
                <!-- Pre-Heaven Hexagram -->
                <div class="col-12 col-md-6 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Pre-Heaven Hexagram</h5>
                      <p><strong>Hexagram:</strong> {{ state.compatibilityResult.person1.iching.preHeavenHexagram.name }}</p>
                      <p><strong>Above Trigram:</strong> {{ state.compatibilityResult.person1.iching.preHeavenHexagram.above.name }} ({{ getTrigramElement(state.compatibilityResult.person1.iching.preHeavenHexagram.above.name) }})</p>
                      <p><strong>Below Trigram:</strong> {{ state.compatibilityResult.person1.iching.preHeavenHexagram.below.name }} ({{ getTrigramElement(state.compatibilityResult.person1.iching.preHeavenHexagram.below.name) }})</p>
                      <p class="text-muted">The pre-heaven hexagram reflects your innate qualities and spiritual foundation.</p>
                    </div>
                  </div>
                </div>
                <!-- Later-Heaven Hexagram -->
                <div class="col-12 col-md-6 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Later-Heaven Hexagram</h5>
                      <p><strong>Hexagram:</strong> {{ state.compatibilityResult.person1.iching.laterHeavenHexagram.name }}</p>
                      <p><strong>Above Trigram:</strong> {{ state.compatibilityResult.person1.iching.laterHeavenHexagram.above.name }} ({{ getTrigramElement(state.compatibilityResult.person1.iching.laterHeavenHexagram.above.name) }})</p>
                      <p><strong>Below Trigram:</strong> {{ state.compatibilityResult.person1.iching.laterHeavenHexagram.below.name }} ({{ getTrigramElement(state.compatibilityResult.person1.iching.laterHeavenHexagram.below.name) }})</p>
                      <p class="text-muted">The later-heaven hexagram shows how you manifest in the world over time.</p>
                    </div>
                  </div>
                </div>
                <!-- Natal Hexagram -->
                <div class="col-12 col-md-6 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Natal Hexagram</h5>
                      <p><strong>Hexagram:</strong> {{ state.compatibilityResult.person1.natalHexagram.english }} ({{ state.compatibilityResult.person1.natalHexagram.chinese }})</p>
                      <p class="text-muted">The natal hexagram provides insight into your life's overarching theme.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Person 2 Details -->
            <div v-if="state.activeTab === 'person2'">
              <h4>{{ state.person2.name || 'Person 2' }}'s Astrological Profile</h4>
              <div class="row justify-content-center">
                <!-- Yearly Cycle -->
                <div class="col-12 col-md-6 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Yearly Cycle</h5>
                      <p><strong>Celestial Stem:</strong> {{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.celestialStem.name }} ({{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.celestialStem.element.name }})</p>
                      <p><strong>Horary Branch:</strong> {{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.horaryBranch.name }} ({{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.horaryBranch.animal }}, {{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.horaryBranch.element.name }})</p>
                      <p class="text-muted">The stem and branch define your core astrological identity, influencing your personality and life path.</p>
                    </div>
                  </div>
                </div>
                <!-- Pre-Heaven Hexagram -->
                <div class="col-12 col-md-6 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Pre-Heaven Hexagram</h5>
                      <p><strong>Hexagram:</strong> {{ state.compatibilityResult.person2.iching.preHeavenHexagram.name }}</p>
                      <p><strong>Above Trigram:</strong> {{ state.compatibilityResult.person2.iching.preHeavenHexagram.above.name }} ({{ getTrigramElement(state.compatibilityResult.person2.iching.preHeavenHexagram.above.name) }})</p>
                      <p><strong>Below Trigram:</strong> {{ state.compatibilityResult.person2.iching.preHeavenHexagram.below.name }} ({{ getTrigramElement(state.compatibilityResult.person2.iching.preHeavenHexagram.below.name) }})</p>
                      <p class="text-muted">The pre-heaven hexagram reflects your innate qualities and spiritual foundation.</p>
                    </div>
                  </div>
                </div>
                <!-- Later-Heaven Hexagram -->
                <div class="col-12 col-md-6 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Later-Heaven Hexagram</h5>
                      <p><strong>Hexagram:</strong> {{ state.compatibilityResult.person2.iching.laterHeavenHexagram.name }}</p>
                      <p><strong>Above Trigram:</strong> {{ state.compatibilityResult.person2.iching.laterHeavenHexagram.above.name }} ({{ getTrigramElement(state.compatibilityResult.person2.iching.laterHeavenHexagram.above.name) }})</p>
                      <p><strong>Below Trigram:</strong> {{ state.compatibilityResult.person2.iching.laterHeavenHexagram.below.name }} ({{ getTrigramElement(state.compatibilityResult.person2.iching.laterHeavenHexagram.below.name) }})</p>
                      <p class="text-muted">The later-heaven hexagram shows how you manifest in the world over time.</p>
                    </div>
                  </div>
                </div>
                <!-- Natal Hexagram -->
                <div class="col-12 col-md-6 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Natal Hexagram</h5>
                      <p><strong>Hexagram:</strong> {{ state.compatibilityResult.person2.natalHexagram.english }} ({{ state.compatibilityResult.person2.natalHexagram.chinese }})</p>
                      <p class="text-muted">The natal hexagram provides insight into your life's overarching theme.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Relationship Analysis -->
            <div v-if="state.activeTab === 'relationship'">
              <h4>Relationship Analysis</h4>
              <div class="accordion" id="relationshipAccordion">
                <!-- Elemental Compatibility -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="elementalHeading">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#elementalCollapse" aria-expanded="true" aria-controls="elementalCollapse">
                      Elemental Compatibility (Score: {{ state.compatibilityResult.compatibility.elementalCompatibility.score }})
                    </button>
                  </h2>
                  <div id="elementalCollapse" class="accordion-collapse collapse show" aria-labelledby="elementalHeading" data-bs-parent="#relationshipAccordion">
                    <div class="accordion-body">
                      <p><strong>{{ state.person1.name || 'Person 1' }}'s Element:</strong> {{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.celestialStem.element.name }}</p>
                      <p><strong>{{ state.person2.name || 'Person 2' }}'s Element:</strong> {{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.celestialStem.element.name }}</p>
                      <p><strong>Relationship:</strong> {{ getElementalRelationshipDescription(state.compatibilityResult.person1.yearly.yearlyCycle.cycle.celestialStem.element.name, state.compatibilityResult.person2.yearly.yearlyCycle.cycle.celestialStem.element.name) }}</p>
                      <p class="text-muted">{{ state.compatibilityResult.compatibility.elementalCompatibility.description }}. Elements interact in generating (supportive) or controlling (challenging) cycles, shaping your dynamic.</p>
                    </div>
                  </div>
                </div>
                <!-- Trigram/Hexagram Compatibility -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="trigramHeading">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#trigramCollapse" aria-expanded="false" aria-controls="trigramCollapse">
                      Trigram/Hexagram Compatibility (Score: {{ state.compatibilityResult.compatibility.trigramHexagramCompatibility.score }})
                    </button>
                  </h2>
                  <div id="trigramCollapse" class="accordion-collapse collapse" aria-labelledby="trigramHeading" data-bs-parent="#relationshipAccordion">
                    <div class="accordion-body">
                      <p><strong>{{ state.person1.name || 'Person 1' }}'s Pre-Heaven Trigrams:</strong> {{ state.compatibilityResult.person1.iching.preHeavenHexagram.above.name }} ({{ getTrigramElement(state.compatibilityResult.person1.iching.preHeavenHexagram.above.name) }}), {{ state.compatibilityResult.person1.iching.preHeavenHexagram.below.name }} ({{ getTrigramElement(state.compatibilityResult.person1.iching.preHeavenHexagram.below.name) }})</p>
                      <p><strong>{{ state.person2.name || 'Person 2' }}'s Pre-Heaven Trigrams:</strong> {{ state.compatibilityResult.person2.iching.preHeavenHexagram.above.name }} ({{ getTrigramElement(state.compatibilityResult.person2.iching.preHeavenHexagram.above.name) }}), {{ state.compatibilityResult.person2.iching.preHeavenHexagram.below.name }} ({{ getTrigramElement(state.compatibilityResult.person2.iching.preHeavenHexagram.below.name) }})</p>
                      <p><strong>Controlling Lines:</strong> {{ state.person1.name || 'Person 1' }}: {{ state.compatibilityResult.person1.iching.preHeavenHexagram.controllingLine?.line.name || 'N/A' }}, {{ state.person2.name || 'Person 2' }}: {{ state.compatibilityResult.person2.iching.preHeavenHexagram.controllingLine?.line.name || 'N/A' }}</p>
                      <p class="text-muted">{{ state.compatibilityResult.compatibility.trigramHexagramCompatibility.description }}. Trigrams and hexagrams reflect how your energies align spiritually and practically.</p>
                    </div>
                  </div>
                </div>
                <!-- Sexagenary Cycle Compatibility -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="sexagenaryHeading">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sexagenaryCollapse" aria-expanded="false" aria-controls="sexagenaryCollapse">
                      Sexagenary Cycle Compatibility (Score: {{ state.compatibilityResult.compatibility.sexagenaryCompatibility.score }})
                    </button>
                  </h2>
                  <div id="sexagenaryCollapse" class="accordion-collapse collapse" aria-labelledby="sexagenaryHeading" data-bs-parent="#relationshipAccordion">
                    <div class="accordion-body">
                      <p><strong>{{ state.person1.name || 'Person 1' }}'s Stem/Branch:</strong> {{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.celestialStem.name }} ({{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.celestialStem.element.name }}, {{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.celestialStem.polarity }}), {{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.horaryBranch.name }} ({{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.horaryBranch.element.name }}, {{ state.compatibilityResult.person1.yearly.yearlyCycle.cycle.horaryBranch.polarity }})</p>
                      <p><strong>{{ state.person2.name || 'Person 2' }}'s Stem/Branch:</strong> {{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.celestialStem.name }} ({{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.celestialStem.element.name }}, {{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.celestialStem.polarity }}), {{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.horaryBranch.name }} ({{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.horaryBranch.element.name }}, {{ state.compatibilityResult.person2.yearly.yearlyCycle.cycle.horaryBranch.polarity }})</p>
                      <p class="text-muted">{{ state.compatibilityResult.compatibility.sexagenaryCompatibility.description }}. The sexagenary cycle combines stems and branches to reveal energetic harmony or tension.</p>
                    </div>
                  </div>
                </div>
                <!-- Sub-Cycle Compatibility -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="subCycleHeading">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#subCycleCollapse" aria-expanded="false" aria-controls="subCycleCollapse">
                      Sub-Cycle Compatibility (Score: {{ state.compatibilityResult.compatibility.subCycleCompatibility.score }})
                    </button>
                  </h2>
                  <div id="subCycleCollapse" class="accordion-collapse collapse" aria-labelledby="subCycleHeading" data-bs-parent="#relationshipAccordion">
                    <div class="accordion-body">
                      <p><strong>Overview:</strong> {{ state.compatibilityResult.compatibility.subCycleCompatibility.description }}</p>
                      <p class="text-muted">Sub-cycles represent life stages aligned by calendar years, accounting for age differences.</p>
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>{{ state.person1.name || 'Person 1' }} (Age)</th>
                            <th>{{ state.person2.name || 'Person 2' }} (Age)</th>
                            <th>Alignment</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="yearData in getYearlySubCycleData()" :key="yearData.year">
                            <td>{{ yearData.year }}</td>
                            <td>
                              {{ yearData.cycle1 ? `${yearData.cycle1.hexagram.name} (${yearData.age1})` : 'N/A' }}
                            </td>
                            <td>
                              {{ yearData.cycle2 ? `${yearData.cycle2.hexagram.name} (${yearData.age2})` : 'N/A' }}
                            </td>
                            <td :style="{ color: yearData.alignment === 'Harmonious' ? 'green' : 'black' }">
                              {{ yearData.alignment }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
        name: '',
        birthDate: null,
        gender: 'MALE',
        latitude: 0,
        longitude: 0,
      },
      person2: {
        name: '',
        birthDate: null,
        gender: 'FEMALE',
        latitude: 0,
        longitude: 0,
      },
      minDate: DateTime.fromObject({ year: 1900, month: 1, day: 1 }).toJSDate(),
      maxDate: DateTime.now().toJSDate(),
      compatibilityResult: null,
      showBirthdayHistory: false,
      showBirthdayEntry: true,
      showCompatibilityResults: false,
      editingBirthday: null,
      editingPersonNumber: null,
      activeTab: 'overview',
      loading: false,
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

    const getTrigramElement = (trigramName) => {
      for (const element in astro.laterHeavenElements) {
        if (astro.laterHeavenElements[element].trigrams.some(t => t.name === trigramName)) {
          return element;
        }
      }
      return 'Unknown';
    };

    const getElementalRelationshipDescription = (element1, element2) => {
      if (!astro.elementRelationships) {
        console.error('elementRelationships is undefined');
        return 'Unable to determine elemental relationship';
      }
      const { generatingCycle, controllingCycle } = astro.elementRelationships;
      if (!generatingCycle || !controllingCycle) {
        console.error('Invalid elementRelationships structure');
        return 'Unable to determine elemental relationship';
      }
      if (!element1 || !element2) {
        return 'Invalid elements provided';
      }
      if (generatingCycle[element1] === element2) {
        return `${element1} generates ${element2} (Supportive)`;
      } else if (generatingCycle[element2] === element1) {
        return `${element2} generates ${element1} (Supportive)`;
      } else if (controllingCycle[element1] === element2) {
        return `${element1} controls ${element2} (Challenging)`;
      } else if (controllingCycle[element2] === element1) {
        return `${element2} controls ${element1} (Challenging)`;
      } else if (element1 === element2) {
        return `Same element: ${element1} (Harmonious)`;
      }
      return 'Neutral relationship';
    };

    const validatePersonData = (person) => {
      const errors = [];
      if (!person.name || person.name.trim() === '') {
        errors.push('Name is required.');
      }
      if (!person.birthDate || !DateTime.fromJSDate(person.birthDate).isValid) {
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
        const person1Errors = validatePersonData(state.person1);
        if (person1Errors.length > 0) {
          throw new Error(`Person 1: ${person1Errors.join(' ')}`);
        }
        const person2Errors = validatePersonData(state.person2);
        if (person2Errors.length > 0) {
          throw new Error(`Person 2: ${person2Errors.join(' ')}`);
        }

        birthdayStore.addBirthday({
          id: Date.now(),
          name: state.person1.name,
          birthday: DateTime.fromJSDate(state.person1.birthDate).toISO(),
          gender: state.person1.gender,
          coords: { latitude: state.person1.latitude, longitude: state.person1.longitude },
        });

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
      person.name = birthday.name || '';
      person.birthDate = DateTime.fromISO(birthday.birthday).toJSDate();
      person.gender = birthday.gender;
      person.latitude = birthday.coords.latitude;
      person.longitude = birthday.coords.longitude;
    };

    const startEditingBirthday = (birthday) => {
      if (state.person1.name === birthday.name) {
        state.editingPersonNumber = 1;
      } else if (state.person2.name === birthday.name) {
        state.editingPersonNumber = 2;
      } else {
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
        state.loading = true;
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
        
        const result = await astro.calculateCompatibilityByYear(
          state.person1.birthDate,
          gender1,
          state.person1.latitude,
          state.person1.longitude,
          state.person2.birthDate,
          gender2,
          state.person2.latitude,
          state.person2.longitude
        );

        // Log sub-cycles for debugging
        console.log('Person 1 Sub-Cycles:', JSON.stringify(result.person1?.iching?.preHeavenBirthSubCycles, null, 2));
        console.log('Person 2 Sub-Cycles:', JSON.stringify(result.person2?.iching?.preHeavenBirthSubCycles, null, 2));

        // Validate sub-cycles
        if (!result.person1?.iching?.preHeavenBirthSubCycles || !result.person2?.iching?.preHeavenBirthSubCycles) {
          console.warn('Sub-cycles data is incomplete:', {
            person1SubCycles: result.person1?.iching?.preHeavenBirthSubCycles,
            person2SubCycles: result.person2?.iching?.preHeavenBirthSubCycles,
          });
          result.person1.iching.preHeavenBirthSubCycles = [];
          result.person2.iching.preHeavenBirthSubCycles = [];
        }

        // Calculate natal hexagrams
        result.person1.natalHexagram = await astro.calculateNatalHexagram(
          DateTime.fromJSDate(state.person1.birthDate).toFormat('yyyy-MM-dd'),
          DateTime.fromJSDate(state.person1.birthDate).toFormat('HH:mm')
        );
        result.person2.natalHexagram = await astro.calculateNatalHexagram(
          DateTime.fromJSDate(state.person2.birthDate).toFormat('yyyy-MM-dd'),
          DateTime.fromJSDate(state.person2.birthDate).toFormat('HH:mm')
        );

        state.compatibilityResult = result;
        state.showCompatibilityResults = true;
        state.activeTab = 'overview';
      } catch (error) {
        console.error('Error calculating compatibility:', error);
        alert(`Failed to calculate compatibility: ${error.message}`);
      } finally {
        state.loading = false;
      }
    };

    const getYearlySubCycleData = () => {
        if (!state.compatibilityResult) return [];
        
        const year1 = DateTime.fromJSDate(state.person1.birthDate).year;
        const year2 = DateTime.fromJSDate(state.person2.birthDate).year;
        const startYear = Math.max(year1, year2);
        const endYear = Math.min(year1, year2) + 81;
        
        const cycles1 = state.compatibilityResult.person1.iching.preHeavenBirthSubCycles || [];
        const cycles2 = state.compatibilityResult.person2.iching.preHeavenBirthSubCycles || [];
        const gender1 = state.person1.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
        const gender2 = state.person2.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
        const baseAge1 = gender1 === astro.Gender.MALE ? 8 : 7;
        const baseAge2 = gender2 === astro.Gender.MALE ? 8 : 7;

        const getActiveCycle = (birthYear, targetYear, cycles, baseAge) => {
          const age = targetYear - birthYear;
          if (age < 0 || age > 81) return null;
          const cycleIndex = Math.floor(age / baseAge);
          return cycles[cycleIndex] || null;
        };

        const yearlyData = [];
        for (let year = startYear; year <= endYear; year++) {
          const age1 = year - year1;
          const age2 = year - year2;
          const cycle1 = getActiveCycle(year1, year, cycles1, baseAge1);
          const cycle2 = getActiveCycle(year2, year, cycles2, baseAge2);
          
          let alignment = 'Neutral';
          if (cycle1 && cycle2 && cycle1.hexagramBinary === cycle2.hexagramBinary) {
            alignment = 'Harmonious';
          }
          
          yearlyData.push({
            year,
            age1,
            age2,
            cycle1,
            cycle2,
            alignment,
          });
        }
        
        return yearlyData;
      };

    const handleImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        birthdayStore.importBirthdays(file);
        event.target.value = '';
      }
    };

    // Watch name changes only on explicit selection
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
      getTrigramElement,
      getElementalRelationshipDescription,
      saveBirthdays,
      loadBirthday,
      startEditingBirthday,
      updateBirthday,
      cancelEditing,
      calculateCompatibility,
      handleImport,
      getYearlySubCycleData,
    };
  },
};
</script>

<style scoped>
.input-narrow {
  max-width: 250px;
  margin: 0 auto;
}
.btn-narrow {
  width: 100%;
  max-width: 250px;
}
.card-text.display-4 {
  font-size: 2.5rem;
}
.card-text.display-6 {
  font-size: 1.25rem;
}
</style>