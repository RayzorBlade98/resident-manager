import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Object containing information about one-time incidentals
 */
interface OneTimeIncidentals {
  /**
   * Unique id that is used to identify these incidentals
   */
  id: string;

  /**
   * Name of the incidentals
   */
  name: string;

  /**
   * Cost of the incidentals
   */
  cost: CurrencyInCents;

  /**
   * Date of the bill
   */
  billingDate: Date;

  /**
   * Date the bill was paid
   */
  paymentDate?: Date;
}

export default OneTimeIncidentals;
