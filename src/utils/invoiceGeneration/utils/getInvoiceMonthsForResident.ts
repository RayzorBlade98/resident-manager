import MonthYear from '_/extensions/date/month_year.extension';
import { Resident } from '_/models/resident/resident';

/**
 * Returns the number of month a resident is included in the invoice period
 * @param resident Resident for which the months should be calculated
 * @param invoiceStart First month of the invoice period
 * @param invoiceEnd Last month of the invoice period
 */
export function getInvoiceMonthsForResident(
  resident: Resident,
  invoiceStart: MonthYear,
  invoiceEnd: MonthYear,
): number {
  // Calculate actual invoice start for the resident
  const actualInvoiceStart = invoiceStart < resident.contractStart
    ? resident.contractStart
    : invoiceStart;

  // Calculate the months between the actual invoice start and the invoice end
  return MonthYear.monthsBetween(actualInvoiceStart, invoiceEnd);
}
