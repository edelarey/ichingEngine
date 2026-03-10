<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h1>
          <i class="bi bi-heart-fill text-danger me-2"></i>Favorites
        </h1>
        <p class="text-muted">
          Profiles you've saved as favorites
        </p>
      </div>
    </div>

    <!-- No User Profile -->
    <div v-if="!hasUserProfile" class="row justify-content-center">
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm text-center py-5">
          <div class="card-body">
            <i class="bi bi-person-plus display-1 text-muted mb-4"></i>
            <h3>Create Your Profile First</h3>
            <p class="text-muted mb-4">
              Set up your profile to start saving favorites.
            </p>
            <router-link to="/my-profile" class="btn btn-primary btn-lg">
              <i class="bi bi-plus-circle me-2"></i>Create Profile
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Has Profile -->
    <div v-else>
      <!-- No Favorites -->
      <div v-if="favorites.length === 0" class="row justify-content-center">
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm text-center py-5">
            <div class="card-body">
              <i class="bi bi-heart display-1 text-muted mb-4"></i>
              <h3>No Favorites Yet</h3>
              <p class="text-muted mb-4">
                Browse profiles and click the heart icon to save your favorites.
              </p>
              <router-link to="/browse" class="btn btn-primary">
                <i class="bi bi-people me-2"></i>Browse Profiles
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Favorites List -->
      <div v-else>
        <!-- Summary -->
        <div class="row mb-4">
          <div class="col-md-4 mb-3">
            <div class="card border-0 shadow-sm bg-danger text-white">
              <div class="card-body text-center">
                <div class="display-5 fw-bold">{{ favorites.length }}</div>
                <div>Total Favorites</div>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card border-0 shadow-sm bg-success text-white">
              <div class="card-body text-center">
                <div class="display-5 fw-bold">{{ excellentFavorites.length }}</div>
                <div>Excellent Matches</div>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card border-0 shadow-sm bg-primary text-white">
              <div class="card-body text-center">
                <div class="display-5 fw-bold">{{ averageCompatibility }}%</div>
                <div>Avg Compatibility</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sort Options -->
        <div class="row mb-3">
          <div class="col-12">
            <div class="btn-group btn-group-sm">
              <button 
                class="btn btn-outline-primary"
                :class="{ active: sortBy === 'added' }"
                @click="sortBy = 'added'"
              >
                <i class="bi bi-clock me-1"></i>Recently Added
              </button>
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
            </div>
          </div>
        </div>

        <!-- Favorites Grid -->
        <div class="row g-4">
          <div 
            v-for="profile in sortedFavorites" 
            :key="profile.id"
            class="col-lg-4 col-md-6"
          >
            <ProfileCard 
              :profile="profile"
              :show-compatibility="true"
              :compatibility-score="getCompatibilityScore(profile)"
              @view="viewProfile"
              @favorite="removeFavorite"
            />
          </div>
        </div>

        <!-- Clear All Button -->
        <div class="row mt-5">
          <div class="col-12 text-center">
            <button 
              class="btn btn-outline-danger"
              @click="confirmClearAll"
            >
              <i class="bi bi-trash me-2"></i>Clear All Favorites
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Confirmation Modal -->
    <div 
      class="modal fade" 
      id="clearFavoritesModal" 
      tabindex="-1"
      ref="clearModalRef"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>Clear All Favorites
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to remove all {{ favorites.length }} profiles from your favorites?</p>
            <p class="text-muted small mb-0">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="clearAllFavorites">
              <i class="bi bi-trash me-2"></i>Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDatingStore } from '@/stores/dating';
import { useCompatibility } from '@/composables/useCompatibility';
import ProfileCard from '@/components/ProfileCard.vue';
import { Modal } from 'bootstrap';

export default {
  name: 'FavoritesView',
  components: {
    ProfileCard
  },
  setup() {
    const router = useRouter();
    const datingStore = useDatingStore();
    const { calculateCompatibility } = useCompatibility();

    const sortBy = ref('added');
    const clearModalRef = ref(null);
    let clearModal = null;

    const hasUserProfile = computed(() => datingStore.hasUserProfile);
    const userProfile = computed(() => datingStore.userProfile);
    const favorites = computed(() => datingStore.favoriteProfiles);

    const sortedFavorites = computed(() => {
      const profiles = [...favorites.value];
      
      switch (sortBy.value) {
        case 'compatibility':
          return profiles.sort((a, b) => 
            getCompatibilityScore(b) - getCompatibilityScore(a)
          );
        case 'name':
          return profiles.sort((a, b) => 
            a.displayName.localeCompare(b.displayName)
          );
        case 'added':
        default:
          // Assuming favorites are stored in order added
          return profiles;
      }
    });

    const excellentFavorites = computed(() => 
      favorites.value.filter(p => getCompatibilityScore(p) >= 80)
    );

    const averageCompatibility = computed(() => {
      if (favorites.value.length === 0) return 0;
      const total = favorites.value.reduce((sum, p) => sum + getCompatibilityScore(p), 0);
      return Math.round(total / favorites.value.length);
    });

    const getCompatibilityScore = (profile) => {
      if (!hasUserProfile.value) return 0;
      const result = calculateCompatibility(userProfile.value, profile);
      return result?.overallScore || 0;
    };

    const viewProfile = (profile) => {
      router.push(`/profile/${profile.id}`);
    };

    const removeFavorite = (profile) => {
      datingStore.toggleFavorite(profile.id);
    };

    const confirmClearAll = () => {
      if (clearModal) {
        clearModal.show();
      }
    };

    const clearAllFavorites = () => {
      favorites.value.forEach(p => {
        datingStore.toggleFavorite(p.id);
      });
      if (clearModal) {
        clearModal.hide();
      }
    };

    onMounted(() => {
      if (clearModalRef.value) {
        clearModal = new Modal(clearModalRef.value);
      }
    });

    return {
      sortBy,
      clearModalRef,
      hasUserProfile,
      favorites,
      sortedFavorites,
      excellentFavorites,
      averageCompatibility,
      getCompatibilityScore,
      viewProfile,
      removeFavorite,
      confirmClearAll,
      clearAllFavorites
    };
  }
};
</script>

<style scoped>
.display-5 {
  font-size: 2rem;
}
</style>
