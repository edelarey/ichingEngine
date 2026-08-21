<template>
  <div class="reading-lead card mb-4">
    <div class="card-body">
      <p class="eyebrow mb-1">In plain English</p>
      <h3 class="headline">{{ headline }}</h3>
      <p v-if="intro" class="intro">{{ intro }}</p>
      <ul class="points mb-0">
        <li v-for="(point, i) in points" :key="i">
          <strong>{{ point.label }}.</strong>
          {{ point.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReadingLead',
  props: {
    headline: { type: String, default: '' },
    intro: { type: String, default: '' },
    points: { type: Array, default: () => [] },
  },
};
</script>

<style scoped>
.reading-lead {
  background: linear-gradient(180deg, #fff8e8 0%, #fffdf7 100%);
  border: 1px solid #e6d5a8;
  box-shadow: 0 2px 8px rgba(107, 79, 29, 0.08);
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 700;
  color: #8a6a22;
}
.headline {
  font-size: 1.35rem;
  color: #3d2e10;
  margin-bottom: 0.75rem;
}
.intro {
  color: #4a3b16;
  margin-bottom: 0.85rem;
}
.points {
  padding-left: 1.15rem;
}
.points li {
  margin-bottom: 0.45rem;
  color: #333;
}
.points li:last-child {
  margin-bottom: 0;
}
</style>
