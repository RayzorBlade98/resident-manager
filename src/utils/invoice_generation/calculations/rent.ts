import MonthYear from '_/extensions/date/month_year.extension';
import { Resident } from '_/models/resident/resident';

/**
 * Arguments for the rent payment calculation
 */
interface RentPaymentCalculationArguments {
  /**
   * First month of the invoice
   */
  invoiceStart: MonthYear;

  /**
   * Last month of the invoice
   */
  invoiceEnd: MonthYear;

  /**
   * List of all residents
   */
  residents: Resident[];
}

/**
 * Calculates the rent payments for the invoice
 * @param args arguments for the rent payment calculation
 * @returns rent payment calculations for all residents
 */
export default function calculateRentPayments(
  args: RentPaymentCalculationArguments,
) {
  return Object.fromEntries(
    args.residents.map((resident) => [
      resident.id,
      calculateRentPaymentsForResident(args, resident),
    ]),
  );
}

/**
 * Calculates the rent payments for a single resident
 */
function calculateRentPaymentsForResident(
  args: RentPaymentCalculationArguments,
  resident: Resident,
) {
  return resident.rentInformation
    .filter(
      (r) => args.invoiceStart <= r.dueDate && r.dueDate <= args.invoiceEnd,
    )
    .map((r) => {
      const paymentAmount = r.paymentAmount ?? 0;
      return {
        dueDate: r.dueDate,
        rent: r.rent,
        incidentals: r.incidentals,
        paymentAmount,
        paymentMissing: r.rent + r.incidentals - paymentAmount,
      };
    });
}
