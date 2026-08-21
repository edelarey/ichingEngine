import jsPDF from 'jspdf';
import { DateTime } from 'luxon';

const M = 16;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - M * 2;
const PURPLE = [63, 50, 124];
const ACCENT = [108, 99, 255];
const CARD = [246, 247, 252];
const RULE = [220, 222, 232];
const MUTED = [90, 90, 105];
const INK = [32, 32, 40];

let fontReady = null;
let fontCache = null;

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function loadFonts() {
  if (fontCache) return fontCache;
  const [regular, bold] = await Promise.all([
    fetch('/fonts/DejaVuSans.ttf').then((r) => r.arrayBuffer()),
    fetch('/fonts/DejaVuSans-Bold.ttf').then((r) => r.arrayBuffer()),
  ]);
  fontCache = {
    regular: arrayBufferToBase64(regular),
    bold: arrayBufferToBase64(bold),
  };
  return fontCache;
}

function embedFonts(pdf, fonts) {
  pdf.addFileToVFS('DejaVuSans.ttf', fonts.regular);
  pdf.addFileToVFS('DejaVuSans-Bold.ttf', fonts.bold);
  pdf.addFont('DejaVuSans.ttf', 'DejaVu', 'normal');
  pdf.addFont('DejaVuSans-Bold.ttf', 'DejaVu', 'bold');
  pdf.setFont('DejaVu', 'normal');
}

function scoreTone(score) {
  if (typeof score !== 'number') return [90, 90, 105];
  if (score > 1) return [10, 122, 50];
  if (score < -1) return [180, 35, 24];
  return [146, 106, 34];
}

function niceDate(person) {
  if (!person?.date) return '—';
  const day = person.date instanceof Date
    ? DateTime.fromJSDate(person.date)
    : DateTime.fromISO(String(person.date));
  if (!day.isValid) return '—';
  const time = person.time && person.time !== '12:00' ? person.time : (day.toFormat('HH:mm') !== '12:00' ? day.toFormat('HH:mm') : person.time || '');
  return `${day.toFormat('d MMMM yyyy')}${time ? `  ·  ${time}` : ''}`;
}

function shortPlace(place) {
  if (!place) return 'Custom coordinates';
  const parts = String(place).split(',').map((p) => p.trim()).filter(Boolean);
  return parts.slice(0, 2).join(', ');
}

function genderLabel(g) {
  return g === 'FEMALE' ? 'Female' : 'Male';
}

function stemBranch(person) {
  const cycle = person?.yearly?.yearlyCycle?.cycle;
  if (!cycle) return '—';
  return `${cycle.celestialStem.name} (${cycle.celestialStem.element.name}) / ${cycle.horaryBranch.name} (${cycle.horaryBranch.animal})`;
}

function aspectWord(text) {
  return String(text || '')
    .replace(/conjunction/gi, 'conjunction')
    .replace(/⚹/g, 'sextile')
    .replace(/△/g, 'trine')
    .replace(/□/g, 'square')
    .replace(/☍/g, 'opposition')
    .replace(/☌/g, 'conjunction');
}

export async function downloadCompatibilityPdf({
  person1,
  person2,
  combinedLead,
  iching,
  ichingCompat,
  vedicCompat,
  westernCompat,
}) {
  const fonts = await loadFonts();
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  embedFonts(pdf, fonts);

  const n1 = (person1.name || 'Person 1').trim();
  const n2 = (person2.name || 'Person 2').trim();
  let y = 0;

  const setNormal = (size = 9) => {
    pdf.setFont('DejaVu', 'normal');
    pdf.setFontSize(size);
    pdf.setTextColor(...INK);
  };
  const setBold = (size = 11) => {
    pdf.setFont('DejaVu', 'bold');
    pdf.setFontSize(size);
    pdf.setTextColor(...INK);
  };

  const footer = () => {
    const page = pdf.internal.getNumberOfPages();
    pdf.setDrawColor(...RULE);
    pdf.setLineWidth(0.3);
    pdf.line(M, PAGE_H - 12, PAGE_W - M, PAGE_H - 12);
    setNormal(8);
    pdf.setTextColor(...MUTED);
    pdf.text('iChing Engine  ·  Educational reading, not a verdict', M, PAGE_H - 7);
    pdf.text(`Page ${page}`, PAGE_W - M, PAGE_H - 7, { align: 'right' });
  };

  const newPage = () => {
    footer();
    pdf.addPage();
    pdf.setFont('DejaVu', 'normal');
    y = M + 4;
  };

  const need = (h) => {
    if (y + h > PAGE_H - 18) newPage();
  };

  const wrap = (text, width, size = 9) => {
    pdf.setFontSize(size);
    return pdf.splitTextToSize(aspectWord(String(text || '')), width);
  };

  const para = (text, { size = 9, indent = 0, after = 2, bold = false } = {}) => {
    if (!text) return;
    const lines = wrap(text, CONTENT_W - indent, size);
    need(lines.length * 4.4 + after);
    if (bold) setBold(size);
    else setNormal(size);
    lines.forEach((line) => {
      need(6);
      pdf.text(line, M + indent, y);
      y += 4.4;
    });
    y += after;
  };

  const section = (title) => {
    need(16);
    y += 3;
    pdf.setFillColor(...ACCENT);
    pdf.rect(M, y - 3.5, 2.2, 7, 'F');
    setBold(13);
    pdf.setTextColor(...PURPLE);
    pdf.text(title, M + 5, y + 1.5);
    y += 8;
    setNormal();
  };

  // Header
  pdf.setFillColor(...PURPLE);
  pdf.rect(0, 0, PAGE_W, 32, 'F');
  pdf.setFont('DejaVu', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Relationship compatibility', PAGE_W / 2, 14, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text(`${n1}  ·  ${n2}`, PAGE_W / 2, 22, { align: 'center' });
  pdf.setFont('DejaVu', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(210, 208, 230);
  pdf.text(DateTime.now().toFormat('d MMMM yyyy'), PAGE_W / 2, 28, { align: 'center' });
  y = 40;

  // Two person cards
  const colW = (CONTENT_W - 6) / 2;
  const cardH = 38;
  need(cardH + 4);
  const drawPerson = (x, person, name) => {
    pdf.setFillColor(...CARD);
    pdf.setDrawColor(...RULE);
    pdf.roundedRect(x, y, colW, cardH, 2, 2, 'FD');
    setBold(12);
    pdf.text(name, x + 4, y + 8);
    setNormal(9);
    pdf.setTextColor(...MUTED);
    const lines = [
      niceDate(person),
      genderLabel(person.gender),
      shortPlace(person.place),
      `${Number(person.latitude).toFixed(4)}, ${Number(person.longitude).toFixed(4)}`,
    ];
    let ly = y + 14;
    lines.forEach((line) => {
      wrap(line, colW - 8, 8).slice(0, 1).forEach((l) => {
        pdf.setFontSize(8);
        pdf.text(l, x + 4, ly);
        ly += 5;
      });
    });
  };
  drawPerson(M, person1, n1);
  drawPerson(M + colW + 6, person2, n2);
  y += cardH + 8;

  // Score boxes
  const systems = [
    { title: 'I-Ching', block: ichingCompat },
    { title: 'Vedic', block: vedicCompat },
    { title: 'Western', block: westernCompat },
  ];
  const boxW = (CONTENT_W - 12) / 3;
  const boxH = 24;
  need(boxH + 6);
  systems.forEach((sys, i) => {
    const x = M + i * (boxW + 6);
    const tone = scoreTone(sys.block?.score);
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(...tone);
    pdf.setLineWidth(0.6);
    pdf.roundedRect(x, y, boxW, boxH, 2, 2, 'FD');
    pdf.setFillColor(...tone);
    pdf.rect(x, y, boxW, 2.2, 'F');
    setNormal(8);
    pdf.setTextColor(...MUTED);
    pdf.text(sys.title, x + boxW / 2, y + 8, { align: 'center' });
    setBold(11);
    pdf.setTextColor(...tone);
    const label = sys.block?.label || '—';
    pdf.text(label, x + boxW / 2, y + 16, { align: 'center' });
    if (typeof sys.block?.score === 'number' && sys.block.label !== 'Unavailable') {
      setNormal(8);
      pdf.setTextColor(...MUTED);
      pdf.text(`score ${sys.block.score}`, x + boxW / 2, y + 21, { align: 'center' });
    }
  });
  y += boxH + 6;
  pdf.setLineWidth(0.2);

  if (combinedLead) {
    section('In plain English');
    para(combinedLead.headline, { size: 11, bold: true, after: 3 });
    para(combinedLead.intro, { size: 9, after: 4 });
    (combinedLead.points || []).forEach((pt) => {
      setBold(9);
      need(10);
      pdf.setTextColor(...PURPLE);
      pdf.text(pt.label, M, y);
      y += 5;
      para(pt.text, { size: 9, indent: 3, after: 3 });
    });
  }

  section('I-Ching');
  para(ichingCompat?.headline || ichingCompat?.summary || '', { after: 3 });
  if (iching?.compatibility) {
    const c = iching.compatibility;
    const rows = [
      ['Elements', String(c.elementalCompatibility.score), c.elementalCompatibility.description],
      ['Trigrams / hexagrams', String(c.trigramHexagramCompatibility.score), c.trigramHexagramCompatibility.description],
      ['Sexagenary cycle', String(c.sexagenaryCompatibility.score), c.sexagenaryCompatibility.description],
      ['Life-stage cycles', String(c.subCycleCompatibility.score), c.subCycleCompatibility.description],
    ];
    const widths = [48, 16, CONTENT_W - 64];
    const drawCells = (cells, header, rowY) => {
      let x = M;
      let extra = 0;
      cells.forEach((cell, i) => {
        if (header) setBold(8);
        else setNormal(8);
        const lines = wrap(cell, widths[i] - 2, 8);
        lines.forEach((line, li) => pdf.text(line, x + 1, rowY + li * 4));
        extra = Math.max(extra, (lines.length - 1) * 4);
        x += widths[i];
      });
      return extra;
    };
    pdf.setFillColor(236, 236, 245);
    pdf.rect(M, y - 4, CONTENT_W, 7, 'F');
    drawCells(['Lens', 'Score', 'Reading'], true, y);
    y += 6;
    rows.forEach((row) => {
      need(10);
      const extra = drawCells(row, false, y);
      y += 6 + extra;
    });
    y += 2;
    para(`${n1}  ·  seed ${iching.person1.iching.preHeavenHexagram.name}  ·  later heaven ${iching.person1.iching.laterHeavenHexagram.name}`);
    para(`Stem / branch: ${stemBranch(iching.person1)}`);
    para(`${n2}  ·  seed ${iching.person2.iching.preHeavenHexagram.name}  ·  later heaven ${iching.person2.iching.laterHeavenHexagram.name}`);
    para(`Stem / branch: ${stemBranch(iching.person2)}`);
  }

  section('Vedic (Jyotish)');
  para(vedicCompat?.intro, { after: 3 });
  (vedicCompat?.points || []).forEach((pt) => {
    need(12);
    setBold(9);
    pdf.setTextColor(...PURPLE);
    pdf.text(pt.label, M, y);
    y += 5;
    para(pt.text, { indent: 3, after: 3.5 });
  });

  section('Western synastry');
  para(westernCompat?.intro, { after: 3 });
  const narrative = (westernCompat?.points || []).filter((pt) => !pt.label.includes('⚹') && !pt.label.includes('△') && !pt.label.includes('□') && !pt.label.includes('☍') && !pt.label.includes('☌'));
  const aspects = westernCompat?.hits || [];
  narrative.forEach((pt) => {
    need(12);
    setBold(9);
    pdf.setTextColor(...PURPLE);
    pdf.text(pt.label, M, y);
    y += 5;
    para(pt.text, { indent: 3, after: 3.5 });
  });

  if (aspects.length) {
    need(16);
    setBold(10);
    pdf.text('Major inter-aspects', M, y);
    y += 6;
    const aw = [36, 28, 36, 16, CONTENT_W - 116];
    const aHeader = ['Planet', 'Aspect', 'Planet', 'Orb', 'Note'];
    pdf.setFillColor(236, 236, 245);
    pdf.rect(M, y - 4, CONTENT_W, 7, 'F');
    let x = M;
    setBold(8);
    aHeader.forEach((h, i) => {
      pdf.text(h, x + 1, y);
      x += aw[i];
    });
    y += 6;
    aspects.forEach((hit) => {
      const noteLines = wrap(hit.blurb, aw[4] - 2, 8);
      const rowH = Math.max(6, noteLines.length * 4.2 + 2);
      need(rowH + 2);
      setNormal(8);
      const cells = [hit.a, hit.aspect, hit.b, `${hit.orb.toFixed(1)}°`, noteLines];
      x = M;
      pdf.text(cells[0], x + 1, y);
      x += aw[0];
      pdf.text(cells[1], x + 1, y);
      x += aw[1];
      pdf.text(cells[2], x + 1, y);
      x += aw[2];
      pdf.text(cells[3], x + 1, y);
      x += aw[3];
      noteLines.forEach((line, li) => {
        pdf.text(line, x + 1, y + li * 4.2);
      });
      y += rowH;
    });
  }

  y += 4;
  need(16);
  pdf.setDrawColor(...RULE);
  pdf.line(M, y, PAGE_W - M, y);
  y += 6;
  para('Educational overlay, not a verdict on whether you should be together. Vedic notes are natal-inspired, not a full Ashtakuta matching chart.', { size: 8, after: 0 });

  footer();
  const file = `${n1}_${n2}_compatibility`.replace(/[^\w.-]+/g, '_');
  pdf.save(`${file}.pdf`);
}


