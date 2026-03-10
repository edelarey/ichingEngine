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
        <!-- Excellent Matches -->
        <div v-if="excellentMatches.length > 0" class="mb-5">
          <h3 class="mb-3">
            <i class="bi bi-star-fill text-warning me-2"></i>
            Excellent Matches
            <span class="badge bg-success ms-2">{{ excellentMatches.length }}</span>
          </h3>
          <div class="row g-4">
            <div 
              v-for="match in excellentMatches" 
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
            </div>
          </div>
        </div>

        <!-- Good Matches -->
        <div v-if="goodMatches.length > 0" class="mb-5">
          <h3 class="mb-3">
            <i class="bi bi-hand-thumbs-up text-info me-2"></i>
            Good Matches
            <span class="badge bg-info ms-2">{{ goodMatches.length }}</span>
          </h3>
          <div class="row g-4">
            <div 
              v-for="match in goodMatches" 
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
            </div>
          </div>
        </div>

        <!-- Moderate Matches -->
        <div v-if="moderateMatches.length > 0" class="mb-5">
          <h3 class="mb-3">
            <i class="bi bi-question-circle text-warning me-2"></i>
            Moderate Matches
            <span class="badge bg-warning text-dark ms-2">{{ moderateMatches.length }}</span>
          </h3>
          <div class="row g-4">
            <div 
              v-for="match in moderateMatches" 
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
            </div>
          </div>
        </div>

        <!-- Show More Section for Low Matches -->
        <div v-if="lowMatches.length > 0" class="mb-4">
          <div class="card border-0 bg-light">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="mb-1">
                    <i class="bi bi-three-dots me-2"></i>
                    {{ lowMatches.length }} Other Profiles
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
              v-for="match in lowMatches" 
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
      hasUserProfile,
      allMatches,
      excellentMatches,
      goodMatches,
      moderateMatches,
      lowMatches,
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
</style>
