import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Object containing information about a parking space of a property
 */
interface ParkingSpace {
  /**
   * Unique id of the parking space
   */
  id: string;

  /**
   * Display name of the parking space
   */
  name: string;

  /**
   * Costs of the parking space
   */
  costs: {
    /**
     * Monthly cost that needs to be payed by the resident
     */
    cost: CurrencyInCents;

    /**
     * Month in which the cost first applies
     */
    date: MonthYear;
  }[];
}

export default ParkingSpace;
