import { invoiceGenerationArgs } from '../../../test/data/invoiceGeneration/arguments';
import { includedResidents } from '../../../test/data/invoiceGeneration/residents';
import { calculateResidentWaterCosts } from './residentWaterCosts';
import { expectedInvoice } from '_/test/data/invoiceGeneration/expected';

describe('calculateResidentWaterCosts', () => {
  it.each(
    includedResidents.map((r) => [
      r.id,
      r,
      expectedInvoice.residentInformation[r.id].waterCosts,
    ]),
  )(
    'should return correct rent payments for resident %s',
    (_residentId, resident, expectedWaterCosts) => {
      // Act
      const waterCosts = calculateResidentWaterCosts(
        resident,
        expectedInvoice.waterCosts,
        invoiceGenerationArgs,
      );

      // Assert
      expect(waterCosts).toEqual(expectedWaterCosts);
    },
  );
});
