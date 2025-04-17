import { defineStore } from 'pinia';

export const useSpiralSettingsStore = defineStore('spiralSettings', {
  // State: Load settings from localStorage or initialize as empty object
  state: () => ({
    settings: JSON.parse(localStorage.getItem('spiralSettings')) || {},
  }),

  // Getters: Retrieve settings for a specific spiral type
  getters: {
    getSettings: (state) => (spiralType) => {
      const defaultSettings = { rotations: 4, startingRadius: 40 };
      return state.settings[spiralType] || defaultSettings;
    },
  },

  // Actions: Manage settings with validation and persistence
  actions: {
    // Helper function to save to localStorage
    persistState() {
      localStorage.setItem('spiralSettings', JSON.stringify(this.settings));
    },

    // Validate spiral settings
    validateSettings(settings) {
      const errors = [];

      // Validate rotations
      if (
        typeof settings.rotations !== 'number' ||
        !Number.isInteger(settings.rotations) ||
        settings.rotations < 1
      ) {
        errors.push('Rotations must be a positive integer greater than or equal to 1.');
      }

      // Validate startingRadius
      if (
        typeof settings.startingRadius !== 'number' ||
        settings.startingRadius < 10 ||
        settings.startingRadius > 100
      ) {
        errors.push('Starting radius must be a number between 10 and 100.');
      }

      return errors;
    },

    // Update settings for a specific spiral type
    updateSettings(spiralType, newSettings) {
      if (!spiralType || typeof spiralType !== 'string' || spiralType.trim() === '') {
        throw new Error('Spiral type must be a non-empty string.');
      }

      const settingsToUpdate = {
        rotations: newSettings.rotations,
        startingRadius: newSettings.startingRadius,
      };

      // Validate the settings
      const errors = this.validateSettings(settingsToUpdate);
      if (errors.length > 0) {
        throw new Error(errors.join(' '));
      }

      // Update the settings in state
      this.settings[spiralType] = settingsToUpdate;
      this.persistState();
    },

    // Initialize settings with defaults if not present
    initializeSettings(spiralType) {
      if (!spiralType || typeof spiralType !== 'string' || spiralType.trim() === '') {
        throw new Error('Spiral type must be a non-empty string.');
      }

      if (!this.settings[spiralType]) {
        this.settings[spiralType] = { rotations: 4, startingRadius: 40 };
        this.persistState();
      }
    },
  },
});