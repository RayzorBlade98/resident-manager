import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import AddWaterMeterReadingIcon from './AddWaterMeterReadingIcon';
import addWaterMeterReadingState from '_/components/shared/AddWaterMeterReadingModal/states/add_water_reading_state';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('AddWaterMeterReadingIcon', () => {
  test('should open modal when clicking', () => {
    // Arrange
    const residentId = 'resident-id';
    const renderResult = render(
      <ReactTestWrapper>
        <AddWaterMeterReadingIcon residentId={residentId} />
      </ReactTestWrapper>,
    );
    const oldState = getRecoil(addWaterMeterReadingState);

    // Act
    const icon = renderResult.container.querySelector('svg')!;
    fireEvent.click(icon);

    // Assert
    const newState = getRecoil(addWaterMeterReadingState);
    expect(newState).toEqual({ ...oldState, residentId, showModal: true });
  });
});
