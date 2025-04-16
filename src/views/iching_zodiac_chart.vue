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
            <h5 class="card-title">I Ching and Zodiac Chart</h5>
            <p class="card-text">
              This chart integrates the I Ching hexagrams with the Western zodiac, showing their symbolic relationships.
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
import hexagram from '@/const/hexagram';

export default {
  name: 'AstrologyChart',
  setup() {
    const chartSvg = ref(null);

    // Method to draw the chart using D3.js
    const drawChart = () => {
      // Data for the chart
      const zodiacData = [
        { sign: 'Capricorn', symbol: '♑', angle: 345, color: '#6A5ACD' },
        { sign: 'Sagittarius', symbol: '♐', angle: 15, color: '#4682B4' },
        { sign: 'Scorpio', symbol: '♏', angle: 45, color: '#00CED1' },
        { sign: 'Libra', symbol: '♎', angle: 75, color: '#32CD32' },
        { sign: 'Virgo', symbol: '♍', angle: 100, color: '#9ACD32' },
        { sign: 'Leo', symbol: '♌', angle: 130, color: '#FFD700' },
        { sign: 'Cancer', symbol: '♋', angle: 160, color: '#FFA500' },
        { sign: 'Gemini', symbol: '♊', angle: 195, color: '#FF4500' },
        { sign: 'Taurus', symbol: '♉', angle: 225, color: '#FF6347' },
        { sign: 'Aries', symbol: '♈', angle: 260, color: '#FF0000' },
        { sign: 'Pisces', symbol: '♓', angle: 290, color: '#FF69B4' },
        { sign: 'Aquarius', symbol: '♒', angle: 315, color: '#FF00FF' },
      ];

      // Get the hexagram sequence in binary order
      const hexagramSequence = hexagram.sequence_binary();

      // Prepare data for the hexagram grid and circular arrangement
      const hexagramGrid = [];
      for (let i = 0; i < 64; i++) {
        hexagramGrid.push({
          hexagram: hexagramSequence[i].hexagram,
          symbol: hexagramSequence[i].symbol, // Chinese text
          index: i,
        });
      }

      // Set up the SVG canvas
      const svg = d3.select(chartSvg.value)
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

      // Zodiac Sections (color-coded wedges)
      const arc = d3.arc()
        .innerRadius(200)
        .outerRadius(290)
        .cornerRadius(0);

      const pie = d3.pie()
        .sort(null)
        .value(() => 1);

      svg.selectAll('.zodiac-wedge')
        .data(pie(zodiacData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.color)
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('transform', 'translate(300, 300)');

      // Zodiac Labels (Sign and Symbol)
      zodiacData.forEach(zodiac => {
        const signRadius = 250; // Radius for the zodiac sign name
        const symbolRadius = 270; // Radius for the zodiac symbol (farther out to avoid overlap)
        const angleRad = (zodiac.angle - 90) * (Math.PI / 180); // Adjust for SVG coordinate system

        // Zodiac sign name position
        const signX = 300 + signRadius * Math.cos(angleRad);
        const signY = 300 + signRadius * Math.sin(angleRad);

        // Zodiac symbol position
        const symbolX = 300 + symbolRadius * Math.cos(angleRad);
        const symbolY = 300 + symbolRadius * Math.sin(angleRad);

        // Zodiac sign name
        svg.append('text')
          .attr('x', signX)
          .attr('y', signY)
          .attr('font-size', 16)
          .attr('text-anchor', 'middle')
          .attr('transform', `rotate(${zodiac.angle}, ${signX}, ${signY})`)
          .text(zodiac.sign);

        // Zodiac symbol
        svg.append('text')
          .attr('x', symbolX)
          .attr('y', symbolY)
          .attr('font-size', 20) // Slightly larger for the symbol
          .attr('text-anchor', 'middle')
          .attr('transform', `rotate(${zodiac.angle}, ${symbolX}, ${symbolY})`)
          .text(zodiac.symbol);
      });

      // Hexagram Grid (8x8 grid for 64 hexagrams in the center)
      const gridSize = 8;
      const cellSize = 200 / gridSize; // Inner circle diameter is 400, so grid is 200x200
      hexagramGrid.forEach((hex, i) => {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const x = 200 + col * cellSize + cellSize / 2; // Offset to center the grid
        const y = 200 + row * cellSize + cellSize / 2;

        svg.append('text')
          .attr('x', x)
          .attr('y', y)
          .attr('font-size', 12)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .text(hex.hexagram);
      });

      // Circular Hexagram Ring Inside the Zodiac Ring
      const hexagramRadius = 180; // Radius for hexagram symbols
      const symbolRadius = 165; // Radius for Chinese symbols (closer to the center to avoid overlap)
      const hexagramCount = 64;
      const angleStep = 360 / hexagramCount; // Angle between each hexagram (5.625 degrees)
      const startOffset = angleStep / 2; // Offset by half the angle step (2.8125 degrees)

      hexagramGrid.forEach((hex, i) => {
        const angle = startOffset + i * angleStep; // Start just after 0 degrees and go clockwise
        const angleRad = (angle - 90) * (Math.PI / 180); // Adjust for SVG coordinate system

        // Hexagram symbol position
        const hexX = 300 + hexagramRadius * Math.cos(angleRad);
        const hexY = 300 + hexagramRadius * Math.sin(angleRad);

        // Chinese symbol position (at a smaller radius, closer to the center)
        const symbolX = 300 + symbolRadius * Math.cos(angleRad);
        const symbolY = 300 + symbolRadius * Math.sin(angleRad);

        // Hexagram symbol
        svg.append('text')
          .attr('x', hexX)
          .attr('y', hexY)
          .attr('font-size', 12)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('transform', `rotate(${angle}, ${hexX}, ${hexY})`)
          .text(hex.hexagram);

        // Chinese text (symbol) at a smaller radius
        svg.append('text')
          .attr('x', symbolX)
          .attr('y', symbolY)
          .attr('font-size', 10)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('transform', `rotate(${angle}, ${symbolX}, ${symbolY})`)
          .text(hex.symbol);
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