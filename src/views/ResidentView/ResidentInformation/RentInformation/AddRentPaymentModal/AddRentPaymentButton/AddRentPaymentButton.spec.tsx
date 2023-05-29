/* eslint-disable max-len */

import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import * as RecoilModule from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import addRentPaymentState, {
  addRentPaymentFormValidationSelector,
} from '../../states/add_rent_payment_state';
import AddRentPaymentButton from './AddRentPaymentButton';
import residentState, {
  ResidentStateManager,
} from '_/states/saveStates/resident_state';
import { Month, MonthYear } from '_/types/date';
import residentViewState from '_/views/ResidentView/states/resident_view_state';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import ResidentBuilder from '_tests/__test_utils__/builders/resident_builder';
import '_/extensions/date/date.extension';

describe('AddRentPaymentButton', () => {
  const selectedResident = new ResidentBuilder().build();
  const selectedRentMonth: MonthYear = {
    month: Month.May,
    year: 2023,
  };
  const validInputValues = {
    paymentAmount: 100,
    paymentDate: new Date(26, 4, 2023).toUTC(),
  };

  let renderResult: RenderResult;
  let updateRentInformationSpy: jest.SpyInstance;
  let resetRentPaymentStateSpy: jest.Mock;

  function validInput(): void {
    act(() => {
      setRecoil(addRentPaymentState, (state) => ({
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
      setRecoil(addRentPaymentState, (state) => ({
        ...state,
        formValidation: {
          ...state.formValidation,
          formInput: {
            ...state.formValidation.formInput,
            paymentAmount: undefined,
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
    updateRentInformationSpy = jest
      .spyOn(ResidentStateManager, 'updateRentInformation')
      .mockReturnValue(undefined);

    resetRentPaymentStateSpy = jest.fn();
    jest
      .spyOn(RecoilModule, 'useResetRecoilState')
      .mockReturnValue(resetRentPaymentStateSpy);

    renderResult = render(
      <RecoilTestWrapper>
        <AddRentPaymentButton />
      </RecoilTestWrapper>,
    );

    act(() => {
      setRecoil(residentState, [selectedResident]);
      setRecoil(residentViewState, (state) => ({
        ...state,
        selectedResident: selectedResident.id,
      }));
      setRecoil(addRentPaymentState, (state) => ({
        ...state,
        selectedRentMonth,
      }));
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
    expect(updateRentInformationSpy).toHaveBeenCalledTimes(1);
    expect(updateRentInformationSpy).toHaveBeenCalledWith(
      selectedResident.id,
      selectedRentMonth,
      validInputValues,
    );
  });

  test('should reset rent payment state for valid inputs', () => {
    // Arrange
    validInput();

    // Act
    pressButton();

    // Assert
    expect(resetRentPaymentStateSpy).toHaveBeenCalledTimes(1);
  });

  test('should not update rent information for invalid inputs', () => {
    // Arrange
    invalidInput();

    // Act
    pressButton();

    // Assert
    expect(updateRentInformationSpy).toHaveBeenCalledTimes(0);
  });

  test('should write error message to state for invalid inputs', () => {
    // Arrange
    invalidInput();

    // Act
    pressButton();

    // Assert
    const errorMessage = getRecoil(addRentPaymentFormValidationSelector)
      .formErrors.paymentAmount;
    expect(errorMessage).toBeDefined();
  });
});
