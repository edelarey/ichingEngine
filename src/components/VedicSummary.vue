<template>
  <div class="vedic-summary">
    <h4 class="text-center mb-4">Jyotish Reading (Vedic Interpretation)</h4>

    <ReadingLead
      v-if="chart.interpretations && chart.interpretations.executive"
      :headline="chart.interpretations.executive.headline"
      :intro="chart.interpretations.executive.intro"
      :points="chart.interpretations.executive.points"
    />

    <div class="row">
      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Lagna (Ascendant)</h5>
            <p class="lead mb-1">{{ chart.lagna.rashiLabel }}</p>
            <p class="small text-muted">{{ chart.lagna.formatted }} · lord {{ chart.lagna.lordLabel }}</p>
            <p class="card-text">{{ chart.interpretations.lagna }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Chandra (Moon)</h5>
            <p class="lead mb-1">{{ moon.rashiLabel }}</p>
            <p class="small text-muted">{{ moon.nakshatraLabel }} pāda {{ moon.pada }}</p>
            <p class="card-text">{{ chart.interpretations.moon }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Sūrya (Sun)</h5>
            <p class="lead mb-1">{{ sun.rashiLabel }}</p>
            <p class="small text-muted">{{ sun.houseLabel }}</p>
            <p class="card-text">{{ chart.interpretations.sun }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Vimśottarī Daśā (Planetary Periods)</h5>
        <p>{{ chart.interpretations.dasha }}</p>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Mahādaśā (Major period)</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in chart.dasha.timeline"
                :key="p.start"
                :class="{ 'table-warning': p.start === chart.dasha.currentMaha.start }"
              >
                <td>{{ p.lord.nameSa }} ({{ p.lord.nameEn }})</td>
                <td>{{ p.startLabel }}</td>
                <td>{{ p.endLabel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="small text-muted mb-0">
          Highlighted row is the current mahādaśā. Sub-period (antardaśā) is
          {{ chart.dasha.currentAntar.lord.nameSa }} ({{ chart.dasha.currentAntar.lord.nameEn }})
          {{ chart.dasha.currentAntar.startLabel }} – {{ chart.dasha.currentAntar.endLabel }}.
        </p>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Grahas (Planets)</h5>
        <div v-for="note in chart.interpretations.grahas" :key="note.key" class="mb-3">
          <h6>{{ note.title }}</h6>
          <p class="mb-0">{{ note.text }}</p>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Twelve Bhāvas (Houses)</h5>
        <div v-for="h in chart.interpretations.houses" :key="h.number" class="mb-3">
          <h6>{{ h.title }} · {{ h.rashiLabel }}</h6>
          <p class="small text-muted mb-1">{{ h.group }}</p>
          <p class="mb-0">{{ h.text }}</p>
        </div>
      </div>
    </div>

    <p class="small text-muted">{{ chart.interpretations.disclaimer }}</p>
  </div>
</template>

<script>
import { computed } from 'vue';
import ReadingLead from './ReadingLead.vue';

export default {
  name: 'VedicSummary',
  components: { ReadingLead },
  props: {
    chart: { type: Object, required: true },
  },
  setup(props) {
    const moon = computed(() => props.chart.grahas.find((g) => g.key === 'moon') || {});
    const sun = computed(() => props.chart.grahas.find((g) => g.key === 'sun') || {});
    return { moon, sun };
  },
};
</script>

<style scoped>
.card-title {
  color: #495057;
  border-bottom: 2px solid #c9a227;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
.lead {
  color: #6b4f1d;
}
</style>
