import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import * as RecoilModule from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import createResidentState, {
  createResidentFormValidationSelector,
} from '../../states/create_resident_state';
import CreateResidentButton from './CreateResidentButton';
import MonthYear from '_/extensions/date/month_year.extension';
import { Salutation } from '_/models/name';
import { Resident } from '_/models/resident/resident';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('CreateResidentButton', () => {
  const oldState = [new ResidentBuilder().build()];

  const validInputValues = {
    salutation: Salutation.Male,
    firstName: 'Max',
    lastName: 'Mustermann',
    rent: 500,
    incidentals: 100,
    contractStart: new MonthYear(3, 2023),
    waterMeter: 1234,
    numberOfResidents: 2,
  };

  let renderResult: RenderResult;
  let resetCreateResidentStateSpy: jest.Mock;

  function validInput(): void {
    act(() => {
      setRecoil(createResidentState, (state) => ({
        ...state,
        formValidation: {
          ...state.formValidation,
          formInput: { ...validInputValues },
        },
      }));
    });
  }

  function invalidInput(): void {
    act(() => {
      setRecoil(createResidentState, (state) => ({
        ...state,
        formValidation: {
          ...state.formValidation,
          formInput: {
            ...state.formValidation.formInput,
            firstName: '',
          },
        },
      }));
    });
  }

  function pressButton(): void {
    const button = renderResult.getByRole('button');
    fireEvent.click(button);
  }

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 4, 29));
  });

  beforeEach(() => {
    resetCreateResidentStateSpy = jest.fn();
    jest
      .spyOn(RecoilModule, 'useResetRecoilState')
      .mockReturnValue(resetCreateResidentStateSpy);

    renderResult = render(
      <ReactTestWrapper>
        <CreateResidentButton />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(residentState, oldState);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should update rent information for valid inputs', () => {
    // Arrange
    validInput();

    // Act
    pressButton();

    // Assert
    const newState = getRecoil(residentState);
    expect(newState[0]).toEqual(oldState[0]);
    expect(newState[1]).toEqual({
      id: newState[1].id,
      name: {
        salutation: validInputValues.salutation,
        firstName: validInputValues.firstName,
        lastName: validInputValues.lastName,
      },
      rentInformation: [
        {
          dueDate: new MonthYear(),
          rent: validInputValues.rent,
          incidentals: validInputValues.incidentals,
          wasDeductedInInvoice: false,
        },
        {
          dueDate: validInputValues.contractStart,
          rent: validInputValues.rent,
          incidentals: validInputValues.incidentals,
          wasDeductedInInvoice: false,
        },
      ],
      contractStart: validInputValues.contractStart,
      waterMeterReadings: [
        {
          readingDate: validInputValues.contractStart,
          waterMeterCount: validInputValues.waterMeter,
          wasDeductedInInvoice: true,
        },
      ],
      numberOfResidents: validInputValues.numberOfResidents,
    } as Resident);
  });

  test('should reset rent payment state for valid inputs', () => {
    // Arrange
    validInput();

    // Act
    pressButton();

    // Assert
    expect(resetCreateResidentStateSpy).toHaveBeenCalledTimes(1);
  });

  test('should not update rent information for invalid inputs', () => {
    // Arrange
    invalidInput();

    // Act
    pressButton();

    // Assert
    const newState = getRecoil(residentState);
    expect(newState).toEqual(oldState);
  });

  test('should write error message to state for invalid inputs', () => {
    // Arrange
    invalidInput();

    // Act
    pressButton();

    // Assert
    const errorMessage = getRecoil(createResidentFormValidationSelector)
      .formErrors.firstName;
    expect(errorMessage).toBeDefined();
  });
});
