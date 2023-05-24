// Remove after adding another export:
/* eslint-disable import/prefer-default-export */

/**
 * Converts the given date to its string representaion (format: DD.MM.YYYY)
 * @param date date that should be converted
 * @returns string representation of the date
 */
export function dateToString(date: Date): string {
  const day: number = date.getDate();
  const month: number = date.getMonth() + 1;
  const year = String(date.getFullYear());

  const dayPrefix: string = day < 10 ? '0' : '';
  const monthPrefix: string = month < 10 ? '0' : '';

  return `${dayPrefix}${String(day)}.${monthPrefix}${String(month)}.${year}`;
}
