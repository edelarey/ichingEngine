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

export async function downloadIchingPdf({ state, lead }) {
  const birth = formatBirth(state);
  const name = (birth.name || 'IChing').trim();
  const report = await createReport({
    title: 'I-Ching astrology',
    subtitle: 'Pre-Heaven and Later-Heaven hexagrams',
    fileName: `${name}_IChing`,
  });

  const extras = [];
  if (state.hemisphere) extras.push(`${state.hemisphere} hemisphere`);
  const animal = state.sexagenaryCycle?.horaryBranch?.animal;
  const stem = state.sexagenaryCycle?.celestialStem?.name;
  if (animal) extras.push(`${stem || ''} ${animal} year`.trim());
  report.birthBand(birth, extras);

  if (lead) {
    report.section('In plain English');
    report.para(lead.headline, { size: 11, bold: true, after: 3 });
    report.para(lead.intro);
    (lead.points || []).forEach((p) => report.labeled(p.label, p.text));
  }

  const pre = state.preHeavenHexagram;
  const later = state.laterHeavenHexagram;
  if (pre || later) {
    report.section('Hexagrams of the birth');
    report.twoCards(
      {
        title: 'Pre-Heaven (seed)',
        lines: pre ? [pre.name, pre.translation, pre.above?.name ? `Above ${pre.above.name}` : '', pre.below?.name ? `Below ${pre.below.name}` : ''].filter(Boolean) : ['—'],
      },
      {
        title: 'Later-Heaven (unfolding)',
        lines: later ? [later.name, later.translation, later.above?.name ? `Above ${later.above.name}` : '', later.below?.name ? `Below ${later.below.name}` : ''].filter(Boolean) : ['—'],
      },
    );
  }

  report.section('Sky and ground');
  const heaven = state.heavenlyTrigram?.trigram?.name;
  const earth = state.earthlyTrigram?.trigram?.name;
  if (heaven || earth) {
    report.para(`Heavenly trigram ${heaven || '—'} with earthly trigram ${earth || '—'}.`);
  }
  if (state.timeOfBirthHexagram?.hexagram?.name) {
    report.labeled('Hour of birth', state.timeOfBirthHexagram.hexagram.name);
  }
  if (state.cycle) {
    report.labeled('Life cycle', `${state.cycle.startYear || ''} – ${state.cycle.endYear || ''}`.trim());
  }

  report.para('I-Ching astrology reads hexagrams of the birth, not planets. Educational, not a forecast of events.', { size: 8 });
  report.finish(`${name}_IChing_Astrology`);
}
