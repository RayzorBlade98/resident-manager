import { invoiceGenerationArgs } from '../../../test/data/invoiceGeneration/arguments';
import { expectedInvoice } from '../../../test/data/invoiceGeneration/expected';
import { calculateWaterCosts } from './waterCosts';

describe('calculateWaterCosts', () => {
  it('should return correct water costs', () => {
    // Act
    const waterCosts = calculateWaterCosts(invoiceGenerationArgs);

    // Assert
    expect(waterCosts).toEqual(expectedInvoice.waterCosts);
  });
});
