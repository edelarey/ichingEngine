<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">
          <i class="bi bi-person-circle me-2"></i>My Profile
        </h1>
      </div>
    </div>

    <!-- No Profile Created Yet -->
    <div v-if="!hasUserProfile" class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <i class="bi bi-person-plus display-1 text-muted mb-4"></i>
            <h3>Create Your Dating Profile</h3>
            <p class="text-muted mb-4">
              Set up your I-Ching Astrology dating profile to find compatible matches 
              based on your birth chart and cosmic alignment.
            </p>
            <button class="btn btn-primary btn-lg" @click="startCreatingProfile">
              <i class="bi bi-plus-circle me-2"></i>Create Profile
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Display / Edit Mode -->
    <div v-else class="row">
      <!-- Profile Preview Column -->
      <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-sm sticky-top" style="top: 1rem;">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-eye me-2"></i>Profile Preview
            </h5>
          </div>
          <div class="card-body p-0">
            <ProfileCard 
              :profile="userProfile" 
              :show-compatibility="false"
              :show-actions="false"
            />
          </div>
          <div class="card-footer bg-white">
            <div class="d-grid gap-2">
              <button 
                v-if="!isEditing" 
                class="btn btn-outline-primary"
                @click="startEditing"
              >
                <i class="bi bi-pencil me-2"></i>Edit Profile
              </button>
              <button 
                class="btn btn-outline-danger"
                @click="confirmDeleteProfile"
              >
                <i class="bi bi-trash me-2"></i>Delete Profile
              </button>
            </div>
          </div>
        </div>

        <!-- Astrological Summary -->
        <div class="card border-0 shadow-sm mt-4">
          <div class="card-header bg-dark text-white">
            <h5 class="mb-0">
              <i class="bi bi-stars me-2"></i>Your Cosmic Profile
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <strong>Zodiac Animal:</strong>
              <span class="badge bg-primary ms-2">{{ userProfile.zodiacAnimal }}</span>
            </div>
            <div class="mb-3">
              <strong>Element:</strong>
              <span class="badge ms-2" :class="elementBadgeClass">{{ userProfile.element }}</span>
            </div>
            <div class="mb-3">
              <strong>Celestial Stem:</strong>
              <span class="text-muted">{{ userProfile.celestialStem || 'N/A' }}</span>
            </div>
            <div class="mb-3">
              <strong>Horary Branch:</strong>
              <span class="text-muted">{{ userProfile.horaryBranch || 'N/A' }}</span>
            </div>
            <hr>
            <p class="small text-muted mb-0">
              Your I-Ching astrology profile reveals your cosmic essence and helps 
              find harmonious matches based on elemental cycles and hexagram compatibility.
            </p>
          </div>
        </div>
      </div>

      <!-- Edit Form Column -->
      <div class="col-lg-8">
        <div v-if="isEditing" class="card border-0 shadow-sm">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-pencil-square me-2"></i>Edit Profile
            </h5>
          </div>
          <div class="card-body">
            <ProfileForm 
              :initial-data="userProfile"
              :is-edit="true"
              @submit="handleProfileUpdate"
              @cancel="cancelEditing"
            />
          </div>
        </div>

        <div v-else>
          <!-- Profile Stats -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-graph-up me-2"></i>Profile Statistics
              </h5>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-4">
                  <div class="display-6 text-primary">{{ profileStats.totalMatches }}</div>
                  <small class="text-muted">Total Matches</small>
                </div>
                <div class="col-4">
                  <div class="display-6 text-success">{{ profileStats.excellentMatches }}</div>
                  <small class="text-muted">Excellent (80%+)</small>
                </div>
                <div class="col-4">
                  <div class="display-6 text-danger">{{ profileStats.favorites }}</div>
                  <small class="text-muted">Favorites</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Bio Section -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-card-text me-2"></i>About Me
              </h5>
            </div>
            <div class="card-body">
              <p class="mb-0" v-if="userProfile.bio">{{ userProfile.bio }}</p>
              <p class="text-muted mb-0" v-else>No bio added yet.</p>
            </div>
          </div>

          <!-- Interests Section -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-heart me-2"></i>Interests
              </h5>
            </div>
            <div class="card-body">
              <div v-if="userProfile.interests && userProfile.interests.length > 0">
                <span 
                  v-for="interest in userProfile.interests" 
                  :key="interest"
                  class="badge bg-secondary me-2 mb-2"
                >
                  {{ interest }}
                </span>
              </div>
              <p class="text-muted mb-0" v-else>No interests added yet.</p>
            </div>
          </div>

          <!-- Looking For Section -->
          <div class="card border-0 shadow-sm">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-search-heart me-2"></i>Looking For
              </h5>
            </div>
            <div class="card-body">
              <div v-if="userProfile.lookingFor && userProfile.lookingFor.length > 0">
                <span 
                  v-for="item in userProfile.lookingFor" 
                  :key="item"
                  class="badge bg-info me-2 mb-2"
                >
                  {{ item }}
                </span>
              </div>
              <p class="text-muted mb-0" v-else>Not specified.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Profile Modal -->
    <div 
      class="modal fade" 
      id="createProfileModal" 
      tabindex="-1" 
      ref="createModalRef"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-person-plus me-2"></i>Create Your Profile
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <ProfileForm 
              :is-edit="false"
              @submit="handleProfileCreate"
              @cancel="closeCreateModal"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      class="modal fade" 
      id="deleteProfileModal" 
      tabindex="-1"
      ref="deleteModalRef"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>Delete Profile
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete your dating profile? This action cannot be undone.</p>
            <p class="text-muted small">Your birth data and other app data will remain intact.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteProfile">
              <i class="bi bi-trash me-2"></i>Delete Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useDatingStore } from '@/stores/dating';
import ProfileForm from '@/components/ProfileForm.vue';
import ProfileCard from '@/components/ProfileCard.vue';
import { Modal } from 'bootstrap';

export default {
  name: 'MyProfileView',
  components: {
    ProfileForm,
    ProfileCard
  },
  setup() {
    const datingStore = useDatingStore();
    const isEditing = ref(false);
    const createModalRef = ref(null);
    const deleteModalRef = ref(null);
    let createModal = null;
    let deleteModal = null;

    const hasUserProfile = computed(() => datingStore.hasUserProfile);
    const userProfile = computed(() => datingStore.userProfile);

    const elementBadgeClass = computed(() => {
      const element = userProfile.value?.element;
      const classes = {
        Wood: 'bg-success',
        Fire: 'bg-danger',
        Earth: 'bg-warning text-dark',
        Metal: 'bg-secondary',
        Water: 'bg-info'
      };
      return classes[element] || 'bg-secondary';
    });

    const profileStats = computed(() => {
      const profiles = datingStore.otherProfiles;
      const matches = datingStore.matchesWithScores;
      return {
        totalMatches: profiles.length,
        excellentMatches: matches.filter(m => m.compatibilityScore >= 80).length,
        favorites: datingStore.favoriteProfiles.length
      };
    });

    onMounted(() => {
      if (createModalRef.value) {
        createModal = new Modal(createModalRef.value);
      }
      if (deleteModalRef.value) {
        deleteModal = new Modal(deleteModalRef.value);
      }
    });

    const startCreatingProfile = () => {
      if (createModal) {
        createModal.show();
      }
    };

    const closeCreateModal = () => {
      if (createModal) {
        createModal.hide();
      }
    };

    const handleProfileCreate = (profileData) => {
      datingStore.createProfile({
        ...profileData,
        isUserProfile: true
      });
      closeCreateModal();
    };

    const startEditing = () => {
      isEditing.value = true;
    };

    const cancelEditing = () => {
      isEditing.value = false;
    };

    const handleProfileUpdate = (profileData) => {
      datingStore.updateProfile(profileData);
      isEditing.value = false;
    };

    const confirmDeleteProfile = () => {
      if (deleteModal) {
        deleteModal.show();
      }
    };

    const deleteProfile = () => {
      if (userProfile.value) {
        datingStore.deleteProfile(userProfile.value.id);
      }
      if (deleteModal) {
        deleteModal.hide();
      }
    };

    return {
      hasUserProfile,
      userProfile,
      isEditing,
      elementBadgeClass,
      profileStats,
      createModalRef,
      deleteModalRef,
      startCreatingProfile,
      closeCreateModal,
      handleProfileCreate,
      startEditing,
      cancelEditing,
      handleProfileUpdate,
      confirmDeleteProfile,
      deleteProfile
    };
  }
};
</script>

<style scoped>
.display-6 {
  font-weight: 600;
}
</style>
