import _ from 'lodash';
import MonthYear from '_/extensions/date/month_year.extension';
import WaterCosts, {
  MonthlyWaterDeduction,
  WaterCost,
} from '_/models/incidentals/WaterCosts';
import Invoice from '_/models/invoice/invoice';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

type WaterCostsCalculationArgs = {
  start: MonthYear;
  end: MonthYear;
  waterCosts: WaterCosts;
};

export function calculateWaterCosts(
  args: WaterCostsCalculationArgs,
): Invoice['waterCosts'] {
  return {
    waterUsageCostPerCubicMeter: getWaterCostPerCubicMeterForDate(
      args.waterCosts.waterUsageCosts,
      args.end,
    ),
    sewageCostPerCubicMeter: getWaterCostPerCubicMeterForDate(
      args.waterCosts.sewageCosts,
      args.end,
    ),
    totalMonthlyDeductions: sumMonthlyDeductions(
      args.waterCosts.monthlyDeductions,
      args.start,
      args.end,
    ),
  };
}

function getWaterCostPerCubicMeterForDate(
  waterCosts: WaterCost[],
  date: MonthYear,
): CurrencyInCents {
  const cost = waterCosts.find((c) => c.date <= date) as WaterCost;
  return cost.costPerCubicMeter;
}

function sumMonthlyDeductions(
  deductions: MonthlyWaterDeduction[],
  start: MonthYear,
  end: MonthYear,
): CurrencyInCents {
  // Create timespan for all months included in the invoice period
  const months = MonthYear.timespan(start, end);

  // Map all months to their monthly deduction
  const monthlyDeductions = months.map(
    (m) => deductions.find((d) => d.date <= m) as MonthlyWaterDeduction,
  );

  // Sum up all monthly deductions
  return _.sumBy(monthlyDeductions, (d) => d.deductionCost);
}
