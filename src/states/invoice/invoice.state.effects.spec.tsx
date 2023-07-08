import { act, render } from '@testing-library/react';
import { range } from 'lodash';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import invoiceState from './invoice.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import InvoiceBuilder from '_/test/builders/invoice.builder';

beforeEach(() => {
  render(<ReactTestWrapper />);
});

describe('sortInvoicesEffect', () => {
  test('should sort invoices on set recoil', () => {
    // Arrange
    const invoices = range(0, 5).map((_) => new InvoiceBuilder().build());
    const expected = [...invoices].reverse();

    // Act
    act(() => {
      setRecoil(invoiceState, invoices);
    });

    // Assert
    expect(getRecoil(invoiceState)).toEqual(expected);
  });
});
