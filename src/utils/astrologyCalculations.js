/**
 * Western natal chart: tropical positions from the shared astronomia ephemeris,
 * true Ascendant and Midheaven, Placidus houses (Equal fallback), major aspects.
 */

import {
  tropicalPositions,
  tropicalLagna,
  tropicalMidheaven,
  julianDayFromBirth,
  houseCusps,
  houseOfLongitude,
  isRetrograde,
  formatDms,
  formatOffset,
  norm360,
} from '@/utils/ephemeris';
import {
  WESTERN_PLANETS,
  WESTERN_HOUSES,
  WESTERN_SIGNS,
  ASPECT_TYPES,
  PLANET_IN_HOUSE,
  signFromLongitude,
  westernDignity,
} from '@/const/western';

const PLANET_KEYS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'northnode', 'southnode',
];

function lonOf(trop, key) {
  if (key === 'northnode') return trop.rahu;
  if (key === 'southnode') return trop.ketu;
  return trop[key];
}

export function calculateAspects(planetPositions) {
  const aspects = [];
  const skip = new Set(['northnode', 'southnode']);
  for (let i = 0; i < planetPositions.length; i += 1) {
    for (let j = i + 1; j < planetPositions.length; j += 1) {
      const a = planetPositions[i];
      const b = planetPositions[j];
      if (skip.has(a.key) && skip.has(b.key)) continue;
      let diff = Math.abs(a.longitude - b.longitude);
      if (diff > 180) diff = 360 - diff;
      ASPECT_TYPES.forEach((type) => {
        const orb = Math.abs(diff - type.angle);
        if (orb <= type.orb) {
          aspects.push({
            planet1: a.name,
            planet2: b.name,
            key1: a.key,
            key2: b.key,
            aspect: type.name,
            symbol: type.symbol,
            nature: type.nature,
            blurb: type.blurb,
            orb,
            angle: type.angle,
            applying: null,
          });
        }
      });
    }
  }
  aspects.sort((x, y) => x.orb - y.orb);
  return aspects;
}

const WESTERN_HOUSE_PLAIN = {
  1: 'how you come across',
  2: 'money and self-worth',
  3: 'talk, siblings, and the local mind',
  4: 'home and roots',
  5: 'creativity, romance, and play',
  6: 'daily work and health habits',
  7: 'partnership',
  8: 'shared money and deep change',
  9: 'belief, travel, and the bigger picture',
  10: 'career and public reputation',
  11: 'friends and hopes',
  12: 'privacy, rest, and the unseen',
};

function firstSentence(text) {
  if (!text) return '';
  const match = String(text).match(/^[^.!?]+[.!?]?/);
  return match ? match[0].trim() : String(text);
}

function buildWesternExecutive({ sun, moon, risingSign, planetPositions, aspects, mc }) {
  const mcSign = signFromLongitude(mc);
  const tight = (aspects || []).filter((a) => !['northnode', 'southnode'].includes(a.key1) && !['northnode', 'southnode'].includes(a.key2))[0];
  const strong = planetPositions.filter((p) => ['domicile', 'exaltation'].includes(p.dignity.key) && !['northnode', 'southnode'].includes(p.key));
  const strained = planetPositions.filter((p) => ['detriment', 'fall'].includes(p.dignity.key) && !['northnode', 'southnode'].includes(p.key));
  const headline = `${risingSign.name} rising, ${sun.sign} Sun, ${moon.sign} Moon.`;
  const intro = `${firstSentence(risingSign.rising)} ${firstSentence(sun.signMeta.sun)} ${firstSentence(moon.signMeta.moon)}`;
  const points = [
    { label: 'How you come across', text: `${firstSentence(risingSign.rising)} Rising is the first impression — not the same thing as your Sun sign.` },
    { label: 'Who you are becoming', text: `${firstSentence(sun.signMeta.sun)} The Sun is in the house of ${WESTERN_HOUSE_PLAIN[sun.house]}.` },
    { label: 'How you feel', text: `${firstSentence(moon.signMeta.moon)} The Moon is in the house of ${WESTERN_HOUSE_PLAIN[moon.house]}.` },
    { label: 'Public direction', text: `The Midheaven (career / calling point) is in ${mcSign.name}.` },
  ];
  if (tight) {
    points.push({
      label: 'A key relationship in the chart',
      text: `${tight.planet1} ${tight.aspect} ${tight.planet2} (within ${tight.orb.toFixed(1)}°). ${tight.blurb}`,
    });
  }
  const ease = [];
  if (strong.length) ease.push(`${strong.map((p) => p.name).join(', ')} ${strong.length === 1 ? 'has' : 'have'} extra support`);
  if (strained.length) ease.push(`${strained.map((p) => p.name).join(', ')} ${strained.length === 1 ? 'is' : 'are'} in a more awkward sign`);
  if (ease.length) {
    points.push({ label: 'Easy vs effort', text: `${ease.join('. ')}.` });
  }
  return { headline, intro, points };
}

function planetSentence(planet) {
  const houseIdx = planet.house - 1;
  const houseLine = PLANET_IN_HOUSE[planet.key]
    ? PLANET_IN_HOUSE[planet.key][houseIdx]
    : `${planet.name} in the ${WESTERN_HOUSES[houseIdx].name} emphasises ${WESTERN_HOUSES[houseIdx].keywords.toLowerCase()}.`;
  const sign = WESTERN_SIGNS[planet.signId - 1];
  return `${planet.name} at ${planet.degreeLabel} ${sign.name} in the ${WESTERN_HOUSES[houseIdx].name}. Dignity: ${planet.dignity.label}. ${houseLine}${planet.retrograde ? ' Motion: retrograde.' : ''}`;
}

export function calculateWesternChart(birthInput) {
  const { jd, jde, utc, local } = julianDayFromBirth(birthInput);
  const lat = Number(birthInput.latitude) || 0;
  const lng = Number(birthInput.longitude) || 0;
  const system = birthInput.houseSystem === 'equal' ? 'equal' : 'placidus';

  const tropNow = tropicalPositions(jde);
  const tropPrev = tropicalPositions(jde - 1);
  const lagna = tropicalLagna(jd, jde, lat, lng);
  const mc = tropicalMidheaven(lagna.ramc, lagna.obliquity);
  const houses = houseCusps(lagna.ascendant, lagna.ramc, lat, lagna.obliquity, system);

  const planetPositions = PLANET_KEYS.map((key) => {
    const meta = WESTERN_PLANETS.find((p) => p.key === key);
    const longitude = lonOf(tropNow, key);
    const sign = signFromLongitude(longitude);
    const house = houseOfLongitude(longitude, houses.cusps);
    const neverRetro = !!meta.neverRetro;
    const alwaysRetro = !!meta.alwaysRetro;
    const retrograde = alwaysRetro || (!neverRetro && isRetrograde(longitude, lonOf(tropPrev, key)));
    return {
      key,
      name: meta.name,
      symbol: meta.symbol,
      color: meta.color,
      keywords: meta.keywords,
      longitude,
      sign: sign.name,
      signId: sign.id,
      signMeta: sign,
      degreeInSign: sign.degreeInSign,
      degreeLabel: formatDms(sign.degreeInSign),
      house,
      houseName: WESTERN_HOUSES[house - 1].name,
      dignity: westernDignity(key, sign.id),
      retrograde,
    };
  });

  planetPositions.forEach((p) => {
    p.blurb = planetSentence(p);
  });

  const aspects = calculateAspects(planetPositions.filter((p) => p.key !== 'southnode'));
  const sun = planetPositions.find((p) => p.key === 'sun');
  const moon = planetPositions.find((p) => p.key === 'moon');
  const risingSign = signFromLongitude(lagna.ascendant);

  const interpretations = {
    sun: `${sun.signMeta.sun} ${sun.blurb}`,
    moon: `${moon.signMeta.moon} ${moon.blurb}`,
    rising: `${risingSign.rising} Ascendant at ${formatDms(risingSign.degreeInSign)} ${risingSign.name}. Midheaven (MC) at ${formatDms(signFromLongitude(mc).degreeInSign)} ${signFromLongitude(mc).name}.`,
    executive: buildWesternExecutive({ sun, moon, risingSign, planetPositions, aspects, mc }),
    engine: `Tropical zodiac. ${houses.system === 'placidus' ? 'Placidus' : 'Equal'} houses${houses.fallback ? ' (Placidus fell back to Equal at this latitude)' : ''}. Positions from astronomia (VSOP87 / Meeus), natal-grade. Mean lunar nodes.`,
    disclaimer: 'Educational Western astrology, not medical, legal, or financial advice.',
  };

  return {
    birth: {
      ...birthInput,
      utcIso: utc.toISO(),
      localIso: local.toISO(),
      timezoneLabel: formatOffset(
        typeof birthInput.timezoneOffset === 'number'
          ? birthInput.timezoneOffset
          : -new Date().getTimezoneOffset()
      ),
    },
    jd,
    jde,
    ascendant: lagna.ascendant,
    midheaven: mc,
    ramc: lagna.ramc,
    obliquity: lagna.obliquity,
    houses,
    planetPositions,
    aspects,
    risingSign,
    interpretations,
  };
}

/** Back-compat wrapper used by AstrologySection.vue */
export async function calculatePlanetaryPositions(date, time, latitude, longitude, timezoneOffset) {
  const chart = calculateWesternChart({
    date,
    time,
    latitude,
    longitude,
    timezoneOffset,
  });
  return chart.planetPositions;
}

export function calculateHouses(birthDateTime, latitude, longitude, timezoneOffset) {
  const chart = calculateWesternChart({
    date: birthDateTime,
    time: `${String(birthDateTime.hour ?? 12).padStart(2, '0')}:${String(birthDateTime.minute ?? 0).padStart(2, '0')}`,
    latitude,
    longitude,
    timezoneOffset,
  });
  return chart.houses.cusps.map((c) => ({
    number: c.number,
    cusp: c.cusp,
    sign: signFromLongitude(c.cusp).name,
  }));
}

export { formatDms, formatOffset, norm360, WESTERN_HOUSES, WESTERN_SIGNS };
