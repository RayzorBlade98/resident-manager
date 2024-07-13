import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import * as RecoilModule from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import addWaterMeterReadingState, {
  addWaterMeterReadingFormValidationSelector,
} from '../states/add_water_reading_state';
import AddWaterMeterReadingButton from './AddWaterMeterReadingButton';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import '_/extensions/date/date.extension';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';

describe('AddRentPaymentButton', () => {
  const selectedResident = new ResidentBuilder()
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(new Date(2023, 6, 8).toUTC())
        .withWaterMeterCount(100)
        .withWasDeductedInInvoice(false)
        .build(),
    )
    .build();
  const validInputValues = {
    waterMeterCount: 123,
    readingDate: new Date(2023, 6, 10).toUTC(),
  };

  let renderResult: RenderResult;
  let resetWaterMeterReadingStateSpy: jest.Mock;

  function validInput(): void {
    act(() => {
      setRecoil(addWaterMeterReadingState, (state) => ({
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
      setRecoil(addWaterMeterReadingState, (state) => ({
        ...state,
        formValidation: {
          ...state.formValidation,
          formInput: {
            ...state.formValidation.formInput,
            waterMeterCount: undefined,
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
    resetWaterMeterReadingStateSpy = jest.fn();
    jest
      .spyOn(RecoilModule, 'useResetRecoilState')
      .mockReturnValue(resetWaterMeterReadingStateSpy);

    renderResult = render(
      <ReactTestWrapper>
        <AddWaterMeterReadingButton />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(residentState, [selectedResident]);
      setRecoil(addWaterMeterReadingState, (state) => ({
        ...state,
        residentId: selectedResident.id,
      }));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should update resident information for valid inputs', () => {
    // Arrange
    validInput();

    // Act
    pressButton();

    // Assert
    const newState = getRecoil(residentState);
    expect(newState).toEqual([
      {
        ...selectedResident,
        waterMeterReadings: [
          { ...validInputValues, wasDeductedInInvoice: false },
          ...selectedResident.waterMeterReadings,
        ],
      },
    ]);
  });

  test('should reset water meter reading state for valid inputs', () => {
    // Arrange
    validInput();

    // Act
    pressButton();

    // Assert
    expect(resetWaterMeterReadingStateSpy).toHaveBeenCalledTimes(1);
  });

  test('should not update resident information for invalid inputs', () => {
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
    const errorMessage = getRecoil(addWaterMeterReadingFormValidationSelector)
      .formErrors.waterMeterCount;
    expect(errorMessage).toBeDefined();
  });
});
