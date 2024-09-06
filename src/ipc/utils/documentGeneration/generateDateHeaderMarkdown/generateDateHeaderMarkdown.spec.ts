import { generateDateHeaderMarkdown } from './generateDateHeaderMarkdown';

jest.mock('../../../../assets/templates/dateHeader/dateHeaderTemplate.md');

describe('generateDateHeaderMarkdown', () => {
  test('should return the correct markdown', () => {
    // Arrange
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 7, 20));

    // Act
    const header = generateDateHeaderMarkdown();

    // Assert
    expect(header).toBe('Date = 20.08.2024');
  });
});
