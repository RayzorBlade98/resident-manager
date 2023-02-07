import { CurrencyInCents } from '_/utils/currency';
import { MonthYear, MonthYearUtils } from './date';

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
      rent: rent,
      isPaid: false,
    }));
  }
}
