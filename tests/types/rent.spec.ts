/* eslint-disable max-len */

import RentInformationBuilder from '_tests/__test_utils__/builders/rent_information_builder';
import { MonthYearUtils } from '_types/date';
import { RentInformation, RentInformationUtils } from '_types/rent';

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
