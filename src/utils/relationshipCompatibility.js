/**
 * Pair compatibility across I-Ching (caller supplies scores), Vedic, and Western.
 * Educational synastry / koota-inspired notes — not a full Ashtakoota matching.
 */

import { ASPECT_TYPES } from '@/const/western';

function graha(chart, key) {
  return (chart?.grahas || []).find((g) => g.key === key) || null;
}

function planet(chart, key) {
  return (chart?.planetPositions || []).find((p) => p.key === key) || null;
}

function rashiDistance(fromId, toId) {
  return ((Number(toId) - Number(fromId) + 12) % 12) + 1;
}

function angleDiff(a, b) {
  let d = Math.abs(Number(a) - Number(b));
  if (d > 180) d = 360 - d;
  return d;
}

function labelScore(score) {
  if (score >= 6) return 'Strong ease';
  if (score >= 2) return 'Supportive';
  if (score <= -6) return 'High friction';
  if (score <= -2) return 'Challenging';
  return 'Mixed / neutral';
}

function houseBand(distance) {
  if ([1, 5, 9].includes(distance)) return { score: 3, label: `${distance}th from each other — a supportive trine of signs` };
  if (distance === 7) return { score: 2, label: '7th from each other — classic partnership axis' };
  if ([3, 11].includes(distance)) return { score: 1, label: `${distance}th — friendly, talkative link` };
  if ([6, 8, 12].includes(distance)) return { score: -2, label: `${distance}th — a harder house relationship (effort, not doom)` };
  return { score: 0, label: `${distance}th — practical rather than magnetic` };
}

export function calculateVedicCompatibility(chart1, chart2, name1, name2) {
  const moon1 = graha(chart1, 'moon');
  const moon2 = graha(chart2, 'moon');
  const venus1 = graha(chart1, 'venus');
  const venus2 = graha(chart2, 'venus');
  const mars1 = graha(chart1, 'mars');
  const mars2 = graha(chart2, 'mars');
  const lagna1 = chart1?.lagna;
  const lagna2 = chart2?.lagna;
  const points = [];
  let score = 0;

  if (moon1 && moon2) {
    const d = rashiDistance(moon1.rashiId, moon2.rashiId);
    const band = houseBand(d);
    score += band.score;
    points.push({
      label: 'Moon signs (Chandra rāśi)',
      text: `${name1}: ${moon1.rashiLabel}. ${name2}: ${moon2.rashiLabel}. ${band.label}.`,
    });
    if (moon1.nakshatraLabel && moon1.nakshatraLabel === moon2.nakshatraLabel) {
      score += 2;
      points.push({
        label: 'Nakshatra',
        text: `Both Moons sit in ${moon1.nakshatraLabel}. Shared lunar tempo — easy to feel understood, easy to fuse moods.`,
      });
    } else {
      points.push({
        label: 'Nakshatra',
        text: `${name1}: ${moon1.nakshatraLabel}. ${name2}: ${moon2.nakshatraLabel}. Different mental weather; curiosity beats assumption.`,
      });
    }
  }

  if (lagna1 && lagna2) {
    const d = rashiDistance(lagna1.rashi.id || lagna1.rashiId, lagna2.rashi.id || lagna2.rashiId);
    const band = houseBand(d);
    score += band.score;
    points.push({
      label: 'Lagna (Ascendant)',
      text: `${name1}: ${lagna1.rashiLabel}. ${name2}: ${lagna2.rashiLabel}. ${band.label}.`,
    });
  }

  if (venus1 && mars2) {
    const d = rashiDistance(venus1.rashiId, mars2.rashiId);
    const band = houseBand(d);
    score += Math.sign(band.score);
    points.push({
      label: 'Venus–Mars',
      text: `${name1}'s Śukra (Venus) in ${venus1.rashiLabel} to ${name2}'s Maṅgala (Mars) in ${mars2.rashiLabel}: ${band.label}.`,
    });
  }
  if (venus2 && mars1) {
    const d = rashiDistance(venus2.rashiId, mars1.rashiId);
    score += houseBand(d).score > 0 ? 1 : houseBand(d).score < 0 ? -1 : 0;
  }

  const el1 = moon1?.rashi?.element;
  const el2 = moon2?.rashi?.element;
  if (el1 && el2) {
    if (el1 === el2) {
      score += 1;
      points.push({ label: 'Lunar element', text: `Both Moons are ${el1}. Similar emotional climate.` });
    } else {
      points.push({ label: 'Lunar element', text: `${el1} Moon with ${el2} Moon — different pace of feeling.` });
    }
  }

  const dasha1 = chart1?.dasha?.currentMaha;
  const dasha2 = chart2?.dasha?.currentMaha;
  if (dasha1 && dasha2) {
    points.push({
      label: 'Current daśā',
      text: `${name1} is in a ${dasha1.lord?.nameSa || dasha1.key} mahādaśā; ${name2} in ${dasha2.lord?.nameSa || dasha2.key}. Timing colours how the bond is lived now.`,
    });
  }

  return {
    score,
    label: labelScore(score),
    headline: `Vedic: ${labelScore(score).toLowerCase()} on Moon, Lagna, and Venus–Mars.`,
    intro: 'Jyotish matching here is a natal overlay (Moon, Lagna, attraction grahas), not a full Aṣṭakūṭa points table.',
    points,
    moon1: moon1?.rashiLabel,
    moon2: moon2?.rashiLabel,
  };
}

function synastryHits(chart1, chart2) {
  const keys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
  const a = (chart1?.planetPositions || []).filter((p) => keys.includes(p.key));
  const b = (chart2?.planetPositions || []).filter((p) => keys.includes(p.key));
  const hits = [];
  a.forEach((pa) => {
    b.forEach((pb) => {
      const diff = angleDiff(pa.longitude, pb.longitude);
      ASPECT_TYPES.forEach((type) => {
        const orb = Math.abs(diff - type.angle);
        if (orb <= type.orb) {
          hits.push({
            a: pa.name,
            b: pb.name,
            keyA: pa.key,
            keyB: pb.key,
            aspect: type.name,
            symbol: type.symbol,
            nature: type.nature,
            blurb: type.blurb,
            orb,
          });
        }
      });
    });
  });
  hits.sort((x, y) => x.orb - y.orb);
  return hits;
}

function synastryWeight(hit) {
  const pair = [hit.keyA, hit.keyB].sort().join('-');
  const personal = ['moon-sun', 'mars-venus', 'moon-moon', 'sun-sun', 'venus-venus'].includes(pair)
    || pair === 'mars-sun';
  let w = 0;
  if (hit.aspect === 'trine' || hit.aspect === 'sextile') w = personal ? 2 : 1;
  else if (hit.aspect === 'conjunction') w = personal ? 2 : 1;
  else if (hit.aspect === 'square' || hit.aspect === 'opposition') w = personal ? -2 : -1;
  return w;
}

export function calculateWesternCompatibility(chart1, chart2, name1, name2) {
  const sun1 = planet(chart1, 'sun');
  const sun2 = planet(chart2, 'sun');
  const moon1 = planet(chart1, 'moon');
  const moon2 = planet(chart2, 'moon');
  const rising1 = chart1?.risingSign;
  const rising2 = chart2?.risingSign;
  const hits = synastryHits(chart1, chart2);
  let score = 0;
  hits.forEach((h) => { score += synastryWeight(h); });
  if (score > 12) score = 12;
  if (score < -12) score = -12;

  const points = [];
  if (sun1 && sun2) {
    points.push({
      label: 'Suns',
      text: `${name1} ${sun1.sign} Sun, ${name2} ${sun2.sign} Sun`
        + (sun1.signMeta?.element && sun2.signMeta?.element
          ? ` (${sun1.signMeta.element} and ${sun2.signMeta.element}).`
          : '.'),
    });
  }
  if (moon1 && moon2) {
    points.push({
      label: 'Moons',
      text: `${name1} ${moon1.sign} Moon with ${name2} ${moon2.sign} Moon — daily mood and need.`,
    });
  }
  if (rising1 && rising2) {
    points.push({
      label: 'Rising',
      text: `${rising1.name} rising meets ${rising2.name} rising: how you first occupy a room together.`,
    });
  }
  hits.slice(0, 5).forEach((h) => {
    points.push({
      label: `${h.a} ${h.symbol} ${h.b}`,
      text: `${h.a} ${h.aspect} ${h.b} (orb ${h.orb.toFixed(1)}°). ${h.blurb}`,
    });
  });
  if (!hits.length) {
    points.push({
      label: 'Aspects',
      text: 'No major inter-aspects within orb. The bond may run more on sign flavour than on tight geometry.',
    });
  }

  return {
    score,
    label: labelScore(score),
    headline: `Western: ${labelScore(score).toLowerCase()} synastry.`,
    intro: 'Tropical synastry: Suns, Moons, Risings, and the tightest major aspects between the two natal charts.',
    points,
    hits: hits.slice(0, 8),
    sun1: sun1?.sign,
    sun2: sun2?.sign,
  };
}

export function buildCombinedLead({ name1, name2, iching, vedic, western }) {
  const parts = [iching, vedic, western].filter(Boolean);
  const avg = parts.length
    ? parts.reduce((s, p) => s + (Number(p.score) || 0), 0) / parts.length
    : 0;
  const headline = `${name1} and ${name2}: ${labelScore(avg).toLowerCase()} across the three systems.`;
  const intro = 'I-Ching reads hexagrams and Chinese elements. Vedic reads Moon, Lagna, and daśā. Western reads tropical Sun, Moon, Rising, and aspects. They will not always agree — that disagreement is information.';
  const points = [];
  if (iching) {
    points.push({
      label: 'I-Ching',
      text: `${iching.label}. ${iching.summary || iching.headline || ''}`.trim(),
    });
  }
  if (vedic) {
    points.push({
      label: 'Vedic',
      text: `${vedic.label}. Moons in ${vedic.moon1 || '—'} and ${vedic.moon2 || '—'}.`,
    });
  }
  if (western) {
    points.push({
      label: 'Western',
      text: `${western.label}. Suns in ${western.sun1 || '—'} and ${western.sun2 || '—'}.`,
    });
  }
  return { headline, intro, points, combinedLabel: labelScore(avg) };
}

export function ichingSummary(compat) {
  if (!compat?.overallCompatibility) return null;
  const score = compat.overallCompatibility.score;
  return {
    score,
    label: labelScore(score),
    headline: `I-Ching: ${compat.overallCompatibility.description}.`,
    summary: [
      compat.elementalCompatibility?.description,
      compat.trigramHexagramCompatibility?.description,
      compat.sexagenaryCompatibility?.description,
    ].filter(Boolean).join(' '),
  };
}
