import { range } from 'lodash';
import './date.extension';
import MonthYear from './month_year.extension';

describe('MonthYear', () => {
  describe('constructor', () => {
    test('should create new object with month and year', () => {
      // Arrange
      const expectedDate = new Date(2023, 5, 1).toUTC();

      // Act
      const monthYear = new MonthYear(5, 2023);

      // Assert
      expect(monthYear).toEqual(expectedDate);
    });

    test('should create new object with current month + year', () => {
      // Arrange
      const expectedDate = new Date().toUTC();
      expectedDate.setDate(1);

      // Act
      const monthYear = new MonthYear();

      // Assert
      expect(monthYear).toEqual(expectedDate);
    });
  });

  describe('addMonths', () => {
    test.each([
      [5, 2023, 1, 6, 2023],
      [5, 2023, -1, 4, 2023],
      [10, 2023, 14, 0, 2025],
      [1, 2023, -14, 11, 2021],
    ])(
      'should return right month-year (%i.%i +%i = %i.%i)',
      (oldMonth, oldYear, added, expectedMonth, expectedYear) => {
        // Arrange
        const date = new MonthYear(oldMonth, oldYear);
        const expectedDate = new MonthYear(expectedMonth, expectedYear);

        // Act
        date.addMonths(added);

        // Assert
        expect(date).toEqual(expectedDate);
      },
    );

    test('should use default value', () => {
      // Arrange
      const date = new MonthYear(5, 2023);
      const expectedDate = new MonthYear(6, 2023);

      // Act
      date.addMonths();

      // Assert
      expect(date).toEqual(expectedDate);
    });
  });

  describe('clone', () => {
    test('should clone object correctly', () => {
      // Arrange
      const date = new MonthYear(5, 2023);

      // Act
      const cloned = date.clone();

      // Assert
      expect(cloned).toEqual(date);
    });
  });

  describe('equals', () => {
    test.each([
      [new MonthYear(5, 2023), new MonthYear(5, 2023), true],
      [new MonthYear(5, 2023), new MonthYear(6, 2023), false],
      [new MonthYear(5, 2023), new MonthYear(4, 2023), false],
    ])('%s and %s equals should be %s', (date1, date2, expectedAreEqual) => {
      // Act
      const areEqual = date1.equals(date2);

      // Assert
      expect(areEqual).toEqual(expectedAreEqual);
    });
  });

  describe('timespan', () => {
    test('should return right months for end > start', () => {
      // Arrange
      const expectedTimespan = range(5, 9).map((m) => new MonthYear(m, 2023));

      // Act
      const timespan = MonthYear.timespan(
        expectedTimespan[0],
        expectedTimespan.at(-1)!,
      );

      // Assert
      expect(timespan).toEqual(expectedTimespan);
    });

    test('should return right months for end < start', () => {
      // Arrange
      const expectedTimespan = range(9, 5).map((m) => new MonthYear(m, 2023));

      // Act
      const timespan = MonthYear.timespan(
        expectedTimespan[0],
        expectedTimespan.at(-1)!,
      );

      // Assert
      expect(timespan).toEqual(expectedTimespan);
    });

    test('should return right months for end === start', () => {
      // Arrange
      const expectedTimespan = [new MonthYear(5, 2023)];

      // Act
      const timespan = MonthYear.timespan(
        expectedTimespan[0],
        expectedTimespan[0],
      );

      // Assert
      expect(timespan).toEqual(expectedTimespan);
    });
  });

  describe('toString', () => {
    test.each(
      [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ].map((m, i) => [i, 2023, m]),
    )(
      'should return right string representation for %i.%i',
      (month, year, monthString) => {
        // Arrange
        const date = new MonthYear(month, year);
        const expectedDateString = `${monthString} ${year}`;

        // Act
        const dateString = date.toString();

        // Assert
        expect(dateString).toEqual(expectedDateString);
      },
    );
  });
});
