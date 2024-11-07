import { v4 as uuid } from 'uuid';
import { OngoingIncidentals } from '../../models/incidentals/ongoing_incidentals';
import calculateIncidentalsCosts from './calculations/incidentals';
import calculateRentPayments from './calculations/rent';
import calculateTotalCosts from './calculations/totalCosts';
import calculateWaterCosts from './calculations/water';
import MonthYear from '_/extensions/date/month_year.extension';
import WaterCosts from '_/models/incidentals/WaterCosts';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import Invoice from '_/models/invoice/invoice';
import Landlord from '_/models/landlord/landlord';
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
   * First month for which the new incidentals deduction is applied
   */
  newDeductionStart: MonthYear;

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

  /**
   * Water costs used in the invoice
   */
  waterCosts: WaterCosts;

  /**
   *
   */
  landlord: Landlord;
}

export default function generateInvoice(
  args: InvoiceGenerationArguments,
): Invoice {
  // Only include residents that had a contract during the invoice timespan
  const residents = args.residents.filter((r) => r.contractStart <= args.end);

  const {
    incidentalsCalculations,
    waterCostCalculations,
    rentPayments,
    totalCosts,
  } = performCalculations(args, residents);

  const residentInformation = Object.fromEntries(
    residents.map((resident) => [
      resident.id,
      {
        residentId: resident.id,
        names: resident.contractResidents.map((r) => r.name),
        ongoingIncidentalsCosts:
          incidentalsCalculations.residentInformation[resident.id]
            .ongoingIncidentalsCosts,
        oneTimeIncidentalsCosts:
          incidentalsCalculations.residentInformation[resident.id]
            .oneTimeIncidentalsCosts,
        individualIncidentalsCosts: {},
        rentPayments: rentPayments[resident.id],
        waterCosts: waterCostCalculations.residentCosts[resident.id],
        totalCosts: totalCosts[resident.id],
      },
    ]),
  );

  return {
    id: uuid(),
    start: args.start,
    end: args.end,
    newDeductionStart: args.newDeductionStart,
    ongoingIncidentalsInformation:
      incidentalsCalculations.ongoingIncidentalsInformation,
    oneTimeIncidentalsInformation:
      incidentalsCalculations.oneTimeIncidentalsInformation,
    waterCosts: waterCostCalculations.waterCosts,
    residentInformation,
    property: {
      address: args.property.address,
    },
    landlord: args.landlord,
  };
}

function performCalculations(
  args: InvoiceGenerationArguments,
  residents: Resident[],
) {
  const incidentalsCalculations = calculateIncidentalsCosts({
    invoiceStart: args.start,
    invoiceEnd: args.end,
    includedOneTimeIncidentals: args.includedOneTimeIncidentals,
    includedOngoingIncidentals: args.includedOngoingIncidentals,
    property: args.property,
    residents,
  });
  const waterCostCalculations = calculateWaterCosts({
    invoiceEnd: args.end,
    waterCosts: args.waterCosts,
    residents,
  });
  const rentPayments = calculateRentPayments({
    invoiceStart: args.start,
    invoiceEnd: args.end,
    residents,
  });

  const totalCosts = calculateTotalCosts({
    incidentalsCalculations,
    waterCostCalculations,
    rentPayments,
    residents,
  });

  return {
    incidentalsCalculations,
    waterCostCalculations,
    rentPayments,
    totalCosts,
  };
}
