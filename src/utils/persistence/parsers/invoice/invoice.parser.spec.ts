/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, guard-for-in */

import InvoiceParser from './invoice.parser';
import InvoiceBuilder from '_/test/builders/invoice.builder';

describe('InvoiceParser', () => {
  describe('reviver', () => {
    test('should revive invoice correctly', () => {
      // Arrange
      const invoice = new InvoiceBuilder().build();
      const fromJson = JSON.parse(JSON.stringify(invoice));

      // Act
      const revived: any = {};
      for (const k in fromJson) {
        revived[k] = InvoiceParser.reviver(k, fromJson[k]);
      }

      // Assert
      expect(revived).toEqual(invoice);
    });
  });
});
