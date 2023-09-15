import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

interface WaterCost {
  /**
   * Cost per cubic meter that needs to be payed
   */
  costPerCubicMeter: CurrencyInCents;

  /**
   * Month in which the cost first applies
   */
  date: MonthYear;
}

/**
 * Object containing information about all water costs
 */
export default interface WaterCosts {
  /**
   * History of all water usage costs
   */
  waterUsageCosts: WaterCost[];

  /**
   * History of all sewage costs
   */
  sewageCosts: WaterCost[];
}
