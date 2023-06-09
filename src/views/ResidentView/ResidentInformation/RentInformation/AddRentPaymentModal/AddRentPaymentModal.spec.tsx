import { act, render } from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import addRentPaymentState from '../states/add_rent_payment_state';
import AddRentPaymentModal from './AddRentPaymentModal';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('AddRentPaymentModal', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 4, 28));
  });

  test('should match snapshot', () => {
    // Arrange
    const renderResult = render(
      <ReactTestWrapper>
        <AddRentPaymentModal />
      </ReactTestWrapper>,
    );
    act(() => {
      setRecoil(addRentPaymentState, (state) => ({
        ...state,
        showModal: true,
      }));
    });

    // Assert
    expect(renderResult.baseElement).toMatchSnapshot();
  });
});
