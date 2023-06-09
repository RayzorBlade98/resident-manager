import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Object containing information about the rent of a single month
 */
export interface RentInformation {
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
   * Date on which the payment was received
   */
  paymentDate?: Date;

  /**
   * Amount that was paid for this month
   */
  paymentAmount?: CurrencyInCents;
}

/**
 * Enum containg status about the rent payment
 */
export enum PaymentStatus {
  /**
   * All costs where paid
   */
  Paid = 'Paid',

  /**
   * Not enough was paid
   */
  PaidPartially = 'PaidPartially',

  /**
   * Nothing was paid
   */
  Unpaid = 'Unpaid',
}
