import { DateTime } from 'luxon';
import {
  createReport,
  M,
  PAGE_W,
  INK,
  MUTED,
  PURPLE,
} from '@/utils/reportPdf';

const CHANGING = [198, 40, 40];
const TRANSFORMED = [21, 101, 192];

const LINE_NAMES = {
  6: 'Old yin',
  7: 'Young yang',
  8: 'Young yin',
  9: 'Old yang',
};

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

function methodLabel(method) {
  return method === 'yarrow' ? 'Yarrow stalk' : 'Coin toss';
}

function formatWhen(stamp) {
  if (!stamp) return '';
  const dt = DateTime.fromISO(stamp);
  return dt.isValid ? dt.toFormat('d MMMM yyyy  ·  HH:mm') : String(stamp);
}

function fileSlug(question, timestamp, primary, transformed, changing) {
  const dt = timestamp ? DateTime.fromISO(timestamp) : DateTime.now();
  const day = dt.isValid ? dt.toFormat('yyyy-MM-dd') : DateTime.now().toFormat('yyyy-MM-dd');
  const ascii = (hex) => shortName(hex?.name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]+/g, '');
  const from = ascii(primary);
  const to = ascii(transformed);
  const names = changing?.length && to && to !== from ? `${from}_to_${to}` : from;
  const q = (question || '')
    .trim()
    .slice(0, 24)
    .replace(/[^\w]+/g, '_')
    .replace(/^_|_$/g, '');
  return ['IChing_Consultation', day, names, q].filter(Boolean).join('_');
}

function hexTitle(hex) {
  if (!hex) return '—';
  return joinBits(
    shortName(hex.name),
    firstPhrase(hex.translation) || hex.translation,
  );
}

function hexCardLines(hex) {
  if (!hex) return ['—'];
  return [
    hex.kingwen ? `King Wen ${hex.kingwen}` : '',
    hex.below?.name ? `Below ${shortName(hex.below.name)}` : '',
    hex.above?.name ? `Above ${shortName(hex.above.name)}` : '',
  ].filter(Boolean);
}

function changingLineTexts(hex, changingLines) {
  const raw = hex?.lines;
  if (!raw || typeof raw !== 'string' || !changingLines.length) return [];
  return changingLines.map((n) => {
    const pattern = new RegExp(
      `- \\*\\*Line ${n}:\\*\\*([^]*?)(?=(?:- \\*\\*Line \\d+:\\*\\*)|$)`,
      'i',
    );
    const match = raw.match(pattern);
    return {
      n,
      text: match && match[1] ? plain(match[1]) : 'No line text in the catalog for this position.',
    };
  });
}

function asLineValue(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function drawHexagram(pdf, originX, originY, values, highlight, rgb) {
  const w = 28;
  const thick = 2;
  const gap = 2.4;
  const yinSplit = 6.2;
  for (let visual = 0; visual < 6; visual += 1) {
    const lineIndex = 5 - visual;
    const val = asLineValue(values[lineIndex]);
    const isYin = val === 6 || val === 8;
    const marked = highlight.has(lineIndex + 1);
    const y = originY + visual * (thick + gap);
    pdf.setFillColor(...(marked ? rgb : INK));
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

function drawHexPair(report, primaryValues, transformedValues, changing) {
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
  const midX = PAGE_W / 2;
  const highlight = new Set(changing.map(Number));

  drawHexagram(pdf, leftX, y0, primaryValues, highlight, CHANGING);
  drawHexagram(pdf, rightX, y0, transformedValues, highlight, TRANSFORMED);

  pdf.setFont('DejaVu', 'normal');
  pdf.setFontSize(16);
  pdf.setTextColor(...MUTED);
  pdf.text(highlight.size ? '→' : '=', midX, y0 + figH / 2 + 1, { align: 'center' });

  pdf.setFont('DejaVu', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  for (let visual = 0; visual < 6; visual += 1) {
    const n = 6 - visual;
    const ly = y0 + visual * (thick + gap) + thick;
    pdf.text(String(n), leftX - 3.5, ly, { align: 'right' });
  }

  pdf.setFont('DejaVu', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(...PURPLE);
  pdf.text('Primary', leftX + w / 2, y0 + figH + 6, { align: 'center' });
  pdf.text('Transformed', rightX + w / 2, y0 + figH + 6, { align: 'center' });

  report.y = y0 + totalH + 2;
}

function lineRole(value, changing) {
  if (value === 6 || value === 9 || changing) return 'Changes';
  return 'Stable';
}

export async function buildConsultPdf({
  question,
  method,
  timestamp,
  primary,
  transformed,
  changingLines = [],
  primaryLines = [],
  transformedLines = [],
} = {}) {
  if (!primary) throw new Error('Finish a six-line cast before exporting.');

  const when = formatWhen(timestamp) || DateTime.now().toFormat('d MMMM yyyy  ·  HH:mm');
  const methodText = methodLabel(method);
  const changing = [...changingLines].map(Number).filter((n) => n >= 1 && n <= 6);
  const hasChange = changing.length > 0;
  const tHex = transformed || primary;
  const pLines = primaryLines.length === 6 ? primaryLines.map(asLineValue) : [];
  const tLines = transformedLines.length === 6
    ? transformedLines.map(asLineValue)
    : pLines.map((v) => {
      if (v === 6) return 7;
      if (v === 9) return 8;
      return v;
    });
  const savedName = fileSlug(question, timestamp, primary, tHex, changing);

  const report = await createReport({
    title: 'I Ching consultation',
    subtitle: `${methodText}  ·  ${when}`,
    fileName: savedName,
    footerNote: 'iChing Engine  ·  Educational reading, not a verdict',
  });

  report.section('Question');
  report.para(question?.trim() || 'No question entered', { size: 12, bold: true, after: 3 });
  report.para(`Cast with ${methodText.toLowerCase()}. Line 1 is the bottom of the hexagram.`, { size: 8, after: 2 });

  report.section('Hexagrams');
  if (pLines.length === 6) {
    drawHexPair(report, pLines, tLines.length === 6 ? tLines : pLines, changing);
    report.para(
      hasChange
        ? 'Red marks changing lines (old yin 6, old yang 9). Blue marks those positions after they change.'
        : 'No changing lines. The primary hexagram is the reading.',
      { size: 8, after: 4 },
    );
  }

  report.twoCards(
    { title: hexTitle(primary), lines: hexCardLines(primary) },
    { title: hexTitle(tHex), lines: hexCardLines(tHex) },
  );

  if (pLines.length === 6) {
    report.need(28);
    report.section('The six lines');
    report.table(
      ['Line', 'Value', 'Name', 'Role'],
      pLines.map((value, i) => [
        String(i + 1),
        String(value),
        LINE_NAMES[value] || String(value),
        lineRole(value, changing.includes(i + 1)),
      ]),
      [22, 22, 50, 84],
    );
  }

  report.need(28);
  report.section('Changing lines');
  if (!hasChange) {
    report.para('No changing lines. The primary hexagram is the reading.');
  } else {
    report.para(
      `Lines ${changing.join(', ')} change, moving ${shortName(primary.name)} toward ${shortName(tHex.name)}.`,
    );
    changingLineTexts(primary, changing).forEach((line) => {
      report.labeled(`Line ${line.n}`, line.text);
    });
  }

  report.need(36);
  report.section(`Primary  ·  ${shortName(primary.name)}`);
  if (plain(primary.summary)) report.labeled('Summary', plain(primary.summary));
  if (plain(primary.judgement)) report.labeled('Judgement', plain(primary.judgement));
  if (plain(primary.image)) report.labeled('Image', plain(primary.image));

  if (hasChange && tHex) {
    report.need(36);
    report.section(`Transformed  ·  ${shortName(tHex.name)}`);
    if (plain(tHex.summary)) report.labeled('Summary', plain(tHex.summary));
    if (plain(tHex.judgement)) report.labeled('Judgement', plain(tHex.judgement));
    if (plain(tHex.image)) report.labeled('Image', plain(tHex.image));
  }

  report.need(28);
  report.section('How to read this');
  report.para(
    method === 'yarrow'
      ? 'Yarrow-stalk odds: old yin 6 (1/16), young yang 7 (5/16), young yin 8 (7/16), old yang 9 (3/16). Changing lines (6 and 9) become the transformed hexagram.'
      : 'Three coins per line: heads 3, tails 2. Totals 6 and 9 are old (changing); 7 and 8 are young (stable). Changing lines become the transformed hexagram.',
  );
  report.para(
    'A consultation is a snapshot of the question as it was asked. Educational reading, not a verdict or a forecast of events.',
    { size: 8 },
  );

  return { report, fileName: savedName };
}

export async function downloadConsultPdf(opts = {}) {
  const { report, fileName } = await buildConsultPdf(opts);
  report.finish(fileName);
  return report;
}
