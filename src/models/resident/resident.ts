import { RentInformation } from './rent';
import WaterMeterReading from './water_meter_reading';
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
  rentInformation: RentInformation[];

  /**
   * List of all water meter readings
   */
  waterMeterReadings: WaterMeterReading[];

  /**
   * First month and year the next invoice calculation will include
   */
  invoiceStart: MonthYear;
}
