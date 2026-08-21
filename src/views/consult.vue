<template>
  <div class="consult-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Consult</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">Consult the I Ching</li>
          </ol>
        </nav>
        <p class="mb-0 lead-blurb">
          Ask a question, then build a hexagram line by line with coins or yarrow odds.
          Changing lines (old yin 6, old yang 9) become the transformed hexagram.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <div class="history-panel card mb-4">
        <button
          type="button"
          class="history-toggle"
          :aria-expanded="showHistory ? 'true' : 'false'"
          @click="showHistory = !showHistory"
        >
          <span>
            <strong>Previous consultations</strong>
            <span class="text-muted ms-2">{{ history.length }} saved</span>
          </span>
          <span class="toggle-hint">{{ showHistory ? 'Hide' : 'Show' }}</span>
        </button>
        <div v-show="showHistory" class="card-body pt-0">
          <div class="d-flex flex-wrap gap-2 mb-3">
            <button type="button" class="btn btn-success btn-sm" @click="hexagramStore.exportHistory">Export</button>
            <label class="btn btn-outline-primary btn-sm mb-0">
              Import
              <input type="file" @change="handleImport" hidden accept=".json">
            </label>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm"
              :disabled="!history.length"
              @click="clearHistory"
            >
              Clear all
            </button>
          </div>
          <p v-if="!history.length" class="text-muted mb-0">No consultations saved yet. Finish a six-line cast to store one.</p>
          <div v-else class="history-list">
            <article
              v-for="item in historyNewestFirst"
              :key="item.id"
              class="history-item"
              :class="{ active: viewingSaved === item.id }"
            >
              <p class="when mb-1">{{ formatWhen(item.timestamp) }} · {{ methodLabel(item.method) }}</p>
              <p class="question mb-1">{{ item.question || 'No question entered' }}</p>
              <p class="hex-names mb-2">
                {{ hexName(item.primaryHexagram) }}
                <span v-if="item.changingLines?.length"> → {{ hexName(item.transformedHexagram) }}</span>
                <span v-if="item.changingLines?.length" class="text-muted">
                  · lines {{ item.changingLines.join(', ') }}
                </span>
                <span v-else class="text-muted"> · no changing lines</span>
              </p>
              <div class="d-flex flex-wrap gap-2">
                <button type="button" class="btn btn-primary btn-sm" @click="openSaved(item)">
                  Open this reading
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteSaved(item.id)">
                  Delete
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-12 col-lg-7">
          <div class="cast-card card h-100">
            <div class="card-body">
              <h2 class="h5">Your question</h2>
              <textarea
                v-model="userQuestion"
                class="form-control"
                rows="3"
                placeholder="Hold a question, then cast six lines from the bottom up."
                :disabled="viewingSaved != null"
              />
              <div class="mt-3">
                <span class="form-label d-block">Method</span>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" v-model="divinationMethod" value="coin" id="coinMethod" :disabled="viewingSaved != null || currentLine > 1">
                  <label class="form-check-label" for="coinMethod">Coin toss</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" v-model="divinationMethod" value="yarrow" id="yarrowMethod" :disabled="viewingSaved != null || currentLine > 1">
                  <label class="form-check-label" for="yarrowMethod">Yarrow stalk</label>
                </div>
              </div>
              <div class="d-flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  class="btn btn-primary"
                  :disabled="currentLine > 6 || viewingSaved != null"
                  @click="generateLine"
                >
                  {{ tossLabel }}
                </button>
                <button type="button" class="btn btn-secondary" @click="reset">New consultation</button>
              </div>
              <p v-if="viewingSaved" class="saved-note mt-3 mb-0">
                Showing a saved reading. Start a new consultation to cast again.
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-5">
          <div class="cast-card card h-100">
            <div class="card-body">
              <h2 class="h5">Lines so far</h2>
              <p class="text-muted small">Line 1 is the bottom. Old yin (6) and old yang (9) change.</p>
              <div class="build-figure" v-if="primaryHexagram.length">
                <div
                  v-for="row in buildingRows"
                  :key="row.n"
                  class="hex-row"
                  :class="{ changing: row.changing, empty: row.empty }"
                >
                  <span class="line-no">{{ row.empty ? '' : row.n }}</span>
                  <div class="line-marks" :class="row.isYin ? 'yin' : 'yang'">
                    <span v-if="!row.empty" class="seg" />
                    <span v-if="!row.empty && row.isYin" class="seg" />
                  </div>
                  <span class="line-val">{{ row.empty ? '' : row.value }}</span>
                </div>
              </div>
              <p v-else class="text-muted mb-0">No lines yet.</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hexagram" ref="readingRoot" class="reading">
        <p class="reading-kicker">
          <span v-if="viewingSaved">Saved reading</span>
          <span v-else>This consultation</span>
          · {{ methodLabel(divinationMethod) }}
        </p>
        <h2 class="reading-question">{{ userQuestion || 'No question entered' }}</h2>

        <div class="row g-3 align-items-stretch mb-4">
          <div class="col-12 col-lg-5">
            <IchingHexagramCard
              title="Primary"
              :hexagram="hexagram"
              :highlight-lines="changingLines"
              highlight-kind="changing"
              :show-summary="false"
              :show-detail-button="false"
            />
          </div>
          <div class="col-12 col-lg-2 d-flex align-items-center justify-content-center">
            <p class="arrow mb-0" aria-hidden="true">{{ changingLines.length ? '→' : '=' }}</p>
          </div>
          <div class="col-12 col-lg-5">
            <IchingHexagramCard
              title="Transformed"
              :hexagram="hexagramTransformed"
              :highlight-lines="changingLines"
              highlight-kind="transformed"
              :show-summary="false"
              :show-detail-button="false"
            />
          </div>
        </div>

        <section class="block card mb-3">
          <div class="card-body">
            <h3>Changing lines</h3>
            <p v-if="!changingLineReadings.length" class="mb-0">
              No changing lines. The primary hexagram is the reading.
            </p>
            <div v-else>
              <p class="text-muted">
                Lines {{ changingLines.join(', ') }} change, moving {{ shortName(hexagram.name) }}
                toward {{ shortName(hexagramTransformed?.name) }}.
              </p>
              <div v-for="line in changingLineReadings" :key="line.n" class="line-reading">
                <h4>Line {{ line.n }}</h4>
                <p class="mb-0">{{ line.text }}</p>
              </div>
            </div>
          </div>
        </section>

        <section v-if="plain(hexagram.summary)" class="block card mb-3">
          <div class="card-body">
            <h3>Primary · {{ shortName(hexagram.name) }}</h3>
            <p>{{ plain(hexagram.summary) }}</p>
            <p v-if="plain(hexagram.judgement)" class="mb-2"><strong>Judgement.</strong> {{ plain(hexagram.judgement) }}</p>
            <router-link :to="`/hexagram_detail?hexagram=${hexagram.binary}`">Full hexagram page</router-link>
          </div>
        </section>

        <section v-if="changingLines.length && hexagramTransformed && plain(hexagramTransformed.summary)" class="block card mb-3">
          <div class="card-body">
            <h3>Transformed · {{ shortName(hexagramTransformed.name) }}</h3>
            <p>{{ plain(hexagramTransformed.summary) }}</p>
            <p v-if="plain(hexagramTransformed.judgement)" class="mb-2"><strong>Judgement.</strong> {{ plain(hexagramTransformed.judgement) }}</p>
            <router-link :to="`/hexagram_detail?hexagram=${hexagramTransformed.binary}`">Full hexagram page</router-link>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue';
import hexagramLibrary from '@/const/hexagram';
import coin from '@/const/coin';
import { useHexagramStore } from '@/stores/oracle';
import { DateTime } from 'luxon';
import IchingHexagramCard from '@/components/IchingHexagramCard.vue';
import { usePageTitle } from '@/composables/usePageTitle';

function plain(html) {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function shortName(name) {
  if (!name) return '—';
  return String(name).split(',')[0].trim();
}

function lookupHex(binary) {
  if (!binary) return null;
  const b = typeof binary === 'string' ? binary : binary.binary;
  return (hexagramLibrary.sequence_binary() || []).find((item) => item.binary === b) || null;
}

export default {
  name: 'Consult',
  components: { IchingHexagramCard },
  setup() {
    usePageTitle('Consult');
    const hexagramStore = useHexagramStore();
    const readingRoot = ref(null);

    const userQuestion = ref('');
    const primaryHexagram = ref([]);
    const transformedHexagram = ref([]);
    const hexagram = ref(null);
    const hexagramTransformed = ref(null);
    const changingLines = ref([]);
    const currentLine = ref(1);
    const divinationMethod = ref('coin');
    const showHistory = ref(false);
    const viewingSaved = ref(null);

    const history = computed(() => hexagramStore.getConsultationHistory || []);
    const historyNewestFirst = computed(() => [...history.value].reverse());

    const tossLabel = computed(() => {
      if (currentLine.value > 6) return 'Six lines complete';
      const verb = divinationMethod.value === 'coin' ? 'Toss coins' : 'Cast yarrow';
      return `${verb} for line ${currentLine.value}`;
    });

    const buildingRows = computed(() => {
      const rows = [];
      for (let n = 6; n >= 1; n -= 1) {
        const value = primaryHexagram.value[n - 1];
        if (value === undefined) {
          rows.push({ n, empty: true, isYin: false, changing: false, value: '' });
        } else {
          rows.push({
            n,
            empty: false,
            isYin: value === 6 || value === 8,
            changing: value === 6 || value === 9,
            value,
          });
        }
      }
      return rows;
    });

    const changingLineReadings = computed(() => {
      const raw = hexagram.value?.lines;
      if (!raw || typeof raw !== 'string' || !changingLines.value.length) return [];
      return changingLines.value.map((n) => {
        const pattern = new RegExp(`- \\*\\*Line ${n}:\\*\\*([^]*?)(?=(?:- \\*\\*Line \\d+:\\*\\*)|$)`, 'i');
        const match = raw.match(pattern);
        return {
          n,
          text: match && match[1] ? plain(match[1]) : 'No line text in the catalog for this position.',
        };
      });
    });

    const isChangingLine = (lineValue) => lineValue === 6 || lineValue === 9;

    const generateYarrowLine = () => {
      const probabilities = [
        { value: 6, weight: 1 },
        { value: 7, weight: 5 },
        { value: 8, weight: 7 },
        { value: 9, weight: 3 },
      ];
      const random = Math.random() * 16;
      let cumulativeWeight = 0;
      for (const option of probabilities) {
        cumulativeWeight += option.weight;
        if (random <= cumulativeWeight) return option.value;
      }
      return 8;
    };

    const transformLine = (lineValue) => {
      switch (lineValue) {
        case 6: return 7;
        case 7: return 7;
        case 8: return 8;
        case 9: return 8;
        default: return lineValue;
      }
    };

    const generateLine = () => {
      if (currentLine.value > 6 || viewingSaved.value != null) return;
      const lineValue = divinationMethod.value === 'coin' ? coin.generateCoinLine() : generateYarrowLine();
      primaryHexagram.value.push(lineValue);
      transformedHexagram.value.push(transformLine(lineValue));
      currentLine.value += 1;
      if (currentLine.value === 7) finalizeHexagrams();
    };

    const finalizeHexagrams = () => {
      const primaryBinary = coin.transformCoinHexagramToBinary(primaryHexagram.value);
      const secondaryBinary = coin.transformCoinHexagramToBinary(transformedHexagram.value);
      hexagram.value = lookupHex(primaryBinary);
      hexagramTransformed.value = lookupHex(secondaryBinary);
      changingLines.value = primaryHexagram.value
        .map((value, index) => (isChangingLine(value) ? index + 1 : null))
        .filter((line) => line !== null);

      hexagramStore.setHexagram(primaryBinary);
      const id = hexagramStore.addConsultation(
        userQuestion.value,
        primaryBinary,
        secondaryBinary,
        changingLines.value,
        divinationMethod.value,
        {
          primaryLines: [...primaryHexagram.value],
          transformedLines: [...transformedHexagram.value],
        },
      );
      viewingSaved.value = id;
      nextTick(() => {
        readingRoot.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };

    const restoreLines = (item) => {
      if (Array.isArray(item.primaryLines) && item.primaryLines.length === 6) {
        const primary = [...item.primaryLines];
        const transformed = Array.isArray(item.transformedLines) && item.transformedLines.length === 6
          ? [...item.transformedLines]
          : primary.map(transformLine);
        return { primary, transformed };
      }
      const binary = typeof item.primaryHexagram === 'string'
        ? item.primaryHexagram
        : item.primaryHexagram?.binary || '';
      const changing = item.changingLines || [];
      const primary = String(binary).split('').map((bit, i) => {
        const ch = changing.includes(i + 1);
        return bit === '1' ? (ch ? 9 : 7) : (ch ? 6 : 8);
      });
      return { primary, transformed: primary.map(transformLine) };
    };

    const openSaved = (item) => {
      const { primary, transformed } = restoreLines(item);
      userQuestion.value = item.question || '';
      divinationMethod.value = item.method === 'yarrow' ? 'yarrow' : 'coin';
      primaryHexagram.value = primary;
      transformedHexagram.value = transformed;
      changingLines.value = [...(item.changingLines || [])];
      currentLine.value = 7;
      viewingSaved.value = item.id;
      const pBin = typeof item.primaryHexagram === 'string'
        ? item.primaryHexagram
        : coin.transformCoinHexagramToBinary(primary);
      const tBin = typeof item.transformedHexagram === 'string'
        ? item.transformedHexagram
        : coin.transformCoinHexagramToBinary(transformed);
      hexagram.value = lookupHex(pBin);
      hexagramTransformed.value = lookupHex(tBin);
      showHistory.value = false;
      nextTick(() => {
        readingRoot.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };

    const reset = () => {
      primaryHexagram.value = [];
      transformedHexagram.value = [];
      hexagram.value = null;
      hexagramTransformed.value = null;
      changingLines.value = [];
      currentLine.value = 1;
      userQuestion.value = '';
      viewingSaved.value = null;
    };

    const hexName = (binary) => shortName(lookupHex(binary)?.name);

    const methodLabel = (method) => (method === 'yarrow' ? 'Yarrow stalk' : 'Coin toss');

    const formatWhen = (stamp) => {
      if (!stamp) return '';
      const dt = DateTime.fromISO(stamp);
      return dt.isValid ? dt.toLocaleString(DateTime.DATETIME_MED) : String(stamp);
    };

    const handleImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        hexagramStore.importHistory(file).catch((error) => {
          alert('Failed to import history: ' + error.message);
        });
        event.target.value = '';
      }
    };

    const deleteSaved = (id) => {
      hexagramStore.removeConsultation(id);
      if (viewingSaved.value === id) reset();
    };

    const clearHistory = () => {
      if (confirm('Clear all saved consultations?')) {
        hexagramStore.clearHistory();
        if (viewingSaved.value) reset();
      }
    };

    return {
      userQuestion,
      primaryHexagram,
      hexagram,
      hexagramTransformed,
      changingLines,
      currentLine,
      divinationMethod,
      showHistory,
      viewingSaved,
      readingRoot,
      hexagramStore,
      history,
      historyNewestFirst,
      tossLabel,
      buildingRows,
      changingLineReadings,
      generateLine,
      reset,
      openSaved,
      handleImport,
      deleteSaved,
      clearHistory,
      hexName,
      methodLabel,
      formatWhen,
      plain,
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
.history-panel,
.cast-card,
.block {
  margin: 0;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
}
.history-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border: 0;
  background: #fff8e8;
  text-align: left;
  padding: 0.9rem 1.15rem;
  border-radius: 0.375rem 0.375rem 0 0;
}
.toggle-hint {
  font-weight: 600;
  color: #5b4cdb;
}
.history-item {
  border-top: 1px solid #efe4c6;
  padding: 0.9rem 0;
}
.history-item.active {
  background: #fff8e8;
  margin: 0 -1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
.when {
  font-size: 0.8rem;
  color: #8a6a22;
  font-weight: 700;
}
.question {
  color: #3d2e10;
  font-weight: 600;
}
.hex-names {
  font-size: 0.95rem;
  color: #5b4a22;
}
.saved-note {
  color: #8a6a22;
  font-size: 0.9rem;
}
.build-figure {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-width: 14rem;
}
.hex-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}
.line-no,
.line-val {
  width: 1.2rem;
  font-size: 0.75rem;
  color: #8a6a22;
  text-align: center;
}
.line-marks {
  display: flex;
  width: 6.4rem;
  height: 0.42rem;
  gap: 0.7rem;
}
.line-marks .seg {
  flex: 1;
  background: #1a1a1a;
  border-radius: 1px;
}
.line-marks.yang {
  gap: 0;
}
.hex-row.changing .seg {
  background: #c62828;
}
.hex-row.empty .line-marks {
  background: #efe4c6;
  border-radius: 1px;
}
.reading-kicker {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 700;
  color: #8a6a22;
  margin-bottom: 0.25rem;
}
.reading-question {
  font-size: 1.45rem;
  color: #3d2e10;
  margin-bottom: 1.25rem;
}
.arrow {
  font-size: 2.2rem;
  color: #8a6a22;
}
.block h3 {
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8a6a22;
  margin-bottom: 0.6rem;
}
.line-reading {
  padding: 0.65rem 0;
  border-top: 1px solid #efe4c6;
}
.line-reading h4 {
  font-size: 1rem;
  color: #3d2e10;
  margin-bottom: 0.2rem;
}
</style>
