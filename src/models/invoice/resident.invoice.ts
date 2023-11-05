import MonthYear from '_/extensions/date/month_year.extension';
import Name from '_/models/name';
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
   * Name of the resident
   */
  name: Name;

  /**
   * Costs for all ongoing incidentals
   */
  ongoingIncidentalsCosts: {
    [incidentalsId: string]: CurrencyInCents;
  };

  /**
   * Costs for all one time incidentals
   */
  oneTimeIncidentalsCosts: {
    [incidentalsId: string]: CurrencyInCents;
  };

  /**
   * Rent payments of the resident
   */
  rentPayments: {
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
  }[];

  /**
   * Water costs of the resident
   */
  waterCosts: {
    /**
     * Water meter count at the last invoice
     */
    lastWaterMeterCount: number;

    /**
     * Current water meter count
     */
    currentWaterMeterCount: number;

    /**
     * Water usage during this invoice period
     */
    waterUsage: number;

    /**
     * Costs for the water usage during this invoice period
     */
    waterUsageCosts: CurrencyInCents;

    /**
     * Costs for the sewage during this invoice period
     */
    sewageCosts: CurrencyInCents;
  };

  /**
   * Accumulated costs
   */
  totalCosts: {
    /**
     * Sum of all ongoing incidentals costs
     */
    ongoingIncidentalsCosts: CurrencyInCents;

    /**
     * Sum of all ongoing incidentals costs
     */
    oneTimeIncidentalsCosts: CurrencyInCents;

    /**
     * Sum of all missing rent payments
     */
    missingRentPayments: CurrencyInCents;

    /**
     * Sum of all water costs
     */
    waterCosts: CurrencyInCents;

    /**
     * Sum of all costs
     */
    totalCosts: CurrencyInCents;

    /**
     * Sum of all paid incidentals
     */
    totalPaidIncidentals: CurrencyInCents;

    /**
     * Total amount that must be paid by the resident
     */
    totalMissingCosts: CurrencyInCents;
  };
}
