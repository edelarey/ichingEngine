<template>
  <div class="hexagram-sequence-page">
    <!-- Page Header (Inline) -->
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Hexagram Sequences</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/consult">Hexagrams</a></li>
            <li class="breadcrumb-item active" aria-current="page">Hexagram Sequences</li>
          </ol>
        </nav>
      </div>
    </header>

    <div class="row justify-content-center">
      <!-- Available Sequences Card -->
      <div class="col-12 col-md-3 mb-4">
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title">Available Sequences</h5>
            <select
              v-model="chosenSequence"
              id="idSequence"
              class="input-narrow"
            >
      
              <!-- Loop through your sequence options -->
              <option
                v-for="(seq, index) in sequence"
                :key="seq"
                :value="seq"
                :selected="index === 0"
              >
                {{ seq }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Animate and Settings Cards -->
      <div class="col-12 col-md-9 mb-4">
        <div class="row justify-content-center">
          <!-- Animate Card -->
          <div class="col-12 col-md-2 mb-4">
            <div class="card">
              <div class="card-body text-center">
                <h5 class="card-title">Animate</h5>
                <button type="button" id="btnAnimate" class="btn btn-primary btn-narrow" @click="animate">
                  {{ animating ? 'Animating' : 'Animate' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Settings Card -->
          <div class="col-12 col-md-4 mb-4">
            <div class="card">
              <div class="card-body text-center">
                <h5 class="card-title">Settings</h5>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" id="colorCode" v-model="chkColorCode" />
                  <label class="form-check-label" for="colorCode">Color Code Hexagrams</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="showDetail" v-model="chkShowDetail" />
                  <label class="form-check-label" for="showDetail">Hide Hexagram Detail</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hexagram Cards -->
    <div class="row justify-content-center">
      <div v-for="(hexagramLine, indexLine) in state.hexagrams" :key="indexLine" class="col-12">
        <div class="row justify-content-center hexagram-row g-2">
          <div v-for="(hexagram, index) in hexagramLine" :key="index" class="col-6 col-sm-4 col-md-3 col-lg-2">
            <div class="card hexagram-card h-100" :class="{ 'bg-secondary': chkColorCode }">
              <div class="card-body text-center" :class="{ 'text-dark': chkColorCode }">
                <template v-if="!chkShowDetail">
                  <p class="card-text display-6">{{ hexagram.name }}</p>
                </template>
                <router-link :to="`/hexagram_detail?hexagram=${hexagram.binary}`" class="text-decoration-none">
                  <template v-if="chkColorCode">
                    <div :style="{ color: aboveTrigramColor(hexagram) }" class="card-text display-1">
                      <span v-text="above(hexagram)"></span>
                    </div>
                    <div :style="{ color: belowTrigramColor(hexagram) }" class="card-text display-1">
                      <span v-text="below(hexagram)"></span>
                    </div>
                  </template>
                  <p v-else :style="{ color: colorClass }" class="card-text display-1">{{ hexagram.hexagram }}</p>
                </router-link>
                <template v-if="!chkShowDetail">
                  <p class="card-text display-8">{{ hexagram.translation }}</p>
                  <p class="card-text display-8">{{ hexagram.binary }}</p>
                </template>
              </div>
              <div class="card-footer" :class="{ 'text-dark': chkColorCode }">
                <template v-if="!chkShowDetail">
                  <p class="card-text display-8 text-center">{{ hexagram.kingwen}}</p>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, reactive, watch } from 'vue';
import hexagram from '@/const/hexagram';
import bagua from '@/const/bagua';
import { useHexagramStore } from '@/stores/oracle';
import _ from 'lodash';

export default {
  name: 'HexagramSequence',
  components: {  },
  setup() {
    // Reactive state
    const sequence = ref(['King Wen', 'Binary', 'Grey Code', 'Shoa Yung', 'Consultation History']);
    const chosenSequence = ref('King Wen');
    const chkColorCode = ref(false);
    const chkShowDetail = ref(false);
    const animating = ref(false);
    const hexagramStore = useHexagramStore();
    let animationTime = null;
    let counter = 1;

    const state = reactive({ hexagrams: [] });

    // Methods
    const animate = () => {
      animating.value = !animating.value;
      if (animating.value) {
        animationTime = setInterval(() => {
          counter = counter < 5 ? counter + 1 : 1;
          chosenSequence.value = sequence.value[counter - 1];
        }, 2000);
      } else {
        clearInterval(animationTime);
        animationTime = null;
      }
    };

    const above = (hexagram) => {
      const trigram = bagua.sequence_Gua_OldFamilyOrder().find((item) => item.binary === hexagram.binary.substring(0, 3));
      return trigram ? trigram.trigram : '';
    };

    const below = (hexagram) => {
      const trigram = bagua.sequence_Gua_OldFamilyOrder().find((item) => item.binary === hexagram.binary.substring(3, 6));
      return trigram ? trigram.trigram : '';
    };

    const aboveTrigramColor = (hexagram) => {
      if (!_.isEmpty(hexagram)) {
        const trigram = bagua.sequence_Gua_OldFamilyOrder().find((item) => item.binary === hexagram.binary.substring(0, 3));
        if (trigram) {
          return `rgb(${trigram.description.color.color[0]}, ${trigram.description.color.color[1]}, ${trigram.description.color.color[2]})`;
        }
      }
      return 'rgb(0,0,0)';
    };

    const belowTrigramColor = (hexagram) => {
      if (!_.isEmpty(hexagram)) {
        const trigram = bagua.sequence_Gua_OldFamilyOrder().find((item) => item.binary === hexagram.binary.substring(3, 6));
        if (trigram) {
          return `rgb(${trigram.description.color.color[0]}, ${trigram.description.color.color[1]}, ${trigram.description.color.color[2]})`;
        }
      }
      return 'rgb(0,0,0)';
    };

    const loadFullSequence = () => {
      const fullSequence = hexagramStore.getAllConsultationsSequence();
      if (_.isEmpty(fullSequence)) {
        return [];
      }
      const hexSequence =[];
      // convert the binary into hexagrams
      const hexagrams = fullSequence.map((item) => {        
          hexSequence.push(hexagram.getHexagramByBinary(item));        
      });
      
      const chunkedSequence = _.chunk(hexSequence, 8);     
      return chunkedSequence;
    };

    const getData = () => {
      switch (chosenSequence.value) {
        case 'King Wen':
          state.hexagrams = _.chunk(hexagram.sequence_kingwen(), 8);
          break;
        case 'Binary':
          state.hexagrams = _.chunk(hexagram.sequence_binary(), 8);
          break;
        case 'Grey Code':
          state.hexagrams = _.chunk(hexagram.sequence_greycode(), 8) || [];
          break;
        case 'Shoa Yung':
          state.hexagrams = _.chunk(hexagram.sequence_shoayung(), 8) || [];
          break;
          case 'Consultation History':
          state.hexagrams = loadFullSequence() || [];
          break;
        default:
          state.hexagrams = _.chunk(hexagram.sequence_kingwen(), 8);
          break;
      }
    };

    // Computed properties
    const colorClass = 'rgb(0,0,0)';

    // Watchers
    watch(chosenSequence, () => {
      getData();
    });

    // Lifecycle
    onMounted(() => {
      getData();
    });

    return {
      animate,
      chkColorCode,
      chkShowDetail,
      animating,
      colorClass,
      above,
      below,
      aboveTrigramColor,
      belowTrigramColor,
      sequence,
      chosenSequence,
      loadFullSequence,
      state,
    };
  },
};
</script>

