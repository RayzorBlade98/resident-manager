import { v4 as uuid } from 'uuid';
import {
  calculateOneTimeIncidentalsInformation,
  calculateOngoingIncidentalsInformation,
} from './calculations/incidentalsInformation';
import { calculateResidentInformation } from './calculations/residentInformation';
import { calculateWaterCosts } from './calculations/waterCosts';
import MonthYear from '_/extensions/date/month_year.extension';
import WaterCosts from '_/models/incidentals/WaterCosts';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';
import Invoice from '_/models/invoice/invoice';
import Landlord from '_/models/landlord/landlord';
import Property from '_/models/property/property';
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
   * List of all water costs
   */
  waterCosts: WaterCosts;

  /**
   * Property for which the invoice is generated
   */
  property: Property;

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
    waterCosts: calculateWaterCosts(args),
    residentInformation: {},
    property: {
      address: args.property.address,
    },
    landlord: args.landlord,
  };

  invoice.residentInformation = calculateResidentInformation(invoice, args);

  return invoice;
}
