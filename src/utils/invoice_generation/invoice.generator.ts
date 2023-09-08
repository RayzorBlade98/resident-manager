import { v4 as uuid } from 'uuid';
import { OngoingIncidentals } from '../../models/incidentals/ongoing_incidentals';
import addIncidentalsCalculationToInvoice from './calculations/incidentals';
import addRentPaymentCalculationToInvoice from './calculations/rent';
import MonthYear from '_/extensions/date/month_year.extension';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import Invoice from '_/models/invoice/invoice';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';

/**
 * Arguments for the invoice generation
 */
export interface InvoiceGenerationArguments {
  /**
   * Start of the invoice
   */
  start: MonthYear;

  /**
   * End of the invoice
   */
  end: MonthYear;

  /**
   * List of all residents
   */
  residents: Resident[];

  /**
   * Ongoing incidentals that should be included into the invoice
   */
  includedOngoingIncidentals: OngoingIncidentals[];

  /**
   * One time incidentals that should be included into the invoice
   */
  includedOneTimeIncidentals: OneTimeIncidentals[];

  /**
   * Property of the invoice
   */
  property: Property;
}

export default function generateInvoice(
  args: InvoiceGenerationArguments,
): Invoice {
  // Only include residents that had a contract during the invoice timespan
  const residents = args.residents.filter(
    (r) => args.start <= r.invoiceStart && r.invoiceStart <= args.end,
  );

  // Initialize invoice
  const invoice: Invoice = {
    id: uuid(),
    start: args.start,
    end: args.end,
    ongoingIncidentalsInformation: {},
    oneTimeIncidentalsInformation: {},
    residentInformation: {},
  };
  residents.forEach((r) => {
    invoice.residentInformation[r.id] = {
      residentId: r.id,
      ongoingIncidentalsCosts: {},
      oneTimeIncidentalsCosts: {},
      rentPayments: [],
    };
  });

  const timespan = MonthYear.timespan(args.start, args.end);

  addIncidentalsCalculationToInvoice({
    includedOngoingIncidentals: args.includedOngoingIncidentals,
    includedOneTimeIncidentals: args.includedOneTimeIncidentals,
    property: args.property,
    residents,
    invoice,
    timespan,
  });

  addRentPaymentCalculationToInvoice({
    invoice,
    residents,
  });

  return invoice;
}
