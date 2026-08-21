/**
 * Fixture: tropical Sun and a distinct Ascendant.
 * Run: node scripts/verify-western.js
 */
const julian = require('astronomia/julian');
const solar = require('astronomia/solar');
const sidereal = require('astronomia/sidereal');
const nutation = require('astronomia/nutation');
const base = require('astronomia/base');

function norm360(d) {
  const x = d % 360;
  return x < 0 ? x + 360 : x;
}

const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

const cal = new julian.CalendarGregorian(1970, 1, 1 + 6.5 / 24);
const jd = cal.toJD();
const jde = cal.toJDE();
const T = base.J2000Century(jde);
const sun = norm360(solar.apparentLongitude(T) * 180 / Math.PI);
const gst = sidereal.apparent(jd);
const lstHours = ((gst / 3600 + 77.2090 / 15) % 24 + 24) % 24;
const ramc = lstHours * 15 * Math.PI / 180;
const eps = nutation.meanObliquity(jde) + nutation.nutation(jde)[1];
const phi = 28.6139 * Math.PI / 180;
const num = Math.cos(ramc);
const den = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
const lagna = norm360(Math.atan2(num, den) * 180 / Math.PI);

const sunSign = signs[Math.floor(sun / 30)];
const lagnaSign = signs[Math.floor(lagna / 30)];
console.log('1970-01-01 12:00 IST Delhi tropical');
console.log('  Sun', sunSign, (sun % 30).toFixed(2));
console.log('  Ascendant', lagnaSign, (lagna % 30).toFixed(2));
if (sunSign === 'Capricorn' && Math.abs((sun % 30) - 10.4) > 2) {
  throw new Error('Tropical Sun not near Capricorn 10°');
}
if (sunSign === lagnaSign && Math.abs((sun % 30) - (lagna % 30)) < 1) {
  throw new Error('Ascendant collapsed onto the Sun');
}
console.log('OK: Western tropical Sun and Ascendant look distinct.');
