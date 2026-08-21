<template>
  <div class="astro-summary">
    <h4 class="text-center mb-4">Astrological Summary</h4>

    <ReadingLead
      v-if="executive"
      :headline="executive.headline"
      :intro="executive.intro"
      :points="executive.points"
    />

    <div class="row">
      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Sun</h5>
            <div class="zodiac-symbol">{{ sun.symbol }}</div>
            <h6>{{ sun.name }} {{ sunDegree }}</h6>
            <p class="card-text">{{ sunText }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Moon</h5>
            <div class="zodiac-symbol">{{ moon.symbol }}</div>
            <h6>{{ moon.name }} {{ moonDegree }}</h6>
            <p class="card-text">{{ moonText }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Rising (Ascendant)</h5>
            <div class="zodiac-symbol">{{ rising.symbol }}</div>
            <h6>{{ rising.name }} {{ risingDegree }}</h6>
            <p class="card-text">{{ risingText }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col-12 col-md-6 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Elemental Balance</h5>
            <div v-for="element in elementBalance" :key="element.name" class="element-bar">
              <span class="element-name">{{ element.name }}</span>
              <div class="progress">
                <div class="progress-bar" :style="{ width: element.percentage + '%', backgroundColor: element.color }"></div>
              </div>
              <span class="element-count">{{ element.count }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Modality Balance</h5>
            <div v-for="modality in modalityBalance" :key="modality.name" class="modality-bar">
              <span class="modality-name">{{ modality.name }}</span>
              <div class="progress">
                <div class="progress-bar" :style="{ width: modality.percentage + '%', backgroundColor: modality.color }"></div>
              </div>
              <span class="modality-count">{{ modality.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3" v-if="aspects.length">
      <div class="card-body">
        <h5 class="card-title">Major Aspects</h5>
        <p class="small text-muted">Orbs: conjunction/square/trine/opposition 8°, sextile 6°. Tightest first.</p>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr><th>Pair</th><th>Aspect</th><th>Orb</th><th></th></tr>
            </thead>
            <tbody>
              <tr v-for="(a, i) in aspects" :key="i">
                <td>{{ a.planet1 }} – {{ a.planet2 }}</td>
                <td>{{ a.symbol }} {{ a.aspect }}</td>
                <td>{{ a.orb.toFixed(2) }}°</td>
                <td class="small">{{ a.blurb }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card mb-3" v-if="transits">
      <div class="card-body">
        <h5 class="card-title">Current transits</h5>
        <p class="small text-muted">Sky right now ({{ transits.asOfLabel }}) against this natal chart. Tightest hits first.</p>
        <div class="table-responsive mb-2">
          <table class="table table-sm">
            <thead>
              <tr><th>Transit</th><th>Sign now</th><th>Degree</th></tr>
            </thead>
            <tbody>
              <tr v-for="t in transits.transiting" :key="t.key">
                <td>{{ t.symbol }} {{ t.name }}</td>
                <td>{{ t.sign }}</td>
                <td>{{ t.degreeLabel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="transits.hits.length" class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr><th>Hit</th><th>Aspect</th><th>Orb</th></tr>
            </thead>
            <tbody>
              <tr v-for="(h, i) in transits.hits" :key="i">
                <td>t.{{ h.transit }} → n.{{ h.natal }}</td>
                <td>{{ h.symbol }} {{ h.aspect }}</td>
                <td>{{ h.orb.toFixed(2) }}°</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="small mb-0">No major transit-to-natal aspects inside a 6° orb at the moment.</p>
      </div>
    </div>

    <div class="card mb-3" v-if="planetNotes.length">
      <div class="card-body">
        <h5 class="card-title">Planets in Sign and House</h5>
        <p v-for="p in planetNotes" :key="p.key" class="mb-2">{{ p.blurb }}</p>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Birth Chart Details</h5>
        <div class="row">
          <div class="col-md-6">
            <p><strong>Birth Date:</strong> {{ formatDate(birth.date) }}</p>
            <p><strong>Birth Time:</strong> {{ birth.time }} {{ birth.timezoneLabel || '' }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Location:</strong> {{ birth.place || 'Custom coordinates' }}</p>
            <p><strong>Coordinates:</strong> {{ formatCoordinates(birth.latitude, birth.longitude) }}</p>
          </div>
        </div>
        <p class="small text-muted mb-0">{{ engineNote }}</p>
        <p class="small text-muted mb-0">{{ disclaimer }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { WESTERN_SIGNS, signFromLongitude } from '@/const/western';
import ReadingLead from './ReadingLead.vue';

export default {
  name: 'AstroSummary',
  components: { ReadingLead },
  props: {
    chartData: { type: Object, required: true },
    planetPositions: { type: Array, default: () => [] },
  },
  setup(props) {
    const getSign = (longitude) => {
      if (typeof longitude !== 'number') return WESTERN_SIGNS[0];
      return signFromLongitude(longitude);
    };

    const sunPlanet = computed(() => props.planetPositions.find((p) => p.name === 'Sun' || p.key === 'sun') || {});
    const moonPlanet = computed(() => props.planetPositions.find((p) => p.name === 'Moon' || p.key === 'moon') || {});

    const sun = computed(() => sunPlanet.value.signMeta || getSign(sunPlanet.value.longitude));
    const moon = computed(() => moonPlanet.value.signMeta || getSign(moonPlanet.value.longitude));
    const rising = computed(() => {
      if (props.chartData.risingSign) return props.chartData.risingSign;
      if (typeof props.chartData.ascendant === 'number') return getSign(props.chartData.ascendant);
      return sun.value;
    });

    const sunDegree = computed(() => sunPlanet.value.degreeLabel || '');
    const moonDegree = computed(() => moonPlanet.value.degreeLabel || '');
    const risingDegree = computed(() => {
      if (props.chartData.risingSign) return `${props.chartData.risingSign.degreeInSign.toFixed(2)}°`;
      return '';
    });

    const sunText = computed(() => (props.chartData.interpretations && props.chartData.interpretations.sun) || sun.value.sun || sun.value.description);
    const moonText = computed(() => (props.chartData.interpretations && props.chartData.interpretations.moon) || moon.value.moon || moon.value.description);
    const risingText = computed(() => (props.chartData.interpretations && props.chartData.interpretations.rising) || rising.value.rising || rising.value.description);

    const countedPlanets = computed(() =>
      props.planetPositions.filter((p) => p.key !== 'northnode' && p.key !== 'southnode' && p.name !== 'North Node' && p.name !== 'South Node')
    );

    const elementBalance = computed(() => {
      const elements = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
      countedPlanets.value.forEach((planet) => {
        const sign = planet.signMeta || getSign(planet.longitude);
        if (sign.element) elements[sign.element] += 1;
      });
      const total = Object.values(elements).reduce((s, n) => s + n, 0);
      const colors = { Fire: '#FF4500', Earth: '#8B4513', Air: '#87CEEB', Water: '#4682B4' };
      return Object.entries(elements).map(([name, count]) => ({
        name, count, percentage: total ? (count / total) * 100 : 0, color: colors[name],
      }));
    });

    const modalityBalance = computed(() => {
      const modalities = { Cardinal: 0, Fixed: 0, Mutable: 0 };
      countedPlanets.value.forEach((planet) => {
        const sign = planet.signMeta || getSign(planet.longitude);
        if (sign.modality) modalities[sign.modality] += 1;
      });
      const total = Object.values(modalities).reduce((s, n) => s + n, 0);
      const colors = { Cardinal: '#FF6B6B', Fixed: '#4ECDC4', Mutable: '#45B7D1' };
      return Object.entries(modalities).map(([name, count]) => ({
        name, count, percentage: total ? (count / total) * 100 : 0, color: colors[name],
      }));
    });

    const aspects = computed(() => props.chartData.aspects || []);
    const transits = computed(() => props.chartData.transits || null);
    const planetNotes = computed(() => (props.planetPositions || []).filter((p) => p.blurb));
    const birth = computed(() => (props.chartData.birth || props.chartData.birthData || {}));
    const executive = computed(() => (props.chartData.interpretations && props.chartData.interpretations.executive) || null);
    const engineNote = computed(() => (props.chartData.interpretations && props.chartData.interpretations.engine) || '');
    const disclaimer = computed(() => (props.chartData.interpretations && props.chartData.interpretations.disclaimer) || '');

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };
    const formatCoordinates = (lat, lng) => {
      if (typeof lat !== 'number' || typeof lng !== 'number') return '';
      const latDir = lat >= 0 ? 'N' : 'S';
      const lngDir = lng >= 0 ? 'E' : 'W';
      return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
    };

    return {
      sun, moon, rising, sunDegree, moonDegree, risingDegree,
      executive,
      transits,
      sunText, moonText, risingText,
      elementBalance, modalityBalance, aspects, planetNotes, birth,
      engineNote, disclaimer, formatDate, formatCoordinates,
    };
  },
};
</script>

<style scoped>
.astro-summary { margin: 2rem 0; }
.zodiac-symbol { font-size: 3rem; margin: 1rem 0; color: #6c63ff; }
.element-bar, .modality-bar { display: flex; align-items: center; margin-bottom: 0.5rem; }
.element-name, .modality-name { min-width: 80px; font-weight: 600; }
.progress { flex: 1; margin: 0 0.5rem; height: 20px; }
.element-count, .modality-count { min-width: 30px; text-align: center; font-weight: 600; }
.card { box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e9ecef; }
.card-title {
  color: #495057;
  border-bottom: 2px solid #6c63ff;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
</style>
