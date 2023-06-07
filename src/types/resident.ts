import { RentInformation } from './rent';
import MonthYear from '_/extensions/date/month_year.extension';

/**
 * Object containing information about a specific resident
 */
export interface Resident {
  /**
   * Unique id that is used to identify a resident
   */
  id: string;

  /**
   * First name of the resident
   */
  firstName: string;

  /**
   * Last name of the resident
   */
  lastName: string;

  /**
   * Information about the rent payments
   */
  rent: RentInformation[];

  /**
   * First month and year the next invoice calculation will include
   */
  invoiceStart: MonthYear;
}
