/**
 * Calculate I-Ching astrology data for a profile
 * This integrates with the existing astrology calculation engine
 */
import astro from '@/const/astrology';

/**
 * Calculate complete astrology profile data for a dating profile
 * @param {Date|string} birthDate - Birth date/time
 * @param {string} gender - 'MALE' or 'FEMALE'
 * @param {number} latitude - Birth location latitude
 * @param {number} longitude - Birth location longitude
 * @returns {Promise<Object>} Complete astrology profile data
 */
export async function calculateProfileAstrology(birthDate, gender, latitude, longitude) {
  try {
    //Determine hemisphere
    const hemisphere = latitude >= 0 ? 'Northern' : 'Southern';
    
    // Create proper astrology instance based on hemisphere
    const astrology = hemisphere === 'Northern' 
      ? new astro.IChingAstrology_North() 
      : new astro.IChingAstrology_South();
    
    const consultation = new astro.IChingConsultation(astrology);
    
    // Convert gender
    const genderEnum = gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
    
    // Convert birthDate to Date object if string
    const birthDateObj = birthDate instanceof Date ? birthDate : new Date(birthDate);
    
    // Validate date
    if (isNaN(birthDateObj.getTime())) {
      console.error('Invalid birth date provided to calculateProfileAstrology:', birthDate);
      throw new Error('Invalid birth date');
    }

    // Consult oracle to get complete astrology data
    const result = await consultation.consultOracle(birthDateObj, genderEnum, latitude, longitude);
    console.log('Astrology result:', result);
    
    // Extract the key data needed for profile
    return {
      // Zodiac Animal and Element from yearly cycle
      zodiacAnimal: result.yearly.yearlyCycle.cycle.horaryBranch.animal,
      element: result.yearly.yearlyCycle.cycle.horaryBranch.element.name,
      
      // Celestial Stem and Horary Branch as objects (matching astrology.vue structure)
      celestialStem: {
        name: result.yearly.yearlyCycle.cycle.celestialStem.name,
        symbol: result.yearly.yearlyCycle.cycle.celestialStem.symbol,
        element: result.yearly.yearlyCycle.cycle.celestialStem.element.name
      },
      horaryBranch: {
        name: result.yearly.yearlyCycle.cycle.horaryBranch.name,
        symbol: result.yearly.yearlyCycle.cycle.horaryBranch.symbol,
        animal: result.yearly.yearlyCycle.cycle.horaryBranch.animal,
        element: result.yearly.yearlyCycle.cycle.horaryBranch.element.name
      },
      
      // Hexagram data
      yearlyHexagram: {
        preHeaven: result.iching.preHeavenHexagram?.name || null,
        laterHeaven: result.iching.laterHeavenHexagram?.name || null
      },
      monthlyHexagram: result.monthly.monthlyStemBranch,
      dailyHexagram: result.daily.dailyCycle,
      hourlyHexagram: result.hourly,
      
      // Cycle information
      sexagenaryCycle: result.sexagenaryCycle?.cycleName || null,
      hemisphere: hemisphere,
      
      // Full nested structure for compatibility calculations
      fullYearlyCycle: result.yearly.yearlyCycle.cycle,
      fullMonthlyCycle: result.monthly.monthlyStemBranch,
      fullDailyCycle: result.daily.dailyCycle
    };
  } catch (error) {
    console.error('Error calculating profile astrology:', error);
    // Return defaults if calculation fails
    return {
      zodiacAnimal: 'Dragon',
      element: 'Wood',
      celestialStem: null,
      horaryBranch: null,
      celestialStemSymbol: null,
      horaryBranchSymbol: null,
      celestialStemTrigram: null,
      preHeavenHexagram: null,
      laterHeavenHexagram: null,
      sexagenaryCycle: null,
      hemisphere: latitude >= 0 ? 'Northern' : 'Southern'
    };
  }
}

/**
 * Get simplified astrology summary for display
 * @param {Object} astrologyData - Complete astrology data from calculateProfileAstrology
 * @returns {string} Human-readable summary
 */
export function getAstrologySummary(astrologyData) {
  if (!astrologyData) return '';
  
  const parts = [];
  
  if (astrologyData.zodiacAnimal) {
    parts.push(`${astrologyData.zodiacAnimal}`);
  }
  if (astrologyData.element) {
    parts.push(`${astrologyData.element} Element`);
  }
  if (astrologyData.celestialStem && astrologyData.horaryBranch) {
    parts.push(`${astrologyData.celestialStem}-${astrologyData.horaryBranch}`);
  }
  
  return parts.join(' • ');
}
