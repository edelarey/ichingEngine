import { mapBinaryToLines } from '@/const/solfeggio';

export const MUSIC_VOICES = [
  {
    id: 'rhythm',
    label: 'Line rhythm',
    blurb: 'Uakti: yang is a long note, yin is a short note. Pitches follow the Roche hexagram scale.',
  },
  {
    id: 'scale',
    label: 'Hexagram scale',
    blurb: 'Each of the six lines is a pitch on a 12-note chromatic (Roche / Celestial Harp). Even steps.',
  },
  {
    id: 'solfeggio',
    label: 'Solfeggio',
    blurb: 'The existing map: six Solfeggio frequencies. Yang is longer, louder, and an octave up.',
  },
  {
    id: 'fibonacci',
    label: 'Fibonacci',
    blurb: 'Roche pitches with durations 1, 1, 2, 3, 5, 8. A growth curve, not a historical I Ching method.',
  },
];

const ROCHE_YANG = ['C4', 'D4', 'E4', 'F#4', 'G#4', 'A#4'];
const ROCHE_YIN = ['C#4', 'D#4', 'F4', 'G4', 'A4', 'B4'];
const FIB_UNITS = [1, 1, 2, 3, 5, 8];
const NOTE_HZ = {
  C4: 261.63,
  'C#4': 277.18,
  D4: 293.66,
  'D#4': 311.13,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  G4: 392.0,
  'G#4': 415.3,
  A4: 440.0,
  'A#4': 466.16,
  B4: 493.88,
};

export function asHexBinary(value) {
  const text = String(value || '');
  return /^[01]{6}$/.test(text) ? text : '';
}

export function mapHexagramVoice(binary, voice = 'rhythm') {
  const text = asHexBinary(binary);
  if (!text) return [];
  if (voice === 'solfeggio') return mapBinaryToLines(text);

  return text.split('').map((char, index) => {
    const isYang = char === '1';
    const note = isYang ? ROCHE_YANG[index] : ROCHE_YIN[index];
    let duration = 0.7;
    if (voice === 'rhythm') duration = isYang ? 0.9 : 0.35;
    if (voice === 'fibonacci') duration = FIB_UNITS[index] * 0.22;
    return {
      line: index + 1,
      isYang,
      note,
      frequency: Math.round(NOTE_HZ[note] || 440),
      duration,
      volume: isYang ? -10 : -18,
      octaveShift: 0,
    };
  });
}
