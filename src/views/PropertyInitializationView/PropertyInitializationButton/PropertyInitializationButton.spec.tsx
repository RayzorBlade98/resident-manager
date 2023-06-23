import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import propertyInitializationState, {
  propertyInitializationFormValidationSelector,
} from '../states/property_initialization_state';
import PropertyInitializationButton from './PropertyInitializationButton';
import { propertyState } from '_/states/property/property.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('PropertyInitializationButton', () => {
  const validInputValues = {
    numberOfApartments: 8,
  };

  let renderResult: RenderResult;

  function validInput(): void {
    act(() => {
      setRecoil(propertyInitializationState, (state) => ({
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
      setRecoil(propertyInitializationState, (state) => ({
        ...state,
        formValidation: {
          ...state.formValidation,
          formInput: {
            ...state.formValidation.formInput,
            numberOfApartments: undefined,
          },
        },
      }));
      setRecoil(propertyState, undefined);
    });
  }

  function pressButton(): void {
    const button = renderResult.getByRole('button');
    fireEvent.click(button);
  }

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <PropertyInitializationButton />
      </ReactTestWrapper>,
    );
  });

  test('should initialize property for valid inputs', () => {
    // Arrange
    validInput();

    // Act
    pressButton();

    // Assert
    expect(getRecoil(propertyState)).toEqual({
      numberOfApartments: validInputValues.numberOfApartments,
    });
  });

  test('should not update rent information for invalid inputs', () => {
    // Arrange
    invalidInput();

    // Act
    pressButton();

    // Assert
    expect(getRecoil(propertyState)).toBeUndefined();
  });

  test('should write error message to state for invalid inputs', () => {
    // Arrange
    invalidInput();

    // Act
    pressButton();

    // Assert
    const errorMessage = getRecoil(propertyInitializationFormValidationSelector)
      .formErrors.numberOfApartments;
    expect(errorMessage).toBeDefined();
  });
});
