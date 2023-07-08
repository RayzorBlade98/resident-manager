import { v4 as uuid } from 'uuid';
import {
  OngoingIncidentals,
} from '../../models/incidentals/ongoing_incidentals';
import addIncidentalsCalculationToInvoice from './calculations/incidentals';
import MonthYear from '_/extensions/date/month_year.extension';
import { Invoice } from '_/models/invoice/invoice';
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
    residentInformation: {},
  };
  residents.forEach((r) => {
    invoice.residentInformation[r.id] = {
      residentId: r.id,
      ongoingIncidentalsCosts: {},
    };
  });

  const timespan = MonthYear.timespan(args.start, args.end);

  addIncidentalsCalculationToInvoice({
    includedOngoingIncidentals: args.includedOngoingIncidentals,
    property: args.property,
    residents,
    invoice,
    timespan,
  });

  return invoice;
}
