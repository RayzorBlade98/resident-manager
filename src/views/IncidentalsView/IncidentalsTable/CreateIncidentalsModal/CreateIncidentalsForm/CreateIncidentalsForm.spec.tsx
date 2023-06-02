import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, resetRecoil } from 'recoil-nexus';
import { DeductionType } from '../../../../../types/incidentals';
import createIncidentalsState, {
  createIncidentalsFormValidationSelector,
} from '../../states/create_incidentals_state';
import CreateIncidentalsForm from './CreateIncidentalsForm';
import { convertCurrencyEurosToCents } from '_/utils/currency/currency';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';

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
      <RecoilTestWrapper>
        <CreateIncidentalsForm />
      </RecoilTestWrapper>,
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

  test('should match snapshot (valid input)', () => {
    // Act
    inputToForm('Test', 100, 1, 6);

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });

  test('should match snapshot (invalid input)', () => {
    // Act
    inputToForm('', -1, 0, -1);

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
