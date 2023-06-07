import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import createResidentState, {
  createResidentFormValidationSelector,
} from '../../states/create_resident_state';
import CreateResidentForm from './CreateResidentForm';
import MonthYear from '_/extensions/date/month_year.extension';
import { convertCurrencyEurosToCents } from '_/utils/currency/currency';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';

describe('CreateResidentForm', () => {
  let renderResult: RenderResult;

  function inputToForm(
    firstName: string,
    lastName: string,
    rent: number,
    incidentals: number,
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
  }

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 4, 29));
  });

  beforeEach(() => {
    renderResult = render(
      <RecoilTestWrapper>
        <CreateResidentForm />
      </RecoilTestWrapper>,
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

    // Act
    inputToForm(firstName, lastName, rent, incidentals);

    // Assert
    const formInput = getRecoil(createResidentFormValidationSelector).formInput;
    expect(formInput).toEqual({
      firstName,
      lastName,
      rent: convertCurrencyEurosToCents(rent),
      incidentals: convertCurrencyEurosToCents(incidentals),
      contractStart: new MonthYear(),
    });
  });

  test('should match snapshot (valid input)', () => {
    // Act
    inputToForm('Max', 'Mustermann', 500, 100);

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });

  test('should match snapshot (invalid input)', () => {
    // Act
    inputToForm('', '', -1, -1);

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
