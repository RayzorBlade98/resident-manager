import './date.extension';

const MONTH_NAMES = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

/**
 * Date object that represents a month and a year
 */
class MonthYear extends Date {
  /**
   * Creates a new `MonthYear` object
   * @param month month of the new object. If undefined the current month will be used.
   * @param year year of the new object. If undefined the current year will be used.
   */
  constructor(month?: number, year?: number) {
    const now = new Date();
    const utc = new Date(
      year !== undefined ? year : now.getFullYear(),
      month !== undefined ? month : now.getMonth(),
      1,
    ).toUTC();
    super(utc.getTime());
  }

  /**
   * Converts a `Date` object to a `MonthYear`
   * @param date Date that should be converted
   * @returns `MonthYear` with the same month and year as `date`
   */
  public static fromDate(date: Date): MonthYear {
    return new MonthYear(date.getMonth(), date.getFullYear());
  }

  /**
   * Converts a date string to a `MonthYear`
   * @param date Date string that should be converted
   * @returns `MonthYear` with the same month and year as `date`
   */
  public static fromString(date: string): MonthYear {
    return MonthYear.fromDate(new Date(date));
  }

  /**
   * Compares two months and returns the latest
   * @param month1 First month to compare
   * @param month2 Second month to compare
   * @returns The bigger of both months
   */
  public static max(month1: MonthYear, month2: MonthYear): MonthYear {
    return month1 >= month2 ? month1 : month2;
  }

  /**
   * Returns the number of months between two month (including these)
   *
   * Examples:
   * - monthsBetween(03.2023, 05.2023) = monthsBetween(05.2023, 03.2023) = 3
   * - monthsBetween(07.2023, 07.2023) = 1
   *
   * @param month1 First month of the interval
   * @param month2 Second month of the interval
   * @returns Number of month included in the provided interval
   */
  public static monthsBetween(month1: MonthYear, month2: MonthYear): number {
    const yearsBetween = month2.getFullYear() - month1.getFullYear();
    const monthsBetween = month2.getMonth() - month1.getMonth();
    return Math.abs(yearsBetween * 12 + monthsBetween) + 1;
  }

  /**
   * Adds the specified number of months to the given `MonthYear` object
   * @param toAdd Number of months that should be added (can be negative)
   * @returns this month year
   */
  public addMonths(toAdd = 1): MonthYear {
    this.setMonth(this.getMonth() + toAdd);
    return this;
  }

  /**
   * Creates a copy this object.
   * @returns the copy with the same month and year
   */
  public clone(): MonthYear {
    return new MonthYear(this.getMonth(), this.getFullYear());
  }

  /**
   * Checks whether this object has the same month and year as anoter `MonthYear`
   * @param other true if both the month and year are the same, else false
   */
  public equals(other: MonthYear): boolean {
    return this >= other && this <= other;
  }

  /**
   * Creates a list of `MonthYear` objects that contains each month
   * between the two specified `MonthYear` objects (inclusive these months)
   * @param start Start of the timespan
   * @param end End of the timespan
   * @returns List of `MonthYear` objects with all months between `start` and `end`
   */
  public static timespan(start: MonthYear, end: MonthYear): MonthYear[] {
    // Whether to add a month each loop or subtract one
    const direction = end > start ? 1 : -1;

    const timespan: MonthYear[] = [start.clone()];
    let next = start;
    while (!end.equals(next)) {
      next = next.clone();
      next.addMonths(direction);
      timespan.push(next);
    }

    return timespan;
  }

  /**
   * Generates a string representation in the format `<month name> <year>`
   * @returns string representation of this object
   */
  public toString(): string {
    return `${MONTH_NAMES[this.getMonth()]} ${this.getFullYear()}`;
  }
}

export default MonthYear;
