<template>
  <div class="hexagrams-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Hexagrams</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">Hexagrams</li>
          </ol>
        </nav>
        <p class="mb-0 lead-blurb">
          Sixty-four figures of six lines. Browse by King Wen number, or search a name, translation, or binary.
          <router-link to="/hexagram_sequence">See them in sequence</router-link>.
        </p>
      </div>
    </header>

    <div class="container mb-5">
      <div class="toolbar row g-3 align-items-end mb-4">
        <div class="col-12 col-md-6 col-lg-5">
          <label class="form-label" for="hex-search">Search</label>
          <input
            id="hex-search"
            v-model="query"
            type="search"
            class="form-control"
            placeholder="Name, translation, King Wen number, binary…"
          />
        </div>
        <div class="col-8 col-md-4 col-lg-3">
          <SheetSelect
            id="hex-sort"
            label="Order"
            :options="sortOptions"
            v-model="sortBy"
          />
        </div>
        <div class="col-4 col-md-2 col-lg-2">
          <p class="count mb-0">{{ filtered.length }} of 64</p>
        </div>
      </div>

      <p v-if="filtered.length === 0" class="text-muted">No hexagram matches that search.</p>
      <div class="row g-3">
        <div
          v-for="hex in filtered"
          :key="hex.binary"
          class="col-6 col-sm-4 col-md-3 col-xl-2"
        >
          <router-link
            :to="`/hexagram_detail?hexagram=${hex.binary}`"
            class="hex-card card h-100 text-decoration-none"
          >
            <div class="card-body">
              <p class="kingwen mb-1">{{ hex.kingwen }}</p>
              <p class="glyph" aria-hidden="true">{{ hex.hexagram }}</p>
              <h2 class="name">{{ shortName(hex.name) }}</h2>
              <p class="translation mb-0">{{ firstPhrase(hex.translation) }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import hexagram from '@/const/hexagram';
import { usePageTitle } from '@/composables/usePageTitle';
import SheetSelect from '@/components/SheetSelect.vue';

const sortOptions = [
  { value: 'kingwen', label: 'King Wen' },
  { value: 'binary', label: 'Binary (Fu Xi)' },
  { value: 'name', label: 'Name' },
];

export default {
  name: 'Hexagrams',
  components: { SheetSelect },
  setup() {
    usePageTitle('Hexagrams');
    const query = ref('');
    const sortBy = ref('kingwen');

    const all = computed(() => {
      const list = hexagram.sequence_binary() || [];
      if (sortBy.value === 'kingwen') {
        return [...list].sort((a, b) => (a.kingwen || 0) - (b.kingwen || 0));
      }
      if (sortBy.value === 'name') {
        return [...list].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
      }
      return list;
    });

    const filtered = computed(() => {
      const q = query.value.trim().toLowerCase();
      if (!q) return all.value;
      return all.value.filter((hex) => {
        const hay = [
          hex.name,
          hex.translation,
          hex.symbol,
          hex.hexagram,
          hex.binary,
          hex.kingwen,
          hex.zodiac,
        ].join(' ').toLowerCase();
        return hay.includes(q);
      });
    });

    const firstPhrase = (text) => {
      if (!text) return '';
      return String(text).split(',')[0].trim();
    };

    const shortName = (name) => {
      if (!name) return '—';
      return String(name).split(',')[0].trim();
    };

    return { query, sortBy, sortOptions, filtered, firstPhrase, shortName };
  },
};
</script>

<style scoped>
.lead-blurb {
  max-width: 44rem;
  color: #4a3b16;
}
.count {
  color: #6b5a32;
  font-size: 0.9rem;
}
.hex-card {
  margin: 0;
  border: 1px solid #e6d5a8;
  background: #fffdf7;
  color: inherit;
  text-align: center;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.hex-card:hover {
  border-color: #c9b06a;
  box-shadow: 0 4px 14px rgba(107, 79, 29, 0.12);
}
.kingwen {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #8a6a22;
}
.glyph {
  font-size: 2.6rem;
  line-height: 1;
  margin: 0.15rem 0 0.35rem;
  color: #3d2e10;
}
.name {
  font-size: 1rem;
  margin: 0 0 0.2rem;
  color: #3d2e10;
}
.translation {
  font-size: 0.82rem;
  color: #5b4a22;
}
</style>
