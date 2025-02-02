import _ from 'lodash';
import MonthYear from '_/extensions/date/month_year.extension';
import { DeductionType } from '_/models/incidentals/deduction_type';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';
import { IncidentalsInvoiceInformation } from '_/models/invoice/incidentals_invoice';
import Invoice from '_/models/invoice/invoice';

type OngoingIncidentalsInformationCalculationArgs = {
  start: MonthYear;
  end: MonthYear;
  ongoingIncidentals: OngoingIncidentals[];
};

export function calculateOngoingIncidentalsInformation(
  args: OngoingIncidentalsInformationCalculationArgs,
): Invoice['ongoingIncidentalsInformation'] {
  // Filter out undeductable incidentals
  let incidentals = args.ongoingIncidentals.filter(
    (i) => i.deductionType !== DeductionType.NotDeductable,
  );

  // Filter out payments outside of invoice period
  incidentals.forEach((i) => {
    i.costs = i.costs.filter(
      (c) => args.start <= c.dueDate && c.dueDate <= args.end,
    );
  });

  // Filter out incidentals without payments
  incidentals = incidentals.filter((i) => i.costs.length >= 0);

  // Sum up payments
  const calculated: IncidentalsInvoiceInformation[] = incidentals.map((i) => ({
    incidentalsId: i.id,
    name: i.name,
    deductionType: i.deductionType,
    totalCost: _.sumBy(i.costs, (c) => c.cost),
  }));

  return Object.fromEntries(calculated.map((i) => [i.incidentalsId, i]));
}

type OneTimeIncidentalsInformationCalculationArgs = {
  start: MonthYear;
  end: MonthYear;
  oneTimeIncidentals: OneTimeIncidentals[];
};

export function calculateOneTimeIncidentalsInformation(
  args: OneTimeIncidentalsInformationCalculationArgs,
): Invoice['oneTimeIncidentalsInformation'] {
  // Filter out undeductable incidentals and incidentals outside of the invoice period
  const incidentals = args.oneTimeIncidentals.filter(
    (i) => i.deductionType !== DeductionType.NotDeductable
      && args.start <= i.billingDate
      && i.billingDate < args.end.addMonths(1),
  );

  return Object.fromEntries(
    incidentals.map((i) => [
      i.id,
      {
        incidentalsId: i.id,
        name: i.name,
        deductionType: i.deductionType,
        totalCost: i.cost,
      },
    ]),
  );
}
