import { DeductionType } from '../incidentals/ongoing_incidentals';
import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

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
   * Invoice information of all ongoing incidentals
   */
  ongoingIncidentalsInformation: {
    [incidentalsId: string]: OngoingIncidentalsInvoiceInformation;
  };

  /**
   * Invoice information of all residents
   */
  residentInformation: { [residentId: string]: ResidentInvoiceInformation };
}

/**
 * Object containing invoice information for a single ongoing incidentals
 */
interface OngoingIncidentalsInvoiceInformation {
  /**
   * Id of the ongoing incidentals
   */
  incidentalsId: string;

  /**
   * Name of the incidentals
   */
  name: string;

  /**
   * Total cost of the incidentals for the whole invoice
   */
  totalCost: CurrencyInCents;

  /**
   * Deduction type of the incidentals
   */
  deductionType: DeductionType;
}

/**
 * Object containing invoice information for a single resident
 */
interface ResidentInvoiceInformation {
  /**
   * Id of the resident
   */
  residentId: string;

  /**
   * Costs for all ongoing incidentals
   */
  ongoingIncidentalsCosts: {
    [incidentalsId: string]: CurrencyInCents;
  };
}
