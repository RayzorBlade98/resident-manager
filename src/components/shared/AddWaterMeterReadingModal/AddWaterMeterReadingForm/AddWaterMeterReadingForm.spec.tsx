import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, resetRecoil } from 'recoil-nexus';
import addWaterMeterReadingState, {
  addWaterMeterReadingFormValidationSelector,
} from '../states/add_water_reading_state';
import AddWaterMeterReadingForm from './AddWaterMeterReadingForm';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import '_/extensions/date/date.extension';

describe('AddRentPaymentForm', () => {
  let renderResult: RenderResult;

  function inputToForm(waterMeterCount: number, readingDate: string) {
    const inputFields = renderResult.container.querySelectorAll('input');
    fireEvent.change(inputFields.item(0), {
      target: { value: `${waterMeterCount}` },
    });

    fireEvent.change(inputFields.item(1), {
      target: { value: readingDate },
    });
  }

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <AddWaterMeterReadingForm />
      </ReactTestWrapper>,
    );

    act(() => {
      resetRecoil(addWaterMeterReadingState);
    });
  });

  test('should add input to state', () => {
    // Arrange
    const waterMeterCount = 100;

    // Act
    inputToForm(waterMeterCount, '25.12.1998');

    // Assert
    const formInput = getRecoil(
      addWaterMeterReadingFormValidationSelector,
    ).formInput;
    expect(formInput).toEqual({
      waterMeterCount,
      readingDate: new Date(1998, 11, 25).toUTC(),
    });
  });
});
