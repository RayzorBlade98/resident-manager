/* eslint-disable max-len */

import { RenderResult, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import { convertCurrencyEurosToCents } from '../../../utils/currency/currency.utils';
import { initializationFormValidationSelector } from '../states/initialization_state';
import InitializationForm from './InitializationForm';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('InitializationForm', () => {
  let renderResult: RenderResult;

  function inputToForm(
    numberOfApartments: number,
    waterUsageCost: number,
    sewageCost: number,
  ) {
    const inputs = [
      numberOfApartments.toString(),
      waterUsageCost.toString(),
      sewageCost.toString(),
    ];
    const inputFields = renderResult.container.querySelectorAll('input');
    inputs.forEach((input, i) => fireEvent.change(inputFields.item(i), { target: { value: input } }));
  }

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <InitializationForm />
      </ReactTestWrapper>,
    );
  });

  test('should add input to state', () => {
    // Arrange
    const numberOfApartments = 8;
    const waterUsageCost = 5;
    const sewageCost = 2.5;

    // Act
    inputToForm(numberOfApartments, waterUsageCost, sewageCost);

    // Assert
    const formInput = getRecoil(initializationFormValidationSelector).formInput;
    expect(formInput).toEqual({
      numberOfApartments,
      waterUsageCost: convertCurrencyEurosToCents(waterUsageCost),
      sewageCost: convertCurrencyEurosToCents(sewageCost),
    });
  });
});
