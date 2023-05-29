import './date.extension';

describe('Date extensions', () => {
  describe('toPreferredString', () => {
    test('should return right string', () => {
      // Act
      const dateString = new Date(2023, 4, 29).toPreferredString();

      // Assert
      expect(dateString).toBe('29.05.2023');
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
