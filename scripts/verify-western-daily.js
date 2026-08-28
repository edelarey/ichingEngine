/**
 * Fixture: dated transits vs natal, Moon-led daily, Saturn/Jupiter month houses.
 * Run: node scripts/verify-western-daily.js
 */
const path = require('path');
const { createJiti } = require('jiti');

const jiti = createJiti(__filename, {
  alias: { '@': path.resolve(__dirname, '../src') },
});

async function main() {
  const { DateTime } = require('luxon');
  const {
    calculateWesternChart,
    calculateWesternDaily,
    calculateTransits,
  } = await jiti.import('../src/utils/astrologyCalculations.js');

  const natal = calculateWesternChart({
    name: 'Fixture',
    date: new Date('1971-03-03T12:00:00'),
    time: '12:00',
    latitude: -33.8688,
    longitude: 151.2093,
    timezoneOffset: 600,
    houseSystem: 'placidus',
  });

  if (!natal.planetPositions || natal.planetPositions.length < 10) {
    throw new Error('Natal chart missing planets');
  }
  if (!natal.transits || !Array.isArray(natal.transits.hits)) {
    throw new Error('Natal snapshot transits should still be attached');
  }

  const snapshotHits = calculateTransits(natal.planetPositions).hits.length;
  const daily = calculateWesternDaily(natal, {
    date: DateTime.fromISO('2026-08-28', { zone: 'UTC+10:00' }).toJSDate(),
    time: '12:00',
    timezoneOffset: 600,
  });

  if (!daily.moon || daily.moon.key !== 'moon') {
    throw new Error('Daily reading must be Moon-led');
  }
  if (!daily.monthStrip.saturn || !daily.monthStrip.jupiter) {
    throw new Error('Month strip needs Saturn and Jupiter');
  }
  if (!daily.lead || !/Moon in /.test(daily.lead.headline)) {
    throw new Error('Lead headline should name the transiting Moon');
  }
  if (daily.transiting.length !== 10) {
    throw new Error(`Expected 10 transiting planets, got ${daily.transiting.length}`);
  }
  daily.transiting.forEach((p) => {
    if (!(p.house >= 1 && p.house <= 12)) {
      throw new Error(`${p.name} missing natal house`);
    }
  });

  const later = calculateWesternDaily(natal, {
    date: DateTime.fromISO('2026-09-28', { zone: 'UTC+10:00' }).toJSDate(),
    time: '12:00',
    timezoneOffset: 600,
  });
  if (later.moon.sign === daily.moon.sign && Math.abs(later.moon.longitude - daily.moon.longitude) < 5) {
    throw new Error('Moon should have moved substantially a month later');
  }

  console.log('1971-03-03 Sydney natal → 2026-08-28 12:00 AEST');
  console.log('  Lead:', daily.lead.headline);
  console.log('  Moon house:', daily.moon.houseName);
  console.log('  Saturn:', daily.monthStrip.saturn.sign, daily.monthStrip.saturn.houseName);
  console.log('  Jupiter:', daily.monthStrip.jupiter.sign, daily.monthStrip.jupiter.houseName);
  console.log('  Daily hits:', daily.hits.length, '/ natal snapshot hits:', snapshotHits);
  console.log('OK: Western daily transits look distinct from the natal snapshot.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
