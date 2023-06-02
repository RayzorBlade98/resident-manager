import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import addRentPaymentState, {
  RentPaymentInput,
  addRentPaymentFormValidationSelector,
} from '../../states/add_rent_payment_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import { ResidentStateManager } from '_/states/saveStates/resident_state';
import { MonthYear } from '_/types/date';
import { Resident } from '_/types/resident';
import { residentViewSelectedResidentState } from '_/views/ResidentView/states/resident_view_state';
import '_/extensions/date/date.extension';

/**
 * Button that submits the input payment infos if they are valid
 */
function AddRentPaymentButton(): JSX.Element {
  const rentPaymentState = useRecoilValue(addRentPaymentState);
  const resetRentPaymentState = useResetRecoilState(addRentPaymentState);

  const selectedResident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;

  const onSuccess = (): void => {
    ResidentStateManager.updateRentInformation(
      selectedResident.id,
      rentPaymentState.selectedRentMonth as MonthYear,
      {
        paymentAmount: rentPaymentState.formValidation.formInput.paymentAmount,
        paymentDate:
          rentPaymentState.formValidation.formInput.paymentDate?.toUTC(),
      },
    );
    resetRentPaymentState();
  };

  return (
    <FormSubmitButton<RentPaymentInput>
      buttonText="Hinzufügen"
      formState={addRentPaymentFormValidationSelector}
      onSuccess={onSuccess}
    />
  );
}

export default AddRentPaymentButton;
