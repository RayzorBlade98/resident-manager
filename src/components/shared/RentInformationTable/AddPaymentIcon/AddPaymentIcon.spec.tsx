import { RenderResult, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import AddPaymentIcon from './AddPaymentIcon';
import addRentPaymentState from '_/components/shared/RentInformationTable/states/add_rent_payment_state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('AddPaymentIcon', () => {
  const rentInformation = new RentInformationBuilder().build();
  const resident = new ResidentBuilder()
    .addRentInformation(rentInformation)
    .build();
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <AddPaymentIcon resident={resident} rentInformation={rentInformation} />
      </ReactTestWrapper>,
    );
  });

  test('should modify state correctly when clicked', () => {
    // Act
    const icon = renderResult.container.querySelector('svg')!;
    fireEvent.click(icon);

    // Assert
    const state = getRecoil(addRentPaymentState);
    expect(state.showModal).toBe(true);
    expect(state.selectedRentMonth).toEqual(rentInformation.dueDate);
    expect(state.selectedResident).toEqual(resident);
  });
});
