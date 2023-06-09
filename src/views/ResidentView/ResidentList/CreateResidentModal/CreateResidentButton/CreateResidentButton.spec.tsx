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
import ResidentStateManager from '_/states/resident/resident.state.manager';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateResidentButton', () => {
  const validInputValues = {
    firstName: 'Max',
    lastName: 'Mustermann',
    rent: 500,
    incidentals: 100,
    contractStart: new MonthYear(3, 2023),
  };

  let renderResult: RenderResult;
  let addResidentSpy: jest.SpyInstance;
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
    addResidentSpy = jest
      .spyOn(ResidentStateManager, 'addResident')
      .mockReturnValue(undefined);

    resetCreateResidentStateSpy = jest.fn();
    jest
      .spyOn(RecoilModule, 'useResetRecoilState')
      .mockReturnValue(resetCreateResidentStateSpy);

    renderResult = render(
      <ReactTestWrapper>
        <CreateResidentButton />
      </ReactTestWrapper>,
    );
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
    expect(addResidentSpy).toHaveBeenCalledTimes(1);
    expect(addResidentSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: validInputValues.firstName,
        lastName: validInputValues.lastName,
        rent: [
          {
            dueDate: validInputValues.contractStart,
            rent: validInputValues.rent,
            incidentals: validInputValues.incidentals,
          },
          {
            dueDate: new MonthYear(),
            rent: validInputValues.rent,
            incidentals: validInputValues.incidentals,
          },
        ],
        invoiceStart: validInputValues.contractStart,
      }),
    );
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
    expect(addResidentSpy).toHaveBeenCalledTimes(0);
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
