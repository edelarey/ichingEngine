<template>
    <div class="trigram-detail-page">
      <!-- Page Header (Inline) -->
      <header class="bg-light py-3 mb-4">
        <div class="container">
          <h1 class="display-4">Trigrams</h1>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">Trigram Detail</li>
            </ol>
          </nav>
        </div>
      </header>
  
      <!-- Trigram Detail Card -->
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6 mb-4">
          <div class="card">
            <div class="card-body text-center">
              <h3 class="card-title">Trigram Detail</h3>
              <p class="card-text display-3">{{ trigram.name }}</p>
              <p :style="{ color: colorClass }" class="card-text display-1">{{ trigram.symbol }}</p>
              <TrigramSymbol 
                :binary="trigram.binary" 
                :trigram-symbol="trigram.trigram" 
                :show-visual="true"
                size="large" 
                :color="colorClass" 
              />
              <p class="card-text display-5">Binary: {{ trigram.binary }}</p>
              <p class="card-text display-5">Nature: {{ nature }} : {{ translation }}</p>
              <p class="card-text display-5">Animal: {{ animal }}</p>
              <p class="card-text display-5">Body: {{ bodyPart }}</p>
              <p class="card-text display-5">Attribute: {{ attribute }}</p>
              <p class="card-text display-5">State: {{ state }}</p>
            </div>
  
            <div v-if="earlierHeavenName" class="card-body text-center">
              <h3 class="card-title">Earlier Heaven</h3>
              <p class="card-text display-3">{{ earlierHeavenName }}</p>
              <p class="card-text display-5">Polarity: {{ earlierHeavenPolarity.name }}</p>
              <p class="card-text display-5">Direction: {{ earlierHeavenDirection }}</p>
              <p class="card-text display-5">Number: {{ earlierHeavenNumber }}</p>
              <p class="card-text display-5">Season: {{ earlierHeavenSeason }}</p>
              <p class="card-text display-5">Relationship: {{ earlierHeavenRelationship }}</p>
            </div>
  
            <div v-if="laterHeavenName" class="card-body text-center">
              <h3 class="card-title">Later Heaven</h3>
              <p class="card-text display-3">{{ laterHeavenName }}</p>
              <p class="card-text display-5">Polarity: {{ laterHeavenPolarity.name }}</p>
              <p class="card-text display-5">Direction: {{ laterHeavenDirection }}</p>
              <p class="card-text display-5">Number: {{ laterHeavenNumber }}</p>
              <p class="card-text display-5">Season: {{ laterHeavenSeason }}</p>
              <p class="card-text display-5">Relationship: {{ laterHeavenRelationship }}</p>
            </div>
  
            <div class="card-body text-center">
              <router-link to="/trigrams" class="btn btn-link">Back to Trigrams</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import bagua from '@/const/bagua';
  import _ from 'lodash';
  import TrigramSymbol from '@/components/TrigramSymbol.vue';
  
  export default {
    name: 'TrigramDetail',
    components: {
      TrigramSymbol,
    },
    setup() {
      // Reactive state
      const trigram = ref({});
      const route = useRoute();
  
      // Computed properties
      const colorClass = computed(() => {
        if (!_.isEmpty(trigram.value)) {
          const color = trigram.value.description?.color?.color;
          return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        }
        return 'rgb(0,0,0)';
      });
  
      const isWhiteColor = computed(() => colorClass.value === 'rgb(255,255,255)');
  
      const translation = computed(() => trigram.value.description?.translation || '');
      const nature = computed(() => trigram.value.description?.nature || '');
      const animal = computed(() => trigram.value.description?.animal || '');
      const bodyPart = computed(() => trigram.value.description?.bodyPart || '');
      const attribute = computed(() => trigram.value.description?.attribute || '');
      const state = computed(() => trigram.value.description?.state || '');
  
      const earlierHeavenName = computed(() => trigram.value.earlierHeaven?.name || '');
      const earlierHeavenPolarity = computed(() => trigram.value.earlierHeaven?.polarity || {});
      const earlierHeavenDirection = computed(() => trigram.value.earlierHeaven?.direction || '');
      const earlierHeavenNumber = computed(() => trigram.value.earlierHeaven?.number || '');
      const earlierHeavenSeason = computed(() => trigram.value.earlierHeaven?.season || '');
      const earlierHeavenRelationship = computed(() => trigram.value.earlierHeaven?.relationship || '');
  
      const laterHeavenName = computed(() => trigram.value.laterHeaven?.name || '');
      const laterHeavenPolarity = computed(() => trigram.value.laterHeaven?.polarity || {});
      const laterHeavenDirection = computed(() => trigram.value.laterHeaven?.direction || '');
      const laterHeavenNumber = computed(() => trigram.value.laterHeaven?.number || '');
      const laterHeavenSeason = computed(() => trigram.value.laterHeaven?.season || '');
      const laterHeavenRelationship = computed(() => trigram.value.laterHeaven?.relationship || '');
  
      // Methods
      const getData = async () => {
        trigram.value = bagua.sequence_Gua_OldFamilyOrder().find((item) => item.binary === route.query.trigram) || {};
      };
  
      // Lifecycle
      onMounted(() => {
         getData();
      });
  
      return {
        trigram,
        colorClass,
        isWhiteColor,
        translation,
        nature,
        animal,
        bodyPart,
        attribute,
        state,
        earlierHeavenName,
        earlierHeavenPolarity,
        earlierHeavenDirection,
        earlierHeavenNumber,
        earlierHeavenSeason,
        earlierHeavenRelationship,
        laterHeavenName,
        laterHeavenPolarity,
        laterHeavenDirection,
        laterHeavenNumber,
        laterHeavenSeason,
        laterHeavenRelationship,
      };
    },
  };
  </script>
  
