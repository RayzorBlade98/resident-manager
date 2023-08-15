import Invoice from '_/models/invoice/invoice';
import { Resident } from '_/models/resident/resident';

/**
 * Arguments for the rent payment calculation
 */
interface RentPaymentCalculationArguments {
  /**
   * Invoice the rent payment calculation should be added to
   */
  invoice: Invoice;

  /**
   * List of all residents
   */
  residents: Resident[];
}

/**
 * Adds the incidentals calculation to the invoice
 * @param args arguments for the incidentals calculation
 */
export default function addRentPaymentCalculationToInvoice(
  args: RentPaymentCalculationArguments,
): void {
  for (const resident of args.residents) {
    args.invoice.residentInformation[resident.id].rentPayments = resident.rentInformation
      .filter(
        (r) => args.invoice.start <= r.dueDate && r.dueDate <= args.invoice.end,
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
}
