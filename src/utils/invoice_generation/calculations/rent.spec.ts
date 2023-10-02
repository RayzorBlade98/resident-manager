import { rentPaymentCalculationArgs } from '../../../test/data/invoiceGeneration/arguments';
import calculateRentPayments from './rent';
import { expectedRentPayments } from '_/test/data/invoiceGeneration/expected';

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
