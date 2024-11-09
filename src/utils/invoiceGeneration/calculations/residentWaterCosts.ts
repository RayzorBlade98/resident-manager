import { getNumberOfInvoiceMonthsForResident } from '../utils/getInvoiceMonthsForResident';
import MonthYear from '_/extensions/date/month_year.extension';
import Invoice from '_/models/invoice/invoice';
import ResidentInvoiceInformation from '_/models/invoice/resident.invoice';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

type ResidentWaterCostsCalculationArgs = {
  start: MonthYear;
  end: MonthYear;
  property: Property;
};

export function calculateResidentWaterCosts(
  resident: Resident,
  waterCosts: Invoice['waterCosts'],
  args: ResidentWaterCostsCalculationArgs,
): ResidentInvoiceInformation['waterCosts'] {
  // Current water meter count = last water meter reading before end of invoice period
  const currentWaterMeterCount = resident.waterMeterReadings.find(
    (r) => r.readingDate <= args.end,
  )?.waterMeterCount as number;

  // Last water meter count = last water meter reading that was deducted in an invoice
  const lastWaterMeterCount = resident.waterMeterReadings.find(
    (r) => r.wasDeductedInInvoice,
  )?.waterMeterCount as number;

  const waterUsage = currentWaterMeterCount - lastWaterMeterCount;

  return {
    lastWaterMeterCount,
    currentWaterMeterCount,
    waterUsage,
    waterUsageCosts: waterUsage * waterCosts.waterUsageCostPerCubicMeter,
    sewageCosts: waterUsage * waterCosts.sewageCostPerCubicMeter,
    monthlyDeductionCosts: calculateMonthlyDeductionCosts(
      resident,
      waterCosts,
      args,
    ),
  };
}

function calculateMonthlyDeductionCosts(
  resident: Resident,
  waterCosts: Invoice['waterCosts'],
  args: ResidentWaterCostsCalculationArgs,
): CurrencyInCents {
  // Create timespan for all months included in the invoice period
  const months = MonthYear.monthsBetween(args.start, args.end);

  // Calculate average deduction cost per month
  const costPerMonth = waterCosts.totalMonthlyDeductions / months;

  // Calculate average monthly deduction cost per apartment
  const costPerApartmentPerMonth = costPerMonth / args.property.numberOfApartments;

  // Calculate number of months the resident is included in the invoice period
  const monthsForResident = getNumberOfInvoiceMonthsForResident(
    resident,
    args.start,
    args.end,
  );

  // Calculate total monthly deduction costs for the resident
  const totalDeductionCosts = costPerApartmentPerMonth * monthsForResident;

  return Math.ceil(totalDeductionCosts);
}
