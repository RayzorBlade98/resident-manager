import MonthYear from '_/extensions/date/month_year.extension';
import WaterCosts, { WaterCost } from '_/models/incidentals/WaterCosts';
import { Resident } from '_/models/resident/resident';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Arguments for the water cost calculation
 */
interface WaterCostCalculationArguments {
  /**
   * Last month of the invoice
   */
  invoiceEnd: MonthYear;

  /**
   * List of all residents
   */
  residents: Resident[];

  /**
   * Water costs
   */
  waterCosts: WaterCosts;
}

/**
 * Calculates the water costs for the invoice
 * @param args arguments for the water cost calculation
 * @returns water cost calculations for all residents and the current water costs
 */
export default function calculateWaterCosts(
  args: WaterCostCalculationArguments,
) {
  const { waterUsageCostPerCubicMeter, sewageCostPerCubicMeter } = getWaterCosts(args);

  const residentCosts = Object.fromEntries(
    args.residents.map((resident) => [
      resident.id,
      calculateWaterCostsForResident({
        resident,
        waterUsageCostPerCubicMeter,
        sewageCostPerCubicMeter,
      }),
    ]),
  );

  return {
    waterCosts: {
      waterUsageCostPerCubicMeter,
      sewageCostPerCubicMeter,
      totalMonthlyDeductions: 0,
    },
    residentCosts,
  };
}

/**
 * Returns the water costs used in this invoice (last costs that are before the invoice end)
 */
function getWaterCosts(args: WaterCostCalculationArguments) {
  const sorter = (a: WaterCost, b: WaterCost) => b.date.getTime() - a.date.getTime();
  const waterUsageCosts = [...args.waterCosts.waterUsageCosts].sort(sorter);
  const sewageCosts = [...args.waterCosts.sewageCosts].sort(sorter);

  const finder = (c: WaterCost) => c.date <= args.invoiceEnd;
  const waterUsageCost = waterUsageCosts.find(finder) as WaterCost;
  const sewageCost = sewageCosts.find(finder) as WaterCost;

  return {
    waterUsageCostPerCubicMeter: waterUsageCost.costPerCubicMeter,
    sewageCostPerCubicMeter: sewageCost.costPerCubicMeter,
  };
}

/**
 * Calculates the water costs for a single resident
 */
function calculateWaterCostsForResident(args: {
  resident: Resident;
  waterUsageCostPerCubicMeter: CurrencyInCents;
  sewageCostPerCubicMeter: CurrencyInCents;
}) {
  const { lastWaterMeterCount, currentWaterMeterCount } = getWaterCounts(
    args.resident,
  );
  const waterUsage = currentWaterMeterCount - lastWaterMeterCount;
  const waterUsageCosts = Math.ceil(
    waterUsage * args.waterUsageCostPerCubicMeter,
  );
  const sewageCosts = Math.ceil(waterUsage * args.sewageCostPerCubicMeter);

  return {
    lastWaterMeterCount,
    currentWaterMeterCount,
    waterUsage,
    waterUsageCosts,
    sewageCosts,
    monthlyDeductionCosts: 0,
  };
}

/**
 * Returns the last and current water count for the resident
 */
function getWaterCounts(resident: Resident) {
  const waterMeterReadings = [...resident.waterMeterReadings].sort(
    (a, b) => b.readingDate.getTime() - a.readingDate.getTime(),
  );
  const lastWaterMeterCount = waterMeterReadings.find(
    (r) => r.wasDeductedInInvoice,
  )?.waterMeterCount as number;
  const currentWaterMeterCount = waterMeterReadings[0].waterMeterCount;

  return {
    lastWaterMeterCount,
    currentWaterMeterCount,
  };
}
