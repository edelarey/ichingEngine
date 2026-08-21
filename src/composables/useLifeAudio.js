import * as Tone from 'tone';
import { ref, onUnmounted } from 'vue';

function releaseSynths(synths) {
  synths.forEach((synth) => {
    try {
      synth.triggerRelease();
    } catch (_) {
      /* already silent */
    }
  });
}

export function useLifeAudio() {
  const isPlaying = ref(false);
  const currentYearIndex = ref(0);
  const currentLineIndex = ref(-1);
  const currentFrequency = ref(0);
  const playbackSpeed = ref(1.0);
  const totalYears = ref(0);

  let synths = [];
  let reverb = null;
  let analyser = null;
  let sequencePart = null;
  let timelineData = [];
  let playIndex = 0;

  const transport = () => Tone.getTransport();
  const draw = () => Tone.getDraw();

  const initAudio = async () => {
    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }
    if (synths.length > 0) return;

    analyser = new Tone.Waveform(1024);
    reverb = new Tone.Reverb({
      decay: 3,
      wet: 0.35,
    }).toDestination();
    await reverb.generate();

    for (let i = 0; i < 6; i++) {
      const synth = new Tone.FMSynth({
        harmonicity: 1,
        modulationIndex: 3.5,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.1,
          decay: 0.5,
          sustain: 0.1,
          release: 1,
        },
        modulation: { type: 'sine' },
        modulationEnvelope: {
          attack: 0.1,
          decay: 0.5,
          sustain: 0.1,
          release: 1,
        },
      }).connect(reverb);
      synth.connect(analyser);
      synths.push(synth);
    }
  };

  const yearDurationSeconds = () => {
    const speed = Math.max(0.25, Number(playbackSpeed.value) || 1);
    const spacing = 0.55 / speed;
    const longestNote = 2 / speed;
    return 6 * spacing + longestNote + 0.2;
  };

  const playYearHexagram = (yearData, time) => {
    if (!yearData || !yearData.audio || !synths.length) return;
    const lines = yearData.audio;
    const speed = Math.max(0.25, Number(playbackSpeed.value) || 1);
    const noteSpacing = 0.55 / speed;

    lines.forEach((lineData, index) => {
      const synth = synths[index];
      if (!synth) return;
      let freq = lineData.frequency;
      if (lineData.octaveShift > 0) {
        freq *= 2 ** lineData.octaveShift;
      }
      const duration = lineData.duration / speed;
      synth.volume.value = lineData.volume;
      synth.triggerAttackRelease(freq, duration, time + index * noteSpacing);

      draw().schedule(() => {
        currentLineIndex.value = index;
        currentFrequency.value = freq;
      }, time + index * noteSpacing);
    });
  };

  const loadTimeline = (timeline) => {
    timelineData = Array.isArray(timeline) ? timeline : [];
    totalYears.value = timelineData.length;
    currentYearIndex.value = 0;
    playIndex = 0;
  };

  const clearLoop = () => {
    if (sequencePart) {
      sequencePart.dispose();
      sequencePart = null;
    }
    transport().stop();
    transport().cancel();
    releaseSynths(synths);
  };

  const play = async () => {
    if (isPlaying.value) return;
    if (!timelineData.length) return;

    await initAudio();
    clearLoop();

    playIndex = currentYearIndex.value || 0;
    if (playIndex >= timelineData.length) playIndex = 0;

    const yearDuration = yearDurationSeconds();
    sequencePart = new Tone.Loop((time) => {
      if (playIndex >= timelineData.length) {
        draw().schedule(() => {
          isPlaying.value = false;
          currentLineIndex.value = -1;
          currentFrequency.value = 0;
          clearLoop();
        }, time);
        return;
      }
      const idx = playIndex;
      playIndex += 1;
      const yearData = timelineData[idx];
      draw().schedule(() => {
        currentYearIndex.value = idx;
      }, time);
      playYearHexagram(yearData, time);
    }, yearDuration).start(0);

    transport().start();
    isPlaying.value = true;
  };

  const pause = () => {
    transport().pause();
    isPlaying.value = false;
    releaseSynths(synths);
  };

  const stop = () => {
    clearLoop();
    currentYearIndex.value = 0;
    playIndex = 0;
    currentLineIndex.value = -1;
    currentFrequency.value = 0;
    isPlaying.value = false;
  };

  const setYear = (index) => {
    const next = Math.max(0, Math.min(Number(index) || 0, Math.max(0, timelineData.length - 1)));
    currentYearIndex.value = next;
    playIndex = next;
  };

  const getWaveform = () => (analyser ? analyser.getValue() : null);

  onUnmounted(() => {
    stop();
    synths.forEach((s) => s.dispose());
    synths = [];
    if (reverb) reverb.dispose();
    if (analyser) analyser.dispose();
    reverb = null;
    analyser = null;
  });

  return {
    isPlaying,
    currentYearIndex,
    currentLineIndex,
    currentFrequency,
    playbackSpeed,
    totalYears,
    loadTimeline,
    play,
    pause,
    stop,
    setYear,
    getWaveform,
  };
}