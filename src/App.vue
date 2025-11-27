

<template>
    <Analytics />
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">iChing Engine</a>
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

    <!-- Sidebar and Main Content -->
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <!-- Sidebar -->
        <nav
  id="sidebarCollapse"
  class="col-3 col-md-2 bg-light sidebar"
  :class="{ 'show': isSidebarOpen }"
>
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
        <router-link class="nav-link" to="/solfeggio" exact-active-class="active">
          <span class="align-middle">Solfeggio Player</span>
        </router-link>
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
            <router-link class="nav-link" to="/western_astrology" exact-active-class="active">
              <span class="align-middle">Western Astrology</span>
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
          class="col-12 col-md-10 col-lg-10 px-md-4 mt-5"
          :class="{ 'col-md-12 col-lg-12': !isSidebarOpen }"
        >
          <router-view></router-view>
        </main>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-light text-center py-3 mt-auto">
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
    const isSidebarOpen = ref(true); // Default to open for initial visibility
    const isBootstrapLoaded = ref(false);
    const backgroundColor = ref('#3f41c2');
    const chartsMenuOpen = ref(false); // Tracks Charts sub-menu state
    const astrologyMenuOpen = ref(false); // Tracks Astrology sub-menu state


    // Add SEO meta tags
    useHead({
      title: 'iChing Engine - Online Divination and Astrology Tool',
      meta: [
        {
          name: 'description',
          content: 'Explore the iChing Engine for online iChing consultations, astrology insights, trigrams, hexagrams, and spiritual and relationship guidance.',
        },
        {
          name: 'keywords',
          content: 'iChing, iChing oracle, iChing consultation, astrology, trigrams, hexagrams, divination, spiritual guidance, relationship',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
      ],
    });

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
      if (window.bootstrap && window.bootstrap.Collapse) {
        const sidebar = document.getElementById('sidebarCollapse');
        if (sidebar) {
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(sidebar);
          isSidebarOpen.value ? bsCollapse.show() : bsCollapse.hide();
        }
      }
    };

    const toggleChartsMenu = () => {
      chartsMenuOpen.value = !chartsMenuOpen.value; // Toggles Charts sub-menu
    };

    const toggleAstrologyMenu = () => {
      astrologyMenuOpen.value = !astrologyMenuOpen.value; // Toggles Astrology sub-menu
    };


    watch(isSidebarOpen, (newValue) => {
      document.body.style.overflow = newValue ? 'hidden' : '';
    });
    
    const saveBackgroundColor = () => {
      localStorage.setItem('backgroundColor', backgroundColor.value);
      document.body.style.backgroundColor = backgroundColor.value;
    };

    onMounted(() => {
      const savedColor = localStorage.getItem('backgroundColor');
      if (savedColor) {
        backgroundColor.value = savedColor;
      } else {
        backgroundColor.value = '#3f41c2'; // Default from app.scss
      }

      if (window.bootstrap && window.bootstrap.Collapse) {
        isBootstrapLoaded.value = true;
        const sidebar = document.getElementById('sidebarCollapse');
        if (sidebar) {
          new bootstrap.Collapse(sidebar, { toggle: false });
          if (isSidebarOpen.value) sidebar.classList.add('show');
        }
      } else {
        console.warn('Bootstrap 5 is not fully loaded. Sidebar collapse may not work.');
        isSidebarOpen.value = true; // Ensure sidebar is visible as fallback
      }
    });


    return {
      isSidebarOpen,
      isBootstrapLoaded,
      toggleSidebar,
      saveBackgroundColor,
      backgroundColor,
      chartsMenuOpen,      // Return Charts sub-menu state
      toggleChartsMenu,    // Return Charts toggle function
      astrologyMenuOpen,   // Return Astrology sub-menu state
      toggleAstrologyMenu, // Return Astrology toggle function
    };
  },
};
</script>

<style scoped>
/* Sidebar styling */
.sidebar {
  position: fixed;
  top: 56px; /* Height of navbar */
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
  width: auto; /* Auto-size to fit content */
  min-width: 200px; /* Minimum width to ensure readability */
  transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
  transform: translateX(0); /* Default to visible, collapse handles hiding */
}

.sidebar:not(.show) {
  transform: translateX(-100%); /* Hide when not shown */
}

/* Ensure content fits naturally */
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

/* Main content adjustment */
main {
  min-height: calc(100vh - 112px); /* Adjust for navbar and footer */
  transition: margin-left 0.3s ease-in-out;
  margin-left: 0;
}

main.col-md-12 {
  margin-left: 0; /* Full width when sidebar is closed */
}

main.col-md-10 {
  margin-left: 200px; /* Offset for open sidebar */
}

/* Resizable sidebar (optional) */
.sidebar {
  resize: horizontal;
  overflow: auto;
}

/* Footer */
footer {
  width: 100%;
}

/* Media queries */
@media (max-width: 767.98px) {
  .sidebar {
    min-width: 180px;
  }

  main.col-md-10 {
    margin-left: 180px;
  }
}

@media (max-width: 576px) {
  .sidebar {
    min-width: 150px;
  }

  main.col-md-10 {
    margin-left: 150px;
  }
}
</style>