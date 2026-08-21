import { computed, ref } from 'vue';
import { useToneEngine } from '@/composables/useToneEngine';

export function useLifeAudio() {
  const engine = useToneEngine();
  const isPlaying = ref(false);
  const currentYearIndex = ref(0);
  const currentLineIndex = ref(-1);
  const currentFrequency = ref(0);
  const playbackSpeed = ref(1);
  const totalYears = ref(0);
  const isPaused = ref(false);
  const canResume = computed(() => isPaused.value);

  let timelineData = [];
  let playGen = 0;
  let pauseRequested = false;
  let resumeLine = 0;

  const loadTimeline = (timeline, startIndex = 0) => {
    timelineData = Array.isArray(timeline) ? timeline : [];
    totalYears.value = timelineData.length;
    const idx = Math.max(0, Math.min(Number(startIndex) || 0, Math.max(0, timelineData.length - 1)));
    currentYearIndex.value = idx;
    currentLineIndex.value = -1;
    currentFrequency.value = 0;
    resumeLine = 0;
  };

  const playFrom = async (yearIndex, lineIndex) => {
    const gen = ++playGen;
    pauseRequested = false;
    isPaused.value = false;
    await engine.ensure();
    isPlaying.value = true;
    let startLine = Math.max(0, lineIndex);

    for (let y = yearIndex; y < timelineData.length; y++) {
      if (gen !== playGen) return;
      currentYearIndex.value = y;
      const lines = timelineData[y]?.audio || [];
      for (let i = startLine; i < lines.length; i++) {
        if (gen !== playGen) return;
        if (pauseRequested) {
          resumeLine = i;
          currentLineIndex.value = i;
          isPlaying.value = false;
          isPaused.value = true;
          engine.silence();
          return;
        }
        currentLineIndex.value = i;
        const freq = await engine.playLine(lines[i], playbackSpeed.value);
        if (gen !== playGen) return;
        currentFrequency.value = freq;
        if (pauseRequested) {
          resumeLine = i;
          isPlaying.value = false;
          isPaused.value = true;
          engine.silence();
          return;
        }
      }
      startLine = 0;
      resumeLine = 0;
      currentLineIndex.value = -1;
      currentFrequency.value = 0;
    }

    if (gen === playGen) {
      isPlaying.value = false;
      currentLineIndex.value = -1;
      currentFrequency.value = 0;
      resumeLine = 0;
    }
  };

  const play = async () => {
    if (isPlaying.value || !timelineData.length) return;
    const year = currentYearIndex.value || 0;
    const line = resumeLine;
    await playFrom(year, line);
  };

  const pause = () => {
    if (!isPlaying.value) return;
    pauseRequested = true;
    engine.silence();
  };

  const stop = () => {
    playGen += 1;
    pauseRequested = false;
    isPaused.value = false;
    resumeLine = 0;
    engine.silence();
    isPlaying.value = false;
    currentYearIndex.value = 0;
    currentLineIndex.value = -1;
    currentFrequency.value = 0;
  };

  const setYear = (index, { restart = true } = {}) => {
    const next = Math.max(0, Math.min(Number(index) || 0, Math.max(0, timelineData.length - 1)));
    currentYearIndex.value = next;
    resumeLine = 0;
    currentLineIndex.value = -1;
    currentFrequency.value = 0;
    if (isPlaying.value && restart) {
      playGen += 1;
      engine.silence();
      isPlaying.value = false;
      return playFrom(next, 0);
    }
    return Promise.resolve();
  };

  return {
    isPlaying,
    currentYearIndex,
    currentLineIndex,
    currentFrequency,
    playbackSpeed,
    volume: engine.volume,
    totalYears,
    canResume,
    loadTimeline,
    play,
    pause,
    stop,
    setYear,
    getWaveform: engine.getWaveform,
  };
}
