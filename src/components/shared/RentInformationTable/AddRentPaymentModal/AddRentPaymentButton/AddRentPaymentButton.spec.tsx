/* eslint-disable max-len */

import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import * as RecoilModule from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import AddRentPaymentButton from './AddRentPaymentButton';
import addRentPaymentState, {
  addRentPaymentFormValidationSelector,
} from '_/components/shared/RentInformationTable/states/add_rent_payment_state';
import MonthYear from '_/extensions/date/month_year.extension';
import residentState from '_/states/resident/resident.state';
import ResidentStateManager from '_/states/resident/resident.state.manager';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import '_/extensions/date/date.extension';
import ResidentBuilder from '_/test/builders/resident.builder';
import residentViewState from '_/views/ResidentView/states/resident_view_state';

describe('AddRentPaymentButton', () => {
  const selectedResident = new ResidentBuilder().build();
  const selectedRentMonth = new MonthYear(4, 2023);
  const validInputValues = {
    paymentAmount: 100,
    paymentDate: new Date(2023, 4, 6).toUTC(),
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
      <ReactTestWrapper>
        <AddRentPaymentButton />
      </ReactTestWrapper>,
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
