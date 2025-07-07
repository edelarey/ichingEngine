import { defineStore } from 'pinia';
import { DateTime } from 'luxon';

export const useBirthdayStore = defineStore('birthday', {
  state: () => ({
    birthdays: JSON.parse(localStorage.getItem('birthdays')) || [],
  }),
  getters: {
    getBirthdayList: (state) => state.birthdays,
  },
  actions: {
    // Helper function to save to localStorage
    persistState() {
      localStorage.setItem('birthdays', JSON.stringify(this.birthdays));
    },

    // Validate a birthday object
    validateBirthday(birthday) {
      const errors = [];

      // Validate name
      if (!birthday.name || typeof birthday.name !== 'string' || birthday.name.trim() === '') {
        errors.push('Name is required and must be a non-empty string.');
      }

      // Check for duplicate name (excluding the current birthday if updating)
      const existingBirthday = this.birthdays.find(b => b.name === birthday.name && b.id !== birthday.id);
      if (existingBirthday) {
        errors.push(`A birthday with the name "${birthday.name}" already exists. Please use a unique name.`);
      }

      // Validate birthday date
      if (!birthday.birthday || !DateTime.fromISO(birthday.birthday).isValid) {
        errors.push('Birthday must be a valid date in ISO format (e.g., "1970-01-01T15:50:00").');
      }

      // Validate gender
      if (!['MALE', 'FEMALE'].includes(birthday.gender)) {
        errors.push('Gender must be either "MALE" or "FEMALE".');
      }

      // Validate coordinates (latitude and longitude can be decimal numbers)
      if (typeof birthday.coords.latitude !== 'number' || isNaN(birthday.coords.latitude) || birthday.coords.latitude < -90 || birthday.coords.latitude > 90) {
        errors.push('Latitude must be a number (including decimals) between -90 and 90 (e.g., -26.174204189162413).');
      }
      if (typeof birthday.coords.longitude !== 'number' || isNaN(birthday.coords.longitude) || birthday.coords.longitude < -180 || birthday.coords.longitude > 180) {
        errors.push('Longitude must be a number (including decimals) between -180 and 180 (e.g., 151.2093).');
      }

      return errors;
    },

    addBirthday(birthday, forceUpdate = false) {
      // Check for duplicate name first
      const existingBirthday = this.birthdays.find(b => b.name === birthday.name);
      
      if (existingBirthday && !forceUpdate) {
        // Return a special object indicating duplicate found
        return {
          duplicate: true,
          existingBirthday: existingBirthday,
          newBirthday: birthday
        };
      }

      // If forceUpdate is true, remove the existing birthday
      if (existingBirthday && forceUpdate) {
        this.birthdays = this.birthdays.filter(b => b.id !== existingBirthday.id);
        birthday.id = existingBirthday.id; // Keep the same ID
      } else {
        // Ensure unique ID for new birthday
        let newId = birthday.id;
        while (this.birthdays.some(b => b.id === newId)) {
          newId = Date.now() + Math.floor(Math.random() * 1000);
        }
        birthday.id = newId;
      }

      // Validate the birthday (excluding duplicate name check since we handle it above)
      const errors = this.validateBirthdayExcludingName(birthday);
      if (errors.length > 0) {
        throw new Error(errors.join(' '));
      }

      this.birthdays.push(birthday);
      this.persistState();
      
      return { success: true };
    },

    // Separate validation method that excludes name duplication check
    validateBirthdayExcludingName(birthday) {
      const errors = [];

      // Validate name
      if (!birthday.name || typeof birthday.name !== 'string' || birthday.name.trim() === '') {
        errors.push('Name is required and must be a non-empty string.');
      }

      // Validate birthday date
      if (!birthday.birthday || !DateTime.fromISO(birthday.birthday).isValid) {
        errors.push('Birthday must be a valid date in ISO format (e.g., "1970-01-01T15:50:00").');
      }

      // Validate gender
      if (!['MALE', 'FEMALE'].includes(birthday.gender)) {
        errors.push('Gender must be either "MALE" or "FEMALE".');
      }

      // Validate coordinates (latitude and longitude can be decimal numbers)
      if (typeof birthday.coords.latitude !== 'number' || isNaN(birthday.coords.latitude) || birthday.coords.latitude < -90 || birthday.coords.latitude > 90) {
        errors.push('Latitude must be a number (including decimals) between -90 and 90 (e.g., -26.174204189162413).');
      }
      if (typeof birthday.coords.longitude !== 'number' || isNaN(birthday.coords.longitude) || birthday.coords.longitude < -180 || birthday.coords.longitude > 180) {
        errors.push('Longitude must be a number (including decimals) between -180 and 180 (e.g., 151.2093).');
      }

      return errors;
    },

    updateBirthday(birthday) {
      // Validate the birthday
      const errors = this.validateBirthday(birthday);
      if (errors.length > 0) {
        throw new Error(errors.join(' '));
      }

      const index = this.birthdays.findIndex((b) => b.id === birthday.id);
      if (index !== -1) {
        this.birthdays.splice(index, 1, birthday);
        this.persistState();
      } else {
        throw new Error('Birthday not found.');
      }
    },

    removeBirthday(id) {
      this.birthdays = this.birthdays.filter((b) => b.id !== id);
      this.persistState();
    },

    clearBirthdays() {
      this.birthdays = [];
      this.persistState();
    },

    exportBirthdays() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.birthdays));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', 'birthdays.json');
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },

    importBirthdays(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedBirthdays = JSON.parse(e.target.result);
          const validatedBirthdays = importedBirthdays.map(b => {
            const birthday = {
              id: b.id || Date.now(),
              name: b.name || 'Unnamed',
              birthday: b.birthday || '',
              gender: b.gender || 'MALE',
              coords: {
                latitude: typeof b.coords?.latitude === 'string' ? parseFloat(b.coords.latitude) : b.coords?.latitude || 0,
                longitude: typeof b.coords?.longitude === 'string' ? parseFloat(b.coords.longitude) : b.coords?.longitude || 0,
              },
              place: b.place || '', // Add place field
            };

            // Additional validation for imported data
            if (!DateTime.fromISO(birthday.birthday).isValid) {
              birthday.birthday = DateTime.fromObject({ year: 1970, month: 1, day: 1 }).toISO();
            }
            if (typeof birthday.coords.latitude !== 'number' || isNaN(birthday.coords.latitude) || birthday.coords.latitude < -90 || birthday.coords.latitude > 90) {
              birthday.coords.latitude = 0;
            }
            if (typeof birthday.coords.longitude !== 'number' || isNaN(birthday.coords.longitude) || birthday.coords.longitude < -180 || birthday.coords.longitude > 180) {
              birthday.coords.longitude = 0;
            }

            return birthday;
          });

          // Validate each imported birthday
          for (const birthday of validatedBirthdays) {
            const errors = this.validateBirthday(birthday);
            if (errors.length > 0) {
              throw new Error(`Invalid birthday data: ${errors.join(' ')}`);
            }
          }

          this.birthdays = validatedBirthdays;
          this.persistState();
        } catch (error) {
          console.error('Error importing birthdays:', error);
          alert(`Failed to import birthdays: ${error.message}`);
        }
      };
      reader.readAsText(file);
    },
  },
});