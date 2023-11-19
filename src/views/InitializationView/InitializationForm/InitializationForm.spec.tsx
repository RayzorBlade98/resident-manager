/* eslint-disable max-len */

import { RenderResult, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import { convertCurrencyEurosToCents } from '../../../utils/currency/currency.utils';
import {
  InitializationInput,
  initializationFormValidationSelector,
} from '../states/initialization_state';
import InitializationForm from './InitializationForm';
import { Salutation } from '_/models/name';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('InitializationForm', () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <InitializationForm />
      </ReactTestWrapper>,
    );
  });

  test('should add input to state', () => {
    // Arrange
    const companyLandlord = 'company';
    const firstNameLandlord = 'first name landlord';
    const lastNameLandlord = 'last name landlord';
    const zipCodeLandlord = 54321;
    const cityLandlord = 'city landlord';
    const streetLandlord = 'street landlord';
    const houseNumberLandlord = 2;
    const numberOfApartments = 8;
    const zipCodeProperty = 44444;
    const cityProperty = 'city property';
    const streetProperty = 'street property';
    const houseNumberProperty = 12;
    const waterUsageCost = 5;
    const sewageCost = 2.5;

    // Act
    const inputs = [
      companyLandlord,
      firstNameLandlord,
      lastNameLandlord,
      zipCodeLandlord.toString(),
      cityLandlord,
      streetLandlord,
      houseNumberLandlord.toString(),
      numberOfApartments.toString(),
      zipCodeProperty.toString(),
      cityProperty,
      streetProperty,
      houseNumberProperty.toString(),
      waterUsageCost.toString(),
      sewageCost.toString(),
    ];
    const inputFields = renderResult.container.querySelectorAll('input');
    inputs.forEach((input, i) => fireEvent.change(inputFields.item(i === 0 ? i : i + 1), { target: { value: input } }));

    // Assert
    const formInput = getRecoil(initializationFormValidationSelector).formInput;
    expect(formInput).toEqual({
      companyLandlord,
      salutationLandlord: Salutation.Male,
      firstNameLandlord,
      lastNameLandlord,
      zipCodeLandlord,
      cityLandlord,
      streetLandlord,
      houseNumberLandlord,
      numberOfApartments,
      zipCodeProperty,
      cityProperty,
      streetProperty,
      houseNumberProperty,
      waterUsageCost: convertCurrencyEurosToCents(waterUsageCost),
      sewageCost: convertCurrencyEurosToCents(sewageCost),
    } as InitializationInput);
  });
});
