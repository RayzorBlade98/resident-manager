import { invoiceGenerationArgs } from '../../test/data/invoiceGeneration/arguments';
import { expectedInvoice } from '../../test/data/invoiceGeneration/expected';
import { generateInvoice } from './generateInvoice';

describe('generateInvoice', () => {
  it('should return correct invoice', () => {
    // Act
    const invoice = generateInvoice(invoiceGenerationArgs);

    // Assert
    expect(invoice).toEqual({
      ...expectedInvoice,
      id: invoice.id,
    });
  });
});
