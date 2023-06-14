import MonthYear from '_/extensions/date/month_year.extension';

/**
 * Object containing information about an invoice
 */
export interface Invoice {
  /**
   * Unique id of the invoice
   */
  id: string;

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