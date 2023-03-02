/* eslint-disable max-len */

import { Month, MonthYear, MonthYearUtils } from '_types/date';
import { RentInformation, RentInformationUtils } from '_types/rent';

describe('RentInformationUtils', () => {
  describe('addMissingMonths', () => {
    test('should add no new information if last month is in future', () => {
      // Arrange
      const rentInformation: RentInformation[] = [
        { dueDate: { month: Month.May, year: 2023 }, rent: 500, isPaid: false },
      ];
      const oldRentInformation: RentInformation[] = [...rentInformation];
      MonthYearUtils.getCurrentMonthYear = jest
        .fn()
        .mockReturnValue({ month: Month.March, year: 2023 });

      // Act
      RentInformationUtils.addMissingMonths(rentInformation);

      // Assert
      expect(rentInformation).toEqual(oldRentInformation);
    });

    test('should add no new information if last month === current month', () => {
      // Arrange
      const currentMonth: MonthYear = { month: Month.March, year: 2023 };
      const rentInformation: RentInformation[] = [
        { dueDate: currentMonth, rent: 500, isPaid: false },
      ];
      const oldRentInformation: RentInformation[] = [...rentInformation];
      MonthYearUtils.getCurrentMonthYear = jest
        .fn()
        .mockReturnValue(currentMonth);

      // Act
      RentInformationUtils.addMissingMonths(rentInformation);

      // Assert
      expect(rentInformation).toEqual(oldRentInformation);
    });

    test('should add new rent information', () => {
      // Arrange
      const rentInformation: RentInformation[] = [
        {
          dueDate: { month: Month.January, year: 2023 },
          rent: 500,
          isPaid: false,
        },
      ];
      const expectedRentInformation: RentInformation[] = [
        ...rentInformation,
        {
          dueDate: { month: Month.Febuary, year: 2023 },
          rent: 500,
          isPaid: false,
        },
        {
          dueDate: { month: Month.March, year: 2023 },
          rent: 500,
          isPaid: false,
        },
      ];
      MonthYearUtils.getCurrentMonthYear = jest
        .fn()
        .mockReturnValue({ month: Month.March, year: 2023 });

      // Act
      RentInformationUtils.addMissingMonths(rentInformation);

      // Assert
      expect(rentInformation).toEqual(expectedRentInformation);
    });
  });

  describe('timespan', () => {
    test('should return right information if start < end', () => {
      // Arrange
      const start: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const end: MonthYear = {
        month: Month.April,
        year: 2023,
      };
      const rent = 500;
      const expected: RentInformation[] = [
        { dueDate: start, rent, isPaid: false },
        {
          dueDate: { month: Month.March, year: 2023 },
          rent,
          isPaid: false,
        },
        { dueDate: end, rent, isPaid: false },
      ];

      // Act
      const timespan = RentInformationUtils.timespan(start, end, rent);

      // Assert
      expect(timespan).toEqual(expected);
    });

    test('should return right information if start > end', () => {
      // Arrange
      const start: MonthYear = {
        month: Month.April,
        year: 2023,
      };
      const end: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const rent = 500;
      const expected: RentInformation[] = [
        { dueDate: start, rent, isPaid: false },
      ];

      // Act
      const timespan = RentInformationUtils.timespan(start, end, rent);

      // Assert
      expect(timespan).toEqual(expected);
    });

    test('should return right information if start === end', () => {
      // Arrange
      const start: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const end: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const rent = 500;
      const expected: RentInformation[] = [
        { dueDate: start, rent, isPaid: false },
      ];

      // Act
      const timespan = RentInformationUtils.timespan(start, end, rent);

      // Assert
      expect(timespan).toEqual(expected);
    });
  });
});
