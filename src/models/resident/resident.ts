import { LinkedDocument } from '../document';
import { ContractResident } from './contractResident';
import { ResidentHistoryElement } from './history';
import { RentInformation } from './rent';
import WaterMeterReading from './water_meter_reading';
import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Object containing information about a specific resident
 */
export interface Resident {
  /**
   * Unique id that is used to identify a resident
   */
  id: string;

  /**
   * Residents included in the contract
   */
  contractResidents: ContractResident[];

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

  /**
   * Id of the parking space the resident rented
   */
  parkingSpaceId: string | undefined;

  /**
   * Rent deposit that the resident payed at contract start
   */
  rentDeposit: CurrencyInCents;

  /**
   * Information about the keys the resident has
   */
  keys: {
    /**
     * Number of apartment keys the resident has
     */
    apartment: number;

    /**
     * Number of basement keys the resident has
     */
    basement: number;

    /**
     * Number of attic keys the resident has
     */
    attic: number;

    /**
     * Number of front door keys the resident has
     */
    frontDoor: number;

    /**
     * Number of mailbox keys the resident has
     */
    mailbox: number;
  };

  /**
   * Historic information of the resident
   */
  history: ResidentHistoryElement[];

  /**
   * Documents linked to the resident
   */
  documents: LinkedDocument[];
}
