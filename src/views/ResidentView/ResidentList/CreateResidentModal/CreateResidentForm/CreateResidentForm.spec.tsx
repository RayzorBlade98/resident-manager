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
  ) {
    const inputFields = renderResult.container.querySelectorAll('input');
    fireEvent.change(inputFields.item(0), {
      target: { value: firstName },
    });

    fireEvent.change(inputFields.item(1), {
      target: { value: lastName },
    });

    fireEvent.change(inputFields.item(2), {
      target: { value: rent.toString() },
    });

    fireEvent.change(inputFields.item(3), {
      target: { value: incidentals.toString() },
    });

    fireEvent.change(inputFields.item(4), {
      target: { value: contractStart },
    });
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

    // Act
    inputToForm(firstName, lastName, rent, incidentals, contractStart);

    // Assert
    const formInput = getRecoil(createResidentFormValidationSelector).formInput;
    expect(formInput).toEqual({
      firstName,
      lastName,
      rent: convertCurrencyEurosToCents(rent),
      incidentals: convertCurrencyEurosToCents(incidentals),
      contractStart: new MonthYear(5, 2023),
    });
  });
});
