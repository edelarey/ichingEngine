import { createReport } from '@/utils/reportPdf';
import { DateTime } from 'luxon';

function formatBirth(state) {
  if (!state?.birthDate) return { name: state?.name || '', date: '', time: '', gender: state?.gender, place: state?.place, latitude: state?.latitude, longitude: state?.longitude };
  const dt = state.birthDate instanceof Date
    ? DateTime.fromJSDate(state.birthDate)
    : DateTime.fromISO(String(state.birthDate));
  return {
    name: state.name || '',
    date: dt.isValid ? dt.toJSDate() : state.birthDate,
    time: dt.isValid ? dt.toFormat('HH:mm') : '',
    gender: state.gender,
    place: state.place,
    latitude: state.latitude,
    longitude: state.longitude,
  };
}

function birthDateTime(state) {
  if (!state?.birthDate) return null;
  const dt = state.birthDate instanceof Date
    ? DateTime.fromJSDate(state.birthDate)
    : DateTime.fromISO(String(state.birthDate));
  return dt.isValid ? dt : null;
}

function ordinal(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function firstPhrase(text) {
  if (!text) return '';
  return String(text).split(',')[0].trim();
}

function plain(html, max = 0) {
  if (!html) return '';
  const text = String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (max && text.length > max) return `${text.slice(0, max - 1).trim()}…`;
  return text;
}

function joinBits(...parts) {
  return parts.filter(Boolean).join('  ·  ');
}

function controllingCaption(cl) {
  if (!cl) return '';
  const bits = [
    cl.trigram ? `${cl.trigram} trigram` : '',
    cl.linePosition ? `${String(cl.linePosition).toLowerCase()} line` : '',
    cl.line?.name ? `(${cl.line.name})` : '',
  ].filter(Boolean);
  return bits.length ? `Controlling line: ${bits.join(', ')}` : '';
}

function ageBands(hex) {
  const below = Array.isArray(hex?.below?.lineArray) ? hex.below.lineArray : [];
  const above = Array.isArray(hex?.above?.lineArray) ? hex.above.lineArray : [];
  const ranges = [...below, ...above]
    .map((line) => line?.yearRange)
    .filter((range) => Array.isArray(range) && range.length >= 2);
  if (!ranges.length) return '';
  return `Age bands: ${ranges.map((r) => `${r[0]}–${r[1]}`).join(', ')}`;
}

function hexLines(hex, { controlling, note } = {}) {
  if (!hex) return ['—'];
  const lines = [
    joinBits(hex.name, hex.symbol, hex.hexagram),
    firstPhrase(hex.translation) || hex.translation || '',
  ];
  if (hex.above?.name) lines.push(`Above ${joinBits(hex.above.name, hex.above.trigram)}`);
  if (hex.below?.name) lines.push(`Below ${joinBits(hex.below.name, hex.below.trigram)}`);
  const control = controllingCaption(controlling || hex.controllingLine);
  if (control) lines.push(control);
  const ages = ageBands(hex);
  if (ages) lines.push(ages);
  if (note) lines.push(note);
  return lines.filter(Boolean);
}

function trigramLines(tri) {
  if (!tri) return ['—'];
  return [
    joinBits(tri.name, tri.symbol, tri.trigram),
    firstPhrase(tri.description?.translation) || tri.description?.translation || '',
    tri.description?.bodyPart ? `Body: ${tri.description.bodyPart}` : '',
    tri.description?.nature ? `Nature: ${tri.description.nature}` : '',
    tri.description?.attribute ? `Attribute: ${tri.description.attribute}` : '',
  ].filter(Boolean);
}

function stemCard(cycle) {
  const stem = cycle?.celestialStem;
  if (!stem) return { title: 'Celestial stem', lines: ['—'] };
  const tri = stem.trigram;
  return {
    title: 'Celestial stem',
    lines: [
      joinBits(stem.name, stem.symbol),
      joinBits(stem.element?.name, stem.element?.bodyPart),
      tri ? joinBits(tri.name, tri.trigram, firstPhrase(tri.description?.translation)) : '',
    ].filter(Boolean),
  };
}

function branchCard(cycle) {
  const branch = cycle?.horaryBranch;
  if (!branch) return { title: 'Horary branch', lines: ['—'] };
  const tris = Array.isArray(branch.element?.trigrams) ? branch.element.trigrams.filter(Boolean) : [];
  return {
    title: 'Horary branch',
    lines: [
      joinBits(branch.name, branch.symbol, branch.animal),
      joinBits(branch.element?.name, branch.element?.bodyPart),
      ...tris.map((tri) => joinBits(tri.name, tri.trigram, firstPhrase(tri.description?.translation))),
    ].filter(Boolean),
  };
}

function hexSummary(hex) {
  return plain(hex?.summary, 420);
}

export async function downloadIchingPdf({ state, lead }) {
  const birth = formatBirth(state);
  const name = (birth.name || 'IChing').trim();
  const dt = birthDateTime(state);
  const report = await createReport({
    title: 'I-Ching astrology',
    subtitle: 'Pre-Heaven, Later-Heaven, and the sexagenary cycles',
    fileName: `${name}_IChing`,
  });

  const extras = [];
  if (state.hemisphere) extras.push(`${state.hemisphere} hemisphere`);
  if (state.cycle?.cycleName) {
    extras.push(`${state.cycle.cycleName} (${state.cycle.startYear || ''}–${state.cycle.endYear || ''})`.trim());
  }
  const yearStem = state.sexagenaryCycle?.celestialStem?.name;
  const yearAnimal = state.sexagenaryCycle?.horaryBranch?.animal;
  if (yearAnimal) extras.push(`${yearStem || ''} ${yearAnimal} year`.trim());
  report.birthBand(birth, extras);

  if (lead) {
    report.section('In plain English');
    report.para(lead.headline, { size: 11, bold: true, after: 3 });
    report.para(lead.intro);
    (lead.points || []).forEach((p) => report.labeled(p.label, p.text));
  }

  const pre = state.preHeavenHexagram;
  const later = state.laterHeavenHexagram;
  const timeHex = state.timeOfBirthHexagram?.hexagram;
  report.section('Hexagrams of the birth');
  report.twoCards(
    { title: 'Pre-Heaven (seed)', lines: hexLines(pre) },
    { title: 'Later-Heaven (unfolding)', lines: hexLines(later) },
  );
  if (pre && hexSummary(pre)) report.labeled('Pre-Heaven summary', hexSummary(pre));
  if (later && hexSummary(later)) report.labeled('Later-Heaven summary', hexSummary(later));
  if (timeHex) {
    report.twoCards(
      { title: 'Time of birth', lines: hexLines(timeHex) },
      { title: 'Hour colour', lines: ['The time-of-birth hexagram colours the “when” of the birth, not the whole story.'] },
    );
    if (hexSummary(timeHex)) report.labeled('Time-of-birth summary', hexSummary(timeHex));
  }

  report.section('Heaven and Earth');
  report.twoCards(
    { title: 'Heavenly trigram', lines: trigramLines(state.heavenlyTrigram?.trigram) },
    { title: 'Earthly trigram', lines: trigramLines(state.earthlyTrigram?.trigram) },
  );

  const yearLabel = dt ? String(dt.year) : '';
  const monthLabel = dt ? dt.toFormat('MMMM') : '';
  const dayLabel = dt ? `${dt.toFormat('cccc d')}${ordinal(dt.day)}` : '';
  report.section('This year, month, and day');
  report.table(
    ['Period', 'Stem', 'Branch', 'Animal', 'Element'],
    [
      [
        yearLabel ? `Year ${yearLabel}` : 'Year',
        state.sexagenaryCycle?.celestialStem?.name || '—',
        state.sexagenaryCycle?.horaryBranch?.name || '—',
        state.sexagenaryCycle?.horaryBranch?.animal || '—',
        state.sexagenaryCycle?.celestialStem?.element?.name || '—',
      ],
      [
        monthLabel ? `Month ${monthLabel}` : 'Month',
        state.birthStemsandBranches?.celestialStem?.name || '—',
        state.birthStemsandBranches?.horaryBranch?.name || '—',
        state.birthStemsandBranches?.horaryBranch?.animal || '—',
        state.birthStemsandBranches?.celestialStem?.element?.name || '—',
      ],
      [
        dayLabel ? `Day ${dayLabel}` : 'Day',
        state.dailyStemsandBranches?.celestialStem?.name || '—',
        state.dailyStemsandBranches?.horaryBranch?.name || '—',
        state.dailyStemsandBranches?.horaryBranch?.animal || '—',
        state.dailyStemsandBranches?.celestialStem?.element?.name || '—',
      ],
    ],
    [36, 32, 32, 28, 50],
  );

  const earlySub = state.selectedPreHeavenBirthSubCycle;
  const laterSub = state.selectedLaterHeavenBirthSubCycle;
  const earlyHex = earlySub?.hexagram;
  const laterHex = state.laterHeavenBirthSubCycleHexagram || laterSub?.hexagram;
  report.section('Life stages (selected)');
  report.para(
    'Early life follows the Pre-Heaven hexagram; later life follows Later-Heaven. This export uses the year currently selected on the page.',
    { size: 8, after: 3 },
  );
  report.twoCards(
    {
      title: earlySub
        ? `Early life · ${earlySub.year} · age ${earlySub.age}`
        : 'Early life',
      lines: hexLines(earlyHex, {
        controlling: earlySub?.controllingLine,
        note: earlySub ? 'Before transformation of this year’s line.' : '',
      }),
    },
    {
      title: laterSub
        ? `Later life · ${laterSub.year} · age ${laterSub.age}`
        : 'Later life',
      lines: hexLines(laterHex, {
        controlling: laterSub?.controllingLine,
        note: laterSub ? 'Before transformation of this year’s line.' : '',
      }),
    },
  );
  if (earlyHex && hexSummary(earlyHex)) report.labeled('Early-life summary', hexSummary(earlyHex));
  if (laterHex && hexSummary(laterHex)) report.labeled('Later-life summary', hexSummary(laterHex));

  const earlyDailyHex = state.preHeavenDailyCycleHexagram;
  const laterDailyHex = state.laterHeavenDailyCycleHexagram;
  if (earlyDailyHex || laterDailyHex || state.selectedPreHeavenDailyCycleDate || state.selectedLaterHeavenDailyCycleDate) {
    report.section('Daily cycles (selected)');
    report.twoCards(
      {
        title: state.selectedPreHeavenDailyCycleDate
          ? `Daily early life · ${state.selectedPreHeavenDailyCycleDate}`
          : 'Daily early life',
        lines: hexLines(earlyDailyHex),
      },
      {
        title: state.selectedLaterHeavenDailyCycleDate
          ? `Daily later life · ${state.selectedLaterHeavenDailyCycleDate}`
          : 'Daily later life',
        lines: hexLines(laterDailyHex),
      },
    );
    if (earlyDailyHex && hexSummary(earlyDailyHex)) {
      report.labeled('Daily early-life summary', hexSummary(earlyDailyHex));
    }
    if (laterDailyHex && hexSummary(laterDailyHex)) {
      report.labeled('Daily later-life summary', hexSummary(laterDailyHex));
    }
  }

  report.section('Stem and branch');
  report.para(`Yearly stem and branch · ${yearLabel}`, { size: 10, bold: true, after: 2 });
  report.twoCards(stemCard(state.sexagenaryCycle), branchCard(state.sexagenaryCycle));
  report.para(`Monthly stem and branch · ${monthLabel}`, { size: 10, bold: true, after: 2 });
  report.twoCards(stemCard(state.birthStemsandBranches), branchCard(state.birthStemsandBranches));
  report.para(`Daily stem and branch · ${dayLabel}`, { size: 10, bold: true, after: 2 });
  report.twoCards(stemCard(state.dailyStemsandBranches), branchCard(state.dailyStemsandBranches));

  report.section('How to read this');
  report.para('W. K. Chu and W. A. Sherrill’s The Astrology of I Ching (1976) maps a birth onto the Ho Map: a Pre-Heaven hexagram as the inner seed, then a Later-Heaven hexagram by changing the controlling line — the line that “owns” the chart.');
  report.para('Heaven and Earth are the two trigrams stacked in those hexagrams. The sexagenary cycle (ten stems and twelve branches, sixty pairs) colours the year, month, and day; the animal is a flavour of that pair, not a personality test on its own.');
  report.para('Life-stage hexagrams walk the lines of Pre-Heaven (early) and Later-Heaven (later) year by year. This page is a natal reading, not a coin-cast oracle and not a forecast of events.');

  report.para('I-Ching astrology reads hexagrams of the birth, not planets. Educational, not a forecast of events.', { size: 8 });
  report.finish(`${name}_IChing_Astrology`);
}
