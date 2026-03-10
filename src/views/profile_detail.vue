<template>
  <div class="container-fluid py-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Profile Not Found -->
    <div v-else-if="!profile" class="row justify-content-center">
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm text-center py-5">
          <div class="card-body">
            <i class="bi bi-person-x display-1 text-muted mb-4"></i>
            <h3>Profile Not Found</h3>
            <p class="text-muted mb-4">
              The profile you're looking for doesn't exist or has been removed.
            </p>
            <router-link to="/browse" class="btn btn-primary">
              <i class="bi bi-arrow-left me-2"></i>Back to Browse
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Details -->
    <div v-else>
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/browse">Browse Profiles</router-link>
              </li>
              <li class="breadcrumb-item active">{{ profile.displayName }}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row">
        <!-- Left Column - Photos & Quick Info -->
        <div class="col-lg-4 mb-4">
          <!-- Photo Gallery -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-0">
              <div class="profile-photo-main">
                <img 
                  :src="mainPhoto" 
                  :alt="profile.displayName"
                  class="img-fluid w-100"
                  style="max-height: 400px; object-fit: cover;"
                >
                <button 
                  class="btn btn-favorite"
                  @click="toggleFavorite"
                >
                  <i :class="profile.isFavorite ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'"></i>
                </button>
              </div>
              
              <div v-if="profile.photos && profile.photos.length > 1" class="p-3">
                <div class="row g-2">
                  <div 
                    v-for="(photo, index) in profile.photos.slice(0, 4)" 
                    :key="index"
                    class="col-3"
                  >
                    <img 
                      :src="photo" 
                      class="img-thumbnail thumbnail-photo"
                      :class="{ active: currentPhotoIndex === index }"
                      @click="currentPhotoIndex = index"
                      :alt="`Photo ${index + 1}`"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Info -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-info-circle me-2"></i>Quick Info
              </h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled mb-0">
                <li class="mb-2">
                  <i class="bi bi-person me-3 text-muted"></i>
                  <strong>{{ profile.displayName }}</strong>
                </li>
                <li class="mb-2">
                  <i class="bi bi-calendar me-3 text-muted"></i>
                  {{ age }} years old
                </li>
                <li class="mb-2">
                  <i class="bi bi-stars me-3 text-muted"></i>
                  <span class="badge" :class="elementBadgeClass">{{ profile.element }}</span>
                  {{ profile.zodiacAnimal }}
                </li>
                <li v-if="profile.location" class="mb-2">
                  <i class="bi bi-geo-alt me-3 text-muted"></i>
                  {{ profile.location }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Actions -->
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-grid gap-2">
                <button 
                  class="btn btn-primary btn-lg"
                  :class="{ 'btn-outline-primary': profile.isFavorite }"
                  @click="toggleFavorite"
                >
                  <i :class="profile.isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'" class="me-2"></i>
                  {{ profile.isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
                </button>
                <router-link to="/browse" class="btn btn-outline-secondary">
                  <i class="bi bi-arrow-left me-2"></i>Back to Browse
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Center Column - Details -->
        <div class="col-lg-5 mb-4">
          <!-- Name & Bio -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
              <h2 class="card-title mb-3">{{ profile.displayName }}</h2>
              <p class="card-text" v-if="profile.bio">{{ profile.bio }}</p>
              <p class="text-muted" v-else><em>No bio provided</em></p>
            </div>
          </div>

          <!-- Interests -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-heart me-2"></i>Interests
              </h5>
            </div>
            <div class="card-body">
              <div v-if="profile.interests && profile.interests.length > 0">
                <span 
                  v-for="interest in profile.interests" 
                  :key="interest"
                  class="badge bg-secondary me-2 mb-2"
                >
                  {{ interest }}
                </span>
                
                <!-- Shared interests highlight -->
                <div v-if="sharedInterests.length > 0" class="mt-3 pt-3 border-top">
                  <small class="text-success">
                    <i class="bi bi-check-circle me-1"></i>
                    You share {{ sharedInterests.length }} interest(s): 
                    <strong>{{ sharedInterests.join(', ') }}</strong>
                  </small>
                </div>
              </div>
              <p class="text-muted mb-0" v-else>No interests listed</p>
            </div>
          </div>

          <!-- Looking For -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-search-heart me-2"></i>Looking For
              </h5>
            </div>
            <div class="card-body">
              <div v-if="profile.lookingFor && profile.lookingFor.length > 0">
                <span 
                  v-for="item in profile.lookingFor" 
                  :key="item"
                  class="badge bg-info me-2 mb-2"
                >
                  {{ item }}
                </span>
              </div>
              <p class="text-muted mb-0" v-else>Not specified</p>
            </div>
          </div>

          <!-- Preferences -->
          <div v-if="profile.preferences" class="card border-0 shadow-sm">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-sliders me-2"></i>Preferences
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <small class="text-muted">Age Range</small>
                  <div>{{ profile.preferences.ageMin || 18 }} - {{ profile.preferences.ageMax || 99 }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Compatibility -->
        <div class="col-lg-3 mb-4">
          <div v-if="hasUserProfile && compatibility" class="sticky-top" style="top: 1rem;">
            <!-- Overall Score -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-primary text-white text-center">
                <h5 class="mb-0">Compatibility Score</h5>
              </div>
              <div class="card-body text-center py-4">
                <CompatibilityScore 
                  :score="compatibility.overallScore"
                  size="large"
                  :show-label="true"
                />
              </div>
            </div>

            <!-- Detailed Breakdown -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-bar-chart me-2"></i>Breakdown
                </h5>
              </div>
              <div class="card-body">
                <CompatibilityScore 
                  :score="compatibility.overallScore"
                  :show-circle="false"
                  :show-breakdown="true"
                  :breakdown="compatibilityBreakdown"
                />
              </div>
            </div>

            <!-- Cosmic Analysis -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-dark text-white">
                <h5 class="mb-0">
                  <i class="bi bi-stars me-2"></i>Cosmic Analysis
                </h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <strong>Element Relationship</strong>
                  <p class="small text-muted mb-0">
                    {{ elementRelationshipDescription }}
                  </p>
                </div>
                <div class="mb-3">
                  <strong>Zodiac Harmony</strong>
                  <p class="small text-muted mb-0">
                    {{ zodiacHarmonyDescription }}
                  </p>
                </div>
                <div>
                  <strong>Overall Energy</strong>
                  <p class="small text-muted mb-0">
                    {{ overallEnergyDescription }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- No User Profile -->
          <div v-else class="card border-0 shadow-sm">
            <div class="card-body text-center py-4">
              <i class="bi bi-person-plus display-4 text-muted mb-3"></i>
              <h5>Create Your Profile</h5>
              <p class="text-muted small">
                Set up your profile to see compatibility scores and cosmic analysis.
              </p>
              <router-link to="/my-profile" class="btn btn-primary btn-sm">
                Create Profile
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDatingStore } from '@/stores/dating';
import { useCompatibility } from '@/composables/useCompatibility';
import CompatibilityScore from '@/components/CompatibilityScore.vue';

export default {
  name: 'ProfileDetailView',
  components: {
    CompatibilityScore
  },
  setup() {
    const route = useRoute();
    const datingStore = useDatingStore();
    const { calculateCompatibility, getDetailedReport } = useCompatibility();

    const loading = ref(true);
    const currentPhotoIndex = ref(0);

    const profile = computed(() => {
      const id = route.params.id;
      return datingStore.profiles.find(p => p.id === Number(id));
    });

    const hasUserProfile = computed(() => datingStore.hasUserProfile);
    const userProfile = computed(() => datingStore.userProfile);

    const compatibility = computed(() => {
      if (!hasUserProfile.value || !profile.value) return null;
      return calculateCompatibility(userProfile.value, profile.value);
    });

    const compatibilityBreakdown = computed(() => {
      if (!compatibility.value) return null;
      return {
        elementalCompatibility: { score: compatibility.value.elementalScore || 0 },
        trigramHexagramCompatibility: { score: compatibility.value.trigramScore || 0 },
        sexagenaryCompatibility: { score: compatibility.value.sexagenaryScore || 0 },
        interestMatch: { score: compatibility.value.interestScore || 0 }
      };
    });

    const mainPhoto = computed(() => {
      if (profile.value?.photos && profile.value.photos.length > 0) {
        return profile.value.photos[currentPhotoIndex.value];
      }
      return `/images/${profile.value?.zodiacAnimal?.toLowerCase() || 'dragon'}.jpg`;
    });

    const age = computed(() => {
      const birthDate = profile.value?.birthDate || profile.value?.birthday;
      if (!birthDate) return 'N/A';
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    });

    const elementBadgeClass = computed(() => {
      const element = profile.value?.element;
      const classes = {
        Wood: 'bg-success',
        Fire: 'bg-danger',
        Earth: 'bg-warning text-dark',
        Metal: 'bg-secondary',
        Water: 'bg-info'
      };
      return classes[element] || 'bg-secondary';
    });

    const sharedInterests = computed(() => {
      if (!hasUserProfile.value || !profile.value) return [];
      const userInterests = userProfile.value?.interests || [];
      const profileInterests = profile.value?.interests || [];
      return userInterests.filter(i => profileInterests.includes(i));
    });

    // Element relationship description
    const elementRelationshipDescription = computed(() => {
      if (!compatibility.value) return '';
      const score = compatibility.value.elementalScore || 0;
      const userEl = userProfile.value?.element;
      const profileEl = profile.value?.element;
      
      if (score >= 80) {
        return `${userEl} and ${profileEl} are in perfect harmony, creating a generating cycle of positive energy.`;
      } else if (score >= 60) {
        return `${userEl} and ${profileEl} share a supportive relationship with natural compatibility.`;
      } else if (score >= 40) {
        return `${userEl} and ${profileEl} have a neutral relationship that requires balance.`;
      } else {
        return `${userEl} and ${profileEl} may experience challenges due to controlling cycles.`;
      }
    });

    const zodiacHarmonyDescription = computed(() => {
      if (!compatibility.value) return '';
      const score = compatibility.value.trigramScore || 0;
      const userZodiac = userProfile.value?.zodiacAnimal;
      const profileZodiac = profile.value?.zodiacAnimal;
      
      if (score >= 80) {
        return `${userZodiac} and ${profileZodiac} share exceptional trigram alignment.`;
      } else if (score >= 60) {
        return `${userZodiac} and ${profileZodiac} have complementary trigram energies.`;
      } else {
        return `${userZodiac} and ${profileZodiac} have distinct but potentially balancing energies.`;
      }
    });

    const overallEnergyDescription = computed(() => {
      if (!compatibility.value) return '';
      const score = compatibility.value.overallScore;
      
      if (score >= 80) {
        return 'The cosmic forces strongly favor this connection. Your energies align beautifully.';
      } else if (score >= 60) {
        return 'The stars indicate a promising connection with room for growth and harmony.';
      } else if (score >= 40) {
        return 'Your connection has potential but may require understanding and compromise.';
      } else {
        return 'This pairing faces cosmic challenges but can overcome them with awareness.';
      }
    });

    const toggleFavorite = () => {
      if (profile.value) {
        datingStore.toggleFavorite(profile.value.id);
      }
    };

    onMounted(() => {
      loading.value = false;
    });

    watch(() => route.params.id, () => {
      currentPhotoIndex.value = 0;
    });

    return {
      loading,
      profile,
      hasUserProfile,
      compatibility,
      compatibilityBreakdown,
      mainPhoto,
      currentPhotoIndex,
      age,
      elementBadgeClass,
      sharedInterests,
      elementRelationshipDescription,
      zodiacHarmonyDescription,
      overallEnergyDescription,
      toggleFavorite
    };
  }
};
</script>

<style scoped>
.profile-photo-main {
  position: relative;
}

.btn-favorite {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.btn-favorite:hover {
  background: white;
  transform: scale(1.1);
}

.thumbnail-photo {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;
  height: 60px;
  width: 100%;
  object-fit: cover;
}

.thumbnail-photo:hover,
.thumbnail-photo.active {
  opacity: 1;
}
</style>
