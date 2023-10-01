import WaterCosts, { WaterCost } from '_/models/incidentals/WaterCosts';
import Invoice from '_/models/invoice/invoice';
import { Resident } from '_/models/resident/resident';

/**
 * Arguments for the water cost calculation
 */
interface WaterCostCalculationArguments {
  /**
   * Invoice the water cost calculation should be added to
   */
  invoice: Invoice;

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
 * Adds the water cost calculation to the invoice
 * @param args arguments for the water cost calculation
 */
export default function addWaterCostsToInvoice(
  args: WaterCostCalculationArguments,
): void {
  const { waterUsageCostPerCubicMeter, sewageCostPerCubicMeter } = getWaterCosts(args);

  // Add water costs to invoice
  args.invoice.waterCosts = {
    waterUsageCostPerCubicMeter,
    sewageCostPerCubicMeter,
  };

  for (const resident of args.residents) {
    const { lastWaterMeterCount, currentWaterMeterCount } = getWaterCounts(resident);
    const waterUsage = currentWaterMeterCount - lastWaterMeterCount;
    const waterUsageCosts = Math.ceil(waterUsage * waterUsageCostPerCubicMeter);
    const sewageCosts = Math.ceil(waterUsage * sewageCostPerCubicMeter);

    args.invoice.residentInformation[resident.id].waterCosts = {
      lastWaterMeterCount,
      currentWaterMeterCount,
      waterUsage,
      waterUsageCosts,
      sewageCosts,
    };
  }
}

/**
 * Returns the water costs used in this invoice (last costs that are before the invoice end)
 */
function getWaterCosts(args: WaterCostCalculationArguments) {
  const sorter = (a: WaterCost, b: WaterCost) => b.date.getTime() - a.date.getTime();
  const waterUsageCosts = [...args.waterCosts.waterUsageCosts].sort(sorter);
  const sewageCosts = [...args.waterCosts.sewageCosts].sort(sorter);

  const finder = (c: WaterCost) => c.date <= args.invoice.end;
  const waterUsageCost = waterUsageCosts.find(finder) ?? waterUsageCosts[0];
  const sewageCost = sewageCosts.find(finder) ?? sewageCosts[0];

  return {
    waterUsageCostPerCubicMeter: waterUsageCost.costPerCubicMeter,
    sewageCostPerCubicMeter: sewageCost.costPerCubicMeter,
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
