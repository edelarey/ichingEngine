import { createReport, genderLabel, niceDate, shortPlace, scoreTone } from '@/utils/reportPdf';

function stemBranch(person) {
  const cycle = person?.yearly?.yearlyCycle?.cycle;
  if (!cycle) return '—';
  return `${cycle.celestialStem.name} (${cycle.celestialStem.element.name}) / ${cycle.horaryBranch.name} (${cycle.horaryBranch.animal})`;
}

function personLines(person) {
  return [
    niceDate(person),
    genderLabel(person.gender),
    shortPlace(person.place),
    `${Number(person.latitude).toFixed(4)}, ${Number(person.longitude).toFixed(4)}`,
  ];
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
  const n1 = (person1.name || 'Person 1').trim();
  const n2 = (person2.name || 'Person 2').trim();
  const report = await createReport({
    title: 'Relationship compatibility',
    subtitle: `${n1}  ·  ${n2}`,
    fileName: `${n1}_${n2}_compatibility`,
  });

  report.twoCards(
    { title: n1, lines: personLines(person1) },
    { title: n2, lines: personLines(person2) },
  );

  report.metricRow([
    { title: 'I-Ching', block: ichingCompat, label: ichingCompat?.label, score: ichingCompat?.score, color: scoreTone(ichingCompat?.score) },
    { title: 'Vedic', block: vedicCompat, label: vedicCompat?.label, score: vedicCompat?.score, color: scoreTone(vedicCompat?.score) },
    { title: 'Western', block: westernCompat, label: westernCompat?.label, score: westernCompat?.score, color: scoreTone(westernCompat?.score) },
  ]);

  if (combinedLead) {
    report.section('In plain English');
    report.para(combinedLead.headline, { size: 11, bold: true, after: 3 });
    report.para(combinedLead.intro, { after: 4 });
    (combinedLead.points || []).forEach((pt) => report.labeled(pt.label, pt.text));
  }

  report.section('I-Ching');
  report.para(ichingCompat?.headline || ichingCompat?.summary || '');
  if (iching?.compatibility) {
    const c = iching.compatibility;
    report.table(
      ['Lens', 'Score', 'Reading'],
      [
        ['Elements', String(c.elementalCompatibility.score), c.elementalCompatibility.description],
        ['Trigrams / hexagrams', String(c.trigramHexagramCompatibility.score), c.trigramHexagramCompatibility.description],
        ['Sexagenary cycle', String(c.sexagenaryCompatibility.score), c.sexagenaryCompatibility.description],
        ['Life-stage cycles', String(c.subCycleCompatibility.score), c.subCycleCompatibility.description],
      ],
      [48, 16, 114],
    );
    report.para(`${n1}  ·  seed ${iching.person1.iching.preHeavenHexagram.name}  ·  later heaven ${iching.person1.iching.laterHeavenHexagram.name}`);
    report.para(`Stem / branch: ${stemBranch(iching.person1)}`);
    report.para(`${n2}  ·  seed ${iching.person2.iching.preHeavenHexagram.name}  ·  later heaven ${iching.person2.iching.laterHeavenHexagram.name}`);
    report.para(`Stem / branch: ${stemBranch(iching.person2)}`);
  }

  report.section('Vedic (Jyotish)');
  report.para(vedicCompat?.intro);
  (vedicCompat?.points || []).forEach((pt) => report.labeled(pt.label, pt.text));

  report.section('Western synastry');
  report.para(westernCompat?.intro);
  const narrative = (westernCompat?.points || []).filter((pt) =>
    !/[⚹△□☍☌]/.test(pt.label)
  );
  narrative.forEach((pt) => report.labeled(pt.label, pt.text));
  const aspects = westernCompat?.hits || [];
  if (aspects.length) {
    report.para('Major inter-aspects', { bold: true, size: 10, after: 3 });
    report.table(
      ['Planet', 'Aspect', 'Planet', 'Orb', 'Note'],
      aspects.map((hit) => [hit.a, hit.aspect, hit.b, `${hit.orb.toFixed(1)}°`, hit.blurb]),
      [32, 26, 32, 16, 72],
    );
  }

  report.para('Educational overlay, not a verdict on whether you should be together. Vedic notes are natal-inspired, not a full Ashtakuta matching chart.', { size: 8, after: 0 });
  report.finish(`${n1}_${n2}_compatibility`);
}
