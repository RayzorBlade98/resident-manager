import _ from 'lodash';
import {
  OngoingIncidentals,
  OngoingIncidentalsCost,
} from '../../../models/incidentals/ongoing_incidentals';
import MonthYear from '_/extensions/date/month_year.extension';
import { DeductionType } from '_/models/incidentals/deduction_type';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Arguments for the incidentals calculation
 */
interface IncidentalsCalculationArguments {
  /**
   * Ongoing incidentals that should be included into the invoice
   */
  includedOngoingIncidentals: OngoingIncidentals[];

  /**
   * One time incidentals that should be included into the invoice
   */
  includedOneTimeIncidentals: OneTimeIncidentals[];

  /**
   * First month of the invoice
   */
  invoiceStart: MonthYear;

  /**
   * Last month of the invoice
   */
  invoiceEnd: MonthYear;

  /**
   * Property of the invoice
   */
  property: Property;

  /**
   * List of all residents
   */
  residents: Resident[];
}

/**
 * Calculates the incidentals costs for the invoice
 * @param args arguments for the incidentals costs calculation
 * @returns incidentals cost calculations for all residents and the total incidentals costs
 */
export default function calculateIncidentalsCosts(
  args: IncidentalsCalculationArguments,
) {
  const ongoingIncidentalsCalculation = Object.fromEntries(
    args.includedOngoingIncidentals.map((incidentals) => [
      incidentals.id,
      calculateOngoingIncidentalsCosts(args, incidentals),
    ]),
  );
  const oneTimeIncidentalsCalculation = Object.fromEntries(
    args.includedOneTimeIncidentals.map((incidentals) => [
      incidentals.id,
      calculateOneTimeIncidentalsCosts(args, incidentals),
    ]),
  );

  return {
    ongoingIncidentalsInformation: _.mapValues(
      ongoingIncidentalsCalculation,
      (c) => c.incidentalsInformation,
    ),
    oneTimeIncidentalsInformation: _.mapValues(
      oneTimeIncidentalsCalculation,
      (c) => c.incidentalsInformation,
    ),
    residentInformation: Object.fromEntries(
      args.residents.map((resident) => [
        resident.id,
        {
          ongoingIncidentalsCosts: _.mapValues(
            ongoingIncidentalsCalculation,
            (c) => c.residentCosts[resident.id],
          ),
          oneTimeIncidentalsCosts: _.omitBy(
            _.mapValues(
              oneTimeIncidentalsCalculation,
              (c) => c.residentCosts[resident.id],
            ),
            (c) => !c,
          ),
        },
      ]),
    ),
  };
}

/**
 * Calculates the ongoing incidentals costs for the invoice
 */
function calculateOngoingIncidentalsCosts(
  args: IncidentalsCalculationArguments,
  incidentals: OngoingIncidentals,
) {
  const costPerMonth = getOngoingIncidentalsCostPerMonth(args, incidentals);
  const firstInvoiceMonth = getOngoingIncidentalsFirstInvoiceMonth(
    args,
    incidentals,
  );

  const totalResidentCosts = MonthYear.timespan(
    firstInvoiceMonth,
    args.invoiceEnd,
  )
    .map((month) => {
      const residents = args.residents.filter((r) => r.invoiceStart <= month);
      const costPerUnit = getCostPerDeductionUnit(
        costPerMonth,
        incidentals.deductionType,
        args.property,
        residents,
      );
      return Object.fromEntries(
        residents.map((resident) => [
          resident.id,
          getDeductionUnits(incidentals.deductionType, resident) * costPerUnit,
        ]),
      );
    })
    .reduce((totalCosts, newCosts) => _.mergeWith(
      totalCosts,
      newCosts,
      (objValue: number | undefined, srcValue: number) => (objValue ?? 0) + srcValue,
    ));

  return {
    incidentalsInformation: {
      incidentalsId: incidentals.id,
      name: incidentals.name,
      deductionType: incidentals.deductionType,
      totalCost: Math.ceil(
        costPerMonth
          * MonthYear.monthsBetween(firstInvoiceMonth, args.invoiceEnd),
      ),
    },
    residentCosts: _.mapValues(totalResidentCosts, Math.ceil),
  };
}

/**
 * Calculates the one time incidentals costs for the invoice
 */
function calculateOneTimeIncidentalsCosts(
  args: IncidentalsCalculationArguments,
  incidentals: OneTimeIncidentals,
) {
  const residents = args.residents.filter(
    (r) => r.invoiceStart <= incidentals.billingDate,
  );
  const costPerUnit = getCostPerDeductionUnit(
    incidentals.cost,
    incidentals.deductionType,
    args.property,
    residents,
  );

  return {
    incidentalsInformation: {
      incidentalsId: incidentals.id,
      name: incidentals.name,
      deductionType: incidentals.deductionType,
      totalCost: incidentals.cost,
    },
    residentCosts: Object.fromEntries(
      residents.map((resident) => [
        resident.id,
        Math.ceil(
          getDeductionUnits(incidentals.deductionType, resident) * costPerUnit,
        ),
      ]),
    ),
  };
}

/**
 * Returns the cost per month of the ongoing incidentals
 */
function getOngoingIncidentalsCostPerMonth(
  args: IncidentalsCalculationArguments,
  incidentals: OngoingIncidentals,
): CurrencyInCents {
  const incidentalsCosts = [...incidentals.costs]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .find((c) => c.date <= args.invoiceEnd) as OngoingIncidentalsCost;

  return incidentalsCosts.cost / incidentals.invoiceInterval;
}

/**
 * Returns the first month in which the ongoing incidentals should be included in the invoice
 */
function getOngoingIncidentalsFirstInvoiceMonth(
  args: IncidentalsCalculationArguments,
  incidentals: OngoingIncidentals,
): MonthYear {
  const firstIncidentalsMonth = [...incidentals.costs].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  )[0].date;
  return MonthYear.max(firstIncidentalsMonth, args.invoiceStart);
}

/**
 * Returns the cost per deduction unit
 */
function getCostPerDeductionUnit(
  costs: CurrencyInCents,
  deductionType: DeductionType,
  property: Property,
  residents: Resident[],
): CurrencyInCents {
  const totalNumberOfDeductionUnits = getTotalNumberOfDeductionUnits(
    deductionType,
    property,
    residents,
  );
  return costs / totalNumberOfDeductionUnits;
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
