import astrology from '../const/astrology';
import { DateTime } from 'luxon';
import { mapBinaryToLines } from '@/const/solfeggio';

const mapHexagramToFrequencies = (binaryString) => mapBinaryToLines(binaryString);

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
      .filter(item => item.age >= 0); // Allow dynamic length based on cycles

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