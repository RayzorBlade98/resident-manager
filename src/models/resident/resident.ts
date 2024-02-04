import Name from '../name';
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
   * Name of the resident
   */
  name: Name;

  /**
   * Number of residents living in the appartment
   */
  numberOfResidents: number;

  /**
   * Information about the rent payments
   */
  rentInformation: RentInformation[];

  /**
   * List of all water meter readings
   */
  waterMeterReadings: WaterMeterReading[];

  /**
   * First month and year of the rental contract
   */
  contractStart: MonthYear;

  /**
   * Id of the apartment the resident lives in
   */
  apartmentId: string;
}
