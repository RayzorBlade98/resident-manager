import { IncidentalsInvoiceInformation } from './incidentals_invoice';
import ResidentInvoiceInformation from './resident.invoice';
import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

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
   * Invoice information of the water costs
   */
  waterCosts: {
    /**
     * Costs for the water usage
     */
    waterUsageCostPerCubicMeter: CurrencyInCents;

    /**
     * Costs for the sewage
     */
    sewageCostPerCubicMeter: CurrencyInCents;
  };

  /**
   * Invoice information of all residents
   */
  residentInformation: { [residentId: string]: ResidentInvoiceInformation };
}
