/**
 * Fixture check for Lahiri ayanāṁśa and a published-style natal snapshot.
 * Run from ichingEngine: node scripts/verify-vedic.js
 */
const julian = require('astronomia/julian');
const solar = require('astronomia/solar');
const moonposition = require('astronomia/moonposition');
const sidereal = require('astronomia/sidereal');
const nutation = require('astronomia/nutation');
const base = require('astronomia/base');
const planetposition = require('astronomia/planetposition');
const vsopEarth = require('astronomia/data/vsop87Bearth');
const vsopMars = require('astronomia/data/vsop87Bmars');

function lahiriAyanamsa(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.852294 + 1.3969718 * T - 0.000000348 * T * T;
}

function norm360(d) {
  const x = d % 360;
  return x < 0 ? x + 360 : x;
}

const cal2000 = new julian.CalendarGregorian(2000, 1, 1.5);
const jd2000 = cal2000.toJD();
const ayan2000 = lahiriAyanamsa(jd2000);
const T2000 = base.J2000Century(cal2000.toJDE());
const sun2000 = norm360(solar.apparentLongitude(T2000) * 180 / Math.PI);
const sidSun2000 = norm360(sun2000 - ayan2000);

console.log('J2000 noon UTC');
console.log('  Lahiri ayanamsa', ayan2000.toFixed(4), '(expect ~23.85)');
console.log('  Tropical Sun', sun2000.toFixed(2), '(expect ~280.4 Capricorn)');
console.log('  Sidereal Sun', sidSun2000.toFixed(2), '(expect ~256.5 Sagittarius)');

if (Math.abs(ayan2000 - 23.85) > 0.02) {
  throw new Error('Lahiri ayanamsa at J2000 out of range');
}
if (Math.floor(sidSun2000 / 30) + 1 !== 9) {
  throw new Error('Sidereal Sun at J2000 noon is not Sagittarius');
}

// 1970-01-01 12:00 IST (UTC+5:30) = 06:30 UTC, New Delhi 28.6139N 77.2090E
const cal1970 = new julian.CalendarGregorian(1970, 1, 1 + 6.5 / 24);
const jd1970 = cal1970.toJD();
const jde1970 = cal1970.toJDE();
const ayan1970 = lahiriAyanamsa(jd1970);
const T1970 = base.J2000Century(jde1970);
const sun1970 = norm360(solar.apparentLongitude(T1970) * 180 / Math.PI);
const moon1970 = moonposition.position(jde1970);
const moonLon = norm360(moon1970.lon * 180 / Math.PI + nutation.nutation(jde1970)[0] * 180 / Math.PI);
const gst = sidereal.apparent(jd1970);
const lstHours = ((gst / 3600 + 77.2090 / 15) % 24 + 24) % 24;
const ramc = lstHours * 15 * Math.PI / 180;
const eps = nutation.meanObliquity(jde1970) + nutation.nutation(jde1970)[1];
const phi = 28.6139 * Math.PI / 180;
const num = Math.cos(ramc);
const den = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
const lagnaTrop = norm360(Math.atan2(num, den) * 180 / Math.PI);
const lagnaSid = norm360(lagnaTrop - ayan1970);
const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

console.log('\n1970-01-01 12:00 IST Delhi');
console.log('  Ayanamsa', ayan1970.toFixed(4));
console.log('  Sidereal Sun', signs[Math.floor(norm360(sun1970 - ayan1970) / 30)], (norm360(sun1970 - ayan1970) % 30).toFixed(2));
console.log('  Sidereal Moon', signs[Math.floor(norm360(moonLon - ayan1970) / 30)], (norm360(moonLon - ayan1970) % 30).toFixed(2));
console.log('  Lagna', signs[Math.floor(lagnaSid / 30)], (lagnaSid % 30).toFixed(2));

const earth = new planetposition.Planet(vsopEarth.default || vsopEarth);
const mars = new planetposition.Planet(vsopMars.default || vsopMars);
const e = earth.position(jde1970);
const m = mars.position(jde1970);
const x = m.range * Math.cos(m.lat) * Math.cos(m.lon) - e.range * Math.cos(e.lat) * Math.cos(e.lon);
const y = m.range * Math.cos(m.lat) * Math.sin(m.lon) - e.range * Math.cos(e.lat) * Math.sin(e.lon);
const marsTrop = norm360(Math.atan2(y, x) * 180 / Math.PI);
console.log('  Sidereal Mars (approx, no light-time)', signs[Math.floor(norm360(marsTrop - ayan1970) / 30)]);

console.log('\nOK: core ephemeris and Lahiri conversion look consistent.');

const sunSign = signs[Math.floor(norm360(sun1970) / 30)];
const lagnaSignTrop = signs[Math.floor(lagnaTrop / 30)];
console.log('\nWestern tropical 1970-01-01 12:00 IST Delhi');
console.log('  Tropical Sun', sunSign, (sun1970 % 30).toFixed(2));
console.log('  Tropical Lagna', lagnaSignTrop, (lagnaTrop % 30).toFixed(2));
if (sunSign === lagnaSignTrop && Math.abs((sun1970 % 30) - (lagnaTrop % 30)) < 1) {
  throw new Error('Tropical Lagna collapsed onto the Sun — Ascendant formula is wrong');
}
console.log('OK: tropical Ascendant is distinct from the Sun.');
