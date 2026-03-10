<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h1>
          <i class="bi bi-people me-2"></i>Browse Profiles
        </h1>
        <p class="text-muted">
          Discover potential matches based on I-Ching astrological compatibility
        </p>
      </div>
    </div>

    <!-- Alert if no user profile -->
    <div v-if="!hasUserProfile" class="row mb-4">
      <div class="col-12">
        <div class="alert alert-warning d-flex align-items-center">
          <i class="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
          <div>
            <strong>Profile Required</strong>
            <p class="mb-0">
              Create your profile first to see compatibility scores with other profiles.
              <router-link to="/my-profile" class="alert-link">Create Profile</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Controls -->
    <div class="row mb-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="row g-3">
              <!-- Search -->
              <div class="col-md-4">
                <label class="form-label small">Search</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-search"></i>
                  </span>
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Search profiles..."
                    v-model="searchQuery"
                  >
                </div>
              </div>

              <!-- Element Filter -->
              <div class="col-md-3">
                <label class="form-label small">Element</label>
                <select class="form-select" v-model="filterElement">
                  <option value="">All Elements</option>
                  <option value="Wood">🌳 Wood</option>
                  <option value="Fire">🔥 Fire</option>
                  <option value="Earth">🌍 Earth</option>
                  <option value="Metal">⚙️ Metal</option>
                  <option value="Water">💧 Water</option>
                </select>
              </div>

              <!-- Zodiac Filter -->
              <div class="col-md-3">
                <label class="form-label small">Zodiac</label>
                <select class="form-select" v-model="filterZodiac">
                  <option value="">All Animals</option>
                  <option value="Rat">🐀 Rat</option>
                  <option value="Ox">🐂 Ox</option>
                  <option value="Tiger">🐅 Tiger</option>
                  <option value="Rabbit">🐇 Rabbit</option>
                  <option value="Dragon">🐉 Dragon</option>
                  <option value="Snake">🐍 Snake</option>
                  <option value="Horse">🐎 Horse</option>
                  <option value="Goat">🐐 Goat</option>
                  <option value="Monkey">🐒 Monkey</option>
                  <option value="Rooster">🐓 Rooster</option>
                  <option value="Dog">🐕 Dog</option>
                  <option value="Pig">🐖 Pig</option>
                </select>
              </div>

              <!-- Min Compatibility -->
              <div class="col-md-2">
                <label class="form-label small">Min Score</label>
                <select class="form-select" v-model.number="minCompatibility">
                  <option :value="0">Any</option>
                  <option :value="40">40%+</option>
                  <option :value="60">60%+</option>
                  <option :value="80">80%+</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted">Showing</span>
              <strong class="ms-1">{{ filteredProfiles.length }}</strong>
              <span class="text-muted">of {{ totalProfiles }} profiles</span>
            </div>
            
            <div class="btn-group">
              <button 
                class="btn btn-outline-secondary" 
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                <i class="bi bi-grid-3x3-gap"></i>
              </button>
              <button 
                class="btn btn-outline-secondary"
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                <i class="bi bi-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sort Options -->
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <div class="btn-group btn-group-sm">
          <button 
            class="btn btn-outline-primary"
            :class="{ active: sortBy === 'compatibility' }"
            @click="sortBy = 'compatibility'"
          >
            <i class="bi bi-heart me-1"></i>Compatibility
          </button>
          <button 
            class="btn btn-outline-primary"
            :class="{ active: sortBy === 'name' }"
            @click="sortBy = 'name'"
          >
            <i class="bi bi-sort-alpha-down me-1"></i>Name
          </button>
          <button 
            class="btn btn-outline-primary"
            :class="{ active: sortBy === 'age' }"
            @click="sortBy = 'age'"
          >
            <i class="bi bi-sort-numeric-down me-1"></i>Age
          </button>
        </div>

        <button 
          v-if="!hasSampleProfiles"
          class="btn btn-sm btn-success"
          @click="loadSamples"
        >
          <i class="bi bi-download me-1"></i>Load Sample Profiles
        </button>
      </div>
    </div>

    <!-- No Profiles Message -->
    <div v-if="filteredProfiles.length === 0" class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <i class="bi bi-inbox display-1 text-muted mb-4"></i>
            <h3>No Profiles Found</h3>
            <p class="text-muted mb-4">
              <span v-if="totalProfiles === 0">
                There are no profiles to browse yet. Load sample profiles to get started.
              </span>
              <span v-else>
                No profiles match your current filters. Try adjusting your search criteria.
              </span>
            </p>
            <button 
              v-if="totalProfiles === 0"
              class="btn btn-primary"
              @click="loadSamples"
            >
              <i class="bi bi-download me-2"></i>Load Sample Profiles
            </button>
            <button 
              v-else
              class="btn btn-outline-primary"
              @click="clearFilters"
            >
              <i class="bi bi-x-circle me-2"></i>Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="row g-4">
      <div 
        v-for="profile in filteredProfiles" 
        :key="profile.id"
        class="col-lg-4 col-md-6"
      >
        <ProfileCard 
          :profile="profile"
          :show-compatibility="hasUserProfile"
          :compatibility-score="getCompatibilityScore(profile)"
          @view="viewProfile"
          @favorite="toggleFavorite"
        />
      </div>
    </div>

    <!-- List View -->
    <div v-else class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Profile</th>
                  <th>Age</th>
                  <th>Element</th>
                  <th>Zodiac</th>
                  <th v-if="hasUserProfile">Compatibility</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="profile in filteredProfiles" :key="profile.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img 
                        :src="getProfilePhoto(profile)" 
                        :alt="profile.displayName"
                        class="rounded-circle me-3"
                        style="width: 48px; height: 48px; object-fit: cover;"
                      >
                      <div>
                        <strong>{{ profile.displayName }}</strong>
                        <div class="small text-muted">{{ truncateBio(profile.bio) }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ calculateAge(profile.birthDate) }}</td>
                  <td>
                    <span class="badge" :class="getElementClass(profile.element)">
                      {{ profile.element }}
                    </span>
                  </td>
                  <td>{{ profile.zodiacAnimal }}</td>
                  <td v-if="hasUserProfile">
                    <CompatibilityScore 
                      :score="getCompatibilityScore(profile)"
                      size="small"
                      :show-circle="false"
                    />
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button 
                        class="btn btn-outline-primary"
                        @click="viewProfile(profile)"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <button 
                        class="btn btn-outline-danger"
                        @click="toggleFavorite(profile)"
                      >
                        <i :class="profile.isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
import { useCompatibility } from '@/composables/useCompatibility';
import ProfileCard from '@/components/ProfileCard.vue';
import CompatibilityScore from '@/components/CompatibilityScore.vue';

export default {
  name: 'DatingProfilesView',
  components: {
    ProfileCard,
    CompatibilityScore
  },
  setup() {
    const router = useRouter();
    const datingStore = useDatingStore();
    const { calculateCompatibility } = useCompatibility();

    // View state
    const viewMode = ref('grid');
    const sortBy = ref('compatibility');
    const searchQuery = ref('');
    const filterElement = ref('');
    const filterZodiac = ref('');
    const minCompatibility = ref(0);

    // Computed
    const hasUserProfile = computed(() => datingStore.hasUserProfile);
    const userProfile = computed(() => datingStore.userProfile);

    const hasSampleProfiles = computed(() => 
      datingStore.profiles.some(p => p.isSample)
    );

    const totalProfiles = computed(() => datingStore.otherProfiles.length);

    const filteredProfiles = computed(() => {
      let profiles = datingStore.otherProfiles;

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        profiles = profiles.filter(p => 
          p.displayName.toLowerCase().includes(query) ||
          (p.bio && p.bio.toLowerCase().includes(query)) ||
          (p.interests && p.interests.some(i => i.toLowerCase().includes(query)))
        );
      }

      // Apply element filter
      if (filterElement.value) {
        profiles = profiles.filter(p => p.element === filterElement.value);
      }

      // Apply zodiac filter
      if (filterZodiac.value) {
        profiles = profiles.filter(p => p.zodiacAnimal === filterZodiac.value);
      }

      // Apply compatibility filter (only if user has profile)
      if (hasUserProfile.value && minCompatibility.value > 0) {
        profiles = profiles.filter(p => {
          const score = getCompatibilityScore(p);
          return score >= minCompatibility.value;
        });
      }

      // Apply sorting
      profiles = [...profiles].sort((a, b) => {
        switch (sortBy.value) {
          case 'compatibility':
            if (!hasUserProfile.value) return 0;
            return getCompatibilityScore(b) - getCompatibilityScore(a);
          case 'name':
            return a.displayName.localeCompare(b.displayName);
          case 'age':
            return calculateAge(a.birthDate) - calculateAge(b.birthDate);
          default:
            return 0;
        }
      });

      return profiles;
    });

    // Methods
    const getCompatibilityScore = (profile) => {
      if (!hasUserProfile.value) return 0;
      const result = calculateCompatibility(userProfile.value, profile);
      return result?.overallScore || 0;
    };

    const getProfilePhoto = (profile) => {
      if (profile.photos && profile.photos.length > 0) {
        return profile.photos[0];
      }
      return `/images/${profile.zodiacAnimal?.toLowerCase() || 'dragon'}.jpg`;
    };

    const getElementClass = (element) => {
      const classes = {
        Wood: 'bg-success',
        Fire: 'bg-danger',
        Earth: 'bg-warning text-dark',
        Metal: 'bg-secondary',
        Water: 'bg-info'
      };
      return classes[element] || 'bg-secondary';
    };

    const calculateAge = (birthDate) => {
      if (!birthDate) return 'N/A';
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };

    const truncateBio = (bio, maxLength = 50) => {
      if (!bio) return '';
      return bio.length > maxLength ? bio.substring(0, maxLength) + '...' : bio;
    };

    const viewProfile = (profile) => {
      router.push(`/profile/${profile.id}`);
    };

    const toggleFavorite = (profile) => {
      datingStore.toggleFavorite(profile.id);
    };

    const loadSamples = () => {
      datingStore.loadSampleProfiles();
    };

    const clearFilters = () => {
      searchQuery.value = '';
      filterElement.value = '';
      filterZodiac.value = '';
      minCompatibility.value = 0;
    };

    return {
      viewMode,
      sortBy,
      searchQuery,
      filterElement,
      filterZodiac,
      minCompatibility,
      hasUserProfile,
      hasSampleProfiles,
      totalProfiles,
      filteredProfiles,
      getCompatibilityScore,
      getProfilePhoto,
      getElementClass,
      calculateAge,
      truncateBio,
      viewProfile,
      toggleFavorite,
      loadSamples,
      clearFilters
    };
  }
};
</script>

<style scoped>
.table td {
  vertical-align: middle;
}
</style>
