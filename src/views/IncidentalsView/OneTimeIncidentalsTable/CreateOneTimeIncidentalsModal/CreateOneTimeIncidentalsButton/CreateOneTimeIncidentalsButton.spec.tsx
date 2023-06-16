import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import * as RecoilModule from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import createOneTimeIncidentalsState, {
  createOneTimeIncidentalsFormValidationSelector,
} from '../../states/create_one_time_incidentals_state';
import CreateOneTimeIncidentalsButton from './CreateOneTimeIncidentalsButton';
import IncidentalsStateManager from '_/states/incidentals/incidentals.state.manager';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateOneTimeIncidentalsButton', () => {
  const validInputValues = {
    name: 'Testnebenkosten',
    cost: 100,
    billingDate: new Date(2023, 5, 16),
    paymentDate: new Date(2023, 5, 17),
  };

  let renderResult: RenderResult;
  let addIncidentalsSpy: jest.SpyInstance;
  let resetCreateIncidentalsStateSpy: jest.Mock;

  function validInput(): void {
    act(() => {
      setRecoil(createOneTimeIncidentalsState, (state) => ({
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
      setRecoil(createOneTimeIncidentalsState, (state) => ({
        ...state,
        formValidation: {
          ...state.formValidation,
          formInput: {
            ...state.formValidation.formInput,
            name: '',
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
    addIncidentalsSpy = jest
      .spyOn(IncidentalsStateManager, 'addOneTimeIncidentals')
      .mockReturnValue(undefined);

    resetCreateIncidentalsStateSpy = jest.fn();
    jest
      .spyOn(RecoilModule, 'useResetRecoilState')
      .mockReturnValue(resetCreateIncidentalsStateSpy);

    renderResult = render(
      <ReactTestWrapper>
        <CreateOneTimeIncidentalsButton />
      </ReactTestWrapper>,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should update incidentals for valid inputs', () => {
    // Arrange
    validInput();

    // Act
    pressButton();

    // Assert
    expect(addIncidentalsSpy).toHaveBeenCalledTimes(1);
    expect(addIncidentalsSpy).toHaveBeenCalledWith(
      expect.objectContaining(validInputValues),
    );
  });

  test('should reset create incidentals state for valid inputs', () => {
    // Arrange
    validInput();

    // Act
    pressButton();

    // Assert
    expect(resetCreateIncidentalsStateSpy).toHaveBeenCalledTimes(1);
  });

  test('should not update rent information for invalid inputs', () => {
    // Arrange
    invalidInput();

    // Act
    pressButton();

    // Assert
    expect(addIncidentalsSpy).toHaveBeenCalledTimes(0);
  });

  test('should write error message to state for invalid inputs', () => {
    // Arrange
    invalidInput();

    // Act
    pressButton();

    // Assert
    const errorMessage = getRecoil(
      createOneTimeIncidentalsFormValidationSelector,
    ).formErrors.name;
    expect(errorMessage).toBeDefined();
  });
});
