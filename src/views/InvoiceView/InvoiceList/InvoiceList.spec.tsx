/* eslint-disable max-len */

import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import { range } from 'lodash';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import InvoiceBuilder from '../../../../tests/__test_utils__/builders/invoice_builder';
import invoiceViewState, {
  invoiceViewSelectedInvoiceSelector,
} from '../states/invoice_view_state';
import InvoiceList from './InvoiceList';
import currentViewState, { View } from '_/states/current_view.state';
import invoiceState from '_/states/invoice/invoice.state';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';

describe('InvoiceList', () => {
  const invoices = range(0, 5).map((i) => new InvoiceBuilder().withId(`invoice${i}`).build());
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <RecoilTestWrapper>
        <InvoiceList />
      </RecoilTestWrapper>,
    );

    act(() => {
      setRecoil(invoiceState, invoices);
      setRecoil(invoiceViewState, (state) => ({
        ...state,
        selectedInvoice: invoices[0].id,
      }));
    });
  });

  test('should redirect when clicking new invoice button', () => {
    // Act
    const createButton = renderResult.getAllByRole('button').at(0)!;
    fireEvent.click(createButton);

    // Assert
    const newView = getRecoil(currentViewState);
    expect(newView).toEqual(View.InvoiceGeneration);
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

  test('should match snapshot', () => {
    // Act
    const invoiceButton = renderResult.getAllByRole('button').at(2)!;
    fireEvent.click(invoiceButton);

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
