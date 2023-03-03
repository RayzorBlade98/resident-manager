/* eslint-disable max-len */

import RentInformationBuilder from '_tests/__test_utils__/builders/rent_information_builder';
import { MonthYearUtils } from '_types/date';
import {
  PaymentStatus,
  RentInformation,
  RentInformationUtils,
} from '_types/rent';

describe('RentInformationUtils', () => {
  describe('addMissingMonths', () => {
    test('should add no new information if last month is in future', () => {
      // Arrange
      const rentInformation: RentInformation[] = [
        new RentInformationBuilder().build(),
      ];
      const oldRentInformation: RentInformation[] = [...rentInformation];
      MonthYearUtils.getCurrentMonthYear = jest
        .fn()
        .mockReturnValue(
          MonthYearUtils.subtractMonths(rentInformation[0].dueDate, 1),
        );

      // Act
      RentInformationUtils.addMissingMonths(rentInformation);

      // Assert
      expect(rentInformation).toEqual(oldRentInformation);
    });

    test('should add no new information if last month === current month', () => {
      // Arrange
      const rentInformation: RentInformation[] = [
        new RentInformationBuilder().build(),
      ];
      const oldRentInformation: RentInformation[] = [...rentInformation];
      MonthYearUtils.getCurrentMonthYear = jest
        .fn()
        .mockReturnValue(rentInformation[0].dueDate);

      // Act
      RentInformationUtils.addMissingMonths(rentInformation);

      // Assert
      expect(rentInformation).toEqual(oldRentInformation);
    });

    test('should add new rent information', () => {
      // Arrange
      const rentInformation: RentInformation[] = [
        new RentInformationBuilder().build(),
      ];
      const expectedRentInformation: RentInformation[] = [
        ...rentInformation,
        {
          ...rentInformation[0],
          dueDate: MonthYearUtils.addMonths(rentInformation[0].dueDate, 1),
        },
        {
          ...rentInformation[0],
          dueDate: MonthYearUtils.addMonths(rentInformation[0].dueDate, 2),
        },
      ];
      MonthYearUtils.getCurrentMonthYear = jest
        .fn()
        .mockReturnValue(
          MonthYearUtils.addMonths(rentInformation[0].dueDate, 2),
        );

      // Act
      RentInformationUtils.addMissingMonths(rentInformation);

      // Assert
      expect(rentInformation).toEqual(expectedRentInformation);
    });
  });

  describe('getAmountToPay', () => {
    test('should return right amount', () => {
      // Arrange
      const rentInformation = new RentInformationBuilder().build();
      const expectedAmount = rentInformation.rent + rentInformation.incidentals;

      // Act
      const outputAmount = RentInformationUtils.getAmountToPay(rentInformation);

      // Assert
      expect(outputAmount).toBe(expectedAmount);
    });
  });

  describe('getPaymentStatus', () => {
    test('should return unpaid status for unpaid rent', () => {
      // Arrange
      const rentInformation = new RentInformationBuilder().build();
      const expectedStatus = PaymentStatus.Unpaid;

      // Act
      const outputStatus = RentInformationUtils.getPaymentStatus(rentInformation);

      // Assert
      expect(outputStatus).toEqual(expectedStatus);
    });

    test('should return paid status for paid rent', () => {
      // Arrange
      const rentInformation = new RentInformationBuilder()
        .withRent(500)
        .withIncidentals(100)
        .withPayment(600, '03.03.2023')
        .build();
      const expectedStatus = PaymentStatus.Paid;

      // Act
      const outputStatus = RentInformationUtils.getPaymentStatus(rentInformation);

      // Assert
      expect(outputStatus).toEqual(expectedStatus);
    });

    test('should return partially paid status for not enough paid rent', () => {
      // Arrange
      const rentInformation = new RentInformationBuilder()
        .withRent(500)
        .withIncidentals(100)
        .withPayment(500, '03.03.2023')
        .build();
      const expectedStatus = PaymentStatus.PaidPartially;

      // Act
      const outputStatus = RentInformationUtils.getPaymentStatus(rentInformation);

      // Assert
      expect(outputStatus).toEqual(expectedStatus);
    });
  });

  describe('timespan', () => {
    test('should return right information if start < end', () => {
      // Arrange
      const baseRentInformation = new RentInformationBuilder().build();
      const expected: RentInformation[] = [
        baseRentInformation,
        {
          ...baseRentInformation,
          dueDate: MonthYearUtils.addMonths(baseRentInformation.dueDate, 1),
        },
        {
          ...baseRentInformation,
          dueDate: MonthYearUtils.addMonths(baseRentInformation.dueDate, 2),
        },
      ];

      // Act
      const timespan = RentInformationUtils.timespan(
        baseRentInformation.dueDate,
        MonthYearUtils.addMonths(baseRentInformation.dueDate, 2),
        baseRentInformation.rent,
        baseRentInformation.incidentals,
      );

      // Assert
      expect(timespan).toEqual(expected);
    });

    test('should return right information if start > end', () => {
      // Arrange
      const baseRentInformation = new RentInformationBuilder().build();
      const expected: RentInformation[] = [baseRentInformation];

      // Act
      const timespan = RentInformationUtils.timespan(
        baseRentInformation.dueDate,
        MonthYearUtils.subtractMonths(baseRentInformation.dueDate, 2),
        baseRentInformation.rent,
        baseRentInformation.incidentals,
      );

      // Assert
      expect(timespan).toEqual(expected);
    });

    test('should return right information if start === end', () => {
      // Arrange
      const baseRentInformation = new RentInformationBuilder().build();
      const expected: RentInformation[] = [baseRentInformation];

      // Act
      const timespan = RentInformationUtils.timespan(
        baseRentInformation.dueDate,
        baseRentInformation.dueDate,
        baseRentInformation.rent,
        baseRentInformation.incidentals,
      );

      // Assert
      expect(timespan).toEqual(expected);
    });
  });
});
