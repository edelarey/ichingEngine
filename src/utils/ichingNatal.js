import { DateTime } from 'luxon';
import astro from '@/const/astrology';

const cache = new Map();

function natalKey(birthday) {
  return JSON.stringify({
    id: birthday?.id ?? null,
    birthday: birthday?.birthday ?? '',
    gender: birthday?.gender ?? '',
    lat: birthday?.coords?.latitude ?? null,
    lng: birthday?.coords?.longitude ?? null,
  });
}

export async function consultIchingNatal(birthday) {
  const key = natalKey(birthday);
  if (cache.has(key)) return cache.get(key);

  const birthDate = DateTime.fromISO(birthday.birthday).toJSDate();
  const latitude = birthday.coords.latitude;
  const longitude = birthday.coords.longitude;
  const gender = birthday.gender === 'FEMALE' ? astro.Gender.FEMALE : astro.Gender.MALE;
  const hemisphere = latitude >= 0 ? 'Northern' : 'Southern';
  const AstrologyClass = hemisphere === 'Northern'
    ? astro.IChingAstrology_North
    : astro.IChingAstrology_South;
  const consultation = new astro.IChingConsultation(new AstrologyClass());
  const result = await consultation.consultOracle(birthDate, gender, latitude, longitude);

  const out = {
    birthDate,
    latitude,
    longitude,
    gender: birthday.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
    hemisphere,
    consultation,
    result,
    preHeavenBirthSubCycles: result.iching.preHeavenBirthSubCycles || [],
    laterHeavenBirthSubCycles: result.iching.laterHeavenBirthSubCycles || [],
  };
  cache.set(key, out);
  return out;
}
