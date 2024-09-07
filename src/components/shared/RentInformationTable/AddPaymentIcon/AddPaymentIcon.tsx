import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { Tooltip } from '@mui/material';
import React, { useState } from 'react';
import RentInformationUtils from '../../../../utils/rent/rent.utils';
import AddRentPaymentModal from '../AddRentPaymentModal/AddRentPaymentModal';
import { PaymentStatus, RentInformation } from '_/models/resident/rent';
import { Resident } from '_/models/resident/resident';

interface AddPaymentIconProps {
  /**
   * Resident for which the payment should be added
   */
  resident: Resident;

  /**
   * Rentinformation for which the payment should be added
   */
  rentInformation: RentInformation;
}

/**
 * Icon that opens the `AddRentPaymentModal` when clicked
 */
function AddPaymentIcon(props: AddPaymentIconProps): JSX.Element | null {
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  if (
    RentInformationUtils.getPaymentStatus(props.rentInformation)
    !== PaymentStatus.Unpaid
  ) {
    return null;
  }

  return (
    <>
      <AddRentPaymentModal
        show={showAddPaymentModal}
        onCloseModal={() => setShowAddPaymentModal(false)}
        resident={props.resident}
        rentInformation={props.rentInformation}
      />
      <Tooltip title="Zahlung hinzufügen" arrow>
        <PaymentsOutlinedIcon
          onClick={() => setShowAddPaymentModal(true)}
          sx={{ ':hover': { cursor: 'pointer' } }}
        />
      </Tooltip>
    </>
  );
}

export default AddPaymentIcon;
