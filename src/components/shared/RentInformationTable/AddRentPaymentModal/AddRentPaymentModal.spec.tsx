import { act, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import AddRentPaymentModal from './AddRentPaymentModal';
import addRentPaymentState from '_/components/shared/RentInformationTable/states/add_rent_payment_state';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('AddRentPaymentModal', () => {
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
        selectedResident: new ResidentBuilder().build(),
        selectedRentMonth: new MonthYear(),
        showModal: true,
        formValidation: {
          ...state.formValidation,
          formInput: {
            ...state.formValidation.formInput,
            paymentDate: new Date(2023, 5, 11),
          },
        },
      }));
    });

    // Assert
    await act(async () => {
      expect(
        await generateImage({ viewport: { width: 650, height: 400 } }),
      ).toMatchImageSnapshot();
    });
  });
});
