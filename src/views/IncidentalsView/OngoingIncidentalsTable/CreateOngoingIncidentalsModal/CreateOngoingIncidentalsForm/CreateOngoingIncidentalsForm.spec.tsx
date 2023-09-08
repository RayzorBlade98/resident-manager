import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, resetRecoil } from 'recoil-nexus';
import { convertCurrencyEurosToCents } from '../../../../../utils/currency/currency.utils';
import createOngoingIncidentalsState, {
  createOngoingIncidentalsFormValidationSelector,
} from '../../states/create_ongoing_incidentals_state';
import CreateOngoingIncidentalsForm from './CreateOngoingIncidentalsForm';
import { DeductionType } from '_/models/incidentals/deduction_type';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateOngoingIncidentalsForm', () => {
  let renderResult: RenderResult;

  function inputToForm(
    name: string,
    currentCost: number,
    deductionTypeIndex: number,
    invoiceInterval: number,
  ) {
    const inputFields = renderResult.container.querySelectorAll('input');
    fireEvent.change(inputFields.item(0), {
      target: { value: name },
    });

    fireEvent.change(inputFields.item(1), {
      target: { value: currentCost.toString() },
    });

    const selectField = renderResult.getByRole('button');
    fireEvent.mouseDown(selectField);
    const options = renderResult.getAllByRole('option');
    fireEvent.click(options.at(deductionTypeIndex)!);

    fireEvent.change(inputFields.item(3), {
      target: { value: invoiceInterval.toString() },
    });
  }

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <CreateOngoingIncidentalsForm />
      </ReactTestWrapper>,
    );

    act(() => {
      resetRecoil(createOngoingIncidentalsState);
    });
  });

  test('should add input to state', () => {
    // Arrange
    const name = 'Testincidentals';
    const currentCost = 100;
    const deductionTypeIndex = 1;
    const invoiceInterval = 6;

    // Act
    inputToForm(name, currentCost, deductionTypeIndex, invoiceInterval);

    // Assert
    const formInput = getRecoil(
      createOngoingIncidentalsFormValidationSelector,
    ).formInput;
    expect(formInput).toEqual({
      name,
      currentCost: convertCurrencyEurosToCents(currentCost),
      deductionType: Object.values(DeductionType).at(deductionTypeIndex),
      invoiceInterval: 6,
    });
  });
});
