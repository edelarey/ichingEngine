import * as Tone from 'tone';
import { ref, watch, onUnmounted } from 'vue';

export function useLifeAudio() {
  const isPlaying = ref(false);
  const currentYearIndex = ref(0);
  const currentLineIndex = ref(-1); // -1 when not playing a specific line
  const currentFrequency = ref(0);
  const playbackSpeed = ref(1.0); // 1.0 = Normal speed
  const totalYears = ref(0);
  
  // Synths
  let synths = [];
  let reverb = null;
  let analyser = null;
  let sequencePart = null;
  let timelineData = [];

  // Initialize Audio Context and Synths
  const initAudio = async () => {
    await Tone.start();
    
    if (synths.length > 0) return; // Already initialized

    // Create Analyser for waveform visualization
    analyser = new Tone.Waveform(1024);

    // Create a reverb for that "healing" feel
    reverb = new Tone.Reverb({
      decay: 4,
      wet: 0.5
    }).toDestination();

    // Create 6 synths (one for each line to allow overlap if needed, though we play sequentially)
    // Using FMSynth for a bell-like/healing tone quality
    for (let i = 0; i < 6; i++) {
      const synth = new Tone.FMSynth({
        harmonicity: 1,
        modulationIndex: 3.5,
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.1,
          decay: 0.5,
          sustain: 0.1,
          release: 1
        },
        modulation: { type: "sine" },
        modulationEnvelope: {
          attack: 0.1,
          decay: 0.5,
          sustain: 0.1,
          release: 1
        }
      }).connect(reverb);
      
      // Also connect to analyser
      synth.connect(analyser);

      synths.push(synth);
    }
  };

  // Play a single year's hexagram
  const playYearHexagram = (yearData, time) => {
    if (!yearData || !yearData.audio) return;

    const lines = yearData.audio;
    const baseTime = time;
    const noteSpacing = 0.5 / playbackSpeed.value; // Spacing between lines

    lines.forEach((lineData, index) => {
      const synth = synths[index];
      
      // Calculate frequency with octave shift if Yang
      let freq = lineData.frequency;
      if (lineData.octaveShift > 0) {
        freq *= Math.pow(2, lineData.octaveShift);
      }

      // Duration adjusted by speed
      const duration = lineData.duration / playbackSpeed.value;
      
      // Trigger
      synth.volume.value = lineData.volume;
      synth.triggerAttackRelease(freq, duration, baseTime + (index * noteSpacing));

      // Schedule visual update for this line
      Tone.Draw.schedule(() => {
        currentLineIndex.value = index;
        currentFrequency.value = freq;
      }, baseTime + (index * noteSpacing));

      // Reset line index after the last note finishes
      if (index === lines.length - 1) {
        Tone.Draw.schedule(() => {
          currentLineIndex.value = -1;
          currentFrequency.value = 0;
        }, baseTime + (index * noteSpacing) + duration);
      }
    });
  };

  // Setup the main sequence
  const loadTimeline = (timeline) => {
    timelineData = timeline;
    totalYears.value = timeline.length;
    currentYearIndex.value = 0;
  };

  const play = async () => {
    if (isPlaying.value) return;
    
    await initAudio();
    
    Tone.Transport.stop();
    Tone.Transport.cancel();

    // Create a repeating event that triggers every "measure"
    // We'll treat each year as a measure
    const yearDuration = 4 / playbackSpeed.value; // Seconds per year

    sequencePart = new Tone.Loop((time) => {
      if (currentYearIndex.value >= timelineData.length) {
        stop();
        return;
      }

      const yearData = timelineData[currentYearIndex.value];
      playYearHexagram(yearData, time);
      
      // Schedule the UI update slightly after audio trigger to sync visually
      Tone.Draw.schedule(() => {
        currentYearIndex.value++;
      }, time);

    }, yearDuration).start(0);

    Tone.Transport.start();
    isPlaying.value = true;
  };

  const pause = () => {
    Tone.Transport.pause();
    isPlaying.value = false;
  };

  const stop = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    currentYearIndex.value = 0;
    isPlaying.value = false;
  };

  const setYear = (index) => {
    currentYearIndex.value = index;
    // If playing, we need to restart the transport or logic to jump,
    // but for simplicity in this version, we just update the index
    // which the Loop uses. However, Tone.Loop doesn't take an index,
    // we are managing the index manually in the callback.
    // So setting currentYearIndex is enough, but we might want to stop/start to sync immediately if playing.
  };

  const getWaveform = () => {
    if (analyser) {
      return analyser.getValue();
    }
    return null;
  };

  // Cleanup
  onUnmounted(() => {
    stop();
    synths.forEach(s => s.dispose());
    if (reverb) reverb.dispose();
    if (analyser) analyser.dispose();
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
    getWaveform
  };
}