<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h1>
          <i class="bi bi-heart-fill text-danger me-2"></i>Your Matches
        </h1>
        <p class="text-muted">
          Profiles ranked by I-Ching astrological compatibility with you
        </p>
      </div>
    </div>

    <!-- No User Profile Alert -->
    <div v-if="!hasUserProfile" class="row justify-content-center">
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm text-center py-5">
          <div class="card-body">
            <i class="bi bi-person-plus display-1 text-muted mb-4"></i>
            <h3>Create Your Profile First</h3>
            <p class="text-muted mb-4">
              You need to set up your dating profile before we can find your matches.
            </p>
            <router-link to="/my-profile" class="btn btn-primary btn-lg">
              <i class="bi bi-plus-circle me-2"></i>Create Profile
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Has Profile Content -->
    <div v-else>
      <!-- Summary Stats -->
      <div class="row mb-4">
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card border-0 shadow-sm h-100 bg-success text-white">
            <div class="card-body text-center">
              <div class="display-4 fw-bold">{{ excellentMatches.length }}</div>
              <div class="small">Excellent Matches (80%+)</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card border-0 shadow-sm h-100 bg-info text-white">
            <div class="card-body text-center">
              <div class="display-4 fw-bold">{{ goodMatches.length }}</div>
              <div class="small">Good Matches (60-79%)</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card border-0 shadow-sm h-100 bg-warning">
            <div class="card-body text-center">
              <div class="display-4 fw-bold">{{ moderateMatches.length }}</div>
              <div class="small">Moderate (40-59%)</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card border-0 shadow-sm h-100 bg-secondary text-white">
            <div class="card-body text-center">
              <div class="display-4 fw-bold">{{ allMatches.length }}</div>
              <div class="small">Total Profiles</div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Matches Message -->
      <div v-if="allMatches.length === 0" class="row justify-content-center">
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm text-center py-5">
            <div class="card-body">
              <i class="bi bi-inbox display-1 text-muted mb-4"></i>
              <h3>No Profiles Yet</h3>
              <p class="text-muted mb-4">
                Load sample profiles to see your matches.
              </p>
              <button class="btn btn-primary" @click="loadSamples">
                <i class="bi bi-download me-2"></i>Load Sample Profiles
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Match Sections -->
      <div v-else>
        <!-- Harmony Filters Panel -->
        <div class="harmony-filters mb-4">
          <h3>☯ Harmony Filters</h3>
          <div class="filter-row">
            <label>Elemental Match:</label>
            <select v-model="filterElement">
              <option value="">All Elements</option>
              <option value="Wood">🌳 Wood</option>
              <option value="Fire">🔥 Fire</option>
              <option value="Earth">🌍 Earth</option>
              <option value="Metal">⚙️ Metal</option>
              <option value="Water">💧 Water</option>
            </select>
          </div>
          <div class="filter-row">
            <label>
              <input type="checkbox" v-model="filterMusicalResonance" />
              Musical Resonance (score ≥ 60)
            </label>
          </div>
          <div class="filter-row">
            <label>
              <input type="checkbox" v-model="filterTransitCompat" />
              Current Transit Compatibility (Top 50%)
            </label>
          </div>
          <button class="clear-filters" @click="clearNewFilters">Clear Filters</button>
        </div>

        <!-- Excellent Matches -->
        <div v-if="filteredExcellentMatches.length > 0" class="mb-5">
          <h3 class="mb-3">
            <i class="bi bi-star-fill text-warning me-2"></i>
            Excellent Matches
            <span class="badge bg-success ms-2">{{ filteredExcellentMatches.length }}</span>
          </h3>
          <div class="row g-4">
            <div 
              v-for="match in filteredExcellentMatches" 
              :key="match.id"
              class="col-lg-4 col-md-6"
            >
              <ProfileCard 
                :profile="match"
                :show-compatibility="true"
                :compatibility-score="match.compatibilityScore"
                @view="viewProfile"
                @favorite="toggleFavorite"
              />
              <!-- Cosmic Harmony Type badge -->
              <div class="cosmic-badge" :style="{ borderColor: getCosmicHarmonyType(match).color }">
                <span class="cosmic-emoji">{{ getCosmicHarmonyType(match).emoji }}</span>
                <span class="cosmic-label">{{ getCosmicHarmonyType(match).label }}</span>
                <span class="cosmic-hex">{{ getCosmicHarmonyType(match).hexagram }}</span>
              </div>
              <!-- View Harmony Chamber button -->
              <button class="harmony-chamber-btn" @click="viewHarmonyChamber(match)">
                ☯ View Harmony Chamber
              </button>
            </div>
          </div>
        </div>

        <!-- Good Matches -->
        <div v-if="filteredGoodMatches.length > 0" class="mb-5">
          <h3 class="mb-3">
            <i class="bi bi-hand-thumbs-up text-info me-2"></i>
            Good Matches
            <span class="badge bg-info ms-2">{{ filteredGoodMatches.length }}</span>
          </h3>
          <div class="row g-4">
            <div 
              v-for="match in filteredGoodMatches" 
              :key="match.id"
              class="col-lg-4 col-md-6"
            >
              <ProfileCard 
                :profile="match"
                :show-compatibility="true"
                :compatibility-score="match.compatibilityScore"
                @view="viewProfile"
                @favorite="toggleFavorite"
              />
              <!-- Cosmic Harmony Type badge -->
              <div class="cosmic-badge" :style="{ borderColor: getCosmicHarmonyType(match).color }">
                <span class="cosmic-emoji">{{ getCosmicHarmonyType(match).emoji }}</span>
                <span class="cosmic-label">{{ getCosmicHarmonyType(match).label }}</span>
                <span class="cosmic-hex">{{ getCosmicHarmonyType(match).hexagram }}</span>
              </div>
              <!-- View Harmony Chamber button -->
              <button class="harmony-chamber-btn" @click="viewHarmonyChamber(match)">
                ☯ View Harmony Chamber
              </button>
            </div>
          </div>
        </div>

        <!-- Moderate Matches -->
        <div v-if="filteredModerateMatches.length > 0" class="mb-5">
          <h3 class="mb-3">
            <i class="bi bi-question-circle text-warning me-2"></i>
            Moderate Matches
            <span class="badge bg-warning text-dark ms-2">{{ filteredModerateMatches.length }}</span>
          </h3>
          <div class="row g-4">
            <div 
              v-for="match in filteredModerateMatches" 
              :key="match.id"
              class="col-lg-4 col-md-6"
            >
              <ProfileCard 
                :profile="match"
                :show-compatibility="true"
                :compatibility-score="match.compatibilityScore"
                @view="viewProfile"
                @favorite="toggleFavorite"
              />
              <!-- Cosmic Harmony Type badge -->
              <div class="cosmic-badge" :style="{ borderColor: getCosmicHarmonyType(match).color }">
                <span class="cosmic-emoji">{{ getCosmicHarmonyType(match).emoji }}</span>
                <span class="cosmic-label">{{ getCosmicHarmonyType(match).label }}</span>
                <span class="cosmic-hex">{{ getCosmicHarmonyType(match).hexagram }}</span>
              </div>
              <!-- View Harmony Chamber button -->
              <button class="harmony-chamber-btn" @click="viewHarmonyChamber(match)">
                ☯ View Harmony Chamber
              </button>
            </div>
          </div>
        </div>

        <!-- Show More Section for Low Matches -->
        <div v-if="filteredLowMatches.length > 0" class="mb-4">
          <div class="card border-0 bg-light">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="mb-1">
                    <i class="bi bi-three-dots me-2"></i>
                    {{ filteredLowMatches.length }} Other Profiles
                  </h5>
                  <small class="text-muted">Profiles with less than 40% compatibility</small>
                </div>
                <button 
                  class="btn btn-outline-secondary"
                  @click="showLowMatches = !showLowMatches"
                >
                  {{ showLowMatches ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="showLowMatches" class="row g-4 mt-3">
            <div 
              v-for="match in filteredLowMatches" 
              :key="match.id"
              class="col-lg-4 col-md-6"
            >
              <ProfileCard 
                :profile="match"
                :show-compatibility="true"
                :compatibility-score="match.compatibilityScore"
                @view="viewProfile"
                @favorite="toggleFavorite"
              />
              <!-- Cosmic Harmony Type badge -->
              <div class="cosmic-badge" :style="{ borderColor: getCosmicHarmonyType(match).color }">
                <span class="cosmic-emoji">{{ getCosmicHarmonyType(match).emoji }}</span>
                <span class="cosmic-label">{{ getCosmicHarmonyType(match).label }}</span>
                <span class="cosmic-hex">{{ getCosmicHarmonyType(match).hexagram }}</span>
              </div>
              <!-- View Harmony Chamber button -->
              <button class="harmony-chamber-btn" @click="viewHarmonyChamber(match)">
                ☯ View Harmony Chamber
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDatingStore } from '@/stores/dating';
import ProfileCard from '@/components/ProfileCard.vue';

export default {
  name: 'MatchesView',
  components: {
    ProfileCard
  },
  setup() {
    const router = useRouter();
    const datingStore = useDatingStore();

    const showLowMatches = ref(false);

    // New filter refs
    const filterElement = ref('');
    const filterMusicalResonance = ref(false);
    const filterTransitCompat = ref(false);

    const hasUserProfile = computed(() => datingStore.hasUserProfile);
    
    const allMatches = computed(() => {
      return datingStore.matchesWithScores.sort((a, b) => 
        b.compatibilityScore - a.compatibilityScore
      );
    });

    const excellentMatches = computed(() => 
      allMatches.value.filter(m => m.compatibilityScore >= 80)
    );

    const goodMatches = computed(() => 
      allMatches.value.filter(m => m.compatibilityScore >= 60 && m.compatibilityScore < 80)
    );

    const moderateMatches = computed(() => 
      allMatches.value.filter(m => m.compatibilityScore >= 40 && m.compatibilityScore < 60)
    );

    const lowMatches = computed(() => 
      allMatches.value.filter(m => m.compatibilityScore < 40)
    );

    // Filtered computed that applies new filters on top of allMatches
    const filteredAndSortedMatches = computed(() => {
      let matches = allMatches.value.slice();

      if (filterElement.value) {
        matches = matches.filter(m =>
          m.astrologyProfile?.element === filterElement.value ||
          m.astrologyData?.element === filterElement.value ||
          m.element === filterElement.value
        );
      }

      if (filterMusicalResonance.value) {
        matches = matches.filter(m => m.compatibilityScore >= 60);
      }

      if (filterTransitCompat.value) {
        const half = Math.ceil(matches.length / 2);
        matches = matches.slice(0, half);
      }

      return matches;
    });

    const filteredExcellentMatches = computed(() =>
      filteredAndSortedMatches.value.filter(m => m.compatibilityScore >= 80)
    );

    const filteredGoodMatches = computed(() =>
      filteredAndSortedMatches.value.filter(m => m.compatibilityScore >= 60 && m.compatibilityScore < 80)
    );

    const filteredModerateMatches = computed(() =>
      filteredAndSortedMatches.value.filter(m => m.compatibilityScore >= 40 && m.compatibilityScore < 60)
    );

    const filteredLowMatches = computed(() =>
      filteredAndSortedMatches.value.filter(m => m.compatibilityScore < 40)
    );

    function getCosmicHarmonyType(match) {
      const score = match.compatibilityScore ?? 0;
      const hex = match.astrologyData?.natalHexagram || match.astrologyProfile?.natalHexagram;
      const hexNum = hex?.kingwen || Math.floor((score / 100) * 63) + 1;

      if (score >= 85) return { label: 'Sacred Union', hexagram: `Hex ${hexNum}`, emoji: '☯', color: '#ffd700' };
      if (score >= 70) return { label: 'Harmonious Bond', hexagram: `Hex ${hexNum}`, emoji: '🌕', color: '#4caf50' };
      if (score >= 55) return { label: 'Creative Tension', hexagram: `Hex ${hexNum}`, emoji: '⚡', color: '#ff9800' };
      if (score >= 40) return { label: 'Peaceful Union', hexagram: `Hex ${hexNum}`, emoji: '☮', color: '#009688' };
      if (score >= 25) return { label: 'Growth Catalyst', hexagram: `Hex ${hexNum}`, emoji: '🌱', color: '#8bc34a' };
      return { label: 'Karmic Lesson', hexagram: `Hex ${hexNum}`, emoji: '🔮', color: '#9c27b0' };
    }

    function viewHarmonyChamber(match) {
      router.push({
        path: '/relationship',
        query: {
          profileBId: match.id,
        }
      });
    }

    function clearNewFilters() {
      filterElement.value = '';
      filterMusicalResonance.value = false;
      filterTransitCompat.value = false;
    }

    const viewProfile = (profile) => {
      router.push(`/profile/${profile.id}`);
    };

    const toggleFavorite = (profile) => {
      datingStore.toggleFavorite(profile.id);
    };

    const loadSamples = () => {
      datingStore.loadSampleProfiles();
    };

    return {
      showLowMatches,
      filterElement,
      filterMusicalResonance,
      filterTransitCompat,
      hasUserProfile,
      allMatches,
      excellentMatches,
      goodMatches,
      moderateMatches,
      lowMatches,
      filteredAndSortedMatches,
      filteredExcellentMatches,
      filteredGoodMatches,
      filteredModerateMatches,
      filteredLowMatches,
      getCosmicHarmonyType,
      viewHarmonyChamber,
      clearNewFilters,
      viewProfile,
      toggleFavorite,
      loadSamples
    };
  }
};
</script>

<style scoped>
.display-4 {
  font-size: 2.5rem;
}

.harmony-filters {
  background: #1a1a2e;
  border: 1px solid #ffd700;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: #e0e0e0;
}
.harmony-filters h3 { color: #ffd700; margin-bottom: 1rem; }
.filter-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
.filter-row label { color: #c8a951; }
.filter-row select {
  background: #16213e; color: #e0e0e0;
  border: 1px solid #ffd700; border-radius: 6px; padding: 0.4rem 0.8rem;
}
.clear-filters {
  background: transparent; border: 1px solid #ff9800; color: #ff9800;
  border-radius: 6px; padding: 0.4rem 1rem; cursor: pointer; margin-top: 0.5rem;
}
.clear-filters:hover { background: #ff9800; color: #000; }

.cosmic-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  border: 1px solid; border-radius: 20px; padding: 0.3rem 0.8rem;
  background: rgba(0,0,0,0.4); margin-top: 0.5rem; font-size: 0.85rem;
}
.cosmic-emoji { font-size: 1rem; }
.cosmic-label { color: #e0e0e0; font-weight: 500; }
.cosmic-hex { color: #888; font-size: 0.75rem; }

.harmony-chamber-btn {
  display: block; width: 100%; margin-top: 0.75rem;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid #ffd700; color: #ffd700;
  border-radius: 8px; padding: 0.6rem 1rem; cursor: pointer;
  font-size: 0.9rem; letter-spacing: 0.05em; transition: all 0.2s;
}
.harmony-chamber-btn:hover {
  background: #ffd700; color: #0a0a1a; box-shadow: 0 0 12px rgba(255,215,0,0.4);
}
</style>
