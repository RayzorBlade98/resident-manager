import _ from 'lodash';
import { invoiceGenerationArgs } from '../../test/data/invoiceGenerationOld/arguments';
import generateInvoice from './invoice.generator';
import { expectedInvoice } from '_/test/data/invoiceGenerationOld/expected';

describe('generateInvoice', () => {
  test.skip('should return right invoice', () => {
    // Act
    const invoice = generateInvoice(invoiceGenerationArgs);
    _.unset(invoice, 'id');

    // Assert
    expect(invoice).toEqual(expectedInvoice);
  });
});
