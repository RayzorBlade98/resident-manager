import { waterCostCalculationArgs } from '../../../test/data/invoiceGeneration/arguments';
import calculateWaterCosts from './water';
import { expectedWaterCosts } from '_/test/data/invoiceGeneration/expected';

describe('calculateWaterCosts', () => {
  test('should return right calculations', () => {
    // Act
    const waterCostCalculations = calculateWaterCosts(waterCostCalculationArgs);

    // Assert
    expect(waterCostCalculations).toEqual(expectedWaterCosts);
  });
});
