import _ from 'lodash';
import { getInvoiceMonthsForResident } from '../utils/getInvoiceMonthsForResident';
import MonthYear from '_/extensions/date/month_year.extension';
import { DeductionType } from '_/models/incidentals/deduction_type';
import { IncidentalsInvoiceInformation } from '_/models/invoice/incidentals_invoice';
import Invoice from '_/models/invoice/invoice';
import ResidentInvoiceInformation from '_/models/invoice/resident.invoice';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';
import { CurrencyInCents } from '_/utils/currency/currency.utils';
import { applyHistoryToResident } from '_/utils/resident/applyHistoryToResident/applyHistoryToResident';

type ResidentIncidentalsCalculationArgs = {
  start: MonthYear;
  end: MonthYear;
  property: Property;
  residents: Resident[];
};

export function calculateResidentIncidentals(
  resident: Resident,
  ongoingIncidentalsInformation:
  | Invoice['ongoingIncidentalsInformation']
  | Invoice['oneTimeIncidentalsInformation'],
  args: ResidentIncidentalsCalculationArgs,
): ResidentInvoiceInformation['ongoingIncidentalsCosts'] {
  return _.mapValues(ongoingIncidentalsInformation, (i) => calculateSingleIncidentalsCosts(resident, i, args));
}

function calculateSingleIncidentalsCosts(
  resident: Resident,
  incidentalsInformation: IncidentalsInvoiceInformation,
  args: ResidentIncidentalsCalculationArgs,
): CurrencyInCents {
  // Calculate months included in the invoice for the resident
  const months = getInvoiceMonthsForResident(resident, args.start, args.end);

  // Calculate incidentals costs per month
  const invoiceMonths = MonthYear.monthsBetween(args.start, args.end);
  const incidentalsCostsPerMonth = incidentalsInformation.totalCost / invoiceMonths;

  let totalCosts = 0;
  for (const month of months) {
    // Calculate total deduction units
    const totalDeductionUnits = getTotalDeductionUnits(
      incidentalsInformation.deductionType,
      month,
      args,
    );

    // Calculate cost per deduction unit
    const costPerDeductionUnit = incidentalsCostsPerMonth / totalDeductionUnits;

    // Calculate deduction units of the resident
    const deductionUnits = getDeductionUnitsForResident(
      resident,
      incidentalsInformation.deductionType,
      month,
    );

    // Calculate monthy cost
    const monthlyCost = costPerDeductionUnit * deductionUnits;

    // Add the costs to the total costs
    totalCosts += monthlyCost;
  }

  return totalCosts;
}

function getTotalDeductionUnits(
  deductionType: DeductionType,
  month: MonthYear,
  args: ResidentIncidentalsCalculationArgs,
): number {
  switch (deductionType) {
    case DeductionType.PerResident:
      // Apply history to the residents
      const historicalResidents = args.residents.map((r) => applyHistoryToResident(r, month));

      // Sum up the residents
      const sumResidents = _.sumBy(historicalResidents, (r) => r.numberOfResidents);

      // Calculate the empty apartments (count as 1 resident)
      const emptyApartments = args.property.numberOfApartments - historicalResidents.length;

      return sumResidents + emptyApartments;
    case DeductionType.PerApartment:
      return args.property.numberOfApartments;

    /* istanbul ignore next */
    case DeductionType.NotDeductable:
      throw new Error(
        'Incidentals with deduction type "not deductable" musn\'t be used in the invoice calculation',
      );
    /* istanbul ignore next */
    default:
      const type: never = deductionType;
      throw new Error(`Missing implementation for deduction type ${type}`);
  }
}

function getDeductionUnitsForResident(
  resident: Resident,
  deductionType: DeductionType,
  month: MonthYear,
): number {
  switch (deductionType) {
    case DeductionType.PerResident:
      const historicalResident = applyHistoryToResident(resident, month);
      return historicalResident.numberOfResidents;
    case DeductionType.PerApartment:
      return 1;

    /* istanbul ignore next */
    case DeductionType.NotDeductable:
      throw new Error(
        'Incidentals with deduction type "not deductable" musn\'t be used in the invoice calculation',
      );
    /* istanbul ignore next */
    default:
      const type: never = deductionType;
      throw new Error(`Missing implementation for deduction type ${type}`);
  }
}
