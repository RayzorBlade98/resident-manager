import { range } from 'lodash';
import RentInformationUtils from './rent.utils';
import MonthYear from '_/extensions/date/month_year.extension';
import { PaymentStatus } from '_/models/resident/rent';
import RentInformationBuilder from '_/test/builders/rent_information.builder';

describe('RentInformationUtils', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 5, 9));
  });

  describe('addMissingMonths', () => {
    test('should add missing months if last rent is in the past', () => {
      // Arrange
      const rents = [
        new RentInformationBuilder()
          .withDueDate(new MonthYear(3, 2023))
          .build(),
      ];
      const expectedRents = range(3, 6).map((m) => new RentInformationBuilder()
        .withDueDate(new MonthYear(m, 2023))
        .build());

      // Act
      RentInformationUtils.addMissingMonths(rents);

      // Assert
      expect(rents).toEqual(expectedRents);
    });

    test("shouldn't add anything if last rent isn't in the past", () => {
      // Arrange
      const rents = [
        new RentInformationBuilder()
          .withDueDate(new MonthYear(5, 2023))
          .build(),
      ];
      const expectedRents = [...rents];

      // Act
      RentInformationUtils.addMissingMonths(rents);

      // Assert
      expect(rents).toEqual(expectedRents);
    });
  });

  describe('getAmountToPay', () => {
    test('should return right amount', () => {
      // Arrange
      const rent = new RentInformationBuilder()
        .withIncidentals(111)
        .withRent(222)
        .build();

      // Act
      const toPay = RentInformationUtils.getAmountToPay(rent);

      // Assert
      expect(toPay).toBe(333);
    });
  });

  describe('getPaymentStatus', () => {
    test.each([
      [PaymentStatus.Paid, 333, false],
      [PaymentStatus.Paid, 400, false],
      [PaymentStatus.PaidPartially, 300, false],
      [PaymentStatus.Unpaid, undefined, false],
      [PaymentStatus.DeductedInInvoice, undefined, true],
    ])(
      'should return stauts %s for paymentAmount %s and invoice deduction %s',
      (expectedStatus, payment, wasDeductedInInvoice) => {
        // Arrange
        const rent = new RentInformationBuilder()
          .withIncidentals(111)
          .withRent(222)
          .withInvoiceDeduction(wasDeductedInInvoice)
          .build();
        rent.paymentAmount = payment;

        // Act
        const status = RentInformationUtils.getPaymentStatus(rent);

        // Assert
        expect(status).toBe(expectedStatus);
      },
    );
  });

  describe('timespan', () => {
    test('should return right timespan if end > start', () => {
      const start = new MonthYear(5, 2023);
      const end = new MonthYear(7, 2023);
      const rent = 666;
      const incidentals = 111;
      const expectedRents = range(5, 8).map((m) => new RentInformationBuilder()
        .withDueDate(new MonthYear(m, 2023))
        .withRent(rent)
        .withIncidentals(incidentals)
        .build());

      // Act
      const timespan = RentInformationUtils.timespan(
        start,
        end,
        rent,
        incidentals,
      );

      // Assert
      expect(timespan).toEqual(expectedRents);
    });

    test('should return right timespan if end == start', () => {
      const startEnd = new MonthYear(5, 2023);
      const rent = 666;
      const incidentals = 111;
      const expectedRents = [
        new RentInformationBuilder()
          .withDueDate(new MonthYear(5, 2023))
          .withRent(rent)
          .withIncidentals(incidentals)
          .build(),
      ];

      // Act
      const timespan = RentInformationUtils.timespan(
        startEnd,
        startEnd,
        rent,
        incidentals,
      );

      // Assert
      expect(timespan).toEqual(expectedRents);
    });

    test('should return right timespan if end < start', () => {
      const start = new MonthYear(5, 2023);
      const end = new MonthYear(4, 2023);
      const rent = 666;
      const incidentals = 111;
      const expectedRents = [
        new RentInformationBuilder()
          .withDueDate(new MonthYear(5, 2023))
          .withRent(rent)
          .withIncidentals(incidentals)
          .build(),
      ];

      // Act
      const timespan = RentInformationUtils.timespan(
        start,
        end,
        rent,
        incidentals,
      );

      // Assert
      expect(timespan).toEqual(expectedRents);
    });
  });
});
