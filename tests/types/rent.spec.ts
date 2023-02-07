import { Month, MonthYear } from '_types/date';
import { RentInformation, RentInformationUtils } from '_types/rent';

describe('RentInformationUtils', () => {
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
        { dueDate: start, rent: rent, isPaid: false },
        {
          dueDate: { month: Month.March, year: 2023 },
          rent: rent,
          isPaid: false,
        },
        { dueDate: end, rent: rent, isPaid: false },
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
        { dueDate: start, rent: rent, isPaid: false },
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
        { dueDate: start, rent: rent, isPaid: false },
      ];

      // Act
      const timespan = RentInformationUtils.timespan(start, end, rent);

      // Assert
      expect(timespan).toEqual(expected);
    });
  });
});
