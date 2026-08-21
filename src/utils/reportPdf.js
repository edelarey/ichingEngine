import jsPDF from 'jspdf';
import { DateTime } from 'luxon';

export const M = 16;
export const PAGE_W = 210;
export const PAGE_H = 297;
export const CONTENT_W = PAGE_W - M * 2;
export const PURPLE = [63, 50, 124];
export const ACCENT = [108, 99, 255];
export const CARD = [246, 247, 252];
export const RULE = [220, 222, 232];
export const MUTED = [90, 90, 105];
export const INK = [32, 32, 40];

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

export function pdfSafe(text) {
  return String(text ?? '')
    .replace(/⚹/g, 'sextile')
    .replace(/△/g, 'trine')
    .replace(/□/g, 'square')
    .replace(/☍/g, 'opposition')
    .replace(/☌/g, 'conjunction');
}

export function niceDate(person) {
  if (!person?.date) return '—';
  const day = person.date instanceof Date
    ? DateTime.fromJSDate(person.date)
    : DateTime.fromISO(String(person.date));
  if (!day.isValid) return '—';
  const time = person.time || '';
  return `${day.toFormat('d MMMM yyyy')}${time ? `  ·  ${time}` : ''}`;
}

export function shortPlace(place) {
  if (!place) return 'Custom coordinates';
  return String(place).split(',').map((p) => p.trim()).filter(Boolean).slice(0, 2).join(', ');
}

export function genderLabel(g) {
  if (!g) return '';
  const s = String(g).toUpperCase();
  if (s === 'FEMALE') return 'Female';
  if (s === 'MALE') return 'Male';
  return String(g);
}

export function scoreTone(score) {
  if (typeof score !== 'number') return MUTED;
  if (score > 1) return [10, 122, 50];
  if (score < -1) return [180, 35, 24];
  return [146, 106, 34];
}

export async function captureElement(selector) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return null;
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2, logging: false, useCORS: true });
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Could not capture element for PDF', err);
    return null;
  }
}

export async function createReport({ title, subtitle = '', fileName, footerNote = 'iChing Engine  ·  Educational reading, not a verdict' }) {
  const fonts = await loadFonts();
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  embedFonts(pdf, fonts);
  let y = 40;

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
    pdf.text(footerNote, M, PAGE_H - 7);
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
    return pdf.splitTextToSize(pdfSafe(String(text || '')), width);
  };

  const para = (text, { size = 9, indent = 0, after = 2, bold = false, color = INK } = {}) => {
    if (!text) return;
    const lines = wrap(text, CONTENT_W - indent, size);
    need(lines.length * 4.4 + after);
    if (bold) setBold(size);
    else setNormal(size);
    pdf.setTextColor(...color);
    lines.forEach((line) => {
      need(6);
      pdf.text(line, M + indent, y);
      y += 4.4;
    });
    y += after;
  };

  const section = (heading) => {
    need(16);
    y += 3;
    pdf.setFillColor(...ACCENT);
    pdf.rect(M, y - 3.5, 2.2, 7, 'F');
    setBold(13);
    pdf.setTextColor(...PURPLE);
    pdf.text(heading, M + 5, y + 1.5);
    y += 8;
    setNormal();
  };

  const labeled = (label, text) => {
    if (!text) return;
    need(12);
    setBold(9);
    pdf.setTextColor(...PURPLE);
    pdf.text(label, M, y);
    y += 5;
    para(text, { indent: 3, after: 3.5 });
  };

  const table = (headers, rows, widths) => {
    const cols = widths || headers.map(() => CONTENT_W / headers.length);
    need(10);
    pdf.setFillColor(236, 236, 245);
    pdf.rect(M, y - 4, CONTENT_W, 7, 'F');
    let x = M;
    setBold(8);
    headers.forEach((h, i) => {
      pdf.text(h, x + 1, y);
      x += cols[i];
    });
    y += 6;
    rows.forEach((row) => {
      const cellLines = row.map((cell, i) => wrap(cell, cols[i] - 2, 8));
      const extra = Math.max(0, ...cellLines.map((ls) => (ls.length - 1) * 4));
      need(7 + extra);
      setNormal(8);
      x = M;
      cellLines.forEach((lines, i) => {
        lines.forEach((line, li) => pdf.text(line, x + 1, y + li * 4));
        x += cols[i];
      });
      y += 6 + extra;
    });
    y += 2;
  };

  const metricRow = (items) => {
    const n = items.length;
    const gap = 6;
    const boxW = (CONTENT_W - gap * (n - 1)) / n;
    const boxH = 24;
    need(boxH + 6);
    items.forEach((item, i) => {
      const x = M + i * (boxW + gap);
      const tone = item.color || scoreTone(item.score);
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(...tone);
      pdf.setLineWidth(0.6);
      pdf.roundedRect(x, y, boxW, boxH, 2, 2, 'FD');
      pdf.setFillColor(...tone);
      pdf.rect(x, y, boxW, 2.2, 'F');
      setNormal(8);
      pdf.setTextColor(...MUTED);
      pdf.text(item.title, x + boxW / 2, y + 8, { align: 'center' });
      setBold(item.label && item.label.length > 16 ? 9 : 11);
      pdf.setTextColor(...tone);
      const labelLines = wrap(item.label || '—', boxW - 6, item.label && item.label.length > 16 ? 9 : 11);
      pdf.text(labelLines[0], x + boxW / 2, y + 16, { align: 'center' });
      if (typeof item.score === 'number' && item.label !== 'Unavailable') {
        setNormal(8);
        pdf.setTextColor(...MUTED);
        pdf.text(`score ${item.score}`, x + boxW / 2, y + 21, { align: 'center' });
      }
    });
    y += boxH + 6;
    pdf.setLineWidth(0.2);
  };

  const twoCards = (left, right) => {
    const colW = (CONTENT_W - 6) / 2;
    const lineH = 5;
    const leftLines = left.lines || [];
    const rightLines = right.lines || [];
    const cardH = Math.max(28, 12 + Math.max(leftLines.length, rightLines.length) * lineH);
    need(cardH + 4);
    const draw = (x, card) => {
      pdf.setFillColor(...CARD);
      pdf.setDrawColor(...RULE);
      pdf.roundedRect(x, y, colW, cardH, 2, 2, 'FD');
      setBold(12);
      pdf.text(card.title, x + 4, y + 8);
      setNormal(8);
      pdf.setTextColor(...MUTED);
      let ly = y + 14;
      (card.lines || []).forEach((line) => {
        wrap(line, colW - 8, 8).slice(0, 1).forEach((l) => {
          pdf.text(l, x + 4, ly);
          ly += lineH;
        });
      });
    };
    draw(M, left);
    draw(M + colW + 6, right);
    y += cardH + 8;
  };

  const birthBand = (person, extras = []) => {
    const lines = [
      niceDate(person),
      [genderLabel(person.gender), shortPlace(person.place)].filter(Boolean).join('  ·  '),
      `${Number(person.latitude) || 0}, ${Number(person.longitude) || 0}`,
      ...extras,
    ].filter(Boolean);
    need(18 + lines.length * 5);
    pdf.setFillColor(...CARD);
    pdf.setDrawColor(...RULE);
    const h = 12 + lines.length * 5;
    pdf.roundedRect(M, y, CONTENT_W, h, 2, 2, 'FD');
    setBold(12);
    pdf.text(person.name || 'Unnamed', M + 4, y + 8);
    setNormal(8);
    pdf.setTextColor(...MUTED);
    let ly = y + 14;
    lines.forEach((line) => {
      wrap(line, CONTENT_W - 8, 8).slice(0, 1).forEach((l) => {
        pdf.text(l, M + 4, ly);
        ly += 5;
      });
    });
    y += h + 6;
  };

  const addImage = (dataUrl, maxW = 110, maxH = 110) => {
    if (!dataUrl) return;
    const w = maxW;
    const h = maxH;
    need(h + 8);
    const x = M + (CONTENT_W - w) / 2;
    pdf.addImage(dataUrl, 'PNG', x, y, w, h);
    y += h + 8;
  };

  // Header
  pdf.setFillColor(...PURPLE);
  pdf.rect(0, 0, PAGE_W, 32, 'F');
  pdf.setFont('DejaVu', 'bold');
  pdf.setFontSize(subtitle ? 16 : 18);
  pdf.setTextColor(255, 255, 255);
  pdf.text(title, PAGE_W / 2, subtitle ? 13 : 16, { align: 'center' });
  if (subtitle) {
    pdf.setFontSize(12);
    pdf.text(subtitle, PAGE_W / 2, 21, { align: 'center' });
  }
  pdf.setFont('DejaVu', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(210, 208, 230);
  pdf.text(DateTime.now().toFormat('d MMMM yyyy'), PAGE_W / 2, 28, { align: 'center' });
  y = 40;

  const finish = (name) => {
    y += 4;
    need(16);
    pdf.setDrawColor(...RULE);
    pdf.line(M, y, PAGE_W - M, y);
    y += 6;
    footer();
    const safe = String(name || fileName || 'reading').replace(/[^\w.-]+/g, '_');
    pdf.save(`${safe}.pdf`);
  };

  return {
    pdf,
    need,
    para,
    section,
    labeled,
    table,
    metricRow,
    twoCards,
    birthBand,
    addImage,
    finish,
    setNormal,
    setBold,
    wrap,
    newPage,
    get y() { return y; },
    set y(v) { y = v; },
  };
}
