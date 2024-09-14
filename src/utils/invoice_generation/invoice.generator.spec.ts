import _ from 'lodash';
import { invoiceGenerationArgs } from '../../test/data/invoiceGeneration/arguments';
import generateInvoice from './invoice.generator';
import { expectedInvoice } from '_/test/data/invoiceGeneration/expected';

describe('generateInvoice', () => {
  test.skip('should return right invoice', () => {
    // Act
    const invoice = generateInvoice(invoiceGenerationArgs);
    _.unset(invoice, 'id');

    // Assert
    expect(invoice).toEqual(expectedInvoice);
  });
});
