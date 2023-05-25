import { Button } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import addRentPaymentState, {
  RentPaymentInput,
  validatePayment,
} from '../../states/add_rent_payment_state';
import { ResidentStateManager } from '_/states/saveStates/resident_state';
import { MonthYear } from '_/types/date';
import { Resident } from '_/types/resident';
import { CurrencyInCents } from '_/utils/currency';
import { ValidationErrorMessages } from '_/utils/validation';
// eslint-disable-next-line max-len
import { residentViewSelectedResidentState } from '_/views/ResidentView/states/resident_view_state';

function AddRentPaymentButton(): JSX.Element {
  // eslint-disable-next-line max-len
  const [rentPaymentState, setRentPaymentState] = useRecoilState(addRentPaymentState);
  const resetRentPaymentState = useResetRecoilState(addRentPaymentState);

  const selectedResident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;

  function onSave(): void {
    const newErrors = validatePayment(
      rentPaymentState.formInput,
    ) as ValidationErrorMessages<RentPaymentInput>;

    const numberOfErrors = Object.keys(newErrors).filter(
      (k) => !!newErrors[k as keyof ValidationErrorMessages<RentPaymentInput>],
    ).length;
    if (numberOfErrors > 0) {
      setRentPaymentState((state) => ({ ...state, formErrors: newErrors }));
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
