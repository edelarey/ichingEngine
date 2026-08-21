import { defineStore } from 'pinia';

function slimTimeline(timeline) {
  return (timeline || []).map((year) => ({
    age: year.age,
    year: year.year,
    source: year.source,
    hexagramBinary: year.hexagramBinary,
    audio: year.audio,
  }));
}

function slimForm(form) {
  let date = '';
  if (form?.date instanceof Date && !Number.isNaN(form.date.getTime())) {
    const y = form.date.getFullYear();
    const m = String(form.date.getMonth() + 1).padStart(2, '0');
    const d = String(form.date.getDate()).padStart(2, '0');
    date = `${y}-${m}-${d}`;
  } else {
    date = String(form?.date || '').slice(0, 10);
  }
  return {
    name: form?.name || '',
    date,
    time: form?.time || '12:00',
    gender: form?.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
    latitude: Number(form?.latitude) || 0,
    longitude: Number(form?.longitude) || 0,
    place: form?.place || '',
    timezoneOffset: Number(form?.timezoneOffset) || 0,
    timezoneName: form?.timezoneName || '',
  };
}

export const useSymphonyStore = defineStore('lifeSymphony', {
  state: () => ({
    snapshot: null,
  }),
  persist: {
    key: 'lifeSymphony',
  },
  actions: {
    save({ form, metadata, timeline, yearIndex }) {
      this.snapshot = {
        form: slimForm(form),
        metadata: metadata || null,
        timeline: slimTimeline(timeline),
        yearIndex: Number(yearIndex) || 0,
        savedAt: new Date().toISOString(),
      };
    },
    setYearIndex(index) {
      if (!this.snapshot) return;
      this.snapshot.yearIndex = Number(index) || 0;
    },
    clear() {
      this.snapshot = null;
    },
  },
});
