import { RenderResult, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import addRentPaymentState from '../../states/add_rent_payment_state';
import AddPaymentIcon from './AddPaymentIcon';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import RentInformationBuilder from '_/test/builders/rent_information.builder';

describe('AddPaymentIcon', () => {
  const rentInformation = new RentInformationBuilder().build();
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <AddPaymentIcon rentInformation={rentInformation} />
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
  });

  test('should match snapshot', () => {
    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
