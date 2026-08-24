

<template>
    <Analytics />
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">iChing Engine <span class="brand-cn" lang="zh-Hant">易經引擎</span></a>
        <button
          class="navbar-toggler"
          type="button"
          @click="toggleSidebar"
          :aria-expanded="isSidebarOpen ? 'true' : 'false'"
          aria-controls="sidebarCollapse"
          aria-label="Toggle sidebar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav ms-auto mb-2 mb-md-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/consult">Consult</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div
      v-show="isMobile && isSidebarOpen"
      class="sidebar-backdrop"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar and Main Content -->
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <!-- Sidebar -->
        <nav
          id="sidebarCollapse"
          class="bg-light sidebar"
          :class="{ 'is-open': isSidebarOpen }"
          :aria-hidden="isMobile && !isSidebarOpen ? 'true' : 'false'"
          :inert="isMobile && !isSidebarOpen ? true : undefined"
        >
          <div class="sidebar-header d-flex d-md-none justify-content-between align-items-center px-3 pt-3 pb-1">
            <span class="fw-semibold">Menu</span>
            <button
              type="button"
              class="btn-close"
              aria-label="Close menu"
              @click="closeSidebar"
            ></button>
          </div>
          <div class="position-sticky pt-3">
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link class="nav-link" to="/" exact-active-class="active">
          <span class="align-middle">Home</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/consult" exact-active-class="active">
          <span class="align-middle">Consult</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/birthdays" exact-active-class="active">
          <span class="align-middle">Birthdays</span>
        </router-link>
      </li>
      <!-- Music Sub-Menu -->
      <li class="nav-item">
        <span
          class="nav-link"
          @click="toggleMusicMenu"
          role="button"
          tabindex="0"
          :aria-expanded="musicMenuOpen"
        >
          <span class="align-middle">Music</span>
          <i :class="musicMenuOpen ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"></i>
        </span>
        <ul v-show="musicMenuOpen" class="nav flex-column ms-3">
          <li class="nav-item">
            <router-link class="nav-link" to="/solfeggio" exact-active-class="active">
              <span class="align-middle">Solfeggio Player</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/life_symphony" exact-active-class="active">
              <span class="align-middle">Life Symphony</span>
            </router-link>
          </li>
        </ul>
      </li>
      <!-- Astrology Sub-Menu -->
      <li class="nav-item">
        <span
          class="nav-link"
          @click="toggleAstrologyMenu"
          role="button"
          tabindex="0"
          :aria-expanded="astrologyMenuOpen"
        >
          <span class="align-middle">Astrology</span>
          <i :class="astrologyMenuOpen ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"></i>
        </span>
        <ul v-show="astrologyMenuOpen" class="nav flex-column ms-3">
          <li class="nav-item">
            <router-link class="nav-link" to="/astrology" exact-active-class="active">
              <span class="align-middle">I-Ching Astrology</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/daily_reading" exact-active-class="active">
              <span class="align-middle">Daily Reading</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/western_astrology" exact-active-class="active">
              <span class="align-middle">Western Astrology</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/vedic_astrology" exact-active-class="active">
              <span class="align-middle">Vedic Astrology</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/vedic_help" exact-active-class="active">
              <span class="align-middle">Vedic Help</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/compare" exact-active-class="active">
              <span class="align-middle">Compare readings</span>
            </router-link>
          </li>
        </ul>
      </li>
      <!-- Charts Sub-Menu -->
      <li class="nav-item">
        <span
          class="nav-link"
          @click="toggleChartsMenu"
          role="button"
          tabindex="0"
          :aria-expanded="chartsMenuOpen"
        >
          <span class="align-middle">Charts</span>
          <i :class="chartsMenuOpen ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"></i>
        </span>
        <ul v-show="chartsMenuOpen" class="nav flex-column ms-3">
          <li class="nav-item">
            <router-link class="nav-link" to="/astrology_chart" exact-active-class="active">
              <span class="align-middle">Chinese Zodiac Chart</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/iching_zodiac_chart" exact-active-class="active">
              <span class="align-middle">Western Zodiac Chart</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/tibetan_mantra_chart" exact-active-class="active">
              <span class="align-middle">Tibetan Mantra Chart</span>
            </router-link>
          </li>
        </ul>
</li>
      <li class="nav-item">
        <router-link class="nav-link" to="/relationship" exact-active-class="active">
          <span class="align-middle">Relationships</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/trigrams" exact-active-class="active">
          <span class="align-middle">Trigrams</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/hexagrams" exact-active-class="active">
          <span class="align-middle">Hexagrams</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/hexagram_sequence" exact-active-class="active">
          <span class="align-middle">Hexagram Sequence</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/about" exact-active-class="active">
          <span class="align-middle">About</span>
        </router-link>
      </li>
      <li class="nav-item">
        <div class="nav-link">
          <label for="bg-color-picker" class="form-label">Background Color</label>
          <input
            type="color"
            id="bg-color-picker"
            v-model="backgroundColor"
            @change="saveBackgroundColor"
            class="form-control form-control-color"
          />
        </div>
      </li>
    </ul>
  </div>
</nav>

        <!-- Main Content -->
        <main
          class="col-12 main-content px-md-4"
          :class="{ 'sidebar-shifted': isSidebarOpen && !isMobile }"
        >
          <router-view></router-view>
        </main>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-light text-center py-3 mt-auto">
      <div class="container">
        <p>© 2026 iChing Engine. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';
import { Analytics } from '@vercel/analytics/vue';

const MOBILE_BREAKPOINT = 768;

function getIsMobile() {
  return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT;
}

export default {
  name: 'App',
  components: {
    Analytics, // Register the Analytics component
  },
  setup() {
    const router = useRouter();
    const isMobile = ref(getIsMobile());
    const isSidebarOpen = ref(!getIsMobile());
    const backgroundColor = ref('#3f41c2');
    const chartsMenuOpen = ref(false); // Tracks Charts sub-menu state
    const astrologyMenuOpen = ref(false); // Tracks Astrology sub-menu state
    const musicMenuOpen = ref(false); // Tracks Music sub-menu state


    // Add SEO meta tags
    useHead({
      title: 'iChing Engine — I Ching Oracle, Vedic Jyotish & Western Astrology',
      meta: [
        {
          name: 'description',
          content: 'Free online I Ching (Yijing) oracle with hexagrams and trigrams, plus Vedic astrology (Jyotish kundli, Lahiri, nakshatra, dasha) and Western natal charts (Sun, Moon, Rising, Placidus). Birth-chart readings, Chinese sexagenary astrology, and relationship compatibility.',
        },
        {
          name: 'keywords',
          content: 'I Ching, iChing, Yijing, Book of Changes, I Ching oracle, I Ching consultation, hexagram, trigram, bagua, divination, Vedic astrology, Jyotish, kundli, janma kundali, Lahiri ayanamsa, nakshatra, Vimshottari dasha, Lagna, rashi, Western astrology, natal chart, birth chart, rising sign, ascendant, Placidus, tropical zodiac, sidereal zodiac, Chinese astrology, sexagenary cycle, heavenly stems, earthly branches, zodiac, relationship compatibility, I Ching astrology, spiritual guidance, online horoscope, natal chart calculator',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
        {
          name: 'googlebot',
          content: 'index, follow',
        },
        {
          property: 'og:title',
          content: 'iChing Engine — I Ching Oracle, Vedic Jyotish & Western Astrology',
        },
        {
          property: 'og:description',
          content: 'Consult the I Ching, cast a Vedic kundli, or read a Western natal chart. Hexagrams, trigrams, Jyotish, and tropical astrology in one place.',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:url',
          content: 'https://iching-engine.vercel.app/',
        },
      ],
    });

    const closeSidebar = () => {
      isSidebarOpen.value = false;
    };

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const syncViewport = () => {
      const mobile = getIsMobile();
      if (mobile === isMobile.value) return;
      isMobile.value = mobile;
      isSidebarOpen.value = !mobile;
    };

    const onKeydown = (event) => {
      if (event.key === 'Escape' && isMobile.value && isSidebarOpen.value) {
        closeSidebar();
      }
    };

    const toggleChartsMenu = () => {
      chartsMenuOpen.value = !chartsMenuOpen.value; // Toggles Charts sub-menu
    };

    const toggleAstrologyMenu = () => {
      astrologyMenuOpen.value = !astrologyMenuOpen.value; // Toggles Astrology sub-menu
    };

    const toggleMusicMenu = () => {
      musicMenuOpen.value = !musicMenuOpen.value; // Toggles Music sub-menu
    };


    watch([isSidebarOpen, isMobile], ([open, mobile]) => {
      document.body.style.overflow = open && mobile ? 'hidden' : '';
    });
    
    const saveBackgroundColor = () => {
      localStorage.setItem('backgroundColor', backgroundColor.value);
      document.body.style.backgroundColor = backgroundColor.value;
    };

    let removeAfterEach;

    onMounted(() => {
      const savedColor = localStorage.getItem('backgroundColor');
      if (savedColor) {
        backgroundColor.value = savedColor;
      } else {
        backgroundColor.value = '#3f41c2'; // Default from app.scss
      }

      syncViewport();
      window.addEventListener('resize', syncViewport);
      window.addEventListener('keydown', onKeydown);
      removeAfterEach = router.afterEach(() => {
        if (isMobile.value) closeSidebar();
      });
    });

    onUnmounted(() => {
      window.removeEventListener('resize', syncViewport);
      window.removeEventListener('keydown', onKeydown);
      if (removeAfterEach) removeAfterEach();
      document.body.style.overflow = '';
    });


    return {
      isMobile,
      isSidebarOpen,
      toggleSidebar,
      closeSidebar,
      saveBackgroundColor,
      backgroundColor,
      chartsMenuOpen,      // Return Charts sub-menu state
      toggleChartsMenu,    // Return Charts toggle function
      astrologyMenuOpen,   // Return Astrology sub-menu state
      toggleAstrologyMenu, // Return Astrology toggle function
      musicMenuOpen,       // Return Music sub-menu state
      toggleMusicMenu,     // Return Music toggle function
    };
  },
};
</script>

<style>
html {
  scroll-padding-top: 4.5rem;
}
@media (max-width: 767.98px) {
  select.form-select {
    appearance: auto;
    -webkit-appearance: menulist;
    background-image: none;
    padding-right: 0.75rem;
    min-height: 44px;
  }
}
</style>
<style scoped>
.brand-cn {
  margin-left: 0.4rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  font-size: 0.95em;
  font-family: "Noto Serif CJK SC", "Noto Serif CJK TC", "Source Han Serif SC", "Songti SC", "SimSun", "PMingLiU", serif;
  opacity: 0.9;
}
.sidebar-backdrop {
  position: fixed;
  top: 56px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1010;
  background: rgba(0, 0, 0, 0.45);
}

.sidebar {
  position: fixed;
  top: 56px;
  bottom: 0;
  left: 0;
  z-index: 1020;
  width: min(280px, 85vw);
  padding: 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  overflow-y: auto;
  visibility: hidden;
  pointer-events: none;
  /* Use left, not transform — transform on a fixed layer mispositions native <select> menus. */
  margin-left: -100%;
  transition: margin-left 0.3s ease-in-out, visibility 0.3s ease-in-out;
}

.sidebar.is-open {
  margin-left: 0;
  visibility: visible;
  pointer-events: auto;
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.5rem 1rem;
}

.sidebar .nav-link.active {
  color: #007bff;
  background-color: #f8f9fa;
}

.main-content {
  min-height: calc(100vh - 112px);
  margin-left: 0;
  width: 100%;
  padding-top: 4.5rem;
  transition: margin-left 0.3s ease-in-out;
}

footer {
  width: 100%;
}

@media (min-width: 768px) {
  .sidebar {
    width: 220px;
    visibility: visible;
    pointer-events: auto;
    margin-left: 0;
  }

  .sidebar.is-open {
    margin-left: 0;
  }

  .main-content.sidebar-shifted {
    margin-left: 220px;
    width: calc(100% - 220px);
  }
}
</style>