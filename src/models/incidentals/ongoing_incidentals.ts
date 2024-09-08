import { DeductionType } from './deduction_type';
import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Cost information for ongoing incidentals
 */
export interface OngoingIncidentalsCost {
  /**
   * Cost of the incidentals
   */
  cost: CurrencyInCents;

  /**
   * Month in which the cost first applies
   */
  dueDate: MonthYear;

  /**
   * Date the bill was paid
   */
  paymentDate: Date;

  /**
   * Document id of the bill
   */
  billDocumentId?: string;

  /**
   * Document id of the bank transfer
   */
  bankTransferDocumentId: string;
}

/**
 * Object containing information about ongoing incidentals
 */
export interface OngoingIncidentals {
  /**
   * Unique id that is used to identify these incidentals
   */
  id: string;

  /**
   * Name of the incidentals
   */
  name: string;

  /**
   * History of all costs
   */
  costs: OngoingIncidentalsCost[];

  /**
   * Deduction type of the incidentals
   */
  deductionType: DeductionType;

  /**
   * Inverval in which the incidentals are paid (in months)
   */
  invoiceInterval: number;
}
