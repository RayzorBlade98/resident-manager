import {
  RenderResult, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import { generateInvoiceFormValidationSelector } from '../states/invoice_generation_view_state';
import MonthSelection from './MonthSelection';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('MonthSelection', () => {
  let renderResult: RenderResult;

  function inputToForm(invoiceStart: string, invoiceEnd: string, newDeductionStart: string) {
    const inputFields = renderResult.container.querySelectorAll('input');
    fireEvent.change(inputFields.item(0), {
      target: { value: invoiceStart },
    });

    fireEvent.change(inputFields.item(1), {
      target: { value: invoiceEnd },
    });

    fireEvent.change(inputFields.item(2), {
      target: { value: newDeductionStart },
    });
  }

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 4, 29));
  });

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <MonthSelection />
      </ReactTestWrapper>,
    );
  });

  test('should add input to state', () => {
    // Arrange
    const invoiceStart = '06.2023';
    const invoiceEnd = '07.2023';
    const newDeductionStart = '08.2023';

    // Act
    inputToForm(invoiceStart, invoiceEnd, newDeductionStart);

    // Assert
    const formInput = getRecoil(
      generateInvoiceFormValidationSelector,
    ).formInput;
    expect(formInput).toEqual(
      expect.objectContaining({
        invoiceStart: new MonthYear(5, 2023),
        invoiceEnd: new MonthYear(6, 2023),
        newDeductionStart: new MonthYear(7, 2023),
      }),
    );
  });
});
