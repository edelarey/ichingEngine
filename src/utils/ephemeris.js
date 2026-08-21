/**
 * Shared tropical geocentric ephemeris (astronomia / Meeus / VSOP87).
 * Vedic subtracts Lahiri from these longitudes; Western uses them as-is.
 */

import { DateTime } from 'luxon';
import { norm360 } from '@/const/vedic';

const julian = require('astronomia/julian');
const planetposition = require('astronomia/planetposition');
const solar = require('astronomia/solar');
const moonposition = require('astronomia/moonposition');
const sidereal = require('astronomia/sidereal');
const nutation = require('astronomia/nutation');
const base = require('astronomia/base');
const pluto = require('astronomia/pluto');
const vsopEarth = require('astronomia/data/vsop87Bearth');
const vsopMercury = require('astronomia/data/vsop87Bmercury');
const vsopVenus = require('astronomia/data/vsop87Bvenus');
const vsopMars = require('astronomia/data/vsop87Bmars');
const vsopJupiter = require('astronomia/data/vsop87Bjupiter');
const vsopSaturn = require('astronomia/data/vsop87Bsaturn');
const vsopUranus = require('astronomia/data/vsop87Buranus');
const vsopNeptune = require('astronomia/data/vsop87Bneptune');

function unwrap(mod) {
  if (!mod) return mod;
  if (mod.default && typeof mod.default === 'object') {
    return { ...mod.default, ...mod };
  }
  return mod;
}

function dataSeries(mod) {
  return mod && mod.default ? mod.default : mod;
}

const julianU = unwrap(julian);
const planetpositionU = unwrap(planetposition);
const solarU = unwrap(solar);
const moonpositionU = unwrap(moonposition);
const siderealU = unwrap(sidereal);
const nutationU = unwrap(nutation);
const baseU = unwrap(base);
const plutoU = unwrap(pluto);

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const Planet = planetpositionU.Planet;
const earthPlanet = new Planet(dataSeries(vsopEarth));
const planetBodies = {
  mercury: new Planet(dataSeries(vsopMercury)),
  venus: new Planet(dataSeries(vsopVenus)),
  mars: new Planet(dataSeries(vsopMars)),
  jupiter: new Planet(dataSeries(vsopJupiter)),
  saturn: new Planet(dataSeries(vsopSaturn)),
  uranus: new Planet(dataSeries(vsopUranus)),
  neptune: new Planet(dataSeries(vsopNeptune)),
};

function toDeg(rad) {
  return baseU.toDeg ? baseU.toDeg(rad) : rad * RAD2DEG;
}

function sincos(rad) {
  if (baseU.sincos) return baseU.sincos(rad);
  return [Math.sin(rad), Math.cos(rad)];
}

function lightTime(au) {
  if (baseU.lightTime) return baseU.lightTime(au);
  return 0.0057755183 * au;
}

export function offsetToZone(minutes) {
  const sign = minutes >= 0 ? '+' : '-';
  const abs = Math.abs(Math.round(minutes));
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hh}:${mm}`;
}

export function formatOffset(minutes) {
  const sign = minutes >= 0 ? '+' : '-';
  const abs = Math.abs(Math.round(minutes));
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hh}:${mm}`;
}

export function formatDms(deg) {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}° ${String(m).padStart(2, '0')}′ ${String(s).padStart(2, '0')}″`;
}

export function birthDateTime({ date, time, timezoneOffset }) {
  const d = date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(String(date));
  const [hour, minute] = String(time || '12:00').split(':').map(Number);
  const offset = typeof timezoneOffset === 'number' ? timezoneOffset : -new Date().getTimezoneOffset();
  return DateTime.fromObject(
    {
      year: d.year,
      month: d.month,
      day: d.day,
      hour: Number.isFinite(hour) ? hour : 12,
      minute: Number.isFinite(minute) ? minute : 0,
      second: 0,
    },
    { zone: offsetToZone(offset) }
  );
}

export function julianDayFromBirth(birth) {
  const dt = birthDateTime(birth);
  const utc = dt.toUTC();
  const dayFrac = (utc.hour + utc.minute / 60 + utc.second / 3600) / 24;
  const CalendarGregorian = julianU.CalendarGregorian;
  const cal = new CalendarGregorian(utc.year, utc.month, utc.day + dayFrac);
  const jd = cal.toJD();
  const jde = typeof cal.toJDE === 'function' ? cal.toJDE() : jd;
  return { jd, jde, utc, local: dt };
}

function geocentricFromHeliocentric(planetPos, earthPos, jde, addNutation) {
  const L0 = earthPos.lon;
  const B0 = earthPos.lat;
  const R0 = earthPos.range;
  const [sB0, cB0] = sincos(B0);
  const [sL0, cL0] = sincos(L0);
  const L = planetPos.lon;
  const B = planetPos.lat;
  const R = planetPos.range;
  const [sB, cB] = sincos(B);
  const [sL, cL] = sincos(L);
  const x = R * cB * cL - R0 * cB0 * cL0;
  const y = R * cB * sL - R0 * cB0 * sL0;
  let lambda = Math.atan2(y, x);
  if (lambda < 0) lambda += 2 * Math.PI;
  if (addNutation) {
    const nut = nutationU.nutation(jde);
    lambda += Array.isArray(nut) ? nut[0] : 0;
  }
  return norm360(toDeg(lambda));
}

function geocentricEclipticLongitude(planet, jde) {
  const posEarth = earthPlanet.position(jde);
  const L0 = posEarth.lon;
  const B0 = posEarth.lat;
  const R0 = posEarth.range;
  const [sB0, cB0] = sincos(B0);
  const [sL0, cL0] = sincos(L0);

  const xyz = (tau) => {
    const pos = planet.position(jde - tau);
    const [sB, cB] = sincos(pos.lat);
    const [sL, cL] = sincos(pos.lon);
    return {
      x: pos.range * cB * cL - R0 * cB0 * cL0,
      y: pos.range * cB * sL - R0 * cB0 * sL0,
      z: pos.range * sB - R0 * sB0,
    };
  };

  let { x, y, z } = xyz(0);
  const delta = Math.sqrt(x * x + y * y + z * z);
  ({ x, y, z } = xyz(lightTime(delta)));
  let lambda = Math.atan2(y, x);
  if (lambda < 0) lambda += 2 * Math.PI;
  const nut = nutationU.nutation(jde);
  lambda += Array.isArray(nut) ? nut[0] : 0;
  return norm360(toDeg(lambda));
}

function tropicalSun(jde) {
  const T = baseU.J2000Century ? baseU.J2000Century(jde) : (jde - 2451545.0) / 36525.0;
  return norm360(toDeg(solarU.apparentLongitude(T)));
}

function tropicalMoon(jde) {
  const pos = moonpositionU.position(jde);
  const nut = nutationU.nutation(jde);
  const dpsi = Array.isArray(nut) ? nut[0] : 0;
  return norm360(toDeg(pos.lon) + toDeg(dpsi));
}

function tropicalRahu(jde) {
  return norm360(toDeg(moonpositionU.node(jde)));
}

function tropicalPluto(jde) {
  const heli = plutoU.heliocentric(jde);
  const earth2000 = earthPlanet.position2000(jde);
  const lonJ2000 = geocentricFromHeliocentric(heli, earth2000, jde, false);
  const T = (jde - 2451545.0) / 36525.0;
  const nut = nutationU.nutation(jde);
  const dpsi = Array.isArray(nut) ? toDeg(nut[0]) : 0;
  return norm360(lonJ2000 + 1.3969718 * T + dpsi);
}

export function tropicalLagna(jd, jde, latitudeDeg, longitudeDeg) {
  const gstSec = siderealU.apparent(jd);
  const gstHours = gstSec / 3600;
  let lstHours = gstHours + longitudeDeg / 15;
  lstHours = ((lstHours % 24) + 24) % 24;
  const ramc = lstHours * 15 * DEG2RAD;
  const phi = latitudeDeg * DEG2RAD;
  const nut = nutationU.nutation(jde);
  const deps = Array.isArray(nut) ? nut[1] : 0;
  const eps = nutationU.meanObliquity(jde) + deps;
  const num = Math.cos(ramc);
  const den = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  return {
    ascendant: norm360(Math.atan2(num, den) * RAD2DEG),
    ramc: lstHours * 15,
    lstHours,
    obliquity: toDeg(eps),
    gstHours,
  };
}

export function tropicalMidheaven(ramcDeg, obliquityDeg) {
  const ramc = ramcDeg * DEG2RAD;
  const eps = obliquityDeg * DEG2RAD;
  return norm360(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps)) * RAD2DEG);
}

export function tropicalPositions(jde) {
  const rahu = tropicalRahu(jde);
  return {
    sun: tropicalSun(jde),
    moon: tropicalMoon(jde),
    mercury: geocentricEclipticLongitude(planetBodies.mercury, jde),
    venus: geocentricEclipticLongitude(planetBodies.venus, jde),
    mars: geocentricEclipticLongitude(planetBodies.mars, jde),
    jupiter: geocentricEclipticLongitude(planetBodies.jupiter, jde),
    saturn: geocentricEclipticLongitude(planetBodies.saturn, jde),
    uranus: geocentricEclipticLongitude(planetBodies.uranus, jde),
    neptune: geocentricEclipticLongitude(planetBodies.neptune, jde),
    pluto: tropicalPluto(jde),
    rahu,
    ketu: norm360(rahu + 180),
  };
}

export function isRetrograde(lonNow, lonPrev) {
  let delta = lonNow - lonPrev;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

/**
 * Placidus house cusps from RAMC, latitude, obliquity.
 * Falls back to Equal houses above |lat| ≈ 66° where Placidus is undefined.
 */
export function houseCusps(ascendant, ramcDeg, latitudeDeg, obliquityDeg, system = 'placidus') {
  const equal = [];
  for (let i = 1; i <= 12; i += 1) {
    equal.push({ number: i, cusp: norm360(ascendant + (i - 1) * 30) });
  }

  if (system !== 'placidus' || Math.abs(latitudeDeg) > 66) {
    return {
      system: 'equal',
      fallback: system === 'placidus',
      cusps: equal,
    };
  }

  const ramc = ramcDeg * DEG2RAD;
  const lat = latitudeDeg * DEG2RAD;
  const obl = obliquityDeg * DEG2RAD;
  const mc = tropicalMidheaven(ramcDeg, obliquityDeg);

  const iterate = (frac, east) => {
    let ra = ramc + (east ? 1 : -1) * frac * (Math.PI / 2);
    for (let i = 0; i < 18; i += 1) {
      const lon = Math.atan2(Math.sin(ra), Math.cos(ra) * Math.cos(obl));
      const dec = Math.asin(Math.sin(obl) * Math.sin(lon));
      const t = Math.tan(lat) * Math.tan(dec);
      if (Math.abs(t) >= 0.995) return null;
      const ad = Math.asin(t);
      const sa = Math.PI / 2 + ad;
      ra = ramc + (east ? 1 : -1) * frac * sa;
    }
    return norm360(Math.atan2(Math.sin(ra), Math.cos(ra) * Math.cos(obl)) * RAD2DEG);
  };

  const h11 = iterate(1 / 3, true);
  const h12 = iterate(2 / 3, true);
  const h9 = iterate(1 / 3, false);
  const h8 = iterate(2 / 3, false);
  if ([h11, h12, h9, h8].some((v) => v == null || Number.isNaN(v))) {
    return { system: 'equal', fallback: true, cusps: equal };
  }

  const cusps = new Array(13);
  cusps[1] = ascendant;
  cusps[10] = mc;
  cusps[7] = norm360(ascendant + 180);
  cusps[4] = norm360(mc + 180);
  cusps[11] = h11;
  cusps[12] = h12;
  cusps[9] = h9;
  cusps[8] = h8;
  cusps[5] = norm360(h11 + 180);
  cusps[6] = norm360(h12 + 180);
  cusps[3] = norm360(h9 + 180);
  cusps[2] = norm360(h8 + 180);

  return {
    system: 'placidus',
    fallback: false,
    cusps: Array.from({ length: 12 }, (_, i) => ({ number: i + 1, cusp: cusps[i + 1] })),
  };
}

export function houseOfLongitude(longitude, cusps) {
  const lon = norm360(longitude);
  for (let i = 0; i < 12; i += 1) {
    const a = cusps[i].cusp;
    const b = cusps[(i + 1) % 12].cusp;
    const span = (b - a + 360) % 360;
    const d = (lon - a + 360) % 360;
    if (d < span || span === 0) return cusps[i].number;
  }
  return 1;
}

export { norm360 };
