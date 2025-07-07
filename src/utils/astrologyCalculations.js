import { DateTime } from 'luxon';

// Simplified planetary calculation functions
export async function calculatePlanetaryPositions(date, time, latitude, longitude) {
  try {
    // Combine date and time
    const [hours, minutes] = time.split(':').map(Number);
    const birthDateTime = DateTime.fromJSDate(date).set({ hour: hours, minute: minutes });
    
    // Calculate Julian Day Number
    const jd = calculateJulianDay(birthDateTime);

    // Calculate planetary positions using simplified algorithms
    const positions = [];

    // Sun position (simplified)
    const sunLon = calculateSunPosition(jd);
    positions.push({
      name: 'Sun',
      symbol: '☉',
      longitude: sunLon,
      sign: getZodiacSign(sunLon),
      house: calculateHouse(sunLon, latitude, longitude, jd)
    });

    // Moon position (simplified)
    const moonLon = calculateMoonPosition(jd);
    positions.push({
      name: 'Moon',
      symbol: '☽',
      longitude: moonLon,
      sign: getZodiacSign(moonLon),
      house: calculateHouse(moonLon, latitude, longitude, jd)
    });

    // Calculate planetary positions using simplified formulas
    const planets = [
      { name: 'Mercury', symbol: '☿' },
      { name: 'Venus', symbol: '♀' },
      { name: 'Mars', symbol: '♂' },
      { name: 'Jupiter', symbol: '♃' },
      { name: 'Saturn', symbol: '♄' },
      { name: 'Uranus', symbol: '♅' },
      { name: 'Neptune', symbol: '♆' },
      { name: 'Pluto', symbol: '♇' }
    ];

    planets.forEach((planet, index) => {
      const longitude = calculatePlanetPosition(planet.name, jd);
      positions.push({
        name: planet.name,
        symbol: planet.symbol,
        longitude: longitude,
        sign: getZodiacSign(longitude),
        house: calculateHouse(longitude, latitude, longitude, jd)
      });
    });

    return positions;
  } catch (error) {
    console.error('Error in calculatePlanetaryPositions:', error);
    throw new Error('Failed to calculate planetary positions');
  }
}

// Calculate Julian Day Number
function calculateJulianDay(dateTime) {
  const year = dateTime.year;
  const month = dateTime.month;
  const day = dateTime.day + (dateTime.hour + dateTime.minute / 60) / 24;
  
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// Simplified Sun position calculation
function calculateSunPosition(jd) {
  const n = jd - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
  const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360;
  return lambda < 0 ? lambda + 360 : lambda;
}

// Simplified Moon position calculation
function calculateMoonPosition(jd) {
  const n = jd - 2451545.0;
  const L = (218.316 + 13.176396 * n) % 360;
  const M = ((134.963 + 13.064993 * n) % 360) * Math.PI / 180;
  const F = ((93.272 + 13.229350 * n) % 360) * Math.PI / 180;
  
  const lambda = L + 6.289 * Math.sin(M) + 1.274 * Math.sin(2 * ((L - 124.7) * Math.PI / 180) - M) + 0.658 * Math.sin(2 * ((L - 124.7) * Math.PI / 180));
  return ((lambda % 360) + 360) % 360;
}

// Simplified planetary position calculation
function calculatePlanetPosition(planetName, jd) {
  const n = jd - 2451545.0;
  const T = n / 36525.0;
  
  // Simplified orbital elements (mean longitudes at epoch J2000.0 and daily motions)
  const orbitalData = {
    'Mercury': { L0: 252.25, n: 4.092317 },
    'Venus': { L0: 181.98, n: 1.602136 },
    'Mars': { L0: 355.43, n: 0.524071 },
    'Jupiter': { L0: 34.35, n: 0.083056 },
    'Saturn': { L0: 50.08, n: 0.033371 },
    'Uranus': { L0: 314.05, n: 0.011769 },
    'Neptune': { L0: 304.35, n: 0.006002 },
    'Pluto': { L0: 238.93, n: 0.003969 }
  };
  
  const data = orbitalData[planetName];
  if (!data) return 0;
  
  const meanLongitude = (data.L0 + data.n * n) % 360;
  return meanLongitude < 0 ? meanLongitude + 360 : meanLongitude;
}

// Helper function to get zodiac sign from longitude
function getZodiacSign(longitude) {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const signIndex = Math.floor(longitude / 30);
  return signs[signIndex] || 'Aries';
}

// Simplified house calculation (Equal House system)
function calculateHouse(planetLongitude, latitude, longitude, jd) {
  try {
    // Calculate local sidereal time (simplified)
    const gmst = calculateGMST(jd);
    const lst = gmst + longitude / 15; // Convert longitude to hours
    
    // Calculate Ascendant (simplified)
    const ascendant = (lst * 15) % 360; // Convert back to degrees
    
    // Calculate house using Equal House system
    const houseLongitude = (planetLongitude - ascendant + 360) % 360;
    const house = Math.floor(houseLongitude / 30) + 1;
    
    return house > 12 ? house - 12 : (house < 1 ? house + 12 : house);
  } catch (error) {
    console.warn('Error calculating house:', error);
    return 1; // Default to first house
  }
}

// Calculate Greenwich Mean Sidereal Time
function calculateGMST(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000.0;
  return ((gmst % 360) + 360) % 360;
}

// Calculate aspects between planets
export function calculateAspects(planetPositions) {
  const aspects = [];
  const aspectOrbs = {
    conjunction: 8,
    opposition: 8,
    trine: 8,
    square: 8,
    sextile: 6,
    quincunx: 3
  };

  for (let i = 0; i < planetPositions.length; i++) {
    for (let j = i + 1; j < planetPositions.length; j++) {
      const planet1 = planetPositions[i];
      const planet2 = planetPositions[j];
      
      let diff = Math.abs(planet1.longitude - planet2.longitude);
      if (diff > 180) diff = 360 - diff;

      // Check for major aspects
      const aspectTypes = [
        { name: 'conjunction', angle: 0 },
        { name: 'sextile', angle: 60 },
        { name: 'square', angle: 90 },
        { name: 'trine', angle: 120 },
        { name: 'quincunx', angle: 150 },
        { name: 'opposition', angle: 180 }
      ];

      aspectTypes.forEach(aspectType => {
        const orb = aspectOrbs[aspectType.name];
        if (Math.abs(diff - aspectType.angle) <= orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: aspectType.name,
            orb: Math.abs(diff - aspectType.angle),
            angle: aspectType.angle
          });
        }
      });
    }
  }

  return aspects;
}

// Calculate houses using Equal House system (simplified)
export function calculateHouses(birthDateTime, latitude, longitude) {
  try {
    const jd = calculateJulianDay(birthDateTime);

    // Calculate local sidereal time
    const gmst = calculateGMST(jd);
    const lst = gmst + longitude / 15; // Convert longitude to hours
    
    // Calculate Ascendant
    const ascendant = (lst * 15) % 360; // Convert back to degrees
    
    // Equal house system for simplicity
    const houses = [];
    for (let i = 1; i <= 12; i++) {
      const cuspLongitude = (ascendant + (i - 1) * 30) % 360;
      houses.push({
        number: i,
        cusp: cuspLongitude,
        sign: getZodiacSign(cuspLongitude)
      });
    }

    return houses;
  } catch (error) {
    console.error('Error calculating houses:', error);
    return [];
  }
}