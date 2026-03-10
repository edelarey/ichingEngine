<template>
  <div class="profile-card card h-100" :class="{ 'border-warning': isFavorite }">
    <!-- Photo/Avatar Section -->
    <div class="card-img-top profile-image-container bg-light d-flex align-items-center justify-content-center">
      <div v-if="profile.photos && profile.photos.length > 0">
        <img :src="profile.photos[profile.avatarIndex || 0]" :alt="profile.displayName" class="profile-image" />
      </div>
      <div v-else class="avatar-placeholder">
        <span class="avatar-emoji">{{ getAnimalEmoji(profile.astrologyProfile?.animal) }}</span>
      </div>
      
      <!-- Favorite badge -->
      <button
        v-if="showFavorite"
        class="btn btn-sm favorite-btn"
        :class="isFavorite ? 'btn-warning' : 'btn-outline-secondary'"
        @click.stop="toggleFavorite"
        :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        <span v-if="isFavorite">⭐</span>
        <span v-else>☆</span>
      </button>
    </div>
    
    <div class="card-body">
      <!-- Name and Age -->
      <h5 class="card-title mb-1">
        {{ profile.displayName || profile.name }}
        <small class="text-muted">{{ age }}</small>
      </h5>
      
      <!-- Element and Animal -->
      <div class="mb-2">
        <span class="badge bg-secondary me-1" :title="profile.astrologyProfile?.element || 'Unknown Element'">
          {{ getElementEmoji(profile.astrologyProfile?.element) }}
          {{ profile.astrologyProfile?.element || '?' }}
        </span>
        <span class="badge bg-secondary" :title="profile.astrologyProfile?.animal || 'Unknown Animal'">
          {{ getAnimalEmoji(profile.astrologyProfile?.animal) }}
          {{ profile.astrologyProfile?.animal || '?' }}
        </span>
      </div>
      
      <!-- Compatibility Score -->
      <div v-if="compatibility" class="compatibility-section mb-3">
        <div class="d-flex align-items-center justify-content-between mb-1">
          <small class="text-muted">Compatibility</small>
          <span class="compatibility-score" :class="scoreColorClass">
            {{ compatibility.overallScore }}%
          </span>
        </div>
        <div class="progress" style="height: 8px;">
          <div
            class="progress-bar"
            :class="progressBarColor"
            role="progressbar"
            :style="{ width: compatibility.overallScore + '%' }"
            :aria-valuenow="compatibility.overallScore"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <small class="text-muted">
          {{ compatibility.category?.emoji }} {{ compatibility.category?.name }}
        </small>
      </div>
      
      <!-- Bio excerpt -->
      <p class="card-text bio-excerpt text-muted" v-if="profile.bio">
        {{ truncatedBio }}
      </p>
      
      <!-- Interests -->
      <div class="interests-section" v-if="profile.interests && profile.interests.length > 0">
        <span
          v-for="interest in displayedInterests"
          :key="interest"
          class="badge bg-light text-dark me-1 mb-1"
        >
          {{ interest }}
        </span>
        <span v-if="profile.interests.length > 3" class="badge bg-light text-muted">
          +{{ profile.interests.length - 3 }}
        </span>
      </div>
    </div>
    
    <div class="card-footer bg-transparent border-top-0">
      <div class="d-flex gap-2">
        <router-link
          :to="{ name: 'ProfileDetail', params: { id: profile.id } }"
          class="btn btn-primary btn-sm flex-grow-1"
        >
          View Profile
        </router-link>
        <button
          v-if="showFavorite"
          class="btn btn-sm"
          :class="isFavorite ? 'btn-warning' : 'btn-outline-warning'"
          @click.stop="toggleFavorite"
        >
          {{ isFavorite ? '★' : '☆' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useDatingStore } from '@/stores/dating';
import { useCompatibility } from '@/composables/useCompatibility';

export default {
  name: 'ProfileCard',
  props: {
    profile: {
      type: Object,
      required: true
    },
    compatibility: {
      type: Object,
      default: null
    },
    showFavorite: {
      type: Boolean,
      default: true
    }
  },
  emits: ['toggle-favorite'],
  setup(props, { emit }) {
    const datingStore = useDatingStore();
    const { getScoreColorClass, getProgressBarColor, getElementEmoji, getAnimalEmoji } = useCompatibility();
    
    const age = computed(() => {
      if (!props.profile.birthday) return '';
      const birthDate = new Date(props.profile.birthday);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      return calculatedAge;
    });
    
    const truncatedBio = computed(() => {
      if (!props.profile.bio) return '';
      if (props.profile.bio.length <= 100) return props.profile.bio;
      return props.profile.bio.substring(0, 100) + '...';
    });
    
    const displayedInterests = computed(() => {
      if (!props.profile.interests) return [];
      return props.profile.interests.slice(0, 3);
    });
    
    const isFavorite = computed(() => {
      return datingStore.isFavorite(props.profile.id);
    });
    
    const scoreColorClass = computed(() => {
      if (!props.compatibility) return '';
      return getScoreColorClass(props.compatibility.overallScore);
    });
    
    const progressBarColor = computed(() => {
      if (!props.compatibility) return 'bg-secondary';
      return getProgressBarColor(props.compatibility.overallScore);
    });
    
    function toggleFavorite() {
      datingStore.toggleFavorite(props.profile.id);
      emit('toggle-favorite', props.profile.id);
    }
    
    return {
      age,
      truncatedBio,
      displayedInterests,
      isFavorite,
      scoreColorClass,
      progressBarColor,
      toggleFavorite,
      getElementEmoji,
      getAnimalEmoji
    };
  }
};
</script>

<style scoped>
.profile-card {
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-image-container {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avatar-emoji {
  font-size: 4rem;
}

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.compatibility-score {
  font-weight: bold;
  font-size: 1.1rem;
}

.bio-excerpt {
  font-size: 0.9rem;
  line-height: 1.4;
  min-height: 2.8em;
}

.interests-section {
  min-height: 28px;
}

.interests-section .badge {
  font-size: 0.75rem;
  font-weight: normal;
}

.text-warning {
  color: #ffc107 !important;
}

.text-info {
  color: #0dcaf0 !important;
}

.text-success {
  color: #198754 !important;
}

.text-muted {
  color: #6c757d !important;
}
</style>
