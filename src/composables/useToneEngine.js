import { onUnmounted, ref, watch } from 'vue';
import * as Tone from 'tone';

const VOLUME_KEY = 'ichingMusicVolume';

function readStoredVolume() {
  const raw = Number(localStorage.getItem(VOLUME_KEY));
  if (!Number.isFinite(raw)) return 0.35;
  return Math.min(1, Math.max(0, raw));
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));

export function useToneEngine() {
  const volume = ref(readStoredVolume());
  let synth = null;
  let reverb = null;
  let analyser = null;
  let master = null;
  let ready = false;

  const applyVolume = () => {
    if (!master) return;
    const linear = Math.max(0.0001, Number(volume.value) || 0);
    master.gain.value = linear;
  };

  watch(volume, (value) => {
    localStorage.setItem(VOLUME_KEY, String(value));
    applyVolume();
  });

  const ensure = async () => {
    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }
    if (ready && synth) return;

    analyser = new Tone.Waveform(1024);
    master = new Tone.Gain(Math.max(0.0001, volume.value)).toDestination();
    reverb = new Tone.Reverb({
      decay: 2.2,
      preDelay: 0.05,
      wet: 0.18,
    }).connect(master);
    await reverb.generate();
    reverb.connect(analyser);

    synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.08,
        decay: 0.2,
        sustain: 0.55,
        release: 0.9,
      },
    }).connect(reverb);

    applyVolume();
    ready = true;
  };

  const silence = () => {
    if (!synth) return;
    try {
      synth.triggerRelease();
    } catch (_) {
      /* already silent */
    }
  };

  const playLine = async (line, speed = 1) => {
    await ensure();
    const pace = Math.max(0.25, Number(speed) || 1);
    const duration = (line.duration || (line.isYang ? 2 : 1)) / pace;
    let freq = Number(line.frequency) || 396;
    if (line.octaveShift > 0) freq *= 2 ** line.octaveShift;
    synth.volume.value = typeof line.volume === 'number' ? line.volume : (line.isYang ? -12 : -24);
    synth.portamento = line.portamento || 0;
    synth.triggerAttackRelease(freq, duration);
    await wait(duration * 1000);
    return freq;
  };

  const getWaveform = () => (analyser ? analyser.getValue() : null);

  const dispose = () => {
    silence();
    if (synth) synth.dispose();
    if (reverb) reverb.dispose();
    if (analyser) analyser.dispose();
    if (master) master.dispose();
    synth = null;
    reverb = null;
    analyser = null;
    master = null;
    ready = false;
  };

  onUnmounted(dispose);

  return {
    volume,
    ensure,
    playLine,
    silence,
    getWaveform,
    dispose,
  };
}
