import { getInvoiceMonthsForResident } from './getInvoiceMonthsForResident';
import MonthYear from '_/extensions/date/month_year.extension';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('getInvoiceMonthsForResident', () => {
  const monthsInInvoicePeriod = 4;
  const invoiceStart = new MonthYear(10, 2024);
  const invoiceEnd = invoiceStart.addMonths(monthsInInvoicePeriod - 1);

  it('should return correct amount of months for resident with contract start before invoice start', () => {
    // Arrange
    const resident = new ResidentBuilder()
      .withContractStart(invoiceStart.addMonths(-5))
      .build();

    // Act
    const months = getInvoiceMonthsForResident(
      resident,
      invoiceStart,
      invoiceEnd,
    );

    // Assert
    expect(months).toBe(monthsInInvoicePeriod);
  });

  it('should return correct amount of months for resident with contract start after invoice start', () => {
    // Arrange
    const contractStartOffset = 2;
    const resident = new ResidentBuilder()
      .withContractStart(invoiceStart.addMonths(contractStartOffset))
      .build();

    // Act
    const months = getInvoiceMonthsForResident(
      resident,
      invoiceStart,
      invoiceEnd,
    );

    // Assert
    expect(months).toBe(monthsInInvoicePeriod - contractStartOffset);
  });
});
