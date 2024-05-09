import type { Resident } from './resident';
import MonthYear from '_/extensions/date/month_year.extension';
import Prettify from '_/types/Prettify';

/**
 * Object containing historic information about a resident
 */
export interface ResidentHistoryElement {
  /**
   * First month the historic values aren't valid anymore
   */
  invalidSince: MonthYear;

  contractResidents?: Resident['contractResidents'];
  numberOfResidents?: Resident['numberOfResidents'];
  parkingSpaceId?: Resident['parkingSpaceId'];
  keys?: Prettify<Partial<Resident['keys']>>;
}
