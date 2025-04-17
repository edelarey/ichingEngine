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

    <!-- Mantra Display -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Vajrasattva Mantra Spiral</h5>
            <p class="card-text">
              This visualization displays the 100-syllable Vajrasattva mantra in a spiral, with the seed syllable ཧཱུཾ at the center.
            </p>
            <!-- SVG container for D3 to render into -->
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
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

export default {
  name: 'VajrasattvaMantra',
  setup() {
    const mantraSvg = ref(null);

    // Method to draw the mantra spiral using D3.js
    const drawMantraSpiral = () => {
      // Mantra syllables (100 syllables)
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

      // Set up the SVG canvas
      const svg = d3.select(mantraSvg.value)
        .attr('viewBox', '0 0 600 600')
        .attr('preserveAspectRatio', 'xMidYMid meet');

      // Background Circle
      svg.append('circle')
        .attr('cx', 300)
        .attr('cy', 300)
        .attr('r', 290)
        .attr('fill', '#fff')
        .attr('stroke', '#000')
        .attr('stroke-width', 2);

      // Spiral parameters
      const centerX = 300;
      const centerY = 300;
      const a = 7; // Small initial radius
      const b = 7; // Increased growth rate to match desired spiral pattern
      const numPoints = mantraSyllables.length - 1; // Exclude the center syllable
      const maxTheta = 12 * Math.PI; // 15 rotations to fill the circle

      // Place the center syllable (hūṃ) explicitly at the center
      svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY)
        .attr('font-size', 24)
        .attr('font-family', 'Noto Sans Tibetan, sans-serif')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#FF4500')
        .text('ཧཱུཾ');

      // Generate spiral positions for the remaining 99 syllables
      const spiralData = mantraSyllables.slice(1).map((syllable, i) => {
        const theta = (i / numPoints) * maxTheta; // Angle from 0 to maxTheta
        const radius = a + b * theta; // Archimedean spiral: r = a + bθ
        const x = centerX + radius * Math.cos(theta);
        const y = centerY + radius * Math.sin(theta);
        return { syllable, x, y, theta };
      });

      // Place syllables on the spiral
      svg.selectAll('.mantra-syllable')
        .data(spiralData)
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('font-size', 18) // Smaller font size to fit dense spiral
        .attr('font-family', 'Noto Sans Tibetan, sans-serif')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('transform', d => `rotate(${(d.theta * 180 / Math.PI) + 90}, ${d.x}, ${d.y})`)
        .attr('fill', '#000')
        .text(d => d.syllable);

      // Optional: Draw the spiral path for debugging
      const spiralPath = d3.line()
        .x((i) => {
          const theta = (i / numPoints) * maxTheta;
          return centerX + (a + b * theta) * Math.cos(theta);
        })
        .y((i) => {
          const theta = (i / numPoints) * maxTheta;
          return centerY + (a + b * theta) * Math.sin(theta);
        });

     
    };

    // Lifecycle hook to draw the spiral after the component is mounted
    onMounted(() => {
      // Load Tibetan font
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Tibetan&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      drawMantraSpiral();
    });

    return {
      mantraSvg,
    };
  },
};
</script>

<style scoped>
/* Reuse existing styles from main.css */
.mantra-visualization-page {
  padding-bottom: 2rem;
}
</style>