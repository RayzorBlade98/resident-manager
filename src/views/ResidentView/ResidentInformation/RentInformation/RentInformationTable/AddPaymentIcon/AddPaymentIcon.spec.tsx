import { RenderResult, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import addRentPaymentState from '../../states/add_rent_payment_state';
import AddPaymentIcon from './AddPaymentIcon';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import RentInformationBuilder from '_tests/__test_utils__/builders/rent_information_builder';

describe('AddPaymentIcon', () => {
  const rentInformation = new RentInformationBuilder().build();
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <RecoilTestWrapper>
        <AddPaymentIcon rentInformation={rentInformation} />
      </RecoilTestWrapper>,
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
  });

  test('should match snapshot', () => {
    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
