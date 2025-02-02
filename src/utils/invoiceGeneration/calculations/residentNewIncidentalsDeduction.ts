import { getNumberOfInvoiceMonthsForResident } from '../utils/getInvoiceMonthsForResident';
import MonthYear from '_/extensions/date/month_year.extension';
import { Resident } from '_/models/resident/resident';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

type ResidentNewIncidentalsDeductionCalculationArgs = {
  start: MonthYear;
  end: MonthYear;
};

export function calculateResidentNewIncidentalsDeduction(
  resident: Resident,
  totalIncidentalsCosts: CurrencyInCents,
  args: ResidentNewIncidentalsDeductionCalculationArgs,
): CurrencyInCents {
  // Calculate months included in the invoice for the resident
  const months = getNumberOfInvoiceMonthsForResident(resident, args.start, args.end);

  // Calculate new monthly incidentals deduction
  const newDeduction = totalIncidentalsCosts / months;

  return Math.ceil(newDeduction);
}
