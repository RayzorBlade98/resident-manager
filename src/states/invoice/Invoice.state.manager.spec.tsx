import { act, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import InvoiceStateManager from './Invoice.state.manager';
import MonthYear from '_/extensions/date/month_year.extension';
import invoiceState from '_/states/invoice/invoice.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import InvoiceBuilder from '_/test/builders/invoice.builder';

describe('InvoiceStateManager', () => {
  beforeEach(() => {
    InvoiceBuilder.setStart(new MonthYear(0, 2022));
    render(<ReactTestWrapper />);
  });

  describe('addInvoice', () => {
    test('should add new invoice to state', () => {
      // Arrange
      const newInvoice1 = new InvoiceBuilder().build();
      const newInvoice2 = new InvoiceBuilder().build();
      const expectedState = [
        ...getRecoil(invoiceState),
        newInvoice1,
        newInvoice2,
      ];

      // Act
      act(() => {
        InvoiceStateManager.addInvoice(newInvoice1);
        InvoiceStateManager.addInvoice(newInvoice2);
      });

      // Assert
      const newState = getRecoil(invoiceState);
      expect(newState).toEqual(expectedState);
    });
  });
});
