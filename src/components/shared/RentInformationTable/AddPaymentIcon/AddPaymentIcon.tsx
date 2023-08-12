import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { Tooltip } from '@mui/material';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import addRentPaymentState from '_/components/shared/RentInformationTable/states/add_rent_payment_state';
import { RentInformation } from '_/models/resident/rent';

interface AddPaymentIconProps {
  /**
   * Rentinformation for which the payment should be added
   */
  rentInformation: RentInformation;
}

/**
 * Icon that opens the `AddRentPaymentModal` when clicked
 */
function AddPaymentIcon(props: AddPaymentIconProps): JSX.Element {
  const setRentPaymentState = useSetRecoilState(addRentPaymentState);

  const onClick = () => {
    setRentPaymentState((state) => ({
      ...state,
      selectedRentMonth: props.rentInformation.dueDate,
      showModal: true,
    }));
  };

  return (
    <Tooltip title="Zahlung hinzufügen" arrow>
      <PaymentsOutlinedIcon
        onClick={onClick}
        sx={{ ':hover': { cursor: 'pointer' } }}
      />
    </Tooltip>
  );
}

export default AddPaymentIcon;
