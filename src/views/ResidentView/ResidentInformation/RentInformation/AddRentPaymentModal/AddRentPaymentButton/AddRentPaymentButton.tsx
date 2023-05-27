import React from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import addRentPaymentState, {
  RentPaymentInput,
} from '../../states/add_rent_payment_state';
import FormSubmitButton from '_/components/FormSubmitButton/FormSubmitButton';
import { ResidentStateManager } from '_/states/saveStates/resident_state';
import { MonthYear } from '_/types/date';
import { Resident } from '_/types/resident';
import { CurrencyInCents } from '_/utils/currency/currency';
import { ValidationErrorMessages } from '_/utils/validation';
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

  const onSuccess = (): void => {
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
  };

  const onError = (errors: ValidationErrorMessages<RentPaymentInput>): void => {
    setRentPaymentState((state) => ({ ...state, formErrors: errors }));
  };

  return (
    <FormSubmitButton<RentPaymentInput>
      buttonText="Hinzufügen"
      formInput={rentPaymentState.formInput}
      validator={rentPaymentState.formValidator}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}

export default AddRentPaymentButton;
