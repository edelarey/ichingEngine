import { computed, onUnmounted, ref } from 'vue';
import * as Tone from 'tone';
import { useHexagramStore } from '../stores/oracle';

const SOLFEGGIO_FREQUENCIES = [396, 417, 528, 639, 285, 174];
const SAMPLE_HEXAGRAM = '111111';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));

function asBinary(value) {
  const text = String(value || '');
  return /^[01]{6}$/.test(text) ? text : '';
}

export function useSolfeggioPlayer() {
  const store = useHexagramStore();

  const isPlaying = ref(false);
  const currentReading = ref(null);
  const currentLineIndex = ref(-1);
  const playbackSpeed = ref(1.0);
  const sortNewestFirst = ref(true);
  const progressMessage = ref('');
  const activeHexagram = ref('');
  const currentFrequency = ref(0);

  let synth = null;
  let reverb = null;
  let waveform = null;
  let stopSignal = false;

  const readingCount = computed(() => store.consultationHistory.length);

  const initAudio = async () => {
    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }
    if (synth) return;

    reverb = new Tone.Reverb({
      decay: 2.5,
      preDelay: 0.1,
      wet: 0.3,
    }).toDestination();
    await reverb.generate();

    waveform = new Tone.Waveform(1024);
    synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.8,
        release: 1.5,
      },
    }).connect(reverb);
    synth.connect(waveform);
  };

  const silence = () => {
    if (!synth) return;
    try {
      synth.triggerRelease();
    } catch (_) {
      /* already silent */
    }
  };

  const playTone = async (lineIndex, isYang, isChanging) => {
    if (stopSignal || !synth) return;
    currentLineIndex.value = lineIndex;
    const frequency = SOLFEGGIO_FREQUENCIES[lineIndex];
    const duration = (isYang ? 2 : 1) / Math.max(0.25, playbackSpeed.value);
    const finalFrequency = frequency * (isYang ? 2 : 1);
    currentFrequency.value = finalFrequency;
    synth.volume.value = isYang ? -6 : -18;
    synth.portamento = isChanging ? 0.3 : 0;
    synth.triggerAttackRelease(finalFrequency, duration);
    await wait(duration * 1000);
    if (!stopSignal) currentFrequency.value = 0;
  };

  const playHexagram = async (hexString, changingLines = []) => {
    const binary = asBinary(hexString);
    if (!binary) return;
    for (let i = 0; i < 6; i++) {
      if (stopSignal) break;
      const isYang = binary[i] === '1';
      const isChanging = (changingLines || []).some((lineNum) => Number(lineNum) === i + 1);
      await playTone(i, isYang, isChanging);
    }
    currentLineIndex.value = -1;
  };

  const finishPlayback = (message) => {
    isPlaying.value = false;
    currentLineIndex.value = -1;
    currentFrequency.value = 0;
    stopSignal = false;
    silence();
    if (message) progressMessage.value = message;
  };

  const playReadings = async (readings, label) => {
    if (isPlaying.value) return;
    await initAudio();
    isPlaying.value = true;
    stopSignal = false;
    const total = readings.length;
    try {
      for (let i = 0; i < total; i++) {
        if (stopSignal) break;
        const reading = readings[i];
        currentReading.value = reading;
        const primary = asBinary(reading.primaryHexagram);
        const transformed = asBinary(reading.transformedHexagram);
        if (!primary) continue;
        const transitionText = transformed && transformed !== primary ? ` → ${transformed}` : '';
        progressMessage.value = `${label} ${i + 1} of ${total} – ${primary}${transitionText}`;
        activeHexagram.value = primary;
        await playHexagram(primary, reading.changingLines || []);
        if (stopSignal) break;
        if (transformed && transformed !== primary) {
          await wait(800 / Math.max(0.25, playbackSpeed.value));
          if (stopSignal) break;
          activeHexagram.value = transformed;
          await playHexagram(transformed, []);
        }
        await wait(400 / Math.max(0.25, playbackSpeed.value));
      }
      if (!stopSignal) finishPlayback(total ? 'Playback complete' : 'Nothing to play');
      else finishPlayback('Stopped');
    } catch (e) {
      console.error('Playback error:', e);
      finishPlayback('Error during playback');
    }
  };

  const playAll = async () => {
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

  const stop = () => {
    if (!isPlaying.value) {
      progressMessage.value = 'Stopped';
      return;
    }
    stopSignal = true;
    silence();
    progressMessage.value = 'Stopped';
  };

  const getWaveform = () => (waveform ? waveform.getValue() : null);

  onUnmounted(() => {
    stopSignal = true;
    silence();
    if (synth) synth.dispose();
    if (reverb) reverb.dispose();
    if (waveform) waveform.dispose();
    synth = null;
    reverb = null;
    waveform = null;
  });

  return {
    isPlaying,
    currentReading,
    currentLineIndex,
    playbackSpeed,
    sortNewestFirst,
    progressMessage,
    activeHexagram,
    currentFrequency,
    readingCount,
    getWaveform,
    playAll,
    playSample,
    stop,
  };
}