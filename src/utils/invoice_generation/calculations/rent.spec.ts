import { rentPaymentCalculationArgs } from '../../../test/data/invoiceGenerationOld/arguments';
import calculateRentPayments from './rent';
import { expectedRentPayments } from '_/test/data/invoiceGenerationOld/expected';

describe('calculateRentPayments', () => {
  test('should return right calculations', () => {
    // Act
    const rentPaymentCalculations = calculateRentPayments(
      rentPaymentCalculationArgs,
    );

    // Assert
    expect(rentPaymentCalculations).toEqual(expectedRentPayments);
  });
});
