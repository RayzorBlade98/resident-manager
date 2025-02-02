import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import { range } from 'lodash';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import invoiceViewState, {
  invoiceViewSelectedInvoiceSelector,
} from '../states/invoice_view_state';
import InvoiceList from './InvoiceList';
import invoiceState from '_/states/invoice/invoice.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import InvoiceBuilder from '_/test/builders/invoice.builder';

describe('InvoiceList', () => {
  const invoices = range(0, 5).map((i) => new InvoiceBuilder().withId(`invoice${i}`).build());
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <InvoiceList />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(invoiceState, invoices);
      setRecoil(invoiceViewState, (state) => ({
        ...state,
        selectedInvoice: invoices[0].id,
      }));
    });
  });

  test('should select invoice when clicking', () => {
    // Arrange
    const newSelectedInvoiceIndex = 2;

    // Act
    const invoiceButton = renderResult
      .getAllByRole('button')
      .at(newSelectedInvoiceIndex + 1)!;
    fireEvent.click(invoiceButton);

    // Assert
    const newSelectedInvoice = getRecoil(invoiceViewSelectedInvoiceSelector);
    expect(newSelectedInvoice).toEqual(invoices[newSelectedInvoiceIndex]);
  });
});
