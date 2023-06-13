import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, resetRecoil } from 'recoil-nexus';
import { DeductionType } from '../../../../models/incidentals/incidentals';
import { convertCurrencyEurosToCents } from '../../../../utils/currency/currency.utils';
import createIncidentalsState, {
  createIncidentalsFormValidationSelector,
} from '../../states/create_incidentals_state';
import CreateIncidentalsForm from './CreateIncidentalsForm';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateIncidentalsForm', () => {
  let renderResult: RenderResult;

  function inputToForm(
    name: string,
    currentPrice: number,
    deductionTypeIndex: number,
    invoiceInterval: number,
  ) {
    const inputFields = renderResult.container.querySelectorAll('input');
    fireEvent.change(inputFields.item(0), {
      target: { value: name },
    });

    fireEvent.change(inputFields.item(1), {
      target: { value: currentPrice.toString() },
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
        <CreateIncidentalsForm />
      </ReactTestWrapper>,
    );

    act(() => {
      resetRecoil(createIncidentalsState);
    });
  });

  test('should add input to state', () => {
    // Arrange
    const name = 'Testincidentals';
    const currentPrice = 100;
    const deductionTypeIndex = 1;
    const invoiceInterval = 6;

    // Act
    inputToForm(name, currentPrice, deductionTypeIndex, invoiceInterval);

    // Assert
    const formInput = getRecoil(
      createIncidentalsFormValidationSelector,
    ).formInput;
    expect(formInput).toEqual({
      name,
      currentPrice: convertCurrencyEurosToCents(currentPrice),
      deductionType: Object.values(DeductionType).at(deductionTypeIndex),
      invoiceInterval: 6,
    });
  });
});
