import astrology from '../const/astrology';
import { DateTime } from 'luxon';

// Solfeggio Frequencies for lines 1-6 (Bottom to Top) as per requirements
const SOLFEGGIO_FREQUENCIES = [
  396, // Line 1 (Bottom) - Root
  417, // Line 2 - Sacral
  528, // Line 3 - Solar Plexus
  639, // Line 4 - Heart
  285, // Line 5 - (Deviation from standard ascending)
  174  // Line 6 (Top) - (Deviation from standard ascending)
];

/**
 * Maps a binary hexagram string to audio parameters for each line.
 * @param {string} binaryString - 6-character string of '0's and '1's (Index 0 = Bottom Line)
 * @returns {Array} Array of line audio objects
 */
const mapHexagramToFrequencies = (binaryString) => {
  if (!binaryString || binaryString.length !== 6) return [];

  return binaryString.split('').map((char, index) => {
    const isYang = char === '1';
    const frequency = SOLFEGGIO_FREQUENCIES[index];
    
    return {
      line: index + 1,
      frequency,
      isYang,
      // Audio properties based on Yin/Yang
      // Yang: Loud (-6dB), Long (2s), Octave x2 (handled in player)
      // Yin: Soft (-18dB), Short (1s), No octave shift
      volume: isYang ? -6 : -18,
      duration: isYang ? 2 : 1,
      octaveShift: isYang ? 1 : 0 // 0 = normal, 1 = +1 octave (x2 freq)
    };
  });
};

/**
 * Generates the 90-year Life Symphony data sequence.
 * @param {string} birthDate - YYYY-MM-DD
 * @param {string} birthTime - HH:mm
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {string} gender - 'male' or 'female'
 * @returns {Promise<Object>} The complete symphony data
 */
export const generateLifeSymphony = async (birthDate, birthTime, latitude, longitude, gender) => {
  try {
    // 1. Determine Hemisphere and Init Astrology
    const isNorth = latitude >= 0;
    const AstrologyClass = isNorth ? astrology.IChingAstrology_North : astrology.IChingAstrology_South;
    const astroInstance = new AstrologyClass();
    const consultation = new astrology.IChingConsultation(astroInstance);

    // 2. Calculate Natal Data
    const birthDateTimeStr = `${birthDate}T${birthTime}`;
    const genderEnum = gender.toLowerCase() === 'male' ? astrology.Gender.MALE : astrology.Gender.FEMALE;

    // This performs all the heavy lifting (Pre/Later Heaven calculations)
    const natalData = await consultation.consultOracle(birthDateTimeStr, genderEnum, latitude, longitude);

    // 3. Extract Cycles
    const preHeavenCycles = natalData.iching.preHeavenBirthSubCycles || [];
    const laterHeavenCycles = natalData.iching.laterHeavenBirthSubCycles || [];

    // 4. Merge Cycles into a continuous timeline
    // The astrology engine generates year-by-year entries for both cycles.
    // We prioritize Pre-Heaven for early life and Later-Heaven for later life.
    // The `astrology.js` logic ensures Later-Heaven ranges start after Pre-Heaven ranges.
    
    const timelineMap = new Map();

    // Add Pre-Heaven cycles first
    preHeavenCycles.forEach(cycle => {
      timelineMap.set(cycle.age, {
        ...cycle,
        source: 'Pre-Heaven',
        audio: mapHexagramToFrequencies(cycle.hexagramBinary)
      });
    });

    // Add Later-Heaven cycles (these should naturally follow Pre-Heaven ages)
    laterHeavenCycles.forEach(cycle => {
      // Only add if we don't have this age yet (or overwrite if it's the intended transition)
      // Usually Later Heaven starts where Pre Heaven ends.
      if (!timelineMap.has(cycle.age)) {
        timelineMap.set(cycle.age, {
          ...cycle,
          source: 'Later-Heaven',
          audio: mapHexagramToFrequencies(cycle.hexagramBinary)
        });
      }
    });

    // 5. Convert to Array and Sort by Age
    const timeline = Array.from(timelineMap.values())
      .sort((a, b) => a.age - b.age)
      .filter(item => item.age >= 0 && item.age <= 90); // Limit to 90 years as requested

    return {
      metadata: {
        birthDate,
        birthTime,
        gender,
        latitude,
        longitude,
        heavenlyTrigram: natalData.iching.heavenlyTrigram,
        earthlyTrigram: natalData.iching.earthlyTrigram,
        preHeavenHexagram: natalData.iching.preHeavenHexagram,
        laterHeavenHexagram: natalData.iching.laterHeavenHexagram,
        elementalBalance: {
          heavenlyNumber: natalData.iching.heavenlyNumber,
          earthlyNumber: natalData.iching.earthlyNumber
        }
      },
      timeline
    };

  } catch (error) {
    console.error("Life Symphony Generation Error:", error);
    throw error;
  }
};