import { IncidentalsInvoiceInformation } from './incidentals_invoice';
import ResidentInvoiceInformation from './resident_invoice';
import MonthYear from '_/extensions/date/month_year.extension';

/**
 * Object containing information about an invoice
 */
export default interface Invoice {
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
   * Invoice information of all ongoing incidentals
   */
  ongoingIncidentalsInformation: {
    [incidentalsId: string]: IncidentalsInvoiceInformation;
  };

  /**
   * Invoice information of all one time incidentals
   */
  oneTimeIncidentalsInformation: {
    [incidentalsId: string]: IncidentalsInvoiceInformation;
  };

  /**
   * Invoice information of all residents
   */
  residentInformation: { [residentId: string]: ResidentInvoiceInformation };
}
