import { cloneDeep } from './cloneDeep';
import MonthYear from '_/extensions/date/month_year.extension';

describe('cloneDeep', () => {
  it('should return correct deep copy', () => {
    // Arrange
    const factory = () => ({
      string: 'abc',
      number: 12345,
      date: new Date(2024, 6, 10),
      monthYear: new MonthYear(5, 2024),
      array: [1, 2, 'a', { a: 1, b: 'c' }],
      deep: {
        string: 'cdef',
        number: 56789,
        date: new Date(2024, 6, 15),
        monthYear: new MonthYear(5, 2025),
        array: [8, 9, 'z', { g: 6, h: '9' }],
      },
    });

    const original = factory();
    const expected = factory();

    // Act
    const cloned = cloneDeep(original);

    // Assert
    expect(cloned).toEqual(expected);
  });
});
