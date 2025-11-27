import { ref, computed, watch } from 'vue';
import * as Tone from 'tone';
import { useHexagramStore } from '../stores/oracle';

// Solfeggio frequencies for lines 1 (bottom) to 6 (top)
const SOLFEGGIO_FREQUENCIES = [
  396, // Line 1 (Bottom)
  417, // Line 2
  528, // Line 3
  639, // Line 4
  285, // Line 5
  174  // Line 6 (Top)
];

export function useSolfeggioPlayer() {
  const store = useHexagramStore();
  
  // State
  const isPlaying = ref(false);
  const currentReading = ref(null);
  const currentLineIndex = ref(-1); // 0-5, -1 when not playing line
  const playbackSpeed = ref(1.0); // Multiplier: 0.5x to 2x
  const sortNewestFirst = ref(true);
  const progressMessage = ref('');
  const activeHexagram = ref(''); // The binary string of the hexagram currently being played
  
  // Internal state
  let synth = null;
  let reverb = null;
  let stopSignal = false;

  // Initialize Audio Context and Synth
  const initAudio = async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
    if (!synth) {
      // Create a reverb for that "healing" feel
      reverb = new Tone.Reverb({
        decay: 2.5,
        preDelay: 0.1,
        wet: 0.3
      }).toDestination();

      // Using a Synth with Sine wave
      synth = new Tone.Synth({
        oscillator: {
          type: "sine"
        },
        envelope: {
          attack: 0.1,
          decay: 0.2,
          sustain: 0.8,
          release: 1.5 // Long release for ambient feel
        }
      }).connect(reverb);
    }
  };

  // Helper: Sleep function that respects speed
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms / playbackSpeed.value));

  // Play a single tone
  const playTone = async (lineIndex, isYang, isChanging) => {
    if (stopSignal) return;

    currentLineIndex.value = lineIndex;
    
    // Determine Frequency
    let frequency = SOLFEGGIO_FREQUENCIES[lineIndex];
    
    // Rules:
    // 1 = Yang: Loud (-6dB), Long (2s), Octave x2
    // 0 = Yin: Soft (-18dB), Short (1s), No octave shift
    
    const volume = isYang ? -6 : -18;
    const duration = isYang ? 2 : 1; // Seconds
    const octaveMultiplier = isYang ? 2 : 1;
    
    const finalFrequency = frequency * octaveMultiplier;
    
    // Apply volume
    synth.volume.value = volume;

    // Portamento for changing lines
    // We simulate portamento by setting it before triggering attack
    if (isChanging) {
      synth.portamento = 0.3; 
    } else {
      synth.portamento = 0;
    }

    // Trigger the note
    // duration is scaled by playbackSpeed for the Tone.js event? 
    // Tone.js time is relative to Transport or seconds. 
    // If we want the sound to last 'duration' seconds *physically*, we just pass 'duration'.
    // But if 'speed' is 2x, everything should be faster, so duration should be shorter.
    const adjustedDuration = duration / playbackSpeed.value;
    
    synth.triggerAttackRelease(finalFrequency, adjustedDuration);

    // Wait for the duration of the note before resolving
    await wait(adjustedDuration * 1000);
  };

  // Play a full hexagram
  const playHexagram = async (hexString, changingLines = []) => {
    // hexString is 6 chars, Left=Bottom=Index 0
    // We play sequentially from bottom to top (index 0 to 5)
    
    for (let i = 0; i < 6; i++) {
      if (stopSignal) break;
      
      const char = hexString[i];
      const isYang = char === '1';
      
      // changingLines are 1-based indices (1..6). Convert to 0-based for comparison.
      // Check if this line index (i) is in the changingLines array
      // Note: changingLines array might be strings or numbers, handle both
      const isChanging = changingLines.some(lineNum => Number(lineNum) === (i + 1));
      
      await playTone(i, isYang, isChanging);
    }
    currentLineIndex.value = -1;
  };

  const playAll = async () => {
    if (isPlaying.value) return; // Already playing
    
    await initAudio();
    
    isPlaying.value = true;
    stopSignal = false;
    
    // Get readings
    let readings = [...store.consultationHistory];
    
    // Sort
    if (sortNewestFirst.value) {
      readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else {
      readings.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
    
    const total = readings.length;
    
    try {
      for (let i = 0; i < total; i++) {
        if (stopSignal) break;
        
        const reading = readings[i];
        currentReading.value = reading;
        
        // Update progress text
        const hex1 = reading.primaryHexagram;
        const hex2 = reading.transformedHexagram;
        const transitionText = hex2 ? ` → ${hex2}` : '';
        progressMessage.value = `Playing reading ${i + 1} of ${total} – Hexagram ${hex1}${transitionText}`;
        
        // Play Primary
        activeHexagram.value = reading.primaryHexagram;
        await playHexagram(reading.primaryHexagram, reading.changingLines);
        
        if (stopSignal) break;

        // If transformed exists, wait 1s then play it
        if (reading.transformedHexagram && reading.transformedHexagram !== reading.primaryHexagram) {
          await wait(1000);
          if (stopSignal) break;
          // Play transformed.
          // Note: Transformed hexagrams represent the result, so lines are stable (no changing logic applied usually).
          // We pass empty array for changing lines to avoid portamento on the result.
          activeHexagram.value = reading.transformedHexagram;
          await playHexagram(reading.transformedHexagram, []);
        }
        
        // Small pause between readings? Not specified, but good practice.
        await wait(500);
      }
      
      if (!stopSignal) {
        progressMessage.value = "Playback complete";
      }
    } catch (e) {
      console.error("Playback error:", e);
      progressMessage.value = "Error during playback";
    } finally {
      isPlaying.value = false;
      currentReading.value = null;
      activeHexagram.value = '';
      currentLineIndex.value = -1;
      stopSignal = false;
    }
  };

  const stop = () => {
    stopSignal = true;
    if (synth) {
      synth.releaseAll();
    }
    isPlaying.value = false;
    progressMessage.value = "Stopped";
  };

  return {
    isPlaying,
    currentReading,
    currentLineIndex,
    playbackSpeed,
    sortNewestFirst,
    progressMessage,
    activeHexagram,
    playAll,
    stop
  };
}