import { DateTime } from 'luxon';
import { createReport } from '@/utils/reportPdf';

function asciiSlug(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]+/g, '_')
    .replace(/^_|_$/g, '');
}

function birthFrom(person, natalChart) {
  const dt = person?.birthday ? DateTime.fromISO(person.birthday) : null;
  const birth = natalChart?.birth || {};
  return {
    name: person?.name || birth.name || '',
    date: dt?.isValid ? dt.toJSDate() : birth.date,
    time: dt?.isValid ? dt.toFormat('HH:mm') : birth.time || '',
    gender: birth.gender,
    place: person?.place || birth.place,
    latitude: birth.latitude,
    longitude: birth.longitude,
  };
}

function houseNum(value, fallbackLabel) {
  if (Number.isFinite(Number(value)) && Number(value) > 0) return `H${Number(value)}`;
  const m = String(fallbackLabel || '').match(/House\s+(\d+)/i);
  return m ? `H${m[1]}` : (fallbackLabel || '');
}

function houseCompact(label) {
  return String(label || '').replace(/\s*\([^)]*\)/g, '').trim();
}

function grahaRow(p) {
  return [
    p.label || p.nameEn || p.key,
    p.rashiLabel || '',
    p.degreeLabel || '',
    houseNum(p.house, p.houseLabel),
    houseNum(p.moonHouse, p.moonHouseLabel),
    p.retrograde ? 'Vakra' : '',
  ];
}

export async function downloadVedicDailyPdf({ person, natalChart, daily, natalBrief, caption } = {}) {
  if (!daily) throw new Error('Load a birth and a day first.');
  const name = (person?.name || natalChart?.birth?.name || 'Vedic').trim();
  const day = daily.asOf
    ? DateTime.fromISO(daily.asOf).toFormat('yyyy-MM-dd')
    : DateTime.now().toFormat('yyyy-MM-dd');
  const fileName = [asciiSlug(name), 'Vedic_Daily', asciiSlug(day)].filter(Boolean).join('_');

  const report = await createReport({
    title: 'Vedic daily',
    subtitle: 'Janma kundali plus gochara  ·  Lahiri ayanamsa',
    fileName,
  });

  report.birthBand(birthFrom(person, natalChart), [
    natalBrief || '',
    caption || daily.localLabel || daily.asOfLabel || '',
    natalChart?.ayanamsaLabel ? `Ayanamsa ${natalChart.ayanamsaLabel} ${natalChart.ayanamsaFormatted || ''}` : '',
  ].filter(Boolean));

  const lead = daily.lead;
  if (lead) {
    report.section('In plain English');
    report.para(lead.headline, { size: 11, bold: true, after: 3 });
    report.para(lead.intro);
    (lead.points || []).forEach((p) => report.labeled(p.label, p.text));
  }

  const dasha = daily.dasha;
  if (dasha?.currentMaha) {
    report.need(28);
    report.section('Vimshottari dasha this day');
    report.para('The natal dasha clock evaluated at this date — the chapter, not the weather.', { size: 8, after: 3 });
    const maha = dasha.currentMaha;
    const antar = dasha.currentAntar;
    report.labeled(
      'Mahadasha',
      [
        maha.lord ? `${maha.lord.nameSa} (${maha.lord.nameEn})` : '',
        maha.startLabel && maha.endLabel ? `${maha.startLabel} – ${maha.endLabel}` : '',
        maha.lord?.dashaBlurb || '',
      ].filter(Boolean).join('. '),
    );
    if (antar) {
      report.labeled(
        'Antardasha',
        [
          antar.lord ? `${antar.lord.nameSa} (${antar.lord.nameEn})` : '',
          antar.startLabel && antar.endLabel ? `${antar.startLabel} – ${antar.endLabel}` : '',
          antar.lord?.dashaBlurb || '',
        ].filter(Boolean).join('. '),
      );
    }
  }

  const strip = daily.monthStrip;
  if (strip) {
    report.need(28);
    report.section('This month');
    report.para('Sani and Guru barely move day to day; they are the longer frame. Surya names the solar month.', { size: 8, after: 3 });
    [strip.saturn, strip.jupiter, strip.sun].filter(Boolean).forEach((body) => {
      report.labeled(body.name, body.text);
    });
  }

  if (daily.sadeSati?.text) {
    report.need(24);
    report.labeled('Sani from the natal Moon', daily.sadeSati.text);
  }

  if (daily.moon) {
    report.need(32);
    report.section("Today's Chandra");
    const moon = daily.moon;
    const tara = daily.tara;
    report.para(
      [
        `${moon.degreeLabel} ${moon.rashiLabel}`,
        moon.nakshatraLabel ? `${moon.nakshatraLabel} pada ${moon.pada}` : '',
        moon.houseLabel,
      ].filter(Boolean).join('  ·  '),
      { size: 11, bold: true, after: 3 },
    );
    if (tara) report.labeled(`${tara.sa} (${tara.en})`, tara.tone);
    if (moon.housePlain) report.labeled('From Lagna', `${moon.houseLabel} — ${moon.housePlain}`);
    if (moon.moonHousePlain) {
      report.labeled('From natal Moon', `${moon.moonHouseLabel} — ${moon.moonHousePlain}`);
    }
    if (daily.moonHits?.length) {
      report.table(
        ['Contact', 'Aspect', 'Natal house'],
        daily.moonHits.map((hit) => [
          `Chandra → ${hit.natal}`,
          hit.aspect || '',
          houseCompact(hit.natalHouseLabel),
        ]),
        [70, 40, 68],
      );
    } else {
      report.para('No Moon conjunction or 7th drishti to a natal graha in whole-sign houses today. The nakshatra and house still stand.', { size: 8 });
    }
  }

  if (daily.transiting?.length) {
    report.need(28);
    report.section('Sky that day');
    report.para('Sidereal grahas (Lahiri), whole-sign houses from Lagna and from the natal Moon.', { size: 8, after: 3 });
    report.table(
      ['Graha', 'Rashi', 'Degree', 'Lagna', 'Moon', ''],
      daily.transiting.map(grahaRow),
      [44, 40, 28, 22, 22, 22],
    );
  }

  report.need(28);
  report.section('Gochara drishti');
  report.para(
    'Whole-sign contacts: conjunction in the same house, plus classical drishti (7th for all; Mars 4/8, Jupiter 5/9, Saturn 3/10, Rahu/Ketu 5/7/9).',
    { size: 8, after: 3 },
  );
  if (daily.hits?.length) {
    report.table(
      ['Hit', 'Aspect', 'Natal house'],
      daily.hits.map((h) => [
        `t.${h.transit} → n.${h.natal}`,
        h.aspect || '',
        houseCompact(h.natalHouseLabel),
      ]),
      [80, 40, 58],
    );
  } else {
    report.para('No whole-sign gochara conjunction or drishti to natal grahas at this moment. The Moon’s house and the month strip still stand.');
  }

  report.para(daily.engine, { size: 8, after: 2 });
  report.para(daily.disclaimer, { size: 8 });
  report.finish(fileName);
  return report;
}
