<template>
  <div class="mantra-visualization-page">
    <!-- Page Header -->
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Vajrasattva 100-Syllable Mantra Visualization</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Mantra Visualization</li>
          </ol>
        </nav>
      </div>
    </header>

    <!-- Control Box -->
    <div class="controls">
      <label for="spiralType">Spiral Type:</label>
      <select v-model="selectedSpiralType">
        <option value="Logarithmic">Logarithmic</option>
        <option value="Archimedean">Archimedean</option>
        <option value="Fermat">Fermat</option>
        <option value="Fibonacci">Fibonacci</option>
      </select>
      <label for="rotations">Rotations:</label>
      <input type="number" v-model.number="rotations" min="1" step="1">
      <label for="startingRadius">Starting Radius:</label>
      <input type="number" v-model.number="startingRadius" min="10" max="100" step="5">
    </div>

    <!-- Mantra Display -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Vajrasattva Mantra Spiral</h5>
            <p class="card-text">
              This visualization displays the 100-syllable Vajrasattva mantra in a spiral, with the seed syllable ཧཱུཾ at the center.
            </p>
            <div class="svg-container">
              <svg ref="mantraSvg" class="center-content"></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import * as d3 from 'd3';
import { useSpiralSettingsStore } from '@/stores/spiralSettings';

export default {
  name: 'VajrasattvaMantra',
  setup() {
    const mantraSvg = ref(null);
    const spiralStore = useSpiralSettingsStore();

    // Reactive variable for the selected spiral type
    const selectedSpiralType = ref('Logarithmic');

    // Computed properties for rotations and startingRadius based on the selected spiral type
    const rotations = computed({
      get: () => spiralStore.getSettings(selectedSpiralType.value).rotations,
      set: (value) => {
        spiralStore.updateSettings(selectedSpiralType.value, {
          rotations: value,
          startingRadius: startingRadius.value,
        });
      },
    });

    const startingRadius = computed({
      get: () => spiralStore.getSettings(selectedSpiralType.value).startingRadius,
      set: (value) => {
        spiralStore.updateSettings(selectedSpiralType.value, {
          rotations: rotations.value,
          startingRadius: value,
        });
      },
    });

    // Watch for changes in selectedSpiralType to initialize settings if needed
    watch(selectedSpiralType, (newType) => {
      spiralStore.initializeSettings(newType);
      drawMantraSpiral();
    });

    // Watch for changes in rotations and startingRadius to redraw the spiral
    watch([rotations, startingRadius], () => {
      drawMantraSpiral();
    });

    const mantraSyllables = [
      '\u0F68\u0F7C\u0F7E', // ཨོཾ
      '\u0F56\u0F5B\u0FB2', // བཛྲ
      '\u0F66\u0F4F\u0FB2', // སཏྭ
      '\u0F66', // ས
      '\u0F58', // མ
      '\u0F61', // ཡ
      '\u0F58', // མ
      '\u0F53\u0F74', // ནུ
      '\u0F54\u0F71', // པཱ
      '\u0F63', // ལ
      '\u0F61', // ཡ
      '\u0F0B', // །
      '\u0F56\u0F5B\u0FB2', // བཛྲ
      '\u0F66\u0F4F\u0FB2', // སཏྭ
      '\u0F4F\u0FB2\u0F7A', // ཏྭེ
      '\u0F53\u0F7C', // ནོ
      '\u0F54', // པ
      '\u0F4F\u0F72\u0F65\u0FB3', // ཏིཥྛ
      '\u0F0B', // །
      '\u0F51\u0FB2\u0F72', // དྲི
      '\u0F4C\u0FB7\u0F7C', // ཌྷོ
      '\u0F58\u0F7A', // མེ
      '\u0F67\u0F7E', // ཿ
      '\u0F0B', // །
      '\u0F66\u0F74', // སུ
      '\u0F4F\u0F7C', // ཏོ
      '\u0F65\u0FB1\u0F7C', // ཥྱོ
      '\u0F58\u0F7A', // མེ
      '\u0F67\u0F7E', // ཿ
      '\u0F0B', // །
      '\u0F66\u0F74', // སུ
      '\u0F54\u0F7C', // པོ
      '\u0F65\u0FB1\u0F7C', // ཥྱོ
      '\u0F58\u0F7A', // མེ
      '\u0F67\u0F7E', // ཿ
      '\u0F0B', // །
      '\u0F68', // ཨ
      '\u0F53\u0F74', // ནུ
      '\u0F62\u0F40\u0FB1\u0F7C', // རཀྟོ
      '\u0F58\u0F7A', // མེ
      '\u0F67\u0F7E', // ཿ
      '\u0F0B', // །
      '\u0F66\u0F62\u0FB2', // སརྦ
      '\u0F66\u0F72\u0F51\u0FB7\u0F72', // སིདྡྷི
      '\u0F58\u0F7A', // མེ
      '\u0F54\u0FB2', // པྲ
      '\u0F61\u0F59\u0F46', // ཡཙཆ
      '\u0F0B', // །
      '\u0F66\u0F62\u0FB2', // སརྦ
      '\u0F40\u0F62\u0F7E', // ཀརྨ
      '\u0F66\u0F74', // སུ
      '\u0F59', // ཙ
      '\u0F58\u0F7A', // མེ
      '\u0F0B', // །
      '\u0F59\u0F72\u0F4F\u0F9E\u0F74', // ཙིཏྟཾ
      '\u0F64\u0FB2\u0F7A', // ཤྲེ
      '\u0F61\u0F7E', // ཡཿ
      '\u0F40\u0F74', // ཀུ
      '\u0F62\u0F74', // རུ
      '\u0F67\u0F71\u0F7E', // ཧཱུཾ
      '\u0F0B', // །
      '\u0F67', // ཧ
      '\u0F67', // ཧ
      '\u0F67', // ཧ
      '\u0F67', // ཧ
      '\u0F67\u0F7C\u0F7E', // ཧོཿ
      '\u0F0B', // །
      '\u0F56\u0F42', // བག
      '\u0F5D\u0F71\u0F53', // ཝཱན
      '\u0F0B', // །
      '\u0F66\u0F62\u0FB2', // སརྦ
      '\u0F4F', // ཏ
      '\u0F50\u0F71', // ཐཱ
      '\u0F42', // ག
      '\u0F4F', // ཏ
      '\u0F56\u0F5B\u0FB2', // བཛྲ
      '\u0F58\u0F71', // མཱ
      '\u0F58\u0F7A', // མེ
      '\u0F58\u0F74\u0F49\u0F46', // མུཉཆ
      '\u0F0B', // །
      '\u0F56\u0F5B\u0FB2\u0F71\u0F72', // བཛྲཱི
      '\u0F56', // བ
      '\u0F5D', // ཝ
      '\u0F0B', // །
      '\u0F58\u0F71', // མཱ
      '\u0F67\u0F71', // ཧཱ
      '\u0F66', // ས
      '\u0F58\u0F71', // མཱ
      '\u0F61', // ཡ
      '\u0F66\u0F4F\u0FB2', // སཏྭ
      '\u0F68\u0F7E', // ཨཿ
    ];

    const drawMantraSpiral = () => {
      const svg = d3.select(mantraSvg.value)
        .attr('viewBox', '0 0 600 600')
        .attr('preserveAspectRatio', 'xMidYMid meet');
      svg.selectAll('*').remove(); // Clear previous content

      const centerX = 300;
      const centerY = 300;
      const maxRadius = 280;
      const a = startingRadius.value;
      const maxTheta = rotations.value * 2 * Math.PI;
      const numPoints = mantraSyllables.length - 1;

      let b, k;
      if (selectedSpiralType.value === 'Logarithmic' || selectedSpiralType.value === 'Fibonacci') {
        b = Math.log(maxRadius / a) / maxTheta;
      } else if (selectedSpiralType.value === 'Archimedean') {
        b = (maxRadius - a) / maxTheta;
      } else if (selectedSpiralType.value === 'Fermat') {
        k = (maxRadius - a) / Math.sqrt(maxTheta);
      }

      const getRadius = (theta) => {
        if (selectedSpiralType.value === 'Logarithmic') {
          return a * Math.exp(b * theta); // Existing logarithmic spiral
        } else if (selectedSpiralType.value === 'Archimedean') {
          return a + b * theta; // Existing Archimedean spiral
        } else if (selectedSpiralType.value === 'Fermat') {
          return a + k * Math.sqrt(theta); // Existing Fermat spiral
        } else if (selectedSpiralType.value === 'Fibonacci') {
          const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio ≈ 1.618
          const bFib = Math.log(phi) / (Math.PI / 2); // Growth rate for Fibonacci spiral
          return a * Math.exp(bFib * theta); // Radius based on golden ratio
        }
      };

      // Center syllable
      svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY)
        .attr('font-size', 24)
        .attr('font-family', 'Noto Sans Tibetan, sans-serif')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#FF4500')
        .text('ཧཱུཾ');

      // Spiral positions
      const spiralData = mantraSyllables.slice(1).map((syllable, i) => {
        const theta = (i / numPoints) * maxTheta;
        const radius = getRadius(theta);
        const x = centerX + radius * Math.cos(theta);
        const y = centerY + radius * Math.sin(theta);
        return { syllable, x, y, theta };
      });

      // Place syllables
      svg.selectAll('.mantra-syllable')
        .data(spiralData)
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('font-size', 18)
        .attr('font-family', 'Noto Sans Tibetan, sans-serif')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('transform', d => `rotate(${(d.theta * 180 / Math.PI) + 90}, ${d.x}, ${d.y})`)
        .attr('fill', '#000')
        .text(d => d.syllable);
    };

    onMounted(() => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Tibetan&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      // Initialize settings for the default spiral type
      spiralStore.initializeSettings(selectedSpiralType.value);
      drawMantraSpiral();
    });

    return {
      mantraSvg,
      selectedSpiralType,
      rotations,
      startingRadius,
    };
  },
};
</script>

<style scoped>
.mantra-visualization-page {
  padding-bottom: 2rem;
}

.controls {
  margin-bottom: 20px;
  text-align: center;
}

.controls label {
  margin-right: 10px;
}

.controls select,
.controls input {
  margin-right: 20px;
  padding: 5px;
}
</style>