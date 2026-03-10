import astro from '@/const/astrology';
import { DateTime } from 'luxon';

/**
 * Extended compatibility calculations for dating features
 * Builds on top of the existing astrology compatibility engine
 */

/**
 * Calculate comprehensive dating compatibility between two profiles
 * @param {Object} profile1 - First user's profile
 * @param {Object} profile2 - Second user's profile
 * @returns {Object} - Detailed compatibility result
 */
export async function calculateDatingCompatibility(profile1, profile2) {
  try {
    // Prepare gender for astrology calculation
    const gender1 = profile1.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
    const gender2 = profile2.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
    
    // Get birth dates
    const birthDate1 = new Date(profile1.birthday);
    const birthDate2 = new Date(profile2.birthday);
    
    // Use existing compatibility calculation from astrology module
    const astrologyResult = await astro.calculateCompatibilityByYear(
      birthDate1,
      gender1,
      profile1.coords?.latitude || 0,
      profile1.coords?.longitude || 0,
      birthDate2,
      gender2,
      profile2.coords?.latitude || 0,
      profile2.coords?.longitude || 0
    );
    
    // Calculate interest compatibility
    const interestScore = calculateInterestCompatibility(
      profile1.interests || [],
      profile2.interests || []
    );
    
    // Calculate overall dating score (weighted average)
    const weights = {
      elemental: 0.25,
      trigramHexagram: 0.25,
      sexagenary: 0.20,
      interests: 0.30
    };
    
    const elementalScore = normalizeScore(astrologyResult.compatibility?.elementalCompatibility?.score || 0);
    const trigramScore = normalizeScore(astrologyResult.compatibility?.trigramHexagramCompatibility?.score || 0);
    const sexagenaryScore = normalizeScore(astrologyResult.compatibility?.sexagenaryCompatibility?.score || 0);
    
    const overallScore = Math.round(
      elementalScore * weights.elemental +
      trigramScore * weights.trigramHexagram +
      sexagenaryScore * weights.sexagenary +
      interestScore * weights.interests
    );
    
    return {
      overallScore,
      category: getCompatibilityCategory(overallScore),
      breakdown: {
        elemental: {
          score: elementalScore,
          weight: weights.elemental * 100,
          element1: astrologyResult.person1?.yearly?.yearlyCycle?.cycle?.celestialStem?.element?.name || 'Unknown',
          element2: astrologyResult.person2?.yearly?.yearlyCycle?.cycle?.celestialStem?.element?.name || 'Unknown',
          description: astrologyResult.compatibility?.elementalCompatibility?.description || ''
        },
        trigramHexagram: {
          score: trigramScore,
          weight: weights.trigramHexagram * 100,
          description: astrologyResult.compatibility?.trigramHexagramCompatibility?.description || ''
        },
        sexagenary: {
          score: sexagenaryScore,
          weight: weights.sexagenary * 100,
          animal1: astrologyResult.person1?.yearly?.yearlyCycle?.cycle?.horaryBranch?.animal || 'Unknown',
          animal2: astrologyResult.person2?.yearly?.yearlyCycle?.cycle?.horaryBranch?.animal || 'Unknown',
          description: astrologyResult.compatibility?.sexagenaryCompatibility?.description || ''
        },
        interests: {
          score: interestScore,
          weight: weights.interests * 100,
          commonInterests: getCommonInterests(profile1.interests || [], profile2.interests || []),
          description: getInterestDescription(interestScore)
        }
      },
      astrologyDetails: {
        person1: {
          element: astrologyResult.person1?.yearly?.yearlyCycle?.cycle?.celestialStem?.element?.name,
          animal: astrologyResult.person1?.yearly?.yearlyCycle?.cycle?.horaryBranch?.animal,
          preHeavenHexagram: astrologyResult.person1?.iching?.preHeavenHexagram?.name,
          laterHeavenHexagram: astrologyResult.person1?.iching?.laterHeavenHexagram?.name
        },
        person2: {
          element: astrologyResult.person2?.yearly?.yearlyCycle?.cycle?.celestialStem?.element?.name,
          animal: astrologyResult.person2?.yearly?.yearlyCycle?.cycle?.horaryBranch?.animal,
          preHeavenHexagram: astrologyResult.person2?.iching?.preHeavenHexagram?.name,
          laterHeavenHexagram: astrologyResult.person2?.iching?.laterHeavenHexagram?.name
        }
      },
      rawAstrologyResult: astrologyResult
    };
  } catch (error) {
    console.error('Error calculating dating compatibility:', error);
    return {
      overallScore: 50,
      category: getCompatibilityCategory(50),
      breakdown: {
        elemental: { score: 50, weight: 25, description: 'Unable to calculate' },
        trigramHexagram: { score: 50, weight: 25, description: 'Unable to calculate' },
        sexagenary: { score: 50, weight: 20, description: 'Unable to calculate' },
        interests: { 
          score: calculateInterestCompatibility(profile1.interests || [], profile2.interests || []),
          weight: 30,
          commonInterests: getCommonInterests(profile1.interests || [], profile2.interests || []),
          description: 'Based on shared interests only'
        }
      },
      error: error.message
    };
  }
}

/**
 * Calculate interest compatibility score
 * @param {Array} interests1 - First profile's interests
 * @param {Array} interests2 - Second profile's interests  
 * @returns {number} - Score from 0-100
 */
function calculateInterestCompatibility(interests1, interests2) {
  if (!interests1.length || !interests2.length) return 50; // Neutral if no interests
  
  const common = getCommonInterests(interests1, interests2);
  const total = new Set([...interests1, ...interests2]).size;
  
  if (total === 0) return 50;
  
  // Calculate Jaccard similarity and scale to 0-100
  const score = (common.length / total) * 100;
  
  // Boost score if they share at least some interests
  if (common.length >= 3) {
    return Math.min(100, score + 20);
  } else if (common.length >= 1) {
    return Math.min(100, score + 10);
  }
  
  return Math.round(score);
}

/**
 * Get common interests between two profiles
 */
function getCommonInterests(interests1, interests2) {
  const set1 = new Set(interests1.map(i => i.toLowerCase()));
  return interests2.filter(i => set1.has(i.toLowerCase()));
}

/**
 * Normalize astrology score to 0-100 range
 * Original scores can be negative to positive
 */
function normalizeScore(score) {
  // Astrology scores typically range from -10 to +10
  // Normalize to 0-100
  const normalized = ((score + 10) / 20) * 100;
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

/**
 * Get compatibility category based on score
 */
function getCompatibilityCategory(score) {
  if (score >= 80) return { name: 'Soulmate', emoji: '💫', color: 'gold', badge: 'gold' };
  if (score >= 60) return { name: 'Highly Compatible', emoji: '✨', color: 'silver', badge: 'silver' };
  if (score >= 40) return { name: 'Compatible', emoji: '☯', color: 'bronze', badge: 'bronze' };
  if (score >= 20) return { name: 'Challenging', emoji: '🔮', color: 'blue', badge: 'blue' };
  return { name: 'Learning Opportunity', emoji: '📚', color: 'gray', badge: 'gray' };
}

/**
 * Get description for interest compatibility
 */
function getInterestDescription(score) {
  if (score >= 80) return 'You have many shared interests and hobbies!';
  if (score >= 60) return 'You share several common interests.';
  if (score >= 40) return 'You have some overlapping interests.';
  if (score >= 20) return 'You have different interests, which could be complementary.';
  return 'Your interests differ, offering opportunities to learn from each other.';
}

/**
 * Get element emoji for display
 */
export function getElementEmoji(element) {
  const emojis = {
    'Wood': '🌳',
    'Fire': '🔥',
    'Earth': '🌍',
    'Metal': '⚙️',
    'Water': '💧'
  };
  return emojis[element] || '☯';
}

/**
 * Get animal emoji for display
 */
export function getAnimalEmoji(animal) {
  const emojis = {
    'Rat': '🐀',
    'Ox': '🐂',
    'Tiger': '🐅',
    'Rabbit': '🐇',
    'Dragon': '🐉',
    'Snake': '🐍',
    'Horse': '🐎',
    'Goat': '🐐',
    'Monkey': '🐒',
    'Rooster': '🐓',
    'Dog': '🐕',
    'Pig': '🐖'
  };
  return emojis[animal] || '☯';
}

/**
 * Calculate astrology profile for a single profile
 * Used to cache astrology data on profiles
 */
export async function calculateAstrologyProfile(profile) {
  try {
    const gender = profile.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
    const birthDate = new Date(profile.birthday);
    const hemisphere = (profile.coords?.latitude || 0) >= 0 ? 'Northern' : 'Southern';
    
    const astrology = hemisphere === 'Northern' 
      ? new astro.IChingAstrology_North() 
      : new astro.IChingAstrology_South();
    
    const consultation = new astro.IChingConsultation(astrology);
    const result = await consultation.consultOracle(
      birthDate,
      gender,
      profile.coords?.latitude || 0,
      profile.coords?.longitude || 0
    );
    
    return {
      preHeavenHexagram: result.iching?.preHeavenHexagram,
      laterHeavenHexagram: result.iching?.laterHeavenHexagram,
      yearlyCycle: result.yearly?.yearlyCycle?.cycle,
      monthlyCycle: result.monthly?.monthlyStemBranch,
      dailyCycle: result.daily?.dailyCycle,
      element: result.yearly?.yearlyCycle?.cycle?.celestialStem?.element?.name,
      animal: result.yearly?.yearlyCycle?.cycle?.horaryBranch?.animal,
      hemisphere
    };
  } catch (error) {
    console.error('Error calculating astrology profile:', error);
    return null;
  }
}

/**
 * Batch calculate compatibility for a user against multiple profiles
 */
export async function batchCalculateCompatibility(userProfile, profiles) {
  const results = [];
  
  for (const profile of profiles) {
    try {
      const compatibility = await calculateDatingCompatibility(userProfile, profile);
      results.push({
        profileId: profile.id,
        profile,
        compatibility
      });
    } catch (error) {
      console.error(`Error calculating compatibility for profile ${profile.id}:`, error);
      results.push({
        profileId: profile.id,
        profile,
        compatibility: {
          overallScore: 50,
          category: getCompatibilityCategory(50),
          error: error.message
        }
      });
    }
  }
  
  // Sort by overall score descending
  results.sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore);
  
  return results;
}

export { getCompatibilityCategory };
