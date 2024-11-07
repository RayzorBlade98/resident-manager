import MonthYear from '_/extensions/date/month_year.extension';
import LandlordBuilder from '_/test/builders/landlord.builder';

export const invoiceStart = new MonthYear(5, 2024);
export const invoiceEnd = new MonthYear(7, 2024);
export const newDeductionStart = new MonthYear(9, 2024);

export const landlord = new LandlordBuilder().build();
