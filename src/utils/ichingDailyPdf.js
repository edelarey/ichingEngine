import { DateTime } from 'luxon';
import {
  createReport,
  M,
  PAGE_W,
  INK,
  MUTED,
  PURPLE,
} from '@/utils/reportPdf';

function plain(html, max = 0) {
  if (!html) return '';
  const text = String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (max && text.length > max) return `${text.slice(0, max - 1).trim()}…`;
  return text;
}

function shortName(name) {
  if (!name) return '—';
  return String(name).split(',')[0].trim();
}

function firstPhrase(text) {
  if (!text) return '';
  return String(text).split(',')[0].trim();
}

function joinBits(...parts) {
  return parts.filter(Boolean).join('  ·  ');
}

function asciiSlug(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]+/g, '_')
    .replace(/^_|_$/g, '');
}

function hexTitle(hex) {
  if (!hex) return '—';
  return joinBits(shortName(hex.name), firstPhrase(hex.translation) || hex.translation);
}

function hexCardLines(hex, extra = []) {
  if (!hex) return extra.filter(Boolean).length ? extra.filter(Boolean) : ['—'];
  return [
    hex.kingwen ? `King Wen ${hex.kingwen}` : '',
    hex.below?.name ? `Below ${shortName(hex.below.name)}` : '',
    hex.above?.name ? `Above ${shortName(hex.above.name)}` : '',
    ...extra,
  ].filter(Boolean);
}

function valuesFromHex(hex) {
  const bits = String(hex?.binary || '');
  if (/^[01]{6}$/.test(bits)) {
    return bits.split('').map((b) => (b === '1' ? 7 : 8));
  }
  const below = Array.isArray(hex?.below?.lineArray) ? hex.below.lineArray : [];
  const above = Array.isArray(hex?.above?.lineArray) ? hex.above.lineArray : [];
  const stacked = [...below, ...above];
  if (stacked.length !== 6) return [];
  return stacked.map((line) => {
    const alt = String(line?.alternate || line?.name || '').toLowerCase();
    const yin = alt.includes('yin') || line?.binaryString === '0' || line?.name === 'yin';
    return yin ? 8 : 7;
  });
}

function drawHexagram(pdf, originX, originY, values) {
  const w = 28;
  const thick = 2;
  const gap = 2.4;
  const yinSplit = 6.2;
  for (let visual = 0; visual < 6; visual += 1) {
    const lineIndex = 5 - visual;
    const isYin = values[lineIndex] === 8 || values[lineIndex] === 6;
    const y = originY + visual * (thick + gap);
    pdf.setFillColor(...INK);
    if (isYin) {
      const seg = (w - yinSplit) / 2;
      pdf.rect(originX, y, seg, thick, 'F');
      pdf.rect(originX + seg + yinSplit, y, seg, thick, 'F');
    } else {
      pdf.rect(originX, y, w, thick, 'F');
    }
  }
  return { width: w, height: 6 * thick + 5 * gap };
}

function drawHexPair(report, earlyHex, laterHex) {
  const earlyVals = valuesFromHex(earlyHex);
  const laterVals = valuesFromHex(laterHex);
  if (!earlyVals.length && !laterVals.length) return;
  const { pdf } = report;
  const w = 28;
  const thick = 2;
  const gap = 2.4;
  const figH = 6 * thick + 5 * gap;
  const totalH = figH + 10;
  report.need(totalH + 6);
  const y0 = report.y;
  const leftX = M + 22;
  const rightX = PAGE_W - M - 22 - w;
  if (earlyVals.length) drawHexagram(pdf, leftX, y0, earlyVals);
  if (laterVals.length) drawHexagram(pdf, rightX, y0, laterVals);
  pdf.setFont('DejaVu', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(...PURPLE);
  pdf.text('Early life', leftX + w / 2, y0 + figH + 6, { align: 'center' });
  pdf.text('Later life', rightX + w / 2, y0 + figH + 6, { align: 'center' });
  pdf.setFont('DejaVu', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  const numbered = earlyVals.length ? leftX : rightX;
  for (let visual = 0; visual < 6; visual += 1) {
    const n = 6 - visual;
    const ly = y0 + visual * (thick + gap) + thick;
    pdf.text(String(n), numbered - 3.5, ly, { align: 'right' });
  }
  report.y = y0 + totalH + 2;
}

function birthPerson(natal) {
  const dt = natal?.birthDate ? DateTime.fromJSDate(new Date(natal.birthDate)) : null;
  return {
    name: natal?.name || '',
    date: dt?.isValid ? dt.toJSDate() : natal?.birthDate,
    time: dt?.isValid ? dt.toFormat('HH:mm') : '',
    gender: natal?.gender,
    place: natal?.place,
    latitude: natal?.latitude,
    longitude: natal?.longitude,
  };
}

function yearLine(stage) {
  const yearly = stage?.yearly;
  if (!yearly) return '';
  const hex = yearly.hexagram?.name ? shortName(yearly.hexagram.name) : '';
  return joinBits(
    yearly.year ? `Year ${yearly.year}` : '',
    yearly.age != null ? `age ${yearly.age}` : '',
    hex ? `year hexagram ${hex}` : '',
  );
}

export async function downloadIchingDailyPdf({ natal, early, later } = {}) {
  if (!natal?.name) throw new Error('Load a birth first.');
  const earlyHex = early?.hexagram;
  const laterHex = later?.hexagram;
  if (!earlyHex && !laterHex) throw new Error('No daily hexagram to export yet.');

  const name = natal.name.trim();
  const days = [early?.selectedDate, later?.selectedDate]
    .filter(Boolean)
    .filter((d, i, arr) => arr.indexOf(d) === i)
    .map((d) => asciiSlug(d));
  const day = days.join('_') || DateTime.now().toFormat('yyyy-MM-dd');
  const fileName = [asciiSlug(name), 'IChing_Daily', day].filter(Boolean).join('_');
  const report = await createReport({
    title: 'I-Ching daily',
    subtitle: 'Pre-Heaven and Later-Heaven daily hexagrams',
    fileName,
  });

  report.birthBand(birthPerson(natal), [
    natal.hemisphere ? `${natal.hemisphere} hemisphere` : '',
    early?.caption || '',
    later?.caption && later.caption !== early?.caption ? later.caption : '',
  ].filter(Boolean));

  report.section('Daily hexagrams');
  report.para(
    'Early life follows Pre-Heaven; later life follows Later-Heaven. Each column uses its own year and day.',
    { size: 8, after: 3 },
  );
  drawHexPair(report, earlyHex, laterHex);
  report.twoCards(
    {
      title: earlyHex ? hexTitle(earlyHex) : 'Early life',
      lines: hexCardLines(earlyHex, [yearLine(early)]),
    },
    {
      title: laterHex ? hexTitle(laterHex) : 'Later life',
      lines: hexCardLines(laterHex, [yearLine(later)]),
    },
  );

  if (earlyHex) {
    report.need(32);
    report.section(`Early life  ·  ${shortName(earlyHex.name)}`);
    if (early?.caption) report.para(early.caption, { size: 8, after: 2 });
    if (yearLine(early)) report.labeled('Year cycle', yearLine(early));
    if (early?.rangeLabel) report.labeled('Early-life span', early.rangeLabel);
    if (early?.note) report.para(early.note, { size: 8, after: 3 });
    if (plain(earlyHex.summary)) report.labeled('Summary', plain(earlyHex.summary, 520));
    if (plain(earlyHex.judgement)) report.labeled('Judgement', plain(earlyHex.judgement));
  }

  if (laterHex) {
    report.need(32);
    report.section(`Later life  ·  ${shortName(laterHex.name)}`);
    if (later?.caption) report.para(later.caption, { size: 8, after: 2 });
    if (yearLine(later)) report.labeled('Year cycle', yearLine(later));
    if (later?.rangeLabel) report.labeled('Later-life span', later.rangeLabel);
    if (later?.note) report.para(later.note, { size: 8, after: 3 });
    if (plain(laterHex.summary)) report.labeled('Summary', plain(laterHex.summary, 520));
    if (plain(laterHex.judgement)) report.labeled('Judgement', plain(laterHex.judgement));
  }

  report.need(24);
  report.section('How to read this');
  report.para(
    'Two independent daily hexagrams after Sherrill and Chu. Changing the early-life date does not clear later life, and the other way around. A daily hexagram holds about six days inside its year cycle.',
  );
  report.para(
    'I-Ching daily reads hexagrams of the birth cycles, not a coin-cast oracle. Educational, not a forecast of events.',
    { size: 8 },
  );

  report.finish(fileName);
  return report;
}
