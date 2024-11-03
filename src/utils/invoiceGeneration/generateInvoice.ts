import { v4 as uuid } from 'uuid';
import {
  calculateOneTimeIncidentalsInformation,
  calculateOngoingIncidentalsInformation,
} from './calculations/incidentalsInformation';
import { calculateResidentInformation } from './calculations/residentInformation';
import MonthYear from '_/extensions/date/month_year.extension';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';
import Invoice from '_/models/invoice/invoice';
import Landlord from '_/models/landlord/landlord';
import { Resident } from '_/models/resident/resident';

/**
 * All arguments of the invoice generation
 */
export type InvoiceGenerationArgs = {
  /**
   * First month of the invoice
   */
  start: MonthYear;

  /**
   * Last month of the invoice
   */
  end: MonthYear;

  /**
   * First month for which the new incidentals deduction is applied
   */
  newDeductionStart: MonthYear;

  /**
   * List of all residents
   */
  residents: Resident[];

  /**
   * List of all ongoing incidentals
   */
  ongoingIncidentals: OngoingIncidentals[];

  /**
   * List of all one time incidentals
   */
  oneTimeIncidentals: OneTimeIncidentals[];

  /**
   * Landlord of the property
   */
  landlord: Landlord;
};

/**
 * Generates an invoice using the provided arguments
 */
export function generateInvoice(args: InvoiceGenerationArgs): Invoice {
  const invoice: Invoice = {
    id: uuid(),
    start: args.start,
    end: args.end,
    newDeductionStart: args.newDeductionStart,
    ongoingIncidentalsInformation: calculateOngoingIncidentalsInformation(args),
    oneTimeIncidentalsInformation: calculateOneTimeIncidentalsInformation(args),
    waterCosts: {
      waterUsageCostPerCubicMeter: 0,
      sewageCostPerCubicMeter: 0,
    },
    residentInformation: {},
    property: {
      address: {
        zipCode: 0,
        city: '',
        street: '',
        houseNumber: 0,
      },
    },
    landlord: args.landlord,
  };

  invoice.residentInformation = calculateResidentInformation(invoice, args);

  return invoice;
}
