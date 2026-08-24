import { DateTime } from 'luxon';
import { TIMEZONE_PRESETS } from '@/const/vedic';

function formatOffset(minutes) {
  const sign = minutes >= 0 ? '+' : '-';
  const abs = Math.abs(Math.round(minutes));
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hh}:${mm}`;
}

const COUNTRY_ZONES = {
  IN: 'Asia/Kolkata',
  NP: 'Asia/Kathmandu',
  PK: 'Asia/Karachi',
  BD: 'Asia/Dhaka',
  LK: 'Asia/Colombo',
  AE: 'Asia/Dubai',
  SA: 'Asia/Riyadh',
  IL: 'Asia/Jerusalem',
  TR: 'Europe/Istanbul',
  GB: 'Europe/London',
  IE: 'Europe/Dublin',
  PT: 'Europe/Lisbon',
  ES: 'Europe/Madrid',
  FR: 'Europe/Paris',
  DE: 'Europe/Berlin',
  IT: 'Europe/Rome',
  NL: 'Europe/Amsterdam',
  BE: 'Europe/Brussels',
  CH: 'Europe/Zurich',
  AT: 'Europe/Vienna',
  PL: 'Europe/Warsaw',
  SE: 'Europe/Stockholm',
  NO: 'Europe/Oslo',
  DK: 'Europe/Copenhagen',
  FI: 'Europe/Helsinki',
  GR: 'Europe/Athens',
  CZ: 'Europe/Prague',
  HU: 'Europe/Budapest',
  RO: 'Europe/Bucharest',
  UA: 'Europe/Kyiv',
  RU: 'Europe/Moscow',
  ZA: 'Africa/Johannesburg',
  EG: 'Africa/Cairo',
  NG: 'Africa/Lagos',
  KE: 'Africa/Nairobi',
  JP: 'Asia/Tokyo',
  KR: 'Asia/Seoul',
  CN: 'Asia/Shanghai',
  HK: 'Asia/Hong_Kong',
  TW: 'Asia/Taipei',
  SG: 'Asia/Singapore',
  MY: 'Asia/Kuala_Lumpur',
  TH: 'Asia/Bangkok',
  VN: 'Asia/Ho_Chi_Minh',
  PH: 'Asia/Manila',
  ID: 'Asia/Jakarta',
  NZ: 'Pacific/Auckland',
  MX: 'America/Mexico_City',
  BR: 'America/Sao_Paulo',
  AR: 'America/Argentina/Buenos_Aires',
  CL: 'America/Santiago',
  CO: 'America/Bogota',
  PE: 'America/Lima',
  CA: null,
  US: null,
  AU: null,
};

function zoneForUS(lat, lng) {
  if (lng < -150 && lat < 30) return 'Pacific/Honolulu';
  if (lng < -129 && lat > 50) return 'America/Anchorage';
  if (lng < -115) return 'America/Los_Angeles';
  if (lng < -102) return 'America/Denver';
  if (lng < -85) return 'America/Chicago';
  return 'America/New_York';
}

function zoneForAU(lng) {
  if (lng < 129) return 'Australia/Perth';
  if (lng < 138) return 'Australia/Adelaide';
  if (lng < 141) return 'Australia/Broken_Hill';
  return 'Australia/Sydney';
}

function zoneForCA(lng) {
  if (lng < -115) return 'America/Vancouver';
  if (lng < -102) return 'America/Edmonton';
  if (lng < -89) return 'America/Winnipeg';
  if (lng < -60) return 'America/Toronto';
  return 'America/Halifax';
}

export function guessIanaZone(lat, lng, countryCode) {
  const code = (countryCode || '').toUpperCase();
  if (code === 'US') return zoneForUS(lat, lng);
  if (code === 'AU') return zoneForAU(lng);
  if (code === 'CA') return zoneForCA(lng);
  if (COUNTRY_ZONES[code]) return COUNTRY_ZONES[code];
  const hours = Math.round(lng / 15);
  const sign = hours >= 0 ? '+' : '-';
  const hh = String(Math.abs(hours)).padStart(2, '0');
  return `UTC${sign}${hh}:00`;
}

export function offsetForZone(iana, date, time) {
  const d = date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(String(date || ''));
  const [hour, minute] = String(time || '12:00').split(':').map(Number);
  const dt = DateTime.fromObject(
    {
      year: d.isValid ? d.year : new Date().getFullYear(),
      month: d.isValid ? d.month : 1,
      day: d.isValid ? d.day : 1,
      hour: Number.isFinite(hour) ? hour : 12,
      minute: Number.isFinite(minute) ? minute : 0,
    },
    { zone: iana }
  );
  if (!dt.isValid) return -new Date().getTimezoneOffset();
  return dt.offset;
}

export function compactTimezoneLabel(label) {
  const text = String(label || '');
  const utc = text.match(/\(UTC[+\-−±]\d{1,2}:\d{2}\)/);
  const head = text.split(/[—–]/)[0].trim();
  const abbrev = head.split(/\s+/)[0];
  if (utc && abbrev) return `${abbrev} ${utc[0]}`;
  return text;
}

export function timezonePresetsWithBrowser(extraOffset, extraLabel) {
  const browser = -new Date().getTimezoneOffset();
  const extras = [];
  const seen = new Set(TIMEZONE_PRESETS.map((t) => t.offset));
  if (!seen.has(browser)) {
    extras.push({
      label: `Browser local (${formatOffset(browser)})`,
      shortLabel: `Local (${formatOffset(browser)})`,
      offset: browser,
    });
    seen.add(browser);
  }
  if (typeof extraOffset === 'number' && !seen.has(extraOffset)) {
    const name = extraLabel ? `${extraLabel} (${formatOffset(extraOffset)})` : `Birth place (${formatOffset(extraOffset)})`;
    extras.push({
      label: name,
      shortLabel: extraLabel ? compactTimezoneLabel(name) : `Place (${formatOffset(extraOffset)})`,
      offset: extraOffset,
    });
  }
  return [
    ...extras,
    ...TIMEZONE_PRESETS.map((tz) => ({
      ...tz,
      shortLabel: compactTimezoneLabel(tz.label),
    })),
  ];
}

function labelOf(props) {
  const bits = [props.name, props.city || props.county, props.state, props.country]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);
  return bits.join(', ') || 'Unknown place';
}

function toHit(lat, lng, label, countryCode) {
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return {
    label: label || 'Unknown place',
    latitude,
    longitude,
    countryCode: countryCode || '',
    timezoneName: guessIanaZone(latitude, longitude, countryCode),
  };
}

async function searchPhoton(q) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Place search failed');
  const data = await res.json();
  return (data.features || [])
    .map((f) => {
      const [lng, lat] = f.geometry?.coordinates || [];
      const countryCode = f.properties?.countrycode || f.properties?.country_code || '';
      return toHit(lat, lng, labelOf(f.properties || {}), countryCode);
    })
    .filter(Boolean);
}

async function searchNominatim(q) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=jsonv2&addressdetails=1&limit=6`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Place search failed');
  const data = await res.json();
  return (Array.isArray(data) ? data : [])
    .map((item) => {
      const addr = item.address || {};
      const name = item.name || addr.city || addr.town || addr.village || addr.hamlet || '';
      const label = labelOf({
        name,
        city: addr.city || addr.town || addr.village,
        state: addr.state,
        country: addr.country,
      });
      return toHit(item.lat, item.lon, label, addr.country_code);
    })
    .filter(Boolean);
}

export async function searchPlaces(query) {
  const q = String(query || '').trim();
  if (q.length < 2) return [];
  try {
    const photon = await searchPhoton(q);
    if (photon.length) return photon;
  } catch (_) {
    // Photon is the fast path; Nominatim is the fallback.
  }
  return searchNominatim(q);
}
