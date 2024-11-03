import MonthYear from '_/extensions/date/month_year.extension';
import ResidentInvoiceInformation from '_/models/invoice/resident.invoice';
import { Resident } from '_/models/resident/resident';

type ResidentRentPaymentsCalculationArgs = {
  start: MonthYear;
  end: MonthYear;
};

export function calculateResidentRentPayments(
  resident: Resident,
  args: ResidentRentPaymentsCalculationArgs,
): ResidentInvoiceInformation['rentPayments'] {
  // Filter out rent payments outside of invoice period
  const rentPayments = resident.rentInformation.filter(
    (r) => args.start <= r.dueDate && r.dueDate <= args.end,
  );

  // Calculate rent payments
  return rentPayments.map((r) => {
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
