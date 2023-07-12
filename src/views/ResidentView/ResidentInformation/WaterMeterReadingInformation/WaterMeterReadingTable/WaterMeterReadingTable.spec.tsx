import { RenderResult, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getRecoil, setRecoil } from 'recoil-nexus';
import WaterMeterReadingTable from './WaterMeterReadingTable';
import addWaterMeterReadingState from '_/components/shared/AddWaterMeterReadingModal/states/add_water_reading_state';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';
import residentViewState from '_/views/ResidentView/states/resident_view_state';

describe('WaterMeterReadingTable', () => {
  const resident = new ResidentBuilder()
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withWaterMeterCount(1000)
        .withReadingDate(new Date(2023, 6, 8))
        .build(),
    )
    .build();
  let renderResult: RenderResult;

  beforeAll(() => {
    renderResult = render(
      <ReactTestWrapper>
        <WaterMeterReadingTable />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(residentState, [resident]);
      setRecoil(residentViewState, (state) => ({
        ...state,
        selectedResident: resident.id,
      }));
    });
  });

  test('should open modal when clicking add water meter reading', () => {
    // Act
    const button = renderResult.container.querySelector('td')!;
    fireEvent.click(button);

    // Assert
    const state = getRecoil(addWaterMeterReadingState);
    expect(state.showModal).toBe(true);
    expect(state.residentId).toEqual(resident.id);
  });
});
