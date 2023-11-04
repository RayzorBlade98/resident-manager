import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, resetRecoil, setRecoil } from 'recoil-nexus';
import initializationState, {
  initializationFormValidationSelector,
} from '../states/initialization_state';
import InitializationButton from './InitializationButton';
import MonthYear from '_/extensions/date/month_year.extension';
import propertyState from '_/states/property/property.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('InitializationButton', () => {
  const validInputValues = {
    numberOfApartments: 8,
    zipCode: 12345,
    city: 'city',
    street: 'street',
    houseNumber: 1,
    waterUsageCost: 500,
    sewageCost: 250,
  };

  const invalidInputValues = {
    numberOfApartments: undefined,
    zipCode: undefined,
    city: '',
    street: '',
    houseNumber: undefined,
    waterUsageCost: undefined,
    sewageCost: undefined,
  };

  let renderResult: RenderResult;

  function validInput(): void {
    act(() => {
      setRecoil(initializationState, (state) => ({
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
      setRecoil(initializationState, (state) => ({
        ...state,
        formValidation: {
          ...state.formValidation,
          formInput: {
            ...invalidInputValues,
          },
        },
      }));
    });
  }

  function pressButton(): void {
    const button = renderResult.getByRole('button');
    fireEvent.click(button);
  }

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 8, 15));

    renderResult = render(
      <ReactTestWrapper>
        <InitializationButton />
      </ReactTestWrapper>,
    );

    act(() => {
      resetRecoil(propertyState);
    });
  });

  test('should initialize property and water costs for valid inputs', () => {
    // Arrange
    validInput();

    // Act
    pressButton();

    // Assert
    expect(getRecoil(propertyState)).toEqual({
      numberOfApartments: validInputValues.numberOfApartments,
      address: {
        zipCode: validInputValues.zipCode,
        city: validInputValues.city,
        street: validInputValues.street,
        houseNumber: validInputValues.houseNumber,
      },
    });
    expect(getRecoil(waterCostsState)).toEqual({
      waterUsageCosts: [
        {
          costPerCubicMeter: validInputValues.waterUsageCost,
          date: new MonthYear(8, 2023),
        },
      ],
      sewageCosts: [
        {
          costPerCubicMeter: validInputValues.sewageCost,
          date: new MonthYear(8, 2023),
        },
      ],
    });
  });

  test('should not update states for invalid inputs', () => {
    // Arrange
    invalidInput();

    // Act
    pressButton();

    // Assert
    expect(getRecoil(propertyState)).toBeUndefined();
    expect(getRecoil(waterCostsState)).toEqual({
      waterUsageCosts: [],
      sewageCosts: [],
    });
  });

  test('should write error message to state for invalid inputs', () => {
    // Arrange
    invalidInput();

    // Act
    pressButton();

    // Assert
    const errorMessage = getRecoil(initializationFormValidationSelector)
      .formErrors.numberOfApartments;
    expect(errorMessage).toBeDefined();
  });
});
