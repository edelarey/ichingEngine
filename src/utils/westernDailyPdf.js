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

function hitNote(h) {
  const bits = [
    h.inForce === true ? 'In force' : h.inForce === false ? 'Wide' : '',
    h.applying ? 'applying' : h.applying === false ? 'separating' : '',
    h.natalHouseName ? h.natalHouseName : '',
  ].filter(Boolean);
  return bits.join('  ·  ');
}

export async function downloadWesternDailyPdf({ person, natalChart, daily, natalBrief, caption } = {}) {
  if (!daily) throw new Error('Load a birth and a day first.');
  const name = (person?.name || natalChart?.birth?.name || 'Western').trim();
  const day = daily.asOf
    ? DateTime.fromISO(daily.asOf).toFormat('yyyy-MM-dd')
    : DateTime.now().toFormat('yyyy-MM-dd');
  const fileName = [asciiSlug(name), 'Western_Daily', asciiSlug(day)].filter(Boolean).join('_');

  const report = await createReport({
    title: 'Western daily',
    subtitle: 'Natal chart plus transits  ·  tropical zodiac',
    fileName,
  });

  report.birthBand(birthFrom(person, natalChart), [
    natalBrief || '',
    caption || daily.localLabel || daily.asOfLabel || '',
    natalChart?.houses
      ? `Houses ${natalChart.houses.system}${natalChart.houses.fallback ? ' (Equal fallback)' : ''}`
      : '',
  ].filter(Boolean));

  const lead = daily.lead;
  if (lead) {
    report.section('In plain English');
    report.para(lead.headline, { size: 11, bold: true, after: 3 });
    report.para(lead.intro);
    (lead.points || []).forEach((p) => report.labeled(p.label, p.text));
  }

  const strip = daily.monthStrip;
  if (strip) {
    report.need(28);
    report.section('This month');
    report.para('Saturn and Jupiter barely move day to day; they are the month’s frame. The transiting Sun names the solar month.', { size: 8, after: 3 });
    [strip.saturn, strip.jupiter, strip.sun].filter(Boolean).forEach((body) => {
      report.labeled(body.name, body.text);
    });
  }

  if (daily.moon) {
    report.need(32);
    report.section("Today's Moon");
    const moon = daily.moon;
    report.para(
      [`${moon.degreeLabel} ${moon.sign}`, moon.houseName].filter(Boolean).join('  ·  '),
      { size: 11, bold: true, after: 3 },
    );
    if (moon.housePlain) report.para(moon.housePlain);
    report.para('Nearest lunar contacts (tightest first). In force means inside the 1.5° daily orb.', { size: 8, after: 3 });
    if (daily.moonNearest?.length) {
      report.table(
        ['Contact', 'Aspect', 'Orb', 'Note'],
        daily.moonNearest.map((hit) => [
          `Moon → natal ${hit.natal}`,
          hit.aspect || '',
          `${Number(hit.orb).toFixed(2)}°`,
          hitNote(hit),
        ]),
        [52, 32, 22, 72],
      );
    }
  }

  if (daily.transiting?.length) {
    report.need(28);
    report.section('Sky that day');
    report.para('Transiting planets in tropical signs, placed in this natal house system.', { size: 8, after: 3 });
    report.table(
      ['Planet', 'Sign', 'Degree', 'Natal house', ''],
      daily.transiting.map((p) => [
        p.name || p.key,
        p.sign || '',
        p.degreeLabel || '',
        p.houseName || '',
        p.retrograde ? 'Rx' : '',
      ]),
      [36, 36, 32, 56, 18],
    );
  }

  report.need(28);
  report.section('Transit hits');
  report.para('Transit to natal, tighter daily orbs. Tightest first.', { size: 8, after: 3 });
  if (daily.hits?.length) {
    report.table(
      ['Hit', 'Aspect', 'Orb', 'Note'],
      daily.hits.map((h) => [
        `t.${h.transit} → n.${h.natal}`,
        h.aspect || '',
        `${Number(h.orb).toFixed(2)}°`,
        hitNote(h),
      ]),
      [52, 32, 22, 72],
    );
  } else {
    report.para('No transit-to-natal aspects inside the tight daily orbs at this moment. The Moon’s house and the month strip still stand.');
  }

  report.para(daily.engine, { size: 8, after: 2 });
  report.para(daily.disclaimer, { size: 8 });
  report.finish(fileName);
  return report;
}
