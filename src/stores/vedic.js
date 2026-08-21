import { defineStore } from 'pinia';

export const useVedicStore = defineStore('vedic', {
  state: () => ({
    birthData: {
      name: '',
      date: new Date(),
      time: '12:00',
      latitude: 0,
      longitude: 0,
      place: '',
      gender: 'MALE',
      timezoneOffset: -new Date().getTimezoneOffset(),
    },
    chart: null,
    chartFormat: 'north',
    loading: false,
    error: null,
  }),
  getters: {
    hasChart: (state) => !!state.chart,
  },
  actions: {
    updateBirthData(partial) {
      this.birthData = { ...this.birthData, ...partial };
    },
    setChart(chart) {
      this.chart = chart;
    },
    setChartFormat(format) {
      this.chartFormat = format === 'south' ? 'south' : 'north';
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setError(error) {
      this.error = error;
    },
    clearChart() {
      this.chart = null;
      this.error = null;
    },
  },
});
