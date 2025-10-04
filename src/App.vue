

<template>
    <Analytics />
  <div id="app">
    <!-- Apple-style Navigation -->
    <nav class="apple-nav">
      <div class="apple-nav-container">
        <div class="apple-nav-brand">
          <router-link to="/" class="apple-logo">I Ching Engine</router-link>
        </div>
        
        <button
          class="apple-nav-toggle"
          type="button"
          @click="toggleMobileMenu"
          :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
          aria-label="Toggle navigation"
        >
          <i class="bi bi-list"></i>
        </button>
        
        <div class="apple-nav-menu" :class="{ 'is-open': isMobileMenuOpen }">
          <ul class="apple-nav-list">
            <li class="apple-nav-item">
              <router-link to="/" class="apple-nav-link" @click="closeMobileMenu">Home</router-link>
            </li>
            <li class="apple-nav-item">
              <router-link to="/consult" class="apple-nav-link" @click="closeMobileMenu">Consult</router-link>
            </li>
            <li class="apple-nav-item dropdown" @mouseover="showDropdown = true" @mouseleave="showDropdown = false">
              <span class="apple-nav-link dropdown-toggle">
                Study
                <i class="bi bi-chevron-down"></i>
              </span>
              <ul class="apple-dropdown" :class="{ 'show': showDropdown }">
                <li><router-link to="/hexagrams" class="apple-dropdown-link" @click="closeMobileMenu">Hexagrams</router-link></li>
                <li><router-link to="/trigrams" class="apple-dropdown-link" @click="closeMobileMenu">Trigrams</router-link></li>
                <li><router-link to="/hexagram_sequence" class="apple-dropdown-link" @click="closeMobileMenu">Sequence</router-link></li>
              </ul>
            </li>
            <li class="apple-nav-item dropdown" @mouseover="showAstrologyDropdown = true" @mouseleave="showAstrologyDropdown = false">
              <span class="apple-nav-link dropdown-toggle">
                Astrology
                <i class="bi bi-chevron-down"></i>
              </span>
              <ul class="apple-dropdown" :class="{ 'show': showAstrologyDropdown }">
                <li><router-link to="/astrology" class="apple-dropdown-link" @click="closeMobileMenu">I Ching Astrology</router-link></li>
                <li><router-link to="/western_astrology" class="apple-dropdown-link" @click="closeMobileMenu">Western Astrology</router-link></li>
                <li><router-link to="/relationship" class="apple-dropdown-link" @click="closeMobileMenu">Relationships</router-link></li>
              </ul>
            </li>
            <li class="apple-nav-item">
              <router-link to="/about" class="apple-nav-link" @click="closeMobileMenu">About</router-link>
            </li>
            <li class="apple-nav-item theme-item">
              <button class="apple-theme-toggle" @click="toggleDarkMode" type="button" title="Toggle theme">
                <i :class="isDarkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>




    <!-- Apple-style Main Content -->
    <main class="apple-main">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="text-center py-3 mt-auto">
      <div class="container">
        <p>© 2025 iChing Engine. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useHead } from '@vueuse/head';
import { Analytics } from '@vercel/analytics/vue';

export default {
  name: 'App',
  components: {
    Analytics, // Register the Analytics component
  },
  setup() {
    const isMobileMenuOpen = ref(false);
    const showDropdown = ref(false);
    const showAstrologyDropdown = ref(false);
    const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

    // Add SEO meta tags
    useHead({
      title: 'I Ching Engine - Ancient Wisdom for Modern Life',
      meta: [
        {
          name: 'description',
          content: 'Discover the wisdom of the I Ching with our modern platform. Receive personalized consultations, explore hexagrams and trigrams, and gain insights from ancient Chinese divination.',
        },
        {
          name: 'keywords',
          content: 'I Ching, divination, oracle, hexagram, trigram, consultation, wisdom, guidance, ancient Chinese philosophy',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
      ],
    });

    // Mobile menu functions
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false;
    };

    // Dark mode functionality
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      const theme = isDarkMode.value ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    };

    // Apply theme on mount
    onMounted(() => {
      const theme = isDarkMode.value ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    });


    return {
      isMobileMenuOpen,
      showDropdown,
      showAstrologyDropdown,
      isDarkMode,
      toggleMobileMenu,
      closeMobileMenu,
      toggleDarkMode,
    };
  },
};
</script>

<style scoped>
/* Apple-style App Layout */
#app {
  min-height: 100vh;
  background: var(--apple-bg-primary);
}

/* Footer */
footer {
  background: var(--apple-bg-secondary);
  color: var(--apple-text-secondary);
  border-top: 1px solid var(--apple-separator);
  margin-top: auto;
}
</style>