import { incidentalsCalculationArgs } from '../../../test/data/invoiceGeneration/arguments';
import calculateIncidentalsCosts from './incidentals';
import { expectedIncidentalsCosts } from '_/test/data/invoiceGeneration/expected';

describe('calculateIncidentalsCosts', () => {
  test.skip('should return right calculations', () => {
    // Act
    const incidentalsCalculations = calculateIncidentalsCosts(
      incidentalsCalculationArgs,
    );

    // Assert
    expect(incidentalsCalculations).toEqual(expectedIncidentalsCosts);
  });
});
