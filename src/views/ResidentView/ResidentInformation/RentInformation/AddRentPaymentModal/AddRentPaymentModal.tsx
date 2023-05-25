import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
// eslint-disable-next-line max-len
import GenericModal from '../../../../../components/GenericComponents/GenericModal/GenericModal';
import addRentPaymentState from '../states/add_rent_payment_state';
import AddRentPaymentButton from './AddRentPaymentButton/AddRentPaymentButton';
import AddRentPaymentForm from './AddRentPaymentForm/AddRentPaymentForm';

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
      size="sm"
    >
      {/* Body */}
      <AddRentPaymentForm />
      {/* Footer */}
      <AddRentPaymentButton />
    </GenericModal>
  );
}

export default AddRentPaymentModal;
