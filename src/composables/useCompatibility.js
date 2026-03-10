import { ref, computed, watch } from 'vue';
import { useDatingStore } from '@/stores/dating';
import { 
  calculateDatingCompatibility, 
  batchCalculateCompatibility,
  calculateAstrologyProfile,
  getElementEmoji,
  getAnimalEmoji,
  getCompatibilityCategory
} from '@/utils/datingCompatibility';

/**
 * Composable for managing compatibility calculations
 * Provides reactive compatibility data and calculation methods
 */
export function useCompatibility() {
  const datingStore = useDatingStore();
  
  const isCalculating = ref(false);
  const calculationError = ref(null);
  const lastCalculated = ref(null);
  
  // Cache for compatibility results
  const compatibilityCache = ref(new Map());
  
  /**
   * Calculate compatibility between two profiles
   * Returns cached result if available
   */
  async function calculateCompatibility(profile1, profile2, forceRecalculate = false) {
    if (!profile1 || !profile2) {
      return null;
    }
    
    const cacheKey = `${profile1.id}-${profile2.id}`;
    const reverseCacheKey = `${profile2.id}-${profile1.id}`;
    
    // Check cache first
    if (!forceRecalculate) {
      if (compatibilityCache.value.has(cacheKey)) {
        return compatibilityCache.value.get(cacheKey);
      }
      if (compatibilityCache.value.has(reverseCacheKey)) {
        return compatibilityCache.value.get(reverseCacheKey);
      }
    }
    
    isCalculating.value = true;
    calculationError.value = null;
    
    try {
      const result = await calculateDatingCompatibility(profile1, profile2);
      
      // Cache the result
      compatibilityCache.value.set(cacheKey, result);
      lastCalculated.value = new Date();
      
      return result;
    } catch (error) {
      calculationError.value = error.message;
      console.error('Compatibility calculation error:', error);
      return null;
    } finally {
      isCalculating.value = false;
    }
  }
  
  /**
   * Calculate compatibility for current user against all other profiles
   */
  async function calculateAllMatches() {
    const userProfile = datingStore.getCurrentUserProfile;
    const otherProfiles = datingStore.getOtherProfiles;
    
    if (!userProfile || otherProfiles.length === 0) {
      return [];
    }
    
    isCalculating.value = true;
    calculationError.value = null;
    
    try {
      const results = await batchCalculateCompatibility(userProfile, otherProfiles);
      
      // Cache individual results
      results.forEach(result => {
        const cacheKey = `${userProfile.id}-${result.profileId}`;
        compatibilityCache.value.set(cacheKey, result.compatibility);
      });
      
      // Store in dating store
      datingStore.setCalculatedMatches(results);
      lastCalculated.value = new Date();
      
      return results;
    } catch (error) {
      calculationError.value = error.message;
      console.error('Batch compatibility calculation error:', error);
      return [];
    } finally {
      isCalculating.value = false;
    }
  }
  
  /**
   * Get sorted matches based on current filters and sort settings
   */
  const sortedMatches = computed(() => {
    let matches = [...datingStore.calculatedMatches];
    
    // Apply minimum compatibility filter
    if (datingStore.filters.minCompatibility > 0) {
      matches = matches.filter(
        m => m.compatibility.overallScore >= datingStore.filters.minCompatibility
      );
    }
    
    // Apply sorting
    switch (datingStore.sortBy) {
      case 'compatibility':
        matches.sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore);
        break;
      case 'age':
        matches.sort((a, b) => {
          const ageA = calculateAge(a.profile.birthday);
          const ageB = calculateAge(b.profile.birthday);
          return ageA - ageB;
        });
        break;
      case 'recent':
        matches.sort((a, b) => {
          const dateA = new Date(a.profile.createdAt || 0);
          const dateB = new Date(b.profile.createdAt || 0);
          return dateB - dateA;
        });
        break;
    }
    
    return matches;
  });
  
  /**
   * Get top matches (highest compatibility)
   */
  function getTopMatches(limit = 5) {
    return sortedMatches.value.slice(0, limit);
  }
  
  /**
   * Update astrology profile for a dating profile
   */
  async function updateAstrologyProfile(profile) {
    if (!profile) return null;
    
    try {
      const astrologyProfile = await calculateAstrologyProfile(profile);
      if (astrologyProfile) {
        datingStore.updateProfile(profile.id, { astrologyProfile });
        return astrologyProfile;
      }
    } catch (error) {
      console.error('Error updating astrology profile:', error);
    }
    return null;
  }
  
  /**
   * Clear compatibility cache
   */
  function clearCache() {
    compatibilityCache.value.clear();
    datingStore.setCalculatedMatches([]);
    lastCalculated.value = null;
  }
  
  /**
   * Get cached compatibility for a specific profile pair
   */
  function getCachedCompatibility(profileId1, profileId2) {
    const cacheKey = `${profileId1}-${profileId2}`;
    const reverseCacheKey = `${profileId2}-${profileId1}`;
    
    return compatibilityCache.value.get(cacheKey) || 
           compatibilityCache.value.get(reverseCacheKey) || 
           null;
  }
  
  /**
   * Get compatibility score color class
   */
  function getScoreColorClass(score) {
    if (score >= 80) return 'text-warning'; // Gold
    if (score >= 60) return 'text-secondary'; // Silver
    if (score >= 40) return 'text-success'; // Bronze/Green
    if (score >= 20) return 'text-info'; // Blue
    return 'text-muted'; // Gray
  }
  
  /**
   * Get compatibility progress bar color
   */
  function getProgressBarColor(score) {
    if (score >= 80) return 'bg-warning';
    if (score >= 60) return 'bg-info';
    if (score >= 40) return 'bg-success';
    if (score >= 20) return 'bg-primary';
    return 'bg-secondary';
  }
  
  return {
    // State
    isCalculating,
    calculationError,
    lastCalculated,
    
    // Computed
    sortedMatches,
    
    // Methods
    calculateCompatibility,
    calculateAllMatches,
    getTopMatches,
    updateAstrologyProfile,
    clearCache,
    getCachedCompatibility,
    
    // Display helpers
    getScoreColorClass,
    getProgressBarColor,
    getElementEmoji,
    getAnimalEmoji,
    getCompatibilityCategory
  };
}

// Helper function
function calculateAge(birthday) {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export { calculateAge };
