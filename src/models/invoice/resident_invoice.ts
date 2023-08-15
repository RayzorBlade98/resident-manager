import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Object containing invoice information for a single resident
 */
export default interface ResidentInvoiceInformation {
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

  /**
   * Rent payments of the resident
   */
  rentPayments: ResidentInvoiceRentPayment[];
}

/**
 * Object containing rent payment information for a single month
 */
interface ResidentInvoiceRentPayment {
  /**
   * Month and year this rent information is about
   */
  dueDate: MonthYear;

  /**
   * Rent that has to be paid in this month
   */
  rent: CurrencyInCents;

  /**
   * Incidentals that have to be paid in this month
   */
  incidentals: CurrencyInCents;

  /**
   * Amount that was paid for this month
   */
  paymentAmount: CurrencyInCents;

  /**
   * Amount that is missing for this month
   */
  paymentMissing: CurrencyInCents;
}
