<template>
  <div class="astrology-chart-page">
    <!-- Page Header -->
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">I Ching Astrology Chart</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Astrology Chart</li>
          </ol>
        </nav>
      </div>
    </header>

    <!-- Chart Display -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">I Ching and Chinese Zodiac Chart</h5>
            <p class="card-text">
              This chart integrates the I Ching trigrams with the Chinese zodiac, showing their directional and elemental relationships.
            </p>
            <!-- SVG container for D3 to render into -->
            <svg ref="chartSvg" :width="svgWidth" :height="svgHeight" class="center-content"></svg>
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
  name: 'AstrologyChart',
  setup() {
    // Reactive references for SVG dimensions
    const svgWidth = ref(500);
    const svgHeight = ref(500);
    const chartSvg = ref(null);

    // Method to draw the chart using D3.js
    const drawChart = () => {
      // Data for the chart
      const trigrams = [
        { symbol: '☰', name: 'Qian', angle: 315, xOffset: -100, yOffset: -100 }, // Northwest
        { symbol: '☷', name: 'Kun', angle: 225, xOffset: -100, yOffset: 100 }, // Southwest
        { symbol: '☳', name: 'Zhen', angle: 90, xOffset: 100, yOffset: 0 }, // East
        { symbol: '☴', name: 'Xun', angle: 45, xOffset: 100, yOffset: -100 }, // Southeast
        { symbol: '☵', name: 'Kan', angle: 0, xOffset: 0, yOffset: -150 }, // North
        { symbol: '☶', name: 'Gen', angle: 135, xOffset: 100, yOffset: 100 }, // Northeast
        { symbol: '☲', name: 'Li', angle: 180, xOffset: 0, yOffset: 150 }, // South
        { symbol: '☱', name: 'Dui', angle: 270, xOffset: -100, yOffset: 0 }, // West
      ];

      const zodiac = [
        { name: 'Rat', angle: 0 }, // North
        { name: 'Ox', angle: 30 }, // Northeast
        { name: 'Tiger', angle: 60 }, // Northeast
        { name: 'Rabbit', angle: 90 }, // East
        { name: 'Dragon', angle: 120 }, // Southeast
        { name: 'Snake', angle: 150 }, // Southeast
        { name: 'Horse', angle: 180 }, // South
        { name: 'Goat', angle: 210 }, // Southwest
        { name: 'Monkey', angle: 240 }, // Southwest
        { name: 'Rooster', angle: 270 }, // West
        { name: 'Dog', angle: 300 }, // Northwest
        { name: 'Pig', angle: 330 }, // Northwest
      ];

      const loShu = [
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6],
      ];

      // Set up the SVG canvas
      const svg = d3.select(chartSvg.value)
        .attr('viewBox', '0 0 500 500');

      // Background Circle
      svg.append('circle')
        .attr('cx', 250)
        .attr('cy', 250)
        .attr('r', 240)
        .attr('fill', '#f5e6cc')
        .attr('stroke', '#8b4513')
        .attr('stroke-width', 5);

      // Outer Zodiac Ring Background
      svg.append('circle')
        .attr('cx', 250)
        .attr('cy', 250)
        .attr('r', 200)
        .attr('fill', 'none')
        .attr('stroke', '#8b4513')
        .attr('stroke-width', 2);

      // Lo Shu Square
      svg.append('rect')
        .attr('x', 175)
        .attr('y', 175)
        .attr('width', 150)
        .attr('height', 150)
        .attr('fill', '#fff')
        .attr('stroke', '#000')
        .attr('stroke-width', 2);

      // Grid lines for Lo Shu Square
      svg.append('line')
        .attr('x1', 225)
        .attr('y1', 175)
        .attr('x2', 225)
        .attr('y2', 325)
        .attr('stroke', '#000')
        .attr('stroke-width', 1);

      svg.append('line')
        .attr('x1', 275)
        .attr('y1', 175)
        .attr('x2', 275)
        .attr('y2', 325)
        .attr('stroke', '#000')
        .attr('stroke-width', 1);

      svg.append('line')
        .attr('x1', 175)
        .attr('y1', 225)
        .attr('x2', 325)
        .attr('y2', 225)
        .attr('stroke', '#000')
        .attr('stroke-width', 1);

      svg.append('line')
        .attr('x1', 175)
        .attr('y1', 275)
        .attr('x2', 325)
        .attr('y2', 275)
        .attr('stroke', '#000')
        .attr('stroke-width', 1);

      // Lo Shu Numbers
      loShu.forEach((row, i) => {
        row.forEach((num, j) => {
          svg.append('text')
            .attr('x', 200 + j * 50)
            .attr('y', 200 + i * 50)
            .attr('font-size', 16)
            .attr('text-anchor', 'middle')
            .text(num);
        });
      });

      // Trigrams
      trigrams.forEach(trigram => {
        const x = 250 + trigram.xOffset;
        const y = 250 + trigram.yOffset;
        // Trigram symbol
        svg.append('text')
          .attr('x', x)
          .attr('y', y)
          .attr('font-size', 20)
          .attr('text-anchor', 'middle')
          .text(trigram.symbol);

        // Trigram name
        svg.append('text')
          .attr('x', x)
          .attr('y', y + 20)
          .attr('font-size', 14)
          .attr('text-anchor', 'middle')
          .text(trigram.name);
      });

      // Zodiac Animals
      zodiac.forEach(animal => {
        const radius = 220;
        const angleRad = (animal.angle - 90) * (Math.PI / 180); // Adjust for SVG coordinate system
        const x = 250 + radius * Math.cos(angleRad);
        const y = 250 + radius * Math.sin(angleRad);

        svg.append('text')
          .attr('x', x)
          .attr('y', y)
          .attr('font-size', 14)
          .attr('text-anchor', 'middle')
          .attr('transform', `rotate(${animal.angle}, ${x}, ${y})`)
          .text(animal.name);
      });
    };

    // Lifecycle hook to draw the chart after the component is mounted
    onMounted(() => {
      drawChart();
    });

    return {
      svgWidth,
      svgHeight,
      chartSvg,
    };
  },
};
</script>

<style scoped>
/* Reuse styles from Consult.vue */
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>