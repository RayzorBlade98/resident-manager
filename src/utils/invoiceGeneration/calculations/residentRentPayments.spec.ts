import { invoiceGenerationArgs } from '../../../test/data/invoiceGeneration/arguments';
import { expectedInvoice } from '../../../test/data/invoiceGeneration/expected';
import { includedResidents } from '../../../test/data/invoiceGeneration/residents';
import { calculateResidentRentPayments } from './residentRentPayments';

describe('calculateResidentRentPayments', () => {
  it.each(
    includedResidents.map((r) => [
      r.id,
      r,
      expectedInvoice.residentInformation[r.id].rentPayments,
    ]),
  )(
    'should return correct rent payments for resident %s',
    (_residentId, resident, expectedRentPayments) => {
      // Act
      const rentPayments = calculateResidentRentPayments(
        resident,
        invoiceGenerationArgs,
      );

      // Assert
      expect(rentPayments).toEqual(expectedRentPayments);
    },
  );
});
