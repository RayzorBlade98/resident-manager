import MonthYear from '_/extensions/date/month_year.extension';
import WaterCosts from '_/models/incidentals/WaterCosts';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

class WaterCostsBuilder {
  private waterCosts: WaterCosts;

  constructor() {
    this.waterCosts = {
      waterUsageCosts: [],
      sewageCosts: [],
    };
  }

  public addWaterUsageCost(
    costPerCubicMeter: CurrencyInCents,
    date: MonthYear,
  ): WaterCostsBuilder {
    this.waterCosts.waterUsageCosts.push({ costPerCubicMeter, date });
    return this;
  }

  public addSewageCost(
    costPerCubicMeter: CurrencyInCents,
    date: MonthYear,
  ): WaterCostsBuilder {
    this.waterCosts.sewageCosts.push({ costPerCubicMeter, date });
    return this;
  }

  public build(): WaterCosts {
    return this.waterCosts;
  }
}

export default WaterCostsBuilder;
