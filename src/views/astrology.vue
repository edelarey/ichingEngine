<template>
  <div class="astrology-page">
    <!-- Page Header (Inline) -->
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Astrology Of The I Ching</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Astrology of the I Ching</li>
          </ol>
        </nav>
      </div>
    </header>

    <!-- Tabbed Interface -->
    <div class="container my-6">
      <ul class="nav nav-tabs" id="astrologyTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="summary-tab" data-bs-toggle="tab" data-bs-target="#summary" type="button" role="tab" aria-controls="summary" aria-selected="true">Summary</button>
       </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="birthday-history-tab" data-bs-toggle="tab" data-bs-target="#birthday-history" type="button" role="tab" aria-controls="birthday-history" aria-selected="false">Birthday History</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="birthday-entry-tab" data-bs-toggle="tab" data-bs-target="#birthday-entry" type="button" role="tab" aria-controls="birthday-entry" aria-selected="false">Birthday Entry</button>
         </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="hexagrams-tab" data-bs-toggle="tab" data-bs-target="#hexagrams" type="button" role="tab" aria-controls="hexagrams" aria-selected="false">Heavenly Hexagrams</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="trigrams-tab" data-bs-toggle="tab" data-bs-target="#trigrams" type="button" role="tab" aria-controls="trigrams" aria-selected="false">Heaven & Earth Trigrams</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="yearly-cycle-tab" data-bs-toggle="tab" data-bs-target="#yearly-cycle" type="button" role="tab" aria-controls="yearly-cycle" aria-selected="false">Yearly Stem & Branch</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="monthly-cycle-tab" data-bs-toggle="tab" data-bs-target="#monthly-cycle" type="button" role="tab" aria-controls="monthly-cycle" aria-selected="false">Monthly Stem & Branch</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="daily-cycle-tab" data-bs-toggle="tab" data-bs-target="#daily-cycle" type="button" role="tab" aria-controls="daily-cycle" aria-selected="false">Daily Stem & Branch </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="early-later-life-tab" data-bs-toggle="tab" data-bs-target="#early-later-life" type="button" role="tab" aria-controls="early-later-life" aria-selected="false">Early & Later Yearly Cycles</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="daily-cycles-tab" data-bs-toggle="tab" data-bs-target="#daily-cycles" type="button" role="tab" aria-controls="daily-cycles" aria-selected="false">Early & Later Daily Cycles</button>
        </li>
        
      </ul>

      <div class="tab-content" id="astrologyTabContent">
  <div class="tab-pane fade show active" id="summary" role="tabpanel" aria-labelledby="summary-tab">
    <div class="row justify-content-center mt-4">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="card text-center">
          <h3 class="card-header py-3">I Ching Astrology Summary</h3>
          <div class="card-body">
            <div v-if="state.cycle">
              <h5 class="card-title mb-3">Personal Details</h5>
              <p><strong>Name:</strong> {{ state.name }}</p>
              <p><strong>Birth Date:</strong> {{ dateTimeFormatSimple(state.birthDate) }}</p>
              <p><strong>Gender:</strong> {{ state.gender }}</p>
              <p><strong>Hemisphere:</strong> {{ state.hemisphere }}</p>
              <h5 class="card-title mt-4 mb-3">Core Hexagrams</h5>
              <p><strong>Pre-Heaven Hexagram:</strong> <router-link :to="`/hexagram_detail?hexagram=${state.preHeavenHexagram?.binary}`">{{ state.preHeavenHexagram?.name }}</router-link> ({{ state.preHeavenHexagram?.symbol }}) ({{ state.preHeavenHexagram?.hexagram }})</p>
              <p><strong>Later-Heaven Hexagram:</strong> <router-link :to="`/hexagram_detail?hexagram=${state.laterHeavenHexagram?.binary}`">{{ state.laterHeavenHexagram?.name }}</router-link> ({{ state.laterHeavenHexagram?.symbol }}) ({{ state.laterHeavenHexagram?.hexagram }})</p>
              <p><strong>Time of Birth Hexagram:</strong> <router-link :to="`/hexagram_detail?hexagram=${state.timeOfBirthHexagram?.hexagram.binary}`">{{ state.timeOfBirthHexagram?.hexagram.name }}</router-link> ({{ state.timeOfBirthHexagram?.hexagram.symbol }}) ({{ state.timeOfBirthHexagram?.hexagram.hexagram }})</p>
              <h5 class="card-title mt-4 mb-3">Trigrams</h5>
              <p><strong>Heavenly Trigram:</strong> <router-link :to="`/trigram_detail?trigram=${state.heavenlyTrigram?.trigram.binary}`">{{ state.heavenlyTrigram?.trigram.name }}</router-link> ({{ state.heavenlyTrigram?.trigram.trigram }})</p>
              <p><strong>Earthly Trigram:</strong> <router-link :to="`/trigram_detail?trigram=${state.earthlyTrigram?.trigram.binary}`">{{ state.earthlyTrigram?.trigram.name }}</router-link> ({{ state.earthlyTrigram?.trigram.trigram }})</p>
              <h5 class="card-title mt-4 mb-3">Current Life Stage</h5>
              <p v-if="state.selectedPreHeavenBirthSubCycle"><strong>Early Life:</strong> <router-link :to="`/hexagram_detail?hexagram=${state.selectedPreHeavenBirthSubCycle.hexagram.binary}`">{{ state.selectedPreHeavenBirthSubCycle.hexagram.name }}</router-link> ({{ state.selectedPreHeavenBirthSubCycle.hexagram.hexagram }}) (Age {{ state.selectedPreHeavenBirthSubCycle.age }})</p>
              <p v-if="state.selectedLaterHeavenBirthSubCycle"><strong>Later Life:</strong> <router-link :to="`/hexagram_detail?hexagram=${state.laterHeavenBirthSubCycleHexagram?.binary}`">{{ state.laterHeavenBirthSubCycleHexagram?.name }}</router-link> ({{ state.laterHeavenBirthSubCycleHexagram?.hexagram }}) (Age {{ state.selectedLaterHeavenBirthSubCycle.age }})</p>
              <h5 class="card-title mt-4 mb-3">Cycles</h5>
              <p>
                <strong>Yearly Cycle ({{ formatBirthYear }}):</strong> 
                {{ state.sexagenaryCycle?.celestialStem.name }} 
                (<router-link :to="`/trigram_detail?trigram=${state.sexagenaryCycle?.celestialStem.trigram.binary}`">{{ state.sexagenaryCycle?.celestialStem.trigram.trigram }}</router-link>) 
                - {{ state.sexagenaryCycle?.horaryBranch.name }} 
                ({{ state.sexagenaryCycle?.horaryBranch.animal }}) 
                <img :src="`/images/${state.sexagenaryCycle?.horaryBranch.animal.toLowerCase()}.jpg`" alt="Yearly Cycle Animal" style="width: 100px; height: 100px; margin-left: 10px; vertical-align: middle;" />
              </p>
              <p>
                <strong>Monthly Cycle ({{ formatBirthMonth }}):</strong> 
                {{ state.birthStemsandBranches?.celestialStem.name }} 
                (<router-link :to="`/trigram_detail?trigram=${state.birthStemsandBranches?.celestialStem.trigram.binary}`">{{ state.birthStemsandBranches?.celestialStem.trigram.trigram }}</router-link>) 
                - {{ state.birthStemsandBranches?.horaryBranch.name }} 
                ({{ state.birthStemsandBranches?.horaryBranch.animal }}) 
                <img :src="`/images/${state.birthStemsandBranches?.horaryBranch.animal.toLowerCase()}.jpg`" alt="Monthly Cycle Animal" style="width: 100px; height: 100px; margin-left: 10px; vertical-align: middle;"/>
              </p>
              <p>
                <strong>Daily Cycle ({{ formatBirthDay }}):</strong> 
                {{ state.dailyStemsandBranches?.celestialStem.name }} 
                (<router-link :to="`/trigram_detail?trigram=${state.dailyStemsandBranches?.celestialStem.trigram.binary}`">{{ state.dailyStemsandBranches?.celestialStem.trigram.trigram }}</router-link>) 
                - {{ state.dailyStemsandBranches?.horaryBranch.name }} 
                ({{ state.dailyStemsandBranches?.horaryBranch.animal }}) 
                <img :src="`/images/${state.dailyStemsandBranches?.horaryBranch.animal.toLowerCase()}.jpg`" alt="Daily Cycle Animal" style="width: 100px; height: 100px; margin-left: 10px; vertical-align: middle;" />
              </p>
            </div>
            <div v-else>
              <p>Please enter birth details and consult to view your summary.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

     

         <!-- Birthday History Tab -->
        <div class="tab-pane fade" id="birthday-history" role="tabpanel" aria-labelledby="birthday-history-tab">
          <div class="row justify-content-center mt-4">
            <div class="col-12 col-md-8 col-lg-6">
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
                        <button @click="loadBirthday(birthday)" class="btn btn-primary btn-sm me-2">Load</button>
                        <button @click="startEditingBirthday(birthday)" class="btn btn-primary btn-sm me-2">Edit</button>
                        <button @click="birthdayStore.removeBirthday(birthday.id)" class="btn btn-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Birthday Entry Tab -->
        <div class="tab-pane fade" id="birthday-entry" role="tabpanel" aria-labelledby="birthday-entry-tab">
          <div class="row justify-content-center mt-4">
            <div class="col-12 col-md-10 col-lg-8">
              <div class="card text-center">
                <h3 class="card-header py-3">Astrological Hexagrams in the I-Ching Sexagenary Cycle</h3>
                <div class="card-body" v-if="state.cycle">
                  <div class="row">
                    <div class="col-12">
                      <h5 class="card-title mb-2">Gender</h5>
                      <p :style="{ color: colorClass }" class="card-text display-5 mb-3">{{ state.gender }}</p>
                      <h5 class="card-title mb-2">Birth Date</h5>
                      <p :style="{ color: colorClass }" class="card-text display-6 mb-3">{{ dateTimeFormatSimple(state.birthDate) }}</p>
                      <h6 class="card-subtitle mb-2">Hemisphere</h6>
                      <p :style="{ color: colorClass }" class="card-text display-5 mb-3">{{ state.hemisphere }}</p>
                      <h6 class="card-subtitle mb-2">Sexagenary Cycle</h6>
                      <p :style="{ color: colorClass }" class="card-text display-5 mb-2">{{ state.cycle.cycleName }}</p>
                      <p :style="{ color: colorClass }" class="card-text display-6">{{ state.cycle.startYear }} - {{ state.cycle.endYear }}</p>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <h5 class="card-title mb-3">Birth Details</h5>
                  <div class="row justify-content-center">
                    <!-- Name Input -->
                    <div class="col-12 col-md-8 col-lg-6 mb-3">
                      <h6 :style="{ color: colorClass }" class="card-text mb-2">Name</h6>
                      <input
                        v-model="state.name"
                        :list="`saved-names-${state.id}`"
                        class="form-control input-narrow"
                        placeholder="Type your name or select from the list"
                      />
                      <datalist :id="`saved-names-${state.id}`">
                        <option v-for="birthday in birthdayList" :key="birthday.id" :value="birthday.name">{{ birthday.name }}</option>
                      </datalist>
                    </div>
                    <!-- Birth Date Input -->
                    <div class="col-12 col-md-8 col-lg-6 mb-3">
                      <h6 :style="{ color: colorClass }" class="card-text mb-2">Birth Date</h6>
                      <Datepicker
                        placeholder="Birth Date"
                        v-model="state.birthDate"
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
                    <div class="col-12 col-md-8 col-lg-6 mb-3">
                      <h6 :style="{ color: colorClass }" class="card-text mb-2">Gender</h6>
                      <select v-model="state.gender" class="form-control input-narrow">
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                      </select>
                    </div>
                    <!-- Latitude and Longitude -->
                    <div class="col-12 col-md-8 col-lg-6 mb-3">
                      <div class="row justify-content-center">
                        <div class="col-12 col-md-6 mb-3 mb-md-0">
                          <h6 :style="{ color: colorClass }" class="card-text mb-2">Latitude</h6>
                          <input v-model.number="state.latitude" class="form-control input-narrow" placeholder="0.00 Latitude" />
                        </div>
                        <div class="col-12 col-md-6">
                          <h6 :style="{ color: colorClass }" class="card-text mb-2">Longitude</h6>
                          <input v-model.number="state.longitude" class="form-control input-narrow" placeholder="0.00 Longitude" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Buttons Section -->
                  <div class="row justify-content-center">
                    <div class="col-12 col-md-8 col-lg-6 mb-3">
                      <button @click="consult" class="btn btn-primary btn-narrow">Consult</button>
                    </div>
                    <div class="col-12 col-md-8 col-lg-6 mb-3">
                      <button v-if="!state.editingBirthday" @click="saveBirthday" class="btn btn-primary btn-narrow">Save Birthday</button>
                      <div v-else>
                        <button @click="updateBirthday" class="btn btn-success btn-narrow">Update Birthday</button>
                        <button @click="cancelEditing" class="btn btn-secondary btn-narrow">Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hexagrams Tab -->
        <div class="tab-pane fade" id="hexagrams" role="tabpanel" aria-labelledby="hexagrams-tab">
          <div class="row justify-content-center mt-4" v-if="state.cycle">
            <div class="col-12">
              <div class="card text-center">
                <h3 class="card-header">Pre-Heaven and Later Heaven Hexagrams</h3>
                <div class="card-body">
                  <div class="row justify-content-center">
                    <!-- Pre-Heaven Hexagram -->
                    <div class="col-12 col-md-6 col-lg-5 mb-4">
                      <div class="card text-center">
                        <div class="card-body" v-if="state.preHeavenHexagram">
                          <h5 class="card-title">Pre-Heaven Hexagram</h5>
                          <p class="card-text display-3">{{ state.preHeavenHexagram.name }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-1">{{ state.preHeavenHexagram.symbol }}</p>
                          <div class="center-content">
                            <svg
                              class="hexagram-svg"
                              :width="state.graphics.svgWidth"
                              :height="state.graphics.svgHeight"
                              :viewBox="`0 0 ${state.graphics.svgWidth + 60} ${state.graphics.svgHeight}`"
                            >
                              <g :transform="`translate(${(state.graphics.svgWidth - state.graphics.lineLength) / 2}, 20)`">
                                <g
                                  v-if="state.preHeavenHexagram.above?.lineArray"
                                  v-for="(line, index) in [...state.preHeavenHexagram.above.lineArray].reverse()"
                                  :key="'heaven' + index"
                                  :transform="`translate(0, ${(index + 1) * state.graphics.lineSpacing})`"
                                >
                                  <line v-if="index === 0" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" stroke="white" :stroke-width="state.graphics.lineWidth" />
                                  <text v-if="index === 0" :x="state.graphics.lineLength + 10" y="-20" dy=".35em" fill="black">Age</text>
                                  <line v-if="line.alternate === 'YOUNGYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'YOUNGYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'YOUNGYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <text :x="state.graphics.lineLength + 10" y="0" dy=".35em" fill="black">{{ line.yearRange[0] }} - {{ line.yearRange[1] }}</text>
                                  <text>{{ updateGlobalPreHeavenLineIndex() }}</text>
                                </g>
                                <g
                                  v-if="state.preHeavenHexagram.below?.lineArray"
                                  v-for="(line, index) in [...state.preHeavenHexagram.below.lineArray].reverse()"
                                  :key="'earth' + index"
                                  :transform="`translate(0, ${(index + 4) * state.graphics.lineSpacing + 20})`"
                                >
                                  <line v-if="line.alternate === 'YOUNGYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'YOUNGYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'YOUNGYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determinePreHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <text :x="state.graphics.lineLength + 10" y="0" dy=".35em" fill="black">{{ line.yearRange[0] }} - {{ line.yearRange[1] }}</text>
                                  <text>{{ updateGlobalPreHeavenLineIndex() }}</text>
                                </g>
                              </g>
                            </svg>
                          </div>
                          <p :style="{ color: colorClass }" class="card-text display-6">{{ state.preHeavenHexagram.translation.split(',')[0] }}</p>
                          <div class="card-body" v-if="state.preHeavenHexagram.controllingLine">
                            <h3 class="card-title">Controlling Line</h3>
                            <p class="card-text display-10">{{ state.preHeavenHexagram.controllingLine.trigram }} Trigram {{ state.preHeavenHexagram.controllingLine.linePosition }} Line ({{ state.preHeavenHexagram.controllingLine.line.name }})</p>
                          </div>
                          <div class="card-body">
                            <h3 class="card-title">Summary</h3>
                            <p class="card-text display-10" v-html="state.preHeavenHexagram.summary"></p>
                          </div>
                          <router-link :to="`/hexagram_detail?hexagram=${state.preHeavenHexagram.binary}`" class="btn btn-primary">Hexagram Detail</router-link>
                        </div>
                      </div>
                    </div>
                    <!-- Later-Heaven Hexagram -->
                    <div class="col-12 col-md-6 col-lg-5 mb-4">
                      <div class="card text-center">
                        <div class="card-body" v-if="state.laterHeavenHexagram">
                          <h5 class="card-title">Later-Heaven Hexagram</h5>
                          <p class="card-text display-3">{{ state.laterHeavenHexagram.name }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-1">{{ state.laterHeavenHexagram.symbol }}</p>
                          <div class="center-content">
                            <svg
                              class="hexagram-svg"
                              :width="state.graphics.svgWidth"
                              :height="state.graphics.svgHeight"
                              :viewBox="`0 0 ${state.graphics.svgWidth + 60} ${state.graphics.svgHeight}`"
                            >
                              <g :transform="`translate(${(state.graphics.svgWidth - state.graphics.lineLength) / 2}, 20)`">
                                <g
                                  v-if="state.laterHeavenHexagram.above?.lineArray"
                                  v-for="(line, index) in [...state.laterHeavenHexagram.above.lineArray].reverse()"
                                  :key="'heaven' + index"
                                  :transform="`translate(0, ${(index + 1) * state.graphics.lineSpacing})`"
                                >
                                  <line v-if="index === 0" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" stroke="white" :stroke-width="state.graphics.lineWidth" />
                                  <text v-if="index === 0" :x="state.graphics.lineLength + 10" y="-20" dy=".35em" fill="black">Age</text>
                                  <line v-if="line.alternate === 'YOUNGYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'YOUNGYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'YOUNGYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <text :x="state.graphics.lineLength + 10" y="0" dy=".35em" fill="black">{{ line.yearRange[0] }} - {{ line.yearRange[1] }}</text>
                                  <text>{{ updateGlobalLaterHeavenLineIndex() }}</text>
                                </g>
                                <g
                                  v-if="state.laterHeavenHexagram.below?.lineArray"
                                  v-for="(line, index) in [...state.laterHeavenHexagram.below.lineArray].reverse()"
                                  :key="'earth' + index"
                                  :transform="`translate(0, ${(index + 4) * state.graphics.lineSpacing + 20})`"
                                >
                                  <line v-if="line.alternate === 'YOUNGYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'YOUNGYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'YOUNGYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <line v-if="line.alternate === 'OLDYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineLaterHeavenLineColor(line)" :stroke-width="state.graphics.lineWidth" />
                                  <text :x="state.graphics.lineLength + 10" y="0" dy=".35em" fill="black">{{ line.yearRange[0] }} - {{ line.yearRange[1] }}</text>
                                  <text>{{ updateGlobalLaterHeavenLineIndex() }}</text>
                                </g>
                              </g>
                            </svg>
                          </div>
                          <p :style="{ color: colorClass }" class="card-text display-6">{{ state.laterHeavenHexagram.translation.split(',')[0] }}</p>
                          <div class="card-body" v-if="state.laterHeavenHexagram.controllingLine">
                            <h3 class="card-title">Controlling Line</h3>
                            <p class="card-text display-10">{{ state.laterHeavenHexagram.controllingLine.trigram }} Trigram {{ state.laterHeavenHexagram.controllingLine.linePosition }} Line ({{ state.laterHeavenHexagram.controllingLine.line.name }})</p>
                          </div>
                          <div class="card-body">
                            <h3 class="card-title">Summary</h3>
                            <p class="card-text display-10" v-html="state.laterHeavenHexagram.summary"></p>
                          </div>
                          <router-link :to="`/hexagram_detail?hexagram=${state.laterHeavenHexagram.binary}`" class="btn btn-primary">Hexagram Detail</router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Trigrams Tab -->
        <div class="tab-pane fade" id="trigrams" role="tabpanel" aria-labelledby="trigrams-tab">
          <div class="row justify-content-center mt-4" v-if="state.cycle">
            <div class="col-12 col-sm-6 mb-4">
              <div class="card text-center">
                <div class="card-body" v-if="state.heavenlyTrigram && state.earthlyTrigram">
                  <h5 class="card-title">Heavenly and Earthly Trigrams</h5>
                  <div class="row justify-content-center">
                    <div class="col-12 col-sm-5">
                      <p class="card-text display-3">{{ state.heavenlyTrigram.trigram.name }}</p>
                      <p :style="{ color: colorClass }" class="card-text display-1">{{ state.heavenlyTrigram.trigram.symbol }}</p>
                      <p :style="{ color: colorClass }" class="card-text display-1">{{ state.heavenlyTrigram.trigram.trigram }}</p>
                      <p :style="{ color: colorClass }" class="card-text display-6">{{ state.heavenlyTrigram.trigram.description.bodyPart }}</p>
                      <router-link :to="`/trigram_detail?trigram=${state.heavenlyTrigram.trigram.binary}`" class="btn btn-primary">Heavenly Detail</router-link>
                    </div>
                    <div class="col-12 col-sm-5">
                      <p class="card-text display-3">{{ state.earthlyTrigram.trigram.name }}</p>
                      <p :style="{ color: colorClass }" class="card-text display-1">{{ state.earthlyTrigram.trigram.symbol }}</p>
                      <p :style="{ color: colorClass }" class="card-text display-1">{{ state.earthlyTrigram.trigram.trigram }}</p>
                      <p :style="{ color: colorClass }" class="card-text display-6">{{ state.earthlyTrigram.trigram.description.bodyPart }}</p>
                      <router-link :to="`/trigram_detail?trigram=${state.earthlyTrigram.trigram.binary}`" class="btn btn-primary">Earthly Detail</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 mb-4">
              <div class="card text-center">
                <div class="card-body" v-if="state.timeOfBirthHexagram">
                  <h5 class="card-title">Time of Birth Hexagram</h5>
                  <p class="card-text display-3">{{ state.timeOfBirthHexagram.hexagram.name }}</p>
                  <p :style="{ color: colorClass }" class="card-text display-1">{{ state.timeOfBirthHexagram.hexagram.symbol }}</p>
                  <p :style="{ color: colorClass }" class="card-text display-1">{{ state.timeOfBirthHexagram.hexagram.hexagram }}</p>
                  <p :style="{ color: colorClass }" class="card-text display-6">{{ state.timeOfBirthHexagram.hexagram.translation.split(',')[0] }}</p>
                  <div class="card-body">
                    <h3 class="card-title">Summary</h3>
                    <p class="card-text display-10" v-html="state.timeOfBirthHexagram.hexagram.summary"></p>
                  </div>
                  <router-link :to="`/hexagram_detail?hexagram=${state.timeOfBirthHexagram.hexagram.binary}`" class="btn btn-primary">Hexagram Detail</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Early/Later Life Tab -->
        <div class="tab-pane fade" id="early-later-life" role="tabpanel" aria-labelledby="early-later-life-tab">
          <div class="row justify-content-center mt-4" v-if="state.cycle">
            <div class="col-12 col-sm-6 mb-4">
              <div class="card text-center">
                <div class="card-body" v-if="state.preHeavenBirthSubCycles.length">
                  <h5 class="card-title">Early Life Yearly Cycles</h5>
                  <select v-model="state.selectedPreHeavenYear" class="form-control input-narrow">
                    <option v-for="subCycle in state.preHeavenBirthSubCycles" :key="subCycle.year" :value="subCycle.year">{{ subCycle.year + ' - ' + subCycle.age }}</option>
                  </select>
                  <div v-if="state.selectedPreHeavenBirthSubCycle">
                    <p class="card-text display-3">{{ state.selectedPreHeavenBirthSubCycle.hexagram.name }}</p>
                    <p :style="{ color: colorClass }" class="card-text display-1">{{ state.selectedPreHeavenBirthSubCycle.hexagram.symbol }}</p>
                    <div class="center-content">
                      <svg
                        class="hexagram-svg"
                        :width="state.graphics.svgWidth"
                        :height="state.graphics.svgHeight"
                        :viewBox="`0 0 ${state.graphics.svgWidth} ${state.graphics.svgHeight}`"
                      >
                        <g :transform="`translate(${(state.graphics.svgWidth - state.graphics.lineLength) / 2}, 20)`">
                          <g
                            v-for="(line, index) in [...state.selectedPreHeavenBirthSubCycle.hexagram.above.lineArray].reverse()"
                            :key="'heaven' + index"
                            :transform="`translate(0, ${(index + 1) * state.graphics.lineSpacing})`"
                          >
                            <line v-if="index === 0" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" stroke="white" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'YOUNGYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'YOUNGYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'YOUNGYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <text>{{ updateGlobalEarlyLifeLineIndex() }}</text>
                          </g>
                          <g
                            v-for="(line, index) in [...state.selectedPreHeavenBirthSubCycle.hexagram.below.lineArray].reverse()"
                            :key="'earth' + index"
                            :transform="`translate(0, ${(index + 4) * state.graphics.lineSpacing + 20})`"
                          >
                            <line v-if="line.alternate === 'YOUNGYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'YOUNGYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'YOUNGYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedPreHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <text>{{ updateGlobalEarlyLifeLineIndex() }}</text>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <p :style="{ color: colorClass }" class="card-text display-6">{{ state.selectedPreHeavenBirthSubCycle.hexagram.translation.split(',')[0] }}</p>
                    <div class="card-body" v-if="state.selectedPreHeavenBirthSubCycle">
                      <h3 class="card-title">Controlling Line</h3>
                      <p class="card-text display-10">Age {{ state.selectedPreHeavenBirthSubCycle.age }}</p>
                      <h3 class="card-title">Before Transformation</h3>
                      <p class="card-text display-10">{{ state.selectedPreHeavenBirthSubCycle.controllingLine.trigram }} Trigram {{ state.selectedPreHeavenBirthSubCycle.controllingLine.linePosition }} Line ({{ state.selectedPreHeavenBirthSubCycle.controllingLine.line.name }})</p>
                    </div>
                    <div class="card-body">
                      <h3 class="card-title">Summary</h3>
                      <p class="card-text display-10" v-html="state.selectedPreHeavenBirthSubCycle.hexagram.summary"></p>
                    </div>
                    <router-link :to="`/hexagram_detail?hexagram=${state.selectedPreHeavenBirthSubCycle.hexagram.binary}`" class="btn btn-primary">Hexagram Detail</router-link>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 mb-4">
              <div class="card text-center">
                <div class="card-body" v-if="state.laterHeavenBirthSubCycles.length">
                  <h5 class="card-title">Later Life Yearly Cycles</h5>
                  <select v-model="state.selectedLaterHeavenYear" class="form-control input-narrow">
                    <option v-for="subCycle in state.laterHeavenBirthSubCycles" :key="subCycle.year" :value="subCycle.year">{{ subCycle.year + ' - ' + subCycle.age }}</option>
                  </select>
                  <div v-if="state.laterHeavenBirthSubCycleHexagram">
                    <p class="card-text display-3">{{ state.laterHeavenBirthSubCycleHexagram.name }}</p>
                    <p :style="{ color: colorClass }" class="card-text display-1">{{ state.laterHeavenBirthSubCycleHexagram.symbol }}</p>
                    <div class="center-content">
                      <svg
                        class="hexagram-svg"
                        :width="state.graphics.svgWidth"
                        :height="state.graphics.svgHeight"
                        :viewBox="`0 0 ${state.graphics.svgWidth} ${state.graphics.svgHeight}`"
                      >
                        <g :transform="`translate(${(state.graphics.svgWidth - state.graphics.lineLength) / 2}, 20)`">
                          <g
                            v-for="(line, index) in [...state.laterHeavenBirthSubCycleHexagram.above.lineArray].reverse()"
                            :key="'heaven' + index"
                            :transform="`translate(0, ${(index + 1) * state.graphics.lineSpacing})`"
                          >
                            <line v-if="index === 0" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" stroke="white" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'YOUNGYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'YOUNGYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'YOUNGYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Above', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <text>{{ updateGlobalLaterLifeLineIndex() }}</text>
                          </g>
                          <g
                            v-for="(line, index) in [...state.laterHeavenBirthSubCycleHexagram.below.lineArray].reverse()"
                            :key="'earth' + index"
                            :transform="`translate(0, ${(index + 4) * state.graphics.lineSpacing + 20})`"
                          >
                            <line v-if="line.alternate === 'YOUNGYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'YOUNGYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'YOUNGYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYANG'" :x1="0" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYIN'" :x1="0" :y1="0" :x2="state.graphics.lineLength / 2 - state.graphics.gapWidth" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <line v-if="line.alternate === 'OLDYIN'" :x1="state.graphics.lineLength / 2 + state.graphics.gapWidth" :y1="0" :x2="state.graphics.lineLength" :y2="0" :stroke="determineSelectedLaterHeavenBirthSubCycleLineColor('Below', line, index)" :stroke-width="state.graphics.lineWidth" />
                            <text>{{ updateGlobalLaterLifeLineIndex() }}</text>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <p :style="{ color: colorClass }" class="card-text display-6">{{ state.laterHeavenBirthSubCycleHexagram.translation.split(',')[0] }}</p>
                    <div class="card-body" v-if="state.selectedLaterHeavenBirthSubCycle">
                      <h3 class="card-title">Controlling Line</h3>
                      <p class="card-text display-10">Age {{ state.selectedLaterHeavenBirthSubCycle.age }}</p>
                      <h3 class="card-title">Before Transformation</h3>
                      <p class="card-text display-10">{{ state.selectedLaterHeavenBirthSubCycle.controllingLine.trigram }} Trigram {{ state.selectedLaterHeavenBirthSubCycle.controllingLine.linePosition }} Line ({{ state.selectedLaterHeavenBirthSubCycle.controllingLine.line.name }})</p>
                    </div>
                    <div class="card-body">
                      <h3 class="card-title">Summary</h3>
                      <p class="card-text display-10" v-html="state.laterHeavenBirthSubCycleHexagram.summary"></p>
                    </div>
                    <router-link :to="`/hexagram_detail?hexagram=${state.laterHeavenBirthSubCycleHexagram.binary}`" class="btn btn-primary">Hexagram Detail</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Cycles Tab -->
        <div class="tab-pane fade" id="daily-cycles" role="tabpanel" aria-labelledby="daily-cycles-tab">
          <div class="row justify-content-center mt-4" v-if="state.cycle">
            <div class="col-12 col-sm-6 mb-4">
              <div class="card text-center">
                <div class="card-body" v-if="state.preHeavenDailyCycle.length">
                  <h5 class="card-title">Daily Early Life</h5>
                  <select v-model="state.selectedPreHeavenDailyCycleDate" class="form-control input-narrow">
                    <option v-for="subCycle in state.preHeavenDailyCycle" :key="subCycle.date" :value="subCycle.date">{{ subCycle.date }}</option>
                  </select>
                  <div v-if="state.preHeavenDailyCycleHexagram">
                    <p class="card-text display-3">{{ state.preHeavenDailyCycleHexagram.name }}</p>
                    <p :style="{ color: colorClass }" class="card-text display-1">{{ state.preHeavenDailyCycleHexagram.symbol }}</p>
                    <p :style="{ color: colorClass }" class="card-text display-1">{{ state.preHeavenDailyCycleHexagram.hexagram }}</p>
                    <p :style="{ color: colorClass }" class="card-text display-3">{{ state.preHeavenDailyCycleHexagram.translation.split(',')[0] }}</p>
                    <div class="card-body">
                      <h3 class="card-title">Summary</h3>
                      <p class="card-text display-10" v-html="state.preHeavenDailyCycleHexagram.summary"></p>
                    </div>
                    <router-link :to="`/hexagram_detail?hexagram=${state.preHeavenDailyCycleHexagram.binary}`" class="btn btn-primary">Hexagram Detail</router-link>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 mb-4">
              <div class="card text-center">
                <div class="card-body" v-if="state.laterHeavenDailyCycle.length">
                  <h5 class="card-title">Daily Later Life</h5>
                  <select v-model="state.selectedLaterHeavenDailyCycleDate" class="form-control input-narrow">
                    <option v-for="subCycle in state.laterHeavenDailyCycle" :key="subCycle.date" :value="subCycle.date">{{ subCycle.date }}</option>
                  </select>
                  <div v-if="state.laterHeavenDailyCycleHexagram">
                    <p class="card-text display-3">{{ state.laterHeavenDailyCycleHexagram.name }}</p>
                    <p :style="{ color: colorClass }" class="card-text display-1">{{ state.laterHeavenDailyCycleHexagram.symbol }}</p>
                    <p :style="{ color: colorClass }" class="card-text display-1">{{ state.laterHeavenDailyCycleHexagram.hexagram }}</p>
                    <p :style="{ color: colorClass }" class="card-text display-3">{{ state.laterHeavenDailyCycleHexagram.translation.split(',')[0] }}</p>
                    <div class="card-body">
                      <h3 class="card-title">Summary</h3>
                      <p class="card-text display-10" v-html="state.laterHeavenDailyCycleHexagram.summary"></p>
                    </div>
                    <router-link :to="`/hexagram_detail?hexagram=${state.laterHeavenDailyCycleHexagram.binary}`" class="btn btn-primary">Hexagram Detail</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Yearly Cycle Tab -->
        <div class="tab-pane fade" id="yearly-cycle" role="tabpanel" aria-labelledby="yearly-cycle-tab">
          <div class="row justify-content-center mt-4" v-if="state.cycle">
            <div class="col-12">
              <div class="card text-center">
                <h3 class="card-header">Yearly Stem and Branch</h3>
                <div class="card-body">
                  <div class="row justify-content-center">
                    <div class="col-12 col-sm-6 mb-4">
                      <div class="card text-center">
                        <div class="card-body" v-if="state.sexagenaryCycle">
                          <h5 class="card-title">Celestial Stem - {{ formatBirthYear }}</h5>
                          <p class="card-text display-3">{{ state.sexagenaryCycle.celestialStem.name }}</p>
                          <p class="card-text display-1">{{ state.sexagenaryCycle.celestialStem.symbol }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.sexagenaryCycle.celestialStem.element.name }} {{ state.sexagenaryCycle.celestialStem.element.bodyPart }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.sexagenaryCycle.celestialStem.trigram.name }} {{ state.sexagenaryCycle.celestialStem.trigram.symbol }} {{ state.sexagenaryCycle.celestialStem.trigram.trigram }} {{ state.sexagenaryCycle.celestialStem.trigram.description.translation.split(',')[0] }}</p>
                          <router-link :to="`/trigram_detail?trigram=${state.sexagenaryCycle.celestialStem.trigram.binary}`" class="btn btn-primary">Detail</router-link>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6 mb-4">
                      <div class="card text-center">
                        <div class="card-body" v-if="state.sexagenaryCycle">
                          <h5 class="card-title">Horary Branch - {{ formatBirthYear }}</h5>
                          <p class="card-text display-3">{{ state.sexagenaryCycle.horaryBranch.name }}</p>
                          <p class="card-text display-1">{{ state.sexagenaryCycle.horaryBranch.symbol }} {{ state.sexagenaryCycle.horaryBranch.animal }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.sexagenaryCycle.horaryBranch.element.name }} {{ state.sexagenaryCycle.horaryBranch.element.bodyPart }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.sexagenaryCycle.horaryBranch.element.trigrams[0].name }} {{ state.sexagenaryCycle.horaryBranch.element.trigrams[0].symbol }} {{ state.sexagenaryCycle.horaryBranch.element.trigrams[0].trigram }} {{ state.sexagenaryCycle.horaryBranch.element.trigrams[0].description.translation.split(',')[0] }}</p>
                          <router-link :to="`/trigram_detail?trigram=${state.sexagenaryCycle.horaryBranch.element.trigrams[0].binary}`" class="btn btn-primary">Detail</router-link>
                          <p :style="{ color: colorClass }" class="card-text display-3 mt-3">{{ state.sexagenaryCycle.horaryBranch.element.trigrams[1].name }} {{ state.sexagenaryCycle.horaryBranch.element.trigrams[1].symbol }} {{ state.sexagenaryCycle.horaryBranch.element.trigrams[1].trigram }} {{ state.sexagenaryCycle.horaryBranch.element.trigrams[1].description.translation.split(',')[0] }}</p>
                          <router-link :to="`/trigram_detail?trigram=${state.sexagenaryCycle.horaryBranch.element.trigrams[1].binary}`" class="btn btn-primary mt-2">Detail</router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Cycle Tab -->
        <div class="tab-pane fade" id="monthly-cycle" role="tabpanel" aria-labelledby="monthly-cycle-tab">
          <div class="row justify-content-center mt-4" v-if="state.cycle">
            <div class="col-12">
              <div class="card text-center">
                <h3 class="card-header">Monthly Stem and Branch</h3>
                <div class="card-body">
                  <div class="row justify-content-center">
                    <div class="col-12 col-sm-6 mb-4">
                      <div class="card text-center">
                        <div class="card-body" v-if="state.birthStemsandBranches">
                          <h5 class="card-title">Celestial Stem - {{ formatBirthMonth }}</h5>
                          <p class="card-text display-3">{{ state.birthStemsandBranches.celestialStem.name }}</p>
                          <p class="card-text display-1">{{ state.birthStemsandBranches.celestialStem.symbol }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.birthStemsandBranches.celestialStem.element.name }} {{ state.birthStemsandBranches.celestialStem.element.bodyPart }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.birthStemsandBranches.celestialStem.trigram.name }} {{ state.birthStemsandBranches.celestialStem.trigram.symbol }} {{ state.birthStemsandBranches.celestialStem.trigram.trigram }} {{ state.birthStemsandBranches.celestialStem.trigram.description.translation.split(',')[0] }}</p>
                          <router-link :to="`/trigram_detail?trigram=${state.birthStemsandBranches.celestialStem.trigram.binary}`" class="btn btn-primary">Detail</router-link>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6 mb-4">
                      <div class="card text-center">
                        <div class="card-body" v-if="state.birthStemsandBranches">
                          <h5 class="card-title">Horary Branch - {{ formatBirthMonth }}</h5>
                          <p class="card-text display-3">{{ state.birthStemsandBranches.horaryBranch.name }}</p>
                          <p class="card-text display-1">{{ state.birthStemsandBranches.horaryBranch.symbol }} {{ state.birthStemsandBranches.horaryBranch.animal }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.birthStemsandBranches.horaryBranch.element.name }} {{ state.birthStemsandBranches.horaryBranch.element.bodyPart }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.birthStemsandBranches.horaryBranch.element.trigrams[0].name }} {{ state.birthStemsandBranches.horaryBranch.element.trigrams[0].symbol }} {{ state.birthStemsandBranches.horaryBranch.element.trigrams[0].trigram }} {{ state.birthStemsandBranches.horaryBranch.element.trigrams[0].description.translation.split(',')[0] }}</p>
                          <router-link :to="`/trigram_detail?trigram=${state.birthStemsandBranches.horaryBranch.element.trigrams[0].binary}`" class="btn btn-primary">Detail</router-link>
                          <p :style="{ color: colorClass }" class="card-text display-3 mt-3">{{ state.birthStemsandBranches.horaryBranch.element.trigrams[1].name }} {{ state.birthStemsandBranches.horaryBranch.element.trigrams[1].symbol }} {{ state.birthStemsandBranches.horaryBranch.element.trigrams[1].trigram }} {{ state.birthStemsandBranches.horaryBranch.element.trigrams[1].description.translation.split(',')[0] }}</p>
                          <router-link :to="`/trigram_detail?trigram=${state.birthStemsandBranches.horaryBranch.element.trigrams[1].binary}`" class="btn btn-primary mt-2">Detail</router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Cycle Tab -->
        <div class="tab-pane fade" id="daily-cycle" role="tabpanel" aria-labelledby="daily-cycle-tab">
          <div class="row justify-content-center mt-4" v-if="state.cycle">
            <div class="col-12">
              <div class="card text-center">
                <h3 class="card-header">Daily Stem and Branch</h3>
                <div class="card-body">
                  <div class="row justify-content-center">
                    <div class="col-12 col-sm-6 mb-4">
                      <div class="card text-center">
                        <div class="card-body" v-if="state.dailyStemsandBranches">
                          <h5 class="card-title">Celestial Stem - {{ formatBirthDay }}</h5>
                          <p class="card-text display-3">{{ state.dailyStemsandBranches.celestialStem.name }}</p>
                          <p class="card-text display-1">{{ state.dailyStemsandBranches.celestialStem.symbol }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.dailyStemsandBranches.celestialStem.element.name }} {{ state.dailyStemsandBranches.celestialStem.element.bodyPart }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.dailyStemsandBranches.celestialStem.trigram.symbol }} {{ state.dailyStemsandBranches.celestialStem.trigram.trigram }} {{ state.dailyStemsandBranches.celestialStem.trigram.description.translation.split(',')[0] }}</p>
                          <router-link :to="`/trigram_detail?trigram=${state.dailyStemsandBranches.celestialStem.trigram.binary}`" class="btn btn-primary">Detail</router-link>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6 mb-4">
                      <div class="card text-center">
                        <div class="card-body" v-if="state.dailyStemsandBranches">
                          <h5 class="card-title">Horary Branch - {{ formatBirthDay }}</h5>
                          <p class="card-text display-3">{{ state.dailyStemsandBranches.horaryBranch.name }}</p>
                          <p class="card-text display-1">{{ state.dailyStemsandBranches.horaryBranch.symbol }} {{ state.dailyStemsandBranches.horaryBranch.animal }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.dailyStemsandBranches.horaryBranch.element.name }} {{ state.dailyStemsandBranches.horaryBranch.element.bodyPart }}</p>
                          <p :style="{ color: colorClass }" class="card-text display-3">{{ state.dailyStemsandBranches.horaryBranch.element.trigrams[0].name }} {{ state.dailyStemsandBranches.horaryBranch.element.trigrams[0].symbol }} {{ state.dailyStemsandBranches.horaryBranch.element.trigrams[0].trigram }} {{ state.dailyStemsandBranches.horaryBranch.element.trigrams[0].description.translation.split(',')[0] }}</p>
                          <router-link :to="`/trigram_detail?trigram=${state.dailyStemsandBranches.horaryBranch.element.trigrams[0].binary}`" class="btn btn-primary">Detail</router-link>
                          <p :style="{ color: colorClass }" class="card-text display-3 mt-3">{{ state.dailyStemsandBranches.horaryBranch.element.trigrams[1].name }} {{ state.dailyStemsandBranches.horaryBranch.element.trigrams[1].symbol }} {{ state.dailyStemsandBranches.horaryBranch.element.trigrams[1].trigram }} {{ state.dailyStemsandBranches.horaryBranch.element.trigrams[1].description.translation.split(',')[0] }}</p>
                          <router-link :to="`/trigram_detail?trigram=${state.dailyStemsandBranches.horaryBranch.element.trigrams[1].binary}`" class="btn btn-primary mt-2">Detail</router-link>
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
    </div>
  </div>
</template>

  <script>
  import { reactive, computed, onMounted, watch, onUnmounted, ref } from 'vue';
  import Datepicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import hexagram from '@/const/hexagram';
  import bagua from '@/const/bagua';
  import coin from '@/const/coin';
  import astro from '@/const/astrology';
  import { DateTime } from 'luxon';
  import { useBirthdayStore } from '@/stores/birthday';

  export default {
    name: 'Astrology',
    components: {
      Datepicker
    },
    setup() {
      const birthdayStore = useBirthdayStore();
      const birthdayList = computed(() => birthdayStore.getBirthdayList);
      const showHistory = ref(false);

      const state = reactive({
        id: Date.now(), // Unique ID for datalist
        hemisphere: 'Northern',
        cycle: null,
        sexagenaryCycle: null,
        monthlyStemsandBranches: null,
        dailyStemsandBranches: null,
        birthStemsandBranches: null,
        name: 'John Doe',
        gender: 'MALE',
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
        selectedLaterHeavenBirthSubCycle: [],
        laterHeavenDailyCycle: [],
        laterHeavenDailyCycleHexagram: '',
        selectedLaterHeavenDailyCycleDate: '',
        heavenlyTrigram: '',
        earthlyTrigram: '',
        timeOfBirthHexagram: '',
        latitude: 26.39655582357474,
        longitude: 27.37679999686307,
        birthDate: DateTime.fromObject({ year: 1970, month: 1, day: 17, hour: 15, minute: 50 }).toJSDate(),
        minDate: DateTime.fromObject({ year: 1, month: 1, day: 1 }).toJSDate(),
        maxDate: DateTime.fromObject({ year: 275760, month: 9, day: 13 }).toJSDate(),
        graphics: {
          svgWidth: 400,
          svgHeight: 200,
          lineLength: 280,
          lineSpacing: 30,
          gapWidth: 10,
          lineWidth: 8,
          lineColor: 'black',
          lineColorBroken: 'black',
          lineColorControlling: 'red',
        },
        showBirthdayHistory: false,
        showBirthdayEntry: true,
        showHexagrams: true,
        showTrigrams: true,
        showEarlyLaterLife: true,
        showDailyCycles: true,
        showYearlyCycle: true,
        showMonthlyCycle: true,
        showDailyCycle: true,
        editingBirthday: null, // Track the birthday being edited
      });

      const form = {
        consultation: null,
        globalPreHeavenLineIndex: 5,
        globalLaterHeavenLineIndex: 5,
        globalEarlyLifeLineIndex: 5,
        globalLaterLifeLineIndex: 5,
      };

      const svgWidth = computed(() => {
        const width = window.innerWidth;
        if (width <= 576) return 300;
        if (width <= 768) return 350;
        return 400;
      });

      const updateGraphics = (newWidth) => {
        state.graphics.svgWidth = newWidth;
        state.graphics.lineLength = newWidth * 0.7;
        state.graphics.lineWidth = newWidth * 0.02;
        state.graphics.lineSpacing = newWidth * 0.075;
        state.graphics.gapWidth = newWidth * 0.025;
        state.graphics.svgHeight = state.graphics.lineSpacing * 7 + 40;
      };

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

      const colorClass = computed(() => 'rgb(0,0,0)');

      const updateGlobalEarlyLifeLineIndex =  () => {
                if (form.globalEarlyLifeLineIndex < 0) {
                    form.globalEarlyLifeLineIndex = 5;
                }
                form.globalEarlyLifeLineIndex--;
        }

        const updateGlobalLaterLifeLineIndex =  () => {
            if (form.globalLaterLifeLineIndex < 0) {
                form.globalLaterLifeLineIndex = 5;
            }
            form.globalLaterLifeLineIndex--;
        }

        const updateGlobalPreHeavenLineIndex =  () => {
            
          
           
            if (form.globalPreHeavenLineIndex < 0) {
                form.globalPreHeavenLineIndex = 5;
            }
            form.globalPreHeavenLineIndex--;
        };

        const updateGlobalLaterHeavenLineIndex =  () => {
            
          
           
            if (form.globalLaterHeavenLineIndex < 0) {
                form.globalLaterHeavenLineIndex = 5;
            }
            form.globalLaterHeavenLineIndex--;
        };

      const determineSelectedLaterHeavenBirthSubCycleLineColor = (trigram, line, index) => {
        if (state.selectedLaterHeavenBirthSubCycle?.controllingLine && state.selectedLaterHeavenBirthSubCycle.controllingLine.trigram === trigram && form.globalLaterLifeLineIndex === state.selectedLaterHeavenBirthSubCycle.controllingLine.hexagramLineIndex) {
          return state.graphics.lineColorControlling;
        } else if (line.alternate === 'OLDYANG' || line.alternate === 'OLDYIN') {
          return state.graphics.lineColorBroken;
        }
        return state.graphics.lineColor;
      };

      const determineSelectedPreHeavenBirthSubCycleLineColor = (trigram, line, index) => {
        if (state.selectedPreHeavenBirthSubCycle?.controllingLine && state.selectedPreHeavenBirthSubCycle.controllingLine.trigram === trigram && form.globalEarlyLifeLineIndex === state.selectedPreHeavenBirthSubCycle.controllingLine.hexagramLineIndex) {
          return state.graphics.lineColorControlling;
        } else if (line.alternate === 'OLDYANG' || line.alternate === 'OLDYIN') {
          return state.graphics.lineColorBroken;
        }
        return state.graphics.lineColor;
      };

      const determinePreHeavenLineColor = (line) => {
     // console.log('line', line, 'controllingline', state.preHeavenHexagram?.controllingLine, 'globalPreHeavenLineIndex', form.globalPreHeavenLineIndex, 'controllingLine.hexagramLineIndex-1', Number(state.preHeavenHexagram?.controllingLine?.hexagramLineIndex)-1);
        if (line && state.preHeavenHexagram?.controllingLine && (Number(form.globalPreHeavenLineIndex) === (Number(state.preHeavenHexagram.controllingLine.hexagramLineIndex) - 1))) {
          return state.graphics.lineColorControlling;
        } else if (line.alternate === 'OLDYANG' || line.alternate === 'OLDYIN') {
          return state.graphics.lineColorBroken;
        }
        return state.graphics.lineColor;
      };

      const determineLaterHeavenLineColor = (line) => {
       // console.log(line, state.laterHeavenHexagram?.controllingLine, form.globalLaterHeavenLineIndex, state.laterHeavenHexagram?.controllingLine?.hexagramLineIndex);

        if (line && state.laterHeavenHexagram?.controllingLine && form.globalLaterHeavenLineIndex === state.laterHeavenHexagram.controllingLine.hexagramLineIndex - 1) {
          return state.graphics.lineColorControlling;
        } else if (line.alternate === 'OLDYANG' || line.alternate === 'OLDYIN') {
          return state.graphics.lineColorBroken;
        }
        return state.graphics.lineColor;
      };

      const getHemisphere = (latitude) => {
        return latitude >= 0 ? 'Northern' : 'Southern';
      };

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
        // Validate the state before saving
        const errors = validateState();
        if (errors.length > 0) {
          throw new Error(errors.join(' '));
        }

        birthdayStore.addBirthday({
          id: Date.now(),
          name: state.name,
          birthday: DateTime.fromJSDate(state.birthDate).toISO(),
          gender: state.gender,
          coords: { latitude: state.latitude, longitude: state.longitude },
        });
        alert('Birthday saved successfully!');
      } catch (error) {
        console.error('Error saving birthday:', error);
        alert(`Failed to save birthday: ${error.message}`);
      }
    };

    const loadBirthday = (birthday) => {
  
      state.name = birthday.name;  
      state.birthDate = DateTime.fromISO(birthday.birthday).toJSDate();
      state.gender = birthday.gender;
      state.latitude = birthday.coords.latitude;
      state.longitude = birthday.coords.longitude;
      consult();
      toggleHistory();
    };

    const startEditingBirthday = (birthday) => {
      state.editingBirthday = birthday;
      state.name = birthday.name;
      state.birthDate = birthday.birthday;
      state.gender = birthday.gender;
      state.latitude = birthday.coords.latitude;
      state.longitude = birthday.coords.longitude;
    };


    const updateBirthday = () => {
      try {
        const updatedBirthday = {
          id: state.editingBirthday.id,
          name: state.name,
          birthday: DateTime.fromJSDate(state.birthDate).toISO(),
          gender: state.gender,
          coords: { latitude: state.latitude, longitude: state.longitude },
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
    };

    const handleImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        birthdayStore.importBirthdays(file);
        event.target.value = '';
      }
    };


      const consult = async () => {
    
        // const errors = await validateState();
        // if (errors.length > 0) {
        //   throw new Error(errors.join(' '));
        // }

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
        state.preHeavenBirthSubCycles = result.iching.preHeavenBirthSubCycles;
        state.laterHeavenBirthSubCycles = result.iching.laterHeavenBirthSubCycles;

        const birthDate = DateTime.fromJSDate(new Date(state.birthDate));
        const currentDate = DateTime.now();
        const age = Math.floor(currentDate.diff(birthDate, 'years').years);

        let correctYear = state.laterHeavenBirthSubCycles.find(subCycle => subCycle.age === age);
        state.selectedLaterHeavenYear = correctYear ? correctYear.year : state.laterHeavenBirthSubCycles[0].year;

        correctYear = state.preHeavenBirthSubCycles.find(subCycle => subCycle.age === age);
        state.selectedPreHeavenYear = correctYear ? correctYear.year : state.preHeavenBirthSubCycles[0].year;
      };

      const toggleHistory = () => {
        showHistory.value = !showHistory.value;
      };

 

      watch(() => state.selectedPreHeavenDailyCycleDate, (newDate) => {
        const selectedSubCycle = state.preHeavenDailyCycle.find(subCycle => subCycle.date === newDate);
        if (selectedSubCycle) {
          state.preHeavenDailyCycleHexagram = selectedSubCycle.hexagram;
        }
      });

      watch(() => state.selectedLaterHeavenDailyCycleDate, (newDate) => {
        const selectedSubCycle = state.laterHeavenDailyCycle.find(subCycle => subCycle.date === newDate);
        if (selectedSubCycle) {
          state.laterHeavenDailyCycleHexagram = selectedSubCycle.hexagram;
        }
      });

      watch(() => state.selectedPreHeavenYear, async (newYear) => {
        const selectedSubCycle = state.preHeavenBirthSubCycles.find(subCycle => subCycle.year === newYear);
        if (selectedSubCycle) {
          state.preHeavenBirthSubCycleHexagram = _.cloneDeep(selectedSubCycle.hexagram);
          state.selectedPreHeavenBirthSubCycle = _.cloneDeep(selectedSubCycle);
          state.preHeavenDailyCycle = await form.consultation.calculateDailyCycles(selectedSubCycle.hexagram, selectedSubCycle.controllingLine, state.birthDate, state.latitude, newYear);
        }
      });

      watch(() => state.selectedLaterHeavenYear, async (newYear) => {
        const selectedSubCycle = state.laterHeavenBirthSubCycles.find(subCycle => subCycle.year === newYear);
        if (selectedSubCycle) {
          state.selectedLaterHeavenBirthSubCycle = _.cloneDeep(selectedSubCycle);
          state.laterHeavenBirthSubCycleHexagram = _.cloneDeep(selectedSubCycle.hexagram);
          state.laterHeavenDailyCycle = await form.consultation.calculateDailyCycles(selectedSubCycle.hexagram, selectedSubCycle.controllingLine, state.birthDate, state.latitude, newYear);
        }
      });

      watch(() => state.name, (newName) => {
        form.globalPreHeavenLineIndex = 5;
        const selectedBirthday = birthdayList.value.find(b => b.name === newName);
        if (selectedBirthday) {
          state.birthDate = selectedBirthday.birthday;
          state.gender = selectedBirthday.gender;
          state.latitude = selectedBirthday.coords.latitude;
          state.longitude = selectedBirthday.coords.longitude;
          consult();
        }
      });

      watch(svgWidth, (newWidth) => {
        updateGraphics(newWidth);
      });

      onMounted(() => {
        updateGraphics(svgWidth.value);
        window.addEventListener('resize', () => updateGraphics(svgWidth.value));
        consult();
      });

      onUnmounted(() => {
        window.removeEventListener('resize', () => updateGraphics(svgWidth.value));
      });

      return {
        state,
        birthdayList,
        birthdayStore,
        showHistory,
        dateTimeFormatSimple,
        formatBirthYear,
        formatBirthMonth,
        formatBirthDay,
        colorClass,
        consult,
        saveBirthday,
        loadBirthday,
        startEditingBirthday,
        updateBirthday,
        cancelEditing,
        handleImport,
        toggleHistory,        
        determinePreHeavenLineColor,
        determineLaterHeavenLineColor,
        determineSelectedPreHeavenBirthSubCycleLineColor,
        determineSelectedLaterHeavenBirthSubCycleLineColor,
        updateGlobalEarlyLifeLineIndex,
        updateGlobalLaterLifeLineIndex,
        updateGlobalPreHeavenLineIndex,
        updateGlobalLaterHeavenLineIndex,
      };
    },
  };
  </script>


