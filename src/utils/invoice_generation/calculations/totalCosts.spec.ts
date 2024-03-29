import { totalCostCalculationArgs } from '../../../test/data/invoiceGeneration/arguments';
import calculateTotalCosts from './totalCosts';
import { expectedTotalCosts } from '_/test/data/invoiceGeneration/expected';

describe('calculateTotalCosts', () => {
  test('should return right calculations', () => {
    // Act
    const totalCostCalculations = calculateTotalCosts(totalCostCalculationArgs);

    // Assert
    expect(totalCostCalculations).toEqual(expectedTotalCosts);
  });
});
