import { defineStore } from 'pinia';
import { DateTime } from 'luxon';

export const useAstrologyStore = defineStore('astrology', {
  state: () => ({
    birthData: {
      date: new Date(),
      time: '12:00',
      latitude: 0,
      longitude: 0,
      place: ''
    },
    planetPositions: null,
    chartData: null,
    loading: false,
    error: null
  }),

  getters: {
    hasChartData: (state) => !!state.chartData,
    formattedBirthDate: (state) => {
      if (!state.birthData.date) return '';
      return DateTime.fromJSDate(state.birthData.date).toFormat('yyyy-MM-dd');
    },
    isValidBirthData: (state) => {
      return state.birthData.date &&
             typeof state.birthData.latitude === 'number' &&
             typeof state.birthData.longitude === 'number' &&
             state.birthData.latitude >= -90 &&
             state.birthData.latitude <= 90 &&
             state.birthData.longitude >= -180 &&
             state.birthData.longitude <= 180;
    }
  },

  actions: {
    updateBirthData(newData) {
      this.birthData = { ...this.birthData, ...newData };
    },

    setBirthDate(date) {
      this.birthData.date = date;
    },

    setBirthTime(time) {
      this.birthData.time = time;
    },

    setCoordinates(latitude, longitude) {
      this.birthData.latitude = latitude;
      this.birthData.longitude = longitude;
    },

    setPlace(place) {
      this.birthData.place = place;
    },

    setPlanetPositions(positions) {
      this.planetPositions = positions;
    },

    setChartData(data) {
      this.chartData = data;
    },

    setLoading(loading) {
      this.loading = loading;
    },

    setError(error) {
      this.error = error;
    },

    clearChart() {
      this.planetPositions = null;
      this.chartData = null;
      this.error = null;
    },

    resetBirthData() {
      this.birthData = {
        date: new Date(),
        time: '12:00',
        latitude: 0,
        longitude: 0,
        place: ''
      };
      this.clearChart();
    },

    // Save chart data to localStorage
    saveChart() {
      if (this.chartData && this.planetPositions) {
        const chartToSave = {
          birthData: this.birthData,
          planetPositions: this.planetPositions,
          chartData: this.chartData,
          timestamp: Date.now()
        };
        
        const savedCharts = JSON.parse(localStorage.getItem('astrologyCharts') || '[]');
        savedCharts.push(chartToSave);
        
        // Keep only the last 10 charts
        if (savedCharts.length > 10) {
          savedCharts.splice(0, savedCharts.length - 10);
        }
        
        localStorage.setItem('astrologyCharts', JSON.stringify(savedCharts));
      }
    },

    // Load saved charts
    getSavedCharts() {
      return JSON.parse(localStorage.getItem('astrologyCharts') || '[]');
    },

    // Load a specific chart
    loadChart(chart) {
      this.birthData = { ...chart.birthData };
      this.planetPositions = chart.planetPositions;
      this.chartData = chart.chartData;
    },

    // Delete a saved chart
    deleteChart(timestamp) {
      const savedCharts = this.getSavedCharts();
      const filteredCharts = savedCharts.filter(chart => chart.timestamp !== timestamp);
      localStorage.setItem('astrologyCharts', JSON.stringify(filteredCharts));
    },

    // Export chart data
    exportChart() {
      if (!this.chartData) return null;
      
      return {
        type: 'astrology_chart',
        version: '1.0',
        data: {
          birthData: this.birthData,
          planetPositions: this.planetPositions,
          chartData: this.chartData,
          exportedAt: new Date().toISOString()
        }
      };
    },

    // Import chart data
    importChart(importData) {
      if (importData.type === 'astrology_chart' && importData.data) {
        this.birthData = importData.data.birthData;
        this.planetPositions = importData.data.planetPositions;
        this.chartData = importData.data.chartData;
        return true;
      }
      return false;
    }
  }
});