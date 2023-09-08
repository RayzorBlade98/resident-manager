import { DeductionType } from '../incidentals/deduction_type';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Object containing invoice information for a single ongoing incidentals
 */

export interface IncidentalsInvoiceInformation {
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
