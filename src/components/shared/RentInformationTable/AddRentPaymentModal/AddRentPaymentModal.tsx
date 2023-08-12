import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import AddRentPaymentButton from './AddRentPaymentButton/AddRentPaymentButton';
import AddRentPaymentForm from './AddRentPaymentForm/AddRentPaymentForm';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import addRentPaymentState from '_/components/shared/RentInformationTable/states/add_rent_payment_state';

/**
 * Modal that provides functionality to insert payment information
 */
function AddRentPaymentModal(): JSX.Element {
  const rentPaymentState = useRecoilValue(addRentPaymentState);
  const resetRentPaymentState = useResetRecoilState(addRentPaymentState);

  return (
    <GenericModal
      title="Neue Zahlung"
      show={rentPaymentState.showModal}
      onClose={resetRentPaymentState}
    >
      {/* Body */}
      <AddRentPaymentForm />
      {/* Footer */}
      <AddRentPaymentButton />
    </GenericModal>
  );
}

export default AddRentPaymentModal;
