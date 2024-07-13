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
import ReactTestWrapper from '_/test/ReactTestWrapper';
import '_/extensions/date/date.extension';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('AddRentPaymentButton', () => {
  const selectedResident = new ResidentBuilder()
    .addRentInformation(
      new RentInformationBuilder().withDueDate(new MonthYear(4, 2023)).build(),
    )
    .addRentInformation(
      new RentInformationBuilder().withDueDate(new MonthYear(3, 2023)).build(),
    )
    .build();
  const selectedRentMonth = new MonthYear(4, 2023);
  const validInputValues = {
    paymentAmount: 100,
    paymentDate: new Date(2023, 4, 6).toUTC(),
  };

  let renderResult: RenderResult;
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
      setRecoil(addRentPaymentState, (state) => ({
        ...state,
        selectedResident,
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
    const newState = getRecoil(residentState);
    expect(newState).toEqual([
      {
        ...selectedResident,
        rentInformation: [
          { ...selectedResident.rentInformation[0], ...validInputValues },
          selectedResident.rentInformation[1],
        ],
      },
    ]);
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
    const newState = getRecoil(residentState);
    expect(newState).toEqual([selectedResident]);
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
