import './date.extension';

describe('Date extensions', () => {
  describe('toPreferredString', () => {
    test.each([
      [new Date(2023, 4, 29), '29.05.2023'],
      [new Date(2023, 11, 6), '06.12.2023'],
    ])('should return right string for date %s', (date, expectedString) => {
      // Act
      const dateString = date.toPreferredString();

      // Assert
      expect(dateString).toBe(expectedString);
    });
  });

  describe('toUTC', () => {
    test('should return right date', () => {
      // Act
      const utc = new Date(2023, 4, 29, 0, 59, 59).toUTC();

      // Assert
      expect(utc.toISOString()).toBe('2023-05-29T00:00:00.000Z');
    });
  });
});
