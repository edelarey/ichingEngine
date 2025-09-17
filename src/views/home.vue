<template>
  <div class="apple-home">
    <!-- Apple-style Hero Section -->
    <section class="apple-hero">
      <div class="apple-hero-content">
        <h1 class="apple-hero-title">
          The wisdom you seek.<br>
          <span class="apple-hero-subtitle">From a source you can trust.</span>
        </h1>
        <p class="apple-hero-description">
          For thousands of years, the I Ching has provided guidance and insight. Our modern platform brings this ancient wisdom to your fingertips with precision, care, and authentic interpretations.
        </p>
        <div class="apple-hero-cta">
          <router-link to="/consult" class="apple-btn-primary">
            Begin Your Consultation
          </router-link>
          <router-link to="/about" class="apple-btn-secondary">
            Learn About I Ching
          </router-link>
        </div>
        
        <!-- I Ching Animation -->
        <div class="apple-hero-animation">
          <img class="img-fluid gif-image" alt="I-Ching Animation" :src="gifUrl" />
        </div>
      </div>
    </section>

    <!-- Features Overview -->
    <section class="apple-features">
      <div class="apple-container">
        <div class="apple-section-header">
          <h2 class="apple-section-title">Designed for insight.</h2>
        </div>
        
        <div class="apple-feature-grid">
          <!-- Consultation Feature -->
          <div class="apple-feature-card">
            <div class="apple-feature-icon">
              <i class="bi bi-yin-yang"></i>
            </div>
            <h3 class="apple-feature-title">Personal Consultation</h3>
            <p class="apple-feature-description">
              Cast your hexagram and receive detailed interpretations drawn from classical texts and modern insights.
            </p>
          </div>

          <!-- Astrology Feature -->
          <div class="apple-feature-card">
            <div class="apple-feature-icon">
              <i class="bi bi-stars"></i>
            </div>
            <h3 class="apple-feature-title">Astrological Reading</h3>
            <p class="apple-feature-description">
              Combine ancient I Ching wisdom with astrological insights for deeper personal understanding.
            </p>
          </div>

          <!-- Hexagram Study -->
          <div class="apple-feature-card">
            <div class="apple-feature-icon">
              <i class="bi bi-book"></i>
            </div>
            <h3 class="apple-feature-title">Study & Learn</h3>
            <p class="apple-feature-description">
              Explore all 64 hexagrams and 8 trigrams with comprehensive explanations and historical context.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="apple-stats">
      <div class="apple-container">
        <div class="apple-stats-grid">
          <div class="apple-stat">
            <div class="apple-stat-number">3,000+</div>
            <div class="apple-stat-label">Years of wisdom</div>
          </div>
          <div class="apple-stat">
            <div class="apple-stat-number">64</div>
            <div class="apple-stat-label">Hexagrams to explore</div>
          </div>
          <div class="apple-stat">
            <div class="apple-stat-number">8</div>
            <div class="apple-stat-label">Fundamental trigrams</div>
          </div>
          <div class="apple-stat">
            <div class="apple-stat-number">∞</div>
            <div class="apple-stat-label">Possibilities for insight</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Home',
  setup() {
    const gifUrl = ref(require('@/assets/iching.gif'));

    return { gifUrl };
  },
};
</script>

