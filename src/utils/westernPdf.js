import { captureElement, createReport } from '@/utils/reportPdf';
import { formatOffset } from '@/utils/astrologyCalculations';

const HOUSE_SHORT = {
  1: '1st Self', 2: '2nd Values', 3: '3rd Talk', 4: '4th Home',
  5: '5th Play', 6: '6th Work', 7: '7th Partners', 8: '8th Shared',
  9: '9th Belief', 10: '10th Career', 11: '11th Friends', 12: '12th Unseen',
};

export async function downloadWesternPdf({ birth, chart }) {
  if (!chart) throw new Error('Calculate a chart first.');
  const name = (birth.name || 'Western').trim();
  const report = await createReport({
    title: 'Western natal chart',
    subtitle: 'Tropical zodiac  ·  VSOP87 / Meeus',
    fileName: `${name}_Western`,
  });

  const rising = chart.risingSign?.name;
  report.birthBand(birth, [
    rising ? `Rising ${rising}` : '',
    chart.houses ? `Houses ${chart.houses.system}${chart.houses.fallback ? ' (Equal fallback)' : ''}` : '',
    typeof birth.timezoneOffset === 'number' ? `Timezone ${formatOffset(birth.timezoneOffset)}` : '',
  ].filter(Boolean));

  const snap = await captureElement('.astro-chart-display canvas');
  if (snap) report.addImage(snap, 115, 115);

  const exec = chart.interpretations?.executive;
  if (exec) {
    report.section('In plain English');
    report.para(exec.headline, { size: 11, bold: true, after: 3 });
    report.para(exec.intro);
    (exec.points || []).forEach((p) => report.labeled(p.label, p.text));
  }

  report.section('Luminaries and Rising');
  report.labeled('Sun', chart.interpretations?.sun);
  report.labeled('Moon', chart.interpretations?.moon);
  report.labeled('Rising', chart.interpretations?.rising);

  report.section('Planetary positions');
  report.table(
    ['Planet', 'Sign', 'Degree', 'House', 'Dignity'],
    (chart.planetPositions || []).map((p) => [
      p.name + (p.retrograde ? ' R' : ''),
      p.sign,
      p.degreeLabel || '',
      HOUSE_SHORT[p.house] || String(p.house),
      p.dignity?.key || '',
    ]),
    [32, 32, 28, 50, 36],
  );

  const aspects = (chart.aspects || []).slice(0, 12);
  if (aspects.length) {
    report.section('Major aspects');
    report.table(
      ['Planet', 'Aspect', 'Planet', 'Orb', 'Note'],
      aspects.map((a) => [
        a.planet1,
        a.aspect,
        a.planet2,
        `${Number(a.orb).toFixed(1)}°`,
        a.blurb || a.nature || '',
      ]),
      [32, 26, 32, 16, 72],
    );
  }

  report.para(chart.interpretations?.disclaimer || chart.interpretations?.engine, { size: 8 });
  report.finish(`${name}_Western_Chart`);
}
