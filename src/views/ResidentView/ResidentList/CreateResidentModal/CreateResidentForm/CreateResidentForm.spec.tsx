/* eslint-disable max-len */

import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import { convertCurrencyEurosToCents } from '../../../../../utils/currency/currency.utils';
import createResidentState, {
  createResidentFormValidationSelector,
} from '../../states/create_resident_state';
import CreateResidentForm from './CreateResidentForm';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateResidentForm', () => {
  let renderResult: RenderResult;

  function inputToForm(
    firstName: string,
    lastName: string,
    rent: number,
    incidentals: number,
    contractStart: string,
    waterMeter: number,
    numberOfResidents: number,
  ) {
    const inputs = [
      firstName,
      lastName,
      rent.toString(),
      incidentals.toString(),
      numberOfResidents,
      waterMeter,
      contractStart,
    ];
    const inputFields = renderResult.container.querySelectorAll('input');
    inputs.forEach((input, i) => fireEvent.change(inputFields.item(i), { target: { value: input } }));
  }

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 4, 29));
  });

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <CreateResidentForm />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(createResidentState, (state) => ({
        ...state,
        formValidation: {
          ...state.formValidation,
          formInput: {
            ...state.formValidation.formInput,
            contractStart: new MonthYear(),
          },
        },
      }));
    });
  });

  test('should add input to state', () => {
    // Arrange
    const firstName = 'Max';
    const lastName = 'Mustermann';
    const rent = 500;
    const incidentals = 100;
    const contractStart = '06.2023';
    const waterMeter = 1234;
    const numberOfResidents = 3;

    // Act
    inputToForm(
      firstName,
      lastName,
      rent,
      incidentals,
      contractStart,
      waterMeter,
      numberOfResidents,
    );

    // Assert
    const formInput = getRecoil(createResidentFormValidationSelector).formInput;
    expect(formInput).toEqual({
      firstName,
      lastName,
      rent: convertCurrencyEurosToCents(rent),
      incidentals: convertCurrencyEurosToCents(incidentals),
      contractStart: new MonthYear(5, 2023),
      waterMeter,
      numberOfResidents,
    });
  });
});
