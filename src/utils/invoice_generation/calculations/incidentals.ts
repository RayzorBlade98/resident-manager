import {
  DeductionType,
  OngoingIncidentals,
} from '../../../models/incidentals/ongoing_incidentals';
import MonthYear from '_/extensions/date/month_year.extension';
import { Invoice } from '_/models/invoice/invoice';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';

/**
 * Arguments for the incidentals generation
 */
interface IncidentalsCalculationArguments {
  /**
   * Ongoing incidentals that should be included into the invoice
   */
  includedOngoingIncidentals: OngoingIncidentals[];

  /**
   * Invoice the incidentals calculation should be added to
   */
  invoice: Invoice;

  /**
   * Property of the invoice
   */
  property: Property;

  /**
   * List of all residents
   */
  residents: Resident[];

  /**
   * All months included in the invoice
   */
  timespan: MonthYear[];
}

/**
 * Adds the incidentals calculation to the invoice
 * @param args arguments for the incidentals calculation
 */
export default function addIncidentalsCalculationToInvoice(
  args: IncidentalsCalculationArguments,
): void {
  ongoingIncidentalsCalculation(args);
}

/**
 * Adds the ongoing incidentals calculation to the invoice
 */
function ongoingIncidentalsCalculation(
  args: IncidentalsCalculationArguments,
): void {
  for (const incidentals of args.includedOngoingIncidentals) {
    let totalCost = 0;
    for (const month of args.timespan) {
      let cost = incidentals.costs.find((c) => c.date <= month)?.cost;
      if (!cost) {
        continue;
      }
      cost /= incidentals.invoiceInterval;

      totalCost += cost;

      const residents = args.residents.filter((r) => r.invoiceStart <= month);

      const totalDeductionUnits = getTotalNumberOfDeductionUnits(
        incidentals.deductionType,
        args.property,
        residents,
      );
      const costPerUnit = cost / totalDeductionUnits;

      for (const resident of residents) {
        const residentInfo = args.invoice.residentInformation[resident.id];
        const incidentalsCost = residentInfo.ongoingIncidentalsCosts;
        if (!(incidentals.id in incidentalsCost)) {
          incidentalsCost[incidentals.id] = 0;
        }

        const numberOfUnits = getDeductionUnits(
          incidentals.deductionType,
          resident,
        );
        incidentalsCost[incidentals.id] += costPerUnit * numberOfUnits;
      }
    }

    args.invoice.ongoingIncidentalsInformation[incidentals.id] = {
      incidentalsId: incidentals.id,
      name: incidentals.name,
      deductionType: incidentals.deductionType,
      totalCost: Math.ceil(totalCost),
    };
  }

  // Round resident costs
  for (const resident of args.residents) {
    const residentInformation = args.invoice.residentInformation[resident.id];
    for (const incidentals of args.includedOngoingIncidentals) {
      const incidentalsCosts = residentInformation.ongoingIncidentalsCosts;
      const cost = incidentalsCosts[incidentals.id];
      if (cost !== undefined) {
        incidentalsCosts[incidentals.id] = Math.ceil(cost);
      }
    }
  }
}

/**
 * Returns the total number of units for the specified deduction type
 */
function getTotalNumberOfDeductionUnits(
  deductionType: DeductionType,
  property: Property,
  residents: Resident[],
): number {
  switch (deductionType) {
    case DeductionType.PerApartment:
      return property.numberOfApartments;
    case DeductionType.PerResident: {
      return residents
        .map((r) => r.numberOfResidents)
        .reduce((all, n) => all + n);
    }
    /* istanbul ignore next */
    default:
      throw new Error(
        `Missing implementation for deduction type ${deductionType}`, // eslint-disable-line max-len
      );
  }
}

/**
 * Returns the number of deduction type units for the specified resident
 */
function getDeductionUnits(
  deductionType: DeductionType,
  resident: Resident,
): number {
  switch (deductionType) {
    case DeductionType.PerApartment:
      return 1;
    case DeductionType.PerResident:
      return resident.numberOfResidents;
    /* istanbul ignore next */
    default:
      throw new Error(
        `Missing implementation for deduction type ${deductionType}`, // eslint-disable-line max-len
      );
  }
}
