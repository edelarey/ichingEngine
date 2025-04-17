import { defineStore } from 'pinia';

// Define the initial (default) settings
const initialSettings = {
  rotations: 4,
  startingRadius: 40,
};

// Validation function to check if the provided settings are valid
function isValidSettings(settings) {
  // Check if rotations is a positive integer >= 1
  if (
    typeof settings.rotations !== 'number' ||
    !Number.isInteger(settings.rotations) ||
    settings.rotations < 1
  ) {
    return false;
  }
  // Check if startingRadius is a number between 10 and 100
  if (
    typeof settings.startingRadius !== 'number' ||
    settings.startingRadius < 10 ||
    settings.startingRadius > 100
  ) {
    return false;
  }
  return true;
}

export const useSpiralSettingsStore = defineStore('spiralSettings', {
  // Initialize state with settings from localStorage or an empty object
  state: () => ({
    settings: JSON.parse(localStorage.getItem('spiralSettings')) || {},
  }),

  // Getter to retrieve settings for a specific spiral type, falling back to defaults
  getters: {
    getSettings: (state) => (spiralType) => {
      const storedSettings = state.settings[spiralType];
      if (storedSettings && isValidSettings(storedSettings)) {
        return storedSettings;
      }
      return { ...initialSettings };
    },
  },

  // Actions to manage settings
  actions: {
    // Helper function to save to localStorage
    persistState() {
      localStorage.setItem('spiralSettings', JSON.stringify(this.settings));
    },

    // Update settings for a specific spiral type, reverting to defaults if invalid
    updateSettings(spiralType, newSettings) {
      if (isValidSettings(newSettings)) {
        this.settings[spiralType] = { ...newSettings };
      } else {
        this.settings[spiralType] = { ...initialSettings };
      }
      this.persistState();
    },

    // Initialize settings with defaults if not present or invalid
    initializeSettings(spiralType) {
      if (!this.settings[spiralType] || !isValidSettings(this.settings[spiralType])) {
        this.settings[spiralType] = { ...initialSettings };
        this.persistState();
      }
    },
  },
});