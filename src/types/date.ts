/**
 * Enum containing all months as `string`
 */
export enum Month {
  January = 'Januar',
  Febuary = 'Februar',
  March = 'März',
  April = 'April',
  May = 'Mai',
  June = 'Juni',
  July = 'Juli',
  August = 'August',
  September = 'September',
  October = 'Oktober',
  November = 'November',
  December = 'Dezember',
}

/**
 * Type representing a year
 */
export type Year = number;

/**
 * Information about a specific month and year
 */
export interface MonthYear {
  month: Month;
  year: Year;
}

/**
 * Type of the string representation of a `MonthYear`
 * 
 * Format: "[month] [year]"
 */
export type MonthYearString = `${Month} ${Year}`;

/**
 * Converts a `MonthYear` to its string representation
 * @param monthYear `MonthYear` that should be converted
 * @returns string representation of the specified `MonthYear` object with the format "[month] [year]"
 */
export function convertMonthYearToString(
  monthYear: MonthYear,
): MonthYearString {
  return `${monthYear.month} ${monthYear.year}`;
}

/**
 * Parses a string representation of a `MonthYear` object to its respective object
 * @param monthYear string representation of a `MonthYear` object that should be parsed
 * @returns `MonthYear` object that contains the information of the specified `string`
 */
export function parseMonthYearString(monthYear: MonthYearString): MonthYear {
  const splits = monthYear
    .split(/(\s+)/)
    .filter((s: string) => s.trim().length > 0);
  return {
    month: splits[0] as Month,
    year: Number(splits[1]),
  };
}

/**
 * Returns a `MonthYear` object that contains information of the current month and year
 * @returns `MonthYear` object for the current date
 */
export function getCurrentMonthYear(): MonthYear {
  const date: Date = new Date();
  const monthIndex: number = date.getUTCMonth();
  const month: Month = Object.values(Month)[monthIndex] as Month;
  const year: number = date.getUTCFullYear();

  return {
    month: month,
    year: year,
  };
}
