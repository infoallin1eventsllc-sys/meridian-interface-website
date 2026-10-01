// Calendar dates for <input type="date">, in the visitor's own time zone.
//
// Not `toISOString().split('T')[0]`: that is the UTC date, which in Houston
// turns into tomorrow every evening after 7 PM (6 PM in winter).

/** YYYY-MM-DD for a Date, read in local time. */
export function localISODate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Today, for an input's `min` so a past day cannot be picked. */
export const todayISO = () => localISODate(new Date());

/** Today plus `days`, e.g. an invoice due date. */
export function daysFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return localISODate(d);
}

/** The first weekday after today: the default for a booking request. */
export function nextBusinessDay(): string {
  const d = new Date();
  do d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6);
  return localISODate(d);
}
