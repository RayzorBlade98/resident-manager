/* eslint-disable max-len */

import {
  Month, MonthYear, MonthYearString, MonthYearUtils,
} from '_types/date';

describe('MonthYearUtils', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('addMonths', () => {
    test('should add the right amount of months', () => {
      // Arrange
      const before: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const addedMonths = 6;
      const expected: MonthYear = {
        month: Month.August,
        year: 2023,
      };

      // Act
      const after = MonthYearUtils.addMonths(before, addedMonths);

      // Assert
      expect(after).toEqual(expected);
    });

    test('should add the right amount of months when year changes', () => {
      // Arrange
      const before: MonthYear = {
        month: Month.August,
        year: 2023,
      };
      const addedMonths = 6;
      const expected: MonthYear = {
        month: Month.Febuary,
        year: 2024,
      };

      // Act
      const after = MonthYearUtils.addMonths(before, addedMonths);

      // Assert
      expect(after).toEqual(expected);
    });

    test('should return same month if adding 0 months', () => {
      // Arrange
      const before: MonthYear = {
        month: Month.September,
        year: 2023,
      };
      const addedMonths = 0;

      // Act
      const after = MonthYearUtils.addMonths(before, addedMonths);

      // Assert
      expect(after).toEqual(before);
    });

    test('should call subtractMonth when adding negative months', () => {
      // Arrange
      const before: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const addedMonths = -6;
      const spy = jest
        .spyOn(MonthYearUtils, 'subtractMonths')
        .mockReturnValue(before);

      // Act
      MonthYearUtils.addMonths(before, addedMonths);

      // Assert
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(before, addedMonths * -1);
    });

    test('should add 1 month if no amount is provided', () => {
      // Arrange
      const before: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const expected: MonthYear = {
        month: Month.March,
        year: 2023,
      };

      // Act
      const after = MonthYearUtils.addMonths(before);

      // Assert
      expect(after).toEqual(expected);
    });
  });

  describe('areEqual', () => {
    test('should be equal if month and year are the same', () => {
      // Arrange
      const a: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const b: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };

      // Act
      const areEqual = MonthYearUtils.areEqual(a, b);

      // Assert
      expect(areEqual).toBeTruthy();
    });

    test("shouldn't be equal if the months aren't the same", () => {
      // Arrange
      const a: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const b: MonthYear = {
        month: Month.March,
        year: 2023,
      };

      // Act
      const areEqual = MonthYearUtils.areEqual(a, b);

      // Assert
      expect(areEqual).toBeFalsy();
    });

    test("shouldn't be equal if the years aren't the same", () => {
      // Arrange
      const a: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const b: MonthYear = {
        month: Month.Febuary,
        year: 2024,
      };

      // Act
      const areEqual = MonthYearUtils.areEqual(a, b);

      // Assert
      expect(areEqual).toBeFalsy();
    });
  });

  describe('compare', () => {
    test('should return 0 if both object are equal', () => {
      // Arrange
      const a: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const b: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };

      // Act
      const comparation = MonthYearUtils.compare(a, b);

      // Assert
      expect(comparation).toBe(0);
    });

    test('should return <0 if first year is smaller than second year', () => {
      // Arrange
      const a: MonthYear = {
        month: Month.Febuary,
        year: 2020,
      };
      const b: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };

      // Act
      const comparation = MonthYearUtils.compare(a, b);

      // Assert
      expect(comparation).toBeLessThan(0);
    });

    test('should return >0 if first year is bigger than second year', () => {
      // Arrange
      const a: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const b: MonthYear = {
        month: Month.Febuary,
        year: 2020,
      };

      // Act
      const comparation = MonthYearUtils.compare(a, b);

      // Assert
      expect(comparation).toBeGreaterThan(0);
    });

    test('should return <0 if years are same and first month is smaller than second month', () => {
      // Arrange
      const a: MonthYear = {
        month: Month.January,
        year: 2023,
      };
      const b: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };

      // Act
      const comparation = MonthYearUtils.compare(a, b);

      // Assert
      expect(comparation).toBeLessThan(0);
    });

    test('should return >0 if years are same and first month is bigger than second month', () => {
      // Arrange
      const a: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const b: MonthYear = {
        month: Month.January,
        year: 2023,
      };

      // Act
      const comparation = MonthYearUtils.compare(a, b);

      // Assert
      expect(comparation).toBeGreaterThan(0);
    });
  });

  describe('getCurrentMonthYear', () => {
    test('should return right month and year', () => {
      // Arrange
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2023, 1, 7));
      const expected: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };

      // Act
      const currentMonth = MonthYearUtils.getCurrentMonthYear();

      // Assert
      expect(currentMonth).toEqual(expected);
    });
  });

  describe('parseString', () => {
    test('should parse to right month and year', () => {
      // Arrange
      const stringToParse: MonthYearString = `${Month.Febuary} 2023`;
      const expected: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };

      // Act
      const parsed = MonthYearUtils.parseString(stringToParse);

      // Assert
      expect(parsed).toEqual(expected);
    });
  });

  describe('subtractMonths', () => {
    test('should subtract the right amount of months', () => {
      // Arrange
      const before: MonthYear = {
        month: Month.August,
        year: 2023,
      };
      const subtractedMonths = 6;
      const expected: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };

      // Act
      const after = MonthYearUtils.subtractMonths(before, subtractedMonths);

      // Assert
      expect(after).toEqual(expected);
    });

    test('should subtract the right amount of months when year changes', () => {
      // Arrange
      const before: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const subtractedMonths = 6;
      const expected: MonthYear = {
        month: Month.August,
        year: 2022,
      };

      // Act
      const after = MonthYearUtils.subtractMonths(before, subtractedMonths);

      // Assert
      expect(after).toEqual(expected);
    });

    test('should return same month if subtracting 0 months', () => {
      // Arrange
      const before: MonthYear = {
        month: Month.September,
        year: 2023,
      };
      const subtractedMonths = 0;

      // Act
      const after = MonthYearUtils.subtractMonths(before, subtractedMonths);

      // Assert
      expect(after).toEqual(before);
    });

    test('should call addMonths when subtracting negative months', () => {
      // Arrange
      const before: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const subtractedMonths = -6;
      const spy = jest
        .spyOn(MonthYearUtils, 'addMonths')
        .mockReturnValue(before);

      // Act
      MonthYearUtils.subtractMonths(before, subtractedMonths);

      // Assert
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(before, subtractedMonths * -1);
    });

    test('should subtract 1 month if no amount is provided', () => {
      // Arrange
      const before: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const expected: MonthYear = {
        month: Month.January,
        year: 2023,
      };

      // Act
      const after = MonthYearUtils.subtractMonths(before);

      // Assert
      expect(after).toEqual(expected);
    });
  });

  describe('toString', () => {
    test('should return right string', () => {
      // Assert
      const monthYear: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const expected: MonthYearString = `${Month.Febuary} 2023`;

      // Act
      const stringedMonthYear = MonthYearUtils.toString(monthYear);

      // Assert
      expect(stringedMonthYear).toBe(expected);
    });
  });

  describe('timespan', () => {
    test('should return right timespan for start < end', () => {
      // Arrange
      const start: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const end: MonthYear = {
        month: Month.April,
        year: 2023,
      };
      const expected = [start, { month: Month.March, year: 2023 }, end];

      // Act
      const timespan = MonthYearUtils.timespan(start, end);

      // Assert
      expect(timespan).toEqual(expected);
    });

    test('should return right timespan for start > end', () => {
      // Arrange
      const start: MonthYear = {
        month: Month.April,
        year: 2023,
      };
      const end: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const expected = [start, { month: Month.March, year: 2023 }, end];

      // Act
      const timespan = MonthYearUtils.timespan(start, end);

      // Assert
      expect(timespan).toEqual(expected);
    });

    test('should return right timespan for start === end', () => {
      // Arrange
      const start: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const end: MonthYear = {
        month: Month.Febuary,
        year: 2023,
      };
      const expected = [start];

      // Act
      const timespan = MonthYearUtils.timespan(start, end);

      // Assert
      expect(timespan).toEqual(expected);
    });
  });
});
