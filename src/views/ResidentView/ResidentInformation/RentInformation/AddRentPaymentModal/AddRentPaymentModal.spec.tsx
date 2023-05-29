import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import addRentPaymentState from '../states/add_rent_payment_state';
import AddRentPaymentModal from './AddRentPaymentModal';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';

describe('AddRentPaymentModal', () => {
  test('should match snapshot', () => {
    // Arrange
    const renderResult = render(
      <RecoilTestWrapper>
        <AddRentPaymentModal />
      </RecoilTestWrapper>,
    );
    act(() => {
      setRecoil(addRentPaymentState, (state) => ({
        ...state,
        showModal: true,
      }));
    });

    // Act
    const inputFields = renderResult.container.querySelectorAll('input');
    fireEvent.change(inputFields.item(1), {
      target: { value: '28.05.2023' },
    });

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
