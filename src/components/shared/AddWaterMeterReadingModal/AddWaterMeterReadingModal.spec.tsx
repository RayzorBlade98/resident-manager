import { act, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import AddWaterMeterReadingModal from './AddWaterMeterReadingModal';
import addWaterMeterReadingState from './states/add_water_reading_state';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('AddRentPaymentModal', () => {
  test('should match snapshot', async () => {
    // Arrange
    render(
      <ReactTestWrapper>
        <AddWaterMeterReadingModal />
      </ReactTestWrapper>,
    );
    act(() => {
      setRecoil(addWaterMeterReadingState, (state) => ({
        ...state,
        showModal: true,
        formValidation: {
          ...state.formValidation,
          formInput: {
            ...state.formValidation.formInput,
            readingDate: new Date(2023, 6, 8),
          },
        },
      }));
    });

    // Assert
    expect(
      await generateImage({ viewport: { width: 650, height: 400 } }),
    ).toMatchImageSnapshot();
  });
});
