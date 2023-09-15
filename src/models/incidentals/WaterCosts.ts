import { OngoingCost } from '../OngoingCost';

/**
 * Object containing information about all water costs
 */
export default interface WaterCosts {
  /**
   * History of all water usage costs
   */
  waterUsageCosts: OngoingCost[];

  /**
   * History of all sewage costs
   */
  sewageCosts: OngoingCost[];
}
