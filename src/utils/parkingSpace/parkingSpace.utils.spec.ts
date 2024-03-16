import { getCostForParkingSpace } from './parkingSpace.utils';
import MonthYear from '_/extensions/date/month_year.extension';
import ParkingSpaceBuilder from '_/test/builders/parkingSpace.builder';

describe('getCostForParkingSpace', () => {
  test('should return right costs for valid input', () => {
    // Arrange
    const expectedCost = 1;

    const parkingSpace = new ParkingSpaceBuilder()
      .addCosts({
        cost: 0,
        date: new MonthYear(6, 2024),
      })
      .addCosts({
        cost: 0,
        date: new MonthYear(4, 2024),
      })
      .addCosts({
        cost: expectedCost,
        date: new MonthYear(2, 2024),
      })
      .addCosts({
        cost: 0,
        date: new MonthYear(0, 2024),
      })
      .build();

    // Act
    const cost1 = getCostForParkingSpace(parkingSpace, new MonthYear(3, 2024));
    const cost2 = getCostForParkingSpace(parkingSpace, new MonthYear(2, 2024));

    // Assert
    expect(cost1).toBe(expectedCost);
    expect(cost2).toBe(expectedCost);
  });

  test('should throw error for invalid input', () => {
    // Arrange
    const parkingSpace = new ParkingSpaceBuilder()
      .addCosts({
        cost: 0,
        date: new MonthYear(1, 2024),
      })
      .build();

    // Act + Assert
    expect(() => getCostForParkingSpace(parkingSpace, new MonthYear(0, 2024))).toThrow();
  });
});
