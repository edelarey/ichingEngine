import { defineStore } from 'pinia';
import { DateTime } from 'luxon';
import sampleProfiles from '@/const/sampleProfiles';
import { calculateDatingCompatibility } from '@/utils/datingCompatibility';

export const useDatingStore = defineStore('dating', {
  state: () => ({
    profiles: JSON.parse(localStorage.getItem('datingProfiles')) || [],
    currentUserProfileId: localStorage.getItem('currentUserProfileId') || null,
    favorites: JSON.parse(localStorage.getItem('datingFavorites')) || [],
    calculatedMatches: [],
    filters: {
      ageRange: [18, 99],
      gender: 'ANY',
      elements: [],
      minCompatibility: 0
    },
    sortBy: 'compatibility'
  }),

  getters: {
    // Property-style getters (no "get" prefix for easier access)
    hasUserProfile: (state) => !!state.currentUserProfileId,
    
    userProfile: (state) => {
      if (!state.currentUserProfileId) return null;
      return state.profiles.find(p => p.id === Number(state.currentUserProfileId));
    },
    
    otherProfiles: (state) => {
      if (!state.currentUserProfileId) return state.profiles || [];
      return (state.profiles || []).filter(p => p.id !== Number(state.currentUserProfileId));
    },
    
    favoriteProfiles: (state) => {
      return (state.profiles || []).filter(p => state.favorites.includes(p.id));
    },
    
    matchesWithScores() {
      if (!this.hasUserProfile || !this.userProfile) return [];
      
      return this.otherProfiles.map(profile => {
        const compatibility = calculateDatingCompatibility(this.userProfile, profile);
        return {
          ...profile,
          compatibilityScore: compatibility.overallScore,
          compatibilityBreakdown: compatibility
        };
      }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    },
    
    // Method-style getters (kept for compatibility)
    getAllProfiles: (state) => state.profiles || [],
    
    getCurrentUserProfile: (state) => {
      if (!state.currentUserProfileId) return null;
      return (state.profiles || []).find(p => p.id === Number(state.currentUserProfileId));
    },
    
    getOtherProfiles: (state) => {
      if (!state.currentUserProfileId) return state.profiles || [];
      return (state.profiles || []).filter(p => p.id !== Number(state.currentUserProfileId));
    },
    
    getFavoriteProfiles: (state) => {
      return (state.profiles || []).filter(p => state.favorites.includes(p.id));
    },
    
    getProfileById: (state) => (id) => {
      return (state.profiles || []).find(p => p.id === Number(id));
    },
    
    isFavorite: (state) => (profileId) => {
      return state.favorites.includes(Number(profileId));
    },
    
    getFilteredProfiles: (state) => {
      let filtered = state.profiles.filter(p => p.id !== Number(state.currentUserProfileId));
      
      // Filter by gender preference
      if (state.filters.gender !== 'ANY') {
        filtered = filtered.filter(p => p.gender === state.filters.gender);
      }
      
      // Filter by age range
      filtered = filtered.filter(p => {
        const age = calculateAge(p.birthday);
        return age >= state.filters.ageRange[0] && age <= state.filters.ageRange[1];
      });
      
      // Filter by elements
      if (state.filters.elements.length > 0) {
        filtered = filtered.filter(p => {
          if (!p.astrologyProfile?.element) return false;
          return state.filters.elements.includes(p.astrologyProfile.element);
        });
      }
      
      return filtered;
    }
  },

  actions: {
    persistState() {
      localStorage.setItem('datingProfiles', JSON.stringify(this.profiles));
      localStorage.setItem('datingFavorites', JSON.stringify(this.favorites));
      if (this.currentUserProfileId) {
        localStorage.setItem('currentUserProfileId', this.currentUserProfileId);
      }
    },

    createProfile(profileData) {
      const now = DateTime.now().toISO();
      const newProfile = {
        id: Date.now(),
        
        // Birth Data
        name: profileData.name || '',
        birthday: profileData.birthday || '',
        gender: profileData.gender || 'MALE',
        coords: profileData.coords || { latitude: 0, longitude: 0 },
        place: profileData.place || '',
        
        // Dating Profile Extensions
        displayName: profileData.displayName || profileData.name || '',
        bio: profileData.bio || '',
        photos: profileData.photos || [],
        avatarIndex: profileData.avatarIndex || 0,
        
        interests: profileData.interests || [],
        lookingFor: profileData.lookingFor || ['romance'],
        
        // Preferences
        ageRange: profileData.ageRange || { min: 18, max: 99 },
        genderPreference: profileData.genderPreference || 'ANY',
        
        // Profile Status
        isActive: true,
        createdAt: now,
        updatedAt: now,
        
        // Computed astrology profile (will be populated later)
        astrologyProfile: profileData.astrologyProfile || null
      };
      
      this.profiles.push(newProfile);
      this.persistState();
      return newProfile;
    },

    updateProfile(id, updates) {
      const index = this.profiles.findIndex(p => p.id === Number(id));
      if (index !== -1) {
        this.profiles[index] = {
          ...this.profiles[index],
          ...updates,
          updatedAt: DateTime.now().toISO()
        };
        this.persistState();
        return this.profiles[index];
      }
      return null;
    },

    deleteProfile(id) {
      this.profiles = this.profiles.filter(p => p.id !== Number(id));
      this.favorites = this.favorites.filter(fid => fid !== Number(id));
      if (this.currentUserProfileId === String(id)) {
        this.currentUserProfileId = null;
        localStorage.removeItem('currentUserProfileId');
      }
      this.persistState();
    },

    setCurrentUserProfile(profileId) {
      this.currentUserProfileId = profileId ? String(profileId) : null;
      if (profileId) {
        localStorage.setItem('currentUserProfileId', String(profileId));
      } else {
        localStorage.removeItem('currentUserProfileId');
      }
    },

    toggleFavorite(profileId) {
      const id = Number(profileId);
      const index = this.favorites.indexOf(id);
      if (index === -1) {
        this.favorites.push(id);
      } else {
        this.favorites.splice(index, 1);
      }
      this.persistState();
    },

    addFavorite(profileId) {
      const id = Number(profileId);
      if (!this.favorites.includes(id)) {
        this.favorites.push(id);
        this.persistState();
      }
    },

    removeFavorite(profileId) {
      const id = Number(profileId);
      this.favorites = this.favorites.filter(fid => fid !== id);
      this.persistState();
    },

    setFilter(filterName, value) {
      this.filters[filterName] = value;
    },

    resetFilters() {
      this.filters = {
        ageRange: [18, 99],
        gender: 'ANY',
        elements: [],
        minCompatibility: 0
      };
    },

    setSortBy(sortBy) {
      this.sortBy = sortBy;
    },

    setCalculatedMatches(matches) {
      this.calculatedMatches = matches;
    },

    loadSampleProfiles() {
      // Load sample profiles from const file and normalize structure
      const profiles = sampleProfiles.map((p, index) => ({
        ...p,
        id: p.id || Date.now() + index,
        isSample: true,
        // Flatten astrologyProfile for easier access
        element: p.astrologyProfile?.element || p.element || 'Wood',
        zodiacAnimal: p.astrologyProfile?.animal || p.zodiacAnimal || 'Dragon',
        celestialStem: p.astrologyProfile?.celestialStem || null,
        horaryBranch: p.astrologyProfile?.horaryBranch || null,
        // Ensure birthDate exists (some parts use birthDate, some use birthday)
        birthDate: p.birthDate || p.birthday,
        birthday: p.birthday || p.birthDate
      }));
      
      // Add to existing profiles (don't replace)
      profiles.forEach(profile => {
        // Check if profile with this name already exists
        const exists = this.profiles.some(p => p.displayName === profile.displayName);
        if (!exists) {
          this.profiles.push(profile);
        }
      });
      
      this.persistState();
    },

    exportProfiles() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.profiles));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', 'dating_profiles.json');
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },

    importProfiles(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedProfiles = JSON.parse(e.target.result);
            if (Array.isArray(importedProfiles)) {
              this.profiles = importedProfiles.map(p => ({
                ...p,
                id: p.id || Date.now() + Math.random() * 1000
              }));
              this.persistState();
              resolve(this.profiles);
            } else {
              reject(new Error('Invalid profile data format'));
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
    },

    clearAllProfiles() {
      this.profiles = [];
      this.favorites = [];
      this.currentUserProfileId = null;
      this.calculatedMatches = [];
      localStorage.removeItem('datingProfiles');
      localStorage.removeItem('datingFavorites');
      localStorage.removeItem('currentUserProfileId');
    }
  }
});

// Helper function to calculate age from birthday
function calculateAge(birthday) {
  if (!birthday) return 0;
  const birthDate = DateTime.fromISO(birthday);
  const now = DateTime.now();
  return Math.floor(now.diff(birthDate, 'years').years);
}

export { calculateAge };
