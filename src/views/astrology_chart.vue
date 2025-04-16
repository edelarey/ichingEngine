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
      <div class="col-12 col-md-10 col-lg-8 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">I Ching and Chinese Zodiac Chart</h5>
            <p class="card-text">
              This chart integrates the I Ching trigrams with the Chinese zodiac, showing their directional and elemental relationships.
            </p>
            <!-- SVG container for D3 to render into -->
            <div class="svg-container">
              <svg ref="chartSvg" class="center-content"></svg>
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
  name: 'AstrologyChart',
  setup() {
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
        { name: 'Rat', symbol: '鼠', angle: 0 }, // North
        { name: 'Ox', symbol: '牛', angle: 30 }, // Northeast
        { name: 'Tiger', symbol: '虎', angle: 60 }, // Northeast
        { name: 'Rabbit', symbol: '兔', angle: 90 }, // East
        { name: 'Dragon', symbol: '龙', angle: 120 }, // Southeast
        { name: 'Snake', symbol: '蛇', angle: 150 }, // Southeast
        { name: 'Horse', symbol: '马', angle: 180 }, // South
        { name: 'Goat', symbol: '羊', angle: 210 }, // Southwest
        { name: 'Monkey', symbol: '猴', angle: 240 }, // Southwest
        { name: 'Rooster', symbol: '鸡', angle: 270 }, // West
        { name: 'Dog', symbol: '狗', angle: 300 }, // Northwest
        { name: 'Pig', symbol: '猪', angle: 330 }, // Northwest
      ];

      const loShu = [
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6],
      ];

      // Set up the SVG canvas
      const svg = d3.select(chartSvg.value)
        .attr('viewBox', '0 0 500 500')
        .attr('preserveAspectRatio', 'xMidYMid meet');

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

      // Zodiac Animals (English name and Chinese symbol)
      zodiac.forEach(animal => {
        const nameRadius = 205; // Radius for the English name (closer to the inner ring)
        const symbolRadius = 220; // Radius for the Chinese symbol (farther out but still within the outer ring)
        const angleRad = (animal.angle - 90) * (Math.PI / 180); // Adjust for SVG coordinate system

        // English name position
        const nameX = 250 + nameRadius * Math.cos(angleRad);
        const nameY = 250 + nameRadius * Math.sin(angleRad);

        // Chinese symbol position
        const symbolX = 250 + symbolRadius * Math.cos(angleRad);
        const symbolY = 250 + symbolRadius * Math.sin(angleRad);

        // English name
        svg.append('text')
          .attr('x', nameX)
          .attr('y', nameY)
          .attr('font-size', 14)
          .attr('text-anchor', 'middle')
          .attr('transform', `rotate(${animal.angle}, ${nameX}, ${nameY})`)
          .text(animal.name);

        // Chinese symbol
        svg.append('text')
          .attr('x', symbolX)
          .attr('y', symbolY)
          .attr('font-size', 16) // Slightly larger for the Chinese symbol
          .attr('text-anchor', 'middle')
          .attr('transform', `rotate(${animal.angle}, ${symbolX}, ${symbolY})`)
          .text(animal.symbol);
      });
    };

    // Lifecycle hook to draw the chart after the component is mounted
    onMounted(() => {
      drawChart();
    });

    return {
      chartSvg,
    };
  },
};
</script>