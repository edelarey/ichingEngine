<template>
  <div class="hexagram-detail-page">
    <!-- Page Header (Inline) -->
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Hexagram Detail</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/consult">Hexagrams</a></li>
            <li class="breadcrumb-item active" aria-current="page">Hexagram Detail</li>
          </ol>
        </nav>
      </div>
    </header>

    <!-- Hexagram Detail Card -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 mb-4">
        <div class="card">
          <div class="card-body text-center">
            <h3 class="card-title">Hexagram Detail</h3>
            <p class="card-text display-3">{{ hexagram.name }}</p>
            <p :style="{ color: colorClass }" class="card-text display-6">{{ hexagram.binary }}</p>
            <p :style="{ color: colorClass }" class="card-text display-1">{{ hexagram.symbol }}</p>
            <HexagramSymbol 
              :binary="hexagram.binary" 
              :hexagram-symbol="hexagram.hexagram" 
              :show-visual="true"
              size="large" 
              :color="colorClass" 
            />
            <p :style="{ color: colorClass }" class="card-text display-5">{{ hexagram.translation }}</p>
            <div v-if="hexagram.summary" class="card-body">
              <h3 class="card-title">Summary</h3>
              <p class="card-text display-10" v-html="hexagram.summary"></p>
            </div>

            <h5 class="card-title mt-4">Above</h5>
            <p class="card-text display-3">{{ above.name }}</p>
            <TrigramSymbol 
              :binary="above.binary" 
              :trigram-symbol="above.trigram" 
              :show-visual="true"
              size="large" 
              :color="aboveColorClass" 
            />
            <p class="card-text display-5">{{ aboveNature }} : {{ aboveTranslation }}</p>
            <router-link :to="`/trigram_detail?trigram=${above.binary}`" class="btn btn-primary mt-2">Trigram Detail</router-link>

            <h5 class="card-title mt-4">Below</h5>
            <p class="card-text display-3">{{ below.name }}</p>
            <TrigramSymbol 
              :binary="below.binary" 
              :trigram-symbol="below.trigram" 
              :show-visual="true"
              size="large" 
              :color="belowColorClass" 
            />
            <p class="card-text display-5">{{ belowNature }} : {{ belowTranslation }}</p>
            <router-link :to="`/trigram_detail?trigram=${below.binary}`" class="btn btn-primary mt-2">Trigram Detail</router-link>

            <div class="mt-4">
              <router-link to="/consult" class="btn btn-link">Back to Hexagrams</router-link>
            </div>
          </div>

          <div v-if="hexagram.explanation" class="card-body">
            <h3 class="card-title">Explanation</h3>
            <p class="card-text display-10" v-html="hexagram.explanation"></p>
          </div>

          <div v-if="hexagram.image" class="card-body">
            <h3 class="card-title">Image</h3>
            <p class="card-text display-10">{{ hexagram.image }}</p>
          </div>

          <div v-if="hexagram.judgement" class="card-body">
            <h3 class="card-title">The Judgement</h3>
            <p class="card-text display-10" v-html="hexagram.judgement"></p>
          </div>

          <div v-if="hexagram.lines" class="card-body">
            <h3 class="card-title">The Lines</h3>
            <div v-for="(line, index) in formattedLines" :key="index" class="mb-3">
              <h5 class="card-subtitle mb-2 text-muted">{{ line.title }}</h5>
              <p class="card-text display-10" v-html="line.text"></p>
            </div>
            <p v-if="formattedLines.length === 0" class="card-text display-10">No line information available.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hexagram from '@/const/hexagram';
import bagua from '@/const/bagua';
import _ from 'lodash';
import HexagramSymbol from '@/components/HexagramSymbol.vue';
import TrigramSymbol from '@/components/TrigramSymbol.vue';

export default {
  name: 'HexagramDetail',
  components: {
    HexagramSymbol,
    TrigramSymbol,
  },
  data() {
    return {
      hexagram: {},
      above: {},
      below: {},
    };
  },
  computed: {
    colorClass() {
      return 'rgb(0,0,0)';
    },
    aboveColorClass() {
      if (!_.isEmpty(this.above)) {
        const rgb = `rgb(${this.above.description.color.color[0]}, ${this.above.description.color.color[1]}, ${this.above.description.color.color[2]})`;
        return rgb === 'rgb(255,255,255)' ? 'rgb(0,0,0)' : rgb;
      }
      return 'rgb(0,0,0)';
    },
    belowColorClass() {
      if (!_.isEmpty(this.below)) {
        const rgb = `rgb(${this.below.description.color.color[0]}, ${this.below.description.color.color[1]}, ${this.below.description.color.color[2]})`;
        return rgb === 'rgb(255,255,255)' ? 'rgb(0,0,0)' : rgb;
      }
      return 'rgb(0,0,0)';
    },
    aboveTranslation() {
      return !_.isEmpty(this.above) ? this.above.description.translation : '';
    },
    belowTranslation() {
      return !_.isEmpty(this.below) ? this.below.description.translation : '';
    },
    aboveNature() {
      return !_.isEmpty(this.above) ? this.above.description.nature : '';
    },
    belowNature() {
      return !_.isEmpty(this.below) ? this.below.description.nature : '';
    },
    formattedLines() {
      if (!this.hexagram.lines) return [];

      const lines = [];
      const linePattern = /- \*\*Line (\d+):\*\*([^]*?)(?=(?:- \*\*Line \d+:\*\*)|$)/gi;
      let match;

      while ((match = linePattern.exec(this.hexagram.lines)) !== null) {
        const lineNumber = match[1];
        const lineText = match[2].trim();
        lines.push({
          title: `Line ${lineNumber}`,
          text: lineText,
        });
      }

      return lines;
    },
  },
  methods: {
    async getData() {
      this.hexagram = hexagram.sequence_binary().find((item) => item.binary === this.$route.query.hexagram) || {};
      this.above = bagua.sequence_Gua_OldFamilyOrder().find((item) => item.binary === this.hexagram.binary?.substring(0, 3)) || {};
      this.below = bagua.sequence_Gua_OldFamilyOrder().find((item) => item.binary === this.hexagram.binary?.substring(3, 6)) || {};
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
