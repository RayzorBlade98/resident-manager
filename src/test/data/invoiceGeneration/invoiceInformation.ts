import MonthYear from '_/extensions/date/month_year.extension';
import LandlordBuilder from '_/test/builders/landlord.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import WaterCostsBuilder from '_/test/builders/waterCosts.builder';

export const invoiceStart = new MonthYear(0, 2023);
export const invoiceEnd = new MonthYear(2, 2023);

export const property = new PropertyBuilder().withNumberOfApartments(10).build();
export const landlord = new LandlordBuilder().build();

export const waterUsageCostPerCubicMeter = 2;
export const sewageCostPerCubicMeter = 1;
export const waterCosts = new WaterCostsBuilder()
  .addWaterUsageCost(500, new MonthYear(11, 2022))
  .addWaterUsageCost(500, new MonthYear(0, 2023))
  .addWaterUsageCost(500, new MonthYear(1, 2023))
  .addWaterUsageCost(waterUsageCostPerCubicMeter, new MonthYear(2, 2023))
  .addWaterUsageCost(500, new MonthYear(3, 2023))
  .addSewageCost(500, new MonthYear(11, 2022))
  .addSewageCost(500, new MonthYear(0, 2023))
  .addSewageCost(500, new MonthYear(1, 2023))
  .addSewageCost(sewageCostPerCubicMeter, new MonthYear(2, 2023))
  .addSewageCost(500, new MonthYear(3, 2023))
  .build();
