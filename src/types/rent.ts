import { MonthYear, MonthYearUtils } from './date';
import { CurrencyInCents } from '_/utils/currency';

/**
 * Object containing information about the rent of a single month
 */
export interface RentInformation {
  /**
   * Month and year this rent information is about
   */
  dueDate: MonthYear;

  /**
   * Rent that has to be paid in this month
   */
  rent: CurrencyInCents;

  /**
   * Whether the rent was already paid or not
   */
  isPaid: boolean;
}

/**
 * Class that provides utility functions for `RentInformation` objects
 */
export abstract class RentInformationUtils {
  /**
   * Creates rent information for all months between the due date of the last provided rent information
   * and the current month and adds them to the list of rent information.
   * If the due date of the last provided rent information is in the future, no new information will be added.
   * @param rentInformation List of current rent information
   */
  public static addMissingMonths(rentInformation: RentInformation[]): void {
    const lastRentInformation: RentInformation = rentInformation.at(-1)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    if (
      MonthYearUtils.compare(
        lastRentInformation.dueDate,
        MonthYearUtils.getCurrentMonthYear(),
      ) >= 0
    ) {
      // Last rent information isn't in the past
      return;
    }

    const missingRentInformation = RentInformationUtils.timespan(
      MonthYearUtils.addMonths(lastRentInformation.dueDate, 1),
      MonthYearUtils.getCurrentMonthYear(),
      lastRentInformation.rent,
    );
    rentInformation.push(...missingRentInformation);
  }

  /**
   * Creates a list of `RentInformation` objects that contains rent information for each
   * month between the two specified `MonthYear` objects (inclusive these months)
   * @param start Start of the timespan
   * @param end End of the timespan. If `end` < `start` only the start month will be included into the timespan
   * @param rent Amount of rent each object should have
   * @returns List of `RentInformation` objects with rent information for all months between `start` and `end`
   */
  public static timespan(
    start: MonthYear,
    end: MonthYear,
    rent: CurrencyInCents,
  ): RentInformation[] {
    let timespan = [{ ...start }];

    if (MonthYearUtils.compare(start, end) < 0) {
      // Only create timespan if start is before end
      timespan = MonthYearUtils.timespan(start, end);
    }

    return timespan.map<RentInformation>((m: MonthYear) => ({
      dueDate: m,
      rent,
      isPaid: false,
    }));
  }
}
