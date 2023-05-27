import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, resetRecoil } from 'recoil-nexus';
import addRentPaymentState from '../../states/add_rent_payment_state';
import AddRentPaymentForm from './AddRentPaymentForm';
import { convertCurrencyEurosToCents } from '_/utils/currency';
import { dateToUTC } from '_/utils/date';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';

describe('AddRentPaymentForm', () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <RecoilTestWrapper>
        <AddRentPaymentForm />
      </RecoilTestWrapper>,
    );

    act(() => {
      resetRecoil(addRentPaymentState);
    });
  });

  test('should add input to state', () => {
    // Arrange
    const paymentAmount = 100;

    // Act
    const inputFields = renderResult.container.querySelectorAll('input');

    fireEvent.change(inputFields.item(0), {
      target: { value: `${paymentAmount}` },
    });

    fireEvent.change(inputFields.item(1), {
      target: { value: '25.12.1998' },
    });

    // Assert
    const formInput = getRecoil(addRentPaymentState).formInput;
    expect(formInput).toEqual({
      paymentAmount: convertCurrencyEurosToCents(paymentAmount),
      paymentDate: dateToUTC(new Date(1998, 11, 25)),
    });
  });

  test.todo('Snapshot tests');
});
