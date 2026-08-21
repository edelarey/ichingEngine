import { DateTime } from 'luxon';

export function summarizeBirth(form) {
  if (!form) return 'Load or enter a birth, then hide this panel when you are done.';
  const bits = [];
  if (form.name) bits.push(form.name);
  if (form.date) {
    const d = form.date instanceof Date
      ? DateTime.fromJSDate(form.date)
      : DateTime.fromISO(String(form.date));
    if (d.isValid) bits.push(d.toFormat('yyyy-MM-dd'));
  }
  if (form.time) bits.push(form.time);
  if (form.place) bits.push(String(form.place).split(',')[0].trim());
  return bits.length ? bits.join(' · ') : 'Load or enter a birth, then hide this panel when you are done.';
}
