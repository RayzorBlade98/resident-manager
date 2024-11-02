import MonthYear from '_/extensions/date/month_year.extension';
import LandlordBuilder from '_/test/builders/landlord.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

export const invoiceStart = new MonthYear(5, 2024);
export const invoiceEnd = new MonthYear(7, 2024);
export const newDeductionStart = new MonthYear(9, 2024);

export const property = new PropertyBuilder().build();
export const landlord = new LandlordBuilder().build();

// todo correct values
export const waterUsageCostPerCubicMeter: CurrencyInCents = 1;
export const sewageCostPerCubicMeter: CurrencyInCents = 1;
