/**
 * Jyotish natal engine: Lahiri sidereal positions, Lagna, whole-sign houses,
 * nakshatra/pāda, dignity, dṛṣṭi, and Vimśottarī daśā.
 *
 * Uses astronomia (Meeus / VSOP87) for tropical longitudes, then subtracts
 * Lahiri ayanāṁśa. Mean lunar node for Rāhu; Ketu = Rāhu + 180°.
 */

import { DateTime } from 'luxon';
import {
  GRAHAS,
  GRAHA_BY_KEY,
  RASHIS,
  HOUSES,
  DIGNITY,
  DIGNITY_LABELS,
  DRISHTI,
  VIMSHOTTARI,
  VIMSHOTTARI_TOTAL,
  bilingual,
  rashiById,
  rashiLabel,
  grahaLabel,
  houseLabel,
  nakshatraLabel,
  dignityLabel,
  AYANAMSA_NAME,
  rashiFromLongitude,
  nakshatraFromLongitude,
  norm360,
} from '@/const/vedic';
import {
  julianDayFromBirth,
  tropicalPositions,
  tropicalLagna as tropicalLagnaFrame,
  isRetrograde,
  formatDms,
  formatOffset,
  offsetToZone,
} from '@/utils/ephemeris';

export { formatOffset, offsetToZone, formatDms, julianDayFromBirth };

/**
 * Lahiri / Chitrapaksha ayanāṁśa in degrees.
 * Polynomial centred on J2000; ~23.85° at J2000, ~24.20° in 2025.
 */
export function lahiriAyanamsa(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.852294 + 1.3969718 * T - 0.000000348 * T * T;
}

export function tropicalLagna(jd, jde, latitudeDeg, longitudeDeg) {
  return tropicalLagnaFrame(jd, jde, latitudeDeg, longitudeDeg).ascendant;
}

export { rashiFromLongitude, nakshatraFromLongitude };

function dignityOf(key, signId, degreeInSign) {
  const table = DIGNITY[key];
  if (!table) return { key: 'neutral', label: dignityLabel('neutral'), blurb: DIGNITY_LABELS.neutral.blurb };
  const mool = table.mool;
  const inMool = mool && signId === mool.sign && degreeInSign >= mool.from && degreeInSign < mool.to;
  if (signId === table.debilSign) {
    return { key: 'debilitated', label: dignityLabel('debilitated'), blurb: DIGNITY_LABELS.debilitated.blurb };
  }
  if (inMool) {
    return { key: 'moolatrikona', label: dignityLabel('moolatrikona'), blurb: DIGNITY_LABELS.moolatrikona.blurb };
  }
  if (signId === table.exaltSign) {
    return { key: 'exalted', label: dignityLabel('exalted'), blurb: DIGNITY_LABELS.exalted.blurb };
  }
  if (table.own.includes(signId)) {
    return { key: 'own', label: dignityLabel('own'), blurb: DIGNITY_LABELS.own.blurb };
  }
  const host = RASHIS[signId - 1];
  const hostLord = host && host.lord;
  if (hostLord === key) {
    return { key: 'own', label: dignityLabel('own'), blurb: DIGNITY_LABELS.own.blurb };
  }
  if (table.friends.includes(hostLord)) {
    return { key: 'friend', label: dignityLabel('friend'), blurb: DIGNITY_LABELS.friend.blurb };
  }
  if (table.enemies.includes(hostLord)) {
    return { key: 'enemy', label: dignityLabel('enemy'), blurb: DIGNITY_LABELS.enemy.blurb };
  }
  return { key: 'neutral', label: dignityLabel('neutral'), blurb: DIGNITY_LABELS.neutral.blurb };
}

function wholeSignHouse(planetSignId, lagnaSignId) {
  return ((planetSignId - lagnaSignId + 12) % 12) + 1;
}

function aspectTargets(fromHouse, key) {
  const spans = DRISHTI[key] || [7];
  return spans.map((span) => ((fromHouse - 1 + span - 1) % 12) + 1);
}

export function computeVimshottari(moonLongitude, birthIso) {
  const info = nakshatraFromLongitude(moonLongitude);
  const startIndex = info.index % 9;
  const elapsedFrac = info.progress;
  const remainingFrac = 1 - elapsedFrac;
  const birth = DateTime.fromISO(birthIso);
  const periods = [];
  let cursor = birth;
  const firstYears = VIMSHOTTARI[startIndex].years * remainingFrac;
  const pushPeriod = (lordIndex, years) => {
    const start = cursor;
    const end = cursor.plus({ days: years * 365.25 });
    periods.push({
      key: VIMSHOTTARI[lordIndex].key,
      years,
      start: start.toISO(),
      end: end.toISO(),
      startLabel: start.toFormat('yyyy-MM-dd'),
      endLabel: end.toFormat('yyyy-MM-dd'),
      lord: GRAHA_BY_KEY[VIMSHOTTARI[lordIndex].key],
    });
    cursor = end;
  };
  pushPeriod(startIndex, firstYears);
  for (let i = 1; i < 9; i += 1) {
    const idx = (startIndex + i) % 9;
    pushPeriod(idx, VIMSHOTTARI[idx].years);
  }
  // One extra cycle so charts of older natives still have a current period.
  for (let i = 0; i < 9; i += 1) {
    const idx = (startIndex + i) % 9;
    pushPeriod(idx, VIMSHOTTARI[idx].years);
  }

  const now = DateTime.now();
  const currentMaha = periods.find((p) => now >= DateTime.fromISO(p.start) && now < DateTime.fromISO(p.end)) || periods[0];

  const antar = computeAntardasha(currentMaha);
  const currentAntar = antar.find((p) => now >= DateTime.fromISO(p.start) && now < DateTime.fromISO(p.end)) || antar[0];

  return {
    janmaNakshatra: info,
    timeline: periods.slice(0, 12),
    currentMaha,
    currentAntar,
    antardashas: antar,
  };
}

function computeAntardasha(maha) {
  const startIdx = VIMSHOTTARI.findIndex((v) => v.key === maha.key);
  const mahaStart = DateTime.fromISO(maha.start);
  const mahaEnd = DateTime.fromISO(maha.end);
  const mahaDays = mahaEnd.diff(mahaStart, 'days').days;
  const result = [];
  let cursor = mahaStart;
  for (let i = 0; i < 9; i += 1) {
    const idx = (startIdx + i) % 9;
    const frac = VIMSHOTTARI[idx].years / VIMSHOTTARI_TOTAL;
    const days = mahaDays * frac;
    const end = i === 8 ? mahaEnd : cursor.plus({ days });
    result.push({
      key: VIMSHOTTARI[idx].key,
      start: cursor.toISO(),
      end: end.toISO(),
      startLabel: cursor.toFormat('yyyy-MM-dd'),
      endLabel: end.toFormat('yyyy-MM-dd'),
      lord: GRAHA_BY_KEY[VIMSHOTTARI[idx].key],
    });
    cursor = end;
  }
  return result;
}

export function calculateVedicChart(birthInput) {
  const { jd, jde, utc, local } = julianDayFromBirth(birthInput);
  const ayanamsa = lahiriAyanamsa(jd);
  const lat = Number(birthInput.latitude) || 0;
  const lng = Number(birthInput.longitude) || 0;

  const tropNow = tropicalPositions(jde);
  const tropPrev = tropicalPositions(jde - 1);

  const siderealOf = (trop) => norm360(trop - ayanamsa);

  const lagnaTrop = tropicalLagna(jd, jde, lat, lng);
  const lagnaLon = norm360(lagnaTrop - ayanamsa);
  const lagnaRashi = rashiFromLongitude(lagnaLon);
  const lagnaLordKey = lagnaRashi.rashi.lord;

  const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
  const grahas = grahaKeys.map((key) => {
    const trop = tropNow[key];
    const lon = siderealOf(trop);
    const sign = rashiFromLongitude(lon);
    const house = wholeSignHouse(sign.id, lagnaRashi.id);
    const nak = nakshatraFromLongitude(lon);
    const meta = GRAHA_BY_KEY[key];
    const alwaysRetro = key === 'rahu' || key === 'ketu';
    const neverRetro = key === 'sun' || key === 'moon';
    const retrograde = alwaysRetro || (!neverRetro && isRetrograde(trop, tropPrev[key]));
    return {
      key,
      nameEn: meta.nameEn,
      nameSa: meta.nameSa,
      label: grahaLabel(meta),
      glyph: meta.glyph,
      abbr: meta.abbr,
      color: meta.color,
      karaka: meta.karaka,
      tropicalLongitude: trop,
      longitude: lon,
      rashi: sign.rashi,
      rashiId: sign.id,
      rashiLabel: sign.label,
      degreeInSign: sign.degreeInSign,
      degreeLabel: formatDms(sign.degreeInSign),
      house,
      houseMeta: HOUSES[house - 1],
      houseLabel: houseLabel(HOUSES[house - 1]),
      nakshatra: nak.nakshatra,
      nakshatraLabel: nak.label,
      pada: nak.pada,
      lord: nak.lord,
      dignity: dignityOf(key, sign.id, sign.degreeInSign),
      retrograde,
      aspects: aspectTargets(house, key),
    };
  });

  const byKey = Object.fromEntries(grahas.map((g) => [g.key, g]));

  const houses = HOUSES.map((h) => {
    const rashiId = ((lagnaRashi.id - 1 + h.number - 1) % 12) + 1;
    const rashi = rashiById(rashiId);
    const lordKey = rashi.lord;
    const lordGraha = byKey[lordKey];
    const occupants = grahas.filter((g) => g.house === h.number);
    const aspectsReceived = grahas
      .filter((g) => g.aspects.includes(h.number) && g.house !== h.number)
      .map((g) => ({
        key: g.key,
        label: g.label || grahaLabel(GRAHA_BY_KEY[g.key]),
        fromHouse: g.house,
      }));
    return {
      ...h,
      rashi,
      rashiId,
      rashiLabel: rashiLabel(rashi),
      lordKey,
      lordLabel: grahaLabel(GRAHA_BY_KEY[lordKey]),
      lordHouse: lordGraha ? lordGraha.house : null,
      lordDignity: lordGraha ? lordGraha.dignity : null,
      occupants,
      aspectsReceived,
      label: houseLabel(h),
    };
  });

  const dasha = computeVimshottari(byKey.moon.longitude, local.toISO());

  const interpretations = buildInterpretations({
    lagnaLon,
    lagnaRashi,
    lagnaLordKey,
    grahas,
    byKey,
    houses,
    dasha,
    ayanamsa,
  });

  return {
    birth: {
      ...birthInput,
      utcIso: utc.toISO(),
      localIso: local.toISO(),
      timezoneLabel: formatOffset(typeof birthInput.timezoneOffset === 'number'
        ? birthInput.timezoneOffset
        : -new Date().getTimezoneOffset()),
    },
    jd,
    jde,
    ayanamsa,
    ayanamsaLabel: bilingual(AYANAMSA_NAME.sa, AYANAMSA_NAME.en),
    ayanamsaFormatted: `${ayanamsa.toFixed(4)}°`,
    lagna: {
      longitude: lagnaLon,
      degreeInSign: lagnaRashi.degreeInSign,
      rashi: lagnaRashi.rashi,
      rashiLabel: lagnaRashi.label,
      lordKey: lagnaLordKey,
      lordLabel: grahaLabel(GRAHA_BY_KEY[lagnaLordKey]),
      lord: byKey[lagnaLordKey],
      formatted: formatDms(lagnaRashi.degreeInSign),
    },
    grahas,
    houses,
    dasha,
    interpretations,
    nodeNote: 'Rāhu and Ketu use the mean lunar node (not the true node).',
  };
}

function buildInterpretations({ lagnaRashi, lagnaLordKey, grahas, byKey, houses, dasha }) {
  const lagnaHouse = houses[0];
  const lagnaLord = byKey[lagnaLordKey];
  const moon = byKey.moon;
  const sun = byKey.sun;

  const lagna = [
    `Lagna (Ascendant) is ${lagnaRashi.label} at ${formatDms(lagnaRashi.degreeInSign)} of that rāśi (sign).`,
    lagnaRashi.rashi.lagnaBlurb,
    `The Lagna lord is ${grahaLabel(GRAHA_BY_KEY[lagnaLordKey])}, placed in ${lagnaLord.rashiLabel} in ${lagnaLord.houseLabel}. Dignity: ${lagnaLord.dignity.label}. ${lagnaLord.dignity.blurb}`,
    lagnaHouse.occupants.length
      ? `Grahas in the 1st house: ${lagnaHouse.occupants.map((g) => grahaLabel(GRAHA_BY_KEY[g.key]) + (g.retrograde ? ' (Vakra / Retrograde)' : '')).join(', ')}.`
      : 'No graha occupies the 1st house; the Lagna lord’s placement carries more of the self-story.',
  ].join(' ');

  const moonText = [
    `Chandra rāśi (Moon sign) is ${moon.rashiLabel} at ${formatDms(moon.degreeInSign)}.`,
    `Janma nakshatra (birth lunar mansion) is ${moon.nakshatraLabel}, pāda (quarter) ${moon.pada}, lorded by ${grahaLabel(GRAHA_BY_KEY[moon.nakshatra.lord])}.`,
    moon.rashi.moonBlurb,
    `Keywords of this nakshatra: ${moon.nakshatra.keywords}. Deity: ${moon.nakshatra.deity}.`,
    `Dignity: ${moon.dignity.label}. ${moon.dignity.blurb}`,
  ].join(' ');

  const sunText = [
    `Sūrya rāśi (Sun sign) is ${sun.rashiLabel} at ${formatDms(sun.degreeInSign)} in ${sun.houseLabel}.`,
    sun.rashi.sunBlurb,
    `Dignity: ${sun.dignity.label}. ${sun.dignity.blurb}`,
    `Sūrya (Sun) significations: ${GRAHA_BY_KEY.sun.karaka}.`,
  ].join(' ');

  const houseReadings = houses.map((h) => {
    const occupantText = h.occupants.length
      ? `Occupied by ${h.occupants.map((g) => `${grahaLabel(GRAHA_BY_KEY[g.key])} — ${g.dignity.label}${g.retrograde ? ', Vakra (Retrograde)' : ''}`).join('; ')}.`
      : 'No graha occupies this house.';
    const lordText = `Lord ${h.lordLabel} sits in house ${h.lordHouse} (${houseLabel(HOUSES[h.lordHouse - 1]).replace(/^House \d+ — /, '')}).`;
    const aspectText = h.aspectsReceived.length
      ? ` Aspected (dṛṣṭi) by ${h.aspectsReceived.map((a) => grahaLabel(GRAHA_BY_KEY[a.key])).join(', ')}.`
      : '';
    return {
      number: h.number,
      title: h.label,
      rashiLabel: h.rashiLabel,
      group: bilingual(h.group, h.groupEn),
      text: `${h.keywords}. ${occupantText} ${lordText}${aspectText}`,
    };
  });

  const grahaNotes = grahas.map((g) => {
    const meta = GRAHA_BY_KEY[g.key];
    return {
      key: g.key,
      title: grahaLabel(meta),
      text: `${grahaLabel(meta)} is at ${formatDms(g.degreeInSign)} of ${g.rashiLabel} in ${g.houseLabel}, nakshatra ${g.nakshatraLabel} pāda ${g.pada}. Dignity: ${g.dignity.label}. ${g.dignity.blurb} Kāraka (significator): ${meta.karaka}. Special dṛṣṭi (aspects) onto houses ${g.aspects.join(', ')}.${g.retrograde ? ' Motion: Vakra (Retrograde).' : ''}`,
    };
  });

  const maha = dasha.currentMaha;
  const antar = dasha.currentAntar;
  const dashaText = [
    `Vimśottarī daśā is counted from the Moon’s nakshatra at birth (${dasha.janmaNakshatra.label}).`,
    `Current mahādaśā (major period): ${grahaLabel(GRAHA_BY_KEY[maha.key])} from ${maha.startLabel} to ${maha.endLabel}. ${GRAHA_BY_KEY[maha.key].dashaBlurb}`,
    `Current antardaśā (sub-period): ${grahaLabel(GRAHA_BY_KEY[antar.key])} from ${antar.startLabel} to ${antar.endLabel}. ${GRAHA_BY_KEY[antar.key].dashaBlurb}`,
  ].join(' ');

  return {
    lagna,
    moon: moonText,
    sun: sunText,
    houses: houseReadings,
    grahas: grahaNotes,
    dasha: dashaText,
    disclaimer: 'This reading is educational Jyotish (Vedic astrology), not medical, legal, or financial advice. Whole-sign houses, Lahiri ayanāṁśa, and mean Rāhu/Ketu are used. Positions are natal-grade (VSOP87 / Meeus), not observatory ephemerides.',
  };
}

export function computeTropicalSnapshot(birthInput) {
  const { jd, jde } = julianDayFromBirth(birthInput);
  return {
    jd,
    jde,
    ayanamsa: lahiriAyanamsa(jd),
    tropical: tropicalPositions(jde),
    lagnaTropical: tropicalLagna(jd, jde, Number(birthInput.latitude) || 0, Number(birthInput.longitude) || 0),
  };
}

// Re-export helpers used by the UI
export {
  bilingual,
  rashiLabel,
  grahaLabel,
  houseLabel,
  nakshatraLabel,
  dignityLabel,
  GRAHAS,
  RASHIS,
  HOUSES,
};
