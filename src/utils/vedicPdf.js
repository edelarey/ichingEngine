import { captureElement, createReport } from '@/utils/reportPdf';
import { formatOffset } from '@/utils/vedicCalculations';

export async function downloadVedicPdf({ birth, chart }) {
  if (!chart) throw new Error('Calculate a chart first.');
  const name = (birth.name || 'Vedic').trim();
  const report = await createReport({
    title: 'Janma Kundali',
    subtitle: 'Vedic astrology  ·  Lahiri ayanamsa',
    fileName: `${name}_Kundali`,
  });

  report.birthBand(birth, [
    `Ayanamsa ${chart.ayanamsaLabel} ${chart.ayanamsaFormatted}`,
    `Lagna ${chart.lagna.rashiLabel} ${chart.lagna.formatted}`,
    typeof birth.timezoneOffset === 'number' ? `Timezone ${formatOffset(birth.timezoneOffset)}` : '',
  ].filter(Boolean));

  const snap = await captureElement('.kundli-wrap');
  if (snap) report.addImage(snap, 100, 100);

  const exec = chart.interpretations?.executive;
  if (exec) {
    report.section('In plain English');
    report.para(exec.headline, { size: 11, bold: true, after: 3 });
    report.para(exec.intro);
    (exec.points || []).forEach((p) => report.labeled(p.label, p.text));
  }

  report.section('Lagna, Chandra, Surya');
  report.labeled('Lagna (Ascendant)', chart.interpretations.lagna);
  report.labeled('Chandra (Moon)', chart.interpretations.moon);
  report.labeled('Surya (Sun)', chart.interpretations.sun);

  report.section('Vimshottari dasha');
  report.para(chart.interpretations.dasha);

  report.section('Grahas (planets)');
  report.table(
    ['Graha', 'Rashi', 'Degree', 'House', 'Nakshatra', 'Dignity'],
    (chart.grahas || []).map((g) => [
      `${g.nameSa} (${g.nameEn})`,
      g.rashi?.nameEn || g.rashiLabel,
      g.degreeLabel,
      String(g.house),
      `${g.nakshatra?.nameEn || g.nakshatraLabel} pāda ${g.pada}`,
      g.dignity?.key || '',
    ]),
    [38, 28, 22, 16, 48, 26],
  );

  const houses = (chart.interpretations.houses || []).filter((h) => [1, 4, 7, 10].includes(h.number));
  if (houses.length) {
    report.section('Angular houses');
    houses.forEach((h) => report.labeled(`${h.title} · ${h.rashiLabel}`, h.text));
  }

  report.para(chart.interpretations.disclaimer, { size: 8 });
  report.finish(`${name}_Kundali`);
}
