/**
 * Fixture: dated gochara vs natal, Chandra-led daily, Guru/Śani month houses, daśā at date.
 * Run: node scripts/verify-vedic-daily.js
 */
const path = require('path');
const { createJiti } = require('jiti');

const jiti = createJiti(__filename, {
  alias: { '@': path.resolve(__dirname, '../src') },
});

async function main() {
  const { DateTime } = require('luxon');
  const { calculateVedicChart, calculateVedicDaily } = await jiti.import('../src/utils/vedicCalculations.js');

  const natal = calculateVedicChart({
    name: 'Fixture',
    date: new Date('1971-03-03T12:00:00'),
    time: '12:00',
    latitude: -33.8688,
    longitude: 151.2093,
    timezoneOffset: 600,
  });

  if (!natal.grahas || natal.grahas.length !== 9) {
    throw new Error('Natal kundli missing grahas');
  }
  if (!natal.dasha || !natal.dasha.currentMaha) {
    throw new Error('Natal daśā should still be attached');
  }

  const daily = calculateVedicDaily(natal, {
    date: DateTime.fromISO('2026-08-28', { zone: 'UTC+10:00' }).toJSDate(),
    time: '12:00',
    timezoneOffset: 600,
  });

  if (!daily.moon || daily.moon.key !== 'moon') {
    throw new Error('Daily reading must be Chandra-led');
  }
  if (!daily.tara || !daily.tara.sa) {
    throw new Error('Navatāra missing');
  }
  if (!daily.dasha || !daily.dasha.currentMaha || !daily.dasha.currentAntar) {
    throw new Error('Daśā at the chosen date missing');
  }
  if (!daily.monthStrip.saturn || !daily.monthStrip.jupiter) {
    throw new Error('Month strip needs Śani and Guru');
  }
  if (!daily.lead || !/Chandra in /.test(daily.lead.headline)) {
    throw new Error('Lead headline should name transiting Chandra');
  }
  if (daily.transiting.length !== 9) {
    throw new Error(`Expected 9 transiting grahas, got ${daily.transiting.length}`);
  }
  daily.transiting.forEach((p) => {
    if (!(p.house >= 1 && p.house <= 12)) {
      throw new Error(`${p.label} missing Lagna house`);
    }
    if (!(p.moonHouse >= 1 && p.moonHouse <= 12)) {
      throw new Error(`${p.label} missing Moon house`);
    }
  });

  const later = calculateVedicDaily(natal, {
    date: DateTime.fromISO('2026-09-28', { zone: 'UTC+10:00' }).toJSDate(),
    time: '12:00',
    timezoneOffset: 600,
  });
  if (later.moon.rashiId === daily.moon.rashiId && Math.abs(later.moon.longitude - daily.moon.longitude) < 5) {
    throw new Error('Chandra should have moved substantially a month later');
  }

  console.log('1971-03-03 Sydney natal → 2026-08-28 12:00 AEST');
  console.log('  Lead:', daily.lead.headline);
  console.log('  Nakshatra:', daily.moon.nakshatraLabel, 'pāda', daily.moon.pada);
  console.log('  Navatāra:', daily.tara.sa, `(${daily.tara.en})`);
  console.log('  Mahādaśā:', daily.dasha.currentMaha.lord.nameEn, daily.dasha.currentMaha.startLabel, '–', daily.dasha.currentMaha.endLabel);
  console.log('  Śani:', daily.monthStrip.saturn.rashiLabel, daily.monthStrip.saturn.houseLabel);
  console.log('  Guru:', daily.monthStrip.jupiter.rashiLabel, daily.monthStrip.jupiter.houseLabel);
  console.log('  Hits:', daily.hits.length);
  console.log('OK: Vedic daily gochara looks distinct from the natal snapshot.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
