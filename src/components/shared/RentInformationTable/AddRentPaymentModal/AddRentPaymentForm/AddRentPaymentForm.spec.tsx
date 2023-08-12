import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, resetRecoil } from 'recoil-nexus';
import { convertCurrencyEurosToCents } from '../../../../../utils/currency/currency.utils';
import AddRentPaymentForm from './AddRentPaymentForm';
import addRentPaymentState, {
  addRentPaymentFormValidationSelector,
} from '_/components/shared/RentInformationTable/states/add_rent_payment_state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import '_/extensions/date/date.extension';

describe('AddRentPaymentForm', () => {
  let renderResult: RenderResult;

  function inputToForm(paymentAmount: number, paymentDate: string) {
    const inputFields = renderResult.container.querySelectorAll('input');
    fireEvent.change(inputFields.item(0), {
      target: { value: `${paymentAmount}` },
    });

    fireEvent.change(inputFields.item(1), {
      target: { value: paymentDate },
    });
  }

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <AddRentPaymentForm />
      </ReactTestWrapper>,
    );

    act(() => {
      resetRecoil(addRentPaymentState);
    });
  });

  test('should add input to state', () => {
    // Arrange
    const paymentAmount = 100;

    // Act
    inputToForm(paymentAmount, '25.12.1998');

    // Assert
    const formInput = getRecoil(addRentPaymentFormValidationSelector).formInput;
    expect(formInput).toEqual({
      paymentAmount: convertCurrencyEurosToCents(paymentAmount),
      paymentDate: new Date(1998, 11, 25).toUTC(),
    });
  });
});
