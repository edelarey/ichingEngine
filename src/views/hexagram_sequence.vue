<template>
  <div class="hexagram-sequence-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Hexagram sequences</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item"><router-link to="/hexagrams">Hexagrams</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">Sequences</li>
          </ol>
        </nav>
        <p class="mb-0 lead-blurb">
          The same 64 hexagrams in different orders: King Wen (the classic book), Fu Xi binary,
          Grey code, Shao Yong, or your consultation history.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <div class="toolbar card mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-12 col-md-4">
              <label class="form-label" for="idSequence">Sequence</label>
              <select
                id="idSequence"
                v-model="chosenSequence"
                class="form-select"
              >
                <option v-for="seq in sequence" :key="seq" :value="seq">{{ seq }}</option>
              </select>
            </div>
            <div class="col-12 col-md-3">
              <button type="button" class="btn btn-primary" @click="animate">
                {{ animating ? 'Stop' : 'Animate sequences' }}
              </button>
            </div>
            <div class="col-12 col-md-5">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="colorCode" v-model="chkColorCode" />
                <label class="form-check-label" for="colorCode">Colour by upper and lower trigram</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="showDetail" v-model="chkShowDetail" />
                <label class="form-check-label" for="showDetail">Glyphs only</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-if="!state.hexagrams.length" class="text-muted">
        Nothing to show for this sequence.
        <span v-if="chosenSequence === 'Consultation History'">Consult the oracle first, then return here.</span>
      </p>

      <div v-for="(hexagramLine, indexLine) in state.hexagrams" :key="indexLine" class="row g-2 mb-2">
        <div
          v-for="(hex, index) in hexagramLine"
          :key="(hex && hex.binary) || index"
          class="col-6 col-sm-4 col-md-3 col-lg-2"
        >
          <router-link
            v-if="hex && hex.binary"
            :to="`/hexagram_detail?hexagram=${hex.binary}`"
            class="seq-card card h-100 text-decoration-none"
          >
            <div class="card-body text-center">
              <p v-if="!chkShowDetail" class="name">{{ shortName(hex.name) }}</p>
              <template v-if="chkColorCode">
                <p class="glyph split" :style="{ color: trigramColor(hex, 'above') }">{{ aboveGlyph(hex) }}</p>
                <p class="glyph split" :style="{ color: trigramColor(hex, 'below') }">{{ belowGlyph(hex) }}</p>
              </template>
              <p v-else class="glyph">{{ hex.hexagram }}</p>
              <p v-if="!chkShowDetail" class="translation">{{ firstPhrase(hex.translation) }}</p>
              <p v-if="!chkShowDetail" class="kingwen mb-0">{{ hex.kingwen }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, reactive, watch } from 'vue';
import hexagram from '@/const/hexagram';
import bagua from '@/const/bagua';
import { useHexagramStore } from '@/stores/oracle';
import _ from 'lodash';
import { usePageTitle } from '@/composables/usePageTitle';

export default {
  name: 'HexagramSequence',
  setup() {
    usePageTitle('Hexagram sequences');
    const sequence = ref(['King Wen', 'Binary', 'Grey Code', 'Shoa Yung', 'Consultation History']);
    const chosenSequence = ref('King Wen');
    const chkColorCode = ref(false);
    const chkShowDetail = ref(false);
    const animating = ref(false);
    const hexagramStore = useHexagramStore();
    let animationTime = null;
    let counter = 0;

    const state = reactive({ hexagrams: [] });

    const trigramByBinary = {};
    (bagua.sequence_Gua_OldFamilyOrder() || []).forEach((t) => {
      if (t?.binary) trigramByBinary[t.binary] = t;
    });

    const animate = () => {
      animating.value = !animating.value;
      if (animating.value) {
        animationTime = setInterval(() => {
          counter = (counter + 1) % sequence.value.length;
          chosenSequence.value = sequence.value[counter];
        }, 2000);
      } else if (animationTime) {
        clearInterval(animationTime);
        animationTime = null;
      }
    };

    const aboveGlyph = (hex) => trigramByBinary[hex?.binary?.substring(0, 3)]?.trigram || '';
    const belowGlyph = (hex) => trigramByBinary[hex?.binary?.substring(3, 6)]?.trigram || '';

    const trigramColor = (hex, which) => {
      const binary = which === 'above' ? hex?.binary?.substring(0, 3) : hex?.binary?.substring(3, 6);
      const rgb = trigramByBinary[binary]?.description?.color?.color;
      if (!Array.isArray(rgb) || rgb.length < 3) return 'rgb(32,32,40)';
      if (rgb[0] > 240 && rgb[1] > 240 && rgb[2] > 240) return 'rgb(32,32,40)';
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    };

    const loadFullSequence = () => {
      const fullSequence = hexagramStore.getAllConsultationsSequence();
      if (_.isEmpty(fullSequence)) return [];
      const hexSequence = fullSequence.map((item) => {
        if (item && item.binary && item.name) return item;
        const binary = typeof item === 'string' ? item : item?.binary;
        return binary ? hexagram.getHexagramByBinary(binary) : null;
      }).filter(Boolean);
      return _.chunk(hexSequence, 6);
    };

    const getData = () => {
      switch (chosenSequence.value) {
        case 'King Wen':
          state.hexagrams = _.chunk(hexagram.sequence_kingwen(), 6);
          break;
        case 'Binary':
          state.hexagrams = _.chunk(hexagram.sequence_binary(), 6);
          break;
        case 'Grey Code':
          state.hexagrams = _.chunk(hexagram.sequence_greycode(), 6) || [];
          break;
        case 'Shoa Yung':
          state.hexagrams = _.chunk(hexagram.sequence_shoayung(), 6) || [];
          break;
        case 'Consultation History':
          state.hexagrams = loadFullSequence() || [];
          break;
        default:
          state.hexagrams = _.chunk(hexagram.sequence_kingwen(), 6);
          break;
      }
    };

    const firstPhrase = (text) => {
      if (!text) return '';
      return String(text).split(',')[0].trim();
    };
    const shortName = (name) => firstPhrase(name) || '—';

    watch(chosenSequence, getData);
    onMounted(getData);
    onUnmounted(() => {
      if (animationTime) clearInterval(animationTime);
    });

    return {
      animate,
      chkColorCode,
      chkShowDetail,
      animating,
      aboveGlyph,
      belowGlyph,
      trigramColor,
      sequence,
      chosenSequence,
      state,
      firstPhrase,
      shortName,
    };
  },
};
</script>

<style scoped>
.lead-blurb {
  max-width: 46rem;
  color: #4a3b16;
}
.toolbar {
  margin: 0;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
}
.seq-card {
  margin: 0;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
  color: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.seq-card:hover {
  border-color: #c9b06a;
  box-shadow: 0 3px 10px rgba(107, 79, 29, 0.1);
}
.name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #3d2e10;
  margin-bottom: 0.2rem;
}
.glyph {
  font-size: 2.4rem;
  line-height: 1;
  margin: 0.15rem 0;
  color: #3d2e10;
}
.glyph.split {
  font-size: 1.8rem;
  margin: 0;
}
.translation {
  font-size: 0.75rem;
  color: #5b4a22;
  margin-bottom: 0.15rem;
}
.kingwen {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #8a6a22;
}
</style>
