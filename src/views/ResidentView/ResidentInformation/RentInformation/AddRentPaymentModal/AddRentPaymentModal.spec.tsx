import { act, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
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

  test('should match snapshot', async () => {
    // Arrange
    render(
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
    expect(
      await generateImage({ viewport: { width: 650, height: 400 } }),
    ).toMatchImageSnapshot();
  });
});
