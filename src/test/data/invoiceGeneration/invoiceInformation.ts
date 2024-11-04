import MonthYear from '_/extensions/date/month_year.extension';
import LandlordBuilder from '_/test/builders/landlord.builder';
import PropertyBuilder from '_/test/builders/property.builder';

export const invoiceStart = new MonthYear(5, 2024);
export const invoiceEnd = new MonthYear(7, 2024);
export const newDeductionStart = new MonthYear(9, 2024);

export const property = new PropertyBuilder().withNumberOfApartments(4).build();
export const landlord = new LandlordBuilder().build();
