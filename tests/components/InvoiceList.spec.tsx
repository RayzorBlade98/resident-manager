/* eslint-disable max-len, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { RenderResult, render, fireEvent } from '@testing-library/react';
import { css } from 'glamor';
import React from 'react';
import InvoiceList from '_/components/InvoiceList/InvoiceList';
import { Month } from '_/types/date';
import { Invoice } from '_/types/invoice';
import { range } from '_/utils/array';
import InvoiceBuilder from '_tests/__test_utils__/builders/invoice_builder';

describe('ResidentList', () => {
  let renderResult: RenderResult;
  let invoices: Invoice[];
  let selectedInvoice: Invoice;
  let onSelectInvoiceMock: jest.Mock;

  beforeEach(() => {
    InvoiceBuilder.setStart({
      month: Month.January,
      year: 2023,
    });
    invoices = range(0, 4).map((_) => new InvoiceBuilder().build());
    selectedInvoice = invoices[0];
    onSelectInvoiceMock = jest.fn();

    renderResult = render(
      <InvoiceList
        invoices={invoices}
        selectedInvoice={selectedInvoice}
        onSelectInvoice={onSelectInvoiceMock}
        style={css({ backgroundColor: 'red' })}
      />,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should have the right amount of children', () => {
    // Assert
    const expectedChildren = 2 * invoices.length - 1;
    const actualChildren = renderResult.container.firstElementChild!.children.length;
    expect(actualChildren).toEqual(expectedChildren);
  });

  test('should call onSelectResident callback', () => {
    // Act
    const selectedIndex = 1;
    const listElement = renderResult.container.firstElementChild!.children.item(
      2 * selectedIndex,
    )!;
    fireEvent.click(listElement);

    // Assert
    expect(onSelectInvoiceMock).toHaveBeenCalledTimes(1);
    expect(onSelectInvoiceMock).toHaveBeenCalledWith(invoices[selectedIndex]);
  });

  test('should match snapshot', () => {
    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
