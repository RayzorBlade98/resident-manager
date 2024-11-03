import { invoiceGenerationArgs } from '../../../test/data/invoiceGeneration/arguments';
import { calculateResidentInformation } from './residentInformation';
import { expectedInvoice } from '_/test/data/invoiceGeneration/expected';

describe('calculateResidentInformation', () => {
  it('should return correct resident information', () => {
    // Arrange
    const invoice = {
      ...expectedInvoice,
      residentInformation: {},
      id: 'id',
    };

    // Act
    const residentInformation = calculateResidentInformation(
      invoice,
      invoiceGenerationArgs,
    );

    // Assert
    expect(residentInformation).toEqual(expectedInvoice.residentInformation);
  });
});
