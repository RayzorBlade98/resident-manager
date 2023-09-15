import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Cost information for ongoing costs
 */
export interface OngoingCost {
  /**
   * Cost that needs to be payed
   */
  cost: CurrencyInCents;

  /**
   * Month in which the cost first applies
   */
  date: MonthYear;
}
