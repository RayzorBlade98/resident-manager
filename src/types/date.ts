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
 * Class that provides utility functions for `MonthYear` objects
 */
export abstract class MonthYearUtils {
  /**
   * Adds the specified number of months to the given `MonthYear` object
   * @param monthYear `MonthYear` object to which the months should be added
   * @param addedMonths Number of months that should be added (can be negative)
   * @returns new `MonthYear` object with the adjusted month (and year)
   */
  public static addMonths(
    monthYear: MonthYear,
    addedMonths: number = 1,
  ): MonthYear {
    if (addedMonths < 0)
      // Add negative amount of months == subtract months
      return MonthYearUtils.subtractMonths(monthYear, addedMonths * -1);

    const newMonthYear = { ...monthYear };
    if (newMonthYear.month === Month.December) {
      // Year change
      newMonthYear.month = Month.January;
      newMonthYear.year += 1;
    } else {
      // Add one month to the object
      const months = Object.values(Month);
      const oldMonthIndex = months.findIndex(
        (m: Month) => m === newMonthYear.month,
      );
      newMonthYear.month = months[oldMonthIndex + 1];
    }

    // Call `addMonths` recursive until all months got addded
    if (addedMonths !== 1)
      return MonthYearUtils.addMonths(newMonthYear, addedMonths - 1);
    else return newMonthYear;
  }

  /**
   * Checks if two `MonthYear` objects are equal
   * @param a first `MonthYear` object to compare
   * @param b second `MonthYear` object to compare
   * @returns `true` if both the month and year are the same, else `false`
   */
  public static areEqual(a: MonthYear, b: MonthYear): boolean {
    return a.month === b.month && a.year === b.year;
  }

  /**
   * Compares two `MonthYear` objects
   * @param a First `MonthYear` object to compare
   * @param b Second `MonthYear` object to compare
   * @returns
   *
   * - 0 if both object have the same month and year
   * - <0 if the first object contains a date that's earlier than the second object
   * - \>0 if the first object contains a date that's later than the second object
   */
  public static compare(a: MonthYear, b: MonthYear): number {
    if (a.year !== b.year) return a.year - b.year;

    const months = Object.values(Month);
    const aMonthIndex = months.findIndex((m: Month) => m === a.month);
    const bMonthIndex = months.findIndex((m: Month) => m === b.month);
    return aMonthIndex - bMonthIndex;
  }

  /**
   * Returns a `MonthYear` object that contains information of the current month and year
   * @returns `MonthYear` object for the current date
   */
  public static getCurrentMonthYear(): MonthYear {
    const date: Date = new Date();
    const monthIndex: number = date.getUTCMonth();
    const month: Month = Object.values(Month)[monthIndex] as Month;
    const year: Year = date.getUTCFullYear();

    return {
      month: month,
      year: year,
    };
  }

  /**
   * Parses a string representation of a `MonthYear` object to its respective object
   * @param monthYear string representation of a `MonthYear` object that should be parsed
   * @returns `MonthYear` object that contains the information of the specified `string`
   */
  public static parseString(monthYear: MonthYearString): MonthYear {
    const splits = monthYear
      .split(/(\s+)/)
      .filter((s: string) => s.trim().length > 0);
    return {
      month: splits[0] as Month,
      year: Number(splits[1]),
    };
  }

  /**
   * Subtracts the specified number of months from the given `MonthYear` object
   * @param monthYear `MonthYear` object from which the months should be subtraced
   * @param subtractedMonths Number of months that should be subtracted (can be negative)
   * @returns new `MonthYear` object with the adjusted month (and year)
   */
  public static subtractMonths(
    monthYear: MonthYear,
    subtractedMonths: number = 1,
  ): MonthYear {
    if (subtractedMonths < 0)
      // Subtract negative amount of months == add months
      return MonthYearUtils.addMonths(monthYear, subtractedMonths * -1);

    const newMonthYear = { ...monthYear };
    if (newMonthYear.month === Month.January) {
      // Year change
      newMonthYear.month = Month.December;
      newMonthYear.year -= 1;
    } else {
      // Subtract one month from the object
      const months = Object.values(Month);
      const oldMonthIndex = months.findIndex(
        (m: Month) => m === newMonthYear.month,
      );
      newMonthYear.month = months[oldMonthIndex - 1];
    }

    // Call `subtractMonths` recursive until all months got subtracted
    if (subtractedMonths !== 1)
      return MonthYearUtils.subtractMonths(newMonthYear, subtractedMonths - 1);
    else return newMonthYear;
  }

  /**
   * Converts a `MonthYear` to its string representation
   * @param monthYear `MonthYear` that should be converted
   * @returns string representation of the specified `MonthYear` object with the format "[month] [year]"
   */
  public static toString(monthYear: MonthYear): MonthYearString {
    return `${monthYear.month} ${monthYear.year}`;
  }

  /**
   * Creates a list of `MonthYear` objects that contains each month
   * between the two specified `MonthYear` objects (inclusive these months)
   * @param start Start of the timespan
   * @param end End of the timespan
   * @returns List of `MonthYear` objects with all months between `start` and `end`
   */
  public static timespan(start: MonthYear, end: MonthYear): MonthYear[] {
    const timespan = [{ ...start }];

    // Whether to add a month each loop or subtract one
    const direction = Math.sign(MonthYearUtils.compare(end, start));

    if (MonthYearUtils.areEqual(start, end)) return timespan;

    for (
      start = MonthYearUtils.addMonths(start, direction);
      !MonthYearUtils.areEqual(start, end);
      start = MonthYearUtils.addMonths(start, direction)
    ) {
      timespan.push(start);
    }
    timespan.push({ ...end });
    return timespan;
  }
}