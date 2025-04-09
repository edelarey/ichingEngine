import { defineStore } from 'pinia';

export const useHexagramStore = defineStore('oracle', {
  state: () => ({
    consultationHistory: [],
    selectedHexagram: null,
    lastConsultationId: null,
  }),
  
  actions: {
    setHexagram(hexagram) {
      this.selectedHexagram = hexagram;
    },
    
    getAllConsultationsSequence() {
      if (this.consultationHistory.length === 0) {
        console.warn('The oracle’s dance card is empty!');
        return [];
      }
      // Map all consultations into a sequence of primaryHexagrams
      return this.consultationHistory.map(consult => consult.primaryHexagram);
    },

    addConsultation(question, primaryHexagram, transformedHexagram, changingLines, method) {
      const id = Date.now();
      this.consultationHistory.push({
        id,
        timestamp: new Date().toISOString(),
        question: question.trim(),
        primaryHexagram,
        transformedHexagram,
        changingLines: changingLines || [],
        method,
      });
      this.lastConsultationId = id;
    },
    
    removeConsultation(id) {
      const index = this.consultationHistory.findIndex(c => c.id === id);
      if (index !== -1) {
        this.consultationHistory.splice(index, 1);
      }
    },
    
    clearHistory() {
      this.consultationHistory = [];
      this.lastConsultationId = null;
    },
    
    exportHistory() {
      try {
        const data = JSON.stringify(this.consultationHistory, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consultation_history_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Export failed:', error);
        throw error;
      }
    },
    
    async importHistory(file) {
      try {
        const text = await file.text();
        const importedData = JSON.parse(text);
        if (!Array.isArray(importedData)) {
          throw new Error('Invalid history format');
        }
        this.consultationHistory = importedData.map(item => ({
          ...item,
          timestamp: item.timestamp || new Date().toISOString(),
          changingLines: item.changingLines || [],
        }));
      } catch (error) {
        console.error('Import failed:', error);
        throw error;
      }
    },
  },
  
  getters: {
    getConsultationHistory: (state) => state.consultationHistory,
    getLastConsultation: (state) => {
      return state.consultationHistory.find(c => c.id === state.lastConsultationId);
    },
    getHistoryByDate: (state) => {
      return (date) => state.consultationHistory.filter(c => 
        new Date(c.timestamp).toDateString() === new Date(date).toDateString()
      );
    },
  },
  
  // Persistence configuration
  persist: {
    storage: localStorage,
  },
});