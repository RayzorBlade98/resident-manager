import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, resetRecoil } from 'recoil-nexus';
import { convertCurrencyEurosToCents } from '../../../../../utils/currency/currency.utils';
import createOneTimeIncidentalsState, {
  createOneTimeIncidentalsFormValidationSelector,
} from '../../states/create_one_time_incidentals_state';
import CreateOneTimeIncidentalsForm from './CreateOneTimeIncidentalsForm';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import '_/extensions/date/date.extension';

describe('CreateOngoingIncidentalsForm', () => {
  let renderResult: RenderResult;

  function inputToForm(
    name: string,
    cost: number,
    billingDate: string,
    paymentDate: string,
  ) {
    const inputFields = renderResult.container.querySelectorAll('input');
    fireEvent.change(inputFields.item(0), {
      target: { value: name },
    });

    fireEvent.change(inputFields.item(1), {
      target: { value: cost.toString() },
    });

    fireEvent.change(inputFields.item(2), {
      target: { value: billingDate },
    });

    fireEvent.change(inputFields.item(3), {
      target: { value: paymentDate },
    });
  }

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <CreateOneTimeIncidentalsForm />
      </ReactTestWrapper>,
    );

    act(() => {
      resetRecoil(createOneTimeIncidentalsState);
    });
  });

  test('should add input to state', () => {
    // Arrange
    const name = 'Testincidentals';
    const currentCost = 100;
    const billingDate = '16.06.2023';
    const paymentDate = '17.06.2023';

    // Act
    inputToForm(name, currentCost, billingDate, paymentDate);

    // Assert
    const formInput = getRecoil(
      createOneTimeIncidentalsFormValidationSelector,
    ).formInput;
    expect(formInput).toEqual({
      name,
      cost: convertCurrencyEurosToCents(currentCost),
      billingDate: new Date(2023, 5, 16).toUTC(),
      paymentDate: new Date(2023, 5, 17).toUTC(),
    });
  });
});
