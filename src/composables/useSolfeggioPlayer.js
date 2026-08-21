import { computed, ref } from 'vue';
import { useHexagramStore } from '@/stores/oracle';
import { asBinary, mapBinaryToLines } from '@/const/solfeggio';
import { useToneEngine } from '@/composables/useToneEngine';

const SAMPLE_HEXAGRAM = '111111';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));

export function useSolfeggioPlayer() {
  const store = useHexagramStore();
  const engine = useToneEngine();

  const isPlaying = ref(false);
  const currentReading = ref(null);
  const currentLineIndex = ref(-1);
  const playbackSpeed = ref(1);
  const sortNewestFirst = ref(true);
  const progressMessage = ref('');
  const activeHexagram = ref('');
  const currentFrequency = ref(0);
  const readingCount = computed(() => store.consultationHistory.length);

  let playGen = 0;
  let pauseRequested = false;
  let resume = null;

  const playHexagram = async (hexString, changingLines, startLine, gen) => {
    const lines = mapBinaryToLines(hexString);
    for (let i = startLine; i < lines.length; i++) {
      if (gen !== playGen) return 'aborted';
      if (pauseRequested) {
        resume = { ...(resume || {}), line: i };
        return 'paused';
      }
      currentLineIndex.value = i;
      const line = {
        ...lines[i],
        portamento: (changingLines || []).some((n) => Number(n) === i + 1) ? 0.3 : 0,
      };
      const freq = await engine.playLine(line, playbackSpeed.value);
      if (gen !== playGen) return 'aborted';
      currentFrequency.value = freq;
      if (pauseRequested) {
        resume = { ...(resume || {}), line: i };
        return 'paused';
      }
    }
    currentLineIndex.value = -1;
    currentFrequency.value = 0;
    return 'done';
  };

  const playReadings = async (readings, label, start = {}) => {
    if (isPlaying.value) return;
    const gen = ++playGen;
    pauseRequested = false;
    await engine.ensure();
    isPlaying.value = true;
    const total = readings.length;
    let readingIndex = start.readingIndex || 0;
    let phase = start.phase || 'primary';
    let line = start.line || 0;

    try {
      for (; readingIndex < total; readingIndex++) {
        if (gen !== playGen) return;
        const reading = readings[readingIndex];
        currentReading.value = reading;
        const primary = asBinary(reading.primaryHexagram);
        const transformed = asBinary(reading.transformedHexagram);
        if (!primary) {
          line = 0;
          phase = 'primary';
          continue;
        }
        const transitionText = transformed && transformed !== primary ? ` → ${transformed}` : '';
        progressMessage.value = `${label} ${readingIndex + 1} of ${total} – ${primary}${transitionText}`;

        if (phase === 'primary') {
          activeHexagram.value = primary;
          const result = await playHexagram(primary, reading.changingLines || [], line, gen);
          if (result !== 'done') {
            resume = { readings, label, readingIndex, phase: 'primary', line: resume?.line || line };
            isPlaying.value = false;
            if (result === 'paused') progressMessage.value = 'Paused';
            return;
          }
          line = 0;
          phase = 'transformed';
        }

        if (transformed && transformed !== primary) {
          await wait(400 / Math.max(0.25, playbackSpeed.value));
          if (gen !== playGen) return;
          if (pauseRequested) {
            resume = { readings, label, readingIndex, phase: 'transformed', line: 0 };
            isPlaying.value = false;
            progressMessage.value = 'Paused';
            return;
          }
          activeHexagram.value = transformed;
          const result = await playHexagram(transformed, [], line, gen);
          if (result !== 'done') {
            resume = { readings, label, readingIndex, phase: 'transformed', line: resume?.line || line };
            isPlaying.value = false;
            if (result === 'paused') progressMessage.value = 'Paused';
            return;
          }
        }

        phase = 'primary';
        line = 0;
        await wait(250 / Math.max(0.25, playbackSpeed.value));
      }

      if (gen === playGen) {
        isPlaying.value = false;
        currentLineIndex.value = -1;
        currentFrequency.value = 0;
        resume = null;
        progressMessage.value = total ? 'Playback complete' : 'Nothing to play';
      }
    } catch (e) {
      console.error('Playback error:', e);
      isPlaying.value = false;
      progressMessage.value = 'Error during playback';
    }
  };

  const playAll = async () => {
    if (resume?.readings) {
      const saved = resume;
      resume = null;
      await playReadings(saved.readings, saved.label, saved);
      return;
    }
    const readings = [...store.consultationHistory];
    if (!readings.length) {
      progressMessage.value = 'No saved consultations yet. Cast a reading, or play the sample.';
      return;
    }
    readings.sort((a, b) => {
      const da = new Date(a.timestamp).getTime();
      const db = new Date(b.timestamp).getTime();
      return sortNewestFirst.value ? db - da : da - db;
    });
    await playReadings(readings, 'Playing reading');
  };

  const playSample = async () => {
    resume = null;
    await playReadings(
      [{
        id: 'sample',
        timestamp: new Date().toISOString(),
        question: 'Sample — Heaven over Heaven (Qián)',
        primaryHexagram: SAMPLE_HEXAGRAM,
        transformedHexagram: SAMPLE_HEXAGRAM,
        changingLines: [],
      }],
      'Playing sample'
    );
  };

  const pause = () => {
    if (!isPlaying.value) return;
    pauseRequested = true;
    engine.silence();
  };

  const stop = () => {
    playGen += 1;
    pauseRequested = false;
    resume = null;
    engine.silence();
    isPlaying.value = false;
    currentLineIndex.value = -1;
    currentFrequency.value = 0;
    progressMessage.value = 'Stopped';
  };

  return {
    isPlaying,
    currentReading,
    currentLineIndex,
    playbackSpeed,
    volume: engine.volume,
    sortNewestFirst,
    progressMessage,
    activeHexagram,
    currentFrequency,
    readingCount,
    canResume: computed(() => !!resume),
    getWaveform: engine.getWaveform,
    playAll,
    playSample,
    pause,
    stop,
  };
}
