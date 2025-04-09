import { defineStore } from 'pinia';

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

    addBirthday(birthday) {
      this.birthdays.push(birthday);
      this.persistState();
    },

    updateBirthday(birthday) {
      const index = this.birthdays.findIndex((b) => b.id === birthday.id);
      if (index !== -1) {
        this.birthdays.splice(index, 1, birthday);
        this.persistState();
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
          const validatedBirthdays = importedBirthdays.map(b => ({
            id: b.id || Date.now(),
            name: b.name || 'Unnamed',
            birthday: b.birthday || '',
            gender: b.gender || 'MALE',
            coords: {
              latitude: b.coords?.latitude || 0,
              longitude: b.coords?.longitude || 0,
            },
          }));
          this.birthdays = validatedBirthdays;
          this.persistState();
        } catch (error) {
          console.error('Error importing birthdays:', error);
          alert('Invalid file format. Please upload a valid JSON file.');
        }
      };
      reader.readAsText(file);
    },
  },
});