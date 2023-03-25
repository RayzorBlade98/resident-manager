import { MonthYear } from './date';

/**
 * Object containing information about an invoice
 */
export interface Invoice {
  /**
   * First month of the invoice
   */
  start: MonthYear;

  /**
   * Last month of the invoice
   */
  end: MonthYear;

  /**
   * Invoice information of all residents
   */
  residentInformation: { [residentId: string]: ResidentInvoiceInformation };
}

/**
 * Object containing invoice information for a single resident
 */
export interface ResidentInvoiceInformation {
  /**
   * Id of the resident
   */
  residentId: string;
}
