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
  PLAIN_SIGN,
  PLAIN_DIGNITY,
  PLAIN_HOUSE_FOCUS,
  PLAIN_PERIOD,
  NAVATARA,
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

export function computeVimshottari(moonLongitude, birthIso, asOfIso) {
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

  const asOfRaw = asOfIso ? DateTime.fromISO(asOfIso) : DateTime.now();
  const asOf = asOfRaw.isValid ? asOfRaw : DateTime.now();
  const currentMaha = periods.find((p) => asOf >= DateTime.fromISO(p.start) && asOf < DateTime.fromISO(p.end)) || periods[0];

  const antar = computeAntardasha(currentMaha);
  const currentAntar = antar.find((p) => asOf >= DateTime.fromISO(p.start) && asOf < DateTime.fromISO(p.end)) || antar[0];

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

function drishtiName(span) {
  if (span === 7) return '7th dṛṣṭi';
  if (span === 4) return '4th dṛṣṭi';
  if (span === 8) return '8th dṛṣṭi';
  if (span === 5) return '5th dṛṣṭi';
  if (span === 9) return '9th dṛṣṭi';
  if (span === 3) return '3rd dṛṣṭi';
  if (span === 10) return '10th dṛṣṭi';
  return `${span}th dṛṣṭi`;
}

function navataraFrom(janmaIndex, transitIndex) {
  const pos = (transitIndex - janmaIndex + 27) % 27;
  const tara = NAVATARA[pos % 9];
  return {
    ...tara,
    position: pos + 1,
    caution: ['vipat', 'pratyari', 'naidhana'].includes(tara.key),
  };
}

function sadeSatiFromMoon(saturnRashiId, moonRashiId) {
  const fromMoon = wholeSignHouse(saturnRashiId, moonRashiId);
  if (fromMoon === 12) {
    return { active: true, phase: 'rising', fromMoon, text: 'Śani (Saturn) is in the 12th from the natal Moon — the rising phase of Sade Sati. Privacy, endings, and what is spent run louder than usual.' };
  }
  if (fromMoon === 1) {
    return { active: true, phase: 'peak', fromMoon, text: 'Śani (Saturn) is on the natal Moon — the peak of Sade Sati. Duty, delay, and the mind’s weather are heavy; what is earned now tends to last.' };
  }
  if (fromMoon === 2) {
    return { active: true, phase: 'setting', fromMoon, text: 'Śani (Saturn) is in the 2nd from the natal Moon — the setting phase of Sade Sati. Speech, money, and family structures are being rebuilt.' };
  }
  if (fromMoon === 8) {
    return { active: false, phase: 'ashtama', fromMoon, text: 'Śani (Saturn) is 8th from the natal Moon (Aṣṭama Śani). Not Sade Sati, but a long stretch of deep change and shared-life pressure.' };
  }
  return { active: false, phase: null, fromMoon, text: '' };
}

function gocharaPlanet(key, trop, tropPrev, ayanamsa, lagnaSignId, moonSignId) {
  const meta = GRAHA_BY_KEY[key];
  const tropical = trop[key];
  const lon = norm360(tropical - ayanamsa);
  const sign = rashiFromLongitude(lon);
  const nak = nakshatraFromLongitude(lon);
  const house = wholeSignHouse(sign.id, lagnaSignId);
  const moonHouse = wholeSignHouse(sign.id, moonSignId);
  const alwaysRetro = key === 'rahu' || key === 'ketu';
  const neverRetro = key === 'sun' || key === 'moon';
  const retrograde = alwaysRetro || (!neverRetro && isRetrograde(tropical, tropPrev[key]));
  return {
    key,
    nameEn: meta.nameEn,
    nameSa: meta.nameSa,
    label: grahaLabel(meta),
    glyph: meta.glyph,
    color: meta.color,
    karaka: meta.karaka,
    longitude: lon,
    rashi: sign.rashi,
    rashiId: sign.id,
    rashiLabel: sign.label,
    degreeInSign: sign.degreeInSign,
    degreeLabel: formatDms(sign.degreeInSign),
    house,
    houseMeta: HOUSES[house - 1],
    houseLabel: houseLabel(HOUSES[house - 1]),
    housePlain: PLAIN_HOUSE_FOCUS[house],
    moonHouse,
    moonHouseLabel: houseLabel(HOUSES[moonHouse - 1]),
    moonHousePlain: PLAIN_HOUSE_FOCUS[moonHouse],
    nakshatra: nak.nakshatra,
    nakshatraLabel: nak.label,
    pada: nak.pada,
    lord: nak.lord,
    retrograde,
    aspects: aspectTargets(house, key),
  };
}

function monthLine(planet, verb) {
  if (!planet) return null;
  const retro = planet.retrograde ? ` ${planet.label} is vakra (retrograde).` : '';
  return {
    key: planet.key,
    name: planet.label,
    glyph: planet.glyph,
    color: planet.color,
    rashiLabel: planet.rashiLabel,
    degreeLabel: planet.degreeLabel,
    house: planet.house,
    houseLabel: planet.houseLabel,
    housePlain: planet.housePlain,
    retrograde: planet.retrograde,
    text: `${planet.label} at ${planet.degreeLabel} ${planet.rashiLabel} in ${planet.houseLabel} — ${verb} ${planet.housePlain}.${retro}`,
  };
}

function buildVedicDailyLead({ moon, tara, dasha, saturn, jupiter, sun, sadeSati, hits }) {
  const maha = dasha.currentMaha;
  const antar = dasha.currentAntar;
  const headline = `Chandra in ${moon.rashi.nameEn}, lighting ${moon.houseLabel}.`;
  const intro = `Today’s Moon is at ${moon.degreeLabel} ${moon.rashiLabel} in ${moon.nakshatraLabel} pāda ${moon.pada} — the ${tara.sa} (${tara.en}) star from your birth Moon. ${tara.tone}. You are in a ${GRAHA_BY_KEY[maha.key].nameEn} mahādaśā with ${GRAHA_BY_KEY[antar.key].nameEn} antardaśā.`;
  const points = [
    {
      label: 'Today’s weather',
      text: `Chandra is moving through the house of ${moon.housePlain} from Lagna${tara.caution ? ` (${tara.sa} is a caution tara — keep the day simple)` : ''}. From the natal Moon, that is ${moon.moonHouseLabel} — ${moon.moonHousePlain}.`,
    },
    {
      label: 'The chapter you are in',
      text: `A ${GRAHA_BY_KEY[maha.key].nameEn} period (until ${maha.endLabel}) emphasises ${PLAIN_PERIOD[maha.key]}. Under that, a ${GRAHA_BY_KEY[antar.key].nameEn} subplot (until ${antar.endLabel}) brings ${PLAIN_PERIOD[antar.key]}.`,
    },
    {
      label: 'This month’s frame',
      text: saturn.text,
    },
    {
      label: 'This month’s opening',
      text: jupiter.text,
    },
    {
      label: 'Solar month',
      text: `Sūrya (Sun) is in ${sun.rashiLabel}, in ${sun.houseLabel} — ${sun.housePlain}.`,
    },
  ];
  if (sadeSati.text) {
    points.push({ label: sadeSati.active ? 'Sade Sati' : 'Saturn from the Moon', text: sadeSati.text });
  }
  const tight = (hits || []).find((h) => h.transitKey !== 'moon') || hits[0];
  if (tight) {
    points.push({ label: 'A key gochara contact', text: tight.blurb });
  }
  return { headline, intro, points };
}

/**
 * Dated natal + gochara reading. Vimśottarī at the chosen date is the period clock;
 * Chandra’s nakshatra (navatāra) leads the day; Guru and Śani frame the longer stretch.
 */
export function calculateVedicDaily(natalChart, when) {
  const natalGrahas = natalChart.grahas || [];
  const lagnaSignId = natalChart.lagna?.rashi?.id;
  const natalMoon = natalGrahas.find((g) => g.key === 'moon');
  const natalSun = natalGrahas.find((g) => g.key === 'sun');
  if (!lagnaSignId || !natalMoon) {
    throw new Error('A natal Lagna and Moon are required for a daily gochara reading.');
  }

  const snap = julianDayFromBirth(when);
  const ayanamsa = lahiriAyanamsa(snap.jd);
  const trop = tropicalPositions(snap.jde);
  const tropMoonPrev = tropicalPositions(snap.jde - 0.25);
  const tropDayPrev = tropicalPositions(snap.jde - 1);
  const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
  const transiting = grahaKeys.map((key) => {
    const prev = key === 'moon' ? tropMoonPrev : tropDayPrev;
    return gocharaPlanet(key, trop, prev, ayanamsa, lagnaSignId, natalMoon.rashiId);
  });

  const hits = [];
  transiting.forEach((t) => {
    natalGrahas.forEach((n) => {
      if (t.house === n.house) {
        hits.push({
          transit: t.label,
          transitKey: t.key,
          natal: n.label,
          natalKey: n.key,
          natalHouse: n.house,
          natalHouseLabel: n.houseLabel,
          transitHouse: t.house,
          transitHouseLabel: t.houseLabel,
          aspect: 'conjunction',
          aspectSa: 'saṃyuta',
          span: 1,
          kind: t.key === 'moon' ? 'moon' : 'gochara',
          blurb: `Gochara ${t.label} is with natal ${n.label} in ${t.houseLabel}. The two principles occupy the same whole-sign house.`,
        });
      }
      (DRISHTI[t.key] || [7]).forEach((span) => {
        const targetHouse = ((t.house - 1 + span - 1) % 12) + 1;
        if (targetHouse === n.house) {
          hits.push({
            transit: t.label,
            transitKey: t.key,
            natal: n.label,
            natalKey: n.key,
            natalHouse: n.house,
            natalHouseLabel: n.houseLabel,
            transitHouse: t.house,
            transitHouseLabel: t.houseLabel,
            aspect: drishtiName(span),
            aspectSa: 'dṛṣṭi',
            span,
            kind: t.key === 'moon' ? 'moon' : 'gochara',
            blurb: `Gochara ${t.label} casts ${drishtiName(span)} on natal ${n.label} (${n.houseLabel}).`,
          });
        }
      });
    });
  });

  const moon = transiting.find((p) => p.key === 'moon');
  const sun = transiting.find((p) => p.key === 'sun');
  const jupiter = transiting.find((p) => p.key === 'jupiter');
  const saturn = transiting.find((p) => p.key === 'saturn');
  const janmaIndex = natalChart.dasha?.janmaNakshatra?.index
    ?? nakshatraFromLongitude(natalMoon.longitude).index;
  const tara = navataraFrom(janmaIndex, nakshatraFromLongitude(moon.longitude).index);
  const dasha = computeVimshottari(
    natalMoon.longitude,
    natalChart.birth.localIso,
    snap.local.toISO()
  );
  const sadeSati = sadeSatiFromMoon(saturn.rashiId, natalMoon.rashiId);
  const saturnLine = monthLine(saturn, 'concentrating work in');
  const jupiterLine = monthLine(jupiter, 'opening room in');
  const sunLine = monthLine(sun, 'the year’s light is in');
  const moonHits = hits.filter((h) => h.transitKey === 'moon');
  const otherHits = hits.filter((h) => h.transitKey !== 'moon');
  const offsetMinutes = typeof when.timezoneOffset === 'number' ? when.timezoneOffset : snap.local.offset;

  return {
    asOf: snap.utc.toISO(),
    asOfLabel: `${snap.local.toFormat('yyyy-MM-dd HH:mm')} ${formatOffset(offsetMinutes)}`,
    localLabel: snap.local.toFormat('cccc d LLLL yyyy, HH:mm'),
    ayanamsa,
    transiting,
    hits: [...moonHits, ...otherHits].slice(0, 24),
    moonHits,
    otherHits: otherHits.slice(0, 16),
    monthStrip: { saturn: saturnLine, jupiter: jupiterLine, sun: sunLine },
    moon,
    tara,
    dasha,
    sadeSati,
    lead: buildVedicDailyLead({
      moon,
      tara,
      dasha,
      saturn: saturnLine,
      jupiter: jupiterLine,
      sun,
      sadeSati,
      hits: [...moonHits, ...otherHits],
    }),
    natalBrief: {
      lagna: natalChart.lagna ? `${natalChart.lagna.rashi.nameEn} Lagna` : '',
      sun: natalSun ? `${natalSun.rashi.nameEn} Sun` : '',
      moon: `${natalMoon.rashi.nameEn} Moon`,
    },
    engine: 'Sidereal gochara (Lahiri) to this janma kuṇḍalī. Whole-sign houses from Lagna and from the natal Moon. Vimśottarī daśā is the period clock; Chandra’s nakshatra (navatāra) leads the day; Guru and Śani frame the longer stretch. Not a Sun-sign horoscope.',
    disclaimer: natalChart.interpretations?.disclaimer
      || 'Educational Jyotish, not medical, legal, or financial advice.',
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
    executive: buildVedicExecutive({ lagnaRashi, lagnaLord, moon, sun, grahas, dasha }),
    disclaimer: 'This reading is educational Jyotish (Vedic astrology), not medical, legal, or financial advice. Whole-sign houses, Lahiri ayanāṁśa, and mean Rāhu/Ketu are used. Positions are natal-grade (VSOP87 / Meeus), not observatory ephemerides.',
  };
}

function buildVedicExecutive({ lagnaRashi, lagnaLord, moon, sun, grahas, dasha }) {
  const face = PLAIN_SIGN[lagnaRashi.rashi.key] || PLAIN_SIGN.aries;
  const heart = PLAIN_SIGN[moon.rashi.key] || PLAIN_SIGN.cancer;
  const will = PLAIN_SIGN[sun.rashi.key] || PLAIN_SIGN.leo;
  const maha = dasha.currentMaha;
  const antar = dasha.currentAntar;
  const mahaPlain = PLAIN_PERIOD[maha.key] || maha.key;
  const antarPlain = PLAIN_PERIOD[antar.key] || antar.key;

  const strong = grahas.filter((g) => ['exalted', 'moolatrikona', 'own'].includes(g.dignity.key) && !['rahu', 'ketu'].includes(g.key));
  const strained = grahas.filter((g) => ['debilitated', 'enemy'].includes(g.dignity.key) && !['rahu', 'ketu'].includes(g.key));
  const occupiedLife = grahas
    .filter((g) => [1, 4, 7, 10].includes(g.house) && !['rahu', 'ketu'].includes(g.key))
    .slice(0, 3)
    .map((g) => PLAIN_HOUSE_FOCUS[g.house]);
  const uniqueLife = [...new Set(occupiedLife)];

  const headline = `${lagnaRashi.rashi.nameEn} rising, ${moon.rashi.nameEn} Moon, ${sun.rashi.nameEn} Sun.`;
  const intro = `${face.face}. Inside, ${heart.heart}. ${will.will}. Right now you are in a ${GRAHA_BY_KEY[maha.key].nameEn} chapter of life.`;

  const points = [
    { label: 'How you come across', text: `${face.face}. The planet that steers this (your rising-sign ruler, ${lagnaLord.nameEn}) is in the area of ${PLAIN_HOUSE_FOCUS[lagnaLord.house]}. ${PLAIN_DIGNITY[lagnaLord.dignity.key] || ''}.` },
    { label: 'How you feel', text: `${heart.heart}. The Moon’s lunar mansion is ${moon.nakshatra.nameEn} — ${moon.nakshatra.keywords}.` },
    { label: 'What you are aiming at', text: `${will.will}. The Sun sits in the area of ${PLAIN_HOUSE_FOCUS[sun.house]}.` },
    { label: 'The chapter you are in', text: `A ${GRAHA_BY_KEY[maha.key].nameEn} period (until ${maha.endLabel}) emphasises ${mahaPlain}. Under that, a ${GRAHA_BY_KEY[antar.key].nameEn} subplot (until ${antar.endLabel}) brings ${antarPlain}.` },
  ];

  if (uniqueLife.length) {
    points.push({
      label: 'Where life is busy',
      text: `Planets light up ${uniqueLife.join('; ')}. Those rooms of life tend to stay active.`,
    });
  }

  const easeBits = [];
  if (strong.length) {
    easeBits.push(`${strong.map((g) => g.nameEn).join(', ')} ${strong.length === 1 ? 'is' : 'are'} in good condition (${PLAIN_DIGNITY[strong[0].dignity.key]})`);
  }
  if (strained.length) {
    easeBits.push(`${strained.map((g) => g.nameEn).join(', ')} ${strained.length === 1 ? 'asks' : 'ask'} for more patience`);
  }
  if (easeBits.length) {
    points.push({ label: 'What comes easily vs what takes work', text: `${easeBits.join('. ')}.` });
  }

  return { headline, intro, points };
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
