import { Button } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import addRentPaymentState, {
  paymentValidator,
} from '../../states/add_rent_payment_state';
import { ResidentStateManager } from '_/states/saveStates/resident_state';
import { MonthYear } from '_/types/date';
import { Resident } from '_/types/resident';
import { CurrencyInCents } from '_/utils/currency';
import { residentViewSelectedResidentState } from '_/views/ResidentView/states/resident_view_state';

/**
 * Button that submits the input payment infos if they are valid
 */
function AddRentPaymentButton(): JSX.Element {
  // eslint-disable-next-line max-len
  const [rentPaymentState, setRentPaymentState] = useRecoilState(addRentPaymentState);
  const resetRentPaymentState = useResetRecoilState(addRentPaymentState);

  const selectedResident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;

  function onSave(): void {
    const errors = paymentValidator.validate(rentPaymentState.formInput);

    if (Object.keys(errors).length > 0) {
      setRentPaymentState((state) => ({ ...state, formErrors: errors }));
      return;
    }

    ResidentStateManager.updateRentInformation(
      selectedResident.id,
      rentPaymentState.selectedRentMonth as MonthYear,
      {
        paymentAmount: rentPaymentState.formInput
          .paymentAmount as CurrencyInCents,
        paymentDate: rentPaymentState.formInput.paymentDate,
      },
    );
    resetRentPaymentState();
  }

  return (
    <Button variant="contained" onClick={() => onSave()}>
      Hinzufügen
    </Button>
  );
}

export default AddRentPaymentButton;
