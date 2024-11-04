import { invoiceEnd, invoiceStart } from './invoiceInformation';
import WaterCosts, {
  MonthlyWaterDeduction,
  WaterCost,
} from '_/models/incidentals/WaterCosts';

/**
 * Costs per m³: 3
 */
const waterUsageCosts: WaterCost[] = [
  {
    date: invoiceEnd.addMonths(1),
    costPerCubicMeter: 10000,
  },
  {
    date: invoiceEnd.addMonths(-1),
    costPerCubicMeter: 3,
  },
  {
    date: invoiceStart,
    costPerCubicMeter: 10000,
  },
  {
    date: invoiceStart.addMonths(-1),
    costPerCubicMeter: 10000,
  },
];

/**
 * Costs per m³: 2
 */
const sewageCosts: WaterCost[] = [
  {
    date: invoiceEnd.addMonths(1),
    costPerCubicMeter: 10000,
  },
  {
    date: invoiceEnd,
    costPerCubicMeter: 2,
  },
  {
    date: invoiceStart,
    costPerCubicMeter: 10000,
  },
  {
    date: invoiceStart.addMonths(-1),
    costPerCubicMeter: 10000,
  },
];

/**
 * Monthly deductions:
 *  - 400
 *  - 100
 *  - 100
 * Total: 600
 *
 * Avg. deduction per month: 200
 * Avg. deduction per month per apartment: 50
 */
const monthlyDeductions: MonthlyWaterDeduction[] = [
  {
    date: invoiceEnd.addMonths(1),
    deductionCost: 10000,
  },
  {
    date: invoiceEnd,
    deductionCost: 400,
  },
  {
    date: invoiceStart,
    deductionCost: 100,
  },
  {
    date: invoiceStart.addMonths(-1),
    deductionCost: 10000,
  },
];

export const waterCosts: WaterCosts = {
  waterUsageCosts,
  sewageCosts,
  monthlyDeductions,
};
